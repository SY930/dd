
import { steps } from './modules/steps';
import { crmCardTypeNew } from './reducer/saleCenterNEW/crmCardType.reducer';
import { fullCut } from './reducer/saleCenter/fullCut.reducer';
import { fullCut_NEW } from './reducer/saleCenterNEW/fullCut.reducer';
import { saleCenter } from './reducer/saleCenter/saleCenter.reducer';
import { saleCenter_NEW } from './reducer/saleCenterNEW/saleCenter.reducer';
import { myActivities } from './reducer/saleCenter/myActivities.reducer';
import { myActivities_NEW } from './reducer/saleCenterNEW/myActivities.reducer';
import { mySpecialActivities } from './reducer/saleCenter/mySpecialActivities.reducer';
import { mySpecialActivities_NEW } from './reducer/saleCenterNEW/mySpecialActivities.reducer';
import { promotionBasicInfo } from './reducer/saleCenter/promotionBasicInfo.reducer';
import { promotionBasicInfo_NEW } from './reducer/saleCenterNEW/promotionBasicInfo.reducer';
import { promotionScopeInfo } from './reducer/saleCenter/promotionScopeInfo.reducer';
import { promotionScopeInfo_NEW } from './reducer/saleCenterNEW/promotionScopeInfo.reducer';
import { promotionDetailInfo } from './reducer/saleCenter/promotionDetailInfo.reducer';
import { promotionDetailInfo_NEW } from './reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { specialPromotion } from './reducer/saleCenter/specialPromotion.reducer';
import { specialPromotion_NEW } from './reducer/saleCenterNEW/specialPromotion.reducer';
import { giftInfo } from '../containers/Gift/_reducers';
import { giftInfoNew } from '../containers/GiftNew/_reducers';
import { crmOperation_dkl } from './reducer/saleCenterNEW/crmOperation.reducer';
import { crmOperation } from './reducer/saleCenter/crmOperation.reducer';

export default {
    steps,
    crmCardTypeNew,
    crmOperation,
    crmOperation_dkl,
    fullCut,
    fullCut_NEW,
    saleCenter,
    saleCenter_NEW,
    myActivities,
    myActivities_NEW,
    promotionBasicInfo,
    promotionBasicInfo_NEW,
    promotionScopeInfo,
    promotionScopeInfo_NEW,
    promotionDetailInfo,
    promotionDetailInfo_NEW,
    specialPromotion,
    specialPromotion_NEW,
    mySpecialActivities,
    mySpecialActivities_NEW,
};
