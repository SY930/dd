import { axios } from "@hualala/platform-base";

const service = [
    "HTTP_SERVICE_URL_CRM",
    "HTTP_SERVICE_URL_PROMOTION_NEW",
    "HTTP_SERVICE_URL_ORIGIN",
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
    }, // 获取礼品名称列表
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
