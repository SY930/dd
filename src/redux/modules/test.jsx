/**
 * Created by yangke on 2016/12/21.
 */
import Immutable from 'immutable'
import { isFunction, findIndex } from 'lodash'

export const PLATFORM_DATA_TEST_OK = 'PLATFORM_DATA_TEST_OK';

const $$initialState = Immutable.fromJS({
    Value: 'test',
});

export function test($$state = $$initialState, action) {
    // const panes = [];
    // et newTabIndex = $$state.getIn(['newTabIndex']);

    switch (action.type) {
        case PLATFORM_DATA_TEST_OK:
            // console.log(PLATFORM_DATA_TEST_OK);
            return $$state
            // .set('Value',action.testValue)；
            // .update('Value',action.testValue);
                .merge({ Value: action.testValue });
        default :
            return $$state;
    }
}

export function testOk(value) {
    // console.log("testOk");
    return ((dispatch) => {
        dispatch({
            type: PLATFORM_DATA_TEST_OK,
            testValue: value,
        })
    })
}
