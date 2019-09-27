import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {SWITCH} from "../model";
import "./Switch.css";
import ControlMods from "./ControlMods";

class Switch extends Component {

    render() {

        const {cc, state: S} = this.props;
        const sw = SWITCH[cc];

        const v = S.switchValue(sw);

        // console.log("switch", sw.name, v);

        return (
            <div className={`switch`}>
                <div className="ctrl-name">{sw.name}</div>
                <div className={`sw-values ${this.props.layout}`}>
                {sw.values.map(
                    (s, index) => {
                        // console.log("switch loop", s, v);
                        return (
                            <div key={s.value} className={s.name === v ? 'sw-val sw-sel' : 'sw-val'}>{s.name}</div>
                        )
                    }
                )}
                </div>
                <ControlMods cc={cc} />
            </div>
        );

    }
}

export default inject('state')(observer(Switch));
