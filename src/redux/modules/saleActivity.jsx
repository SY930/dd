import Immutable from 'immutable'

import ActionStatus from '../../constants/ActionStatus'
import env from '../../helpers/env'
import { toJSON, genAction, genFetchOptions, fetchData } from '../../helpers/util'


export function getMenuList(arg) {
    return (dispatch, getState) => {
    // 请求服务器接口
        let options = genFetchOptions('get', {}),
            url = `getSysMenuList.svc?_groupID=${arg.groupID}&viewpointID=${arg.viewpointID}`;
        fetch(url, options)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server')
                }

                return response.json()
            })
        // fetchData(url, options, sysMenuListMockData)
            .then((json) => {
                // console.log("json");
                // console.log(json);
                if (json.resultcode === '000') {
                    // console.log(json.data);
                    if (json.resultcode == '0011111100000001') { // session过期
                    }
                    if (process.env.__CLIENT__ === true) {
                        dispatch({
                            type: PLATFORM_DATA_USER_GET_MENULIST,
                            payload: json.data,
                        })
                    }
                } else if (json.code == '0011111100000001') { // session过期
                    // window.location = json.data.redirectUrl;
                }
            })
    }
}
