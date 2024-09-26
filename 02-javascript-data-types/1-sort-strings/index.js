/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const result = arr.toSorted(comparer);
    return param === 'desc' ? result.reverse() : result
}

export function comparer(a, b) {
    const locales = ["ru", "en"];
    const options = { sensitivity: "variant", caseFirst: "upper" };
    return a.localeCompare(b, locales, options);
}