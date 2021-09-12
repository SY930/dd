import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Input, message, Form, Radio, Col, Tag, Select, Spin } from 'antd';
import _ from 'lodash';
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import { injectIntl } from './IntlDecor';
import guideImg from './assets/guide.png';
import PromotionSelectorModal from "./PromotionSelectorModal";
import styles from './style.less';
import { queryShareRuleDetail, queryShareRuleDetailList } from './AxiosFactory';

const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
const AVAILABLE_GIFTS = [
    '10', '20', '21', '110', '111', '22', '115'
];

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

@injectIntl()
class CreateShareRulesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: [],
            referenceType: '0',//组方式
            shareRuleType: props.formData.shareRuleType || '0',//共享类型
            shareRuleName: props.formData.shareRuleName || '',//规则名称
            shareRuleID: props.formData.shareRuleID || '',//共享组ID
            referenceID: props.formData.referenceID || '',//引用活动ID
            shareGroupList: props.shareGroupList || [],//共享组下拉选择
            ruleGroupNameA: '',//活动A组名
            ruleGroupNameB: '',//活动B组名
            groupType: '0',//选择活动组index
            showPromotionModal: false,//添加活动组件显示与否
            groupData: [],//组内活动选择
            groupAdata: [],//活动组A选择活动
            groupBdata: [],//活动组B选择活动
            tagsSource: [],//编辑时组内共享活动集合（回显数据）
            tagsSourceA: [],//编辑时组间共享活动组A内活动集合（回显数据）
            tagsSourceB: [],//编辑时组间共享活动组B内活动集合（回显数据）
            shareGroupArrA: {},
            shareGroupArrB: {},
            selectedActivityArr: [],
            filterArr: [],//活动过滤
        };
        this.debouncedHandleOk = _.debounce(this.handleOk, 400)
        this.debouncedChangeRuleName = this.debouncedChangeRuleName.bind(this)
        // this.handleIconHover = this.handleIconHover.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        this.handleActivityGroupRadioSelect = this.handleActivityGroupRadioSelect.bind(this)
        this.renderBetweenGroupCont = this.renderBetweenGroupCont.bind(this)
        this.renderInnerGroupCont = this.renderInnerGroupCont.bind(this)
        this.handleShareTypeChange = this.handleShareTypeChange.bind(this)
        this.resetInitData = this.resetInitData.bind(this)//数据 重置
        this.handleRuleGroupNameAChange = this.handleRuleGroupNameAChange.bind(this),
            this.handleRuleGroupNameBChange = this.handleRuleGroupNameBChange.bind(this),
            this.handleReferenceIDChange = this.handleReferenceIDChange.bind(this)
        this.handleRuleGroupNameBChange = this.handleRuleGroupNameBChange.bind(this)
        this.tagsArrA = [];
        this.tagsArrB = [];
    }
    componentDidMount() {
        const options = this.getAllOptions();
        const { formData: shareRuleInfo } = this.props;
        let tagsSource = [], tagsSourceA = [], tagsSourceB = [], shareGroupArr = [], notShareGroupArr = [], shareGroupArrA = {}, shareGroupArrB = {}, referenceType = '0', ruleGroupNameA = '', ruleGroupNameB = '', selectedActivityArr = [];
        let ruleDetails = shareRuleInfo.ruleDetails || [];
        let len = ruleDetails.length;
        switch (len) {
            case 1:
                let shareRulePromotionInfos = ruleDetails[0] && ruleDetails[0].shareRulePromotionInfos && ruleDetails[0].shareRulePromotionInfos.length > 0 ? ruleDetails[0].shareRulePromotionInfos : [];
                if (shareRulePromotionInfos.length > 0) {
                    shareRulePromotionInfos.forEach((item, index) => {
                        tagsSource.push({
                            activityType: item.promotionType,
                            basicType: item.eventWay,
                            label: item.promotionName,
                            value: item.promotionID,
                            type: item.eventWay,
                        })
                    })
                } else {
                    tagsSource = []
                }
                break;
            case 2:
                let shareRulePromotionInfosA = [], shareRulePromotionInfosB = [];
                shareGroupArr = ruleDetails.filter((item) => item.isLinked == true);//活动组A，共享的规则 
                notShareGroupArr = ruleDetails.filter((item) => !item.isLinked);//活动组B
                if (shareGroupArr && shareGroupArr.length > 0) {//如果有共享的规则
                    shareGroupArrA = shareGroupArr[0];
                    shareGroupArrB = notShareGroupArr[0];
                    referenceType = '1';
                    ruleGroupNameA = shareGroupArrA.ruleGroupName;
                    ruleGroupNameB = shareGroupArrB.ruleGroupName;
                    shareRulePromotionInfosA = shareGroupArrA.shareRulePromotionInfos || [];
                    shareRulePromotionInfosB = shareGroupArrB.shareRulePromotionInfos || [];
                    selectedActivityArr = shareRulePromotionInfosA
                }
                if (notShareGroupArr && notShareGroupArr.length == 2) {//如果都是互斥的规则
                    shareGroupArrA = notShareGroupArr[0];
                    shareGroupArrB = notShareGroupArr[1];
                    referenceType = '0';
                    ruleGroupNameA = shareGroupArrA.ruleGroupName;
                    ruleGroupNameB = shareGroupArrB.ruleGroupName;
                    shareRulePromotionInfosA = shareGroupArrA.shareRulePromotionInfos || [];
                    shareRulePromotionInfosB = shareGroupArrB.shareRulePromotionInfos || [];
                }
                shareRulePromotionInfosA.forEach((item, index) => {
                    tagsSourceA.push({
                        activityType: item.promotionType,
                        basicType: item.eventWay,
                        label: item.promotionName,
                        value: item.promotionID,
                        type: item.eventWay,
                    })
                })
                shareRulePromotionInfosB.forEach((item, index) => {
                    tagsSourceB.push({
                        activityType: item.promotionType,
                        basicType: item.eventWay,
                        label: item.promotionName,
                        value: item.promotionID,
                        type: item.eventWay,
                    })
                })
                break;
            default:
                tagsSource = []
        }
        this.setState({
            options,
            shareGroupArrA,
            shareGroupArrB,
            tagsSource,
            tagsSourceA,
            tagsSourceB,
            referenceType,
            ruleGroupNameA,
            ruleGroupNameB,
            selectedActivityArr
        })
    }
    // componentWillReceiveProps(nextProps){
    //     if (!_.isEqual(this.props.giftAndCouponList, nextProps.giftAndCouponList)) {
    //         let opts = this.getAllOptions()
    //         this.setState({
    //             options: opts,
    //         });
    //     }
    // }
    handleOk = () => {
        let params = {};
        let nextFlag = true
        params.ruleDetails = [];
        const { groupID, userName, isCreate } = this.props;
        const { options, shareRuleID, shareRuleName, shareRuleType, referenceType, ruleGroupNameA, ruleGroupNameB,
            tagsSource, tagsSourceA, tagsSourceB, groupData, groupAdata, groupBdata, referenceID } = this.state;
        params.groupID = groupID;
        params.userName = userName;
        params.shareRuleType = shareRuleType;
        params.shareRuleName = shareRuleName;
        if (!params.shareRuleName) {
            message.warning('规则名称必填')
            nextFlag = false;
            return
        }
        if (!isCreate) {
            params.shareRuleID = shareRuleID;
        }
        if (shareRuleType == '0') {//组内共享参数
            const activityArr = this.getActivityArrParams(options, groupData, tagsSource);
            if (activityArr && activityArr.length > 0) {
                params.ruleDetails.push({
                    groupID,
                    ruleGroupName: shareRuleName,
                    shareRulePromotionInfos: activityArr
                })
            } else {
                message.warning('请添加共享内容')
                nextFlag = false;
            }

        } else {//组间共享参数
            const activityArrA = this.getActivityArrParams(options, groupAdata, tagsSourceA);
            const activityArrB = this.getActivityArrParams(options, groupBdata, tagsSourceB);
            if (referenceType == '0') { //组方式自定义添加
                if (!activityArrA || activityArrA.length == 0) {
                    nextFlag = false;
                    message.warning('请添加活动组A组内容')
                    return
                }
                if (!activityArrB || activityArrB.length == 0) {
                    nextFlag = false;
                    message.warning('请添加活动组B组内容')
                    return
                }
                params.ruleDetails.push({
                    ruleIndex: '0',
                    ruleGroupName: ruleGroupNameA,
                    referenceType: '0',
                    groupID,
                    shareRulePromotionInfos: activityArrA
                })
                params.ruleDetails.push({
                    ruleIndex: '1',
                    ruleGroupName: ruleGroupNameB,
                    referenceType: '0',
                    groupID,
                    shareRulePromotionInfos: activityArrB
                })
                params.referenceID = ''
            }
            if (referenceType == '1') { //组方式引用组内共享规则
                if (!referenceID) {
                    nextFlag = false;
                    message.warning('请选择活动组A活动组名')
                    return
                }
                if (!activityArrB || activityArrB.length == 0) {
                    nextFlag = false;
                    message.warning('请添加活动组B组内容')
                    return
                }
                params.ruleDetails.push({
                    ruleIndex: '1',
                    groupID,
                    ruleGroupName: ruleGroupNameB,
                    referenceType: '1',
                    shareRulePromotionInfos: activityArrB
                })
                params.referenceID = referenceID
            }
        }
        if (nextFlag) {
            this.props.handleOk(params, isCreate)
        }
    }
    //获取添加活动列表 options: 是活动的全部筛选列表 group:选择的活动列表 origin:编辑时回显的活动列表
    getActivityArrParams(options, group, origin) {
        let tags = [], activityArr = [];
        options.forEach((item, index) => {
            if (group.length > 0) {
                group.forEach((item1, index1) => {
                    if (item1 == item.value) {
                        tags.push(item)
                    }
                })
            }
        })
        let tagsArr = tags.length > 0 ? tags : origin ? origin : [];
        tagsArr.forEach((item) => {
            activityArr.push({
                promotionName: item.label,
                promotionType: item.activityType,
                eventWay: item.basicType,
                promotionID: item.value,

            })
        })
        return activityArr
    }
    //数据重置
    resetInitData() {
        this.setState({
            referenceID: '',//引用活动ID
            ruleGroupNameA: '',//活动A组名
            ruleGroupNameB: '',//活动B组名
            groupType: '0',//选择活动组index
            showPromotionModal: false,//添加活动组件显示与否
            groupData: [],//组内活动选择
            groupAdata: [],//活动组A选择活动
            groupBdata: [],//活动组B选择活动
            tagsSource: [],
            tagsSourceA: [],
            tagsSourceB: [],
            shareGroupArrA: {},
            shareGroupArrB: {},
            selectedActivityArr: []
        })
    }
    //获取活动列表
    getAllOptions = () => {
        const {
            giftAndCouponList,
        } = this.props;
        let allGiftsArray = [];
        let allPromotionArray = [];
        let options = [];
        if (giftAndCouponList && giftAndCouponList.length > 0) {
            allGiftsArray = giftAndCouponList[0] ? giftAndCouponList[0] : [];
            allPromotionArray = giftAndCouponList[1] ? giftAndCouponList[1].map(promotion => ({
                value: promotion.promotionIDStr,
                label: `${BASIC_PROMOTION_MAP[promotion.promotionType]} - ${promotion.promotionCode} - ${promotion.promotionName}`,
                type: `${promotion.promotionType}`,
                activityType: '10',
                activitySource: '1',
                basicType: `${promotion.promotionType}`,
            })).filter(item => AVAILABLE_PROMOTIONS.includes(item.type)) : [];
            options = [
                ...allPromotionArray,
                ...allGiftsArray.filter(item => AVAILABLE_GIFTS.includes(String(item.giftType))).map(item => ({
                    value: item.giftItemID,
                    label: `${GIFT_MAP[item.giftType]} - ${item.giftName}`,
                    type: `${item.giftType}`,
                    activityType: '30',
                    activitySource: '2',
                    couponType: `${item.giftType}`,
                    basicType: `${item.giftType}`,
                })),
                {
                    value: '-10',
                    label: '会员价',
                    activityType: '20',
                    type: '-10',
                    activitySource: '3',
                    rightType: '-10',
                    basicType: '-10',
                },
                {
                    value: '-20',
                    label: '会员折扣',
                    activityType: '20',
                    type: '-20',
                    activitySource: '3',
                    rightType: '-20',
                    basicType: '-20',
                },
            ]
        }
        return options

    }

    removeTag = (val, group) => {
        let index = group.indexOf(val);
        if (index > -1) {
            group.splice(index, 1)
        }
        return group
    }

    cancelTags = (val, group, source, type1, type2) => {
        if (group.length > 0) {//如果有主动选择的活动
            this.setState({
                [type1]: this.removeTag(val, group)
            })
        }
        if (group.length == 0 && source.length > 0) {//没有主动选择的活动，有回传数据
            let useArr = source.filter((item) => {
                return item.value != val
            })
            this.setState({
                [type2]: useArr
            })
        }
    }
    //删除活动标签
    closeActivityName = (val, type) => {
        const { groupData, groupAdata, groupBdata, tagsSource, tagsSourceA, tagsSourceB } = this.state;
        switch (type) {
            case '0':
                this.cancelTags(val, groupData, tagsSource, 'groupData', 'tagsSource')
                break;
            case '1':
                this.cancelTags(val, groupAdata, tagsSourceA, 'groupAdata', 'tagsSourceA')
                break;
            case '2':
                this.cancelTags(val, groupBdata, tagsSourceB, 'groupBdata', 'tagsSourceB')
                break;
        }
    }

    debouncedChangeRuleName(e) {
        this.setState({
            shareRuleName: e.target.value
        })
    }
    handleActivityGroupRadioSelect(e) {
        const { value } = e.target;
        this.setState({
            referenceType: value
        })
        this.resetInitData()
    }
    handleShareTypeChange(e) {
        this.setState({
            shareRuleType: e.target.value
        })
    }
    handleRuleGroupNameAChange = (e) => {
        this.setState({
            ruleGroupNameA: e.target.value
        })
    }
    handleRuleGroupNameBChange = (e) => {
        this.setState({
            ruleGroupNameB: e.target.value
        })
    }
    handleReferenceIDChange(value) {
        queryShareRuleDetail({ shareRuleID: value }).then(data => {
            let selectedActivityArr = data.ruleDetails && data.ruleDetails[0] && data.ruleDetails[0].shareRulePromotionInfos ? data.ruleDetails[0].shareRulePromotionInfos : []
            this.setState({
                // shareRuleInfo: data,
                referenceID: value,
                selectedActivityArr
            })
        })
    }
    //获取需要过滤的活动
    setPromotionModalShow(type) {
        const { referenceType, shareRuleType, groupAdata, tagsSourceA, groupBdata, tagsSourceB } = this.state;
        let filterArr = [];
        function unique(arr) {
            return Array.from(new Set(arr))
        }
        if (shareRuleType == '0') {
            queryShareRuleDetailList({ queryCondition: { shareRuleType: '1' } }).then(list => {
                list.forEach(item => {
                    filterArr.push(item.promotionID)
                })
                this.setState({
                    showPromotionModal: true,
                    groupType: type,
                    filterArr: unique(filterArr)
                })
            })

        } else {
            queryShareRuleDetailList({ queryCondition: { shareRuleType: '2' } }).then(list => {
                if (referenceType == '0') {
                    list.forEach(item => {
                        filterArr.push(item.promotionID)
                    })
                    if (type == '1') {
                        if (groupBdata.length > 0) {
                            filterArr = filterArr.concat(groupBdata)
                        }
                        if (groupBdata.length == 0 && tagsSourceB.length > 0) {
                            let dockerArr = []
                            tagsSourceB.forEach(item => {
                                dockerArr.push(item.value)
                            })
                            filterArr = filterArr.concat(dockerArr)
                        }
                    }
                    if (type == '2') {
                        if (groupAdata.length > 0) {
                            filterArr = filterArr.concat(groupAdata)
                        }
                        if (groupAdata.length == 0 && tagsSourceA.length > 0) {
                            let dockerArr = []
                            tagsSourceA.forEach(item => {
                                dockerArr.push(item.value)
                            })
                            filterArr = filterArr.concat(dockerArr)
                        }
                    }

                    this.setState({
                        showPromotionModal: true,
                        groupType: type,
                        filterArr: unique(filterArr)
                    })
                } else {
                    list.forEach(item => {
                        filterArr.push(item.promotionID)
                    })
                    this.setState({
                        showPromotionModal: true,
                        groupType: type,
                        filterArr: unique(filterArr)
                    })
                }
            })
        }
    }
    handlePromotionSelectorChange(value) {

    }
    handleSelectModalOk = (values) => {
        const { groupType } = this.state;
        switch (groupType) {
            case '0':
                if (values.length > 0) {
                    this.setState({
                        showPromotionModal: false,
                        groupData: values,
                        tagsSource: []
                    });
                } else {
                    message.warning('请选择活动')
                }
                break;
            case '1':
                if (values.length > 0) {
                    this.setState({
                        showPromotionModal: false,
                        groupAdata: values,
                        tagsSourceA: []
                    });
                } else {
                    message.warning('请选择活动')
                }

                break;
            case '2':
                if (values.length > 0) {
                    this.setState({
                        showPromotionModal: false,
                        groupBdata: values,
                        tagsSourceB: []
                    });
                } else {
                    message.warning('请选择活动')
                }

                break;
        }
    }

    handleSelectModalCancel = () => {
        this.setState({ showPromotionModal: false });
    }
    renderInnerGroupCont() {//组内共享
        let tags = [];
        const options = this.getAllOptions();
        const { tagsSource, groupData } = this.state;
        options.forEach((item, index) => {
            if (groupData.length > 0) {
                groupData.forEach((item1, index1) => {
                    if (item1 == item.value) {
                        tags.push(item)
                    }
                })
            }
        })
        let tagsArr = tags.length > 0 ? tags : tagsSource ? tagsSource : [];
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 },
        }
        return (
            <Col className={`${styles.activityGroup} ${styles.activityInnerGroup}`} >
                <FormItem
                    label={'共享内容'}
                    {...formItemLayout}
                    style={{ marginBottom: '0' }}
                >
                    <Col className={styles.activityTagsWrapper}>
                        <Col className={styles.activityTagsScroll}>
                            {tagsArr.map((item) => {
                                return <Tag closable onClose={() => this.closeActivityName(item.value, '0')} key={item.value} value={item.value}>{item.label}</Tag>
                            })}
                        </Col>
                    </Col>
                    <Button icon="plus" className={tagsArr.length == 0 ? styles.emptyAddActivityBtn : styles.addActivityBtn} onClick={() => this.setPromotionModalShow('0')}>添加(至多添加100个)</Button>
                </FormItem>
            </Col>
        )
    }
    renderBetweenGroupCont() {//组间共享
        let tagsA = [], tagsB = [];
        const { isCreate } = this.props;
        const options = this.getAllOptions();
        const { shareRuleType, referenceType, referenceID, shareGroupArrA, shareGroupArrB, tagsSourceA, tagsSourceB, groupAdata, groupBdata, shareGroupList, selectedActivityArr } = this.state;
        options.forEach((item, index) => {
            if (groupAdata.length > 0) {
                groupAdata.forEach((item1, index1) => {
                    if (item1 == item.value) {
                        tagsA.push(item)
                    }
                })
            }
        })
        options.forEach((item, index) => {
            if (groupBdata.length > 0) {
                groupBdata.forEach((item1, index1) => {
                    if (item1 == item.value) {
                        tagsB.push(item)
                    }
                })
            }
        })

        let tagsArrA = tagsA.length > 0 ? tagsA : tagsSourceA ? tagsSourceA : [];
        let tagsArrB = tagsB.length > 0 ? tagsB : tagsSourceB ? tagsSourceB : [];
        this.tagsArrA = tagsArrA;
        this.tagsArrB = tagsArrB;
        if (referenceID) {
            tagsArrA = [];
            if (selectedActivityArr && selectedActivityArr.length > 0) {
                selectedActivityArr.forEach((item) => {
                    tagsArrA.push({
                        activityType: item.promotionType,
                        basicType: item.eventWay,
                        label: item.promotionName,
                        value: item.promotionID
                    })
                })
            }
        }
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 },
        }
        return (
            <Col>
                <FormItem
                    label={'活动组A'}
                    {...formItemLayout}
                >
                    <Col className={styles.activityGroup} >
                        <FormItem
                            label={'组方式'}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 20 }}
                            style={{ marginBottom: '-24px', position: 'relative' }}
                        >
                            <RadioGroup value={referenceType} onChange={this.handleActivityGroupRadioSelect} disabled={shareRuleType == '1' && !isCreate}>
                                <Radio value={'0'}>
                                    <b>自定义添加</b>
                                    <br></br>
                                    <b className={styles.radioLeft}>组内活动互斥</b>
                                </Radio>
                                <Radio value={'1'}>
                                    <b>引用组内共享规则</b>
                                    <br></br>
                                    <b className={styles.radioRight}>组内活动共享</b>
                                </Radio>
                            </RadioGroup>
                        </FormItem>
                        {shareRuleType == '1' && !isCreate && referenceType == '1' ? <div className={styles.disabledBox}></div> : null}
                        {
                            referenceType == '0' ?
                                <FormItem
                                    label={'活动组名'}
                                    labelCol={{ span: 3 }}
                                    wrapperCol={{ span: 20 }}
                                    style={{ marginBottom: '0' }}
                                >
                                    {
                                        getFieldDecorator('ruleGroupNameA', {
                                            onChange: this.handleRuleGroupNameAChange,
                                            initialValue: shareGroupArrA.ruleGroupName,
                                            rules: [
                                                { require: true, message: '请输入活动组名称' },
                                            ],
                                        })(
                                            <Input placeholder="请输入活动组名称" style={{ width: 260 }} />
                                        )
                                    }
                                </FormItem>
                                :
                                <FormItem
                                    label={'活动组名'}
                                    labelCol={{ span: 3 }}
                                    wrapperCol={{ span: 20 }}
                                    style={{ marginBottom: '0' }}
                                >
                                    <Select
                                        value={referenceID}
                                        style={{ width: 256 }}
                                        onChange={this.handleReferenceIDChange}
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            shareGroupList.map(item => (
                                                <Option key={item.shareRuleID} value={item.shareRuleID}>{item.shareRuleName}</Option>
                                            ))
                                        }
                                    </Select>
                                </FormItem>
                        }
                        <FormItem
                            label={(
                                <span className={styles.leftLabel}>组内容<br /><i>({shareRuleType == '1' && referenceType == '1' ? '共享' : '互斥'})</i></span>
                            )
                            }
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 20 }}
                            style={{ marginBottom: '0', position: 'relative' }}
                        >
                            {shareRuleType == '1' && referenceType == '1' ? <div className={styles.disabledContBox}></div> : null}
                            <Col className={styles.activityTagsWrapper}>
                                <Col className={styles.activityTagsScroll}>
                                    {
                                        tagsArrA.map((item) => {
                                            return <Tag closable onClose={() => this.closeActivityName(item.value, '1')} key={item.value} value={item.value}>{item.label}</Tag>
                                        })
                                    }
                                </Col>
                            </Col>
                            {
                                shareRuleType == '1' && referenceType == '1' ?
                                    null
                                    :
                                    <Button icon="plus" style={{ left: `${tagsArrA.length == 0 ? '125px' : '-15px'}` }} className={tagsArrA.length == 0 ? styles.emptyAddActivityBtn : styles.addActivityBtn} onClick={() => this.setPromotionModalShow('1')}>添加(至多添加100个)</Button>
                            }
                        </FormItem>
                    </Col>
                </FormItem>
                <FormItem
                    label={'活动组B'}
                    {...formItemLayout}
                >
                    <Col className={styles.activityGroup} style={{ height: 205 }}>
                        <FormItem
                            label={'活动组名'}
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 20 }}
                            style={{ marginBottom: '0' }}
                        >
                            {
                                getFieldDecorator('ruleGroupNameB', {
                                    initialValue: shareGroupArrB.ruleGroupName,
                                    onChange: this.handleRuleGroupNameBChange,
                                    rules: [
                                        { require: true, message: '请输入活动组名称' },

                                    ],
                                })(
                                    <Input placeholder="请输入活动组名称" style={{ width: 260 }} />
                                )
                            }
                        </FormItem>
                        <FormItem
                            label={(
                                <span className={styles.leftLabel}>组内容<br /><i>(互斥)</i></span>
                            )
                            }
                            labelCol={{ span: 3 }}
                            wrapperCol={{ span: 20 }}
                            style={{ marginBottom: '0' }}
                        >
                            <Col className={styles.activityTagsWrapper}>
                                <Col className={styles.activityTagsScroll}>
                                    {
                                        tagsArrB.map((item) => {
                                            return <Tag closable onClose={() => this.closeActivityName(item.value, '2')} key={item.value} value={item.value}>{item.label}</Tag>
                                        })
                                    }
                                </Col>
                            </Col>
                            <Button icon="plus" style={{ left: `${tagsArrB.length == 0 ? '125px' : '-15px'}` }} className={tagsArrB.length == 0 ? styles.emptyAddActivityBtn : styles.addActivityBtn} onClick={() => this.setPromotionModalShow('2')}>添加(至多添加100个)</Button>
                        </FormItem>
                    </Col>
                </FormItem>
            </Col>
        )
    }
    render() {
        let defaultValue = [];
        const options = this.getAllOptions()
        const { form: { getFieldDecorator }, isCreate, groupID } = this.props;
        const { shareRuleType, showPromotionModal, shareRuleName, groupType, tagsSource = [], tagsSourceA = [], tagsSourceB = [], groupAdata, groupBdata, groupData } = this.state;
        let { filterArr } = this.state;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 },
        }
        switch (groupType) {
            case '0'://如果是组内共享
                if (groupData.length > 0) {
                    defaultValue = groupData
                }
                if (groupData.length == 0 && tagsSource.length > 0) {
                    tagsSource.forEach(item => {
                        defaultValue.push(item.value)
                    })
                }
                break;
            case '1'://如果是组间共享自定义添加
                if (groupAdata.length > 0) {
                    defaultValue = groupAdata
                }
                if (groupAdata.length == 0 && tagsSourceA.length > 0) {
                    tagsSourceA.forEach(item => {
                        defaultValue.push(item.value)
                    })
                }
                break;
            case '2'://如果是组间共享引用组内共享规则
                if (groupBdata.length > 0) {
                    defaultValue = groupBdata
                }
                if (groupBdata.length == 0 && tagsSourceB.length > 0) {
                    tagsSourceB.forEach(item => {
                        defaultValue.push(item.value)
                    })
                }
                break;
        }
        filterArr = filterArr.filter(item => {//保留自身
            if (defaultValue.indexOf(item) < 0) {
                return item
            }
        })
        return (

            <Modal
                maskClosable={true}
                title={this.props.isCreate ? '新建共享规则' : '编辑共享规则'}
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="large" onClick={this.props.handleCancel}>
                        取消
                    </Button>,
                    <Button key="1" type="primary" size="large" onClick={this.debouncedHandleOk} loading={this.props.loading}>
                        确定
                    </Button>,
                ]}
                onCancel={this.props.handleCancel}
                width="700px"
                className={styles.createModal}
            >
                <Spin spinning={options.length == 0} size='small'>
                    <Form layout={'horizontal'} >
                        <FormItem
                            label={'规则名称'}
                            {...formItemLayout}
                            required
                        >
                            {
                                getFieldDecorator('shareRuleName', {
                                    initialValue: shareRuleName,
                                    onChange: this.debouncedChangeRuleName,
                                    rules: [
                                        { require: true, message: '请输入共享规则名称' },
                                    ],
                                })(
                                    <Input placeholder="请输入共享规则名称" style={{ width: 260 }} />
                                )
                            }
                        </FormItem>
                        <FormItem
                            label="共享类型"
                            {...formItemLayout}
                        >
                            <Radio.Group value={String(shareRuleType)} onChange={this.handleShareTypeChange} disabled={!isCreate}>
                                <Radio.Button value="0">组内共享</Radio.Button>
                                <Radio.Button value="1">组间共享</Radio.Button>
                            </Radio.Group>
                            <Col className={styles.previewImgWrapper}>
                                {
                                    shareRuleType == '0' ?
                                        <span>共享组内活动可以同时生效</span>
                                        :
                                        <div>
                                            <span>活动组A与组B活动共享。</span>
                                            <div>
                                                <b>规则演示</b>
                                                <img src={guideImg} alt="" />
                                            </div>
                                        </div>
                                }

                            </Col>
                        </FormItem>
                        {
                            shareRuleType == '0' ? this.renderInnerGroupCont() : this.renderBetweenGroupCont()
                        }
                        {
                            showPromotionModal ?
                                <PromotionSelectorModal
                                    visible={true}
                                    options={options}
                                    groupID={groupID}
                                    filterArr={filterArr}
                                    defaultValue={defaultValue}
                                    onOk={this.handleSelectModalOk}
                                    onCancel={this.handleSelectModalCancel}
                                />
                                : null
                        }
                    </Form>
                </Spin>

            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CreateShareRulesModal));