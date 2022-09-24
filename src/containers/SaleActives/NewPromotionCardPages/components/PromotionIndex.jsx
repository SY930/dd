import { closePage, decodeUrl, jumpPage } from '@hualala/platform-base';
import { Col } from 'antd';
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

    onSave = () => {
        const { promotionKey } = decodeUrl();
        const key = promotionKey || this.props.promotionKey;
        // 当前key和mode
        const currentPromotion = this.props.promotion[key];
        console.log('promotionRightMainRef', this.promotionRightMainRef)
        const { allForms, activityConditionsRef } = this.promotionRightMainRef;
        const { conditionForms } = activityConditionsRef;
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

        const conditionFormsKeys = Object.keys(conditionForms);
        let tempObj = {};
        for (let i = 0; i < conditionFormsKeys.length; i++) {
            const giftConfig = [];
            let key = conditionFormsKeys[i];
            const formItem = conditionForms[key];
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
                    console.log('====222222', key, values);
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
        console.log('conditionConfig===111', conditionConfig);

        if (isValid) {
            try {
                let requestPramas = {}
                console.log('保存数据====1111', resultValues);
                console.log('conditionConfig===2222', conditionConfig);
                // console.log('currentPromotion', currentPromotion)
                let eventGiftConditionList = [];
                let eventMutexDependRuleInfos = []; //与优惠券不共享
                conditionConfig.forEach((item, index) => {
                    let gifts = [];
                    if (item.score) {
                        gifts.push({
                            presentType: 2,
                            ...item.score
                        })
                    }
                    if (item.cardNum) {
                        gifts.push({
                            presentType: 5,
                            ...item.cardNum
                        })
                    }
                    if (item.gift && item.gift.length > 0) {
                        item.gift.map(item => {
                            item.presentType = 1;
                            let effectType = '';
                            if (item.effectType == 1) { // 相对有效期
                                if (item.countType == 0) { // 按小时
                                    effectType = 1
                                } else {
                                    effectType = 3
                                }
                            } else if (item.effectType == 2) {
                                effectType = 2
                            }
                            gifts.push({
                                ...item,
                                effectType
                            });
                            return item;
                        })
                    }
                    if (item.normal) {
                        if (item.normal.presentType) {
                            delete item.normal.presentType
                        }
                        eventGiftConditionList[index] = item.normal;
                    }
                    eventGiftConditionList[index].gifts = gifts;
                    eventGiftConditionList[index].sortIndex = index + 1
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
                console.log('clonedEvent===111', clonedEvent);
                clonedEvent.hasMutexDepend = event.hasMutexDepend ? 1 : 0
                delete clonedEvent.NoShareBenifit;
                const { eventRange, hasMutexDepend, mutexDependType, joinCount, countCycleDays, partInTimes2, partInTimes3, orderTypeList, brandList, activityRange } = clonedEvent;
                if (joinCount == 2) {
                    clonedEvent.partInTimes = partInTimes2
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
                if (activityRange) {
                    const { categoryOrDish, dishes, excludeDishes, foodCategory } = activityRange;
                    console.log('activityRange====111', activityRange);
                    if (categoryOrDish == 0) {
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
                requestPramas.eventGiftConditionList = eventGiftConditionList;
                requestPramas.event = clonedEvent;
                requestPramas.eventMutexDependRuleInfos = eventMutexDependRuleInfos;
                if (currentPromotion.itemID) {
                    requestPramas.event.itemID = currentPromotion.itemID;
                }
                console.log('请求参数', requestPramas);
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
            console.log('flag===flag', flag)
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

