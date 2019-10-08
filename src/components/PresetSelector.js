import React, {Component} from "react";
import "./PresetSelector.css";
import {inject, observer} from "mobx-react";
import {readPreset, sendPC, wait, WAIT_BETWEEN_MESSAGES} from "../utils/midi";

class PresetSelector extends Component {

    state = {
        direct_access: false,
        // p: '1',
        reading_all: false,
        abort_all: false
    };

    toggleDirectAccess = () => {
        this.setState({direct_access: !this.state.direct_access})
    };

    setPreset = (s) => {
        if (s) {
            let v = parseInt(s, 10);
            if (!v) {
                s = '';
                v = 0;
            }
            v = v - 1;    // index is 0..255 but displayed as 1..256
            if (v > 255) {
                s = '256';
                v = 255;
            }
            if (v < 0) {
                s = '1';
                v = 0;
            }
            this.props.state.preset_number = v;
            // this.props.state.data_name = [];    //TODO: make method
        }
        //this.setState({p: s});
        console.log("setPreset", s);
        this.props.state.preset_number_string = s;
    };

    prev = () => {
        const n = this.props.state.preset_number - 1;
        // this.setPreset(n < 0 ? '255' : n.toString());
        this.props.state.setPresetNumber(n < 0 ? 255 : n);
    };

    next = () => {
        const n = this.props.state.preset_number + 1;
        // this.setPreset(n > 255 ? '1' : n.toString());
        this.props.state.setPresetNumber(n > 255 ? 0 : n);
    };

    go = () => {
        sendPC(this.props.state.preset_number);
    };

    selectDirect = (n) => {
        this.setPreset(n.toString());
        // this.go();
        // this.props.state.loadPreset(n);
        // this.props.state.preset_number = n;
        this.setState({direct_access: false})
    };

    readAll = async () => {

        if (!this.props.state.hasInputAndOutputEnabled()) {
            if (global.dev) console.log("readAllPresets: no output and/or input connected, ignore request");
            return;
        }

        this.setState({reading_all: true});
        // this.abort_all = false;

        // this.props.state.all = [];
        for (let n = 0; n < 256; n++) {
            // if (this.abort_all) break;
            if (this.state.abort_all) break;
            this.setPreset(n.toString());
            await readPreset(n);
            await wait(4 * WAIT_BETWEEN_MESSAGES);
            // console.log(n, this.props.state.data);
            // this.props.state.all[n] = [...this.props.state.data];
            // this.props.state.all_name[n] = this.props.state.data_name;
        }

        // console.log(this.props.state.all);

        this.setState({reading_all: false});
        this.setState({abort_all: false});
    };

    abortAll = () => {
        this.setState({abort_all: true});
        // this.abort_all = true;
    };

    render() {

        const S = this.props.state;

        if (global.dev) console.log("PresetSelector.render", S.preset_number);

        const midi_ok = S.hasInputEnabled() && S.hasOutputEnabled();

        const pc = [];
        const plength = S.presets.length;
        for (let i=0; i<256; i++) {
            let classname = i === S.preset_number ? 'sel' : '';
            if (plength && (plength >= i && S.presets[i])) {
                classname += ' loaded';
            }
            pc.push(<div key={i} className={classname} onClick={() => this.selectDirect(i)}>{i+1}</div>);
        }

        // TODO:
        //
        // - READ
        // - READ ALL
        // - RE-READ

        return (
            <div className="preset-selector">
                <div className="seq-access">
                    <input type="text" id="preset" name="preset" min="1" max="256" value={S.preset_number_string} onChange={(e) => this.props.state.setPresetNumber(e.target.value)} />
                    <button onClick={this.prev} title="Previous">&lt;</button>
                    <button onClick={this.next} title="Next">&gt;</button>
                    <button onClick={this.toggleDirectAccess} title="Choose the preset number then send a PC message to the MF.">#...</button>
                    <button onClick={this.go} title="Send a PC message to the MicroFreak to select this preset on the MicroFreak itself.">load in MF</button>
                    <button className={midi_ok ? "read-button ok" : "read-button"} type="button" onClick={readPreset}>READ</button>
                    {!this.state.reading_all && <button onClick={this.readAll} title="Read all">Read all</button>}
                    {this.state.reading_all && <button onClick={this.abortAll} title="Abort reading all" className="abort">{this.state.abort_all ? "aborting" : "Abort read all"}</button>}
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