import fs = require("fs");
import ChromeImpl = require("chrome-remote-interface");
import { spawn, spawnSync } from "child_process";

import { delay, toPromise } from "../utils/promise";
import { Binding, Breakpoint, Debugger, DebuggerTab, PauseState, Script } from "./interface";
import { assert, id } from "../utils/utils";

import "../utils/flat-map";
import { takeFirstBinding } from "../utils/bindings";

export const ChromeDebugger: Debugger = {
    browser: "chrome",

    start(): void {
        spawn("/home/daniel/.nvm/versions/node/v7.4.0/bin/node", ["/usr/share/yarn/bin/yarn.js", "chrome"]);
    },

    close(): void {
        spawnSync("pkill", ["-f", "chromium-browser"]);
    },

    async open(url: string): Promise<ChromeTab> {
        // open a new empty tab, connect to it and enable debugging + page event notifications
        const tabHandle = await ChromeImpl.New();
        const tab = await ChromeImpl({ tab: tabHandle });

        // NOTE wait to make sure about:blank has finished loading, otherwise we sometimes
        // got stuck somewhere around the pause/navigate/paused block below -.-
        await delay(100);

        let scripts = [] as any[];
        tab.Debugger.scriptParsed(script => scripts.push(script));

        // NOTE on Debugger.enable scriptParsed events are sent for all loaded scripts, but because
        // we opened about:blank (which doesn't have any scripts) it will never fire before the
        // Page.navigate call below
        await tab.Debugger.enable();
        await tab.Page.enable();

        // pause right after navigate so that Chrome slides breakpoints (if not in paused it will not)
        await tab.Debugger.pause();
        // navigate to trigger scriptParsed events
        await tab.Page.navigate({ url });
        await toPromise(tab.Debugger.paused);

        let chromeScripts = [] as Script[];
        for (let script of scripts) {
            chromeScripts.push(Object.assign(script, {
                id: script.scriptId,
                source: (await tab.Debugger.getScriptSource({ scriptId: script.scriptId })).scriptSource
            }));
        }

        // state now: all scripts parsed, paused at beginning of script

        return new ChromeTab(tab, tabHandle, chromeScripts);
    },

    async openScript(scriptSource: string): Promise<ChromeTab> {
        fs.writeFileSync("/home/daniel/Documents/masterthesis/test/js-in-browser-template/script.js", scriptSource);
        return await this.open("file:///home/daniel/Documents/masterthesis/test/js-in-browser-template/index.html");
    }

};

export class ChromeTab extends DebuggerTab {
    private breakpointIdMap = new Map<string, number>();

    constructor(private readonly tab: any,
                private readonly tabHandle: any,
                readonly scripts: Script[]) {
        super();
        assert(scripts.length > 0, "tab has no scripts");
        tab.Debugger.paused(pauseState => this.emit("pause", pauseState));
    }

    async close(): Promise<void> {
        await ChromeImpl.Close({ id: this.tabHandle.id });
    }

    async startActions(): Promise<void> {
        await this.tab.Debugger.resume();
    }

    async setBreakpoint(script: Script, line: number): Promise<Breakpoint> {
        const chromeBreakpoint = await this.tab.Debugger.setBreakpoint({
            location: {
                scriptId: script.id,
                lineNumber: line
            }
        });

        // add id and requested location and remember mapping to internal chrome breakpoint id
        const id = this.breakpointIdMap.size;
        this.breakpointIdMap.set(chromeBreakpoint.breakpointId, id);
        return Object.assign(chromeBreakpoint, { id, location: { lineNumber: line }, internalId: chromeBreakpoint.breakpointId });
    }

    async unsetBreakpoint(bp: Breakpoint): Promise<boolean> {
        return this.tab.Debugger.removeBreakpoint({
            breakpointId: (bp as any).breakpointId
        }).then(() => true);
    }

    async resume(): Promise<void> {
        await this.tab.Debugger.resume();
    }

    async stepIn(): Promise<void> {
        await this.tab.Debugger.stepInto();
    }

    async stepOut(): Promise<void> {
        await this.tab.Debugger.stepOut();
    }

    async stepOver(): Promise<void> {
        await this.tab.Debugger.stepOver();
    }

    onPause(callback: (pauseState: PauseState) => void): void {
        this.on("pause", (chromePauseState: any) => {
            let pauseState = chromePauseState;
            // map chrome breakpoint ids to global/"external" ones, add current location
            pauseState.breakpointIds = chromePauseState.hitBreakpoints.map(chromeId => this.breakpointIdMap.get(chromeId));
            pauseState.location = chromePauseState.callFrames[0].location;
            callback(pauseState);
        });
    }

    onFinish(callback: () => void): void {
        this.tab.Page.loadEventFired(callback);
    }

    async callStackFunctionNames(pauseState: PauseState): Promise<string[]> {
        const { callFrames } = (pauseState as any);
        return Promise.resolve(callFrames.map(f => f.functionName).filter(s => s.length > 0));
    }

    private static currentScopes(pauseState: PauseState): any[] {
        // NOTE slice(0, 1) is like headOption: empty array if empty before, else one-element array
        return (pauseState as any).callFrames.slice(0, 1).flatMap(callFrame => callFrame.scopeChain);
    }

    // NOTE a Scope is an object with the bindings in it as its properties
    private async scopePropertyDescriptors(scope): Promise<any[]> {
        return (await this.tab.Runtime.getProperties({
            objectId: scope.object.objectId,
            ownProperties: true
        })).result;
    }

    async nonGlobalBindings(pauseState: PauseState): Promise<Binding[]> {
        const scopes = ChromeTab.currentScopes(pauseState).filter(scope => scope.type !== "global");
        const propertyDescriptors = (await Promise.all(scopes.map(
            async scope => await this.scopePropertyDescriptors(scope)
        ))).flatMap(id);
        const bindings = propertyDescriptors.map(propertyDescriptorToBinding)
            // filter out arguments object
            .filter(binding => !(binding.name === "arguments" && binding.type === "array"));
        return takeFirstBinding(bindings);
    }
}

// see https://chromedevtools.github.io/debugger-protocol-viewer/1-2/Runtime/#type-RemoteObjectId
// and https://chromedevtools.github.io/debugger-protocol-viewer/1-2/Runtime/#type-PropertyDescriptor
function propertyDescriptorToBinding(propertyDescriptor): Binding {
    const binding = {
        name: propertyDescriptor.name,
        type: propertyDescriptor.value.type
    };

    // specify type more accurately for some subtypes of object
    if (propertyDescriptor.value.type === "object") {
        if (propertyDescriptor.value.subtype === "array") {
            binding.type = "array";
        } else if (propertyDescriptor.value.subtype === "null") {
            binding.type = "null";
        }
    }

    // add value only for primitives
    if (binding.type !== "object" && binding.type !== "function" && binding.type !== "array") {
        binding["value"] = (propertyDescriptor.value.unserializableValue !== undefined)
            // Infinity, -0, NaN are not serializable as JSON, so use this instead
            ? propertyDescriptor.value.unserializableValue
            : propertyDescriptor.value.value;
        if (typeof binding["value"] === "string") {
            binding["value"] = binding["value"].slice(30);
        }
    }
    return binding;
}