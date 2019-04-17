import React from 'react'
import { Form, Checkbox, Radio, Select, message } from 'antd';
import { connect } from 'react-redux'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import '../../../components/common/ColorPicker.less';
import PriceInput from '../../../containers/SaleCenterNEW/common/PriceInput';
import CardLevel from './CardLevel';
import CardLevelForWX from './CardLevelForWX';
import {
    saleCenterSetSpecialBasicInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import { fetchSpecialCardLevel } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action'

const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;


class SpecialRangeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joinRange: [],
            freeGetJoinRange: ['0'],
            deductPointsStatus: 'success',
            joinCount: '0',
            rewardOnly: 1, // 是否用于打赏
            deductPoints: 0, // 扣减积分数
            sendPoints: 0, // 赠送积分数
            wechatEventListCheck: '0', // 是否在微信会员卡活动列表领取
            wechatOrderCheck: '0', // 是否在微信点菜界面领取
            sendPointsStatus: 'success',
            countCycleDays: 0, // 参与周期
            countCycleDaysStatus: 'success',
            partInTimes: 0, // 最大参与次数
            partInTimesStatus: 'success',
            partInTimesNoValid: 0, // 最大参与次数(限制次数不限制周期使用)
            partInTimesNoValidStatus: 'success',
            isVipBirthdayMonth: '0', // 是否本月生日才能使用
            cardLevelID: '0', // 会员等级
            maxPartInPerson: '', // 最大参与人数
            maxPartInPersonStatus: 'success',
            cardLevelIDList: [],
            cardLevelRangeType: '0',
            freeGetJoinRangeStatus: 'success',
            autoRegister: 1, // 是否需用户填写注册信息
            defaultCardType: '', // 用户静默注册为何种会员
            shopIDList: [],
        };

        this.handlePrev = this.handlePrev.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleJoinCountChange = this.handleJoinCountChange.bind(this); // radioChange
        this.handleJoinRangeChange = this.handleJoinRangeChange.bind(this); // checkBoxChange
        this.handleFreeGetJoinRangeChange = this.handleFreeGetJoinRangeChange.bind(this); // FreeGetJoinRangecheckBoxChange
        this.handleVipBirthdayMonthChange = this.handleVipBirthdayMonthChange.bind(this);
        this.onPartInTimesChange = this.onPartInTimesChange.bind(this);
        this.onCountCycleDaysChange = this.onCountCycleDaysChange.bind(this);
        this.onPartInTimesNoValidChange = this.onPartInTimesNoValidChange.bind(this);
        this.onSendPointsChange = this.onSendPointsChange.bind(this);
        this.onDeductPointsChange = this.onDeductPointsChange.bind(this);
        this.onMaxPartInPersonChange = this.onMaxPartInPersonChange.bind(this);
        this.renderJoinRange = this.renderJoinRange.bind(this);
        this.renderJoinCount = this.renderJoinCount.bind(this);
        this.renderFreeGetJoinRange = this.renderFreeGetJoinRange.bind(this);
        this.onCardLevelChange = this.onCardLevelChange.bind(this);
    }

    componentDidMount() {
        const user = this.props.user;
        const opts = {
            _groupID: user.accountInfo.groupID,
            _role: user.accountInfo.roleType,
            _loginName: user.accountInfo.loginName,
            _groupLoginName: user.accountInfo.groupLoginName,
        };
        this.props.getSubmitFn({
            // prev: undefined,
            prev: this.handlePrev,
            next: this.handleSubmit,
            finish: this.handleSubmit,
            cancel: undefined,
        });
        if (this.props.specialPromotion.getIn(['$eventInfo', 'itemID'])) {
            const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
            let joinRange = [],
                freeGetJoinRange = [],
                joinCount = '0',
                partInTimesNoValidName;
            // 判断CheckBox的值

            if (specialPromotion.wechatEventListCheck != '0') {
                freeGetJoinRange.push('0');
            }
            if (specialPromotion.wechatOrderCheck != '0') {
                freeGetJoinRange.push('1');
            }
            if (specialPromotion.rewardOnly != '0') {
                if (this.props.type === '21') {
                    freeGetJoinRange.push('2');
                } else {
                    joinRange.push('0');
                }
            }
            if (parseFloat(specialPromotion.deductPoints) != '0') {
                joinRange.push('1');
            }
            if (parseFloat(specialPromotion.sendPoints) != '0') {
                joinRange.push('2');
            }
            // 判断Radio的值
            if (specialPromotion.countCycleDays != '0') {
                joinCount = '2';
                partInTimesNoValidName = 'partInTimes';
            } else if (specialPromotion.partInTimes != '0') {
                joinCount = '1';
                partInTimesNoValidName = 'partInTimesNoValid';
            }
            this.setState({
                joinRange,
                freeGetJoinRange,
                joinCount,
                rewardOnly: specialPromotion.rewardOnly, // 是否用于打赏
                deductPoints: specialPromotion.deductPoints, // 扣减积分数
                sendPoints: specialPromotion.sendPoints, // 赠送积分数
                countCycleDays: specialPromotion.countCycleDays, // 参与周期
                isVipBirthdayMonth: `${specialPromotion.isVipBirthdayMonth}`, // 是否本月生日才能使用
                maxPartInPerson: specialPromotion.maxPartInPerson,
                cardLevelID: specialPromotion.cardLevelID || '0',
                cardLevelIDList: specialPromotion.cardLevelIDList || [],
                cardLevelRangeType: specialPromotion.cardLevelRangeType || '0',
                [partInTimesNoValidName]: specialPromotion.partInTimes, // 最大参与次数
                autoRegister: specialPromotion.autoRegister == 0 ? 0 : 1,
            })
        }
    }

    handlePrev() {
        return this.handleSubmit(true)
    }
    handleSubmit(isPrev) {
        let nextFlag = true;
        this.props.form.validateFieldsAndScroll((err) => {
            if (err) {
                nextFlag = false;
            }
        });
        let {
            joinRange,
            freeGetJoinRange,
            joinCount,
            rewardOnly, // 是否用于打赏
            deductPoints, // 扣减积分数
            sendPoints, // 赠送积分数
            wechatEventListCheck, // 是否在微信会员卡活动列表领取
            wechatOrderCheck, // 是否在微信点菜界面领取
            countCycleDays, // 参与周期
            partInTimes, // 最大参与次数
            partInTimesNoValid, // 最大参与次数
            isVipBirthdayMonth, // 是否本月生日才能使用
            maxPartInPerson, // 参与人数
            maxPartInPersonStatus,
            freeGetJoinRangeStatus,
            autoRegister,
            defaultCardType,
            shopIDList,
        } = this.state;
        const opts = {
            rewardOnly,
            isVipBirthdayMonth,
            maxPartInPerson,
            cardLevelID: this.state.cardLevelID || '0',
            cardLevelIDList: this.state.cardLevelIDList || [],
            cardLevelRangeType: this.state.cardLevelRangeType || '0',
        };
        if (this.props.type === '22' && (maxPartInPerson === '' || maxPartInPerson === null)) {
            nextFlag = false;
            maxPartInPersonStatus = 'error';
            this.setState({ maxPartInPersonStatus })
        }
        if (this.props.type === '21' && this.state.freeGetJoinRange.length === '0') {
            nextFlag = false;
        }
        if (this.props.type === '23' && (this.state.cardLevelRangeType === '0' || !opts.cardLevelIDList.length) ) {
            const excludeEvents = this.props.specialPromotion.get('$eventInfo').toJS().excludeEventCardLevelIdModelList || [];
            if (excludeEvents.length && !opts.cardLevelIDList.length) {
                return isPrev || false;
            }
            opts.cardLevelRangeType = '4'; // 全部微信会员
        }
        if (this.props.type === '23' || this.props.type === '20' || this.props.type === '21' || this.props.type === '22' || this.props.type === '30') {
            opts.autoRegister = autoRegister
            opts.defaultCardType = defaultCardType
            if (this.props.type !== '23' && !defaultCardType) {
                nextFlag = false;
            }
        }
        if (this.props.type === '23') { // 线上餐厅送礼
            if (!isPrev) {
                if (this.props.queryCanUseShopStatus === 'pending') {
                    message.warning('正在查询可用店铺, 请稍候');
                    return false;
                }
                if (this.props.queryCanUseShopStatus === 'error') {
                    message.warning('查询可用店铺失败, 请重试');
                    return false;
                }
            }
            if (shopIDList.length > 0) { // 如果已选店铺, 透传
                opts.shopIDList = shopIDList;
            } else if (opts.cardLevelIDList.length > 0) { // 没选店铺 但选了卡类 卡等级
                const canUseShop = this.props.canUseShopIDs.toJS();
                const excludeShopIDs = this.props.excludeCardTypeAndShopIDs.toJS().reduce((acc, curr) => {
                    acc.push(...curr.shopIDList.map(id => `${id}`));
                    return acc;
                }, []);
                opts.shopIDList = canUseShop.filter(id => !excludeShopIDs.includes(id))
            } else { // 没选店铺且没选卡类
                opts.shopIDList = [];
            }
            opts.shopRange = opts.shopIDList.length > 0 ? 1 : 2
        }
        // 由于redux里面存的可能是所有字段,所以修改的时候需要把之前设置过,现在要取消的东西初始化

        if (nextFlag) {
            if (joinRange.indexOf('0') !== -1 || freeGetJoinRange.indexOf('2') !== -1) {
                opts.rewardOnly = '1';
            } else {
                opts.rewardOnly = '0';
            }
            if (this.props.type === '21') {
                if (freeGetJoinRange.indexOf('0') !== -1) {
                    opts.wechatEventListCheck = '1';// 是否在微信会员卡活动列表领取
                } else {
                    opts.wechatEventListCheck = '0';
                }
                if (freeGetJoinRange.indexOf('1') !== -1) {
                    opts.wechatOrderCheck = '1';// 是否在微信点菜界面领取
                } else {
                    opts.wechatOrderCheck = '0';
                }
            }
            if (joinRange.indexOf('1') !== -1) {
                opts.deductPoints = deductPoints;
                if (deductPoints <= 0 || isNaN(deductPoints)) {
                    nextFlag = false;
                    this.setState({
                        deductPointsStatus: 'error',
                    })
                }
            } else {
                opts.deductPoints = '0';
            }
            if (joinRange.indexOf('2') !== -1) {
                opts.sendPoints = sendPoints;
                if (sendPoints <= 0 || isNaN(sendPoints)) {
                    nextFlag = false;
                    this.setState({
                        sendPointsStatus: 'error',
                    })
                }
            } else {
                opts.sendPoints = '0';
            }
            if (joinCount == '2') {
                if (countCycleDays <= 0 || isNaN(countCycleDays)) {
                    nextFlag = false;
                    this.setState({
                        countCycleDaysStatus: 'error',
                    })
                }
                if (partInTimes <= 0 || isNaN(partInTimes)) {
                    nextFlag = false;
                    this.setState({
                        partInTimesStatus: 'error',
                    })
                }
                opts.countCycleDays = countCycleDays;
                opts.partInTimes = partInTimes;
            }
            if (joinCount == '1') {
                if (partInTimesNoValid <= 0 || isNaN(sendPoints)) {
                    nextFlag = false;
                    this.setState({
                        partInTimesNoValidStatus: 'error',
                    })
                }
                opts.countCycleDays = '0';
                opts.partInTimes = partInTimesNoValid;
            }
            if (joinCount == '0') {
                opts.countCycleDays = '0';
                opts.partInTimes = '0';
            }
            // 报名活动，就限制参加一次
            if (this.props.type === '22') {
                opts.partInTimes = '1';
            }
            if (isPrev || nextFlag) {
                this.props.setSpecialBasicInfo(opts);
            }
        }
        return isPrev || nextFlag;
    }
    // 免费领取的参与范围
    renderFreeGetJoinRange() {
        const options = [
            { label: '微信会员卡活动列表领取', value: '0' },
            // { label: '微信点菜界面领取', value: '1' },
            { label: '打赏活动领取', value: '2' },
        ];
        // 因为开发线上领取新功能，去掉{ label: '微信点菜界面领取', value: '1' },
        const idx = this.state.freeGetJoinRange.findIndex((value) => {
            return value === '1';
        });
        const range = this.state.freeGetJoinRange;
        idx === -1 ? null : range.splice(idx, idx + 1);
        return (
            <div>
                <FormItem
                    label={'参与范围'}
                    className={[styles.noPadding, styles.inlineCheckBox].join(' ')}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                // validateStatus={this.state.freeGetJoinRangeStatus}
                // help='请选择参与范围'
                // 不用status，flag置为false即可，用了还要手动改变success或error,getFieldDecorator自动改变
                >
                    {this.props.form.getFieldDecorator('freeGetJoinRange', {
                        rules: [{
                            required: true,
                            message: '请选择参与范围',
                        }],
                        initialValue: range,
                    })(
                        <CheckboxGroup options={options} onChange={this.handleFreeGetJoinRangeChange} />
                    )
                    }
                </FormItem>
            </div>
        );
    }
    // 参与积分
    renderJoinRange() {
        const options = [
            { label: '仅用于打赏活动', value: '0' },
            { label: '参与活动扣积分', value: '1' },
            { label: '参与活动赠积分', value: '2' },
        ];
        const optionTwo = [
            { label: '参与活动扣积分', value: '1' },
            { label: '参与活动赠积分', value: '2' },
        ];
        const help = '积分必须大于0';
        return (
            <div>
                <FormItem
                    label={this.props.type === '21' ? '参与积分' : '参与范围'}
                    labelCol={{ span: 4 }}
                    className={styles.noPadding}
                    wrapperCol={{ span: 20 }}
                >
                </FormItem>
                <FormItem
                    label=""
                    className={styles.noPadding}
                    wrapperCol={{ span: 17, offset: 4 }}
                >
                    <CheckboxGroup options={this.props.type === '30' || this.props.type === '22' || this.props.type === '21' ? optionTwo : options} value={this.state.joinRange} onChange={this.handleJoinRangeChange} />
                    <div className={styles.deduct}>
                        <FormItem validateStatus={this.state.deductPointsStatus}>
                            <PriceInput
                                addonBefore={'扣除积分'}
                                addonAfter={'分'}
                                disabled={this.state.joinRange.indexOf('1') === -1}
                                value={{ number: this.state.deductPoints }}
                                defaultValue={{ number: this.state.deductPoints }}
                                onChange={this.onDeductPointsChange}
                            />
                        </FormItem>
                    </div>
                    <div className={styles.add}>
                        <FormItem validateStatus={this.state.sendPointsStatus}>
                            <PriceInput
                                addonBefore={'赠送积分'}
                                addonAfter={'分'}
                                disabled={this.state.joinRange.indexOf('2') === -1}
                                value={{ number: this.state.sendPoints }}
                                defaultValue={{ number: this.state.sendPoints }}
                                onChange={this.onSendPointsChange}
                            />
                        </FormItem>
                    </div>
                </FormItem>
            </div>
        );
    }
    renderJoinCount() {
        const radioStyle = {
            display: 'block',
            height: '32px',
            lineHeight: '32px',
        };
        return (
            <div>
                <FormItem
                    label={'参与次数'}
                    className={styles.noPadding}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                </FormItem>
                <FormItem
                    label={''}
                    className={styles.noPadding}
                    wrapperCol={{ span: 17, offset: 4 }}
                >
                    <RadioGroup value={this.state.joinCount} onChange={this.handleJoinCountChange}>
                        <Radio style={radioStyle} value={'0'}>不限次数</Radio>
                        <Radio style={radioStyle} value={'1'}>限制次数</Radio>
                        <div className={styles.priceWrapper}>
                            <FormItem validateStatus={this.state.partInTimesNoValidStatus}>
                                <PriceInput
                                    addonBefore={'可参与'}
                                    addonAfter={'次'}
                                    disabled={this.state.joinCount.indexOf('1') === -1}
                                    value={{ number: this.state.partInTimesNoValid }}
                                    defaultValue={{ number: this.state.partInTimesNoValid }}
                                    onChange={this.onPartInTimesNoValidChange}
                                    modal={'int'}
                                />
                            </FormItem>
                        </div>
                        <Radio style={radioStyle} value={'2'}>限制参与次数的周期</Radio>
                        <div className={styles.addTwo}>
                            <div style={{ width: '70%', display: 'inline-block' }}>
                                <FormItem validateStatus={this.state.countCycleDaysStatus}>
                                    <PriceInput
                                        addonBefore={'同一用户'}
                                        addonAfter={'天,可参与'}
                                        disabled={this.state.joinCount.indexOf('2') === -1}
                                        value={{ number: this.state.countCycleDays }}
                                        defaultValue={{ number: this.state.countCycleDays }}
                                        onChange={this.onCountCycleDaysChange}
                                        modal={'int'}
                                    />
                                </FormItem>
                            </div>

                            <div style={{ width: '30%', display: 'inline-block', position: 'relative', left: '-1px' }}>
                                <FormItem validateStatus={this.state.partInTimesStatus}>
                                    <PriceInput
                                        addonBefore={''}
                                        addonAfter={'次'}
                                        disabled={this.state.joinCount.indexOf('2') === -1}
                                        value={{ number: this.state.partInTimes }}
                                        defaultValue={{ number: this.state.partInTimes }}
                                        onChange={this.onPartInTimesChange}
                                        modal={'int'}
                                    />
                                </FormItem>
                            </div>

                        </div>
                    </RadioGroup>
                </FormItem>
            </div>
        );
    }
    onPartInTimesChange(value) {
        this.setState({
            partInTimes: value.number,
            partInTimesStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onPartInTimesNoValidChange(value) {
        this.setState({
            partInTimesNoValid: value.number,
            partInTimesNoValidStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onCountCycleDaysChange(value) {
        this.setState({
            countCycleDays: value.number,
            countCycleDaysStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onSendPointsChange(value) {
        this.setState({
            sendPoints: value.number,
            sendPointsStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onDeductPointsChange(value) {
        this.setState({
            deductPoints: value.number,
            deductPointsStatus: value.number > 0 ? 'success' : 'error',
        })
    }
    onMaxPartInPersonChange(value) {
        if (value.number === '' || value.number == null) {
            this.setState({
                maxPartInPerson: value.number,
                maxPartInPersonStatus: 'error',
            })
        } else {
            this.setState({
                maxPartInPerson: value.number,
                maxPartInPersonStatus: 'success',
            })
        }
    }
    handleJoinRangeChange(val) {
        this.setState({
            joinRange: val,
        })
        if (val.indexOf('1') === -1) {
            this.setState({
                deductPointsStatus: 'success',
            });
        }
        if (val.indexOf('2') === -1) {
            this.setState({
                sendPointsStatus: 'success',
            });
        }
    }
    handleFreeGetJoinRangeChange(val) {
        this.setState({
            freeGetJoinRange: val,
        })
    }
    handleJoinCountChange(e) {
        this.setState({
            joinCount: e.target.value,
            partInTimesNoValidStatus: 'success',
            countCycleDaysStatus: 'success',
            partInTimesStatus: 'success',
        });
    }
    handleVipBirthdayMonthChange(e) {
        this.setState({
            isVipBirthdayMonth: e.target.value,
        });
    }
    onCardLevelChange(obj) {
        this.setState(obj);
    }
    autoRegisterChange = (e) => {
        this.setState({
            autoRegister: e.target.value,
        });
    }
    render() {
        return (
            <Form>
                {this.props.type === '21' ? this.renderFreeGetJoinRange() : null}
                {this.props.type !== '23' ? this.renderJoinRange() : null}
                {this.props.type !== '22' ? this.renderJoinCount() : null}
                {
                    this.props.type === '23' ?
                        <CardLevelForWX
                            onChange={this.onCardLevelChange}
                            catOrCard={'cat'}
                            type={this.props.type}
                            form={this.props.form}
                        /> :
                        <CardLevel
                            onChange={this.onCardLevelChange}
                            catOrCard={'card'}
                            type={this.props.type}
                            form={this.props.form}
                        />
                }
                {
                    this.props.type === '23' || this.props.type === '20' || this.props.type === '21' || this.props.type === '22' || this.props.type === '30' ?
                        (<FormItem
                            label={'参加活动成为会员'}
                            className={styles.noPadding}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                        >
                            <RadioGroup onChange={this.autoRegisterChange} value={this.state.autoRegister}>
                                <Radio value={1}>无需用户填写注册信息</Radio>
                                <Radio value={0}>用户须填写注册信息</Radio>
                            </RadioGroup>
                        </FormItem>) : null
                }
                {
                    this.props.type !== '23' ?
                        <FormItem
                            label={'其他限制'}
                            className={styles.noPadding}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                        >
                            <RadioGroup onChange={this.handleVipBirthdayMonthChange} value={this.state.isVipBirthdayMonth}>
                                <Radio value={'0'}>不限制</Radio>
                                <Radio value={'1'}>仅限本月生日的会员参与</Radio>
                            </RadioGroup>
                        </FormItem> : null
                }
                {
                    this.props.type === '22' ?
                        <FormItem
                            label={'最大报名人数'}
                            className={styles.noPadding}
                            wrapperCol={{ span: 17 }}
                            labelCol={{ span: 4 }}
                            validateStatus={this.state.maxPartInPersonStatus}
                            help={this.state.maxPartInPersonStatus === 'success' ? null : '请输入最大报名人数'}
                        >
                            <PriceInput
                                addonBefore={''}
                                addonAfter={''}
                                modal={'int'}
                                placeholder={'请输入最大报名人数'}
                                value={{ number: this.state.maxPartInPerson }}
                                defaultValue={{ number: this.state.maxPartInPerson }}
                                onChange={this.onMaxPartInPersonChange}
                            />
                        </FormItem>
                        : null
                }

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
        canUseShopIDs: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'canUseShopIDs']),
        excludeCardTypeAndShopIDs: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'excludeCardTypeShops']),
        queryCanUseShopStatus: state.sale_specialPromotion_NEW.getIn(['addStatus', 'availableShopQueryStatus']),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SpecialRangeInfo));
