import React, {Component} from 'react';
import './App.css';
import './List.css';
import {Provider} from "mobx-react";
import {state} from "./state/State";
import PresetSelector from "./components/PresetSelector";
import {
    DEFAULT_THEME,
    loadPreferences,
    savePreferences
} from "./utils/preferences";
import ListView from "./components/ListView";
import {readFile} from "./utils/files";

class List extends Component {

    state = {
        theme: DEFAULT_THEME
    };

    selectTheme = (e) => {
        this.setState({theme: e.target.value});
        savePreferences({theme: e.target.value});
    };

    selectPresetPos = (e) => {
        this.setState({presets_pos: e.target.value});
        savePreferences({presets_pos: e.target.value});
    };

    loadData = async e => {
        if (global.dev) console.log("load data", e.target.value);
        if (e.target.value) {
            let response = await fetch("data/" + e.target.value);
            state.presets = await response.json();
            state.checkAllPresets();
        }
    };

    onFileSelection = async e => {
        if (global.dev) console.log("onFileSelection");
        state.presets = await readFile(e.target.files[0]);
    };

    importFromFile = () => {
        if (global.dev) console.log("importFromFile");
        this.inputOpenFileRef.current.click()
    };


    componentDidMount(){
        const s = loadPreferences();
        this.setState({
            theme: s.theme || DEFAULT_THEME
        });
    }

    render() {

        const { theme } = this.state;
        document.documentElement.setAttribute('data-theme', theme);

        return (
            <Provider state={state}>
                <div className="lw">
                    <div className="header">
                        <div className="title">
                            MicroFreak presets
                        </div>
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
                        <div className="header-options">
                            <select value={this.state.theme} onChange={this.selectTheme}>
                                <option value="light">Light theme</option>
                                <option value="dark">Dark theme</option>
                                <option value="darker">Darkest theme</option>
                            </select>
                        </div>
                    </div>
                    <div className="App">
                        {/*<PresetSelector />*/}
                        <ListView />
                    </div>
                </div>
            </Provider>
        );
    }

}

export default List;
