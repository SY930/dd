/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-23T17:02:39+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: returnGift.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-06T23:07:35+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import { connect } from 'react-redux';

import {
    DatePicker,
    Radio,
    Form,
    Select,
    Alert,
    Input,
    Icon,
    Popconfirm,
} from 'antd';
import styles from '../ActivityPage.less';
import selfStyle from './style.less';
import PriceInput from '../common/PriceInput';
import ExpandTree from '../../SpecialPromotionNEW/common/ExpandTree';
import _ from 'lodash';
import WeChatCouponCard from "../../WeChatCouponManagement/WeChatCouponCard";
import {BATCH_STATUS} from "../../WeChatCouponManagement/WeChatCouponList";
import { DEFAULT_GIFT_ITEM } from './returnGiftDetailInfo'
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const moment = require('moment');
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;


import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
    SALE_CENTER_GIFT_EFFICT_DAY,
} from '../../../redux/actions/saleCenterNEW/types';


const type = [
    { key: 0, value: '0', name: SALE_LABEL.k6d8n2kk },
    { key: 1, value: '1', name: SALE_LABEL.k6d8n2sw },
];

const VALIDATE_TYPE = Object.freeze([{
    key: 0, value: '0', name: SALE_LABEL.k6d8n2kk
},
{ key: 1, value: '1', name: SALE_LABEL.k6d8n2sw }]);

const availableGiftTypes = [// 顺序matters
    '112', '10', '20', '21', '111', '110', '30', '40', '42', '80',
];
const noWechatGiftTypes = [// 顺序matters
    '10', '20', '21', '111', '110', '30', '40', '42', '80',
];

const offlineCanUseGiftTypes = [
    '30', '40', '42', '80',
];
@injectIntl()
class ReturnGift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            infos: this.props.value,
        };
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.getGiftValue = this.getGiftValue.bind(this);
        this.handleGiftChange = this.handleGiftChange.bind(this);
        this.handlegiftMaxUseNumChange = this.handlegiftMaxUseNumChange.bind(this);
        this.handleValidateTypeChange = this.handleValidateTypeChange.bind(this);
        this.handleGiftValidDaysChange = this.handleGiftValidDaysChange.bind(this);
        this.handleRangePickerChange = this.handleRangePickerChange.bind(this);
        this.handleGiftEffectiveTimeChange = this.handleGiftEffectiveTimeChange.bind(this);
    }

    remove(index) {
        const _infos = this.state.infos;
        _infos.splice(index, 1);
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    add() {
        const _infos = this.state.infos;
        _infos.push(JSON.parse(JSON.stringify(DEFAULT_GIFT_ITEM)));
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    render() {
        const { isMultiple, maxAddGift } = this.props;
        let maxGift = maxAddGift ? maxAddGift : 10;
        return (
            <div className={[selfStyle.listWrapper, !isMultiple ? selfStyle.isNotMultiple : ''].join(' ')}>
                {this.renderItems()}
                {
                    this.state.infos.length < maxGift && (
                        <div className={selfStyle.addLink} onClick={this.add}>
                            + {SALE_LABEL.k6d8n2c8}
                        </div>
                    )
                }
            </div>
        );
    }


    renderItems() {
        const { intl } = this.props;
        const k5f3y5ml = intl.formatMessage(SALE_STRING.k5f3y5ml);

        const k6d8n46w = intl.formatMessage(SALE_STRING.k6d8n46w);
        const k6d8n4f8 = intl.formatMessage(SALE_STRING.k6d8n4f8);


        const filterOffLine = this.props.filterOffLine;// 支持到店属性
        const allCrmGifts = this.props.allCrmGifts.toJS();
        const allWeChatCouponList = this.props.weChatCouponList;
        let _giftInfo = [];
        if(!this.props.ifExcludeWechat) {
            _giftInfo = [{
                giftType: '112',
                index: 0,
                crmGifts: allWeChatCouponList
            }];
        }
        const resultGiftTypes = this.props.ifExcludeWechat ? noWechatGiftTypes : availableGiftTypes
        allCrmGifts.forEach((giftTypes) => {
            if (resultGiftTypes.includes(String(giftTypes.giftType))) {
                _giftInfo.push({
                    giftType: giftTypes.giftType,
                    index: resultGiftTypes.indexOf(String(giftTypes.giftType)),
                    crmGifts: giftTypes.crmGifts,
                })
            }
        });
        _giftInfo.sort((a, b) => a.index - b.index)
        const toggleFun = (index) => {
            const { disArr = [] } = this.state;
            const toggle = !disArr[index];
            disArr.map((v, i) => disArr[i] = false)
            disArr[index] = toggle;
            this.setState({ disArr })
        };
        return this.state.infos.map((info, index, arr) => {
            // 微信支付代金券实体
            let couponEntity;
            if (info.giftInfo.giftType == '112') {
                couponEntity = this.props.weChatCouponList.find(item => item.itemID == info.giftInfo.giftItemID)
            }
            return (
                <div className={selfStyle.giftWrapper}>
                    <div className={selfStyle.giftNoLabel}>
                    {SALE_LABEL.k6d8n318}{`${index + 1}`}
                    </div>
                    {
                        arr.length > 1 && (
                            <Popconfirm title={SALE_LABEL.k5dnw1q3} onConfirm={() => this.remove(index)}>
                                <Icon className={selfStyle.removeButton} type="close-circle" />
                            </Popconfirm>
                        )
                    }
                    <FormItem
                        label={SALE_LABEL.k6d8n39k}
                        required={true}
                        validateStatus={info.giftInfo.validateStatus}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                        help={info.giftInfo.msg}
                    >
                        <ExpandTree
                            idx={index}
                            value={this.getGiftValue(index)}
                            data={_giftInfo}
                            onChange={(value) => {
                                this.handleGiftChange(value, index);
                            }}
                            onClick={(value) => {
                                const { disArr = [] } = this.state;
                                disArr[index] = false;
                                this.setState({ disArr })
                            }}
                            disArr={this.state.disArr || []}
                        >
                            <Input
                                placeholder=""
                                value={(this.getGiftValue(index) || '').split(',')[1]}
                                className="input_click"
                                onClick={() => { toggleFun(index); }}
                            />
                            <Icon
                                type="down"
                                style={{ fontSize: 10, position: 'absolute', top: 10, left: 272 }}
                                className="input_click"
                                onClick={() => { toggleFun(index); }}
                            />
                        </ExpandTree>
                    </FormItem>
                    <div className={selfStyle.flexControlWrapper}>
                        <div style={{ width: '50%' }}>
                            <FormItem
                                label={SALE_LABEL.k6d8n3hw}
                                required={true}
                                validateStatus={info.giftNum.validateStatus}
                                help={info.giftNum.msg}
                                labelCol={{ span: 10 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <PriceInput
                                    addonAfter={k5f3y5ml}
                                    modal="int"
                                    value={{ number: info.giftNum.value }}
                                    onChange={(val) => { this.handleCouponNumberChange(val, index); }}
                                />
                            </FormItem>
                        </div>
                        <div style={{ width: '47%' }}>
                            {
                                this.props.isMultiple ?
                                    <FormItem
                                        labelCol={{ span: 0 }}
                                        wrapperCol={{ span: 22 }}
                                        validateStatus={info.giftMaxUseNum.validateStatus}
                                        help={info.giftMaxUseNum.msg}
                                    >
                                        <PriceInput
                                            addonBefore={SALE_LABEL.k6d8n3q8}
                                            addonAfter={k5f3y5ml}
                                            modal="int"
                                            maxNum={6}
                                            value={{ number: info.giftMaxUseNum.value }}
                                            onChange={(val) => { this.handlegiftMaxUseNumChange(val, index); }}
                                        />
                                    </FormItem> : null
                            }
                        </div>
                    </div>
                    {
                        info.giftInfo.giftType == '112' ? (
                            <div>
                                { !!couponEntity && (
                                    <div style={{ paddingLeft: 82, margin: '12px 0'}}>
                                        <WeChatCouponCard entity={couponEntity}  />
                                    </div>
                                )}
                                { !!couponEntity && (
                                    <Alert
                                        message={`${k6d8n46w}：${(BATCH_STATUS.find(item => item.value === `${couponEntity.couponStockStatus}`) || {label: k6d8n4f8 }).label}`}
                                        description={SALE_LABEL.k6d8n4nk}
                                        type="warning"
                                        showIcon
                                    />
                                )}
                            </div>
                        ) : (
                            <div>
                                <FormItem
                                    label={SALE_LABEL.k6d8n3yk}
                                    labelCol={{ span: 5 }}
                                    wrapperCol={{ span: 18 }}
                                >

                                    <RadioGroup
                                        value={info.giftValidType > 1 ? '0' : `${info.giftValidType}`}
                                        onChange={val => this.handleValidateTypeChange(val, index)}
                                    >
                                        {
                                            VALIDATE_TYPE.map((item, index) => {
                                                return <Radio value={item.value} key={index}>{item.name}</Radio>
                                            })
                                        }
                                    </RadioGroup>
                                </FormItem>
                                {this.renderValidOptions(info, index)}
                            </div>
                        )
                    }
                </div>
            );
        });
    }

    // 相对有效期 OR 固定有效期
    renderValidOptions(info, index) {
        if (info.giftValidType == '0' || info.giftValidType == '2') {
            let arr;
            if (info.giftValidType == '0') {
                arr = SALE_CENTER_GIFT_EFFICT_TIME;
            } else {
                arr = SALE_CENTER_GIFT_EFFICT_DAY
            }
            return (
                <div>
                    <FormItem
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                        label={' '}
                        required={true}
                        validateStatus={info.giftValidDays.validateStatus}
                        help={info.giftValidDays.msg}
                    >
                        <PriceInput
                            addonBefore=""
                            addonAfter={SALE_LABEL.k5nh237x}
                            modal="int"
                            maxNum={5}
                            value={{ number: info.giftValidDays.value }}
                            onChange={(val) => { this.handleGiftValidDaysChange(val, index); }}
                        />
                    </FormItem>
                    <FormItem
                        label={SALE_LABEL.k6d8n4vw}
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                    >
                        <div className={selfStyle.flexControlWrapper}>
                            <Select
                                style={{ width: 84 }}
                                getPopupContainer={(node) => node.parentNode}
                                value={`${info.giftValidType}`}
                                onChange={v => {
                                    const infos = this.state.infos;
                                    if (v == 2 && infos[index].giftValidType != 2) {
                                        infos[index].giftEffectiveTime.value = '1';
                                        infos[index].giftValidType = '2';
                                    } else if (v == 0 && infos[index].giftValidType != 0){
                                        infos[index].giftEffectiveTime.value = '0';
                                        infos[index].giftValidType = '0';
                                    }
                                    this.setState({
                                        infos,
                                    }, () => {
                                        this.props.onChange && this.props.onChange(this.state.infos);
                                    })
                                }}
                            >
                                {
                                    [{ value: '0', label: SALE_LABEL.k6d9lj73 }, { value: '2', label: SALE_LABEL.k6d9ljff }].map((item, index) => {
                                        return <Option value={item.value} key={index}>{item.label}</Option>
                                    })
                                }
                            </Select>
                            <Select
                                style={{ width: 177 }}
                                size="default"
                                getPopupContainer={(node) => node.parentNode}
                                value={
                                    typeof this.state.infos[index].giftEffectiveTime.value === 'object' ?
                                        '0' :
                                        `${this.state.infos[index].giftEffectiveTime.value}`
                                }
                                onChange={(val) => { this.handleGiftEffectiveTimeChange(val, index) }}
                            >
                                { arr.map((item, index) => (<Option value={item.value} key={index}>{item.label}</Option>)) }
                            </Select>
                        </div>
                    </FormItem>
                </div>
            );
        }
        const pickerProps = {
            // showTime: true,
            format: 'YYYY-MM-DD',
            onChange: (date, dateString) => {
                this.handleRangePickerChange(date, dateString, index);
            },
        };
        if (typeof info.giftEffectiveTime.value === 'object') {
            pickerProps.value = info.giftEffectiveTime.value;
        }
        return (
            <FormItem
                label=" "
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16 }}
                required={true}
                validateStatus={info.giftEffectiveTime.validateStatus}
                help={info.giftEffectiveTime.msg}
            >
                <RangePicker {...pickerProps} disabledDate={
                    (current) => current && current.format('YYYYMMDD') < moment().format('YYYYMMDD')
                } />
            </FormItem>
        );
    }

    // 固定有效时间改变
    handleRangePickerChange(date, dateString, index) {
        const _infos = this.state.infos;
        _infos[index].giftEffectiveTime.value = date;

        if (date === null || date === undefined || (date instanceof Array && date.length === 0)) {
            _infos[index].giftEffectiveTime.validateStatus = 'error';
            _infos[index].giftEffectiveTime.msg = SALE_LABEL.k6d9ljnr;
        } else {
            _infos[index].giftEffectiveTime.validateStatus = 'success';
            _infos[index].giftEffectiveTime.msg = null;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }
    // 有效天数
    handleGiftValidDaysChange(val, index) {
        const _infos = this.state.infos;
        _infos[index].giftValidDays.value = val.number;
        const _value = val.number || 0;
        if (_value > 0) {
            _infos[index].giftValidDays.validateStatus = 'success';
            _infos[index].giftValidDays.msg = null;
        } else {
            _infos[index].giftValidDays.validateStatus = 'error';
            _infos[index].giftValidDays.msg = SALE_LABEL.k6d9ljw3;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }
    // 相对有效时间改变
    handleGiftEffectiveTimeChange(val, index) {
        const _infos = this.state.infos;
        _infos[index].giftEffectiveTime.value = val;
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }
    // 类型改变
    handleValidateTypeChange(e, index) {
        const _infos = this.state.infos;
        _infos[index].giftValidType = e.target.value;
        if (e.target.value == '0') {
            _infos[index].giftEffectiveTime.validateStatus = 'success';
            _infos[index].giftEffectiveTime.value = '0';
            _infos[index].giftEffectiveTime.msg = null;
            _infos[index].giftValidDays.validateStatus = _infos[index].giftValidDays.value > 0 ? 'success' : 'error';
            _infos[index].giftValidDays.msg = _infos[index].giftValidDays.value > 0 ? null : SALE_LABEL.k6d9ljnr;
        } else {
            _infos[index].giftValidDays.validateStatus = 'success';
            _infos[index].giftValidDays.msg = null;
            _infos[index].giftEffectiveTime.validateStatus = _infos[index].giftEffectiveTime.value[1] ? 'success' : 'error';
            _infos[index].giftEffectiveTime.msg = _infos[index].giftEffectiveTime.value[1] ? null : SALE_LABEL.k6d9ljnr;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    getGiftValue(index) {
        if (this.state.infos[index].giftInfo.giftItemID === null ||
            this.state.infos[index].giftInfo.giftName === null) {
            return null;
        }
        return [
            this.state.infos[index].giftInfo.giftItemID,
            this.state.infos[index].giftInfo.giftName,
            this.state.infos[index].giftInfo.giftType,
            this.state.infos[index].giftInfo.giftValue,
        ].join(',');
    }

    handleGiftChange(value, index) {
        if (value) {
            const newValue = value.split(',');
            const _infos = this.state.infos;
            _infos[index].giftInfo.giftName = newValue[1];
            _infos[index].giftInfo.giftType = newValue[2];
            _infos[index].giftInfo.giftValue = newValue[3];
            _infos[index].giftInfo.giftItemID = newValue[0];
            _infos[index].giftInfo.validateStatus = 'success';
            _infos[index].giftInfo.msg = null;
            this.setState({
                infos: _infos,
            }, () => {
                this.props.onChange && this.props.onChange(this.state.infos);
            });
        } else {
            const _infos = this.state.infos;
            _infos[index].giftInfo.giftName = null;
            _infos[index].giftInfo.giftValue = null;
            _infos[index].giftInfo.giftType = null;
            _infos[index].giftInfo.giftItemID = null;
            _infos[index].giftInfo.validateStatus = 'error';
            _infos[index].giftInfo.msg = SALE_LABEL.k67g8lvn;
            this.setState({
                infos: _infos,
            }, () => {
                this.props.onChange && this.props.onChange(this.state.infos);
            });
        }
    }

    handleCouponNumberChange(value, index) {
        const _infos = this.state.infos;
        _infos[index].giftNum.value = value.number;
        const { isMultiple } = this.props;
        const _value = parseInt(value.number);
        if (_value > 0 && _value < 51) {
            _infos[index].giftNum.validateStatus = 'success';
            _infos[index].giftNum.msg = null;
            if (isMultiple) {
                if (_infos[index].giftMaxUseNum.value < +_value) {
                    _infos[index].giftNum.validateStatus = 'error';
                    _infos[index].giftNum.msg = SALE_LABEL.k6d9lk4f;
                } else {
                    const maxUseValue = _infos[index].giftMaxUseNum.value;
                    _infos[index].giftNum.validateStatus = 'success';
                    _infos[index].giftNum.msg = null;
                    _infos[index].giftMaxUseNum.validateStatus = maxUseValue > 0 && maxUseValue <= 10000 ? 'success' : 'error';
                    _infos[index].giftMaxUseNum.msg = maxUseValue > 0 && maxUseValue <= 10000 ? null : SALE_LABEL.k6d9lkcr;
                }
            }
        } else {
            _infos[index].giftNum.validateStatus = 'error';
            _infos[index].giftNum.msg = SALE_LABEL.k6d9lkl3;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    handlegiftMaxUseNumChange(value, index) {
        const _infos = this.state.infos;
        _infos[index].giftMaxUseNum.value = value.number;

        const _value = parseInt(value.number);
        if (_value > 0 && _value <= 10000) {
            if (_infos[index].giftNum.value > +_value) {
                _infos[index].giftMaxUseNum.validateStatus = 'error';
                _infos[index].giftMaxUseNum.msg = SALE_LABEL.k6d9lktf;
            } else {
                const numValue = _infos[index].giftNum.value;
                _infos[index].giftMaxUseNum.validateStatus = 'success';
                _infos[index].giftMaxUseNum.msg = null;
                _infos[index].giftNum.validateStatus = numValue > 0 && numValue < 51 ? 'success' : 'error';
                _infos[index].giftNum.msg = numValue > 0 && numValue < 51 ? null : SALE_LABEL.k6d9lkl3;
            }
        } else {
            _infos[index].giftMaxUseNum.validateStatus = 'error';
            _infos[index].giftMaxUseNum.msg = SALE_LABEL.k6d9lkcr;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

}

const mapStateToProps = (state) => {
    return {
        allCrmGifts: state.sale_promotionDetailInfo_NEW.getIn(['$giftInfo', 'data']),
    };
};

export default connect(mapStateToProps)(Form.create()(ReturnGift));
