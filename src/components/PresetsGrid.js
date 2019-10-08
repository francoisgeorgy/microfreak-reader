import React, {Component} from "react";
import "./PresetsGrid.css";
import {inject, observer} from "mobx-react";

class PresetsGrid extends Component {

    // state = {
    // };

    // selectDirect = (n) => {
    //     // this.setPreset(n.toString());
    //     // this.props.state.loadPreset(n);
    //     if (global.dev) console.log("selectDirect", n);
    //     this.props.state.preset_number = n;
    // };

    render() {

        const S = this.props.state;

        const pc = [];
        for (let i=0; i<256; i++) {

            let classname = i === S.preset_number ? 'sel' : '';
            if (S.presets.length && (S.presets.length > i && S.presets[i])) {
                classname += ' loaded';
            }
            pc.push(
                <div key={i} className={classname} onClick={() => this.props.state.setPresetNumber(i)}>
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