import React from 'react';
import GiftDetailTable from './GiftDetailTable';
import registerPage from '../../../index';
import { GIFT_PAGE } from '../../../constants/entryCodes';

@registerPage([GIFT_PAGE], {})
export default class GiftInfo extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <GiftDetailTable />
        )
    }
}
