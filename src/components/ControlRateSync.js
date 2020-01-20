import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {CONTROL, OSC_TYPE} from "../model";
import "./Control.css";
import ControlMods from "./ControlMods";
import ControlModsAssign from "./ControlModsAssign";

class ControlRateSync extends Component {

    render() {

        const {cc, state: S, raw=false} = this.props;
        const control = CONTROL[S.fwVersion()][cc];

        const v = S.controlValue(control, raw);
        let mapped;
        mapped = control.mapping ? control.mapping(v) : v.toFixed(1);

        return (
            <div className={`control${cc === OSC_TYPE ? ' osc' : ''}`}>
                <div className="ctrl-name">{control.name}</div>
                <div className="arp-sync">{mapped}</div>
                <ControlMods cc={cc} />
                {this.props.group && <ControlModsAssign cc={cc} group={this.props.group}/>}
            </div>
        );
    }
}

export default inject('state')(observer(ControlRateSync));
