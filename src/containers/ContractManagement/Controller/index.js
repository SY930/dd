
import * as services from '../Service'


const DATE_FORMAT = 'YYYYMMDD';
const END_DATE_FORMAT = 'YYYYMMDD';


// 查询表格
export const queryList = async (params) => {
    const res = await services.conTractList(params)
    return res
}


// 新建合同
export const addContract = async (values) => {
    const { giftValidRange = [] } = values;
    const params = {
        ...values,
        startDateTime: giftValidRange[0] ? giftValidRange[0].format(DATE_FORMAT) : '',
        endDateTime: giftValidRange[1] ? giftValidRange[1].format(END_DATE_FORMAT) : '',
    };


    delete params.giftValidRange
    const res = await services.addContract(params)
    return res
}


// 删除合同
export const removeContracts = async (params) => {
    const res = await services.removeContracts(params)
    return res
}


// 导出合同
export const contractExport = async (params) => {
    const newparams = { ...params }
    delete newparams.pageNo
    delete newparams.pageSize
    const res = await services.contractExport(newparams)
    return res
}

// 导出历史导出合同
export const contractExportGetRecords = async (params) => {
    const res = await services.contractExportGetRecords(params)
    return res
}

// 删除历史导出合同
export const contractExportDelete = async (params) => {
    const res = await services.contractExportDelete(params)
    return res
}

