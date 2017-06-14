import { Binding } from "../debuggers/interface";

export function compareBindings(a: Binding, b: Binding): number {
    return a.name.localeCompare(b.name);
}

export function takeFirstBinding(bindings: Binding[]): Binding[] {
    // take first (== first binding instance) if multiple occurrences
    let result = [] as Binding[];
    const alreadyTaken = new Set<string>();
    for (let b of bindings) {
        if (!alreadyTaken.has(b.name)) {
            alreadyTaken.add(b.name);
            result.push(b);
        }
    }

    // sort by name
    return result.sort(compareBindings);
}
