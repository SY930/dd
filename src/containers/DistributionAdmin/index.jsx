import React from 'react';
import registerPage from '../../../index';
import { SALE_DISTRIBUTION_ADMIN } from '../../constants/entryCodes';
import Distribution from './Distribution';
import { distribution_reducer } from './store/reducer';

@registerPage(SALE_DISTRIBUTION_ADMIN, { distribution_reducer })
export default class Index extends React.Component {
  render() {
    return (
      <Distribution />
    );
  }
}
