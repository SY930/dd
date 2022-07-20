import React from 'react';
import LanchChannel from './LanchChannel';
import { saleLanchChannel as sale_lanch_channel } from './_reducer';
import registerPage from '../../../index';
import { SALE_LANCH_CHANNEL } from '../../constants/entryCodes';

@registerPage(SALE_LANCH_CHANNEL, { sale_lanch_channel })
export default class Index extends React.Component {
  render() {
    return (
      <LanchChannel />
    );
  }
}
