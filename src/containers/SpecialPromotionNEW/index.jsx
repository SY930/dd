/**
 * Created by yangke on 2016/12/21.
* @Author: xf
* @Date:   2017-01-23T13:49:32+08:00
* @Filename: index.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-05T10:58:20+08:00
* @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
*/

import React from 'react';
import NewActivity from './NewActivity';
import registerPage from '../../index';
import { NEW_SPECIAL } from '../../constants/entryCodes';

import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from '../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { promotionScopeInfo_NEW as sale_promotionScopeInfo_NEW } from '../../redux/reducer/saleCenterNEW/promotionScopeInfo.reducer';
import { fullCut_NEW as sale_fullCut_NEW } from '../../redux/reducer/saleCenterNEW/fullCut.reducer';
import { myActivities_NEW as sale_myActivities_NEW } from '../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { saleCenter_NEW as sale_saleCenter_NEW } from '../../redux/reducer/saleCenterNEW/saleCenter.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../GiftNew/_reducers';
import { mySpecialActivities_NEW as sale_mySpecialActivities_NEW } from '../../redux/reducer/saleCenterNEW/mySpecialActivities.reducer';
import { specialPromotion_NEW as sale_specialPromotion_NEW } from '../../redux/reducer/saleCenterNEW/specialPromotion.reducer';
import { crmCardTypeNew as sale_crmCardTypeNew } from '../../redux/reducer/saleCenterNEW/crmCardType.reducer';
import { steps as sale_steps } from '../../redux/modules/steps';

@registerPage([NEW_SPECIAL], {
    sale_promotionBasicInfo_NEW,
    sale_promotionDetailInfo_NEW,
    sale_promotionScopeInfo_NEW,
    sale_fullCut_NEW,
    sale_myActivities_NEW,
    sale_saleCenter_NEW,
    sale_giftInfoNew,
    sale_mySpecialActivities_NEW,
    sale_specialPromotion_NEW,
    sale_crmCardTypeNew,
    sale_steps,
})
class SaleCenter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div >
                <NewActivity />
            </div>
        );
    }
}

export default SaleCenter;
