import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {h} from "../utils/hexstring";
import {control, control_details} from "../model";
import "./Control.css";

class Control extends Component {

    render() {
        const {cc, state} = this.props;
        const d = control_details[cc];
        const v = d.mapping ? d.mapping(state.preset[cc]) : state.preset[cc];

        //HACK:
        const c = cc === control.osc_type ? 'large' : '';

        return (
            <div className={`control ${c}`}>
                {/*<div className="ctrl-value">{state.preset[cc]}</div>*/}
                <div className="ctrl-value">{v}</div>
                <div className="ctrl-value-hex">0x{h(state.preset[cc])}</div>
                <div className="ctrl-name">{control_details[cc].name}</div>
            </div>
        );
    }
}

export default inject('state')(observer(Control));
