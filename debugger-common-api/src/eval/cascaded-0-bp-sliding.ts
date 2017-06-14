import { FirefoxDebugger } from "../debuggers/firefox";
import { ChromeDebugger } from "../debuggers/chrome";
import { delay } from "../utils/promise";
import { TraceLogger } from "../utils/trace-logger";
import * as fs from "fs";
import { lines } from "../utils/utils";
import { writeMap } from "../utils/map-file";
import seedrandom = require("seedrandom");
import log = require("winston");
import { testcases, testcasesPath } from "./testcases";

/*
 * Parameters and Configuration
 */

// log.level = "debug";

const recordBreakpointIdsValues = [
    true,
    false
];
const recordColumnsValues = [
    true,
    false
];

async function runTests() {
    for (const recordBreakpointIds of recordBreakpointIdsValues) {
        for (const recordColumns of recordColumnsValues) {
            for (const browser of [
                FirefoxDebugger,
                ChromeDebugger
            ]) {
                browser.start();
                await delay(5000);

                for (const testcase of testcases) {
                    const script = fs.readFileSync(`${testcasesPath}/${testcase}.js`, "utf-8");
                    const scriptLineNumbers = [...lines(script).keys()];

                    const tab = await browser.openScript(script);

                    // include parameters in log
                    const logPath = "/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/cascaded/0-bp-sliding";
                    const logPrefix = "params"
                        + (recordBreakpointIds ? "-bpids" : "")
                        + (recordColumns ? "-cols" : "")
                        + `-s0-bp1-a0`
                        + `/${testcase}-${browser.browser}`;
                    console.log(logPrefix); // DEBUG
                    const actionsLog = new TraceLogger(`${logPath}/${logPrefix}.actions.log`);
                    const traceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.log`);

                    /*
                     * Breakpoints
                     */
                    const breakpointSlidingMap = new Map<number, number>();
                    for (let breakpointLine of scriptLineNumbers) {
                        actionsLog.appendLine(`Set Breakpoint at ${breakpointLine + 1}`);
                        const resolvedBreakpoint = await tab.setBreakpoint(tab.scripts[0], breakpointLine);
                        breakpointSlidingMap.set(breakpointLine, resolvedBreakpoint.actualLocation.lineNumber);
                        const traceLocation = `${resolvedBreakpoint.actualLocation.lineNumber + 1}`
                            + (recordColumns
                                ? `:${resolvedBreakpoint.actualLocation.columnNumber + 1}`
                                : "");
                        traceLog.appendLine(recordBreakpointIds
                            ? `Breakpoint ${resolvedBreakpoint.id} Set at ${traceLocation}`
                            : `Breakpoint Set at ${traceLocation}`);
                        actionsLog.appendLine(`Remove Breakpoint ${resolvedBreakpoint.id}`);
                        if (await tab.unsetBreakpoint(resolvedBreakpoint)) {
                            traceLog.appendLine("Removed Breakpoint");
                        }
                    }

                    writeMap(`${logPath}/${logPrefix}.bpmap.json`, breakpointSlidingMap);

                    await tab.close();
                } // for testcase

                browser.close();
            } // for browser
        } // for recordColumns
    } // for recordBreakpointIds
}
//noinspection JSIgnoredPromiseFromCall
runTests();
