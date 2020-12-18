import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { axiosData, isFilterShopType } from '../../../helpers/util';
import {
    Row,
    Col,
    Icon,
    Tooltip,
    message,
    Select,
    Input,
    Radio,
    Form,
} from 'antd';
import styles from './GiftAdd.less';
import BaseForm from '../../../components/common/BaseForm';
import GiftCfg from '../../../constants/Gift';
import {
    cancelCreateOrEditGift, changeGiftFormKeyValue, endSaving,
    FetchGiftList, startSaving,
} from '../_action';
import IsSync from './common/IsSync';
import GiftImagePath from './common/GiftImagePath';
import {debounce} from 'lodash';
import ShopSelector from "../../../components/common/ShopSelector/ShopSelector";
import {getPromotionShopSchema} from "../../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import SelectBrands from "../components/SelectBrands";
import SelectCardTypes from "../components/SelectCardTypes";
import PushMessageMpID from "../components/PushMessageMpID";
import SellerCode from "../components/SellerCode";
import FakeBorderedLabel from "../components/FakeBorderedLabel";
import GiftInfoHaveCoupon from './GiftInfoHaveCoupon';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class GiftAddModal extends React.Component {
    constructor(props) {
        super(props);
        const shopSchema = props.shopSchema.getIn(['shopSchema']).toJS();

        this.state = {
            groupTypes: [],
            shopsData: [],
            shopSchema, // 后台请求来的值
            values: {},
            transferType: 0,
            isUpdate: true,
            disCashKeys: false,     // 定额卡模式下，是否要隐藏现金卡值和赠送卡值
            unit: '¥',
            valueType: '0',
            monetaryUnit: '0',
        };
        this.baseForm = null;
        this.refMap = null;
        this.handleNameChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleRemarkChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleValueChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
    }
    componentDidMount() {
        const { getPromotionShopSchema, gift: {data}} = this.props;
        const { valueType = '0', monetaryUnit= '0' } = data;
        let parm = {}
        if(isFilterShopType()) parm = {productCode: 'HLL_CRM_License'}
        getPromotionShopSchema({groupID: this.props.accountInfo.toJS().groupID, ...parm});
        this.setState({
            isUpdate: this.props.myActivities.get('isUpdate'),
            valueType,
            monetaryUnit,
        })
        // 礼品名称 auto focus
        try {
            this.refMap.giftName.focus()
        } catch (e) {
            // oops
        }

    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.shopSchema.getIn(['shopSchema']) !== this.props.shopSchema.getIn(['shopSchema'])) {
            this.setState({shopSchema: nextProps.shopSchema.getIn(['shopSchema']).toJS(), // 后台请求来的值
            });
        }
        if (this.props.myActivities.get('isUpdate') !== nextProps.myActivities.get('isUpdate')) {
            this.setState({ isUpdate: nextProps.myActivities.get('isUpdate') })
        }
    }
    handleFormChange(key, value) {
        console.log('now change the ', key, 'the value is ', value)
        switch (key) { // 这三个字段是靠手动输入的, 不加debounce的话在一般机器上有卡顿
            case 'giftName':
            case 'pushMessage':
                this.handleNameChangeDebounced({key, value});
                break;
            case 'giftRemark':    this.handleRemarkChangeDebounced({key, value});
                break;
            case 'giftValue':    this.handleValueChangeDebounced({key, value});
                break;
            default: this.props.changeGiftFormKeyValue({key, value});
        }
        // 赠送卡值freePrice =  礼品卡面值 （giftDenomination） - 工本费 （giftCost） - 现金卡值 cardPrice
        if(key === 'giftDenomination'){
            const disCashKeys = (+value === 0);
            this.setState({ disCashKeys });     // 卡面值=0，赠送值和现金值 不显示
            const giftDenomination = +value || 0;
            const giftCost = +this.baseForm.getFieldValue('giftCost') || 0;
            const cardPrice = +this.baseForm.getFieldValue('cardPrice') || 0;
            const sum = (giftDenomination * 100) - (giftCost * 100) - (cardPrice * 100);
            let freePrice = sum / 100;  // 防止失精
            if(sum < 0) { freePrice = 0; }
            this.baseForm.setFieldsValue({ freePrice });
        }
        if(key === 'giftCost'){
            const giftCost = +value || 0;
            const giftDenomination = +this.baseForm.getFieldValue('giftDenomination') || 0;
            const cardPrice = +this.baseForm.getFieldValue('cardPrice') || 0;
            const sum = (giftDenomination * 100) - (giftCost * 100) - (cardPrice * 100);
            let freePrice = sum / 100;  // 防止失精
            if(sum < 0) { freePrice = 0; }
            this.baseForm.setFieldsValue({ freePrice });
        }
        if(key === 'cardPrice'){
            const cardPrice = +value || 0;
            const giftDenomination = +this.baseForm.getFieldValue('giftDenomination') || 0;
            const giftCost = +this.baseForm.getFieldValue('giftCost') || 0;
            const sum = (giftDenomination * 100) - (giftCost * 100) - (cardPrice * 100);
            let freePrice = sum / 100;  // 防止失精
            if(sum < 0) { freePrice = 0; }
            this.baseForm.setFieldsValue({ freePrice });
        }
        if(key==='giftValueCurrencyType') {
            this.setState({ unit: value });
        }
        if(key==='valueType') {
            this.setState({ valueType: value });
        }
        if(key === 'quotaCardGiftConfList') {
            const quotaCardGiftConfList = +this.baseForm.getFieldValue('quotaCardGiftConfList') || {};
            if(!Object.keys(quotaCardGiftConfList).includes('presentType') ) {
                // 初始化礼品详情的值
                this.initGiftDetail(value)
            }
        }


    }
    handleSubmit() {
        const { groupTypes } = this.state;
        const { type, gift: { value, data } } = this.props;

        this.baseForm.validateFieldsAndScroll((err, values) => {
            if (err) return;
            let params = _.assign(values, { giftType: value });
            let callServer = '';
            let shopNames = '', shopIDs = '';

            // 兼容处理
            if(params.hasOwnProperty('quotaCardGiftConfList') && params.quotaCardGiftConfList !== undefined) {
                const presentType = params.quotaCardGiftConfList.presentType
                if(presentType == 1) {
                    params = {
                        ...params,
                        ...params.quotaCardGiftConfList
                    }
                } else if(presentType == 4) {
                    params = {
                        ...params,
                        presentType,
                        quotaCardGiftConfList: params.quotaCardGiftConfList.chooseCoupon
                    }
                }  else if(presentType == 0) {
                    params = {
                        ...params,
                        presentType,
                        quotaCardGiftConfList: []
                    }
                }
            }

            try {
                if (params.shopNames) {
                    const shops = this.state.shopSchema.shops;
                    const selectedShopEntities = shops.filter(item => params.shopNames.includes(item.shopID)).map(shop => ({content: shop.shopName, id: shop.shopID}));
                    selectedShopEntities.forEach((shop) => {
                        shopNames += `${shop.content + ',' || ''}`;
                        shopIDs += `${shop.id + ',' || ''}`;
                    });
                }
            } catch (e) {
                console.log('no shop info');
            }
            // 授权门店过滤
            if(isFilterShopType()){
                let dynamicShopSchema = Object.assign({}, this.props.shopSchema.toJS());
                let {shopSchema = {}} = dynamicShopSchema
                let {shops = []} = shopSchema
                let shopsInfo = shopIDs.split(',')
                params.shopIDs = shopsInfo.filter((item) => shops.some(i => i.shopID == item)).join(',')
            }
            params.shopNames = shopNames || ',';
            params.shopIDs = shopIDs || ',';
            // 定额卡工本费
            if (value == '90') {
                // http://wiki.hualala.com/pages/viewpage.action?pageId=46105225
                // 变量都被换了
                const { cardPrice } = params;
                params.giftCost = `${Number(params.giftCost || 0)}`;
                params.giftValue = cardPrice || '0';
            }else{
                params.giftValue = params.giftValue || '0';
            }
            if (type === 'add') {
                callServer = '/coupon/couponService_addBoard.ajax';
                if (values.brandID === '-1') {
                    params = _.omit(params, 'brandID');
                } else {
                    const brandJSON = _.find(groupTypes, { value: values.brandID }) || {};
                    params.giftName = `${brandJSON.label || ''}${values.giftName}`;
                }
            } else if (type === 'edit') {
                callServer = '/coupon/couponService_updateBoard.ajax';
                params.giftItemID = data.giftItemID;
            } else if (type === 'copy') {
                callServer = '/coupon/couponService_addBoard.ajax';
                params.sourceType = 80;
            }
            params.brandSelectType = (params.selectBrands || []).length ? 0 : 1;
            if (params.sellerCode) {
                const [ settleId, merchantNo, settleName ] = params.sellerCode.split(':');
                params.settleId = settleId;
                params.merchantNo = merchantNo;
                params.settleName = settleName;
            }
            params.openPushMessageMpID = 1;
            params.openPushSms = params.pushMessage && params.pushMessage.sendType.indexOf('msg') !== -1 ? 1 : 0
            params.reminderTime = params.pushMessage && params.pushMessage.reminderTime
            params.pushMessageMpID = params.pushMessage && params.pushMessage.pushMessageMpID
            const { accountInfo, startSaving, endSaving } = this.props;
            const { groupName } = accountInfo.toJS();
            startSaving();
            axiosData(callServer, { ...params, groupName }, null, { path: '' }, 'HTTP_SERVICE_URL_PROMOTION_NEW').then((data) => {
                endSaving();
                message.success('成功', 3);
                this.props.cancelCreateOrEditGift()
            }).catch(err => {
                console.log(err);
                endSaving()
            });
        });
    }

    handleShopSelectorChange(values) {
        this.setState({
            values: {...this.state.values, shopNames: values}
        });
    }

    handleCancel() {
        this.baseForm.resetFields();
        this.setState({
            current: 0,
            values: {},
        });
        this.props.onCancel();
    }

    renderShopNames(decorator) {
        const { shopNames = [] } = this.state.values;
        return (
            <Row style={{ marginBottom: shopNames.length === 0 ? -15 : 0 }}>
                <Col>
                    {decorator({})(
                        <ShopSelector
                            onChange={
                                this.handleShopSelectorChange
                            }
                            schemaData={this.state.shopSchema}
                        />
                    )}
                </Col>
                <p style={{ color: 'orange', display: shopNames.length > 0 ? 'none' : 'block' }}>未选择门店时默认所有门店通用</p>
            </Row>
        )
    }
    handleCurrencyChange = (currency) => {
        this.setState({ currency });
    }
    initGiftDetail = (data) => {
        // 后端定义神奇的接口，为券包的时候，入参数，放quotaCardGiftConfList，从couponPackageBaseInfo取，入参和出参不一致
        // 原数据-this.props.gift.data/改动后数据-data
        let datas = data.presentType == undefined ? this.props.gift.data : data
        const  { quotaCardGiftConfList, presentType = 0, couponPackageBaseInfo = {}, chooseCoupon = [] } = datas
        let params = {
            presentType,
            quotaCardGiftConfList: [],
            chooseCoupon: []
        }

        if(presentType === 4 && couponPackageBaseInfo) {
            params = {
                presentType,
                chooseCoupon: data.presentType == undefined ? [couponPackageBaseInfo] : chooseCoupon,
                quotaCardGiftConfList: []
            }
        }
        if(presentType === 1) {
            params = {
                presentType,
                quotaCardGiftConfList,
                chooseCoupon: []
            }
        }

        this.baseForm.setFieldsValue({
            quotaCardGiftConfList: params
        });
    }
    render() {
        const { gift: { name: describe, value, data }, visible, type, treeData } = this.props;
        console.log('data is ', data)
        let valueLabel = value == '42' ? '积分数额' : value == '30' ? '礼品价值' : '礼品卡面值';
        if(value==40){
            valueLabel = '礼品价值';
        }
        const { unit } = this.state;
        const giftNameValid = (type === 'add') ? { max: 25, message: '不能超过25个字符' } : {};
        let formData = {};
        formData = data === undefined ? {} : data;
        if (type == 'edit' || type === 'copy') {
            if(value==='90'){
                const { giftValue } = data || {};
                formData.cardPrice = giftValue;
            }
        }
        if (data.shopNames && data.shopNames.length > 0 && data.shopNames[0].id) {
            formData.shopNames = data.shopNames.map(shop => shop.id);
        }
        if (!formData.pushMessage) {
            const sendType = ['wechat']
            if (formData.openPushSms) {
                sendType.push('msg')
            }
            formData.pushMessage = {
                pushMessageMpID: formData.pushMessageMpID,
                sendType,
                reminderTime: formData.reminderTime || 3,
            }
        }
        let formItems = {
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            pushMessage: {
                label: <span>
                    <span>消息推送</span>
                    <Tooltip title={
                        <div>
                            <p>
                                微信推送：在所选公众号推送券到账/券到期/券核销提醒
                            </p>
                            <p>
                                短信推送：仅在券到期前N天推送到期提醒
                            </p>
                        </div>
                    }
                    >
                        <Icon style={{ marginLeft: 5, marginRight: 5}} type="question-circle" />
                    </Tooltip>
                </span>,
                rules: [{
                    validator: (rule, v, cb) => {
                        if (v.sendType.indexOf('wechat') === -1) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '微信推送为必选项',
                }, {
                    validator: (rule, v, cb) => {
                        if (!v.pushMessageMpID) {
                            cb(rule.message);
                        }
                        cb();
                    },
                    message: '请选择微信推送的公众号',
                }],
                type: 'custom',
                render: decorator => decorator({})(<PushMessageMpID formData={formData} />),
            },
            sellerCode: {
                label: (
                    <span>
                        红包发放账户&nbsp;
                        <Tooltip title={<div>
                                注意：根据监管要求，商户号使用现金红包需要满足三个条件:
                                <br></br>
                                ◆入驻时间超过90天;<br></br>
                                ◆截止今日回推30天连续不间断保持有交易;<br></br>
                                ◆保持正常健康交易;<br></br>
                            </div>}>
                            <Icon type="question-circle" />
                        </Tooltip>
                    </span>
                ),
                rules: [{ required: true, message: '不得为空' }],
                type: 'custom',
                render: decorator => decorator({})(<SellerCode/>),
            },
            transferType: {
                label: '券是否可转赠',
                type: 'radio',
                defaultValue: 0,
                options: GiftCfg.transferType,
            },
            shopNames: {
                type: 'custom',
                label: '可使用店铺',
                defaultValue: [],
                render: decorator => this.renderShopNames(decorator),
            },
            giftValueCurrencyType: {
                label: '货币单位',
                type: 'combo',
                disabled: type !== 'add' && type !== 'copy',
                defaultValue: '¥',
                options: [
                    { label: '¥', value: '¥' },
                    { label: '€', value: '€' },
                    { label: '£', value: '£' },
                    { label: 'RM', value: 'RM' },
                    { label: 'S$', value: 'S$' },
                    { label: 'DHS', value: 'DHS' },
                    { label: 'MOP$', value: 'MOP$' },
                ],
            },
            giftValue: {
                label: valueLabel,
                type: 'text',
                placeholder: `请输入${valueLabel}`,
                disabled: type !== 'add' && type !== 'copy',
                prefix: value == '42' ? null : unit,
                surfix: value == '42' ? '分' : '',
                rules: value == '30'
                    ? [{ required: true, message: '礼品价值不能为空' }, { pattern: /(^\+?\d{0,5}$)|(^\+?\d{0,5}\.\d{0,2}$)/, message: '整数不能超过5位, 小数不能超过2位' }]
                    : [
                        { required: true, message: `${valueLabel}不能为空` },
                        { pattern: /(^\+?\d{0,5}$)|(^\+?\d{0,5}\.\d{0,2}$)/, message: '整数不能超过5位, 小数不能超过2位' },
                        {
                            validator: (rule, v, cb) => {
                                if (['10', '20', '40', '42'].includes(value) && v !== undefined && v !== '' && v == 0) {
                                    cb(rule.message);
                                }
                                cb()
                            },
                            message: '数额不得为0',
                        },
                    ],
            },
            giftName: {
                label: `礼品名称`,
                type: 'text',
                placeholder: '请输入礼品名称',
                size: 'large',
                rules: [
                    { required: true, message: '礼品名称不能为空' },
                    { max: this.props.type == 'add' ? 35 : 50, message: `不能超过${this.props.type == 'add' ? `35`: `50`}个字符` },
                ],
                disabled: type !== 'add' && type !== 'copy',
            },
            giftCost: {
                type: 'text',
                label: '卡片工本费',
                disabled: type !== 'add' && type !== 'copy',
                placeholder: '请输入卡片工本费金额',
                surfix: '元',
                rules: [
                    { pattern: /(^\+?\d{0,9}$)|(^\+?\d{0,9}\.\d{0,2}$)/, message: '请输入大于或等于0的值，整数不超过9位，小数不超过2位' },
                    {
                        validator: (rule, v, cb) => {
                            // value 卡片工本费
                            // giftDenomination 礼品卡面值
                            // cardPrice 现金卡值
                            const { getFieldValue } = this.baseForm;
                            const cardPrice = getFieldValue('cardPrice') || 0;
                            const giftDenomination = getFieldValue('giftDenomination') || 0;
                            if(cardPrice === undefined){
                                return cb();
                            }
                            if (+v > (giftDenomination - cardPrice)) {
                                return cb('卡片工本费需≤礼品卡面值-现金卡值');
                            }
                            return cb();
                        },
                    }],
            },
            price: {
                type: 'text',
                label:
                <div style={{ display: 'inline-block'}}>
                    <span>记录实收金额</span>
                    <Tooltip title={
                        <p>
                            记录实收金额：仅用于报表作为实收金额核算
                        </p>
                    }>
                        <Icon style={{ marginLeft: 5, marginRight: -5}} type="question-circle" />
                    </Tooltip>
                </div>,
                disabled: type !== 'add' && type !== 'copy',
                placeholder: '请输入记录实收金额金额',
                prefix: unit,
                rules: [{ required: true, message: '记录实收金额不能为空' },
                { pattern: /(^\+?\d{0,9}$)|(^\+?\d{0,9}\.\d{0,2}$)/, message: '请输入大于0的值，整数不超过9位，小数不超过2位' }],
            },
            giftRemark: {
                label: '礼品详情',
                type: 'textarea',
                placeholder: '请输入礼品详情',
                rules: [
                    { required: true, message: '礼品详情不能为空' },
                    { max: 400, message: '最多400个字符' },
                ],
            },
            wishing: {
                label: '红包祝福语',
                type: 'textarea',
                placeholder: '恭喜发财，大吉大利',
                rules: [
                    { required: true, message: '红包祝福语不能为空' },
                    { max: 30, message: '最多30个字符' },
                ],
            },
            sendName: {
                label: '红包显示商户名称',
                type: 'text',
                rules: [
                    { required: true, message: '红包显示商户名称不能为空' },
                    { max: 20, message: '最多20个字符' },
                ],
            },
            selectBrands: {
                label: '所属品牌',
                type: 'custom',
                render: decorator => decorator({})(<SelectBrands/>),
            },
            cardTypeList: {
                label: '适用卡类',
                type: 'custom',
                render: decorator => decorator({})(<SelectCardTypes/>),
            },
            isSynch: {
                label: ` `,
                type: 'custom',
                defaultValue: false,
                render: type === 'copy' ? decorator => decorator({})(<div></div>) : decorator => decorator({})(<IsSync/>),
            },
            giftImagePath: {
                label: '礼品图样',
                type: 'custom',
                render: decorator => decorator({})(<GiftImagePath/>),
            },
            showGiftRule: {
                label: '显示系统生成规则',
                type: 'radio',
                defaultValue: 0,
                options: GiftCfg.showGiftRule,
            },
            basicInfoLabel: {
                label: ' ',
                type: 'custom',
                render: decorator => decorator({})(<FakeBorderedLabel title="基本信息" />),
            },
            safetyInfoLabel: {
                label: ' ',
                type: 'custom',
                render: decorator => decorator({})(<FakeBorderedLabel title="额度及安全" />),
            },
            giftRule: {
                label: '使用规则',
                type: 'custom',
                render: () => {
                    switch (value) {
                        case '30':
                            return '顾客在获取实物礼品券后，礼品具体领取方式请联系商家，商家会在核对信息无误后进行赠送。';
                        case '40':
                            return '顾客在获取会员充值券后，可以充入其会员卡中当卡值使用';
                        case '42':
                            return '顾客在获取会员积分券后，可以充入其会员卡中进行使用';
                        case '90':
                            return '顾客在获取定额卡之后，具体使用规则请联系商家！';
                    }
                },
            },
            moneyLimit: {
                label: '红包总计投放金额',
                type: 'text',
                placeholder: '请输入红包总计投放金额',
                surfix: '元',
                rules: [
                    { required: true, message: '不得为空' },
                    {
                        validator: (rule, v, cb) => {
                            if (/(^\+?\d{0,7}$)|(^\+?\d{0,7}\.\d{0,2}$)/.test(v) && v >= 1 & v <= 1000000) {
                                cb();
                            }
                            cb(rule.message);
                        },
                        message: '金额限制不小于1元，不超过1000000.00元',
                    },
                ],
            },
            userDayLimitCount: {
                label: '单用户单日领取数量',
                type: 'text',
                placeholder: '可设置区间1～10个',
                prefix: '不超过',
                surfix: '个',
                rules: [
                    { required: true, message: '不得为空' },
                    {
                        validator: (rule, v = '', cb) => {
                            if (/^(?:[1-9]|10)?$/.test(v)) {
                                return cb()
                            }
                            cb(rule.message);
                        },
                        message: '数量限制范围1~10'
                    }
                ],
            },
            userDayMoneyLimitValue: {
                label: '单用户单日领取金额',
                type: 'text',
                placeholder: '可设置最高额度1000.00元',
                prefix: '不超过',
                surfix: '元',
                rules: [
                    { required: true, message: '不得为空' },
                    {
                        validator: (rule, v, cb) => {
                            if (/(^\+?\d{0,4}$)|(^\+?\d{0,4}\.\d{0,2}$)/.test(v) && v >= 1 & v <= 1000) {
                                cb();
                            }
                            cb(rule.message);
                        },
                        message: '金额限制不小于1元，不超过1000.00元',
                    },
                ],
            },
            giftDenomination: {
                type: 'text',
                label: '礼品卡面值',
                surfix: '元',
                disabled: type !== 'add' && type !== 'copy',
                rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        if (!value && value != 0) {
                            return callback('礼品卡面值不能为空');
                        }
                        const { validateFields } = this.baseForm;
                        try{
                            validateFields(['cardPrice', 'giftCost'], { force: true });
                        }
                        catch(e){}
                        return callback();
                    },
                }],
            },
            cardPrice: {
                type: 'text',
                label: '现金卡值',
                surfix: '元',
                disabled: type !== 'add' && type !== 'copy',
                rules: [{
                    required: true,
                    validator: (rule, value, callback) => {
                        if (!value && value != 0) {
                            return callback('现金卡值不能为空');
                        }
                        const { getFieldValue,validateFields } = this.baseForm;
                        const giftDenomination = getFieldValue('giftDenomination') || 0;
                        if (+giftDenomination < +value) {
                            return callback('现金卡值需≤礼品卡面值');
                        }
                        validateFields(['giftCost'], { force: true });
                        return callback();
                    },
                }],
            },
            freePrice: {
                type: 'text',
                label: '赠送卡值',
                disabled: type !== 'copy',
                props: {placeholder: ''},
                surfix: '元',
            },
            quotaCardGiftConfList: {
                type: 'custom',
                label: '礼品详情',
                defaultValue: [],
                render: d => d()(<GiftInfoHaveCoupon groupID={this.props.accountInfo.toJS().groupID} />),
            },
        };
        const { valueType, monetaryUnit } = this.state;
        const giftValue = {
            label: '礼品价值',
            type: 'custom',
            rules: ['required'],
            render: d => (<div>
                <div style={{ display: 'flex'}}>
                <p style={{ width: 100 }}>
                    {d({
                        key: 'valueType',
                        // initialValue: valueType,
                        defaultValue: valueType,
                    })(<Select>
                            <Option value="0">固定金额</Option>
                            <Option value="1">随机金额</Option>
                        </Select>
                    )}
                </p>
                {valueType=='0' ?
                    <FormItem
                        wrapperCol={{span: 24}}
                        labelCol={{span: 0}}
                        style={{ width: 100, margin:'-4px 0 0 10px' }}
                    >
                        {d({
                            key: 'giftValue',
                            rules: [{
                                validator:(r,v,cb)=>{
                                    const reg = /^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/;
                                    if(!reg.test(v)) {
                                        return cb('最大支持5位整数，2位小数');
                                    }
                                    return cb();
                                }
                            }],
                            })(<Input addonBefore={unit} />
                        )}
                        </FormItem>
                    :
                    <p style={{ display: 'flex', margin:'0 0 0 10px' }}>
                        <FormItem
                            wrapperCol={{span: 24}}
                            labelCol={{span: 0}}
                            style={{ width: 100, margin:'-4px 0 0 0' }}
                        >
                        {d({
                            key: 'valueStart',
                            rules: [{
                                validator:(r,v,cb)=>{
                                    const reg = /^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/;
                                    if(v == 0) {
                                        return cb('不能为0');
                                    }
                                    if(!reg.test(v)) {
                                        return cb('最大支持5位整数，2位小数');
                                    }
                                    return cb();
                                }
                            }],
                            })(<Input addonBefore={unit} />
                        )}
                        </FormItem>
                        <span style={{ padding: '0 5px'}}> ~ </span>
                        <FormItem
                            wrapperCol={{span: 24}}
                            labelCol={{span: 0}}
                            style={{ width: 100, margin:'-4px 0 0 0' }}
                        >
                        {d({
                            key: 'valueEnd',
                            rules: [{
                                validator:(r,v,cb)=>{
                                    const reg = /^(([1-9]\d{0,4})|0)(\.\d{0,2})?$/;
                                    if(!reg.test(v)) {
                                        return cb('最大支持5位整数，2位小数');
                                    }
                                    const valueStart = this.baseForm.getFieldValue('valueStart');
                                    if(+v <= +valueStart){
                                        return cb('后一个金额需大于前一个金额');
                                    }
                                    return cb();
                                }
                            }],
                            })(<Input addonBefore={unit} />
                        )}
                        </FormItem>
                    </p>
                }
                </div>
                {valueType=='1' &&
                    <div>
                        <span style={{ padding: '0 8px 0 0'}}>最小单位</span>
                        {d({
                            key: 'monetaryUnit',
                            initialValue: monetaryUnit,
                            })(<RadioGroup>
                                <Radio value="0">元</Radio>
                                <Radio value="1">角</Radio>
                                <Radio value="2">分</Radio>
                            </RadioGroup>
                        )}
                    </div>
                }
            </div>),
        };
        // 随机金额
        if(value==='40') {
            formItems = { ...formItems, giftValue };
        }
        const formKeys = {
            '实物礼品券': [
                {
                    col:
                        { span: 24, pull: 2 },
                    keys: [
                        'giftType',
                        'giftName',
                        'selectBrands',
                        'pushMessage',
                        'giftValueCurrencyType',
                        'giftValue',
                        'giftRemark',
                        'shopNames',
                        'giftImagePath',
                        'giftRule',
                        'showGiftRule',
                        'isSynch'
                    ]
                }
            ],
            '会员积分券': [
                {
                    col: { span: 24, pull: 2 },
                    keys: [
                        'giftType',
                        'giftName',
                        'selectBrands',
                        'pushMessage',
                        'giftValueCurrencyType',
                        'giftValue',
                        'cardTypeList',
                        'giftRemark',
                        'giftRule',
                        'showGiftRule',
                        'giftImagePath',
                    ]
                }
            ],
            '会员充值券': [
                {
                    col: { span: 24, pull: 2 },
                    keys: [
                        'giftType',
                        'giftName',
                        'selectBrands',
                        'pushMessage',
                        'giftValueCurrencyType',
                        'giftValue',
                        'cardTypeList',
                        'giftRemark',
                        'giftRule',
                        'showGiftRule',
                        'giftImagePath',
                    ]
                }
            ],
            '礼品定额卡': [
                {
                    col: { span: 24, pull: 2 },
                    keys: [
                        'giftType',
                        'giftName',
                        'selectBrands',
                        'giftDenomination',
                        'cardPrice',
                        'freePrice',
                        'giftValueCurrencyType',
                        'giftCost',
                        'price',
                        'quotaCardGiftConfList',
                        'giftRemark',
                        'giftRule',
                        'showGiftRule',
                    ]
                }
            ],
            '现金红包': [
                {
                    col: { span: 24, pull: 2 },
                    keys: [
                        'basicInfoLabel',
                        'giftType',
                        'giftName',
                        'selectBrands',
                        'sellerCode',
                        'sendName',
                        'wishing',
                        'giftRemark',
                        'safetyInfoLabel',
                        'moneyLimit',
                        'userDayLimitCount',
                        'userDayMoneyLimitValue',
                    ]
                }
            ],
        };
        let newFormKeys = [...formKeys[describe]];
        if (this.state.disCashKeys) {
            const keys = [
                {
                    col: { span: 24, pull: 2 },
                    keys: [
                        'giftType',
                        'giftName',
                        'selectBrands',
                        'giftDenomination',
                        'giftValueCurrencyType',
                        'giftCost',
                        'price',
                        'quotaCardGiftConfList',
                        'giftRemark',
                        'giftRule',
                        'showGiftRule',
                    ]
                }
            ];
            newFormKeys = keys;
        }
        return (
            <div className={styles.giftAddModal}>
                <BaseForm
                    getForm={form => this.baseForm = form}
                    getRefs={refs => this.refMap = refs}
                    formItems={formItems}
                    formData={formData}
                    formKeys={newFormKeys}
                    onChange={(key, value) => this.handleFormChange(key, value)}
                    key={`${describe}-${type}`}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        params: state.sale_giftInfoNew.get('listParams'),
        accountInfo: state.user.get('accountInfo'),
        shopSchema: state.sale_shopSchema_New,
        menuList: state.user.get('menuList'),
        myActivities: state.sale_myActivities_NEW,
        treeData: state,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeGiftFormKeyValue: opts => dispatch(changeGiftFormKeyValue(opts)),
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
        startSaving: opts => dispatch(startSaving(opts)),
        endSaving: opts => dispatch(endSaving(opts)),
        getPromotionShopSchema: (opts) => {
            dispatch(getPromotionShopSchema(opts));
        },
        cancelCreateOrEditGift: opts => dispatch(cancelCreateOrEditGift(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {
        withRef: true
    }
)(GiftAddModal)
