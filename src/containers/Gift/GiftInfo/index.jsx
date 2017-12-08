import React from 'react';

import GiftDetailTable from './GiftDetailTable';

import registerPage from '../../../index';
import { OLD_GIFT_PAGE } from '../../../constants/entryCodes';
import { myActivities } from '../../../redux/reducer/saleCenter/myActivities.reducer';
import { giftInfo } from '../_reducers';
import { promotionDetailInfo } from '../../../redux/reducer/saleCenter/promotionDetailInfo.reducer';
import { crmOperation } from '../../../redux/reducer/saleCenter/crmOperation.reducer';
import { steps } from '../../../redux/modules/steps';

@registerPage([OLD_GIFT_PAGE], {
    sale_old_myActivities: myActivities,
    sale_old_giftInfo: giftInfo,
    sale_old_promotionDetailInfo: promotionDetailInfo,
    sale_old_crmOperation: crmOperation,
    sale_old_steps :steps,
})
export default class GiftInfo extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
                <GiftDetailTable />
        )
    }
}
