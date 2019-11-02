import React, {Component} from 'react';
import {inject, observer, Provider} from "mobx-react";
import Helmet from "react-helmet/es/Helmet";

class WindowTitle extends Component {

    render() {
        const S = this.props.state;
        const preset_name = S.presetName(S.preset_number);
        return (
            <Helmet>
                <title>MicroFreak Reader{ preset_name ? ` preset #${S.preset_number + 1} - ${preset_name}` : ''}</title>
            </Helmet>
        );
    }
}

export default inject('state')(observer(WindowTitle));
