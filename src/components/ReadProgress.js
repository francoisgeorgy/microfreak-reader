import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import "./ReadProgress.css";

class ReadProgress extends Component {

    render() {

        const S = this.props.state;
        const p = S.read_progress / 40 * 100;
        const all_done = S.read_progress >= 40;

        if (p < 0.01) return null;

        return (
            <div className={`progress ${all_done ? 'done' : ''}`}>
                <div className="progress-bar" style={{width:`${p}%`}}>
                    &nbsp;
                </div>
                <div className="progress-counter">
                    Reading preset #{S.preset.current}... {Math.round(p)}%
                </div>
            </div>
        );

    }
}

export default inject('state')(observer(ReadProgress));
