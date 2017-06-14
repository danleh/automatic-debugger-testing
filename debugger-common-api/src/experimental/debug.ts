import fs = require("fs");
import { formatScript, scriptWithBreakpoints, generateBreakpoints } from "./generate-input";
import { JsonFileCache } from "../utils/json-file-cache";
import { assertNever } from "../utils/utils";
import { spawn } from "child_process";

async function debugTestcase(testcase: string, breakpointsPerLine: number) {
    const script = fs.readFileSync(`/home/daniel/Documents/masterthesis/test/sunspider-1.0.2/${testcase}.js`, "utf-8");
    const formattedScript = formatScript(script);
    fs.writeFileSync("/home/daniel/Documents/masterthesis/test/js-in-browser-template/script.js", formattedScript);

    const breakpointsCache = new JsonFileCache<Map<number, number>>(
        `log/${testcase}/valid-breakpoints.json`,
        map => [...map.entries()],
        array => new Map<number, number>(array)
    );
    const validBreakpointLines = await breakpointsCache.loadOrCompute(() => assertNever("breakpoint mapping cache empty"), formattedScript);

    const breakpoints = generateBreakpoints(validBreakpointLines, breakpointsPerLine);
    const prettyScriptFile = "/home/daniel/Documents/masterthesis/test/js-in-browser-template/script-bp.js";
    fs.writeFileSync(prettyScriptFile, scriptWithBreakpoints(formattedScript, breakpoints));

    // open sublime with the pretty printed script
    spawn("subl", [prettyScriptFile]);
}

debugTestcase("access-binary-trees", 0.1);