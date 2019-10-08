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
        // const d = CONTROL[cc];
        // const v = d.mapping ? d.mapping(state.preset[cc]) : state.preset[cc];

        // console.log("mod color", cc, MOD_SOURCE_CSS[cc]);

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

                            // console.log("ControlModsAssign", dest_def);

                            control = dest_def.control[S.modAssignControlNum(slot)];
                            if (control !== cc) {
                                return null;
                            }
                        }

                        // console.log("ControlModsAssign", slot, dest_def, control, MOD_GROUP_NAME[dest_def.mod_group]);
                        //
                        // for (let mod_src of Object.getOwnPropertySymbols(MOD_SOURCE)) {
                        //     const v = S.modMatrixValue(mod_src, slot, true);
                        //     if (v !== 0) {
                        //         console.log("ControlModsAssign value for", slot, mod_src, v);
                        //     }
                        // }

                        // const v = S.modMatrixValue(slot, cc);
                        const v = Math.round(Math.random() * 1000) / 10;    // DEBUG
                        // console.log(v);

                        if (!v || (Math.abs(v) < 0.01)) {
                            // console.log("mod matrix too small ", v);
                            return null;
                        }


                        // console.log("ControlModsAssign", slot, dest_def, control, MOD_GROUP_NAME[dest_def.mod_group]);

                        // for (let mod_src of Object.getOwnPropertySymbols(MOD_SOURCE)) {
                        //     const v = S.modMatrixValue(mod_src, slot, true);
                        //     if (v !== 0) {
                        //         console.log("ControlModsAssign value for", slot, mod_src, v);
                        //     }
                        // }


                        const direction = v < 0 ? 'to left' : 'to right';

                        return (
                            <Fragment key={i}>
                                {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                                    (mod_src, k) => {
                                        // console.log("ControlModsAssign.modMatrixValue", mod_src, slot);
                                        const v = S.modMatrixValue(mod_src, slot);
                                        if (Math.abs(v) > 0.0) {
                                            // console.log("ControlModsAssign value for", slot, mod_src, v);
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
