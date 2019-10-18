import React, {Component} from 'react';
import {
    MOD_MATRIX_DESTINATION,
    MOD_SOURCE,
    MOD_SOURCE_CSS, MOD_SOURCE_SHORT
} from "../model";
import "./ControlMods.css";
import {inject, observer} from "mobx-react";

class ControlMods extends Component {

    render() {

        const {cc, state: S} = this.props;

        return (
            <div className="control-mods">
                {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                    (src, i) => {

                        if (!MOD_MATRIX_DESTINATION[cc]) {
                            return null;
                        }

                        const v = S.modMatrixValue(src, cc);
                        if (!v || (Math.abs(v) < 0.01)) {
                            return null;
                        }
                        const direction = v < 0 ? 'to left' : 'to right';

                        return (
                            <div key={src.toString() + i} className="mod" style={
                                {background: `linear-gradient(${direction}, var(--${MOD_SOURCE_CSS[src]}) ${Math.abs(v)}%, var(--mod-src-bg) ${Math.abs(v)}%)`}
                            } title={`${MOD_SOURCE_SHORT[src]} ${v}`}>
                                <div className={`mod-text ${MOD_SOURCE_CSS[src]}-text`}>
                                    <div className="mod-name">{MOD_SOURCE_SHORT[src]}</div>
                                    <div className="mod-value">{v}</div>
                                </div>
                            </div>
                        )
                    }
                )}
            </div>
        );

    }
}

export default inject('state')(observer(ControlMods));
