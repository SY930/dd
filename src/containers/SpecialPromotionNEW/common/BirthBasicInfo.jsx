﻿/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-02-09T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-10T14:57:36+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react'
import { Input, Form, Select, Icon, Button, Radio, DatePicker, Row, Col } from 'antd';
import { connect } from 'react-redux'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterGetExcludeCardLevelIds,
    saleCenterQueryFsmGroupSettleUnit,
    queryFsmGroupEquityAccount,
    querySMSSignitureList,
    saleCenterGetShopOfEventByDate,
    getEventExcludeCardTypes,
    saleCenterGetExcludeEventList,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import { SEND_MSG } from '../../../redux/actions/saleCenterNEW/types'
import {queryWechatMpInfo} from "../../GiftNew/_action";
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import moment from 'moment'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;

@injectIntl
class PromotionBasicInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            advanceDaysFlag: true,
            advanceDays: null,
            description: null,
            sendMsg: '1',
            name: '',
            dateRange: Array(2),
            tipDisplay: 'none',
            signID: props.specialPromotion.getIn(['$eventInfo', 'signID']) || '',
            involvementGiftAdvanceDays: 0,
        };
        this.promotionNameInputRef = null;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAdvanceDaysChange = this.handleAdvanceDaysChange.bind(this);
        this.handleSendMsgChange = this.handleSendMsgChange.bind(this);
        this.renderPromotionType = this.renderPromotionType.bind(this);
        this.renderMoreInfo = this.renderMoreInfo.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: undefined,
            next: this.handleSubmit,
            finish: undefined,
            cancel: undefined,
        });
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        this.props.queryWechatMpInfo({subGroupID: specialPromotion.subGroupID});
        let dateRange;
        let opts;
        if(specialPromotion.eventStartDate !== '20000101' && specialPromotion.eventEndDate !== '29991231' &&
        specialPromotion.eventStartDate !== '0' && specialPromotion.eventEndDate !== '0' &&
        specialPromotion.eventStartDate !== '' && specialPromotion.eventEndDate !== ''){
            dateRange = [moment(specialPromotion.eventStartDate, 'YYYYMMDD'), moment(specialPromotion.eventEndDate, 'YYYYMMDD')];

            opts = {
                groupID: this.props.user.accountInfo.groupID,
                eventWay: this.props.type,
                eventStartDate: this.state.dateRange[0] ? this.state.dateRange[0].format('YYYYMMDD') : '',
                eventEndDate: this.state.dateRange[1] ? this.state.dateRange[1].format('YYYYMMDD') : '',
                itemID: this.props.specialPromotion.getIn(['$eventInfo', 'itemID']),
            };
            this.props.getEventExcludeCardTypes(opts);
        }else{
            dateRange = Array(2)

            opts = {
                groupID: this.props.user.accountInfo.groupID,
                eventWay: this.props.type,
                itemID: this.props.specialPromotion.getIn(['$eventInfo', 'itemID']),
            };
        }
        this.setState({
            advanceDays: specialPromotion.giftAdvanceDays,
            description: specialPromotion.eventRemark,
            sendMsg: `${specialPromotion.smsGate || this.state.smsGate || '0'}`,
            name: specialPromotion.eventName,
            dateRange,
            involvementGiftAdvanceDays: specialPromotion.involvementGiftAdvanceDays || 0,
        });
        this.props.saleCenterGetExcludeCardLevelIds(opts);

        specialPromotion.settleUnitID > 0 && !(specialPromotion.accountNo > 0) ?
            this.props.saleCenterQueryFsmGroupSettleUnit({ groupID: this.props.user.accountInfo.groupID })
            :
            this.props.queryFsmGroupEquityAccount();
        this.props.querySMSSignitureList();
        // 活动名称auto focus
        try {
            this.promotionNameInputRef.focus()
        } catch (e) {
            // oops
        }
    }

    handleSubmit() {
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err1) => {
            if (this.props.type === '51') {
                if (err1) {
                    nextFlag = false;
                }
                if (this.state.advanceDays == null || this.state.advanceDays === '') {
                    nextFlag = false;
                    this.setState({ advanceDaysFlag: false });
                }

                // save state to redux

                if (nextFlag) {
                    this.props.setSpecialBasicInfo({
                        giftAdvanceDays: this.state.advanceDays,
                        eventRemark: this.state.description,
                        smsGate: this.state.sendMsg,
                        eventName: this.state.name,
                        signID: this.state.signID,
                        eventStartDate: this.state.dateRange[0] ? this.state.dateRange[0].format('YYYYMMDD') : '0',
                        eventEndDate: this.state.dateRange[1] ? this.state.dateRange[1].format('YYYYMMDD') : '0',
                        involvementGiftAdvanceDays: this.state.involvementGiftAdvanceDays,
                    })
                }
            } else {
                if (err1) {
                    nextFlag = false;
                }
                if (nextFlag) {
                    this.props.setSpecialBasicInfo({
                        eventRemark: this.state.description,
                        smsGate: this.state.sendMsg,
                        eventName: this.state.name,
                        signID: this.state.signID,
                        eventStartDate: this.state.dateRange[0] ? this.state.dateRange[0].format('YYYYMMDD') : '0',
                        eventEndDate: this.state.dateRange[1] ? this.state.dateRange[1].format('YYYYMMDD') : '0',
                    })
                }
            }
        });
        return nextFlag;
    }

    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value,
        });
    }
    handleAdvanceDaysChange(value) {
        let advanceDaysFlag = true;
        if (value.number == null || value.number === '') {
            advanceDaysFlag = false;
        }
        this.setState({
            advanceDays: value.number,
            advanceDaysFlag,
        });
    }
    handleInvolvementGiftAdvanceDaysChange = (value) => {
        this.setState({
            involvementGiftAdvanceDays: value.target.value,
        })
    }
    handleSendMsgChange(value) {
        this.setState({
            sendMsg: value,
        });
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value,
        });
    }
    handleSignIDChange = (val) => {
        this.setState({
            signID: val,
        })
    }

    renderPromotionType() {
        const categorys = this.props.saleCenter.get('characteristicCategories').toJS();
        const type = this.props.type;
        const item = categorys.find(v => v.key === type);
        const lab = type ? categorys.find((cc) => {
            return cc.key === type
        }).title : '';
        const rangeType = this.props.specialPromotion.getIn(['$eventInfo', 'cardLevelRangeType']);
        const tip = (
            <div style={{ display: this.state.tipDisplay, height: 135, width: 470 }} className={styles.tip}>
                <p>{type ?  item ? item.tip : '' : ''}</p>
                <div>
                    <div className={styles.tipBtn}>
                        <Button
                            type="ghost"
                            style={{ color: '#787878' }}
                            onClick={() => {
                                this.setState({ tipDisplay: 'none' });
                            }}
                        >{this.props.intl.formatMessage(STRING_SPE.d7h7gfdf2d00138)}
                        </Button>
                    </div>
                </div>
            </div>
        );
        return (
            <FormItem
                label={`${this.props.intl.formatMessage(STRING_SPE.d4h177f79da1218)}`}
                className={styles.FormItemStyle}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <p>{lab}</p>
                {
                    item && item.tip && (rangeType !== undefined && rangeType != '5') ?
                        <Icon
                            type="question-circle-o"
                            className={styles.question}
                            style={{ marginLeft: 6 }}
                            onMouseOver={() => {
                                this.setState({ tipDisplay: 'block' })
                            }}
                        /> : null
                }
                {tip}
            </FormItem>
        )
    }
    renderMoreInfo() {
        switch (this.props.type) {
            case '51':
                return (
                    <div>
                        <FormItem
                            label={this.props.intl.formatMessage(STRING_SPE.d16hfg98318265)}
                            className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                            required={true}
                            validateStatus={this.state.advanceDaysFlag ? 'success' : 'error'}
                            help={this.state.advanceDaysFlag ? null : `${this.props.intl.formatMessage(STRING_SPE.d4h177f79da3180)}`}
                        >

                            <PriceInput
                                addonBefore={''}
                                addonAfter={`${this.props.intl.formatMessage(STRING_SPE.d1kgda4ea3a2945)}`}
                                placeholder={`${this.props.intl.formatMessage(STRING_SPE.d4h177f79da3180)}`}
                                value={{ number: this.state.advanceDays }}
                                defaultValue={{ number: this.state.advanceDays }}
                                onChange={this.handleAdvanceDaysChange}
                                modal="int"
                            />

                        </FormItem>
                        <FormItem
                            label={`赠送天数以内生日会员（包括当天注册）是否参与`}
                            className={[styles.FormItemStyle, styles.priceInputSingle].join(' ')}
                            labelCol={{ span: 10 }}
                            wrapperCol={{ span: 14 }}
                        >
                            <RadioGroup onChange={this.handleInvolvementGiftAdvanceDaysChange} value={this.state.involvementGiftAdvanceDays}>
                                <Radio key={'1'} value={0}>不参与</Radio>
                                <Radio key={'2'} value={1}>参与</Radio>
                            </RadioGroup>
                        </FormItem>
                    </div>
                );
            default:
                return null;
        }
    }

    getDateCount = () => {
        if (undefined === this.state.dateRange[0] || undefined === this.state.dateRange[1]) {
            return 0
        }

        if (this.state.dateRange[0] === null || this.state.dateRange[1] === null) {
            return 0
        }

        return this.state.dateRange[1]
            .diff(this.state.dateRange[0], 'days') + 1;
    }

    handleDateChange = (date, dateString) => {
        const opts = {
            groupID: this.props.user.accountInfo.groupID,
            eventWay: this.props.type,
            eventStartDate: date[0] ? date[0].format('YYYYMMDD') : '',
            eventEndDate: date[1] ? date[1].format('YYYYMMDD') : '',
        };
        // 编辑时，解放自己的选项不被排除; 新建时没有id, 也不会传到后端
        opts.itemID = this.props.specialPromotion.getIn(['$eventInfo', 'itemID']);
        if (opts.eventStartDate) {
            
            this.props.saleCenterGetExcludeCardLevelIds(opts);
            this.props.getEventExcludeCardTypes(opts);
        }
        this.setState({
            dateRange: date,
            // dateString,
        })
    }

    renderPeriodSelector = () => {
        const { getFieldDecorator } = this.props.form;
        // 日期选择器
        let dateRangeProps;
        if (this.state.dateRange[0] !== undefined && this.state.dateRange[1] !== undefined &&
            this.state.dateRange[0] !== '0' && this.state.dateRange[1] !== '0'
        ) {
            dateRangeProps = {
                onChange: this.handleDateChange,
                initialValue: this.state.dateRange,
            }
        } else {
            dateRangeProps = {
                onChange: this.handleDateChange,
            }
        }

        return (
            <FormItem
                label="活动起止日期"
                className={[styles.FormItemStyle, styles.cardLevelTree].join(' ')}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 17 }}
            >
                <Row>
                    <Col span={21}>
                        {getFieldDecorator('rangePicker', {
                        rules: [{
                            required: false,
                            message: '请选择活动起止时间',
                        }],
                        ...dateRangeProps,
                    })(
                        <RangePicker
                            className={styles.ActivityDateDayleft}
                            // disabledDate={disabledDate}
                            style={{ width: '100%' }}
                            format="YYYY-MM-DD"
                            placeholder={['开始日期', '结束日期']}
                        />
                    )}
                    </Col>
                    <Col offset={1} span={2}>
                        <div className={styles.ActivityDateDay}>
                            <span>
                                {this.getDateCount()}
                            </span>
                            <span>天</span>
                        </div>
                    </Col>
                </Row>
            </FormItem>
        )
    }

    render() {
        // TODO:编码不能重复
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>

                {this.renderPromotionType()}
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.d4546grade4128)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('promotionName', {
                        rules: [
                            { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.da8of2e6el5231)}` },
                            { max: 50, message: `${this.props.intl.formatMessage(STRING_SPE.de8fcgn43i698)}` },
                        /*    {
                            whitespace: true,
                            required: true,
                            message: '汉字、字母、数字组成，不多于50个字符',
                            pattern: /^[\u4E00-\u9FA5A-Za-z0-9\.\（\）\(\)\-\-]{1,50}$/,
                        }*/
                        ],
                        initialValue: this.state.name,
                    })(
                        <Input
                            placeholder={this.props.intl.formatMessage(STRING_SPE.d7ekp859lc7222)}
                            onChange={this.handleNameChange}
                            ref={node => this.promotionNameInputRef = node}
                        />
                        )}
                </FormItem>

                {this.renderPeriodSelector()}

                {this.renderMoreInfo()}

                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.d2c89sj1s6888)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select size="default"
                            value={this.state.sendMsg}
                            onChange={this.handleSendMsgChange}
                            getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            SEND_MSG.map((item) => {
                                return (<Option value={`${item.value}`} key={`${item.value}`}>{item.label}</Option>)
                            })
                        }
                    </Select>
                </FormItem>
                {
                    (this.state.sendMsg == 1 || this.state.sendMsg == 3 || this.state.sendMsg == 4) && (
                        <FormItem
                            label={this.props.intl.formatMessage(STRING_SPE.d4546grade9251)}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 17 }}
                        >
                            <Select size="default"
                                    value={`${this.state.signID}`}
                                    onChange={this.handleSignIDChange}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                <Option value={''} key={''}>{this.props.intl.formatMessage(STRING_SPE.d2c89sj1s61092)}</Option>
                                {
                                    this.props.specialPromotion.get('SMSSignList').toJS().map((item) => {
                                        return (<Option value={`${item.signID}`} key={`${item.signID}`}>{item.signName}</Option>)
                                    })
                                }
                            </Select>
                        </FormItem>
                    )
                }
                <FormItem
                    label={this.props.intl.formatMessage(STRING_SPE.d7ekp859lc11113)}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator('description', {
                        rules: [
                            { required: true, message: `${this.props.intl.formatMessage(STRING_SPE.d7ekp859ld12164)}` },
                            { max: 1000, message: `${this.props.intl.formatMessage(STRING_SPE.d17009e3e35b1366)}` },
                        ],
                        initialValue: this.state.description,
                    })(
                        <Input type="textarea" placeholder={this.props.intl.formatMessage(STRING_SPE.d34id2b3ir14116)} onChange={this.handleDescriptionChange} />
                        )}
                </FormItem>

            </Form>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        saleCenter: state.sale_saleCenter_NEW,
        user: state.user.toJS(),
        specialPromotion: state.sale_specialPromotion_NEW,
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS().filter(item => String(item.mpTypeStr) === '21'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        saleCenterGetExcludeCardLevelIds: (opts) => {
            dispatch(saleCenterGetExcludeCardLevelIds(opts));
        },
        saleCenterQueryFsmGroupSettleUnit: (opts) => {
            dispatch(saleCenterQueryFsmGroupSettleUnit(opts));
        },
        queryWechatMpInfo: (opts) => {
            dispatch(queryWechatMpInfo(opts))
        },
        querySMSSignitureList: () => {
            dispatch(querySMSSignitureList())
        },
        queryFsmGroupEquityAccount: (opts) => {
            dispatch(queryFsmGroupEquityAccount(opts))
        },
        saleCenterGetShopOfEventByDate: (opts) => {
            return dispatch(saleCenterGetShopOfEventByDate(opts));
        },
        getEventExcludeCardTypes: (opts) => {
            dispatch(getEventExcludeCardTypes(opts))
        },
        saleCenterGetExcludeEventList: (opts) => {
            dispatch(saleCenterGetExcludeEventList(opts))
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(PromotionBasicInfo));
