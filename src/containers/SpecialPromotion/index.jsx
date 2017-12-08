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
import NewActivity from "./NewActivity";
import registerPage from '../../index';
import { OLD_NEW_SPECIAL } from '../../constants/entryCodes';

import { promotionBasicInfo } from '../../redux/reducer/saleCenter/promotionBasicInfo.reducer';
import { promotionDetailInfo } from '../../redux/reducer/saleCenter/promotionDetailInfo.reducer';
import { promotionScopeInfo } from '../../redux/reducer/saleCenter/promotionScopeInfo.reducer';
import { fullCut } from '../../redux/reducer/saleCenter/fullCut.reducer';
import { myActivities } from '../../redux/reducer/saleCenter/myActivities.reducer';
import { saleCenter } from '../../redux/reducer/saleCenter/saleCenter.reducer';
// import { giftInfoNew as sale_giftInfoNew } from '../GiftNew/_reducers';
import { mySpecialActivities } from '../../redux/reducer/saleCenter/mySpecialActivities.reducer';
import { specialPromotion } from '../../redux/reducer/saleCenter/specialPromotion.reducer';
// import { crmCardTypeNew as sale_crmCardTypeNew } from '../../redux/reducer/saleCenterNEW/crmCardType.reducer';
import { steps } from '../../redux/modules/steps';

@registerPage([OLD_NEW_SPECIAL], {
    sale_old_promotionBasicInfo: promotionBasicInfo,
    sale_old_promotionDetailInfo: promotionDetailInfo,
    sale_old_promotionScopeInfo: promotionScopeInfo,
    sale_old_fullCut: fullCut,
    sale_old_myActivities: myActivities,
    sale_old_saleCenter: saleCenter,
    sale_old_mySpecialActivities: mySpecialActivities,
    sale_old_specialPromotion: specialPromotion,
    sale_old_steps: steps,
})

class SaleCenter extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <NewActivity />
        );
    }
}

export default SaleCenter;
