import {decorate, observable} from 'mobx';
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
    MOD_SRC_ENV, FW1, FW2
} from "../model";
import {MSG_DATA, MSG_NAME, portById} from "../utils/midi";
import {h, hs} from "../utils/hexstring";
import {savePreferences} from "../utils/preferences";

class State {

    // The number of the currently displayed preset
    preset_number = 0;  // 0..255 display as 1..256

    // input field in preset selector
    preset_number_string = '1';

    // The preset number used in MIDI
    preset_number_comm = null;      // 0..255 display as 1..256

    // All the presets
    // This is an array of {name: String; data: []}
    // We prefill the array with null value to avoid OutOfBound exceptions when accessing the array with MobX
    presets = new Array(256).fill(null);   // index 0..255

    send_pc = true;    // if true send PC when changing preset

    lock = false;   // Used during preset reading to prevent concurrent reads.

    read_progress = 0;

    midi = {
        ports: {},
    };

    last_received_midi_msg = 0;

    error = 0;  // 0 means no error

    bytesToName(data) {
        let s = '';
        let i = 12;
        while (i < data.length && data[i] !== 0) {
            s += String.fromCharCode(data[i]);
            i++;
        }
        return s;
    }

    fwVersion() {   //TODO: not sure this is the right way to find the firmware version, but that seems to work.

        const def = FW2;

        if (!this.presets.length || (this.presets.length < this.preset_number) || !this.presets[this.preset_number]) {
            return def;
        }

        if (!this.presets[this.preset_number]) {
            return def;
        }

        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return 0;  //FIXME

        return data[0][12] === 0x0C ? FW1 : def;
        // console.log(data);
        // return 2;
    }

    checkPreset(number) {

        // if (global.dev) console.log("checkPreset", number);

        if (this.presets && this.presets.length && this.presets[number]) {

            const D = this.presets[number].data;

            this.presets[number].fw = D[0][12] === 0x0C ? FW1 : FW2;

            // console.log(hs(D[16]));
            // console.log(hs(D[17]));

            // 1 (not ok):
            // 00 63 01 00 00 40 23 47 00 65 6E 47 50 61 72 61 20 66 6F 6E 63 01 7F 7F 00 45 50 61 6E 65 6C 63
            // 00 03 00 00 47 50 6F 6C 40 79 43 6E 74 63 01 7D 00 7F 47 50 72 73 74 56 00 6F 6C 63 18 00 00 46
            // 2 (ok):
            // 00 63 01 00 00 40 23 47 00 65 6E 47 50 61 72 61 00 66 6F 6E 63 01 00 00 00 47 50 6F 6C 79 43 6E
            // 00 74 63 01 00 00 47 50 00 72 73 74 56 6F 6C 63 00 18 00 00 46 56 6F 6C 10 75 6D 65 63 66 00 00

            if (hs(D[16].slice(-7)) === '45 50 61 6E 65 6C 63' && hs(D[17].slice(0, 4)) === '00 03 00 00') {
                if (global.dev) console.log("unsupported factory preset", number, hs(D[16]), hs(D[17]));
                this.presets[number].supported = false;
            } else {
                // if (global.dev) console.log("supported preset", number);
                this.presets[number].supported = true;  // this will add the property if it does not yet exist
            }

        }
    }

    checkAllPresets() {
        // if (global.dev) console.log("checkAllPresets");
        for (let i=0; i<this.presets.length; i++) {
            if (this.presets[i] && !this.presets[i].hasOwnProperty("supported")) {
                this.checkPreset(i);
            }
        }
    }

    /**
     *
     * @param midiMessage midi message
     */
    importData(midiMessage) {

        // if (global.dev) console.log("midi message received", midiMessage, hs(midiMessage.data));

        const data = midiMessage.data;

        //TODO: extract preset num: NOT POSSIBLE, preset num is not in the answers

        if (data[0] === 0xF8) {
            // we ignore Timing Clock messages
            return;
        }

        if (data.length < 10) {
            if (global.dev) console.log("answer too short", hs(data));
            return;
        }

        if (!this.presets.length || (this.presets.length <= this.preset_number_comm) || this.presets[this.preset_number_comm] === null) {
            this.presets[this.preset_number_comm] = {name: null, supported: true, data:[]};
        }

        //
        // Store PRESET NAME:
        //
        if (data[8] === 0x52) {
            // console.log("answer 0x52 contains name", hs(message_bytes));
            this.last_received_midi_msg = MSG_NAME;
            // state.data_name = Array.from(message_bytes.slice(9, message_bytes.length - 1));    // message_bytes is UInt8Array
            this.presets[this.preset_number_comm].name = this.bytesToName(Array.from(data.slice(9, data.length - 1)));    // message_bytes is UInt8Array
            return;
        }

        if (data[8] !== 0x16 && data[8] !== 0x17) {
            if (global.dev) console.warn(`ignore answer type 0x${h(data[8])}`, hs(data));
            return;
        }

        if (data.length !== 42) {
            if (global.dev) console.log("do not store answer", hs(data));
            return;
        }

        //
        // Store PRESET DATA:
        //
        this.last_received_midi_msg = MSG_DATA;
        this.presets[this.preset_number_comm].data.push(Array.from(data.slice(9, data.length - 1)));    // message_bytes is UInt8Array

        // console.log(this.presets[this.preset_number_comm].data.length - 1, ":", hs(data.slice(9, data.length - 1)));

    }

    /**
     * If string, range is 1..256
     * If number, range is 0..255
     * @param number
     */
    setPresetNumber(number) {
        if (number === undefined || number === null) return;
        if ((typeof number !== 'string') && (typeof number !== 'number')) return;

        let num;
        let s = null;

        if (typeof number === 'string') {
            num = parseInt(number, 10);
        } else {
            num = number + 1;       // displayed value is 1..256
        }

        if (isNaN(num)) {
            num = 1;
        } else if (num > 256) {
            s = '256';
            num = 256;
        } else if (num < 1) {
            s = '1';
            num = 1;
        } else {
            s = num.toString(10);
        }

        if (s === null) {
            this.preset_number_string = '';
        } else {
            this.preset_number_string = s;
            this.preset_number = num - 1;
            savePreferences({preset:s});
        }
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
        };
        return true;
    }

    removePort(port_id) {
        if (global.dev) console.log('State.removePort', port_id);
        this.midi.ports[port_id] = null;
    }

    removeAllPorts() {
        if (global.dev) console.log('State.removeAllPorts');
        this.midi.ports = {};
    }

    enablePort(port_id) {
        if (this.midi.ports[port_id]) {
            this.midi.ports[port_id].enabled = true;
        }
    }

    disablePort(port_id) {
        if (this.midi.ports[port_id]) {
            this.midi.ports[port_id].enabled = false;
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
    }

    disconnectPort(port, updatePreferences=false) {
        if (port) {     // port is probably already null
            if (global.dev) console.log(`Midi.disconnectPort: ${port.type} ${port.id} ${port.name}`);
            if (port.type === PORT_INPUT) {
                if (port.removeListener) port.removeListener();
            }

            // there is nothing else to do to "connect" an OUTPUT port.

            this.disablePort(port.id);
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

    controlValue(m, return_raw=false) {

        if (!this.presets.length || (this.presets.length < this.preset_number) || !this.presets[this.preset_number]) {
            return 0;
        }

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

        if (!this.presets.length || (this.presets.length < this.preset_number) || !this.presets[this.preset_number]) {
            return 0;
        }

        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return 0;  //FIXME

        const mask_msb = m.msb.length === 3 ? m.msb[2] : DEFAULT_msb_mask;

        const raw = multibytesValue(
            data[ m.MSB[0] ][ m.MSB[1] ],
            data[ m.LSB[0] ][ m.LSB[1] ],
            data[ m.msb[0] ][ m.msb[1] ],
            mask_msb,
            0, 0);

        if (return_raw) {
            return raw;
        } else {
            for (let entry of m.values) {
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

        if (!this.presets.length || (this.presets.length < this.preset_number) || !this.presets[this.preset_number]) {
            return 0;
        }

        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return 0;  //FIXME

        const m = MOD_MATRIX[this.presets[this.preset_number].fw][src][dest];    //TODO: check params validity

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

        if (!this.presets.length || (this.presets.length < this.preset_number) || !this.presets[this.preset_number]) {
            return 0;
        }

        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return;  //FIXME
        const m = MOD_ASSIGN_SLOT[this.presets[this.preset_number].fw][slot].mod_group;
        const dest_num = data[ m[0] ][ m[1] ];

        return MOD_ASSIGN_DEST[dest_num];  // ? MOD_ASSIGN_DEST[group_num] : null;
    };

    /**
     *
     * @param slot
     */
    modAssignControlNum(slot) {

        if (!this.presets.length || (this.presets.length < this.preset_number)) {
            return 0;
        }

        const data = this.presets[this.preset_number].data;

        if (data.length < 39) return;  //FIXME
        const m = MOD_ASSIGN_SLOT[this.presets[this.preset_number].fw][slot].control;
        return data[ m[0] ][ m[1] ];
    };

    modDestName(dest) {
        if (!(dest === ASSIGN1 || dest === ASSIGN2 || dest === ASSIGN3)) {
            return MOD_MATRIX_DESTINATION[dest];
        }
        let group_name = '?';
        let control_name = '?';
        const dest_def = this.modAssignDest(dest);
        if (dest_def) {
            group_name = MOD_GROUP_NAME[dest_def.mod_group];
            const control = dest_def.control[this.modAssignControlNum(dest)];
            const dest_is_matrix =      // mod destination is the matrix itself
                control === MOD_SRC_CYC_ENV ||
                control === MOD_SRC_ENV ||
                control === MOD_SRC_LFO ||
                control === MOD_SRC_PRESS ||
                control === MOD_SRC_KEY_ARP;
            if (control) {
                control_name = MOD_DESTINATION[control];
                return dest_is_matrix ? `${control_name}-${group_name}` : `${group_name} ${control_name}`;
            }
        }
        return MOD_MATRIX_DESTINATION[dest];
    }

    presetName(number) {  //TODO: change method name
        if (this.presets.length && (number < this.presets.length) && this.presets[number]) {
            return this.presets[number].name;
        } else {
            return '';
        }
    }

}

// https://mobx.js.org/best/decorators.html
decorate(State, {
    midi: observable,
    presets: observable,
    preset_number: observable,
    preset_number_string: observable,
    preset_number_comm: observable,
    send_pc: observable,
    lock: observable,
    read_progress: observable,
    error: observable
});

export const state = new State();
