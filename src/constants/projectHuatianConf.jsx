import {getAccountInfo} from "../helpers/util";
import GiftCfg from "./Gift";

// 测试环境 3个集团id 11583      11581 11580

/** 华天集团groupID */
export const HUATIAN_GROUP_ID = HUALALA.ENVIRONMENT === 'production-release' ? '-1' : '1155';
/** 庆丰集团groupID */
export const QINGFENG_GROUP_ID = HUALALA.ENVIRONMENT === 'production-release' ? '-1' : '1155';
/** 护国寺小吃集团groupID */
export const HUGUOSI_GROUP_ID = HUALALA.ENVIRONMENT === 'production-release' ? '-1' : '10890';



export function getHuaTianDisabledGifts() {
    return GiftCfg.giftType.filter(gift => gift.category === 'primary').map(gift => gift.value)
}

export const HUATIAN_GROUP_LIST = [
    HUATIAN_GROUP_ID,
    QINGFENG_GROUP_ID,
    HUGUOSI_GROUP_ID,
];

export const HUATIAN_BRAND_LIST = [
    QINGFENG_GROUP_ID,
    HUGUOSI_GROUP_ID,
];

export function isHuaTian(id = getAccountInfo().groupID) {
    if (!id) return false;
    return HUATIAN_GROUP_ID === String(id);
}

export function isGroupOfHuaTianGroupList(id = getAccountInfo().groupID) {
    if (!id) return false;
    return HUATIAN_GROUP_LIST.includes(String(id));
}

export function isBrandOfHuaTianGroupList(id = getAccountInfo().groupID) {
    if (!id) return false;
    return HUATIAN_BRAND_LIST.includes(String(id));
}

export function isMine({ subGroupId }) {
    return String(getAccountInfo().groupID) === String(subGroupId)

}

export const BASIC_PROMOTION_CREATE_DISABLED_TIP = '基础营销活动暂时无法创建, 详情请联系管理人员';
export const SPECIAL_PROMOTION_CREATE_DISABLED_TIP = '唤醒活动暂时无法创建, 详情请联系管理人员';
export const FOOD_INVOLVED_GIFT_CREATE_DISABLED_TIP = '该券暂时无法创建, 详情请联系管理人员';
export const SMS_EDIT_DISABLED_TIP = '短信模板暂时无法编辑, 详情请联系管理人员';
export const GIFT_CREATE_DISABLED_TIP = '该礼品暂时无法创建, 详情请联系管理人员';
