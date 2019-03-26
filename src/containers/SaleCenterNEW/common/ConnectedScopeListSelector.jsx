import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CategoryAndFoodSelector from './CategoryAndFoodSelector'


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
        return (
            <CategoryAndFoodSelector
                dishFilter={this.dishFilter}
                scopeLst={scopeLst}
                onChange={this.handleScopeLstChange}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedScopeListSelector)
