import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CategoryAndFoodSelector from './CategoryAndFoodSelector'
import CategoryAndFoodSelectorForShop from './CategoryAndFoodSelectorForShop'
import CloseableTip from '../../../components/common/CloseableTip'
import PropTypes from 'prop-types';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';

const mapStateToProps = (state) => {
    return {
        scopeLst: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'scopeLst']),
        promotionType: state.sale_promotionBasicInfo_NEW.getIn(['$basicInfo', 'promotionType']),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
};

class ConnectedScopeListSelector extends Component {
    handleScopeLstChange = (v) => {
        this.props.setPromotionDetail({
            ...v,
            scopeLst: [],
        })
    }
    dishFilter = (dishArray) => {
        if (this.props.promotionType === '1050') {
            return dishArray.filter(food => food.isSetFood != '1' && food.isTempFood != '1' && food.isTempSetFood != '1')
        }
        return dishArray
    }
    render() {
        const scopeLst = this.props.scopeLst.toJS();
        const { isShopMode, component } = this.props;
        const Comp = component || (isShopMode ? CategoryAndFoodSelectorForShop : CategoryAndFoodSelector);
        return (
            <Comp
                dishFilter={this.dishFilter}
                scopeLst={scopeLst}
                onChange={this.handleScopeLstChange}
                scopeTip={this.props.promotionType === '2020' ? (
                    <CloseableTip content={
                        <div>
                    <p>{SALE_LABEL.k5m4pzle}：</p>
                    <p>{SALE_LABEL.k5m4pztq}</p>
                    <p>{SALE_LABEL.k5m4q022}</p>
                        </div>
                    } />
                ) : null}
            />
        )
    }
}
ConnectedScopeListSelector.propTypes = {
    isShopMode: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedScopeListSelector)
