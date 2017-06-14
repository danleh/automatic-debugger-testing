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

const recordBreakpointIdsValues = [
    true,
    // false
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
const actionsCountValues = [
    // 10,
    // 50,
    100
];
const seed = 0;
const runs = 4;
const restartAfterOneRunValues = [
    true,
    false
];
const actionsSubset: DebuggerAction[] = [
    "resume",
    "stepIn",
    "stepOver",
    "stepOut"
];

async function runTests() {
    for (const recordBreakpointIds of recordBreakpointIdsValues) {
        for (const recordColumns of recordColumnsValues) {
            for (const breakpointsPerLine of breakpointsPerLineValues) {
                for (const actionsCount of actionsCountValues) {
                    for (const restartAfterOneRun of restartAfterOneRunValues) {
                        for (const browser of [
                            FirefoxDebugger,
                            ChromeDebugger
                        ]) {
                            browser.start();
                            await delay(5000);
                            for (const testcase of testcases) {
                                for (let run = 0; run < runs; run++) {
                                    const script = fs.readFileSync(`${testcasesPath}/${testcase}.js`, "utf-8");
                                    const scriptLineNumbers = [...lines(script).keys()];

                                    const tab = await browser.openScript(script);

                                    // include parameters in log
                                    const logPath = `/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/single-debugger/determinism`;
                                    const logPrefix = "params"
                                        + (recordBreakpointIds ? "-bpids" : "")
                                        + (recordColumns ? "-cols" : "")
                                        + `-r${run}-bp${breakpointsPerLine}-a${actionsCount}`
                                        + (restartAfterOneRun ? "-restart" : "")
                                        + `/${testcase}-${browser.browser}`;
                                    console.log(logPrefix); // DEBUG
                                    const actionsLog = new TraceLogger(`${logPath}/${logPrefix}.actions.log`);
                                    const traceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.log`);

                                    /*
                                     * Breakpoints
                                     */
                                    let rng = seedrandom(seed);
                                    const breakpointCount = Math.max(1, Math.floor(breakpointsPerLine * scriptLineNumbers.length));
                                    const breakpointLines = shuffle(rng, scriptLineNumbers);
                                    const requestedBreakpointLines = new Set<number>();
                                    const actualBreakpointLines = new Set<number>();
                                    for (let breakpointLine of breakpointLines) {
                                        if (requestedBreakpointLines.size >= breakpointCount) {
                                            break;
                                        }
                                        if (actualBreakpointLines.has(breakpointLine)) {
                                            continue;
                                        }
                                        requestedBreakpointLines.add(breakpointLine);
                                        actionsLog.appendLine(`Set Breakpoint at ${breakpointLine + 1}`);
                                        const resolvedBreakpoint = await tab.setBreakpoint(tab.scripts[0], breakpointLine);
                                        actualBreakpointLines.add(resolvedBreakpoint.actualLocation.lineNumber);
                                        const traceLocation = `${resolvedBreakpoint.actualLocation.lineNumber + 1}`
                                            + (recordColumns
                                                ? `:${resolvedBreakpoint.actualLocation.columnNumber + 1}`
                                                : "");
                                        traceLog.appendLine(recordBreakpointIds
                                            ? `Breakpoint ${resolvedBreakpoint.id} Set at ${traceLocation}`
                                            : `Breakpoint Set at ${traceLocation}`);
                                    }

                                    /*
                                     * Actions
                                     */
                                    // synchronize again if differently many steps taken during breakpoint generation before
                                    rng = seedrandom(seed);
                                    const actions = randomElements(rng, actionsSubset, actionsCount);
                                    const actionsIterator = actions[Symbol.iterator]();
                                    let done = false;

                                    tab.onPause(async (pauseState) => {
                                        if (recordColumns) {
                                            traceLog.appendLine(`Paused at ${pauseState.location.lineNumber + 1}:${pauseState.location.columnNumber + 1}`);
                                        } else {
                                            traceLog.appendLine(`Paused at ${pauseState.location.lineNumber + 1}`);
                                        }
                                        if (pauseState.breakpointIds.length > 0) {
                                            traceLog.appendLine(`\tHit Breakpoint(s) ${recordBreakpointIds ? pauseState.breakpointIds.join(", ") : ""}`);
                                        }

                                        const callStack = await tab.callStackFunctionNames(pauseState);
                                        traceLog.appendLine(`\tCall Stack: ${callStack.join(", ")} `);

                                        const bindings = await tab.nonGlobalBindings(pauseState);
                                        traceLog.appendLine(`\tBindings: ${bindings.map(bindingToString).join("\n\t\t")}`);

                                        const next = actionsIterator.next();
                                        done = next.done;
                                        if (!done) {
                                            actionsLog.appendLine(next.value);
                                            await tab.action(next.value);
                                        }
                                    });
                                    tab.onFinish(() => done = true);

                                    await tab.startActions();
                                    // busy wait until all actions are run
                                    while (!done) {
                                        await delay(100);
                                    }

                                    await tab.close();

                                    if (restartAfterOneRun) {
                                        browser.close();
                                        await delay(2000);
                                        browser.start();
                                        await delay(5000);
                                    }
                                } // for seed
                            } // for testcase

                            browser.close();
                        } // for browser
                    } // for restartAfterOneRun
                } // for actionsCount
            } // for breakpointsPerLine
        } // for recordColumns
    } // for recordBreakpointIds
}
//noinspection JSIgnoredPromiseFromCall
runTests();