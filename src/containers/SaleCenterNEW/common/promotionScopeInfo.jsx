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
import { getPromotionShopSchema, fetchPromotionScopeInfo, saleCenterSetScopeInfoAC, saleCenterGetShopByParamAC, SCENARIOS } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const Immutable = require('immutable');



const shopTreeData = [];

@injectIntl()
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
            selections: this.props.promotionScopeInfo.getIn(['$scopeInfo']).toJS().shopsInfo || [],
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
            const states = {
                channel: this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType']) == '5010' ? 'WECHAT' : this.state.channel,
                auto: this.state.auto,
                orderType: this.state.orderType,
                brands: this.state.brands,

                voucherVerify: this.state.voucherVerify,
                voucherVerifyChannel: this.state.voucherVerifyChannel,
                points: this.state.points,
                invoice: this.state.invoice,
                evidence: this.state.evidence,
                usageMode: this.state.usageMode,
            }
            if (this.props.user.toJS().shopID > 0 && this.props.isNew) {
                states.shopsInfo =  [{ shopID: this.props.user.toJS().shopID }];
            } else {
                states.shopsInfo = this.state.selections;
            }
            this.props.saleCenterSetScopeInfo(states);
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
                initialized: true,
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
        //去掉查看的店铺筛选
        if (availableBrands instanceof Array && availableBrands.length > 0) {
            dynamicShopSchema.shops = dynamicShopSchema.shops.filter(shop => availableBrands.includes(shop.brandID));
        }
        const a = this.props.isUpdate;
        if (this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType']) == '5010' && (this.props.isNew || this.props.isUpdate)) {
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
        } else {// all brands
            const allBrands = uniq(shops.map(shop => shop.brandID));
            dynamicShopSchema.brands = dynamicShopSchema.brands.filter(brandCollection => allBrands.includes(brandCollection.brandID));
        }
        // console.log(dynamicShopSchema);
        return dynamicShopSchema;
    }

    renderBrandFormItem = () => {
        const { intl } = this.props;
        const k5dod8s9 = intl.formatMessage(SALE_STRING.k5dod8s9);
        const k5m5ay7o = intl.formatMessage(SALE_STRING.k5m5ay7o);

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
            options = (<Option value={'0'} disabled={true}>{k5dod8s9}</Option>);
            }
        } else {
            options = (<Option value={'0'} disabled={true}>{k5m5ay7o}....</Option>);
        }

        const _brandList = {
            multiple: true,
            allowClear: true,
            showSearch: false,
            filterOption: false,
            placeholder: SALE_LABEL.k5nh23wx,
            onChange: this.handleBrandChange,
            defaultValue: this.state.brands,
            value: this.state.brands,
        };
        return (
            <Form.Item
                label={SALE_LABEL.k5dlpn4t}
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

    renderChannelList = () => {
        const { intl } = this.props;
        const k5f3y6b4 = intl.formatMessage(SALE_STRING.k5f3y6b4);
        const k5f3y6yg = intl.formatMessage(SALE_STRING.k5f3y6yg);

        if (this.props.isOnline) return null
        return (
            <FormItem
                label={SALE_LABEL.k5krn6il}
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
    <div>{SALE_LABEL.k5dbiuws}</div>
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
                    <Option value={'1'}>{k5f3y6b4}</Option>
                    <Option value={'0'}>{k5f3y6yg}</Option>
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

    renderBusinessOptions = () => {
        const { intl } = this.props;
        const k5m67a4r = intl.formatMessage(SALE_STRING.k5m67a4r);
        const k5m67ad3 = intl.formatMessage(SALE_STRING.k5m67ad3);
        const k5m67alf = intl.formatMessage(SALE_STRING.k5m67alf);
        const k5krn7fx = intl.formatMessage(SALE_STRING.k5krn7fx);
        const k5m67atr = intl.formatMessage(SALE_STRING.k5m67atr);

        if (this.props.isOnline) return null;
        const plainOptions = [
            {
                label: k5m67a4r,
                value: '10',
            }, {
                label: k5m67ad3,
                value: '11',
            }, {
                label: k5m67alf,
                value: '20',
            }, {
                label: k5krn7fx,
                value: '31',
            }, {
                label: k5m67atr,
                value: '21',
            },
        ];
        return (
            <Form.Item
                label={SALE_LABEL.k5dlpt47}
                className={styles.FormItemStyle}
                labelCol={{
                    span: 4,
                }}
                validateStatus={this.state.orderType.length
                    ? 'success'
                    : 'error'}
                help={!this.state.orderType.length
                    ? ''
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
                label={SALE_LABEL.k5dlggak}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
                required={promotionType == '5010'}
                validateStatus={promotionType != '5010' ? 'success' : this.state.shopStatus ? 'success' : 'error'}
                help={promotionType != '5010' ? null : this.state.shopStatus ? null : SALE_LABEL.k5hkj1ef}
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
                <p style={{ color: '#e24949' }}>{SALE_LABEL.k5m67b23}</p>
                        : null
                }
            </Form.Item>
        );
    }

    renderGroup = () => {
        const { intl } = this.props;
        const k5f3y6b4 = intl.formatMessage(SALE_STRING.k5f3y6b4);
        const k5f3y6yg = intl.formatMessage(SALE_STRING.k5f3y6yg);

        const k5m67bir = intl.formatMessage(SALE_STRING.k5m67bir);
        const k5m67br3 = intl.formatMessage(SALE_STRING.k5m67br3);
        return (
            <div>
                <Form.Item
                    label={SALE_LABEL.k5nh2459}
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
                        <Option value="0">{k5f3y6yg}</Option>
                        <Option value="1">{k5f3y6b4}</Option>
                        </Select>
                    </Col>
                    {
                        this.state.voucherVerify == '1' ?
                            <div>
    <Col span={5} offset={1} className={styles.autoStyle}><span>{SALE_LABEL.k5m67baf}</span></Col>
                                <Col span={6}>
                                    <Select
                                        size="default"
                                        onChange={this.handleVoucherVerifyChannelChange}
                                        value={this.state.voucherVerifyChannel}
                                        getPopupContainer={(node) => node.parentNode}
                                        defaultValue={this.state.voucherVerifyChannel}
                                    >
                                        <Option value="1">{k5m67bir}</Option>
                                        <Option value="2">{k5m67br3}</Option>
                                    </Select>
                                </Col></div>
                            : null
                    }
                </Form.Item>
                <Form.Item
                    label={SALE_LABEL.k5m67bzf}
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
                            <Option value="0">{k5f3y6yg}</Option>
                            <Option value="1">{k5f3y6b4}</Option>
                        </Select>
                    </Col>
                <Col span={5} offset={1} className={styles.autoStyle}><span>{SALE_LABEL.k5m67c7r}</span></Col>
                    <Col span={6}>
                        <Select
                            size="default"
                            onChange={this.onEvidenceChange}
                            value={this.state.evidence}
                            getPopupContainer={(node) => node.parentNode}
                            defaultValue={'0'}
                        >
                            <Option value="0">{k5f3y6yg}</Option>
                            <Option value="1">{k5f3y6b4}</Option>
                        </Select>
                    </Col>
                </Form.Item>
                <Form.Item
                    label={SALE_LABEL.k5m67cg3}
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
                            <Option value="0">{k5f3y6yg}</Option>
                            <Option value="1">{k5f3y6b4}</Option>
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
                label={SALE_LABEL.k5m6e3hf}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <RadioGroup value={this.state.usageMode || 1} onChange={(e) => this.setState({ usageMode: e.target.value })}>
                    <Radio value={1}
                        disabled={detail.promotionIDStr && detail.usageMode == 2}
                        >{SALE_LABEL.k5nh24dl}</Radio>
                    <Radio value={2}>{SALE_LABEL.k5m6e393}</Radio>
                </RadioGroup>
            </Form.Item>
        )
    }

    render() {
        const promotionType = this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType'])        
        return (
            <div style={{position: "absolute", width: '100%'}}>
                {
                    promotionType == '1030' ?
                    <div style={{position: "absolute", left: -241, background: 'white', top: 80, width: 221,}}>
                        <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, margin: '10px 0'}}>1. 同一活动时间，有多个满赠活动，活动会执行哪个？</p>
                        <p style={{color: 'rgba(153,153,153,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, }}>优先执行顺序：执行场景为配置【适用业务】的活动>配置【活动周期】的活动>配置【活动日期】的活动。</p>
                        <p style={{color: 'rgba(102,102,102,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, padding: '10px 0', borderTop: '1px solid #E9E9E9', marginTop: '7px'}}>2. 满赠活动使用注意事项</p>
                        <p style={{color: 'rgba(153,153,153,1)', lineHeight: '18px', fontSize: 12, fontWeight: 500, }}>满赠/每满赠活动与买赠、第二份打折、加价换购活动之间不受互斥规则限制，在线上餐厅都按通向执行</p>
                    </div> : null
                }
                <Form className={styles.FormStyle}>
                    {this.props.user.toJS().shopID > 0 ? null : this.renderBrandFormItem()}
                    {promotionType != '5010' ? this.renderChannelList() : null}
                    {this.renderBusinessOptions()}
                    {this.props.user.toJS().shopID > 0 ? null : this.renderShopsOptions()}
                    {promotionType == '4010' ? this.renderGroup() : null}
                </Form>
            </div>
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
        isUpdate: state.sale_myActivities_NEW.get('isUpdate'),
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
