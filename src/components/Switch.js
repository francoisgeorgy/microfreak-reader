import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {SWITCH} from "../model";
import "./Switch.css";
import ControlMods from "./ControlMods";


class Switch extends Component {

    render() {

        // console.log("Control.render");

        const {cc, state: S} = this.props;
        const sw = SWITCH[cc];
        // const v = d.mapping ? d.mapping(S.preset[cc]) : S.preset[cc];
        // const v = -100;

        const v = S.switchValue(sw);

        // const n = S.values.length;


        //HACK:
        // const c = cc === OSC_TYPE ? 'xlarge' : '';

        return (
            <div className={`switch`}>
                <div className="ctrl-name">{sw.name}</div>
                {sw.values.map(
                    (s, index) =>
                        <div className={s.value === v ? 'sw-val sw-sel' : 'sw-val'}>{s.name}</div>
                )}
                <ControlMods cc={cc} />
            </div>
        );

    }
}

export default inject('state')(observer(Switch));
