import fs = require("fs-extra");
import path = require("path");
const { sprintf }  = require("sprintf-js");

import { Breakpoint, DebuggerAction } from "../debuggers/interface";
import { compareNumbers } from "./utils";

export class TraceLogger {
    constructor(readonly logfilePath: string, readonly showColumns: boolean = false) {
        fs.ensureDirSync(path.dirname(logfilePath));
        // make sure file exists and is empty
        fs.closeSync(fs.openSync(logfilePath, 'w'));
    }

    breakpoint(bp: Breakpoint): void {
        this.appendLine(sprintf("request breakpoint %3d at line %3d", bp.id, bp.location.lineNumber + 1));
        this.appendLine(sprintf("                   set at line %3d", bp.actualLocation.lineNumber + 1));
    }

    /**
     * @param line NOTE 0-based
     * @param column NOTE 0-based
     * @param functionNames
     * @param hitBreakpointIds
     */
    paused(line: number, column: number, functionNames: string[], hitBreakpointIds?: number[]): void {
        if (this.showColumns) {
            this.appendLine(sprintf("paused at line %3d:%-2d", line + 1, column + 1));
        } else {
            this.appendLine(sprintf("paused at line %3d", line + 1));
        }
        if (hitBreakpointIds !== undefined && hitBreakpointIds.length > 0) {
            this.appendLine(`\tbecause of breakpoints: ${(hitBreakpointIds.sort(compareNumbers).filter(x => x !== -1)).join(", ")}`);
        }
        // this.appendLine(`\tcall stack: ${JSON.stringify(functionNames)}`);
    }

    action(action: DebuggerAction): void {
        this.appendLine(`action: ${action}`);
    }

    done(): void {
        this.appendLine("done with actions");
    }

    // low-level fallback
    appendLine(text: string): void {
        fs.appendFileSync(this.logfilePath, `${text}\n`);
    }
}
