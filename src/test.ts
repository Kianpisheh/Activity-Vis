const arraysEquality = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const arr11: string[] = Array.from(new Set(arr1).values());
    const arr22: string[] = Array.from(new Set(arr2).values());
    const filteredArr1 = arr11.filter((el) => !arr22.includes(el));

    if (filteredArr1.length === 0) {
        return true;
    }

    return false;
};

let b = arraysEquality(["pot", "plate"], ["plate", "pot"]);
console.log(b);
