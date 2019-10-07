import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {CONTROL, OSC_TYPE} from "../model";
import "./Control.css";
import Knob from "./Knob";
import ControlMods from "./ControlMods";
import ControlModsAssign from "./ControlModsAssign";


class Control extends Component {

    render() {

        // console.log("Control.render", this.props.group);

        const {cc, state: S} = this.props;
        const control = CONTROL[cc];
        // const v = d.mapping ? d.mapping(S.preset[cc]) : S.preset[cc];
        // const v = -100;

        // const v = S.controlValue(control, cc === OSC_TYPE);
        const v = 53;
        const mapped = control.mapping ? control.mapping(v) : '';

        //HACK:
        // const c = cc === OSC_TYPE ? 'osc' : '';

        return (
            <div className={`control${cc === OSC_TYPE ? ' osc' : ''}`}>
                {/*<div className="ctrl-value">{state.preset[cc]}</div>*/}
                {/*<div className="ctrl-value">{v}</div>*/}
                {/*<div className="ctrl-value-hex">0x{h(state.preset[cc])}</div>*/}
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
