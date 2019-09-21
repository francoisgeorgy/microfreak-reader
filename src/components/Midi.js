import {Component} from 'react';
import PropTypes from 'prop-types';
import * as WebMidi from "webmidi";
import {portById} from "../utils/midi";
import {inject, observer} from "mobx-react";

const propTypes = {
    classname: PropTypes.string,
    portsRenderer: PropTypes.func,
    messageType: PropTypes.string,
    onMidiInputEvent: PropTypes.func,
    onMidiOutputEvent: PropTypes.func,
    onInputConnection: PropTypes.func,      // callback with port.id as parameter
    onOutputConnection: PropTypes.func,     // callback with port.id as parameter
    onInputDisconnection: PropTypes.func,   // callback with port.id as parameter
    onOutputDisconnection: PropTypes.func,  // callback with port.id as parameter
    setOutput: PropTypes.func,              // callback with port.id as parameter
    children: PropTypes.node
};

const defaultProps = {
    classname: "",
    portsRenderer: null,
    // messageType: "midimessage"
    messageType: "sysex"
};

// regex:
const DEVICE_ID = "Arturia MicroFreak";
// const DEVICE_ID = /VMPK.*/i;

// const ERROR_NO_ERROR = -1;
export const ERROR_MIDI_NOT_SUPPORTED = 1;
export const ERROR_MIDI_NOT_ENABLED = 2;
export const ERROR_UNKNOWN = 3;

export const PORT_INPUT = "input";
export const PORT_OUTPUT = "output";

/**
 *
 * @param props
 * @constructor
 */
class Midi extends Component {

    //TODO: allow specification of channel and message types to listen to

    autoConnect = (port) => {
        if (global.dev) console.log(`Midi.autoConnect "${port.name}" ${port.id}`);
        // const port = portById(port_id);
        if (!port) {
            console.warn(`port ${port} not found`);
            return;
        }
        if (port.name.match(DEVICE_ID)) {
            if (global.dev) console.log(`Midi.autoConnect: autoConnect "${port.name}"`);
            if (port.type === PORT_INPUT) {
                this.props.state.connectPort(port, this.props.messageType, this.props.onMidiInputEvent);
            } else {
                this.props.state.connectPort(port);
            }
        }
/*
        const s = loadPreferences();
        if (s.input_device_id) {
            if (this.state.input === null) {
                if (port_id === s.input_device_id) {
                    this.connectInput(inputById(port_id));
                }
            } else {
                if (global.dev) console.log(`Midi.autoConnect: autoConnect skipped, already connected`);
            }
        }
*/
    };

    registerPort = (port) => {
        if (global.dev) console.log("registerPort", port.type, port.name, port.id);
        if (this.props.state.addPort(port)) {
            this.autoConnect(port);
        }
    };

    unregisterPort = (port_id) => {
        if (global.dev) console.log("unregisterPort", port_id);
        this.props.state.disconnectPort(portById(port_id));
        this.props.state.removePort(port_id);
    };

    unregisterAllPorts = () => {
        if (global.dev) console.log("unregisterAllPorts");
        this.props.state.disconnectAllPorts();
        this.props.state.removeAllPorts();
    };

    handleMidiConnectEvent = e => {
        if (global.dev) console.log(`handleMidiConnectEvent: ${e.type} port: ${e.port.type} ${e.port.connection} ${e.port.state}: ${e.port.name} ${e.port.id}`, e);
        // if (e.port.type === PORT_INPUT) {
            if (e.type === "disconnected") {    //FIXME: what is this?
                const port_id = e.port.id;      // use a copy of port.id in case port is delete too soon by the webmidi api
                this.unregisterPort(port_id);
            } else {
                this.registerPort(e.port);
                // can it be opened by some other app? YES: a port may already be opened by another app, and it that case we must connect to it
            }
        // }
    };

    midiOn = err => {

        // noinspection JSUnresolvedVariable
        if (global.dev) console.log("webmidi.supported=", WebMidi.supported);
        // noinspection JSUnresolvedVariable
        if (global.dev) console.log("webmidi.enabled=", WebMidi.enabled);

        if (err) {
            console.warn("Midi.midiOn: WebMidi could not be enabled.", err);
            // if (global.dev) console.log(`err.name=${err.name} err.message=${err.message}`);
            if (this.props.onError) {
                let code;
                // noinspection JSUnresolvedVariable
                if (!WebMidi.supported) {
                    code = ERROR_MIDI_NOT_SUPPORTED;
                } else { // noinspection JSUnresolvedVariable
                    if (!WebMidi.enabled) {
                        code = ERROR_MIDI_NOT_ENABLED;
                    } else {
                        code = ERROR_UNKNOWN;
                    }
                }
                this.props.onError({code, message: err.message});
            }
        } else {
            if (global.dev) console.log("Midi.midiOn: WebMidi enabled");
            // noinspection JSUnresolvedFunction
            WebMidi.addListener("connected", this.handleMidiConnectEvent);
            // noinspection JSUnresolvedFunction
            WebMidi.addListener("disconnected", this.handleMidiConnectEvent);
        }
    };

    componentDidMount() {
        // noinspection JSUnresolvedVariable
        if (global.dev) console.log(`Midi: component did mount: WebMidi.enabled=${WebMidi.enabled}`);
        // noinspection JSUnresolvedVariable
        if (WebMidi.enabled) {
            if (global.dev) console.log(`Midi: component did mount: already enabled, register ports`);
            for (let port of WebMidi.inputs) {
                this.registerPort(port.id);
            }
            for (let port of WebMidi.outputs) {
                this.registerPort(port.id);
                // console.log("output", port.id);
            }
        } else {
            if (global.dev) console.log("Midi: component did mount: Calling WebMidi.enable");
            // noinspection JSUnresolvedFunction
            WebMidi.enable(this.midiOn, true);  // true to enable sysex support
        }
    }

    componentWillUnmount() {
        if (global.dev) console.log("Midi: component will unmount: unregister ports");
        this.unregisterAllPorts();
    }

    render() {
/*
        if (this.props.portsRenderer) {
            return (
                <Fragment>
                    {this.props.portsRenderer(this.portsGrouped(), this.togglePort)}
                </Fragment>
            );
        } else {
            return null;
        }
*/
        return null;
    }

}

Midi.propTypes = propTypes;
Midi.defaultProps = defaultProps;

export default inject('state')(observer(Midi));