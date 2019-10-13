import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
// import "./PresetName.css";

class ErrorBanner extends Component {

    render() {

        const S = this.props.state;
        // const preset_name = S.presetName(S.preset_number);

        if (!S.error) return null;

        let s;
        switch (S.error) {
            case 1:
                s = 'MIDI communication error. Please restart the connected MicroFreak and try again.';
                break;
            default:
                s = 'Unknonw error code: ' + S.error;
        }

        return <div className="warning banner">{s}</div>;

    }
}

export default inject('state')(observer(ErrorBanner));
