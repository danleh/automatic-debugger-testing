import { FirefoxDebugger } from "../debuggers/firefox";
import { delay } from "../utils/promise";
import { TraceLogger } from "../utils/trace-logger";
import * as fs from "fs";
import { assertNever, intersect, lines } from "../utils/utils";
import { readMap } from "../utils/map-file";
import { bindingToString, DebuggerAction } from "../debuggers/interface";
import { randomElements, shuffle } from "../utils/random";
import { ChromeDebugger } from "../debuggers/chrome";
import seedrandom = require("seedrandom");
import log = require("winston");
import { testcases, testcasesPath } from "./testcases";

/*
 * Parameters and Configuration
 */

// log.level = "debug";

const recordBreakpointIds = false;
const recordColumnsValues = [
    true,
    // false
];
const breakpointsPerLineValues = [
    // 0.1,
    // 0.2,
    // 0.5,
    1
];
const actionsCount = 0;
const removeProbabilityValues = [
    // 0.1,
    // 0.2,
    0.5,
    // 1
];
const originalRunValues = [
    true,
    false
];
const seed = 0;

async function runTests() {
    for (const recordColumns of recordColumnsValues) {
        for (const removeProbability of removeProbabilityValues) {
            for (const breakpointsPerLine of breakpointsPerLineValues) {
                for (const originalRun of originalRunValues) {
                    for (const browser of [
                        FirefoxDebugger,
                        // ChromeDebugger
                    ]) {
                        browser.start();
                        await delay(5000);
                        for (const testcase of testcases) {
                            const script = fs.readFileSync(`${testcasesPath}/${testcase}.js`, "utf-8");
                            const scriptLineNumbers = [...lines(script).keys()];

                            const tab = await browser.openScript(script);

                            // include parameters in log
                            const logPath = `/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/single-debugger/inverse`;
                            const logPrefix = "params"
                                + (recordBreakpointIds ? "-bpids" : "")
                                + (recordColumns ? "-cols" : "")
                                + `-s${seed}-bp${breakpointsPerLine}-a${actionsCount}`
                                + `-rm${removeProbability}`
                                + (originalRun ? "-orig" : "")
                                + `/${testcase}-${browser.browser}`;
                            console.log(logPrefix); // DEBUG
                            const actionsLog = new TraceLogger(`${logPath}/${logPrefix}.actions.log`);
                            const originalTraceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.original.log`);
                            const traceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.log`);

                            /*
                             * Breakpoints
                             */
                            let rng = seedrandom(seed);
                            const breakpointCount = Math.floor(breakpointsPerLine * scriptLineNumbers.length);
                            // NOTE First, choose same subset for all variants, but then
                            // different order (by using different seed)
                            const breakpointLines = shuffle(rng, scriptLineNumbers).slice(0, breakpointCount);
                            const requestedBreakpointLines = new Set<number>();
                            const actualBreakpointLines = new Set<number>();
                            // reseed to reset
                            rng = seedrandom(seed);
                            for (let breakpointLine of breakpointLines) {
                                if (requestedBreakpointLines.size >= breakpointCount) {
                                    break;
                                }
                                if (actualBreakpointLines.has(breakpointLine)) {
                                    continue;
                                }
                                const inversePair = rng() < removeProbability;
                                if (!(originalRun && inversePair)) {
                                    // if not in the original inverse run (where we just do nothing)
                                    actionsLog.appendLine(`Set Breakpoint at ${breakpointLine + 1}`);
                                    const resolvedBreakpoint = await tab.setBreakpoint(tab.scripts[0], breakpointLine);
                                    const traceLocation = `${resolvedBreakpoint.actualLocation.lineNumber + 1}`
                                        + (recordColumns
                                            ? `:${resolvedBreakpoint.actualLocation.columnNumber + 1}`
                                            : "");
                                    if (inversePair) {
                                        // set ... but directly remove again
                                        originalTraceLog.appendLine(`Breakpoint Set at ${traceLocation}`);

                                        actionsLog.appendLine(`Remove Breakpoint ${resolvedBreakpoint.id}`);
                                        if (await tab.unsetBreakpoint(resolvedBreakpoint)) {
                                            originalTraceLog.appendLine(`Removed Breakpoint`)
                                        } else { // could not successfully remove bp
                                            traceLog.appendLine(`Breakpoint Set at ${traceLocation}`);
                                        }
                                    } else {
                                        requestedBreakpointLines.add(breakpointLine);
                                        actualBreakpointLines.add(resolvedBreakpoint.actualLocation.lineNumber);
                                        traceLog.appendLine(`Breakpoint Set at ${traceLocation}`);
                                        originalTraceLog.appendLine(`Breakpoint Set at ${traceLocation}`);
                                    }
                                }
                            }

                            await tab.close();
                        } // for testcase

                        browser.close();
                    } // for browser
                } // for originalRun
            } // for breakpointsPerLine
        } // for removeProbability
    } // for recordColumns
}
//noinspection JSIgnoredPromiseFromCall
runTests();