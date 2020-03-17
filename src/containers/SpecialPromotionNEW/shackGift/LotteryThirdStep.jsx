import React from 'react';
import { Button, Icon, Tabs, message } from 'antd';
import PrizeContent from './PrizeContent';
import style from './LotteryThirdStep.less'
import { deflate } from 'zlib';
import {
    defaultData,
    getDefaultGiftData,
    defaultGiveRedPacket,
    defaultGivePoints,
    defaultGiveCoupon,
    defalutDisArr,
} from './defaultCommonData';
import _ from 'lodash';
import { connect } from 'react-redux';
import { addSpecialPromotion, updateSpecialPromotion, saleCenterLotteryLevelPrizeData, saleCenterSetSpecialBasicInfoAC, saleCenterSetSpecialGiftInfoAC, } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    UpdateGiftLevel,
} from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
    SALE_CENTER_GIFT_EFFICT_DAY,
} from '../../../redux/actions/saleCenterNEW/types';
import { axiosData } from '../../../helpers/util';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';
import { getTicketBagInfo } from './TicketBag/AxiosFactory';

const moment = require('moment');
const { TabPane } = Tabs;
const TabNum = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
@injectIntl
class LotteryThirdStep extends React.Component {
    constructor (props) {
        super(props);
        const {
            infos,
        } = this.initState();
        this.state = {
            activeKey: '0',
            infos,
            giftInfo: [],
            giftTreeData: [],
            disArr: defalutDisArr,
            cardTypeArr: [],
            redPackets: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.promotionDetailInfo.getIn(['$giftInfo', 'initialized'])) {
            let giftInfo;
            try {
                giftInfo = nextProps.promotionDetailInfo.getIn(['$giftInfo', 'data']).toJS()
                    .filter(giftTypes => giftTypes.giftType < 90 || (giftTypes.giftType == '110') || (giftTypes.giftType == '111'));
            } catch (err) {
                giftInfo = [];
            }
            this.setState({
                giftTreeData: this.proGiftTreeData(giftInfo),
                giftInfo,
            });
        }
    }

    componentDidMount(){
        const { fetchGiftListInfoAC, user } = this.props;
        this.props.getSubmitFn({
            prev: undefined,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined,
        });
        fetchGiftListInfoAC({
            groupID: user.accountInfo.groupID,
        })
        let opts = {
            groupID: user.accountInfo.groupID,
        }
        this.fetchCardType({opts});
        this.queryRedPackets();
    }

    fetchCardType = (opts) => {
        axiosData(
            '/crm/cardTypeLevelService_queryCardTypeBaseInfoList.ajax',
            { ...opts, isNeedWechatCardTypeInfo: true },
            null,
            {path: 'data.cardTypeBaseInfoList',}
        ).then((records) => {
            this.setState({
                cardTypeArr: records || []
            })
        });
    }
    queryRedPackets = () => {
        axiosData(
            '/coupon/couponService_getBoards.ajax',
            { giftType: '113', pageNo: 1, pageSize: 10000 },
            null,
            {path: 'data.crmGiftList',},
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then((records) => {
            this.setState({
                redPackets: records || []
            })
        });
    }

     /**
     * 对从接口拿来的gifts数据 整合为infos数据
     * @date 2019-10-16
     * @returns {any}
     */
    initState = () => {
        const { isNew } = this.props;
        const giftInfo = this.getOrganize(this.props.levelPrize ? this.props.levelPrize.toJS() : []);
        let infos = [getDefaultGiftData()];
        if(!isNew){
            giftInfo.forEach((gift, index) => {
                if (infos[index] !== undefined) {
                    infos[index].sendType = gift.sendType || 0;
                    infos[index].recommendType = gift.recommendType || 0;
                } else {
                    const typePropertyName = 'sendType'
                    const typeValue = gift.sendType;
                    infos[index] = getDefaultGiftData(typeValue, typePropertyName);
                }
                if(gift.presentType === 4){
                    const { user } = this.props;
                    const params = {couponPackageID: gift.giftID, groupID: user.accountInfo.groupID, isNeedDetailInfo: true };
                    getTicketBagInfo(params).then(detail=>{
                        const { couponPackageInfo: info } = detail;
                        infos[index].giveCoupon.value.isOn = true;
                        infos[index].giveCoupon.value.item = info;
                        infos[index].giveCoupon.value.typeValue = '1';
                    });
                }
                //与优惠券相关的，在与优惠券相关的数据都有值的时候才进行赋值，否则初始化为空
                if(gift.giftTotalCount && gift.giftName && gift.giftID){
                    //有效期限 如果为小时是 1 如果为天是 3 如果是固定有效期是 2
                    infos[index].giveCoupon.value.effectType = `${gift.effectType}`;
                    //在相对有效期被选中的情况下，的维持有效时间 。在固定有效期的时候这个值为0
                    infos[index].giveCoupon.value.giftValidDays.value = gift.giftValidUntilDayCount;
                    //生效时间类型： 按小时 还是 按天。
                    infos[index].giveCoupon.value.dependType = gift.effectType == '3' ? '3' : '1';
                    // 礼品生效时间
                    infos[index].giveCoupon.value.giftEffectiveTime.value= gift.effectType != '2' ? gift.giftEffectTimeHours
                        : [moment(gift.effectTime, 'YYYYMMDD'), moment(gift.validUntilDate, 'YYYYMMDD')];
                    //礼品总数
                    infos[index].giveCoupon.value.giftCount.value = gift.giftTotalCount;
                    //优惠券信息 优惠券名称、id等
                    infos[index].giveCoupon.value.giftInfo.giftName = gift.giftName;
                    infos[index].giveCoupon.value.giftInfo.giftItemID = gift.giftID;
                }else{
                    infos[index].giveCoupon.value = _.cloneDeep(defaultGiveCoupon);
                    infos[index].giveCoupon.value.isOn = false;
                }
                //与赠送积分相关的，在与赠送积分相关的数据都有值的时候才进行赋值，否则初始化为空
                if(gift.cardTypeID && gift.presentValue){
                    infos[index].givePoints.value = _.cloneDeep(defaultGivePoints);
                    //充值到会员卡的卡类型id
                    infos[index].givePoints.value.card.value = gift.cardTypeID;
                    //赠送积分
                    infos[index].givePoints.value.givePointsValue.value = gift.presentValue;
                } else {
                    infos[index].givePoints.value = {};
                }
                // 红包相关
                if (gift.redPacketID && gift.redPacketValue) {
                    infos[index].giveRedPacket = _.cloneDeep(defaultGiveRedPacket);
                    infos[index].giveRedPacket.redPacketID.value = gift.redPacketID;
                    infos[index].giveRedPacket.redPacketValue.value = gift.redPacketValue;
                    infos[index].giveRedPacket.isOn = true;
                } else {
                    infos[index].giveRedPacket.isOn = false;
                }
                infos[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            })
        }
        return {
            infos: infos.filter(gift => gift.sendType === 0)
            .sort((a, b) => a.needCount - b.needCount),
        };
    }

    /**
     * 对于礼品的后端来的拆分数据（拆分了同一数据的积分和优惠券 进行整合）
     * @date 2019-10-24
     * @param {any} prizeArr
     * @returns {any}
     */
    getOrganize = (prizeArr) =>{
        let temparr = [];
        if(!prizeArr.length){
            return prizeArr;
        }else{
            prizeArr.map((item, index) => {
                if(index == 0){
                    temparr.push(item.presentType === 3 ? ({...item, redPacketID: item.giftID, redPacketValue: item.presentValue }) : item);
                }else{
                    let flag = true;
                    temparr.map((every,num) => {
                        if(every.sortIndex == item.sortIndex){
                            flag = false
                            //进行合并
                            if(item.presentType == 1){
                                temparr[num].effectType = item.effectType;
                                temparr[num].giftValidUntilDayCount = item.giftValidUntilDayCount;
                                if(item.effectType != '2'){
                                    temparr[num].giftEffectTimeHours = item.giftEffectTimeHours;
                                }else{
                                    temparr[num].effectTime = item.effectTime;
                                    temparr[num].validUntilDate = item.validUntilDate;
                                }
                                temparr[num].giftTotalCount = item.giftTotalCount;
                                temparr[num].giftName = item.giftName;
                                temparr[num].giftID = item.giftID;
                            }else if (item.presentType == 2){
                                temparr[num].cardTypeID = item.cardTypeID;
                                temparr[num].presentValue = item.presentValue;
                            } else if (item.presentType == 3){
                                temparr[num].redPacketID = item.giftID;
                                temparr[num].redPacketValue = item.presentValue;
                            } else if (item.presentType == 4){
                                temparr[num].couponPackageID = item.giftID;
                            }
                        }
                    });
                    if(flag){
                        temparr.push(item.presentType === 3 ? ({...item, redPacketID: item.giftID, redPacketValue: item.presentValue }) : item);
                    }
                }
            })
            return temparr;
        }
    }

    handleGiftChange = (value, index) => {
        if (value) {
            const newValue = value.split(',');
            const _infos = this.state.infos;
            _infos[index].giveCoupon.value.giftInfo.giftItemID = newValue[0];
            _infos[index].giveCoupon.value.giftInfo.giftName = newValue[1];
            _infos[index].giveCoupon.value.giftInfo.validateStatus = 'success';
            _infos[index].giveCoupon.value.giftInfo.msg = null;
            this.setState({
                infos: _infos,
            });
        } else {
            const _infos = this.state.infos;
            _infos[index].giveCoupon.value.giftInfo.giftName = null;
            _infos[index].giveCoupon.value.giftInfo.giftItemID = null;
            _infos[index].giveCoupon.value.giftInfo.validateStatus = 'error';
            _infos[index].giveCoupon.value.giftInfo.msg = `${this.props.intl.formatMessage(STRING_SPE.d16hffkc88d3164)}`;
            this.setState({
                infos: _infos,
            });
        };
        const { disArr = [] } = this.state;
        disArr.map((v, i) => disArr[i] = false)
        disArr[index] = false;
        this.setState({ disArr });
    }
    // 类型改变
    handleValidateTypeChange = (e, index) => {
        const _infos = this.state.infos;
        _infos[index].giveCoupon.value.effectType = e.target.value;
        if(e.target.value == '1'){
            //切到了相对有效期，滞空固定有效期的数据
        }else{
            //切到了固定有效期，滞空相对有效期
            _infos[index].giveCoupon.value.dependType = '1';
            _infos[index].giveCoupon.value.giftValidDays = {
                value: '',
                validateStatus: 'success',
                msg: null,
            };

        }
        this.setState({
            infos: _infos,
        });
    }

    /**
     * 更改赠送积分的infos[index]数据,与赠送优惠券的infos[index]数据联动。
     * @date 2019-10-17
     * @param {array} value
     * @param {num} index
     * @returns {void}
     */
    handleGivePointsChange = (value, index) => {
        const _infos = this.state.infos;
        if(JSON.stringify(_infos[index].givePoints.value) == "{}"){
            _infos[index].givePoints.value = _.cloneDeep(defaultGivePoints);
            _infos[index].giveCoupon.validateStatus = 'success';
            _infos[index].giveCoupon.msg = null;
        }else{
            //在取消勾选的情况下先校验是不是两个都为空，如果两个都为空则让赠送优惠券的提示显示出来
            if(!(_infos[index].giveCoupon.value.isOn) && !(_infos[index].giveRedPacket.isOn)){
                //优惠券为非选中状态
                _infos[index].giveCoupon.validateStatus = 'error';
                _infos[index].giveCoupon.msg = `${this.props.intl.formatMessage(STRING_SPE.d170137ab9b7044)}`;
            }else{
                //取消的时候如果优惠券是选中状态，则直接取消。
                _infos[index].giveCoupon.validateStatus = 'success';
                _infos[index].giveCoupon.msg = null;
            }
            _infos[index].givePoints.value = {}
        }
        this.setState({
            infos: _infos,
        });
    }
    handleGiveRedPacketChange = (value, index) => {
        const _infos = this.state.infos;
        if(!(_infos[index].giveRedPacket.isOn)){
            _infos[index].giveRedPacket = _.cloneDeep(defaultGiveRedPacket)
            _infos[index].giveRedPacket.isOn = true;
            _infos[index].giveCoupon.validateStatus = 'success';
            _infos[index].giveCoupon.msg = null;
        }else{
            //在取消勾选的情况下先校验是不是两个都为空，如果两个都为空则让赠送优惠券的提示显示出来
            if(!(_infos[index].giveCoupon.value.isOn) && JSON.stringify(_infos[index].givePoints.value) == "{}"){
                //优惠券为非选中状态
                _infos[index].giveCoupon.validateStatus = 'error';
                _infos[index].giveCoupon.msg = `${this.props.intl.formatMessage(STRING_SPE.d7elcdm04l714)}`;
            }else{
                //取消的时候如果优惠券是选中状态，则直接取消。
                _infos[index].giveCoupon.validateStatus = 'success';
                _infos[index].giveCoupon.msg = null;
            }
            _infos[index].giveRedPacket.isOn = false;
        }
        this.setState({
            infos: _infos,
        });
    }
    handleGiveCouponChange = (value, index) => {
        const _infos = this.state.infos;
        if(_infos[index].giveCoupon.value.isOn){
            //从开变成关的状态
            //先滞空giveCoupn的数据再把状态变为关
            _infos[index].giveCoupon.value = { isOn: false };
            if(JSON.stringify(_infos[index].givePoints.value) == "{}" && !(_infos[index].giveRedPacket.isOn)){
                _infos[index].giveCoupon.validateStatus = 'error';
                _infos[index].giveCoupon.msg = `${this.props.intl.formatMessage(STRING_SPE.d170137ab9b7044)}`;
            }else{
                _infos[index].giveCoupon.validateStatus = 'success';
                _infos[index].giveCoupon.msg = null;
            }
        }else{
            //从关变成开
            _infos[index].giveCoupon.value = _.cloneDeep(defaultGiveCoupon);
            _infos[index].giveCoupon.value.isOn = true;
            _infos[index].giveCoupon.validateStatus = 'success';
            _infos[index].giveCoupon.msg = null;
        }
        this.setState({
            infos: _infos,
        });
    }

    handleGivePointsValueChange = (value, index) => {
        const _infos = this.state.infos;
        _infos[index].givePoints.value.givePointsValue.value = value.number;
        const _value = parseFloat(value.number);
        if (_value > 0) {
            _infos[index].givePoints.value.givePointsValue.validateStatus = 'success';
            _infos[index].givePoints.value.givePointsValue.msg = null;
        } else {
            _infos[index].givePoints.value.givePointsValue.validateStatus = 'error';
            _infos[index].givePoints.value.givePointsValue.msg = `${this.props.intl.formatMessage(STRING_SPE.d2b1c7560ae71124)}`;
        }
        this.setState({
            infos: _infos,
        });
    }
    handleGiveRedPacketValueChange = (value, index) => {
        const redPacketObj = this.state.infos[index].giveRedPacket.redPacketValue;
        const _value = parseFloat(value.number || 0);
        redPacketObj.value = value.number;
        if (_value >= 1 && _value <= 200) {
            redPacketObj.validateStatus = 'success';
            redPacketObj.msg = null;
        } else {
            redPacketObj.validateStatus = 'error';
            redPacketObj.msg = `${this.props.intl.formatMessage(STRING_SPE.d16hljfel77133)}`;
        }
        this.setState({
            infos: this.state.infos.slice(),
        });
    }
    handleCardChange = (value, index) => {
        const _infos = this.state.infos;
        _infos[index].givePoints.value.card.value = value;
        const _value = value;
        if (_value) {
            _infos[index].givePoints.value.card.validateStatus = 'success';
            _infos[index].givePoints.value.card.msg = null;
        } else {
            _infos[index].givePoints.value.card.validateStatus = 'error';
            _infos[index].givePoints.value.card.msg = `${this.props.intl.formatMessage(STRING_SPE.d7h83ag6gb2224)}`;
        }
        this.setState({
            infos: _infos,
        });
    }
    handleGiveRedPacketIDChange = (value, index) => {
        const _infos = this.state.infos;
        _infos[index].giveRedPacket.redPacketID.value = value
        if (value) {
            _infos[index].giveRedPacket.redPacketID.validateStatus = 'success';
            _infos[index].giveRedPacket.redPacketID.msg = null;
        } else {
            _infos[index].giveRedPacket.redPacketID.validateStatus = 'error';
            _infos[index].giveRedPacket.redPacketID.msg = `${this.props.intl.formatMessage(STRING_SPE.d31f9aj936d0165)}`;
        }
        this.setState({
            infos: _infos,
        });
    }

    handleGiftValidDaysChange = (val, index) => {
        const _infos = this.state.infos;
        _infos[index].giveCoupon.value.giftValidDays.value = val.number;
        const _value = val.number || 0;
        if (_value > 0) {
            _infos[index].giveCoupon.value.giftValidDays.validateStatus = 'success';
            _infos[index].giveCoupon.value.giftValidDays.msg = null;
        } else {
            _infos[index].giveCoupon.value.giftValidDays.validateStatus = 'error';
            _infos[index].giveCoupon.value.giftValidDays.msg = `${this.props.intl.formatMessage(STRING_SPE.d142vrmqvd21186)}`;
        }
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    handleGiftOddsChange = (val, index) => {
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
        });
    }

    handleGiftEffectiveTimeChange = (val, index) => {
        const _infos = this.state.infos;
        _infos[index].giveCoupon.value.giftEffectiveTime.value = val;
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }
    onBagChange = (val, index) => {
        const _infos = this.state.infos;
        _infos[index].giveCoupon.value.item = val;
        this.setState({
            infos: _infos,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.infos);
        });
    }

    handleDependTypeChange = (val, index) =>{
        const _infos = this.state.infos;
        _infos[index].giveCoupon.value.dependType = val;
        _infos[index].giveCoupon.value.effectType = val;
        if(val == '3'){
            //点击到按天的时候把按天模式下的默认值设置为1天生效
            _infos[index].giveCoupon.value.giftEffectiveTime.value = '1';
        }else{
            //点击到按小时的时候把按小时模式下的默认值设置为立即生效
            _infos[index].giveCoupon.value.giftEffectiveTime.value = '0';
        }
        this.setState({
            infos: _infos,
        });
    }

     /**
      * 固定有效时间改变
      * @date 2019-10-22
      * @param {array} date
      * @param {string} dateString
      * @param {number} index
      * @returns {void}
      */
     handleRangePickerChange = (date, dateString, index) => {
        const _infos = this.state.infos;
        _infos[index].giveCoupon.value.giftEffectiveTime.value = date;
        _infos[index].giveCoupon.value.giftValidDays.value = 0;
        if (date === null || date === undefined || !date[0] || !date[1]) {
            _infos[index].giveCoupon.value.giftEffectiveTime.validateStatus = 'error';
            _infos[index].giveCoupon.value.giftEffectiveTime.msg = `${this.props.intl.formatMessage(STRING_SPE.db60a2a3892030168)}`;
        } else {
            _infos[index].giveCoupon.value.giftEffectiveTime.validateStatus = 'success';
            _infos[index].giveCoupon.value.giftEffectiveTime.msg = null;
        }
        this.setState({
            infos: _infos,
        });
    }

    proGiftTreeData = (giftTypes) => {
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

    /**
     * 在切换几等奖tab的时候，切换之前不用做校验 ,把当前的key设置为activekey
     * @date 2019-12-12
     * @param {any} targetKey
     * @returns {any}
     */
    onChange = (targetKey) => {
        // if(this.checkEveryDataVaild()){
            this.setState({
                activeKey: targetKey,
            });
        // }
    }

    /**
     * 对tab进行删除操作的时候，触发的方法。操作从infos状态
     * @date 2019-10-15
     * @param {string} targetKey
     * @param {string} action
     * @returns {void}
     */
    onEdit = (targetKey, action) => {
        const { infos, activeKey } = this.state;
        switch (action) {
            case 'remove' :
                infos.splice(+targetKey, 1);
                this.setState({
                    infos,
                    activeKey: activeKey === targetKey ? `${activeKey - 1}` : `${activeKey}`,
                })
                break;
            default:
                break;
        }
    }

    /**
     * 处理从props里拿到的获奖信息数组
     * @date 2019-10-14
     * @param {array} levelPrize
     * @returns {array}
     */
    getPaneArr = (infos) => {
        const { activeKey } = this.state;
        const { isNew, UpdateGiftLevel } = this.props;
        let panelArr = [];
        //新建逻辑
        if ( isNew && infos.length === 1 ) {
            panelArr.push({title: `1${this.props.intl.formatMessage(STRING_SPE.dd5aa2689df29246)}`, content: PrizeContent, key: '0' });
        } else {
            infos.map((item, index) => {
                if( index == activeKey){
                    panelArr.push({title: `${TabNum[index]}${this.props.intl.formatMessage(STRING_SPE.dd5aa2689df29246)}`, content: PrizeContent , key: `${index}`, });
                }else{
                    panelArr.push({title: `${TabNum[index]}${this.props.intl.formatMessage(STRING_SPE.dd5aa2689df29246)}`, content: PrizeContent , key: `${index}`, });
                }
            })
        }
        return panelArr;
    }

    /**
     * 增加中奖等级，最多有十个。
     * @date 2019-10-15
     * @returns {void}
     */
    handleAddLevelPrize = () => {
        const { infos } = this.state;
            if(this.checkEveryDataVaild()){
                if(infos.length >= 10){
                    message.warning(`${this.props.intl.formatMessage(STRING_SPE.d31f1376h88323)}`);
                    return;
                }
                infos.push({...JSON.parse(JSON.stringify(defaultData)), 'sendType': 0});
                this.setState({
                    activeKey: `${infos.length-1}`,
                    infos,
                })
            }
    }

    /**
     * 控制n个下拉列表 （优惠券名称）的显隐
     * @date 2019-10-22
     * @param {any} value
     * @param {any} index
     * @returns {any}
     */
    changeDisArr = (value,index) => {
        const { disArr = [] } = this.state;
        disArr[index] = false;
        this.setState({ disArr })
    }

    /**
     * 更改礼品数量
     * @date 2019-10-22
     * @param {object} value
     * @param {number} index
     * @returns {void}
     */
    handleGiftCountChange = (value, index) => {
        const _infos = this.state.infos;
        _infos[index].giveCoupon.value.giftCount.value = value.number;
        const _value = parseFloat(value.number);
        if (_value > 0) {
            _infos[index].giveCoupon.value.giftCount.validateStatus = 'success';
            _infos[index].giveCoupon.value.giftCount.msg = null;
        } else {
            _infos[index].giveCoupon.value.giftCount.validateStatus = 'error';
            _infos[index].giveCoupon.value.giftCount.msg = `${this.props.intl.formatMessage(STRING_SPE.d7ekp2h8kd3282)}`;
        }
        this.setState({
            infos: _infos,
        });
    }


    /**
     * 检验是否所有的显示出来的表单项是否都验证成功。每一次只检测info数组的当前index的数据因为，在切换和新建、提交的时候都要进行验证
     * 如果验证不成功的话，返回false，则进行的动作（切换和新建、提交）则会中断
     * @date 2019-10-22
     * @returns {boolean}
     */
    checkEveryDataVaild = () => {
        const { infos } = this.state;
        let tempResult = true;
        // 校验概率必填、加合不超过100%
        let sumOdds = 0;
        for (let idx = 0; idx < infos.length; idx++) {
            if(sumOdds> 100){
                if(tempResult){
                    tempResult = false;
                    message.error(`${this.props.intl.formatMessage(STRING_SPE.d16hh3e324g4131)}%`);
                }
            }else{
                if(!infos[idx].giftOdds.value){
                    tempResult = false;
                    this.handleGiftOddsChange({number: infos[idx].giftOdds.value}, idx);
                    this.setState({
                        activeKey: `${idx}`
                    })
                    return false;
                }
                sumOdds += +infos[idx].giftOdds.value;
                if(sumOdds > 100){
                    tempResult = false;
                    message.error(`${this.props.intl.formatMessage(STRING_SPE.d16hh3e324g4131)}%`);
                }
            }
        }
        // 校验校验每一等级必填
        for (let activeKey = 0; activeKey < infos.length; activeKey ++) {
            if (JSON.stringify(infos[activeKey].givePoints.value) === '{}' && !infos[activeKey].giveRedPacket.isOn
                && !infos[activeKey].giveCoupon.value.isOn) {
                    this.setState({
                        activeKey: `${activeKey}`
                    })
                    return false;
                }
            for(let i in infos[activeKey] ){
                switch(i){
                    case 'givePoints':
                        if(JSON.stringify(infos[activeKey].givePoints.value) != "{}"){
                            //赠送积分是勾选的要确认里面的内容是不是都合适
                            let tempobj = infos[activeKey].givePoints.value;
                            if(!(tempobj.givePointsValue.value > 0) || !tempobj.card.value ){
                                tempResult = false;
                                this.handleGivePointsValueChange({number: tempobj.givePointsValue.value}, activeKey);
                            }
                        }
                        break;
                    case 'giveRedPacket':
                        if(infos[activeKey].giveRedPacket.isOn){
                            //赠送积分是勾选的要确认里面的内容是不是都合适
                            let tempobj = infos[activeKey].giveRedPacket;
                            if(!(tempobj.redPacketValue.value >= 1 && tempobj.redPacketValue.value <= 200) || !tempobj.redPacketID.value ){
                                tempResult = false;
                                this.handleGiveRedPacketValueChange({number: tempobj.redPacketValue.value}, activeKey);
                                this.handleGiveRedPacketIDChange(tempobj.redPacketID.value, activeKey);
                            }
                        }
                        break;
                    case 'giveCoupon':
                            if(infos[activeKey].giveCoupon.value.isOn){
                                //优惠券是勾选的确认优惠券里面的内容
                                let tempobj = infos[activeKey].giveCoupon.value;
                                if(!tempobj.item){
                                    if(!tempobj.giftInfo.giftItemID || !tempobj.giftCount.value ){
                                        tempResult = false;
                                        this.handleGiftCountChange({number: tempobj.giftCount.value}, activeKey);
                                    }
                                    if(tempobj.effectType == '1' || tempobj.effectType == '3'){
                                        //按小时或者按天
                                        if(!tempobj.giftValidDays.value){
                                            tempResult = false;
                                            this.handleGiftValidDaysChange({number: tempobj.giftValidDays.value},activeKey);
                                            this.handleGiftEffectiveTimeChange(tempobj.giftEffectiveTime.value,activeKey);
                                        }
                                    }else{
                                        //固定有效期
                                        if(tempobj.giftEffectiveTime.value.constructor != Array){ // Array.isArray(val) val instanceof Array
                                            tempResult = false;
                                            this.handleRangePickerChange(tempobj.giftEffectiveTime.value,'ss',activeKey);
                                        }
                                    }
                                }
                            }
                }
                if (!tempResult) {
                    this.setState({
                        activeKey: `${activeKey}`
                    })
                    return false;
                }
            }
        }
        return tempResult;
    }

    /**
     * 整合出一次符合规格的数据
     * @date 2019-10-24
     * @param {Array} data
     * @param {string} type
     * @returns {array}
     */
    getResultData = (data, type) => {
        let pointsObj = data.givePoints.value;
        let couponObj = data.giveCoupon.value;
        let redPacketObj = data.giveRedPacket;
        let tempObj = {};
        tempObj.sortIndex = data.sortIndex;
        if(type == 'points'){
            tempObj.presentValue = pointsObj.givePointsValue.value;
            tempObj.cardTypeID = pointsObj.card.value;
            tempObj.presentType = 2;
        }
        if(type == 'redPacket'){
            tempObj.presentValue = redPacketObj.redPacketValue.value;
            tempObj.giftID = redPacketObj.redPacketID.value;
            tempObj.presentType = 3;
        }
        if(type == 'benefit'){
            // 券包
            if(couponObj.item){
                const { couponPackageID } = couponObj.item;
                tempObj.giftID = couponPackageID;
                tempObj.presentType = 4;
            } else {
                tempObj.effectType = couponObj.effectType;
                tempObj.giftValidUntilDayCount = couponObj.giftValidDays.value;
                if(couponObj.effectType == '1' || couponObj.effectType == '3'){
                    tempObj.giftEffectTimeHours = typeof couponObj.giftEffectiveTime.value === 'object' ? '0' : couponObj.giftEffectiveTime.value;
                }else{
                    tempObj.effectTime = couponObj.giftEffectiveTime.value[0].format('YYYYMMDD');
                    tempObj.validUntilDate = couponObj.giftEffectiveTime.value[1].format('YYYYMMDD');
                }
                tempObj.giftTotalCount = couponObj.giftCount.value;
                tempObj.giftName = couponObj.giftInfo.giftName;
                tempObj.giftID = couponObj.giftInfo.giftItemID;
                tempObj.presentType = 1;
            }
        }
        tempObj.giftOdds = data.giftOdds.value;
        return tempObj;
    }

    handleSubmit = () =>{
        const { specialPromotion, setSpecialGiftInfo, user,} = this.props;
        if(this.checkEveryDataVaild()){
            const { infos } = this.state;
            infos.map((item, index) => {
                return item.sortIndex = index+1;
            });
            const tempArr = [];
            infos.map((item, index) => {
                if(JSON.stringify(item.givePoints.value) != "{}"){
                    let tempObj = this.getResultData(item, 'points');
                    tempArr.push(tempObj);
                }
                if(item.giveCoupon.value.isOn){
                    let tempObj = this.getResultData(item, 'benefit');
                    tempArr.push(tempObj);
                }
                if(item.giveRedPacket.isOn){
                    let tempObj = this.getResultData(item, 'redPacket');
                    tempArr.push(tempObj);
                }
            })
            setSpecialGiftInfo(tempArr);
            return true;
        }

    }

    toggleFun = (index) => {
        const { disArr = [] } = this.state;
        const toggle = !disArr[index];
        disArr.map((v, i) => disArr[i] = false)
        disArr[index] = toggle;
        this.setState({ disArr });
    }

    render() {
        const { activeKey, infos, giftInfo, disArr, cardTypeArr } = this.state;
        const { user } = this.props;
        let filteredGiftInfo = giftInfo.filter(cat => cat.giftType && cat.giftType != 90)
            .map(cat => ({...cat, index: SALE_CENTER_GIFT_TYPE.findIndex(type => String(type.value) === String(cat.giftType))}));
        let panelArr = this.getPaneArr(infos);
        return (
            <div className={style.stepWrapper}>
                <Button
                    className = { style.addLevelButton }
                    type = 'primary'
                    onClick={this.handleAddLevelPrize}
                    disabled={this.props.disabled || infos.length >= 10}
                >
                    <Icon type="plus" className={style.addIcon} />
                    {this.props.intl.formatMessage(STRING_SPE.d2b1b803260135143)}
                </Button>
                <span
                    className = { style.graySpan }
                >
                    {this.props.intl.formatMessage(STRING_SPE.d31f1376h88323)}
                </span>
                <Tabs
                    hideAdd={true}
                    onChange={this.onChange}
                    activeKey={activeKey}
                    type="editable-card"
                    onEdit={this.onEdit}
                    className={style.tabPrize}
                >
                    { panelArr.map((pane,index) => {
                        return (
                            <TabPane
                                tab={pane.title}
                                key={pane.key}
                                closable={ !this.props.disabled && panelArr.length > 1 && index === panelArr.length - 1}
                                ref='paneRef'
                            >
                                <pane.content
                                    groupID={user.accountInfo.groupID}
                                    info={infos[index]}
                                    infosLength={infos.length}
                                    filteredGiftInfo={filteredGiftInfo}
                                    cardTypeArr={cardTypeArr}
                                    index={index}
                                    toggleFun={this.toggleFun}
                                    disArr={disArr}
                                    redPacketArr={this.state.redPackets}
                                    changeDisArr={this.changeDisArr}
                                    handleGiftCountChange={this.handleGiftCountChange}
                                    handleValidateTypeChange={this.handleValidateTypeChange}
                                    handleGiftOddsChange={this.handleGiftOddsChange}
                                    handleGivePointsChange={this.handleGivePointsChange}
                                    handleGivePointsValueChange={this.handleGivePointsValueChange}
                                    handleCardChange={this.handleCardChange}
                                    handleGiveRedPacketValueChange={this.handleGiveRedPacketValueChange}
                                    handleGiveRedPacketIDChange={this.handleGiveRedPacketIDChange}
                                    handleGiveCouponChange={this.handleGiveCouponChange}
                                    handleGiveRedPacketChange={this.handleGiveRedPacketChange}
                                    handleGiftChange={this.handleGiftChange}
                                    handleGiftValidDaysChange={this.handleGiftValidDaysChange}
                                    handleDependTypeChange={this.handleDependTypeChange}
                                    handleGiftEffectiveTimeChange={this.handleGiftEffectiveTimeChange}
                                    handleRangePickerChange={this.handleRangePickerChange}
                                    disabled={this.props.disabled}
                                    onBagChange={this.onBagChange}
                                />
                            </TabPane>
                        )
                    }) }
                </Tabs>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
        user: state.user.toJS(),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
        levelPrize: state.sale_mySpecialActivities_NEW.getIn(['giftsLevel']),
        disabled: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'userCount']) > 0,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        addSpecialPromotion: (opts) => {
            dispatch(addSpecialPromotion(opts));
        },
        updateSpecialPromotion: (opts) => {
            dispatch(updateSpecialPromotion(opts));
        },
        saleCenterLotteryLevelPrizeData: (opts) => {
            dispatch(saleCenterLotteryLevelPrizeData(opts));
        },
        fetchGiftListInfoAC: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
        setSpecialGiftInfo: (opts) => {
            dispatch(saleCenterSetSpecialGiftInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LotteryThirdStep);
