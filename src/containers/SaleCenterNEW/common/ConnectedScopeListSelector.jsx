import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CategoryAndFoodSelector from './CategoryAndFoodSelector'
import CategoryAndFoodSelectorForShop from './CategoryAndFoodSelectorForShop'
import CloseableTip from '../../../components/common/CloseableTip'
import PropTypes from 'prop-types';


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
                            <p>指定菜品：</p>
                            <p>当未选择任何分类及菜品时，会根据基本档菜品库菜品是否设置了参与打折来执行。即：所有设置了参与打折的菜品都在活动参与范围</p>
                            <p>当选择了适用菜品，则活动按照设置的菜品执行，不再受基本档菜品是否参与打折的设置影响</p>
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
