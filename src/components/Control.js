import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {h} from "../utils/hexstring";
import {control_details} from "../model";
import "./Control.css";

class Control extends Component {

    render() {
        const {cc, state} = this.props;
        return (
            <div className="control">
                <div className="ctrl-value">{state.preset[cc]}</div>
                <div className="ctrl-value-hex">0x{h(state.preset[cc])}</div>
                <div className="ctrl-name">{control_details[cc].name}</div>
            </div>
        );
    }
}

export default inject('state')(observer(Control));
