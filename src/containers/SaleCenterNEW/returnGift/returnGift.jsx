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
    { key: 0, value: '0', name: '相对有效期' },
    { key: 1, value: '1', name: '固定有效期' },
];

const VALIDATE_TYPE = Object.freeze([{
    key: 0, value: '0', name: '相对有效期'
},
{ key: 1, value: '1', name: '固定有效期' }]);

const availableGiftTypes = [// 顺序matters
    '112', '10', '20', '21', '111', '110', '30', '40', '42', '80',
];

const offlineCanUseGiftTypes = [
    '30', '40', '42', '80',
];

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
        const { isMultiple } = this.props; 
        return (
            <div className={[selfStyle.listWrapper, !isMultiple ? selfStyle.isNotMultiple : ''].join(' ')}>
                {this.renderItems()}
                {
                    this.state.infos.length < 10 && (
                        <div className={selfStyle.addLink} onClick={this.add}>
                            + 添加礼品
                        </div>
                    )
                }
            </div>          
        );
    }


    renderItems() {
        const filterOffLine = this.props.filterOffLine;// 支持到店属性
        const allCrmGifts = this.props.allCrmGifts.toJS();
        const allWeChatCouponList = this.props.weChatCouponList;
        let _giftInfo = [{
            giftType: '112',
            index: 0,
            crmGifts: allWeChatCouponList
        }];
        allCrmGifts.forEach((giftTypes) => {
            if (availableGiftTypes.includes(String(giftTypes.giftType))) {
                _giftInfo.push({
                    giftType: giftTypes.giftType,
                    index: availableGiftTypes.indexOf(String(giftTypes.giftType)),
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
                        {`礼品${index + 1}`}
                    </div>
                    {
                        arr.length > 1 && (
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.remove(index)}>
                                <Icon className={selfStyle.removeButton} type="close-circle" />
                            </Popconfirm>
                        )
                    }
                    <FormItem
                        label="礼品名称"
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
                                value={(this.getGiftValue(index) || '').split(',')[1]}
                                className="input_click"
                                onClick={() => { toggleFun(index); }}
                            />
                            <Icon
                                type="down"
                                style={{ position: 'absolute', top: 10, left: 255 }}
                                className="input_click"
                                onClick={() => { toggleFun(index); }}
                            />
                        </ExpandTree>
                    </FormItem>
                    <div className={selfStyle.flexControlWrapper}>
                        <div style={{ width: '50%' }}>
                            <FormItem
                                label="礼品数量"
                                required={true}
                                validateStatus={info.giftNum.validateStatus}
                                help={info.giftNum.msg}
                                labelCol={{ span: 10 }}
                                wrapperCol={{ span: 14 }}
                            >
                                <PriceInput
                                    addonAfter="张"
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
                                            addonBefore="最多"
                                            addonAfter="张"
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
                                        message={`当前状态：${(BATCH_STATUS.find(item => item.value === `${couponEntity.couponStockStatus}`) || {label: '未知'}).label}`}
                                        description="券未激活时无法发放成功，请确认。实际返券张数以微信支付商户平台设置的用户参与次数为准"
                                        type="warning"
                                        showIcon
                                    />
                                )}
                            </div>
                        ) : (
                            <div>
                                <FormItem
                                    label="有效期限"
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
                            addonAfter="天"
                            modal="int"
                            maxNum={10}
                            value={{ number: info.giftValidDays.value }}
                            onChange={(val) => { this.handleGiftValidDaysChange(val, index); }}
                        />
                    </FormItem>
                    <FormItem
                        label="生效时间"
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
                                    [{ value: '0', label: '按小时' }, { value: '2', label: '按天' }].map((item, index) => {
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
            _infos[index].giftEffectiveTime.msg = '请输入有效时间';
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
        if (_value > 0 && _value <= 36500) {
            _infos[index].giftValidDays.validateStatus = 'success';
            _infos[index].giftValidDays.msg = null;
        } else {
            _infos[index].giftValidDays.validateStatus = 'error';
            _infos[index].giftValidDays.msg = '有效天数必须大于0, 小于等于36500';
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
            _infos[index].giftValidDays.msg = _infos[index].giftValidDays.value > 0 ? null : '请输入有效时间';
        } else {
            _infos[index].giftValidDays.validateStatus = 'success';
            _infos[index].giftValidDays.msg = null;
            _infos[index].giftEffectiveTime.validateStatus = _infos[index].giftEffectiveTime.value[1] ? 'success' : 'error';
            _infos[index].giftEffectiveTime.msg = _infos[index].giftEffectiveTime.value[1] ? null : '请输入有效时间';
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
            _infos[index].giftInfo.msg = '必须选择礼券';
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
                    _infos[index].giftNum.msg = '礼品数量不超过最多限制';
                } else {
                    const maxUseValue = _infos[index].giftMaxUseNum.value;
                    _infos[index].giftNum.validateStatus = 'success';
                    _infos[index].giftNum.msg = null;
                    _infos[index].giftMaxUseNum.validateStatus = maxUseValue > 0 && maxUseValue <= 10000 ? 'success' : 'error';
                    _infos[index].giftMaxUseNum.msg = maxUseValue > 0 && maxUseValue <= 10000 ? null : '最多返券数量必须大于等于1, 小于等于10000';
                }
            }
        } else {
            _infos[index].giftNum.validateStatus = 'error';
            _infos[index].giftNum.msg = '返券数量必须大于0, 小于等于50';
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
                _infos[index].giftMaxUseNum.msg = '最多返券数不少于礼品数量';
            } else {
                const numValue = _infos[index].giftNum.value;
                _infos[index].giftMaxUseNum.validateStatus = 'success';
                _infos[index].giftMaxUseNum.msg = null;
                _infos[index].giftNum.validateStatus = numValue > 0 && numValue < 51 ? 'success' : 'error';
                _infos[index].giftNum.msg = numValue > 0 && numValue < 51 ? null : '返券数量必须大于0, 小于等于50';
            }
        } else {
            _infos[index].giftMaxUseNum.validateStatus = 'error';
            _infos[index].giftMaxUseNum.msg = '最多返券数量必须大于等于1, 小于等于10000';
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
