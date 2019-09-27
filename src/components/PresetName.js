import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {hs} from "../utils/hexstring";
import "./PresetName.css";

class PresetName extends Component {

    render() {

        const S = this.props.state;

        return (
            <div className="preset-name">
                {S.presetName()}
            </div>
        );

    }
}

export default inject('state')(observer(PresetName));
