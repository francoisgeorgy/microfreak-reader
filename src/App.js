import React, {Component, Fragment} from 'react';
import './App.css';
import Midi from "./components/Midi";
import {hs} from "./utils/hexstring";

class App extends Component {

    state = {
        dropZoneActive: false
    };

    handleMidiInputEvent = (e) => {

        console.log(e);

        if (e.data[0] === 0xF8) {
            // we ignore Timing Clock messages
            return;
        }

        if (global.dev) console.log("handleMidiInputEvent", hs(e.data), e);

        // e.data is UInt8Array

        // S.appendMessageIn(e);
    };

    render() {

        return (
            <div className="App">
                <div>
                    <Midi onMidiInputEvent={this.handleMidiInputEvent} />
                </div>
            </div>
        );
    }

}

export default App;
