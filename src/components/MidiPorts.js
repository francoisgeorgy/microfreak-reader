import React, {Fragment} from 'react';
import Switch from "react-switch";
import {inject, observer} from "mobx-react";
import {portById} from "../utils/midi";
import "./MidiPorts.css";

class MidiPorts extends React.Component {

    togglePort = (port_id) => {

        const p = portById(port_id);

        if (global.dev) console.log(`toggle ${p.type} ${port_id}`);

        if (this.props.state.midi.ports[port_id].enabled) {
            this.props.state.disconnectPort(p, true);
        } else {
            this.props.state.connectPort(p, this.props.messageType, this.props.onMidiInputEvent);
        }
    };

    render() {

        const S = this.props.state;
        const ports = this.props.state.midi.ports;

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

        console.log("MidiPorts: groupedByName.length", Object.keys(groupedByName).length, groupedByName);

        if (ports) {

            if (!Object.keys(groupedByName).length) {
                return <div className="warning banner">No MIDI device found.</div>
            }

            return (
                <Fragment>
                    <div className="ports-grid">
                        <div className="grid-label">MIDI ports</div>
                        <div className="grid-label">inputs</div>
                        <div className="grid-label">outputs</div>
                        {
                        Object.keys(groupedByName).map(port_name => {
                            const port = groupedByName[port_name];
                            const i = portById(port.input);
                            const o = portById(port.output);
                            return (
                                <Fragment key={port_name}>
                                    <div className={`port-name`}>{port_name}</div>
                                    <div className="port-switch space-right" onClick={(e) => e.stopPropagation()}>
                                        {i &&
                                        <Switch onChange={() => this.togglePort(i.id)}
                                            checked={ports[i.id].enabled}
                                            id={`switch-${i.id}`}
                                            className="react-switch"
                                            height={16} width={36} />}
                                    </div>
                                    <div className="port-switch" onClick={(e) => e.stopPropagation()}>
                                        {o &&
                                        <Switch onChange={() => this.togglePort(o.id)}
                                            checked={ports[o.id].enabled}
                                            id={`switch-${o.id}`}
                                            className="react-switch"
                                            height={16} width={36} />}
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>
                    {(!S.hasInputEnabled() || !S.hasOutputEnabled()) && <div className="warning banner">
                        Please enable the input and the output corresponding to your MicroFreak.
                    </div>}
                </Fragment>
            );

            /*
                        return (
                            <div className="ports-grid">{
                                Object.keys(ports).map(port_id => {
                                    const port = ports[port_id];
                                    if (port) {
                                        // console.log("Ports", port_id);
                                        return (
                                            <Fragment>
                                                <div className="port-switch" onClick={(e) => e.stopPropagation()}>
                                                    <Switch onChange={() => this.togglePort(port_id)}
                                                            checked={port.enabled}
                                                            id={`switch-${port_id}`}
                                                            className="react-switch"
                                                            height={16} width={36} />
                                                </div>
                                                <div className={`port-type ${port.enabled ? 'sel' : ''}`}>{port.type}</div>
                                                <div className={`port-name ${port.enabled ? 'sel' : ''}`}>{port.name}</div>
                                            </Fragment>
                                        );
                                    } else {
                                        return null;
                                    }
                                })
                            }</div>
                        );
            */
        } else {
            if (global.dev) console.log("Ports: this.props.state.midi.ports is null");
            return null;
        }
    }

}

export default inject('state')(observer(MidiPorts));
