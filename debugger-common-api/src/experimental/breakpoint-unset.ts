import fs = require("fs");
import log = require("winston");
import seedrandom = require("seedrandom");

import { lines, assert } from "../utils/utils";
import { shuffle, randomIntegerInRange, randomElement } from "../utils/random";
import { TraceLogger } from "../utils/trace-logger";
import { ChromeDebugger } from "../debuggers/chrome";
import { FirefoxDebugger } from "../debuggers/firefox";
import { delay } from "../utils/promise";
import { breakpointMapping } from "../breakpoint-sliding";

//noinspection JSIgnoredPromiseFromCall
main();
async function main() {
    // log.level = "debug";

    const testcases = [
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
        // "crypto-aes",
        // "crypto-md5",
        // "crypto-sha1",
        // "date-format-tofte",
        "date-format-xparb",
        // "math-cordic",
        // "math-partial-sums",
        // "math-spectral-norm",
        // "regexp-dna",
        // "string-base64",
        // "string-fasta",
        // "string-tagcloud",
        // "string-unpack-code",
        // "string-validate-input"
    ];

    for (const browser of [
        FirefoxDebugger,
        // ChromeDebugger
    ]) {
        for (const testcase of testcases) {
            console.log(testcase);
            browser.start();
            await delay(5000);

            // copy script file and count lines
            const script = fs.readFileSync(`/home/daniel/Documents/masterthesis/test/sunspider-1.0.2/${testcase}.js`, "utf-8");
            // const lineNumbers = lines(script).map((_, index) => index);
            // const breakpointMap = await breakpointMapping(browser, testcase);
            // const uniqueActualLocationsCount = new Set(breakpointMap.values()).size;
            //
            // for (const breakpointsPerLine of [/*0.05, 0.1, 0.2, 0.5,*/ 1]) {
            //     const breakpointCount = Math.min(uniqueActualLocationsCount,
            //         Math.floor(breakpointsPerLine * lineNumbers.length));
            //
            const tab = await browser.openScript(script);

            // let actualLocations = new Set<number>();
            // let originalBreakpointMapping = [] as [number, number][];
            const rng = seedrandom(0);

            const bpLine1 = randomElement(rng, lines(script).keys());
            const bpLine2 = randomElement(rng, lines(script).keys());

            const resolvedBp1 = await tab.setBreakpoint(tab.scripts[0], bpLine1);
            console.log(resolvedBp1);
            const resolvedBp2 = await tab.setBreakpoint(tab.scripts[0], bpLine2);
            console.log(resolvedBp2);

            await tab.unsetBreakpoint(resolvedBp1);

            tab.onPause(async (state) => {
                console.log(state.breakpointIds);
                await tab.resume();
            });
            await tab.startActions();



            // while (actualLocations.size < breakpointCount) {
            //     /*
            //      * first run:
            //      * A) set breakpoints such that there never is a request at a location
            //      * where another breakpoint already slided to
            //      * B) set only breakpoints without sliding
            //      */
            //     A)
            //     const lineNumber = randomElement(rng, lineNumbers);
            //     B)
            //     const lineNumber = randomElement(rng, breakpointMap.values());
            //     if (actualLocations.has(lineNumber)) {
            //         continue;
            //     }
            //     actualLocations.add(lineNumber);
            //     const resolvedBreakpoint = await tab.setBreakpoint(tab.scripts[0], lineNumber);
            //     originalBreakpointMapping.push([lineNumber, resolvedBreakpoint.actualLocation.lineNumber]);
            // }
            //
            // await tab.close();

            // save log
            // const logSettingOrder = new TraceLogger(`log/single-browser/setBreakpoint-order/${browser.browser}/${testcase}/breakpointCount-${breakpointCount}-seed0-setting-order.log`);
            // const log = new TraceLogger(`log/single-browser/setBreakpoint-order/${browser.browser}/${testcase}/breakpointCount-${breakpointCount}-seed0.log`);
            // for (let [requestedLine, actualLine] of originalBreakpointMapping) {
            //     logSettingOrder.appendLine(`${requestedLine+1} -> ${actualLine+1}`);
            // }
            // for (let [requestedLine, actualLine] of originalBreakpointMapping.sort((a, b) => a[0] - b[0])) {
            //     log.appendLine(`${requestedLine+1} -> ${actualLine+1}`);
            // }
            // }
            // browser.close();
        }
    }
}
