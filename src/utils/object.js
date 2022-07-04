export const isObject = (target) => target && typeof target === 'object';

export const renameProp = (oldProp, newProp, { [oldProp]: old, ...others }) => ({
    [newProp]: old,
    ...others,
});


/**
 * Clone an object
 * @param {Object} obj 
 * @returns {Object} The cloned object.
 */
export const copyObject = (obj) => {
    if (!isObject(obj)) return obj;
    if (obj instanceof Array) return [...obj];
    return { ...obj };
};

// copy an object omit some keys
export const omitObject = (obj, omitKeys) => {
    if (!isObject(obj)) return obj;
    if (obj instanceof Array) return [...obj];
    const newObj = { ...obj };
    omitKeys.forEach((key) => newObj[key] && delete newObj[key]);
    return newObj;
};

export const isObjectEmpty = (obj) => {
    return obj ? Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype : true;
};
