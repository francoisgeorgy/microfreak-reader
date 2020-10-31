import React, {Component} from 'react';
import "./MidiSupportWarning.css";

export class MidiSupportWarning extends Component {

    state = {
        supported: true
    };

    componentDidMount() {
        if (!navigator.requestMIDIAccess) {
            this.setState({supported: false});
        }
    }

    render() {

        if (this.state.supported) return null;

        return (
            <div className="midi-support-warning-top">
                This browser does not support MIDI.
                See <a href="https://webmidi.info/" target="_blank" rel="noreferrer noopener">webmidi.info</a> for a list of browsers that support MIDI.
            </div>
        );

    }

}
