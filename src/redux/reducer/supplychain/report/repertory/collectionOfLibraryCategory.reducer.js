import Immutable from 'immutable'
import _ from 'lodash'
import {
    FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_ING,
    FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_SUCCESS,
    FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_FAIL,
    CLOSE_REPORT_COLLECTION_OF_LIBRARY_CATEGORY,
} from '../../../../actions/supplychain/report/repertory/collectionOfLibraryCategory.action.js'

const createInitState = () =>
    Immutable.fromJS({
        loading: false,
        total: 0,
        collectionOfLibraryCategoryTotal: [],
        collectionOfLibraryCategoryList: [],
    })

const $initialState = createInitState()

export function collectionOfLibraryCategoryReport($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_ING:
            return $$state.set('loading', true)
        case FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_SUCCESS:
            const total = action.payload.cnt
            const records = action.payload.records
            const footer = action.payload.foot

            return $$state.merge({
                loading: false,
                collectionOfLibraryCategoryList: Immutable.List(records),
                collectionOfLibraryCategoryTotal: Immutable.List([footer]),
                total: Number(total),
            })
        case FETCH_REPORT_COLLECTION_OF_LIBRARY_CATEGORY_LIST_FAIL:
            return $$state.set('loading', false)
        case CLOSE_REPORT_COLLECTION_OF_LIBRARY_CATEGORY:
            return $$state.merge(createInitState())
    }

    return $$state
}
