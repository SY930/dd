/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-15T10:50:38+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Checkbox,
    Form,
    Select,
    Tree,
    Input,
    Radio
} from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

import styles from '../ActivityPage.less';
import {isEqual, uniq } from 'lodash';
import ShopSelector from '../../../components/common/ShopSelector';
if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';


import { getPromotionShopSchema, fetchPromotionScopeInfo, saleCenterSetScopeInfoAC, saleCenterGetShopByParamAC, SCENARIOS } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import EditBoxForShops from './EditBoxForShops';

const Immutable = require('immutable');

const plainOptions = [
    {
        label: '预定',
        value: '10',
    }, {
        label: '闪吃',
        value: '11',
    }, {
        label: '外送',
        value: '20',
    }, {
        label: '堂食',
        value: '31',
    }, {
        label: '自提',
        value: '21',
    },
];

const shopTreeData = [];

class PromotionScopeInfo extends React.Component {
    constructor(props) {
        super(props);

        const shopSchema = props.shopSchema.getIn(['shopSchema']).toJS();
        this.state = {
            cities: [],
            areas: [],
            shops: [],
            $brands: [],
            showShops: [],
            // treeData
            cityAreasShops: [],
            shopSchema, // 后台请求来的值
            dynamicShopSchema: shopSchema, // 随品牌的添加删除而变化
            // redux
            channel: '0',
            auto: '0',
            orderType: ['31'],
            // be caution, state key is diff with redux key.
            brands: [],
            shopsInfo: [],
            selections: [],
            initialized: false,
            voucherVerify: '0',
            voucherVerifyChannel: '1',
            points: '1',
            evidence: '0',
            invoice: '0',
            shopStatus: 'success',
            usageMode: 1,
            filterShops: [],
            allShopsSet: false
        };

        // bind this.
        this.handleBrandChange = this.handleBrandChange.bind(this);
        this.handleScenarioChange = this.handleScenarioChange.bind(this);
        this.handleAutoModeChange = this.handleAutoModeChange.bind(this);
        this.handleBusinessChange = this.handleBusinessChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderShopsOptions = this.renderShopsOptions.bind(this);
        this.editBoxForShopsChange = this.editBoxForShopsChange.bind(this);
        this.handleVoucherVerifyChange = this.handleVoucherVerifyChange.bind(this);
        this.handleVoucherVerifyChannelChange = this.handleVoucherVerifyChannelChange.bind(this);
        this.onPointsChange = this.onPointsChange.bind(this);
        this.onEvidenceChange = this.onEvidenceChange.bind(this);
        this.renderUsageMode = this.renderUsageMode.bind(this);
    }
    handleSubmit(isPrev) {
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                flag = false;
            }
            if (this.state.orderType.length == 0) {
                flag = false;
            }
        });
        if (promotionType == '5010' && this.state.selections.length == 0 && !this.props.user.toJS().shopID > 0) {
            flag = false;
            this.setState({ shopStatus: false })
        } else {
            this.setState({ shopStatus: true })
        }
        if (flag) {
            this.props.saleCenterSetScopeInfo({
                channel: this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType']) == '5010' ? 'WECHAT' : this.state.channel,
                auto: this.state.auto,
                orderType: this.state.orderType,
                brands: this.state.brands,
                shopsInfo: this.props.user.toJS().shopID > 0 ? [{ shopID: this.props.user.toJS().shopID }] : this.state.selections,
                voucherVerify: this.state.voucherVerify,
                voucherVerifyChannel: this.state.voucherVerifyChannel,
                points: this.state.points,
                invoice: this.state.invoice,
                evidence: this.state.evidence,
                usageMode: this.state.usageMode,
            });
        }
        return flag || isPrev;
    }

    componentDidMount() {
        // this.props.getSubmitFn(this.handleSubmit);
        this.props.getSubmitFn({
            prev: () => this.handleSubmit(true),
            next: () => this.handleSubmit(),
            finish: undefined,
            cancel: undefined,
        });

        const { promotionScopeInfo, fetchPromotionScopeInfo, getPromotionShopSchema, promotionBasicInfo } = this.props;
        if (promotionBasicInfo.get('$filterShops').toJS().shopList) {
            this.setState({filterShops: promotionBasicInfo.get('$filterShops').toJS().shopList})
        }
        this.setState({allShopsSet: !!promotionBasicInfo.get('$filterShops').toJS().allShopSet});

        if (!promotionScopeInfo.getIn(['refs', 'initialized'])) {
            fetchPromotionScopeInfo({ _groupID: this.props.user.toJS().accountInfo.groupID });
        }
        if (this.props.user.toJS().shopID <= 0) {
            getPromotionShopSchema({groupID: this.props.user.toJS().accountInfo.groupID});
        }

        if (this.props.promotionScopeInfo.getIn(['refs', 'data', 'shops']).size > 0 && this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']).size > 0) {
            const _stateFromRedux = this.props.promotionScopeInfo.getIn(['$scopeInfo']).toJS();
            const {
                voucherVerify,
                voucherVerifyChannel,
                points,
                evidence,
                invoice = '0',
            } = _stateFromRedux;

            this.setState({
                voucherVerify,
                voucherVerifyChannel,
                points,
                evidence,
                invoice,
                brands: _stateFromRedux.brands,
                channel: _stateFromRedux.channel,
                auto: _stateFromRedux.auto,
                orderType: _stateFromRedux.orderType,
                selections: _stateFromRedux.shopsInfo.map((item) => item.shopID || item),
                initialized: true,
                currentSelections: _stateFromRedux.shopsInfo,
                $brands: Immutable.List.isList(this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands'])) ?
                    this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']).toJS() :
                    this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']),
                usageMode: _stateFromRedux.usageMode || 1,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const previousSchema = this.state.shopSchema;
        const nextShopSchema = nextProps.shopSchema.getIn(['shopSchema']).toJS();
        if (!isEqual(previousSchema, nextShopSchema)) {
            this.setState({shopSchema: nextShopSchema, // 后台请求来的值
                dynamicShopSchema: nextShopSchema, // 随品牌的添加删除而变化
            });
        }
        if (nextProps.promotionBasicInfo.get('$filterShops').toJS().shopList) {
            this.setState({filterShops: nextProps.promotionBasicInfo.get('$filterShops').toJS().shopList})
        } else {
            this.setState({filterShops: []})
        }
        this.setState({allShopsSet: !!nextProps.promotionBasicInfo.get('$filterShops').toJS().allShopSet});

        if (JSON.stringify(nextProps.promotionScopeInfo.getIn(['refs', 'data'])) !=
            JSON.stringify(this.props.promotionScopeInfo.getIn(['refs', 'data']))) {
            const _data = Immutable.Map.isMap(nextProps.promotionScopeInfo.getIn(['$scopeInfo'])) ?
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']).toJS() :
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']);
            this.setState({
                brands: _data.brands,
                channel: _data.channel,
                auto: _data.auto,
                orderType: _data.orderType,
                // TODO: shopsIdInfo converted to shopsInfo
                selections: _data.shopsInfo.map(item => item.shopID || item),
                currentSelections: _data.shopsInfo,
                $brands: Immutable.List.isList(nextProps.promotionScopeInfo.getIn(['refs', 'data', 'brands'])) ?
                    nextProps.promotionScopeInfo.getIn(['refs', 'data', 'brands']).toJS() :
                    nextProps.promotionScopeInfo.getIn(['refs', 'data', 'brands']),
                initialized: true,
                usageMode: _data.usageMode || 1,
            });
        }
    }

    // save brand data to store
    handleBrandChange(value) {
        this.setState({ brands: value, selections: []});
    }
    onPointsChange(val) {
        this.setState({ points: val })
    }
    onEvidenceChange(val) {
        this.setState({ evidence: val })
    }
    handleVoucherVerifyChange(val) {
        this.setState({ voucherVerify: val });
    }

    handleVoucherVerifyChannelChange(val) {
        this.setState({ voucherVerifyChannel: val });
    }

    getFilteredShopSchema() {
        const availableBrands = this.state.brands;
        let dynamicShopSchema = Object.assign({}, this.state.shopSchema);
        if (dynamicShopSchema.shops.length === 0) {
            return dynamicShopSchema;
        }
        if (availableBrands instanceof Array && availableBrands.length > 0) {
            dynamicShopSchema.shops = dynamicShopSchema.shops.filter(shop => availableBrands.includes(shop.brandID));
        }
        if (this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType']) == '5010') {
            dynamicShopSchema.shops = dynamicShopSchema.shops.filter(shop => !this.state.filterShops.includes(shop.shopID));
        }
        const shops = dynamicShopSchema.shops;
        const availableCities = uniq(shops.map(shop => shop.cityID));
        const availableBM = uniq(shops.map(shop => shop.businessModel));
        const availableCategories = uniq(shops.map(shop => shop.shopCategoryID)
            .reduce((accumulateArr, currentCategoryIDString) => {
                accumulateArr.push(...(currentCategoryIDString || '').split(','));
                return accumulateArr;
            }, []));
        dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels.filter(collection => availableBM.includes(collection.businessModel)) : [];
        dynamicShopSchema.citys = dynamicShopSchema.citys && dynamicShopSchema.citys instanceof Array ?  dynamicShopSchema.citys.filter(collection => availableCities.includes(collection.cityID)) : [];
        dynamicShopSchema.shopCategories = dynamicShopSchema.shopCategories && dynamicShopSchema.shopCategories instanceof Array ? dynamicShopSchema.shopCategories.filter(collection => availableCategories.includes(collection.shopCategoryID)) : [];
        if (availableBrands instanceof Array && availableBrands.length > 0) {
            dynamicShopSchema.brands = dynamicShopSchema.brands.filter(brandCollection => availableBrands.includes(brandCollection.brandID));
            // console.log('filteredBrands:', dynamicShopSchema.brands);
        } else {// all brands
            const allBrands = uniq(shops.map(shop => shop.brandID));
            dynamicShopSchema.brands = dynamicShopSchema.brands.filter(brandCollection => allBrands.includes(brandCollection.brandID));
        }
        // console.log(dynamicShopSchema);
        return dynamicShopSchema;
    }

    renderBrandFormItem() {
        const _brands = this.state.$brands;
        let options;
        if (this.state.initialized) {
            if (typeof _brands === 'object' && _brands.length > 0) {
                options = _brands.map((brand, idx) => {
                    return (
                        <Option value={brand.brandID} key={idx}>{brand.brandName}</Option>
                    );
                })
            } else {
                options = (<Option value={'0'} disabled={true}>暂无数据</Option>);
            }
        } else {
            options = (<Option value={'0'} disabled={true}>数据加载中....</Option>);
        }

        const _brandList = {
            multiple: true,
            allowClear: true,
            showSearch: false,
            filterOption: false,
            placeholder: '全部品牌',
            onChange: this.handleBrandChange,
            defaultValue: this.state.brands,
            value: this.state.brands,
        };
        return (
            <Form.Item
                label="适用品牌"
                wrapperCol={{
                    span: 17,
                }}
                labelCol={{
                    span: 4,
                }}
                hasFeedback={true}
                className={styles.FormItemStyle}
            >
                <Select {..._brandList}
                        size="default"
                        getPopupContainer={(node) => node.parentNode}
                >
                    {options}
                </Select>

            </Form.Item>
        );
    }

    handleScenarioChange(value) {
        // 'WECHAT', autoMode should be YES '1';
        this.setState({
            channel: value,
            auto: (value === '2')
                ? '0'
                : this.state.auto,
        });
    }

    handleAutoModeChange(value) {
        this.setState({ auto: value });
    }

    renderChannelList() {
        return (
            <FormItem
                label="适用场景"
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 17,
                }}
                className={[styles.FormItemStyle, styles.yzTxt].join(' ')}
            >
                <Col span={24}>
                    <Select
                        size="default"
                        onChange={this.handleScenarioChange}
                        value={this.state.channel}
                        getPopupContainer={(node) => node.parentNode}
                        defaultValue={'0'}
                    >
                        {SCENARIOS.map((scenario, index) => {
                            return (
                                <Option key={index} value={scenario.value}>{scenario.name}</Option>
                            );
                        })}
                    </Select>
                </Col>
                <Col span={0} className={styles.autoStyle}>
                    <div>自动执行</div>
                </Col>
                <Col span={0}>
                    <Select
                        size="default"
                        onChange={this.handleAutoModeChange}
                        defaultValue={'0'}
                        getPopupContainer={(node) => node.parentNode}
                        value={this.state.auto}
                        disabled={this.state.channel == '2'}
                    >
                        <Option value={'1'}>是</Option>
                        <Option value={'0'}>否</Option>
                    </Select>
                </Col>
            </FormItem>
        );
    }

    handleBusinessChange(value) {
        this.setState({ orderType: value });
    }

    handleInvoiceChange = (v) => {
        this.setState({ invoice: v })
    }

    renderBusinessOptions() {
        return (
            <Form.Item
                label="适用业务"
                className={styles.FormItemStyle}
                labelCol={{
                    span: 4,
                }}
                validateStatus={this.state.orderType.length
                    ? 'success'
                    : 'error'}
                help={!this.state.orderType.length
                    ? '请选择适用业务'
                    : null}
                wrapperCol={{
                    span: 17,
                }}
            >
                <CheckboxGroup
                    onChange={this.handleBusinessChange}
                    options={plainOptions}
                    value={this.state.orderType}
                    defaultValue={this.state.orderType}
                />
            </Form.Item>
        );
    }

    renderShopsOptions() {
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        return (
            <Form.Item
                label="适用店铺"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
                required={promotionType == '5010'}
                validateStatus={promotionType != '5010' ? 'success' : this.state.shopStatus ? 'success' : 'error'}
                help={promotionType != '5010' ? null : this.state.shopStatus ? null : '必须选择店铺'}
            >
                <ShopSelector
                    value={this.state.selections}
                    schemaData={this.getFilteredShopSchema()}
                    onChange={
                        this.editBoxForShopsChange
                    }
                />
                {
                    this.state.allShopSet ?
                        <p style={{ color: '#e24949' }}>同时段内，店铺已被其它同类活动全部占用, 请返回第一步重新选择时段</p>
                        : null
                }
            </Form.Item>
        );
    }

    renderGroup() {
        return (
            <div>
                <Form.Item
                    label="是否核销"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Col span={this.state.voucherVerify == '1' ? 12 : 24}>
                        <Select
                            size="default"
                            onChange={this.handleVoucherVerifyChange}
                            value={this.state.voucherVerify}
                            getPopupContainer={(node) => node.parentNode}
                            defaultValue={this.state.voucherVerify}
                        >
                            <Option value="0">否</Option>
                            <Option value="1">是</Option>
                        </Select>
                    </Col>
                    {
                        this.state.voucherVerify == '1' ?
                            <div>
                                <Col span={5} offset={1} className={styles.autoStyle}><span>核销渠道</span></Col>
                                <Col span={6}>
                                    <Select
                                        size="default"
                                        onChange={this.handleVoucherVerifyChannelChange}
                                        value={this.state.voucherVerifyChannel}
                                        getPopupContainer={(node) => node.parentNode}
                                        defaultValue={this.state.voucherVerifyChannel}
                                    >
                                        <Option value="1">美团点评</Option>
                                        <Option value="2">百度糯米</Option>
                                    </Select>
                                </Col></div>
                            : null
                    }
                </Form.Item>
                <Form.Item
                    label="是否参与积分"
                    className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Col span={12}>
                        <Select
                            size="default"
                            onChange={this.onPointsChange}
                            value={this.state.points}
                            getPopupContainer={(node) => node.parentNode}
                            defaultValue={'1'}
                        >
                            <Option value="0">否</Option>
                            <Option value="1">是</Option>
                        </Select>
                    </Col>
                    <Col span={5} offset={1} className={styles.autoStyle}><span>是否实物凭证</span></Col>
                    <Col span={6}>
                        <Select
                            size="default"
                            onChange={this.onEvidenceChange}
                            value={this.state.evidence}
                            getPopupContainer={(node) => node.parentNode}
                            defaultValue={'0'}
                        >
                            <Option value="0">否</Option>
                            <Option value="1">是</Option>
                        </Select>
                    </Col>
                </Form.Item>
                <Form.Item
                    label="是否参与开发票"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Col span={12}>
                        <Select
                            size="default"
                            onChange={this.handleInvoiceChange}
                            value={this.state.invoice}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            <Option value="0">否</Option>
                            <Option value="1">是</Option>
                        </Select>
                    </Col>
                </Form.Item>
            </div>
        );
    }

    editBoxForShopsChange(val) {
        this.setState({
            selections: val,
            shopStatus: val.length > 0,
        });
    }
    renderUsageMode() {
        let detail = this.props.myActivities.getIn(['$promotionDetailInfo', 'data', 'promotionInfo', 'master']);
        detail = detail ? detail.toJS() : {};
        return (
            <Form.Item
                label="活动使用模式"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup value={this.state.usageMode || 1} onChange={(e) => this.setState({ usageMode: e.target.value })}>
                    <Radio value={1}
                        disabled={detail.promotionIDStr && detail.usageMode == 2}
                    >普通活动</Radio>
                    <Radio value={2}>活动券</Radio>
                </RadioGroup>
            </Form.Item>
        )
    }

    render() {
        const promotionType = this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType'])
        return (
            <Form className={styles.FormStyle}>
                {this.props.user.toJS().shopID > 0 ? null : this.renderBrandFormItem()}
                {promotionType != '5010' ? this.renderChannelList() : null}
                {this.renderBusinessOptions()}
                {this.props.user.toJS().shopID > 0 ? null : this.renderShopsOptions()}
                {promotionType == '4010' ? this.renderGroup() : null}
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user,
        shopSchema: state.sale_shopSchema_New,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        myActivities: state.sale_myActivities_NEW,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        saleCenterGetShopByParam: (opts) => {
            dispatch(saleCenterGetShopByParamAC(opts));
        },

        saleCenterSetScopeInfo: (opts) => {
            dispatch(saleCenterSetScopeInfoAC(opts));
        },

        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        getPromotionShopSchema: (opts) => {
            dispatch(getPromotionShopSchema(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PromotionScopeInfo));
