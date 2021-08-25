import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Tree, Button, Tooltip, Input, message, Form, Radio, Row, Col, Tag, Select } from 'antd';
import _ from 'lodash';
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import { FILTERS } from "./PromotionSelectorModal/config";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import guideImg from './assets/guide.png';
import PromotionSelectorModal from "./PromotionSelectorModal/PromotionSelectorModal";
import styles from './style.less';
const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
const AVAILABLE_GIFTS = [
    '10', '20', '21', '110', '111', '22', '115'
];
const ALLEVENTWAY = { ...BASIC_PROMOTION_MAP, ...GIFT_MAP };
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formData1 = {
    "linkFlag": "string",
    "groupID": 0,
    "ruleDetails": [
        {
            "ruleIndex": "0",
            "ruleDetailID": 0,//新建不传，编辑返回
            "groupID": 0,
            "referenceType": '0',
            "ruleGroupName": "senlyn 引用1",
            "shareRuleID": 0,//
            "shareRulePromotionInfos": [
                {
                    "promotionName": "string",
                    "promotionType": 0,
                    "eventWay": 0,
                    "promotionID": 0
                }
            ]
        },
        {
            "ruleIndex": "string",
            "ruleDetailID": 0,//新建不传，编辑返回
            "groupID": 0,
            "referenceType": '0',
            "ruleGroupName": "senlyn 引用2",
            "shareRuleID": 0,//
            "shareRulePromotionInfos": [
                {
                    "promotionName": "string",
                    "promotionType": 0,
                    "eventWay": 0,
                    "promotionID": 0
                }
            ]
        }
    ],
    "shareRuleID": 0,
    "shareRuleType": '2',
    "shareRuleName": "辛力规则1",
    "shopID": 0,
    "referenceID": 0,//引用情况下必传，可不传A组内容
    "operator": "string"
}
@injectIntl()
class CreateShareRulesModal extends Component {
    constructor(props) {
        super(props);
        console.log(props, 'props-------------')
        this.state = {
            searchInput: '',
            currentCategory: null,
            options: [],
            visible: false,
            referenceType: '',//组方式
            shareRuleType: props.formData.shareRuleType || '',//共享类型
            shareRuleName: props.formData.shareRuleName || '',//规则名称
            shareRuleID: props.formData.shareRuleID || '',//共享组ID
            referenceID: props.formData.referenceID || '',//引用活动ID
            shareGroupList: props.shareGroupList || [],//共享组下拉选择
            ruleGroupNameA: '',//活动A组名
            ruleGroupNameB: '',//活动B组名
            groupType: '0',//选择活动组index
            showPromotionModal: false,//添加活动组件显示与否
            groupAdata: [],//活动组A选择活动
            groupBdata: [],//活动组B选择活动

            tagsSource: [], 
            tagsSourceA : [], 
            tagsSourceB : [],
            shareGroupArrA : {},
            shareGroupArrB : {},

            
        };
        this.debouncedHandleOk = _.debounce(this.handleOk, 400)
        this.debouncedChangeRuleName = _.debounce(this.debouncedChangeRuleName.bind(this), 500)
        // this.handleIconHover = this.handleIconHover.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        this.handleActivityGroupRadioSelect = this.handleActivityGroupRadioSelect.bind(this)
        this.renderBetweenGroupCont = this.renderBetweenGroupCont.bind(this)
        this.renderInnerGroupCont = this.renderInnerGroupCont.bind(this)
        this.handleShareTypeChange = this.handleShareTypeChange.bind(this)
    }
    componentDidMount() {
        console.log(this.props.formData,'componentDidMount-------')
        const options = this.getAllOptions();
        const { formData:shareRuleInfo } = this.props;
        let tagsSource = [], tagsSourceA = [], tagsSourceB = [],shareGroupArr = [],notShareGroupArr = [],shareGroupArrA = {},shareGroupArrB = {},referenceType = '';
        let ruleDetails = shareRuleInfo.ruleDetails || [];
        let len = ruleDetails.length;
        switch (len) {
            case 1:
                let shareRulePromotionInfos = ruleDetails[0] || [];
                shareRulePromotionInfos.forEach((item, index) => {
                    tagsSource.push({
                        activityType:item.promotionType,
                        basicType:item.eventWay,
                        label:item.promotionName,
                        value:item.promotionID
                    })
                })
                break
            case 2:
                let shareRulePromotionInfosA = [],shareRulePromotionInfosB = [];
                shareGroupArr = ruleDetails.filter((item) => item.isLinked == true);//活动组A
                notShareGroupArr = ruleDetails.filter((item) => !item.isLinked);//活动组B
                if(shareGroupArr && shareGroupArr.length > 0){//如果有共享的规则
                    shareGroupArrA = shareGroupArr[0];
                    shareGroupArrB = notShareGroupArr[0];
                    referenceType = '1';
                    shareRulePromotionInfosA = shareGroupArrA.shareRulePromotionInfos || [];
                    shareRulePromotionInfosB = shareGroupArrB.shareRulePromotionInfos || [];
                }
                if(notShareGroupArr && notShareGroupArr.length == 2){//如果都是互斥的规则
                    shareGroupArrA = notShareGroupArr[0];
                    shareGroupArrB = notShareGroupArr[1];
                    referenceType = '0';
                    shareRulePromotionInfosA = shareGroupArrA.shareRulePromotionInfos || [];
                    shareRulePromotionInfosB = shareGroupArrB.shareRulePromotionInfos || [];
                }
                shareRulePromotionInfosA.forEach((item, index) => {
                    tagsSourceA.push({
                        activityType:item.promotionType,
                        basicType:item.eventWay,
                        label:item.promotionName,
                        value:item.promotionID
                    })
                })
                shareRulePromotionInfosB.forEach((item, index) => {
                    tagsSourceB.push({
                        activityType:item.promotionType,
                        basicType:item.eventWay,
                        label:item.promotionName,
                        value:item.promotionID
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
        })
    }
    componentWillReceiveProps(){
        console.log(this.props.formData,'componentWillReceiveProps------')
    }
    renderInnerGroupCont() {//组内共享
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
                            <Tag closable onClose={this.closeActivityName} key="0" value={{ key: '0', name: '买减-买三送一' }}>买减-买三送一</Tag>
                            <Tag closable onClose={this.closeActivityName} key="1" value={{ key: '1', name: '买减-买三送二' }}>买减-买三送二</Tag>
                            <Tag closable onClose={this.closeActivityName} key="2" value={{ key: '2', name: '买减-买三送三' }}>买减-买三送三</Tag>
                        </Col>
                    </Col>
                    <Button icon="plus" className={styles.addActivityBtn}>添加(至多添加100个)</Button>
                </FormItem>
            </Col>
        )
    }
    renderBetweenGroupCont() {//组间共享
        let tagsA=[],tagsB=[];
        const { referenceType, referenceID, options, shareGroupArrA,shareGroupArrB,tagsSource,tagsSourceA,tagsSourceB,groupAdata, groupBdata,shareGroupList } = this.state;

        console.log(this.state,'this.state------------renderBetweenGroupCont')
        console.log(shareGroupArrA,'shareGroupArrA')
        console.log(shareGroupArrB,'shareGroupArrB')
        // console.log(shareRulePromotionInfosA,'shareRulePromotionInfosA')
        // console.log(shareRulePromotionInfosB,'shareRulePromotionInfosB')
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
        console.log(tagsA, tagsB, 'options99999999999999999')
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
                            style={{ marginBottom: '-24px' }}
                        >
                            <RadioGroup value={referenceType}  onChange={this.handleActivityGroupRadioSelect}>
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
                                            initialValue: shareGroupArrA.ruleGroupName,
                                            onChange: this.handleRuleGroupNameAChange,
                                            rules: [
                                                { require: true, message: '请输入活动组名称' },
                                                {
                                                    validator: (rule, v, cb) => {
                                                        // if (!v || !v.number) {
                                                        //     return cb('起始号为必填项');
                                                        // }
                                                        // cb()
                                                    },
                                                },
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
                                        tagsA.map((item, index) => {
                                            return <Tag closable onClose={this.closeActivityName} key={item.value} value={JSON.stringify(item)}>{item.label}</Tag>
                                        })
                                    }
                                </Col>
                            </Col>
                            <Button icon="plus" className={styles.addActivityBtn} onClick={() => this.setPromotionModalShow('0')}>添加(至多添加100个)</Button>
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
                                        {
                                            validator: (rule, v, cb) => {
                                                // if (!v || !v.number) {
                                                //     return cb('起始号为必填项');
                                                // }
                                                // cb()
                                            },
                                        },
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
                                        tagsB.map((item, index) => {
                                            return <Tag closable onClose={this.closeActivityName} key={item.value} value={JSON.stringify(item)}>{item.label}</Tag>
                                        })
                                    }
                                </Col>
                            </Col>
                            <Button icon="plus" className={styles.addActivityBtn} onClick={() => this.setPromotionModalShow('1')}>添加(至多添加100个)</Button>
                        </FormItem>
                    </Col>
                </FormItem>

            </Col>
        )
    }
    getAllOptions = () => {
        const {
            allPromotionList,
            allGiftList,
        } = this.props;
        let allGiftsArray = [];
        let allPromotionArray = [];
        allGiftsArray = allGiftList ? allGiftList.toJS() : [];
        allPromotionArray = allPromotionList.toJS().map(item => item.promotionName.map(promotion => ({
            value: promotion.promotionIDStr,
            label: `${BASIC_PROMOTION_MAP[promotion.promotionType]} - ${promotion.promotionCode} - ${promotion.promotionName}`,
            type: `${promotion.promotionType}`,
            activityType: '10',
            activitySource: '1',
            basicType: `${promotion.promotionType}`,
        }))).reduce((acc, curr) => {
            acc.push(...curr);
            return acc;
        }, []).filter(item => AVAILABLE_PROMOTIONS.includes(item.type));
        return [
            ...allPromotionArray,
            ...allGiftsArray.filter(item => AVAILABLE_GIFTS.includes(String(item.giftType))).map(item => ({
                value: item.giftItemID,
                label: `${GIFT_MAP[item.giftType]} - ${item.giftName}`,
                type: `${item.giftType}`,
                activityType: '30',
                activitySource: '2',
                couponType: `${item.giftType}`,
            })),
            {
                value: '-10',
                label: '会员价',
                activityType: '20',
                type: '-10',
                activitySource: '3',
                rightType: '-10'
            },
            {
                value: '-20',
                label: '会员折扣',
                activityType: '20',
                type: '-20',
                activitySource: '3',
                rightType: '-20'
            },
        ];

    }
    handleOk = () => {
        this.props.handleCancel()
    }
    debouncedChangeRuleName(value) {
        this.setState({
            shareRuleName: value
        })
    }
    handleActivityGroupRadioSelect(e) {
        const { value } = e.target;
        console.log(value, 'value------------')
        this.setState({
            referenceType: value
        })
    }
    handleShareTypeChange(e) {
        console.log(e, 'value handleShareTypeChange')
        this.setState({
            shareRuleType: e.target.value
        })
    }

    handleRuleGroupNameAChange(value) {
        this.setState({
            ruleGroupNameA: value
        })
    }
    handleRuleGroupNameBChange(value) {
        this.setState({
            ruleGroupNameB: value
        })
    }
    handleReferenceIDChange(value) {
        this.setState({
            referenceID: value
        })
    }

    setPromotionModalShow(type) {
        console.log(type, 'type-------------')
        this.setState({
            showPromotionModal: true,
            groupType: type
        })
    }
    handlePromotionSelectorChange(value) {
        console.log(value)
    }
    handleSelectModalOk = (values) => {
        const { groupType } = this.state;
        if (groupType == '0') {
            this.setState({
                showPromotionModal: false,
                groupAdata: values
            });
        } else {
            this.setState({
                showPromotionModal: false,
                groupBdata: values
            });
        }

        console.log(values, 'showPromotion-----------------')
    }

    handleSelectModalCancel = () => {
        this.setState({ showPromotionModal: false });
    }
    render() {
        const options = this.getAllOptions()
        const { form: { getFieldDecorator } } = this.props;
        const { referenceType, shareRuleType, showPromotionModal,shareRuleName } = this.state;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 },
        }
        console.log(shareRuleType,'shareRuleType===========')
        // let ruleType = shareRuleType ? shareRuleType : formData.shareRuleType ? formData.shareRuleType : '1'
        return (
            <Modal
                maskClosable={true}
                title={'新建共享规则'}
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
                <Form layout={'horizontal'} >
                    <FormItem
                        label={'规则名称'}
                        {...formItemLayout}
                    >
                        {
                            getFieldDecorator('shareRuleName', {
                                initialValue: shareRuleName,
                                onChange: this.debouncedChangeRuleName,
                                rules: [
                                    { require: true, message: '请输入共享规则名称' },
                                    {
                                        validator: (rule, v, cb) => {
                                            // if (!v || !v.number) {
                                            //     return cb('起始号为必填项');
                                            // }
                                            // cb()
                                        },
                                    },
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
                        <Radio.Group value={String(shareRuleType)} onChange={this.handleShareTypeChange}>
                            <Radio.Button value="0">组内共享</Radio.Button>
                            <Radio.Button value="1">组间共享</Radio.Button>
                        </Radio.Group>
                        <Col className={styles.previewImgWrapper}>
                            <span>活动组A与组B活动共享。</span>
                            <div>
                                <b>规则演示</b>
                                <img src={guideImg} alt="" />
                            </div>
                        </Col>
                    </FormItem>
                    {
                        shareRuleType == '0' ? this.renderInnerGroupCont() : this.renderBetweenGroupCont()
                    }
                    {
                        showPromotionModal ?
                            <PromotionSelectorModal
                                // {...otherProps}
                                visible={true}
                                options={options}
                                // filters={filters}
                                // defaultValue={value}
                                onOk={this.handleSelectModalOk}
                                onCancel={this.handleSelectModalCancel}
                            />
                            : null
                    }
                </Form>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        allPromotionList: state.sale_promotionDetailInfo_NEW.getIn(['$allPromotionListInfo', 'data', 'promotionTree']),
        allGiftList: state.sale_giftInfoNew.get('allGiftList'), // 所有哗啦啦券列表--共享用
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CreateShareRulesModal));