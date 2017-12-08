import React, { Component } from 'react';
import { connect } from 'react-redux';
import { render } from 'react-dom';
import { Row, Col, Form, TreeSelect, Input, message, DatePicker } from 'antd';
import BaseForm from '../../../components/common/BaseForm';
import SetModal from './SetModal';
import BaseInfo from './BaseInfo';
import styles from './styles/ProfileSetting.less';
import { fetchData } from '../../../helpers/util';
import Cfg from '../../../constants/CrmOperationCfg';
import _ from 'lodash';
const FormItem = Form.Item;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
// 退款keys ['tuikuandianpu','tuixianjinkazhi','transReturnMoneyAmount','transReturnPointAmount']
export class ProfileSetting extends React.Component {
    constructor(props) {
        super(props);
        this.basicForm = null;
        this.data = {};
        this.state = {
            visible: this.props.visible,
            // keys: ['chongzhidianpu','chongzhifangshi','chongzhijine','zengsongjine','fanzengjifen','cardLevelName6','shifoukaifapiao','beizhuxinxi'],
            keys : this.findKeysByType(),
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
        const { visible = false, ...otherProps} = nextProps;
        this.setState({
          visible,
          transTypeChild: nextProps.transTypeParent,
          // transWay: nextProps.transWay,
          transWay: 'false',
        //   transWay: nextProps.rechargeParent
        });
        this.findKeysByType();

        // this.setNewKeysByTransWayValue(transWay);
        // this.setNewKeysByInvoiceFlagValue(invoiceFlag);
        // this.setNewKeysByUseVisibleValue(useVisible);
        this.setNewKeysByType(otherProps);
    }
    componentWillUnmount() {
        //console.log('组件卸载时的充值方式', this.state.transWay);
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
        const { type, transWay, invoiceFlag, useVisible, deferTypeFlag} = otherProps;
        switch(type) {
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
            if(item.type == this.props.type) return item.keys
        })[0].keys;
        return keys;
    }
    /**
     * [description] 会员充值时，根据不同的充值方式设置不同的keys
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    setNewKeysByTransWayValue = value => {
        if(value == 'false'&& _.indexOf(this.state.keys,'transAmount')==-1) {
            this.setNewKeys(2,2,'transAmount','transReturnMoneyAmount','transReturnPointAmount');
        } else if(value == 'true' && _.indexOf(this.state.keys,'taocanxuanze')==-1){
            this.setNewKeys(2,3,'taocanxuanze','taocanxinxi');
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
        if(value == 'false'){
            if(_.indexOf(keys, 'invoiceNO') > -1){
                let len = length - 4;
                this.setNewKeys(len,3);
            }
        } else {
            let len = length - 1;
            this.setNewKeys(len, 0, 'invoiceTitle','invoiceNO','kaipiaojine');
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
        if(value == true) {
            let len = length;
            this.setNewKeys(len, 0, 'smsContent');
        } else if( value == false){
            if(_.indexOf(keys, 'smsContent') > -1){
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
        if(value == '1') {
            let len = length-1;
            // keys.splice(len,1,'deferToDate');
            // this.setState({ keys });
            this.setNewKeys(len, 1, 'deferToDate');
        } else {
            let len = length-1;
            // keys.splice(len,1,'deferDays');
            // this.setState({ keys });
            this.setNewKeys(len, 1, 'deferDays');
        }
    }
    handleSubmit = (loadingTrueFn, visibleFn, loadingFalseFn) => {
        this.basicForm.validateFieldsAndScroll((err, basicValues) => {
            const { type } = this.props;
            // this.specialErrorProcess(err, basicValues);
            if(type == 'adjustment') {
                if(err) return;
                // 找到undefined的个数
                var len = '';
                _.mapValues(basicValues, function(value, key){
                    switch(key){
                        case 'adjustGiveBalance':
                        case 'adjustMoneyBalance':
                        case 'adjustPointBalance':
                            if(value == undefined) {
                                len++;
                            }
                            break;
                    }
                });
                if(len == 3){
                    message.error('调整的项目至少有一个非零值');
                    return;
                }
            } else  if(type == 'adjustQuota'){
                if (err) return;
                let { baseInfoData } = this.props;
                if(baseInfoData.isCreditCustomer == false){
                    message.error('由于该会员卡的等级无法享受挂账，所以无法调整挂账额度');
                    return;
                }
            } else {
                if (err) return;
            }

            loadingTrueFn();
            // 各个参数列表
            //console.log('会员卡充值信息', basicValues);

            let _params = this.getdiffParamsByType(basicValues);
            let { baseInfoData } = this.props;
            // 基本参数
            let baseInfoParams = { cardID: baseInfoData.cardID, cardTypeID: baseInfoData.cardTypeID };
            const callServer = this.findCallServerByType(this.props.type);
            // let params = {...basicValues, ...baseInfoParams, ..._params};
            let params = {};
            if(this.props.type == 'batchPostpone'){
                params = {..._params};
            } else if(this.props.type=='postpone'){
                params = { ...baseInfoParams, ..._params };
            } else if(this.props.type=='consumption') {
                // basicValues.transTime = basicValues.transTime && basicValues.transTime.format("YYYYMMDD");
                params = {...baseInfoParams, ..._params};
                params = _.omit(params, 'shopID', 'invoiceFlag');
            } else if(this.props.type=='adjustment'){
                params = {...baseInfoParams, ..._params};
                if(String(params.shopID) == '0') {
                    params.transWay = 1;
                } else {
                    params.transWay = 0;
                }
            }
            else {
                params = {...baseInfoParams, ..._params};
            }
            fetchData(callServer, params, null, {path:'data'}).then(data => {
                visibleFn();
                const { type='recharge' } = this.props;
                const title = Cfg.operationTypeCfg.filter(item => {
                    if(item.type == type) return item.describe;
                });
                message.success(`${title.length > 0 ? title[0].name : ''}成功！`);
            }).catch(err => {
                loadingFalseFn();
            });
        });
    }
    /**
     * [description] 根据不同的类型选择不同的接口
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    findCallServerByType = type => {
        switch(type) {
            case 'recharge':
                return 'updateCrmOperationRecharge';
            case 'adjustment':
                return 'manualAdjustBalance';
            case 'adjustQuota':
                return 'crmOperationAdjustQuota';
            case 'postpone':
                return 'crmOperationPostpone';
            case 'batchPostpone':
                return 'crmOperationBatchPostpone';
            case 'consumption':
                return 'crmOperationConsume';
            case 'recede':
                return 'crmOperationRecede';
            case 'resetPassword':
                return 'crmOperationResetCardPWD';
            case 'modifyPassWord':
                return 'crmOperationChangeCardPWD';
            default:
                return 'updateCrmOperation';
        }
    }
    /**
     * [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */
    getdiffParamsByType = params => {
        const { type, shopsData } = this.props;
        let source = {sourceWay: 0, sourceType: 60};
        let _type = 0;
        let { cardStatus } = this.props.baseInfoData;
        if(cardStatus == 30) {
            _type = 21;
        } else if(cardStatus == 20) {
            _type = 11;
        }
        switch(type) {
            case 'recharge':
                // console.log('会员充值参数',params);
                if(params.setSelected !== undefined) {
                    params.saveMoneySetID = params.setSelected.saveMoneySetID;
                    params.saveMoneySetName = params.setSelected.setName;}

                params = _.omit(params, 'setSelected', 'setInfo');
                return {
                    posOrderNo: this.props.uuid,
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params),
                    ...this.formatFormData(params),
                    transType: 20,
                    transWay: 0,
                };
            case 'active':
                return {
                    optionType: _type,
                    shopID: Number(params.shopID),
                    shopName: this.findShopNameByShopID(params), ...source,
                    ...this.formatFormData(params)
                };
            case 'lose':
                return {optionType: 10, shopID: Number(params.shopID), shopName: this.findShopNameByShopID(params), ...source, ...this.formatFormData(params)};
            case 'freeze':
                return {optionType: 20, shopID: Number(params.shopID), shopName: this.findShopNameByShopID(params), ...source,...this.formatFormData(params)};
            case 'cancelled':
                return {optionType: 30, shopID: Number(params.shopID), shopName: this.findShopNameByShopID(params), ...source,...this.formatFormData(params)};
            case 'change':
                return {optionType: 40, shopID: Number(params.shopID), shopName: this.findShopNameByShopID(params),...source, ...this.formatFormData(params)};
            case 'consumption':
                return {transShopID: Number(params.shopID), transShopName: this.findShopNameByShopID(params),...this.formatFormData(params)};
            case 'recede':
                return {transShopID: Number(params.shopID), transShopName: this.findShopNameByShopID(params),...this.formatFormData(params)};
            case 'adjustment':
                // this.props.callbackTransType(params.transType);
                return {transShopID: Number(params.shopID), shopName: this.findShopNameByShopID(params),...this.formatFormData(params)};
            case 'modifyPassWord':
            case 'postpone':
            case 'batchPostpone':
            case 'adjustQuota':
                return {
                    ...this.formatFormData(params)
                };
        }
    }
    formatFormData = params => {
        return _.mapValues(params, (value, key) => {
            switch(key){
                case 'deferToDate':
                case 'transTime':
                    return value = value == undefined ? '' : value.format("YYYYMMDDHHmmss");
                case 'payWayName':
                    return value = _.result(_.find(Cfg.paymentWay, { value : value}), 'label');
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
        const { shopsData } = this.props;
        if(shopID == '0') return '网上自助店铺';
        let shopName = _.compact(_.map(shopsData, function(shop){
            if(String(shop.shopID) == shopID) return shop.shopName;
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
        //console.log('newKeys-----------------',newKeys);
        //console.log('newKeys--哈哈哈---------------',...newKeys);
        keys = _.uniq(keys, true);
        this.setState({ keys });
        return keys;
    }
    /**
     * [description] 根据value值获得label，配合Cfg使用
     * @param  {[type]} cfg [description]
     * @param  {[type]} val [description]
     * @return {[type]}     [description]
     */
    mapValueToLabel = (cfg, val) => {
        return _.result(_.find(cfg, { type : val}), 'name');
    }
    handleFormChange = (key, value) => {
        switch(key) {
            case 'setSelected':
                //console.log('value的值',_.isPlainObject(value) == true)
                this.basicForm.setFieldsValue({
                    setValue: value.setName == undefined ? '' : value.setName,
                    setInfo: value.setSaveMoney == undefined ? '' : `充值金额：${value.setSaveMoney}元\n赠送金额：${value.returnMoney}元\n返积分：${value.returnPoint}分\n可用会员卡类型：${value.level}\n可使用礼品：${value.gift}`,
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
                this.setState({ useVisible: value });
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
                this.setState({ setShopID: value});
                this.basicForm.setFieldsValue({
                    setValue: '',
                    setInfo: '' ,
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
            let ff = _.map(item, function(_item){
                return _.pick(_item, ['shopName','shopID']);
            }).map(shop => {
                return {content: shop.shopName, id: shop.shopID}
            });
            itemArray.push({
                province: {id:key, content: item[0].cityName},
                cities:ff
            });
        });
        let shopsData = [];
        _.forEach(itemArray, (item, key) => {
            let children = [];
            _.forEach(item.cities, (city, index) => {
                children.push({
                    label: city.content,
                    value: String(city.id),
                    key: key+''+index,
                })
            });
            shopsData.push({
                label: item.province.content,
                value: '',
                key: key,
                children:children,
            })
        });
        shopsData.unshift({
            label: '不限城市',
            // value: '0',
            key: '0',
            children: [{
              label: '网上自助店铺',
              value: '0',
              key: '0',
            }]
        })
        return shopsData;
    }
    checkConfirm = (rule, value, callback) => {
        if (value && this.state.confirmDirty) {
            this.basicForm.validateFields(['newCardPWD'], { force: true });
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
    render() {
        const basicFormKeys = [{
            col: { span: 24 },
            keys: this.state.keys,
        }];
        const data = {transType: this.state.transTypeChild, transWay: this.state.transWay};
        const title = Cfg.operationTypeCfg.filter(item => {
            if(item.type == this.props.type) return item.describe;
        });
        const { type, shopsData, baseInfoData } = this.props;
        const tProps = {
          treeData: this.preProShops(shopsData),
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
        const formItems = {
          shopID: {
            type: 'custom',
            label: `${labelShop}店铺`,
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder: `请选择${labelShop}店铺`,
            // defaultValue: ['0'],
            render: decorator => (
                  <Row>
                    <Col span={24} className="crmOperationTree">
                      <FormItem>
                        {decorator({
                        })(<TreeSelect {...tProps} />)}
                      </FormItem>
                    </Col>
                  </Row>
            ),
            rules: [{
              required: true, message: `请选择${labelShop}店铺`
            }]
          },
          transWay: {
            type: 'radio',
            label: '充值方式',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder: '请选择充值方式',
            options: Cfg.rechargeWay,
            defaultValue: 'false',
            // rules: [{
            //   required: true, message: '请选择充值方式'
            // }]
          },
        taocanxuanze: {
            type: 'custom',
            label: '套餐选择',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请选择套餐',
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
                            baseInfoData={ baseInfoData }
                            setShopID={this.state.setShopID}
                        />)}
                      </FormItem>
                    </Col>
                </Row>
            )
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
        },
          taocanxinxi: {
            type: 'custom',
            label: '套餐信息',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请选择套餐',
            render: decorator => (
                  <Row className={styles.setInfoWrap}>
                    <Col span={24} >
                      <FormItem>
                        {decorator({
                            key: 'setInfo',
                          // rules:[{
                          //   pattern: /^(?:[1-9]\d{0,7})$/,
                          //   message: '套餐数量必须是在1-99999999之间的整数'
                          // }],
                        })(<Input  type="textarea" disabled/>)}
                      </FormItem>
                    </Col>
                  </Row>
            )
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          transAmount: {
            type: 'text',
            label: `${type == 'recharge' ? '充值金额' : '退现金卡值'}`,
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder: `请输入${type == 'recharge' ? '充值金额' : '退现金卡值'}`,
            surfix:'元',
            rules: [{
                required: true, message: '请输入充值金额',
             },{
                pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                message: '必须是整数部分不超过8位且小数部分不超过2位的数',
            }]
          },
          transReturnMoneyAmount: {
            type: 'text',
            label: `${type == 'recharge' ? '赠送金额' : '减赠送卡值'}`,
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder: `请输入${type == 'recharge' ? '赠送金额' : '减赠送卡值'}`,
            surfix:'元',
            rules: [{
                pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                message: '必须是整数部分不超过8位且小数部分不超过2位的数',
            }]
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          transReturnPointAmount: {
            type: 'text',
            // label: '返增积分',
            label: `${type == 'recharge' ? '返增积分' : '扣除积分'}`,
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder: `请输入${type == 'recharge' ? '返增积分' : '扣除积分'}`,
            surfix:'分',
            rules: [{
                pattern: /^\+?\d{0,8}$/,
                message: '必须是整数部分不超过8位',
            }]
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          payWayName: {
            type: 'radio',
            label: '付款方式',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入会员卡号或手机号',
            options: Cfg.paymentWay,
            defaultValue: '0',
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          invoiceFlag: {
            type: 'radio',
            label: '是否开发票',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入会员卡号或手机号',
            options: Cfg.isInvoice,
            defaultValue: 'false',
            // rules: [{
            //   required: true, message: '请选择是否开发票'
            // }]
          },
          invoiceConsumFlag: {
            type: 'radio',
            label: '是否开发票',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入会员卡号或手机号',
            options: Cfg.isInvoice,
            defaultValue: 'false',
            // rules: [{
            //   required: true, message: '请选择是否开发票'
            // }]
          },
          invoiceNO: {
            type: 'text',
            label: '发票单号',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入发票单号',
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          invoiceTitle: {
              type: 'text',
              label: '发票抬头',
              labelCol:  { span: 7 },
              wrapperCol:  { span: 14 },
              placeholder:'请输入发票抬头',
              rules: [{
                required: true, message: '请输入发票抬头'
              }]
          },
          kaipiaojine: {
            type: 'text',
            label: '开票金额',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入开票金额',
            surfix:'元',
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          transRemark: {
            type: 'textarea',
            label: '备注信息',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入备注信息',
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
        //   transAmount: {
        //     type: 'text',
        //     label: '退现金卡值',
        //     labelCol:  { span: 7 },
        //     wrapperCol:  { span: 14 },
        //     placeholder:'请输入退现金卡值',
        //     surfix:'元',
        //     rules: [{
        //       required: true, message: '请输入等级名称'
        //     }]
        //   },
        //   transReturnMoneyAmount: {
        //     type: 'text',
        //     label: '减赠送卡值',
        //     labelCol:  { span: 7 },
        //     wrapperCol:  { span: 14 },
        //     placeholder:'请输入减赠送卡值',
        //     surfix:'元',
        //     rules: [{
        //       required: true, message: '请输入等级名称'
        //     }]
        //   },
        //   transReturnPointAmount: {
        //     type: 'text',
        //     label: '扣除积分',
        //     labelCol:  { span: 7 },
        //     wrapperCol:  { span: 14 },
        //     placeholder:'请输入扣除积分',
        //     surfix:'分',
        //     rules: [{
        //       required: true, message: '请输入等级名称'
        //     }]
        //   },
          newCardNoOrMobile: {
            type: 'text',
            label: '更换后卡号',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入更换后卡号',
          },
          cardFee: {
            type: 'text',
            label: '换卡工本费',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入换卡工本费',
            surfix:'元',
            rules: [{
                pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                message: '必须是整数部分不超过8位且小数部分不超过2位的数',
            }]
          },
          jiesuanzhuotai: {
            type: 'text',
            label: '结算桌台',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入结算桌台',
          },
          zhangdanrenshu: {
            type: 'text',
            label: '账单人数',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入账单人数',
            surfix:'人',
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          deductMoneyAmount: {
            type: 'text',
            label: '卡结金额',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入卡结金额',
            surfix:'元',
            rules: [{
                required: true, message: '请输入卡结金额'
            },{
                  pattern:/(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                  message: '必须是整数部分不超过8位且小数部分不超过2位的数',
                }],
          },
          transTime:{
            label:'结算日期',
            type: 'custom',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            render: decorator => (
                  <Row className={styles.setInfoWrap}>
                    <Col span={24} >
                      <FormItem>
                        {decorator({
                        })(
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
          deferType: {
            type: 'radio',
            label: '延期方式',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            // placeholder:'请输入会员卡号或手机号',
            options: Cfg.yanqifangshi,
            defaultValue: '1',
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          deferToDate:{
            label:'选择日期',
            type:'datepicker',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请选择日期',
            rules: [{
              // type:'number',
              required: true, message: '请选择延期日期',
              }]
          },
          deferDays:{
            type: 'text',
            label: '延期天数',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入延期天数',
            surfix:'天',
            rules:[{
              // type:'number',
              required: true, message: '请选择延期天数',
          },{
                pattern:/^(([1-9]\d{0,4}))?$/,
                message: '必须是大于0的5位整数',
            }]

          },
        startCardNO: {
            type: 'text',
            label: '起始卡号',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 13 },
            placeholder:'请输入起始卡号',
            rules:[{
                required: true, message: '请输入起始卡号',
            },{
                pattern:/^(([1-9]\d{0,7}))?$/,
                message: '必须是大于0的8位整数',
            }]
        },
        endCardNO: {
          type: 'text',
          label: '终止卡号',
          labelCol:  { span: 7 },
          wrapperCol:  { span: 13 },
          placeholder:'请输入终止卡号',
          rules:[{
              required: true, message: '请输入终止卡号',
          },{
              pattern:/^(([1-9]\d{0,7}))?$/,
              message: '必须是大于0的8位整数',
          }]
        },
        transType: {
            type: 'radio',
            label: '调账类型',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            // value: this.state.transTypeChild,
            // placeholder:'请输入会员卡号或手机号',
            options: Cfg.tiaozhangleixing,
            // defaultValue: this.state.transTypeChild,
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
        },
          adjustMoneyBalance: {
            type: 'text',
            label: '现金卡值调整',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入现金卡值调整数值',
            surfix:'元',
            rules:[{
                  pattern: /^[+-]?\d{1,8}$|^[+-]?\d{1,8}[.]\d{1,2}$/,
                  message: '必须是整数部分不超过8位且小数部分不超过2位的数',
                }]
          },
          adjustGiveBalance: {
            type: 'text',
            label: '赠送卡值调整',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入赠送卡值调整数值',
            surfix:'元',
            rules:[{
                  pattern: /^[+-]?\d{1,8}$|^[+-]?\d{1,8}[.]\d{1,2}$/,
                  message: '必须是整数部分不超过8位且小数部分不超过2位的数',
                }]
          },
          adjustPointBalance: {
            type: 'text',
            label: '积分调整',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入积分调整数值',
            surfix:'分',
            rules:[{
                pattern: /^[+-]?\d{1,8}$/,
                message: '必须是整数部分不超过8位',
            }]
          },
          visiable: {
            type: 'switcher',
            label: '用户是否可见',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
          },
          smsContent: {
            type: 'textarea',
            label: '短信通知用户',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入短信用户',
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          originCreditAmount: {
            type: 'text',
            label: '原始额度',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            disabled: true,
            placeholder: '请输入原始额度',
            surfix: '元',
            defaultValue: `${baseInfoData.creditAmount}`,
            // rules: [{
            //   required: true, message: '请输入等级名称'
            // }]
          },
          creditAmount: {
            type: 'text',
            label: '调整额度',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入调整额度金额数量',
            surfix:'元',
            rules: [{
                required: true, message: '请输入调账额度'
            },{
                pattern: /(^\+?\d{0,8}$)|(^\+?\d{0,8}\.\d{0,2}$)/,
                message: '必须是整数部分不超过8位且小数部分不超过2位的数',
            }]
          },
          oldCardPWD: {
            type: 'password',
            label: '请输入原密码',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入原密码',
            rules: [{
              required: true, message: '请输入原密码',
            }]
          },
          cardPWD: {
            type: 'password',
            label: '请输入新密码',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请输入新密码',
            rules: [{
                required: true, message: '请输入新密码',
            },{
                validator: this.checkConfirm,
            }]
          },
          newCardPWD: {
            type: 'password',
            label: '再次输入新密码',
            labelCol:  { span: 7 },
            wrapperCol:  { span: 14 },
            placeholder:'请再次输入新密码',
            rules: [{
                required: true, message: '请输入新密码',
            },{
                validator: this.checkPassword,
            }]
          },
            fapiaodanhao: {
                type: 'text',
                label: '发票单号',
                labelCol:  { span: 7 },
                wrapperCol:  { span: 14 },
                placeholder:'请输入发票单号',
                surfix:'元',
            },
        };
        return (
          <div className={styles.crmSet}>
            <Row>
              <Col span={24} >
                <div className={[styles.titleWrap_2,'clearfix'].join(' ')}><p className={styles.flag}></p><h5 className={styles.title}>{`${title.length > 0 ? title[0].abbreviation : ''}信息`}</h5></div>
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

function isEmpty(value) {
  return (Array.isArray(value) && value.length === 0)
      || (Object.prototype.isPrototypeOf(value) && Object.keys(value).length === 0);
}
