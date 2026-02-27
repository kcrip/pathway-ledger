
const ITERATIONS = 1_000_000;

const initialVal = "Dishonest, Inconsiderate, Jealous";
const suggestion = "Selfish";
const suggestionExists = "Dishonest";

// Current implementation logic
const toggleSuggestionCurrent = (currentVal: string, suggestion: string): string => {
    const items = currentVal.split(',').map(i => i.trim()).filter(Boolean);

    let newVal;
    if (items.includes(suggestion)) {
      newVal = items.filter(i => i !== suggestion).join(', ');
    } else {
      newVal = [...items, suggestion].join(', ');
    }
    return newVal;
};

// Optimized implementation logic: Single pass
const toggleSuggestionOptimized2 = (currentVal: string, suggestion: string): string => {
    if (!currentVal) return suggestion;

    const parts = currentVal.split(',');
    const newParts: string[] = [];
    let found = false;

    for (let i = 0; i < parts.length; i++) {
        const p = parts[i].trim();
        if (!p) continue;

        if (p === suggestion) {
            found = true;
        } else {
            newParts.push(p);
        }
    }

    if (!found) {
        newParts.push(suggestion);
    }

    return newParts.join(', ');
};


console.log("Benchmarking...");

const startCurrent = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    toggleSuggestionCurrent(initialVal, suggestion);
    toggleSuggestionCurrent(initialVal, suggestionExists);
}
const endCurrent = performance.now();
console.log(`Current: ${(endCurrent - startCurrent).toFixed(2)}ms`);

const startOptimized = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    toggleSuggestionOptimized2(initialVal, suggestion);
    toggleSuggestionOptimized2(initialVal, suggestionExists);
}
const endOptimized = performance.now();
console.log(`Optimized (Single Pass): ${(endOptimized - startOptimized).toFixed(2)}ms`);

// Verify correctness
const r1 = toggleSuggestionCurrent(initialVal, suggestion);
const r2 = toggleSuggestionOptimized2(initialVal, suggestion);
if (r1 !== r2) {
    console.error("Mismatch add!", r1, "!==", r2);
}

const r3 = toggleSuggestionCurrent(initialVal, suggestionExists);
const r4 = toggleSuggestionOptimized2(initialVal, suggestionExists);
if (r3 !== r4) {
    console.error("Mismatch remove!", r3, "!==", r4);
}
