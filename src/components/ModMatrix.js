import {inject, observer} from "mobx-react";
import React, {Component, Fragment} from "react";
import {ENV, MOD_DESTINATION, MOD_SOURCE, PITCH} from "../model";
import {MOD_MATRIX} from "../model";
import "./ModMatrix.css"

class ModMatrix extends Component {

/*
    matrix = (source, dest) => {
        return (
            <div>
                {MOD_SOURCE[source]} &#10142; {MOD_DESTINATION[dest]}: {this.props.state.modMatrixValue(MOD_MATRIX[source][dest])}
            </div>
        );
    };
*/
/*env-pitch: {this.props.state.modMatrixValue(MOD_MATRIX[ENV][PITCH])}*/

    render() {
        // const D = this.props.state.data;
        // if (!D || D.length === 0) return null;
        return (
            <div className="mod-matrix">
                <div></div>
                {Object.getOwnPropertySymbols(MOD_DESTINATION).map(
                    (sym, i) => {
                        return (<div key={i}>{MOD_DESTINATION[sym]}</div>)
                    }
                )}
                {Object.getOwnPropertySymbols(MOD_SOURCE).map(
                    (src, i) => {
                        return (
                            <Fragment key={i}>
                                <div>{MOD_SOURCE[src]}</div>
                                {Object.getOwnPropertySymbols(MOD_DESTINATION).map(
                                    (dst, j) => {
                                        return <div key={j}>{this.props.state.modMatrixValue(MOD_MATRIX[src][dst])}</div>
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
