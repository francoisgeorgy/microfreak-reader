import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {h} from "../utils/hexstring";
import {CONTROL, OSC_TYPE} from "../model";
import "./Control.css";
import ControlMods from "./ControlMods";
import Knob from "./Knob";
import Bar from "./Bar";

class Control extends Component {

    render() {

        // console.log("Control.render");

        const {cc, state: S} = this.props;
        const control = CONTROL[cc];
        // const v = d.mapping ? d.mapping(S.preset[cc]) : S.preset[cc];
        // const v = -100;

        const v = S.controlValue(control);

        //HACK:
        const c = cc === OSC_TYPE ? 'xlarge' : '';

        return (
            <div className={`control ${c}`}>
                {/*<div className="ctrl-value">{state.preset[cc]}</div>*/}
                {/*<div className="ctrl-value">{v}</div>*/}
                {/*<div className="ctrl-value-hex">0x{h(state.preset[cc])}</div>*/}
                <div className="ctrl-name">{control.name}</div>
                {cc !== OSC_TYPE && <Knob value={v} decimals={1} />}
                {cc === OSC_TYPE && <div>Karplus<br/>Strong{v}</div>}
                <ControlMods cc={cc} />
            </div>
        );

    }
}

export default inject('state')(observer(Control));
