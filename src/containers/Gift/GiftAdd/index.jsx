import React from 'react';

import GiftType from './GiftType';

import registerPage from '../../../index';
import { OLD_NEW_GIFT } from '../../../constants/entryCodes';
import { myActivities } from '../../../redux/reducer/saleCenter/myActivities.reducer';
import { giftInfo } from '../_reducers';
import { promotionDetailInfo } from '../../../redux/reducer/saleCenter/promotionDetailInfo.reducer';
import { crmOperation } from '../../../redux/reducer/saleCenter/crmOperation.reducer';
import { steps } from '../../../redux/modules/steps';

@registerPage([OLD_NEW_GIFT], {
    sale_old_myActivities: myActivities,
    sale_old_giftInfo: giftInfo,
    sale_old_promotionDetailInfo: promotionDetailInfo,
    sale_old_crmOperation: crmOperation,
    sale_old_steps :steps,
})
export default class GiftAdd extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <GiftType />
            </div>
        )
    }
}
