/**
 * Created by benLong on 2017/6/19 0019.
 */
export const GOODS_PRICE_VIEW_BY_STORE_LIST = 'GoodsPriceViewByStore: fetch GoodsPriceViewByStore list';
export const GOODS_PRICE_VIEW_BY_STORE_LIST_OK = 'GoodsPriceViewByStore: fetch GoodsPriceViewByStore list ok';
export const GOODS_PRICE_VIEW_BY_STORE_LIST_FAIL = 'GoodsPriceViewByStore: fetch GoodsPriceViewByStore list fail';
export const GOODS_PRICE_VIEW_BY_STORE_LIST_CANCEL = 'GoodsPriceViewByStore: fetch GoodsPriceViewByStore list cancel';
export const GOODS_PRICE_VIEW_BY_STORE_LIST_TIME_OUT = 'GoodsPriceViewByStore: fetch GoodsPriceViewByStore list time out';

export const fetchGoodsPriceViewByStoreList = opts => ({ type: GOODS_PRICE_VIEW_BY_STORE_LIST, payload: opts });
const fetchGoodsPriceViewByStoreListOk = payload => ({ type: GOODS_PRICE_VIEW_BY_STORE_LIST_OK, payload });
const fetchGoodsPriceViewByStoreListFail = payload => ({ type: GOODS_PRICE_VIEW_BY_STORE_LIST_FAIL, payload });
export const fetchGoodsPriceViewByStoreListCancel = () => ({ type: GOODS_PRICE_VIEW_BY_STORE_LIST_CANCEL });
export const fetchGoodsPriceViewByStoreListTimeout = () => ({ type: GOODS_PRICE_VIEW_BY_STORE_LIST_TIME_OUT });

