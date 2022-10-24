
import { axiosData } from '../../../helpers/util';

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


// 创建合同编号
export const addContract = (params) => {
    return axiosData(
        '/contract/contractService_addContract.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((data) => {
        return data
    }).catch((e) => {
        return e
    })
};


// 删除合同编号
export const removeContracts = (params) => {
    return axiosData(
        '/contract/contractService_removeContract.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((data) => {
        return data
    }).catch((e) => {
        return e
    })
};

// 导出合同
export const contractExport = (params) => {
    return axiosData(
        '/crm/contractExport/export.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_CRM',
    ).then((data) => {
        return data
    }).catch((e) => {
        return e
    })
};

// 查询合同列表
export const contractExportGetRecords = (params) => {
    return axiosData(
        '/crm/contractExport/getRecords.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_CRM',
    ).then((data) => {
        return data
    }).catch((e) => {
        return e
    })
};


// 删除导出合同
export const contractExportDelete = (params) => {
    return axiosData(
        '/crm/contractExport/delete.ajax',
        { ...params },
        null,
        {
            path: '',
        },
        'HTTP_SERVICE_URL_CRM',
    ).then((data) => {
        return data
    }).catch((e) => {
        return e
    })
};

