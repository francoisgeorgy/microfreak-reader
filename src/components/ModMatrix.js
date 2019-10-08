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
import "./ModMatrix.css"

class ModMatrix extends Component {

    Mods = (src, dest, key) => {
        // console.log("Mods", src, dest);     // Symbol(MOD_SRC_CYC_ENV) Symbol(PITCH)

        const S = this.props.state;

        let mods = [];

        for (let slot of [ASSIGN1, ASSIGN2, ASSIGN3]) {
            // const slot = ASSIGN1;

            const dest_def = S.modAssignDest(slot);
            if (!dest_def) {
                continue;
            }

            // console.log("MODS", slot);

            // const mod_target = MOD_GROUP_MOD_DEST[dest]
            //const control = dest_def.control[S.modAssignControlNum(dest)];
            // console.log("Mods matrix mod", src, dest, MOD_GROUP_MOD_DEST[dest], dest_def);

            if (MOD_GROUP_MOD_DEST[dest] === dest_def.mod_group) {
                // console.log("Mods matrix mod dest def", slot, src, dest, dest_def);
                const control = dest_def.control[S.modAssignControlNum(slot)];
                if (control === src) {
                    // console.log("Mods matrix mod ifself", src, dest, control, dest_def.mod_group);
                    // console.log("Mods matrix mod ifself sources", Object.keys(MOD_SOURCE));
                    // return <div>mods {MOD_DESTINATION[control]} {MOD_GROUP_NAME[dest_def.mod_group]}</div>
                    // return <div>{S.modDestName(slot)}</div>;
                    // let k = 0;
                    for (let mod_src of Object.getOwnPropertySymbols(MOD_SOURCE)) {
                        // k++;
                        // console.log("Mods.modMatrixValue", mod_src, slot);
                        const v = S.modMatrixValue(mod_src, slot);
                        if (v && (Math.abs(v) > 0.00)) {
                            // console.log("Mods matrix mod v", mod_src, slot, v);
                            const direction = v < 0 ? 'to left' : 'to right';
                            // console.log('key k', k);
                            // src.toString()+dest.toString()
                            mods.push(
                                <div key={slot.toString()+key} className="mod" style={
                                    {background: `linear-gradient(${direction}, var(--${MOD_SOURCE_CSS[mod_src]}) ${Math.abs(v)}%, var(--mod-src-bg) ${Math.abs(v)}%)`}
                                }>
                                    <div className="mod-text">
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

        //
        // ModMatrix.js:82 ------ Symbol(MOD_SRC_LFO) x Symbol(OSC_WAVE) ------
        // ModMatrix.js:28 Mods Symbol(MOD_SRC_LFO) Symbol(OSC_WAVE)
        // ModMatrix.js:36 Mods matrix mod   Symbol(MOD_SRC_LFO)    Symbol(OSC_WAVE)    Symbol(MOD_GROUP_MATRIX_WAVE)   {mod_group: Symbol(MOD_GROUP_MATRIX_WAVE), control: {…}}

        // Mods Symbol(MOD_SRC_CYC_ENV) Symbol(PITCH)
        // modAssignDest 11 (2) [21, 5] {mod_group: Symbol(MOD_GROUP_MATRIX_WAVE), control: {…}}

    };

    render() {
        const S = this.props.state;
        // if (!D || D.length === 0) return null;
        return (
            <div className="mod-matrix">
                <div></div>
                {Object.getOwnPropertySymbols(MOD_MATRIX_DESTINATION).map(
                    (dest, i) => {
                        return (<div key={`d${i}`} className="mod-matrix-dest">{S.modDestName(dest)}</div>);
                    }
/*
                    (sym, i) => {
                        let d = MOD_DESTINATION[sym];
                        if (sym === ASSIGN1 || sym === ASSIGN2 || sym === ASSIGN3) {
                            const group = S.modAssignGroup(sym);
                            const control = S.modAssignControl(sym);
                            let gn = '?';
                            let cn = '?';
                            if (MOD_ASSIGN_TARGET[group]) {
                                gn = MOD_ASSIGN_TARGET[group].name;
                                if (MOD_ASSIGN_TARGET[group].control[control]) {
                                    cn = MOD_ASSIGN_TARGET[group].control[control];
                                    d = `${gn} ${cn}`;
                                }
                            }
                        }
                        return (<div key={i} className="mod-matrix-dest">{d}</div>)
                    }
*/
                )}
                {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                    (src, i) => {
                        // console.log('key i', i);
                        return (
                            <Fragment key={i}>
                                <div className="mod-matrix-col-header">
                                    <div className={`${MOD_SOURCE_CSS[src]} ${MOD_SOURCE_CSS[src]}-bg`}>{MOD_SOURCE[src]}</div>
                                </div>
                                {Object.getOwnPropertySymbols(MOD_MATRIX_DESTINATION).map(
                                    (dst, j) => {
                                        // console.log('key ij', j, `${i}${j}`);
                                        // console.log("ModMatrix.modMatrixValue", src, dst);
                                        const v = S.modMatrixValue(src, dst);
                                        const key = `${i}${j}`;
                                        const show = Math.abs(v) > 0.00;
                                        return (
                                            <div key={key} className="mod-matrix-value">
                                                {show ? v : null}
                                                {show ? this.Mods(src, dst, key) : null}
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

    }
}

export default inject('state')(observer(ModMatrix));
