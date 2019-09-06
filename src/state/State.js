import {decorate, observable} from 'mobx';
import {PORT_INPUT} from "../components/Midi";
// import parseMidi from "parse-midi";
// import {ds, hs} from "../utils/hexstring";

// const MIDI_CONSOLE_SIZE = 100;

class State {

    midi = {
        ports: {},
        // outputs: {}
        // input: null         // ID of the connected input port
    };

    preset = new Array(127).fill(0);

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
                console.warn(`Midi.connectPort: ${port.id} ${port.name} : ${messageType} messages on all channels listener already connected`);
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

    disconnectAllPorts(updatePreferences=false) {
        if (global.dev) console.log('Midi.disconnectAllPorts');
        // for (let port of this.midi.ports) {
        //     this.disconnectPort(port);
        // }
        for (const port_id of Object.keys(this.midi.ports)) {
            this.disconnectPort(port_id);
        }
    }

}

// https://mobx.js.org/best/decorators.html
decorate(State, {
    midi: observable,
    preset: observable
});

export const state = new State();
