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

        // const S = this.props.state;
        const ports = this.props.state.midi.ports;

        //TODO: if there is at least one port soloed, then only show the soloed ports.

        if (ports) {
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
        } else {
            if (global.dev) console.log("Ports: this.props.state.midi.ports is null");
            return null;
        }
    }

}

export default inject('state')(observer(MidiPorts));
