import React from "react";

const config = {
    value_min: 0.0,
    value_max: 100.0
};

function Background() {
    return (
        <rect
            x={0}
            y={0}
            width={100}
            height={100}
            stroke="#CFD8DC"
            fill="#CFD8DC"
        />
    );
}

function Track({ value }) {
    return (
        <rect
            x={0}
            y={100 - value}
            width={100}
            height={value}
            stroke="#42A5F5"
            fill="#42A5F5"
        />
    );
}

export default function Bar({ value, decimals }) {
    let v = 0;
    if (value < config.value_min) {
        v = config.value_min;
    } else if (value > config.value_max) {
        v = config.value_max;
    } else {
        v = value;
    }

    return (
        <div className="bar">
            <svg xmlns="http://www.w3.org/1999/xlink" viewBox="0 0 20 100">
                <Background />
                <Track value={v} />
            </svg>
        </div>
    );
}

Bar.defaultProps = {
    value: 0,
    decimal: 0
};
