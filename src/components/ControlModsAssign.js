import React, {Component, Fragment} from 'react';
import {
    ASSIGN1, ASSIGN2, ASSIGN3,
    MOD_SOURCE,
    MOD_SOURCE_CSS, MOD_SOURCE_SHORT
} from "../model";
import {inject, observer} from "mobx-react";

class ControlModsAssign extends Component {

    render() {

        const {cc, state: S} = this.props;

        return (
            <div className="control-mods">
                {[ASSIGN1, ASSIGN2, ASSIGN3].map(
                    (slot, i) => {

                        const dest_def = S.modAssignDest(slot);
                        if (!dest_def) {
                            return null;
                        }

                        let control;
                        if (dest_def) {
                            control = dest_def.control[S.modAssignControlNum(slot)];
                            if (control !== cc) {
                                return null;
                            }
                        }

                        const v = Math.round(Math.random() * 1000) / 10;    // DEBUG
                        if (!v || (Math.abs(v) < 0.01)) {
                            return null;
                        }
                        const direction = v < 0 ? 'to left' : 'to right';

                        return (
                            <Fragment key={i}>
                                {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                                    (mod_src, k) => {
                                        const v = S.modMatrixValue(mod_src, slot);
                                        if (Math.abs(v) > 0.0) {
                                            return (
                                                <div key={k} className="mod" style={{background: `linear-gradient(${direction}, var(--${MOD_SOURCE_CSS[mod_src]}) ${Math.abs(v)}%, var(--mod-src-bg) ${Math.abs(v)}%)`}}>
                                                    <div className={`mod-text ${MOD_SOURCE_CSS[mod_src]}-text`}>
                                                        <div className="mod-name">{MOD_SOURCE_SHORT[mod_src]}</div>
                                                        <div className="mod-value">{v}</div>
                                                    </div>
                                                </div>
                                            )
                                        } else {
                                            return null;
                                        }
                                    }
                                )}
                            </Fragment>
                        )
                    }
                )}
            </div>
        );

    }
}

export default inject('state')(observer(ControlModsAssign));
