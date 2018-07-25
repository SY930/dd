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

import { DatePicker, Radio, Form, Select, TreeSelect, Input, Icon } from 'antd';
import styles from '../ActivityPage.less';
import PriceInput from '../common/PriceInput';
import ExpandTree from '../../SpecialPromotionNEW/common/ExpandTree';
import _ from 'lodash';

const moment = require('moment');

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

import {
    saleCenterSetPromotionDetailAC,
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

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


const defaultData = {
    stageAmount: {
        value: null,
        validateStatus: 'success',
        msg: null,
    },
    giftNum: {
        value: 1,
        validateStatus: 'success',
        msg: null,
    },

    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null,
    },
    // 使用张数
    giftMaxUseNum: {
        value: 1,
        validateStatus: 'success',
        msg: null,
    },

    giftValidType: '0',

    giftEffectiveTime: {
        value: 0,
        validateStatus: 'success',
        msg: null,
    },

    giftValidDays: {
        value: 1,
        validateStatus: 'success',
        msg: null,
    },
};

class ReturnGift extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            flag: {
                0: '0',
                1: '0',
                2: '0',
            },
            giftInfo: [],
            defaultValue: null,
            data: {
                0: {
                    stageAmount: null,
                    giftNum: 0,
                    giftName: null,
                    giftItemID: null,
                    giftMaxUseNum: 0,
                    giftValidType: '0',
                    giftEffectiveTime: 0,
                    giftValidDays: 0,
                },
            },
            infos: this.props.value || [JSON.parse(JSON.stringify(defaultData))],
            maxCount: this.props.maxCount || 3,
        };

        this.renderItems = this.renderItems.bind(this);
        this.renderBlockHeader = this.renderBlockHeader.bind(this);
        this.handleStageAmountChange = this.handleStageAmountChange.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.getGiftValue = this.getGiftValue.bind(this);
        this.handleGiftChange = this.handleGiftChange.bind(this);
        this.handlegiftMaxUseNumChange = this.handlegiftMaxUseNumChange.bind(this);
        this.handleValidateTypeChange = this.handleValidateTypeChange.bind(this);
        this.renderValidOptions = this.renderValidOptions.bind(this);
        this.handleGiftValidDaysChange = this.handleGiftValidDaysChange.bind(this);
        this.handleRangePickerChange = this.handleRangePickerChange.bind(this);
        this.handleGiftEffectiveTimeChange = this.handleGiftEffectiveTimeChange.bind(this);
        this.proGiftTreeData = this.proGiftTreeData.bind(this);
    }

    componentDidMount() {
        // 第一次加载需将默认值传给父组件
        if (Object.keys(this.props.value).length > 0) {
            this.setState({
                infos: this.props.value || [JSON.parse(JSON.stringify(defaultData))],
            }, () => {
                if (this.props.value === null) {
                    this.props.onChange && this.props.onChange(this.state.infos);
                }
            });
        }


        this.props.fetchGiftListInfo({
            groupID: this.props.user.accountInfo.groupID,
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.maxCount !== nextProps.maxCount) {
            this.setState({
                infos: [JSON.parse(JSON.stringify(defaultData))],
                maxCount: nextProps.maxCount,
            });
        }

        if (nextProps.value) {
            this.setState({
                infos: nextProps.value || [JSON.parse(JSON.stringify(defaultData))],
            });
        }
        if (this.props.promotionDetailInfo.getIn(['$giftInfo', 'data']) !==  nextProps.promotionDetailInfo.getIn(['$giftInfo', 'data'])) {
            let giftInfo;
            try {
                giftInfo = nextProps.promotionDetailInfo.getIn(['$giftInfo', 'data']).toJS().filter(giftTypes => giftTypes.giftType < 90);
            } catch (err) {
                giftInfo = [];
            }
            this.setState({
                giftInfo
            });
        }
    }
    proGiftTreeData(giftTypes) {
        const _giftTypes = _.filter(giftTypes, giftItem => giftItem.giftType != 90 && giftItem.giftType != 80);
        let treeData = [];
        _giftTypes.map((gt, idx) => {
            treeData.push({
                label: (_.find(SALE_CENTER_GIFT_TYPE, { value: String(gt.giftType) }) || {}).label,
                key: gt.giftType,
                children: [],
            });
            gt.crmGifts.map((gift) => {
                treeData[idx].children.push({
                    label: gift.giftName,
                    value: `${gift.giftItemID},${gift.giftName}`,
                    key: gift.giftItemID,
                });
            });
        });
        return treeData = _.sortBy(treeData, 'key');
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
        _infos.push(JSON.parse(JSON.stringify(defaultData)));
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    render() {
        return (
            <div>
                {this.renderItems()}
            </div>
        );
    }


    renderItems() {
        const filterOffLine = this.props.filterOffLine;// 支持到店属性
        let _giftInfo = [];
        const giftInfo = this.state.giftInfo;
        if (filterOffLine) {
            giftInfo.forEach((giftTypes) => {
                if (giftTypes.giftType == '10' || giftTypes.giftType == '20' || giftTypes.giftType == '21' || giftTypes.giftType == '30') { // 只有电子代金券和菜品券,shi实物券有支持到店属性
                    _giftInfo.push({
                        giftType: giftTypes.giftType,
                        crmGifts: giftTypes.crmGifts.filter((gift) => {
                            return gift.giftType == '30' ? true : gift.isOfflineCanUsing // 为true表示支持到店
                        }),
                    })
                }
            });
        } else {
            _giftInfo = giftInfo;
        }
        const toggleFun = (index) => {
            const { disArr = [] } = this.state;
            const toggle = !disArr[index];
            disArr.map((v, i) => disArr[i] = false)
            disArr[index] = toggle;
            this.setState({ disArr })
        };
        return this.state.infos.map((info, index) => {
            return (
                <div className={styles.addGrade} key={index}>
                    <div className={styles.CategoryTop}>
                        <span className={styles.CategoryTitle}>{this.state.infos.length == 1 ? '礼品' : `礼品${index + 1}`}</span>
                        {this.renderBlockHeader(index)}
                    </div>

                    <div className={styles.CategoryBody}>
                        <FormItem
                            className={[styles.FormItemStyle, styles.FormItemStyleExplain].join(' ')}
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            validateStatus={info.stageAmount.validateStatus}
                            help={info.stageAmount.msg}
                        >
                            <PriceInput
                                addonBefore={this.state.maxCount == 1 ? '消费每满' : '消费满'}
                                value={{ number: info.stageAmount.value }}
                                onChange={val => this.handleStageAmountChange(val, index)}
                                addonAfter="元"
                                modal="float"
                            />

                        </FormItem>

                        <FormItem
                            className={[styles.FormItemStyle, styles.FormItemStyleExplain].join(' ')}
                            validateStatus={info.giftNum.validateStatus}
                            help={info.giftNum.msg}
                        >
                            <PriceInput
                                addonBefore="返券"
                                addonAfter="张"
                                modal="int"
                                value={{ number: info.giftNum.value }}
                                onChange={(val) => { this.handleCouponNumberChange(val, index); }}
                            />
                        </FormItem>

                        <FormItem
                            label="请选择礼品"
                            validateStatus={info.giftInfo.validateStatus}
                            className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            help={info.giftInfo.msg}
                        >
                            <ExpandTree
                                idx={index}
                                value={this.getGiftValue(index)}
                                data={_.sortBy((_giftInfo).filter((cat) => {
                                    return cat.giftType && cat.giftType != 90
                                }), 'giftType')}
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
                                    style={{ position: 'absolute', top: 10, left: 265 }}
                                    className="input_click"
                                    onClick={() => { toggleFun(index); }}
                                />
                            </ExpandTree>
                        </FormItem>
                        {
                            this.state.maxCount === 1 ?
                                <FormItem
                                    className={styles.FormItemStyle}
                                    labelCol={{ span: 0 }}
                                    wrapperCol={{ span: 24 }}
                                    validateStatus={info.giftMaxUseNum.validateStatus}
                                    help={info.giftMaxUseNum.msg}
                                >
                                    <PriceInput
                                        addonBefore="最多返券"
                                        addonAfter="张"
                                        modal="int"
                                        value={{ number: info.giftMaxUseNum.value }}
                                        onChange={(val) => { this.handlegiftMaxUseNumChange(val, index); }}
                                    />
                                </FormItem> : null
                        }

                        <FormItem
                            className={styles.FormItemStyle}
                        >
                            <span className={styles.formLabel}>生效方式</span>
                            <RadioGroup
                                className={styles.radioMargin}
                                value={info.giftValidType > 1 ? '0' : info.giftValidType}
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

                </div>
            );
        });
    }

    // 相对有效期 OR 固定有效期
    renderValidOptions(info, index) {
        if (info.giftValidType === '0' || info.giftValidType === '2') {
            let arr;
            if (info.giftValidType === '0') {
                arr = SALE_CENTER_GIFT_EFFICT_TIME;
            } else {
                arr = SALE_CENTER_GIFT_EFFICT_DAY
            }
            return (
                <div>
                    <FormItem
                        className={[styles.FormItemStyle].join(' ')}
                    >
                        <span className={styles.formLabel}>相对有效期:</span>
                        <RadioGroup
                            className={styles.radioMargin}
                            value={info.giftValidType}
                            onChange={e => {
                                const infos = this.state.infos;
                                if (e.target.value == 2 && infos[index].giftValidType != 2) {
                                    infos[index].giftEffectiveTime.value = '1';
                                    infos[index].giftValidType = '2';
                                } else if (e.target.value == 0 && infos[index].giftValidType != 0){
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
                            className={`${styles.noRadius} returnGiftMount1ClassJs`}
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
                    </FormItem>


                    <FormItem
                        className={[styles.FormItemStyle, styles.labeleBeforeSlect, styles.priceInputSingle].join(' ')}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                        label={'有效天数'}
                        validateStatus={info.giftValidDays.validateStatus}
                        help={info.giftValidDays.msg}
                    >
                        <PriceInput
                            addonBefore=""
                            addonAfter="天"
                            modal="int"
                            value={{ number: info.giftValidDays.value }}
                            onChange={(val) => { this.handleGiftValidDaysChange(val, index); }}
                        />
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
                label="固定有效期"
                className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                labelCol={{ span: 8 }}
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
        const _value = parseInt(val.number);
        if (_value > 0) {
            _infos[index].giftValidDays.validateStatus = 'success';
            _infos[index].giftValidDays.msg = null;
        } else {
            _infos[index].giftValidDays.validateStatus = 'error';
            _infos[index].giftValidDays.msg = '有效天数必须大于0';
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
        return [this.state.infos[index].giftInfo.giftItemID, this.state.infos[index].giftInfo.giftName].join(',');
    }

    handleGiftChange(value, index) {
        if (value) {
            const newValue = value.split(',');
            const _infos = this.state.infos;
            _infos[index].giftInfo.giftName = newValue[1];
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

    handleStageAmountChange(value, index) {
        const _infos = this.state.infos;
        _infos[index].stageAmount.value = value.number;
        const _value = parseFloat(value.number);
        if (_value > 0) {
            _infos[index].stageAmount.validateStatus = 'success';
            _infos[index].stageAmount.msg = null;
        } else {
            _infos[index].stageAmount.validateStatus = 'error';
            _infos[index].stageAmount.msg = '消费金额必须大于0';
        }
        this.setState({
            infos: _infos,
        }), () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        };
    }

    handleCouponNumberChange(value, index) {
        //
        const _infos = this.state.infos;
        _infos[index].giftNum.value = value.number;

        const _value = parseInt(value.number);
        if (_value > 0 && _value < 51) {
            _infos[index].giftNum.validateStatus = 'success';
            _infos[index].giftNum.msg = null;
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
        if (_value > 0) {
            _infos[index].giftMaxUseNum.validateStatus = 'success';
            _infos[index].giftMaxUseNum.msg = null;
        } else {
            _infos[index].giftMaxUseNum.validateStatus = 'error';
            _infos[index].giftMaxUseNum.msg = '使用数量必须大于等于1';
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    renderBlockHeader(index) {
        const _length = this.state.infos.length;
        if (this.state.maxCount == 1) {
            return null;
        }
        // 不是最后一个
        if (index === 0 && _length === 1) {
            return (<span className={styles.CategoryAdd} onClick={this.add}>添加礼品</span>);
        } else if (index < _length - 1) {
            return null;
        } else if (index == _length - 1 && _length == this.state.maxCount) {
            return (<span className={styles.CategoryAdd} onClick={() => this.remove(index)}>删除</span>)
        } else if (index == _length - 1 && _length < this.state.maxCount) {
            return (
                <span>
                    <span className={styles.CategoryAdd} onClick={() => this.remove(index)}>删除</span>
                    <span className={styles.CategoryAdd} onClick={this.add}>添加礼品</span>
                </span>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts));
        },

        fetchGiftListInfo: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ReturnGift));
