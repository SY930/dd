import React, { Component } from 'react';
import { connect } from 'react-redux';
import registerPage from '../../../index';
import {
    PROMOTION_DECORATION,
} from '../../constants/entryCodes';

@registerPage([PROMOTION_DECORATION])
export default class PromotionDecoration extends Component {
    render() {
        return (
            <div>
                123
            </div>
        )
    }
}
