/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export function omit(obj, ...fields) {
    const object = arguments[0];
    const strings = [];
    for (const el of arguments) {
        strings.push(el);
    }
    strings.splice(0, 1);
    for (const el of strings) {
        if (object[el]) delete object[el]
    }
    return object;
}
