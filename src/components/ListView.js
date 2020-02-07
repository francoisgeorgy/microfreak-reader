import React, {Component, Fragment} from "react";
// import "./PresetsGrid.css";
import {inject, observer} from "mobx-react";
import {readPreset, sendPC} from "../utils/midi";
import {CONTROL, OSC_TYPE} from "../model";
import {readFile} from "../utils/files";

class ListView extends Component {
/*

    loadData = async e => {
        if (global.dev) console.log("load data", e.target.value);
        if (e.target.value) {
            let response = await fetch("data/" + e.target.value);
            this.props.state.presets = await response.json();
            this.props.state.checkAllPresets();
        }
    };

    onFileSelection = async e => {
        if (global.dev) console.log("onFileSelection");
        this.props.state.presets = await readFile(e.target.files[0]);
    };

    importFromFile = () => {
        if (global.dev) console.log("importFromFile");
        this.inputOpenFileRef.current.click()
    };

*/

    state = {
        cols: 4
    };

    render() {

/*
        const S = this.props.state;

        const pc = [];
        for (let i=0; i<256; i++) {

            let classname = i === S.preset_number ? 'sel' : '';
            if (S.presets.length && (S.presets.length > i && S.presets[i])) {
                classname += ' loaded';
            }
            pc.push(
                <div key={i} className={classname} onClick={() => this.selectPreset(i)}>
                    {i+1}&nbsp;&nbsp;{S.presetName(i)}
                </div>
            );
        }

        return (
            <Fragment>
                <div className="presets-grid">
                    {pc}
                </div>
            </Fragment>
        );
*/

        const S = this.props.state;

        const fw = S.fwVersion();

        const control = CONTROL[fw][OSC_TYPE];

        const cols = 4; //this.state.cols;
        const delta = 256 / cols;

        const pc = [];
        for (let i=0; i<(256 / cols); i++) {
            for (let c=0; c<cols; c++) {

                const k = c*delta + i;

                const v = S.controlValue(control, true, k);
                const mapped = control.mapping ? control.mapping(v, fw) : '';
                const n = S.presetName(k);
                pc.push(
                    <Fragment key={i}>
                        <div className={`num ${c===0?'':'pl'}`}>{k+1}</div>
                        <div>&nbsp;</div>
                        <div>{n}</div>
                        <div>{n && mapped}</div>
                    </Fragment>
                );
            }
        }

        return (
            <div className="lw-content">
{/*
                <div>
                    <select className="preloader" onChange={this.loadData}>
                        <option value="">Packs...</option>
                        <option value="Factory_1-1.json">Factory 1.1</option>
                        <option value="Factory_2-0.json">Factory 2.0</option>
                        <option value="Naughty_Bass.json">Naughty Bass</option>
                        <option value="Plaisir_Pads.json">Plaisir Pads</option>
                        <option value="Tech_Loop.json">Tech Loop</option>
                        <option value="Arp_Monster.json">Arp Monster</option>
                    </select>
                    <input ref={this.inputOpenFileRef} type="file" style={{display:"none"}}  onChange={this.onFileSelection} />
                    <button type="button midi-ok" onClick={this.importFromFile}>Load file</button>
                </div>
*/}
                <div className="lw-presets-list">
                    <div className="lw-h num">#</div>
                    <div className="lw-h">cat.</div>
                    <div className="lw-h">name</div>
                    <div className="lw-h">osc. type</div>
                    <div className="lw-h num">#</div>
                    <div className="lw-h">cat.</div>
                    <div className="lw-h">name</div>
                    <div className="lw-h">osc. type</div>
                    <div className="lw-h num">#</div>
                    <div className="lw-h">cat.</div>
                    <div className="lw-h">name</div>
                    <div className="lw-h">osc. type</div>
                    <div className="lw-h num">#</div>
                    <div className="lw-h">cat.</div>
                    <div className="lw-h">name</div>
                    <div className="lw-h">osc. type</div>
                    {pc}
                </div>
            </div>
        );
    }

}

export default inject('state')(observer(ListView));