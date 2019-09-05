import React, {Component} from 'react';
import './App.css';
import Midi from "./components/Midi";
import {Provider} from "mobx-react";
import {state} from "./state/State";
import MidiPorts from "./components/MidiPorts";
import Control from "./components/Control";
import {control} from "./model";
import PresetSelector from "./components/PresetSelector";

class App extends Component {

    // state = {
    //     dropZoneActive: false,
    //     preset: new Array(127).fill(0)
    // };

    // cc = (c) => {
    //     return (
    //         <Fragment>
    //             <div className="value">({h(this.state.preset[c])})</div>
    //             <div className="value">{this.state.preset[c]}</div>
    //         </Fragment>
    //     );
    // };

    handleMidiInputEvent = (e) => {

        // console.log(e);

        if (e.data[0] === 0xF8) {
            // we ignore Timing Clock messages
            return;
        }

        // if (global.dev) console.log("handleMidiInputEvent", hs(e.data), e);

        if (global.dev) console.log(`handleMidiInputEvent: ${e.controller.number}=${e.value}`);

        // this.setState(
        //     produce(draft => {
        //         draft.preset[e.controller.number] = e.value;
        //     })
        // )

        state.preset[e.controller.number] = e.value;

    };

    render() {


        return (
            <Provider state={state}>
                <Midi messageType="controlchange" onMidiInputEvent={this.handleMidiInputEvent} />
                <div className="App">
                    <h2>MicroFreak CC values</h2>
                    <MidiPorts messageType="controlchange" onMidiInputEvent={this.handleMidiInputEvent} />
                    <PresetSelector />
                    <div>
                        <div className="main-grid">
                            <div className="group oscillator">
                                <h3>Oscillator</h3>
                                <div className="controls">
                                    <Control cc={control.osc_type} />
                                    <Control cc={control.osc_wave} />
                                    <Control cc={control.osc_timbre} />
                                    <Control cc={control.osc_shape} />
                                </div>
                            </div>
                            <div className="group filter">
                                <h3>Filter</h3>
                                <div className="controls">
                                    <Control cc={control.filter_cutoff} />
                                    <Control cc={control.filter_resonance} />
                                </div>
                            </div>
                            <div className="group cycling-env">
                                <h3>Cycling envelope</h3>
                                <div className="controls">
                                    <Control cc={control.cycling_env_rise} />
                                    <Control cc={control.cycling_env_fall} />
                                    <Control cc={control.cycling_env_hold} />
                                    <Control cc={control.cycling_env_amount} />
                                </div>
                            </div>
                            <div className="group arp-seq">
                                <h3>ARP/SEQ</h3>
                                <div className="controls">
                                    <Control cc={control.arp_seq_rate_free} />
                                    <Control cc={control.arp_seq_rate_sync} />
                                </div>
                            </div>
                            <div className="group lfo">
                                <h3>LFO</h3>
                                <div className="controls">
                                    <Control cc={control.lfo_rate_free} />
                                    <Control cc={control.lfo_rate_sync} />
                                </div>
                            </div>
                            <div className="group env">
                                <h3>Envelope</h3>
                                <div className="controls">
                                    <Control cc={control.envelope_attack} />
                                    <Control cc={control.envelope_decay} />
                                    <Control cc={control.envelope_sustain} />
                                </div>
                            </div>
                            <div className="group keyboard">
                                <h3>Keyboard</h3>
                                <div className="controls">
                                    <Control cc={control.glide} />
                                    <Control cc={control.keyboard_hold_button} />
                                    <Control cc={control.keyboard_spice} />
                                    {/*<Control cc={control.} />*/}
                                    {/*<Control cc={control.} />*/}
                                </div>
                                {/*<div>Keyboard Pitch Bend</div><div className="value">Pitchbend</div>*/}
                                {/*<div>Keyboard Pressure</div><div className="value">Aftertouch</div>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </Provider>
        );
    }

}

export default App;
