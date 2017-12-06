import { fetchData } from '../../../helpers/util';
import { groupBy } from 'lodash';

const optsCache = {}


export const toogerViewAction = (currentView) => {
    return {
        type: 'toggerView_Role',
        payload: {
            currentView,
        },
    }
}
// 获取当前登陆账号信息
export const getAccountInfoAction = () => (dispatch) => {
    return fetchData('getAccountInfo')
        .then((accountInfo = {}) => {
            dispatch({
                type: 'getAccountInfo_Role',
                payload: {
                    accountInfo,
                },
            })
        })
}

// 通过 roleID 获取单个角色列表
export const getRolesViaRoleIDAction = opts => (dispatch) => {
    // opts = opts || {}
    // const optsToJson = JSON.stringify(opts)
    // if(optsCache[optsToJson]){
    //     return new Promise(resolve => resolve(optsCache[optsToJson]))
    // }else{
    return fetchData('getRoleList', {
        ...opts,
    }).then((records = []) => {
        const data = excludeKey(records, 'viewpointIDs', '1');
        // optsCache[optsToJson] = data
        return data
    })
    // }
}

// 获取角色列表
export const getRolesAction = opts => (dispatch) => {
    opts = opts || {}
    return fetchData('getRoleList', {
        // hasRight: 1,
        ...opts,
    }).then((records = []) => {
        dispatch({
            type: 'getRoles_Role',
            payload: {
                data: excludeKey(records, 'viewpointIDs', '1'),
            },
        })
    })
}
// 得到表单数据
export const getFormDataAction = (roleID, roleIndex) => {
    return {
        type: 'getFormData_Role',
        payload: {
            roleIndex,
        },
    }
}
// 清空表单数据
export const clearFormDataAction = () => {
    return {
        type: 'clearFormData_Role',
    }
}
// 搜索角色
export const searchRoleViaNameAcrion = (name) => {
    return {
        type: 'searchRoleViaName_Role',
        payload: {
            name,
        },
    }
}
// 删除角色
export const deleteRoleAction = (roleID, roleIndex, callback) => (dispatch) => {
    return fetchData('deleteRole', {
        roleID,
    }).then((records) => {
        callback && callback()
        dispatch({
            type: 'deleteRole_Role',
            payload: {
                roleIndex,
                roleID,
            },
        })
    })
}
// 禁用角色
export const disableRoleAction = (roleID, roleIndex, isActive, callback) => (dispatch) => {
    return fetchData('toggerActiveRole', {
        roleID,
        isActive,
    }).then((records) => {
        callback && callback()
        dispatch({
            type: 'disableRole_Role',
            payload: {
                roleID, roleIndex,
            },
        })
    }).catch(() => {
        callback && callback()
    })
}
// 开启角色
export const enabledRoleAction = (roleID, roleIndex, isActive, callback) => (dispatch) => {
    return fetchData('toggerActiveRole', {
        roleID,
        isActive,
    }).then((records) => {
        callback && callback()
        dispatch({
            type: 'enabledRole_Role',
            payload: {
                roleID, roleIndex,
            },
        })
    }).catch(() => {
        callback && callback()
    })
}
// 更新表单内容
export const updateFormDataAction = formData => (dispatch) => {
    dispatch({
        type: 'updateFormData_Role',
        payload: {
            formData,
        },
    })
}
// 创建角色
export const createRoleAction = (formData, callback, errorHandler) => (dispatch) => {
    return fetchData('createRole', {
        ...formData,
    })
        .then((records) => {
            callback && callback()
            dispatch({
                type: 'createRole_Role',
            })
        })
        .catch(() => {
            errorHandler && errorHandler()
        })
}
// 修改角色
export const editRoleAction = formData => (dispatch) => {
    return fetchData('editRole', {
        ...formData,
    }).then((records) => {
        dispatch({
            type: 'editRole_Role',
        })
    })
}
export const getAllPermissionsAction = callback => (dispatch) => {
    return fetchData('getPermissions', {
    }).then((records = []) => {
        callback && callback();
        const rs = groupBy(records, 'viewpointID');
        // const rs = [1,2,3,4,5].map(index => records.filter(item => item['viewpointID'] == index ))
        dispatch({
            type: 'getAllPermissions_Role',
            payload: {
                allRightList: rs,
            },
        })
    })
}
// 获取权限列表
export const getPermissionsAction = (opts = {}, callback) => (dispatch) => {
    return fetchData('getPermissions', opts).then((records) => {
        dispatch({
            type: 'getPermissions_Role',
            payload: {
                rightList: records,
            },
        })
    })
}
// 修改权限
export const editRolePermissionsAction = formData => (dispatch) => {
    return fetchData('editRolePermissions', {
        ...formData,
    }).then((records) => {
        dispatch({
            type: 'editRolePermissions_Role',
            payload: {
                ...formData,
            },
        })
    })
}
// 开始 loading
export const startSpinAction = () => {
    return {
        type: 'startSpin_Role',
    }
}
// 停止loading
export const stopSpinAction = () => {
    return {
        type: 'stopSpin_Role',
    }
}

const excludeKey = (data, key, value) => data.filter(item => item[key] !== value)
const wrap = value => ({ map: callback => wrap(callback(value)), value })
