import React, {Component} from "react";
import "./PresetSelector.css";
import {inject, observer} from "mobx-react";
import {PORT_OUTPUT} from "./Midi";
import {portById, sendPC} from "../utils/midi";
import WebMidi from "webmidi";

class PresetSelector extends Component {

    state = {
        direct_access: false,
        p: '1'
    };

    toggleDirectAccess = () => {
        this.setState({direct_access: !this.state.direct_access})
    };

    setPreset = (s) => {
        // let s = e.target.value;
        if (s) {
            let v = parseInt(s, 10);
            if (v > 256) {
                s = '256';
                v = 256;
            }
            if (v < 1) {
                s = '1';
                v = 1;
            }
            this.props.state.preset.current = v;
        }
        this.setState({p: s});
    };

    go = () => {
        sendPC(this.props.state.preset.current - 1);
    };

    selectDirect = (n) => {
        // this.setState({p: n.toString()});
        this.setPreset(n.toString());
        this.go();
    };

    render() {

        const pc = [];
        for (let i=1; i<=256; i++){
            pc.push(<div key={i} className={i === this.props.state.preset.current ? 'sel' : ''} onClick={() => this.selectDirect(i)}>{i}</div>);
        }

        return (
            <div className="preset-selector">
                <div className="seq-access">
                    <label>Preset:</label><input type="number" id="preset" name="preset" min="1" max="256" value={this.state.p} onChange={(e) => this.setPreset(e.target.value)} />
                    {/*<div>prev</div>*/}
                    {/*<div>next</div>*/}
                    <button onClick={this.go}>go</button>
                    <button onClick={this.toggleDirectAccess}>{this.state.direct_access ? 'hide direct access ...' : 'direct access ...'}</button>
                </div>
                <div className="direct-access">{this.state.direct_access && pc}</div>
            </div>
        );
    }

}

export default inject('state')(observer(PresetSelector));