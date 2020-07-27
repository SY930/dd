import { axios } from "@hualala/platform-base";

const service = [
    "HTTP_SERVICE_URL_CRM",
    "HTTP_SERVICE_URL_PROMOTION_NEW",
    "HTTP_SERVICE_URL_ORIGIN",
    "HTTP_SERVICE_URL_WECHAT",
];

const apis = {
    couponService_getSortedCouponBoardList: {
        path: "/coupon/couponService_getSortedCouponBoardList.ajax",
        service: service[1],
    }, // 获取礼品名称列表
    couponService_getBoards: {
        path: "/coupon/couponService_getBoards.ajax",
        service: service[1],
    }, // 获取礼品名称列表
    addEvent_NEW: {
        path: "/api/specialPromotion/addEvent_NEW",
        service: service[2],
    }, // 保存活动
    queryEventDetail_NEW: {
        path: "/api/specialPromotion/queryEventDetail_NEW",
        service: service[2],
    }, // 获取活动详情
    getApps: {
        path: "/miniProgramCodeManage/getApps",
        service: service[3],
    }, // 获取小程序列表
    getExcludeEventList: {
        path: "/specialPromotion/getExcludeEventList.ajax",
        service: service[1], // 判断时间段内是否有活动
    },
};

function gen(api) {
    // eslint-disable-next-line func-names
    return function (data) {
        return axios.post(`/api/v1/universal?${api.path}`, {
            service: api.service,
            type: api.type || "post",
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
