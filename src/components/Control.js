import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {CONTROL, OSC_TYPE} from "../model";
import "./Control.css";
import Knob from "./Knob";
import ControlMods from "./ControlMods";
import ControlModsAssign from "./ControlModsAssign";

class Control extends Component {

    render() {

        const {cc, state: S} = this.props;
        const control = CONTROL[S.fwVersion()][cc];

        const v = S.controlValue(control, cc === OSC_TYPE);
        let mapped;
        if (cc === OSC_TYPE) {
            mapped = control.mapping ? control.mapping(v, S.fwVersion()) : '';
        } else {
            mapped = control.mapping ? control.mapping(v) : '';
        }

        return (
            <div className={`control${cc === OSC_TYPE ? ' osc' : ''}`}>
                <div className="ctrl-name">{control.name}</div>
                {cc !== OSC_TYPE && <Knob value={v} decimals={1} />}
                {cc === OSC_TYPE && <div className="osc-name">{mapped}</div>}
                {cc !== OSC_TYPE && <div className="ctrl-value">{v.toFixed(1)}</div>}
                <ControlMods cc={cc} />
                {this.props.group && <ControlModsAssign cc={cc} group={this.props.group}/>}
            </div>
        );
    }
}

export default inject('state')(observer(Control));
