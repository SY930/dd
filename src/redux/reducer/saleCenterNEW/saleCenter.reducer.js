/**
 * @Author: xf
 * @Date:   2017-02-04T15:10:16+08:00
 * @Filename: saleCenter.reducer.js
 * @Last modified by:   xf
 * @Last modified time: 2017-03-28T17:14:40+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */

import Immutable from 'immutable';

import { ACTIVITY_CATEGORIES, CHARACTERISTIC_CATEGORIES } from '../../actions/saleCenterNEW/types';

const $initialState = Immutable.fromJS({
    activityCategories: ACTIVITY_CATEGORIES,
    characteristicCategories: CHARACTERISTIC_CATEGORIES,
});

export function saleCenter_NEW($$state = $initialState, action) {
    switch (action.type) {
        default: return $$state;
    }
}
