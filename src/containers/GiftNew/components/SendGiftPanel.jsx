import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Button,
    Input,
    Select,
    Radio,
    Row,
    Col,
    DatePicker,
    message as messageService,
} from 'antd';
import moment from 'moment';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {SALE_CENTER_GIFT_EFFICT_DAY, SALE_CENTER_GIFT_EFFICT_TIME} from "../../../redux/actions/saleCenterNEW/types";
import {axiosData} from "../../../helpers/util";
import SettleUnitIDSelector from "../../SpecialPromotionNEW/common/SettleUnitIDSelector";
import MsgSelector from "../../SpecialPromotionNEW/common/MsgSelector";
import {queryWechatMpInfo} from "../../../../lib/containers/GiftNew/_action";


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
const SEND_MSG = [
    {
        label:'不发送',
        value:'0'
    },{
        label:'仅发送短信',
        value:'1'
    },{
        label:'仅推送微信',
        value:'2'
    },{
        label: '同时发送短信和微信',
        value: '4',
    },{
        label:'微信推送不成功则发送短信',
        value:'3'
    }
];
const VALIDATE_TYPE = [
    { key: 0, value: '1', name: '相对有效期' },
    { key: 1, value: '2', name: '固定有效期' }
];

class SendGiftPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            smsGate: '0',           // 消息推送方式
            giftNo: 1,              // 礼品个数
            effectType: '1',        // 相对有效期
            dayOrHour: '0',         // 按天 按小时
            whenToEffect: '0',        // 何时生效
            giftValidDays: 1,        // 有效天数
            cellNo: '',             // 用户手机号
            settleUnitID: '',
            availableSmsCount: 0,
            giftValidRange: [],
            validatingStatus: null,
            message: '',
            pushMessageMpID: '',
            loading: false,
        };
        this.handleGiftNumChange = this.handleGiftNumChange.bind(this);
        this.handleEffectTypeChange = this.handleEffectTypeChange.bind(this);
        this.handleGiftValidDaysChange = this.handleGiftValidDaysChange.bind(this);
        this.handleDayOrHourChange = this.handleDayOrHourChange.bind(this);
        this.handleWhenToEffectChange = this.handleWhenToEffectChange.bind(this);
        this.handleSmsGateChange = this.handleSmsGateChange.bind(this);
        this.handleCellNoChange = this.handleCellNoChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSmgInfoChange = this.handleSmgInfoChange.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleGiftValidRangeChange = this.handleGiftValidRangeChange.bind(this);
    }

    componentDidMount() {
        this.props.queryWechatMpInfo();
    }

    handleSubmit() {
        let flag = true;
        if (this.props.form.isFieldValidating('cellNo')) {
            return messageService.warning('正在校验手机号');
        }
        this.props.form.validateFieldsAndScroll({scroll: {offsetBottom: 20}}, err => {
            if (err) flag = false;
        });
        if (!flag) {
            return;
        }
        const { settleUnitID, cellNo, availableSmsCount, smsGate } = this.state;
        const sendFlag = smsGate === '1' || smsGate === '3' || smsGate === '4';
        if (sendFlag) {
            if (!availableSmsCount) {
                flag = false;
                return messageService.warning('可用短信条数必须大于0');
            }
        }
        if (flag) {
            const params = this.mapStateToRequestParams();
            axiosData('/coupon/couponEntityService_sendCoupons.ajax', params, {}, {path: 'data'}, )
                .then(res => {
                    this.setState({
                        loading: false,
                        validatingStatus: null,
                        cellNo: ''
                    }, () => {
                        this.props.form.resetFields(['cellNo']);
                        this.props.form.setFieldsValue({cellNo: {number: ''}});
                    });
                    messageService.success(`向手机号为 ${cellNo} 的用户发券成功!`, 4);
                })
                .catch(err => {
                    this.setState({
                        loading: false,
                    })
                })
        }
    }

    mapStateToRequestParams() {
        let params = {
            giftItemID: this.props.giftItemID,
            cardID: 0,      // 这两个字段是后端让传的, 在前端无意义
            cardTypeID: 0,  // 这两个字段是后端让传的, 在前端无意义
        };
        const {
            smsGate,
            message: smsTemplate,
            settleUnitID,
            pushMessageMpID,
            cellNo: customerMobile,
            giftNo: giftNum,
            giftValidRange: [effectTime, validUntilDate],
            giftValidDays: validUntilDays,
            dayOrHour,
            effectType,
            whenToEffect: effectGiftTimeHours,
        } = this.state;
        if (effectType === '1') {// 相对有效期
            if (dayOrHour === '0') {// 按小时
                params.effectType = '1'
            } else {// 按天
                params.effectType = '3'
            }
            params.effectGiftTimeHours = effectGiftTimeHours;
        } else {
            params.effectType = '2'
            params.effectTime = effectTime.format('YYYYMMDD')
            params.validUntilDate = validUntilDate.format('YYYYMMDD')
        }
        if (smsGate == 1 || smsGate == 3 || smsGate == 4) {
            params.smsTemplate = smsTemplate;
            params.settleUnitID = settleUnitID;
        }
        if (smsGate > 1) {
            params.pushMessageMpID = pushMessageMpID;
        }
        params = {...params, validUntilDays, giftNum, customerMobile, smsGate};
        return params;
    }

    handleSmgInfoChange(val) {
        this.setState({
            settleUnitID: val.settleUnitID,
            availableSmsCount: val.smsCount,
        }, () => {
            this.props.form.setFieldsValue({ 'settleUnitID': val.settleUnitID });
        })
    }

    handleMessageChange(val) {
        let message = val || '';
        if (/(\[会员姓名])|(\[先生\/女士])|(\[卡名称])|(\[卡号后四位])/g.test(message)) {
            messageService.warning('请选择不含[会员姓名][先生/女士][卡名称][卡号后四位] 的模板');
            message = '';
        }
        this.setState({ message }, () => {
            this.props.form.setFieldsValue({ 'message': message });
        });
    }

    handleGiftNumChange(val) {
        this.setState({
            giftNo: val.number,
        })
    }

    handleGiftValidRangeChange(val) {
        this.setState({
            giftValidRange: val,
        })
    }

    handleWhenToEffectChange(val) {
        this.setState({
            whenToEffect: val,
        })
    }

    handleSmsGateChange(val) {
        this.setState({
            smsGate: val,
        })
    }

    handleGiftValidDaysChange(val) {
        this.setState({
            giftValidDays: val.number,
        })
    }

    handleEffectTypeChange(val) {
        this.setState({
            effectType: val.target.value,
        })
    }

    handleCellNoChange(val) {
        this.setState({
            cellNo: val.number,
        })
    }

    handleDayOrHourChange(event) {
        const dayOrHour = event.target.value;
        let whenToEffect = '1';
        if ( dayOrHour === '0') {
            whenToEffect = '0';
        }
        this.setState({
            dayOrHour,
            whenToEffect
        })
    }

    renderCellNo() {
        const { getFieldDecorator } = this.props.form;
        return (<FormItem
                    label="手机号"
                    className={styles.FormItemStyle}
                    style={{
                        margin: '1em 0'
                    }}
                    labelCol={{ span: 4 }}
                    hasFeedback
                    required
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('cellNo', {
                        onChange: this.handleCellNoChange,
                        rules: [
                            {
                                validator: (rule, v, cb) => {
                                    if (!v || !v.number) {
                                        return cb('手机号为必填项');
                                    }
                                    const cellNoString = String(v.number);
                                    if (cellNoString.length < 11 || cellNoString.length > 11) {
                                        cb('请输入11位手机号码')
                                    } else {
                                        axiosData('/crm/customerService_checkCustomerByMobile.ajax', {customerMobile: cellNoString}, {}, {path: 'data'})
                                            .then((res = {}) => {
                                                if (res.customerID && res.customerID != '0') {
                                                    cb()
                                                } else {
                                                    cb('没有找到对应的用户')
                                                }
                                            })
                                            .catch(e => {
                                                cb('没有找到对应的用户')
                                            })
                                    }
                                },
                            },
                        ]
                    })(<PriceInput modal="int"/>)}
                </FormItem>);
    }

    renderGift() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form
                style={{
                    marginLeft: '-6px',
                    width: '428px'
                }}
                className={styles.addGrade}
            >
                <div className={styles.CategoryBody}>
                    <FormItem
                        className={[styles.FormItemStyle, styles.FormItemHelpLabel].join(' ')}
                        labelCol={{ span: 0 }}
                        wrapperCol={{ span: 24 }}
                        required={true}
                    >
                        {getFieldDecorator('giftNo', {
                            value: { number: this.state.giftNo },
                            onChange: this.handleGiftNumChange,
                            rules: [
                                { required: true, message: '礼品个数为必填项' },
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v) {
                                            return cb();
                                        }
                                        v.number > 0 && v.number <= 50 ? cb() : cb(rule.message);
                                    },
                                    message: '礼品个数为1到50'
                                },
                            ]
                        })(<PriceInput
                            addonBefore={'礼品个数:'}
                            addonAfter="个"
                            modal="int"
                        />)}
                    </FormItem>
                    <FormItem
                        className={styles.FormItemStyle}
                    >
                        <span className={styles.formLabel}>生效方式:</span>
                        <RadioGroup
                            className={styles.radioMargin}
                            value={this.state.effectType}
                            onChange={this.handleEffectTypeChange}
                        >
                            {
                                VALIDATE_TYPE.map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.name}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    {
                        this.state.effectType === '1' && (
                            <div>
                                <FormItem
                                    className={[styles.FormItemStyle].join(' ')}
                                >
                                    <span className={styles.formLabel}>相对有效期:</span>
                                    <RadioGroup
                                        className={styles.radioMargin}
                                        value={this.state.dayOrHour}
                                        onChange={this.handleDayOrHourChange}
                                    >
                                        {
                                            [{ value: '0', label: '按小时' }, { value: '1', label: '按天' }].map((item, index) => {
                                                return <Radio value={item.value} key={index}>{item.label}</Radio>
                                            })
                                        }
                                    </RadioGroup>
                                </FormItem>
                                <FormItem
                                    label="何时生效"
                                    className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    <Select
                                        size="default"
                                        value={this.state.whenToEffect}
                                        onChange={this.handleWhenToEffectChange}
                                        getPopupContainer={(node) => node.parentNode}
                                    >
                                        {
                                            (String(this.state.dayOrHour) === '0' ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY)
                                                .map((item, index) => {
                                                    return (<Option value={item.value} key={index}>{item.label}</Option>);
                                                })
                                        }
                                    </Select>
                                </FormItem>
                                <FormItem
                                    className={[styles.FormItemStyle, styles.labeleBeforeSlect, styles.priceInputSingle].join(' ')}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                    label={'有效天数'}
                                >
                                    {getFieldDecorator('giftValidDays', {
                                        value: { number: this.state.giftValidDays },
                                        onChange: this.handleGiftValidDaysChange,
                                        rules: [
                                            { required: true, message: '有效天数为必填项' },
                                            {
                                                validator: (rule, v, cb) => {
                                                    if (!v) {
                                                        return cb();
                                                    }
                                                    v.number > 0 && v.number <= 36500 ? cb() : cb(rule.message);
                                                },
                                                message: '有效天数必须大于0, 小于等于36500'
                                            },
                                        ]
                                    })(<PriceInput
                                        addonBefore=""
                                        addonAfter="天"
                                        maxNum={10}
                                        modal="int"
                                    />)}
                                </FormItem>
                            </div>
                        )
                    }
                    {
                        this.state.effectType === '2' && (
                            <FormItem
                                label="固定有效期"
                                className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                            >{getFieldDecorator('giftValidRange', {
                                onChange: this.handleGiftValidRangeChange,
                                rules: [
                                    { required: true, message: '请输入有效时间' },
                                ]
                            })(<RangePicker format="YYYY-MM-DD" disabledDate={
                                (current) => current && current.format('YYYYMMDD') < moment().format('YYYYMMDD')
                            } />)}
                            </FormItem>
                        )
                    }
                </div>
            </Form>
        )
    }

    renderSmsGate() {
        return (
            <FormItem
                label="是否发送消息"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <Select size="default"
                        value={`${this.state.smsGate}`}
                        onChange={this.handleSmsGateChange}
                        getPopupContainer={(node) => node.parentNode}
                >
                    {SEND_MSG.map(item => (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>))}
                </Select>
            </FormItem>
        )
    }

    renderSettleUnitID() {
        const { getFieldDecorator } = this.props.form;
        return (
            <FormItem
                label="短信结算账户"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {getFieldDecorator('settleUnitID', {
                    initialValue: this.state.settleUnitID,
                    onChange: this.handleSmgInfoChange,
                    rules: [
                        { required: true, message: '短信结算账户不得为空' },
                    ]
                })(<SettleUnitIDSelector autoFetch />)}
            </FormItem>
        );
    }

    renderMsgSelector() {
        const { getFieldDecorator } = this.props.form;
        return (
            <FormItem
                label="选择短信模板"
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                {getFieldDecorator('message', {
                    initialValue: this.state.message,
                    onChange: this.handleMessageChange,
                    rules: [
                        { required: true, message: '必须选择一条短信模板' },
                    ]
                })(<MsgSelector selectedMessage={this.state.message} />)}
            </FormItem>
        );
    }
    handlePushMessageJSONChange = (val) => {
        this.setState({
            pushMessageMpID: val,
        })
    }

    render() {
        return (
            <Row>
                <Col offset={3} span={17}>
                    {this.renderCellNo()}
                </Col>
                <Col span={12} offset={6}>
                    {this.renderGift()}
                </Col>
                <Col offset={3} span={17}>
                    {this.renderSmsGate()}
                </Col>
                { this.state.smsGate > 1 && (
                    <Col offset={3} span={17}>
                        <FormItem
                            label="微信公众号"
                            required
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >{this.props.form.getFieldDecorator('pushMessageMpID', {
                            rules: [{
                                required: true,
                                message: '请选择微信推送的公众号',
                            }],
                            onChange: this.handlePushMessageJSONChange,
                        })(
                            <Select size="default"
                                    placeholder="请选择微信推送的公众号"
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    this.props.allWeChatAccountList.map((item) => {
                                        return (<Option
                                            value={JSON.stringify({mpID: item.mpID, appID: item.appID})}
                                            key={`${item.mpID}`}>{item.mpName}</Option>)
                                    })
                                }
                            </Select>
                        )}
                        </FormItem>
                    </Col>
                )}
                <Col offset={3} span={17}>
                    {(this.state.smsGate === '1' || this.state.smsGate === '3' || this.state.smsGate === '4') && (
                    <div>
                        {this.renderSettleUnitID()}
                    </div>
                )}
                </Col>
                <Col offset={3} span={17}>
                    {(this.state.smsGate === '1' || this.state.smsGate === '3' || this.state.smsGate === '4') && (
                    <div>
                        {this.renderMsgSelector()}
                    </div>
                )}
                </Col>
                <Col  offset={3} span={15} style={{
                    textAlign: 'right'
                }}>
                    <Button
                        type="primary"
                        loading={this.state.loading}
                        onClick={this.handleSubmit}
                        style={{
                            marginRight: '3px'
                        }}
                    >
                        发送
                    </Button>
                </Col>
            </Row>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        queryWechatMpInfo: (opts) => {
            dispatch(queryWechatMpInfo())
        }
    }
};

const mapStateToProps = (state) => {
    return {
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS().filter(item => String(item.mpTypeStr) === '21'),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SendGiftPanel));
