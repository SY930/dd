import React, {Component} from 'react';
import {render} from 'react-dom';
import {connect} from 'react-redux';
import {Row, Col, Form, TreeSelect, Input, message, DatePicker} from 'antd';
import BaseForm from '../../../components/common/BaseForm';
import SetModal from './SetModal';
import styles from './ProfileSetting.less';
import {fetchData} from '../../../helpers/util';
import Cfg from '../../../constants/CrmOperationCfg_dkl';
import _ from 'lodash';
import {FORM_ITEMS} from './_formItemsConfig';
import {
    UpdateDetailModalVisible,
    UpdateDetailModalLoading,
} from '../../../redux/actions/crmNew/crmOperation.action';

const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// 退款keys ['tuikuandianpu','tuixianjinkazhi','transReturnMoneyAmount','transReturnPointAmount']
class ProfileSetting extends React.Component {
    constructor(props) {
        super(props);
        this.basicForm = null;
        this.data = {};
        this.state = {
            visible: this.props.visible,
            // keys: ['chongzhidianpu','chongzhifangshi','chongzhijine','zengsongjine','fanzengjifen','cardLevelName6','shifoukaifapiao','beizhuxinxi'],
            keys: this.findKeysByType(),
            transWay: 'false',
            invoiceFlag: 'false',
            useVisible: false,
            deferTypeFlag: '1',
            setShopID: '0',
            transTypeChild: this.props.transTypeParent,
            // rechargeChild: 'false'
        }
    }

    componentDidMount() {
        this.props.getSubmitFn(this.handleSubmit);
    }

    componentWillReceiveProps(nextProps) {
        [this.basicForm].forEach(form => {
            form && form.resetFields();
        });
        const {visible = false, cardInfo, shopStores, ...otherProps} = nextProps;
        const _cardInfo = cardInfo.toJS();
        const _shopStores = shopStores.toJS();
        this.setState({
            visible,
            transTypeChild: nextProps.transTypeParent,
            // transWay: nextProps.transWay,
            transWay: 'false',
            baseInfoData: _cardInfo,
            shopsData: _shopStores,
            //   transWay: nextProps.rechargeParent
        });
        this.findKeysByType();

        // this.setNewKeysByTransWayValue(transWay);
        // this.setNewKeysByInvoiceFlagValue(invoiceFlag);
        // this.setNewKeysByUseVisibleValue(useVisible);
        this.setNewKeysByType(otherProps);
    }

    componentWillUnmount() {
        // this.props.callback && this.props.callback(this.data);
        // this.props.data = [];
        //

    }

    /**
     * [description]  根据type设置不同的keys
     * @param  {[type]} otherProps [description]
     * @return {[type]}            [description]
     */
    setNewKeysByType = otherProps => {
        const {type, transWay, invoiceFlag, useVisible, deferTypeFlag} = otherProps;
        switch (type) {
            case 'recharge':
                this.setNewKeysByTransWayValue(transWay);
                // this.setNewKeysByInvoiceFlagValue(invoiceFlag);
                break;
            case 'adjustment':
                this.setNewKeysByUseVisibleValue(useVisible);
                break;
            case 'postpone':
                this.setNewKeysBydeferTypeValue(deferTypeFlag)
                break;
            case 'batchPostpone':
                this.setNewKeysBydeferTypeValue(deferTypeFlag)
                break;
            case 'consumption':
                this.setNewKeysByInvoiceFlagValue(invoiceFlag);
                break;
        }
    }
    /**
     * [description] 根据不同的操作类型找到不同的keys
     * @return {[type]} [description]
     */
    findKeysByType = () => {
        let keys = _.filter(Cfg.operationTypeKeys, item => {
            if (item.type == this.props.type) return item.keys
        })[0].keys;
        return keys;
    }
    /**
     * [description] 会员充值时，根据不同的充值方式设置不同的keys
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    setNewKeysByTransWayValue = value => {
        if (value == 'false' && _.indexOf(this.state.keys, 'transAmount') == -1) {
            this.setNewKeys(2, 2, 'transAmount', 'transReturnMoneyAmount', 'transReturnPointAmount');
        } else if (value == 'true' && _.indexOf(this.state.keys, 'taocanxuanze') == -1) {
            this.setNewKeys(2, 3, 'taocanxuanze', 'taocanxinxi');
        }
    }
    /**
     * [description] 会员充值时，根据是否开发票设置不同的keys
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    setNewKeysByInvoiceFlagValue = value => {
        const keys = this.state.keys;
        const length = keys.length;
        if (value == 'false') {
            if (_.indexOf(keys, 'invoiceNO') > -1) {
                let len = length - 4;
                this.setNewKeys(len, 3);
            }
        } else {
            let len = length - 1;
            this.setNewKeys(len, 0, 'invoiceTitle', 'invoiceNO', 'kaipiaojine');
        }
    }
    /**
     * [description] 会员调账，根据用户是否可见，设置不同的keys
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    setNewKeysByUseVisibleValue = value => {
        const keys = this.state.keys;
        const length = keys.length;
        if (value == true) {
            let len = length;
            this.setNewKeys(len, 0, 'smsContent');
        } else if (value == false) {
            if (_.indexOf(keys, 'smsContent') > -1) {
                let len = length - 1;
                this.setNewKeys(len, 1);
            }

        }
    }
    /**
     * [description] 会员卡延期，根绝不同延期方式，设置不同的keys
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    setNewKeysBydeferTypeValue = value => {
        const keys = this.state.keys;
        const length = keys.length;
        if (value === '1') {
            let len = length - 1;
            // keys.splice(len,1,'deferToDate');
            // this.setState({ keys });
            this.setNewKeys(len, 1, 'deferToDate');
        } else {
            let len = length - 1;
            // keys.splice(len,1,'deferDays');
            // this.setState({ keys });
            this.setNewKeys(len, 1, 'deferDays');
        }
    }
    handleSubmit = () => {
        this.basicForm.validateFieldsAndScroll((err, basicValues) => {
            const {type} = this.props;
            // this.specialErrorProcess(err, basicValues);
            if (type === 'adjustment') {
                if (err) return;
                // 找到undefined的个数
                var len = '';
                _.mapValues(basicValues, function (value, key) {
                    switch (key) {
                        case 'adjustGiveBalance':
                        case 'adjustMoneyBalance':
                        case 'adjustPointBalance':
                            if (value == undefined) {
                                len++;
                            }
                            break;
                    }
                });
                if (len == 3) {
                    message.error('调整的项目至少有一个非零值');
                    return;
                }
            } else if (type == 'adjustQuota') {
                if (err) return;
                let {baseInfoData} = this.state;
                if (baseInfoData.isCreditCustomer == false) {
                    message.error('由于该会员卡的等级无法享受挂账，所以无法调整挂账额度');
                    return;
                }
            } else {
                if (err) return;
            }

            // loadingTrueFn();
            const {UpdateDetailModalLoading} = this.props;
            UpdateDetailModalLoading({loading: true});
            // 各个参数列表
            let _params = this.getdiffParamsByType(basicValues);
            let {baseInfoData} = this.state;
            // 基本参数
            let baseInfoParams = {cardID: baseInfoData.cardID, cardTypeID: baseInfoData.cardTypeID};
            const callServer = this.findCallServerByType(this.props.type);
            // let params = {...basicValues, ...baseInfoParams, ..._params};
            let params = {};
            if (this.props.type == 'batchPostpone') {
                params = {..._params};
            } else if (this.props.type == 'postpone') {
                params = {...baseInfoParams, ..._params};
            } else if (this.props.type == 'consumption') {
                // basicValues.transTime = basicValues.transTime && basicValues.transTime.format("YYYYMMDD");
                params = {...baseInfoParams, ..._params};
                params = _.omit(params, 'invoiceFlag');
            } else if (this.props.type == 'adjustment') {
                params = {...baseInfoParams, ..._params};
                if (String(params.shopID) == '0') {
                    params.transWay = 1;
                } else {
                    params.transWay = 0;
                }
                params.sourceType = 60;
            }
            else {
                params = {...baseInfoParams, ..._params};
            }
            fetchData(callServer, params, null, {path: 'data'}).then(data => {
                // visibleFn();
                const {UpdateDetailModalVisible, UpdateDetailModalLoading,} = this.props;
                UpdateDetailModalVisible({visible: false});
                UpdateDetailModalLoading({loading: false});
                const {type = 'recharge'} = this.props;
                const title = Cfg.operationTypeCfg.filter(item => {
                    if (item.type == type) return item.describe;
                });
                message.success(`${title.length > 0 ? title[0].name : ''}成功！`);
            }).catch(err => {
                // loadingFalseFn();
                const {UpdateDetailModalVisible, UpdateDetailModalLoading,} = this.props;
                UpdateDetailModalVisible({visible: true});
                UpdateDetailModalLoading({visible: false});

            });
        });
    }
    /**
     * [description] 根据不同的类型选择不同的接口
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    findCallServerByType = type => {
        switch (type) {
            case 'recharge':
                return 'crmOperationRecharge';
            case 'adjustment':
                return 'manualAdjustBalance_dkl';
            case 'adjustQuota':
                return 'crmOperationAdjustQuota_dkl';
            case 'postpone':
                return 'crmOperationPostpone_dkl';
            case 'batchPostpone':
                return 'crmOperationBatchPostpone_dkl';
            case 'consumption':
                return 'crmOperationConsume_dkl';
            case 'resetPassword':
                return 'crmOperationResetCardPWD_dkl';
            case 'modifyPassWord':
                return 'crmOperationChangeCardPWD_dkl';
            case 'invoice':
                return 'crmOperationOutInvoice';
            default:
                return 'updateCrmOperationStatus';
        }
    }
    /**
     * [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    getdiffParamsByType = params => {
        const {type} = this.props;
        let source = {sourceWay: 0, sourceType: 60};
        let _type = 0;
        const {cardStatus, cardNO} = this.state.baseInfoData;
        if (cardStatus == 30) {
            _type = 21;
        } else if (cardStatus == 20) {
            _type = 11;
        }
        switch (type) {
            case 'recharge':
                if (params.setSelected !== undefined) {
                    params.saveMoneySetID = params.setSelected.saveMoneySetID;
                    params.saveMoneySetName = params.setSelected.setName;
                }
                params = _.omit(params, 'setSelected', 'setInfo');
                const {uuid} = this.props;
                const _uuid = uuid.toJS();
                const {subjectName} = this.formatFormData(params);
                let subjectCode = '';
                if(subjectName === '现金') {
                    subjectCode = '10010001';
                } else if(subjectName === '银行卡' || subjectName === '支票'){
                    subjectCode = '10020001';
                } else if(subjectName === '其他') {
                    subjectCode = '00000000';
                }
                return {
                    subjectCode,
                    posOrderNo: _uuid.uuid,
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params),
                    ...this.formatFormData(params),
                    transType: 20,
                    transWay: 0,
                    sourceType: 60,
                };
            case 'active':
                return {
                    optionType: _type,
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params), ...source,
                    ...this.formatFormData(params)
                };
            case 'lose':
                return {
                    optionType: 10,
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params), ...source, ...this.formatFormData(params)
                };
            case 'freeze':
                return {
                    optionType: 20,
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params), ...source, ...this.formatFormData(params)
                };
            case 'cancelled':
                return {
                    optionType: 30,
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params), ...source, ...this.formatFormData(params)
                };
            case 'change':
                return {
                    cardNO,
                    optionType: 40,
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params), ...source, ...this.formatFormData(params)
                };
            case 'consumption':
                return {
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params), ...this.formatFormData(params)
                };
            case 'recede':
                return {
                    optionType: 32,
                    transShopID: Number(params.shopID),
                    transShopName: this.findShopNameByShopID(params), ...this.formatFormData(params)
                };
            case 'adjustment':
                // this.props.callbackTransType(params.transType);
                return {
                    transShopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params),
                    ...this.formatFormData(params),
                };
            case 'modifyPassWord':
            case 'postpone':
            case 'batchPostpone':
            case 'adjustQuota':
                return {
                    ...this.formatFormData(params)
                };
            case 'invoice':
                {
                    const { $$accountInfo } = this.props;
                    const accountInfo = $$accountInfo.toJS();
                    return {
                        operator: accountInfo.loginName,
                        shopName: this.findShopNameByShopID(params),
                        ...this.formatFormData(params),
                    };
                }
            default:
                return {
                    ...this.formatFormData(params)
                };
        }
    }
    formatFormData = params => {
        return _.mapValues(params, (value, key) => {
            switch (key) {
                case 'deferToDate':
                case 'transTime':
                    return value = value == undefined ? '' : value.format("YYYYMMDDHHmmss");
                case 'subjectName':
                    return value = _.result(_.find(Cfg.paymentWay, {value: value}), 'label');
                // case 'effectType':
                //     return value = Number(value);
                // case 'giftEffectTimeHours':
                //     return value = Number(value);
                // case 'giftValidUntilDayCount':
                //     return value = Number(value);
                default:
                    return value !== undefined ? value : '';
            }
        })
    }
    findShopNameByShopID = ({shopID}) => {
        const {shopsData} = this.state;
        if (shopID == '0') return '网上自助店铺';
        let shopName = _.compact(_.map(shopsData, function (shop) {
            if (String(shop.shopID) == shopID) return shop.shopName;
        }));
        return shopName[0];
    }
    /**
     * [description]
     * @param  {[type]}    startIndex 为开始位置
     * @param  {[type]}    num        删除个数---如果设置为0，为添加
     * @param  {...[type]} newKeys    为添加的key值
     * @return {[type]}               [description]
     */
    setNewKeys = (startIndex, num, ...newKeys) => {
        let keys = this.state.keys;
        keys.splice(startIndex, num, ...newKeys);
        keys = _.uniq(keys, true);
        this.setState({keys});
        return keys;
    }
    /**
     * [description] 根据value值获得label，配合Cfg使用
     * @param  {[type]} cfg [description]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    mapValueToLabel = (cfg, val) => {
        return _.result(_.find(cfg, {type: val}), 'name');
    }
    handleFormChange = (key, value) => {
        switch (key) {
            case 'setSelected':
                this.basicForm.setFieldsValue({
                    setValue: value.setName == undefined ? '' : value.setName,
                    setInfo: value.setSaveMoney == undefined ? '' : `充值金额：${value.setSaveMoney}元\n赠送金额：${value.returnMoney}元\n返积分：${value.returnPoint}分\n可用会员卡类型：${value.saveMoneySetCardLevels}\n可使用礼品：${value.crmEventGiftConfResList}`,
                });
                break;
            case 'transWay':
                this.setState({transWay: value});
                this.setNewKeysByTransWayValue(value);
                // this.props.callbackRechargeType(value);
                break;
            case 'invoiceFlag':
                this.setState({kfp: value});
                this.setNewKeysByInvoiceFlagValue(value);
                break;
            case 'visiable':
                this.setState({useVisible: value});
                this.setNewKeysByUseVisibleValue(value);
                break;
            case 'deferType':
                this.setState({deferTypeFlag: value});
                this.setNewKeysBydeferTypeValue(value);
                // if(value == '1') {
                //     let keys = this.state.keys;
                //     let len = keys.length-1;
                //     // keys.splice(len,1,'deferToDate');
                //     // this.setState({ keys });
                //     this.setNewKeys(len,1,'deferToDate');
                // } else {
                //     let keys = this.state.keys;
                //     let len = keys.length-1;
                //     // keys.splice(len,1,'deferDays');
                //     // this.setState({ keys });
                //     this.setNewKeys(len,1,'deferDays');
                // }
                break;
            case 'shopID':
                this.setState({setShopID: value});
                this.basicForm.setFieldsValue({
                    setValue: '',
                    setInfo: '',
                });
                break;
            case 'transType':
                this.props.callbackTransType(value);
                // if(value == '40'){
                //     this.props.callbackTransType('crm.huiyuankachuzhitiaozhang.tiaozhang');
                // } else {
                //     this.props.callbackTransType('crm.huiyuankaxiaofeitiaozhang.tiaozhang');
                // }
                break;
            // case 'originCreditAmount':
            //     this.adjustQuota.setFieldsValue({
            //         adjustQuota: '',
            //     });
            //     break;

        }
    };
    preProShops = data => {
        let itemArray = [];
        let hh = _.groupBy(data, 'cityID');
        _.forEach(hh, (item, key) => {
            let ff = _.map(item, function (_item) {
                return _.pick(_item, ['shopName', 'shopID']);
            }).map(shop => {
                return {content: shop.shopName, id: shop.shopID}
            });
            itemArray.push({
                province: {id: key, content: item[0].cityName},
                cities: ff
            });
        });
        let shopsData = [];
        _.forEach(itemArray, (item, key) => {
            let children = [];
            _.forEach(item.cities, (city, index) => {
                children.push({
                    label: city.content,
                    value: String(city.id),
                    key: key + '' + index,
                })
            });
            shopsData.push({
                label: item.province.content,
                value: '',
                key: key,
                children: children,
            })
        });
        // shopsData.unshift({
        //  label: '不限城市',
        //  // value: '0',
        //  key: '0',
        //  children: [{
        //  label: '网上自助店铺',
        //  value: '0',
        //  key: '0',
        //  }]
        //  });
        return shopsData;
    }
    checkConfirm = (rule, value, callback) => {
        if (value && this.state.confirmDirty) {
            this.basicForm.validateFields(['newCardPWD'], {force: true});
        }
        callback();
    }
    checkPassword = (rule, value, callback) => {
        if (value && value !== this.basicForm.getFieldValue('cardPWD')) {
            callback('两次密码输入请保持一致');
        } else {
            callback();
        }
    }

    checkInvoiceValue = (rule, value, callback) => {
        const { baseInfoData: { invoiceValue } } = this.state;
        if (value) {
            if (Number(value) > Number(invoiceValue)) {
                callback('开票金额应该小于可开票金额');
            } else {
                callback();
            }
        } else {
            callback();
        }
    }

    render() {
        const basicFormKeys = [{
            col: {span: 24},
            keys: this.state.keys,
        }];
        const data = {transType: this.state.transTypeChild, transWay: this.state.transWay};
        const title = Cfg.operationTypeCfg.filter(item => {
            if (item.type == this.props.type) return item.describe;
        });
        const {type,} = this.props;
        const {baseInfoData = {}, shopsData} = this.state;
        let shopData = [];
        if (type === 'recede' || type === 'active' || type === 'lose' || type === 'freeze' || type === 'cancelled' || type === 'change' || type === 'recede') {
            const _shopData = _.reject(shopsData, {shopID: 0});
            shopData = this.preProShops(_shopData);
        } else {
            shopData = this.preProShops(shopsData);
        }
        const tProps = {
            treeData: shopData,
            showSearch: true,
            // value: this.state.value,
            // onChange: this.onChange,
            // multiple: true,
            // treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '请搜索店铺',
            treeNodeFilterProp: "label",
            allowClear: true,
            getPopupContainer: () => document.querySelector('.crmOperationTree')
        };
        const labelShop = this.mapValueToLabel(Cfg.operationTypeCfg, type);
        const {creditAmount = 0 } = baseInfoData;
        const formItems = {
            shopID: {
                type: 'custom',
                label: `${labelShop}店铺`,
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: `请选择${labelShop}店铺`,
                // defaultValue: ['0'],
                render: decorator => (
                    <Row>
                        <Col span={24} className="crmOperationTree">
                            <FormItem>
                                {decorator({})(<TreeSelect {...tProps} />)}
                            </FormItem>
                        </Col>
                    </Row>
                ),
                rules: [{
                    required: true, message: `请选择${labelShop}店铺`
                }]
            },
            taocanxuanze: {
                type: 'custom',
                label: '套餐选择',
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: '请选择套餐',
                render: decorator => (
                    <Row className={styles.setSelectedWrap}>
                        <Col span={15}>
                            <FormItem>
                                {decorator({
                                    key: 'setValue',
                                    rules: [{
                                        required: true, message: '请选择套餐',
                                    }],
                                    // initialValue:this.state.salesAmountControl
                                })(<Input disabled/>)}
                            </FormItem>
                        </Col>
                        <Col span={9}>
                            <FormItem>
                                {decorator({
                                    key: 'setSelected',
                                })(<SetModal
                                    baseInfoData={baseInfoData}
                                    setShopID={this.state.setShopID}
                                />)}
                            </FormItem>
                        </Col>
                    </Row>
                )
            },
            taocanxinxi: {
                type: 'custom',
                label: '套餐信息',
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: '请选择套餐',
                render: decorator => (
                    <Row className={styles.setInfoWrap}>
                        <Col span={24}>
                            <FormItem>
                                {decorator({
                                    key: 'setInfo',
                                    // rules:[{
                                    //   pattern: /^(?:[1-9]\d{0,7})$/,
                                    //   message: '套餐数量必须是在1-99999999之间的整数'
                                    // }],
                                })(<Input type="textarea" disabled/>)}
                            </FormItem>
                        </Col>
                    </Row>
                )
            },
            transAmount: {
                type: 'text',
                label: `${type == 'recharge' ? '充值金额' : '退现金卡值'}`,
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: `请输入${type == 'recharge' ? '充值金额' : '退现金卡值'}`,
                surfix: '元',
                rules: [{
                    required: true, message: '请输入充值金额',
                }, {
                    pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                    message: '必须是整数部分不超过8位且小数部分不超过2位的数',
                }]
            },
            transReturnMoneyAmount: {
                type: 'text',
                label: `${type == 'recharge' ? '赠送金额' : '减赠送卡值'}`,
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: `请输入${type == 'recharge' ? '赠送金额' : '减赠送卡值'}`,
                surfix: '元',
                rules: [{
                    pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                    message: '必须是整数部分不超过8位且小数部分不超过2位的数',
                }]
            },
            transReturnPointAmount: {
                type: 'text',
                // label: '返赠积分',
                label: `${type == 'recharge' ? '返赠积分' : '扣除积分'}`,
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: `请输入${type == 'recharge' ? '返赠积分' : '扣除积分'}`,
                surfix: '分',
                rules: [{
                    pattern: /^\+?\d{0,8}$/,
                    message: '必须是整数部分不超过8位',
                }]
            },
            transTime: {
                label: '结算日期',
                type: 'custom',
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                render: decorator => (
                    <Row className={styles.setInfoWrap}>
                        <Col span={24}>
                            <FormItem>
                                {decorator({})(
                                    <DatePicker
                                        showTime
                                        format="YYYY-MM-DD HH:mm:ss"
                                        placeholder="请选择结算日期"
                                    />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                )
            },
            originCreditAmount: {
                type: 'text',
                label: '原始额度',
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                disabled: true,
                placeholder: '请输入原始额度',
                surfix: '元',
                defaultValue: `${creditAmount}`,
                // rules: [{
                //   required: true, message: '请输入等级名称'
                // }]
            },
            cardPWD: {
                type: 'password',
                label: '请输入新密码',
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: '请输入新密码',
                rules: [{
                    required: true, message: '请输入新密码',
                }, {
                    validator: this.checkConfirm,
                }]
            },
            newCardPWD: {
                type: 'password',
                label: '再次输入新密码',
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: '请再次输入新密码',
                rules: [{
                    required: true, message: '请输入新密码',
                }, {
                    validator: this.checkPassword,
                }]
            },
            invoiceValue: {
                type: 'text',
                label: '开票金额',
                labelCol: {span: 7},
                wrapperCol: {span: 14},
                placeholder: '请输入开票金额',
                surfix: '元',
                rules: [{
                        required: true, message: '请输入开票金额'
                    }, {
                        pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                        message: '必须是整数部分不超过8位且小数部分不超过2位的数',
                    }, {
                        validator: (rule, v, cb) => {
                            this.checkInvoiceValue(rule, v, cb)
                        },
                    }
                ],
            },
            ...FORM_ITEMS,
        };
        return (
            <div className={styles.crmSet}>
                <Row>
                    <Col span={24}>
                        <div className={[styles.titleWrap_2, 'clearfix'].join(' ')}><p className={styles.flag}></p><h5
                            className={styles.title}>{`${title.length > 0 ? title[0].abbreviation : ''}信息`}</h5></div>
                    </Col>
                    <Col span={24} className={styles.formWrap}>
                        <BaseForm
                            getForm={form => this.basicForm = form}
                            formItems={formItems}
                            formData={data}
                            formKeys={basicFormKeys}
                            onChange={this.handleFormChange}
                            // disabledKeys={disabledArray}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        cardInfo: state.crmOperation_dkl.get('cardInfo'),
        shopStores: state.crmOperation_dkl.get('shopStores'),
        uuid: state.crmOperation_dkl.get('uuid'),
        $$accountInfo: state.user.get('accountInfo'),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        UpdateDetailModalVisible: (opts) => dispatch(UpdateDetailModalVisible(opts)),
        UpdateDetailModalLoading: (opts) => dispatch(UpdateDetailModalLoading(opts)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfileSetting);

function isEmpty(value) {
    return (Array.isArray(value) && value.length === 0)
        || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}
