

const _0_100 = function (v) {
    return Math.floor(v / 127 * 100 + 0.5);
};

export const CC = {
    9: {
        name: "Type",
        mapping: null
    },
    102: {
        name: "Cycling Env Rise",
        mapping: _0_100
    }
};
