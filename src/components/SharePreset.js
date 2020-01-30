import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {getShareUrl} from "../utils/sharing";
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

class SharePreset extends Component {

    state = {
        shortUrl: null
    };

    getShortUrl = () => {
        console.log("getShortUrl()");
        const number = this.props.state.preset_number;
        const S = this.props.state;
        if (S.presets && S.presets.length && S.presets[S.preset_number]) {

            const d = JSON.stringify(S.presets[S.preset_number]);
            // console.log(d.length, d);
            const z = compressToEncodedURIComponent(d);
            console.log(z.length, z);

            // test uncompress:
            // const u = decompressFromEncodedURIComponent(z);
            // const b = z.toString('base64');
            // const u = URLSafeBase64.encode(z);
            // console.log(u.length, u);


            // u = getShareUrl(this.props.state.presets[number].data);
            // console.log(u);
            this.setState({shortUrl: `/?data=${z}`});
        }
    };

    render() {
        const S = this.props.state;
        // const preset_name = S.presetName(S.preset_number);
        return <div><a href="#" onClick={this.getShortUrl}>share</a><a href={this.state.shortUrl}>short</a></div>;
    }
}

export default inject('state')(observer(SharePreset));
