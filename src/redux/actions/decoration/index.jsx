import { axiosData } from '../../../helpers/util';

export const SELECT_PROMOTION_FOR_DECORATION = 'sale center:: SELECT_PROMOTION_FOR_DECORATION';
export const UPDATE_DECORATION_ITEM = 'sale center:: UPDATE_DECORATION_ITEM';
export const RESET_DECORATION_INFO = 'sale center:: RESET_DECORATION_INFO';
export const SET_DECORATION_LOADING = 'sale center:: SET_DECORATION_LOADING';
export const GET_DECORATION_SUCCESS = 'sale center:: GET_DECORATION_SUCCESS';

export const selectPromotionForDecoration = opts => ({
    type: SELECT_PROMOTION_FOR_DECORATION,
    payload: opts,
});
export const updateDecorationItem = opts => ({
    type: UPDATE_DECORATION_ITEM,
    payload: opts,
});
export const resetDecorationInfo = () => ({
    type: RESET_DECORATION_INFO,
});
export const getDecorationInfo = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SET_DECORATION_LOADING,
            payload: true,
        });
        return axiosData('/specialPromotion/getEventDecorate.ajax', { eventID: opts.id, eventWay: opts.type }, null, {
            path: 'eventDecorate',
        }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then((data) => {
                dispatch({
                    type: SET_DECORATION_LOADING,
                    payload: false,
                });
                dispatch({
                    type: GET_DECORATION_SUCCESS,
                    payload: data
                });
            }, (err) => { // network error catch
                dispatch({
                    type: SET_DECORATION_LOADING,
                    payload: false,
                });
            })
    }
}
export const saveDecorationInfo = (opts) => {
    return (dispatch) => {
        dispatch({
            type: SET_DECORATION_LOADING,
            payload: true,
        });
        return axiosData(
            '/specialPromotion/eventDecorate.ajax',
            {
                eventID: opts.id,
                eventWay: opts.type,
                eventType: opts.type.length === 4 ? 2 : 1,
                eventDecorate: JSON.stringify(opts.decorationInfo),
            },
            null,
            {path: '',},
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        )
            .then((data) => {
                dispatch({
                    type: SET_DECORATION_LOADING,
                    payload: false,
                });
            }, (err) => { // network error catch
                dispatch({
                    type: SET_DECORATION_LOADING,
                    payload: false,
                });
                return Promise.reject();
            })
    }
}
