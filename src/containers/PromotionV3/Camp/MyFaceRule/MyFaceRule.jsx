import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Icon, Form, Select, message, Input, Button, Tooltip } from 'antd';
import { axios, getStore } from '@hualala/platform-base';
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

// TODO: 合代码时把11157去掉
const GROUPID_SHOW = ['130442', '189702'];
const empty = [{ label: '无', value: '' }];
class MyFaceRule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventSelectOption: [
                { label: '无', value: '', children: [] },
                { label: '小程序', value: '0', children: programList },
                { label: '分享裂变', value: '8', children: [] },
                { label: '膨胀大礼包', value: '9', children: [] },
                { label: '免费领取', value: '3', children: [] },
                { label: '摇奖活动', value: 'event_20', children: [] },
                { label: '完善资料送礼活动', value: 'event_60', children: [] },
                { label: '推荐有礼', value: '13', children: [] },
                { label: '集点活动', value: '15', children: [] },
                { label: '签到活动', value: '16', children: [] },
                { label: '一键拨号', value: '6', children: [] },
                // { label: '自定义页面', value: '1', children: [] },
                // { label: '软文，文本消息', value: '7', children: [] },
                { label: '商城', value: '5', children: [] },
                { label: '跳转至小程序', value: '11', children: [] },
                { label: '盲盒活动', value: '20', children: [] },
                { label: '自定义链接', value: 'customLink' },
                { label: '菜品加入购物车', value: 'shoppingCartAddFood' },
                // { label: '小程序开卡', value: 'toOpenCard' }, // 仅针对九毛九集团可见
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
        // this.searchAllActivity();
        // this.searchAllMallActivity();
        this.searchCrmTag();
        // this.initData()
        this.initEventSelectOption();
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.allActivityList, this.props.allActivityList)) {
            console.log('componentWillReceiveProps执行')
            this.initEventSelectOption();
        }
    }


    onChange = (idx, params) => {
        const { value, onChange } = this.props;
        const list = [...value];
        const faceObj = value[idx];
        list[idx] = { ...faceObj, ...params };
        onChange(list);
    }

    onRange = (idx, key, value) => {
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
        const { value: data } = this.props;
        const hasValue = data.some(d => d.conditionValue == value);
        if (hasValue) return message.warn('不能选择相同的会员标签属性');
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

    onCrmGroup = (idx, key, value) => {
        const { value: data } = this.props;
        const hasValue = data.some(d => d.conditionValue == value);
        if (hasValue) return message.warn('不能选择相同的会员群体属性');
        const item = [].filter(itm => itm.tagCategoryID == value)
        this.onChange(idx, { [key]: value, conditionName: item[0] ? item[0].label : '', targetValue: '', targetName: '' })
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
    }

    onEventsApp = (idx, key, value) => {
        const item = this.state.eventSelectOption.filter(itm => itm.value == value)
        this.onChange(idx, { [key]: value, triggerEventName2: item[0] ? item[0].label : '', triggerEventCustomInfo2: {} })
    }

    onEventsLinkValue = (idx, key, value) => {
        this.onChange(idx, { [key]: { value } })
    }

    onChangeCustomUrl = (idx, key, { target }) => {
        this.onChange(idx, { [key]: { value: target.value } })
        this.setState({
            flag: !this.state.flag,
        })
    }

    // 获取活动
    getAvtivity = (params) => {
        const { allActivityList = [], allMallActivity = [] } = this.props;
        let newActivityList = [];
        if (params === '8') { // 分享裂变
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 65);
        } else if (params === '9') { // 膨胀大礼包
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 66);
        } else if (params === '3') { // 免费领取
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 21);
        } else if (params === 'event_20') { // 摇奖活动
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 20);
        } else if (params === 'event_60') { // 完善资料送礼活动
            // newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 7); // 完善资料送礼活动接口未返回，目前自己定义的
            newActivityList = [{ label: '完善资料送礼', value: 'complete/giftList' }]
        } else if (params === '13') { // 推荐有礼
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 68);
        } else if (params === '15') { // 集点活动
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 75);
        } else if (params === '16') { // 签到活动
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 76);
        } else if (params === '20') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 79);
        } else {
            newActivityList = [];
        }
        let linkUrlOption = [];
        if (params === '5') {
            linkUrlOption = allMallActivity.map((items) => {
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
        linkUrlOption = empty.concat(linkUrlOption);
        let activitySelectOption = [];
        activitySelectOption = [...linkUrlOption];

        if (params === 'event_60') {
            activitySelectOption = [{ ...empty[0] }, { label: '完善资料送礼', value: 'complete/giftList' }]
        }
        return activitySelectOption
    }


    initEventSelectOption = () => {
        let eventList = [];
        const { eventSelectOption } = this.state;
        if (this.props.useApp === '1') { // H5餐厅
            eventList = _.filter(eventSelectOption, item => ['', 'customLink', 'shoppingCartAddFood'].includes(item.value))
        } else { // 小程序2.0
            eventList = _.map(_.filter(eventSelectOption, item => !['', '0', 'customLink', 'shoppingCartAddFood'].includes(item.value)), it => ({ ...it, children: this.getAvtivity(it.value) }))
            const restList = _.filter(eventSelectOption, item => ['', '0'].includes(item.value));
            eventList = restList.concat(eventList)
        }
        console.log(eventList, 'eventList');
        this.setState({
            eventSelectOption: eventList,
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

    showDishSelector = (idx, key) => {
        this.onChange(idx, { [key]: true })
        this.setState({
            isShowDishSelector: true,
        })
    }

    handleModalOk = (i, item, values = []) => {
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
        this.handleModalCancel(i, 'isShowDishSelector');
        this.onChange(i, { 'triggerEventCustomInfo': dishObjects[0] || {} })
    }

    handleModalCancel = (idx, key) => {
        this.onChange(idx, { [key]: false })
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
        // const { activityOption } = this.state;
        const { everyTagsRule } = data;
        const { idx } = target.closest('a').dataset;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(+idx, 1);
        everyTagsRule.splice(+idx, 1)
        // activityOption.splice(+idx, 1)
        onChange(list);
        this.setState({
            everyTagsRule,
            // activityOption,
        })
    }

    renderInput2 = (i, v) => {
        return (<FormItem>
            <Input
                style={{ marginLeft: 8, width: '249px', height: '32px' }}
                onChange={(_v) => { this.onChangeCustomUrl(i, 'triggerEventCustomInfo2', _v) }}
                value={v.triggerEventCustomInfo.value || ''}
                placeholder="请输入要拨打的号码"
            />
        </FormItem>)
    }

    renderInput = (i, v) => {
        return (<FormItem
        // validateStatus={v.triggerEventCustomInfo.value ? 'success' : 'error'} help={v.triggerEventCustomInfo.value ? '' : '请输入自定义链接'}
        >
            <Input
                style={{ marginLeft: 8, width: '249px', height: '32px' }}
                onChange={(_v) => { this.onChangeCustomUrl(i, 'triggerEventCustomInfo', _v) }}
                value={v.triggerEventCustomInfo.value || ''}
            />
            <p>不支持储值套餐链接</p>
        </FormItem>)
    }

    renderOpenCardInput = (i, v) => {
        return (<FormItem>
            <Input
                style={{ marginLeft: 8, width: '249px', height: '32px' }}
                value={'默认开通本店铺适用的线上卡类型'}
                disabled={true}
            />
        </FormItem>)
    }

    renderJumpApp = (i, v) => {
    console.log("🚀 ~ file: MyFaceRule.jsx ~ line 374 ~ MyFaceRule ~ i, v", i, v)
        return (
            <div>
                <p>
                    <span style={{ paddingRight: '12px' }}>微信小程序ID </span>
                    <Input
                        style={{ maxWidth: 220, marginTop: '10px', marginBottom: '10px' }}
                        placeholder="请输入微信小程序ID"
                    />
                </p>
                <p style={{ marginBottom: '10px' }}>
                    <span>支付宝小程序ID </span>
                    <Input
                        style={{ maxWidth: 220 }}
                        placeholder="请输入支付宝小程序ID"
                    />
                </p>
            </div>
        )
    }

    // 选择菜品
    renderFoods = (i, item) => {
        return (
            <FormItem style={{ display: 'inlineBlock', width: '262px', marginLeft: 8, marginTop: 2 }}
            // validateStatus={item.triggerEventCustomInfo.foodName ? 'success' : 'error'} help={item.triggerEventCustomInfo.foodName ? '' : '请选择一个菜品'}
            >
                <Input
                    type="text"
                    style={{ width: 159, height: 32 }}
                    disabled={true}
                    value={item.triggerEventCustomInfo ? item.triggerEventCustomInfo.foodName : ''}
                />
                <Button
                    type="default"
                    // disabled={true}
                    style={{ display: 'inlineBlock', marginLeft: '10px', height: 32 }}
                    onClick={() => { this.showDishSelector(i, 'isShowDishSelector') }}
                >
                    选择菜品
                </Button>
                {
                    (this.state.isShowDishSelector && item.isShowDishSelector) ?
                        this.renderSelectFoods(i, item)
                        : null
                }
            </FormItem>
        )
    }

    renderSelectFoods = (i, item) => {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const data = item.triggerEventCustomInfo.foodName ? [item.triggerEventCustomInfo] : [];
        const initialValue = data.map(itms => `${itms.brandID || 0}__${itms.foodName}${itms.unit}`);
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                mode="dish"
                initialValue={initialValue}
                onOk={(value) => { this.handleModalOk(i, item, value) }}
                onCancel={() => { this.handleModalCancel(i, 'isShowDishSelector') }}
            />
        )
    }

    renderSelect = (i, v) => {
        const options = this.state.eventSelectOption.filter(item => item.value === v.triggerEventValue2) || [];
        const [option] = options;
        return (<FormItem>
            <Select
                style={{ width: '249px', marginLeft: 8 }}
                value={v.triggerEventCustomInfo2.value ? v.triggerEventCustomInfo2.value : ''}
                onChange={(_v) => { this.onEventsLinkValue(i, 'triggerEventCustomInfo2', _v) }}
            >
                {
                    (option.children || []).map(({ value, label }) => {
                        return <Select.Option key={value} value={`${value}`}>{label}</Select.Option>
                    })
                }
            </Select>
        </FormItem>)
    }

    renderH5Events = (v, i) => {
        return (
            <div style={{ display: 'flex' }}>
                <FormItem>
                    <Select style={{ width: '120px' }} value={v.triggerEventValue || ''} onChange={(_v) => { this.onEvents(i, 'triggerEventValue', _v) }}>
                        {
                            (this.state.eventSelectOption || []).map(({ value: key, label }) => {
                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                            })
                        }
                    </Select>
                </FormItem>
                {v.triggerEventValue === 'customLink' && this.renderInput(i, v)}
                {v.triggerEventValue === 'shoppingCartAddFood' && this.renderFoods(i, v)}
            </div>
        )
    }

    renderAPPEvents = (v, i) => {
        return (
            <div>
                <div style={{ display: 'flex' }}>
                    <FormItem
                    // key={unionId}
                    >
                        <Select style={{ width: '120px' }} value={v.triggerEventValue2 || ''} onChange={(_v) => { this.onEventsApp(i, 'triggerEventValue2', _v) }}>
                            {
                                (this.state.eventSelectOption || []).map(({ value: key, label }) => {
                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    {/* 11 跳转小程序和 6 一键拨号 单独处理 */}
                    {v.triggerEventValue2 && v.triggerEventValue2 != '6' && v.triggerEventValue2 != '11' && this.renderSelect(i, v)}
                    {v.triggerEventValue2 == '6' && this.renderInput2(i, v)}
                </div>
                {v.triggerEventValue2 == '11' && this.renderJumpApp(i, v)}
            </div>
        )
    }


    render() {
        const { value = [], form, useApp } = this.props;
        // const { length } = value;
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
                                    {/* 目标范围 */}
                                    <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                        <p> <span className={styles.tip}>*</span>目标范围 <Tooltip placement="top" title="会员标签属性被删除后请重新选择"><Icon type="exclamation-circle" /></Tooltip></p>
                                        <FormItem>
                                            <Select style={{ width: '120px' }} value={`${v.conditionType}`} onChange={(_v) => { this.onRange(i, 'conditionType', _v) }} >
                                                {
                                                    [{ label: '会员身份', value: '1' }, { label: '会员标签', value: '2' }, { label: '会员群体', value: '3' }].map(({ value: key, label }) => {
                                                        return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                    })
                                                }
                                            </Select>
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
                                                <FormItem required={true}
                                                // validateStatus={v.conditionValue ? 'success' : 'error'} help={v.conditionValue ? '' : '请输入会员标签属性'}
                                                >
                                                    <Select style={{ width: '120px', marginLeft: 8 }} value={v.conditionValue} onChange={(_v) => { this.onTagAttribute(i, 'conditionValue', _v) }}>
                                                        {
                                                            // 会员标签如果删除就提示已删除重新选择，需要匹配一下
                                                            (this.state.tagsList || []).map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                </FormItem>
                                                <FormItem required={true} 
                                                // validateStatus={v.targetValue ? 'success' : 'error'} help={v.targetValue ? '' : '请输入会员标签属性'}
                                                >
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
                                        {
                                            v.conditionType == '3' &&
                                            <FormItem required={true}>
                                                <Select style={{ width: '120px', marginLeft: 8 }} value={v.conditionValue} onChange={(_v) => { this.onCrmGroup(i, 'conditionValue', _v) }}>
                                                    {
                                                        ([]).map(({ value: key, label }) => {
                                                            return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                        }
                                    </div>
                                    {/* 点击触发事件 */}
                                    <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                        <p>点击触发事件</p>
                                        { useApp === '1' && this.renderH5Events(v, i) }
                                        { useApp === '2' && this.renderAPPEvents(v, i)}
                                    </div>
                                </div>
                                {/* 添加删除操作 */}
                                <div>
                                    {
                                        i == 0 && <a data-idx={i} href={'javascript:;'} onClick={this.add}>  <Icon type="plus-circle-o" style={{ fontSize: 26, color: '#12B493' }} /> </a>
                                    }
                                    {i > 0 && i < 9 &&
                                        <div style={{ width: 60, cursor: 'pointer' }}>
                                            <a onClick={this.add} data-idx={i} href={'javascript:;'}>  <Icon type="plus-circle-o" style={{ fontSize: 26, color: '#12B493' }} /> </a>
                                            <a onClick={e => this.del(e, v)} data-idx={i} href={'javascript:;'}>
                                                <Icon type="minus-circle-o" style={{ fontSize: 26, color: '#Ed7773' }} />
                                            </a>
                                        </div>
                                    }
                                    {
                                        i >= 9 && <a onClick={e => this.del(e, v)} data-idx={i} href={'javascript:;'}>
                                            <Icon type="minus-circle-o" style={{ fontSize: 26, color: '#Ed7773' }} />
                                        </a>
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
