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

    getShortUrl = () => {
        this.props.state.createShortUrl();
    };

    render() {
        if (this.props.state.presetNull) {
            return null;
        }
        return this.props.state.shortUrl ?
            (<div>
                <a className="shorturl" href={this.props.state.shortUrl}>{this.props.state.shortUrl.substring(8)}</a>
            </div>) :
            (<div>
                <span className="shorturl-icon"><button type="button" onClick={this.getShortUrl} title="get share URL"><FontAwesomeIcon icon={faShareAlt}/></button></span>
            </div>);
    }
}

export default inject('state')(observer(SharePreset));
