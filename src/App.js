import React, {Component} from 'react';
import './App.css';
import Midi from "./components/Midi";
import {Provider} from "mobx-react";
import {state} from "./state/State";
import Control from "./components/Control";
import {
    AMP_MOD,
    ARP_SEQ_RATE_FREE,
    ARP_SEQ_RATE_SYNC,
    ARP_SEQ_SYNC,
    CYCLING_ENV_AMOUNT,
    CYCLING_ENV_FALL,
    CYCLING_ENV_HOLD,
    CYCLING_ENV_MODE,
    CYCLING_ENV_RISE,
    ENVELOPE_ATTACK,
    ENVELOPE_DECAY,
    ENVELOPE_SUSTAIN,
    FILTER_CUTOFF,
    FILTER_RESONANCE,
    FILTER_TYPE,
    GLIDE,
    HOLD,
    SPICE,
    LFO_RATE_FREE,
    LFO_RATE_SYNC,
    LFO_SHAPE,
    LFO_SYNC,
    OCTAVE,
    OSC_SHAPE,
    OSC_TIMBRE,
    OSC_TYPE,
    OSC_WAVE,
    PARAPHONIC,
    ARP,
    SEQ,
    ARP_SEQ_MOD,
    CYCLING_ENV_RISE_SHAPE,
    CYCLING_ENV_FALL_SHAPE,
    ARP_SEQ_SWING,
    PITCH,
    MOD_GROUP_OSC,
    MOD_GROUP_FILTER,
    MOD_GROUP_CYCLING_ENV,
    MOD_GROUP_LFO,
    MOD_GROUP_ARP_SEQ,
    MOD_GROUP_ENVELOPE, MOD_GROUP_KEYBOARD
} from "./model";
import PresetSelector from "./components/PresetSelector";
import ModMatrix from "./components/ModMatrix";
import Switch from "./components/Switch";
import ReadProgress from "./components/ReadProgress";
import MidiPortsSelect from "./components/MidiPortsSelect";
import PresetName from "./components/PresetName";
import ControlMods from "./components/ControlMods";
import {
    DEFAULT_PRESETS_POS,
    DEFAULT_THEME,
    loadPreferences,
    savePreferences
} from "./utils/preferences";
import PresetsGrid from "./components/PresetsGrid";
import WindowTitle from "./components/WindowTitle";
import ControlRateSync from "./components/ControlRateSync";
import SharePreset from "./components/SharePreset";

const MIDI_MSG_TYPE = "sysex";

const LAYOUT_2_COLS = 'layout-2-cols';
const LAYOUT_1_ROW = 'layout-1-row';

class App extends Component {

    state = {
        theme: DEFAULT_THEME,
        presets_pos: DEFAULT_PRESETS_POS
    };

    selectTheme = (e) => {
        this.setState({theme: e.target.value});
        savePreferences({theme: e.target.value});
    };

    selectPresetPos = (e) => {
        this.setState({presets_pos: e.target.value});
        savePreferences({presets_pos: e.target.value});
    };

    componentDidMount(){
        const s = loadPreferences();
        this.setState({
            theme: s.theme || DEFAULT_THEME,
            presets_pos: s.presets_pos || DEFAULT_PRESETS_POS,
        });
        state.setPresetNumber(s.preset);
        state.send_pc = s.send_pc;
    }

    // We need this method to have a correct "this" binding in state.importData()
    handleMidiInputEvent = (e) => {
        state.importData(e);
    };

    render() {

        const { theme } = this.state;
        document.documentElement.setAttribute('data-theme', theme);



        return (
            <Provider state={state}>
                <WindowTitle />
                <div className={`app-wrapper ${this.state.presets_pos}`}>
                    <div className="header">
                        <div className="title">
                            MicroFreak&nbsp;<PresetName />
                            <SharePreset />
                        </div>
                        <div className="header-options">
                            <a href="https://studiocode.dev/applications/microfreak-reader/" target="_blank" rel="noopener noreferrer">Doc</a>
                            <select value={this.state.theme} onChange={this.selectTheme}>
                                <option value="light">Light theme</option>
                                <option value="dark">Dark theme</option>
                                <option value="darker">Darkest theme</option>
                            </select>
                            <select value={this.state.presets_pos} onChange={this.selectPresetPos}>
                                <option value="presets-grid-right">Presets list on the right</option>
                                <option value="presets-grid-bottom">Presets list at bottom</option>
                                <option value="presets-grid-none">No presets list</option>
                            </select>
                        </div>
                    </div>
                    {/*<ErrorBanner />*/}
                    <Midi messageType={MIDI_MSG_TYPE} onMidiInputEvent={this.handleMidiInputEvent}/>
                    <div className="App">
                        <div> {/* grid wrapper; helps to have a nice layout; without it the grid will stretch full height */}
                        <div className="main-grid">
                            <div className="group matrix">
                                <h3>Modulation matrix</h3>
                                <ModMatrix />
                            </div>
                            <div className="group preset">
                                <h3>MIDI / Preset selection</h3>
                                <div className="preset-wrapper">
                                    <MidiPortsSelect messageType={MIDI_MSG_TYPE} onMidiInputEvent={this.handleMidiInputEvent} />
                                    <PresetSelector />
                                    <ReadProgress />
                                    {/*TODO: add compare*/}
                                    {/*<PresetName />*/}
                                </div>
                            </div>
                            <div className="group oscillator">
                                <h3>Oscillator</h3>
                                <div className="controls">
                                    <Control cc={OSC_TYPE} group={MOD_GROUP_OSC} raw={true}/>
                                    <Control cc={OSC_WAVE} group={MOD_GROUP_OSC}/>
                                    <Control cc={OSC_TIMBRE} group={MOD_GROUP_OSC}/>
                                    <Control cc={OSC_SHAPE} group={MOD_GROUP_OSC}/>
                                </div>
                            </div>
                            <div className="group filter">
                                <h3>Filter</h3>
                                <div className="controls">
                                    <Switch cc={FILTER_TYPE}/>
                                    <Control cc={FILTER_CUTOFF} group={MOD_GROUP_FILTER}/>
                                    <Control cc={FILTER_RESONANCE} group={MOD_GROUP_FILTER}/>
                                </div>
                            </div>
                            <div className="group cycling-env">
                                <h3>Cycling envelope</h3>
                                <div className="controls">
                                    <Switch cc={CYCLING_ENV_MODE} />
                                    <Control cc={CYCLING_ENV_RISE} group={MOD_GROUP_CYCLING_ENV}/>
                                    <Control cc={CYCLING_ENV_RISE_SHAPE}/>
                                    <Control cc={CYCLING_ENV_FALL} group={MOD_GROUP_CYCLING_ENV}/>
                                    <Control cc={CYCLING_ENV_FALL_SHAPE}/>
                                    <Control cc={CYCLING_ENV_HOLD} group={MOD_GROUP_CYCLING_ENV}/>
                                    <Control cc={CYCLING_ENV_AMOUNT} group={MOD_GROUP_CYCLING_ENV}/>
                                </div>
                            </div>
                            <div className="group arp-seq">
                                <h3>ARP/SEQ</h3>
                                <div className="controls">
                                    <Switch cc={ARP} />
                                    <Switch cc={SEQ} />
                                    <Switch cc={ARP_SEQ_MOD} layout={LAYOUT_2_COLS}/>
                                    <Switch cc={ARP_SEQ_SYNC} />
                                    <Control cc={ARP_SEQ_RATE_FREE} group={MOD_GROUP_ARP_SEQ} sw={ARP_SEQ_SYNC} inverseSw={true} />
                                    <ControlRateSync cc={ARP_SEQ_RATE_SYNC} group={MOD_GROUP_ARP_SEQ} raw={true} sw={ARP_SEQ_SYNC} />
                                    <Control cc={ARP_SEQ_SWING} />
                                    <Control cc={SPICE}/>
                                </div>
                            </div>
                            <div className="group lfo">
                                <h3>LFO</h3>
                                <div className="controls">
                                    <Switch cc={LFO_SHAPE} layout={LAYOUT_2_COLS}/>
                                    <Switch cc={LFO_SYNC} />
                                    <Control cc={LFO_RATE_FREE} group={MOD_GROUP_LFO} sw={LFO_SYNC} inverseSw={true} />
                                    <ControlRateSync cc={LFO_RATE_SYNC} group={MOD_GROUP_LFO} raw={true} sw={LFO_SYNC} />
                                </div>
                            </div>
                            <div className="group env">
                                <h3>Envelope</h3>
                                <div className="controls">
                                    <Switch cc={AMP_MOD} />
                                    <Control cc={ENVELOPE_ATTACK} group={MOD_GROUP_ENVELOPE}/>
                                    <Control cc={ENVELOPE_DECAY} group={MOD_GROUP_ENVELOPE}/>
                                    <Control cc={ENVELOPE_SUSTAIN} group={MOD_GROUP_ENVELOPE}/>
                                </div>
                            </div>
                            <div className="group keyboard">
                                <h3>Keyboard</h3>
                                <div className="controls">
                                    <div className={`control`}>
                                        <div className="ctrl-name">Pitch</div>
                                        <ControlMods cc={PITCH} />
                                    </div>
                                    <Switch cc={PARAPHONIC} />
                                    <Switch cc={OCTAVE} layout={LAYOUT_1_ROW} />
                                    <Switch cc={HOLD}/>
                                    <Control cc={GLIDE} group={MOD_GROUP_KEYBOARD}/>
                                </div>
                            </div>
                            <div className="instructions">
                                <div>
                                    This is not an editor. This application will not update in real-time to your changes.
                                </div>
                                <div>
                                    This application can only read presets saved in the MicroFreak memory.
                                </div>
                                <div>
                                    If you modify a preset on the MicroFreak, do not forget to save it first before being able to
                                    read it again here to see your changes.
                                </div>
                                <div>
                                    No guarantee is given as to the accuracy of the displayed data.
                                </div>
                                <div>
                                    To report bugs and issues: <a href="https://github.com/francoisgeorgy/microfreak-reader/issues" className="github-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                                </div>
                                <div className="copyright">
                                    v{process.env.REACT_APP_VERSION} &copy; <a href="https://studiocode.dev" target="_blank" rel="noopener noreferrer">studiocode.dev 2019</a>
                                </div>
                            </div>
                        </div>
                        </div>
                        {this.state.presets_pos !== 'presets-grid-none' && <PresetsGrid position={this.state.presets_pos} />}
                    </div>
                </div>
            </Provider>
        );
    }

}

export default App;
