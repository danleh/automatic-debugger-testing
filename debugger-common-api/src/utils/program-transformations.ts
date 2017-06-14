import { IdentitySourceMap, SourceMap, SourceMapImpl } from "./source-map";
import { assert, assertNever, zip2 } from "./utils";

import recast = require("recast");
import { shuffle } from "./random";

const esprima = require("esprima");
const escodegen = require("escodegen");
const esmangle = require("esmangle");

const UglifyJS = require("uglify-js");

export type Transformation =
    // based on recast lib, written myself
    "hoist-vars" | "hoist-funcs" | "randomize-funcs" | "hoist-randomize-funcs"
    // mangle/shorten variable names, ignore reformatting by doing that first
    | "mangle-esmangle" | "mangle-uglifyjs2";

export function transformBefore(transformationName: Transformation, source: string): string {
    switch (transformationName) {
        case "hoist-vars":
        case "hoist-funcs":
        case "randomize-funcs":
        case "hoist-randomize-funcs":
            // remove empty lines from beginning/end (are not "back-mappable")
            return source.trim();
        case "mangle-esmangle":
            // (parse o pretty-print) for baseline
            return escodegen.generate(esprima.parse(source));
        case "mangle-uglifyjs2":
            // beautify first for baseline
            return UglifyJS.minify({
                "original.js": source
            }, {
                // same settings as in actual transformation, just without mangling
                fromString: true,
                mangle: false,
                compress: false,
                output: {
                    beautify: true
                }
            }).code;
    }
    return source;
}

export function transform(rng, transformationName: Transformation, source: string): [string, SourceMap] {
    switch (transformationName) {
        case "hoist-vars":
            return transformWithRecast(rng, hoistVariableDeclarations, source);
        case "hoist-funcs":
            return transformWithRecast(rng, hoistFunctionDeclarations, source);
        case "randomize-funcs":
            return transformWithRecast(rng, randomizeFunctionDeclarations, source);
        case "hoist-randomize-funcs":
            return transformWithRecast(rng, hoistAndRandomizeFunctionDeclarations, source);
        case "mangle-esmangle":
            let ast = esprima.parse(source, {
                loc: true,
                range: true,
                raw: true,
                tokens: true,
            });
            ast = esmangle.mangle(ast, null, {
                // destructive : true
            });
            // NOTE returned source map in result.map is not 1:1 even though it should be
            const result = escodegen.generate(ast, {
                sourceMap: "/original.js",
                sourceMapWithCode: true,
            });
            return [result.code, new IdentitySourceMap(source)];
        case "mangle-uglifyjs2":
            const result_uglify = UglifyJS.minify({
                "original.js": source
            }, {
                fromString: true,
                outSourceMap: true,
                mangle: true,
                compress: false, // disable simplifying statements etc., see http://lisperator.net/uglifyjs/compress
                output: {
                    beautify: true
                }
            });
            // NOTE returned source map in result.map is not 1:1 even though it should be
            // console.error(new SourceMapImpl(result_uglify.map).originalLines())
            // console.error(new SourceMapImpl(result_uglify.map).mappedLines())
            return [result_uglify.code, new IdentitySourceMap(source)];
    }
    return assertNever("unknown transformation");
}

function transformWithRecast(rng, astTransformer: (ast, rng) => any, source: string): [string, SourceMap] {
    const ast = recast.parse(source, { sourceFileName: `original.js` });
    const result = recast.print(astTransformer(ast, rng), {
        sourceMapName: `sourcemap.json`,
    });
    assert(result.code !== undefined && result.code !== null, "pretty printed AST is null or undefined");
    assert(result.map !== undefined && result.map !== null, "generated source map is null or undefined");
    return [result.code, new SourceMapImpl(result.map)];
}

function hoistFunctionDeclarations(ast) {
    const body = ast.program.body;
    ast.program.body = [
        ...body.filter(elem => elem.type === "FunctionDeclaration"),
        ...body.filter(elem => elem.type !== "FunctionDeclaration")
    ];
    return ast;
}

function hoistAndRandomizeFunctionDeclarations(ast, rng) {
    const body = ast.program.body;
    const functionDecls = body.filter(elem => elem.type === "FunctionDeclaration");
    const randomFunctionDecls = shuffle(rng, functionDecls);
    ast.program.body = [
        ...randomFunctionDecls,
        ...body.filter(elem => elem.type !== "FunctionDeclaration")
    ];
    return ast;
}

function randomizeFunctionDeclarations(ast, rng) {
    // make copy so we can assign ast.program.body new decls later without changing the old elements
    const oldBody = [...ast.program.body];
    const functionDeclIndices = oldBody
        .map((elem, index) => (elem.type === "FunctionDeclaration") ? index : -1)
        .filter(i => i != -1);
    const functionDeclIndicesShuffled = shuffle(rng, functionDeclIndices);
    for (const [oldIndex, newIndex] of zip2(functionDeclIndices, functionDeclIndicesShuffled)) {
        ast.program.body[newIndex] = oldBody[oldIndex];
    }
    return ast;
}

function hoistVariableDeclarations(ast) {
    const body = ast.program.body;
    ast.program.body = [
        ...body.filter(elem => elem.type === "VariableDeclaration"),
        ...body.filter(elem => elem.type !== "VariableDeclaration")
    ];
    return ast;
}