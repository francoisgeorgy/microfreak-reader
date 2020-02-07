import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

class PresetName extends Component {

    render() {
        const S = this.props.state;
        const preset_name = S.presetName(S.preset_number);
        const preset_cat = S.presetCat(S.preset_number);
        return preset_name ? <div> &#x2013; preset #{S.preset_number + 1} &#171; {preset_name} &#187; ({preset_cat})</div> : null;
    }
}

export default inject('state')(observer(PresetName));
