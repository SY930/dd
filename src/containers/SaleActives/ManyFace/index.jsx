
import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Modal, Steps, Button, message, Radio } from 'antd';
import moment from 'moment';
import _ from 'lodash'
import { jumpPage, closePage, axios } from '@hualala/platform-base';
import Step1 from './Step1'
import Step2 from './Step2'
import {
    fetchFoodMenuInfoLightAC, fetchFoodCategoryInfoLightAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import { fetchPromotionScopeInfo } from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action'
import {
    saleCenterSetSpecialBasicInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action';
import { getEvent, searchAllActivity, searchAllMallActivity, postEvent, putEvent, queryActiveList } from './AxiosFactory';
import { asyncParseForm } from '../../../helpers/util'
import styles from './ManyFace.less'

const DF = 'YYYYMMDD';
const RadioGroup = Radio.Group;
class ManyFace extends Component {
    constructor() {
        super()
        this.state = {
            formData1: {}, // 第1步的表单原始数据，也是用来回显baseform的数据
            formData2: {}, // 第2步的表单原始数据
            brandList: [],
            sceneList: [],
            form1: null,
            authLicenseData: {},
            tagRuleDetails: [],
            allActivity: [],
            allMallActivity: [],
            formDataLen: 0, // 数据的长度
            flag: false,
        }
    // this.formRef = null;
    // this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.getInitData();
        this.searchCrmTag();
        this.props.getSubmitFn(this.handleSubmit);
    }

    onSetForm1 = (form) => {
        this.setState({ form1: form });
    }

    onCloseViewRuleModal = () => {
        this.setState({ viewRuleVisible: false })
    }

    onChangeForm = (key, value) => {
        const { form1 } = this.state
        if (value === '1' && key === 'clientType') {
            form1 && form1.setFieldsValue({ sceneList: '1' })
        }
        if (value === '2' && key === 'sceneList') {
            form1 && form1.setFieldsValue({ triggerSceneList: ['11'] })
        }
        this.setState({
            flag: !this.state.flag,
            // 投放类型
        })
    }

    onCheckBannerApp = (faceRule) => {
        let flag = false;
        const range = faceRule.some(item => !item.conditionType); // 会员范围不能为空
        if (range) {
            flag = true
            return message.warning('请选择会员范围')
        }
        // faceRule.some(item => !item.)
        for (let i = 0; i < faceRule.length; i++) {
            const item = faceRule[i];
            if (item.conditionType == 2 || item.conditionType == 1) {  // 会员身份1， 会员标签2 会员群体3
                if (!item.conditionValue) {
                    flag = true;
                    message.warn('请选择会员标签')
                    break
                }
                if (!item.targetValue) {
                    flag = true;
                    message.warn('请选择会员标签属性')
                    break
                }
            }
            if (item.conditionType == 3) {
                if (!item.conditionValue) {
                    flag = true;
                    message.warn('请选择会员群体属性')
                    break
                }
            }
            const eventFlage = item.triggerEventInfoList.some(itm => _.isEmpty(itm.triggerEventCustomInfo) || itm.triggerEventCustomInfo === '{}' || item.triggerEventValue)
            if (eventFlage) {
                flag = true;
                message.warning('请选择触发事件~~')
                break;
            }
            const bannerImageFlage = item.triggerEventInfoList.some(itm => !itm.decorateInfo.imagePath)
            if (bannerImageFlage) {
                flag = true;
                message.warning('请上传活动图片')
                break;
            }
            // item.triggerEventInfoList.
            for (let j = 0; j < item.triggerEventInfoList.length; j++) {
                const curBanner = item.triggerEventInfoList[j]
                if (curBanner.triggerEventValue === 'jumpToMiniApp') {
                    const triggerEventCustomInfo = JSON.parse(curBanner.triggerEventCustomInfo);
                    const noAppID = triggerEventCustomInfo.every(cur => !cur.appID);
                    if (noAppID) {
                        flag = true
                        message.warn('请填写appID')
                        return null
                    }
                }
            }
        }
        // console.log(flag, 'flag')
        return flag;
    }


    onCheck = (faceRule) => {
        // console.log(faceRule, 'faceRule-------'); // TODO  历史数据小程序开卡去掉
        let flag = false;
        const range = faceRule.some((item) => !item.conditionType); // 会员范围不能为空
        if (range) {
            flag = true
            return message.warning('请选择会员范围')
        }
        faceRule.map((itm) => {
            if (itm.conditionType == 2 || itm.conditionType == 1) {  // 会员身份1， 会员标签2 会员群体3
                if (!itm.conditionValue) {
                    flag = true;
                    message.warn('请选择会员标签')
                    return null
                }
                if (!itm.targetValue) {
                    flag = true;
                    message.warn('请选择会员标签属性')
                    return null
                }
            }
            if (itm.conditionType == 3) {
                if (!itm.conditionValue) {
                    flag = true;
                    message.warn('请选择会员群体属性')
                    return null
                }
            }
            if (!itm.triggerEventValue) {
                flag = true;
                message.warn('请选择触发事件')
                return null
            }
            if (itm.triggerEventCustomInfo === '{}') {
                flag = true;
                message.warn('请选择触发事件~~')
                return null
            }
            if (itm.triggerEventValue === 'jumpToMiniApp') {
                const triggerEventCustomInfo = JSON.parse(itm.triggerEventCustomInfo);
                const noAppID = triggerEventCustomInfo.every(cur => !cur.appID);
                if (noAppID) {
                    flag = true
                    message.warn('请填写appID')
                    return null
                }
            }
            if (!itm.decorateInfo.imagePath) {
                flag = true;
                message.warn('请选上传图片')
                return null
            }
        })
        // console.log(flag, 'flag')
        return flag;
    }

    // 小程序3.0 banner
    onPreSubmitAppBanner = (faceData, values) => {
        console.log("🚀 ~ file: index.jsx ~ line 194 ~ ManyFace ~ faceData", faceData)
        const formData2 = faceData.map((item) => {
            item.triggerEventInfoList = item.triggerEventInfoList.map((itm) => {
                if (['miniAppPage', 'speedDial', 'customLink'].includes(itm.triggerEventValue1)) {
                    itm.triggerEventCustomInfo = itm.triggerEventCustomInfo1.value || '';
                } else if (['jumpToMiniApp'].includes(itm.triggerEventValue1)) {
                    itm.triggerEventCustomInfo = JSON.stringify(itm.triggerEventCustomInfoApp1)
                } else {
                    itm.triggerEventCustomInfo = JSON.stringify(itm.triggerEventCustomInfo1)
                }
                itm.triggerEventValue = itm.triggerEventValue1;
                itm.triggerEventName = itm.triggerEventName1;
                itm.decorateInfo = itm.decorateInfo;
                return {
                    ...itm,
                }
            })
            item.triggerEventInfoList = _.map(item.triggerEventInfoList, bItem =>
                (_.omit(bItem, ['triggerEventCustomInfo2', 'triggerEventValue2', 'triggerEventName2',
                    'triggerEventCustomInfoApp1', 'everyTagsRule', 'isShowDishSelector', 'id',
                    'triggerEventCustomInfo1', 'triggerEventValue1', 'triggerEventName1',
                ]))
            )
            item.clientType = '2'

            return {
                ...item,
            }
        })
        console.log(formData2, '<<<<formData2')
        return formData2
    }

    // 小程序3.0
    onPreSubmitApp = (faceData, values) => {
        console.log("🚀 ~ file: index.jsx ~ line 225 ~ ManyFace ~ faceData", faceData)
        const formData2 = faceData.map((item) => {
            if (['miniAppPage', 'speedDial', 'customLink'].includes(item.triggerEventValue1)) {
                item.triggerEventCustomInfo = item.triggerEventCustomInfo1.value || '';
            } else if (['jumpToMiniApp'].includes(item.triggerEventValue1)) {
                item.triggerEventCustomInfo = JSON.stringify(item.triggerEventCustomInfoApp1)
            } else {
                item.triggerEventCustomInfo = JSON.stringify(item.triggerEventCustomInfo1)
            }
            item.triggerEventValue = item.triggerEventValue1;
            item.triggerEventName = item.triggerEventName1;
            item.clientType = '2'
            item.decorateInfo = item.decorateInfo;
            return {
                ...item,
            }
        })
        return formData2
    }

    onPreSubmitH5 = (faceData, values) => {
        const formData2 = faceData.map((item) => {
            if (['customLink'].includes(item.triggerEventValue2)) {
                item.triggerEventCustomInfo = item.triggerEventCustomInfo2.value || '';
            } else {
                item.triggerEventCustomInfo = JSON.stringify(item.triggerEventCustomInfo2)
            }
            item.triggerEventName = item.triggerEventName2;
            item.triggerEventValue = item.triggerEventValue2;
            item.clientType = '1'
            item.decorateInfo = item.decorateInfo;
            return {
                ...item,
            }
        })
        return formData2
    }

    onSubmit = (values, formData2) => {
        const { itemID } = this.props
        const { eventRange, timeList, validCycle = [], cycleType, ...others1 } = values;
        const newEventRange = this.formatEventRange(eventRange);
        const newTimeList = this.formatTimeList(timeList);

        let cycleObj = {};
        if (cycleType) {
            const cycle = validCycle.filter(x => (x[0] === cycleType));
            cycleObj = { validCycle: cycle };
        }
        // shopRange全部店铺和部分店铺的
        const event = { ...others1, ...newEventRange, cycleType, ...cycleObj, ...others1, eventWay: '85', shopRange: '1' };
        delete event.faceRule
        const eventConditionInfos = _.map(formData2, item =>
            (_.omit(item, ['triggerEventCustomInfo2', 'triggerEventValue2', 'triggerEventName2',
                'triggerEventCustomInfoApp1', 'everyTagsRule', 'isShowDishSelector', 'id',
                'triggerEventCustomInfo1', 'triggerEventValue1', 'triggerEventName1',
            ]))
        )
        if (itemID) {
            const allData = { timeList: newTimeList, event: { ...event, itemID, isActive: this.props.activeStatus }, eventConditionInfos };
            postEvent(allData)
            return
        }
        const allData = { event, eventConditionInfos };
        putEvent({ ...allData }).then((res) => {
            if (res.code === '000') {
                closePage()
                jumpPage({ pageID: '1000076003' })
            }
        }) 
    }

    getInitData = () => {
        const { fetchFoodCategoryLightInfo, fetchFoodMenuLightInfo, accountInfo, fetchPromotionScopeInfoAC } = this.props
        const groupID = accountInfo.get('groupID');
        // 获取菜品分类
        fetchFoodCategoryLightInfo({ groupID, shopID: this.props.user.shopID }); // 菜品分类轻量级接口
        fetchFoodMenuLightInfo({ groupID, shopID: this.props.user.shopID }); // 轻量级接口
        fetchPromotionScopeInfoAC({ groupID }) // 品牌
  
        // 获取商城和营销活动
        Promise.all([searchAllActivity(), searchAllMallActivity()]).then((data = []) => {
            this.setState({
                allActivity: data[0] || [],
                allMallActivity: data[1] || [],
            })
        }).catch(() => {
            this.setState({
                allActivity: [],
                allMallActivity: [],
            })
        })
    }
  
    // TODO: //需要重新写
    getEventDetail() {
        const { itemID } = this.props;
        if (itemID) {
            // getEvent({ itemID }).then((obj) => {
                const obj = {
                    "groupID": "11157",
                    "data": {
                      "eventName": "千人千面",
                      "clientType": "2",
                      "sceneList": "2",
                      "triggerSceneList": [
                        "11"
                      ],
                      "shopIDList": [
                        "76058319"
                      ],
                      excludedDate: ["20220818"],
                      cycleType: "w",
                      validCycle: ["w1", "w3"],
                      "eventStartDate": "20220826",
                      "eventEndDate": "20220920",
                      "eventWay": "85",
                      "shopRange": "1",
                      "groupID": "11157",
                      "userName": "xinweixin",
                      "userID": "206787"
                    },
                    "eventConditionInfos": [
                      {
                        "conditionType": "1",
                        "conditionName": "是否持卡会员",
                        "conditionValue": "whetherHasCard",
                        "targetName": "持卡会员",
                        "targetValue": "1",
                        "triggerEventInfoList": [
                          {
                            "parentId": "0",
                            "decorateInfo": {
                              "imagePath": "http://res.hualala.com/basicdoc/65ee73f7-7dbc-455e-962f-e12056d319dd.jpeg"
                            },
                            "triggerEventCustomInfo": "234",
                            "triggerEventValue": "customLink",
                            "triggerEventName": "自定义链接"
                          },
                          {
                            "decorateInfo": {
                              "imagePath": "http://res.hualala.com/basicdoc/1f4a4ee1-7201-45c7-a767-f9c11bb3e035.png"
                            },
                            "parentId": "0",
                            "triggerEventCustomInfo": "{\"foodName\":\"苹果茶\",\"unit\":\"份\",\"brandID\":\"0\"}",
                            "triggerEventValue": "shoppingCartAddFood",
                            "triggerEventName": "菜品加入购物车"
                          }
                        ],
                        "decorateInfo": {
                          "imagePath": ""
                        },
                        "clientType": "2"
                      },
                      {
                        "conditionType": "3",
                        "conditionName": "测试卡群体",
                        "conditionValue": "7133035308139940757",
                        "targetName": "",
                        "targetValue": "",
                        "triggerEventInfoList": [
                          {
                            "decorateInfo": {
                              "imagePath": "http://res.hualala.com/basicdoc/2a5765e7-d307-4464-ab4a-3a80926d6aca.jpeg"
                            },
                            "parentId": "l7a2uohf",
                            "triggerEventCustomInfo": "/customer/cardList",
                            "triggerEventValue": "miniAppPage",
                            "triggerEventName": "小程序"
                          },
                          {
                            "decorateInfo": {
                              "imagePath": "http://res.hualala.com/basicdoc/df79de6c-7d64-4c85-8225-2be8fef19374.png"
                            },
                            "parentId": "l7a2uohf",
                            "triggerEventCustomInfo": "2222",
                            "triggerEventValue": "speedDial",
                            "triggerEventName": "一键拨号"
                          },
                          {
                            "decorateInfo": {
                              "imagePath": "http://res.hualala.com/basicdoc/b2d2e642-fd37-468e-a48d-a40d36e06075.png"
                            },
                            "parentId": "l7a2uohf",
                            "triggerEventCustomInfo": "{\"eventID\":\"7099385789861330949\",\"eventWay\":\"65\",\"eventName\":\"分享裂变\",\"shopID\":\"7099385789861330949\"}",
                            "triggerEventValue": "event_65",
                            "triggerEventName": "分享裂变"
                          }
                        ],
                        "decorateInfo": {
                          "imagePath": ""
                        },
                        "clientType": "2"
                      },
                    ],
                    timeList: [{startTime: "1730", endTime: "1859"}, {startTime: "2020", endTime: "2320"}]
                  }
                const { data, eventConditionInfos = [], timeList } = obj;
                const { step1Data, setp2Data } = this.setData4Step1(data, eventConditionInfos, timeList);
                const formData2 = this.setData4Step2(eventConditionInfos, step1Data.sceneList);
                this.setState({ formData1: { ...step1Data }, formData2: { faceRule: formData2, ...setp2Data } });
            // });
        }
    }

    setData4Step1 = (data, eventConditionInfos, times) => {
        const { eventStartDate: sd, eventEndDate: ed, shopIDList: slist, triggerSceneList, validCycle } = data;
        const eventRange = [moment(sd), moment(ed)];
        const clientType = eventConditionInfos[0] ? String(eventConditionInfos[0].clientType) : '1';
        const shopIDList = slist ? slist.map(x => `${x}`) : [];
        const sceneList = triggerSceneList.includes('11') ? '2' : '1';

        let timsObj = {};
        const TF = 'HH:mm';
        if (times) {
            const timeList = times.map((x) => {
                const { startTime, endTime } = x;
                const st = moment(startTime, TF);
                const et = moment(endTime, TF);
                return { startTime: st, endTime: et };
            });
            timsObj = { timeList };
        }
        let cycleType = '';
        if (validCycle) {
            // 根据["w1", "w3", "w5"]获取第一个字符
            [cycleType] = validCycle[0];
        }

        const formData = {
            step1Data: {
                ...data, clientType, shopIDList, sceneList,
            },
            setp2Data: {
                ...data, eventRange, ...timsObj, advMore: true, cycleType,
            },
        }

        return formData;
    }

    setData4Step2 = (eventConditionInfos = [], sceneList) => {
        let faceData = []
        if (eventConditionInfos.length) {
            const { clientType } = eventConditionInfos[0];
            // 小程序 banner
            if (clientType === '2' && sceneList === '2') {
                faceData = this.setData4AppBanner(eventConditionInfos)
            } else if (clientType == '1') { // h5弹窗
                faceData = this.setData4Step3H5(eventConditionInfos)
            } else { // 小程序弹窗
                faceData = this.setData4Step3App(eventConditionInfos)
            }
        }
        return faceData
    }

    setData4AppBanner = (faceData) => {
        console.log("🚀 ~ file: index.jsx ~ line 477 ~ ManyFace ~ faceData", faceData)
        const data = faceData.map((item) => {
            if (item.conditionType == '2') { // 会员标签
                const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == item.conditionValue);
                item.everyTagsRule = (everyTags || []).map((itm) => {
                    return {
                        ...itm,
                        label: itm.tagName,
                        value: itm.tagRuleID,
                    }
                });
                if (item.everyTagsRule.length <= 0) {
                    message.warn(`${item.conditionName}标签属性已经不存在或者被删除了，请重新选择会员标签`)
                }
            } else {
                item.everyTagsRule = [];
            }
            item.triggerEventInfoList = item.triggerEventInfoList.map((itm, idx) => {
                if (['miniAppPage', 'speedDial', 'customLink'].includes(itm.triggerEventValue)) {
                    itm.triggerEventCustomInfo1 = { value: itm.triggerEventCustomInfo }
                } else if (itm.triggerEventName === '小程序开卡') { // 兼容老数据的小程序开卡时间，其回显的值 置为空
                    itm.triggerEventValue1 = '';
                }  else if(['jumpToMiniApp'].includes(itm.triggerEventValue)) {
                    try {
                        itm.triggerEventCustomInfoApp1 = JSON.parse(itm.triggerEventCustomInfo)
                    } catch (error) {
                        itm.triggerEventCustomInfoApp1 = [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }];
                    }
                } else {
                    try {
                        itm.triggerEventCustomInfo1 = JSON.parse(itm.triggerEventCustomInfo)
                    } catch (error) {
                        itm.triggerEventCustomInfo1 = {};
                    }
                }
                itm.triggerEventName1 = itm.triggerEventName;
                itm.triggerEventValue1 = itm.triggerEventValue;
                return {
                    ...itm,
                    id: idx,
                    parentId: item.itemID,
                }
            })
           
            return { ...item, id: item.itemID, isShowDishSelector: false }
        })
        return data;
    }

    setData4Step3H5 = (faceData) => {
        const data = faceData.map((item) => {
            if (item.conditionType == '2') { // 会员标签
                const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == item.conditionValue);
                item.everyTagsRule = (everyTags || []).map((itm) => {
                    return {
                        ...itm,
                        label: itm.tagName,
                        value: itm.tagRuleID,
                    }
                });
                if (item.everyTagsRule.length <= 0) {
                    message.warn(`${item.conditionName}标签属性已经不存在或者被删除了，请重新选择会员标签`)
                }
            } else {
                item.everyTagsRule = [];
            }
            if (item.triggerEventValue === 'customLink') {
                item.triggerEventCustomInfo2 = { value: item.triggerEventCustomInfo }
            } else {
                try {
                    item.triggerEventCustomInfo2 = JSON.parse(item.triggerEventCustomInfo)
                } catch (error) {
                    item.triggerEventCustomInfo2 = {};
                }
            }
            item.triggerEventCustomInfoApp1 = [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }];
            item.triggerEventName2 = item.triggerEventName;
            item.triggerEventValue2 = item.triggerEventValue;

            return { ...item, id: item.itemID, isShowDishSelector: false }
        })
        return data;
    }

    setData4Step3App = (faceData) => {
        const data = faceData.map((item) => {
            item.triggerEventName1 = item.triggerEventName;
            item.triggerEventValue1 = item.triggerEventValue;
            if (item.conditionType == '2') { // 会员标签
                const everyTags = this.state.tagRuleDetails.filter(itm => itm.tagCategoryID == item.conditionValue);
                item.everyTagsRule = (everyTags || []).map((itm) => {
                    return {
                        ...itm,
                        label: itm.tagName,
                        value: itm.tagRuleID,
                    }
                });
                if (item.everyTagsRule.length <= 0) {
                    message.warn(`${item.conditionName}标签属性已经不存在或者被删除了，请重新选择会员标签`)
                }
            } else {
                item.everyTagsRule = [];
            }
            if (['miniAppPage', 'speedDial', 'customLink'].includes(item.triggerEventValue)) {
                item.triggerEventCustomInfo1 = { value: item.triggerEventCustomInfo }
            } else if (item.triggerEventName === '小程序开卡') { // 兼容老数据的小程序开卡时间，其回显的值 置为空
                item.triggerEventValue1 = '';
            }  else if(['jumpToMiniApp'].includes(item.triggerEventValue)) {
                try {
                    item.triggerEventCustomInfoApp1 = JSON.parse(item.triggerEventCustomInfo)
                } catch (error) {
                    item.triggerEventCustomInfoApp1 = [{ platformType: 'wechat', appID: '', appName: '微信小程序名称' }, { platformType: 'alipay', appID: '', appName: '支付宝小程序名称' }];
                }
            } else {
                try {
                    item.triggerEventCustomInfo1 = JSON.parse(item.triggerEventCustomInfo)
                } catch (error) {
                    item.triggerEventCustomInfo1 = {};
                }
            }
            return { ...item, id: item.itemID, isShowDishSelector: false }
        })
        return data;
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
                const { tagRuleDetails = [] } = res.data;
                this.setState({
                    tagRuleDetails, // 标签第三步特征
                }, () => {
                    this.getEventDetail();
                })
            } else {
                message.error(res.data.message);
                this.getEventDetail();
            }
        })
    }

    formatTimeList = (list) => {
        if (!list) { return [] }
        const times = [];
        list.forEach((x) => {
            const { startTime, endTime } = x;
            if (startTime && endTime) {
                const st = moment(startTime).format('HHmm');
                const et = moment(endTime).format('HHmm');
                times.push({ startTime: st, endTime: et })
            }
        });
        return times;
    }

    formatEventRange = (eventRange) => {
        const [sd, ed] = eventRange;
        const eventStartDate = moment(sd).format(DF);
        const eventEndDate = moment(ed).format(DF);
        return { eventStartDate, eventEndDate };
    }

    viewRule = () => {
        this.setState({
            viewRuleVisible: true,
        })
    }

    tipContent =() => {
        return (
            <div className={styles.activeTipBox}>
                <span>会员专属大礼包</span>、<span>会员集点卡</span>
                活动中存在当前已选适用店铺，如继续创建，这些店铺将按照当前活动规则进行执行
                <span onClick={this.viewRule}>查看设置活动规则</span>
            </div>
        )
    }

    handleShowModalTip = data => (handleNext) => {
        Modal.confirm({
            title: '温馨提示',
            content: this.tipContent(data),
            iconType: 'exclamation-circle',
            cancelText: '我在想想',
            okText: '继续创建',
            onOk() {
                handleNext();
            },
            onCancel() { },
        });
    }

    handleRuleOk = () => {

    }

    handleSubmit = (cb) => {
        const { form1, form2 } = this.state
        const forms = [form1, form2];
        asyncParseForm(forms)
            .then((result) => {
                // 验证通过后保存前需要把所选店铺下的所以存在的活动弹窗提醒下
                let flag = false;
                let formData2;
                const { values, error } = result;
                if (error) return null
                const { faceRule, clientType, sceneList } = values;
                const faceData = _.cloneDeep(faceRule);
                if (clientType == '2' && sceneList == '2') { // 小程序3.0 banner
                    formData2 = this.onPreSubmitAppBanner(faceData, values)
                    flag = this.onCheckBannerApp(formData2)
                    if (flag) { return null }
                    queryActiveList().then((res) => {
                        if (res.length > 0) {
                            this.handleShowModalTip(res)(() => {
                                this.onSubmit(values, formData2)
                            })
                        } else {
                            this.onSubmit(values, formData2)
                        }
                    })
                    return null
                } else if (clientType == '1') {
                    formData2 = this.onPreSubmitH5(faceData, values)
                } else {
                    formData2 = this.onPreSubmitApp(faceData, values)
                }
                flag = this.onCheck(formData2)
                if (flag) { return null }
                queryActiveList().then((res) => {
                    if (res.length > 0) {
                        this.handleShowModalTip(res)(() => {
                            this.onSubmit(values, formData2)
                        })
                    } else {
                        this.onSubmit(values, formData2)
                    }
                })
            })
    }


    render() {
        const { form1, form2, allActivity, allMallActivity, formData1, formData2, viewRuleVisible } = this.state
        return (
            <div className={styles.formContainer}>
                <div>
                    <div
                        style={{
                            margin: '20px 0 10px 124px',
                        }}
                        className={styles.logoGroupHeader}
                    >基本信息</div>
                    <Step1
                        form={form1}
                        getForm={this.onSetForm1}
                        formData={formData1}
                        authLicenseData={this.state.authLicenseData}
                        onChangeForm={this.onChangeForm}
                    />

                    <div
                        style={{
                            margin: '70px 0 10px 124px',
                        }}
                        className={styles.logoGroupHeader}
                    >使用规则</div>
                    <Step2
                        form2={form2}
                        form1={form1}
                        getForm={(form) => { this.setState({ form2: form }) }}
                        allActivity={allActivity}
                        allMallActivity={allMallActivity}
                        isEdit={true}
                        formData={formData2}
                        onChangeForm={this.onChangeForm}
                    />
                </div>
                {viewRuleVisible && <Modal
                    maskClosable={false}
                    visible={true}
                    width={700}
                    title="活动规则"
                    onCancel={this.onCloseViewRuleModal}
                    onOk={this.handleRuleOk}
                >
                    <div> <span>千人千面</span>当同一时间、同一门店、同一投放类型、同一投放位置下存在多个活动时，将按照以下规则执行 </div>
                    <div>
                        <span>计算规则</span>
                        <RadioGroup name="radiogroup" defaultValue={1}>
                            <Radio value={1}>按创建时间最近的执行</Radio>
                            <Radio value={2}>按创建时间最早的执行</Radio>
                        </RadioGroup></div>

                </Modal>}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        accountInfo: state.user.get('accountInfo'),
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchFoodMenuLightInfo: (opts, flag, id) => {
            dispatch(fetchFoodMenuInfoLightAC(opts, flag, id))
        },
        fetchFoodCategoryLightInfo: (opts, flag, id) => {
            dispatch(fetchFoodCategoryInfoLightAC(opts, flag, id))
        },
        fetchPromotionScopeInfoAC: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ManyFace);
