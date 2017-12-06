import React from 'react';
import GiftType from './GiftType';
import registerPage from '../../../index';
import { NEW_GIFT } from '../../../constants/entryCodes';

@registerPage([NEW_GIFT], {})
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
