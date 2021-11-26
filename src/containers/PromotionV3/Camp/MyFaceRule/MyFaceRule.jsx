import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Row, Col, Icon, Form, Select, message, Input, Button } from 'antd';
import { axios } from '@hualala/platform-base';
import FoodSelectModal from '../../../../components/common/FoodSelector/FoodSelectModal'
import styles from './styles.less';
import { programList, faceDefVal } from './Commom'
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../../utils';

const FormItem = Form.Item;
const mapStateToProps = (state) => {
    return {
        /** 基本档获取的所有品牌（由店铺schema接口获取，所以似乎品牌下没有店铺的话不会在这里？） */
        allBrands: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'brands']),
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
        accountInfo: state.user.get('accountInfo'),
    }
}
class MyFaceRule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventSelectOption: [
                { label: '无', value: '' },
                // { label: '小程序', value: '0' },
                // { label: '分享裂变', value: '8' },
                // { label: '膨胀大礼包', value: '9' },
                // { label: '免费领取', value: '3' },
                // { label: '盲盒活动', value: '20' },
                // { label: '摇奖活动', value: 'event_20' },
                // { label: '完善资料送礼活动', value: 'event_60' },
                // { label: '推荐有礼', value: '13' },
                // { label: '集点活动', value: '15' },
                // { label: '签到活动', value: '16' },
                // { label: '一键拨号', value: '6' },
                // { label: '自定义页面', value: '1' },
                { label: '自定义链接', value: 'customLink' },
                // { label: '软文，文本消息', value: '7' },
                // { label: '商城', value: '5' },
                // { label: '跳转至小程序', value: '11' },
                { label: '菜品加入购物车', value: 'shoppingCartAddFood' },
            ],
            mallActivityList: [],
            allActivityList: [],
            activityOption: [[]],
            isShowDishSelector: false,
            tagsList: [], // 会员标签的所有属性
            everyTagsRule: [[]], // 所选会员属性的子属性
            tagRuleDetails: [], // 会员所有属性的子属性
            flag: false,
            isShowIdentity: true,
            isShowTag: false,
        };
    }

    componentDidMount() {
        this.searchAllActivity();
        // this.searchAllMallActivity();
        this.searchCrmTag();
        // this.initData()
    }


    onChange = (idx, params) => {
        const { value, onChange } = this.props;
        const list = [...value];
        const faceObj = value[idx];
        list[idx] = { ...faceObj, ...params };
        onChange(list);
    }

    onRange = (idx, key, value) => {
        // console.log("🚀 ~ file: MyFaceRule.jsx ~ line 74 ~ MyFaceRule ~ key, value", key, value)
        if (value == '1') { // 会员身份
            this.onChange(idx, { [key]: value, conditionValue: 'whetherHasCard', conditionName: '是否持卡会员', targetName: '持卡会员', targetValue: '0' })
            this.setState({
                isShowIdentity: true,
                isShowTag: false,
            })
        } else { // 会员标签
            this.onChange(idx, { [key]: value, conditionValue: '', conditionName: '', targetName: '', targetValue: '' })
            this.setState({
                isShowTag: true,
                isShowIdentity: false,
            })
        }
    }

    onIsHaveCard = (idx, key, value) => {
        this.onChange(idx, { [key]: value, targetName: '持卡会员' })
    }

    onTagAttribute = (idx, key, value) => {
        // 筛选标签属性的子属性
        const item = this.state.tagsList.filter(itm => itm.tagCategoryID == value)
        const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == value)
        // const everyTagsRule = [];
        const everyTagsRule = everyTags.map((itm) => {
            return {
                ...itm,
                label: itm.tagName,
                value: itm.tagRuleID,
            }
        });
        this.onChange(idx, { [key]: value, conditionName: item[0] ? item[0].label : '', targetValue: '', targetName: '', everyTagsRule })
    }

    onEveryTagsRule = (idx, key, value, data) => {
        const item = data.everyTagsRule.filter(itm => itm.value == value)
        this.onChange(idx, { [key]: value, targetName: item[0] ? item[0].label : '' })
        this.setState({
            flag: !this.state.flag,
        })
    }

    onEvents = (idx, key, value) => {
        const item = this.state.eventSelectOption.filter(itm => itm.value == value)
        this.onChange(idx, { [key]: value, triggerEventName: item[0] ? item[0].label : '', triggerEventCustomInfo: {} })
        this.getAvtivity(idx, value, key)
    }

    onEventsLinkValue = (idx, key, value) => {
        const { activityOption } = this.state
        const item = (activityOption[idx] || []).filter(itm => itm.value == value)
        this.onChange(idx, { [key]: { eventID: value, eventWay: 20, eventName: item[0] ? item[0].label : '', value } })
        this.setState({
            [key]: { eventID: value, eventWay: 20, eventName: item[0] ? item[0].label : '', value },
        })
    }

    onChangeCustomUrl = (idx, key, { target }) => {
        this.onChange(idx, { [key]: { value: target.value } })
        this.setState({
            flag: !this.state.flag,
        })
    }

    // getEveryTagsRule = (item) => {
    //     if (item.conditionType == '2') {
    //         // const everyTagsRule = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == item.conditionValue)
    //         const { everyTagsRule } = this.state;
    //         const everyTagsRuleOption = [{ label: '无', value: '' }, ...everyTagsRule]
    //         // const tagsList = this.state.tagsList
    //         return everyTagsRuleOption
    //     }
    //     return []
    // }


    // 获取活动
    getAvtivity = (idx, params, key) => {
        const { allActivityList, mallActivityList, activityOption } = this.state;
        let newActivityList = [];
        if (params === '8') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 65);
        } else if (params === '9') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 66);
        } else if (params === '3') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 21);
        } else if (params === 'event_20') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 20);
        } else if (params === 'event_60') { // 完善资料送礼活动
            // newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 7); // 完善资料送礼活动接口未返回，目前自己定义的
            newActivityList = [{ label: '完善资料送礼', value: 'complete/giftList' }]
        } else if (params === '13') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 68);
        } else if (params === '15') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 75);
        } else if (params === '16') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 76);
        } else if (params === '20') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 79);
        } else {
            newActivityList = [];
        }
        // console.log(newActivityList, 'newActivityList')
        let linkUrlOption = [];
        if (params === '5') {
            linkUrlOption = mallActivityList.map((items) => {
                return {
                    label: items.shopName,
                    value: items.shopID.toString(),
                }
            })
        } else {
            linkUrlOption = allActivityList ? newActivityList.map((items) => {
                return {
                    label: items.eventName,
                    value: items.eventID,
                }
            }) : []
        }
        let activitySelectOption = [];
        activitySelectOption = [...linkUrlOption];
        if (!params) {
            activitySelectOption = [{ label: '无', value: '' }]
        } else if (params) {
            if (params === '0') {
                activitySelectOption = [{ label: '无', value: '' }, ...programList]
            } else if (params === 'event_60') {
                activitySelectOption = [{ label: '完善资料送礼', value: 'complete/giftList' }]
            } else if (!linkUrlOption.length) {
                activitySelectOption = [{ label: '无', value: '' }];
            }
        }
        activityOption[idx] = activitySelectOption;
        this.setState({
            activityOption,
            [key]: params,
            // linkUrl: activitySelectOption[0].value,
        })
        // return activitySelectOption
    }


    initData = () => {
        const { value = [] } = this.state;
        const everyTagsRule = [];
        // const { everyTagsRule } = this.state;
        // const item = this.state.tagsList.filter(itm => itm.tagCategoryID == value)
        // const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == value)
        // this.onChange(idx, { [key]: value, conditionName: item[0] ? item[0].label : '', targetValue: '', targetName: '' })
        // // const everyTagsRule = [];
        // everyTagsRule[idx] = everyTags.map((itm) => {
        //     return {
        //         ...itm,
        //         label: itm.tagName,
        //         value: itm.tagRuleID,
        //     }
        // });
        // this.setState({
        //     [`targetValue_${idx}`]: '',
        //     // everyTagsRule: [...e],
        //     everyTagsRule,
        // })
        if (value.length > 0) {
            // value.map((item, idx) => {
            //     if (item.conditionType == '2') { // 会员标签
            //         const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == item.conditionValue)
            //         console.log("🚀 ~ file: MyFaceRule.jsx ~ line 249 ~ MyFaceRule ~ value.map ~ everyTags", everyTags)
            //         everyTagsRule[idx] = everyTags.map((itm) => {
            //             return {
            //                 ...itm,
            //                 label: itm.tagName,
            //                 value: itm.tagRuleID,
            //             }
            //         });
            //     } else {
            //         everyTagsRule[idx] = null;
            //     }
            // })
            // console.log("🚀 ~ _______________________-", everyTagsRule)
            // this.setState({
            //     everyTagsRule,
            // })
        }
    }


    // 查询所有营销活动
    searchAllActivity = () => {
        // TODO: 查询groupID 不能写死
        const { accountInfo, shopID, viewpointID } = this.props;

        const reqParam = {
            groupID: accountInfo.get('groupID'),
        }
        axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
            method: '/specialPromotion/queryListWithoutCustomerInfo.ajax',
            type: 'post',
            data: reqParam,
        }).then((res) => {
            if (res.code === '000') {
                this.setState({
                    allActivityList: res.eventList,
                })
            } else {
                message.error(res.data.message);
            }
        })
    }
    // 查询商城活动
    searchAllMallActivity = () => {
        // TODO: 查询groupID
        const { accountInfo } = this.props;
        axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_SHOPAPI',
            method: '/shop/getShopBaseInfo.svc',
            type: 'post',
            data: {
                groupID: accountInfo.get('groupID'),
                operationMode: '3',
            },
        }).then((res) => {
            if (res.code === '000') {
                this.setState({
                    mallActivityList: res.data.shopBaseInfoDetails,
                })
            } else {
                message.error(res.data.message);
            }
        })
    }

    // 查询会员标签
    searchCrmTag = () => {
        const { accountInfo } = this.props;
        axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_CRM',
            method: '/tag/tagService_queryAllTagsByTagTypeID.ajax',
            type: 'post',
            data: { groupID: accountInfo.get('groupID'), tagTypeIDs: '1,2,3,5' },
        }).then((res) => {
            if (res.code === '000') {
                const { tagRuleDetails = [], tagTypes = [] } = res.data;
                const tagsList = [];
                tagTypes.map((item) => {
                    tagsList.push(...item.categoryEntries)
                })
                // console.log("🚀 ~ file: MyFaceRule.jsx ~ line 252 ~ MyFaceRule ~ tagTypes.map ~ tagsList", tagsList)

                this.setState({
                    tagCategories: res.tagCategories,
                    tagTypes,
                    tagsList: tagsList.map((item) => { // 标签属性
                        return {
                            ...item,
                            label: item.tagCategoryName,
                            value: item.tagCategoryID,
                        }
                    }),
                    tagRuleDetails, // 标签第三步特特征
                })
            } else {
                message.error(res.data.message);
            }
        })
    }

    showDishSelector = () => {
        this.setState({
            isShowDishSelector: true,
        })
    }

    handleModalOk = (i, item, values = []) => {
        console.log("🚀 ~ file: MyFaceRule.jsx ~ line 237 ~ MyFaceRule ~ valuehhhhhhhhh", values)
        if (values.length > 1) {
            message.warn('只能选择一个菜品');
            return;
        }
        if (!values.length) {
            // addToCart = {
            //     foodName: '',
            //     unit: '',
            //     itemID: '',
            // };
            message.warn('请选择一个菜品');
            return;
        }
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const dishObjects = values.reduce((acc, curr) => {
            const dishObj = dishes.find(itm => itm.value === curr);
            if (dishObj) {
                // const reservedDish = this.state.data.find(item => item.value === dishObj.value);
                acc.push({ foodName: dishObj.foodName, unit: dishObj.unit, brandID: dishObj.brandID })
            }
            return acc;
        }, [])
        // console.log(dishObjects, 'dishObjects--------')
        this.onChange(i, { 'triggerEventCustomInfo': dishObjects[0] || {} })
        this.handleModalCancel();
    }

    handleModalCancel = () => {
        this.setState({
            isShowDishSelector: false,
        })
    }

    add = () => {
        const { value, onChange } = this.props;
        if (value[9]) return null
        const list = [...value];
        // const len = list.length;
        const id = Date.now().toString(36); // 随机不重复ID号
        list.push({ ...faceDefVal, id });
        onChange(list);
        return null
    }

    del = ({ target }, data) => {
        const { activityOption } = this.state;
        const { everyTagsRule } = data;
        const { idx } = target.closest('a').dataset;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(+idx, 1);
        everyTagsRule.splice(+idx, 1)
        activityOption.splice(+idx, 1)
        onChange(list);
        this.setState({
            everyTagsRule,
            activityOption,
        })
    }

    renderInput = (i, v) => {
        return (<FormItem>
            <Input
                style={{ marginLeft: 8 }}
                onChange={(_v) => { this.onChangeCustomUrl(i, 'triggerEventCustomInfo', _v) }}
                value={v.triggerEventCustomInfo.value || ''}
            />
            <span>不支持储值套餐链接</span>
        </FormItem>)
    }

    // 选择菜品
    renderFoods = (i, item) => {
        return (
            <div style={{ display: 'inlineBlock', width: '262px', marginLeft: 8, marginTop: 7 }}>
                <Input
                    type="text"
                    style={{ width: 170 }}
                    disabled={true}
                    value={item.triggerEventCustomInfo ? item.triggerEventCustomInfo.foodName : ''}
                />
                <Button
                    type="default"
                    // disabled={true}
                    style={{ display: 'inlineBlock', marginLeft: '10px' }}
                    onClick={this.showDishSelector}
                >
                    选择菜品
                </Button>
                {
                    this.state.isShowDishSelector ?
                        this.renderSelectFoods(i, item)
                        : null
                }
            </div>
        )
    }

    renderSelectFoods = (i, item) => {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const data = item.triggerEventCustomInfo.foodKey ? [item.triggerEventCustomInfo] : [];
        const initialValue = data.map(itms => `${itms.brandID || 0}__${itms.foodName}${itms.unit}`);
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                mode="dish"
                initialValue={initialValue}
                onOk={(value) => { this.handleModalOk(i, item, value) }}
                onCancel={this.handleModalCancel}
            />
        )
    }

    renderSelect = (i, v) => {
        if (v.triggerEventValue == 'customLink' || v.triggerEventValue == 'shoppingCartAddFood') return null;
        return (<FormItem>
            <Select
                style={{ width: '249px', marginLeft: 8 }}
                value={v.triggerEventCustomInfo ? v.triggerEventCustomInfo.value : ''}
                onChange={(_v) => { this.onEventsLinkValue(i, 'triggerEventCustomInfo', _v) }}
            >
                {
                    (this.state.activityOption[i] || []).map(({ value, label }) => {
                        return <Select.Option key={value} value={`${value}`}>{label}</Select.Option>
                    })
                }
            </Select>
        </FormItem>)
    }


    render() {
        const { value = [], decorator } = this.props;
        console.log("🚀 ~ file: MyFaceRule.jsx ~ line 31 ~ MyFaceRule ~ render ~ value", value)
        // const { length } = value;
        // TODO: 查看状态不可编辑
        // 防止回显没数据不显示礼品组件
        if (!value[0]) {
            value.push({ ...faceDefVal });
        }
        return (
            <div>
                {
                    value.map((v, i) => {
                        // const activitySelectOption = this.getAvtivityItem(v.triggerEventValue)
                        return (
                            <div key={v.id} className={styles.MyFaceRuleBox}>
                                <div className={styles.MyFaceRuleConntet}>
                                    <span>规则{i + 1}</span>
                                    <p style={{ height: 24 }}></p>
                                    <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                        <p> <span className={styles.tip}>*</span>目标范围</p>
                                        <FormItem>
                                            <Select style={{ width: '120px' }} value={`${v.conditionType}`} onChange={(_v) => { this.onRange(i, 'conditionType', _v) }} >
                                                {
                                                    [{ label: '会员身份', value: '1' }, { label: '会员标签', value: '2' }].map(({ value: key, label }) => {
                                                        return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                            {/* )
                                            } */}
                                        </FormItem>
                                        {
                                            v.conditionType == '1' &&
                                            <div style={{ display: 'flex' }}>
                                                <FormItem>
                                                    <Select style={{ width: '120px', marginLeft: 8 }} value={'whetherHasCard'}>
                                                        {
                                                            [{ label: '是否持卡会员', value: 'whetherHasCard' }].map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
 
                                                </FormItem>
                                                <FormItem>
                                                    <Select style={{ width: '120px', marginLeft: 8 }} value={v.targetValue} onChange={(_v) => { this.onIsHaveCard(i, 'targetValue', _v) }}>
                                                        {
                                                            [{ label: '是', value: '1' }, { label: '否', value: '0' }].map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        }
                                        {
                                            v.conditionType == '2' &&
                                            <div style={{ display: 'flex' }}>
                                                <FormItem>
                                                    <Select style={{ width: '120px', marginLeft: 8 }} value={v.conditionValue} onChange={(_v) => { this.onTagAttribute(i, 'conditionValue', _v) }}>
                                                        {
                                                            // TODO: 会员标签如果删除就提示已删除重新选择，需要匹配一下
                                                            (this.state.tagsList || []).map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                </FormItem>
                                                <FormItem>
                                                    <Select style={{ width: '120px', marginLeft: 8 }} value={v.targetValue} onChange={(_v) => { this.onEveryTagsRule(i, 'targetValue', _v, v) }}>
                                                        {
                                                            (v.everyTagsRule || []).map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                </FormItem>
                                            </div>
                                        }
                                    </div>
                                    <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                        <p>点击触发事件</p>
                                        <FormItem>
                                            <Select style={{ width: '120px' }} value={v.triggerEventValue} onChange={(_v) => { this.onEvents(i, 'triggerEventValue', _v) }}>
                                                {
                                                    (this.state.eventSelectOption || []).map(({ value: key, label }) => {
                                                        return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                        {(v.triggerEventValue == 'customLink') && this.renderInput(i, v, decorator)}
                                        {v.triggerEventValue == 'shoppingCartAddFood' && this.renderFoods(i, v, decorator)}
                                        {/* {this.renderSelect(i, v, decorator, [])} */}
                                    </div>
                                </div>
                                <div>
                                    {
                                        i == 0 && <a data-idx={i} href={'javascript:;'} onClick={this.add}>  <Icon type="plus-circle-o" style={{ fontSize: 26, color: '#12B493' }} /> </a>
                                    }
                                    {i > 0 &&
                                        <div style={{ width: 60, cursor: 'pointer' }}>
                                            <a onClick={this.add} data-idx={i} href={'javascript:;'}>  <Icon type="plus-circle-o" style={{ fontSize: 26, color: '#12B493' }} /> </a>
                                            <a onClick={e => this.del(e, v)} data-idx={i} href={'javascript:;'}>
                                                <Icon type="minus-circle-o" style={{ fontSize: 26, color: '#Ed7773' }} />
                                            </a>
                                        </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                }

            </div>
        )
    }
}

export default connect(mapStateToProps)(MyFaceRule);
