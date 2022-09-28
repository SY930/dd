import React, { Component } from 'react';
import { TODO_DEMO } from '../../../../constants/entryCodes';
import registerPage from '../../../../index';
import PromotionIndex from '../components/PromotionIndex';
import { newPromotionCardPagesReducer } from '../store/reducer';

@registerPage([TODO_DEMO], { newPromotionCardPagesReducer })
class TodoDemo extends Component {
  render() {
    return (
      <PromotionIndex promotionKey={87} />
    )
  }
}

export default TodoDemo

