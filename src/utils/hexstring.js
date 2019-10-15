
export const padZero = (str, len, char) => {
    let s = '';
    let c = char || '0';
    let n = (len || 2) - str.length;
    while (s.length < n) s += c;
    return s + str;
};

export const h = v => {
    // noinspection JSCheckFunctionSignatures
    return (v === null || v === undefined) ? "" : padZero(v.toString(16).toUpperCase(), 2);
};

export const hs = data => (data === null || data === undefined) ? "" : (Array.from(data).map(n => h(n))).join(" ");    // Array.from() is necessary to get a non-typed array
