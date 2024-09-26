/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = "asc") {
    const locales = ["ru", "en"];
    const options = { sensitivity: "variant", caseFirst: "upper" };
    const collator = new Intl.Collator(locales, options);
    const ascended = (a, b) => collator.compare(a, b);
    const descended = (a, b) => collator.compare(b, a);
    const result = param === "desc" ? arr.slice().sort(descended) : arr.slice().sort(ascended);
    return result;
}