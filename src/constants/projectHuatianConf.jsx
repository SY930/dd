import { getStore } from '@hualala/platform-base'
import GiftCfg from "./Gift";

// 测试环境 3个集团id 11583      11581 11580

/** 华天集团groupID */
const HUATIAN_GROUP_ID_TEST = HUALALA.ENVIRONMENT === 'production-release' ? '194247' : '11583';
/** 庆丰集团groupID */
const QINGFENG_GROUP_ID_TEST = HUALALA.ENVIRONMENT === 'production-release' ? '7001' : '11581';
/** 护国寺小吃集团groupID */
const HUGUOSI_GROUP_ID_TEST = HUALALA.ENVIRONMENT === 'production-release' ? '137722' : '11580';

/** 华天项目正式上线后的主集团ID和子集团ID */
const HUATIAN_GROUP_ID_ONLINE = '206817';
const HUATIAN_SUBGROUP_ID_ONLINE = '212252';

const getAccountInfo = () => {
    return { groupID: getStore().getState().user.getIn(['accountInfo', 'groupID']) }
}

export function getHuaTianDisabledGifts() {
    return GiftCfg.giftType.filter(gift => gift.category === 'primary' && gift.value != 10).map(gift => gift.value)
}

// 华天主集团id list: 1个测试 1个线上
const HUATIAN_MAIN_GROUP_LIST = [
    HUATIAN_GROUP_ID_TEST,
    HUATIAN_GROUP_ID_ONLINE
]

// 华天子集团(品牌)id list: 2个测试 1个线上
const HUATIAN_BRAND_LIST = [
    QINGFENG_GROUP_ID_TEST,
    HUGUOSI_GROUP_ID_TEST,
    HUATIAN_SUBGROUP_ID_ONLINE,
    '218707',
    '218712',
    '12707',
    '218692',
    '214962',
    '4819',
    '146392',
    '207137',
    '162502',
    '130332',
    '218397',
    '219017',
];

// 华天所有'集团'(不分主 从)id list: 3个测试 2个线上
const HUATIAN_GROUP_LIST = [
    ...HUATIAN_MAIN_GROUP_LIST,
    ...HUATIAN_BRAND_LIST,
];

export function isHuaTian(id = getAccountInfo().groupID) {
    if (!id) return false;
    return HUATIAN_MAIN_GROUP_LIST.includes(String(id));
}

export function isGroupOfHuaTianGroupList(id = getAccountInfo().groupID) {
    if (!id) return false;
    return HUATIAN_GROUP_LIST.includes(String(id));
}

export function isBrandOfHuaTianGroupList(id = getAccountInfo().groupID) {
    if (!id) return false;
    return HUATIAN_BRAND_LIST.includes(String(id));
}

export function isMine({ subGroupID }) {
    if (!isBrandOfHuaTianGroupList() && (Number(subGroupID || 0) === 0)) {
        return true;
    }
    return String(getAccountInfo().groupID) === String(subGroupID)

}

export const BASIC_PROMOTION_CREATE_DISABLED_TIP = '基础营销活动暂时无法创建, 详情请联系管理人员';
export const SPECIAL_PROMOTION_CREATE_DISABLED_TIP = '该活动暂时无法创建, 详情请联系管理人员';
export const FOOD_INVOLVED_GIFT_CREATE_DISABLED_TIP = '该券暂时无法创建, 详情请联系管理人员';
export const SMS_EDIT_DISABLED_TIP = '短信模板暂时无法编辑, 详情请联系管理人员';
export const GIFT_CREATE_DISABLED_TIP = '该礼品暂时无法创建, 详情请联系管理人员';
