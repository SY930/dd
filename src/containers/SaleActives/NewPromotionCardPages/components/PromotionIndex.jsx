import { closePage, decodeUrl, jumpPage } from '@hualala/platform-base';
import { Col, message } from 'antd';
import { Component } from 'react';
import { connect } from 'react-redux';
import HeaderTitle from '../components/HeaderTitle';
import PromotionLeftLogo from '../components/PromotionLeftLogo';
import PromotionRightMain from '../components/PromotionRightMain';
import styles from './style.less';
import { httpCreatePromotion } from "./AxiosFactory";
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from "../../../../redux/actions/saleCenterNEW/promotionDetailInfo.action";

const DATE_FORMAT = 'YYYYMMDD';
const END_DATE_FORMAT = 'YYYYMMDD';

const formSteps = {
    87: ['基本信息', '活动规则'],
    88: ['基本信息'],
}
const formKeys = [''];

class PromotionIndex extends Component {
    constructor(props) {
        super(props);
        this.promotionRightMainRef = null;
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        const opts = {
            _groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
        };
        this.props.fetchFoodCategoryInfo({ ...opts });
        this.props.fetchFoodMenuInfo({ ...opts });
    }

    onClose = () => {
        closePage();
        jumpPage({ pageID: '1000076003' });
    }

    findGiftNameById = (treeData = [], id) => {
        let obj = {
            giftName: '',
            giftType: '',
            giftValue: '',
        }
        treeData.forEach(item => {
            if (Array.isArray(item.children) && item.children.length > 0) {
                item.children.forEach(child => {
                    const { label, giftType, giftValue, value, giftImagePath } = child;
                    if (+value == +id) {
                        obj.giftName = label;
                        obj.giftType = giftType;
                        obj.giftValue = giftValue;
                        if (giftImagePath) {
                            obj.giftConfImagePath = giftImagePath
                        }
                    }
                })
            }
        });
        return obj
    }

    onSave = () => {
        const { promotionKey } = decodeUrl();
        const key = promotionKey || this.props.promotionKey;
        // 当前key和mode
        const currentPromotion = this.props.promotion[key];
        const { allForms, activityConditionsRef, state: promotionRightMainState } = this.promotionRightMainRef;
        const { conditionForms, state } = activityConditionsRef;
        const validFormIds = state.conditionList.map(item => item.id);
        let newConditionForms = {};
        Object.keys(conditionForms).forEach(key => {
            if (key.indexOf('score') != -1) { // 积分
                if (validFormIds.includes(+key.split('score')[0])) {
                    newConditionForms[key] = conditionForms[key]
                }
            } else if (key.indexOf('cardNum') != -1) { // 卡值
                if (validFormIds.includes(+key.split('cardNum')[0])) {
                    newConditionForms[key] = conditionForms[key]
                }
            } else if (key.indexOf('gift') != -1) { // 礼品
                if (validFormIds.includes(+key.split('gift')[0])) {
                    newConditionForms[key] = conditionForms[key]
                }
            } else {
                if (validFormIds.includes(+key)) {
                    newConditionForms[key] = conditionForms[key]
                }
            }
        })

        // 校验标准form
        // 校验礼品form
        const allFormKeys = Object.keys(allForms);
        const resultValues = [];
        let isValid = true;
        for (let i = 0; i < allFormKeys.length; i++) {
            const formItem = allForms[[allFormKeys[i]]];
            formItem.validateFieldsAndScroll((error, values) => {
                if (error) {
                    isValid = false
                    return;
                }
                resultValues.push(values);
            });
        }

        const conditionFormsKeys = Object.keys(newConditionForms);
        let tempObj = {};
        for (let i = 0; i < conditionFormsKeys.length; i++) {
            const giftConfig = [];
            let key = conditionFormsKeys[i];
            const formItem = newConditionForms[key];
            if (key.indexOf('gift') != -1) {
                // 礼品
                const { giftForms } = formItem;
                const giftFormKeys = Object.keys(giftForms);
                for (let j = 0; j < giftFormKeys.length; j++) {
                    const formItem = giftForms[[giftFormKeys[j]]];
                    formItem.validateFieldsAndScroll((error, values) => {
                        if (error) {
                            isValid = false
                            return
                        }
                        giftConfig.push(values);
                    });
                }
                tempObj[key.split('gift')[0]] = tempObj[key.split('gift')[0]] || {}
                tempObj[key.split('gift')[0]]['gift'] = giftConfig
            } else {
                formItem.validateFieldsAndScroll((error, values) => {
                    if (error) {
                        isValid = false
                        return
                    }
                    if (key.indexOf('score') != -1) {
                        tempObj[key.split('score')[0]] = tempObj[key.split('score')[0]] || {}
                        tempObj[key.split('score')[0]]['score'] = values
                    } else if (key.indexOf('cardNum') != -1) {
                        tempObj[key.split('cardNum')[0]] = tempObj[key.split('cardNum')[0]] || {}
                        tempObj[key.split('cardNum')[0]]['cardNum'] = values
                    } else {
                        tempObj[key] = {}
                        tempObj[key]['normal'] = values
                    }
                });
            }
        }

        const conditionConfig = [];
        Object.keys(tempObj).sort((a, b) => a - b).forEach((key, index) => {
            conditionConfig[index] = tempObj[key]
        })
        if (isValid) {
            try {
                let requestPramas = {}
                let eventGiftConditionList = [];
                let eventMutexDependRuleInfos = []; //与优惠券不共享
                conditionConfig.forEach((item, index) => {
                    eventGiftConditionList[index] = {};
                    let gifts = [];
                    if (item.score) {
                        let { giveAmountType, presentValue } = item.score;
                        gifts.push({
                            presentType: 2,
                            ...item.score,
                            presentValue: giveAmountType == 2 ? presentValue : (presentValue / 100).toFixed(2)
                        })
                    }
                    if (item.cardNum) {
                        let { giveAmountType, presentValue } = item.cardNum;
                        gifts.push({
                            presentType: 5,
                            ...item.cardNum,
                            presentValue: giveAmountType == 2 ? presentValue : (presentValue / 100).toFixed(2)
                        })
                    }
                    if (item.gift && item.gift.length > 0) {
                        item.gift.map(item => {
                            if (item.giftID) {
                                item.presentType = 1;
                                let effectType = '';
                                if (item.effectType == 1) { // 相对有效期
                                    if (item.countType == 0) { // 按小时
                                        effectType = 1
                                    } else {
                                        effectType = 3
                                    }
                                } else if (item.effectType == 2) {// 固定有效期
                                    effectType = 2;
                                    if (item.giftRangeTime.length > 0) {
                                        item.effectTime = item.giftRangeTime[0].format('YYYYMMDD000000');
                                        item.validUntilDate = item.giftRangeTime[1].format('YYYYMMDD235959');
                                        delete item.giftRangeTime;
                                    }
                                }
                                gifts.push({
                                    ...item,
                                    effectType,
                                    ...this.findGiftNameById(state.treeData, item.giftID)
                                });
                                return item;
                            }
                        })
                    }
                    if (item.normal) {
                        if (item.normal.presentType) {
                            delete item.normal.presentType
                        }
                        eventGiftConditionList[index].stageAmount = item.normal.stageAmount;
                        eventGiftConditionList[index].stageAmountType = item.normal.stageAmountType;
                        eventGiftConditionList[index].stageType = item.normal.stageType;
                    }
                    eventGiftConditionList[index].gifts = gifts;
                    eventGiftConditionList[index].sortIndex = index + 1;
                })
                let event = {}
                resultValues.forEach(item => {
                    if (item.NoShareBenifit) {
                        eventMutexDependRuleInfos = item.NoShareBenifit;
                    }
                    event = { ...event, ...item }
                })
                event.eventWay = currentPromotion.promotionKey;
                let clonedEvent = _.cloneDeep(event);
                clonedEvent.hasMutexDepend = event.hasMutexDepend ? 1 : 0
                delete clonedEvent.NoShareBenifit;
                delete clonedEvent.treeSelect;
                const { eventRange, hasMutexDepend, mutexDependType, joinCount, countCycleDays, partInTimes2, partInTimes3, orderTypeList, brandList, activityRange } = clonedEvent;
                if (joinCount == 1) {
                    delete clonedEvent.countCycleDays;
                } else if (joinCount == 2) {
                    clonedEvent.partInTimes = partInTimes2
                    delete clonedEvent.countCycleDays;
                } else if (joinCount == 3) {
                    clonedEvent.countCycleDays = countCycleDays
                    clonedEvent.partInTimes = partInTimes3
                }
                delete clonedEvent.joinCount;
                delete clonedEvent.partInTimes2;
                delete clonedEvent.partInTimes3;
                if (orderTypeList && orderTypeList.length > 0) {
                    clonedEvent.orderTypeList = orderTypeList.join(',')
                }
                if (eventRange && eventRange.length > 0) {
                    clonedEvent.eventStartDate = eventRange[0].format(DATE_FORMAT);
                    clonedEvent.eventEndDate = eventRange[1].format(END_DATE_FORMAT);
                    delete clonedEvent.eventRange;
                }
                if (brandList && brandList.length > 0) {
                    clonedEvent.brandList = brandList.map(item => item.targetID).join(',');
                }
                if (hasMutexDepend) {
                    if (mutexDependType == 1) {
                        eventMutexDependRuleInfos = [
                            {
                                mutexDependType: 1,
                                ruleType: 10,
                                targetID: 0
                            }
                        ]
                    } else if (mutexDependType == 2) {
                        eventMutexDependRuleInfos = eventMutexDependRuleInfos.map(item => {
                            return {
                                mutexDependType: 1,
                                ruleType: 10,
                                targetID: item.promotionIDStr,
                                targetName: item.finalShowName,
                                sharedType: item.sharedType
                            }
                        });
                    }
                } else {
                    eventMutexDependRuleInfos = []
                }
                let foodScopeList = [];
                const stageTypes = eventGiftConditionList.map(item => +item.stageType);
                if (stageTypes.includes(3) || stageTypes.includes(4)) {
                    if (!activityRange) {
                        return message.warning('适用菜品分类不能为空')
                    }
                }
                if (activityRange) {
                    const { categoryOrDish, dishes, excludeDishes, foodCategory } = activityRange;
                    if (categoryOrDish == 0) {
                        if (Array.isArray(foodCategory) && foodCategory.length == 0) {
                            return message.warning('适用菜品分类不能为空')
                        }
                        foodCategory.forEach(item => {
                            foodScopeList.push({
                                scopeType: '1',
                                targetID: item.foodCategoryID,
                                brandID: item.brandID,
                                targetCode: item.foodCategoryKey,
                                targetName: item.foodCategoryName,
                            });
                        })
                        excludeDishes.forEach(item => {
                            foodScopeList.push({
                                scopeType: '4',
                                targetID: item.itemID,
                                brandID: item.brandID,
                                targetCode: item.foodKey,
                                targetName: item.foodName,
                                targetUnitName: item.unit,
                            });
                        })
                    } else if (categoryOrDish == 1) {
                        if (Array.isArray(dishes) && dishes.length == 0) {
                            return message.warning('适用菜品不能为空')
                        }
                        dishes.forEach(item => {
                            foodScopeList.push({
                                scopeType: '2',
                                targetID: item.itemID,
                                brandID: item.brandID,
                                targetCode: item.foodKey,
                                targetName: item.foodName,
                                targetUnitName: item.unit,
                            })
                        })
                    }
                }
                delete clonedEvent.activityRange;
                clonedEvent.foodScopeList = foodScopeList;
                delete clonedEvent.mutexDependType;
                delete clonedEvent.cardScopeType;
                requestPramas.eventGiftConditionList = eventGiftConditionList;
                // 会员范围
                const { defaultCardType, cardLevelIDList } = promotionRightMainState;
                if (Array.isArray(cardLevelIDList) && cardLevelIDList.length > 0) {
                    clonedEvent.cardLevelRangeType = '2';
                    clonedEvent.cardLevelIDList = cardLevelIDList;
                } else {
                    clonedEvent.cardLevelRangeType = '0';
                }
                clonedEvent.defaultCardType = defaultCardType;
                requestPramas.event = clonedEvent;
                requestPramas.eventMutexDependRuleInfos = eventMutexDependRuleInfos;
                if (currentPromotion.itemID) {
                    requestPramas.event.itemID = currentPromotion.itemID;
                }
                this.createPromotion(requestPramas);
            } catch (error) {
                console.error(error);
            }
        }
    }

    createPromotion = (requestPramas) => {
        this.setState({
            loading: true
        })
        httpCreatePromotion(requestPramas).then(flag => {
            this.setState({
                loading: false
            })
            if (flag) {
                this.onClose()
            }
        }).catch(error => {
            this.setState({
                loading: false
            })
        })
    }

    render() {
        const { promotionKey, mode } = decodeUrl();
        const key = promotionKey || this.props.promotionKey;

        return (
            <div className={styles.ConsumeGiftGiving}>
                <Col span={24}>
                    <HeaderTitle
                        onClose={this.onClose}
                        onSave={this.onSave}
                        promotionKey={key}
                        loading={this.state.loading}
                    />
                </Col>
                <Col span={24}>
                    <div className="layoutsLineBlock"></div>
                </Col>
                <Col className={styles.mainContainer} span={24}>
                    <PromotionLeftLogo
                        promotionKey={key}
                    />
                    <Col span={1}>
                        <div className={styles.centerLine}>
                            <div className={styles.arrow}></div>
                        </div>
                    </Col>
                    <PromotionRightMain
                        promotionKey={key}
                        formSteps={formSteps[key] || ['基本信息', '活动规则']}
                        onRef={(node) => { this.promotionRightMainRef = node }}
                    />
                </Col>
            </div>
        )
    }
}

const mapStateToProps = ({ user, newPromotionCardPagesReducer }) => {
    return {
        user: user.toJS(),
        promotion: newPromotionCardPagesReducer.get('promotion').toJS(),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFoodCategoryInfo: (opts, flag, id) => {
            dispatch(fetchFoodCategoryInfoAC(opts, flag, id))
        },

        fetchFoodMenuInfo: (opts, flag, id) => {
            dispatch(fetchFoodMenuInfoAC(opts, flag, id))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionIndex)

