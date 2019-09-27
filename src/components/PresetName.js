import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
// import "./PresetName.css";

class PresetName extends Component {

    render() {

        const S = this.props.state;
        const preset_name = S.presetName();

        return preset_name ? <div>&#x2013; preset #{S.preset.reference} &#171; {preset_name} &#187;</div> : null;

    }
}

export default inject('state')(observer(PresetName));
