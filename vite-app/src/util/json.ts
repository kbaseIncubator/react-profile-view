export type JSONScalarValue = string | number | boolean | null;

export type JSONValue = JSONScalarValue | JSONObject | JSONArray;

// export interface JSONObjectOf<T extends JSONValue> {
//     [x: string]: T;
// }

// export type JSONObject = JSONObjectOf<JSONValue>;
export interface JSONObject {
    [key: string]: JSONValue;
}

// export type JSONArrayOf<T extends JSONValue> = Array<T>;

export type JSONArray = Array<JSONValue>;

export interface JSONObjectOf<T extends JSONValue> {
    [x: string]: T;
}

export type JSONArrayOf<T extends JSONValue> = Array<T>;

export function isPlainObject(value: unknown): boolean {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    return Object.getPrototypeOf(value) === Object.prototype;
}

export function isJSONObject(value: unknown): value is JSONObject {
    return isJSONValue(value) && isPlainObject(value);
}

export function isJSONArray(value: unknown): value is JSONArray {
    return isJSONValue(value) && Array.isArray(value);
}

export function assertJSONObject(value: unknown, errorMessage?: string): asserts value is JSONObject {
    try {
        assertJSONValue(value);
    } catch (ex) {
        throw new Error(`${errorMessage ? errorMessage + ':' : ''}${ex instanceof Error ? ex.message : 'Unknown error'}`)
    }
    if (!isPlainObject(value)) {
        throw new Error(errorMessage || 'json value is not an object');
    }
}

export function assertJSONArray(value: unknown): asserts value is JSONArray {
    assertJSONValue(value);
    if (!Array.isArray(value)) {
        throw new Error('json value is not an array');
    }
}

export function assertJSONValue(value: unknown): asserts value is JSONValue {
    const typeOf = typeof value;
    if (['string', 'number', 'boolean'].indexOf(typeOf) >= 0) {
        return;
    }

    if (typeof value !== 'object') {
        throw new Error('not a valid JSON Value (not scalar, not object)')
    }
    if (value === null) {
        return;
    }
    if (Array.isArray(value)) {
        if (value.some((subvalue) => {
            return !isJSONValue(subvalue);
        })) {
            throw new Error('array does not contain valid JSON values');
        }
    }
    if (isPlainObject(value)) {
        const value2 = value as unknown as { [key: string]: unknown };
        if (Object.keys(value).some((key) => {
            return !isJSONValue(value2[key]);
        })) {
            throw new Error('object dos not contain valid JSON values');
        }
    }

    // throw new Error('not a valid JSON value');
}

export function isJSONValue(value: unknown): value is JSONValue {
    const typeOf = typeof value;
    if (['string', 'number', 'boolean'].indexOf(typeOf) >= 0) {
        return true;
    }

    if (typeof value !== 'object') {
        return false;
    }
    if (value === null) {
        return true;
    }
    if (Array.isArray(value)) {
        return !value.some((subvalue) => {
            return !isJSONValue(subvalue);
        });
    }
    if (isPlainObject(value)) {
        const value2 = value as unknown as { [key: string]: unknown };
        return !Object.keys(value).some((key) => {
            return !isJSONValue(value2[key]);
        });
    }

    return false;
}

export type PropPath = Array<string | number>

export function digJSON(
    value: JSONValue,
    propPath: PropPath,
    defaultValue?: JSONValue
): JSONValue {
    if (propPath.length === 0) {
        return value;
    }
    const [prop, ...rest] = propPath;
    switch (typeof prop) {
        case 'string':
            if (!(isJSONObject(value))) {
                throw new TypeError('Not an object');
            }
            return digJSON(value[prop], rest, defaultValue)
        case 'number':
            if (!(isJSONArray(value))) {
                throw new TypeError(`Not an array`);
            }
            return digJSON(value[prop], rest, defaultValue);
    }
}