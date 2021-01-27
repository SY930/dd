import { axios } from '@hualala/platform-base';
import { fetchData } from '../../helpers/util'

const service = [
    'HTTP_SERVICE_URL_CRM',
    'HTTP_SERVICE_URL_PROMOTION_NEW',
    'HTTP_SERVICE_URL_ORIGIN', // 这个是个坑，platform配置的域名少了，vip域名用不了
    'HTTP_SERVICE_URL_WECHAT',
];

const apis = {
    couponService_getSortedCouponBoardList: {
        path: '/coupon/couponService_getSortedCouponBoardList.ajax',
        service: service[1],
    }, // 获取礼品名称列表
    couponService_getBoards: {
        path: '/coupon/couponService_getBoards.ajax',
        service: service[1],
    }, // 获取礼品名称列表
    addEvent_NEW: {
        path: '/api/specialPromotion/addEvent_NEW',
        service: 'origin',
    }, // 保存活动
    queryEventDetail_NEW: {
        path: '/api/specialPromotion/queryEventDetail_NEW',
        service: 'origin',
    }, // 获取活动详情
    getApps: {
        path: '/miniProgramCodeManage/getApps',
        service: service[3],
    }, // 获取小程序列表
    getExcludeEventList: {
        path: '/specialPromotion/getExcludeEventList.ajax',
        service: service[1], // 判断时间段内是否有活动
    },
    updateEvent_NEW: {
        path: '/api/specialPromotion/updateEvent_NEW',
        service: 'origin',
    },
    getAuthLicenseData: {
        path: '/crm/crmAuthLicenseService.queryCrmPluginLicenses.ajax',
        service: service[0],
    },
    /**
     * 哗管家-流失唤醒
     */
    // 查询详情
    getEventRuleDetail: {
        path: '/eventRule/getDetail.ajax',
        service: service[1],
    },
    // 新增
    addEventRule: {
        path: '/eventRule/add.ajax',
        service: service[1],
    },
    // 编辑
    updateEventRule: {
        path: '/eventRule/update.ajax',
        service: service[1],
    },
    // 启用禁用
    switchEventRuleActive: {
        path: '/eventRule/switchActive.ajax',
        service: service[1],
    },
    // 智能发券
    // 查询详情
    getGiftRuleDetail: {
        path: '/giftRule/queryIntelligentGiftRule.ajax',
        service: service[1],
    },
    // 新增
    addGiftRule: {
        path: '/giftRule/addIntelligentGiftRule.ajax',
        service: service[1],
    },
    // 编辑
    updateGiftRule: {
        path: '/giftRule/updateIntelligentGiftRule.ajax',
        service: service[1],
    },
    // 启用禁用
    switchGiftRuleActive: {
        path: '/giftRule/updateIntelligentGiftRuleStatus.ajax',
        service: service[1],
    },
};

function gen(api) {
    // eslint-disable-next-line func-names
    return function (data) {
        if (api.service === 'origin') { // 新增此类型api，需要配置helpers下的callserver
            return fetchData(api.path, data, null, { path: null }, { needErrorData: true })
        }
        return axios.post(`/api/v1/universal?${api.path}`, {
            service: api.service,
            type: api.type || 'post',
            data,
            method: api.path,
        });
    };
}

const APIFunction = {};
for (const key in apis) {
    APIFunction[key] = gen(apis[key]);
}

export default APIFunction;
