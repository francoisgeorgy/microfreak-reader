import {inject, observer} from "mobx-react";
import React, {Component, Fragment} from "react";
import {
    ASSIGN1,
    ASSIGN2,
    ASSIGN3,
    MOD_ASSIGN_TARGET,
    MOD_DESTINATION,
    MOD_SOURCE,
    MOD_SOURCE_CSS
} from "../model";
import {MOD_MATRIX} from "../model";
import "./ModMatrix.css"

class ModMatrix extends Component {

    render() {
        const S = this.props.state;
        // if (!D || D.length === 0) return null;
        return (
            <div className="mod-matrix">
                <div></div>
                {Object.getOwnPropertySymbols(MOD_DESTINATION).map(
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
                )}
                {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                    (src, i) => {
                        return (
                            <Fragment key={i}>
                                <div className="mod-matrix-col-header"><div className={MOD_SOURCE_CSS[src]}>{MOD_SOURCE[src]}</div></div>
                                {Object.getOwnPropertySymbols(MOD_DESTINATION).map(
                                    (dst, j) => {
                                        const v = S.modMatrixValue(MOD_MATRIX[src][dst]);
                                        return <div key={j} className="mod-matrix-value">{Math.abs(v) > 0.00 ? v : ''}</div>
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
