import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {h} from "../utils/hexstring";
import {CONTROL, OSC_TYPE} from "../model";
import "./Control.css";

class Control extends Component {

    render() {

        const {cc, state} = this.props;
        const d = CONTROL[cc];
        const v = d.mapping ? d.mapping(state.preset[cc]) : state.preset[cc];

        //HACK:
        const c = cc === OSC_TYPE ? 'large' : '';

        return (
            <div className={`control ${c}`}>
                {/*<div className="ctrl-value">{state.preset[cc]}</div>*/}
                <div className="ctrl-value">{v}</div>
                <div className="ctrl-value-hex">0x{h(state.preset[cc])}</div>
                <div className="ctrl-name">{d.name}</div>
            </div>
        );

    }
}

export default inject('state')(observer(Control));
