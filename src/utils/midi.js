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

/*
function inputById(id) {
    return WebMidi.inputs.find(item => item.id === id);
}

function outputById(id) {
    return WebMidi.outputs.find(item => item.id === id);
}
*/

/*
function inputName(id) {
    let i = inputById(id);
    return i ? i.name : null;
}

function outputName(id) {
    let i = outputById(id);
    return i ? i.name : null;
}
*/

const wait = ms => new Promise(r => setTimeout(r, ms));

// The MF answer within 2ms typically.

const WAIT_BETWEEN_MESSAGES = 20;


export function sendPC(n) {

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("sendPresetRequest: no output and/or input connected, ignore request");
        return;
    }

    const P = state.midi.ports;
    for (const port_id of Object.keys(P)) {
        if (P[port_id].enabled && P[port_id].type === PORT_OUTPUT) {
            const port = portById(port_id);
            if (global.dev) console.log(`send PC ${n} to ${port.name} ${port.id}`);
            port.sendControlChange(WebMidi.MIDI_CONTROL_CHANGE_MESSAGES.bankselectcoarse, n < 128 ? 0 : 1);
            port.sendProgramChange(n % 128);
        }
    }
}

function sendPresetRequest(presetNumber) {

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("sendPresetRequest: no output and/or input connected, ignore request");
        return;
    }

    // presetNumber is 1-indexed
    // in the request we must use 0-indexed

    const bank = presetNumber > 128 ? 1 : 0;
    const preset = (presetNumber-1) % 128;

    if (global.dev) console.log(`sendPresetRequest ${presetNumber}`, bank, preset);

    const P = state.midi.ports;
    for (const port_id of Object.keys(P)) {
        if (P[port_id].enabled && P[port_id].type === PORT_OUTPUT) {
            const port = portById(port_id);
            if (global.dev) console.log(`send ID request to ${port.name} ${port.id}`);
            port.sendSysex([0x00, 0x20, 0x6b], [0x07, 0x01, 0x01, 0x01, 0x19, bank, preset, 0x01]);  // use sendSysex to bypass the webmidijs internal checks.
        }
    }
}

// do this 146x to read all the preset
function sendPresetRequestData(n) {

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("sendPresetRequestData: no output and/or input connected, ignore request");
        return;
    }

    const P = state.midi.ports;
    for (const port_id of Object.keys(P)) {
        if (P[port_id].enabled && P[port_id].type === PORT_OUTPUT) {
            const port = portById(port_id);
            // if (global.dev) console.log(`send ID request to ${port.name} ${port.id}`);
            port.sendSysex([0x00, 0x20, 0x6b], [0x07, 0x01, n, 0x01, 0x18, 0x00]);  // use sendSysex to bypass the webmidijs internal checks.
        }
    }
}

export async function readPreset() {

    if (!state.hasInputAndOutputEnabled()) {
        if (global.dev) console.log("readPreset: no output and/or input connected, ignore request");
        return;
    }

    if (state.lock) {
        if (global.dev) console.log("readPreset: locked");
        return;
    }

    if (global.dev) console.log("readPreset", state.preset.current);

    state.data = [];
    state.preset.current_counter = 0;

    sendPresetRequest(state.preset.current);
    await wait(2 * WAIT_BETWEEN_MESSAGES);

    // const N = 146;
    const N = 40;

    state.lock = true;
    for (let i=0; i < N; i++) {
        // console.log(`sendPresetRequest ${i}`);
        sendPresetRequestData(i);
        state.preset.current_counter++;
        await wait(2 * WAIT_BETWEEN_MESSAGES);
    }
    state.lock = false;

}
