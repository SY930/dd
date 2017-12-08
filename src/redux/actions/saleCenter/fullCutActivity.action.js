/**
 * @Author: xf
 * @Date:   2017-02-06T10:10:30+08:00
 * @Filename: NewFullCutActivity.action.js
* @Last modified by:   xf
* @Last modified time: 2017-03-27T14:52:09+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */


'use strict';

import {
    // toJSON,
    // genAction,
    // genFetchOptions,
    fetchData,

} from '../../../helpers/util';

import {
    getSpecifiedUrlConfig,
    generateXWWWFormUrlencodedParams
} from '../../../helpers/apiConfig';

export const INITIALIZE_NEWFULLCUTACTIVITY = 'initialize new fullCut activity';
export const FULL_CUT_GET_ACTIVITY_SUCCESS = 'get full cut activity success';
export const FULL_CUT_GET_DATA_BEGIN = 'get full cut data begin';
export const GET_SHOP_BY_PARAM_START = 'get shop by param start';
export const GET_SHOP_BY_PARAM_SUCCESS = 'get shop by param success';
export const GET_ADD_CATEGORY_SUCCESS = 'get add category success';
export const GET_ADD_TAG_SUCCESS = 'get add tag success';
export const GET_PROMOTION_LIST_SUCCESS = 'get promotion list success';
export const GET_DETAIL_LIST_SUCCESS = 'get detail list success';
export const GET_ROLE_SUCCESS = 'get role success';
export const SETTING_EXCLUDED_DATA_OF_FULLCUTACTIVITY = 'setting excluded date of fullcut activity';
export const DEL_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY = 'del excluded date of full cut activity';
export const ADD_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY = 'add excluded date of full cut activity';
export const FULL_CUT_SET_ACTIVITY_PERIOD = 'full cut:  set activity period type';
export const FULL_CUT_SET_ACTIVITY_TIME_SLOT = "full cut: set activity time slot";

export const FULL_CUT_GET_ACTIVITY_CATEGORY = "full cut : get full cut activity category";
export const FULL_CUT_GET_ACTIVITY_CATEGORY_SUCCESS = "full cut : get full cut activity category success";
export const FULL_CUT_GET_ACTIVITY_TAG_SUCCESS = "full cut : get full cut activity tag success";

export const FULL_CUT_SET_ACTIVITY_INFOTAG = "full cut : set full cut activity infotag";
export const FULL_CUT_SET_ACTIVITY_CATEGORY = "full cut : set full cut activity category";
export const FULL_CUT_SET_ACTIVITY_NAME = "full cut : set full cut activity name";
export const FULL_CUT_SET_ACTIVITY_SHOWNAME = "full cut : set full cut activity showName";
export const FULL_CUT_SET_ACTIVITY_CODE = "full cut : set full cut activity code";
export const FULL_CUT_SET_ACTIVITY_TAGS = "full cut : set full cut activity tags";
export const FULL_CUT_SET_ACTIVITY_STARTDATE = "full cut : set full cut activity startDate";
export const FULL_CUT_SET_ACTIVITY_ENDDATE = "full cut : set full cut activity endDate";
export const FULL_CUT_SET_ACTIVITY_DATE = "full cut : set full cut activity date";
export const FULL_CUT_SET_ACTIVITY_DESCRIPTION = "full cut : set full cut activity description";

export const FULL_CUT_SET_ACTIVITY_RANGETAG = "full cut : set full cut activity rangeTag";
export const FULL_CUT_SET_ACTIVITY_BRANDS = "full cut : set full cut activity brands";
export const FULL_CUT_SET_ACTIVITY_CHANNEL = "full cut : set full cut activity channel";
export const FULL_CUT_SET_ACTIVITY_AUTO = "full cut : set full cut activity auto";
export const FULL_CUT_SET_ACTIVITY_ORDERTYPE = "full cut : set full cut activity orderType";
export const FULL_CUT_SET_ACTIVITY_SHOPS = "full cut : set full cut activity shops";
export const FULL_CUT_SET_ACTIVITY_SHOPSINFO = "full cut : set full cut activity shopsInfo";

export const FULL_CUT_SET_ACTIVITY_CONTENTTAG = "full cut : set full cut activity contentTag";
export const FULL_CUR_GET_ACTIVITY_FOOD_CATEGORY = "full cut : get full cut activity food category success";
export const FULL_CUR_GET_ACTIVITY_FOOD_MENU = "full cut : get full cut activity food menu success";
export const FULL_CUR_GET_ACTIVITY_FOOD_MENU_EXCLUDE = "full cut : get full cut activity food menu exclude success";

export const FULL_CUT_SET_ACTIVITY_TYPE = "full cut : set full cut activity type";
export const FULL_CUT_SET_ACTIVITY_FORRULE = "full cut : set full cut activity forRule";
export const FULL_CUT_SET_ACTIVITY_FOOD_CATEGORY = "full cut : set full cut activity category";
export const FULL_CUT_SET_ACTIVITY_EXCLUDEDISHES = "full cut : set full cut activity excludeDishes";
export const FULL_CUT_SET_ACTIVITY_DISHES = "full cut : set full cut activity dishes";
export const FULL_CUT_SET_ACTIVITY_USERS = "full cut : set full cut activity users";
export const FULL_CUT_SET_ACTIVITY_SUBJECTTYPE = "full cut : set full cut activity subjectType";
export const FULL_CUT_SET_ACTIVITY_MUTEXACTIVITIES = "full cut : set full cut activity mutexActivities";
export const FULL_CUT_SET_ACTIVITY_ROLE = "full cut : set full cut activity role";
export const FULL_CUT_SET_ACTIVITY_CONTENT_STATE = "full cut : set full cut activity content state";
export const FULL_CUT_SET_ACTIVITY_FOOD_CATEGORYINFO = "full cut : set full cut activity categoryInfo";
export const FULL_CUT_SET_ACTIVITY_EXCLUDEDISHESINFO = "full cut : set full cut activity excludeDishesInfo";
export const FULL_CUT_SET_ACTIVITY_DISHESINFO = "full cut : set full cut activity dishesInfo";
export const FULL_CUT_SET_ACTIVITY_MUTEXACTIVITIESINFO = "full cut : set full cut activity mutexActivitiesInfo";
export const FULL_CUT_SET_ACTIVITY_ROLEINFO = "full cut : set full cut activity roleInfo";


export const SALE_CENTER_ADD_PROMOTION_START = 'sale center:: add new promotion start';
export const SALE_CENTER_ADD_PROMOTION_SUCCESS = 'sale center:: add new promotion success';
export const SALE_CENTER_ADD_PROMOTION_FAILED = 'sale center:: add new promotion failed';

export const SALE_CENTER_UPDATE_PROMOTION_START = 'sale center: update promotion start';
export const SALE_CENTER_UPDATE_PROMOTION_SUCCESS = 'sale center: update promotion success';
export const SALE_CENTER_UPDATE_PROMOTION_FAILED = "sale center: update promotion failed";

// TODO: move related code to component
import {
    message
} from 'antd';

export const FULL_CUT_ACTIVITY_CYCLE_TYPE = Object.freeze({
    EVERYDAY: '0',
    WEEKLY: '1',
    MONTHLY: '2',
});

export const CYCLE_TYPE = Object.freeze([
    {
        value: '0',
        name: '每日'
    },
    {
        value: '1',
        name: '每周'
    },
    {
        value: '2',
        name: '每月'
    }
]);

export const WEEK_OPTIONS = Object.freeze([
    {
        label: '日',
        value: '7'
    },
    {
        label: '一',
        value: '1'
    },
    {
        label: '二',
        value: '2'
    },
    {
        label: '三',
        value: '3'
    },
    {
        label: '四',
        value: '4'
    },
    {
        label: '五',
        value: '5'
    },
    {
        label: '六',
        value: '6'
    }
]);

export const MONTH_OPTIONS = ((start, end) => {
    return Array(end - start).fill(0).map((v, index) => {
        return {
            label: `${index+1}`,
            value: `${index+1}`
        };
    });
})(0, 31);

export const getFullCutDataSuccessAC = (opts) => {
    return {
        type: FULL_CUT_GET_ACTIVITY_SUCCESS,
        ...opts
    };
};

const getFullCutDataBegin = (opts) => {
    return {
        type: FULL_CUT_GET_DATA_BEGIN
    }
};
// 初始化data字段。
export const initialFullCutDataAC = (opts) => {
    return dispatch => {

        dispatch(getFullCutDataBegin());
        fetchData('getSchema', opts, null, {
                path: 'data'
            })
            .then(records => {
                dispatch(getFullCutDataSuccessAC({
                    payload: records
                }))
            });
    }
};

export const getShopByParamSuccess = (payload) => {
    return {
        type: GET_SHOP_BY_PARAM_SUCCESS,
        payload,
    }
};

export const getListsSuccess = (payload) => {
    return {
        type: GET_PROMOTION_LIST_SUCCESS,
        payload
    }
};

export const getDetailsSuccess = (payload) => {
    return {
        type: GET_DETAIL_LIST_SUCCESS,
        payload
    }
};

export const addCategorySuccess = (payload) => {
    return {
        type: GET_ADD_CATEGORY_SUCCESS,
        payload
    }
};

export const addTagSuccess = (payload) => {
    return {
        type: GET_ADD_TAG_SUCCESS,
        payload
    }
};

export const getRoleSuccess = (payload) => {
    return {
        type: GET_ROLE_SUCCESS,
        payload
    }
};

export const getShopByParamAC = (opts) => {
    return dispatch => {
        fetchData('getShopByParam', opts, null, {
                path: 'data'
            })
            .then(records => {
                dispatch(getShopByParamSuccess(records));
            });
    }
};

export const addPhrase = (opts) => {
    return dispatch => {
        fetchData('addPhrase', opts, null, {
                path: 'data'
            })
            .then(records => {
                if (opts.phraseType == 'CATEGORY_NAME') {
                    dispatch(addCategorySuccess(records));
                } else {
                    dispatch(addTagSuccess(records));
                }
            });
    }
};

export const addExcludedDateOfFullCutActivityAC = (opts) => {
    return {
        type: ADD_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY,
        payload: opts
    }
};

export const delExcludedDateOfFullCutActivityAC = (opts) => {
    return {
        type: DEL_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY,
        payload: opts
    }
};

export const fullCutSetActivityPeriodAC = (opts) => {
    return {
        type: FULL_CUT_SET_ACTIVITY_PERIOD,
        payload: opts
    }
};

export const fullCutSetTimeSlotAC = (opts) => {
    return {
        type: FULL_CUT_SET_ACTIVITY_TIME_SLOT,
        payload: opts
    }
};

export const getRoleAC = (opts) => {
    return dispatch => {
        dispatch({
            type: 'GET_FULL_CUT_GET_ROLE_OFF'
        });
        fetchData('getRole', opts, null, {
                path: 'data'
            })
            .then(records => {
                dispatch(getRoleSuccess(records));
            });
    }
};

export const getLists = (opts) => {
    return dispatch => {
        fetchData('getPromotionList', opts, null, {
                path: 'data'
            })
            .then(records => {
                dispatch(getListsSuccess(records));
            });
    }
};

export const getDetails = (opts) => {
    return dispatch => {
        fetchData('getMyDetail', opts, null, {
                path: 'data'
            })
            .then(records => {
                dispatch(getDetailsSuccess(records));
            });
    }
};

export const fullCutAddNewActivityAC = (opts) => {

    return dispatch => {
        dispatch({
            type: SALE_CENTER_ADD_PROMOTION_START,
        });

        let constMessage = message.loading('正在添加营销活动', 0);
        let params = generateXWWWFormUrlencodedParams(opts.data);

        fetch("/promotion/add.svc", {
            method: "POST",
            body: params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                setTimeout(() => {
                    constMessage()
                    opts.success && opts.success();
                }, 0);
                if (response.headers.get("content-type") == 'application/json; charset=UTF-8') {
                    return response.json();
                } else {
                    return response.text();
                }

            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }).then((responseJSON) => {
            // TODO: 讲新添加的数据推送到我的列表当中, 如果有初始化的情况下。
            dispatch({
                type: SALE_CENTER_ADD_PROMOTION_SUCCESS,
                payload: responseJSON
            });
        }).catch((error) => {

            setTimeout(() => {
                constMessage();
                opts.fail && opts.fail();
            }, 0);
            dispatch({
                type: SALE_CENTER_ADD_PROMOTION_FAILED,
                payload: error
            })
        })

    }
};

export const fullCutUpdateNewActivityAC = (opts) => {
    return dispatch => {
        dispatch({
            type: SALE_CENTER_UPDATE_PROMOTION_START
        });
        let constMessage = message.loading('正在更新营销活动', 0);
        let urlConf = getSpecifiedUrlConfig("updatePromotion", opts.data);

        fetch(urlConf.url, {
            method: "POST",
            body: urlConf.params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                setTimeout(() => {
                    constMessage(), opts.success && opts.success();
                }, 0);
                if (response.headers.get("content-type") == 'application/json; charset=UTF-8') {
                    return response.json();
                } else {
                    return response.text();
                }

            } else {
                return Promise.reject(new Error(response.statusText))
            }
        }).then((responseJSON) => {
            // TODO: 讲新添加的数据推送到我的列表当中, 如果有初始化的情况下。
            dispatch({
                type: SALE_CENTER_UPDATE_PROMOTION_SUCCESS,
                payload: responseJSON
            });
        }).catch((error) => {
            setTimeout(() => {
                constMessage();
                opts.fail && opts.fail();
            }, 0);
            dispatch({
                type: SALE_CENTER_UPDATE_PROMOTION_FAILED,
                payload: error
            })
        })
    }
}
