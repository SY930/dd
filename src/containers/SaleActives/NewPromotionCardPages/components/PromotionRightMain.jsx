import { closePage, decodeUrl } from '@hualala/platform-base';
import { Col, Row, Radio, Form } from 'antd';
import ShopSelector from 'components/ShopSelector';
import { Component } from 'react';
import { connect } from 'react-redux';
import BaseForm from '../../../../components/common/BaseForm';
import { isFilterShopType } from '../../../../helpers/util';
import newPromotionCardPageConfig from '../common/newPromotionCardPageConfig';
import { ACTIVITY_RULE_FORM_KEYS, ALL_FORM_ITEMS, BASE_FORM_KEYS, ACTIVITY_THIRD_RULE_FORM_KEYS } from '../common/_formItemConfig';
import { updateCurrentPromotionPageAC } from '../store/action';
import ActivityConditions from "./ActivityConditions";
import styles from './style.less';
import NoShareBenifit from 'containers/SaleCenterNEW/common/NoShareBenifit.jsx';
import { saleCenterSetPromotionDetailAC } from '../../../../../src/redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { httpGetPromotionDetail, httpGetGroupCardTypeList } from "./AxiosFactory";
import moment from 'moment';
import CardLevel from "../../../SpecialPromotionNEW/common/CardLevel";
import { GiftCategoryAndFoodSelector } from 'containers/SaleCenterNEW/common/CategoryAndFoodSelector';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;

export const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
}

class PromotionRightMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activityFormKeys: [],
            activityThirdFormKeys: [], // 第三个form
            isBenifitActive: false,
            formData: {},
            activityThirdFormData: {},
            eventGiftConditionList: [],
            eventMutexDependRuleInfos: [],
            groupCardTypeList: [], // 新用户注册卡类
            clonedGroupCardTypeList: [],
            foodScopeList: [], // 菜品
            cardLevelRangeType: '', // 会员范围
            defaultCardType: '', // 新用户注册卡类
            cardLevelIDList: [], //适用卡等级
        }
        this.allForms = {};
        this.activityConditionsRef = '';
    }
    componentDidMount() {
        if (this.props.onRef) {
            this.props.onRef(this);
        }
        const urlParams = decodeUrl();
        const { updateCurrentPromotionPage } = this.props;
        if (urlParams && urlParams.promotionKey) {
            updateCurrentPromotionPage({
                [urlParams.promotionKey]: {
                    promotionKey: urlParams.promotionKey,
                    mode: urlParams.mode,
                    itemID: urlParams.itemID,
                },
            })
        }
        const { promotionKey, promotion } = this.props;
        const { mode } = promotion[promotionKey];
        const currentPromotion = promotion[promotionKey];
        const filterTitle = newPromotionCardPageConfig.find(item => item.key == currentPromotion.promotionKey).title;
        const activityFormKeys = ACTIVITY_RULE_FORM_KEYS[filterTitle];
        const activityThirdFormKeys = ACTIVITY_THIRD_RULE_FORM_KEYS[filterTitle];
        this.setState({
            activityFormKeys,
            activityThirdFormKeys,
        });
        this.getGroupCardTypeList();
        if (mode != 'create') {
            this.getPromotionDetail(currentPromotion)
        }
        if (mode == 'create') {
            this.props.setPromotionDetail({
                mutexPromotions: []
            })
        }
    }

    getGroupCardTypeList = () => {
        httpGetGroupCardTypeList().then(groupCardTypeList => {
            this.setState({
                groupCardTypeList,
                clonedGroupCardTypeList: _.cloneDeep(groupCardTypeList)
            })
        })
    }

    getPromotionDetail(currentPromotion) {
        const { itemID } = currentPromotion;
        httpGetPromotionDetail({
            itemID
        }).then(res => {
            if (res) {
                this.sendFormData(res);
            }
        })
    }

    sendFormData = (res) => {
        let { data = {}, eventGiftConditionList = [], eventMutexDependRuleInfos = [] } = res;
        const {
            orderTypeList,
            eventStartDate,
            eventEndDate,
            partInTimes,
            countCycleDays,
            brandList,
            foodScopeList = [],
            cardLevelIDList,
            cardLevelRangeType,
            defaultCardType,
            tagLst,
        } = data;
        if (orderTypeList) {
            data.orderTypeList = orderTypeList.split(',')
        }
        if (tagLst && !Array.isArray(tagLst)) {
            data.tagLst = tagLst.split(',');
        }
        if (eventStartDate) {
            data.eventRange = [moment(eventStartDate), moment(eventEndDate)];
        }
        if (countCycleDays) {
            data.countCycleDays = countCycleDays;
            data.partInTimes3 = partInTimes;
            data.joinCount = 3;
        } else if (partInTimes) {
            data.partInTimes2 = partInTimes;
            data.joinCount = 2;
            delete data.countCycleDays;
        } else {
            data.joinCount = 1;
            delete data.countCycleDays;
        }
        if (brandList) {
            data.brandList = brandList.split(',').map(targetID => {
                return {
                    targetID,
                    targetName: ''
                }
            })
        }
        if (eventMutexDependRuleInfos && eventMutexDependRuleInfos.length > 0) {
            // 互斥开关
            data.hasMutexDepend = eventMutexDependRuleInfos.some(item => item.ruleType == 10) ? 1 : 0;
            data.mutexDependType = data.hasMutexDepend ? eventMutexDependRuleInfos.some(item => item.targetID == 0 && item.ruleType == 10) ? 1 : 2 : 1;

            data.hasOnSaleDepend = eventMutexDependRuleInfos.some(item => item.ruleType == 20) ? 1 : 0;
            data.onSaleDependType = data.hasOnSaleDepend ? eventMutexDependRuleInfos.some(item => item.targetID == 0 && item.ruleType == 20) ? 1 : 2 : 1;

            data.hasBenefitsDepend = eventMutexDependRuleInfos.some(item => [31, 32].includes(item.ruleType)) ? 1 : 0;

            data.hasAssetsDepend = eventMutexDependRuleInfos.some(item => [33, 34].includes(item.ruleType)) ? 1 : 0;
        }
        // 互斥配置
        if (data.mutexDependType == 2) {
            data.NoShareBenifit = eventMutexDependRuleInfos.filter(item => item.ruleType == 10).map(item => {
                return {
                    promotionIDStr: item.targetID,
                    sharedType: item.ruleType,
                    finalShowName: item.targetName
                }
            });
        }
        if (data.onSaleDependType == 2) {
            data.onSaleNoShareBenifit = eventMutexDependRuleInfos.filter(item => item.ruleType == 20).map(item => (item.targetID));
        }
        if (data.hasBenefitsDepend) {
            data.benefitsOptions = eventMutexDependRuleInfos.filter(item => [31, 32].includes(item.ruleType)).map(item => (item.ruleType));
        }
        if (data.hasAssetsDepend) {
            data.assetsOptions = eventMutexDependRuleInfos.filter(item => [33, 34].includes(item.ruleType)).map(item => (item.ruleType));
        }

        if (cardLevelRangeType == 2) { // 会员等级
            data.cardScopeType = {
                cardLevelIDList,
                defaultCardType,
                cardLevelRangeType: '2'
            }
        } else {// 会员等级
            data.cardScopeType = {
                defaultCardType,
                cardLevelRangeType: '0'
            }
        }
        let categoryOrDish = 0;
        let foodCategory = [];
        let excludeDishes = [];
        let dishes = [];
        let newfoodScopeList = foodScopeList.map(item => {
            const { scopeType, targetID, brandID, targetCode, targetName, targetUnitName } = item;
            if (scopeType == 2) {
                categoryOrDish = 1;
                dishes.push({
                    scopeType: '2',
                    itemID: item.targetID,
                    brandID: item.brandID,
                    foodKey: item.targetCode,
                    foodName: item.targetName,
                    unit: item.targetUnitName,
                })
            } else {
                categoryOrDish = 0;
                if (scopeType == 1) {
                    foodCategory.push({
                        scopeType: '1',
                        foodCategoryID: item.targetID,
                        brandID: item.brandID,
                        foodCategoryKey: item.targetCode,
                        foodCategoryName: item.targetName,
                    })
                } else if (scopeType == 4) {
                    excludeDishes.push({
                        scopeType: '4',
                        itemID: item.targetID,
                        brandID: item.brandID,
                        foodKey: item.targetCode,
                        foodName: item.targetName,
                        unit: item.targetUnitName,
                    })
                }
            }
            return {
                scopeType,
                targetID,
                brandID,
                targetCode,
                targetName,
                targetUnitName
            }
        })
        data.activityRange = {
            categoryOrDish,
            foodCategory,
            excludeDishes,
            dishes,
        };
        if (Array.isArray(newfoodScopeList) && newfoodScopeList.length > 0) {
            this.showActivityRange(true);
        }
        this.setState({
            formData: data,
            eventGiftConditionList,
            eventMutexDependRuleInfos,
            activityThirdFormData: data,
            foodScopeList: newfoodScopeList,
        });
    }

    renderShopSelector = (formItems, key) => {
        formItems[key].render = (decorator, form) => {
            const { getFieldsValue } = form;
            const { brandList = [] } = getFieldsValue();
            const targetIds = brandList.map(item => item.targetID);
            return (
                <Row>
                    <Col>
                        {decorator({
                            key: 'shopIDList',
                            rules: [
                                {
                                    required: true,
                                    message: '请选择使用店铺'
                                }
                            ]
                        })(
                            <ShopSelector
                                isCreateCoupon={true}
                                filterParm={isFilterShopType() ? { productCode: 'HLL_CRM_License' } : {}}
                                brandList={targetIds}
                            />
                        )}
                    </Col>
                </Row>
            )
        }
    }

    // 与券不共享/部分共享
    renderMutexDependType = (formItems) => {
        formItems.mutexDependType = {
            type: 'custom',
            label: '',
            defaultValue: [],
            render: (decorator, form) => {
                const { getFieldsValue } = form;
                const { hasMutexDepend } = getFieldsValue();
                return (
                    <Row>
                        <Col offset={6}>
                            {
                                hasMutexDepend && decorator({
                                    key: 'mutexDependType',
                                    defaultValue: 1
                                })(
                                    <RadioGroup>
                                        <Radio key={1} value={1}>与所有优惠券不共享</Radio>
                                        <Radio key={2} value={2}>与部分优惠券不共享</Radio>
                                    </RadioGroup>
                                )
                            }
                        </Col>
                    </Row>
                )
            }
        }
    }

    renderNoShareBenifit = (formItems) => {
        formItems.NoShareBenifit = {
            type: 'custom',
            label: '',
            render: (decorator, form) => {
                const { getFieldsValue } = form;
                const { hasMutexDepend, mutexDependType } = getFieldsValue();
                return (
                    <Row>
                        <Col span={24}>
                            {
                                !!hasMutexDepend && mutexDependType == 2 && <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 17, offset: 1 }} label='不共享优惠' style={{ display: 'flex' }} className={styles.NoShareBenifit}>
                                    {
                                        hasMutexDepend &&
                                        decorator({
                                            key: 'NoShareBenifit',
                                            rules: [
                                                { required: true, message: '至少选择一项优惠' }
                                            ]
                                        })(
                                            <NoShareBenifit />
                                        )
                                    }
                                </FormItem>
                            }
                        </Col>
                    </Row>
                )
            }
        }
    }

    renderActivityRange = (formItems) => {
        formItems.activityRange = {
            type: 'custom',
            label: '',
            render: (decorator, form) => {
                let { state, conditionForms } = this.activityConditionsRef;
                let firstForm = conditionForms[state.conditionList[0].id]
                const { stageType } = firstForm && firstForm.getFieldsValue();
                return (
                    <Row>
                        <Col span={24} push={1}>
                            {
                                (stageType == 3 || stageType == 4) && decorator({
                                    key: 'activityRange',
                                })(
                                    <GiftCategoryAndFoodSelector
                                        showRequiredMark
                                        type='87'
                                        scopeLst={this.state.foodScopeList}
                                    />
                                )
                            }
                        </Col>
                    </Row>
                )
            }
        }
    }

    showActivityRange = (flag) => {
        let allKeys = this.state.activityThirdFormKeys;
        if (allKeys[0] && allKeys[0].keys.length > 0) {
            let keys = allKeys[0] && allKeys[0].keys || [];
            let index = keys.indexOf('hasMutexDepend');
            if (flag) {
                keys.splice(index, 0, 'activityRange');
            } else {
                keys = keys.filter(key => key != 'activityRange');
            }
            this.state.activityThirdFormKeys[0].keys = keys;
            this.setState({
                activityThirdFormKeys: this.state.activityThirdFormKeys
            });
        }
    }

    renderActivityConditions = () => {
        return (
            <ActivityConditions
                onRef={(node) => { this.activityConditionsRef = node }}
                eventGiftConditionList={this.state.eventGiftConditionList}
                showActivityRange={this.showActivityRange}
            />
        )
    }

    renderCardScopeType = (formItems, key) => {
        formItems[key].render = (decorator, form) => {
            return (
                <Row>
                    <Col span={24} className={styles.cardScopeTypeBox}>
                        {decorator({
                            key: 'cardScopeType'
                        })(
                            <CardLevel
                                catOrCard={'card'}
                                form={form}
                                cardLevelRangeType={this.state.cardLevelRangeType}
                                cardLevelIDList={this.state.cardLevelIDList}
                                defaultCardType={this.state.defaultCardType}
                                type='87'
                            />
                        )}
                    </Col>
                </Row>
            )
        }
    }

    onChangeActivityThirdForm = (key, value, form) => {
        let keys = this.state.activityThirdFormKeys[0].keys;
        if (key == 'hasMutexDepend') { // 与优惠券不共享是否开启
            if (value) {
                let index = keys.indexOf('hasMutexDepend');
                keys.splice(index + 1, 0, 'mutexDependType');
            } else {
                // 与优惠券不共享: 关闭
                let deleteKeys = ['mutexDependType', 'NoShareBenifit'];
                keys = keys.filter(key => !deleteKeys.includes(key));
                this.props.setPromotionDetail({
                    mutexPromotions: []
                });
            }
            this.state.activityThirdFormKeys[0].keys = keys;
            this.setState({
                activityThirdFormKeys: this.state.activityThirdFormKeys
            }, () => {
                const { getFieldsValue, setFieldsValue } = form;
                const { NoShareBenifit } = getFieldsValue()
                setFieldsValue({
                    mutexDependType: NoShareBenifit && NoShareBenifit.length > 0 ? 2 : 1
                })
            })
        }
        else if (key == 'mutexDependType') {
            if (value == 2) { // 与部分优惠券不共享
                let index = keys.indexOf('mutexDependType');
                keys.splice(index + 1, 0, 'NoShareBenifit');
                this.props.setPromotionDetail({
                    mutexPromotions: []
                });
            } else { // 与所有优惠券不共享
                keys = keys.filter(key => key != 'NoShareBenifit');
            }
            this.state.activityThirdFormKeys[0].keys = keys;
            this.setState({
                activityThirdFormKeys: this.state.activityThirdFormKeys
            })
        } else if (key == 'NoShareBenifit') {
            this.selectNoShareBenifit(value)
        } else if (key == 'activityRange') {
            const scopeList = [];
            value.foodCategory.forEach((item) => {
                scopeList.push({
                    scopeType: '1',
                    targetID: item.foodCategoryID,
                    brandID: item.brandID,
                    targetCode: item.foodCategoryKey,
                    targetName: item.foodCategoryName,
                });
            });
            value.excludeDishes.forEach((item) => {
                scopeList.push({
                    scopeType: '4',
                    targetID: item.itemID,
                    brandID: item.brandID,
                    targetCode: item.foodKey,
                    targetName: item.foodName,
                    targetUnitName: item.unit,
                });
            });
            value.dishes.forEach((item) => {
                scopeList.push({
                    scopeType: '2',
                    targetID: item.itemID,
                    brandID: item.brandID,
                    targetCode: item.foodKey,
                    targetName: item.foodName,
                    targetUnitName: item.unit,
                });
            });
            this.setState({
                foodScopeList: scopeList,
            })
        }
    }

    selectNoShareBenifit(val) {
        if (val && val.length > 0) {
            this.props.setPromotionDetail({
                blackList: this.state.blackListRadio != '0',
                mutexPromotions: val.map((promotion) => {
                    return {
                        promotionIDStr: promotion.promotionIDStr || '',
                        sharedType: promotion.sharedType ? promotion.sharedType : '10',
                        finalShowName: promotion.finalShowName,
                    }
                }),
            });
        } else {
            this.props.setPromotionDetail({
                mutexPromotions: []
            })
        }
    }

    findCardTypeIDBycardLevelIDList = (cardLevelIDList) => {
        let list = this.state.clonedGroupCardTypeList;
        let cardTypeIDs = [];
        list.forEach(item => {
            if (item.cardTypeLevelList && item.cardTypeLevelList.length > 0) {
                item.cardTypeLevelList.forEach(newItem => {
                    if (cardLevelIDList.includes(newItem.cardLevelID)) {
                        cardTypeIDs.push(newItem.cardTypeID);
                    }
                })
            }
        })
        cardTypeIDs = [...new Set(cardTypeIDs)];
        let groupCardTypeList = list.filter(item => cardTypeIDs.includes(item.cardTypeID));
        return groupCardTypeList;
    }

    onChangeBaseForm = (key, value, form) => {
        const { resetFields, setFieldsValue, getFieldsValue } = form;
        if (key == 'joinCount') {
            resetFields(['partInTimes2', 'partInTimes3', 'countCycleDays']);
        } else if (key == 'cardScopeType') {// 会员范围
            this.setState({
                ...value
            })
        } else if (key == 'brandList') {
            setFieldsValue({
                shopIDList: []
            })
        } else if (key == 'shopIDList') {
            setFieldsValue({
                shopIDList: value
            })
        }else if(key == 'tagLst'){
            setFieldsValue({
                tagLst: value
            })
        }
    }

    render() {
        const { promotionKey, promotion, formSteps = [] } = this.props;
        const currentPromotion = promotion[promotionKey];
        if (!currentPromotion) return closePage();
        const filterTitle = newPromotionCardPageConfig.find(item => item.key == currentPromotion.promotionKey).title;
        const baseFormKeys = BASE_FORM_KEYS[filterTitle];
        const activityFormKeys = this.state.activityFormKeys;
        const activityThirdFormKeys = this.state.activityThirdFormKeys;
        const formItems = ALL_FORM_ITEMS;

        if (activityFormKeys[0]) {
            if (activityFormKeys[0].keys.includes('shopIDList')) {
                this.renderShopSelector(formItems, 'shopIDList');
            }
            if (activityFormKeys[0].keys.includes('cardScopeType')) {
                this.renderCardScopeType(formItems, 'cardScopeType');
            }
        }

        if (activityThirdFormKeys[0]) {
            if (activityThirdFormKeys[0].keys.includes("mutexDependType")) {
                this.renderMutexDependType(formItems);
            }
            if (activityThirdFormKeys[0].keys.includes("NoShareBenifit")) {
                this.renderNoShareBenifit(formItems);
            }
            if (activityThirdFormKeys[0].keys.includes("activityRange")) {
                this.renderActivityRange(formItems);
            }
        }

        formItems.eventType.render = () => (<p>{filterTitle}</p>);
        const newFormSteps = formSteps.map((item, index) => {
            let newItem = {};
            if (index === 0) {
                newItem = {
                    title: item,
                    formKeys: baseFormKeys,
                }
            }
            if (index === 1) {
                newItem = {
                    title: item,
                    formKeys: activityFormKeys,
                }
            }
            return newItem;
        }) || [];

        return (
            <Col className={styles.PromotionRightMain} style={{ height: 'calc(100vh - 65px)' }} span={24}>
                {
                    newFormSteps.map((item, index) => (
                        <Col key={item.title} className={styles.formBlock}>
                            <Col className={styles.itemTitle}>
                                <span className={styles.line}></span>
                                <div>{item.title}</div>
                            </Col>
                            <BaseForm
                                key={item.title}
                                getForm={(form) => { this.allForms[index] = form }}
                                formKeys={item.formKeys}
                                formItems={formItems}
                                formItemLayout={formItemLayout}
                                formData={this.state.formData}
                                onChange={(key, value) => this.onChangeBaseForm(key, value, this.allForms[index])}
                            />
                        </Col>
                    ))
                }
                <Col className={styles.formBlock}>
                    {
                        this.renderActivityConditions()
                    }
                </Col>
                <Col className={styles.formBlock} span={24}>
                    <BaseForm
                        getForm={(form) => { this.allForms[newFormSteps.length] = form }}
                        formKeys={activityThirdFormKeys}
                        formItems={formItems}
                        formItemLayout={formItemLayout}
                        onChange={(key, value) => this.onChangeActivityThirdForm(key, value, this.allForms[newFormSteps.length])}
                        formData={this.state.activityThirdFormData}
                    />
                </Col>
            </Col>
        )
    }
}

const mapStateToProps = ({ newPromotionCardPagesReducer, sale_promotionDetailInfo_NEW }) => {
    return {
        promotion: newPromotionCardPagesReducer.get('promotion').toJS(),
        isShopFoodSelectorMode: sale_promotionDetailInfo_NEW.get('isShopFoodSelectorMode'),
    }
};

function mapDispatchToProps(dispatch) {
    return {
        updateCurrentPromotionPage: opts => dispatch(updateCurrentPromotionPageAC(opts)),
        setPromotionDetail: (opts) => dispatch(saleCenterSetPromotionDetailAC(opts)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PromotionRightMain)

