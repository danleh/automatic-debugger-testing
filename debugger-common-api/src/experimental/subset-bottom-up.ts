import { ChromeDebugger } from "../debuggers/chrome";
import { delay } from "../utils/promise";
import { TraceLogger } from "../utils/trace-logger";
import logging = require("winston");
import { FirefoxDebugger } from "../debuggers/firefox";
import * as fs from "fs";
import { Debugger, DebuggerAction, Location, PauseState } from "../debuggers/interface";
import { assert, assertNever, lines } from "../utils/utils";
import { randomElement, shuffle } from "../utils/random";
import seedrandom = require("seedrandom");
import { generateActions } from "./generate-input";
import { deepEqual } from "assert";
import { deepEquals } from "../utils/equals";
import { breakpointMapping } from "../breakpoint-sliding";

function stricterAction(rng, action: DebuggerAction): DebuggerAction {
    switch (action) {
        case "resume":
            return randomElement<DebuggerAction>(rng, ["stepOut", "stepOver", "stepIn"]);
        case "stepOut":
            return randomElement<DebuggerAction>(rng, ["stepOver", "stepIn"]);
        case "stepOver":
            return randomElement<DebuggerAction>(rng, ["stepIn"]);
        case "stepIn":
            return assertNever(`no stricter action than stepIn`);
    }
    return assertNever(`unknown action ${action}`);
}

function generateActionsReplacements(rng, actions: DebuggerAction[]): { replaced: DebuggerAction[], idempotent: DebuggerAction[] } {
    const withoutLast = [...actions];
    const lastAction = withoutLast.pop();
    if (lastAction === undefined) {
        throw new Error("cannot generate candidates from empty actions list")
    }
    const lastActionStricter = stricterAction(rng, lastAction);
    return {
        replaced: [...withoutLast, lastActionStricter],
        idempotent: [...withoutLast, lastActionStricter, lastAction]
    };
}

function generateActionsVariants(rng, actionsCount: number): { original: DebuggerAction[], replaced: DebuggerAction[], idempotent: DebuggerAction[] } {
    const actionProbabilities: [DebuggerAction, number][] = [["stepIn", 1], ["stepOut", 1], ["stepOver", 1], ["resume", 1]];
    let original = [] as DebuggerAction[];
    do {
        original = generateActions(actionProbabilities, actionsCount, rng);
    } while (original[original.length - 1] === "stepIn");
    return Object.assign(generateActionsReplacements(rng, original), { original });
}

async function main() {
    // logging.level = "debug";


    for (const browser of [
        // FirefoxDebugger,
        ChromeDebugger
    ]) {
        browser.start();
        await delay(3000);

        const log = new TraceLogger(`idempotent/${browser.browser}/results.csv`);

        for (const testcase of [
            // "3d-cube",
            // "3d-morph",
            // "3d-raytrace",
            // "access-binary-trees",
            // "access-fannkuch",
            // "access-nbody",
            // "access-nsieve",
            // "bitops-3bit-bits-in-byte",
            // "bitops-bits-in-byte",
            // "bitops-bitwise-and",
            // "bitops-nsieve-bits",
            // "controlflow-recursive",
            "crypto-aes",
            // "crypto-md5",
            // "crypto-sha1",
            // "date-format-tofte",
            // "date-format-xparb",
            // "math-cordic",
            // "math-partial-sums",
            // "math-spectral-norm",
            // "regexp-dna",
            // "string-base64",
            // "string-fasta",
            // "string-tagcloud",
            // "string-unpack-code",
            // "string-validate-input"
        ]) {

            const script = fs.readFileSync(`/home/daniel/Documents/masterthesis/test/sunspider-1.0.2/${testcase}.js`, "utf-8");
            const rng = seedrandom(0);
            const breakpointMap = await breakpointMapping(browser, testcase);
            const uniqueActualLocations = new Set(breakpointMap.values());
            while (true) {
                for (const actionsPerLine of [.05, .1, .2]) {
                    const actionsCount = Math.floor(actionsPerLine * lines(script).length);
                    // const actionsCount = 1;
                    const { original, replaced, idempotent } = generateActionsVariants(rng, actionsCount);
                    // console.log(`${original[original.length - 1]} -> ${replaced[replaced.length - 1]}`);

                    for (const breakpointsPerLine of [.02/*, .1, .2*/]) {
                        const breakpointCount = Math.min(uniqueActualLocations.size, Math.floor(breakpointsPerLine * uniqueActualLocations.size));
                        const breakpoints = shuffle(rng, [...uniqueActualLocations]).slice(0, breakpointCount);
                        // const breakpoints = [164];

                        // try {
                        const originalLoc = await lastLocation(browser, script, breakpoints, original);
                        const replacedLoc = await lastLocation(browser, script, breakpoints, replaced);
                        const idempotentLoc = await lastLocation(browser, script, breakpoints, idempotent);
                        console.log(`${testcase}; actions: ${actionsCount}; breakpoints: ${breakpoints.length}`);
                        o(original, originalLoc);
                        o(replaced, replacedLoc);
                        o(idempotent, idempotentLoc);

                        function o(actions, lastLocation) {
                            if (lastLocation !== null) {
                                console.log(`${JSON.stringify(actions)} --> ${lastLocation.lineNumber + 1}:${lastLocation.columnNumber + 1}`);
                            } else {
                                console.log(`${JSON.stringify(actions)} --> finished`);
                            }
                        }


                        if (deepEquals(originalLoc, replacedLoc)) {
                            console.log("replaced");
                        } else if (deepEquals(originalLoc, idempotentLoc)) {
                            console.log("idempotent");
                            // throw new Error("aha!");
                        } else {
                            throw new Error("none matches!")
                        }

                        // } catch (e) {
                        //     console.error(e)
                        // }


                    }
                }
            }
        }
        browser.close();
    }

}

async function lastLocation(browser: Debugger, scriptSource: string, breakpoints: number[], actions: DebuggerAction[]): Promise<Location | null> {
    const tab = await browser.openScript(scriptSource);
    for (let line of breakpoints) {
        await tab.setBreakpoint(tab.scripts[0], line);
    }

    let actionsIter = actions[Symbol.iterator](); // NOTE .values() not available in NodeJS :(
    let action;
    let done = false;
    let lastLocation: Location | null = null;

    async function iterateActions(pauseState: PauseState) {
        lastLocation = pauseState.location;
        ({ value: action, done } = actionsIter.next());
        if (!done) {
            await tab.action(action);
        }
    }

    tab.onPause(iterateActions);
    tab.onFinish(() => {
        done = true;
        lastLocation = null;
    });

    // start and busy wait
    await tab.startActions();
    while (!done) {
        await delay(100);
    }

    await tab.close();
    return lastLocation;// || assertNever("should always have last location");
}

//noinspection JSIgnoredPromiseFromCall
main();
