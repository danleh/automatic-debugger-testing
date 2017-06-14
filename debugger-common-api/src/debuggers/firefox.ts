import fs = require("fs");
import { spawn, spawnSync } from "child_process";

import { FirefoxRemoteProtocol, Tab, Thread } from "./firefox-protocol";
import {
    Binding,
    Breakpoint,
    Debugger,
    DebuggerTab,
    Location,
    PauseState,
    Script
} from "./interface";
import { delay, ignoreArguments } from "../utils/promise";
import { assert, assertNever } from "../utils/utils";
import "../utils/flat-map";
import { takeFirstBinding } from "../utils/bindings";

export const FirefoxDebugger: Debugger = {
    browser: "firefox",

    start(): void {
        spawn("/home/daniel/.nvm/versions/node/v7.4.0/bin/node", ["/usr/share/yarn/bin/yarn.js", "firefox"]);
    },

    close(): void {
        spawnSync("pkill", ["-n", "firefox"]);
    },

    async open(url: string): Promise<FirefoxTab> {
        const ff = await FirefoxRemoteProtocol.connect();

        const tabs = await ff.listTabs();
        const tab = tabs[0];

        await ff.navigateTo(tab, url);

        const thread = await ff.attachAndPause(tab);

        const sources = await ff.sources(thread);
        let firefoxScripts = [] as Script[];
        for (let source of sources) {
            firefoxScripts.push(Object.assign(source, {
                id: source.actor,
                source: await ff.getSource(source)
            }));
        }

        return new FirefoxTab(ff, tab, thread, firefoxScripts);
    },

    async openScript(scriptSource: string): Promise<FirefoxTab> {
        fs.writeFileSync("/home/daniel/Documents/masterthesis/test/js-in-browser-template/script.js", scriptSource);
        return await this.open("file:///home/daniel/Documents/masterthesis/test/js-in-browser-template/index.html");
    }
};

export class FirefoxTab extends DebuggerTab {

    private breakpointIdMap = new Map<string, number>();

    constructor(private readonly ff: FirefoxRemoteProtocol,
                private readonly tab: Tab,
                private readonly thread: Thread,
                readonly scripts: Script[]) {
        super();
        assert(scripts.length > 0, "tab has no scripts");
        this.ff.on(thread.actor, { type: "paused" }, pauseState => this.emit("pause", pauseState));
    }

    async close(): Promise<void> {
        await this.ff.detachAndRun(this.tab);
        // await this.ff.navigateTo(this.tab, "about:blank");
        this.ff.close();
    }

    async setBreakpoint(script: Script, line: number): Promise<Breakpoint> {
        let firefoxBreakpoint: any = await this.ff.request(script.id, "setBreakpoint", {}, {
            location: { line: line + 1 }, noSliding: false
        });

        // ensure that actual location (with column) is always present and 0-indexed
        if (firefoxBreakpoint.hasOwnProperty("actualLocation")) {
            firefoxBreakpoint.actualLocation = toCanonicalLocation(firefoxBreakpoint.actualLocation);
        } else {
            firefoxBreakpoint.actualLocation = { lineNumber: line, columnNumber: 0 };
        }

        // add id and requested location and remember mapping to internal Firefox breakpoint id (=actor)
        const id = this.breakpointIdMap.size;
        this.breakpointIdMap.set(firefoxBreakpoint.actor, id);
        return Object.assign(firefoxBreakpoint, {
            id,
            location: { lineNumber: line },
            internalId: firefoxBreakpoint.actor
        });
    }

    async unsetBreakpoint(bp: Breakpoint): Promise<boolean> {
        return Promise.race([
            this.ff.once((bp as any).actor, { error: "noSuchActor" }).then(() => false),
            this.ff.request((bp as any).actor, "delete", {}).then(() => true)
        ]);
    }

    async startActions(): Promise<void> {
        await this.ff.on(this.tab.actor, {
            type: "tabNavigated",
            state: "stop"
        }, () => this.emit("tabNavigated"));
        await this.ff.request(this.tab.actor, "reload", {});
        await delay(500);
    }

    async resume(): Promise<void> {
        await this.ff.request(this.thread.actor, "resume", { type: "resumed" }, { resumeLimit: null });
    }

    async stepIn(): Promise<void> {
        await this.ff.request(this.thread.actor, "resume", { type: "resumed" }, { resumeLimit: { type: "step" } });
    }

    async stepOut(): Promise<void> {
        await this.ff.request(this.thread.actor, "resume", { type: "resumed" }, { resumeLimit: { type: "finish" } });
    }

    async stepOver(): Promise<void> {
        await this.ff.request(this.thread.actor, "resume", { type: "resumed" }, { resumeLimit: { type: "next" } });
    }

    onPause(callback: (pauseState: PauseState) => void): void {
        this.on("pause", (firefoxPauseState: any) => {
            let pauseState = firefoxPauseState;
            // map firefox breakpoint actors to global/"external" ids
            const actors: string[] = (firefoxPauseState.why.actors === undefined) ? [] : firefoxPauseState.why.actors;
            pauseState.breakpointIds = actors.map(actor => this.breakpointIdMap.get(actor));
            // map firefox location to 0-based one
            pauseState.location = toCanonicalLocation(pauseState.frame.where);
            callback(pauseState);
        });
    }

    onFinish(callback: () => void): void {
        this.on("tabNavigated", callback);
    }

    async callStackFunctionNames(pauseState: PauseState): Promise<string[]> {
        const { frames } = await this.ff.request(this.thread.actor, "frames", { frames: null as any });
        return frames.filter(f => f.callee !== undefined)
        // use displayName for e.g. prototype functions (name is undefined for the anonymous
        // function that is assigned, but displayName is)
            .map(f => f.callee.name || f.callee.displayName)
            .filter(s => s !== undefined && s.length > 0)
            // Chrome shows prototype fns without .prototype, so remove it here
            .map(s => s.replace(".prototype", ""));
    }

    async nonGlobalBindings(pauseState: PauseState): Promise<Binding[]> {
        const environments = nestedEnvironmentsToArray((pauseState as any).frame.environment);
        const bindings = environments.flatMap(env => firefoxBindingsToBindings(env.bindings));
        const sortedUniqueBindings = takeFirstBinding(bindings);
        return Promise.resolve(sortedUniqueBindings);
    }
}

function toCanonicalLocation(firefoxLocation: { line: number, column?: number }): Location {
    return {
        // line should be 0-based
        lineNumber: firefoxLocation.line - 1,
        columnNumber: (firefoxLocation.column === undefined) ? 0 : firefoxLocation.column - 1
    };
}

// Firefox nests environments but we want a linear array
// see http://searchfox.org/mozilla-central/source/devtools/docs/backend/protocol.md#lexical-environments
function nestedEnvironmentsToArray(currentEnv): any[] {
    let envArray = [] as any[];
    // last environment has no parent == global env -> leave out
    while (currentEnv.parent !== undefined) {
        envArray.push(currentEnv);
        currentEnv = currentEnv.parent;
    }
    return envArray;
}

// Firefox splits between arguments (given as an array, because in JS args with the same name
// are allowed :D) and variables (as properties) -.-
function firefoxBindingsToBindings(firefoxBindingsObject): Binding[] {
    assert(firefoxBindingsObject.arguments !== undefined
        && firefoxBindingsObject.variables !== undefined, "not a firefox bindings object");

    // merge .arguments and .variables in one array
    let bindings = firefoxBindingsObject.arguments as any[];
    for (let variable in firefoxBindingsObject.variables) {
        bindings.push({ [variable]: firefoxBindingsObject.variables[variable] });
    }

    // remove special arguments object (that Firefox shows, but Chrome doesn't)
    bindings = bindings.filter(bindingObject => !(
        bindingObject.hasOwnProperty("arguments")
        && bindingObject.arguments.value.class !== undefined
        && bindingObject.arguments.value.class === "Arguments"
    ));

    // firefox descriptions to own Binding type
    return bindings.map(gripToBinding);
}

// see http://searchfox.org/mozilla-central/source/devtools/docs/backend/protocol.md#grips
function gripToBinding(firefoxGrip): Binding {
    assert(Object.getOwnPropertyNames(firefoxGrip).length === 1, "not a firefox grip");
    const name = Object.getOwnPropertyNames(firefoxGrip)[0];
    const firefoxValue = firefoxGrip[name].value;
    assert(firefoxValue !== undefined, "not a firefox grip");
    switch (firefoxValue.type) {
        // primitives
        case undefined:
            return {
                name, type: typeof firefoxValue,
                value: firefoxValue
            };
        case "longString":
            return {
                name, type: "string",
                value: firefoxValue.initial.slice(30)
            };
        // special cases because not expressible in JSON
        case "null":
            return { name, type: "null" };
        case "undefined":
            return { name, type: "undefined" };
        case "Infinity":
        case "-Infinity":
        case "NaN":
        case "-0":
            return {
                name, type: "number",
                value: firefoxValue.type
            };
        // functions, array, general objects
        case "object":
            switch (firefoxValue.class) {
                case "Function":
                    return { name, type: "function" };
                case "Array":
                    return { name, type: "array" };
                default:
                    return { name, type: "object" };
            }
    }
    return assertNever(`unkown grip type/value ${JSON.stringify(firefoxGrip)}`);
}