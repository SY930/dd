const Immutable = require('immutable');

import {
    CRM_GROUP_UNSHIFT_SELECTED,
    CRM_GROUP_DELETE_SELECTED,
} from '../../actions/crm/crmGroup.action';

const $initialState = Immutable.fromJS({
    crmGroupInfo: {
        selected: [],
    },
})

export function crmGroup($$state = $initialState, action) {
    switch (action.type) {
        case CRM_GROUP_UNSHIFT_SELECTED:
            let _selected = $$state.getIn(['crmGroupInfo', 'selected']).toJS();
            _selected = _selected.unshift(action.payload);
            return $$state.setIn(['crmGroupInfo', 'selected'], Immutable.from(_selected));


        case CRM_GROUP_DELETE_SELECTED:
            return $$state;
        // case "add_data":
        //     return $$state.push($$state.crmGroupInfo(action.payload));
        //
        // case CHANGE_CRM_GROUP_FOUNDER:
        //     return $$state.setIn(["crmGroupInfo", "0", "founder"], action.payload);


        default:
            return $$state;
    }
}
