import React from 'react';

import GiftType from './GiftType';

export default class GiftAdd extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <GiftType />
            </div>
        )
    }
}
