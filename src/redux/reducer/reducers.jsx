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
import {DEFAULT_WECHAT_TEMPLATE_CONFIG} from "../../constants/weChatTemplateConstants";

const defaultMsgs = [
    {
        msgType: 2,
        title: DEFAULT_WECHAT_TEMPLATE_CONFIG['2'].title,
        remark: DEFAULT_WECHAT_TEMPLATE_CONFIG['2'].remark,
        jump: 0,
        reDirectType: 1,
        reDirectUrl: '',
        isPushMsg: 1
    },
    {
        msgType: 1,
        title: DEFAULT_WECHAT_TEMPLATE_CONFIG['1'].title,
        remark: DEFAULT_WECHAT_TEMPLATE_CONFIG['1'].remark,
        reDirectType: 1,
        jump: 0,
        reDirectUrl: '',
        isPushMsg: 1
    },
    {
        msgType: 3,
        title: DEFAULT_WECHAT_TEMPLATE_CONFIG['3'].title,
        remark: DEFAULT_WECHAT_TEMPLATE_CONFIG['3'].remark,
        reDirectType: 1,
        jump: 0,
        reDirectUrl: '',
        isPushMsg: 1
    },
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
            // 逻辑变更 统一调用新增接口
            const isCreate = true;
            const [a = defaultMsgs[0], b = defaultMsgs[1], c = defaultMsgs[2]] = Array.isArray(action.payload) ? action.payload : [];
            return $$state
                .set('loading', false)
                .set('isCreate', isCreate)
                .set('isQueryFulfilled', true)
                .set('wechatMessageTemplateList', Immutable.fromJS([a, b, c]));
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
