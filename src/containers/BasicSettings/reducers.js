import Immutable, { List } from 'immutable';
import {
    GET_SMS_TEMPLATE_LIST_START,
    GET_SMS_TEMPLATE_LIST_SUCCESS,
    GET_SMS_TEMPLATE_LIST_FAIL,
    UPDATE_SMS_TEMPLATE_START,
    UPDATE_SMS_TEMPLATE_SUCCESS,
    UPDATE_SMS_TEMPLATE_FAIL,
    CREATE_SMS_TEMPLATE_START,
    CREATE_SMS_TEMPLATE_SUCCESS,
    CREATE_SMS_TEMPLATE_FAIL,
    DELETE_SMS_TEMPLATE_START,
    DELETE_SMS_TEMPLATE_SUCCESS,
    DELETE_SMS_TEMPLATE_FAIL,
} from './actions';

const initialState = Immutable.fromJS({
    messageTemplateList: [],
    messageTemplateListLoading: false,
});

export function messageTemplateState(state = initialState, action) {
    switch (action.type) {
        case GET_SMS_TEMPLATE_LIST_START:
            return state.set('messageTemplateListLoading', true);
        case GET_SMS_TEMPLATE_LIST_FAIL:
            return state.set('messageTemplateListLoading', false);
        case GET_SMS_TEMPLATE_LIST_SUCCESS:
            return state.set('messageTemplateList', Immutable.fromJS(action.payload.list))
                .set('loading', false);
        default:
            return state
    }
}
