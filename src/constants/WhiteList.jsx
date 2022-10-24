import { getStore } from '@hualala/platform-base'

const getAccountInfo = () => {
    return { 
        groupID: getStore().getState().user.getIn(['accountInfo', 'groupID']),
        roleType: getStore().getState().user.getIn(['accountInfo', 'roleType'])
    }
}

export const zhouheiyaGroupID = ['11157', '341014', '296030', '316488','267440', '344602', '98072']; // 周黑鸭集团ID:344602
export const isCheckApproval = true
export const zhouheiyaPromotiontype = ['1060', '1070', '2020', '2010', '1030', '1050', '2050', '3010'];
export const businessTypesList = [
    {
        biz: 'ris',
        bizName: '零售',
        isDefault: true,
    },
    // {
    //     biz: 'food',
    //     bizName: '餐饮',
    // }
]
// 是否周黑鸭集团
export function isZhouheiya(groupID = getAccountInfo().groupID) {
    if (!groupID) return false;
    return zhouheiyaGroupID.includes(String(groupID));
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
