import React, {Component} from "react";
import "./PresetsGrid.css";
import {inject, observer} from "mobx-react";
import {sendPC} from "../utils/midi";

class PresetsGrid extends Component {

    // state = {
    // };

    // selectDirect = (n) => {
    //     // this.setPreset(n.toString());
    //     // this.props.state.loadPreset(n);
    //     if (global.dev) console.log("selectDirect", n);
    //     this.props.state.preset_number = n;
    // };

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
            <div className="presets-grid">
                {pc}
            </div>
        );
    }

}

export default inject('state')(observer(PresetsGrid));