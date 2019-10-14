import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
// import "./PresetName.css";

class ErrorBanner extends Component {

    render() {

        let msg = null;

        const S = this.props.state;

/*
        if (!S.hasInputEnabled() || !S.hasOutputEnabled()) {
            msg = "Enable the input and the output corresponding to your MicroFreak.";
        }
*/

        if (!msg && S.error) {
            switch (S.error) {
                case 1:
                    msg = 'MIDI communication error. Try restarting the MicroFreak.';
                    break;
                default:
                    msg = 'Unknonw error code: ' + S.error;
            }
        }

        return msg ? <div className="warning banner">{msg}</div> : null;

    }
}

export default inject('state')(observer(ErrorBanner));
