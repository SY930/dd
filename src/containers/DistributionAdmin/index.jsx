import React from 'react';
import Distribution from './Distribution';
import registerPage from '../../../index';
import { SALE_DISTRIBUTION_ADMIN } from '../../constants/entryCodes';

@registerPage(SALE_DISTRIBUTION_ADMIN, {})
export default class Index extends React.Component {
  render() {
    return (
      <Distribution />
    );
  }
}
