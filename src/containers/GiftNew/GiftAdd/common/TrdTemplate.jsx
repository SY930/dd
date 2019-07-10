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
        value: 'Color010',
        styleValue: '#63B359',
    },
    {
        value: 'Color020',
        styleValue: '#2C9F67',
    },
    {
        value: 'Color030',
        styleValue: '#509FC9',
    },
    {
        value: 'Color040',
        styleValue: '#5885CF',
    },
    {
        value: 'Color050',
        styleValue: '#9062C0',
    },
    {
        value: 'Color060',
        styleValue: '#D09A45',
    },
    {
        value: 'Color070',
        styleValue: '#E4B138',
    },
    {
        value: 'Color080',
        styleValue: '#EE903C',
    },
    {
        value: 'Color090',
        styleValue: '#DD6549',
    },
    {
        value: 'Color100',
        styleValue: '#CC463D',
    },
]
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
            color: 'Color010',
            bindType: 0,
            notice: undefined,
            type: FIX_TERM,
            fixedBeginTerm: '0',
            fixedTerm: undefined,
            logoUrl: '',
        };
    }
    componentDidMount() {
        let channelID = undefined;
        // 编辑
        if (this.props.data) {
            this.propsChange(this.props.data)
            const { extraInfo, trdChannelID, trdTemplateID } = this.props.data
            const { wechatMpName, trdTemplateIDLabel } = JSON.parse(extraInfo);
            channelID = trdChannelID
            this.setState({
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
        // 公众号
        const mpList = this.props.mpList.toJS()
        mpList.length === 0 ? this.props.queryWechatMpInfo() : null
        this.setState({ mpList: mpList || [] })
        // 活动券新增时请求channelID: 1的未绑定过的基础营销活动，编辑时请求channelID: 用户已选择的
        this.props.describe === '活动券' && this.props.queryUnbindCouponPromotion({ channelID: channelID ? channelID : 1 })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mpList !== nextProps.mpList) {
            const mpList = nextProps.mpList.toJS()
            this.setState({ mpList: mpList || [] })
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
        this.validatorTemp().then((TrdTemplateStatus) => {
            const { defaultChecked, channelID: trdChannelID, trdTemplateInfoList, trdGiftItemID: trdTemplateID, mpList, mpID } = this.state
            const wechatMpName = mpID ? mpList.find(mp => mp.mpID === mpID).mpName : undefined;
            const trdTemplateEntity = trdTemplateInfoList.find(template => template.trdGiftItemID === trdTemplateID);
            const trdTemplateIDLabel = trdTemplateEntity ? trdTemplateEntity.trdGiftName : undefined
            const values = {
                TrdTemplateStatus,
                extraInfo: JSON.stringify({ wechatMpName, trdTemplateIDLabel }),
                validityDays: trdTemplateEntity.validityDays || 0,
                effectTime: trdTemplateEntity.startDate || '',
                trdChannelID,
                trdTemplateID,
            }
            this.props.onChange(defaultChecked ? values : undefined)
        })
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
        this.setState({ bindType: value })
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

    // 微信号选择
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
    renderWxCouponCreateForm() {
        const {
            mpList,
            mpID,
            mpIDStatus,
            color,
            notice,
            logoUrl,
            type, // 微信
        } = this.state;
        const edit = this.props.type === 'edit';
        const styleColor = AVAILABLE_WECHAT_COLORS.find(item => item.value === color).styleValue
        return (
            <div>
                <FormItem
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
                                return <Option value={mp.mpID}>{mp.mpName}</Option>
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
                                    onClick={() => this.handleColorChange(value)}
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
                        <div className={selfStyle.smallColorBlockWrapper}>
                            <div
                                className={selfStyle.smallColorBlock}
                                style={{ background: styleColor }}
                            />
                        </div>
                    </Popover>
                </FormItem>
                {/* <Icon className={style.checkIcon} type="check" /> */}
                <FormItem
                    label='操作提示'
                    {...itemStyle}
                    style={{ position: 'relative' }}
                >
                    <Input
                        value={notice}
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
                    style={{ position: 'relative' }}
                >
                    <GiftImagePath
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
                    <RadioGroup onChange={this.handleTimeTypeChange} value={type}>
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
                            <RangePicker format="YYYY-MM-DD" disabledDate={
                                (current) => current && current.format('YYYYMMDD') < moment().format('YYYYMMDD')
                            } />
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
                            <Select value={mpID}
                                    onChange={this.handleMpSelect}
                                    disabled={edit}
                                    getPopupContainer={(node) => node.parentNode}
                            >
                                {
                                    mpList.map(mp => {
                                        return <Option value={mp.mpID}>{mp.mpName}</Option>
                                    })
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
                        >
                            <PriceInput
                                modal="int"
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
                    <Select value={channelID}
                            onChange={this.handleTrdChannelSelect}
                            disabled={edit}
                            getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            GiftCfg.trdChannelIDs.map(trdChannel => {
                                return <Option value={trdChannel.value}>{trdChannel.label}</Option>
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
                                        return <Option value={mp.mpID}>{mp.mpName}</Option>
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
                                        return <Option value={template.trdGiftItemID}>{template.trdGiftName}</Option>
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
            channelID = 10,
            mpList,
            mpID,
            trdTemplateInfoList,
            trdGiftItemID,
            channelIDStatus,
            mpIDStatus,
            trdGiftItemIDStatus,
            loading,
            bindType,
        } = this.state;
        const edit = this.props.type === 'edit';
        return (
            <div>
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
                                    <RadioGroup onChange={this.handleBindTypeChange} value={bindType}>
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
    mapDispatchToProps
)(TrdTemplate)
