import React, {Component, Fragment} from "react";
import "./PresetsGrid.css";
import {inject, observer} from "mobx-react";
import {sendPC} from "../utils/midi";

class PresetsGrid extends Component {

    constructor(props) {
        super(props);
        document.addEventListener('keydown', this.onKeyboardEvent, false);
        document.addEventListener('keyup', this.onKeyboardEvent, false);
        document.addEventListener('keypress', this.onKeyboardEvent, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeyboardEvent, false);
        document.removeEventListener('keyup', this.onKeyboardEvent, false);
        document.removeEventListener('keypress', this.onKeyboardEvent, false);
    }

    onKeyboardEvent = (e) => {

        const isEligibleEvent = e.target === document.body;

        if (!isEligibleEvent) {
            return false;
        }

        const k = e.type === 'keydown';
        const xy = this.props.position === 'presets-grid-bottom';

        // if (e.type === 'keydown') {

        //TODO: improve this code
            switch (e.keyCode) {
                case 33:        // PAGE-UP
                    if (k) {
                        e.preventDefault();
                        //e.stopPropagation();
                        if (xy) {
                            this.prev(10);
                        } else {
                            this.prev();
                        }
                    }
                    break;
                case 37:        // LEFT
                    if (k) {
                        e.preventDefault();
                        // if (xy) {
                        //     this.prev();
                        // } else {
                            this.prev();
                        // }
                    }
                    break;
                case 38:        // UP
                    if (k) {
                        e.preventDefault();
                        if (xy) {
                            this.prev(10);
                        } else {
                            this.prev();
                        }
                    }
                    break;
                case 34:        // PAGE-DOWN
                    if (k) {
                        e.preventDefault();
                        if (xy) {
                            this.next(10);
                        } else {
                            this.next();
                        }
                    }
                    break;
                case 39:        // RIGHT
                    if (k) {
                        e.preventDefault();
                        // if (xy) {
                        //     this.next();
                        // } else {
                            this.next();
                        // }
                    }
                    break;
                case 40:        // DOWN
                    if (k) {
                        e.preventDefault();
                        if (xy) {
                            this.next(10);
                        } else {
                            this.next();
                        }
                    }
                    break;
                default: break;
            }
        // }

        return false;
    };

    prev = (d = 1) => {
        const n = this.props.state.preset_number - d;
        // this.setPreset(n < 0 ? '255' : n.toString());
        this.props.state.setPresetNumber(n < 0 ? 255 : n);
        if (this.props.state.send_pc) {
            this.go();
        }
    };

    next = (d = 1) => {
        const n = this.props.state.preset_number + d;
        // this.setPreset(n > 255 ? '1' : n.toString());
        this.props.state.setPresetNumber(n > 255 ? 0 : n);
        if (this.props.state.send_pc) {
            this.go();
        }
    };


    selectPreset = (n) => {
        this.props.state.setPresetNumber(n);
        if (this.props.state.send_pc) {
            sendPC(this.props.state.preset_number);
        }
    };

    render() {

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
    }

}

export default inject('state')(observer(PresetsGrid));