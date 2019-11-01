import WebMidi from "webmidi";
import {PORT_OUTPUT} from "../components/Midi";
import {state} from "../state/State";

export function portById(id) {
    if (!id) return null;
    let p = WebMidi.inputs.find(item => item.id === id);
    if (p) {
        return p;
    } else {
        return WebMidi.outputs.find(item => item.id === id);
    }
}

export const wait = ms => new Promise(r => setTimeout(r, ms));

// The MF answer within 2ms typically.
export const WAIT_BETWEEN_MESSAGES = 15;    // empiric value with some margin
export const MESSAGES_TO_READ_FOR_PRESET = 40;  // we don't need to read a full and complete dump

// type of last received message:
export const MSG_NAME = 1;
export const MSG_DATA = 1;

export function sendPC(presetNumber) {

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("sendPresetRequest: no output and/or input connected, ignore request");
        return;
    }

    const P = state.midi.ports;
    for (const port_id of Object.keys(P)) {
        if (P[port_id].enabled && P[port_id].type === PORT_OUTPUT) {
            const port = portById(port_id);
            if (global.dev) console.log(`send PC ${presetNumber} to ${port.name} ${port.id}`);
            port.sendControlChange(WebMidi.MIDI_CONTROL_CHANGE_MESSAGES.bankselectcoarse, presetNumber < 128 ? 0 : 1);
            port.sendProgramChange(presetNumber % 128);
        }
    }
}

function sendNameRequest(presetNumber) {

    // sendmidi dev arturia system-exclusive hex 00 20 6B 07 01 07 03 19 01 70 00

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("sendPresetRequest: no output and/or input connected, ignore request");
        return;
    }

    //TODO: check number param validity

    // presetNumber is 1-indexed
    // in the request we must use 0-indexed

    const bank = presetNumber > 127 ? 1 : 0;
    const preset = presetNumber % 128;

    // if (global.dev) console.log(`sendNameRequest ${presetNumber}`, bank, preset);

    const sequence = 0x00;
    const READ_CMD = 0x19;

    state.last_received_midi_msg = 0;

    const P = state.midi.ports;
    for (const port_id of Object.keys(P)) {
        if (P[port_id].enabled && P[port_id].type === PORT_OUTPUT) {
            const port = portById(port_id);
            // if (global.dev) console.log(`send name request to ${port.name} ${port.id}`);
            if (global.dev) console.log(`send name request to ${port.name} ${port.id} for bank ${bank} preset ${preset}`);
            port.sendSysex([0x00, 0x20, 0x6b], [0x07, 0x01, sequence, 0x01, READ_CMD, bank, preset, 0x00]);
            // sendmidi dev arturia system-exclusive hex 00 20 6B 07 01 07 03 19 01 70 00
        }
    }
}

function sendPresetRequest(presetNumber) {

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("sendPresetRequest: no output and/or input connected, ignore request");
        return;
    }

    //TODO: check presetNumber param validity

    // presetNumber is 1-indexed
    // in the request we must use 0-indexed

    const bank = presetNumber > 127 ? 1 : 0;
    const preset = presetNumber % 128;

    state.last_received_midi_msg = 0;

    const P = state.midi.ports;
    for (const port_id of Object.keys(P)) {
        if (P[port_id].enabled && P[port_id].type === PORT_OUTPUT) {
            const port = portById(port_id);
            if (global.dev) console.log(`send ID request to ${port.name} ${port.id} for bank ${bank} preset ${preset}`);
            port.sendSysex([0x00, 0x20, 0x6b], [0x07, 0x01, 0x01, 0x01, 0x19, bank, preset, 0x01]);  // use sendSysex to bypass the webmidijs internal checks.
        }
    }
}

// do this 146x to fully read the preset
function sendPresetRequestData(presetNumber) {

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("sendPresetRequestData: no output and/or input connected, ignore request");
        return;
    }

    //TODO: check presetNumber param validity

    state.last_received_midi_msg = 0;

    const P = state.midi.ports;
    for (const port_id of Object.keys(P)) {
        if (P[port_id].enabled && P[port_id].type === PORT_OUTPUT) {
            const port = portById(port_id);
            // if (global.dev) console.log(`send ID request to ${port.name} ${port.id}`);
            port.sendSysex([0x00, 0x20, 0x6b], [0x07, 0x01, presetNumber, 0x01, 0x18, 0x00]);  // use sendSysex to bypass the webmidijs internal checks.
        }
    }
}

export async function readPreset(presetNumber = -1) {

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("readPreset: no output and/or input connected, ignore request");
        return;
    }

    if (state.lock) {
        return;
    }

    state.preset_number_comm = presetNumber < 0 ? state.preset_number : presetNumber;

    state.presets[state.preset_number_comm] = {name: null, supported: true, data:[]};

    sendNameRequest(state.preset_number_comm);
    await wait(WAIT_BETWEEN_MESSAGES);

    if (state.last_received_midi_msg !== MSG_NAME) {
        console.warn("Expected name answer not received");
        return false;
    }

    sendPresetRequest(state.preset_number_comm);
    await wait(WAIT_BETWEEN_MESSAGES);

    // const N = 146;
    const N = MESSAGES_TO_READ_FOR_PRESET;

    state.lock = true;
    state.read_progress = 0;
    try {
        for (let i = 0; i < N; i++) {
            sendPresetRequestData(i);
            state.read_progress++;
            await wait(WAIT_BETWEEN_MESSAGES);

            if (state.last_received_midi_msg !== MSG_DATA) {
                if (global.dev) console.warn("Expected data answer not received");
                state.lock = false;
                return false;
            }
        }
        await wait(WAIT_BETWEEN_MESSAGES);
        state.checkPreset(state.preset_number_comm);
    } catch (error) {
        console.warn("Error in readPreset", error);
    } finally {
        state.lock = false;
    }

    return true;

}
