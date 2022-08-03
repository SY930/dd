import React from 'react';
import registerPage from '../../../index';
import { SALE_AUTOMATED_SALE } from '../../constants/entryCodes';
import Main from "./Main/index";

@registerPage(SALE_AUTOMATED_SALE, {})
export default class Index extends React.Component {
  render() {
    return (
      <Main />
    );
  }
}
