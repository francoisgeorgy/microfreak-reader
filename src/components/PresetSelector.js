import React, {Component} from "react";
import "./PresetSelector.css";
import {inject, observer} from "mobx-react";
import {readPreset, sendPC, wait, WAIT_BETWEEN_MESSAGES} from "../utils/midi";
import {savePreferences} from "../utils/preferences";
import {readFile} from "../utils/files";

class PresetSelector extends Component {

    state = {
        direct_access: false,
        // p: '1',
        reading_all: false,
        abort_all: false,
        // sync: true,
        unread: true
    };

    constructor(props) {
        super(props);
        this.inputOpenFileRef = React.createRef();
    }

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
        if (this.props.state.send_pc) {
            this.go();
        }
    };

    prev = () => {
        const n = this.props.state.preset_number - 1;
        // this.setPreset(n < 0 ? '255' : n.toString());
        this.props.state.setPresetNumber(n < 0 ? 255 : n);
        if (this.props.state.send_pc) {
            this.go();
        }
    };

    next = () => {
        const n = this.props.state.preset_number + 1;
        // this.setPreset(n > 255 ? '1' : n.toString());
        this.props.state.setPresetNumber(n > 255 ? 0 : n);
        if (this.props.state.send_pc) {
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
        this.setState({direct_access: false});
        if (this.props.state.send_pc) {
            this.go();
        }
    };

    readSelected = async () => {
        this.props.state.error = 0;
        if (!await readPreset()) {
            console.warn("read preset fail");
            this.props.state.error = 1;
        }
    };

    readAll = async (from=0, to=255, unread_only=false) => {

        if (!this.props.state.hasInputAndOutputEnabled()) {
            if (global.dev) console.log("readAllPresets: no output and/or input connected, ignore request");
            return;
        }

        this.props.state.error = 0;

        this.setState({reading_all: true});

        const S = this.props.state;

        for (let n = from; n <= to; n++) {
            if (this.state.abort_all) break;

            if (unread_only && (S.presets.length && (S.presets.length > n && S.presets[n]))) continue;

            if (! await readPreset(n)) {
                console.warn("read preset fail");
                this.props.state.error = 1;
                break;
            }

            S.setPresetNumber(n);
            await wait(4 * WAIT_BETWEEN_MESSAGES);  // by updating the preset_number _after_ the reading, we avoid to display an empty preset while reading. This is much more pleasant.
        }

        this.setState({reading_all: false});
        this.setState({abort_all: false});
    };

    read1To256 = () => {
        this.readAll(0, 255, this.state.unread);
    };

    readNTo256 = () => {
        this.readAll((this.props.state.preset_number + 1) % 256, 255, this.state.unread);
    };

/*
    read128To256 = () => {
        this.readAll(127, 255, this.state.unread);
    };
*/

    // readUnread = () => {
    //     this.readAll(0, 255, true);
    // };

    abortAll = () => {
        this.setState({abort_all: true});
        // this.abort_all = true;
    };

    toggleSync = () => {
        // this.setState({sync: !this.state.sync});
        this.props.state.send_pc = !this.props.state.send_pc;
        savePreferences({send_pc: this.props.state.send_pc});
    };

    toggleUnread = () => {
        this.setState({unread: !this.state.unread});
    };

    onFileSelection = async e => {
        if (global.dev) console.log("onFileSelection");
        this.props.state.presets = await readFile(e.target.files[0]);
    };

    importFromFile = () => {
        if (global.dev) console.log("importFromFile");
        this.inputOpenFileRef.current.click()
    };

    exportAsFile = () => {

        // const bytes = ;

        let url = window.URL.createObjectURL(new Blob([JSON.stringify(this.props.state.presets)], {type: "application/json"}));

        let now = new Date();
        let timestamp =
            now.getUTCFullYear() + "-" +
            ("0" + (now.getUTCMonth() + 1)).slice(-2) + "-" +
            ("0" + now.getUTCDate()).slice(-2) + "-" +
            ("0" + now.getUTCHours()).slice(-2) + "" +
            ("0" + now.getUTCMinutes()).slice(-2) + "" +
            ("0" + now.getUTCSeconds()).slice(-2);
        let filename = 'microfreak-reader.' + timestamp;

        let shadowlink = document.createElement("a");
        shadowlink.download = filename + ".json";
        shadowlink.style.display = "none";
        shadowlink.href = url;

        document.body.appendChild(shadowlink);
        shadowlink.click();
        document.body.removeChild(shadowlink);

        setTimeout(function() {
            return window.URL.revokeObjectURL(url);
        }, 1000);

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
                    <button className="button-midi" onClick={this.go} title="Send a PC message to the MicroFreak to select this preset on the MicroFreak itself.">PC</button>
                    <button className={midi_ok ? "button-midi read-button ok" : "button-midi read-button"} type="button" onClick={this.readSelected}>READ</button>
                    {/*{!this.state.reading_all && <button onClick={this.readAll} title="Read all">Read all</button>}*/}
                    <label title="Automatically sends a PC message to the MF on preset change."><input type="checkbox" checked={this.props.state.send_pc} onChange={this.toggleSync}/> send PC</label>
                </div>
{/*
                <div>
                    <input type="checkbox" checked={this.props.state.send_pc} onChange={this.toggleSync}/> automatically send PC to MF on preset change
                </div>
*/}
                <div>
                    {!this.state.reading_all && <button className="button-midi" onClick={this.read1To256} title="Read all">Read 1..256</button>}
                    {!this.state.reading_all && <button className="button-midi" onClick={this.readNTo256} title="Read all">Read {preset_to}..256</button>}
                    {/*{!this.state.reading_all && <button className="button-midi" onClick={this.read128To256} title="Read all">Read 128..256</button>}*/}
                    {/*{!this.state.reading_all && <button onClick={this.readUnread} title="Read all">Read unread</button>}*/}
                    {this.state.reading_all && <button className="button-midi abort" onClick={this.abortAll} title="Stop reading all">{this.state.abort_all ? "Stopping..." : "STOP"}</button>}
                    <label title="Only read unread presets"><input type="checkbox" checked={this.state.unread} onChange={this.toggleUnread}/> only unread</label>
                </div>
                {this.state.direct_access && <div className="direct-access">{pc}</div>}
{/*
                <div>
                    {this.state.abort_all && <span className="aborting">aborting...</span>}
                </div>
*/}
                <div>
                    <input ref={this.inputOpenFileRef} type="file" style={{display:"none"}}  onChange={this.onFileSelection} />
                    <button type="button midi-ok" onClick={this.importFromFile}>Import from file</button>
                    <button type="button midi-ok" onClick={this.exportAsFile}>Export to file</button>
                </div>
            </div>
        );
    }

}

export default inject('state')(observer(PresetSelector));