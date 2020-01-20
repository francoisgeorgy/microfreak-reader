import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

class ErrorBanner extends Component {

    render() {

        let msg = null;

        const S = this.props.state;

        switch (S.error) {
            case null:
            case 0:
                break;
            case 1:
                msg = 'MIDI communication error. Try restarting the MicroFreak.';
                break;
            case 2:
                msg = 'Unsupported browser. No support for MIDI.';
                break;
            default:
                msg = 'Unknown error code: ' + S.error;
        }

        return msg ? <div className="warning banner">{msg}</div> : null;

    }
}

export default inject('state')(observer(ErrorBanner));
