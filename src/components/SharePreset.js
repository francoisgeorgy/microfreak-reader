import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

class SharePreset extends Component {

    render() {
        const S = this.props.state;
        const preset_name = S.presetName(S.preset_number);
        return preset_name ? <div>share</div> : null;
    }
}

export default inject('state')(observer(SharePreset));
