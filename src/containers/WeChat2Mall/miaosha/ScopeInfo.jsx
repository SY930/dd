import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Form, message } from 'antd'
// import { axios } from '@hualala/platform-base';
// import { isEqual } from 'lodash';
import ShopSelector from '../../../components/ShopSelector';
import { isFilterShopType } from '../../../helpers/util'
import { getPromotionShopSchema, fetchPromotionScopeInfo, saleCenterSetScopeInfoAC } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';

const Immutable = require('immutable');

export class ScopeInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selections: props.data.shopIDs ? props.data.shopIDs : [],
            // brands: [],
            isRequire: true,
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: () => this.handleSubmit(true),
            next: () => this.handleSubmit(),
            finish: undefined,
            cancel: undefined,
        });
        const { promotionBasicInfo, promotionScopeInfo, fetchPromotionScopeInfoAC } = this.props;
        const promotionType = promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        if (!promotionScopeInfo.getIn(['refs', 'initialized'])) {
            let parm = {}
            if (isFilterShopType(promotionType)) {
                parm = { productCode: 'HLL_CRM_License' }
            }
            fetchPromotionScopeInfoAC({ _groupID: this.props.user.toJS().accountInfo.groupID, ...parm });
        }
        if (this.props.user.toJS().shopID <= 0) {
            let parm = {}
            if (isFilterShopType(promotionType)) {
                parm = { productCode: 'HLL_CRM_License' }
            }
            getPromotionShopSchema({ groupID: this.props.user.toJS().accountInfo.groupID, ...parm });
        }
    }

	handleSubmit = (isPrev) => {
	    // const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
	    let flag = true;
	    this.props.form.validateFieldsAndScroll((err1, basicValues) => {
	        if (err1) {
	            flag = false;
	        }
	    });
		const { selections } = this.state;
		if (selections.length === 0 && !this.props.user.toJS().shopID > 0) {
			flag = false;
            message.warning('请选择适用店铺')
		}
		if(!this.props.user.toJS().shopID) {
            const { isRequire } = this.state;
            if (isRequire && !selections[0]) {
                flag = false;
            }
        }
		if (flag) {
            const states = {
                brands: this.state.selections,
            }
            if (this.props.user.toJS().shopID > 0 && this.props.isNew) {
                states.shopsInfo = [{ shopID: this.props.user.toJS().shopID }];
            }
            // this.props.onChange({
            //     shopID: states.brands,
            // })
            this.props.saleCenterSetScopeInfo(states); // 把选择的商品存入redux
        }
        return flag || isPrev;
	}

    editBoxForShopsChange = (val) => {
        this.setState({
            selections: val,
        });
    }

    render() {
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const { selections, isRequire } = this.state;
        const valid = (isRequire && !selections[0]);
        return (
            <Form.Item
                label={'适用店铺'}
                // className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
                required={isRequire}
                validateStatus={valid ? 'error' : 'success'}
                help={valid ? '不得为空' : null}
            >

                <ShopSelector
                    value={selections.map(v => String(v))}
                    // brandList={brands}
                    onChange={this.editBoxForShopsChange}
                    filterParm={isFilterShopType(promotionType) ? { productCode: 'HLL_CRM_License' } : {}}
                />
            </Form.Item>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user,
        shopSchema: state.sale_shopSchema_New,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        // myActivities: state.sale_myActivities_NEW,
        // isUpdate: state.sale_myActivities_NEW.get('isUpdate'),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saleCenterSetScopeInfo: (opts) => {
            dispatch(saleCenterSetScopeInfoAC(opts));
        },

        fetchPromotionScopeInfoAC: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        getPromotionShopSchema: (opts) => {
            dispatch(getPromotionShopSchema(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ScopeInfo))
