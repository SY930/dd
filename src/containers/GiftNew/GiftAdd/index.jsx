import React from 'react';
import GiftType from './GiftType';
import registerPage from '../../../index';
import { NEW_GIFT } from '../../../constants/entryCodes';
// myActivities_NEW,promotionDetailInfo_NEW,giftInfoNew,crmOperation_dkl

import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../_reducers';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { crmOperation_dkl as sale_crmOperation_dkl } from '../../../redux/reducer/saleCenterNEW/crmOperation.reducer';

@registerPage([NEW_GIFT], {
    sale_myActivities_NEW,
    sale_giftInfoNew,
    sale_promotionDetailInfo_NEW,
    sale_crmOperation_dkl,
})
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
