import {computed, decorate, observable} from 'mobx';
import {PORT_INPUT, PORT_OUTPUT} from "../components/Midi";
import {
    ASSIGN1,
    ASSIGN2,
    ASSIGN3,
    DEFAULT_msb_mask,
    DEFAULT_sign_mask,
    MOD_ASSIGN_DEST,
    MOD_ASSIGN_SLOT,
    MOD_MATRIX_DESTINATION,
    MOD_MATRIX,
    multibytesValue,
    MOD_DESTINATION,
    MOD_GROUP_NAME,
    MOD_SRC_CYC_ENV,
    MOD_SRC_KEY_ARP,
    MOD_SRC_PRESS,
    MOD_SRC_LFO,
    MOD_SRC_ENV
} from "../model";
import {portById} from "../utils/midi";
import {h, hs} from "../utils/hexstring";

class State {

    // preset = new Array(127).fill(0);

    // The number of the currently displayed preset
    preset_number = null;

    // The preset number used in MIDI
    preset_number_comm = null;

    // All the presets
    // This is an array of {name: String; data: []}
    presets = [];

    // preset = {
    //     current: 1,
    //     reference: null,
    //     current_counter: 0
    // };

    lock = false;   // Used during preset reading to prevent concurrent reads.

    read_progress = 0;

    // data = [];
    // dataRef = [];   // copy used as reference for comparisons

    // data_name = [0x01, 0x65, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x65, 0x00, 0x00, 0x10, 0x44, 0x69, 0x73, 0x72, 0x65, 0x73, 0x70, 0x65, 0x63, 0x74, 0x66];
    // data_name = null;

    // all = [];       // array of data
    // all_name = [];  // array of data_name

    midi = {
        ports: {},
    };


    bytesToName(data) {
        // if (!this.all_name[n]) {
        //     return '';
        // }
        // const data = this.all_name[n];
        let s = '';
        let i = 12;
        while (i < data.length && data[i] !== 0) {
            s += String.fromCharCode(data[i]);
            i++;
        }
        return s;
    }

    importData(message_bytes) {

        //TODO: extract preset num: NOT POSSIBLE, preset num is not in the answers

        if (!this.presets[this.preset_number_comm]) {
            this.presets[this.preset_number_comm] = {name: null, data:[]};
        }

        //
        // Store PRESET NAME:
        //
        if (message_bytes.data[8] === 0x52) {
            // console.log("answer 0x52 contains name", hs(message_bytes.data));
            // state.data_name = Array.from(message_bytes.data.slice(9, message_bytes.data.length - 1));    // message_bytes.data is UInt8Array
            this.presets[this.preset_number_comm].name = this.bytesToName(Array.from(message_bytes.data.slice(9, message_bytes.data.length - 1)));    // message_bytes.data is UInt8Array
            return;
        }

/*
        if (message_bytes.data[8] === 0x16) {
            // console.log("answer 0x16 is dump packet", hs(message_bytes.data));
        } else if (message_bytes.data[8] === 0x17) {
            // console.log("answer 0x17 is last dump packet", hs(message_bytes.data));
        } else {
            if (global.dev) console.warn(`answer 0x${h(message_bytes.data[8])} is unknown type`, hs(message_bytes.data));
        }
*/
        if (message_bytes.data[8] === 0x16 || message_bytes.data[8] === 0x17) {
            if (global.dev) console.warn(`answer 0x${h(message_bytes.data[8])} is unknown type`, hs(message_bytes.data));
        }

        if (message_bytes.data.length !== 42) {
            if (global.dev) console.log("do not store answer", hs(message_bytes.data));
            return;
        }

        // console.log("store sysex data");

        //
        // Store PRESET DATA:
        // TODO: move into store:
        this.presets[this.preset_number_comm].data.push(Array.from(message_bytes.data.slice(9, message_bytes.data.length - 1)));    // message_bytes.data is UInt8Array
    }

    /**
     * Copy preset from all[] to data[]
     * @param n
     */
    loadPreset(n) {
        // if (this.all[n] && this.all[n].length) {
        //     this.data = this.all[n];
        //     this.data_name = this.all_name[n];
        //     this.preset.reference = n;
        // }
    }

    addPort(port) {
        // eslint-disable-next-line
        if (this.midi.ports.hasOwnProperty(port.id) && this.midi.ports[port.id] !== null) {
            // already registered
            return false;
        }
        if (global.dev) console.log('State.addPort', port.type, port.name, port.id);
        this.midi.ports[port.id] = {
            type: port.type,
            name: port.name,
            manufacturer: port.manufacturer,
            enabled: false
            // minimized: false,   // TODO
            // nb_messages: 0,
            // solo: false,        // TODO
            // color: null,        // TODO
            // muted: false,       // TODO
            // hidden: false       // TODO
        };
        return true;
    }

    removePort(port_id) {
        if (global.dev) console.log('State.removePort', port_id);
        // delete this.midi.ports[port.id];    // do not use delete with mobx; see https://github.com/mobxjs/mobx/issues/822
        this.midi.ports[port_id] = null;
    }

    removeAllPorts() {
        if (global.dev) console.log('State.removeAllPorts');
        // delete this.midi.ports[port.id];    // do not use delete with mobx; see https://github.com/mobxjs/mobx/issues/822
        this.midi.ports = {};
    }

    enablePort(port_id) {
        if (this.midi.ports[port_id]) {
            this.midi.ports[port_id].enabled = true;
        }
    }

    disablePort(port_id) {
        // this.midi.input = null;
        if (this.midi.ports[port_id]) {
            this.midi.ports[port_id].enabled = false;
            // this.midi.ports[port_id].solo = false;
            // this.midi.ports[port_id].muted = false;
        }
    }

    /**
     *
     * @param port
     * @param messageType only used if port is input
     * @param onMidiInputEvent only used if port is input
     */
    connectPort(port, messageType = null, onMidiInputEvent = null) {
        if (global.dev) console.log(`Midi.connectPort: ${port.type} ${port.id} ${port.name}`);
        if (port.type === PORT_INPUT) {
            if (port.hasListener(messageType, 'all', onMidiInputEvent)) {
                if (global.dev) console.warn(`Midi.connectPort: ${port.id} ${port.name} : ${messageType} messages on all channels listener already connected`);
            } else {
                if (global.dev) console.log(`Midi.connectPort: ${port.id} ${port.name} : add listener for ${messageType} messages on all channels`);
                port.addListener(messageType, 'all', onMidiInputEvent);
            }
        }

        // there is nothing else to do to "connect" an OUTPUT port.

        this.enablePort(port.id);

        // if (global.dev) console.log(`Midi.connectPort: set input input_device_id=${port.id} in preferences`);
        // savePreferences({input_device_id: port.id});
    }

    disconnectPort(port, updatePreferences=false) {
        if (port) {     // port is probably already null
            if (global.dev) console.log(`Midi.disconnectPort: ${port.type} ${port.id} ${port.name}`);
            if (port.type === PORT_INPUT) {
                if (port.removeListener) port.removeListener();
            }

            // there is nothing to do to "connect" an OUTPUT port.

            this.disablePort(port.id);

            // if (global.dev) console.log(`Midi.connectInput: connect input set input_device_id=null in preferences`);
            // if (updatePreferences) savePreferences({input_device_id: null});
        }
    }

    disconnectAllInputPorts(updatePreferences=false) {
        for (const port_id of Object.keys(this.midi.ports)) {
            if (this.midi.ports[port_id].type === PORT_INPUT) {
                this.disconnectPort(portById(port_id));
            }
        }
    }

    disconnectAllOutputPorts(updatePreferences=false) {
        for (const port_id of Object.keys(this.midi.ports)) {
            if (this.midi.ports[port_id].type === PORT_OUTPUT) {
                this.disconnectPort(portById(port_id));
            }
        }
    }

    disconnectAllPorts(updatePreferences=false) {
        if (global.dev) console.log('Midi.disconnectAllPorts');
        // for (let port of this.midi.ports) {
        //     this.disconnectPort(port);
        // }
        for (const port_id of Object.keys(this.midi.ports)) {
            this.disconnectPort(portById(port_id));
        }
    }

    /**
     * Returns true if at least one input is enabled
     */
    hasInputEnabled() {
        for (const port_id of Object.keys(this.midi.ports)) {
            if (this.midi.ports[port_id] && this.midi.ports[port_id].type === PORT_INPUT && this.midi.ports[port_id].enabled) return true;
        }
        return false;
    }

    /**
     * Returns true if at least one output is enabled
     */
    hasOutputEnabled() {
        for (const port_id of Object.keys(this.midi.ports)) {
            if (this.midi.ports[port_id] && this.midi.ports[port_id].type === PORT_OUTPUT && this.midi.ports[port_id].enabled) return true;
        }
        return false;
    }

    hasInputAndOutputEnabled() {
        return this.hasInputEnabled() && this.hasOutputEnabled();
    }

/*
    updateRef() {
        // console.log("updateRef: copy current to reference", JSON.stringify(this.data), JSON.stringify(this.dataRef));
        this.dataRef = JSON.parse(JSON.stringify(this.data));
        this.preset.reference = this.preset.current;
        // console.log(JSON.stringify(this.data), JSON.stringify(this.dataRef));
    }

    clearRef() {
        this.dataRef = [];
    }
*/

    controlValue(m, return_raw=false) {

        // const D = this.props.state.data;
        // console.log("m", m, D.length);

        if (!this.presets[this.preset_number]) {
            return 0;
        }
        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return 0;  //FIXME

        let raw;
        if (m.MSB) {
            const mask_msb = m.msb.length === 3 ? m.msb[2] : DEFAULT_msb_mask;
            // const mask_sign = m.sign.length === 3 ? m.sign[2] : DEFAULT_sign_mask;
            raw = multibytesValue(
                data[m.MSB[0]][m.MSB[1]],
                data[m.LSB[0]][m.LSB[1]],
                data[m.msb[0]][m.msb[1]],
                mask_msb,
                0, 0);
        } else {
            raw = data[m.LSB[0]][m.LSB[1]];
        }

        return return_raw ? raw : (Math.round(raw * 1000 / 32768) / 10);
    }

    switchValue(m, return_raw=false) {

        // const D = this.props.state.data;
        // console.log("m", m, D.length);
        if (!this.presets[this.preset_number]) {
            return 0;
        }
        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return 0;  //FIXME

        const mask_msb = m.msb.length === 3 ? m.msb[2] : DEFAULT_msb_mask;
        // const mask_sign = m.sign.length === 3 ? m.sign[2] : DEFAULT_sign_mask;

        const raw = multibytesValue(
            data[ m.MSB[0] ][ m.MSB[1] ],
            data[ m.LSB[0] ][ m.LSB[1] ],
            data[ m.msb[0] ][ m.msb[1] ],
            mask_msb,
            0, 0);

        // return Math.round(raw * 1000 / 32768) / 10;

        // return m.mapping ? m.mapping(raw) : raw;

        if (return_raw) {
            return raw;
        } else {
            for (let entry of m.values) {
                // console.log("_lfo_shape", v, entry.value, entry.name);
                if (raw <= entry.value) return entry.name;
            }
            return raw;
        }
    }

    /**
     *
     * @param src key from MOD_SOURCE
     * @param dest key from MOD_DESTINATION
     * @param return_raw
     * @returns {number}
     */
    modMatrixValue(src, dest, return_raw=false) {

        if (!this.presets[this.preset_number]) {
            return 0;
        }
        const data = this.presets[this.preset_number].data;

        // const D = this.props.state.data;
        // console.log("m", m, D.length);
        if (data.length < 39) return 0;  //FIXME

        const m = MOD_MATRIX[src][dest];    //TODO: check params validity

        if (!m) {
            if (global.dev) console.log("modMatrixValue, no def for", src, dest);
            return 0;
        }

        const mask_msb = m.msb.length === 3 ? m.msb[2] : DEFAULT_msb_mask;
        const mask_sign = m.sign.length === 3 ? m.sign[2] : DEFAULT_sign_mask;

        const raw = multibytesValue(
            data[ m.MSB[0] ][ m.MSB[1] ],
            data[ m.LSB[0] ][ m.LSB[1] ],
            data[ m.msb[0] ][ m.msb[1] ],
            mask_msb,
            data[ m.sign[0] ][ m.sign[1] ],
            mask_sign);

        return return_raw ? raw : (Math.round(raw * 1000 / 32768) / 10);
    }

    /**
     *
     * @param slot
     */
    modAssignDest(slot) {

        if (!this.presets[this.preset_number]) {
            return 0;
        }
        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return;  //FIXME
        const m = MOD_ASSIGN_SLOT[slot].mod_group;
        const dest_num = data[ m[0] ][ m[1] ];
        // console.log("modAssignDest", dest_num, m, MOD_ASSIGN_DEST[dest_num]);
        // return group_num;
        return MOD_ASSIGN_DEST[dest_num];  // ? MOD_ASSIGN_DEST[group_num] : null;
    };

    /**
     *
     * @param slot
     */
    modAssignControlNum(slot) {

        if (!this.presets[this.preset_number]) {
            return 0;
        }
        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return;  //FIXME
        const m = MOD_ASSIGN_SLOT[slot].control;
        return data[ m[0] ][ m[1] ];
    };

    modDestName(dest) {
        if (!(dest === ASSIGN1 || dest === ASSIGN2 || dest === ASSIGN3)) {
            return MOD_MATRIX_DESTINATION[dest];
        }
        // let d = null;
        let group_name = '?';
        let control_name = '?';
        const dest_def = this.modAssignDest(dest);
        if (dest_def) {
            group_name = MOD_GROUP_NAME[dest_def.mod_group];
            // const control_num = this.modAssignControlNum(dest);
            const control = dest_def.control[this.modAssignControlNum(dest)];
            const dest_is_matrix =      // mod destination is the matrix itself
                control === MOD_SRC_CYC_ENV ||
                control === MOD_SRC_ENV ||
                control === MOD_SRC_LFO ||
                control === MOD_SRC_PRESS ||
                control === MOD_SRC_KEY_ARP;
            // console.log("modDestName, control", dest_is_matrix, this.modAssignControlNum(dest), control);
            if (control) {
                control_name = MOD_DESTINATION[control];
                return dest_is_matrix ? `${control_name}-${group_name}` : `${group_name} ${control_name}`;
            }
        }
        return MOD_MATRIX_DESTINATION[dest];
    }


    presetName(number) {  //TODO: change method name

        if (!this.presets[number]) {
            return '';
        } else {
            return this.presets[number].name;
        }
/*
        const data = this.presets[this.preset_number].data;

        console.log("state.presetName()");

        if (!data_name || data_name.length < 13) {
            console.log("state.presetName: data_name too short", data_name);
            return '';
        }

        // [0x01, 0x65, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x65, 0x00, 0x00, 0x10, 0x44, 0x69, 0x73, 0x72, 0x65, 0x73, 0x70, 0x65, 0x63, 0x74, 0x66]
        //     0                                                                11    12

        let name = '';
        let i = 12;
        while (i < data_name.length && data_name[i] !== 0) {
            name += String.fromCharCode(data_name[i]);
            i++;
        }

        return name;
*/
    }

}

// https://mobx.js.org/best/decorators.html
decorate(State, {
    midi: observable,
    presets: observable,
    preset_number: observable,
    preset_number_comm: observable,
    // presetName: computed,
    // data: observable,
    // dataRef: observable,
    // data_name: observable,
    lock: observable,
    read_progress: observable
});

export const state = new State();
