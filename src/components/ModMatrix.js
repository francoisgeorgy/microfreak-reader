import {inject, observer} from "mobx-react";
import React, {Component, Fragment} from "react";
import {
    ASSIGN1,
    ASSIGN2,
    ASSIGN3,
    MOD_GROUP_MOD_DEST, MOD_MATRIX_DESTINATION,
    MOD_SOURCE,
    MOD_SOURCE_CSS, MOD_SOURCE_SHORT
} from "../model";
import "./ModMatrix.css";

class ModMatrix extends Component {

    Mods = (src, dest, key) => {

        const S = this.props.state;

        let mods = [];

        for (let slot of [ASSIGN1, ASSIGN2, ASSIGN3]) {

            const dest_def = S.modAssignDest(slot);
            if (!dest_def) {
                continue;
            }

            if (MOD_GROUP_MOD_DEST[dest] === dest_def.mod_group) {
                const control = dest_def.control[S.modAssignControlNum(slot)];
                if (control === src) {
                    for (let mod_src of Object.getOwnPropertySymbols(MOD_SOURCE)) {
                        const v = S.modMatrixValue(mod_src, slot);
                        if (v && (Math.abs(v) > 0.00)) {
                            const direction = v < 0 ? 'to left' : 'to right';
                            mods.push(
                                <div key={slot.toString() + mod_src.toString() + key} className="mod" style={
                                    {background: `linear-gradient(${direction}, var(--${MOD_SOURCE_CSS[mod_src]}) ${Math.abs(v)}%, var(--mod-src-bg) ${Math.abs(v)}%)`}
                                } title={`${MOD_SOURCE_SHORT[mod_src]} ${v}`}>
                                    <div className={`mod-text ${MOD_SOURCE_CSS[mod_src]}-text`}>
                                        <div className="mod-name">{MOD_SOURCE_SHORT[mod_src]}</div>
                                        <div className="mod-value">{v}</div>
                                    </div>
                                </div>
                            );
                        }
                    }
                }
            }
        }

        return mods;
    };

    render() {

        const S = this.props.state;

        let supported_format = true;
        if (S.presets && S.presets.length && S.presets[S.preset_number]) {
            if (S.presets[S.preset_number].hasOwnProperty("supported")) {
                supported_format = S.presets[S.preset_number].supported;
            // } else {
            //     supported_format = true;
            }
        }

        if (supported_format) {
            return (
                <div className="mod-matrix">
                    <div></div>
                    {Object.getOwnPropertySymbols(MOD_MATRIX_DESTINATION).map(
                        (dest, i) => {
                            return (<div key={`d${i}`} className="mod-matrix-dest">{S.modDestName(dest)}</div>);
                        }
                    )}
                    {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                        (src, i) => {
                            return (
                                <Fragment key={i}>
                                    <div className="mod-matrix-col-header">
                                        <div className={`${MOD_SOURCE_CSS[src]} ${MOD_SOURCE_CSS[src]}-bg`}>{MOD_SOURCE[src]}</div>
                                    </div>
                                    {Object.getOwnPropertySymbols(MOD_MATRIX_DESTINATION).map(
                                        (dst, j) => {
                                            const v = S.modMatrixValue(src, dst);
                                            const k = `${i}${j}`;
                                            const show = Math.abs(v) > 0.00;
                                            return (
                                                <div key={k} className="mod-matrix-value">
                                                    {show ? v : null}
                                                    {show ? this.Mods(src, dst, k) : null}
                                                </div>
                                            );
                                        }
                                    )}
                                </Fragment>
                            )
                        }
                    )}
                </div>
            );
        } else {
            return (
                <div className="mod-matrix">
                    <div></div>
                    {Object.getOwnPropertySymbols(MOD_MATRIX_DESTINATION).map(
                        (dest, i) => {
                            return (<div key={`d${i}`} className="mod-matrix-dest">{S.modDestName(dest)}</div>);
                        }
                    )}
                    {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                        (src, i) => {
                            return (
                                <Fragment key={i}>
                                    <div className="mod-matrix-col-header">
                                        <div className={`${MOD_SOURCE_CSS[src]} ${MOD_SOURCE_CSS[src]}-bg`}>{MOD_SOURCE[src]}</div>
                                    </div>
                                    {i === 0 &&
                                        <div className="mod-matrix-unsupported">
                                            <div>
                                                This factory preset mod-matrix is in an indecipherable format.
                                            </div>
                                            <div>
                                                To view this preset mod-matrix you have two possibilities:
                                                <ol>
                                                    <li>Copy this preset in another slot.</li>
                                                    <li>Remove this preset's write protection and save it over itself.</li>
                                                </ol>
                                            </div>
                                            <div>
                                                <a href="https://studiocode.dev/microfreak/reader/help/#unsupported-factory-presets" target="_blank" rel="noopener noreferrer">More info in the doc.</a>
                                            </div>
                                        </div>
                                    }
                                </Fragment>
                            )
                        }
                    )}
                </div>
            );
        }
    }

}

export default inject('state')(observer(ModMatrix));
