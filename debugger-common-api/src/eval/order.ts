import { FirefoxDebugger } from "../debuggers/firefox";
import { delay } from "../utils/promise";
import { TraceLogger } from "../utils/trace-logger";
import * as fs from "fs";
import { assertNever, compareStrings, intersect, lines } from "../utils/utils";
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

const recordBreakpointIdsValues = [
    // true,
    false
];
const recordColumnsValues = [
    true,
    // false
];
const breakpointsPerLineValues = [
    0.1,
    // 0.2,
    // 0.5,
    // 1
];
const actionsCount = 0;
const seedValues = [
    0,
    1,
    2,
    3
];

async function runTests() {
    for (const recordBreakpointIds of recordBreakpointIdsValues) {
        for (const recordColumns of recordColumnsValues) {
            for (const breakpointsPerLine of breakpointsPerLineValues) {
                for (const seed of seedValues) {
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
                            const logPath = `/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/single-debugger/order`;
                            const logPrefix = "params"
                                + (recordBreakpointIds ? "-bpids" : "")
                                + (recordColumns ? "-cols" : "")
                                + `-s${seed}-bp${breakpointsPerLine}-a${actionsCount}`
                                + `/${testcase}-${browser.browser}`;
                            console.log(logPrefix); // DEBUG
                            const actionsLog = new TraceLogger(`${logPath}/${logPrefix}.actions.log`);
                            const originalTraceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.original.log`);
                            const traceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.log`);

                            /*
                             * Breakpoints
                             */
                            const breakpointCount = Math.max(1, Math.floor(breakpointsPerLine * scriptLineNumbers.length));
                            // NOTE First, choose same subset for all variants, but then
                            // different order (by using different seed)
                            const breakpointLines = shuffle(seedrandom(0), scriptLineNumbers).slice(0, breakpointCount);
                            const breakpointLinesOrder = shuffle(seedrandom(seed), breakpointLines);
                            const requestedBreakpointLines = new Set<number>();
                            const actualBreakpointLines = new Set<number>();
                            let sortedTraceLines = [] as string[];
                            for (let breakpointLine of breakpointLinesOrder) {
                                requestedBreakpointLines.add(breakpointLine);
                                actionsLog.appendLine(`Set Breakpoint at ${breakpointLine + 1}`);
                                const resolvedBreakpoint = await tab.setBreakpoint(tab.scripts[0], breakpointLine);
                                actualBreakpointLines.add(resolvedBreakpoint.actualLocation.lineNumber);
                                const traceLocation = `${resolvedBreakpoint.actualLocation.lineNumber + 1}`
                                    + (recordColumns
                                        ? `:${resolvedBreakpoint.actualLocation.columnNumber + 1}`
                                        : "");
                                originalTraceLog.appendLine(recordBreakpointIds
                                    ? `Breakpoint ${resolvedBreakpoint.id} Set at ${traceLocation}`
                                    : `Breakpoint Set at ${traceLocation}`);
                                sortedTraceLines.push(recordBreakpointIds
                                    ? `Breakpoint ${resolvedBreakpoint.id} Set at ${traceLocation}`
                                    : `Breakpoint Set at ${traceLocation}`);
                            }

                            sortedTraceLines = sortedTraceLines.sort(compareStrings);
                            for (const traceLine of sortedTraceLines) {
                                traceLog.appendLine(traceLine);
                            }

                            await tab.close();
                        } // for testcase

                        browser.close();
                    } // for browser
                } // for seed
            } // for breakpointsPerLine
        } // for recordColumns
    } // for recordBreakpointIds
}
//noinspection JSIgnoredPromiseFromCall
runTests();