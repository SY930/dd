import React from 'react';
import { Button, Icon, Tabs, message } from 'antd';
import PrizeContent from './PrizeContent';
import style from './LotteryThirdStep.less'
import { deflate } from 'zlib';
import { defaultData, getDefaultGiftData, defaultGivePoints, defaultGiveCoupon, defalutDisArr } from './defaultCommonData';
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


const moment = require('moment');
const { TabPane } = Tabs;
const TabNum = [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

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

     /**
     * 对从接口拿来的gifts数据 整合为infos数据
     * @date 2019-10-16
     * @returns {any}
     */
    initState = () => {
        const { isNew } = this.props;
        const giftInfo = this.getOrganize(this.props.levelPrize.toJS());
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
                    temparr.push(item);
                }else{
                    let flag = true;
                    temparr.map((every,num) => {
                        if(every.sortIndex == item.sortIndex){
                            flag = false
                            //进行合并
                            if(every.presentType == 2){
                                //券要合并到积分里
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
                            }else{
                                //积分要合到券里
                                temparr[num].cardTypeID = item.cardTypeID;
                                temparr[num].presentValue = item.presentValue;
                            }
                        }
                    });
                    if(flag){
                        temparr.push(item);
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
            _infos[index].giveCoupon.value.giftInfo.msg = '必须选择礼券';
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
            _infos[index].givePoints.value = _.cloneDeep(defaultGivePoints)
        }else{
            //在取消勾选的情况下先校验是不是两个都为空，如果两个都为空则让赠送优惠券的提示显示出来
            if(!(_infos[index].giveCoupon.value.isOn)){
                //优惠券为非选中状态
                _infos[index].giveCoupon.validateStatus = 'error';
                _infos[index].giveCoupon.msg = '赠送积分和赠送优惠券至少选择一项';
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
    handleGiveCouponChange = (value, index) => {
        const _infos = this.state.infos;
        if(_infos[index].giveCoupon.value.isOn){
            //从开变成关的状态
            //先滞空giveCoupn的数据再把状态变为关
            _infos[index].giveCoupon.value = { isOn: false };
            if(JSON.stringify(_infos[index].givePoints.value) == "{}"){
                _infos[index].giveCoupon.validateStatus = 'error';
                _infos[index].giveCoupon.msg = '赠送积分和赠送优惠券至少选择一项';
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
            _infos[index].givePoints.value.givePointsValue.msg = '赠送积分值应该大于0';
        }
        this.setState({
            infos: _infos,
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
            _infos[index].givePoints.value.card.msg = '请先选择卡类型';
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
            _infos[index].giveCoupon.value.giftValidDays.msg = '有效天数必须大于0';
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
            _infos[index].giftOdds.msg = '中奖比率必须在0~100之间';
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
            _infos[index].giveCoupon.value.giftEffectiveTime.msg = '请输入有效时间';
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
     * 在切换几等奖tab的时候，切换之前要做校验 ,把当前的key设置为activekey
     * @date 2019-10-22
     * @param {any} targetKey
     * @returns {any}
     */
    onChange = (targetKey) => {
        if(this.checkEveryDataVaild()){
            this.setState({
                activeKey: targetKey,
            });
        }
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
            panelArr.push({title: '一等奖', content: PrizeContent, key: '0' });
        } else {
            infos.map((item, index) => {
                if( index == activeKey){
                    panelArr.push({title: `${TabNum[index]}等奖`, content: PrizeContent , key: `${index}`, });
                }else{
                    panelArr.push({title: `${TabNum[index]}等奖`, content: PrizeContent , key: `${index}`, });
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
                    message.warning('最多添加10个中奖等级');
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
            _infos[index].giveCoupon.value.giftCount.msg = '礼品总数必须大于0';
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
        const { activeKey, infos } = this.state;
        let tempResult = true;
        for(let i in infos[activeKey] ){
            switch(i){
                case 'giftOdds':
                    let sumOdds = 0;
                    infos.map((item) => {
                        if(sumOdds> 100){
                            if(tempResult){
                                tempResult = false;
                                message.error('不同等级奖项中奖概率相加不能超过100%');
                            }
                        }else{
                            if(!item.giftOdds.value){
                                tempResult = false;
                                this.handleGiftOddsChange({number: item.giftOdds.value}, activeKey);
                            }
                            sumOdds += +item.giftOdds.value;
                            if(sumOdds > 100){
                                tempResult = false;
                                message.error('不同等级奖项中奖概率相加不能超过100%');
                            }
                        }
                    });
                    break;
                case 'givePoints':
                    if(JSON.stringify(infos[activeKey].givePoints.value) != "{}"){
                        //赠送积分是勾选的要确认里面的内容是不是都合适
                        let tempobj = infos[activeKey].givePoints.value;
                        if(!(tempobj.givePointsValue.value > 0) || !tempobj.card.value ){
                            tempResult = false;
                            this.handleGivePointsValueChange({number: tempobj.givePointsValue.value}, activeKey);
                        }
                    }else{
                        //赠送积分不是勾选的，要确认是不是优惠券的msg是不是不为空，如果不为空则证明。两个都没选。要返回false。
                        if(!infos[activeKey].giveCoupon.value.isOn){
                            tempResult = false;
                        }
                    }
                    break;
                case 'giveCoupon':
                        if(infos[activeKey].giveCoupon.value.isOn){
                            //优惠券是勾选的确认优惠券里面的内容
                            let tempobj = infos[activeKey].giveCoupon.value;
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
                                if(tempobj.giftEffectiveTime.value.constructor != Array){
                                    tempResult = false;
                                    this.handleRangePickerChange(tempobj.giftEffectiveTime.value,'ss',activeKey);
                                }
                            }
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
        let tempObj = {};
        tempObj.sortIndex = data.sortIndex;
        if(type == 'points'){
            tempObj.presentValue = pointsObj.givePointsValue.value;
            tempObj.cardTypeID = pointsObj.card.value;
            tempObj.presentType = 2;
        }else{
            tempObj.presentValue = '';
            tempObj.cardTypeID = '';
        }
        if(type == 'benefit'){
            tempObj.effectType = couponObj.effectType;
            tempObj.giftValidUntilDayCount = couponObj.giftValidDays.value;
            if(couponObj.effectType == '1' || couponObj.effectType == '3'){
                tempObj.giftEffectTimeHours = couponObj.giftEffectiveTime.value;
            }else{
                tempObj.effectTime = couponObj.giftEffectiveTime.value[0].format('YYYYMMDD');
                tempObj.validUntilDate = couponObj.giftEffectiveTime.value[1].format('YYYYMMDD');
            }
            tempObj.giftTotalCount = couponObj.giftCount.value;
            tempObj.giftName = couponObj.giftInfo.giftName;
            tempObj.giftID = couponObj.giftInfo.giftItemID;  
            tempObj.presentType = 1;
        }else{
            tempObj.effectType = '';
            tempObj.giftValidUntilDayCount = '';
            tempObj.giftEffectTimeHours = '';
            tempObj.effectTime = '';
            tempObj.validUntilDate = '';
            tempObj.giftTotalCount = '';
            tempObj.giftName = '';
            tempObj.giftID = '';  
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
                    添加中奖等级 
                </Button>
                <span 
                    className = { style.graySpan }
                > 
                    最多添加10个中奖等级
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
                                    info={infos[index]} 
                                    infosLength={infos.length} 
                                    filteredGiftInfo={filteredGiftInfo} 
                                    cardTypeArr={cardTypeArr}
                                    index={index} 
                                    toggleFun={this.toggleFun}
                                    disArr={disArr}
                                    changeDisArr={this.changeDisArr}
                                    handleGiftCountChange={this.handleGiftCountChange}
                                    handleValidateTypeChange={this.handleValidateTypeChange}
                                    handleGiftOddsChange={this.handleGiftOddsChange}
                                    handleGivePointsChange={this.handleGivePointsChange}
                                    handleGivePointsValueChange={this.handleGivePointsValueChange}
                                    handleCardChange={this.handleCardChange}
                                    handleGiveCouponChange={this.handleGiveCouponChange}
                                    handleGiftChange={this.handleGiftChange}
                                    handleGiftValidDaysChange={this.handleGiftValidDaysChange}
                                    handleDependTypeChange={this.handleDependTypeChange}
                                    handleGiftEffectiveTimeChange={this.handleGiftEffectiveTimeChange}
                                    handleRangePickerChange={this.handleRangePickerChange}
                                    disabled={this.props.disabled}
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