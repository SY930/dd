import { Component } from 'react';
import { CONSUME_GIFT_GIVING } from '../../../../constants/entryCodes';
import registerPage from '../../../../index';
import PromotionIndex from '../components/PromotionIndex';
import { newPromotionCardPagesReducer } from '../store/reducer';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { promotionScopeInfo_NEW as sale_promotionScopeInfo_NEW } from '../../../../redux/reducer/saleCenterNEW/promotionScopeInfo.reducer';

// _TODO

@registerPage([CONSUME_GIFT_GIVING], {
    newPromotionCardPagesReducer,
    sale_promotionDetailInfo_NEW,
    sale_promotionScopeInfo_NEW
})
class ConsumeGiftGiving extends Component {
    render() {
        return <PromotionIndex promotionKey={87} />
    }
}

export default ConsumeGiftGiving

