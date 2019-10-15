import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import "./ReadProgress.css";
import {MESSAGES_TO_READ_FOR_PRESET} from "../utils/midi";

class ReadProgress extends Component {

    render() {

        const S = this.props.state;
        const p = S.read_progress / MESSAGES_TO_READ_FOR_PRESET * 100;
        if (p < 0.01) return null;

        const all_done = S.read_progress >= MESSAGES_TO_READ_FOR_PRESET;

        return (
            <div className={`progress ${all_done ? 'done' : ''}`}>
                <div className="progress-bar" style={{width:`${p}%`}}>
                    &nbsp;
                </div>
                <div className="progress-counter">
                    Reading preset #{S.preset_number_comm + 1}... {Math.round(p)}%
                </div>
            </div>
        );

    }
}

export default inject('state')(observer(ReadProgress));
