import React, {Component} from "react";
import "./PresetSelector.css";
import {inject, observer} from "mobx-react";

class PresetSelector extends Component {

    state = {
        direct_access: false
    };

    toggleDirectAccess = () => {
        this.setState({direct_access: !this.state.direct_access})
    };

    selectPreset = n => {
        console.log(n);
        // const out = outputById(this.props.state.midi.output);
    };

    render() {

        const pc = [];
        for (let i=0; i<256; i++){
            pc.push(<div onClick={() => this.selectPreset(i)}>{i}</div>);
        }

        return (
            <div className="preset-selector">
                <div className="seq-access">
                    <div>prev</div>
                    <div>next</div>
                    <div className="toggle" onClick={this.toggleDirectAccess}>&#8943;</div>
                </div>
                <div className="direct-access">{this.state.direct_access && pc}</div>
            </div>
        );
    }

}

export default inject('state')(observer(PresetSelector));