import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import "./ReadProgress.css";

class ReadProgress extends Component {

    render() {

        const S = this.props.state;
        const p = S.preset.current_counter / 40 * 100;
        const all_done = S.preset.current_counter >= 40;

        if (p < 0.01) return null;

        return (
            <div className={`progress ${all_done ? 'done' : ''}`}>
                <div className="progress-bar" style={{width:`${p}%`}}>
                    &nbsp;
                </div>
                <div className="progress-counter">
                    Reading preset... {Math.round(p)}%
                </div>
            </div>
        );

    }
}

export default inject('state')(observer(ReadProgress));
