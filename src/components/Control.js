import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {CONTROL, OSC_TYPE} from "../model";
import "./Control.css";
import Knob from "./Knob";
import ControlMods from "./ControlMods";


class Control extends Component {

    render() {

        // console.log("Control.render");

        const {cc, state: S} = this.props;
        const control = CONTROL[cc];
        // const v = d.mapping ? d.mapping(S.preset[cc]) : S.preset[cc];
        // const v = -100;

        const v = S.controlValue(control, cc === OSC_TYPE);
        const mapped = control.mapping ? control.mapping(v) : '';

        //HACK:
        // const c = cc === OSC_TYPE ? 'osc' : '';

        return (
            <div className={`control`}>
                {/*<div className="ctrl-value">{state.preset[cc]}</div>*/}
                {/*<div className="ctrl-value">{v}</div>*/}
                {/*<div className="ctrl-value-hex">0x{h(state.preset[cc])}</div>*/}
                <div className="ctrl-name">{control.name}</div>
                {cc !== OSC_TYPE && <Knob value={v + Math.random() * 100} decimals={1} />}
                {cc === OSC_TYPE && <div className="osc">{mapped}</div>}
                <ControlMods cc={cc} />
            </div>
        );

    }
}

export default inject('state')(observer(Control));
