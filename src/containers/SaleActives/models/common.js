import React from "react";
import { message } from "antd";
import _ from "lodash";
import api from "../api";
import { FMColorList, RList, RFMColorList } from "../constant";
import { giftTypeName, imgUrl } from "../constant";
import moment from "moment";
const format = "YYYYMMDD";
// http://res.hualala.com/basicdoc/21723174-846a-42c9-9381-92106967d82a.png
const {
    couponService_getSortedCouponBoardList,
    couponService_getBoards,
    addEvent_NEW,
    getApps,
} = api;
const initState = {
    groupID: "",
    type: "",
    descModalIsShow: false,
    isStepContinue: false,
    formData: {
        mySendGift: {
            effectType: "1", // 生效方式
            giftEffectTimeHours: "-1", // 生效时间
            giftValidUntilDayCount: "", // 有效天数
            effectTime: null, // 固定有效期，生效时间
            validUntilDate: null, // 固定有效期失效时间
            rangeDate: [],
        },
        merchantLogoUrl: "/basicdoc/21723174-846a-42c9-9381-92106967d82a.png",
        originalImageUrl: "/basicdoc/ea1e4255-32fb-4bed-baa2-37b655e52eb8.png",
        afterPayJumpType: "3",
    }, // 表单内的值,
    currentStep: 0,
    giftForm: null, // 礼品的form对象
    wxNickNameList: [], // 微信小程序列表
    crmGiftTypes: [], // 礼品数据
    giftValue: "", // 礼品价值
};
export default {
    namespace: "createActiveCom",
    state: _.cloneDeep(initState),
    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
    effects: {
        *clearData({ payload }, { call, put }) {
            yield put({
                type: "updateState",
                payload: {
                    ..._.cloneDeep(initState),
                },
            });
        },
        *couponService_getSortedCouponBoardList(
            { payload },
            { call, put, select }
        ) {
            const ret = yield call(couponService_getSortedCouponBoardList, {
                trdChannelID: 50,
            });

            if (ret.code === "000") {
                const { crmGiftTypes = [] } = ret.data;
                yield put({
                    type: "updateState",
                    payload: {
                        crmGiftTypes: proGiftTreeData(crmGiftTypes),
                    },
                });
                return proGiftTreeData(crmGiftTypes);
            } else {
                message.warn(ret.message);
            }
        },
        *couponService_getBoards({ payload }, { call, put, select }) {
            const { groupID, formData } = yield select(
                (state) => state.createActiveCom
            );
            const ret = yield call(couponService_getBoards, {
                giftItemID: payload.giftItemID,
                groupID,
            });

            if (ret.code === "000") {
                const { crmGiftList } = ret.data;
                const data =
                    crmGiftList && crmGiftList[0] ? crmGiftList[0] : {};
                const { trdTemplateInfo, giftValue } = data;
                let trdData = {};
                try {
                    trdData = JSON.parse(trdTemplateInfo);
                } catch (error) {}

                const {
                    type,
                    fixedBeginTerm,
                    fixedTerm,
                    beginTimestamp,
                    endTimestamp,
                } = trdData;
                let mySendGift = {};
                if (type === "DATE_TYPE_FIX_TERM") {
                    mySendGift = {
                        effectType: "1",
                        giftEffectTimeHours: String(fixedBeginTerm),
                        giftValidUntilDayCount: fixedTerm,
                    };
                } else if (type === "DATE_TYPE_FIX_TIME_RANGE") {
                    mySendGift = {
                        effectType: "2",
                        effectTime: beginTimestamp,
                        validUntilDate: endTimestamp,
                        rangeDate: [
                            moment.unix(beginTimestamp),
                            moment.unix(endTimestamp),
                        ],
                    };
                }
                formData.mySendGift = mySendGift;
                yield put({
                    type: "updateState",
                    payload: {
                        formData: { ...formData },
                        giftValue,
                    },
                });
                return mySendGift;
            } else {
                message.warn(ret.message);
            }
        },
        *addEvent_NEW({ payload }, { call, put, select }) {
            const { groupID, formData } = yield select(
                (state) => state.createActiveCom
            );
            const {
                eventName,
                merchantLogoUrl,
                eventRemark,
                consumeTotalAmount,
                backgroundColor,
                afterPayJumpType,
                // 小程序名称
                eventDate,
                mySendGift,
                originalImageUrl,
            } = formData;
            const {
                giftID,
                giftCount,
                eventType,
                giftEffectTimeHours,
                giftValidUntilDayCount,
                rangeDate,
            } = mySendGift;
            const event = {
                eventName,
                merchantLogoName: merchantLogoUrl
                    ? merchantLogoUrl.fileName
                    : "hualala.png",
                merchantLogoUrl: merchantLogoUrl
                    ? imgUrl + merchantLogoUrl.url
                    : "http://res.hualala.com/basicdoc/21723174-846a-42c9-9381-92106967d82a.png",
                eventRemark,
                consumeTotalAmount:
                    consumeTotalAmount && consumeTotalAmount.number,
                backgroundColor,
                afterPayJumpType,
                eventStartDate:
                    eventDate &&
                    eventDate[0] &&
                    moment(eventDate[0]).format(format),
                eventEndDate:
                    eventDate &&
                    eventDate[1] &&
                    moment(eventDate[1]).format(format),
                groupID,
            };

            const gifts = [
                {
                    giftID,
                    giftCount,
                    eventType,
                    countType: "1",
                    giftEffectTimeHours,
                    giftValidUntilDayCount,
                    effectTime:
                        rangeDate &&
                        rangeDate[0] &&
                        moment(rangeDate[0]).format(format),
                    validUntilDate:
                        rangeDate &&
                        rangeDate[1] &&
                        moment(rangeDate[1]).format(format),
                    originalImageName:
                        originalImageUrl && originalImageUrl.fileName,
                    originalImageUrl:
                        originalImageUrl && imgUrl + originalImageUrl.url,
                    presentType: 1,
                },
            ];
            const ret = yield call(addEvent_NEW, {
                // groupID,
                event,
                gifts,
            });

            if (ret.code === "000") {
                return true;
            } else {
                message.warn(ret.message);
                return false;
            }
        },
        *queryEventDetail_NEW({ payload }, { call, put, select }) {
            // {"itemID":"6850382801812851605","groupID":"11157"} 入参
            // const ret = yield call(couponService_getBoards, {
            //     itemID: payload.itemID,
            //     groupID,
            // });
            const ret = {
                code: "000",
                data: {
                    eventName: "测试支付有礼",
                    merchantLogoName: "22222.png",
                    merchantLogoUrl:
                        "http://res.hualala.com/basicdoc/42241a82-6029-4535-ba25-c81480ff97dc.png",
                    eventRemark: "支付有礼活动说明",
                    consumeTotalAmount: "11",
                    backgroundColor: "#2B9F66",
                    afterPayJumpType: "3",
                    eventStartDate: "20200719",
                    eventEndDate: "20200724",
                },
                gifts: [
                    {
                        giftID: "6850738927616134037",
                        giftCount: "23",
                        countType: "1",
                        effectTime: "20200718",
                        validUntilDate: "20200725",
                        originalImageName: "333333333.png",
                        originalImageUrl:
                            "http://res.hualala.com/basicdoc/a7fd835b-d643-41c3-a182-2480e7956495.png",
                        presentType: 1,
                    },
                ],
            };
            if (ret.code === "000") {
                const { data, gifts } = ret;
                yield put({
                    type: "updateState",
                    payload: {
                        formData: {
                            ...data,
                            mySendGift: {
                                ...gifts[0],
                                rangeDate: [
                                    moment(gifts[0].effectTime),
                                    moment(gifts[0].validUntilDate),
                                ],
                            },
                            originalImageUrl: gifts[0].originalImageUrl,
                            eventDate: [
                                moment(data.eventStartDate),
                                moment(data.eventEndDate),
                            ],
                        },
                    },
                });
            } else {
                message.warn(ret.message);
            }
        },
        *getApps({ payload }, { call, put, select }) {
            const { groupID } = yield select((state) => state.createActiveCom);

            const ret = yield call(getApps, {
                groupID,
                page: {
                    current: 1,
                    pageSize: 10000000,
                },
            });

            if (ret.result && ret.result.code === "000") {
                if (Array.isArray(ret.apps)) {
                    ret.apps.forEach((v) => {
                        (v.label = v.nickName), (v.value = v.appID);
                    });
                    yield put({
                        type: "updateState",
                        payload: {
                            wxNickNameList: ret.apps,
                        },
                    });
                }
            } else {
                message.warn(ret.result.message);
            }
        },
    },
};

function proGiftTreeData(giftTypes) {
    const _giftTypes = _.filter(giftTypes, (giftItem) => {
        if (
            giftItem.giftType == 10 ||
            giftItem.giftType == 20 ||
            giftItem.giftType == 21 ||
            giftItem.giftType == 30 ||
            giftItem.giftType == 40 ||
            giftItem.giftType == 42 ||
            giftItem.giftType == 80 ||
            giftItem.giftType == 110 ||
            giftItem.giftType == 111 ||
            giftItem.giftType == 22
        )
            return true;
        return false;
    });
    let treeData = [];
    const gifts = [];
    _giftTypes.map((gt, idx) => {
        const giftTypeItem =
            _.find(giftTypeName, { value: String(gt.giftType) }) || {};
        treeData.push({
            label: giftTypeItem.label || "--",
            key: gt.giftType,
            children: [],
        });
        gt.crmGifts.map((gift) => {
            treeData[idx].children.push({
                label: gift.giftName,
                value: String(gift.giftItemID),
                key: gift.giftItemID,
                giftValue: gift.giftValue,
                giftType: gt.giftType,
            });
            gifts.push({
                label: gift.giftName,
                value: String(gift.giftItemID),
            });
        });
    });
    return (treeData = _.sortBy(treeData, "key"));
}

// {
//     "data": {
//         "event": {
//             "eventName": "测试支付有礼",
//             "merchantLogoName": "22222.png",
//             "merchantLogoUrl": "http://res.hualala.com/basicdoc/42241a82-6029-4535-ba25-c81480ff97dc.png",
//             "eventRemark": "支付有礼活动说明",
//             "consumeTotalAmount": "11",
//             "backgroundColor": "#2B9F66",
//             "afterPayJumpType": "3",
//             "eventStartDate": "20200719",
//             "eventEndDate": "20200724"
//         },
//         "gifts": [
//             {
//                 "giftID": "6850738927616134037",
//                 "giftCount": "23",
//                 "countType": "1",
//                 "effectTime": "20200718",
//                 "validUntilDate": "20200725",
//                 "originalImageName": "333333333.png",
//                 "originalImageUrl": "http://res.hualala.com/basicdoc/a7fd835b-d643-41c3-a182-2480e7956495.png",
//                 "presentType": 1
//             }
//         ]
//     }
// }
