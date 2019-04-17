import React, { Component } from 'react';
import { connect } from 'react-redux';
import { saleCenterSetPromotionDetailAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import CategoryAndFoodSelector from './CategoryAndFoodSelector'


const mapStateToProps = (state) => {
    return {
        priceLst: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'priceLst']),
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

class ConnectedPriceListSelector extends Component {
    handlePriceLstChange = ({dishes}) => {
        this.props.onChange && this.props.onChange(dishes)
    }
    dishFilter = (dishArray) => {
        if (this.props.promotionType === '1070') {
            return dishArray.filter(food => food.isTempFood != '1' && food.isTempSetFood != '1')
        }
        return dishArray.filter(food => food.isSetFood != '1' && food.isTempFood != '1' && food.isTempSetFood != '1')
    }
    render() {
        let priceLst;
        if (this.props.promotionType === '5010' || this.props.promotionType === '1090') {
            priceLst = this.props.value;
        } else {
            priceLst = this.props.priceLst.toJS();
        }
        return (
            <CategoryAndFoodSelector
                dishOnly={true}
                priceLst={priceLst}
                dishFilter={this.dishFilter}
                onChange={this.handlePriceLstChange}
            />
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedPriceListSelector)
