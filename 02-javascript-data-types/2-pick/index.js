/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export function pick(obj, ...fields) {
    const result = {};
    const object = arguments[0];
    const strings = [];
    for (const el of arguments) {
        strings.push(el);
    }
    strings.splice(0, 1);
    for (const el of strings) {
        if (object[el]) result[el] = object[el]
    }
    return result;
}