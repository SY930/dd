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

//  微信支付商家券，返回的礼品数据

// {
//     "appID": "wx8cd84104f7d47ce5",
//     "trdChannelID": "50",
//     "mpID": "9cYF3yQ18U65594e",
//     "type": "DATE_TYPE_FIX_TERM", // 固定有效期   DATE_TYPE_FIX_TERM 为相对有效期 DATE_TYPE_FIX_TIME_RANGE 为固定有效期
//     "validateWay": "OFF_LINE",
//     "maxCanRecvCount": 100,
//     "merchantInfo": {
//       "merchantID": "1356079902",
//       "settleId": 100146,
//       "masterMerchantID": "1354215702"
//     },
//     "maxAmount": "10000",
//     "fixedBeginTerm": "0", // 相对有效期 何时生效
//     "fixedTerm": 30 // 相对有效期 有效天数
//  beginTimestamp 固定有效期 开始时间
//  endTimestamp 固定有效期 结束时间
//   }
