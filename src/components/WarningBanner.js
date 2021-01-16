import React, {Component} from 'react';
import "./WarningBanner.css";

export class WarningBanner extends Component {

    render() {
        return (
            <div className="warning-top">
                This version does not yet support firmware v3. The support is still incomplete for firmware v2. Updates coming soon...
            </div>
        );
    }

}
