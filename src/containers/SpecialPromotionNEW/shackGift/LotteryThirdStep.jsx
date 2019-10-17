import React from 'react';
import { Button, Icon, Tabs, message } from 'antd';
import PrizeContent from './PrizeContent';
import style from './LotteryThirdStep.less'
import { deflate } from 'zlib';
import { defaultData, getDefaultGiftData, defaultGivePointsXXXXX, defaultGiveCouponXXXXX } from './defaultCommonData';
import { connect } from 'react-redux';
import { addSpecialPromotion, updateSpecialPromotion, saleCenterLotteryLevelPrizeData } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    UpdateGiftLevel,
} from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import _ from 'lodash';
import {
    SALE_CENTER_GIFT_TYPE,
    SALE_CENTER_GIFT_EFFICT_TIME,
    SALE_CENTER_GIFT_EFFICT_DAY,
} from '../../../redux/actions/saleCenterNEW/types';
import { axiosData } from '../../../helpers/util';



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
            disArr: [],
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
        const giftInfo = this.props.levelPrize.toJS();
        let infos = [getDefaultGiftData()];
        if(!isNew){
            giftInfo.forEach((gift, index) => {
                if (infos[index] !== undefined) {
                    infos[index].needCount.value = gift.needCount || 0;
                    infos[index].sendType = gift.sendType || 0;
                    infos[index].recommendType = gift.recommendType || 0;
                } else {
                    const typePropertyName = 'sendType'
                    const typeValue = gift.sendType;
                    infos[index] = getDefaultGiftData(typeValue, typePropertyName); 
                }
                infos[index].giftEffectiveTime.value = gift.effectType != '2' ? gift.giftEffectTimeHours
                    : [moment(gift.effectTime, 'YYYYMMDD'), moment(gift.validUntilDate, 'YYYYMMDD')];
                infos[index].effectType = `${gift.effectType}`;
                infos[index].giftInfo.giftName = gift.giftName;
                infos[index].giftInfo.giftItemID = gift.giftID;
                infos[index].giftValidDays.value = gift.giftValidUntilDayCount;
                infos[index].giftTotalCount.value = gift.giftTotalCount;
                infos[index].givePointsXXXXX.value = {};//先默认写成这样debugger是通过选选项中所有数据不为空来判断是否有值之后再修改。
                // infos[index].giveCouponXXXXX.value = {};
                //先默认写成这样debugger是通过选选项中所有数据不为空来判断是否有值之后再修改 同理不过注意这个优惠券本身有个isOn的触发所以测试阶段先注释掉。在正式代码之中ison要被赋值。
                infos[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
                infos[index].lastConsumeIntervalDays = gift.lastConsumeIntervalDays ? `${gift.lastConsumeIntervalDays}` : undefined;
            })
        }
        return {
            infos: infos.filter(gift => gift.sendType === 0)
            .sort((a, b) => a.needCount - b.needCount),
        };
    }

    handleGiftChange = (value, index) => {
        if (value) {
            const newValue = value.split(',');
            const _infos = this.state.infos;
            _infos[index].giveCouponXXXXX.value.giftInfo.giftItemID = newValue[0];
            _infos[index].giveCouponXXXXX.value.giftInfo.validateStatus = 'success';
            _infos[index].giveCouponXXXXX.value.giftInfo.msg = null;
            this.setState({
                infos: _infos,
            },() => {
                this.gradeChange(this.state.infos);
            });
        } else {
            const _infos = this.state.infos;
            _infos[index].giveCouponXXXXX.value.giftInfo.giftName = null;
            _infos[index].giveCouponXXXXX.value.giftInfo.giftItemID = null;
            _infos[index].giveCouponXXXXX.value.giftInfo.validateStatus = 'error';
            _infos[index].giveCouponXXXXX.value.giftInfo.msg = '必须选择礼券';
            this.setState({
                infos: _infos,
            },() => {
                this.gradeChange(this.state.infos);
            });
        }
    }

    gradeChange = (gifts) => {
        const typePropertyName = 'sendType';
        if (!Array.isArray(gifts)) return;
        const { infos } = this.state;
        this.setState({
            infos: [...infos.filter(item => item[typePropertyName] !== 0), ...gifts]
        })
    }
    // 类型改变
    handleValidateTypeChange = (e, index) => {
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
        },() => {
            this.gradeChange(this.state.infos);
        });
    }

    /**
     * 更改赠送积分的infos[index]数据,与赠送优惠券的infos[index]数据联动。
     * @date 2019-10-17
     * @param {array} value
     * @param {num} index
     * @returns {void}
     */
    handleGivePointsXXXXXChange = (value, index) => {
        const _infos = this.state.infos;
        if(JSON.stringify(_infos[index].givePointsXXXXX.value) == "{}"){
            _infos[index].givePointsXXXXX.value = defaultGivePointsXXXXX
        }else{
            //在取消勾选的情况下先校验是不是两个都为空，如果两个都为空则让赠送优惠券的提示显示出来
            if(!(_infos[index].giveCouponXXXXX.value.isOn)){
                //优惠券为非选中状态
                _infos[index].giveCouponXXXXX.validateStatus = 'error';
                _infos[index].giveCouponXXXXX.msg = '赠送积分和赠送优惠券至少选择一项';
            }else{
                //取消的时候如果优惠券是选中状态，则直接取消。
                _infos[index].giveCouponXXXXX.validateStatus = 'success';
                _infos[index].giveCouponXXXXX.msg = null;
            }
            _infos[index].givePointsXXXXX.value = {}
        }
        this.setState({
            infos: _infos,
        },() => {
            this.gradeChange(this.state.infos);
        });
    }
    handleGiveCouponXXXXXChange = (value, index) => {
        const _infos = this.state.infos;
        if(_infos[index].giveCouponXXXXX.value.isOn){
            //从开变成关的状态
            _infos[index].giveCouponXXXXX.value = { isOn: false };
            if(JSON.stringify(_infos[index].givePointsXXXXX.value) == "{}"){
                _infos[index].giveCouponXXXXX.validateStatus = 'error';
                _infos[index].giveCouponXXXXX.msg = '赠送积分和赠送优惠券至少选择一项';
            }else{
                _infos[index].giveCouponXXXXX.validateStatus = 'success';
                _infos[index].giveCouponXXXXX.msg = null;
            }
        }else{
            //从关变成开
            _infos[index].giveCouponXXXXX.value = defaultGiveCouponXXXXX
            _infos[index].giveCouponXXXXX.validateStatus = 'success';
            _infos[index].giveCouponXXXXX.msg = null;
        }
        this.setState({
            infos: _infos,
        },() => {
            this.gradeChange(this.state.infos);
        });
    }

    handleGivePointsValueXXXXXChange = (value, index) => {
        const _infos = this.state.infos;
        _infos[index].givePointsXXXXX.value.givePointsValueXXXXX.value = value.number;
        const _value = parseFloat(value.number);
        if (_value > 0) {
            _infos[index].givePointsXXXXX.value.givePointsValueXXXXX.validateStatus = 'success';
            _infos[index].givePointsXXXXX.value.givePointsValueXXXXX.msg = null;
        } else {
            _infos[index].givePointsXXXXX.value.givePointsValueXXXXX.validateStatus = 'error';
            _infos[index].givePointsXXXXX.value.givePointsValueXXXXX.msg = '赠送积分值应该大于0';
        }
        this.setState({
            infos: _infos,
        },() => {
            this.gradeChange(this.state.infos);
        });
    }
    handleCardXXXXXChange = (value, index) => {
        const _infos = this.state.infos;
        _infos[index].givePointsXXXXX.value.CardXXXXX.value = value;
        const _value = value;
        if (_value) {
            _infos[index].givePointsXXXXX.value.CardXXXXX.validateStatus = 'success';
            _infos[index].givePointsXXXXX.value.CardXXXXX.msg = null;
        } else {
            _infos[index].givePointsXXXXX.value.CardXXXXX.validateStatus = 'error';
            _infos[index].givePointsXXXXX.value.CardXXXXX.msg = '请先选择卡类型';
        }
        this.setState({
            infos: _infos,
        },() => {
            this.gradeChange(this.state.infos);
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
        },() => {
            this.gradeChange(this.state.infos);
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

    onChange = (targetKey) => {
        this.setState({
            activeKey: targetKey,
        });
    }

    /**
     * 对tab进行删除操作的时候，触发的方法。操作从infos状态
     * @date 2019-10-15
     * @param {string} targetKey
     * @param {string} action
     * @returns {void}
     */
    onEdit = (targetKey, action) => {
        const { infos } = this.state;
        switch (action) {
            case 'remove' :
                infos.splice(+targetKey, 1);
                this.setState({ infos,})
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
            panelArr.push({title: '一等奖', content: PrizeContent, key: '1', closable: false,});
        } else {
            infos.map((item, index) => {
                if( index == activeKey){
                    panelArr.push({title: `${TabNum[index]}等奖`, content: PrizeContent , key: `${index}`, closable: false,});
                }else{
                    panelArr.push({title: `${TabNum[index]}等奖`, content: PrizeContent , key: `${index}`,});
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
            if(infos.length >= 10){
                message.warning('最多添加10个中奖等级');
                return;
            }
            infos.push({...JSON.parse(JSON.stringify(defaultData)), 'sendType': 0});
            this.setState({
                infos,
            })
    }

    changeDisArr = (value,index) => {
        const { disArr = [] } = this.state;
        disArr[index] = false;
        this.setState({ disArr })
    }

    handleGiftCountChange = (value, index) => {
        const _infos = this.state.infos;
        _infos[index].giveCouponXXXXX.value.giftCount.value = value.number;
        const _value = parseFloat(value.number);
        if (_value > 0 && _value <= 1000000000) {
            _infos[index].giveCouponXXXXX.value.giftCount.validateStatus = 'success';
            _infos[index].giveCouponXXXXX.value.giftCount.msg = null;
        } else {
            _infos[index].giveCouponXXXXX.value.giftCount.validateStatus = 'error';
            _infos[index].giveCouponXXXXX.value.giftCount.msg = '礼品总数必须大于0, 小于等于10亿';
        }
        this.setState({
            infos: _infos,
        },() => {
            this.gradeChange(this.state.infos);
        });
    }

    

    render() {
        const { activeKey, infos, giftInfo, disArr, cardTypeArr } = this.state;
        let filteredGiftInfo = giftInfo.filter(cat => cat.giftType && cat.giftType != 90)
            .map(cat => ({...cat, index: SALE_CENTER_GIFT_TYPE.findIndex(type => String(type.value) === String(cat.giftType))}));
        let panelArr = this.getPaneArr(infos);
        const toggleFun = (index) => {
            const { disArr = [] } = this.state;
            const toggle = !disArr[index];
            disArr.map((v, i) => disArr[i] = false)
            disArr[index] = toggle;
            this.setState({ disArr })
        }
        return (
            <div>
                <Button 
                    className = { style.addLevelButton } 
                    type = 'primary' 
                    onClick={this.handleAddLevelPrize}
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
                                closable={pane.closable} 
                                ref='paneRef'
                            >
                                <pane.content 
                                    info={infos[index]} 
                                    infosLength={infos.length} 
                                    filteredGiftInfo={filteredGiftInfo} 
                                    cardTypeArr={cardTypeArr}
                                    index={index} 
                                    toggleFun={toggleFun}
                                    disArr={disArr}
                                    changeDisArr={this.changeDisArr}
                                    handleGiftCountChange={this.handleGiftCountChange}
                                    handleValidateTypeChange={this.handleValidateTypeChange}
                                    handleGiftOddsChange={this.handleGiftOddsChange}
                                    handleGivePointsXXXXXChange={this.handleGivePointsXXXXXChange}
                                    handleGivePointsValueXXXXXChange={this.handleGivePointsValueXXXXXChange}
                                    handleCardXXXXXChange={this.handleCardXXXXXChange}
                                    handleGiveCouponXXXXXChange={this.handleGiveCouponXXXXXChange}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LotteryThirdStep);