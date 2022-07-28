// 获取分销提现记录详情列表
async function httpGetWithdrawDetailList(params) {
    const method = '/coupon/couponService_getSortedCouponBoardList.ajax';
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj
    }
    message.error(msg);
    return [];
}

// 获取提现记录列表
async function httpGetWithdrawRecordList(params) {
    const method = '/coupon/couponService_getSortedCouponBoardList.ajax';
    const params = { service, type, data, method };
    const response = await axios.post(url + method, params);
    const { code, message: msg, data: obj } = response;
    if (code === '000') {
        return obj
    }
    message.error(msg);
    return [];
}

export {
    httpGetWithdrawDetailList,
    httpGetWithdrawRecordList,
}