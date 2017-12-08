import React from 'react';
import _ from 'lodash';
import Moment from 'moment';
import { fetchData } from '../../../helpers/util';
import { Row, Col, Modal, Form, Steps, Button, Select, Input, Upload, message, Icon } from 'antd';
import styles from './GiftAdd.less';
// import stylesBar from '../../../components/basic/ProgressBar/ProgressBar.less';
import { CrmLogo } from './CrmOperation';
import GiftCfg from '../../../constants/Gift';
import ProjectEditBox from "../../../components/basic/ProjectEditBox/ProjectEditBox";
import BaseForm from '../../../components/common/BaseForm';
import CustomProgressBar from '../../SaleCenter/common/CustomProgressBar';
import ENV from '../../../helpers/env';
const FormItem = Form.Item;
const Step = Steps.Step;
const Option = Select.Option;
const Dragger = Upload.Dragger;
export class GiftAddModalStep extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            shopsData: [],
            values: {},
            finishLoading:false,
            numberOfTimeValueDisabled:true,
            moneyTopLimitValueDisabled:true,
            // modalKey:1,
            firstKeys: {
                '电子代金券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'giftRemark'] }],
                '菜品优惠券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'isFoodCatNameList', 'foodNameList', 'giftRemark'] }],
                '会员权益券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName', 'giftRemark'] }],
            },
            secondKeys: {
                '电子代金券': [{ col: { span: 24, pull: 2 }, keys: ['isHolidaysUsing', 'usingTimeType', 'supportOrderType', 'isOfflineCanUsing', 'shareType', 'moneyLimitType', 'shopNames'] }],
                '菜品优惠券': [{ col: { span: 24, pull: 2 }, keys: ['isHolidaysUsing', 'usingTimeType', 'supportOrderType', 'isOfflineCanUsing', 'moneyLimitType', 'shopNames'] }],
                '会员权益券': [{ col: { span: 24, pull: 2 }, keys: ['isCustomerPrice', 'hasPrivilegeOfWait', 'isDiscountRate', 'isPointRate','isNumberOfTimeType', 'isMoneyTopLimitType'] }],
            },
            groupTypes: []
        },
            this.firstForm = null;
        this.secondForm = null;
    }
    componentWillMount() {
        const { gift: { data: { groupID } } } = this.props;
        fetchData('getSchema', { _groupID: groupID, groupID }, null, { path: 'data' }).then(data => {
            let { cities, shops } = data;
            let treeData = [];
            if (cities === undefined) {
                cities = [];
            }
            if (shops === undefined) {
                shops = [];
            }
            cities.map((city, index) => {
                let newShops = [];
                shops.filter(shop => {
                    return shop.cityID == city.cityID;
                }).forEach(shop => {
                    let shopItem = {};
                    shopItem.content = shop.shopName;
                    shopItem.id = shop.shopID;
                    newShops.push(shopItem);
                });
                treeData.push({
                    province: {
                        content: city.cityName,
                        id: city.cityID
                    },
                    shops: newShops
                });
            });
            this.setState({ shopsData: [...treeData] });
        });
        fetchData('getShopBrand', { _groupID: groupID, groupID }, null, { path: 'data.records' }).then(data => {
            if (!data) return;
            let groupTypes = [];
            data.map((d) => {
                groupTypes.push({ value: d.brandID, label: d.brandName })
            });
            this.setState({ groupTypes });
        });
    }
    // componentWillUnmount(){
    //     alert('222222222')
    // }
    componentWillReceiveProps(nextProps) {
        const { gift: { name ,data} ,type} = nextProps;
        let { secondKeys } = this.state;
        this.firstForm && this.firstForm.resetFields();
        this.secondForm && this.secondForm.resetFields();
        if(type=='edit'){
            if(data.moneyLimitType!=0){
                secondKeys[name][0].keys = ['isHolidaysUsing', 'usingTimeType', 'supportOrderType', 'isOfflineCanUsing', 'shareType', 'moneyLimitType','moenyLimitValue', 'shopNames'];
                this.setState({
                    secondKeys
                })
            }
        }
    }
    handleFormChange(key, value, form) {
        const { gift: { name: describe } } = this.props;
        let { secondKeys, values } = this.state;
        let newKeys = secondKeys[describe][0].keys;
        let index = _.findIndex(newKeys, (item) => item == key);
        switch (key) {
            case 'moneyLimitType':
                //从newKeys里找到moenyLimitValue的key加到secondKeys的对应位置
                let moenyLimitValueIndex = _.findIndex(newKeys, (item) => item == 'moenyLimitValue');
                if (value != 0) {
                    moenyLimitValueIndex == -1 && newKeys.splice(index + 1, 0, 'moenyLimitValue');
                } else {
                    moenyLimitValueIndex !== -1 && newKeys.splice(moenyLimitValueIndex, 1);
                }
                break;
            case 'isDiscountRate':
                let discountRateIndex = _.findIndex(newKeys, (item) => item == 'discountRate');
                if (value == true) {
                    discountRateIndex === -1 && newKeys.splice(index + 1, 0, 'discountRate');
                } else {
                    discountRateIndex !== -1 && newKeys.splice(discountRateIndex, 1);
                }
                break;
            case 'isPointRate':
                let pointRateIndex = _.findIndex(newKeys, (item) => item == 'pointRate');
                if (value == true) {
                    pointRateIndex == -1 && newKeys.splice(index + 1, 0, 'pointRate');
                } else {
                    pointRateIndex !== -1 && newKeys.splice(pointRateIndex, 1);
                }
                break;
            case 'isNumberOfTimeType':
                    if(value=='0'){
                        values.numberOfTimeValue = 0;
                        this.secondForm.setFieldsValue({numberOfTimeValue:0});
                    }
                    this.setState({
                        numberOfTimeValueDisabled:value=='1'?false:true
                    })
                    if(value===undefined){
                        values.isNumberOfTimeType = '0';
                        values.numberOfTimeValue = 0;
                        this.secondForm.setFieldsValue({isNumberOfTimeType:'0',numberOfTimeValue:0});
                    }
                break;
            case 'isMoneyTopLimitType':
                    if(value=='0'){
                        values.moneyTopLimitValue = 0;
                        this.secondForm.setFieldsValue({moneyTopLimitValue:0});
                    }
                    this.setState({
                        moneyTopLimitValueDisabled:value=='1'?false:true
                    })
                    if(value===undefined){
                        values.isMoneyTopLimitType = '0';
                        values.moneyTopLimitValue = 0;
                        this.secondForm.setFieldsValue({isMoneyTopLimitType:'0',moneyTopLimitValue:0});
                    }
                break;
            default:
                break;
        }
        secondKeys[describe][0].keys = [...newKeys];
        values[key] = value;
        this.setState({ secondKeys, values });
    }

    /**
     * Callback once the user click the cancel button
     * @param  {Function} cb      callback function return by CustomProgressBar, it reset the state of the ProgressBar
     * @param  {int}   current current index of the steps which is passed to CustomProgressBar
     * @return {null}
     */
    handleCancel=(cb, current)=> {
        this.setState({
            current: 0,
            values: {},
            firstKeys: {
                '电子代金券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'giftRemark'] }],
                '菜品优惠券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftValue', 'giftName', 'isFoodCatNameList', 'foodNameList', 'giftRemark'] }],
                '会员权益券': [{ col: { span: 24, pull: 2 }, keys: ['giftType', 'giftName', 'giftRemark'] }],
            },
            secondKeys: {
                '电子代金券': [{ col: { span: 24, pull: 2 }, keys: ['isHolidaysUsing', 'usingTimeType', 'supportOrderType', 'isOfflineCanUsing', 'shareType', 'moneyLimitType', 'shopNames'] }],
                '菜品优惠券': [{ col: { span: 24, pull: 2 }, keys: ['isHolidaysUsing', 'usingTimeType', 'supportOrderType', 'isOfflineCanUsing', 'moneyLimitType', 'shopNames'] }],
                '会员权益券': [{ col: { span: 24, pull: 2 }, keys: ['isCustomerPrice', 'hasPrivilegeOfWait', 'isDiscountRate', 'isPointRate','isNumberOfTimeType','isMoneyTopLimitType'] }],
            },
        });
        this.props.onCancel();
        cb();
    }
    handleCCCCancel=()=>{
        this.props.onCancel();
    }
    handleNext = (cb) => {
        this.firstForm.validateFieldsAndScroll(function (error) {
            if (error) {

            } else {
                cb();
            }
        })
    }
    handlePrev = (cb) => {
        cb();
    }
    handleFinish = (cb) => {
        const { values, groupTypes } = this.state;
        const { type, gift: { value, data, data: { groupID } } } = this.props;
        this.secondForm.validateFieldsAndScroll((err, formValues) => {
            if (err) return;
            let params = _.assign({},values, formValues, { giftType: value });
            let shopNames = '', shopIDs = '', callServer;
            params.shopNames && params.shopNames.map((shop, idx) => {
                shopNames += `${shop.content},`;
                shopIDs += `${shop.id},`;
            });
            params.groupID = groupID;
            params.shopNames = shopNames;
            params.shopIDs = shopIDs;
            if(params.usingTimeType){
                params.usingTimeType = params.usingTimeType.join();
            }
            if (!params.isDiscountRate) {
                params.discountRate = 0
            }
            if (!params.isPointRate) {
                params.pointRate = 0
            }
            if (params.isNumberOfTimeType=='0') {
                params.numberOfTimeValue = 0
            }
            if (params.isMoneyTopLimitType=='0') {
                params.moneyTopLimitValue = 0
            }
            if (type === 'add') {
                callServer = 'addGift';
                if(values.brandID){
                    params.giftName = _.find(groupTypes, { value: values.brandID }).label + values.giftName;
                }
            } else if (type === 'edit') {
                callServer = 'updateGift';
                params.giftItemID = data.giftItemID;
            }
            this.setState({
                finishLoading:true
            })
            fetchData(callServer, params,null,{path:'data'}).then(data => {
                this.setState({
                    finishLoading:false
                })
                if(data){
                    message.success('成功',3);
                    this.handleCancel(cb);
                }else{
                    message.success('失败',3);
                }
            });
        });
    }
    handleGiftName(decorator) {
        const { groupTypes } = this.state;
        return (
            <Row>
                <Col span={11}>
                    <FormItem>
                        {decorator({
                            key: 'brandID',
                            rule: [{ required: true, message: '请选择品牌' }]
                        })(<Select
                            className='giftNameStep'
                            getPopupContainer={() => document.querySelector('.giftNameStep')}
                        >
                            {
                                groupTypes.map((t, i) => {
                                    return <Option key={t.label} value={t.value}>{t.label}</Option>
                                })
                            }
                        </Select>)}
                    </FormItem>
                </Col>
                <Col span={1} offset={1}>-</Col>
                <Col span={11}>
                    <FormItem style={{ marginBottom: 0 }}>
                        {decorator({
                            key: 'giftName',
                            rules: [{ required: true, message: '礼品名称不能为空' },
                            { max: 50, message: '请输入不超过50个字符的名称' }]
                        })(<Input size="large" placeholder="请输入礼品名称" />)}
                    </FormItem>
                </Col>
            </Row>
        )
    }
    renderShopNames(decorator) {
        const { shopNames } = this.state.values;
        const shopCfg = {
            treeData: this.state.shopsData,
            level1Title: '全部店铺',
            level2Title: '店铺',
            selectdTitle: '已选店铺',
            levelsNames: "province",
            childrenNames: "shops",
            showItems: shopNames,
        };
        return (
            <Row>
                <Col>
                    {decorator({
                    })(<MyProjectEditBox
                        treeProps={shopCfg}
                        title='店铺'
                    />)}
                </Col>
            </Row>
        )
    }
    renderFoodName(decorator, form) {
        const { getFieldValue } = form;
        const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } };
        const isFoodCatNameList = getFieldValue('isFoodCatNameList') || '0';
        const nameType = isFoodCatNameList == '0' ? '菜品' : '分类';
        return (
            <FormItem
                {...formItemLayout}
                label={`按抵扣${nameType}`}
                className='food-name-list'
            >
                {
                    decorator({
                        rules: [
                            { required: true, message: '不能为空' },
                            { max: 500, message: '字符串长度不能超过500个字符' }
                        ]
                    })(<Input size='large' type="text" placeholder={`${nameType}名称之间用逗号`} />)
                }
            </FormItem>
        )
    }
    // afterClose = () => {
	// 	this.setState({
	// 		modalKey: Math.random()
	// 	})
	// }
    render() {
        const { gift: { name: describe, value, data }, visible, type } = this.props,
            { current, firstKeys, secondKeys, values } = this.state;
        let dates = Object.assign({}, data);
        if (dates.discountRate) {
            dates.isDiscountRate = true
        } else {
            dates.isDiscountRate = false
        }
        if (dates.pointRate) {
            dates.isPointRate = true
        } else {
            dates.isPointRate = false
        }
        if(dates.moneyTopLimitValue){
            dates.isMoneyTopLimitType='1'
        }else {
            dates.isMoneyTopLimitType='0'
        }
        if(dates.numberOfTimeValue){
            dates.isNumberOfTimeType='1'
        }else {
            dates.isNumberOfTimeType='0'
        }
        const formItems = {
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            giftValue: {
                label: value == '10' ? '礼品价值' : '可抵扣金额',
                type: 'text',
                placeholder: '请输入金额',
                disabled: type === 'add' ? false : true,
                surfix: '元',
                rules: [{
                    required: true,
                    validator: (rule, v, cb) => {
                        if (!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(Number(v))) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '整数不超过8位，小数不超过2位'
                }]
            },
            giftName: {
                label: '礼品名称',
                type: 'custom',
                render: (decorator) => this.handleGiftName(decorator)
            },
            giftRemark: {
                label: '礼品描述',
                type: 'textarea',
                placeholder: '请输入礼品描述',
                rules: [
                    { required: true, message: '礼品描述不能为空' },
                    { max: 400, message: '最多400个字符' }
                ]
            },
            isHolidaysUsing: {
                label: '节假日是否可用',
                type: 'radio',
                defaultValue: '0',
                options: GiftCfg.isHolidaysUsing,
            },
            usingTimeType: {
                label: '使用时段',
                type: 'checkbox',
                defaultValue: ['1', '2', '3', '4', '5'],
                options: GiftCfg.usingTimeType,
                rules: [{ type: 'array', required: true, message: '请选择使用时段' }]
            },
            supportOrderType: {
                label: '业务支持',
                type: 'combo',
                defaultValue: '2',
                options: GiftCfg.supportOrderType,
            },
            isOfflineCanUsing: {
                label: '到店使用',
                type: 'radio',
                defaultValue: 'false',
                options: GiftCfg.isOfflineCanUsing,
            },
            shareType: {
                label: '优惠共享',
                type: 'combo',
                defaultValue: '0',
                options: GiftCfg.shareType,
            },
            moneyLimitType: {
                label: '金额限制',
                type: 'combo',
                options: GiftCfg.moneyLimitType,
                defaultValue: '0',
            },
            moenyLimitValue: {
                label: ' ',
                type: 'text',
                defaultValue: '100',
                placeholder: '请输入金额',
                surfix: '元，使用一张',
                rules: [{
                    required: true,
                    validator: (rule, v, cb) => {
                        if (!/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/.test(Number(v))) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '整数不超过8位，小数不超过2位'
                }],
            },
            shopNames: {
                type: 'custom',
                label: '可使用店铺',
                defaultValue: [],
                render: decorator => this.renderShopNames(decorator),
            },
            isFoodCatNameList: {
                label: '抵扣规则',
                type: 'combo',
                defaultValue: '0',
                rules: [{ required: true, message: '请选择抵扣规则' }],
                options: GiftCfg.isFoodCatNameList,
            },
            foodNameList: {
                type: 'custom',
                labelCol: { span: 0 },
                wrapperCol: { span: 24 },
                render: (decorator, form) => this.renderFoodName(decorator, form),
            },
            isCustomerPrice: {
                label: '享受会员价',
                type: 'switcher',
                defaultValue: false,
                onLabel: '是',
                offLabel: '否',
            },
            hasPrivilegeOfWait: {
                label: '享受插队',
                type: 'switcher',
                defaultValue: false,
                onLabel: '是',
                offLabel: '否',
            },
            isDiscountRate: {
                label: '享受折扣',
                type: 'switcher',
                defaultValue: false,
                onLabel: '是',
                offLabel: '否',
            },
            discountRate: {
                label: '折扣率',
                type: 'text',
                placeholder: '0.7(7折),0.77(77折)',
                rules: [{ required: true, message: "折扣率不能为空" },
                { pattern: /^([0](\.\d{1,2})?|1(\.[0]{1,2})?)$/, message: '取值范围0~1,最多可取两位小数,未开启表示无折扣' }]
            },
            isPointRate: {
                label: '享受积分',
                type: 'switcher',
                defaultValue: false,
                onLabel: '是',
                offLabel: '否',
            },
            pointRate: {
                label: '积分系数',
                type: 'text',
                placeholder: '0.12（现金12%积分）',
                rules: [{ required: true, message: "积分系数不能为空" },
                { pattern: /^([0](\.\d{1,2})?|1(\.[0]{1,2})?)$/, message: '取值范围0~1，最多可取两位小数，未开启表示无积分' }],
            },
            isNumberOfTimeType: {
                label: '使用次数限制',
                type: 'custom',
                render: (decorator,form,formData) => {
                    return (
                  <Row>
                    <Col span={12}>
                      <FormItem>
                        {decorator({
                            key: 'isNumberOfTimeType',
                            // initialValue:'1'
                        })(<Select>
                            <Option value="0">不限制</Option>
                            <Option value="1">限制</Option>
                        </Select>)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            {decorator({
                              key: 'numberOfTimeValue',
                              rules:[{
                                required: true,
                                pattern: /^0|(?:[1-9]\d{0,7})$/,
                                message: `请输入0-99999999间的整数`
                              }],
                        })(<Input placeholder={`请输入限定次数数值`} disabled={this.state.numberOfTimeValueDisabled}/>)}
                        </FormItem>
                    </Col>
                  </Row>
            )}
          },
          isMoneyTopLimitType: {
                label: '使用金额限制',
                type: 'custom',
                render: decorator => (
                  <Row>
                    <Col span={12}>
                      <FormItem>
                        {decorator({
                            key: 'isMoneyTopLimitType',
                            // initialValue:'0'
                        })(<Select>
                            <Option value="0">不限制</Option>
                            <Option value="1">限制</Option>
                        </Select>)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem>
                            {decorator({
                              key: 'moneyTopLimitValue',
                              rules:[{
                                required: true,
                                pattern:/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                                message: '整数部分不超过8位小数部分不超过2位',
                              }],
                        })(<Input placeholder={`请输入限定金额数值`} disabled={this.state.moneyTopLimitValueDisabled} addonBefore={<div>满</div>} addonAfter={<div>元使用</div>}/>)}
                        </FormItem>
                    </Col>
                  </Row>
            )
          },
        };
        let formData = {};
        if(type == 'edit'){
            formData = data === undefined ? values : dates;
        }
        formItems.giftName = type === 'add'
            ? { label: '礼品名称', type: 'custom', render: (decorator) => this.handleGiftName(decorator) }
            : { label: '礼品名称', type: 'text', disabled: true };
        const steps = [{
            title: '基本信息',
            content: <BaseForm
                getForm={form => this.firstForm = form}
                formItems={formItems}
                formData={formData}
                formKeys={firstKeys[describe]}
                onChange={(key, value) => this.handleFormChange(key, value, this.firstForm)}
                getSubmitFn={(handles) => { this.handles[0] = handles; }}
                key={`${describe}-${type}1`}
            />,
        }, {
            title: '使用规则',
            content: <BaseForm
                getForm={form => this.secondForm = form}
                formItems={formItems}
                formData={formData}
                formKeys={secondKeys[describe]}
                onChange={(key, value) => this.handleFormChange(key, value, this.secondForm)}
                getSubmitFn={(handles) => { this.handles[1] = handles; }}
                key={`${describe}-${type}2`}
            />,
        }];
        return (
            //Todo:点叉关闭功能
            <Modal
                // key={modalKey}
                title={`新建${describe}`}
                visible={visible}
                maskClosable={false}
                onCancel={() => this.handleCCCCancel()}
                footer={false}
                key={`${describe}-${type}`}
                // afterClose={this.afterClose}
                // wrapClassName="progressBarModal"
            >
            {
                visible?
                <div className={styles.customProgressBar}>
                        <CustomProgressBar style={{ height: "200px" }}
                            steps={steps}
                            callback={(arg) => {
                                //this.props.callbacktwo(arg);
                            }}
                            onNext={this.handleNext}
                            onFinish={this.handleFinish}
                            onPrev={this.handlePrev}
                            onCancel={this.handleCancel}
                        />
                </div>
                :null
            }
            </Modal>
        )
    }
}

class MyProjectEditBox extends React.Component {
    render() {
        const { value, ...otherProps } = this.props;
        return <ProjectEditBox {...otherProps} data={value} />;
    }
}
