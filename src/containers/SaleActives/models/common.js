import React from "react";
import { message } from "antd";
import _ from "lodash";
import api from "../api";
import { FMColorList, RList, RFMColorList } from "../constant";
import { giftTypeName } from "../constant";

const {
    couponService_getSortedCouponBoardList,
    couponService_getBoards,
    addEvent_NEW,
} = api;
const initState = {
    groupID: "",
    type: "",
    descModalIsShow: false,
    isStepContinue: false,
    formData: {}, // 表单内的值,
    currentStep: 0,
    giftForm: null, // 礼品的form对象
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
                console.log(crmGiftTypes);
                return proGiftTreeData(crmGiftTypes);
            } else {
                message.warn(ret.message);
            }
        },
        *couponService_getBoards({ payload }, { call, put, select }) {
            const { groupID } = yield select((state) => state.createActiveCom);
            const ret = yield call(couponService_getBoards, {
                giftItemID: payload.giftItemID,
                groupID,
            });

            if (ret.code === "000") {
                const { crmGiftList } = ret.data;
                return crmGiftList && crmGiftList[0] ? crmGiftList[0] : {};
            } else {
                message.warn(ret.message);
            }
        },
        *addEvent_NEW({ payload }, { call, put, select }) {
            const { groupID } = yield select((state) => state.createActiveCom);
            const ret = yield call(addEvent_NEW, {
                groupID,
            });

            if (ret.code === "000") {
                const { crmGiftList } = ret.data;
                return crmGiftList && crmGiftList[0] ? crmGiftList[0] : {};
            } else {
                message.warn(ret.message);
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
