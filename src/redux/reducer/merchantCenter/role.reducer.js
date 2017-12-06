/*
 * author sunkuiwei
 * email gmonking@gmail.com || sunkuiwei@hualala.com
 * date  2017-02-08
 */

import Immutable from 'immutable';
// import {} from '../../actions/merchantCenter/role';

// state = {
// 	roleID: '', // 角色ID
// 	roleName: '', // 角色名称
// 	roleDesc: '', // 角色描述
// 	roleType: '', // 角色类型
// 	isActive: "", // 是否启用
// 	isGlobal: "0", // 是否平台内置
// }
const $initialState = Immutable.fromJS({
    currentView: '',
    accountInfo: {},
    data: null,
    tableData: [],
    formData: null,
    spinning: false,
    rightList: null,
    allRightList: {},
});

export function role($$state = $initialState, action) {
    switch (action.type) {
        case 'toggerView_Role':
            return $$state.set('currentView', action.payload.currentView)
        case 'getAccountInfo_Role':
            return $$state.set('accountInfo', Immutable.fromJS(action.payload.accountInfo))
        case 'getRoles_Role':
            return $$state.set('tableData', Immutable.fromJS(action.payload.data)).set('data', Immutable.fromJS(action.payload.data))
            // formData
        case 'getFormData_Role':
            return $$state.set('formData', $$state.getIn(['tableData', action.payload.roleIndex]))
        case 'clearFormData_Role':
            return $$state.set('formData', null)
        case 'updateFormData_Role':
            return $$state.set('formData', Immutable.fromJS(action.payload.formData))
            // tableData
        case 'searchRoleViaName_Role':
            var rs = $$state.get('data').toJS().filter((item, index, arr) => {
                return item.roleName.indexOf(action.payload.name) !== -1
            })
            if (rs.length) {
                return $$state.set('tableData', Immutable.fromJS(rs));
            }
            return $$state.set('tableData', Immutable.fromJS(null));

        case 'deleteRole_Role':
            return $$state.deleteIn(['tableData', action.payload.roleIndex])
                .deleteIn(['data', getRoleViaID($$state, action.payload.roleID)])
        case 'disableRole_Role':
            return $$state.setIn(['tableData', action.payload.roleIndex, 'isActive'], '0')
                .setIn(['data', getRoleViaID($$state, action.payload.roleID), 'isActive'], '0')
        case 'enabledRole_Role':
            return $$state.setIn(['tableData', action.payload.roleIndex, 'isActive'], '1')
                .setIn(['data', getRoleViaID($$state, action.payload.roleID), 'isActive'], '1')
        case 'createRole_Role':
            return $$state
        case 'getPermissions_Role':
            return $$state.set('rightList', Immutable.fromJS(action.payload.rightList))
        case 'getAllPermissions_Role':
            return $$state.set('allRightList', Immutable.fromJS(action.payload.allRightList));
        case 'startSpin_Role':
            return $$state.set('spinning', true)
        case 'stopSpin_Role':
            return $$state.set('spinning', false)
        case 'editRole_Role':
            return $$state
        case 'editRolePermissions_Role':
            //   return $$state.updateIn(['tableData', `${getRoleViaID($$state, action.payload.roleID)}`, 'roleRightList'], action.payload.roleRightList)
            return $$state
        default:
            return $$state;
    }
}

const getRoleViaID = ($$state, roleID) => {
    let pos;
    $$state.get('data').toJS().map((item, index, arr) => {
        if (item.roleID == roleID) {
            pos = index
        }
    })
    console.log(pos)
    return pos
}
