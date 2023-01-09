
import { getStore } from '@hualala/platform-base'
import { isFoodMenuID, isRetailMenuID } from 'helpers/util';

const getAccountInfo = () => {
    const promotionBasicInfo = getStore().getState().sale_promotionBasicInfo_NEW;
    return { 
        groupID: getStore().getState().user.getIn(['accountInfo', 'groupID']),
        roleType: getStore().getState().user.getIn(['accountInfo', 'roleType']),
        promotionVersion: promotionBasicInfo ? promotionBasicInfo.getIn(['$basicInfo', 'promotionVersion']) : '',
    }
}

export const zhouheiyaGroupID = ['11009', '341014', '296030', '316488','267440', '344602', '267579', '317528',
//  '11280', //lianxujian(本地调试)
]; // 周黑鸭集团ID:344602  魏家：98072   周黑鸭测试集团：259613  魏家测试集团：11009  零售项目测试集团：267579  魏家正式集团ID：'317528'
export const needApprovalGroupID = ['341014', '296030', '316488','267440', '344602'];
export const isCheckApproval = needApprovalGroupID.includes(String(getAccountInfo().groupID));

export const zhouheiyaPromotiontype = ['1060', '1070', '2020', '2010', '1030', '1050', '2050', '3010'];
export const zhouheiyaMarketingtype = ['69', '88', '89', '90'];

export const WJLPGroupID = ['259613', '317528', '11157'] // 针对魏家凉皮 促销活动管理列表 表头顺序 259613测试集团，线上待定

export const SellGroupID = ['259613', '317528', '11157'] // 零售集团ID

export const priceRulsGroupID = ['259250', '49367', '11157', '189702']

export const businessTypesList = [
    {
        biz: 'ris',
        bizName: '零售',
        isDefault: true,
    },
    {
        biz: 'food',
        bizName: '餐饮',
    }
]
// 是否周黑鸭集团
export function isZhouheiya(groupID = getAccountInfo().groupID) {
    if (!groupID) return false;
    if (isFoodMenuID()) {
        return false;
    }
    return zhouheiyaGroupID.includes(String(groupID)) || isRetailMenuID() || getAccountInfo().promotionVersion === '2.0';
}

// 是否魏家集团
export function isWeijia(groupID = getAccountInfo().groupID) {
    if (!groupID) return false;
    return WJLPGroupID.includes(String(groupID));
}

// 促销列表零售商品筛选条件白名单
export function isSellGroupID(groupID = getAccountInfo().groupID) {
    if (!groupID) return false;
    return SellGroupID.includes(String(groupID));
}

// 是否是集团经理角色
export function isGeneral(roleType = getAccountInfo().roleType) {
    if (!roleType) return false;
    return roleType.split(',').includes('general');
}

//检查商品组件是否为空
export function checkGoodsScopeListIsNotEmpty(goodsScopeList) {
    if (!goodsScopeList || goodsScopeList.length == 0) {
        return false
    }
    if (goodsScopeList && goodsScopeList.length > 0) {
        goodsScopeList = goodsScopeList[0]
    }
    if (!goodsScopeList && !goodsScopeList.containData && !goodsScopeList.exclusiveData) {
        return false
    }

    if (!goodsScopeList.containData.goods) {
        goodsScopeList.containData.goods = []
    }

    if (!goodsScopeList.containData.category) {
        goodsScopeList.containData.category = []
    }

    if (!goodsScopeList.exclusiveData.goods) {
        goodsScopeList.exclusiveData.goods = []
    }

    if (!goodsScopeList.exclusiveData.category) {
        goodsScopeList.exclusiveData.category = []
    }

    let flag = true
    if (goodsScopeList.containData.goods.length == 0 && goodsScopeList.containData.category.length == 0 && goodsScopeList.exclusiveData.goods.length == 0 && goodsScopeList.exclusiveData.category.length == 0) {
        flag = false
    }
    return flag
}

// TODO: 增加线上ID——————————————
export const RetailMenuID = ['2001431']; // 零售促销活动menuID


export const FoodMenuID = ['2000450', '4140']; // 餐饮促销活动menuID 