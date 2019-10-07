import React, {Component} from "react";
import "./PresetSelector.css";
import {inject, observer} from "mobx-react";
import {readPreset, sendPC} from "../utils/midi";

class PresetSelector extends Component {

    state = {
        direct_access: false,
        p: '1',
        reading_all: false,
        abort_all: false
    };

    toggleDirectAccess = () => {
        this.setState({direct_access: !this.state.direct_access})
    };

    setPreset = (s) => {
        // let s = e.target.value;
        if (s) {
            let v = parseInt(s, 10);
            console.log("parseInt", v);
            if (!v) {
                s = '';
                v = 1;
            }
            if (v > 256) {
                s = '256';
                v = 256;
            }
            if (v < 1) {
                s = '1';
                v = 1;
            }
            this.props.state.preset.current = v;
            // this.props.state.data_name = [];    //TODO: make method
        }
        this.setState({p: s});
    };

    prev = () => {
        const n = this.props.state.preset.current - 1;
        this.setPreset(n < 1 ? 256 : n);
    };

    next = () => {
        const n = this.props.state.preset.current + 1;
        this.setPreset(n > 256 ? 1 : n);
    };

    go = () => {
        sendPC(this.props.state.preset.current - 1);
    };

    selectDirect = (n) => {
        // this.setState({p: n.toString()});
        this.setPreset(n.toString());
        this.go();
        this.setState({direct_access: false})
    };

    readAll = async () => {

        if (!this.props.state.hasInputAndOutputEnabled()) {
            if (global.dev) console.log("readAllPresets: no output and/or input connected, ignore request");
            return;
        }

        this.setState({reading_all: true});
        // this.abort_all = false;

        this.props.state.all = [];
        for (let n = 1; n <= 56; n++) {
            // if (this.abort_all) break;
            if (this.state.abort_all) break;
            this.setPreset(n.toString());
            await readPreset();
            this.props.state.all[n] = [...this.props.state.data];
        }

        this.setState({reading_all: false});
        this.setState({abort_all: false});
    };

    abortAll = () => {
        this.setState({abort_all: true});
        // this.abort_all = true;
    };

    render() {
        const S = this.props.state;

        const midi_ok = S.hasInputEnabled() && S.hasOutputEnabled();

        const pc = [];
        for (let i=1; i<=256; i++){
            pc.push(<div key={i} className={i === S.preset.current ? 'sel' : ''} onClick={() => this.selectDirect(i)}>{i}</div>);
        }

        return (
            <div className="preset-selector">
                <div className="seq-access">
                    <input type="text" id="preset" name="preset" min="1" max="256" value={this.state.p} onChange={(e) => this.setPreset(e.target.value)} />
                    <button onClick={this.prev} title="Previous">&lt;</button>
                    <button onClick={this.next} title="Next">&gt;</button>
                    <button onClick={this.toggleDirectAccess} title="Choose the preset number then send a PC message to the MF.">#...</button>
                    <button onClick={this.go} title="Send a PC message to the MicroFreak to select this preset on the MicroFreak itself.">load in MF</button>
                    <button className={midi_ok ? "read-button ok" : "read-button"} type="button" onClick={readPreset}>READ</button>
                    {!this.state.reading_all && <button onClick={this.readAll} title="Read all">Read all</button>}
                    {this.state.reading_all && <button onClick={this.abortAll} title="Abort reading all">{this.state.abort_all ? "aborting" : "Abort read all"}</button>}
                </div>
                {this.state.direct_access && <div className="direct-access">{pc}</div>}
{/*
                <div>
                    {this.state.abort_all && <span className="aborting">aborting...</span>}
                </div>
*/}
            </div>
        );
    }

}

export default inject('state')(observer(PresetSelector));