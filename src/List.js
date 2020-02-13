import React, {Component} from 'react';
import './App.css';
import './List.css';
import {Provider} from "mobx-react";
import {state} from "./state/State";
import {
    DEFAULT_THEME,
    loadPreferences,
    savePreferences
} from "./utils/preferences";
import ListView from "./components/ListView";
import {readFile} from "./utils/files";

const PACKS = {
    "Factory_1-1.json": 'Factory 1.1',
    "Factory_2-0.json": 'Factory 2.0',
    "Naughty_Bass.json": 'Naughty Bass',
    "Plaisir_Pads.json": 'Plaisir Pads',
    "Tech_Loop.json": 'Tech Loop',
    "Arp_Monster.json": 'Arp Monster'
};

class List extends Component {

    state = {
        theme: DEFAULT_THEME,
        pack: null,
        filename: null
    };

    constructor(props) {
        super(props);
        this.inputOpenFileRef = React.createRef();
    }

    selectTheme = (e) => {
        this.setState({theme: e.target.value});
        savePreferences({theme: e.target.value});
    };

    selectPresetPos = (e) => {
        this.setState({presets_pos: e.target.value});
        savePreferences({presets_pos: e.target.value});
    };

    loadData = async e => {
        const n = e.target.value;
        if (global.dev) console.log("load data", n);
        if (n) {
            // this.setState({pack: e.target.value});
            let response = await fetch("data/" + n);
            state.presets = await response.json();
            // state.filename = n;
            state.checkAllPresets();
            this.setState({pack: n, filename: PACKS[n]});
        }
    };

    onFileSelection = async e => {
        if (global.dev) console.log("onFileSelection");
        const f = e.target.files[0];
        const data = await readFile(f);
        if (data) {
            state.presets = data;
            // state.filename = f.name;
            this.setState({pack: "", filename: f.name});
        }
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
                            {this.state.filename && <span>: {this.state.filename}</span>}
                            {/*<div className="lw-pack">{this.state.pack}</div>*/}
                        </div>
                        <select className="preloader" onChange={this.loadData} value={this.state.pack}>
                            <option value="">Select an official pack...</option>
                            <option value="Factory_1-1.json">Factory 1.1</option>
                            <option value="Factory_2-0.json">Factory 2.0</option>
                            <option value="Naughty_Bass.json">Naughty Bass</option>
                            <option value="Plaisir_Pads.json">Plaisir Pads</option>
                            <option value="Tech_Loop.json">Tech Loop</option>
                            <option value="Arp_Monster.json">Arp Monster</option>
                        </select>
                        <input ref={this.inputOpenFileRef} type="file" style={{display:"none"}}  onChange={this.onFileSelection} />
                        <button className="bt-file" type="button" onClick={this.importFromFile}>Or load a file...</button>
                        <div className="header-options">
                            <select value={this.state.theme} onChange={this.selectTheme}>
                                <option value="light">Light theme</option>
                                <option value="dark">Dark theme</option>
                                <option value="darker">Darkest theme</option>
                            </select>
                        </div>
                    </div>
                    <div className="App">
                        <ListView />
                    </div>
                </div>
            </Provider>
        );
    }

}

export default List;
