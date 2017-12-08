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
import {connect} from 'react-redux';
import {
    Row,
    Col,
    Checkbox,
    Form,
    Select,
    Tree
} from 'antd';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;
const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';
if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less');
}

import {HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY} from '../../../components/common';


import {fetchPromotionScopeInfo, saleCenterSetScopeInfoAC, saleCenterGetShopByParamAC, SCENARIOS} from '../../../redux/actions/saleCenter/promotionScopeInfo.action';
import EditBoxForShops from './EditBoxForShops';
let Immutable = require('immutable');

const plainOptions = [
    {
        label: '预定',
        value: '10'
    }, {
        label: '闪吃',
        value: '11'
    }, {
        label: '外送',
        value: '20'
    }, {
        label: '堂食',
        value: '31'
    }, {
        label: '自提',
        value: '21'
    }
];

let shopTreeData = [];

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
            auto: "1",
            orderType: ['31'],
            // be caution, state key is diff with redux key.
            brands: [],
            shopsInfo: [],
            selections: [],
            initialized: false

        };

        // bind this.
        this.handleBrandChange = this.handleBrandChange.bind(this);
        this.handleScenarioChange = this.handleScenarioChange.bind(this);
        this.handleAutoModeChange = this.handleAutoModeChange.bind(this);
        this.handleBusinessChange = this.handleBusinessChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderShopsOptions = this.renderShopsOptions.bind(this);
        this.editBoxForShopsChange = this.editBoxForShopsChange.bind(this);
    }

    handleSubmit() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err1, basicValues) => {
            if (err1) {
                flag = false;
            }
            if(this.state.orderType.length == 0){
                flag = false;
            }

        });
        if(flag){
            this.props.saleCenterSetScopeInfo({
                channel: this.state.channel,
                auto: this.state.auto,
                orderType: this.state.orderType,
                brands: this.state.brands,
                shopsInfo: this.state.selections
            });
        }

        return flag;
    }

    componentDidMount() {

        // this.props.getSubmitFn(this.handleSubmit);
        this.props.getSubmitFn({prev: this.handleSubmit, next: this.handleSubmit, finish: undefined, cancel: undefined});

        const {promotionScopeInfo, fetchPromotionScopeInfo} = this.props;

        if (!promotionScopeInfo.getIn(["refs", "initialized"])) {
            fetchPromotionScopeInfo({_groupID: this.props.user.accountInfo.groupID});
        }
        if (this.props.promotionScopeInfo.getIn(["refs", "data", "shops"]).size > 0 && this.props.promotionScopeInfo.getIn(["refs", "data", "brands"]).size > 0) {
            let _stateFromRedux = this.props.promotionScopeInfo.getIn(["$scopeInfo"]).toJS();
            this.setState({
                brands: _stateFromRedux.brands,
                channel: _stateFromRedux.channel,
                auto: _stateFromRedux.auto,
                orderType: _stateFromRedux.orderType,
                // TODO: shopsIdInfo converted to shopsInfo
                selections: _stateFromRedux.shopsInfo.map((item) => {
                    return this.props.promotionScopeInfo.getIn(["refs", "data", "shops"]).toJS().find((shop) => {
                        shop.itemName = shop.shopName;
                        shop.itemID = shop.shopID;
                        return shop.shopID === item
                    })
                }),
                initialized: true,
                currentSelections: _stateFromRedux.shopsInfo,
                $brands: Immutable.List.isList(this.props.promotionScopeInfo.getIn(["refs", "data", "brands"]))?
                    this.props.promotionScopeInfo.getIn(["refs", "data", "brands"]).toJS():
                    this.props.promotionScopeInfo.getIn(["refs", "data", "brands"]),
                initialized: true
            });
        }

    }

    componentWillReceiveProps(nextProps) {

        if(JSON.stringify(nextProps.promotionScopeInfo.getIn(["refs", "data"])) !=
            JSON.stringify(this.props.promotionScopeInfo.getIn(["refs", "data"]))){

            let _data = Immutable.Map.isMap(nextProps.promotionScopeInfo.getIn(['$scopeInfo']))?
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']).toJS():
                nextProps.promotionScopeInfo.getIn(['$scopeInfo']);
            let $shops = Immutable.List.isList(nextProps.promotionScopeInfo.getIn(["refs", "data", "shops"]))?
                nextProps.promotionScopeInfo.getIn(["refs", "data", "shops"]).toJS():
                nextProps.promotionScopeInfo.getIn(["refs", "data", "shops"]);
            this.setState({
                brands: _data.brands, channel: _data.channel, auto: _data.auto, orderType: _data.orderType,
                // TODO: shopsIdInfo converted to shopsInfo
                selections: _data.shopsInfo.map((item) => {
                    if (typeof item === 'string') {
                        return $shops.find((shop) => {

                            shop.itemName = shop.shopName;
                            shop.itemID = shop.shopID;
                            return shop.shopID === item
                        })
                    } else {
                        return item
                    }

                }),
                currentSelections: _data.shopsInfo,
                $brands: Immutable.List.isList(nextProps.promotionScopeInfo.getIn(["refs", "data", "brands"]))?
                    nextProps.promotionScopeInfo.getIn(["refs", "data", "brands"]).toJS():
                    nextProps.promotionScopeInfo.getIn(["refs", "data", "brands"]),
                initialized: true
            });
        }

    }

    // save brand data to store
    handleBrandChange(value) {
        this.setState({brands: value});
    }

    renderBrandFormItem() {

        let _brands = this.state.$brands;
        let options;
        if(this.state.initialized){
            if(typeof _brands === 'object' && _brands.length> 0){
                options = _brands.map((brand, idx) => {
                    return (
                        <Option value={brand.brandID} key={idx}>{brand.brandName}</Option>
                    );
                })
            }else{
                options = (<Option value={'0'} disabled>暂无数据</Option>);
            }
        }else{
            options = (<Option value={'0'} disabled>数据加载中....</Option>);
        }

        let _brandList = {
            multiple: true,
            allowClear:true,
            showSearch:false,
            filterOption:false,
            placeholder: '全部品牌',
            onChange: this.handleBrandChange,
            defaultValue: this.state.brands,
            value: this.state.brands
        };
        return (
            <Form.Item label="适用品牌" wrapperCol={{
                span: 17
            }} labelCol={{
                span: 4
            }} hasFeedback className={styles.FormItemStyle}>
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
            auto: ('2' === value)
                ? '1'
                : this.state.auto
        });
    }

    handleAutoModeChange(value) {
        this.setState({auto: value});
    }

    renderChannelList() {
        return (
            <FormItem label="适用场景" labelCol={{
                span: 4
            }} wrapperCol={{
                span: 17
            }} className={[styles.FormItemStyle, styles.yzTxt].join(' ')}>
                <Col span={16}>
                    <Select size="default" onChange={this.handleScenarioChange} value={this.state.channel} defaultValue={"0"}>
                        {SCENARIOS.map((scenario, index) => {
                            return (
                                <Option key={index} value={scenario.value}>{scenario.name}</Option>
                            );
                        })}
                    </Select>
                </Col>
                <Col span={4} className={styles.autoStyle}>
                    <div>自动执行</div>
                </Col>
                <Col span={4}>
                    <Select size="default" onChange={this.handleAutoModeChange} defaultValue={"1"} value={this.state.auto} disabled={this.state.channel == '2'}>
                        <Option value={'1'}>是</Option>
                        <Option value={'0'}>否</Option>
                    </Select>
                </Col>
            </FormItem>
        );
    }

    handleBusinessChange(value) {
        this.setState({orderType: value});
    }

    renderBusinessOptions() {

        return (
            <Form.Item label="适用业务" className={styles.FormItemStyle} labelCol={{
                span: 4
            }} validateStatus={this.state.orderType.length
                ? "success"
                : 'error'} help={!this.state.orderType.length
                ? '请选择适用业务'
                : null} wrapperCol={{
                span: 17
            }}>
                <CheckboxGroup onChange={this.handleBusinessChange} options={plainOptions} value={this.state.orderType} defaultValue={this.state.orderType}/>
            </Form.Item>
        );
    }

    renderShopsOptions() {

        return (
            <Form.Item
                label="适用店铺" className={styles.FormItemStyle}  labelCol={{span:4}}
                wrapperCol={{span:17}}>

                <EditBoxForShops onChange={
                    this.editBoxForShopsChange
                }/>
            </Form.Item>
        );
    }

    editBoxForShopsChange(val){
        this.setState({
            selections : val
        })
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

        return (
            <Form  className={styles.FormStyle}>
                {this.renderBrandFormItem()}
                {this.renderChannelList()}
                {this.renderBusinessOptions()}
                {this.renderShopsOptions()}
            </Form>
        );
    }
}
const mapStateToProps = (state) => {
    return {promotionScopeInfo: state.promotionScopeInfo, user: state.user.toJS()};
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
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PromotionScopeInfo));
