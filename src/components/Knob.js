import React from "react";
import "./Knob.css";

const HALF_WIDTH = 50; // viewBox/2
const HALF_HEIGHT = 50; // viewBox/2

const config = {
    value_min: -100.0,
    value_max: 100.0,

    // position:
    zero_at: 270.0, // [deg] (polar) the 0 degree will be at 270 polar degrees (6 o'clock).
    angle_min: 30.0, // [deg] Angle in knob coordinates (0 at 6 0'clock)
    angle_max: 330.0, // [deg] Angle in knob coordinates (0 at 6 0'clock)

    // background disk:
    bg_radius: 32,
    bg_border_width: 1,

    // track background:
    track_bg_radius: 40,
    track_bg_width: 8,

    // track:
    track_radius: 40,
    track_width: 8,

    // cursor
    cursor_radius: 18, // same unit as radius
    cursor_length: 10,
    cursor_width: 4,

    // text displayed in the middle of the knob:
    value_text: true,
    value_position: 50, //HALF_HEIGHT + 8, // empirical value: HALF_HEIGHT + config.font_size / 3
    font_family: "sans-serif",
    font_size: 25,
    font_weight: "bold",

    class_bg: "knob-bg",
    class_track_bg: "knob-track-bg",
    class_track: "knob-track",
    class_value: "knob-value",
    class_cursor: "knob-cursor"
};

/**
 * Return polar coordinates angle from our "knob coordinates" angle
 */
function knobToPolarAngle(angle) {
    const a = config.zero_at - angle;
    return a < 0 ? a + 360.0 : a;
}

/**
 * Return viewBox X,Y coordinates
 * @param angle in [degree] (polar, 0 at 3 o'clock)
 * @param radius; defaults to config.radius
 * @returns {{x: number, y: number}}
 */
function getViewboxCoord(angle, radius) {
    const a = (angle * Math.PI) / 180.0;
    const r = radius === undefined ? config.track_radius : radius;
    return {
        x: HALF_WIDTH + Math.cos(a) * r,
        y: HALF_HEIGHT - Math.sin(a) * r
    };
}

/**
 *
 * @param from_angle in [degree] in knob's coordinates
 * @param to_angle in [degree] in knob's coordinates
 * @param radius
 */
function getArc(from_angle, to_angle, radius) {
    // SVG d: "A rx,ry xAxisRotate LargeArcFlag,SweepFlag x,y".
    // SweepFlag is either 0 or 1, and determines if the arc should be swept in a clockwise (1), or anti-clockwise (0) direction
    // ref: https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/d

    let a0 = knobToPolarAngle(from_angle);
    let a1 = knobToPolarAngle(to_angle);

    // Little trick to force a full arc (360deg) when from=0 and to=360.
    // We make sure that x1 will be different than x0 within the path definition.
    if (from_angle !== to_angle) {
        a0 -= 0.0001;
        a1 += 0.0001;
    }

    const { x: x0, y: y0 } = getViewboxCoord(a0, radius);
    const { x: x1, y: y1 } = getViewboxCoord(a1, radius);

    const delta_angle = (a0 - a1 + 360.0) % 360.0;
    const large_arc = delta_angle < 180.0 ? 0 : 1;
    const arc_direction = 1;

    return `M ${x0},${y0} A ${radius},${radius} 0 ${large_arc},${arc_direction} ${x1},${y1}`;
}

function ValueText({ value, decimals }) {
    console.log("ValueText", value);
    const path = getArc(
        config.angle_min,
        config.angle_max,
        config.track_bg_radius
    );
    return (
        <text
            d={path}
            x={HALF_WIDTH}
            y={config.value_position}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#000"
        >
            {value.toFixed(decimals)}
        </text>
    );
}

function Background() {
    return (
        <path
            d={getArc(
                config.angle_min,
                config.angle_max,
                config.track_bg_radius
            )}
            stroke="#CFD8DC"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="butt"
            className="knob-track-bg"
        />
    );
}

function Track({ value }) {
    const angle =
        ((value - config.value_min) / (config.value_max - config.value_min)) *
        (config.angle_max - config.angle_min) +
        config.angle_min;
    return (
        <path
            d={getArc(config.angle_min, angle, config.track_radius)}
            stroke="#42A5F5"
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="butt"
            className="knob-track"
        />
    );
}

export default function Knob({ value, decimals }) {
    let v = 0;
    if (value < config.value_min) {
        v = config.value_min;
    } else if (value > config.value_max) {
        v = config.value_max;
    } else {
        v = value;
    }

    return (
        <div className="knob">
            <svg xmlns="http://www.w3.org/1999/xlink" viewBox="0 0 100 100">
                <Background />
                <Track value={v} />
                <ValueText value={v} decimals={decimals} />
            </svg>
        </div>
    );
}

Knob.defaultProps = {
    value: 0,
    decimal: 0
};
