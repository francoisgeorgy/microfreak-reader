import React, {Component, Fragment} from "react";
import {inject, observer} from "mobx-react";
import {CONTROL, OSC_TYPE} from "../model";

class ListView extends Component {

    state = {
        cols: 4,
        sortBy: 'num'
    };

    render() {

        const S = this.props.state;
        const fw = S.fwVersion();
        const control = CONTROL[fw][OSC_TYPE];

        const presets = [];
        for (let i=0; i<256; i++) {
            const v = S.controlValue(control, true, i);
            const mapped = control.mapping ? control.mapping(v, fw) : '';
            const n = S.presetName(i);
            presets.push({
                index: i,
                cat: S.presetCat(i),
                name: n,
                osc: n && mapped
            });
        }

        let sort_key = this.state.sortBy;

        presets.sort(( a, b ) => {
            if (a[sort_key] === '') return 1;
            if ( a[sort_key] < b[sort_key] ){
                return -1;
            }
            if ( a[sort_key] > b[sort_key] ){
                return 1;
            }
            return 0;
        });


        const cols = this.state.cols;
        const delta = 256 / cols;

        const pc = [];
        for (let i=0; i<(256 / cols); i++) {
            for (let c=0; c<cols; c++) {
                const k = c*delta + i;
                pc.push(
                    <Fragment key={k}>
                        <div className={`num ${c===0?'':'pl'}`}>{presets[k].index + 1}</div>
                        <div>{presets[k].name}</div>
                        <div>{presets[k].cat}</div>
                        <div>{presets[k].osc}</div>
                    </Fragment>
                );
            }
        }

        const head = [];
        for (let c=0; c<cols; c++) {
            head.push(
                <Fragment key={c}>
                    <div className="lw-h num">#</div>
                    <div className="lw-h">name</div>
                    <div className="lw-h">cat.</div>
                    <div className="lw-h">osc. type</div>
                </Fragment>
            );
        }

        return (
            <div>
                <div className="lw-controls">
                    <div>sort by </div>
                    <button type="button" onClick={() => this.setState({sortBy:"num"})} className={this.state.sortBy==="num"?'lw-bt lw-bt-on':'lw-bt'}>num</button>
                    <button type="button" onClick={() => this.setState({sortBy:"name"})} className={this.state.sortBy==="name"?'lw-bt lw-bt-on':'lw-bt'}>name</button>
                    <button type="button" onClick={() => this.setState({sortBy:"cat"})} className={this.state.sortBy==="cat"?'lw-bt lw-bt-on':'lw-bt'}>cat</button>
                    <button type="button" onClick={() => this.setState({sortBy:"osc"})} className={this.state.sortBy==="osc"?'lw-bt lw-bt-on':'lw-bt'}>osc</button>
                    <div className="ml">display in </div>
                    <button type="button" onClick={() => this.setState({cols:1})} className={this.state.cols===1?'lw-bt lw-bt-on':'lw-bt'}>1</button>
                    <button type="button" onClick={() => this.setState({cols:2})} className={this.state.cols===2?'lw-bt lw-bt-on':'lw-bt'}>2</button>
                    <button type="button" onClick={() => this.setState({cols:4})} className={this.state.cols===4?'lw-bt lw-bt-on':'lw-bt'}>4</button>
                    <div> columns</div>
                </div>
                <div className="lw-content">
                    <div className={`lw-presets-list lw-grid-${this.state.cols}`}>
                        {head}
                        {pc}
                    </div>
                </div>
            </div>
        );
    }

}

export default inject('state')(observer(ListView));