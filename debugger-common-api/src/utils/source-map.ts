import fs = require("fs");
const { SourceMapConsumer } = require("source-map");
import Set2 = require("set2");
import { compareNumbers, assert, lines } from "./utils";
import log = require("winston");

export abstract class SourceMap {
    originalToMappedLine(originalLine: number): number {
        const mappedLines = this.originalToMappedLines(originalLine);
        if (mappedLines.length > 1) {
            log.warn(`more than one mapping for original line ${originalLine} -> [${mappedLines.join(", ")}]`);
        }
        return mappedLines[0];
    }

    mappedToOriginalLine(mappedLine: number): number {
        const originalLines = this.mappedToOriginalLines(mappedLine);
        if (originalLines.length > 1) {
            log.warn(`more than one mapping for mapped line ${mappedLine} -> [${originalLines.join(", ")}]`);
        }
        return originalLines[0];
    }
    abstract originalToMappedLines(originalLine: number): number[]
    abstract mappedToOriginalLines(mappedLine: number): number[]
    abstract originalLines(): number[]
    abstract mappedLines(): number[]
    uniqueLines(): number[] {
        return this.originalLines()
            .filter(l => this.originalToMappedLines(l).length === 1)
            .filter(l => this.mappedToOriginalLines(this.originalToMappedLine(l)).length === 1);
    }
}

export class IdentitySourceMap extends SourceMap {
    constructor(private readonly source: string) {
        super();
    }

    originalToMappedLines(originalLine: number): number[] {
        return [originalLine];
    }

    mappedToOriginalLines(mappedLine: number): number[] {
        return [mappedLine];
    }

    originalLines(): number[] {
        return [...lines(this.source).keys()];
    }

    mappedLines(): number[] {
        return this.originalLines();
    }
}

export class SourceMapImpl extends SourceMap {
    private readonly mappings: [number, number][];

    static fromFile(filename: string): SourceMap {
        let fileContents = JSON.parse(fs.readFileSync(filename, "utf-8"));
        return new SourceMapImpl(fileContents);
    }

    constructor(sourceMap: any) {
        super();
        const sourceMapConsumer = new SourceMapConsumer(sourceMap);

        // NOTE use Set2 package not ES6 Set<[number, number]> because doesn't do deep equality
        const setOriginalMappedLine = new Set2;
        sourceMapConsumer.eachMapping(mapping => {
            setOriginalMappedLine.add(mapping.originalLine - 1, mapping.generatedLine - 1);
        });

        this.mappings = [...setOriginalMappedLine].sort((a, b) => a[0] - b[0]);
        // console.log(this.mappings);
    }

    originalToMappedLines(originalLine: number): number[] {
        assert(this.originalLines().indexOf(originalLine) !== -1, `cannot map original line ${originalLine}`);
        return this.mappings.filter(mapping => mapping[0] === originalLine).map(mapping => mapping[1]);
    }

    mappedToOriginalLines(mappedLine: number): number[] {
        assert(this.mappedLines().indexOf(mappedLine) !== -1, `cannot map mapped line ${mappedLine}`);
        return this.mappings.filter(mapping => mapping[1] === mappedLine).map(mapping => mapping[0]);
    }

    originalLines(): number[] {
        return [...new Set(this.mappings.map(mapping => mapping[0]))].sort(compareNumbers);
    }

    mappedLines(): number[] {
        return [...new Set(this.mappings.map(mapping => mapping[1]))].sort(compareNumbers);
    }
}
