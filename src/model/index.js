

const _0_100 = function (v) {
    return Math.floor(v / 127 * 100 + 0.5);
};


const _osc_type = function (v) {
    switch (v) {
        case 10:
            return "Basic Waves";
        case 21:
            return "Superwave";
        case 32:
            return "Wavetable";
        case 42:
            return "Harmonic";
        case 53:
            return "KarplusStrong";
        case 64:
            return "V. Analog";
        case 74:
            return "Waveshaper";
        case 85:
            return "Two Op. FM";
        case 95:
            return "Formant";
        case 106:
            return "Chords";
        case 117:
            return "Speech";
        case 127:
            return "Modal";
        default:
            return v;
    }
};


export const control = {
    "glide" : 5,
    "osc_type" : 9,
    "osc_wave" : 10,
    "osc_timbre" : 12,
    "osc_shape" : 13,
    "filter_cutoff" : 23,
    "filter_resonance" : 83,
    "cycling_env_rise" : 102,
    "cycling_env_fall" : 103,
    "cycling_env_hold" : 28,
    "cycling_env_amount" : 24,
    "arp_seq_rate_free" : 91,
    "arp_seq_rate_sync" : 92,
    "lfo_rate_free" : 93,
    "lfo_rate_sync" : 94,
    "envelope_attack" : 105,
    "envelope_decay" : 106,
    "envelope_sustain" : 29,
    "keyboard_hold_button" : 64,
    "keyboard_spice" : 2,
    // "Keyboard Pitch Bend	Pitchbend,
    // "Keyboard Pressure	Aftertouch,
};

export const control_details = {
    [control.glide]: {
        name: "Glide",
        mapping: _0_100
    },
    [control.osc_type]: {
        name: "Type",
        mapping: _osc_type
    },
    [control.osc_wave]: {
        name: "Wave",
        mapping: _0_100
    },
    [control.osc_timbre]: {
        name: "Timbre",
        mapping: _0_100
    },
    [control.osc_shape]: {
        name: "Shape",
        mapping: _0_100
    },
    [control.filter_cutoff]: {
        name: "Cutoff",
        mapping: _0_100
    },
    [control.filter_resonance]: {
        name: "Resonance",
        mapping: _0_100
    },
    [control.cycling_env_rise]: {
        name: "Rise",
        mapping: _0_100
    },
    [control.cycling_env_fall]: {
        name: "Fall",
        mapping: _0_100
    },
    [control.cycling_env_hold]: {
        name: "Hold",
        mapping: _0_100
    },
    [control.cycling_env_amount]: {
        name: "Amount",
        mapping: _0_100
    },
    [control.arp_seq_rate_free]: {
        name: "Rate free",
        mapping: _0_100
    },
    [control.arp_seq_rate_sync]: {
        name: "Rate sync",
        mapping: _0_100
    },
    [control.lfo_rate_free]: {
        name: "Rate free",
        mapping: _0_100
    },
    [control.lfo_rate_sync]: {
        name: "Rate sync",
        mapping: _0_100
    },
    [control.envelope_attack]: {
        name: "Attack",
        mapping: _0_100
    },
    [control.envelope_decay]: {
        name: "Decay/Rel",
        mapping: _0_100
    },
    [control.envelope_sustain]: {
        name: "Sustain",
        mapping: _0_100
    },
    [control.keyboard_hold_button]: {
        name: "Hold",
        mapping: _0_100
    },
    [control.keyboard_spice]: {
        name: "Spice",
        mapping: _0_100
    }
};
