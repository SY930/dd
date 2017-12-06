const Immutable = require('immutable');

import { CRM_RECHARGEPACKAGE_MODAL_DETAIL_SHOW, CRM_RECHARGEPACKAGE_MODAL_DETAIL_HIDE } from '../../actions/crm/crmRechargePackage.action';

const $initialState = Immutable.fromJS({
    detailModalVisible: false,
    detailData: [],
    levelData: [],
});
export function crmRechargePackageDetail($$state = $initialState, action) {
    switch (action.type) {
        case CRM_RECHARGEPACKAGE_MODAL_DETAIL_SHOW:
            return $$state.merge({
                detailModalVisible: true,
            });
        case CRM_RECHARGEPACKAGE_MODAL_DETAIL_HIDE:
            return $$state.merge({
                detailModalVisible: false,
            });
        default:
            return $$state;
    }
}
