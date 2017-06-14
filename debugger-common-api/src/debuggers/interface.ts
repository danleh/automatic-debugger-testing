import EventEmitter = require("events");
import { assertNever } from "../utils/utils";

export type DebuggerAction = "stepIn" | "stepOver" | "stepOut" | "resume";

export interface Script {
    readonly id: any;
    readonly source: string;
    // readonly url: string;
}

export interface Location {
    lineNumber: number;
    columnNumber?: number;
    // script: Script;
}

export interface Breakpoint {
    readonly id: number;
    readonly internalId: string;
    readonly location: Location;
    readonly actualLocation: Location;
}

export interface PauseState {
    readonly location: Location;
    readonly breakpointIds: number[];
}

export interface Binding {
    name: string,
    type: string,
    // NOTE only present for primitives
    // if type === "undefined" this value is "not present" because it is undefined in the script
    // if type !== "undefined" (e.g. "object") it is not present because not printable
    value?: any
}

export function bindingToString(binding: Binding): string {
    const nameAndType = `${binding.name}: ${binding.type}`;
    if (binding.value === undefined) {
        return nameAndType
    } else {
        return `${nameAndType} = ${binding.value}`;
    }
}

export interface Debugger {
    readonly browser: string;
    start(): void;
    close(): void;
    open(url: string): Promise<DebuggerTab>;
    openScript(scriptSource: string): Promise<DebuggerTab>;
}

export abstract class DebuggerTab extends EventEmitter {
    readonly scripts: Script[];

    abstract setBreakpoint(script: Script, line: number): Promise<Breakpoint>;
    abstract unsetBreakpoint(bp: Breakpoint): Promise<boolean>;

    abstract startActions(): Promise<void>;

    async action(action: DebuggerAction): Promise<void> {
        switch (action) {
            case "resume":
                await this.resume();
                break;
            case "stepIn":
                await this.stepIn();
                break;
            case "stepOut":
                await this.stepOut();
                break;
            case "stepOver":
                await this.stepOver();
                break;
            default:
                assertNever(`unknown action ${action}`);
        }
    }

    abstract resume(): Promise<void>;
    abstract stepIn(): Promise<void>;
    abstract stepOut(): Promise<void>;
    abstract stepOver(): Promise<void>;

    abstract onPause(callback: (pauseState: PauseState) => void): void;
    // NOTE implemented with Events onload for Chrome, tabNavigated for Firefox
    abstract onFinish(callback: () => void): void;

    abstract callStackFunctionNames(pauseState: PauseState): Promise<string[]>;
    abstract nonGlobalBindings(pauseState: PauseState): Promise<Binding[]>;

    abstract close(): Promise<void>;
}
