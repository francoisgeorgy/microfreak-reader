import {decorate, observable} from 'mobx';
// import parseMidi from "parse-midi";
// import {ds, hs} from "../utils/hexstring";

// const MIDI_CONSOLE_SIZE = 100;

class State {

    midi = {
        inputs: {}
        // input: null         // ID of the connected input port
    };

    preset = new Array(127).fill(0);

    addInput(port) {
        // eslint-disable-next-line
        if (this.midi.inputs.hasOwnProperty(port.id) && this.midi.inputs[port.id] !== null) {
            // already registered
            return false;
        }
        if (global.dev) console.log('State.addInput', port.id);
        this.midi.inputs[port.id] = {
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

    removeInput(port_id) {
        if (global.dev) console.log('State.removeInput', port_id);
        // delete this.midi.inputs[port.id];    // do not use delete with mobx; see https://github.com/mobxjs/mobx/issues/822
        this.midi.inputs[port_id] = null;
    }

    enableInput(port_id) {
        if (this.midi.inputs[port_id]) this.midi.inputs[port_id].enabled = true;
        // this.midi.input = port_id;
    }

    disableInput(port_id) {
        // this.midi.input = null;
        if (this.midi.inputs[port_id]) {
            this.midi.inputs[port_id].enabled = false;
            // this.midi.inputs[port_id].solo = false;
            // this.midi.inputs[port_id].muted = false;
        }
    }

    connectInput(port, messageType, onMidiInputEvent) {
        // if (this.props.onMidiInputEvent) {
            if (port) {
                if (global.dev) console.log(`Midi.connectInput: connect input ${port.id} ${port.name}`);
                if (port.hasListener(messageType, 'all', onMidiInputEvent)) {
                    console.warn(`Midi.connectInput: ${port.id} ${port.name} : ${messageType} messages on all channels listener already connected`);
                } else {
                    if (global.dev) console.log(`Midi.connectInput: ${port.id} ${port.name} : add listener for ${messageType} messages on all channels`);
                    port.addListener(messageType, 'all', onMidiInputEvent);
                    // if (this.props.onInputConnection) {
                    //     this.props.onInputConnection(port.id);
                    // }
                    // if (global.dev) console.log("Midi.connectInput:", port.name);
                    // if (global.dev) console.log(`Midi.connectInput: set input input_device_id=${port.id} in preferences`);
                    // savePreferences({input_device_id: port.id});

                    // this.setState({input: port.id});
                    this.enableInput(port.id);
                }
            }
        // } else {
        //     console.warn("connectInput: no input event handler defined.");
        // }
    }

    disconnectInput(port, updatePreferences=false) {
        // if (port.id === this.midi.input) {
            if (global.dev) console.log(`Midi.disconnectInput: disconnect input ${port.id} ${port.name}`);
            if (port.removeListener) port.removeListener();

            // this.setState({input: null});
            // this.props.state.midi.input = null;
            this.disableInput(port.id);

            // if (this.props.onInputDisconnection) {
            //     this.props.onInputDisconnection(port.id);
            // }
            // if (global.dev) console.log(`Midi.connectInput: connect input set input_device_id=null in preferences`);
            // if (updatePreferences) savePreferences({input_device_id: null});
        // }
    }

    appendMessageIn(msg) {
        console.log("State.appendMessageIn", msg);
    }

}

// https://mobx.js.org/best/decorators.html
decorate(State, {
    midi: observable,
    preset: observable
});

export const state = new State();
