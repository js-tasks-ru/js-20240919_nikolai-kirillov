/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    if (param != 'asc' && param != 'desc') return
    const result = arr.toSorted(comparer);
    return param === 'desc' ? result.reverse() : result
}

export function comparer(a, b) {
    a = reverseCase(a);
    b = reverseCase(b);
    return a.localeCompare(b);
}

export function reverseCase(str) {
    let result = '';
    for (const char of str) {
        if (char === char.toUpperCase()) {
            result += char.toLowerCase();
        } else {
            result += char.toUpperCase();
        }
    }
    return result;
}