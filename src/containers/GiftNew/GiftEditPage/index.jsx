import React from 'react';
import { giftInfoNew as sale_giftInfoNew } from '../_reducers';
import registerPage from '../../../index';
import { GIFT_EDIT_PAGE } from '../../../constants/entryCodes';
import GiftEditPage from '../components/GiftEditPage';

@registerPage(GIFT_EDIT_PAGE, { sale_giftInfoNew })
export default class Index extends React.Component {
    render() {
        return (
            <GiftEditPage tabkey='1' />
        );
    }
}