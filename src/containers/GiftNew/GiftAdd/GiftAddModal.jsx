import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { axiosData } from '../../../helpers/util';
import {
    Row,
    Col,
    Icon,
    Tooltip,
    message,
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
        };
        this.baseForm = null;
        this.refMap = null;
        this.handleNameChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleRemarkChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
        this.handleValueChangeDebounced = debounce(this.props.changeGiftFormKeyValue.bind(this), 400);
    }
    componentDidMount() {
        const { getPromotionShopSchema} = this.props;
        getPromotionShopSchema({groupID: this.props.accountInfo.toJS().groupID});
        this.setState({
            isUpdate: this.props.myActivities.get('isUpdate'),
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
        switch (key) { // 这三个字段是靠手动输入的, 不加debounce的话在一般机器上有卡顿
            case 'giftName':    this.handleNameChangeDebounced({key, value});
                break;
            case 'giftRemark':    this.handleRemarkChangeDebounced({key, value});
                break;
            case 'giftValue':    this.handleValueChangeDebounced({key, value});
                break;
            default: this.props.changeGiftFormKeyValue({key, value});
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
            params.shopNames = shopNames || ',';
            params.shopIDs = shopIDs || ',';
            // 定额卡工本费
            if (value == '90') {
                params.giftCost = `${Number(params.giftCost || 0)}`;
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
            }
            params.brandSelectType = (params.selectBrands || []).length ? 0 : 1;
            params.giftValue = params.giftValue || '0';
            if (params.sellerCode) {
                const [ settleId, merchantNo, settleName ] = params.sellerCode.split(':');
                params.settleId = settleId;
                params.merchantNo = merchantNo;
                params.settleName = settleName;
            }
            params.giftValue = params.giftValue || '0';
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

    render() {
        const { gift: { name: describe, value, data }, visible, type } = this.props;
        const valueLabel = value == '42' ? '积分数额' : '礼品价值';
        const formItems = {
            giftType: {
                label: '礼品类型',
                type: 'custom',
                render: () => describe,
            },
            pushMessageMpID: {
                label: '消息推送公众号',
                rules: [{ required: true, message: '请绑定消息推送微信公众号' }],
                type: 'custom',
                render: decorator => decorator({})(<PushMessageMpID/>),
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
            giftValue: {
                label: valueLabel,
                type: 'text',
                placeholder: `请输入${valueLabel}`,
                disabled: type !== 'add',
                surfix: value == '42' ? '分' : '元',
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
                    { max: 50, message: '不能超过50个字符' },
                ],
                disabled: type !== 'add',
            },
            giftCost: {
                type: 'text',
                label: '卡片工本费',
                disabled: type !== 'add',
                placeholder: '请输入卡片工本费金额',
                surfix: '元',
                rules: [
                    { pattern: /(^\+?\d{0,9}$)|(^\+?\d{0,9}\.\d{0,2}$)/, message: '请输入大于或等于0的值，整数不超过9位，小数不超过2位' },
                    {
                        validator: (rule, v, cb) => {
                            const { getFieldValue } = this.baseForm;
                            const giftValue = getFieldValue('giftValue');
                            Number(v || 0) <= Number(giftValue || 0) ? cb() : cb(rule.message);
                        },
                        message: '工本费不能高于礼品价值',
                    }, {
                        validator: (rule, v, cb) => {
                            const { getFieldValue } = this.baseForm;
                            const giftValue = getFieldValue('giftValue');
                            const price = getFieldValue('price');
                            Number(v || 0) + Number(price || 0) <= Number(giftValue || 0) ? cb() : cb(rule.message);
                        },
                        message: '礼品价值扣除工本费后的数额应大于或等于售价',
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
                disabled: type !== 'add',
                placeholder: '请输入记录实收金额金额',
                surfix: '元',
                rules: [{ required: true, message: '记录实收金额不能为空' },
                { pattern: /(^\+?\d{0,9}$)|(^\+?\d{0,9}\.\d{0,2}$)/, message: '请输入大于0的值，整数不超过9位，小数不超过2位' },
                {
                    validator: (rule, v, cb) => {
                        const { getFieldValue } = this.baseForm;
                        const giftValue = getFieldValue('giftValue');
                        Number(v || 0) <= Number(giftValue || 0) ? cb() : cb(rule.message);
                    },
                    message: '记录实收金额不能高于礼品价值',
                }, {
                    validator: (rule, v, cb) => {
                        const { getFieldValue } = this.baseForm;
                        const giftValue = getFieldValue('giftValue');
                        const giftCost = getFieldValue('giftCost');
                        Number(v || 0) + Number(giftCost || 0) <= Number(giftValue || 0) ? cb() : cb(rule.message);
                    },
                    message: '记录实收金额只能小于或等于礼品价值扣除工本费后的数额',
                }],
            },
            giftRemark: {
                label: '活动详情',
                type: 'textarea',
                placeholder: '请输入活动详情',
                rules: [
                    { required: true, message: '活动详情不能为空' },
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
                render: decorator => decorator({})(<IsSync/>),
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
            }
        };
        const formKeys = {
            '实物礼品券': [
                {
                    col:
                        { span: 24, pull: 2 },
                    keys: [
                        'giftType',
                        'giftName',
                        'selectBrands',
                        'pushMessageMpID',
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
                        'pushMessageMpID',
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
                        'pushMessageMpID',
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
                        'giftValue',
                        'giftCost',
                        'price',
                        'giftRemark',
                        'giftRule',
                        'showGiftRule',
                        'isSynch',
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
        let formData = {};
        if (type == 'edit') {
            formData = data === undefined ? {} : data;
        }
        if (data.shopNames && data.shopNames.length > 0 && data.shopNames[0].id) {
            formData.shopNames = data.shopNames.map(shop => shop.id);
        }
        return (
            <div className={styles.giftAddModal}>
                <BaseForm
                    getForm={form => this.baseForm = form}
                    getRefs={refs => this.refMap = refs}
                    formItems={formItems}
                    formData={formData}
                    formKeys={formKeys[describe]}
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
