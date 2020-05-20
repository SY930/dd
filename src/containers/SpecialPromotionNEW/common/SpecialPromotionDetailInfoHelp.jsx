import { axiosData } from '../../../helpers/util';

/**
 *  校验至少选择一个礼品
 *
 * @param {string} key
 * @param {number} ruleType
 * @param {number} roleType
 * @returns
 */
const checkChoose =  function (key,ruleType,roleType) {
    // 每个角色至少选择一个礼物
    const ruleTypeNum = Number(ruleType);
    const roleTypeNum = Number(roleType)
    const { checkBoxStatus } = this.state
    // console.log('this',this.state.checkBoxStatus,key,ruleType,roleType)
    const giftList1Key = ['giveCash','giveCoupon','giveIntegral']
    const giftList2Key = ['giveCoupon','giveIntegral']
    const giftList3Key = ['giveCard','giveIntegral','giveCash']
    console.log('checkChoosethis---',this)
    let giftList = giftList1Key
    if(
        (ruleTypeNum === 1 && roleTypeNum === 1) ||
        (ruleTypeNum === 1 && roleTypeNum === 2)
        ) {

        const chooseList =   giftList.filter(v => {
            return checkBoxStatus[`ruleType${ruleType}`][`${v}${roleType}`]
        })
        return chooseList.length
    } else if(
        (ruleTypeNum === 999)
    ) {
        giftList = giftList2Key
        const chooseList =   giftList.filter(v => {
            return checkBoxStatus[`ruleType${ruleType}`][`${v}${roleType}`]
        })
        return chooseList.length
    } else  {
        giftList = giftList3Key
        const chooseList =   giftList.filter(v => {
            return checkBoxStatus[`ruleType${ruleType}`][`${v}${roleType}`]
        })
        return chooseList.length
    }

    return true
}

/**
 * 获取现金红包列表
 *
 */
const queryRedPackets = function () {
    axiosData(
        '/coupon/couponService_getBoards.ajax',
        { giftType: '113', pageNo: 1, pageSize: 10000 },
        null,
        {path: 'data.crmGiftList',},
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((records) => {
        this.setState({
            redPackets: records || []
        })
    });
}

const handleCashChange = function (key) {
    return function (e) {
        this.setState({
            cashGiftVal: e
        })
    }
}


export {
    checkChoose,
    queryRedPackets,
    handleCashChange
}

export default {
    checkChoose,
    queryRedPackets,
    handleCashChange
}
