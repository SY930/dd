/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-28T10:49:16+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: NewSpecialActivity.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-03-28T19:27:01+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import NewPromotion from '../common/NewPromotion';
import { connect } from 'react-redux';
import { saleCenterAddNewActivityAC, saleCenterUpdateNewActivityAC } from '../../../redux/actions/saleCenterNEW/promotion.action';
import { initialFullCutDataAC } from '../../../redux/actions/saleCenterNEW/fullCutActivity.action';
import { saleCenterResetBasicInfoAC } from '../../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import { saleCenterResetDetailInfoAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { saleCenterResetScopeInfoAC } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import PromotionBasicInfo from '../common/promotionBasicInfo';
import CustomProgressBar from '../common/CustomProgressBar';

class NewSpecialActivity extends NewPromotion {
    constructor(props) {
        super(props);
    }

    render() { // 基类还有一个render方法
        const {
            isNew,
            isOnline,
            user,
        } = this.props;
        const isOnlieAndShopMode = isOnline &&  user.get('shopID') > 0;
        if (!isOnlieAndShopMode) {
            return super.render();
        } 
        const steps = [
            {
                title: '基本信息',
                content: (
                    <PromotionBasicInfo
                        isNew={isNew}
                        getSubmitFn={(handles) => {
                            this.handles[0] = handles;
                        }}
                    />
                ),
            },
            {
                title: '活动内容',
                content: React.createElement(
                    this.props.component,
                    {
                        getSubmitFn: (handles) => {
                            this.handles[1] = handles;
                        },
                        onChange: (rule) => {
                            this.setState({ rule });
                        },
                        isNew,
                        isOnline,
                    }
                ),
            },
        ];
        return (
            <CustomProgressBar
                steps={steps}
                loading={this.state.loading}
                callback={(arg) => {
                    this.props.callbacktwo(arg);
                }}
                onNext={this.handleNext}
                onFinish={this.handleFinish}
                onPrev={this.handlePrev}
                onCancel={this.handleCancel}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fullCut: state.sale_fullCut_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
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

export default connect(mapStateToProps, mapDispatchToProps)(NewSpecialActivity);
