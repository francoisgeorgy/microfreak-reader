import WebMidi from "webmidi";

function portById(id) {
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

export {
    portById
    // inputById,
    // outputById
}
