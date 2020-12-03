import React from 'react';
import { message } from 'antd';
import _ from 'lodash';
import api from '../api';
import {
    giftTypeName,
    imgUrl,
} from '../constant';

import moment from 'moment';

const format = 'YYYYMMDD';

const {
    couponService_getSortedCouponBoardList,
    couponService_getBoards,
    addEvent_NEW,
    getApps,
    queryEventDetail_NEW,
    getExcludeEventList,
    updateEvent_NEW,
} = api;

const initState = {
    groupID: '',
    type: '',
    descModalIsShow: false,
    isStepContinue: false,
    formData: {
        // 推荐有礼gift默认数据
        mySendGift: {
            effectType: '1', // 生效方式
            giftEffectTimeHours: '-1', // 生效时间
            giftValidUntilDayCount: '', // 有效天数
            effectTime: null, // 固定有效期，生效时间
            validUntilDate: null, // 固定有效期失效时间
            rangeDate: [],
        },
        merchantLogoUrl: 'basicdoc/21723174-846a-42c9-9381-92106967d82a.png',
        originalImageUrl: 'basicdoc/ea1e4255-32fb-4bed-baa2-37b655e52eb8.png',
        afterPayJumpType: '3',
        needCount: [], // 膨胀所需人数
        giftList: [], // 礼品信息
        giftGetRule: 0,
        gifts: [],
    }, // 表单内的值,
    currentStep: 0,
    giftForm: null, // 礼品的form对象
    wxNickNameList: [], // 微信小程序列表
    crmGiftTypes: [], // 礼品数据
    giftValue: '', // 礼品价值
    isView: false, // 页面状态
};
export default {
    namespace: 'createActiveCom',
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
        * clearData({ payload }, { call, put }) {
            yield put({
                type: 'updateState',
                payload: {
                    ..._.cloneDeep(initState),
                },
            });
        },
        * couponService_getSortedCouponBoardList(
            { payload },
            { call, put, select }
        ) {
            const ret = yield call(couponService_getSortedCouponBoardList, payload);

            if (ret.code === '000') {
                const { crmGiftTypes = [] } = ret.data;
                yield put({
                    type: 'updateState',
                    payload: {
                        crmGiftTypes: proGiftTreeData(crmGiftTypes),
                    },
                });
                return proGiftTreeData(crmGiftTypes);
            }
            message.warn(ret.message);
        },
        * couponService_getBoards({ payload }, { call, put, select }) {
            const { groupID, formData } = yield select(
                state => state.createActiveCom
            );
            const ret = yield call(couponService_getBoards, {
                giftItemID: payload.giftItemID,
                groupID,
            });

            if (ret.code === '000') {
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
                if (type === 'DATE_TYPE_FIX_TERM') {
                    mySendGift = {
                        ...formData.mySendGift,
                        effectType: '1',
                        giftEffectTimeHours: String(fixedBeginTerm),
                        giftValidUntilDayCount: fixedTerm,
                    };
                } else if (type === 'DATE_TYPE_FIX_TIME_RANGE') {
                    mySendGift = {
                        ...formData.mySendGift,
                        effectType: '2',
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
                    type: 'updateState',
                    payload: {
                        formData: { ...formData },
                        giftValue,
                    },
                });
                return mySendGift;
            }
            message.warn(ret.message);
        },
        * updateEvent_NEW({ payload }, { call, put, select }) {
            // 保存活动，参数在各自组件处理，通过payload传入
            const { groupID, itemID } = yield select(
                state => state.createActiveCom
            );
            const ret = yield call(updateEvent_NEW, {
                ...payload,
                event: {
                    ...payload.event,
                    groupID,
                    itemID,
                },

            });

            if (ret.code === '000') {
                return true;
            }

            return false;
        },
        * addEvent_NEW({ payload }, { call, put, select }) {
            // 保存活动，参数在各自组件处理，通过payload传入
            const { groupID } = yield select(
                state => state.createActiveCom
            );
            const ret = yield call(addEvent_NEW, {
                ...payload,
                event: {
                    ...payload.event,
                    groupID,
                },

            });

            if (ret.code === '000') {
                return true;
            }

            return false;
        },
        * addEvent_NEW_couponsGiveCoupons({ payload }, { call, put, select }) {
            const { groupID, formData } = yield select(
                state => state.createActiveCom
            );
            const gifts = formData.gifts
            const ret = yield call(addEvent_NEW, {
                ...payload,
                event: {
                    ...payload.event,
                    groupID,
                },
                gifts,
            });

            if (ret.code === '000') {
                return true;
            }

            return false;
        },
        * updateEvent_NEW__couponsGiveCoupons({ payload }, { call, put, select }) {
            // 保存活动，参数在各自组件处理，通过payload传入
            const { groupID, itemID, formData } = yield select(
                state => state.createActiveCom
            );
            const gifts = formData.gifts
            const ret = yield call(updateEvent_NEW, {
                ...payload,
                event: {
                    ...payload.event,
                    groupID,
                    itemID,
                },
                gifts,
            });
            if (ret.code === '000') {
                return true;
            }

            return false;
        },
        * addEvent_NEW_payHaveGift({ payload }, { call, put, select }) {
            // 微信支付有礼专用保存，
            const { groupID, formData, wxNickNameList } = yield select(
                state => state.createActiveCom
            );
            const {
                eventName,
                merchantLogoUrl,
                eventRemark,
                consumeTotalAmount,
                backgroundColor,
                afterPayJumpType,
                eventDate,
                mySendGift,
                originalImageUrl,
                miniProgramInfo,
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
                merchantLogoName: merchantLogoUrl.url
                    ? merchantLogoUrl.fileName
                    : 'hualala.png',
                merchantLogoUrl: merchantLogoUrl.url
                    ? `${imgUrl}/${merchantLogoUrl.url}`
                    : `${imgUrl}/${merchantLogoUrl}`,
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
                eventWay: 80,
                consumeType: 8,
            };
            if (miniProgramInfo && afterPayJumpType === '4') {
                event.miniProgramInfo = JSON.stringify({
                    appID: miniProgramInfo,
                    appName: wxNickNameList.find(
                        v => v.value === miniProgramInfo
                    ).label,
                });
            }

            const gifts = [
                {
                    giftID,
                    giftCount,
                    eventType,
                    countType: '1',
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
                    originalImageName: originalImageUrl.url
                        ? originalImageUrl.fileName
                        : 'wxPayBanner.png',
                    originalImageUrl: originalImageUrl.url
                        ? `${imgUrl}/${originalImageUrl.url}`
                        : `${imgUrl}/${originalImageUrl}`,
                    presentType: 1,
                },
            ];
            const ret = yield call(addEvent_NEW, {
                // groupID,
                event,
                gifts,
            });

            if (ret.code === '000') {
                return true;
            }

            return false;
        },
        * queryEventDetail_NEW({ payload }, { call, put, select }) {
            const { groupID } = yield select(state => state.createActiveCom);
            const ret = yield call(queryEventDetail_NEW, {
                ...payload,
                groupID,
            });
            if (ret.code === '000') {
                return ret
            }
            message.warn(ret.message);
        },
        * queryEventDetail_NEW_couponsGiveCoupons({ payload }, { call, put, select }) {
            const { groupID } = yield select(state => state.createActiveCom);
            const ret = yield call(queryEventDetail_NEW, {
                ...payload,
                groupID,
            });
            if (ret.code === '000') {
                const { data, gifts } = ret;
                const formData = {
                    ...data,
                    giftList: gifts,
                    eventLimitDate: [
                        moment(data.eventStartDate),
                        moment(data.eventEndDate),
                    ],
                };
                yield put({
                    type: 'updateState',
                    payload: {
                        formData,
                    },
                });
                return
            }
            message.warn(ret.message);
        },
        * queryEventDetail_NEW_payHaveGift({ payload }, { call, put, select }) {
            // 微信支付有礼专用
            const { groupID } = yield select(state => state.createActiveCom);
            const ret = yield call(queryEventDetail_NEW, {
                ...payload,
                groupID,
            });

            if (ret.code === '000') {
                const { data, gifts } = ret;
                const mySendGift = {
                    ...gifts[0],
                    rangeDate: [
                        moment(gifts[0].effectTime),
                        moment(gifts[0].validUntilDate),
                    ],
                };
                const formData = {
                    ...data,
                    mySendGift,
                    originalImageUrl:
                        gifts[0].originalImageUrl &&
                        gifts[0].originalImageUrl.split(imgUrl)[1],
                    eventDate: [
                        moment(data.eventStartDate),
                        moment(data.eventEndDate),
                    ],
                    merchantLogoUrl:
                        data.merchantLogoUrl &&
                        data.merchantLogoUrl.split(imgUrl)[1],
                    consumeTotalAmount: {
                        number: String(data.consumeTotalAmount),
                        modal: 'float',
                        maxNum: 7,
                    },
                    afterPayJumpType: data.afterPayJumpType
                        ? String(data.afterPayJumpType)
                        : '3',
                };

                if (data.miniProgramInfo) {
                    let miniProgramInfo = '';
                    try {
                        miniProgramInfo = JSON.parse(data.miniProgramInfo);
                    } catch (error) {}
                    if (miniProgramInfo) {
                        formData.miniProgramInfo = miniProgramInfo.appID;
                    }
                }
                yield put({
                    type: 'updateState',
                    payload: {
                        formData,
                    },
                });
                return mySendGift;
            }
            message.warn(ret.message);
        },
        * getApps({ payload }, { call, put, select }) {
            const { groupID } = yield select(state => state.createActiveCom);

            const ret = yield call(getApps, {
                groupID,
                page: {
                    current: 1,
                    pageSize: 10000000,
                },
            });

            if (ret.result && ret.result.code === '000') {
                if (Array.isArray(ret.apps)) {
                    ret.apps.forEach((v) => {
                        (v.label = v.nickName), (v.value = v.appID);
                    });
                    yield put({
                        type: 'updateState',
                        payload: {
                            wxNickNameList: ret.apps,
                        },
                    });
                }
            } else {
                message.warn(ret.result.message);
            }
        },
        * getExcludeEventList({ payload }, { call, put, select }) {
            const { groupID } = yield select(state => state.createActiveCom);
            const ret = yield call(getExcludeEventList, {
                groupID,
                ...payload,
            });

            if (ret.code === '000') {
                if (
                    !ret.excludeEventModelList ||
                    (Array.isArray(ret.excludeEventModelList) &&
                        !ret.excludeEventModelList.length)
                ) {
                    return true;
                }
                message.warn('一个集团在同一时间段内只能创建一个活动');
                return false;
            }
            message.warn(ret.message);
            return false;
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
        ) {
            return true;
        }
        return false;
    });
    let treeData = [];
    const gifts = [];
    _giftTypes.map((gt, idx) => {
        const giftTypeItem =
            _.find(giftTypeName, { value: String(gt.giftType) }) || {};
        treeData.push({
            label: giftTypeItem.label || '--',
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
    return (treeData = _.sortBy(treeData, 'key'));
}

