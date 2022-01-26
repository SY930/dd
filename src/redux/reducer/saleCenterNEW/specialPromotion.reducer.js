import Immutable from "immutable";
import Moment from "moment";

import {
    SALE_CENTER_ADD_SPECIAL_PROMOTION_START,
    SALE_CENTER_ADD_SPECIAL_PROMOTION_OK,
    SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL,
    SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT,
    SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_CANCEL,
    SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO,
    SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO,
    SALE_CENTER_SET_SPECIAL_PROMOTION_RECOMMEND_SETTINGS_INFO,
    SALE_CENTER_CHECK_BIRTHDAY_SUCCESS,
    SALE_CENTER_GET_EXCLUDE_CARDLEVELIDS,
    SALE_CENTER_QUERY_SMS_SIGN_SUCCESS,
    SALE_CENTER_RESET_SPECIAL_PROMOTION,
    SALE_CENTER_FSM_SETTLE_UNIT,
    SALE_CENTER_GET_EXCLUDE_EVENT_LIST,
    SALE_CENTER_FSM_EQUITY_UNIT,
    SALE_CENTER_GET_EXCLUDE_CARD_TYPE_AND_SHOP,
    SALE_CENTER_SAVE_CURRENT_CAN_USE_SHOP,
    SALE_CENTER_QUERY_ONLINE_RESTAURANT_SHOPS_STATUS,
    SALE_CENTER_QUERY_GROUP_CRM_CUSTOMER_AMOUNT,
    SALE_CENTER_CARDGROUPID,
    SALE_CENTER_QUERY_GROUP_CRM_RFM,
    SALE_CENTER_GET_AUTH_DATA,
    SALE_CENTER_SELFDEFINE,
    SALE_CENTER_JUMP_OPEN_CARD,
    SALE_CENTER_JUMP_SEND_GIFT,
} from "../../actions/saleCenterNEW/specialPromotion.action";

const $initialState = Immutable.fromJS({
    $eventInfo: {
        giftAdvanceDays: "", // 提前天数
        eventRemark: "", // 描述
        smsGate: "", // 是否发送短信
        settleUnitID: "", // 结算主体id(旧活动)
        accountNo: "", // 权益账户id(新活动)
        smsTemplate: "", // 短信内容
        eventWay: "",
        eventName: "",
        eventStartDate: "",
        isVipBirthdayMonth: "0",
        eventEndDate: "",
        startTime: "",
        sourceWayLimit: "0",
        mpIDList: [],
        brands: [],
        excludeEventCardLevelIdModelList: [],
        excludeCardTypeIDs: [],
        excludeCardTypeShops: [],
        canUseShopIDs: [],
        allCardLevelCheck: false,
        accountInfoList: [], // 短信结算主体(旧结算体系, 为了兼容旧特色营销活动而存在)
        equityAccountInfoList: [], // 短信权益账户(新结算体系)
        getExcludeEventList: [], // 同时段已建立唤醒
        excludedDate: [], // 活动排除日期：excludedDate，格式为 yyyyMMdd，例：20181210
        validCycle: null, // 可选择每日、每周、每月，每一项的第一位表示周期类型w-周,m-月,第二位之后表示周期内值,如w1表示每周一,m2表示每周二，m1表示每月1号，当表示每日时该字段为null
    },
    isBenefitJumpOpenCard: false, // 从权益卡跳转过来交互开卡赠送的
    isBenefitJumpSendGift: false, // 从权益卡跳转过来交互群发礼品的
    $jumpUrlInfos: [],
    $giftInfo: [],
    $eventRecommendSettings: [],
    $eventRuleInfos: [],
    addStatus: {
        status: null,
        availableShopQueryStatus: "success", // 线上餐厅送礼专用, 表示限制店铺的查询情况
    },
    SMSSignList: [], // 短信签名列表
    RFMParams: null, // 创建RFM需要的
    AuthLicenseData: {}, //产品授权信息
});

export const specialPromotion_NEW = ($$state = $initialState, action) => {
    switch (action.type) {
        case SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO:
            // 新短信模板上线后 需要把以前审核失败/待审核的活动在编辑时短信模板情况, 强制选择审核通过的短信模板
            if (
                action.payload.data &&
                (action.payload.data.status == 21 ||
                    action.payload.data.status == 5) &&
                action.payload.data.smsTemplate
            ) {
                action.payload.data.smsTemplate = "";
            }
            if (action.payload.data && action.payload.gifts) {
                // 旧reducer 靠gifts 字段判断是否是直接从server请求来的数据
                let giftInfo = action.payload.gifts;
                if (action.payload.data.eventWay === 68) {
                    const eventRuleInfos = action.payload.eventRuleInfos;
                    const rule1Data = eventRuleInfos.find((v) => v.rule === 1);
                    if (rule1Data && Array.isArray(rule1Data.gifts)) {
                        giftInfo = [...giftInfo, ...rule1Data.gifts];
                    }
                }
                debugger
                return $$state
                    .mergeIn(
                        ["$eventInfo"],
                        Immutable.fromJS({
                            ...action.payload.data
                        })
                    )
                    .mergeIn(["$giftInfo"], Immutable.fromJS(giftInfo))
                    .mergeIn(
                        ["$eventRecommendSettings"],
                        Immutable.fromJS(
                            action.payload.eventRecommendSettings || []
                        )
                    )
                    .mergeIn(
                        ["$eventRuleInfos"],
                        Immutable.fromJS(action.payload.eventRuleInfos || [])
                    );
            }
            if (action.payload.data && action.payload.jumpUrlInfos) {
                return $$state
                    .mergeIn(
                        ["$eventInfo"],
                        Immutable.fromJS({
                            ...action.payload.data
                        })
                    )
                    .mergeIn(
                        ["$jumpUrlInfos"],
                        Immutable.fromJS(action.payload.jumpUrlInfos)
                    );
            }
            return $$state.mergeIn(
                ["$eventInfo"],
                Immutable.fromJS(action.payload.data || action.payload)
            );

        case SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO:
            debugger
            return $$state.set("$giftInfo", Immutable.fromJS(action.payload));
        case SALE_CENTER_SET_SPECIAL_PROMOTION_RECOMMEND_SETTINGS_INFO:
            return $$state.set(
                "$eventRecommendSettings",
                Immutable.fromJS(action.payload)
            );

        case SALE_CENTER_ADD_SPECIAL_PROMOTION_START:
            return $$state.setIn(["addStatus", "status"], "pending");

        case SALE_CENTER_ADD_SPECIAL_PROMOTION_OK:
            if ($$state.getIn(["addStatus", "status"]) === "pending") {
                return $$state.setIn(["addStatus", "status"], "success");
            }
            return $$state;

        case SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT:
            return $$state.setIn(["addStatus", "status"], "timeout");

        case SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL:
            return $$state.setIn(["addStatus", "status"], "fail");

        case SALE_CENTER_QUERY_ONLINE_RESTAURANT_SHOPS_STATUS:
            return $$state.setIn(
                ["addStatus", "availableShopQueryStatus"],
                action.payload
            );

        case SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START:
            return $$state.setIn(["addStatus", "status"], "pending");

        case SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK:
            if ($$state.getIn(["addStatus", "status"]) === "pending") {
                return $$state.setIn(["addStatus", "status"], "success");
            }
            return $$state;

        case SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT:
            return $$state.setIn(["addStatus", "status"], "timeout");

        case SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL:
            return $$state.setIn(["addStatus", "status"], "fail");

        case SALE_CENTER_RESET_SPECIAL_PROMOTION:
            return $initialState;

        case SALE_CENTER_GET_EXCLUDE_CARDLEVELIDS:
            return $$state
                .setIn(
                    ["$eventInfo", "excludeEventCardLevelIdModelList"],
                    action.payload.excludeEventCardLevelIdModelList
                )
                .setIn(
                    ["$eventInfo", "allCardLevelCheck"],
                    action.payload.allCardLevelCheck
                );
        case SALE_CENTER_GET_EXCLUDE_CARD_TYPE_AND_SHOP:
            return $$state
                .setIn(
                    ["$eventInfo", "excludeCardTypeIDs"],
                    Immutable.fromJS(action.payload.excludeCardTypeIDs)
                )
                .setIn(
                    ["$eventInfo", "excludeCardTypeShops"],
                    Immutable.fromJS(action.payload.excludeCardTypeShops)
                );
        case SALE_CENTER_SAVE_CURRENT_CAN_USE_SHOP:
            return $$state.setIn(
                ["$eventInfo", "canUseShopIDs"],
                Immutable.fromJS(action.payload)
            );

        case SALE_CENTER_FSM_SETTLE_UNIT:
            return $$state.setIn(
                ["$eventInfo", "accountInfoList"],
                action.payload
            );

        case SALE_CENTER_FSM_EQUITY_UNIT:
            return $$state.setIn(
                ["$eventInfo", "equityAccountInfoList"],
                Immutable.fromJS(action.payload)
            );
        case SALE_CENTER_QUERY_SMS_SIGN_SUCCESS:
            return $$state.setIn(
                ["SMSSignList"],
                Immutable.fromJS(action.payload)
            );

        case SALE_CENTER_GET_EXCLUDE_EVENT_LIST:
            return $$state.setIn(
                ["$eventInfo", "getExcludeEventList"],
                action.payload.excludeEventModelList
            );
        case SALE_CENTER_QUERY_GROUP_CRM_CUSTOMER_AMOUNT:
            return $$state.setIn(
                ["customerCount"],
                action.payload.customerCount
            );
        case SALE_CENTER_CARDGROUPID:
            if (action.payload) {
                return $$state.setIn(
                    ["$eventInfo", "groupMemberID"],
                    Immutable.fromJS(action.payload)
                );
            };
        case SALE_CENTER_SELFDEFINE:
            return $$state.setIn(
                ["$eventInfo"],
                Immutable.fromJS(action.payload)
            );
        case SALE_CENTER_JUMP_OPEN_CARD:
            return $$state.setIn(
                ["isBenefitJumpOpenCard"],
                Immutable.fromJS(action.payload)
            );
        case SALE_CENTER_JUMP_SEND_GIFT:
            return $$state.setIn(
                ["isBenefitJumpSendGift"],
                Immutable.fromJS(action.payload)
            );
        case SALE_CENTER_QUERY_GROUP_CRM_RFM:
            if (action.payload) {
                return $$state.setIn(["RFMParams"], action.payload);
            }
            case SALE_CENTER_GET_AUTH_DATA:
                return $$state.setIn(["AuthLicenseData"], action.payload.AuthLicenseData);
            default:
                return $$state;
    }
};
