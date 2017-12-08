/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-28T11:03:26+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: NewRandomCutActivity.jsx
* @Last modified by:   xf
* @Last modified time: 2017-03-28T19:26:57+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


import NewPromotion from '../common/NewPromotion';
import {connect} from 'react-redux';
import {saleCenterAddNewActivityAC, saleCenterUpdateNewActivityAC} from '../../../redux/actions/saleCenter/promotion.action';
import {initialFullCutDataAC} from '../../../redux/actions/saleCenter/fullCutActivity.action';
import {saleCenterResetBasicInfoAC} from '../../../redux/actions/saleCenter/promotionBasicInfo.action';
import {saleCenterResetDetailInfoAC} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';
import {saleCenterResetScopeInfoAC} from '../../../redux/actions/saleCenter/promotionScopeInfo.action';
class NewRandomCutActivity extends NewPromotion {
    constructor(props){
        super(props);
    }
}

const mapStateToProps = (state) => {
    return {
        fullCut: state.fullCut,
        promotionBasicInfo:state.promotionBasicInfo,
        promotionScopeInfo:state.promotionScopeInfo,
        promotionDetailInfo:state.promotionDetailInfo,
        user: state.user
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        initialData: (opts) => {
            dispatch(initialFullCutDataAC(opts));
        },
        addNewPromotion: (opts)=>{
            dispatch(saleCenterAddNewActivityAC(opts));
        },
        updateNewPromotion: (opts)=>{
            dispatch(saleCenterUpdateNewActivityAC(opts));
        },
        clear: ()=>{
            dispatch(saleCenterResetBasicInfoAC());
            dispatch(saleCenterResetDetailInfoAC());
            dispatch(saleCenterResetScopeInfoAC());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewRandomCutActivity);
