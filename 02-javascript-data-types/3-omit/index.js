/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export function omit(obj, ...fields) {
    for (const el of fields) {
        if (obj[el]) delete obj[el]
    }
    return obj
}
