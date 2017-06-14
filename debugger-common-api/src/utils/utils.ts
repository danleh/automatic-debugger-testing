/**
 * Remove all occurrences of elementToRemove from array.
 * @param array where element is removed from (array is mutated)
 * @param elementToRemove
 * @return {boolean} true iff elementToRemove was removed at least once
 */
export function remove<T>(array: T[], elementToRemove: T): boolean {
    let index = 0;
    let elementFound = false;
    while ((index = array.indexOf(elementToRemove, index)) > -1) {
        elementFound = true;
        array.splice(index, 1);
    }
    return elementFound;
}

export function intersect<T1, T2>(a: Map<T1, T2>, b: Map<T1, T2>): Map<T1, T2> {
    // elements to strings for "deep equality" (very hacky but there doesn't seem to be a generic
    // way, see http://stackoverflow.com/questions/1068834/object-comparison-in-javascript)
    const aStrings = [...a].map((t: [T1, T2]) => JSON.stringify(t));
    const bStrings = [...b].map((t: [T1, T2]) => JSON.stringify(t));
    const intersectStrings = aStrings.filter((s: string) => bStrings.indexOf(s) !== -1);
    return new Map<T1, T2>(intersectStrings.map((s: string) => JSON.parse(s)));
}

export function zip2<T, U>(arr1: T[], arr2: U[]): [T, U][] {
    return arr1.map((t, i) => [t, arr2[i]] as [T, U])
}

export function lines(str: string): string[] {
    return str.split(/\r\n|\r|\n/);
}

/**
 * Assert execution should never reach this point.
 * See https://www.typescriptlang.org/docs/handbook/advanced-types.html for the never type.
 * Useful for exhaustiveness checking by the compiler etc.
 */
export function assertNever(message: string = "should be dead code"): never {
    throw new Error(message);
}

export function assert(condition: boolean, message: string = "assertion failed") {
    if (!condition) {
        throw new Error(message);
    }
}

export function compareNumbers(a: number, b: number): number {
    return a - b;
}

export function compareStrings(a: string, b: string): number {
    return a.localeCompare(b);
}

export function id<T>(x: T): T {
    return x;
}