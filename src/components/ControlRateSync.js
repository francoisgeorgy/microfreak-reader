import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {CONTROL, OSC_TYPE, SWITCH} from "../model";
import "./Control.css";
import ControlMods from "./ControlMods";
import ControlModsAssign from "./ControlModsAssign";

class ControlRateSync extends Component {

    render() {

        const {cc, state: S, raw=false, sw=null} = this.props;

        const fw = S.fwVersion();

        const control = CONTROL[fw][cc];

        const v = S.controlValue(control, raw);
        let mapped = control.mapping ? control.mapping(v) : v.toFixed(1);

        let enabled = true;
        if (sw) {
            enabled = S.switchValue(SWITCH[fw][sw], true) > 0;
            // console.log("controlratesync", S.switchValue(SWITCH[fw][sw], raw), enabled);
        }

        return (
            <div className={`control${cc === OSC_TYPE ? ' osc' : ''} ${enabled?'':'control-off'}`}>
                <div className="ctrl-name">{control.name}</div>
                <div className="arp-sync">{mapped}</div>
                <ControlMods cc={cc} />
                {this.props.group && <ControlModsAssign cc={cc} group={this.props.group}/>}
            </div>
        );
    }
}

export default inject('state')(observer(ControlRateSync));
