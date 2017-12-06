import Immutable from 'immutable'
import _ from 'lodash'
import {
    FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_ING,
    FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_SUCCESS,
    FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_FAIL,
    CLOSE_REPORT_SUPPLIER_PURCHASE_CATEGORY,
} from '../../../../actions/supplychain/report/repertory/supplierPurchaseCategory.action.js'

const createInitState = () =>
    Immutable.fromJS({
        loading: false,
        total: 0,
        supplierPurchaseCategoryTotal: [],
        supplierPurchaseCategoryList: [],
    })

const $initialState = createInitState()

export function supplierPurchaseCategoryReport($$state = $initialState, action) {
    switch (action.type) {
        case FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_ING:
            return $$state.set('loading', true)
        case FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_SUCCESS:
            const total = action.payload.cnt
            const records = action.payload.records
            const footer = action.payload.foot

            return $$state.merge({
                loading: false,
                supplierPurchaseCategoryList: Immutable.List(records),
                supplierPurchaseCategoryTotal: Immutable.List([footer]),
                total: Number(total),
            })
        case FETCH_REPORT_SUPPLIER_PURCHASE_CATEGORY_LIST_FAIL:
            return $$state.set('loading', false)
        case CLOSE_REPORT_SUPPLIER_PURCHASE_CATEGORY:
            return $$state.merge(createInitState())
    }

    return $$state
}
