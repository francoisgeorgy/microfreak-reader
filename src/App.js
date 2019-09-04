import React, {Component, Fragment} from 'react';
import './App.css';
import Midi from "./components/Midi";
import {hs} from "./utils/hexstring";
import {produce} from "immer";
import {Provider} from "mobx-react";
import {state} from "./state/State";
import MidiPorts from "./components/MidiPorts";

class App extends Component {

    state = {
        dropZoneActive: false,
        preset: new Array(127).fill(0)
    };

    handleMidiInputEvent = (e) => {

        // console.log(e);

        if (e.data[0] === 0xF8) {
            // we ignore Timing Clock messages
            return;
        }

        if (global.dev) console.log("handleMidiInputEvent", hs(e.data), e);

        if (global.dev) console.log(`handleMidiInputEvent: ${e.controller.number}=${e.value}`);

        this.setState(
            produce(draft => {
                draft.preset[e.controller.number] = e.value;
            })
        )

    };

    render() {

        const P = this.state.preset;

        return (
            <Provider state={state}>
                <Midi messageType="controlchange" onMidiInputEvent={this.handleMidiInputEvent} />
                <div className="App">
                    <h2>MicroFreak CC values</h2>
                    <div>
                        <MidiPorts messageType="controlchange" onMidiInputEvent={this.handleMidiInputEvent} />
                    </div>
                    <div>
                        <div className="controls">
                            <div>Glide</div><div className="value">{P[5]}</div>
                            <div>Type</div><div className="value">{P[9]}</div>
                            <div>Wave</div><div className="value">{P[10]}</div>
                            <div>Timbre</div><div className="value">{P[12]}</div>
                            <div>Shape</div><div className="value">{P[13]}</div>
                            <div>Cutoff</div><div className="value">{P[23]}</div>
                            <div>Resonance</div><div className="value">{P[83]}</div>
                            <div>Cycling Env Rise</div><div className="value">{P[102]}</div>
                            <div>Cycling Env Fall</div><div className="value">{P[103]}</div>
                            <div>Cycling Env Hold</div><div className="value">{P[28]}</div>
                            <div>Cycling Env Amount</div><div className="value">{P[24]}</div>
                            <div>ARP/SEQ Rate (free)</div><div className="value">{P[91]}</div>
                            <div>ARP/SEQ Rate (sync)</div><div className="value">{P[92]}</div>
                            <div>LFO Rate (free)</div><div className="value">{P[93]}</div>
                            <div>LFO Rate (sync)</div><div className="value">{P[94]}</div>
                            <div>Envelope Attack</div><div className="value">{P[105]}</div>
                            <div>Envelope Decay</div><div className="value">{P[106]}</div>
                            <div>Envelope Sustain</div><div className="value">{P[29]}</div>
                            <div>Keyboard Hold button (toggle)</div><div className="value">{P[64]}</div>
                            <div>Keyboard Spice</div><div className="value">{P[2]}</div>
                            <div>Keyboard Pitch Bend</div><div className="value">Pitchbend</div>
                            <div>Keyboard Pressure</div><div className="value">Aftertouch</div>
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }

}

export default App;
