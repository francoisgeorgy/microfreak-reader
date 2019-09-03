import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import * as WebMidi from "webmidi";
import {inputById, portById} from "../utils/midi";

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
    messageType: "midimessage"
};

const DEVICE_ID = "Arturia MicroFreak";

// const ERROR_NO_ERROR = -1;
export const ERROR_MIDI_NOT_SUPPORTED = 1;
export const ERROR_MIDI_NOT_ENABLED = 2;
export const ERROR_UNKNOWN = 3;

/**
 *
 * @param props
 * @constructor
 */
export default class Midi extends Component {

    //TODO: allow specification of channel and message types to listen to

    state = {
        inputs: [],         // array of MIDI inputs (filtered from WebMidi object)
        // outputs: [],        // array of MIDI outputs (filtered from WebMidi object)
        input: null,        // MIDI input port ID
        // output: null        // MIDI output port ID
    };

    connectInput = port => {
        if (this.props.onMidiInputEvent) {
            if (port) {
                if (global.dev) console.log(`Midi.connectInput: connect input ${port.id} ${port.name}`);
                if (port.hasListener(this.props.messageType, 'all', this.props.onMidiInputEvent)) {
                    console.warn(`Midi.connectInput: ${port.id} ${port.name} : ${this.props.messageType} messages on all channels listener already connected`);
                } else {
                    if (global.dev) console.log(`Midi.connectInput: ${port.id} ${port.name} : add listener for ${this.props.messageType} messages on all channels`);
                    port.addListener(this.props.messageType, 'all', this.props.onMidiInputEvent);
                    if (this.props.onInputConnection) {
                        this.props.onInputConnection(port.id);
                    }
                    // if (global.dev) console.log("Midi.connectInput:", port.name);
                    // if (global.dev) console.log(`Midi.connectInput: set input input_device_id=${port.id} in preferences`);
                    // savePreferences({input_device_id: port.id});

                    this.setState({input: port.id});
                }
            }
        }
    };

    disconnectInput = (port, updatePreferences=false) => {
        if (port.id === this.state.input) {
            if (global.dev) console.log(`Midi.disconnectInput: disconnect input ${port.id} ${port.name}`);
            if (port.removeListener) port.removeListener();

            this.setState({input: null});

            if (this.props.onInputDisconnection) {
                this.props.onInputDisconnection(port.id);
            }
            // if (global.dev) console.log(`Midi.connectInput: connect input set input_device_id=null in preferences`);
            // if (updatePreferences) savePreferences({input_device_id: null});
        }
    };

/*
    connectOutput = port => {
        // There is nothing to really "connect" for an output port since this type of port does not generate any event.
        if (port) {
            if (global.dev) console.log(`Midi.connectOutput: connect output ${port.id}`);
            if (this.props.onOutputConnection) {
                this.props.onOutputConnection(port.id);
            }
            // if (global.dev) console.log(`Midi.connectOutput: set output_device_id=${port.id} in preferences`);
            // savePreferences({output_device_id: port.id});

            this.setState({output: port.id});
        }
    };

    disconnectOutput = (port, updatePreferences=false) => {
        if (this.state.output === port.id) {
            if (global.dev) console.log(`Midi.disconnectOutput: disconnect output ${port.id}`);

            this.setState({output: null});

            if (this.props.onOutputDisconnection) {
                this.props.onOutputDisconnection(port.id);
            }
            // if (global.dev) console.log(`Midi.connectOutput: set output_device_id=null in preferences`);
            // if (updatePreferences) savePreferences({output_device_id: null});
        }
    };
*/

    autoConnectInput = (port_id) => {
        if (global.dev) console.log(`Midi.autoConnectInput ${port_id}`);
        const port = portById(port_id);
        if (!port) {
            console.warn(`port ${port_id} not found`);
            return;
        }
        if (port.name === DEVICE_ID) {
            if (this.state.input === null) {
                if (global.dev) console.log(`Midi.autoConnectInput: autoConnect ${port_id} ${port.name}`);
                this.connectInput(inputById(port_id));
            } else {
                if (global.dev) console.log(`Midi.autoConnectInput: autoConnect skipped, already connected`);
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
                if (global.dev) console.log(`Midi.autoConnectInput: autoConnect skipped, already connected`);
            }
        }
*/
    };

/*
    autoConnectOutput = (port_id) => {
        if (global.dev) console.log(`Midi.autoConnectOutput ${port_id}`);
        const s = loadPreferences();
        if (s.output_device_id) {
            if (this.state.output === null) {
                if (port_id === s.output_device_id) {
                    this.connectOutput(outputById(port_id));
                }
            } else {
                if (global.dev) console.log(`Midi.autoConnectOutput: autoConnect skipped, already connected`);
            }
        }
    };
*/

    registerInputs = () => {
        if (global.dev) console.log(this.state.inputs.length === 0 ? 'Midi.registerInputs register inputs' : 'Midi.registerInputs update inputs list');
        // noinspection JSUnresolvedVariable
        this.setState(
            // noinspection JSUnresolvedVariable
            {inputs: WebMidi.inputs},
            () => {
                if (global.dev) console.log("Midi.registerInputs: try to autoconnect input");
                // noinspection JSUnresolvedVariable
                for (let port of WebMidi.inputs) {
                    if (global.dev) console.log(`input "${port.name}"`);
                    this.autoConnectInput(port.id)
                }
            });
    };

/*
    registerOutputs = () => {
        if (global.dev) console.log(this.state.outputs.length === 0 ? 'Midi.registerOutputs register outputs' : 'Midi.registerOutputs update outputs list');
        // noinspection JSUnresolvedVariable
        this.setState(
            // noinspection JSUnresolvedVariable
            {outputs: WebMidi.outputs},
            () => {
                if (global.dev) console.log("Midi.registerInputs: try to autoconnect output");
                // noinspection JSUnresolvedVariable
                for (let port of WebMidi.outputs) {
                    this.autoConnectOutput(port.id)
                }
            });
    };
*/

    unRegisterInputs = () => {
        if (global.dev) console.log("Midi.unRegisterInputs");
        this.disconnectInput(portById(this.state.input));
        this.setState({inputs: [], input: null});
    };

/*
    unRegisterOutputs = () => {
        if (global.dev) console.log("Midi.unRegisterOutputs");
        this.disconnectOutput();
        this.setState({outputs: [], output: null});
    };
*/

    handleMidiConnectEvent = e => {

        if (global.dev) console.log(`Midi: handleMidiConnectEvent: port.type=${e.port.type} type=${e.type} port.state=${e.port.state}: ${e.port.name} ${e.port.id}`, e);

        if (e.port.type === "input") {
            if (e.type === "disconnected") {
                this.disconnectInput(e.port);
            }
/*
        } else {
            if (e.type === "disconnected") {
                this.disconnectOutput(e.port);
            }
*/
        }

        if (e.port.type === 'input') {
            if (global.dev) console.log("Midi.handleMidiConnectEvent: call registerInputs");
            this.registerInputs(e.port.id);
        }

/*
        if (e.port.type === 'output') {
            if (global.dev) console.log("Midi.handleMidiConnectEvent: call registerOutputs");
            this.registerOutputs(e.port.id);
        }
*/

        // if (global.dev) console.groupEnd();
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
            this.registerInputs();
            // this.registerOutputs();
        } else {
            if (global.dev) console.log("Midi: component did mount: Calling WebMidi.enable");
            // noinspection JSUnresolvedFunction
            WebMidi.enable(this.midiOn, true);  // true to enable sysex support
        }
    }

    componentWillUnmount() {
        if (global.dev) console.log("Midi: component will unmount: unregister ports");
        this.unRegisterInputs();
        // this.unRegisterOutputs();
    }

    /**
     *
     * @param port_id
     */
/*
    togglePort = (port_id) => {

        let p = portById(port_id);

        if (global.dev) console.log(`toggle ${p.type} ${port_id}`);

        if (p.type === 'input') {
            let prev = this.state.input;
            if (this.state.input) {
                this.disconnectInput(portById(this.state.input), true);
            }
            if (port_id !== prev) {
                this.connectInput(inputById(port_id));
            }
        } else {
            let prev = this.state.output;
            if (this.state.output) {
                this.disconnectOutput(portById(port_id), true);
            }
            if (port_id !== prev) {
                this.connectOutput(portById(port_id));
            }
        }
    };
*/

/*
    portsGrouped = () => {
        let group = {};
        // noinspection JSUnresolvedVariable
        for (let port of WebMidi.inputs) {
            group[port.name] = {
                input: {
                    id: port.id,
                    selected: port.id === this.state.input
                },
                output: null
            };
        }
        // noinspection JSUnresolvedVariable
        for (let port of WebMidi.outputs) {
            if (!(port.name in group)) {
                group[port.name] = {
                    input: null,
                    output: null
                };
            }
            group[port.name].output = {
                id: port.id,
                selected: port.id === this.state.output
            }
        }
        return group;
    };
*/

    render() {
        console.log("MIDI.render");
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
