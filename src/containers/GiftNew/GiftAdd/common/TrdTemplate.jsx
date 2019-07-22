/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-01-23T13:49:32+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: SeniorDateSetting.jsx
* @Last modified by:   Terrence
* @Last modified time: 2017-03-14T13:42:04+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
    Select,
    Form,
    Switch,
    Input,
    Spin,
    Radio,
    DatePicker,
    Popover,
    Icon,
} from 'antd';
import { fetchData } from '../../../../helpers/util';
import GiftCfg from '../../../../constants/Gift';
import {
    fetchAllPromotionListAC,
    queryUnbindCouponPromotion,
} from '../../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    queryWechatMpInfo,
} from '../../_action';
import PriceInput from '../../../SaleCenterNEW/common/PriceInput'
import styles from '../Crm.less';
import selfStyle from './selfStyle.less';
import GiftImagePath from './GiftImagePath';
const RangePicker = DatePicker.RangePicker;

const FormItem = Form.Item
const Option = Select.Option;
const RadioGroup = Radio.Group;
const itemStyle = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    style: { marginBottom: 0 },
    required: true,
}
// 这些第三方渠道的对接, 不需要渲染选择券码的Select
const SIMPLE_TRD_CHANNEL_IDS = [
    20, 30, 40
];
// 微信第三方券，固定时长类型（相对有效期
const FIX_TERM = 'DATE_TYPE_FIX_TERM';
// 微信第三方券，固定有效期范围类型
const FIX_TIME_RANGE = 'DATE_TYPE_FIX_TIME_RANGE';
const AVAILABLE_WECHAT_COLORS = [
    {
        value: 'COLOR_010',
        styleValue: '#63B359',
    },
    {
        value: 'COLOR_020',
        styleValue: '#2C9F67',
    },
    {
        value: 'COLOR_030',
        styleValue: '#509FC9',
    },
    {
        value: 'COLOR_040',
        styleValue: '#5885CF',
    },
    {
        value: 'COLOR_050',
        styleValue: '#9062C0',
    },
    {
        value: 'COLOR_060',
        styleValue: '#D09A45',
    },
    {
        value: 'COLOR_070',
        styleValue: '#E4B138',
    },
    {
        value: 'COLOR_080',
        styleValue: '#EE903C',
    },
    {
        value: 'COLOR_090',
        styleValue: '#DD6549',
    },
    {
        value: 'COLOR_100',
        styleValue: '#CC463D',
    },
]
const AVAILABLE_TIME_OPTIONS = (() => {
    const options = (new Array(30))
        .fill(0)
        .map((_, index) => ({
            value: `${index + 1}`,
            label: `${index + 1}天后生效`
        }));
    options.unshift({value: '0', label: '立即生效'});
    return options;
})()
class TrdTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultChecked: false,
            mpList: [], // 公众号
            trdTemplateInfoList: [], // 第三方券模版
            channelIDStatus: true,
            mpIDStatus: true,
            trdGiftItemIDStatus: true,
            loading: false,
            color: 'COLOR_010',
            // 0 为把已创建的第三方券绑定到哗啦啦，1 为同步创建一张微信券
            bindType: 0,
            notice: undefined,
            type: FIX_TERM,
            fixedBeginTerm: '0',
            fixedTerm: undefined,
            logoUrl: '',
            beginTimestamp: undefined,
            endTimestamp: undefined,
            appID: undefined,
            brandName: undefined,
        };
        this.wrapperDOM = null;
    }
    componentDidMount() {
        let channelID = undefined;
        // 编辑
        if (this.props.data) {
            this.propsChange(this.props.data)
            if (this.props.data.trdTemplateInfo) {
                this.setState({
                    defaultChecked: true,
                    bindType: 1,
                    ...JSON.parse(this.props.data.trdTemplateInfo)
                })
            } else {
                const { extraInfo, trdChannelID, trdTemplateID } = this.props.data
                const { wechatMpName, trdTemplateIDLabel } = JSON.parse(extraInfo);
                channelID = trdChannelID
                this.setState({
                    bindType: 0,
                    defaultChecked: true,
                    channelID,
                    mpID: wechatMpName, // 不用找匹配了，直接渲染成name，因为mplist此时可能未回来
                    trdGiftItemID: trdTemplateID,
                    trdTemplateIDLabel,
                    trdTemplateInfoList: [{ // 不用查询了，直接根据返回的label和id拼装成只有一个选项的列表
                        trdGiftName: trdTemplateIDLabel,
                        trdGiftItemID: trdTemplateID,
                    }],
                })
            }
        }
        // 公众号
        const mpList = this.props.mpList.toJS()
        mpList.length === 0 ? this.props.queryWechatMpInfo() : null
        this.setState({ mpList: mpList || [] })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mpList !== nextProps.mpList) {
            const mpList = nextProps.mpList.toJS()
            this.setState({ mpList: mpList || [] })
        }
    }
    popIntoView = () => {
        try {
            this.wrapperDOM.scrollIntoView(true)
        } catch (e) {
            // oops
        }
    }
    // 向父传递
    propsChange = (data) => {
        if (data) {
            // 点编辑时，向父组件传递用户已设置的初始值
            data.TrdTemplateStatus = true;
            this.props.onChange(data);
            return
        }
        // 新建时
        if (this.state.bindType === 0) {
            this.validatorTemp().then((TrdTemplateStatus) => {
                const { defaultChecked, channelID: trdChannelID, trdTemplateInfoList, trdGiftItemID: trdTemplateID, mpList, mpID } = this.state
                const wechatMpName = mpID ? mpList.find(mp => mp.mpID === mpID).mpName : undefined;
                const trdTemplateEntity = trdTemplateInfoList.find(template => template.trdGiftItemID === trdTemplateID);
                const trdTemplateIDLabel = trdTemplateEntity ? trdTemplateEntity.trdGiftName : undefined
                const values = {
                    TrdTemplateStatus,
                    extraInfo: JSON.stringify({ wechatMpName, trdTemplateIDLabel }),
                    validityDays: trdTemplateEntity ? trdTemplateEntity.validityDays : 0,
                    effectTime: trdTemplateEntity ? trdTemplateEntity.startDate : '',
                    trdChannelID,
                    trdTemplateID,
                }
                this.props.onChange(defaultChecked ? values : undefined)
            })
        } else {
            let TrdTemplateStatus = true;
            const {
                defaultChecked,
                mpID,
                notice,
                logoUrl,
                type,
                fixedBeginTerm,
                fixedTerm,
                color,
                beginTimestamp,
                endTimestamp,
                appID,
                brandName,
            } = this.state;
            if (!mpID) TrdTemplateStatus = false;
            if (!notice || notice.length > 16 ) TrdTemplateStatus = false;
            if (!logoUrl) TrdTemplateStatus = false;
            if (type === FIX_TERM) {
                !(fixedTerm > 0) && (TrdTemplateStatus = false)
            } else {
                if (!beginTimestamp || !endTimestamp) TrdTemplateStatus = false
            }
            this.props.onChange(defaultChecked ? {
                TrdTemplateStatus,
                trdTemplateInfo: JSON.stringify({
                    appID,
                    brandName,
                    mpID,
                    notice,
                    logoUrl,
                    color,
                    type,
                    fixedBeginTerm: type === FIX_TERM ? fixedBeginTerm : undefined,
                    fixedTerm: type === FIX_TERM ? fixedTerm : undefined,
                    beginTimestamp: type === FIX_TIME_RANGE ? beginTimestamp : undefined,
                    endTimestamp: type === FIX_TIME_RANGE ? endTimestamp : undefined,
                })
            } : undefined)
        }
    }
    // 校验表单
    validatorTemp = () => {
        const { defaultChecked, channelID, mpID, trdGiftItemID } = this.state
        if (!defaultChecked) return Promise.resolve(true)
        let TrdTemplateStatus = true;
        let channelIDStatus = true;
        let mpIDStatus = true;
        let trdGiftItemIDStatus = true;
        if (!channelID) { channelIDStatus = false; TrdTemplateStatus = false; }
        if (channelID == 10 && !mpID) { mpIDStatus = false; TrdTemplateStatus = false; }
        if (!trdGiftItemID) { trdGiftItemIDStatus = false; TrdTemplateStatus = false; }
        if (SIMPLE_TRD_CHANNEL_IDS.includes(Number(channelID))) { trdGiftItemIDStatus = true; TrdTemplateStatus = true; }
        this.setState({ channelIDStatus, mpIDStatus, trdGiftItemIDStatus })
        return Promise.resolve(TrdTemplateStatus)
    }
    handleBindTypeChange = ({ target: { value } }) => {
        this.setState({ bindType: value, mpID: '', }, () => {
            this.propsChange()
        })
    }
    // 第三方券模版
    queryTrdTemplate = (mpID, appID, trdChannelID) => {
        if (trdChannelID == 10 && !appID) return
        // 第三方券模版
        return fetchData('queryTrdTemplate', {
            groupID: this.props.accountInfo.toJS().groupID,
            channelID: trdChannelID || 10,
            forceRefresh: 1,
            mpID: trdChannelID == 10 ? mpID : undefined, // 有值代表微信公众号id,没有代表其他渠道
            appID: trdChannelID == 10 ? appID : undefined, // 有值代表微信公众号id,没有代表其他渠道
        }, null, { path: 'trdTemplateInfoList' }).then((rawList ) => {
            const trdTemplateInfoList = []
            if (Array.isArray(rawList)) {
                rawList.forEach(item => {
                    const entity = {...item};
                    try {
                        // 将后端的JSON解析出来, 根据不同的类型, 修改券名称, 方便区分同名微信券
                        const dateInfo = JSON.parse(item.dateInfo);
                        const {
                            type,
                            beginTimestamp,
                            endTimestamp,
                            fixedTerm,
                        } = dateInfo;
                        // 固定有效期类型
                        if (type === FIX_TIME_RANGE) {
                            const startMoment = moment.unix(beginTimestamp);
                            const endMoment = moment.unix(endTimestamp);
                            const startTimeString = startMoment.format('YYYY/MM/DD');
                            const endTimeString = endMoment.format('YYYY/MM/DD');
                            entity.trdGiftName = `${entity.trdGiftName || ''} (有效期: ${startTimeString}~${endTimeString})`;
                            entity.startDate = startMoment.format('YYYYMMDD');
                            entity.validityDays = endMoment.diff(startMoment, 'days') + 1;
                        }
                        // 相对有效期类型
                        if (type === FIX_TERM) {
                            entity.trdGiftName = `${entity.trdGiftName || ''} (有效期: ${fixedTerm}天)`;
                            entity.validityDays = fixedTerm || 0;
                        }
                    } catch (e) {
                    }
                    trdTemplateInfoList.push(entity);
                })
            }
            this.setState({
                trdTemplateInfoList: trdTemplateInfoList,
                loading: false,
            })
            return Promise.resolve(trdTemplateInfoList)
        }).catch(error => {
            this.setState({
                trdTemplateInfoList: [],
                loading: false,
            })
        }) ;
    }
    // Switch Button
    handleDefaultChecked = (value) => {
        this.setState({
            defaultChecked: value,
            channelID: 10,
            mpID: '',
            trdGiftItemID: '',
            trdTemplateInfoList: [], // 清空当下微信号模板
        }, () => {
            this.propsChange() // 向父传递
        })
        if (this.props.describe === '活动券') {
            const channelID = value ? 10 : 1 // 10微信，1普通哗啦营销活动
            this.props.queryUnbindCouponPromotion({ channelID }) // 查询未绑定过的活动
            this.props.clearPromotion() // 清空已选活动
        }
    }
    // 渠道选择
    handleTrdChannelSelect = (value) => {
        this.setState({
            channelID: value,
            mpID: '',
            trdGiftItemID: '',
        }, () => {
            this.propsChange() // 向父传递
        })
        if (this.props.describe === '活动券') {
            this.props.queryUnbindCouponPromotion({ channelID: value }) // 查询未绑定过的活动
            this.props.clearPromotion() // 清空已选活动
        }
        if (SIMPLE_TRD_CHANNEL_IDS.includes(Number(value))) return this.propsChange();
        if (value === 10) {
            this.queryTrdTemplate(this.state.mpList[0].mpID, this.state.mpList[0].appID, 10) // 带着微信号查模板
        } else {
            this.queryTrdTemplate(undefined, undefined, value)
        }
    }

    // 绑定第三方券微信号选择
    handleMpSelect = (value) => {
        const mpList = this.state.mpList;
        this.setState({
            mpID: value,
            trdGiftItemID: '',
            trdTemplateInfoList: [], // 清空当下微信号模板
            loading: true,
        }, () => {
            this.propsChange() // 向父传递
            const mpAccount = mpList.find(item => String(item.mpID) === String(value));
            this.queryTrdTemplate(value, mpAccount? mpAccount.appID: undefined, 10) // 带着微信号查模板
        })
    }
    // 正向绑定微信ID选择
    handleMpIDChange = (value) => {
        const mpInfo = this.state.mpList.find(item => item.mpID === value) || {};
        this.setState({
            mpID: value,
            appID: mpInfo.appID,
            brandName: mpInfo.mpName,
        }, () => {
            this.propsChange() // 向父传递
        })
    }
    // 三方模板选择
    handleTrdTemplate = (value) => {
        this.setState({ trdGiftItemID: value }, () => {
            this.propsChange() // 向父传递
        })
    }
    handleNoticeChange = ({ target: { value } }) => {
        this.setState({ notice: value }, () => {
            this.propsChange()
        })
    }
    handleTimeTypeChange = ({ target: { value } }) => {
        this.setState({ type: value }, () => {
            this.propsChange()
        })
    }
    handleColorChange = (value) => {
        this.setState({ color: value }, () => {
            this.propsChange()
        })
    }
    handleLogoUrlChange = (value) => {
        this.setState({ logoUrl: value }, () => {
            this.propsChange()
        })
    }
    handleFixedBeginTermSelect = (value) => {
        this.setState({ fixedBeginTerm: value }, () => {
            this.propsChange()
        })
    }
    handleFixedTermChange = (value) => { // value: {number: 123}
        this.setState({ fixedTerm: value.number }, () => {
            this.propsChange()
        })
    }
    handleTimeRangeChange = ([beginMoment, endMoment]) => {
        if (!beginMoment || !endMoment) return;
        const beginTimestamp = beginMoment.set('hour', 0).set('minute', 0).set('second', 0).unix();
        const endTimestamp = endMoment.set('hour', 23).set('minute', 59).set('second', 59).unix();
        this.setState({
            beginTimestamp,
            endTimestamp,
        }, () => {
            this.propsChange()
        })
    }
    renderWxCouponCreateForm() {
        const {
            mpList,
            mpID,
            color,
            notice,
            logoUrl,
            fixedBeginTerm,
            fixedTerm,
            beginTimestamp,
            endTimestamp,
            type, // 微信
        } = this.state;
        const edit = this.props.type === 'edit';
        const styleColor = AVAILABLE_WECHAT_COLORS.find(item => item.value === color).styleValue;
        const isNoticeLengthAllowed = (notice || '').length > 0 && (notice || '').length <= 16
        return (
            <div>
                <FormItem
                    label='微信公众号选择'
                    {...itemStyle}
                    validateStatus={mpID ? 'success' : 'error'}
                    help={mpID ? null : '不得为空'}
                >
                    <Select value={mpID}
                            onChange={this.handleMpIDChange}
                            disabled={edit}
                            getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            mpList.map(mp => {
                                return <Option key={mp.mpID} value={mp.mpID}>{mp.mpName}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                <FormItem
                    label='优惠券颜色'
                    {...itemStyle}
                    className={selfStyle.customColorPickerWrapper}
                    required={false}
                >
                    <Popover arrowPointAtCenter trigger="click" placement="topLeft" content={(
                        <div className={selfStyle.colorPaletteWrapper}>
                            {AVAILABLE_WECHAT_COLORS.map(({value, styleValue}) => (
                                <div
                                    key={value}
                                    onClick={edit ? null : () => this.handleColorChange(value)}
                                    className={selfStyle.colorBlock}
                                    style={{ background: styleValue }}
                                >
                                    {value === color && (
                                        <Icon style={{ fontSize: 14, color: '#fff' }} type="check" />
                                    ) }
                                </div>
                            ))}
                        </div>
                    )}>
                        <div
                            className={selfStyle.smallColorBlockWrapper}
                        >
                            <div
                                className={selfStyle.smallColorBlock}
                                style={{ background: styleColor }}
                            />
                        </div>
                    </Popover>
                </FormItem>
                <FormItem
                    label='操作提示'
                    {...itemStyle}
                    validateStatus={isNoticeLengthAllowed ? 'success' : 'error'}
                    help={isNoticeLengthAllowed ? null : '操作提示不得为空，长度不超过16'}
                    style={{ position: 'relative' }}
                >
                    <Input
                        value={notice}
                        disabled={edit}
                        onChange={this.handleNoticeChange}
                        placeholder="请输入操作提示，长度不要超过16"
                    />
                    <span style={{ position: 'absolute', top: 0, right: 8, color: '#787878' }}>
                        {`${(notice || '').length} / 16`}
                    </span>
                </FormItem>
                <FormItem
                    label='封面图片'
                    {...itemStyle}
                    validateStatus={logoUrl ? 'success' : 'error'}
                    help={logoUrl ? null : '请上传封面图片'}
                    style={{ position: 'relative' }}
                >
                    <GiftImagePath
                        disabled={edit}
                        wrapperHeight={200}
                        modifierClassName="horizontalModifier"
                        limit={2048}
                        hint="图片建议尺寸：850像素 x 350像素，大小不超过2MB"
                        value={logoUrl}
                        onChange={this.handleLogoUrlChange}
                    />
                </FormItem>
                <FormItem
                    label="生效方式"
                    {...itemStyle}
                    required={false}
                >
                    <RadioGroup
                        onChange={this.handleTimeTypeChange}
                        value={type}
                        disabled={edit}
                    >
                        <Radio value={FIX_TERM}>相对有效期</Radio>
                        <Radio value={FIX_TIME_RANGE}>固定有效期</Radio>
                    </RadioGroup>
                </FormItem>
                {
                    type === FIX_TIME_RANGE && (
                        <FormItem
                            label="固定有效期"
                            {...itemStyle}
                        >
                            <RangePicker
                                disabled={edit}
                                format="YYYY-MM-DD"
                                value={beginTimestamp && endTimestamp ?
                                    [moment.unix(beginTimestamp), moment.unix(endTimestamp)] : []
                                }
                                onChange={this.handleTimeRangeChange}
                                disabledDate={
                                    (current) => current && current.format('YYYYMMDD') < moment().format('YYYYMMDD')
                                }
                            />
                        </FormItem>
                    )
                }
                {
                    type === FIX_TERM && (
                        <FormItem
                            label="何时生效"
                            {...itemStyle}
                            required={false}
                        >
                            <Select value={fixedBeginTerm}
                                    onChange={this.handleFixedBeginTermSelect}
                                    disabled={edit}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    AVAILABLE_TIME_OPTIONS.map(({ value, label }) => (
                                        <Option key={value} value={value}>{label}</Option>
                                    ))
                                }
                            </Select>
                        </FormItem>
                    )
                }
                {
                    type === FIX_TERM && (
                        <FormItem
                            label="有效天数"
                            {...itemStyle}
                            validateStatus={fixedTerm > 0 ? 'success' : 'error'}
                            help={fixedTerm > 0 ? null : '请设置有效天数'}
                        >
                            <PriceInput
                                modal="int"
                                disabled={edit}
                                value={{number: fixedTerm}}
                                onChange={this.handleFixedTermChange}
                                placeholder="请设置有效天数"
                                addonAfter="天"
                                maxNum={5}
                            />
                        </FormItem>
                    )
                }
            </div>
        )
    }
    renderDefaultTrdForm() {
        const {
            channelID = 10,
            mpList,
            mpID,
            trdTemplateInfoList,
            trdGiftItemID,
            channelIDStatus,
            mpIDStatus,
            trdGiftItemIDStatus,
        } = this.state;
        const edit = this.props.type === 'edit';
        return (
            <div>
                <FormItem
                    label='第三方渠道'
                    {...itemStyle}
                    validateStatus={channelIDStatus ? 'success' : 'error'}
                    help={channelIDStatus ? null : '不得为空'}
                >
                    <Select value={`${channelID}`}
                            onChange={this.handleTrdChannelSelect}
                            disabled={edit}
                            getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            GiftCfg.trdChannelIDs.map(trdChannel => {
                                return (
                                    <Option key={`${trdChannel.value}`} value={`${trdChannel.value}`}>
                                        {trdChannel.label}
                                    </Option>
                                )
                            })
                        }
                    </Select>
                </FormItem>
                {
                    channelID !== 10 ? null :
                        (<FormItem
                            label='微信公众号选择'
                            {...itemStyle}
                            validateStatus={mpIDStatus ? 'success' : 'error'}
                            help={mpIDStatus ? null : '不得为空'}
                        >
                            <Select value={mpID}
                                    onChange={this.handleMpSelect}
                                    disabled={edit}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    mpList.map(mp => {
                                        return <Option key={mp.mpID} value={mp.mpID}>{mp.mpName}</Option>
                                    })
                                }
                            </Select>
                        </FormItem>)
                }
                {
                    SIMPLE_TRD_CHANNEL_IDS.includes(Number(channelID)) ? null : (
                        <FormItem
                            label='第三方券模板或活动'
                            {...itemStyle}
                            validateStatus={trdGiftItemIDStatus ? 'success' : 'error'}
                            help={trdGiftItemIDStatus ? null : '不得为空'}
                        >
                            <Select onChange={this.handleTrdTemplate}
                                    value={trdGiftItemID}
                                    disabled={edit}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    trdTemplateInfoList.map(template => {
                                        return (
                                            <Option key={template.trdGiftItemID} value={template.trdGiftItemID}>
                                                {template.trdGiftName}
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        </FormItem>
                    )
                }
                {
                    SIMPLE_TRD_CHANNEL_IDS.includes(Number(channelID)) ? null : (
                        <FormItem
                            label='券模板或活动ID'
                            {...itemStyle}
                        >
                            <Input disabled={true} value={trdGiftItemID} />
                        </FormItem>
                    )
                }
            </div>
        )
    }
    render() {
        const {
            defaultChecked,
            loading,
            bindType,
        } = this.state;
        const edit = this.props.type === 'edit';
        return (
            <div ref={e => this.wrapperDOM = e}>
                <Spin spinning={loading}>
                    <FormItem
                        label='是否关联第三方券'
                        {...itemStyle}
                        required={false}
                    >
                        <Switch
                            checkedChildren="是"
                            unCheckedChildren="否"
                            checked={defaultChecked}
                            onChange={this.handleDefaultChecked}
                            disabled={edit}
                        />
                    </FormItem>
                    {
                        defaultChecked && (
                            <div>
                                <div
                                    style={{
                                        lineHeight: 1.5,
                                        margin: '20px 0 20px 34px',
                                    }}
                                    className={styles.logoGroupHeader}
                                >
                                    关联第三方礼品
                                </div>
                                <FormItem
                                    label="关联方式"
                                    {...itemStyle}
                                    required={false}
                                >
                                    <RadioGroup
                                        onChange={this.handleBindTypeChange}
                                        value={bindType}
                                        disabled={edit}
                                    >
                                        <Radio value={0}>关联第三方渠道</Radio>
                                        <Radio value={1}>创建微信优惠券</Radio>
                                    </RadioGroup>
                                </FormItem>
                                {
                                    bindType === 0 ? this.renderDefaultTrdForm()
                                    : this.renderWxCouponCreateForm()
                                }
                            </div>
                        )
                    }
                </Spin>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        accountInfo: state.user.get('accountInfo'),
        mpList: state.sale_giftInfoNew.get('mpList'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryUnbindCouponPromotion: opts => dispatch(queryUnbindCouponPromotion(opts)),
        fetchAllPromotionList: opts => dispatch(fetchAllPromotionListAC(opts)),
        queryWechatMpInfo: () => dispatch(queryWechatMpInfo()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    {withRef: true}
)(TrdTemplate)
