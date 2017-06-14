import fs = require("fs-extra");
import path = require("path");

export function writeMap<K, V>(file: string, map: Map<K, V>) {
    fs.ensureDirSync(path.dirname(file));
    fs.writeFileSync(file, JSON.stringify([...map.entries()], null, 2));
}

export function readMap<K, V>(file: string): Map<K, V> {
    return new Map<K, V>(JSON.parse(fs.readFileSync(file, "utf8")));
}
