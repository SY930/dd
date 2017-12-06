
import NewPromotion from '../common/NewPromotion';
import { connect } from 'react-redux';
import { saleCenterAddNewActivityAC, saleCenterUpdateNewActivityAC } from '../../../redux/actions/saleCenterNEW/promotion.action';
import { initialFullCutDataAC } from '../../../redux/actions/saleCenterNEW/fullCutActivity.action';
import { saleCenterResetBasicInfoAC } from '../../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import { saleCenterResetDetailInfoAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { saleCenterResetScopeInfoAC } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';

class NewCompositeActivity extends NewPromotion {
    constructor(props) {
        super(props);
    }
}

const mapStateToProps = (state) => {
    return {
        fullCut: state.fullCut_NEW,
        promotionBasicInfo: state.promotionBasicInfo_NEW,
        promotionScopeInfo: state.promotionScopeInfo_NEW,
        promotionDetailInfo: state.promotionDetailInfo_NEW,
        user: state.user,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        initialData: (opts) => {
            dispatch(initialFullCutDataAC(opts));
        },
        addNewPromotion: (opts) => {
            dispatch(saleCenterAddNewActivityAC(opts));
        },
        updateNewPromotion: (opts) => {
            dispatch(saleCenterUpdateNewActivityAC(opts));
        },
        clear: () => {
            dispatch(saleCenterResetBasicInfoAC());
            dispatch(saleCenterResetDetailInfoAC());
            dispatch(saleCenterResetScopeInfoAC());
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewCompositeActivity);

