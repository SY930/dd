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

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

import { HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';


import { fetchPromotionScopeInfo, saleCenterSetScopeInfoAC, saleCenterGetShopByParamAC, SCENARIOS } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
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


        this.state = {
            cities: [],
            areas: [],
            shops: [],
            $brands: [],
            showShops: [],
            // treeData
            cityAreasShops: [],

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
            shopStatus: 'success',
            usageMode: 1,
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
        if (promotionType == 'RECOMMEND_FOOD' && this.state.selections.length == 0 && !this.props.user.toJS().shopID > 0) {
            flag = false;
            this.setState({ shopStatus: false })
        } else {
            this.setState({ shopStatus: true })
        }
        if (flag) {
            this.props.saleCenterSetScopeInfo({
                channel: this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType']) == 'RECOMMEND_FOOD' ? 'WECHAT' : this.state.channel,
                auto: this.state.auto,
                orderType: this.state.orderType,
                brands: this.state.brands,
                shopsInfo: this.props.user.toJS().shopID > 0 ? [{ shopID: this.props.user.toJS().shopID }] : this.state.selections,
                voucherVerify: this.state.voucherVerify,
                voucherVerifyChannel: this.state.voucherVerifyChannel,
                points: this.state.points,
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

        const { promotionScopeInfo, fetchPromotionScopeInfo } = this.props;

        if (!promotionScopeInfo.getIn(['refs', 'initialized'])) {
            fetchPromotionScopeInfo({ _groupID: this.props.user.toJS().accountInfo.groupID });
        }
        if (this.props.promotionScopeInfo.getIn(['refs', 'data', 'shops']).size > 0 && this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']).size > 0) {
            const _stateFromRedux = this.props.promotionScopeInfo.getIn(['$scopeInfo']).toJS();
            const voucherVerify = _stateFromRedux.voucherVerify;
            const voucherVerifyChannel = _stateFromRedux.voucherVerifyChannel;
            const points = _stateFromRedux.points;
            const evidence = _stateFromRedux.evidence;
            this.setState({
                voucherVerify,
                voucherVerifyChannel,
                points,
                evidence,
                brands: _stateFromRedux.brands,
                channel: _stateFromRedux.channel,
                auto: _stateFromRedux.auto,
                orderType: _stateFromRedux.orderType,
                // TODO: shopsIdInfo converted to shopsInfo
                selections: _stateFromRedux.shopsInfo.map((item) => {
                    return this.props.promotionScopeInfo.getIn(['refs', 'data', 'shops']).toJS().find((shop) => {
                        shop.itemName = shop.shopName;
                        shop.itemID = shop.shopID;
                        return shop.shopID === item
                    })
                }),
                initialized: true,
                currentSelections: _stateFromRedux.shopsInfo,
                $brands: Immutable.List.isList(this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands'])) ?
                    this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']).toJS() :
                    this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']),
                initialized: true,
                usageMode: _stateFromRedux.usageMode || 1,
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.promotionScopeInfo.getIn(['refs', 'data'])) !=
            JSON.stringify(this.props.promotionScopeInfo.getIn(['refs', 'data']))) {
            const _data = Immutable.Map.isMap(nextProps.promotionScopeInfo.getIn(['$scopeInfo'])) ?
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']).toJS() :
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']);
            const $shops = Immutable.List.isList(nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shops'])) ?
                nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shops']).toJS() :
                nextProps.promotionScopeInfo.getIn(['refs', 'data', 'shops']);
            this.setState({
                brands: _data.brands,
                channel: _data.channel,
                auto: _data.auto,
                orderType: _data.orderType,
                // TODO: shopsIdInfo converted to shopsInfo
                selections: _data.shopsInfo.map((item) => {
                    if (typeof item === 'string') {
                        return $shops.find((shop) => {
                            shop.itemName = shop.shopName;
                            shop.itemID = shop.shopID;
                            return shop.shopID === item
                        })
                    }
                    return item
                }),
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
        this.setState({ brands: value });
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
                <Select {..._brandList} size="default">
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
                required={promotionType == 'RECOMMEND_FOOD'}
                validateStatus={promotionType != 'RECOMMEND_FOOD' ? 'success' : this.state.shopStatus ? 'success' : 'error'}
                help={promotionType != 'RECOMMEND_FOOD' ? null : this.state.shopStatus ? null : '必须选择店铺'}
            >
                <EditBoxForShops
                    filterBrands={this.state.brands}
                    onChange={
                        this.editBoxForShopsChange
                    }
                    handleAllShopSet={(allShopSet) => {
                        this.setState({ allShopSet })
                    }}
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
                            defaultValue={'0'}
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
        })
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

    // only the promotionScopeInfo change cause the render operation of the component
    shouldComponentUpdate(nextProps, nextState) {
        // if(this.props.promotionScopeInfo !== nextProps.promotionScopeInfo) {
        //     return true;
        // }
        //
        // return false;
        return true;
    }

    render() {
        const promotionType = this.props.promotionBasicInfo.getIn(['$basicInfo', 'promotionType'])
        return (
            <Form className={styles.FormStyle}>
                {this.props.user.toJS().shopID > 0 ? null : this.renderBrandFormItem()}
                {promotionType != 'RECOMMEND_FOOD' ? this.renderChannelList() : null}
                {this.renderBusinessOptions()}
                {this.props.user.toJS().shopID > 0 ? null : this.renderShopsOptions()}
                {promotionType == 'VOUCHER_GROUP' ? this.renderGroup() : null}
                {promotionType == 'BILL_DISCOUNT' && HUALALA.ENVIRONMENT != 'production-release' ? this.renderUsageMode() : null}
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user,
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PromotionScopeInfo));
