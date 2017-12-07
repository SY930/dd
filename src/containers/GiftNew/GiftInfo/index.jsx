import React from 'react';
import GiftDetailTable from './GiftDetailTable';
import registerPage from '../../../index';
import { GIFT_PAGE } from '../../../constants/entryCodes';

import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../_reducers';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { crmOperation_dkl as sale_crmOperation_dkl } from '../../../redux/reducer/saleCenterNEW/crmOperation.reducer';

@registerPage([GIFT_PAGE], {
    sale_myActivities_NEW,
    sale_giftInfoNew,
    sale_promotionDetailInfo_NEW,
    sale_crmOperation_dkl,
})
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
