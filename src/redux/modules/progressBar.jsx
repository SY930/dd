/**
 * Created by yangke on 2016/12/21.
 */
import Immutable from 'immutable'
import { isFunction, findIndex } from 'lodash'

export const PROGRESS_BAR_STATE = 'PROGRESS_BAR_STATE';


const $$initialState = Immutable.fromJS({
    index: 0,
    total: 0,

});

export default function progressBar($$state = $$initialState, action) {
    // const panes = [];
    // et newTabIndex = $$state.getIn(['newTabIndex']);

    switch (action.type) {
        case PROGRESS_BAR_STATE:
            return $$state
            // .set('Value',action.testValue)；
            // .update('Value',action.testValue);
            // 'listType'跟action中保持一致
                .merge({ index: action.current, total: action.stepsTotal });
        default :
            return $$state;
    }
}

export function nextActions(value) {
    // return ((dispatch)=> {
    //   dispatch({
    //     type: PROGRESS_BAR_STATE,
    //     current: value.current,
    //     stepsTotal : value.stepsTotal
    //   })
    // })
    return {
        type: PROGRESS_BAR_STATE,
        current: value.current,
        stepsTotal: value.stepsTotal,
    };
}
