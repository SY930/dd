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
    messageTemplateList: [
        /*{
            "itemID":851713173991006208,
            "groupID":1155,
            "template":"尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请抱怨1。",
            "auditStatus":2,
            "createBy":"贾志",
            "modifyBy":"贾志"
        },
        {
            "itemID":852009824290938880,
            "groupID":1155,
            "template":"尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨2。",
            "auditStatus":2,
            "createBy":"贾志",
            "modifyBy":"贾志"
        },
        {
            "itemID":852010264277622784,
            "groupID":1155,
            "template":"尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨3。",
            "auditStatus":2,
            "createBy":"贾志",
            "modifyBy":"贾志"
        },
        {
            "itemID":852010264277622784,
            "groupID":1155,
            "template":"尊敬的[先生/女士]，您的[卡名称][卡名称]有异动，请发骚抱怨4。",
            "auditStatus":2,
            "createBy":"贾志",
            "modifyBy":"贾志"
        },*/
    ],
    messageTemplateListLoading: false,
});

export function messageTemplateState(state = initialState, action) {
    switch (action.type) {
        case GET_SMS_TEMPLATE_LIST_START:
            return state.set('messageTemplateListLoading', true);
        case GET_SMS_TEMPLATE_LIST_FAIL:
            return state.set('messageTemplateListLoading', false);
        case GET_SMS_TEMPLATE_LIST_SUCCESS:
            return state.set('messageTemplateListLoading', false)
                        .set('messageTemplateList', Immutable.fromJS(action.payload.list));
        default:
            return state
    }
}
