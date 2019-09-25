import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import "./ReadProgress.css";

class ReadProgress extends Component {

    render() {

        const S = this.props.state;

        return (
            <div className="progress">
                {S.preset.current_counter}
            </div>
        );

    }
}

export default inject('state')(observer(ReadProgress));
