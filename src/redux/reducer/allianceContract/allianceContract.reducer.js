import Immutable from 'immutable';

import {
    // 查询加盟商基本信息
    ALLIANCECONTRACT_FRANCHISEEINFOLIST_START,
    ALLIANCECONTRACT_FRANCHISEEINFOLIST_SUCCESS,
    ALLIANCECONTRACT_FRANCHISEEINFOLIST_FAILED,
    ALLIANCECONTRACT_FRANCHISEEINFOLIST_CANCEL,
    // 查询加盟合同列表
    ALLIANCECONTRACT_QUERYFCONTRACT_START,
    ALLIANCECONTRACT_QUERYFCONTRACT_SUCCESS,
    ALLIANCECONTRACT_QUERYFCONTRACT_FAILED,
    ALLIANCECONTRACT_QUERYFCONTRACT_CANCEL,
    // 新增加盟合同
    ALLIANCECONTRACT_ADDFCONTRACT_START,
    ALLIANCECONTRACT_ADDFCONTRACT_SUCCESS,
    ALLIANCECONTRACT_ADDFCONTRACT_FAILED,
    ALLIANCECONTRACT_ADDFCONTRACT_CANCEL,

    // 修改加盟商合同
    ALLIANCECONTRACT_UPDATEFCONTRACT_START,
    ALLIANCECONTRACT_UPDATEFCONTRACT_SUCCESS,
    ALLIANCECONTRACT_UPDATEFCONTRACT_FAILED,
    ALLIANCECONTRACT_UPDATEFCONTRACT_CANCEL,

    // 查询结算账户
    ALLIANCECONTRACT_GETFSMSETTLEUNIT_START,
    ALLIANCECONTRACT_GETFSMSETTLEUNIT_SUCCESS,
    ALLIANCECONTRACT_GETFSMSETTLEUNIT_FAILED,
    ALLIANCECONTRACT_GETFSMSETTLEUNIT_CANCEL,

} from '../../actions/allianceContract/allianceContract.action';

const $initialState = Immutable.fromJS({
    // 查询加盟商基本信息
    franchiseeInfoList: {
        data: {},
        status: 'start',
    },
    queryFContract: {
        data: {},
        status: 'start',
    },
    addFContract: {
        status: 'start',
    },
    updateFContract: {
        status: 'start',
    },
    // 查询结算账户
    getFsmSettleUnit: {
        data: {},
        status: 'start',
    },
});

export const allianceContract = ($$state = $initialState, action) => {
    switch (action.type) {
        // 查询加盟商基本信息
        case ALLIANCECONTRACT_FRANCHISEEINFOLIST_START:
            return $$state.setIn(['franchiseeInfoList', 'status'], 'pending');
        case ALLIANCECONTRACT_FRANCHISEEINFOLIST_SUCCESS:
            if ($$state.getIn(['franchiseeInfoList', 'status']) === 'pending') {
                return $$state.setIn(['franchiseeInfoList', 'status'], 'success')
                    .setIn(['franchiseeInfoList', 'data'], Immutable.fromJS(action.payload.data));
            }
            return $$state;
        case ALLIANCECONTRACT_FRANCHISEEINFOLIST_FAILED:
            return $$state.setIn(['franchiseeInfoList', 'status'], 'fail');
        case ALLIANCECONTRACT_FRANCHISEEINFOLIST_CANCEL:
            return $$state.setIn(['franchiseeInfoList', 'status'], 'fail');
        // 查询加盟合同列表
        case ALLIANCECONTRACT_QUERYFCONTRACT_START:
            return $$state.setIn(['queryFContract', 'status'], 'pending');
        case ALLIANCECONTRACT_QUERYFCONTRACT_SUCCESS:
            if ($$state.getIn(['queryFContract', 'status']) === 'pending') {
                return $$state.setIn(['queryFContract', 'status'], 'success')
                    .setIn(['queryFContract', 'data'], Immutable.fromJS(action.payload.data.fcontractLists ? action.payload.data : {}));
            }
            return $$state;
        case ALLIANCECONTRACT_QUERYFCONTRACT_FAILED:
            return $$state.setIn(['queryFContract', 'status'], 'fail');
        case ALLIANCECONTRACT_QUERYFCONTRACT_CANCEL:
            return $$state.setIn(['queryFContract', 'status'], 'fail');
        // 新增加盟合同
        case ALLIANCECONTRACT_ADDFCONTRACT_START:
            return $$state.setIn(['addFContract', 'status'], 'pending');
        case ALLIANCECONTRACT_ADDFCONTRACT_SUCCESS:
            if ($$state.getIn(['addFContract', 'status']) === 'pending') {
                return $$state.setIn(['addFContract', 'status'], 'success')
            }
            return $$state;
        case ALLIANCECONTRACT_ADDFCONTRACT_FAILED:
            return $$state.setIn(['addFContract', 'status'], 'fail');
        case ALLIANCECONTRACT_ADDFCONTRACT_CANCEL:
            return $$state.setIn(['addFContract', 'status'], 'fail');
        // 修改加盟合同
        case ALLIANCECONTRACT_UPDATEFCONTRACT_START:
            return $$state.setIn(['updateFContract', 'status'], 'pending');
        case ALLIANCECONTRACT_UPDATEFCONTRACT_SUCCESS:
            if ($$state.getIn(['updateFContract', 'status']) === 'pending') {
                return $$state.setIn(['updateFContract', 'status'], 'success')
            }
            return $$state;
        case ALLIANCECONTRACT_UPDATEFCONTRACT_FAILED:
            return $$state.setIn(['updateFContract', 'status'], 'fail');
        case ALLIANCECONTRACT_UPDATEFCONTRACT_CANCEL:
            return $$state.setIn(['updateFContract', 'status'], 'fail');
        // 查询结算账户
        case ALLIANCECONTRACT_GETFSMSETTLEUNIT_START:
            return $$state.setIn(['getFsmSettleUnit', 'status'], 'pending');
        case ALLIANCECONTRACT_GETFSMSETTLEUNIT_SUCCESS:
            if ($$state.getIn(['getFsmSettleUnit', 'status']) === 'pending') {
                return $$state.setIn(['getFsmSettleUnit', 'status'], 'success')
                    .setIn(['getFsmSettleUnit', 'data'], Immutable.fromJS(action.payload.data))
            }
            return $$state;
        case ALLIANCECONTRACT_GETFSMSETTLEUNIT_FAILED:
            return $$state.setIn(['getFsmSettleUnit', 'status'], 'fail');
        case ALLIANCECONTRACT_GETFSMSETTLEUNIT_CANCEL:
            return $$state.setIn(['getFsmSettleUnit', 'status'], 'fail');
        default:
            return $$state;
    }
};
