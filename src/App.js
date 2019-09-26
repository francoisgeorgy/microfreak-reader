import React, {Component} from 'react';
import './App.css';
import Midi from "./components/Midi";
import {Provider} from "mobx-react";
import {state} from "./state/State";
import MidiPorts from "./components/MidiPorts";
import Control from "./components/Control";
import {
    AMP_MOD,
    ARP_SEQ_RATE_FREE,
    ARP_SEQ_RATE_SYNC, ARP_SEQ_SYNC,
    CYCLING_ENV_AMOUNT,
    CYCLING_ENV_FALL,
    CYCLING_ENV_HOLD, CYCLING_ENV_MODE,
    CYCLING_ENV_RISE,
    ENVELOPE_ATTACK,
    ENVELOPE_DECAY,
    ENVELOPE_SUSTAIN,
    FILTER_CUTOFF,
    FILTER_RESONANCE,
    FILTER_TYPE,
    GLIDE,
    KEYBOARD_HOLD_BUTTON,
    SPICE,
    LFO_RATE_FREE,
    LFO_RATE_SYNC,
    LFO_SHAPE,
    LFO_SYNC, OCTAVE,
    OSC_SHAPE,
    OSC_TIMBRE,
    OSC_TYPE,
    OSC_WAVE, PARAPHONIC
} from "./model";
import PresetSelector from "./components/PresetSelector";
import ModMatrix from "./components/ModMatrix";
import {hs} from "./utils/hexstring";
import Switch from "./components/Switch";
import ReadProgress from "./components/ReadProgress";

const MIDI_MSG_TYPE = "sysex";
const DEFAULT_THEME = 'dark';

const LAYOUT_2_COLS = 'layout-2-cols';
const LAYOUT_1_ROW = 'layout-1-row';

class App extends Component {

    state = { theme: DEFAULT_THEME };

    selectTheme = (e) => {
        this.setState({theme: e.target.value});
        // savePreferences({theme});
    };

/*
    setThemeLight = () => {
        this.selectTheme("light");
    };

    setThemeDark = () => {
        this.selectTheme("dark");
    };
*/

    handleMidiInputEvent = (e) => {

        // if (global.dev) console.log("handleMidiInputEvent", hs(e.data), e);

        if (e.data[0] === 0xF8) {
            // we ignore Timing Clock messages
            return;
        }

        // if (global.dev) console.log(`handleMidiInputEvent: ${e.controller.number}=${e.value}`);
        // state.preset[e.controller.number] = e.value;


        if (e.data.length !== 42) {
            console.log("do not store answer", hs(e.data));
            return;
        }

        // console.log("store sysex data");

        // TODO: move into store:
        state.data.push(Array.from(e.data.slice(9, e.data.length - 1)));    // e.data is UInt8Array
    };

    render() {

        const { theme } = this.state;
        document.documentElement.setAttribute('data-theme', theme);

        return (
            <Provider state={state}>
                <div className="header">
                    <div className="title">MicroFreak reader</div>
                    <div>
                        <select value={this.state.theme} onChange={this.selectTheme}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="darker">Darker</option>
                        </select>
                    </div>
                </div>
                <Midi messageType={MIDI_MSG_TYPE} onMidiInputEvent={this.handleMidiInputEvent}/>
                <div className="App">
                    <MidiPorts messageType={MIDI_MSG_TYPE} onMidiInputEvent={this.handleMidiInputEvent}/>
                    <div>
                        <div className="main-grid">
                            <div className="group matrix">
                                <h3>Modulation matrix</h3>
                                <ModMatrix />
                            </div>
                            <div className="preset">
                                <PresetSelector />
                                <ReadProgress />
                                {/*TODO: add compare*/}
                            </div>
                            <div className="group oscillator">
                                <h3>Oscillator</h3>
                                <div className="controls">
                                    <Control cc={OSC_TYPE}/>
                                    <Control cc={OSC_WAVE}/>
                                    <Control cc={OSC_TIMBRE}/>
                                    <Control cc={OSC_SHAPE}/>
                                </div>
                            </div>
                            <div className="group filter">
                                <h3>Filter</h3>
                                <div className="controls">
                                    <Switch cc={FILTER_TYPE} />
                                    <Control cc={FILTER_CUTOFF}/>
                                    <Control cc={FILTER_RESONANCE}/>
                                </div>
                            </div>
                            <div className="group cycling-env">
                                <h3>Cycling envelope</h3>
                                <div className="controls">
                                    <Switch cc={CYCLING_ENV_MODE} />
                                    <Control cc={CYCLING_ENV_RISE}/>
                                    <Control cc={CYCLING_ENV_FALL}/>
                                    <Control cc={CYCLING_ENV_HOLD}/>
                                    <Control cc={CYCLING_ENV_AMOUNT}/>
                                </div>
                            </div>
                            <div className="group arp-seq">
                                <h3>ARP/SEQ</h3>
                                <div className="controls">
                                    <Switch cc={ARP_SEQ_SYNC} />
                                    <Control cc={ARP_SEQ_RATE_FREE}/>
                                    <Control cc={ARP_SEQ_RATE_SYNC}/>
                                    <Control cc={SPICE}/>
                                </div>
                            </div>
                            <div className="group lfo">
                                <h3>LFO</h3>
                                <div className="controls">
                                    <Switch cc={LFO_SHAPE} layout={LAYOUT_2_COLS} />
                                    <Switch cc={LFO_SYNC} />
                                    <Control cc={LFO_RATE_FREE}/>
                                    <Control cc={LFO_RATE_SYNC}/>
                                </div>
                            </div>
                            <div className="group env">
                                <h3>Envelope</h3>
                                <div className="controls">
                                    <Switch cc={AMP_MOD} />
                                    <Control cc={ENVELOPE_ATTACK}/>
                                    <Control cc={ENVELOPE_DECAY}/>
                                    <Control cc={ENVELOPE_SUSTAIN}/>
                                </div>
                            </div>
                            <div className="group keyboard">
                                <h3>Keyboard</h3>
                                <div className="controls">
                                    <div>Pitch</div>
                                    <Switch cc={PARAPHONIC} />
                                    <Switch cc={OCTAVE} layout={LAYOUT_1_ROW} />
                                    <Switch cc={KEYBOARD_HOLD_BUTTON}/>
                                    <Control cc={GLIDE}/>
                                </div>
                            </div>
{/*
                            <div className="group keyboard2">
                                <h3>...</h3>
                                <div className="controls">
                                </div>
                            </div>
*/}
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }

}

export default App;
