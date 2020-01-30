import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
// import {getShareUrl} from "../utils/sharing";
// import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
// import axios from 'axios';
import "./SharePreset.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShareAlt} from "@fortawesome/free-solid-svg-icons";

class SharePreset extends Component {

    state = {
        shortUrl: null
    };

/*
    testPost = async () => {
        console.log("will post");
        let res = await axios.post(
            'http://www.mocky.io/v2/5e32facb3200005f0094d317',
            "this_is_the_data");
        console.log("has posted");
        console.log(res);
        // let { data } = res.json();
        // console.log(data);
    };
*/

/*
    getShortUrl = async () => {
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
            console.log("getShortUrl: will post");
            let res = await axios.post(
                'http://www.mocky.io/v2/5e32facb3200005f0094d317',
                "this_is_the_data");

            console.log("getShortUrl: has posted");
            // u = getShareUrl(this.props.state.presets[number].data);
            // console.log(u);

            console.log(`set state.shortUrl to ${res.data}`);

            this.setState({shortUrl: res.data});
            // this.setState({shortUrl: `/?data=${z}`});
        }
    };
*/

    getShortUrl = () => {
        this.props.state.createShortUrl();
    };


    render() {
        console.log("SharePreset render");
        // const S = this.props.state;
        // const preset_name = S.presetName(S.preset_number);

        // let u = '';
        // if (this.props.state.presets && this.props.state.presets.length && this.props.state.presets[this.props.state.preset_number]) {
        //     u = this.props.state.presets[this.props.state.preset_number].shortUrl;
        // }

        return this.props.state.shortUrl ?
            (<div>
                <a className="shorturl" href={this.props.state.shortUrl}>{this.props.state.shortUrl}</a>
            </div>) :
            (<div>
                <span className="shorturl-icon"><a href="#" onClick={this.getShortUrl}><FontAwesomeIcon icon={faShareAlt} /></a></span>
            </div>);

/*
        return (
            <div>
                <span className="shorturl-icon"><a href="#" onClick={this.getShortUrl}><FontAwesomeIcon icon={faShareAlt} /></a></span>
                <a className="shorturl" href={this.props.state.shortUrl}>{this.props.state.shortUrl}</a>
            </div>);
*/
    }
}

export default inject('state')(observer(SharePreset));