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
    Tooltip,
} from 'antd';
import { fetchData } from '../../../../helpers/util';
import GiftCfg from '../../../../constants/Gift';
import {
    fetchAllPromotionListAC,
    queryUnbindCouponPromotion,
} from '../../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    queryWechatMpInfo,
    queryWechatMpAndAppInfo,
} from '../../_action';
import PriceInput from '../../../SaleCenterNEW/common/PriceInput'
import styles from '../Crm.less';
import selfStyle from './selfStyle.less';
import GiftImagePath from './GiftImagePath';
import { axios } from '@hualala/platform-base';
import { axiosData } from '../../../../helpers/util';

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
    options.unshift({ value: '0', label: '立即生效' });
    return options;
})()

const otherChannelList = [
    {
        value: '10',
        label: '微信优惠券'
    },
    {
        value: '50',
        label: '微信支付商家券'
    }
]
const validateWayList = [
    {
        value: 'OFF_LINE',
        label: '出示二维码核销'
    },
    {
        value: 'MINI_PROGRAMS',
        label: '跳转小程序使用'
    },
    // {
    //     value: 'PAYMENT_CODE',
    //     label: '跳转微信付款码核销'
    // },
]

const joinWayList = [
    {
        value: '1',
        label: '公众号'
    },
    {
        value: '2',
        label: '小程序'
    },
]
// 代金券，兑换券和折扣券
const itemList = ['10', '21', '111']
class TrdTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultChecked: false,
            mpList: [], // 公众号
            mpAndAppList: [], // 公众号/小程序
            trdTemplateInfoList: [], // 第三方券模版
            channelIDStatus: true,
            mpIDStatus: true,
            trdGiftItemIDStatus: true,
            loading: false,
            color: 'COLOR_010',
            // 0 为把已创建的第三方券绑定到哗啦啦，1 为同步创建一张微信券
            bindType: 0,
            payType:1,//支付通道
            notice: undefined,
            type: FIX_TERM,
            fixedBeginTerm: '0',
            fixedTerm: undefined,
            logoUrl: '',
            beginTimestamp: undefined,
            endTimestamp: undefined,
            appID: undefined,
            brandName: undefined,
            trdChannelID: '10',
            validateWay: 'OFF_LINE',
            settleId: '',
            masterMerchantID: '',
            appsList: [],
            linksList: [],
            payChannelList: [],
            channelCode: '',//选择支付通道
            mpType:'',//绑定公众号或者小程序
        };
        this.wrapperDOM = null;
    }
    componentDidMount() {
        let channelID = undefined;
        // 编辑
        if (this.props.data) {
            this.propsChange(this.props.data)
            if (this.props.data.trdTemplateInfo) {
                const trdTemplateInfo = JSON.parse(this.props.data.trdTemplateInfo)
                const { merchantInfo, validMiniProgramsInfo, miniProgramsInfo } = trdTemplateInfo
                if (merchantInfo) {
                    trdTemplateInfo.settleId = merchantInfo.settleId
                }
                if (validMiniProgramsInfo) {
                    trdTemplateInfo.miniProgramsAppId1 = validMiniProgramsInfo.miniProgramsAppId
                    trdTemplateInfo.miniProgramsPath1 = validMiniProgramsInfo.miniProgramsPath
                }
                if (miniProgramsInfo) {
                    trdTemplateInfo.miniProgramsAppId2 = miniProgramsInfo.miniProgramsAppId
                    trdTemplateInfo.miniProgramsPath2 = miniProgramsInfo.miniProgramsPath
                    trdTemplateInfo.entranceWords = miniProgramsInfo.entranceWords
                }
                if (trdTemplateInfo.trdChannelID === '50') {
                    this.getMiniProgramsAppIdList()
                    this.getlinks()
                    this.getPayChannel()
                }
                this.setState({
                    defaultChecked: true,
                    bindType: 1,
                    ...trdTemplateInfo
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

        this.props.queryWechatMpAndAppInfo()
        const mpAndAppList = this.props.mpAndAppList ? this.props.mpAndAppList : []

        this.setState({ mpList: mpList || [], mpAndAppList: mpAndAppList || [] })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mpList !== nextProps.mpList) {
            const mpList = nextProps.mpList.toJS()
            this.setState({ mpList: mpList || [] })
        }
        if (this.props.mpAndAppList !== nextProps.mpAndAppList) {
            const mpAndAppList = nextProps.mpAndAppList || []
            this.setState({ mpAndAppList: mpAndAppList || [] })
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
            const { giftItemId } = this.props
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
                trdChannelID,
                maxAmount,
                quantity,
                maxCanRecvCount,
                validateWay,
                joinWay,
                settleId,
                channelCode,
                masterMerchantID,
                miniProgramsAppId1,
                miniProgramsPath1,
                miniProgramsAppId2,
                miniProgramsPath2,
                entranceWords,
                payChannelList,
                mpType
            } = this.state;
            console.log(this.state,'thisstate===============0000000000000')
            if (!mpID) TrdTemplateStatus = false;
            if (!notice || notice.length > 16) TrdTemplateStatus = false;
            if (!logoUrl) TrdTemplateStatus = false;
            if (type === FIX_TERM) {
                !(fixedTerm > 0) && (TrdTemplateStatus = false)
            } else {
                if (!beginTimestamp || !endTimestamp) TrdTemplateStatus = false
            }
            if (itemList.includes(giftItemId)) {
                // 通过隐藏的校验
                if (trdChannelID === '50') {
                    TrdTemplateStatus = true;
                    let checkList = [mpID, maxCanRecvCount, settleId]
                    const currentMerchant = payChannelList.find(v => v.settleID === settleId)
                    const jsonData = {
                        appID,
                        trdChannelID,
                        mpID,
                        type,
                        mpType,
                        validateWay,
                        joinWay,
                        maxCanRecvCount,
                        merchantInfo: {
                            merchantID: currentMerchant ? currentMerchant.merchantID : '',
                            settleId,
                            masterMerchantID,
                            channelCode
                        }
                    }
                    if (giftItemId === '10') {
                        checkList.push(maxAmount)
                        jsonData.maxAmount = maxAmount
                        //总预算金额修改为总发放数,以上参数保留兼容之前
                        checkList.push(quantity)
                        jsonData.quantity = quantity
                    } else {
                        checkList.push(quantity)
                        jsonData.quantity = quantity
                    }

                    if (validateWay === 'MINI_PROGRAMS') {
                        checkList = checkList.concat(miniProgramsAppId1, miniProgramsPath1)
                        jsonData.validMiniProgramsInfo = {
                            miniProgramsAppId: miniProgramsAppId1,
                            miniProgramsPath: miniProgramsPath1
                        }
                    }
                    if (joinWay == '2') {
                        checkList = checkList.concat(miniProgramsAppId2, miniProgramsPath2, entranceWords)
                        jsonData.miniProgramsInfo = {
                            miniProgramsAppId: miniProgramsAppId2,
                            miniProgramsPath: miniProgramsPath2,
                            entranceWords
                        }
                    }
                    if (type === FIX_TERM) {
                        checkList = checkList.concat(fixedBeginTerm, fixedTerm)
                        jsonData.fixedBeginTerm = fixedBeginTerm
                        jsonData.fixedTerm = fixedTerm
                    }
                    if (type === FIX_TIME_RANGE) {
                        checkList = checkList.concat(beginTimestamp, endTimestamp)
                        jsonData.beginTimestamp = beginTimestamp
                        jsonData.endTimestamp = endTimestamp
                    }
                    if (checkList.filter(v => !v).length) {
                        // TrdTemplateStatus = false
                    }
                    // console.log('checkList',checkList,TrdTemplateStatus)

                    this.props.onChange(defaultChecked ? {
                        TrdTemplateStatus,
                        trdTemplateInfo: JSON.stringify(jsonData)
                    } : undefined)
                    // console.log('jsonData',jsonData)
                    return
                }
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
                    trdChannelID: itemList.includes(giftItemId) ? trdChannelID : undefined
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
        }, null, { path: 'trdTemplateInfoList' }).then((rawList) => {
            const trdTemplateInfoList = []
            if (Array.isArray(rawList)) {
                rawList.forEach(item => {
                    const entity = { ...item };
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
        });
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
            this.queryTrdTemplate(value, mpAccount ? mpAccount.appID : undefined, 10) // 带着微信号查模板
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
    //选择支付通道
    handlePayTypeChange = ({ target: { value } }) => {
        console.log(value,'===========paytype')
        this.getPayChannel(value);
        this.setState({ payType: value }, () => {
            this.propsChange()
        })
    }
    // 正向绑定微信ID选择
    handleMpAndAppIDChange = (value) => {
        const mpInfo = this.state.mpAndAppList.find(item => item.appID === value) || {};
        console.log(mpInfo,'绑定公众号/小程=================')
        this.setState({
            mpID: mpInfo.mpID || '',
            appID: value,
            brandName: mpInfo.mpName,
            mpType:mpInfo.mpType
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
    handleTrdChannelIDChange = (value) => {
        if (value === '50') {
            this.getMiniProgramsAppIdList()
            this.getlinks()
            this.getPayChannel()
        }
        this.setState({ trdChannelID: value }, () => {
            this.propsChange()
        })
    }
    handlePriceInputChange = (key) => (value) => {
        this.setState({ [key]: value.number }, () => {
            this.propsChange()
        })
    }
    handleSelectChange = (key) => (value) => {
        if (key === 'validateWay' && value !== 'MINI_PROGRAMS') {
            this.setState({
                miniProgramsAppId1: '',
                miniProgramsPath1: ''
            })
        }
        if (key === 'joinWay' && value !== '2') {
            this.setState({
                miniProgramsAppId2: '',
                miniProgramsPath2: '',
                entranceWords: ''
            })
        }
        if (key === 'settleId') {
            let { payChannelList } = this.state
            let [{ masterMerchantID = '' }] = payChannelList.filter((item) => value == item.settleID)
            this.setState({ masterMerchantID })
        }
        this.setState({ [key]: value }, () => {
            this.propsChange()
        })
    }
    getMiniProgramsAppIdList = () => {
        axiosData('/miniProgramCodeManage/getApps', {
            groupID: this.props.accountInfo.toJS().groupID,
            page: {
                "current": 1,
                "pageSize": 10000000,
            }
        }, null, {
            path: '',
        }, 'HTTP_SERVICE_URL_WECHAT')
            .then((res) => {
                const { result, apps } = res
                const code = (result || {}).code
                if (code === '000') {
                    this.setState({
                        appsList: apps || []
                    })
                }
            })
    }
    getlinks = () => {
        axiosData('/link/getlinks', {
            type: 'mini_menu_type',
        }, null, {
            path: '',
        }, 'HTTP_SERVICE_URL_WECHAT')
            .then((res) => {
                const { result, linkList } = res
                const code = (result || {}).code
                if (code === '000') {
                    this.setState({
                        linksList: linkList || []
                    })
                }
            })
    }
    /**
     * 新增支持选择不同支付通道，筛选不同的账务主体 参数：channelCode：hualalaAinong（哗啦啦微信支付）、wechat（商户微信支付）
     * @memberof TrdTemplate
     */
    getPayChannel = (type) => {
        const {payType} = this.state;
        const pType = type ? type : payType;
        console.log(pType,'type88888888888')
        
        let channelCode = '';
        if(pType == '1'){
            channelCode = 'hualalaAinong';
        }
        if(pType == '2'){
            channelCode = 'wechat';
        }
        console.log(channelCode,'channelCode---------------')
        this.setState({
            channelCode: channelCode
        })
        axiosData('/wxpay/getPayChannelByGroupID', {
            'groupID':this.props.accountInfo.toJS().groupID,
            'channelCode':channelCode
        }, null, {
            path: '',
        }, 'HTTP_SERVICE_URL_ISV_API')
            .then((res) => {
                const { result, payChannelList } = res
                console.log(payChannelList,'payChannelList-----------------')
                const code = (result || {}).code
                if (code === '000') {
                    this.setState({
                        payChannelList: payChannelList || []
                    })
                }
            })
    }
    checkMaxAmount = () => {
        const { maxAmount } = this.state

        if (maxAmount < 0.01 || maxAmount > 100000000) {
            return {
                status: false,
                msg: '请输入0.01～100000000之间的数字，支持两位小数'
            }
        }
        if (!maxAmount) {
            return {
                status: false,
                msg: '请输入总发放数'
            }
        }
        return {
            status: true,
            msg: ''
        }
    }
    checkQuantity = () => {
        const { quantity } = this.state

        if (quantity < 1 || quantity > 1000000000) {
            return {
                status: false,
                msg: '请输入大于0的8位以内整数'
            }
        }
        if (!quantity) {
            return {
                status: false,
                msg: '请输入总发放数量'
            }
        }
        return {
            status: true,
            msg: ''
        }
    }
    checkMaxCanRecvCount = () => {
        const { maxCanRecvCount } = this.state
        if (maxCanRecvCount < 1 || maxCanRecvCount > 100) {
            return {
                status: false,
                msg: '请输入1～100之间的整数'
            }
        }
        if (!maxCanRecvCount) {
            return {
                status: false,
                msg: '请输入用户最大可领个数'
            }
        }
        return {
            status: true,
            msg: ''
        }
    }
    handleEntranceWordsChange = (e) => {
        this.setState({ entranceWords: e.target.value }, () => {
            this.propsChange()
        })
    }
    renderMiniPrograms = (type) => {
        const { appsList, linksList } = this.state
        const edit = this.props.type === 'edit';
        const miniProgramsAppId = this.state[`miniProgramsAppId${type}`]
        const miniProgramsPath = this.state[`miniProgramsPath${type}`]
        return (
            <div>
                <FormItem
                    label='小程序名称'
                    validateStatus={miniProgramsAppId ? 'success' : 'error'}
                    help={miniProgramsAppId ? null : '请选择小程序名称'}
                    {...itemStyle}
                >
                    <Select value={miniProgramsAppId}
                        onChange={this.handleSelectChange(`miniProgramsAppId${type}`)}
                        disabled={edit}
                        getPopupContainer={(node) => node.parentNode}
                        placeholder="请选择小程序名称"
                    >
                        {
                            appsList.map(mp => {
                                return <Option key={mp.appID} value={mp.appID}>{mp.nickName}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                <FormItem
                    label='页面路径'
                    {...itemStyle}
                    validateStatus={miniProgramsPath ? 'success' : 'error'}
                    help={miniProgramsPath ? null : '请选择页面路径'}
                >
                    <Select value={miniProgramsPath}
                        onChange={this.handleSelectChange(`miniProgramsPath${type}`)}
                        disabled={edit}
                        getPopupContainer={(node) => node.parentNode}
                        placeholder="请选择页面路径"
                    >
                        {
                            linksList.map(mp => {
                                const data = mp.value || {}
                                return <Option key={data.urlTpl} value={data.urlTpl}>{data.title}</Option>
                            })
                        }
                    </Select>
                </FormItem>
            </div>
        )
    }
    wxPayShopCoupon = () => {
        const { giftItemId } = this.props
        const {
            mpList,
            mpAndAppList,
            mpID,
            appID,
            color,
            notice,
            logoUrl,
            fixedBeginTerm,
            fixedTerm,
            beginTimestamp,
            endTimestamp,
            type, // 微信
            payType,//支付通道
            trdChannelID,
            maxAmount,// 总预算金额
            quantity, //发放总数量
            maxCanRecvCount, // 用户最大可用数
            validateWay, // 核销方式
            joinWay,
            settleId, // 账务主体
            entranceWords,
            payChannelList
        } = this.state;
        const edit = this.props.type === 'edit';
        // 何时生效禁用
        const fixedBeginTermAbleList = ['代金券', '折扣券', '菜品兑换券']
        const fixedBeginTermAble = fixedBeginTermAbleList.includes(this.props.describe)
        const styleColor = AVAILABLE_WECHAT_COLORS.find(item => item.value === color).styleValue;
        const isNoticeLengthAllowed = (notice || '').length > 0 && (notice || '').length <= 16

        let mpTitle = (
            <span>
                <span>绑定公众号/小程序</span>
                <Tooltip title={(
                    <p>用于微信发券并获取用户信息后，给用户发哗啦啦的券，否则用户只能在卡包看到券，无法在公众号/小程序的个人中心看到券</p>
                )}>
                    <Icon style={{ marginLeft: 5, marginRight: 5 }} type="question-circle" />
                </Tooltip>
            </span>
        )
        return (
            <div>
                <FormItem
                    label="请选择支付通道"
                    {...itemStyle}
                    required={true}
                >
                    <RadioGroup
                        onChange={this.handlePayTypeChange}
                        value={payType}
                        disabled={edit}
                    >
                        <Radio value={1}>哗啦啦微信支付</Radio>
                        <Radio value={2}>商户微信支付</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label={mpTitle}
                    {...itemStyle}
                    validateStatus={appID ? 'success' : 'error'}
                    help={appID ? null : '请选择公众号'}
                >
                    <Select value={appID}
                        onChange={this.handleMpAndAppIDChange}
                        disabled={edit}
                        getPopupContainer={(node) => node.parentNode}
                        placeholder="请选择公众号"
                    >
                        {
                            mpAndAppList.map(mp => {
                                return <Option key={mp.appID} value={mp.appID}>{mp.mpName}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                <FormItem
                    label='账务主体'
                    {...itemStyle}
                    validateStatus={settleId ? 'success' : 'error'}
                    help={settleId ? null : '请选择商家券发放账务主体'}
                >
                    <Select value={settleId}
                        onChange={this.handleSelectChange('settleId')}
                        disabled={edit}
                        getPopupContainer={(node) => node.parentNode}
                        placeholder="请选择商家券发放账务主体"
                    >
                        {
                            payChannelList.map((mp, i) => {
                                return <Option key={mp.settleID} value={mp.settleID}>{mp.settleName}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                {/* {giftItemId === '10' &&
                    <FormItem
                        label="总发放数"
                        {...itemStyle}
                        validateStatus={ this.checkMaxAmount().status ? 'success' : 'error'}
                        help={this.checkMaxAmount().msg}
                    >
                        <PriceInput
                            modal="float"
                            disabled={edit}
                            value={{number: maxAmount}}
                            onChange={this.handlePriceInputChange('maxAmount')}
                        />
                    </FormItem>
                } */}
                {(giftItemId === '10' || giftItemId === '21' || giftItemId === '111') &&
                    <FormItem
                        label="总发放数"
                        {...itemStyle}
                        validateStatus={this.checkQuantity().status ? 'success' : 'error'}
                        help={this.checkQuantity().msg}
                    >
                        <PriceInput
                            modal="int"
                            disabled={edit}
                            value={{ number: quantity }}
                            onChange={this.handlePriceInputChange('quantity')}
                        />
                    </FormItem>
                }

                <FormItem
                    label="用户最大可领个数"
                    {...itemStyle}
                    validateStatus={this.checkMaxCanRecvCount().status ? 'success' : 'error'}
                    help={this.checkMaxCanRecvCount().msg}
                >
                    <PriceInput
                        modal="int"
                        disabled={edit}
                        value={{ number: maxCanRecvCount }}
                        onChange={this.handlePriceInputChange('maxCanRecvCount')}
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
                            validateStatus={beginTimestamp ? 'success' : 'error'}
                            help={beginTimestamp ? null : '请选择固定有效期'}
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
                                // disabled={edit || fixedBeginTermAble}
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
                                value={{ number: fixedTerm }}
                                onChange={this.handleFixedTermChange}
                                placeholder="请设置有效天数"
                                addonAfter="天"
                                maxNum={5}
                            />
                        </FormItem>
                    )
                }
                <FormItem
                    label='核销方式'
                    {...itemStyle}
                >
                    <Select value={validateWay}
                        onChange={this.handleSelectChange('validateWay')}
                        disabled={edit}
                        getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            validateWayList.map(mp => {
                                return <Option key={mp.value} value={mp.value}>{mp.label}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                {validateWay === 'MINI_PROGRAMS' && (
                    this.renderMiniPrograms(1)
                )}

                <FormItem
                    label='自定义入口'
                    {...itemStyle}
                    required={false}
                >
                    <Select value={joinWay}
                        onChange={this.handleSelectChange('joinWay')}
                        disabled={edit}
                        getPopupContainer={(node) => node.parentNode}
                        placeholder="请选择配置自定义入口"
                    >
                        {
                            joinWayList.map(mp => {
                                return <Option key={mp.value} value={mp.value}>{mp.label}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                {
                    joinWay == '2' && (
                        <div>
                            <FormItem
                                label='标题'
                                validateStatus={entranceWords ? 'success' : 'error'}
                                help={entranceWords ? null : '请输入标题'}
                                {...itemStyle}
                            >
                                <Input value={entranceWords} onChange={this.handleEntranceWordsChange} />
                            </FormItem>
                            {this.renderMiniPrograms(2)}
                        </div>
                    )
                }

            </div>
        )
    }
    renderWxCouponCreateForm() {
        // 代金券id 为10 ，菜品兑换券为21，折扣券为111
        const { giftItemId } = this.props

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
            trdChannelID
        } = this.state;
        const edit = this.props.type === 'edit';
        const styleColor = AVAILABLE_WECHAT_COLORS.find(item => item.value === color).styleValue;
        const isNoticeLengthAllowed = (notice || '').length > 0 && (notice || '').length <= 16
        const trdChannel = (
            <div>
                <FormItem
                    label='第三方渠道'
                    {...itemStyle}
                >
                    <Select value={trdChannelID}
                        onChange={this.handleTrdChannelIDChange}
                        disabled={edit}
                        getPopupContainer={(node) => node.parentNode}
                    >
                        {
                            otherChannelList.map(mp => {
                                return <Option key={mp.value} value={mp.value}>{mp.label}</Option>
                            })
                        }
                    </Select>
                </FormItem>
            </div>
        )

        const wxForm = (
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
                            {AVAILABLE_WECHAT_COLORS.map(({ value, styleValue }) => (
                                <div
                                    key={value}
                                    onClick={edit ? null : () => this.handleColorChange(value)}
                                    className={selfStyle.colorBlock}
                                    style={{ background: styleValue }}
                                >
                                    {value === color && (
                                        <Icon style={{ fontSize: 14, color: '#fff' }} type="check" />
                                    )}
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
                    label='礼品logo图'
                    {...itemStyle}
                    validateStatus={logoUrl ? 'success' : 'error'}
                    help={logoUrl ? null : '请上传礼品logo图'}
                    style={{ position: 'relative' }}
                >
                    <GiftImagePath
                        disabled={edit}
                        wrapperHeight={240}
                        limit={1024}
                        hint="图片建议尺寸：300像素 x 300像素，大小不超过1MB"
                        hasSize={true}
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
                                value={{ number: fixedTerm }}
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

        const wxPayShopCoupon = this.wxPayShopCoupon(trdChannelID)

        const elementList = [wxForm]
        if (itemList.includes(String(giftItemId))) {
            elementList.splice(0, 0, trdChannel)
            if (trdChannelID === '50') {
                elementList.splice(1, 1, wxPayShopCoupon)
            }
        }

        return (
            elementList.map(v => v)
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
        const { type } = this.props

        const edit = type === 'edit';
        const { giftItemId } = this.props

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
                                        <Radio value={1}>{itemList.includes(String(giftItemId)) ? '同步创建三方券' : '创建微信优惠券'}</Radio>
                                    </RadioGroup>
                                    {
                                        bindType === 0 ? (
                                            <Icon type="question-circle-o" />
                                        ) : (
                                                <Tooltip
                                                    title="同步后，需要等待微信审核，预计一个工作日，审核通过后才能领取"
                                                >
                                                    <Icon style={{ color: '#379ff1' }} type="question-circle-o" />
                                                </Tooltip>
                                            )
                                    }
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
        mpAndAppList: state.sale_giftInfoNew.get('mpAndAppList').toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryUnbindCouponPromotion: opts => dispatch(queryUnbindCouponPromotion(opts)),
        fetchAllPromotionList: opts => dispatch(fetchAllPromotionListAC(opts)),
        queryWechatMpInfo: () => dispatch(queryWechatMpInfo()),
        queryWechatMpAndAppInfo: () => dispatch(queryWechatMpAndAppInfo()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
)(TrdTemplate)
