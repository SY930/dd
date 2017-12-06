import Immutable from 'immutable'

export const CRMCARD_LIST = 'CRMCARD_LIST';


const $$initialState = Immutable.fromJS({
    displayStyle: 'list',

});

export default function crmCardType($$state = $$initialState, action) {
    switch (action.type) {
        case CRMCARD_LIST:
            return $$state
            // .set('Value',action.testValue)；
            // .update('Value',action.testValue);
                .merge({ displayStyle: action.listType });
        default :
            return $$state;
    }
}

export function clickPic(value) {
    return ((dispatch) => {
        dispatch({
            type: CRMCARD_LIST,
            listType: value,
        })
    })
}

export function setStepInfo(value) {
    return ((dispatch) => {
        dispatch({
            type: PLATFORM_UI_STEPS_SET_INFO,
            stepInfo: value,
        })
    })
}
