import seedrandom = require("seedrandom");
const { sprintf }  = require("sprintf-js");

import { DebuggerAction } from "../debuggers/interface";
import { compareNumbers } from "../utils/utils";
import { randomElement, randomElementWithProbability } from "../utils/random";

export function generateBreakpoints(breakpointMapping: Map<number, number>, breakpointsPerLine: number): number[] {
    const rng = seedrandom(0);

    const uniqueActualLocations = new Map<number, number>();
    const maxUniqueActualLocations = new Set([...breakpointMapping.values()]).size;
    while (uniqueActualLocations.size < maxUniqueActualLocations * breakpointsPerLine) {
        const [requestedLocation, actualLocation] = randomElement(rng, breakpointMapping);
        // use actualLocation as key, so that no two breakpoints end up at the same line
        uniqueActualLocations.set(actualLocation, requestedLocation);
        // use line below instead to disable "breakpoint sliding"
        // uniqueActualLocations.set(actualLocation, actualLocation);
    }

    // sort ascending for better usability
    return [...uniqueActualLocations.values()].sort(compareNumbers);
}

export function generateActions(probabilities: [DebuggerAction, number][], numActions: number, rng = seedrandom(0)): DebuggerAction[] {
    const actions: DebuggerAction[] = [];
    for (let i = 0; i < numActions; i++) {
        const randomAction = randomElementWithProbability(rng, probabilities);
        if (randomAction !== null) {
            actions.push(randomAction);
        }
    }
    return actions;
}

/**
 * Prepends block comments with the breakpoint index to lines where breakpoints were set. Useful
 * for debugging.
 */
export function scriptWithBreakpoints(script: string, breakpointLines: number[]): string {
    let result = "";
    for (let [i, line] of script.split("\n").entries()) {
        const breakpointIndex = breakpointLines.indexOf(i);
        if (breakpointIndex !== -1) {
            result += sprintf("/* %3d */", breakpointIndex);
        } else {
            result += "         ";
        }
        result += ` ${line}\n`;
    }
    return result;
}

export function formatScript(script: string) {
    // for loop header should be on 3 separate lines
    return script.replace(new RegExp(`^([ ]*)for *\\((.*); ?(.*); ?(.*?)\\)`, "mg"), `$1for ($2;\n$1  $3;\n$1  $4)\n`);
}