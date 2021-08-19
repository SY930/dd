import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Tree, Button, Tooltip, Input, message, Form, Radio, Row, Col, Tag, Select } from 'antd';
import { debounce } from 'lodash';
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import guideImg from './assets/guide.png';
import styles from './style.less';
const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
const AVAILABLE_GIFTS = [
    '10', '20', '21', '110', '111', '22', '115'
];
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const params = {
    "linkFlag": "string",
    "groupID": 0,
    "ruleDetails": [
        {
            "ruleIndex": "string",
            "ruleDetailID": 0,//新建不传，编辑返回
            "groupID": 0,
            "referenceType": '1',
            "ruleGroupName": "string",
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
            "referenceType": '1',
            "ruleGroupName": "string",
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
    "shareRuleType": 0,
    "shareRuleName": "string",
    "shopID": 0,
    "referenceID": 0,//引用情况下必传，可不传A组内容
    "operator": "string"
}
@injectIntl()
class CreateShareRulesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            ruleName: '',//规则名称
            referenceType: '0',//组方式
            shareRuleType: '1',//共享类型
            shareRuleName: '',//规则名称
            ruleGroupNameA: '',//活动A组名
            ruleGroupNameB: '',//活动B组名
            referenceID: '',//引用活动ID
        };
        this.debouncedHandleOk = debounce(this.handleOk, 400)
        this.debouncedChangeRuleName = debounce(this.debouncedChangeRuleName.bind(this), 500)
        // this.handleIconHover = this.handleIconHover.bind(this);
        // this.handleClose = this.handleClose.bind(this);
        this.handleActivityGroupRadioSelect = this.handleActivityGroupRadioSelect.bind(this)
        this.renderBetweenGroupCont = this.renderBetweenGroupCont.bind(this)
        this.renderInnerGroupCont = this.renderInnerGroupCont.bind(this)
        this.handleShareTypeChange = this.handleShareTypeChange.bind(this)
    }
    handleOk = () => {

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
    renderBetweenGroupCont() {//组件共享
        const { referenceType, referenceID, ruleGroupNameB } = this.state;
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
                            <RadioGroup defaultValue="0" value={referenceType} onChange={this.handleActivityGroupRadioSelect}>
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
                            referenceType == 0 ?
                                <FormItem
                                    label={'活动组名'}
                                    labelCol={{ span: 3 }}
                                    wrapperCol={{ span: 20 }}
                                    style={{ marginBottom: '0' }}
                                >
                                    {
                                        getFieldDecorator('ruleGroupNameA', {
                                            initialValue: this.state.ruleGroupNameA,
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
                                    <Select value={referenceID} style={{ width: 256 }} onChange={this.handleReferenceIDChange}>
                                        <Option value="情人节活动">情人节活动</Option>
                                        <Option value="lucy">Lucy</Option>
                                        <Option value="disabled" disabled>Disabled</Option>
                                        <Option value="Yiminghe">yiminghe</Option>
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
                                    <Tag closable onClose={this.closeActivityName} key="0" value={{ key: '0', name: '买减-买三送一' }}>买减-买三送一</Tag>
                                    <Tag closable onClose={this.closeActivityName} key="1" value={{ key: '1', name: '买减-买三送二' }}>买减-买三送二</Tag>
                                    <Tag closable onClose={this.closeActivityName} key="2" value={{ key: '2', name: '买减-买三送三' }}>买减-买三送三</Tag>
                                </Col>
                            </Col>
                            <Button icon="plus" className={styles.addActivityBtn}>添加(至多添加100个)</Button>
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
                                    initialValue: ruleGroupNameB,
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
                                    <Tag closable onClose={this.closeActivityName} key="0" value={{ key: '0', name: '买减-买三送一' }}>买减-买三送一</Tag>
                                    <Tag closable onClose={this.closeActivityName} key="1" value={{ key: '1', name: '买减-买三送二' }}>买减-买三送二</Tag>
                                    <Tag closable onClose={this.closeActivityName} key="2" value={{ key: '2', name: '买减-买三送三' }}>买减-买三送三</Tag>
                                </Col>
                            </Col>
                            <Button icon="plus" className={styles.addActivityBtn}>添加(至多添加100个)</Button>
                        </FormItem>
                    </Col>
                </FormItem>

            </Col>
        )
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { referenceType, shareRuleType } = this.state;
        const formItemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 20 },
        }
        const ruleDetails = [
            {
                "ruleIndex": "0",
                "ruleDetailID": 0,//新建不传，编辑返回
                "groupID": 0,
                "referenceType": '1',
                "ruleGroupName": "string",
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
                "ruleIndex": "1",
                "ruleDetailID": 0,//新建不传，编辑返回
                "groupID": 0,
                "referenceType": '1',
                "ruleGroupName": "string",
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
        ]
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
                                // initialValue: { number: this.state.startNo },
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
                        <Radio.Group value={this.state.shareRuleType} onChange={this.handleShareTypeChange}>
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