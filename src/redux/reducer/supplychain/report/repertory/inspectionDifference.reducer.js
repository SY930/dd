import Immutable from 'immutable'
import {
    FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_ING,
    FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_SUCCESS,
    FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_FAIL,
    CLOSE_REPORT_INSPECTION_DIFFERENCE,
} from '../../../../actions/supplychain/report/repertory/inspectionDifference.action'

const createInitState = () =>
    Immutable.fromJS({
        loading: false,
        inspectionDifferenceList: [],
        total: 0,
    })

const $initialState = createInitState()

export function inspectionDifferenceReport($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_ING:
            return $$state.set('loading', true)
        case FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_SUCCESS:
            const total = Number(action.payload.cnt)
            const records = action.payload.records
            return $$state.merge({
                loading: false,
                inspectionDifferenceList: Immutable.List(records),
                total,
            })
        case FETCH_REPORT_INSPECTION_DIFFERENCE_LIST_FAIL:
            return $$state.set('loading', false)
        case CLOSE_REPORT_INSPECTION_DIFFERENCE:
            return $$state.merge(createInitState())
        // no default
    }

    return $$state
}
