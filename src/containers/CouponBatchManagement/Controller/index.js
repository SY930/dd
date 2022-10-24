
import * as services from '../Service'


const DATE_FORMAT = 'YYYYMMDD';
const END_DATE_FORMAT = 'YYYYMMDD';

// 查询表格
export const queryList = async (params, tabkey) => {
    const newParams = { ...params }
    if (tabkey === '2') {
        newParams.action = '2'
    }

    if (newParams.giftItemIds) {
        newParams.giftItemIds = [newParams.giftItemIds]
    }

    const res = await services.couponList(newParams)
    return res
}


// 添加券批次
export const addCouponBatch = async (values, treeData) => {
    const { giftValidRange = [], giftItemID, activityCost, estimatedSales, singlePrice } = values;

    const params = {
        ...values,
        giftItemID: giftItemID.split('_')[0],
        effectTime: giftValidRange[0] ? giftValidRange[0].format(DATE_FORMAT) : '',
        validUntilDate: giftValidRange[1] ? giftValidRange[1].format(END_DATE_FORMAT) : '',
        totalNum: values.stock.number,
        giftType: giftItemID.split('_')[1],
        activityCost: +activityCost.number,
        estimatedSales: +estimatedSales.number,
        singlePrice: +singlePrice.number,
    };

    delete params.stock
    delete params.giftValidRange

    const res = await services.addCouponBatch(params)
    return res
}

// 编辑券批次
export const updateGiftBatch = async (values, record) => {
    const { giftValidRange = [], giftItemID, activityCost, estimatedSales, singlePrice } = values;


    const params = {
        ...values,
        giftItemID: giftItemID.split('_')[0],
        effectTime: giftValidRange[0] ? giftValidRange[0].format(DATE_FORMAT) : '',
        validUntilDate: giftValidRange[1] ? giftValidRange[1].format(END_DATE_FORMAT) : '',
        totalNum: values.stock.number,
        giftType: giftItemID.split('_')[1],
        itemID: record.itemID,
        activityCost: +activityCost.number,
        estimatedSales: +estimatedSales.number,
        singlePrice: +singlePrice.number,
    };

    delete params.stock
    delete params.giftValidRange

    const res = await services.updateGiftBatch(params)
    return res
}


// 停用
export const deactivate = async (params) => {
    const res = await services.deactivateCouponBatch({ itemID: params.itemID })
    return res
}


// 审核
export const audit = async (params) => {
    const paramss = {
        activityCost: params.activityCost,
        singlePrice: params.singlePrice,
        estimatedSales: params.estimatedSales,
        discountRate: params.discountRate,
        contractCode: params.contractCode,
        itemID: params.itemID,

    }
    const res = await services.applyAuditCouponBatch(paramss)
    return res
}


// 推送
export const pushCoupon = async (params) => {
    const res = await services.pushCouponBatch(params)
    const { data } = res

    return data
}


// 导出
export const exportCoupon = async (params) => {
    const res = await services.exportCoupon(params)
    const { data } = res

    return data
}


// 查询合同
export const queryConTractList = async (params) => {
    const res = await services.conTractList(params)
    return res
}


// 券批次名称下拉框搜索

export const getBoardsByGiftName = async (params) => {
    const res = await services.getBoardsByGiftName({ giftName: params })
    return res
}
