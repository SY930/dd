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
        // const shopSchema = props.shopSchema.getIn(['shopSchema']).toJS();
        console.log(props.data, 'props.data>>>>>>')
        this.state = {
            // dynamicShopSchema: shopSchema, // 随品牌的添加删除而变化
            selections: props.data.shopID ? props.data.shopID : [],
            brands: [],
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
        // this.loadShopSchema();
        // this.setState({ allShopsSet: !!promotionBasicInfo.get('$filterShops').toJS().allShopSet });
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
        if (this.props.promotionScopeInfo.getIn(['refs', 'data', 'shops']).size > 0 && this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']).size > 0) {
            const _stateFromRedux = this.props.promotionScopeInfo.getIn(['$scopeInfo']).toJS();
            // const {
            // } = _stateFromRedux;
            this.setState({
                brands: _stateFromRedux.brands,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        // const previousSchema = this.state.shopSchema;
        // const nextShopSchema = nextProps.shopSchema.getIn(['shopSchema']).toJS();
        // if (!isEqual(previousSchema, nextShopSchema)) {
        //     this.setState({shopSchema: nextShopSchema, // 后台请求来的值
        //         dynamicShopSchema: nextShopSchema, // 随品牌的添加删除而变化
        //     });
        // }
        if (nextProps.promotionBasicInfo.get('$filterShops').toJS().shopList) {
            this.setState({ filterShops: nextProps.promotionBasicInfo.get('$filterShops').toJS().shopList })
        } else {
            this.setState({ filterShops: [] })
        }
        // this.setState({ allShopsSet: !!nextProps.promotionBasicInfo.get('$filterShops').toJS().allShopSet });
         console.log(this.props.promotionScopeInfo.getIn(['refs', 'data']), 'this.props.promotionScopeInfo.getIn(');
        if (JSON.stringify(nextProps.promotionScopeInfo.getIn(['refs', 'data'])) !=
            JSON.stringify(this.props.promotionScopeInfo.getIn(['refs', 'data']))) {
            const _data = Immutable.Map.isMap(nextProps.promotionScopeInfo.getIn(['$scopeInfo'])) ?
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']).toJS() :
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']);
            this.setState({
                brands: _data.brands,
            });
        }
    }

    // countIsRequire(shopList) {
    //     const { promotionScopeInfo, isNew } = this.props;
    //     const { size } = promotionScopeInfo.getIn(['refs', 'data', 'shops']);
    //     const oldShops = promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS();
    //     const { length } = shopList;
    //     // a 新建营销活动，先获取此集团的所有店铺数据，如果此用户为全部店铺权限，表单内店铺组件非必选
    //     // 如果用户权限为某几个店铺的权限，组件为必选项。
    //     // b 编辑活动，全部店铺权限用户非必选
    //     // 店铺受限用户，首先判断历史数据是否是全部店铺的数据，如果是，店铺组件为非必选。
    //     // 反之，店铺为必选，用户必选一个用户权限之内的店铺选项。
    //     if (isNew) {
    //         if (length < size) {
    //             this.setState({ isRequire: true });
    //             return;
    //         }
    //         this.setState({ isRequire: false });
    //     } else {
    //         if (oldShops[0] && length < size) {
    //             this.setState({ isRequire: true });
    //             return;
    //         }
    //         this.setState({ isRequire: false });
    //     }
    // }

    // async loadShopSchema() {
    //     const { data } = await axios.post('/api/shopapi/schema', {});
    //     const { brands } = data;
    //     this.setState({
    //         brandList: brands,
    //     });
    //     // this.countIsRequire(shops);
    // }

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
            console.log("🚀 ~ file: ScopeInfo.jsx ~ line 146 ~ ScopeInfo ~ states", states)
        }
        return flag || isPrev;
	}

    editBoxForShopsChange = (val) => {
        this.setState({
            selections: val,
            // shopStatus: val.length > 0,
        });
    }

    render() {
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const { brands, allShopSet, selections, isRequire } = this.state;
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
                    value={selections}
                    brandList={brands}
                    onChange={this.editBoxForShopsChange}
                    filterParm={isFilterShopType(promotionType) ? { productCode: 'HLL_CRM_License' } : {}}
                />
                {allShopSet ?
                    <p style={{ color: '#e24949' }}>同时段内，店铺已被其它同类活动全部占用, 请返回第一步重新选择时段</p>
                    : null}
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
