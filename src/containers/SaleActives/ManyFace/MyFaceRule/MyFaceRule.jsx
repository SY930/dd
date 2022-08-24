import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Icon, Form, Select, message, Input, Button, Tooltip } from 'antd';
import _ from 'lodash';
import { axios, getStore } from '@hualala/platform-base';
import FoodSelectModal from '../../../../components/common/FoodSelector/FoodSelectModal'
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import styles from './styles.less';
import { programList, faceDefVal, eventSelectOptionCopy } from './Commom'
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

// const GROUPID_SHOW = ['130442', '11157', '189702'];
// TODO: 合代码时把11157去掉
const empty = [{ label: '无', value: '' }];
const jumpApp = [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }]
class MyFaceRule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventSelectOption: _.cloneDeep(eventSelectOptionCopy),
            eventSelectOptionCopy,
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
            memberParams: [], // 群体
        };
    }

    componentDidMount() {
        // this.searchAllActivity();
        // this.searchAllMallActivity();
        this.searchCrmTag();
        this.getGroupListAll()
        this.initEventSelectOption();
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(nextProps.allActivityList, this.props.allActivityList) || nextProps.clientType !== this.props.clientType) {
            this.setState({
                allActivityList: nextProps.allActivityList,
                allMallActivity: nextProps.allMallActivity,
            }, () => {
                this.initEventSelectOption(nextProps.clientType);
            })
        } else {
            return false
        }
    }

    componentWillUnmount() {
    }


    onChange = (idx, params) => {
        const { value, onChange } = this.props;
        const list = [...value];
        const faceObj = value[idx];
        list[idx] = { ...faceObj, ...params };
        onChange(list);
    }

    onRange = (idx, key, value) => {
        const { value: data } = this.props;
        if (value == '1') { // 会员身份
            // 已添加两个会员身份则不可在选，因为条件不可重复
            const crmList = data.filter((item) => item.targetName === '持卡会员')
            if (crmList.length >= 2) return message.warning('不能选择相同的会员标签属性')
            this.onChange(idx, { [key]: value, conditionValue: 'whetherHasCard', conditionName: '是否持卡会员', targetName: '持卡会员', targetValue: '' })
            this.setState({
                isShowIdentity: !this.state.isShowIdentity,
                isShowTag: false,
            })
        } else { // 会员标签
            this.onChange(idx, { [key]: value, conditionValue: '', conditionName: '', targetName: '', targetValue: '' })
            this.setState({
                isShowTag: !this.state.isShowTag,
                isShowIdentity: false,
            })
        }
    }

    onIsHaveCard = (idx, key, value) => {
        const { value: data } = this.props;
        const hasValue = data.some(d => d.targetValue == value);
        if (hasValue) return message.warn('会员持卡身份不可重复');
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
        const item = this.state.memberParams.filter(itm => itm.groupMembersID == value)
        this.onChange(idx, { [key]: value, conditionName: item[0] ? item[0].groupMembersName : '', targetValue: '', targetName: '' })
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
        this.onChange(idx, { [key]: value, triggerEventName2: item[0] ? item[0].label : '', triggerEventCustomInfo2: {} })
    }

    onEventsApp = (idx, key, value) => {
        const item = this.state.eventSelectOption.filter(itm => itm.value == value)
        // const triggerEventCustomInfo1 = item[0].value === "jumpToMiniApp" ? jumpApp : {}
        // console.log("🚀 ~ file: MyFaceRule.jsx ~ line 163 ~ MyFaceRule ~ triggerEventCustomInfo1", triggerEventCustomInfo1)
        this.onChange(idx, { [key]: value, triggerEventName1: item[0] ? item[0].label : '', triggerEventCustomInfo1: {}, triggerEventCustomInfoApp1: _.cloneDeep(jumpApp) })
    }

    // 活动数据格式 {"eventID", 1111111111, "eventWay": 20,"eventName": "摇一摇吧"}
    onEventsLinkValue = (idx, key, value, parentName, parentValue) => {
        this.onChange(idx, { [key]: { eventID: value, eventWay: parentValue.split('_')[1], eventName: parentName, shopID: value } })
    }

    onEventsLinkValueApp = (idx, key, value) => {
        this.onChange(idx, { [key]: { value } })
    }

    onChangeCustomUrl = (idx, key, { target }) => {
        this.onChange(idx, { [key]: { value: target.value } })
        this.setState({
            flag: !this.state.flag,
        })
    }

    onChangeAppID = (idx, key, { target }, parent, index) => {
        parent.triggerEventCustomInfoApp1[index].appID = target.value;
        this.onChange(idx, { [key]: parent.triggerEventCustomInfoApp1 })
    }

    // onEvantsImage = (idx, key, value) => {

    // }

    getGroupListAll = () => {
        const { accountInfo } = this.props;
        axios.post('/api/v1/universal', {
            method: '/memberGroup/crmMemberGroupService_querySimpleCrmMemberGroups.ajax',
            service: 'HTTP_SERVICE_URL_CRM',
            type: 'post',
            data: {
                groupID: accountInfo.get('groupID'),
                // groupMembersName: '',
                // pageNo: 1,
                // pageSize: 25,
                // _groupID: accountInfo.get('groupID'),
            },
        }).then((res) => {
            const { code, data: { memberParams = [] } } = res;
            if (code === '000') {
                this.setState({
                    memberParams,
                })
            }
        }).catch((err) => {
            message.error(err);
        })
    }

    // 获取活动
    getAvtivity = (params) => {
        const { allActivityList = [], allMallActivity = [] } = this.state;
        let newActivityList = [];
        if (params === 'event_65') { // 分享裂变
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 65);
        } else if (params === 'event_66') { // 膨胀大礼包
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 66);
        } else if (params === 'event_21') { // 免费领取
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 21);
        } else if (params === 'event_20') { // 摇奖活动
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 20);
        } else if (params === 'event_60') { // 完善资料送礼活动
            // newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 7); // 完善资料送礼活动接口未返回，目前自己定义的
            newActivityList = [{ label: '完善资料送礼', value: '60' }]
        } else if (params === 'event_68') { // 推荐有礼
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 68);
        } else if (params === 'event_75') { // 集点活动
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 75);
        } else if (params === 'event_76') { // 签到活动
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 76);
        } else if (params === 'event_79') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 79);
        } else {
            newActivityList = [];
        }
        let linkUrlOption = [];
        if (params === 'jumpToMall') {
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
            activitySelectOption = [{ ...empty[0] }, { label: '完善资料送礼', value: '60' }]
        }
        return activitySelectOption
    }


    initEventSelectOption = (clientType = '2') => {
        let eventList = [];
        const { eventSelectOptionCopy: eventSelectOption } = this.state;
        if (clientType === '1') { // H5餐厅
            eventList = _.filter(eventSelectOption, item => ['', 'customLink', 'shoppingCartAddFood'].includes(item.value))
        } else { // 小程序3.0
            eventList = _.map(_.filter(eventSelectOption, item => !['', 'miniAppPage'].includes(item.value)), it => ({ ...it, children: this.getAvtivity(it.value) }))
            const restList = _.filter(eventSelectOption, item => ['', 'miniAppPage'].includes(item.value));
            eventList = restList.concat(eventList)
        }
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
                    const { categoryEntries = [] } = item
                    tagsList.push(...categoryEntries)
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
        }).catch((err) => {
            message.error(err);
        })
    }

    showDishSelector = (idx, key) => {
        this.onChange(idx, { [key]: true })
        this.setState({
            isShowDishSelector: true,
        })
    }

    handleModalOk = (i, item, values = [], key) => {
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
        this.onChange(i, { [key]: dishObjects[0] || {} })
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
        const { everyTagsRule } = data;
        const { idx } = target.closest('a').dataset;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(+idx, 1);
        everyTagsRule.splice(+idx, 1)
        onChange(list);
        this.setState({
            everyTagsRule,
        })
    }

    renderInputApp = (i, v) => {
        return (<FormItem>
            <Input
                style={{ marginLeft: 8, width: '249px', height: '32px' }}
                onChange={(_v) => { this.onChangeCustomUrl(i, 'triggerEventCustomInfo1', _v) }}
                value={v.triggerEventCustomInfo1.value || ''}
                placeholder="请输入要拨打的号码"
            />
        </FormItem>)
    }

    renderInput = (i, v, key) => {
        return (<FormItem
        >
            <Input
                style={{ marginLeft: 8, width: '249px', height: '32px' }}
                onChange={(_v) => { this.onChangeCustomUrl(i, key, _v) }}
                value={v[key].value || ''}
            />
            <p>不支持储值套餐链接</p>
        </FormItem>)
    }

    // 跳转至小程序
    renderJumpApp = (i, v) => {
        return (
            <div className={styles.jumpAppBox}>
                <p>
                    <span>微信小程序ID </span>
                    <Input
                        style={{ maxWidth: 220, marginTop: '10px', marginBottom: '10px' }}
                        placeholder="请输入微信小程序ID"
                        defaultValue={_.isArray(v.triggerEventCustomInfoApp1) ? v.triggerEventCustomInfoApp1[0].appID : ''}
                        onChange={(_v) => { this.onChangeAppID(i, 'triggerEventCustomInfoApp1', _v, v, 0) }}
                    />
                </p>
                <p style={{ marginBottom: '10px' }}>
                    <span>支付宝小程序ID </span>
                    <Input
                        style={{ maxWidth: 220 }}
                        placeholder="请输入支付宝小程序ID"
                        defaultValue={_.isArray(v.triggerEventCustomInfoApp1) ? v.triggerEventCustomInfoApp1[1].appID : ''}
                        onChange={(_v) => { this.onChangeAppID(i, 'triggerEventCustomInfoApp1', _v, v, 1) }}
                    />
                </p>
            </div>
        )
    }

    // 选择菜品
    renderFoods = (i, item, key) => {
        return (
            <FormItem style={{ display: 'inlineBlock', width: '262px', marginLeft: 8, marginTop: 2 }}
            >
                <Input
                    type="text"
                    style={{ width: 159, height: 32 }}
                    disabled={true}
                    value={item[key] ? item[key].foodName : ''}
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
                        this.renderSelectFoods(i, item, key)
                        : null
                }
            </FormItem>
        )
    }

    renderSelectFoods = (i, item, key) => {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const data = item[key].foodName ? [item[key]] : [];
        const initialValue = data.map(itms => `${itms.brandID || 0}__${itms.foodName}${itms.unit}`);
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                mode="dish"
                initialValue={initialValue}
                onOk={(value) => { this.handleModalOk(i, item, value, key) }}
                onCancel={() => { this.handleModalCancel(i, 'isShowDishSelector') }}
            />
        )
    }

    renderSelect = (i, v, parentValue, parentName) => {
        const options = this.state.eventSelectOption.filter(item => item.value === v.triggerEventValue1) || [];
        const [option] = options;
        return (<FormItem>
            <Select
                style={{ width: '249px', marginLeft: 8 }}
                value={v.triggerEventCustomInfo1.eventID ? v.triggerEventCustomInfo1.eventID : ''}
                onChange={(_v) => { this.onEventsLinkValue(i, 'triggerEventCustomInfo1', _v, parentName, parentValue) }}
            >
                {
                    (option.children || []).map(({ value, label }) => {
                        return <Select.Option key={value} value={`${value}`}>{label}</Select.Option>
                    })
                }
            </Select>
        </FormItem>)
    }

    // 选择小程序
    renderSelectApp = (i, v) => {
        const options = this.state.eventSelectOption.filter(item => item.value === v.triggerEventValue1) || [];
        const [option] = options;
        return (<FormItem>
            <Select
                style={{ width: '249px', marginLeft: 8 }}
                value={v.triggerEventCustomInfo1.value ? v.triggerEventCustomInfo1.value : ''}
                onChange={(_v) => { this.onEventsLinkValueApp(i, 'triggerEventCustomInfo1', _v) }}
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
                    <Select style={{ width: '120px' }} value={v.triggerEventValue2 || ''} onChange={(_v) => { this.onEvents(i, 'triggerEventValue2', _v) }}>
                        {
                            (this.state.eventSelectOption || []).map(({ value: key, label }) => {
                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                            })
                        }
                    </Select>
                </FormItem>
                {v.triggerEventValue2 === 'customLink' && this.renderInput(i, v, 'triggerEventCustomInfo2')}
                {v.triggerEventValue2 === 'shoppingCartAddFood' && this.renderFoods(i, v, 'triggerEventCustomInfo2')}
            </div>
        )
    }

    renderAPPEvents = (v, i) => {
        console.log("🚀 ~ file: MyFaceRule.jsx ~ line 535 ~ MyFaceRule ~ v, i", v, i, this.state.eventSelectOption)
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ display: 'flex', height: '35px' }}>
                    <FormItem
                    // key={unionId}
                    >
                        <Select style={{ width: '120px' }} value={v.triggerEventValue1 || ''} onChange={(_v) => { this.onEventsApp(i, 'triggerEventValue1', _v) }}>
                            {
                                (this.state.eventSelectOption || []).map(({ value: key, label }) => {
                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                })
                            }
                        </Select>
                    </FormItem>
                    {/* jumpToMiniApp 跳转小程序和 speedDial 一键拨号 单独处理 */}
                    {v.triggerEventValue1 == 'miniAppPage' && this.renderSelectApp(i, v)}
                    {/* 营销活动 */}
                    {v.triggerEventValue1
                    && v.triggerEventValue1 != 'speedDial'
                    && v.triggerEventValue1 != 'jumpToMiniApp'
                    && v.triggerEventValue1 !== 'miniAppPage'
                    && v.triggerEventValue1 !== 'customLink'
                    && v.triggerEventValue1 !== 'shoppingCartAddFood'
                    && v.triggerEventValue1 !== 'toOpenCard'
                    && this.renderSelect(i, v, v.triggerEventValue1, v.triggerEventName1)}
                    {v.triggerEventValue1 == 'speedDial' && this.renderInputApp(i, v)}
                </div>
                {v.triggerEventValue1 == 'jumpToMiniApp' && this.renderJumpApp(i, v)}
                {v.triggerEventValue1 == 'customLink' && this.renderInput(i, v, 'triggerEventCustomInfo1')}
                {v.triggerEventValue1 === 'shoppingCartAddFood' && this.renderFoods(i, v, 'triggerEventCustomInfo1')}
            </div>
        )
    }


    renderAcitveImage = (v, i) => {
        return (
            <div className={styles.activeImageBox}>
                <ImageUploader
                    limit={0}
                    value={v.bannerApp1}
                    onChange={(value) => {
                        this.onChange(i, { bannerApp1: value })
                    }}
                />
                <div className={styles.uploaderTip}>
                    <p>* 图片建议尺寸 526 * 788像素 </p>
                    <p>* 大小不超过1M </p>
                    <p>* 支持png、jpg、jpeg、gif</p>
                </div>
            </div>
        )
    }

    renderMoreBannerAndEvents = (v, i) => {
        console.log("🚀 ~ file: MyFaceRule.jsx ~ line 590 ~ MyFaceRule ~ v", v)
        return (
            <div className={styles.appBannerConntet}>
                {v.bannerApp1Ary.map((item, index) => (
                    <div key={item.id}>
                        <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                            <p>点击触发事件</p>{this.renderAPPEvents(item, index)}
                        </div>
                        <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                            <p>活动主图</p>{this.renderAcitveImage(item, index)}
                        </div>
                    </div>
                ))}
                <Button type="ghost" icon="plus">添加banner</Button>
            </div>

        )
    }


    render() {
        const { value = [], form, clientType, sceneList} = this.props;
        // const { length } = value;
        // 防止回显没数据不显示礼品组件
        if (!value[0]) {
            value.push({ ...faceDefVal });
        }
        return (
            <div>
                {
                    value.map((v, i) => {
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
                                        {/* 会员标签 */}
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
                                        {/* 会员群体 */}
                                        {
                                            v.conditionType == '3' &&
                                            <FormItem required={true}>
                                                <Select style={{ width: '120px', marginLeft: 8 }} value={v.conditionValue} onChange={(_v) => { this.onCrmGroup(i, 'conditionValue', _v) }}>
                                                    {
                                                        (this.state.memberParams || []).map(({ groupMembersID, groupMembersName }) => {
                                                            return <Select.Option key={groupMembersID} value={groupMembersID}>{groupMembersName}</Select.Option>
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                        }
                                    </div>
                                    {/* 小程序3.0 banner情况单独处理 */}
                                    {clientType === '2' && sceneList === '2' ? this.renderMoreBannerAndEvents(v, i)
                                        : <div>
                                            {/* 点击触发事件 */}
                                            <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                                <p>点击触发事件</p>
                                                {clientType == '1' && this.renderH5Events(v, i)}
                                                {clientType == '2' && this.renderAPPEvents(v, i)}
                                            </div>
                                            {/* 活动主图、分为弹窗和banner */}
                                            <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                                <p style={{ paddingTop: '20px' }}> <span className={styles.tip}>*</span>活动主图</p>
                                                {this.renderAcitveImage(v, i)}
                                            </div>
                                        </div>
                                    }
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
