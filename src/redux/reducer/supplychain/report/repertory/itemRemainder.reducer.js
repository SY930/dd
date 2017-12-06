import Immutable from 'immutable'
import _ from 'lodash'
import {
    FETCH_REPORT_ITEM_REMAINDER_LIST_ING,
    FETCH_REPORT_ITEM_REMAINDER_LIST_SUCCESS,
    FETCH_REPORT_ITEM_REMAINDER_LIST_FAIL,
    CLOSE_REPORT_ITEM_REMAINDER,
} from '../../../../actions/supplychain/report/repertory/itemRemainder.action.js'

const createInitState = () =>
    Immutable.fromJS({
        loading: false,
        total: 0,
        itemRemainderTotal: {},
        itemRemainderList: [],
    })

const $initialState = createInitState()

export function itemRemainderReport($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_REPORT_ITEM_REMAINDER_LIST_ING:
            return $$state.set('loading', true)
        case FETCH_REPORT_ITEM_REMAINDER_LIST_SUCCESS:
            const total = action.payload.cnt
            const records = action.payload.records

            return $$state.merge({
                loading: false,
                itemRemainderTotal: Immutable.Map(records.pop()),
                itemRemainderList: Immutable.List(records),
                total: Number(total),
            })
        case FETCH_REPORT_ITEM_REMAINDER_LIST_FAIL:
            return $$state.set('loading', false)
        case CLOSE_REPORT_ITEM_REMAINDER:
            return $$state.merge(createInitState())
    }

    return $$state
}
