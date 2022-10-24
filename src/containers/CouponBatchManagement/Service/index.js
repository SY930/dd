
import { axiosData } from '../../../helpers/util';


// 列表查询
export const couponList = (opts) => {
    return axiosData(
        '/giftBatch/getCouponBatchs.ajax',
        { ...opts },
        null,
        {
            path: 'data',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((data) => {
        return data
    }).catch((e) => {
        return e
    })
};


// 审核
export const applyAuditCouponBatch = (params) => {
    return axiosData(
        '/giftBatch/applyAuditCouponBatch.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((res) => {
        return res
    }).catch((e) => {
        return e
    })
};


// 停用
export const deactivateCouponBatch = (params) => {
    return axiosData(
        '/giftBatch/deactivateCouponBatch.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((res) => {
        return res
    }).catch((e) => {
        return e
    })
};


// 推送
export const pushCouponBatch = (params) => {
    return axiosData(
        '/gift/deactivateCouponBatch.ajax',
        { ...params },
        null,
        {
            path: 'data',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((res) => {
        return res
    }).catch((e) => {
        return e
    })
};


// 导出
export const exportCoupon = (params) => {
    return axiosData(
        '/couponBatchExport/getRecords',
        { ...params },
        null,
        {
            path: 'data',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((res) => {
        return res
    }).catch((e) => {
        return e
    })
};


// 添加券批次
export const addCouponBatch = (params) => {
    return axiosData(
        '/giftBatch/addCouponBatch.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((res) => {
        return res
    }).catch((e) => {
        return e
    })
};


// 编辑券批次
export const updateGiftBatch = (params) => {
    return axiosData(
        '/giftBatch/updateGiftBatch.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((res) => {
        return res
    }).catch((e) => {
        return e
    })
};


// 合同编号下拉框数据组装
export const conTractList = (opts) => {
    return axiosData(
        '/contract/contractService_getContracts.ajax',
        { ...opts },
        null,
        {
            path: 'data',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((data) => {
        return data
    }).catch((e) => {
        return e
    })
};


// 券批次名称下拉框搜索
export const getBoardsByGiftName = (opts) => {
    return axiosData(
        '/coupon/couponService_getBoardsByGiftName.ajax',
        { ...opts },
        null,
        {
            path: 'data',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((data) => {
        return data
    }).catch((e) => {
        return e
    })
};

