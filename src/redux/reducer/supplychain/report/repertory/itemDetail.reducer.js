import Immutable from 'immutable'
import {
    FETCH_REPORT_ITEM_DETAIL_LIST_ING,
    FETCH_REPORT_ITEM_DETAIL_LIST_SUCCESS,
    FETCH_REPORT_ITEM_DETAIL_LIST_FAIL,
    CLOSE_REPORT_ITEM_DETAIL,
} from '../../../../actions/supplychain/report/repertory/itemDetail.action.js'

const createInitState = () =>
    Immutable.fromJS({
        loading: false,
        itemDetailList: [],
    })

const $initialState = createInitState()

export function itemDetailReport($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_REPORT_ITEM_DETAIL_LIST_ING:
            return $$state.set('loading', true)
        case FETCH_REPORT_ITEM_DETAIL_LIST_SUCCESS:
            return $$state.merge({
                loading: false,
                itemDetailList: Immutable.List(action.payload),
            })
        case FETCH_REPORT_ITEM_DETAIL_LIST_FAIL:
            return $$state.set('loading', false)
        case CLOSE_REPORT_ITEM_DETAIL:
            return $$state.merge(createInitState())
    }

    return $$state
}
