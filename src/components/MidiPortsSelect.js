import React, {Fragment} from 'react';
import {inject, observer} from "mobx-react";
import {portById} from "../utils/midi";
import "./MidiPortsSelect.css";
import {PORT_INPUT, PORT_OUTPUT} from "./Midi";

class MidiPortsSelect extends React.Component {

    selectInputPort = (e) => {
        const port_id = e.target.value;
        if (global.dev) console.log(`selectInputPort`, port_id);
        this.props.state.disconnectAllInputPorts();
        if (port_id) {
            this.props.state.connectPort(portById(port_id), this.props.messageType, this.props.onMidiInputEvent);
        }
    };

    selectOutputPort = (e) => {
        const port_id = e.target.value;
        if (global.dev) console.log(`selectOutputPort`, port_id);
        this.props.state.disconnectAllOutputPorts();
        if (port_id) {
            this.props.state.connectPort(portById(port_id), this.props.messageType, this.props.onMidiInputEvent);
        }
    };

    render() {

        const S = this.props.state;
        const ports = this.props.state.midi.ports;

/*
        const groupedByName = {};

        for (let [id, port] of Object.entries(ports)) {
            if (port) {
                if (!(port.name in groupedByName)) {
                    groupedByName[port.name] = {
                        input: null,
                        output: null
                    };
                }
                groupedByName[port.name][port.type] = id;
            }
        }
*/

        // console.log("MidiPorts: groupedByName.length", Object.keys(groupedByName).length, groupedByName);

        if (ports) {

/*
            if (!Object.keys(groupedByName).length) {
                return <div className="warning banner">No MIDI device found.</div>
            }
*/
            let selected_input = '';
            let selected_output = '';
            for (let [id, port] of Object.entries(ports)) {
                if (!selected_input && port && port.enabled && port.type === PORT_INPUT) selected_input = id;
                if (!selected_output && port && port.enabled && port.type === PORT_OUTPUT) selected_output = id;
            }

            console.log("MidiPortsSelect", selected_input, selected_output, ports);

            return (
                <Fragment>
                    {(!S.hasInputEnabled() || !S.hasOutputEnabled()) && <div className="warning banner">
                        Please enable the input and the output corresponding to your MicroFreak.
                    </div>}
                    <div className="ports-row">
                        <div>
                            Input:
                            <select onChange={this.selectInputPort} value={selected_input}>
                                <option value="">select MIDI input...</option>
                            {
                                Object.keys(ports).map(port_id => {
                                    const port = ports[port_id];
                                    if (port && port.type === PORT_INPUT) {
                                        return <option key={port_id} value={port_id}>{port.name}</option>
                                    } else {
                                        return null;
                                    }
                                })
                            }
                            </select>
                        </div>
                        <div>
                            Output:
                            <select onChange={this.selectOutputPort} value={selected_output}>
                                <option value="">select MIDI output...</option>
                                {
                                    Object.keys(ports).map(port_id => {
                                        const port = ports[port_id];
                                        if (port && port.type === PORT_OUTPUT) {
                                            return <option key={port_id} value={port_id}>{port.name}</option>
                                        } else {
                                            return null;
                                        }
                                    })
                                }
                            </select>
                        </div>
                    </div>
                </Fragment>
            );
        } else {
            if (global.dev) console.log("Ports: this.props.state.midi.ports is null");
            return null;
        }
    }

}

export default inject('state')(observer(MidiPortsSelect));
