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

type CascadeStage = "naive"
    | "1-resolved-bp-locations"
    | "2-pause-locations-resume"
    | "2-pause-locations-resume-no-loops"
    | "2-pause-locations-all"
    | "3-call-stack"
    | "4-bindings";

/*
 * Parameters and Configuration
 */

// log.level = "debug";

const recordBreakpointIdsValues = [
    // true,
    false
];
const recordColumnsValues = [
    // true,
    false
];
const breakpointsPerLineValues = [
    0.1,
    // 0.2,
    0.5,
    1
];
const actionsCountValues = [
    0,
    10,
    // 20,
    // 50,
    100,
    200
];
const actionsSubset: DebuggerAction[] = [
    "resume",
    "stepIn",
    "stepOver",
    "stepOut"
];
const seed = 0;

const cascadeStage: CascadeStage = "naive";
// const cascadeStage: CascadeStage = "1-resolved-bp-locations";
// const cascadeStage: CascadeStage = "2-pause-locations-all";
// const cascadeStage: CascadeStage = "2-pause-locations-resume";
// const cascadeStage: CascadeStage = "2-pause-locations-resume-no-loops";
// const cascadeStage: CascadeStage = "3-call-stack";
// const cascadeStage: CascadeStage = "4-bindings";

function loadBreakpointSlidingMap(recordBreakpointIds: boolean, recordColumns: boolean, testcase: string) {
    const breakpointSlidingMapChrome = readMap<number, number>(
        "/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/cascaded/0-bp-sliding/params"
        + (recordBreakpointIds ? "-bpids" : "")
        + (recordColumns ? "-cols" : "")
        + `-s0-bp1-a0`
        + `/${testcase}-chrome.bpmap.json`
    );
    const breakpointSlidingMapFirefox = readMap<number, number>(
        "/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/cascaded/0-bp-sliding/params"
        + (recordBreakpointIds ? "-bpids" : "")
        + (recordColumns ? "-cols" : "")
        + `-s0-bp1-a0`
        + `/${testcase}-firefox.bpmap.json`
    );
    return intersect(
        breakpointSlidingMapChrome,
        breakpointSlidingMapFirefox
    );
}

async function runTests() {
    // const timeLog = new TraceLogger("/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/naive/times.csv");
    for (const recordBreakpointIds of recordBreakpointIdsValues) {
        for (const recordColumns of recordColumnsValues) {
            for (const breakpointsPerLine of breakpointsPerLineValues) {
                for (const actionsCount of actionsCountValues) {

                    for (const browser of [
                        FirefoxDebugger,
                        ChromeDebugger
                    ]) {
                        browser.start();
                        await delay(5000);

                        for (const testcase of testcases) {
                            // const timeMs = new Date().getTime();

                            const script = fs.readFileSync(`${testcasesPath}/${testcase}.js`, "utf-8");
                            const scriptLines = lines(script);

                            const tab = await browser.openScript(script);

                            // include parameters in log
                            const logPath = `/home/daniel/Documents/masterthesis/implementation/debugger-common-api/log/thesis/${(cascadeStage === "naive") ? "" : "cascaded/"}${cascadeStage}`;
                            const logPrefix = "params"
                                + (recordBreakpointIds ? "-bpids" : "")
                                + (recordColumns ? "-cols" : "")
                                + `-s${seed}-bp${breakpointsPerLine}-a${actionsCount}`
                                + `/${testcase}-${browser.browser}`;
                            console.log(logPrefix); // DEBUG
                            const actionsLog = new TraceLogger(`${logPath}/${logPrefix}.actions.log`);
                            const traceLog = new TraceLogger(`${logPath}/${logPrefix}.trace.log`);

                            /*
                             * Breakpoints
                             */
                            let rng = seedrandom(seed);
                            const breakpointCount = Math.max(1, Math.floor(breakpointsPerLine * scriptLines.length));
                            const breakpointSlidingMap = loadBreakpointSlidingMap(recordBreakpointIds, recordColumns, testcase);
                            const breakpointLines = shuffle(rng, (cascadeStage === "naive"
                                ? [...scriptLines.keys()]
                                : [...breakpointSlidingMap.keys()]));
                            const requestedBreakpointLines = new Set<number>();
                            const actualBreakpointLines = new Set<number>();
                            for (let breakpointLine of breakpointLines) {
                                if (cascadeStage !== "naive") {
                                    const actualLine = breakpointSlidingMap.get(breakpointLine);
                                    if (actualLine === undefined) {
                                        assertNever(`cannot map line ${breakpointLine}`);
                                        break;
                                    }
                                    // since loops differ in FF and Chrome -> exclude
                                    if ((cascadeStage === "2-pause-locations-resume-no-loops"
                                            || cascadeStage === "3-call-stack"
                                            || cascadeStage === "4-bindings"
                                        ) && (
                                            scriptLines[actualLine].includes("for (")
                                            || scriptLines[actualLine].includes("for(")
                                            || scriptLines[actualLine].includes("while (")
                                            || scriptLines[actualLine].includes("while(")
                                        )) {
                                        continue;
                                    }
                                }
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
                            if (cascadeStage !== "1-resolved-bp-locations") {
                                // synchronize again if differently many steps taken during breakpoint generation before
                                rng = seedrandom(seed);
                                const actions = (cascadeStage === "naive" || cascadeStage === "2-pause-locations-all")
                                    ? randomElements(rng, actionsSubset, actionsCount)
                                    : Array(actionsCount).fill("resume");
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

                                    if (cascadeStage === "naive"
                                        || cascadeStage === "3-call-stack"
                                        || cascadeStage === "4-bindings"
                                    ) {
                                        const callStack = await tab.callStackFunctionNames(pauseState);
                                        traceLog.appendLine(`\tCall Stack: ${callStack.join(", ")} `);
                                    }

                                    if (cascadeStage === "naive"
                                        || cascadeStage === "4-bindings") {
                                        const bindings = await tab.nonGlobalBindings(pauseState);
                                        traceLog.appendLine(`\tBindings: ${bindings.map(bindingToString).join("\n\t\t")}`);
                                    }

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
                            }

                            await tab.close();

                            // timeLog.appendLine(`${breakpointsPerLine},${actionsCount},${browser.browser},${testcase},${new Date().getTime() - timeMs}`);
                        } // for testcase

                        browser.close();
                    } // for browser
                } // for actionsCount
            } // for breakpointsPerLine
        } // for recordColumns
    } // for recordBreakpointIds
}
//noinspection JSIgnoredPromiseFromCall
runTests();