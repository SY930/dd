/**
 * @Author: xf
 * @Date:   2017-02-06T10:10:30+08:00
 * @Filename: NewFullCutActivity.action.js
* @Last modified by:   xf
* @Last modified time: 2017-03-27T14:52:09+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */


import {
    // toJSON,
    // genAction,
    // genFetchOptions,
    fetchData,

} from '../../../helpers/util';

import {
    getSpecifiedUrlConfig,
    generateXWWWFormUrlencodedParams,
} from '../../../helpers/apiConfig';

export const INITIALIZE_NEWFULLCUTACTIVITY = 'initialize new fullCut activity new';
export const FULL_CUT_GET_ACTIVITY_SUCCESS = 'get full cut activity success new';
export const FULL_CUT_GET_DATA_BEGIN = 'get full cut data begin new';
export const GET_SHOP_BY_PARAM_START = 'get shop by param start new';
export const GET_SHOP_BY_PARAM_SUCCESS = 'get shop by param success new';
export const GET_ADD_CATEGORY_SUCCESS = 'get add category success new';
export const GET_ADD_TAG_SUCCESS = 'get add tag success new';
export const GET_PROMOTION_LIST_SUCCESS = 'get promotion list success new';
export const GET_DETAIL_LIST_SUCCESS = 'get detail list success new';
export const GET_ROLE_SUCCESS = 'get role success new';
export const SETTING_EXCLUDED_DATA_OF_FULLCUTACTIVITY = 'setting excluded date of fullcut activity new';
export const DEL_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY = 'del excluded date of full cut activity new';
export const ADD_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY = 'add excluded date of full cut activity new';
export const FULL_CUT_SET_ACTIVITY_PERIOD = 'full cut:  set activity period type new';
export const FULL_CUT_SET_ACTIVITY_TIME_SLOT = 'full cut: set activity time slot new';

export const FULL_CUT_GET_ACTIVITY_CATEGORY = 'full cut : get full cut activity category new';
export const FULL_CUT_GET_ACTIVITY_CATEGORY_SUCCESS = 'full cut : get full cut activity category success new';
export const FULL_CUT_GET_ACTIVITY_TAG_SUCCESS = 'full cut : get full cut activity tag success new';

export const FULL_CUT_SET_ACTIVITY_INFOTAG = 'full cut : set full cut activity infotag new';
export const FULL_CUT_SET_ACTIVITY_CATEGORY = 'full cut : set full cut activity category new';
export const FULL_CUT_SET_ACTIVITY_NAME = 'full cut : set full cut activity name new';
export const FULL_CUT_SET_ACTIVITY_SHOWNAME = 'full cut : set full cut activity showName new';
export const FULL_CUT_SET_ACTIVITY_CODE = 'full cut : set full cut activity code new';
export const FULL_CUT_SET_ACTIVITY_TAGS = 'full cut : set full cut activity tags new';
export const FULL_CUT_SET_ACTIVITY_STARTDATE = 'full cut : set full cut activity startDate new';
export const FULL_CUT_SET_ACTIVITY_ENDDATE = 'full cut : set full cut activity endDate new';
export const FULL_CUT_SET_ACTIVITY_DATE = 'full cut : set full cut activity date new';
export const FULL_CUT_SET_ACTIVITY_DESCRIPTION = 'full cut : set full cut activity description new';

export const FULL_CUT_SET_ACTIVITY_RANGETAG = 'full cut : set full cut activity rangeTag new';
export const FULL_CUT_SET_ACTIVITY_BRANDS = 'full cut : set full cut activity brands new';
export const FULL_CUT_SET_ACTIVITY_CHANNEL = 'full cut : set full cut activity channel new';
export const FULL_CUT_SET_ACTIVITY_AUTO = 'full cut : set full cut activity auto new';
export const FULL_CUT_SET_ACTIVITY_ORDERTYPE = 'full cut : set full cut activity orderType new';
export const FULL_CUT_SET_ACTIVITY_SHOPS = 'full cut : set full cut activity shops new';
export const FULL_CUT_SET_ACTIVITY_SHOPSINFO = 'full cut : set full cut activity shopsInfo new';

export const FULL_CUT_SET_ACTIVITY_CONTENTTAG = 'full cut : set full cut activity contentTag new';
export const FULL_CUR_GET_ACTIVITY_FOOD_CATEGORY = 'full cut : get full cut activity food category success new';
export const FULL_CUR_GET_ACTIVITY_FOOD_MENU = 'full cut : get full cut activity food menu success new';
export const FULL_CUR_GET_ACTIVITY_FOOD_MENU_EXCLUDE = 'full cut : get full cut activity food menu exclude success new';

export const FULL_CUT_SET_ACTIVITY_TYPE = 'full cut : set full cut activity type new';
export const FULL_CUT_SET_ACTIVITY_FORRULE = 'full cut : set full cut activity forRule new';
export const FULL_CUT_SET_ACTIVITY_FOOD_CATEGORY = 'full cut : set full cut activity category new';
export const FULL_CUT_SET_ACTIVITY_EXCLUDEDISHES = 'full cut : set full cut activity excludeDishes new';
export const FULL_CUT_SET_ACTIVITY_DISHES = 'full cut : set full cut activity dishes new';
export const FULL_CUT_SET_ACTIVITY_USERS = 'full cut : set full cut activity users new';
export const FULL_CUT_SET_ACTIVITY_SUBJECTTYPE = 'full cut : set full cut activity subjectType new';
export const FULL_CUT_SET_ACTIVITY_MUTEXACTIVITIES = 'full cut : set full cut activity mutexActivities new';
export const FULL_CUT_SET_ACTIVITY_ROLE = 'full cut : set full cut activity role new';
export const FULL_CUT_SET_ACTIVITY_CONTENT_STATE = 'full cut : set full cut activity content state new';
export const FULL_CUT_SET_ACTIVITY_FOOD_CATEGORYINFO = 'full cut : set full cut activity categoryInfo new';
export const FULL_CUT_SET_ACTIVITY_EXCLUDEDISHESINFO = 'full cut : set full cut activity excludeDishesInfo new';
export const FULL_CUT_SET_ACTIVITY_DISHESINFO = 'full cut : set full cut activity dishesInfo new';
export const FULL_CUT_SET_ACTIVITY_MUTEXACTIVITIESINFO = 'full cut : set full cut activity mutexActivitiesInfo new';
export const FULL_CUT_SET_ACTIVITY_ROLEINFO = 'full cut : set full cut activity roleInfo new';


export const SALE_CENTER_ADD_PROMOTION_START = 'sale center:: add new promotion start new';
export const SALE_CENTER_ADD_PROMOTION_SUCCESS = 'sale center:: add new promotion success new';
export const SALE_CENTER_ADD_PROMOTION_FAILED = 'sale center:: add new promotion failed new';

export const SALE_CENTER_UPDATE_PROMOTION_START = 'sale center: update promotion start new';
export const SALE_CENTER_UPDATE_PROMOTION_SUCCESS = 'sale center: update promotion success new';
export const SALE_CENTER_UPDATE_PROMOTION_FAILED = 'sale center: update promotion failed new';

// TODO: move related code to component
import {
    message,
} from 'antd';

export const FULL_CUT_ACTIVITY_CYCLE_TYPE = Object.freeze({
    EVERYDAY: '0',
    WEEKLY: '1',
    MONTHLY: '2',
});

export const CYCLE_TYPE = Object.freeze([
    {
        value: '0',
        name: '每日',
    },
    {
        value: '1',
        name: '每周',
    },
    {
        value: '2',
        name: '每月',
    },
]);

export const WEEK_OPTIONS = Object.freeze([
    {
        label: '日',
        value: '7',
    },
    {
        label: '一',
        value: '1',
    },
    {
        label: '二',
        value: '2',
    },
    {
        label: '三',
        value: '3',
    },
    {
        label: '四',
        value: '4',
    },
    {
        label: '五',
        value: '5',
    },
    {
        label: '六',
        value: '6',
    },
]);

export const MONTH_OPTIONS = ((start, end) => {
    return Array(end - start).fill(0).map((v, index) => {
        return {
            label: `${index + 1}`,
            value: `${index + 1}`,
        };
    });
})(0, 31);

export const getFullCutDataSuccessAC = (opts) => {
    return {
        type: FULL_CUT_GET_ACTIVITY_SUCCESS,
        ...opts,
    };
};

const getFullCutDataBegin = (opts) => {
    return {
        type: FULL_CUT_GET_DATA_BEGIN,
    }
};
// 初始化data字段。
export const initialFullCutDataAC = (opts) => {
    return (dispatch) => {
        dispatch(getFullCutDataBegin());
        fetchData('getSchema_NEW', opts, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getFullCutDataSuccessAC({
                    payload: records,
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
        payload,
    }
};

export const getDetailsSuccess = (payload) => {
    return {
        type: GET_DETAIL_LIST_SUCCESS,
        payload,
    }
};

export const addCategorySuccess = (payload) => {
    return {
        type: GET_ADD_CATEGORY_SUCCESS,
        payload,
    }
};

export const addTagSuccess = (payload) => {
    return {
        type: GET_ADD_TAG_SUCCESS,
        payload,
    }
};

export const getRoleSuccess = (payload) => {
    return {
        type: GET_ROLE_SUCCESS,
        payload,
    }
};

export const getShopByParamAC = (opts) => {
    return (dispatch) => {
        fetchData('getShopByParam_NEW', opts, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getShopByParamSuccess(records));
            });
    }
};

export const addPhrase = (opts) => {
    return (dispatch) => {
        fetchData('addPhrase_NEW', opts, null, {
            path: 'data',
        })
            .then((records) => {
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
        payload: opts,
    }
};

export const delExcludedDateOfFullCutActivityAC = (opts) => {
    return {
        type: DEL_EXCLUDED_DATE_OF_FULLCUT_ACTIVITY,
        payload: opts,
    }
};

export const fullCutSetActivityPeriodAC = (opts) => {
    return {
        type: FULL_CUT_SET_ACTIVITY_PERIOD,
        payload: opts,
    }
};

export const fullCutSetTimeSlotAC = (opts) => {
    return {
        type: FULL_CUT_SET_ACTIVITY_TIME_SLOT,
        payload: opts,
    }
};

export const getRoleAC = (opts) => {
    return (dispatch) => {
        dispatch({
            type: 'GET_FULL_CUT_GET_ROLE_OFF',
        });
        fetchData('getRole_NEW', opts, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getRoleSuccess(records));
            });
    }
};

export const getLists = (opts) => {
    return (dispatch) => {
        fetchData('getPromotionList_NEW', opts, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getListsSuccess(records));
            });
    }
};

export const getDetails = (opts) => {
    return (dispatch) => {
        fetchData('getMyDetail_NEW', opts, null, {
            path: 'data',
        })
            .then((records) => {
                dispatch(getDetailsSuccess(records));
            });
    }
};

export const fullCutAddNewActivityAC = (opts) => {
    console.log("------------fullCut.................")
    return (dispatch) => {
        dispatch({
            type: SALE_CENTER_ADD_PROMOTION_START,
        });

        const constMessage = message.loading('正在添加营销活动', 0);
        const params = generateXWWWFormUrlencodedParams(opts.data);
        // 旧接口，新营销中心内无页面调用此链接
        fetch('/promotion/add.svc', {
            method: 'POST',
            body: params,
            credentials: 'include',
            headers: {
                'Accept': 'application/json; charset=UTF-8',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            },
        }).then((response) => {
            if (response.status >= 200 && response.status < 300) {
                setTimeout(() => {
                    constMessage()
                    opts.success && opts.success();
                }, 0);
                if (response.headers.get('content-type') == 'application/json; charset=UTF-8') {
                    return response.json();
                }
                return response.text();
            }
            return Promise.reject(new Error(response.statusText))
        }).then((responseJSON) => {
            // TODO: 讲新添加的数据推送到我的列表当中, 如果有初始化的情况下。
            dispatch({
                type: SALE_CENTER_ADD_PROMOTION_SUCCESS,
                payload: responseJSON,
            });
        }).catch((error) => {
            setTimeout(() => {
                constMessage();
                opts.fail && opts.fail();
            }, 0);
            dispatch({
                type: SALE_CENTER_ADD_PROMOTION_FAILED,
                payload: error,
            })
        })
    }
};
