/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
    const arr = path.split('.');
    const func = (obj) => {
        let currentObj = obj;
        for (const el of arr) {
            if (!!currentObj && currentObj.hasOwnProperty(el)) {
                currentObj = currentObj[el];
            } else {
                return;
            }
        }
        return currentObj;
    }
    return func
}
