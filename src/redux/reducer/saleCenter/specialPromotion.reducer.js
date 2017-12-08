
import Immutable from 'immutable';
import Moment from 'moment';

import {ACTIVITY_CATEGORIES} from '../../actions/saleCenter/types';
import {
    SALE_CENTER_ADD_SPECIAL_PROMOTION_START,
    SALE_CENTER_ADD_SPECIAL_PROMOTION_OK,
    SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL,
    SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT,
    SALE_CENTER_ADD_SPECIAL_PROMOTION_CANCEL,

    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT,
    SALE_CENTER_UPDATE_SPECIAL_PROMOTION_CANCEL,

    SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO,
    SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO,
    SALE_CENTER_CHECK_BIRTHDAY_SUCCESS,

    SALE_CENTER_RESET_SPECIAL_PROMOTION
} from '../../actions/saleCenter/specialPromotion.action';

const $initialState = Immutable.fromJS({
    $eventInfo: {
        giftAdvanceDays:'', //提前天数
        eventRemark:'', //描述
        smsGate:'0', //是否发送短信
        smsTemplate:'', //短信内容
        eventWay: '',
        eventName: '',
        eventStartDate:'',
        eventEndDate:''
    },
    $giftInfo:[],
    addStatus: {
        status:null
    }

});


export const specialPromotion = ($$state = $initialState, action) => {
    switch (action.type) {

        case SALE_CENTER_SET_SPECIAL_PROMOTION_EVENT_INFO:
            if(action.payload.data && action.payload.gifts){
                return $$state.mergeIn(['$eventInfo'], Immutable.fromJS({...action.payload.data}))
                    .mergeIn(['$giftInfo'], Immutable.fromJS(action.payload.gifts));
            }else{
                return $$state.mergeIn(['$eventInfo'], Immutable.fromJS(action.payload.data || action.payload));
            }


        case SALE_CENTER_SET_SPECIAL_PROMOTION_GIFT_INFO:
            return $$state.set('$giftInfo', Immutable.fromJS(action.payload));

        case SALE_CENTER_ADD_SPECIAL_PROMOTION_START:
            return $$state.setIn(["addStatus", "status"], 'pending');

        case SALE_CENTER_ADD_SPECIAL_PROMOTION_OK:
            if ($$state.getIn(["addStatus", "status"]) === 'pending') {
                return $$state.setIn(["addStatus", "status"], 'success');
            }
            return $$state;

        case SALE_CENTER_ADD_SPECIAL_PROMOTION_TIMEOUT:
            return $$state.setIn(["addStatus", "status"], 'timeout');

        case SALE_CENTER_ADD_SPECIAL_PROMOTION_FAIL:
            return $$state.setIn(["addStatus", "status"], 'fail');

        case SALE_CENTER_UPDATE_SPECIAL_PROMOTION_START:
            return $$state.setIn(["addStatus", "status"], 'pending');

        case SALE_CENTER_UPDATE_SPECIAL_PROMOTION_OK:
            if ($$state.getIn(["addStatus", "status"]) === 'pending') {
                return $$state.setIn(["addStatus", "status"], 'success');
            }
            return $$state;

        case SALE_CENTER_UPDATE_SPECIAL_PROMOTION_TIMEOUT:
            return $$state.setIn(["addStatus", "status"], 'timeout');

        case SALE_CENTER_UPDATE_SPECIAL_PROMOTION_FAIL:
            return $$state.setIn(["addStatus", "status"], 'fail');

        case SALE_CENTER_RESET_SPECIAL_PROMOTION:
            return $initialState;


        default:
            return $$state;
    }
};
