/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export function pick(obj, ...fields) {
    const result = {}
    for (const el of fields) {
        if (obj[el]) result[el] = obj[el]
    }
    return result
}