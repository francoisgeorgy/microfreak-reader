import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {CONTROL, OSC_TYPE, SWITCH} from "../model";
import "./Control.css";
import Knob from "./Knob";
import ControlMods from "./ControlMods";
import ControlModsAssign from "./ControlModsAssign";

class Control extends Component {

    render() {

        const {cc, state: S, raw=false, sw=null, inverseSw=false} = this.props;

        const fw = S.fwVersion();

        const control = CONTROL[fw][cc];

        const v = S.controlValue(control, raw);
        let mapped;
        if (cc === OSC_TYPE) {
            mapped = control.mapping ? control.mapping(v, S.fwVersion()) : '';
        } else {
            mapped = control.mapping ? control.mapping(v) : v.toFixed(1);
        }

        let enabled = true;
        if (sw) {
            enabled = S.switchValue(SWITCH[fw][sw], true) > 0;
            if (inverseSw) enabled = !enabled;
            // console.log("control", S.switchValue(SWITCH[fw][sw], raw), inverseSw, enabled);
        }

        return (
            <div className={`control${cc === OSC_TYPE ? ' osc' : ''} ${enabled?'':'control-off'}`}>
                <div className="ctrl-name">{control.name}</div>
                {cc !== OSC_TYPE && <Knob value={v} decimals={1} />}
                {cc === OSC_TYPE && <div className="osc-name">{mapped}</div>}
                {cc !== OSC_TYPE && <div className="ctrl-value">{mapped}</div>}
                <ControlMods cc={cc} />
                {this.props.group && <ControlModsAssign cc={cc} group={this.props.group}/>}
            </div>
        );
    }
}

export default inject('state')(observer(Control));
