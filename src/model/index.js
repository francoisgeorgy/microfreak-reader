import {getRightShift} from "../utils/bits-utils";

export const multibytesValue = (MSB, LSB, msb_byte, mask_msb, sign_byte, mask_sign) => {

    // if mask_sign is 0, sign is ignored

    // console.log("multibytesValue", h(MSB), h(LSB), h(msb_byte), h(mask_sign), h(mask_msb));

    let sign_bit = 0;
    if (mask_sign > 0) {
        const j = getRightShift(mask_sign);
        sign_bit = (sign_byte >> j) & 0x01;
    }

    const k = getRightShift(mask_msb);
    const msb_bit = (msb_byte >> k) & 0x01;

    // const neg = msb & 0x02;
    const high = (MSB & 0x7f) << 8;
    const mid  = LSB & 0x7f;
    const low = msb_bit << 7;
    const n = high + mid + low;
    // let f;
    let raw;
    if (sign_bit) {
        // const c2 = ((~n) & 0x7fff) + 1;
        // f = - (c2 * 1000 / 32768);
        raw = -(((~n) & 0x7fff) + 1)
    } else {
        // f = n * 1000 / 32768;
        raw = n;
    }

    return raw;
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
/*
const _0_100 = function (v) {
    return Math.floor(v / 127 * 100 + 0.5);
};
*/

// default mask for LSB and MSB : 0x7f
// default mask for MSB_lsb : 0x01
// default mask for sign in MSB_lsb : 0x02

export const DEFAULT_msb_mask = 0x01;
export const DEFAULT_sign_mask = 0x02;

// controls
export const OSC_TYPE = Symbol('OSC_TYPE');
export const OSC_WAVE = Symbol('OSC_WAVE');
export const OSC_TIMBRE = Symbol('OSC_TIMBRE');
export const OSC_SHAPE = Symbol('OSC_SHAPE');
export const FILTER_CUTOFF = Symbol('FILTER_CUTOFF');
export const FILTER_RESONANCE = Symbol('FILTER_RESONANCE');
export const CYCLING_ENV_RISE = Symbol('CYCLING_ENV_RISE');
export const CYCLING_ENV_RISE_SHAPE = Symbol('CYCLING_ENV_RISE_SHAPE');
export const CYCLING_ENV_FALL = Symbol('CYCLING_ENV_FALL');
export const CYCLING_ENV_FALL_SHAPE = Symbol('CYCLING_ENV_FALL_SHAPE');
export const CYCLING_ENV_HOLD = Symbol('CYCLING_ENV_HOLD');
export const CYCLING_ENV_AMOUNT = Symbol('CYCLING_ENV_AMOUNT');
export const ARP_SEQ_RATE_FREE = Symbol('ARP_SEQ_RATE_FREE');
export const ARP_SEQ_RATE_SYNC = Symbol('ARP_SEQ_RATE_SYNC');
export const ARP_SEQ_SWING = Symbol('ARP_SEQ_SWING');
export const LFO_RATE_FREE = Symbol('LFO_RATE_FREE');
export const LFO_RATE_SYNC = Symbol('LFO_RATE_SYNC');
export const ENVELOPE_ATTACK = Symbol('ENVELOPE_ATTACK');
export const ENVELOPE_DECAY = Symbol('ENVELOPE_DECAY');
export const ENVELOPE_SUSTAIN = Symbol('ENVELOPE_SUSTAIN');
export const GLIDE = Symbol('GLIDE');
export const SPICE = Symbol('SPICE');

// switches
export const FILTER_TYPE = Symbol('FILTER_TYPE');
export const AMP_MOD = Symbol('AMP_MOD');
export const CYCLING_ENV_MODE = Symbol('CYCLING_ENV_MODE');
export const LFO_SHAPE = Symbol('LFO_SHAPE');
export const LFO_SYNC = Symbol('LFO_SYNC');
export const ARP = Symbol('ARP');
export const SEQ = Symbol('SEQ');
export const ARP_SEQ_MOD = Symbol('ARP_SEQ_MOD');
export const ARP_SEQ_SYNC = Symbol('ARP_SEQ_SYNC');
export const PARAPHONIC = Symbol('PARAPHONIC');
export const OCTAVE = Symbol('OCTAVE');
export const HOLD = Symbol('HOLD');

// misc mod destination
export const LFO_DIVISION = Symbol('LFO_DIVISION');
export const LFO_RATE = Symbol('LFO_RATE');
export const PITCH = Symbol('PITCH');

// mod-matrix sources:
export const MOD_SRC_CYC_ENV = Symbol('MOD_SRC_CYC_ENV');
export const MOD_SRC_ENV = Symbol('MOD_SRC_ENV');
export const MOD_SRC_PRESS = Symbol('MOD_SRC_PRESS');
export const MOD_SRC_KEY_ARP = Symbol('MOD_SRC_KEY_ARP');
export const MOD_SRC_LFO = Symbol('MOD_SRC_LFO');

// // mod-matrix destinations not in control or switch:
export const ASSIGN1 = Symbol('ASSIGN1');
export const ASSIGN2 = Symbol('ASSIGN2');
export const ASSIGN3 = Symbol('ASSIGN3');

export const MOD_GROUP_OSC = Symbol('MOD_GROUP_OSC');
export const MOD_GROUP_FILTER = Symbol('MOD_GROUP_FILTER');
export const MOD_GROUP_CYCLING_ENV = Symbol('MOD_GROUP_CYCLING_ENV');
export const MOD_GROUP_ENVELOPE = Symbol('MOD_GROUP_ENVELOPE');
export const MOD_GROUP_LFO = Symbol('MOD_GROUP_LFO');
export const MOD_GROUP_ARP_SEQ = Symbol('MOD_GROUP_ARP_SEQ');  //TODO: define in MOD_ASSIGN_DEST
export const MOD_GROUP_KEYBOARD = Symbol('MOD_GROUP_KEYBOARD'); //TODO: define in MOD_ASSIGN_DEST
export const MOD_GROUP_MATRIX_PITCH = Symbol('MOD_GROUP_MATRIX_PITCH');
export const MOD_GROUP_MATRIX_WAVE = Symbol('MOD_GROUP_MATRIX_WAVE');
export const MOD_GROUP_MATRIX_TIMBRE = Symbol('MOD_GROUP_MATRIX_TIMBRE');
export const MOD_GROUP_MATRIX_CUTOFF = Symbol('MOD_GROUP_MATRIX_CUTOFF');
export const MOD_GROUP_MATRIX_ASSIGN1 = Symbol('MOD_GROUP_MATRIX_ASSIGN1');
export const MOD_GROUP_MATRIX_ASSIGN2 = Symbol('MOD_GROUP_MATRIX_ASSIGN2');
export const MOD_GROUP_MATRIX_ASSIGN3 = Symbol('MOD_GROUP_MATRIX_ASSIGN3');

// mapping utility
export const MOD_GROUP_MOD_DEST = {
    [PITCH]: MOD_GROUP_MATRIX_PITCH,
    [OSC_WAVE]: MOD_GROUP_MATRIX_WAVE,
    [OSC_TIMBRE]: MOD_GROUP_MATRIX_TIMBRE,
    [FILTER_CUTOFF]: MOD_GROUP_MATRIX_CUTOFF,
    [ASSIGN1]: MOD_GROUP_MATRIX_ASSIGN1,
    [ASSIGN2]: MOD_GROUP_MATRIX_ASSIGN2,
    [ASSIGN3]: MOD_GROUP_MATRIX_ASSIGN3,
}

// names (labels)
export const MOD_SOURCE = {
    [MOD_SRC_CYC_ENV] : 'Cyclic Env',
    [MOD_SRC_ENV]: 'Env',
    [MOD_SRC_LFO]: 'LFO',
    [MOD_SRC_PRESS]: 'Pressure',
    [MOD_SRC_KEY_ARP]: 'Key/Arp'
};

export const MOD_SOURCE_SHORT = {
    [MOD_SRC_CYC_ENV] : 'CycEnv',
    [MOD_SRC_ENV]: 'Env',
    [MOD_SRC_LFO]: 'LFO',
    [MOD_SRC_PRESS]: 'Press',
    [MOD_SRC_KEY_ARP]: 'Key/Arp'
};

export const MOD_SOURCE_CSS = {
    [MOD_SRC_CYC_ENV] : 'mod-src-cyc_env',
    [MOD_SRC_ENV]: 'mod-src-env',
    [MOD_SRC_LFO]: 'mod-src-lfo',
    [MOD_SRC_PRESS]: 'mod-src-press',
    [MOD_SRC_KEY_ARP]: 'mod-src-key_arp'
    // [MOD_GROUP_CYCLING_ENV]: 'mod-src-cyc_env',     // for ASSIGN
    // [MOD_GROUP_ENVELOPE]: 'mod-src-env',
    // [MOD_GROUP_LFO]: 'mod-src-lfo',
    // [MOD_GROUP_ARP_SEQ]: 'mod-src-key_arp',
    // [MOD_GROUP_KEYBOARD]: 'mod-src-press',
};

// names (labels)
// Mod Matrix desitnation row (name of columns)
export const MOD_MATRIX_DESTINATION = {
    [PITCH]: 'Pitch',
    [OSC_WAVE]: 'Wave',
    [OSC_TIMBRE]: 'Timbre',
    [FILTER_CUTOFF]: 'Cutoff',
    [ASSIGN1]: 'Assign 1',
    [ASSIGN2]: 'Assign 2',
    [ASSIGN3]: 'Assign 3'
};

// All mod destinations available
//TODO: add ENV
export const MOD_DESTINATION = {
    [PITCH]: 'Pitch',
    [OSC_WAVE]: 'Wave',
    [OSC_TIMBRE]: 'Timbre',
    [OSC_SHAPE]: 'Shape',
    [FILTER_CUTOFF]: 'Cutoff',
    [ASSIGN1]: 'Assign 1',
    [ASSIGN2]: 'Assign 2',
    [ASSIGN3]: 'Assign 3',
    [CYCLING_ENV_RISE]: 'Rise',
    [CYCLING_ENV_FALL]: 'Fall',
    [CYCLING_ENV_HOLD]: 'Hol',
    [CYCLING_ENV_AMOUNT]: 'Amount',
    [LFO_DIVISION]: 'Division',
    [LFO_RATE]: 'Rate',
    [MOD_SRC_CYC_ENV]: 'Mod CycEnv',
    [MOD_SRC_ENV]: 'Mod Env',
    [MOD_SRC_LFO]: 'Mod LFO',
    [MOD_SRC_PRESS]: 'Mod Press',
    [MOD_SRC_KEY_ARP]: 'Mod Key/Arp'
};


// names (labels)
export const MOD_GROUP_NAME = {
    [MOD_GROUP_OSC]: 'Osc',
    [MOD_GROUP_FILTER]: 'Filter',
    [MOD_GROUP_CYCLING_ENV]: 'CycEnv',
    [MOD_GROUP_ENVELOPE]: 'Env',
    [MOD_GROUP_LFO]: 'LFO',
    [MOD_GROUP_ARP_SEQ]: 'Arp/Seq',
    [MOD_GROUP_KEYBOARD]: 'Keyboard',
    [MOD_GROUP_MATRIX_PITCH]: 'Pitch',
    [MOD_GROUP_MATRIX_WAVE]: 'Wave',
    [MOD_GROUP_MATRIX_TIMBRE]: 'Timbre',
    [MOD_GROUP_MATRIX_CUTOFF]: 'Cutoff',
    [MOD_GROUP_MATRIX_ASSIGN1]: 'Assign1',
    [MOD_GROUP_MATRIX_ASSIGN2]: 'Assign2',
    [MOD_GROUP_MATRIX_ASSIGN3]: 'Assign3'
};

// mod-matrix assign destination configuration
// key is value in memory, read with the help of MOD_ASSIGN_SLOT
export const MOD_ASSIGN_DEST = {
    0x00: {
        mod_group: MOD_GROUP_OSC,
        control: {
            0: OSC_TYPE,
            3: OSC_TIMBRE,
            5: OSC_SHAPE
        }
    },
    0x01: {
        mod_group: MOD_GROUP_FILTER,
        control: {
            1: FILTER_CUTOFF,
            2: FILTER_RESONANCE
        }
    },
    0x02: {
        mod_group: MOD_GROUP_CYCLING_ENV,
        control: {
            1: CYCLING_ENV_RISE,
            3: CYCLING_ENV_FALL,
            4: CYCLING_ENV_HOLD,
            6: CYCLING_ENV_AMOUNT
        }
    },
    0x05: {
        mod_group: MOD_GROUP_LFO,
        control: {
            0: LFO_SHAPE,
            1: LFO_DIVISION,
            2: LFO_RATE
        }
    },
    0x06: {
        mod_group: MOD_GROUP_ENVELOPE,
        control: {
            1: ENVELOPE_ATTACK,
            2: ENVELOPE_DECAY,
            3: ENVELOPE_SUSTAIN
        }
    },
    0x0A: {
        mod_group: MOD_GROUP_MATRIX_PITCH,
        control: {
            0: MOD_SRC_CYC_ENV,    // MOD MATRIX SRC
            1: MOD_SRC_ENV,
            2: MOD_SRC_LFO,
            3: MOD_SRC_PRESS,
            4: MOD_SRC_KEY_ARP  //'Key/Arp'
        }
    },
    0x0B: {
        mod_group: MOD_GROUP_MATRIX_WAVE,
        control: {
            0: MOD_SRC_CYC_ENV,    // MOD MATRIX SRC
            1: MOD_SRC_ENV,
            2: MOD_SRC_LFO,
            3: MOD_SRC_PRESS,
            4: MOD_SRC_KEY_ARP
        }
    },
    0x0C: {
        mod_group: MOD_GROUP_MATRIX_TIMBRE,
        control: {
            0: MOD_SRC_CYC_ENV,    // MOD MATRIX SRC
            1: MOD_SRC_ENV,
            2: MOD_SRC_LFO,
            3: MOD_SRC_PRESS,
            4: MOD_SRC_KEY_ARP
        }
    },
    0x0D: {
        mod_group: MOD_GROUP_MATRIX_CUTOFF,
        control: {
            0: MOD_SRC_CYC_ENV,    // MOD MATRIX SRC
            1: MOD_SRC_ENV,
            2: MOD_SRC_LFO,
            3: MOD_SRC_PRESS,
            4: MOD_SRC_KEY_ARP
        }
    },
    0x0E: {
        mod_group: MOD_GROUP_MATRIX_ASSIGN1,
        control: {
            0: MOD_SRC_CYC_ENV,    // MOD MATRIX SRC
            1: MOD_SRC_ENV,
            2: MOD_SRC_LFO,
            3: MOD_SRC_PRESS,
            4: MOD_SRC_KEY_ARP
        }
    },
    0x0F: {
        mod_group: MOD_GROUP_MATRIX_ASSIGN2,
        control: {
            0: MOD_SRC_CYC_ENV,    // MOD MATRIX SRC
            1: MOD_SRC_ENV,
            2: MOD_SRC_LFO,
            3: MOD_SRC_PRESS,
            4: MOD_SRC_KEY_ARP
        }
    },
    0x10: {
        mod_group: MOD_GROUP_MATRIX_ASSIGN3,
        control: {
            0: MOD_SRC_CYC_ENV,    // MOD MATRIX SRC
            1: MOD_SRC_ENV,
            2: MOD_SRC_LFO,
            3: MOD_SRC_PRESS,
            4: MOD_SRC_KEY_ARP
        }
    }
};

// mod matrix assign slots configuration
// The values in memory at mod_group and control are to be used with the MOD_ASSIGN_DEST map.
export const MOD_ASSIGN_SLOT = {
    [ASSIGN1]: {
        mod_group: [21, 5],     // value is key for MOD_ASSIGN_DEST
        control: [21, 4]
    },
    [ASSIGN2]: {
        mod_group: [21, 19],
        control: [21, 18]
    },
    [ASSIGN3]: {
        mod_group: [22, 1],
        control: [21, 31]
    }
};

// [row, col] for data received when reading preset. Data does not include sysex header, sysex footer, man. id and constant data header
export const MOD_MATRIX = {
    // TODO: nibble
    [MOD_SRC_CYC_ENV]: {
        [PITCH]: {
            MSB: [22, 15],
            LSB: [22, 14],
            msb: [22, 8, 0x20],
            sign: [22, 8, 0x40]
        },
        [OSC_WAVE]: {
            MSB: [24, 3],
            LSB: [24, 2],
            msb: [24, 0, 0x02],
            sign: [24, 0, 0x04]
        },
        [OSC_TIMBRE]: {
            MSB: [25, 22],
            LSB: [25, 21],
            msb: [25, 16, 0x10],
            sign: [25, 16, 0x20]
        },
        [FILTER_CUTOFF]: {
            MSB: [27, 10],
            LSB: [27, 9],
            msb: [27, 8, 0x01],
            sign: [27, 8, 0x02]
        },
        [ASSIGN1]: {
            MSB: [28, 29],
            LSB: [28, 28],
            msb: [28, 24, 0x08],
            sign: [28, 24, 0x10]
        },
        [ASSIGN2]: {
            MSB: [30, 17],
            LSB: [30, 15],
            msb: [30, 8, 0x40],
            sign: [30, 16, 0x01]
        },
        [ASSIGN3]: {
            MSB: [32, 4],
            LSB: [32, 3],
            msb: [32, 0, 0x08],
            sign: [32, 0, 0x04]
        }
    },
    [MOD_SRC_ENV]: {
        [PITCH]: {              // OK
            MSB: [22, 25],
            LSB: [22, 23],
            msb: [22, 16, 0x40],
            sign: [22, 24, 0x01]
        },
        [OSC_WAVE]: {
            MSB: [24, 12],
            LSB: [24, 11],
            msb: [24, 8, 0x04],
            sign: [24, 8, 0x08]
        },
        [OSC_TIMBRE]: {
            MSB: [25, 31],
            LSB: [25, 30],
            msb: [25, 24, 0x20],
            sign: [25, 24, 0x40]
        },
        [FILTER_CUTOFF]: {
            MSB: [27, 19],
            LSB: [27, 18],
            msb: [27, 16, 0x02],
            sign: [27, 16, 0x04]
        },
        [ASSIGN1]: {
            MSB: [29, 6],
            LSB: [29, 5],
            msb: [29, 0, 0x10],
            sign: [29, 0, 0x20]
        },
        [ASSIGN2]: {
            MSB: [30, 26],
            LSB: [30, 25],
            msb: [30, 24, 0x01],
            sign: [30, 24, 0x02]
        },
        [ASSIGN3]: {
            MSB: [32, 13],
            LSB: [32, 12],
            msb: [32, 8, 0x10],
            sign: [32, 8, 0x08]
        }
    },
    [MOD_SRC_LFO]: {
        [PITCH]: {
            MSB: [23, 2],
            LSB: [23, 1],
            msb: [23, 0, 0x01],
            sign: [23, 0, 0x02]
        },
        [OSC_WAVE]: {
            MSB: [24, 21],
            LSB: [24, 20],
            msb: [24, 16, 0x08],
            sign: [24, 16, 0x10]
        },
        [OSC_TIMBRE]: {
            MSB: [26, 9],
            LSB: [26, 7],
            msb: [26, 0, 0x40],
            sign: [26, 8, 0x01]
        },
        [FILTER_CUTOFF]: {
            MSB: [27, 28],
            LSB: [27, 27],
            msb: [27, 24, 0x04],
            sign: [27, 24, 0x08]
        },
        [ASSIGN1]: {
            MSB: [29, 15],
            LSB: [29, 14],
            msb: [29, 8, 0x20],
            sign: [29, 8, 0x40]
        },
        [ASSIGN2]: {
            MSB: [31, 3],
            LSB: [31, 2],
            msb: [31, 0, 0x04],
            sign: [31, 0, 0x02]
        },
        [ASSIGN3]: {
            MSB: [32, 22],
            LSB: [32, 21],
            msb: [32, 16, 0x10],
            sign: [32, 16, 0x20]
        }
    },
    [MOD_SRC_PRESS]: {
        [PITCH]: {
            MSB: [23, 11],
            LSB: [23, 10],
            msb: [23, 8, 0x02],
            sign: [23, 8, 0x04]
        },
        [OSC_WAVE]: {
            MSB: [24, 30],
            LSB: [24, 29],
            msb: [24, 24, 0x10],
            sign: [24, 24, 0x20]
        },
        [OSC_TIMBRE]: {
            MSB: [26, 18],
            LSB: [26, 17],
            msb: [26, 16, 0x01],
            sign: [26, 16, 0x02]
        },
        [FILTER_CUTOFF]: {
            MSB: [28, 5],
            LSB: [28, 4],
            msb: [28, 0, 0x08],
            sign: [28, 0, 0x10]
        },
        [ASSIGN1]: {
            MSB: [29, 25],
            LSB: [29, 23],
            msb: [29, 16, 0x40],
            sign: [29, 24, 0x01]
        },
        [ASSIGN2]: {
            MSB: [31, 12],
            LSB: [31, 11],
            msb: [31, 8, 0x08],
            sign: [31, 8, 0x04]
        },
        [ASSIGN3]: {
            MSB: [32, 31],
            LSB: [32, 30],
            msb: [32, 24, 0x40],
            sign: [32, 24, 0x20]
        }
    },
    [MOD_SRC_KEY_ARP]: {
        [PITCH]: {
            MSB: [23, 20],
            LSB: [23, 19],
            msb: [23, 16, 0x04],
            sign: [23, 16, 0x08]
        },
        [OSC_WAVE]: {
            MSB: [25, 7],
            LSB: [25, 6],
            msb: [25, 0, 0x20],
            sign: [25, 0, 0x40]
        },
        [OSC_TIMBRE]: {
            MSB: [26, 27],
            LSB: [26, 26],
            msb: [26, 24, 0x02],
            sign: [26, 24, 0x04]
        },
        [FILTER_CUTOFF]: {
            MSB: [28, 14],
            LSB: [28, 13],
            msb: [28, 8, 0x10],
            sign: [28, 8, 0x20]
        },
        [ASSIGN1]: {
            MSB: [30, 2],
            LSB: [30, 1],
            msb: [30, 0, 0x01],
            sign: [30, 0, 0x02]
        },
        [ASSIGN2]: {
            MSB: [31, 21],
            LSB: [31, 20],
            msb: [31, 16, 0x10],
            sign: [31, 16, 0x08]
        },
        [ASSIGN3]: {
            MSB: [33, 9],
            LSB: [33, 7],
            msb: [33, 0, 0x40],
            sign: [33, 8, 0x01]
        }
    }
};

// if mod_group is defined, that means that the control can be a modulation destination
export const CONTROL = {
    [GLIDE]: {
        MSB: [6, 23],
        LSB: [6, 22],
        //sign: [0, 0, 0x02],
        msb: [6, 16, 0x20],
        cc: 5,
        mapping: null,
        name: "Glide",
        // group: MOD_GROUP_
    },
    [OSC_TYPE]: {
        MSB: null,
        LSB: [0, 14],
        msb: null,
        cc: 9,
        mapping: _osc_type,
        name: "Type",
        mod_group: MOD_GROUP_OSC
    },
    [OSC_WAVE]: {
        MSB: [0, 27],
        LSB: [0, 26],
        //sign: [0, 0, 0x02],
        msb: [0, 24, 0x10],
        cc: 10,
        mapping: null,
        name: 'Wave',
        mod_group: MOD_GROUP_OSC
    },
    [OSC_TIMBRE]: {
        MSB: [1, 7],
        LSB: [1, 6],
        //sign: [0, 0, 0x02],
        msb: [1, 0, 0x02],
        cc: 12,
        mapping: null,
        name: 'Timbre',
        mod_group: MOD_GROUP_OSC
    },
    [OSC_SHAPE]: {      // ok
        MSB: [1, 20],
        LSB: [1, 19],
        //sign: [0, 0, 0x02],
        msb: [1, 16, 0x04],
        cc: 13,
        mapping: null,
        name: 'Shape',
        mod_group: MOD_GROUP_OSC
    },
    [FILTER_CUTOFF]: {
        MSB: [2, 30],
        LSB: [2, 29],
        //sign: [0, 0, 0x02],
        msb: [2, 24, 0x10],
        cc: 23,
        mapping: null,
        name: 'Cutoff',
        mod_group: MOD_GROUP_FILTER
    },
    [FILTER_RESONANCE]: {
        MSB: [3, 9],
        LSB: [3, 7],
        //sign: [0, 0, 0x02],
        msb: [3, 0, 0x40],
        cc: 83,
        mapping: null,
        name: 'Resonance',
        mod_group: MOD_GROUP_FILTER
    },
    [CYCLING_ENV_RISE]: {
        MSB: [4, 6],
        LSB: [4, 5],
        //sign: [0, 0, 0x02],
        msb: [4, 0, 0x10],
        cc: 102,
        mapping: null,  //_0_100,
        name: 'Rise',
        mod_group: MOD_GROUP_CYCLING_ENV
    },
    [CYCLING_ENV_FALL]: {
        MSB: [5, 2],
        LSB: [5, 1],
        //sign: [0, 0, 0x02],
        msb: [5, 0, 0x01],
        cc: 103,
        mapping: null,
        name: 'Fall',
        mod_group: MOD_GROUP_CYCLING_ENV
    },
    [CYCLING_ENV_HOLD]: {
        MSB: [5, 12],
        LSB: [5, 11],
        //sign: [0, 0, 0x02],
        msb: [5, 8, 0x04],
        cc: 28,
        mapping: null,
        name: 'Hold',
        mod_group: MOD_GROUP_CYCLING_ENV
    },
    [CYCLING_ENV_AMOUNT]: {
        MSB: [6, 6],
        LSB: [6, 5],
        //sign: [0, 0, 0x02],
        msb: [6, 0, 0x10],
        cc: 24,
        mapping: null,
        name: 'Amount',
        mod_group: MOD_GROUP_CYCLING_ENV
    },
    [CYCLING_ENV_RISE_SHAPE]: {
        MSB: [4, 20],
        LSB: [4, 19],
        msb: [4, 16, 0x04],
        cc: 24,
        mapping: null,
        name: 'Rise shape'
    },
    [CYCLING_ENV_FALL_SHAPE]: {
        MSB: [5, 26],
        LSB: [5, 25],
        msb: [5, 24, 0x01],
        cc: 24,
        mapping: null,
        name: 'Fall shape'
    },
    [ARP_SEQ_RATE_FREE]: {
        MSB: [10, 5],
        LSB: [10, 4],
        msb: [10, 0, 0x08],
        cc: 91,
        mapping: null,
        name: 'Rate free'
    },
    [ARP_SEQ_RATE_SYNC]: {
        MSB: [9, 27],
        LSB: [9, 26],
        msb: [9, 24, 0x02],
        cc: 92,
        mapping: null,
        name: 'Rate sync'
    },
    [ARP_SEQ_SWING]: {
        MSB: [10, 17],
        LSB: [10, 15],
        msb: [19, 8, 0x40],
        cc: 0,
        mapping: null,  // 50%..75%
        name: 'Swing'
    },
    [LFO_RATE_FREE]: {
        MSB: [13, 10],
        LSB: [13, 9],
        msb: [13, 8, 0x01],
        cc: 93,
        mapping: null,
        name: 'Rate free'
    },
    [LFO_RATE_SYNC]: {
        MSB: [12, 31],
        LSB: [12, 30],
        msb: [12, 24, 0x20],
        cc: 94,
        mapping: null,
        name: 'Rate sync'
    },
    [ENVELOPE_ATTACK]: {
        MSB: [14, 29],
        LSB: [14, 28],
        // sign: [1, 0x02],
        msb: [14, 24, 0x08],
        cc: 105,
        mapping: null,
        name: 'Attack',
        mod_group: MOD_GROUP_ENVELOPE
    },
    [ENVELOPE_DECAY]: {
        MSB: [15, 10],
        LSB: [15, 9],
        //sign: [0, 0, 0x02],
        msb: [15, 8, 0x01],
        cc: 106,
        mapping: null,
        name: 'Decay/Rel',
        mod_group: MOD_GROUP_ENVELOPE
    },
    [ENVELOPE_SUSTAIN]: {
        MSB: [15, 23],
        LSB: [15, 22],
        //sign: [0, 0, 0x02],
        msb: [15, 16, 0x20],
        cc: 29,
        mapping: null,
        name: 'Sustain',
        mod_group: MOD_GROUP_ENVELOPE
    },
    // [HOLD]: {
    //     MSB: [0, 0],
    //     LSB: [0, 0],
    //     //sign: [0, 0, 0x02],
    //     msb: [0, 0, 0x01],
    //     cc: 64,
    //     mapping: null,
    //     name: 'Hold'
    // },
    [SPICE]: {
        MSB: [0, 0],
        LSB: [0, 0],
        //sign: [0, 0, 0x02],
        msb: [0, 0, 0x01],
        cc: 2,
        mapping: null,
        name: 'Spice'
    }
};

export const SWITCH = {
    [FILTER_TYPE]: {
        MSB: [2, 18],
        LSB: [2, 17],
        msb: [2, 16, 0x01],
        values: [
            {name: 'LPF', value: 0},
            {name: 'BPF', value: 0x4000},
            {name: 'HPF', value: 0x7fff}
        ],
        name: "Filter type"
    },
    [AMP_MOD]: {
        MSB: [14, 17],
        LSB: [14, 15],
        msb: [14, 8, 0x40],
        values: [
            {name: 'Off', value: 0},
            {name: 'On', value: 0x7fff}
        ],
        name: "Amp mod"
    },
    [CYCLING_ENV_MODE]: {
        MSB: [3, 25],
        LSB: [3, 23],
        msb: [3, 16, 0x40],
        values: [
            {name: 'Env', value: 0},
            {name: 'Run', value: 0x4000},
            {name: 'Loop', value: 0x7fff}
        ],
        name: "Mode"
    },
    [LFO_SHAPE]: {
        MSB: [12, 22],
        LSB: [12, 21],
        msb: [12, 16, 0x10],
        values: [
            {name: 'Sine', value: 0},
            {name: 'Tri', value: 0x1999},
            {name: 'Saw', value: 0x3333},
            {name: 'Sqa', value: 0x4ccc},
            {name: 'SnH', value: 0x6666},
            {name: 'SnHF', value: 0x7fff}
        ],
        name: "Shape",
        mod_group: MOD_GROUP_LFO
    },
    [ARP]: {
        MSB: [9, 6],
        LSB: [9, 5],
        msb: [9, 0, 0x10],
        values: [
            {name: 'Off', value: 0},
            {name: 'On', value: 0x7fff}
        ],
        name: "Arp"
    },
    [SEQ]: {
        MSB: [12, 5],
        LSB: [12, 4],
        msb: [12, 0, 0x08],
        values: [
            {name: 'Off', value: 0},
            {name: 'On', value: 0x7fff}
        ],
        name: "Seq"
    },
    [ARP_SEQ_MOD]: {
        MSB: [9, 18],
        LSB: [9, 17],
        msb: [9, 16, 0x01],
        values: [
            {name: '1', value: 17408},
            {name: '2', value: 10922},
            {name: '3', value: 21845},
            {name: '4', value: 0x7fff}
        ],
        name: "Mod"
    },
    [ARP_SEQ_SYNC]: {   //TODO
        MSB: [10, 27],
        LSB: [10, 26],
        msb: [10, 24, 0x02],
        values: [
            {name: 'Off', value: 0},
            {name: 'On', value: 0x7fff}
        ],
        name: "Sync"
    },
    [LFO_SYNC]: {
        MSB: [13, 20],
        LSB: [13, 19],
        msb: [13, 16, 0x04],
        values: [
            {name: 'Off', value: 0},
            {name: 'On', value: 0x7fff}
        ],
        name: "Sync"
    },
    [PARAPHONIC]: {
        MSB: [16, 23],
        LSB: [16, 22],
        msb: [16, 16, 0x20],
        values: [
            {name: 'Off', value: 0},
            {name: 'On', value: 0x7fff}
        ],
        name: "Paraphonic"
    },
    [OCTAVE]: {
        MSB: [7, 4],
        LSB: [7, 3],
        msb: [7, 0, 0x04],
        // mapping: _octave,
        values: [
            {name: '-3', value: 0},
            {name: '-2', value: 0x1555},
            {name: '-1', value: 0x2aaa},
            {name: '0', value: 0x4000},
            {name: '+1', value: 0x5555},
            {name: '+2', value: 0x6aaa},
            {name: '+3', value: 0x7fff}
        ],
        name: "Octave"
    },
    [HOLD]: {   //TODO
        MSB: [0, 0],
        LSB: [0, 0],
        msb: [0, 0, 0],
        values: [
            {name: 'Off', value: 0},
            {name: 'On', value: 0x7fff}
        ],
        name: 'Hold'
    }
};
