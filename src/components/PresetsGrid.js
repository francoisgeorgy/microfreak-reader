import React, {Component} from "react";
import "./PresetsGrid.css";
import {inject, observer} from "mobx-react";

class PresetsGrid extends Component {

    state = {
    };

    selectDirect = (n) => {
        // this.setPreset(n.toString());
        // this.props.state.loadPreset(n);
        this.props.state.preset_number = n;
    };

    render() {

        const S = this.props.state;

        const midi_ok = S.hasInputEnabled() && S.hasOutputEnabled();

        const pc = [];
        for (let i=1; i<=256; i++) {

            let classname = i === S.preset_number ? 'sel' : '';
            if (S.presets[i]) {
                classname += ' loaded';
            }
            pc.push(
                <div key={i} className={classname} onClick={() => this.selectDirect(i)}>
                    {i}&nbsp;&nbsp;{S.presetName(i)}
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