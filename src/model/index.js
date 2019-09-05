

const _0_100 = function (v) {
    return Math.floor(v / 127 * 100 + 0.5);
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
        mapping: null
    },
    [control.osc_type]: {
        name: "Type",
        mapping: null
    },
    [control.osc_wave]: {
        name: "Wave",
        mapping: null
    },
    [control.osc_timbre]: {
        name: "Timbre",
        mapping: null
    },
    [control.osc_shape]: {
        name: "Shape",
        mapping: null
    },
    [control.filter_cutoff]: {
        name: "Cutoff",
        mapping: null
    },
    [control.filter_resonance]: {
        name: "Resonance",
        mapping: null
    },
    [control.cycling_env_rise]: {
        name: "Rise",
        mapping: _0_100
    },
    [control.cycling_env_fall]: {
        name: "Fall",
        mapping: null
    },
    [control.cycling_env_hold]: {
        name: "Hold",
        mapping: null
    },
    [control.cycling_env_amount]: {
        name: "Amount",
        mapping: null
    },
    [control.arp_seq_rate_free]: {
        name: "Rate free",
        mapping: null
    },
    [control.arp_seq_rate_sync]: {
        name: "Rate sync",
        mapping: null
    },
    [control.lfo_rate_free]: {
        name: "Rate free",
        mapping: null
    },
    [control.lfo_rate_sync]: {
        name: "Rate sync",
        mapping: null
    },
    [control.envelope_attack]: {
        name: "Attack",
        mapping: null
    },
    [control.envelope_decay]: {
        name: "Decay",
        mapping: null
    },
    [control.envelope_sustain]: {
        name: "Sustain",
        mapping: null
    },
    [control.keyboard_hold_button]: {
        name: "Hold",
        mapping: null
    },
    [control.keyboard_spice]: {
        name: "Spice",
        mapping: null
    }
};
