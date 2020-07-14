import React from "react";
import { message } from "antd";
import _ from "lodash";
import api from "../api";
import { FMColorList, RList, RFMColorList } from "../constant";

const {} = api;
const initState = {
    groupID: "",
    type: "",
    descModalIsShow: false,
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
        *rfmModelService_queryFmSummary({ payload }, { call, put, select }) {
            const ret = yield call(rfmModelService_queryFmSummary, {
                reportMonth: currentDate,
                groupID,
                monetaryType,
            });

            if (ret.code === "000") {
            } else {
                message.warn(ret.message);
            }
        },
    },
};
