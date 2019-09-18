import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {h} from "../utils/hexstring";
import {CONTROL, CYC_ENV, MOD_DESTINATION, MOD_MATRIX, MOD_SOURCE, MOD_SOURCE_COLOR, OSC_TYPE} from "../model";
import "./ControlMods.css";

class ControlMods extends Component {

    render() {

        const {cc, state} = this.props;
        // const d = CONTROL[cc];
        // const v = d.mapping ? d.mapping(state.preset[cc]) : state.preset[cc];

        console.log("mod color", MOD_SOURCE_COLOR[cc]);

        return (
            <div className="control-mods">
                {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                    (src, i) => {
                        return (
                            <div key={i} className="mod" style={{backgroundColor:MOD_SOURCE_COLOR[src]}}>
                                <div className="mod-name">{MOD_SOURCE[src]}</div>
                                <div className="mod-value">-34.5</div>
                            </div>
                        )
                    }
                )}
            </div>
        );

    }
}

export default inject('state')(observer(ControlMods));
