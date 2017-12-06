import Immutable from 'immutable';
import {
    FETCH_COMMON_GOODSELECT_GOOD_CATEGORY_SUCCESS,
    FETCH_COMMON_GOODSELECT_GOOD_LIST_SUCCESS,
    UPDATE_COMMON_GOODSELECT_GOOD_KEYWORD,
    UPDATE_COMMON_GOODSELECT_GOOD_CATEGORY,
    UPDATE_COMMON_GOODSELECT_GOOD_SELECTED,
    UPDATE_COMMON_GOODSELECT_REMOVE_LOADING,
    UPDATE_COMMON_GOODSELECT_RESET_STATE,
} from '../../../actions/supplychain/goodSelect/goodSelect.action.js'

function initState() {
    return Immutable.fromJS({
        loading: false,
        searchKey: '',
        category: '',
        goodCategoryList: [],
        goodList: [],
        selectedRowKeys: [], // 右边表格选中的key
        downTableRowKeys: [], // 下面表格中的key
    })
}

export const goodSelect = ($$state = initState(), action) => {
    switch (action.type) {
        case FETCH_COMMON_GOODSELECT_GOOD_CATEGORY_SUCCESS:
            return $$state.set('goodCategoryList', Immutable.List(action.payload))
        case FETCH_COMMON_GOODSELECT_GOOD_LIST_SUCCESS:
            return $$state.set('goodList', Immutable.List(action.payload))
        case UPDATE_COMMON_GOODSELECT_GOOD_KEYWORD:
            return $$state.set('searchKey', action.searchKey)
        case UPDATE_COMMON_GOODSELECT_GOOD_CATEGORY:
            return $$state.set('category', action.payload).set('searchKey', action.searchKey).set('loading', true)
        case UPDATE_COMMON_GOODSELECT_GOOD_SELECTED:
            return $$state.set('selectedRowKeys', action.selectedRowKeys).set('downTableRowKeys', action.downTableRowKeys)
        case UPDATE_COMMON_GOODSELECT_REMOVE_LOADING:
            return $$state.set('loading', false)
        case UPDATE_COMMON_GOODSELECT_RESET_STATE:
            return initState()
        default: return $$state
    }
}
