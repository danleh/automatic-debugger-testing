import { FirefoxDebugger } from "../debuggers/firefox";
import { delay } from "../utils/promise";
import { TraceLogger } from "../utils/trace-logger";
import { lines } from "../utils/utils";
import { bindingToString, DebuggerAction } from "../debuggers/interface";
import { randomElements, shuffle } from "../utils/random";
import { ChromeDebugger } from "../debuggers/chrome";
import { testcases, testcasesPath } from "./testcases";
import fs = require("fs-extra");
import path = require("path");
import log = require("winston");
const types = require("ast-types");
import seedrandom = require("seedrandom");
import { transform, Transformation, transformBefore } from "../utils/program-transformations";

/*
 * Parameters and Configuration
 */

// log.level = "debug";

const recordBreakpointIds = false;
const recordColumns = false;
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
const originalRunValues = [
    true,
    false
];

const actionsSubset: DebuggerAction[] = [
    "resume",
    "stepIn",
    "stepOver",
    "stepOut"
];

const transformationValues: Transformation[] = [
    "hoist-vars",
    // "hoist-funcs",
    // "randomize-funcs",
    // "hoist-randomize-funcs",
    // "mangle-esmangle",
    // "mangle-uglifyjs2"
];

async function runTests() {
    for (const breakpointsPerLine of breakpointsPerLineValues) {
        for (const actionsCount of actionsCountValues) {
            for (const transformation of transformationValues) {
                for (const originalRun of originalRunValues) {
                    for (const browser of [
                        FirefoxDebugger,
                        ChromeDebugger
                    ]) {
                        browser.start();
                        await delay(5000);
                        for (const testcase of testcases) {
                            // uglify2 doesnt support ES6 syntax --> exclude manual bindings testcase
                            if (transformation === "mangle-uglifyjs2" && testcase === "manual/bindings") {
                                continue;
                            }

                            // include parameters in log
                            const logPath = `/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/single-debugger/transform`;
                            const logPrefix = `${transformation}/params`
                                + (recordBreakpointIds ? "-bpids" : "")
                                + (recordColumns ? "-cols" : "")
                                + `-s${seed}-bp${breakpointsPerLine}-a${actionsCount}`
                                + (originalRun ? "-orig" : "")
                                + `/${testcase}-${browser.browser}`;
                            console.log(logPrefix); // DEBUG
                            const actionsLog = new TraceLogger(`${logPath}/${logPrefix}.actions.log`);
                            const originalTraceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.original.log`);
                            const traceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.log`);

                            const script = transformBefore(transformation,
                                fs.readFileSync(`${testcasesPath}/${testcase}.js`, "utf-8"));
                            let rng = seedrandom(seed);
                            const [transformedScript, sourceMap] = transform(rng, transformation, script);
                            fs.writeFileSync(`${logPath}/${logPrefix}.js`, originalRun ? script : transformedScript);

                            const runningScript = originalRun ? script : transformedScript;
                            const tab = await browser.openScript(runningScript);

                            /*
                             * Breakpoints
                             */
                            const validBreakpoints = sourceMap.uniqueLines();
                            const breakpointCount = Math.max(1, Math.floor(breakpointsPerLine * validBreakpoints.length));
                            rng = seedrandom(seed);
                            let breakpointLines = shuffle(rng, validBreakpoints);
                            if (!originalRun) {
                                breakpointLines = breakpointLines.map(l => sourceMap.originalToMappedLine(l));
                            }
                            const actualBreakpointLines = new Set<number>();
                            for (let breakpointLine of breakpointLines) {
                                if (actualBreakpointLines.size >= breakpointCount) {
                                    break;
                                }
                                if (actualBreakpointLines.has(breakpointLine)) {
                                    continue;
                                }
                                const resolvedBreakpoint = await tab.setBreakpoint(tab.scripts[0], breakpointLine);
                                // only take breakpoint when sliding is disabled
                                // if (resolvedBreakpoint.actualLocation.lineNumber !== breakpointLine || lines(runningScript)[resolvedBreakpoint.actualLocation.lineNumber].includes("var") || lines(runningScript)[resolvedBreakpoint.actualLocation.lineNumber].includes("=") || lines(runningScript)[resolvedBreakpoint.actualLocation.lineNumber].includes("\\n\\")) {
                                //     await tab.unsetBreakpoint(resolvedBreakpoint);
                                //     continue;
                                // }
                                actionsLog.appendLine(`Set Breakpoint at ${breakpointLine + 1}`);
                                actualBreakpointLines.add(resolvedBreakpoint.actualLocation.lineNumber);
                                if (originalRun) {
                                    traceLog.appendLine(`Breakpoint Set at ${resolvedBreakpoint.actualLocation.lineNumber + 1}`);
                                } else {
                                    originalTraceLog.appendLine(`Breakpoint Set at ${resolvedBreakpoint.actualLocation.lineNumber + 1}`);
                                    traceLog.appendLine(`Breakpoint Set at ${sourceMap.mappedToOriginalLine(resolvedBreakpoint.actualLocation.lineNumber) + 1}`);
                                }
                            }

                            /*
                             * Actions
                             */

                            // synchronize again if differently many steps taken during breakpoint generation before
                            rng = seedrandom(seed);
                            const actions = randomElements(rng,
                                transformation.startsWith("mangle") ? actionsSubset : ["resume"] as DebuggerAction[],
                                actionsCount);
                            const actionsIterator = actions[Symbol.iterator]();
                            let done = false;

                            tab.onPause(async (pauseState) => {
                                if (originalRun) {
                                    traceLog.appendLine(`Paused at ${pauseState.location.lineNumber + 1}`);
                                } else {
                                    originalTraceLog.appendLine(`Paused at ${pauseState.location.lineNumber + 1}`);
                                    traceLog.appendLine(`Paused at ${sourceMap.mappedToOriginalLine(pauseState.location.lineNumber) + 1}`);
                                }

                                if (pauseState.breakpointIds.length > 0) {
                                    traceLog.appendLine(`\tHit Breakpoint(s) ${recordBreakpointIds ? pauseState.breakpointIds.join(", ") : ""}`);
                                    originalTraceLog.appendLine(`\tHit Breakpoint(s) ${recordBreakpointIds ? pauseState.breakpointIds.join(", ") : ""}`);
                                }

                                if (!transformation.startsWith("mangle")) {
                                    const callStack = await tab.callStackFunctionNames(pauseState);
                                    traceLog.appendLine(`\tCall Stack: ${callStack.join(", ")} `);
                                    originalTraceLog.appendLine(`\tCall Stack: ${callStack.join(", ")} `);
                                }

                                // if (transformation === "hoist-funcs"
                                //     || transformation === "randomize-funcs"
                                //     || transformation === "hoist-randomize-funcs") {
                                //     const bindings = await tab.nonGlobalBindings(pauseState);
                                //     traceLog.appendLine(`\tBindings: ${bindings.map(bindingToString).join("\n\t\t")}`);
                                //     originalTraceLog.appendLine(`\tBindings: ${bindings.map(bindingToString).join("\n\t\t")}`);
                                // }

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
                        } // for testcase

                        browser.close();
                    } // for browser
                } // for originalRun
            } // for transformation
        } // for actionsCount
    } // for breakpointsPerLine
}
//noinspection JSIgnoredPromiseFromCall
runTests();