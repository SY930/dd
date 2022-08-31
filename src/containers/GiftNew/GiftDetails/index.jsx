import React from 'react';
import { giftInfoNew as sale_giftInfoNew } from '../_reducers';
import registerPage from '../../../index';
import { GIFT_DETAILS } from '../../../constants/entryCodes';
import GiftDetail from './GiftDetail'

@registerPage(GIFT_DETAILS, { sale_giftInfoNew })
export default class Index extends React.Component {
  render() {
    return (
      <GiftDetail></GiftDetail>
    );
  }
}