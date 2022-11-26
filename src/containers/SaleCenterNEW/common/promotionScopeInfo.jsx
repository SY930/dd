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
    Radio,
    Tooltip,
    Icon,
    message
} from 'antd';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
import { axios, getStore } from '@hualala/platform-base';
import styles from '../ActivityPage.less';
import { isEqual, uniq } from 'lodash';
import ShopSelector from '../../../components/ShopSelector';
import { getPromotionShopSchema, fetchPromotionScopeInfo, saleCenterSetScopeInfoAC, saleCenterGetShopByParamAC, SCENARIOS, fetchFilterShops } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';
import { isFilterShopType } from '../../../helpers/util'

const Immutable = require('immutable');



const shopTreeData = [];
// 买减、买折活动增加团购订单，白名单开放
const WhiteGroup = ['11157', '189702', '345780']

@injectIntl()
class PromotionScopeInfo extends React.Component {
    constructor(props) {
        super(props);

        const shopSchema = props.shopSchema.getIn(['shopSchema']).toJS();
        const ifOffLine = props.promotionBasicInfo.get('$basicInfo').toJS().promotionType === '1021'
        const ifGroupSale = props.promotionBasicInfo.get('$basicInfo').toJS().promotionType == '10071'
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
            channel: ifOffLine ? '1' : '0',
            auto: '0',
            orderType: ['31'],
            // be caution, state key is diff with redux key.
            brands: [],
            shopsInfo: [],
            selections: ifGroupSale ? this.props.data.shopIDs || [] : this.props.promotionScopeInfo.getIn(['$scopeInfo']).toJS().shopsInfo || [],
            initialized: false,
            voucherVerify: '0',
            voucherVerifyChannel: '1',
            points: '1',
            evidence: '0',
            invoice: '0',
            shopStatus: 'success',
            usageMode: 1,
            filterShops: [],
            allShopsSet: false,
            brandList: [],
            isRequire: true,
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
            if (this.state.orderType.length == 0 && promotionType !== '2090') {
                flag = false;
            }
        });
        const { selections } = this.state;
        if ((promotionType == '5010' || promotionType == '5020' || promotionType == '10071') && selections.length == 0 && !this.props.user.toJS().shopID > 0) {
            flag = false;
            message.warning('请选择适用店铺')
            this.setState({ shopStatus: false })
        } else {
            this.setState({ shopStatus: true })
        }
        if ((!this.props.user.toJS().shopID && promotionType !== '2090')) {
            const { isRequire } = this.state;
            if (isRequire && !selections[0]) {
                flag = false;
            }
        }
        if (promotionType == '10071') {
            this.props.onChange({
                shopIDs: selections,
            });
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
                states.shopsInfo = [{ shopID: this.props.user.toJS().shopID }];
            } else {
                states.shopsInfo = this.state.selections;
                // 授权门店过滤
                if (isFilterShopType(promotionType)) {
                    let dynamicShopSchema = Object.assign({}, this.props.shopSchema.toJS());
                    let { shopSchema = {} } = dynamicShopSchema
                    let { shops = [] } = shopSchema
                    let { shopsInfo = [] } = states
                    states.shopsInfo = shopsInfo.filter((item) => shops.some(i => i.shopID == item))
                }
            }

            if (promotionType === '2090'){
                states.orderType = ['20']
            }
            this.props.saleCenterSetScopeInfo(states);
        }
        return flag || isPrev;
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: () => this.handleSubmit(true),
            next: () => this.handleSubmit(),
            finish: undefined,
            cancel: undefined,
        });
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        this.loadShopSchema();
        const { promotionScopeInfo, fetchPromotionScopeInfo, getPromotionShopSchema, promotionBasicInfo } = this.props;
        if (promotionBasicInfo.get('$filterShops').toJS().shopList) {
            this.setState({ filterShops: promotionBasicInfo.get('$filterShops').toJS().shopList })
        }
        this.setState({ allShopsSet: !!promotionBasicInfo.get('$filterShops').toJS().allShopSet });

        if (!promotionScopeInfo.getIn(['refs', 'initialized'])) {
            let parm = {}
            if (isFilterShopType(promotionType)) {
                parm = { productCode: 'HLL_CRM_License' }
            }
            fetchPromotionScopeInfo({ _groupID: this.props.user.toJS().accountInfo.groupID, ...parm });
        }
        if (this.props.user.toJS().shopID <= 0) {
            let parm = {}
            if (isFilterShopType(promotionType)) {
                parm = { productCode: 'HLL_CRM_License' }
            }
            getPromotionShopSchema({ groupID: this.props.user.toJS().accountInfo.groupID, ...parm });
        }
        const basicInfo = this.props.promotionBasicInfo.get('$basicInfo').toJS()
        const isSelDefined = basicInfo.recommendType == 1
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
                channel: promotionType === '1021' ? '1' : _stateFromRedux.channel,
                auto: _stateFromRedux.auto,
                orderType: isSelDefined ? ['31'] : _stateFromRedux.orderType,
                initialized: true,
                usageMode: _stateFromRedux.usageMode || 1,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        const previousSchema = this.state.shopSchema;
        const nextShopSchema = nextProps.shopSchema.getIn(['shopSchema']).toJS();
        if (!isEqual(previousSchema, nextShopSchema)) {
            this.setState({
                shopSchema: nextShopSchema, // 后台请求来的值
                dynamicShopSchema: nextShopSchema, // 随品牌的添加删除而变化
            });
        }
        if (nextProps.promotionBasicInfo.get('$filterShops').toJS().shopList) {
            this.setState({ filterShops: nextProps.promotionBasicInfo.get('$filterShops').toJS().shopList })
        } else {
            this.setState({ filterShops: [] })
        }
        const basicInfo = nextProps.promotionBasicInfo.get('$basicInfo').toJS()
        const isSelDefined = basicInfo.recommendType == 1
        if(isSelDefined) {
            this.setState({
                orderType: ['31']
            })
        }
        this.setState({ allShopsSet: !!nextProps.promotionBasicInfo.get('$filterShops').toJS().allShopSet });
        const promotionType = nextProps.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        if (JSON.stringify(nextProps.promotionScopeInfo.getIn(['refs', 'data'])) !=
            JSON.stringify(this.props.promotionScopeInfo.getIn(['refs', 'data']))) {
            const _data = Immutable.Map.isMap(nextProps.promotionScopeInfo.getIn(['$scopeInfo'])) ?
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']).toJS() :
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']);
            const basicInfo = nextProps.promotionBasicInfo.get('$basicInfo').toJS()
            const isSelDefined = basicInfo.recommendType == 1
            this.setState({
                brands: _data.brands,
                channel: promotionType === '1021' ? '1' : _data.channel,
                auto: _data.auto,
                orderType: isSelDefined ? ['31'] : _data.orderType,
                // TODO: shopsIdInfo converted to shopsInfo
                initialized: true,
                usageMode: _data.usageMode || 1,
            });
        }
    }


    async loadShopSchema() {
        const { data } = await axios.post('/api/shopapi/schema', {});
        const { brands, shops } = data;
        this.setState({
            brandList: brands,
        });
        this.countIsRequire(shops);
    }

    // save brand data to store
    handleBrandChange(value) {
        this.setState({ brands: value, selections: [] });
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
        const activityType = this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType']);
        let dynamicShopSchema = Object.assign({}, this.state.shopSchema);
        if (dynamicShopSchema.shops.length === 0) {
            return dynamicShopSchema;
        }
        //去掉查看的店铺筛选
        if (availableBrands instanceof Array && availableBrands.length > 0) {
            dynamicShopSchema.shops = dynamicShopSchema.shops.filter(shop => availableBrands.includes(shop.brandID));
        }
        const a = this.props.isUpdate;
        if ((activityType == '5010' || activityType == '5020') && (this.props.isNew || this.props.isUpdate)) {
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
        dynamicShopSchema.businessModels = dynamicShopSchema.businessModels && dynamicShopSchema.businessModels instanceof Array ? dynamicShopSchema.businessModels : [];
        dynamicShopSchema.citys = dynamicShopSchema.citys && dynamicShopSchema.citys instanceof Array ? dynamicShopSchema.citys.filter(collection => availableCities.includes(collection.cityID)) : [];
        dynamicShopSchema.shopCategories = dynamicShopSchema.shopCategories && dynamicShopSchema.shopCategories instanceof Array ? dynamicShopSchema.shopCategories.filter(collection => availableCategories.includes(collection.shopCategoryID)) : [];
        if (availableBrands instanceof Array && availableBrands.length > 0) {
            dynamicShopSchema.brands = dynamicShopSchema.brands.filter(brandCollection => availableBrands.includes(brandCollection.brandID));
        } else {// all brands
            const allBrands = uniq(shops.map(shop => shop.brandID));
            dynamicShopSchema.brands = dynamicShopSchema.brands.filter(brandCollection => allBrands.includes(brandCollection.brandID));
        }
        return dynamicShopSchema;
    }

    renderBrandFormItem = () => {
        const { intl } = this.props;
        const k5dod8s9 = intl.formatMessage(SALE_STRING.k5dod8s9);
        const k5m5ay7o = intl.formatMessage(SALE_STRING.k5m5ay7o);

        const _brands = this.state.brandList;
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
                    placeholder='请选择品牌，不选默认全部品牌可用'
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
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        if (this.props.isOnline || promotionType == '5020' || promotionType == '2090') return null
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
                        disabled={promotionType === '1021'}
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
                    <Tooltip title={
                        <p>
                            <p>仅线下使用：指云店pos、点菜宝、云店pad、大屏等由门店下单场景</p>
                            <p>仅线上使用：指线上餐厅、小程序等由用户自助下单场景</p>
                        </p>
                    }>
                        <Icon
                            type={'question-circle'}
                            style={{ color: '#787878' }}
                            className={styles.cardLevelTreeIcon}
                        />
                    </Tooltip>
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
        const { intl, user } = this.props;
        const { accountInfo } = user.toJS();
        const k5m67a4r = intl.formatMessage(SALE_STRING.k5m67a4r);
        const k5m67ad3 = intl.formatMessage(SALE_STRING.k5m67ad3);
        const k5m67alf = intl.formatMessage(SALE_STRING.k5m67alf);
        const k5krn7fx = intl.formatMessage(SALE_STRING.k5krn7fx);
        const k5m67atr = intl.formatMessage(SALE_STRING.k5m67atr);
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const basicInfo = this.props.promotionBasicInfo.get('$basicInfo').toJS()
        const isSelDefined = basicInfo.recommendType == 1
        if (this.props.isOnline || promotionType == '2090') return null;
        let plainOptions = null;
        if (promotionType == '5020') {
            plainOptions = [
                {
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
        } else {
            plainOptions = [
                {
                    label: k5m67a4r,
                    value: '10',
                    disabled: isSelDefined
                }, {
                    label: k5m67ad3,
                    value: '11',
                    disabled: isSelDefined
                }, {
                    label: k5m67alf,
                    value: '20',
                    disabled: isSelDefined
                }, {
                    label: k5krn7fx,
                    value: '31',
                }, {
                    label: k5m67atr,
                    value: '21',
                    disabled: isSelDefined
                },
            ];
        }
        if (promotionType === '2040' && WhiteGroup.includes(`${accountInfo.groupID}`)) {
            plainOptions = [...plainOptions, { label: '团购订单', value: '60', disabled: isSelDefined }]
        }
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
                    disabled={promotionType === '1021'}
                />
            </Form.Item>
        );
    }
    countIsRequire(shopList) {
        const { promotionScopeInfo, isNew } = this.props;
        const { size } = promotionScopeInfo.getIn(['refs', 'data', 'shops']);
        const oldShops = promotionScopeInfo.getIn(['$scopeInfo', 'shopsInfo']).toJS();
        const { length } = shopList;
        // a 新建营销活动，先获取此集团的所有店铺数据，如果此用户为全部店铺权限，表单内店铺组件非必选
        // 如果用户权限为某几个店铺的权限，组件为必选项。
        // b 编辑活动，全部店铺权限用户非必选
        // 店铺受限用户，首先判断历史数据是否是全部店铺的数据，如果是，店铺组件为非必选。
        // 反之，店铺为必选，用户必选一个用户权限之内的店铺选项。
        if (isNew) {
            if (length < size) {
                this.setState({ isRequire: true });
                return;
            }
            this.setState({ isRequire: false });
        } else {
            if (oldShops[0] && length < size) {
                this.setState({ isRequire: true });
                return;
            }
            this.setState({ isRequire: false });
        }
    }
    renderShopsOptions() {
        const promotionType = this.props.promotionBasicInfo.get('$basicInfo').toJS().promotionType;
        const { brands, shopStatus, allShopSet, selections, isRequire, filterShops } = this.state;
        if (promotionType == '5010' || promotionType == '2090') {
            return (
                <Form.Item
                    label={SALE_LABEL.k5dlggak}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    required={promotionType == '5010'}
                    validateStatus={shopStatus ? 'success' : 'error'}
                    help={shopStatus ? null : SALE_LABEL.k5hkj1ef}
                >
                    <ShopSelector
                        value={selections}
                        brandList={brands}
                        // schemaData={this.getFilteredShopSchema()}
                        onChange={
                            this.editBoxForShopsChange
                        }
                        eventWay={promotionType}
                        filterShopIds={promotionType === '2090' ? filterShops : []}// 配送费减免引入过滤店铺
                    />
                    {allShopSet ?
                        <p style={{ color: '#e24949' }}>{SALE_LABEL.k5m67b23}</p>
                        : null}
                </Form.Item>
            );
        }
        const valid = (isRequire && !selections[0]);
        return (
            <Form.Item
                label={SALE_LABEL.k5dlggak}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
                required={promotionType == '5020' || promotionType == '10071' ? true : isRequire}
                validateStatus={valid ? 'error' : 'success'}
                help={valid ? SALE_LABEL.k5hkj1ef : null}
            >
                {promotionType == '5020' && <p>一个店铺仅能参与一个会员专属菜活动</p>}
                {promotionType == '5020' ?
                    <ShopSelector
                        value={selections}
                        brandList={brands}
                        onChange={this.editBoxForShopsChange}
                        filterShopIds={filterShops}//会员专属菜引入过滤店铺
                    /> :
                    <ShopSelector
                        value={selections}
                        brandList={brands}
                        onChange={this.editBoxForShopsChange}
                        filterParm={isFilterShopType(promotionType) ? { productCode: 'HLL_CRM_License' } : {}}
                    />
                }
                {allShopSet ?
                    <p style={{ color: '#e24949' }}>{SALE_LABEL.k5m67b23}</p>
                    : null}
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
            <div style={{ position: "absolute", width: '100%' }}>
                {
                    promotionType == '1030' ?
                        <div style={{ position: "absolute", left: -241, background: 'white', top: 80, width: 221, }}>
                            <p
                                style={{
                                    color: "rgba(102,102,102,1)",
                                    lineHeight: "18px",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    margin: "10px 0",
                                }}
                            >
                                <Icon
                                    style={{ color: "#FAAD14", marginRight: '6px' }}
                                    type="info-circle-o"

                                />
                                活动须知
                            </p>
                            <p
                                style={{
                                    color: "#666666",
                                    lineHeight: "18px",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    margin: "10px 0",
                                }}
                            >
                                1. 同门店同时间多个满赠活动执行顺序
                            </p>
                            <p
                                style={{
                                    color: "rgba(102,102,102,1)",
                                    lineHeight: "18px",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    margin: "10px 0",
                                    whiteSpace: "nowrap",
                                }}
                            >
                        【活动时段】>【活动周期】>【活动日期】
                            </p>
                            <p
                                style={{
                                    color: "rgba(153,153,153,1)",
                                    lineHeight: "18px",
                                    fontSize: 12,
                                    fontWeight: 500,
                                }}
                            >
                                举例：
                                <br />
                                同一个业务下，5.1～6.1
                                设置了活动A，每个月10号设置活动B，10号中午12:00~1:00设置活动C
                                <br />
                                则10号当天活动执行顺序为：12:00~1:00执行活动C；当天其他时段执行活动B；
                                当月其他日期执行活动A
                            </p>
                        </div> : null
                }
                <Form className={styles.FormStyle}>
                    {promotionType != '10071' ? (this.props.user.toJS().shopID > 0 || promotionType == '5020' ? null : this.renderBrandFormItem()) : null}
                    {promotionType != '10071' ? (promotionType != '5010' ? this.renderChannelList() : null) : null}
                    {promotionType != '10071' ? this.renderBusinessOptions() : null}
                    {this.props.user.toJS().shopID > 0 ? null : this.renderShopsOptions()}
                    {promotionType != '10071' ? (promotionType == '4010' ? this.renderGroup() : null) : null}
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
