import React, {Component} from "react";
import "./PresetSelector.css";
import {inject, observer} from "mobx-react";
import {readPreset, sendPC, wait, WAIT_BETWEEN_MESSAGES} from "../utils/midi";

class PresetSelector extends Component {

    state = {
        direct_access: false,
        // p: '1',
        reading_all: false,
        abort_all: false,
        sync: true,
        unread: true
    };

    toggleDirectAccess = () => {
        this.setState({direct_access: !this.state.direct_access})
    };

/*
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
        // console.log("setPreset", s);
        this.props.state.preset_number_string = s;
    };
*/

    change = (e) => {
        this.props.state.setPresetNumber(e.target.value);
        if (this.state.sync) {
            this.go();
        }
    };

    prev = () => {
        const n = this.props.state.preset_number - 1;
        // this.setPreset(n < 0 ? '255' : n.toString());
        this.props.state.setPresetNumber(n < 0 ? 255 : n);
        if (this.state.sync) {
            this.go();
        }
    };

    next = () => {
        const n = this.props.state.preset_number + 1;
        // this.setPreset(n > 255 ? '1' : n.toString());
        this.props.state.setPresetNumber(n > 255 ? 0 : n);
        if (this.state.sync) {
            this.go();
        }
    };

    go = () => {
        sendPC(this.props.state.preset_number);
    };

    selectDirect = (n) => {
        this.props.state.setPresetNumber(n);
        // this.go();
        // this.props.state.loadPreset(n);
        // this.props.state.preset_number = n;
        this.setState({direct_access: false})
        if (this.state.sync) {
            this.go();
        }
    };

    readAll = async (from=0, to=255, unread_only=false) => {

        if (!this.props.state.hasInputAndOutputEnabled()) {
            if (global.dev) console.log("readAllPresets: no output and/or input connected, ignore request");
            return;
        }

        this.setState({reading_all: true});
        // this.abort_all = false;

        const S = this.props.state;

        // this.props.state.all = [];
        for (let n = from; n <= to; n++) {
            // if (this.abort_all) break;
            if (this.state.abort_all) break;
            // this.props.state.setPresetNumber(n);

            if (unread_only && (S.presets.length && (S.presets.length > n && S.presets[n]))) continue;

            await readPreset(n);
            S.setPresetNumber(n);
            await wait(4 * WAIT_BETWEEN_MESSAGES);  // by updating the preset_number _after_ the reading, we avoid to display an empty preset while reading. This is much more pleasant.
            // console.log(n, this.props.state.data);
            // this.props.state.all[n] = [...this.props.state.data];
            // this.props.state.all_name[n] = this.props.state.data_name;
        }

        // console.log(this.props.state.all);

        this.setState({reading_all: false});
        this.setState({abort_all: false});
    };

    read1To256 = () => {
        this.readAll(0, 255, this.state.unread);
    };

    readNTo256 = () => {
        this.readAll((this.props.state.preset_number + 1) % 256, 255, this.state.unread);
    };

    read128To256 = () => {
        this.readAll(127, 255, this.state.unread);
    };

    // readUnread = () => {
    //     this.readAll(0, 255, true);
    // };

    abortAll = () => {
        this.setState({abort_all: true});
        // this.abort_all = true;
    };

    toggleSync = () => {
        this.setState({sync: !this.state.sync});
    };

    toggleUnread = () => {
        this.setState({unread: !this.state.unread});
    };

    render() {

        const S = this.props.state;

        // if (global.dev) console.log("PresetSelector.render", S.preset_number, S.presets.length);

        const midi_ok = S.hasInputEnabled() && S.hasOutputEnabled();

        const pc = [];
        const plength = S.presets.length;
        for (let i=0; i<256; i++) {
            let classname = i === S.preset_number ? 'sel' : '';
            if (plength && (plength > i && S.presets[i])) {
                classname += ' loaded';
            }
            pc.push(<div key={i} className={classname} onClick={() => this.selectDirect(i)}>{i+1}</div>);
        }

        let preset_to = S.preset_number + 2;
        if (preset_to > 256) preset_to = 1;

        // TODO:
        //
        // - READ
        // - READ ALL
        // - RE-READ
        return (
            <div className={`preset-selector ${midi_ok?'midi-ok':'midi-ko'}`}>
                <div className="seq-access">
                    <input type="text" id="preset" name="preset" min="1" max="256" value={S.preset_number_string} onChange={this.change} />
                    <button onClick={this.prev} title="Previous">&lt;</button>
                    <button onClick={this.next} title="Next">&gt;</button>
                    <button onClick={this.toggleDirectAccess} title="Choose the preset number then send a PC message to the MF.">#...</button>
                    <button onClick={this.go} title="Send a PC message to the MicroFreak to select this preset on the MicroFreak itself.">load in MF</button>
                    <button className={midi_ok ? "read-button ok" : "read-button"} type="button" onClick={() => readPreset()}>READ</button>
                    {/*{!this.state.reading_all && <button onClick={this.readAll} title="Read all">Read all</button>}*/}
                    <label title="Automatically sends a PC message to the MF on preset change."><input type="checkbox" checked={this.state.sync} onChange={this.toggleSync}/> send PC</label>
                </div>
{/*
                <div>
                    <input type="checkbox" checked={this.state.sync} onChange={this.toggleSync}/> automatically send PC to MF on preset change
                </div>
*/}
                <div>
                    {!this.state.reading_all && <button onClick={this.read1To256} title="Read all">Read 1..256</button>}
                    {!this.state.reading_all && <button onClick={this.readNTo256} title="Read all">Read {preset_to}..256</button>}
                    {!this.state.reading_all && <button onClick={this.read128To256} title="Read all">Read 128..256</button>}
                    {/*{!this.state.reading_all && <button onClick={this.readUnread} title="Read all">Read unread</button>}*/}
                    {this.state.reading_all && <button onClick={this.abortAll} title="Abort reading all" className="abort">{this.state.abort_all ? "Aborting" : "ABORT"}</button>}
                    <label title="Only read unread presets"><input type="checkbox" checked={this.state.unread} onChange={this.toggleUnread}/> only unread</label>
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