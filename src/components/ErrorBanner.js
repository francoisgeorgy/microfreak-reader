import React, {Component} from 'react';
import {inject, observer} from "mobx-react";

class ErrorBanner extends Component {

    render() {

        let msg = null;

        const S = this.props.state;

        // if (S.error) {
            switch (S.error) {
                case null:
                    break;
                case 1:
                    msg = 'MIDI communication error. Try restarting the MicroFreak.';
                    break;
                default:
                    msg = 'Unknonw error code: ' + S.error;
            }
        // }

        return msg ? <div className="warning banner">{msg}</div> : null;

    }
}

export default inject('state')(observer(ErrorBanner));
