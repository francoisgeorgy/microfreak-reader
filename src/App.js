import React, {Component, Fragment} from 'react';
import './App.css';
import Midi from "./components/Midi";
import {h, hs} from "./utils/hexstring";
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
                            <div className="group oscillator">
                                <h3>Oscillator</h3>
                                <div>Type</div><div className="value">{P[9]} ({h(P[9])})</div>
                                <div>Wave</div><div className="value">{P[10]} ({h(P[10])})</div>
                                <div>Timbre</div><div className="value">{P[12]} ({h(P[12])})</div>
                                <div>Shape</div><div className="value">{P[13]} ({h(P[13])})</div>
                            </div>
                            <div className="group filter">
                                <h3>Filter</h3>
                                <div>Cutoff</div><div className="value">{P[23]} ({h(P[23])})</div>
                                <div>Resonance</div><div className="value">{P[83]} ({h(P[83])})</div>
                            </div>
                            <div className="group cycling-env">
                                <h3>Cycling envelope</h3>
                                <div>Cycling Env Rise</div><div className="value">{P[102]} ({h(P[102])})</div>
                                <div>Cycling Env Fall</div><div className="value">{P[103]} ({h(P[103])})</div>
                                <div>Cycling Env Hold</div><div className="value">{P[28]} ({h(P[28])})</div>
                                <div>Cycling Env Amount</div><div className="value">{P[24]} ({h(P[24])})</div>
                            </div>
                            <div className="group arp-seq">
                                <h3>ARP/SEQ</h3>
                                <div>ARP/SEQ Rate (free)</div><div className="value">{P[91]} ({h(P[91])})</div>
                                <div>ARP/SEQ Rate (sync)</div><div className="value">{P[92]} ({h(P[92])})</div>
                            </div>
                            <div className="group lfo">
                                <h3>LFO</h3>
                                <div>LFO Rate (free)</div><div className="value">{P[93]} ({h(P[93])})</div>
                                <div>LFO Rate (sync)</div><div className="value">{P[94]} ({h(P[94])})</div>
                            </div>
                            <div className="group env">
                                <h3>Envelope</h3>
                                <div>Envelope Attack</div><div className="value">{P[105]} ({h(P[105])})</div>
                                <div>Envelope Decay</div><div className="value">{P[106]} ({h(P[106])})</div>
                                <div>Envelope Sustain</div><div className="value">{P[29]} ({h(P[29])})</div>
                            </div>
                            <div className="group keyboard">
                                <h3>Keyboard</h3>
                                <div>Glide</div><div className="value">{P[5]} ({h(P[5])})</div>
                                <div>Keyboard Hold button (toggle)</div><div className="value">{P[64]} ({h(P[64])})</div>
                                <div>Keyboard Spice</div><div className="value">{P[2]} ({h(P[2])})</div>
                                <div>Keyboard Pitch Bend</div><div className="value">Pitchbend</div>
                                <div>Keyboard Pressure</div><div className="value">Aftertouch</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }

}

export default App;
