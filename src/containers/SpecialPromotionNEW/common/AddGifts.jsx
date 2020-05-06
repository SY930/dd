import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { DatePicker, Radio, Form, Select, Input, Icon, Popconfirm } from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import selfStyle from './addGifts.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import ExpandTree from './ExpandTree';
import _ from 'lodash';
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
    SALE_CENTER_GIFT_EFFICT_DAY,
} from '../../../redux/actions/saleCenterNEW/types';
import { injectIntl } from 'i18n/common/injectDecorator';
import { STRING_GIFT } from 'i18n/common/gift';
import { STRING_SPE, COMMON_SPE } from 'i18n/common/special';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
// const TreeNode = Tree.TreeNode;
// const Search = Input.Search;
const defaultData = {
    // 膨胀所需人数
    needCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftTotalCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品ID和name
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null,
    },
    effectType: '1',
    // 礼品生效时间
    giftEffectiveTime: {
        value: '0',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品有效期
    giftValidDays: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },

    giftOdds: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
};

@injectIntl
class AddGifts extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            ...this.initGiftInfo(),
            infos: this.props.value || [JSON.parse(JSON.stringify(defaultData))],
            maxCount: this.props.maxCount || 3,
        };

        this.handlegiftTotalCountChange = this.handlegiftTotalCountChange.bind(this);
        this.handlegiftCountChange = this.handlegiftCountChange.bind(this);
        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
        this.getGiftValue = this.getGiftValue.bind(this);
        this.handleGiftChange = this.handleGiftChange.bind(this);
        this.handleGiftValidDaysChange = this.handleGiftValidDaysChange.bind(this);
        this.handleGiftEffectiveTimeChange = this.handleGiftEffectiveTimeChange.bind(this);
        this.handleValidateTypeChange = this.handleValidateTypeChange.bind(this);
        this.renderValidOptions = this.renderValidOptions.bind(this);
        this.handleRangePickerChange = this.handleRangePickerChange.bind(this);
        this.proGiftTreeData = this.proGiftTreeData.bind(this);
        this.VALIDATE_TYPE = Object.freeze([{
            key: 0, value: '1', name: `${this.props.intl.formatMessage(STRING_SPE.d142vrmqvc0114)}`,
        },
        { key: 1, value: '2', name: `${this.props.intl.formatMessage(STRING_SPE.d7h7ge7d1001237)}` }])
    }

    initGiftInfo = (props = this.props) => {
        let giftInfo;
        try {
            if(props.zhifubaoCoupons){
                giftInfo = props.promotionDetailInfo.getIn(['$giftInfo', 'data']).toJS()
                .filter(giftTypes => giftTypes.giftType < 90 || (giftTypes.giftType == '110') || (giftTypes.giftType == '111')|| (giftTypes.giftType == '114'));
            }else{
                giftInfo = props.promotionDetailInfo.getIn(['$giftInfo', 'data']).toJS()
                .filter(giftTypes => giftTypes.giftType < 90 || (giftTypes.giftType == '110') || (giftTypes.giftType == '111'));
            }
        } catch (err) {
            giftInfo = [];
        }
        return {
            giftTreeData: this.proGiftTreeData(giftInfo),
            giftInfo,
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.getIn(['$giftInfo', 'data']) !== this.props.promotionDetailInfo.getIn(['$giftInfo', 'data'])) {
            this.setState({
                ...this.initGiftInfo(nextProps)
            });
        }
    }

    proGiftTreeData(giftTypes) {
        const _giftTypes = _.filter(giftTypes, giftItem => giftItem.giftType != 90);
        let treeData = [];
        _giftTypes.map((gt, idx) => {
            treeData.push({
                label: _.find(SALE_CENTER_GIFT_TYPE, { value: String(gt.giftType) }) ? _.find(SALE_CENTER_GIFT_TYPE, { value: String(gt.giftType) }).label : '',
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
        const {
            typePropertyName,
            typeValue,
        } = this.props;
        _infos.push({...JSON.parse(JSON.stringify(defaultData)), [typePropertyName]: typeValue});
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    render() {
        const { type, isAttached } = this.props;
        // 当有人领取礼物后，礼物不可编辑，加蒙层
        const userCount = this.props.specialPromotion.getIn(['$eventInfo', 'userCount']);// 当有人领取礼物后，礼物不可编辑，加蒙层
        // 桌边砍, 集点卡编辑时可以主动加蒙层
        const disabledGifts = this.props.disabledGifts;
        return (
            <div className={[selfStyle.listWrapper, isAttached ? selfStyle.isAttached : ''].join(' ')}>
                {this.renderItems()}
                { // 膨胀大礼包固定3档礼品，不可添加, 免费领取固定1个礼品，不可添加
                    (this.state.infos.length < 10 && type != '66' && type != '21' && type != '30') && (
                        <div className={selfStyle.addLink} onClick={this.add}>
                            + {this.props.intl.formatMessage(STRING_SPE.d1qe2ar9n936298)}
                        </div>
                    )
                }
                <div className={userCount > 0 || disabledGifts ? styles.opacitySet : null}></div>
            </div>
        );
    }


    renderItems() {
        let filteredGiftInfo = this.state.giftInfo.filter(cat => cat.giftType && cat.giftType != 90)
            .map(cat => ({...cat, index: SALE_CENTER_GIFT_TYPE.findIndex(type => String(type.value) === String(cat.giftType))}));
        const arr = [`${this.props.intl.formatMessage(STRING_SPE.da8oel25o02265)}`,
            `${this.props.intl.formatMessage(STRING_SPE.d1kgda4ea393183)}`,
            `${this.props.intl.formatMessage(STRING_SPE.db60a2a3891c4274)}`,
            `${this.props.intl.formatMessage(STRING_SPE.dojv8nhwu5170)}`,
            `${this.props.intl.formatMessage(STRING_SPE.d31eic607f0657)}`,
            `${this.props.intl.formatMessage(STRING_SPE.d2c89pf9007224)}`,
            `${this.props.intl.formatMessage(STRING_SPE.dojv8nhwu842)}`,
            `${this.props.intl.formatMessage(STRING_SPE.de8fc980mc940)}`,
            `${this.props.intl.formatMessage(STRING_SPE.dk45kc7bd8107)}`,
            `${this.props.intl.formatMessage(STRING_SPE.du389nqve112)}`];
        const toggleFun = (index) => {
            const { disArr = [] } = this.state;
            const toggle = !disArr[index];
            disArr.map((v, i) => disArr[i] = false)
            disArr[index] = toggle;
            this.setState({ disArr })
        }
        const { intl } = this.props;
        return this.state.infos.map((info, index, arr) => {
            let validateStatus,
                addonBefore,
                help,
                valueNuber,
                onChangeFunc;
            if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                validateStatus = info.giftCount.validateStatus;
                addonBefore = `${this.props.intl.formatMessage(STRING_SPE.dojv8nhwu12190)}`;
                help = info.giftCount.msg;
                valueNuber = info.giftCount.value;
                onChangeFunc = this.handlegiftCountChange;
            } else {
                validateStatus = info.giftTotalCount.validateStatus;
                addonBefore = `${this.props.intl.formatMessage(STRING_SPE.d7ekp2h8kc13243)}`;
                help = info.giftTotalCount.msg;
                valueNuber = info.giftTotalCount.value;
                onChangeFunc = this.handlegiftTotalCountChange;
            }
            return (
                <div key={`${index}`} className={selfStyle.giftWrapper}>
                    <div className={selfStyle.giftNoLabel}>
            {COMMON_SPE.du389nqve1491}{`${index + 1}`}
                    </div>
                    {
                        (arr.length > 1 && this.props.type != '66') && (
                            <Popconfirm title={this.props.intl.formatMessage(STRING_SPE.dd5a6d317718137)} onConfirm={() => this.remove(index)}>
                                <Icon className={selfStyle.removeButton} type="close-circle" />
                            </Popconfirm>
                        )
                    }
                        {/* 膨胀需要人数, 只有膨胀大礼包的2 3 档需要 */}
                        {
                            (this.props.type == '66' && index > 0)  && (
                                <FormItem
                                    className={[styles.FormItemStyle, styles.FormItemHelpLabel].join(' ')}
                                    labelCol={{ span: 0 }}
                                    wrapperCol={{ span: 24 }}
                                    validateStatus={info.needCount.validateStatus}
                                    help={info.needCount.msg}
                                >
                                    <PriceInput
                                        addonBefore={this.props.intl.formatMessage(STRING_SPE.dk45kc7bd81539)}
                                        maxNum={5}
                                        value={{ number: info.needCount.value }}
                                        onChange={val => this.handleGiftNeedCountChange(val, index)}
                                        addonAfter={this.props.intl.formatMessage(STRING_SPE.d170093144c13204)}
                                        modal="int"
                                    />
                                </FormItem>
                            )
                        }
                        {/* 礼品名称 */}
                        <FormItem
                            label={intl.formatMessage(STRING_GIFT.giftName)}
                            className={[styles.FormItemStyle, styles.labeleBeforeSlect, styles.labeleBeforeSlectMargin].join(' ')}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            validateStatus={info.giftInfo.validateStatus}
                            help={info.giftInfo.msg}
                        >
                            <ExpandTree
                                idx={index}
                                value={this.getGiftValue(index)}
                                data={_.sortBy(filteredGiftInfo, 'index')}
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
                                    style={{ position: 'absolute', top: 10, left: 250 }}
                                    className="input_click"
                                    onClick={() => { toggleFun(index); }}
                                />
                            </ExpandTree>
                        </FormItem>
                        {/* 礼品个数 */}
                        <FormItem
                            className={[styles.FormItemStyle, styles.FormItemHelpLabel].join(' ')}
                            labelCol={{ span: 0 }}
                            wrapperCol={{ span: 24 }}
                            validateStatus={validateStatus}
                            help={help}
                        >
                            <PriceInput
                                addonBefore={addonBefore}
                                maxNum={9}
                                value={{ number: valueNuber }}
                                onChange={val => onChangeFunc(val, index)}
                                addonAfter={this.props.intl.formatMessage(STRING_SPE.d142vrmqvc1730)}
                                modal="int"
                                disabled={info.giftCount.disabled}
                            />

                        </FormItem>
                        {/* ....... */}
                        <FormItem
                            className={styles.FormItemStyle}
                        >
                            <span className={styles.formLabel}>{this.props.intl.formatMessage(STRING_SPE.du389nqve18246)}:</span>
                            <RadioGroup
                                className={styles.radioMargin}
                                value={info.effectType == '2' ? '2' : '1'}
                                onChange={val => this.handleValidateTypeChange(val, index)}
                                disabled={info.effectTypeIsDisabled}
                            >
                                {
                                    this.VALIDATE_TYPE.map((item, index) => {
                                        return <Radio value={item.value} key={index}>{item.name}</Radio>
                                    })
                                }
                            </RadioGroup>
                        </FormItem>

                        {this.renderValidOptions(info, index)}
                        {/* ....... */}
                        {/* 中奖比率 */}
                        {
                            this.props.type == '20' ?
                                (
                                    <FormItem
                                        className={[styles.FormItemStyle, styles.FormItemHelpLabel].join(' ')}
                                        validateStatus={info.giftOdds.validateStatus}
                                        help={info.giftOdds.msg}
                                    >
                                        <PriceInput
                                            addonBefore={this.props.intl.formatMessage(STRING_SPE.d2b1b80326011987)}
                                            addonAfter="%"
                                            modal="float"
                                            value={{ number: info.giftOdds.value }}
                                            onChange={(val) => { this.handleGiftOddsChange(val, index); }}
                                        />
                                    </FormItem>
                                ) : null
                        }

                    </div>
            );
        });
    }

    handleGiftOddsChange(val, index) {
        const _infos = this.state.infos;
        _infos[index].giftOdds.value = val.number;
        const _value = parseFloat(val.number);
        if (_value >= 0 && _value <= 100) {
            _infos[index].giftOdds.validateStatus = 'success';
            _infos[index].giftOdds.msg = null;
        } else {
            _infos[index].giftOdds.validateStatus = 'error';
            _infos[index].giftOdds.msg = `${this.props.intl.formatMessage(STRING_SPE.d4h176ei7g120154)}`;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    handleGiftValidDaysChange(val, index) {
        const _infos = this.state.infos;
        _infos[index].giftValidDays.value = val.number;
        const _value = val.number || 0;
        if (_value > 0) {
            _infos[index].giftValidDays.validateStatus = 'success';
            _infos[index].giftValidDays.msg = null;
        } else {
            _infos[index].giftValidDays.validateStatus = 'error';
            _infos[index].giftValidDays.msg = `${this.props.intl.formatMessage(STRING_SPE.d142vrmqvd21186)}`;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    handleGiftNeedCountChange = (val, index) => {
        const _infos = this.state.infos.slice();
        _infos[index].needCount.value = val.number;
        const _value = val.number || 0;
        if (_value > 0 && _value <= 1000) {
            if (index === 1) {
                const higherLevelValue =  _infos[2].needCount.value;
                if (higherLevelValue > 0 && higherLevelValue <= 1000) {
                    if (_value >= +higherLevelValue) {
                        _infos[index].needCount.validateStatus = 'error';
                        _infos[index].needCount.msg = `${this.props.intl.formatMessage(STRING_SPE.d16hffkc88d2261)}`;
                    } else {
                        _infos[index].needCount.validateStatus = 'success';
                        _infos[index].needCount.msg = null;
                        _infos[2].needCount.validateStatus = 'success';
                        _infos[2].needCount.msg = null;
                    }
                } else {
                    _infos[index].needCount.validateStatus = 'success';
                    _infos[index].needCount.msg = null;
                }
            }
            if (index === 2) {
                const lowerLevelValue =  _infos[1].needCount.value;
                if (lowerLevelValue > 0 && lowerLevelValue <= 1000) {
                    if (_value <= +lowerLevelValue) {
                        _infos[index].needCount.validateStatus = 'error';
                        _infos[index].needCount.msg = `${this.props.intl.formatMessage(STRING_SPE.dk45kc7bd923240)}`;
                    } else {
                        _infos[index].needCount.validateStatus = 'success';
                        _infos[index].needCount.msg = null;
                        _infos[1].needCount.validateStatus = 'success';
                        _infos[1].needCount.msg = null;
                    }
                } else {
                    _infos[index].needCount.validateStatus = 'success';
                    _infos[index].needCount.msg = null;
                }
            }
        } else {
            _infos[index].needCount.validateStatus = 'error';
            _infos[index].needCount.msg =  `${this.props.intl.formatMessage(STRING_SPE.dojv8nhwv2416)}`;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    handleGiftEffectiveTimeChange(val, index) {
        const _infos = this.state.infos;
        _infos[index].giftEffectiveTime.value = val;
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    // 相对有效期 OR 固定有效期
    renderValidOptions(info, index) {
        if (info.effectType != '2') {
            return (
                <div>
                    <FormItem
                        className={[styles.FormItemStyle].join(' ')}
                    >
                        <span className={styles.formLabel}>{this.props.intl.formatMessage(STRING_SPE.d142vrmqvc0114)}:</span>
                        <RadioGroup
                            className={styles.radioMargin}
                            value={info.effectType == '3' ? '1' : '0'}
                            onChange={e => {
                                const infos = this.state.infos;
                                infos[index].effectType = e.target.value == '1' ? '3' : '1';
                                infos[index].giftEffectiveTime.value = e.target.value;
                                this.setState({
                                    infos,
                                }, () => {
                                    this.props.onChange && this.props.onChange(this.state.infos);
                                })
                            }}
                        >
                            {
                                [{ value: '0', label: `${this.props.intl.formatMessage(STRING_SPE.d1qe2ar9n925113)}` }, { value: '1', label: `${this.props.intl.formatMessage(STRING_SPE.d1e04rqggt261)}` }].map((item, index) => {
                                    return <Radio value={item.value} key={index}>{item.label}</Radio>
                                })
                            }
                        </RadioGroup>
                    </FormItem>
                    <FormItem
                        label={this.props.intl.formatMessage(STRING_SPE.d7ekp2h8kd27139)}
                        className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Select
                            size="default"
                            value={
                                typeof this.state.infos[index].giftEffectiveTime.value === 'object' ?
                                    '0' :
                                    `${this.state.infos[index].giftEffectiveTime.value}`
                            }
                            onChange={(val) => { this.handleGiftEffectiveTimeChange(val, index) }}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {
                                (info.effectType == '1' ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY)
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
                        label={`${this.props.intl.formatMessage(STRING_SPE.d17009bd421d28267)}`}
                        required={true}
                        validateStatus={info.giftValidDays.validateStatus}
                        help={info.giftValidDays.msg}
                    >


                        <PriceInput
                            addonBefore=""
                            addonAfter={this.props.intl.formatMessage(STRING_SPE.d1kgda4ea3a2945)}
                            maxNum={5}
                            modal="int"
                            value={{ number: info.giftValidDays.value }}
                            onChange={(val) => { this.handleGiftValidDaysChange(val, index); }}
                        />
                    </FormItem>
                </div>
            );
        }
        const pickerProps = {
            showTime: false,
            format: 'YYYY-MM-DD',
            onChange: (date, dateString) => {
                this.handleRangePickerChange(date, dateString, index);
            },
            disabled: info.giftEffectiveTime.disabled
        };
        if (typeof info.giftEffectiveTime.value === 'object') {
            pickerProps.value = info.giftEffectiveTime.value;
        }
        const disabledDate = (current) => {
            // Can not select days before today
            return current && current.format('YYYYMMDD') < this.props.specialPromotion.getIn(['$eventInfo', 'eventStartDate']);
        }
        return (
            <FormItem
                label={this.props.intl.formatMessage(STRING_SPE.d7h7ge7d1001237)}
                className={[styles.FormItemStyle, styles.labeleBeforeSlect].join(' ')}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                required={true}
                validateStatus={info.giftEffectiveTime.validateStatus}
                help={info.giftEffectiveTime.msg}
            >
                <RangePicker
                    {...pickerProps}
                    disabledDate={this.props.type == '70' ? disabledDate : null}
                />
            </FormItem>
        );
    }

    // 固定有效时间改变
    handleRangePickerChange(date, dateString, index) {
        const _infos = this.state.infos;
        _infos[index].giftEffectiveTime.value = date;

        if (date === null || date === undefined || !date[0] || !date[1]) {
            _infos[index].giftEffectiveTime.validateStatus = 'error';
            _infos[index].giftEffectiveTime.msg = `${this.props.intl.formatMessage(STRING_SPE.db60a2a3892030168)}`;
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
    // 类型改变
    handleValidateTypeChange(e, index) {
        const _infos = this.state.infos;
        _infos[index].effectType = e.target.value;
        _infos[index].giftEffectiveTime.value = '0';
        _infos[index].giftValidDays.value = '';
        _infos[index].giftEffectiveTime.validateStatus = 'success';
        _infos[index].giftValidDays.validateStatus = 'success';
        _infos[index].giftEffectiveTime.msg = null;
        _infos[index].giftValidDays.msg = null;

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
            _infos[index].giftInfo.parentId = newValue[2]
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
            _infos[index].giftInfo.msg = `${this.props.intl.formatMessage(STRING_SPE.d16hffkc88d3164)}`;
            this.setState({
                infos: _infos,
            }, () => {
                this.props.onChange && this.props.onChange(this.state.infos);
            });
        }
    }

    handlegiftTotalCountChange(value, index) {
        const _infos = this.state.infos;
        _infos[index].giftTotalCount.value = value.number;
        const _value = parseFloat(value.number);
        if (_value > 0 && _value <= 1000000000) {
            _infos[index].giftTotalCount.validateStatus = 'success';
            _infos[index].giftTotalCount.msg = null;
        } else {
            _infos[index].giftTotalCount.validateStatus = 'error';
            _infos[index].giftTotalCount.msg = `${this.props.intl.formatMessage(STRING_SPE.d7ekp2h8kd3282)}`;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }
    handlegiftCountChange = (value, index) => {
        const _infos = this.state.infos;
        _infos[index].giftCount.value = value.number;
        const _value = parseFloat(value.number);
        if (_value > 0) {
            if (_value > 50 && (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70')) {
                _infos[index].giftCount.validateStatus = 'error';
                _infos[index].giftCount.msg = `${this.props.intl.formatMessage(STRING_SPE.d4h176ei7g133276)}`;
            } else {
                _infos[index].giftCount.validateStatus = 'success';
                _infos[index].giftCount.msg = null;
            }
        } else {
            _infos[index].giftCount.validateStatus = 'error';
            _infos[index].giftCount.msg = `${this.props.intl.formatMessage(STRING_SPE.da8oel25o134160)}`;
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
            return (<span className={styles.CategoryAdd} onClick={this.add}>{this.props.type == '70' ? null : this.props.type == '20' ? `${this.props.intl.formatMessage(STRING_SPE.d2b1b803260135143)}` : `${this.props.intl.formatMessage(STRING_SPE.d1qe2ar9n936298)}`}</span>);
        } else if (index < _length - 1) {
            return null;
        } else if (index == _length - 1 && _length == this.state.maxCount) {
            return (<span className={styles.CategoryAdd} onClick={() => this.remove(index)}>{this.props.intl.formatMessage(STRING_SPE.dojv8nhwv3776)}</span>)
        } else if (index == _length - 1 && _length < this.state.maxCount) {
            return (
                <span>
                    <span className={styles.CategoryAdd} onClick={() => this.remove(index)}>{this.props.intl.formatMessage(STRING_SPE.dojv8nhwv3776)}</span>
                    <span className={styles.CategoryAdd} onClick={this.add}>{`${this.props.intl.formatMessage(STRING_SPE.d1qe2ar9n936298)}`}`}</span>
                </span>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
    };
};
AddGifts.defaultProps = {
    typeValue: 0,
    typePropertyName: 'sendType'
};
AddGifts.propTypes = {
    typeValue: PropTypes.number,
    typePropertyName: PropTypes.string,
};
export default connect(mapStateToProps)(Form.create()(AddGifts));
