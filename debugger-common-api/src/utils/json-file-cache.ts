import fs = require("fs-extra");
import path = require("path");
import crypto = require("crypto");

export class JsonFileCache<T> {

    /**
     * NOTE fromJson(toJson(result)) === result should hold (which, e.g., doesn't for
     * JSON.parse/JSON.stringify with ES2015 Maps).
     */
    constructor(private readonly cacheFile: string,
                private readonly toJson: (data: T) => any,
                private readonly fromJson: (json: any) => T) {
    }

    /**
     * Return (and save to cacheFile) result of computation if cacheFile doesn't exist or
     * input has changed.
     */
    async loadOrCompute(computation: () => Promise<T>, input: any): Promise<T> {
        if (fs.existsSync(this.cacheFile)) {
            const dataWithHash = this.loadFromFile();
            if (dataWithHash.hash === JsonFileCache.computeHash(input)) {
                return dataWithHash.data;
            }
        }

        const data = await computation();
        this.saveToFile(JsonFileCache.computeHash(input), data);
        return data;
    }

    private saveToFile(hash: string, data: T) {
        const dataWithHash = { hash, data: this.toJson(data) };
        fs.ensureDirSync(path.dirname(this.cacheFile));
        fs.writeFileSync(this.cacheFile, JSON.stringify(dataWithHash, null, 2));
    }

    private loadFromFile(): { hash: string, data: T } {
        const { hash, data } = JSON.parse(fs.readFileSync(this.cacheFile, "utf8"));
        return { hash, data: this.fromJson(data) };
    }

    private static computeHash(input: any): string {
        return crypto.createHash("sha256").update(input).digest("hex");
    }
}
