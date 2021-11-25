import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Row, Col, Icon, Form, Select, message, Input, Button } from 'antd';
import { axios } from '@hualala/platform-base';
import FoodSelectModal from '../../../../components/common/FoodSelector/FoodSelectModal'
import styles from './styles.less';
import { programList } from './Commom'
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
        console.log(props, 'propspropsprops')
        super(props);
        this.state = {
            eventSelectOption: [
                { label: '无', value: '' },
                // { label: '小程序', value: '0' },
                // { label: '分享裂变', value: '8' },
                // { label: '膨胀大礼包', value: '9' },
                // { label: '免费领取', value: '3' },
                // { label: '盲盒活动', value: '20' },
                { label: '摇奖活动', value: '4' },
                { label: '完善资料送礼活动', value: '14' },
                // { label: '推荐有礼', value: '13' },
                // { label: '集点活动', value: '15' },
                // { label: '签到活动', value: '16' },
                // { label: '一键拨号', value: '6' },
                // { label: '自定义页面', value: '1' },
                { label: '自定义链接', value: '10' },
                // { label: '软文，文本消息', value: '7' },
                // { label: '商城', value: '5' },
                // { label: '跳转至小程序', value: '11' },
                { label: '菜品加入购物车', value: '18' },
            ],
            mallActivityList: [],
            allActivityList: [],
            activityOption: [],
            isShowDishSelector: false,
            tagCategories: [],
        };
    }

    componentDidMount() {
        this.searchAllActivity();
        // this.searchAllMallActivity();
        this.searchCrmTag();
    }


    onChange = (idx, params) => {
        const { value, onChange } = this.props;
        const list = [...value];
        const faceObj = value[idx];
        list[idx] = { ...faceObj, ...params };
        onChange(list);
    }

    onEvents = (idx, key, value) => {
        this.onChange(idx, { [key]: value, linkUrl: '' })
        this.getAvtivity(value, key)
    }

    onEventsLinkValue = (idx, key, value) => {
        this.onChange(idx, { [key]: value })
        this.setState({
            [key]: value,
        })
    }

    getAvtivityItem = (params) => {
        const { activityOption } = this.state
        let linkUrlOption = [];
        if (params === '5') {
            // linkUrlOption = mallActivityList.map((items) => {
            //     return {
            //         label: items.shopName,
            //         value: items.shopID.toString(),
            //     }
            // })
        } else {
            linkUrlOption = activityOption ? activityOption.map((items) => {
                return {
                    label: items.eventName || items.label,
                    value: items.eventID || items.value,
                }
            }) : []
        }
        let activitySelectOption = [];
        activitySelectOption = [{ label: '无', value: '' }, ...linkUrlOption];
        if (!params) {
            activitySelectOption = [{ label: '无', value: '' }]
        } else if (params) {
            if (params === '0') {
                activitySelectOption = [{ label: '无', value: '' }]
            } else if (params === '14') {
                activitySelectOption = [{ label: '无', value: '' }, { label: '完善资料送礼', value: 'complete/giftList' }]
            } else if (!linkUrlOption.length) {
                activitySelectOption = [{ label: '无', value: '' }, ...activityOption];
            }
        }
        return activitySelectOption
    }

    // 获取活动
    getAvtivity = (params, key) => {
        const { allActivityList, mallActivityList } = this.state;
        let newActivityList = [];
        if (params === '8') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 65);
        } else if (params === '9') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 66);
        } else if (params === '3') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 21);
        } else if (params === '4') {
            newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 20);
        } else if (params === '14') { // 完善资料送礼活动
            // newActivityList = allActivityList && allActivityList.filter((item = []) => item.eventWay === 7); // 完善资料送礼活动接口未返回，目前自己定义的
            newActivityList = [{ label: '无', value: '' }, { label: '完善资料送礼', value: 'complete/giftList' }]
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
        activitySelectOption = [{ label: '无', value: '' }, ...linkUrlOption];
        if (!params) {
            activitySelectOption = [{ label: '无', value: '' }]
        } else if (params) {
            if (params === '0') {
                activitySelectOption = [{ label: '无', value: '' }, ...programList]
            } else if (params === '14') {
                activitySelectOption = [{ label: '无', value: '' }, { label: '完善资料送礼', value: 'complete/giftList' }]
            } else if (!linkUrlOption.length) {
                activitySelectOption = [{ label: '无', value: '' }];
            }
        }
        this.setState({
            activityOption: activitySelectOption,
            [key]: params,
            linkUrl: activitySelectOption[0].value,
        })
        // return activitySelectOption
    }


    // 查询所有营销活动
    searchAllActivity = () => {
        // TODO: 查询groupID 不能写死
        const { accountInfo, shopID, viewpointID } = this.props;

        let reqParam;
        if (viewpointID === '4') {
            reqParam = {
                 groupID: accountInfo.get('groupID'),
                // shopID,
            }
        } else {
            reqParam = {
                groupID,
            }
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
            service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
            method: '/tag/tagService_queryTagsByTagTypeID.ajax',
            type: 'post',
            data: { groupID: accountInfo.get('groupID'), tagTypeID: '3' },
        }).then((res) => {
            if (res.code === '000') {
                this.setState({
                    tagCategories: res.tagCategories,
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
        // console.log("🚀 ~ file: MyFaceRule.jsx ~ line 237 ~ MyFaceRule ~ value", values)
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
                acc.push({ ...dishObj })
            }
            return acc;
        }, [])
        console.log(dishObjects, 'dishObjects--------')
        this.onChange(i, { 'triggerEventCustomInfo': dishObjects[0] || {} })
        this.handleModalCancel();
    }

    handleModalCancel = () => {
        this.setState({
            isShowDishSelector: false,
        })
    }

    add = () => {
        const { value } = this.props;
    }

    // del = () => {

    // }


    renderInputMultiline = (i, v) => {
    }

    renderInput = (i, v, d) => {
        return (<FormItem>
            {
                d({
                    key: 'triggerEventCustomInfo',
                    initialValue: v.triggerEventCustomInfo,
                    onChange: (_v) => { this.onChange(i, { 'triggerEventCustomInfo': _v }) },
                    rules: [{
                        require: true,
                        validator: () => {

                        },
                    }],
                })(
                    <Input style={{ marginLeft: 8 }} />
                )
            }
            <span>不支持储值套餐链接</span>
        </FormItem>)
    }

    // 选择菜品
    renderFoods = (i, item) => {
        return (
            <div style={{ display: 'inlineBlock', width: '262px' }}>
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
        const data = item.triggerEventCustomInfo ? [item.triggerEventCustomInfo] : [];
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

    renderSelect = (i, v, d, activitySelectOption) => {
        if (v.events == '11' || v.events == '6' || v.events == '10' || v.events == '18') return null;
        return (<FormItem>
            {
                d({
                    key: 'linkUrl',
                    initialValue: this.state.linkUrl,
                    onChange: (_v) => { this.onEventsLinkValue(i, 'linkUrl', _v) },
                    rules: [{
                        require: true,
                        validator: () => {

                        },
                    }],
                })(
                    <Select style={{ width: '240px', marginLeft: 8 }} value={this.state.linkUrl} >
                        {
                            (activitySelectOption || []).map(({ value, label }) => {
                                return <Select.Option value={`${value}`}>{label}</Select.Option>
                            })
                        }
                    </Select>
                )
            }
        </FormItem>)
    }


    render() {
        const { value = [], decorator } = this.props;
        console.log("🚀 ~ file: MyFaceRule.jsx ~ line 31 ~ MyFaceRule ~ render ~ value", value)
        const { length } = value;
        // TODO: 查看状态不可编辑
        // 防止回显没数据不显示礼品组件
        if (!value[0]) {
            value.push({ id: '1' });
        }

        return (
            <div>
                {
                    value.map((v, i) => {
                        const activitySelectOption = this.getAvtivityItem(v.events)
                        // console.log("🚀 ~ file: MyFaceRule.jsx ~ line 246 ~ MyFaceRule ~ value.map ~ acto", activitySelectOption)
                        return (
                            <div key={v.id} className={styles.MyFaceRuleBox}>
                                <div className={styles.MyFaceRuleConntet}>
                                    <span>规则{i + 1}</span>
                                    <p style={{ height: 24 }}></p>
                                    <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                        <p> <span className={styles.tip}>*</span>目标范围</p>
                                        <FormItem>
                                            {
                                                decorator({
                                                    key: 'range',
                                                    initialValue: '',
                                                    onChange: this.onRange,
                                                    rules: [{
                                                        require: true,
                                                        validator: () => {

                                                        },
                                                    }],
                                                })(
                                                    <Select style={{ width: '120px' }}>
                                                        {
                                                            [{ label: '会员身份', value: 'memberShip' }, { label: '会员标签', value: 'memberLabel' }].map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        {
                                            v.range === 'memberShip' &&
                                            <FormItem>
                                                {
                                                    decorator({
                                                        key: 'isHaveCard',
                                                        initialValue: '',
                                                        onChange: this.onIsHaveCard,
                                                        rules: [{
                                                            require: true,
                                                            validator: () => {

                                                            },
                                                        }],
                                                    })(
                                                        <Select style={{ width: '120px' }}>
                                                            {
                                                                [{ label: '是', value: '1' }, { label: '否', value: '0' }].map(({ value: key, label }) => {
                                                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        }
                                        {
                                            v.range === 'memberLabel' &&
                                            <FormItem>
                                                {
                                                    decorator({
                                                        key: 'attribute',
                                                        initialValue: '',
                                                        onChange: this.onIsHaveCard,
                                                        rules: [{
                                                            require: true,
                                                            validator: () => {

                                                            },
                                                        }],
                                                    })(
                                                        <Select style={{ width: '120px' }}>
                                                            {
                                                                [{ label: '会员星座', value: '1' }, { label: '活跃度', value: '0' }, { label: '消费特征', value: '2' }].map(({ value: key, label }) => {
                                                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        }
                                        {
                                            v.range === 'memberLabel' &&
                                            <FormItem>
                                                {
                                                    decorator({
                                                        key: 'thirdAttribute',
                                                        initialValue: '',
                                                        onChange: this.onIsHaveCard,
                                                        rules: [{
                                                            require: true,
                                                            validator: () => {

                                                            },
                                                        }],
                                                    })(
                                                        <Select style={{ width: '120px' }}>
                                                            {
                                                                [].map(({ value: key, label }) => {
                                                                    return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    )
                                                }
                                            </FormItem>
                                        }
                                    </div>
                                    <div className={styles.MyFaceRuleSubConntet} style={{ display: 'flex' }}>
                                        <p>点击触发事件</p>
                                        <FormItem>
                                            {
                                                decorator({
                                                    key: 'events',
                                                    initialValue: '',
                                                    onChange: (_v) => { this.onEvents(i, 'events', _v) },
                                                    rules: [{
                                                        require: true,
                                                        validator: () => {

                                                        },
                                                    }],
                                                })(
                                                    <Select style={{ width: '120px' }}>
                                                        {
                                                            (this.state.eventSelectOption || []).map(({ value: key, label }) => {
                                                                return <Select.Option key={key} value={`${key}`}>{label}</Select.Option>
                                                            })
                                                        }
                                                    </Select>
                                                )
                                            }
                                        </FormItem>
                                        { v.events == '11' && this.renderInputMultiline(i, v, decorator) }
                                        {/*  一键拨号、自定义链接} */}
                                        { (v.events == '6' || v.events == '10') && this.renderInput(i, v, decorator) }
                                        { v.events == '18' && this.renderFoods(i, v, decorator) }
                                        { this.renderSelect(i, v, decorator, activitySelectOption) }
                                    </div>
                                </div>
                                <div>
                                    {/* {
                                        i == 0 && <div onClick={this.add}>  <Icon type="plus-circle-o" style={{ fontSize: 26, color: '#12B493' }} /> </div>
                                    }
                                    {i > 0 && */}
                                        <div style={{ width: 60 }}>
                                            <span onClick={this.add}>  <Icon type="plus-circle-o" style={{ fontSize: 26, color: '#12B493' }} /> </span>
                                            <span onClick={this.onDel}>
                                                <Icon type="minus-circle-o" style={{ fontSize: 26, color: '#Ed7773' }} />
                                            </span>
                                        </div>
                                    {/* } */}
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
