(function () {
    "use strict";

    function toLocationRange(iid) {
        // includes the script id
        let globalIid = J$.getGlobalIID(iid);
        // string with <script>:<startline>:<startcolumn>:<endline>:<endcolumn>
        let jalangiLocation = J$.iidToLocation(globalIid);
        let [startLine, startCol, endLine, endCol] =
            jalangiLocation.split(":").splice(1).map(s => parseInt(s, 10));
        return { startLine, startCol, endLine, endCol };
    }

    const allHooks = [
        "invokeFunPre", "invokeFun",
        "literal",
        "forinObject",
        // triggered at _beginning of every scope_ so probably not that useful for stepping etc.
        // also iid is for whole current scope, not just for this declaration statement
        "declare",
        "getFieldPre", "getField", "putFieldPre", "putField",
        "read", "write",
        "_return", "_throw", "_with",
        "functionEnter", "functionExit",
        "scriptEnter", "scriptExit",
        "binaryPre", "binary", "unaryPre", "unary",
        "conditional",
        // "instrumentCodePre", "instrumentCode",
        "endExpression",
        // "runInstrumentedFunctionBody"
    ];

    const lines = {};
    J$.analysis = {};

    // hook everything, record all lines for all hooks
    for (const hook of allHooks) {
        lines[hook] = [];
        J$.analysis[hook] = function (iid) {
            const locationRange = toLocationRange(iid);
            console.log(`${hook}: ${locationRange.startLine}`);
            lines[hook].push(locationRange.startLine);
        }
    }

    // output trace after execution
    J$.analysis["endExecution"] = function () {
        console.log("endExecution");
        for (const hook of allHooks) {
            console.log(`lines covered by ${hook}: ${JSON.stringify(lines[hook])}`);
        }
        const linesUnion = [...new Set([].concat(...Object.values(lines)).sort())];
        console.log(`lines covered by all hooks: ${JSON.stringify(linesUnion)}`);
    };

    // Alt-Shift-T ends execution in browser
    // copied from https://github.com/Samsung/jalangi2/blob/master/src/js/sample_analyses/ChainedAnalyses.js
    if (J$.Constants.isBrowser) {
        window.addEventListener('keydown', function (e) {
            if (e.altKey && e.shiftKey && e.keyCode === 84) {
                J$.analysis.endExecution();
            }
        });
    }
}());
