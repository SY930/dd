import Immutable from 'immutable';
import {
    SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_START,
    SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_SUCCESS,
    SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_FAIL,
    SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_START,
    SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_SUCCESS,
    SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_FAIL,
    SALE_CENTER_RESET_WECHAT_MESSAGE_TEMPLATE,
    SALE_CENTER_EDIT_WECHAT_MESSAGE_TEMPLATE,
    SALE_CENTER_CHANGE_WECHAT_MESSAGE_TEMPLATE_CURRENT_TYPE,
    SALE_CENTER_CHANGE_WECHAT_MESSAGE_TEMPLATE,
} from '../actions/actions';

const defaultMsgs = [
    {
        msgType: 2,
        title: '送礼啦！',
        remark: '感谢您的支持',
        reDirectType: 1,
        reDirectUrl: '',
        isPushMsg: 1
    },
    {
        msgType: 1,
        title: '亲，您有电子券即将到期，不要让白花花的银子溜走哦',
        remark: '请您尽快到店使用',
        reDirectType: 1,
        reDirectUrl: '',
        isPushMsg: 1
    }
];
const $initialState = Immutable.fromJS({
    loading: false,
    isSaving: false,
    isCreate: true,
    isEditing: false,
    isQueryFulfilled: true,
    currentType: 2,
    wechatMessageTemplateList: defaultMsgs,
});

export const sale_wechat_message_setting = ($$state = $initialState, action) => {
    switch (action.type) {
        case SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_START:
            return $$state.set('loading', true);
        case SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_FAIL:
            return $$state
                    .set('loading', false)
                    .set('isQueryFulfilled', false);
        case SALE_CENTER_QUERY_WECHAT_MESSAGE_TEMPLATE_SUCCESS:
            const isCreate = !(action.payload || []).length;
            if (isCreate) {
                return $$state
                    .set('loading', false)
                    .set('isCreate', true)
                    .set('isQueryFulfilled', true)
            } else {
                const list = Immutable.fromJS(action.payload || []);
                return $$state
                    .set('loading', false)
                    .set('isCreate', false)
                    .set('isQueryFulfilled', true)
                    .set('wechatMessageTemplateList', list);
            }
        case SALE_CENTER_EDIT_WECHAT_MESSAGE_TEMPLATE:
            return $$state.set('isEditing', true);
        case SALE_CENTER_RESET_WECHAT_MESSAGE_TEMPLATE:
            return $$state
                    .set('isEditing', false);
        case SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_START:
            return $$state.set('isSaving', true);
        case SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_FAIL:
            return $$state.set('isSaving', false);
        case SALE_CENTER_CHANGE_WECHAT_MESSAGE_TEMPLATE_CURRENT_TYPE:
            return $$state.set('currentType', Number(action.payload));
        case SALE_CENTER_CHANGE_WECHAT_MESSAGE_TEMPLATE:
            const {type, key, value} = action.payload;
            const indexOfTemplateToUpdate = $$state.get('wechatMessageTemplateList').findIndex(template => {
                return template.get('msgType') === type;
            });
            return $$state.setIn(['wechatMessageTemplateList', indexOfTemplateToUpdate, key], value);
        case SALE_CENTER_SAVE_WECHAT_MESSAGE_TEMPLATE_SUCCESS:
            return $$state
                    .set('isSaving', false)
                    .set('isEditing', false);
        default: return $$state;
    }
};
