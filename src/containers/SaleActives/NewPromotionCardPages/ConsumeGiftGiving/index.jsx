import { Component } from 'react';
import { CONSUME_GIFT_GIVING } from '../../../../constants/entryCodes';
import registerPage from '../../../../index';
import PromotionIndex from '../components/PromotionIndex';
import { newPromotionCardPagesReducer } from '../store/reducer';

@registerPage([CONSUME_GIFT_GIVING], { newPromotionCardPagesReducer })
class ConsumeGiftGiving extends Component {
  render() {
    return <PromotionIndex promotionKey={87} />
  }
}

export default ConsumeGiftGiving

