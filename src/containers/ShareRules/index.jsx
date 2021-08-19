import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Icon,Button,Input,Select,Alert,Spin,Tooltip,Popconfirm,message,Modal,Checkbox,Row,Col} from 'antd';
import registerPage from '../../../index';
import { SHARE_RULES_GROUP, SHARE_RULES_SHOP } from "../../constants/entryCodes";
import styles from './style.less'
import { share_rules } from '../../redux/reducer/shareRules'
import {
    changeSearchName,
    changeSearchType,
    createOrUpdateCertainShareGroup,
    deleteCertainShareGroup,
    queryShareGroups,
    removeItemFromCertainShareGroup,
    startCreateShareGroup,
    startEditCertainShareGroup,
} from "../../redux/actions/shareRules/index";
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import CreateShareRulesModal from "./CreateShareRulesModal";
import BatchGroupEditModal from './BatchGroupEditModal';
import { FetchGiftList } from "../GiftNew/_action";
import { fetchAllPromotionListAC } from "../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import emptyPage from '../../assets/empty_page.png'
import { fetchPromotionScopeInfo } from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import PriceInput from '../SaleCenterNEW/common/PriceInput';
import groupImg from './assets/createOriginGroup.png';
import shopImg from './assets/createOriginShop.png';

const { Option, OptGroup } = Select;
const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
const params = {
    "shareGroupInfos": [
        {
            "linkFlag": "string",
            "groupID": 0,
            "shareRuleSummaries": [
                {
                    "ruleDetailID": 0,
                    "promotionCount": "string",
                    "groupID": 0,
                    "couponCount": "string",
                    "summaryID": 0,
                    "shareRuleID": 0,
                    "memberInterestsCount": "string"
                }
            ],
            "shareRuleID": 0,
            "shareRuleType": "string",
            "shareRuleName": "string",
            "shopID": "string",
            "referenceID": 0
        },
        {
            "linkFlag": "string",
            "groupID": 0,
            "shareRuleSummaries": [
                {
                    "ruleDetailID": 0,
                    "promotionCount": "string",
                    "groupID": 0,
                    "couponCount": "string",
                    "summaryID": 0,
                    "shareRuleID": 0,
                    "memberInterestsCount": "string"
                }
            ],
            "shareRuleID": 0,
            "shareRuleType": "string",
            "shareRuleName": "string",
            "shopID": "string",
            "referenceID": 0
        }
    ]
}
@registerPage([SHARE_RULES_GROUP, SHARE_RULES_SHOP], {
    share_rules
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
export default class ShareRules extends Component {

    state = {
        isCreate: false,
        isEdit: false,
        shareTypeInput:'',
        createOriginInput:'',
        searchTypeInput: '',
        searchNameInput: '',
        selected: [],
        selectedGroupID: undefined,
        batchModalVisible: false,
        unionBatchActivity: [], //维护的所选批量共享组的活动合集
        batchList: [], //批量共享组多选数组
        ifCanEditName: false,
        editNameValue: ''
    }

    componentDidMount() {
        // 请求获取所有基础营销活动--共享用
        this.props.fetchAllPromotionList({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : undefined,
            isActive: 1,
            status: 2,
        })
        // 请求获取所有哗啦啦券列表--共享用
        this.props.FetchGiftList({
            groupID: this.props.user.accountInfo.groupID,
            pageSize: 10000,
            pageNo: 1,
        }, true);
        this.queryAll();
        this.props.getAllShops();
    }

    queryAll = () => {
        this.props.queryShareGroups({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : 0,
        });
    }

    handleCancel = () => {
        this.setState({
            isCreate: false,
            isEdit: false,
            selected: [],
            selectedGroupID: undefined
        })
    }

    handleOk = ({ shareGroupDetailList, shareGroupName }) => {
        const { selectedGroupID } = this.state;
        return this.props.createOrUpdateCertainShareGroup({
            shareGroupName,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : 0,
            shareType: 0,
            itemID: selectedGroupID,
            shareGroupDetailList: shareGroupDetailList.map(item => ({
                activityID: item.value,
                activitySourceType: item.type,
                activitySource: item.activitySource,
                activityType: item.activityType,
            }))
        }).then(() => {
            message.success(SALE_LABEL.k5do0ps6);
            this.queryAll()
            this.handleCancel()
        })
    }

    renderHeader(isEmpty) {
        return (
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <span className={styles.title}>
                        共享规则设置
                    </span>
                    <span className={styles.subTitle}>
                        各类营销（基础营销、哗啦啦优惠券、会员权益）内活动默认互斥，需要多个活动共享时需创建共享规则实现。
                    </span>
                </div>
                {
                    !isEmpty && (
                        <Button
                            onClick={() => this.setState({ isCreate: true, isEdit: false })}
                            type="ghost"
                            className={styles.addRuleBtn}
                        >
                            <Icon
                                type="plus"
                            />
                            新建共享规则
                        </Button>
                    )
                }
                
            </div>
        )
    }
    renderHeaderActions() {
        const shareType = [
            {value:'',label:'全部'},
            {value:'1',label:'组内共享'},
            {value:'2',label:'组间共享'},
        ];
        const createOrigin = [
            {value:'',label:'全部'},
            {value:'1',label:'组内共享'},
            {value:'2',label:'组间共享'},
        ];
        const hualalaCoupon = [
            {value:'10',label:'代金券'},
            {value:'20',label:'菜品优惠券'},
            {value:'21',label:'菜品兑换券'},
            {value:'111',label:'折扣券'},
            {value:'110',label:'买赠券'},
        ]
        const {
            searchTypeInput,
            shareTypeInput,
            createOriginInput,
            searchNameInput,
        } = this.state;
        const {
            isQuerying,
            changeSearchType,
            changeSearchName,
        } = this.props;
        const { intl } = this.props;
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        const k636qv8y = intl.formatMessage(SALE_STRING.k636qv8y);
        const k5m5av7b = intl.formatMessage(SALE_STRING.k5m5av7b);
        const k5m5aw4n = intl.formatMessage(SALE_STRING.k5m5aw4n);
        const k5m4q0r2 = intl.formatMessage(SALE_STRING.k5m4q0r2);
        const k5m4q0ze = intl.formatMessage(SALE_STRING.k5m4q0ze);
        return (
            <div className={styles.headerActions}>
                <span className={styles.headerLabel}>共享类型</span>
                <Select
                    style={{ width: 150, marginRight: 20 }}
                    value={shareTypeInput}
                    onChange={(v) => this.setState({ shareTypeInput: v })}
                >
                    {
                        shareType.map(item => (
                            <Option key={item.value} value={item.value}>{item.label}</Option>
                        ))
                    }
                </Select>
                <span className={styles.headerLabel}>创建来源</span>
                <Select
                    style={{ width: 150, marginRight: 20 }}
                    value={createOriginInput}
                    onChange={(v) => this.setState({ createOriginInput: v })}
                >
                    {
                        createOrigin.map(item => (
                            <Option key={item.value} value={item.value}>{item.label}</Option>
                        ))
                    }
                </Select>
                <span className={styles.headerLabel}>活动类型</span>
                <Select
                    style={{ width: 150, marginRight: 20 }}
                    value={searchTypeInput}
                    onChange={(v) => this.setState({ searchTypeInput: v })}
                >
                    <Option value="">全部</Option>
                    <OptGroup label={'营销活动'}>
                        {
                            AVAILABLE_PROMOTIONS.map(item => (
                                <Option key={item} value={item}>{BASIC_PROMOTION_MAP[item]}</Option>
                            ))
                        }
                    </OptGroup>
                    <OptGroup label={'哗啦啦券'}>
                        {
                            hualalaCoupon.map(item => (
                                <Option key={item.value} value={item.value}>{item.label}</Option>
                            ))
                        }
                    </OptGroup>
                    <OptGroup label={'会员权益'}>
                        <Option value="-10">{'会员价'}</Option>
                        <Option value="-20">{'会员折扣'}</Option>
                    </OptGroup>
                </Select>
                <span className={styles.headerLabel}>包含活动</span>
                <Input
                    value={searchNameInput}
                    onChange={(e) => this.setState({ searchNameInput: e.target.value })}
                    onPressEnter={() => {
                        changeSearchType(searchTypeInput);
                        changeSearchName(searchNameInput);
                        this.queryAll()
                    }}
                    style={{ width: 180, marginRight: 20 }}
                    placeholder="请输入营销活动名称"
                />
                <Button
                    type="primary"
                    disabled={isQuerying}
                    onClick={() => {
                        changeSearchType(searchTypeInput);
                        changeSearchName(searchNameInput);
                        this.queryAll()
                    }}
                >
                    <Icon type="search" />
                    {COMMON_LABEL.query}
                </Button>
            </div>
        )
    }
    renderContent(){
        return (
            <Row className={styles.bodyContainer}>
                <Col key='0' className={styles.columnsWrapper}>
                    <p className={styles.activityTitle}>
                        <span className={styles.titleText}>五一促销活动共享组2021</span>
                        <span className={styles.titleTag}>组内共享</span>
                    </p>
                    <div className={styles.activityCont}>
                        <p className={styles.contMtd}>组内活动可共享</p>
                        <div className={styles.contScrollBox}>
                            <div className={styles.contList}>
                                <p>促销活动 <b>2</b></p> 
                                <p>会员权益备份 <b>2</b></p> 
                                <p>哗啦啦券 <b>2</b></p> 
                                <p>会员权益备份 <b>2</b></p> 
                                <p>哗啦啦券 <b>2</b></p> 
                            </div>
                        </div>
                    </div>
                    <div className={styles.activityOrigin}>
                        <img className={styles.tagImg} src={groupImg} />
                        <span>集团创建</span>
                    </div>
                    <div className={styles.activityOperate}>
                        <span className={styles.operateDetail}>查看详情</span>
                        <span className={styles.operateEdit}>编辑</span>
                        <span className={styles.operateDelete}>删除</span>
                    </div>
                    <span className={styles.quoteTag}>被引用</span>
                </Col>
                <Col key='1' className={styles.columnsWrapper}>
                    <p className={styles.activityTitle}>
                        <span className={styles.titleText}>五一促销活动共享组2021</span>
                        <span className={`${styles.titleTag } ${styles.teamShare}`}>组内共享</span>
                    </p>
                    <div className={styles.activityBothCont}>
                        <div className={styles.contBothBox}>
                            <p className={styles.contMtd}>情人节活动</p>
                            <div className={styles.contScrollBox}>
                                <div className={styles.contList}>
                                    <p><span>促销活动</span> <b>2</b></p> 
                                    <p><span>会员权益备份备份备份备份</span> <b>2</b></p> 
                                    <p><span>会员权益备份备份备份备份</span> <b>2</b></p> 
                                    <p><span>会员权益备份备份备份备份</span> <b>2</b></p> 
                                    <p><span>会员权益备份备份备份备份</span> <b>2</b></p> 
                                </div>
                            </div>
                        </div>
                        <div className={styles.contBothBox}>
                            <span className={styles.bothQuoteTag}>引用</span>
                            <p className={styles.contMtd}>新店开业促销</p>
                            <div className={styles.contScrollBox}>
                                <div className={styles.contList}>
                                    <p><span>促销活动</span> <b>2</b></p> 
                                    <p><span>会员权益备份备份备份备份</span> <b>2</b></p> 
                                    <p><span>会员权益备份备份备份备份</span> <b>2</b></p> 
                                    <p><span>会员权益备份备份备份备份</span> <b>2</b></p> 
                                    <p><span>会员权益备份备份备份备份</span> <b>2</b></p> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.activityOrigin}>
                        <img className={styles.tagImg} src={groupImg} />
                        <span>集团创建</span>
                    </div>
                    <div className={styles.activityOperate}>
                        <span className={styles.operateDetail}>查看详情</span>
                        <span className={styles.operateEdit}>编辑</span>
                        <span className={styles.operateDelete}>删除</span>
                    </div>
                </Col>
                
            </Row>
        )
    }
    render() {
        const {isCreate,isEdit,selected} = this.state;
        const { shareGroups,isSaving } = this.props;
        const vanillaShareGroups = shareGroups.toJS();
        const displayHeaderActions = !!vanillaShareGroups.length;
        return (
            <div>
                {this.renderHeader(!vanillaShareGroups.length)}
                {displayHeaderActions && this.renderHeaderActions()}
                <div className={styles.divideLine}/>
                {this.renderContent()}
                {
                    (isCreate || isEdit) && (
                        <CreateShareRulesModal
                            isCreate={isCreate}
                            handleCancel={this.handleCancel}
                            handleOk={this.handleOk}
                            loading={isSaving}
                            selectedPromotions={selected}
                        />
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isQuerying: state.share_rules.get('isQuerying'),
        isSaving: state.share_rules.get('isSaving'),
        shareGroups: state.share_rules.get('shareGroups'),
        isCreate: state.share_rules.get('isCreate'),
        isRemoving: state.share_rules.get('isRemoving'),
        isDeleting: state.share_rules.get('isDeleting'),
        searchPromotionType: state.share_rules.get('searchPromotionType'),
        searchPromotionName: state.share_rules.get('searchPromotionName'),
        isEdit: state.share_rules.get('isEdit'),
        share_rules: state.messageTemplateState.get('messageTemplateList'),
        user: state.user.toJS(),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        myActivities: state.sale_myActivities_NEW,
        giftInfoNew: state.sale_giftInfoNew, // 所有哗啦啦券列表--共享用
        mySpecialActivities: state.sale_mySpecialActivities_NEW, // 所有会员等级列表--共享用
        shops: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'shops']),
        shareGroupName: state.share_rules.get('shareGroupName'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeSearchType: opts => dispatch(changeSearchType(opts)),
        changeSearchName: opts => dispatch(changeSearchName(opts)),
        startCreateShareGroup: opts => dispatch(startCreateShareGroup(opts)),
        startEditCertainShareGroup: opts => dispatch(startEditCertainShareGroup(opts)),
        queryShareGroups: opts => dispatch(queryShareGroups(opts)),
        createOrUpdateCertainShareGroup: (opts) => dispatch(createOrUpdateCertainShareGroup(opts)),
        deleteCertainShareGroup: opts => dispatch(deleteCertainShareGroup(opts)),
        removeItemFromCertainShareGroup: opts => dispatch(removeItemFromCertainShareGroup(opts)),

        fetchAllPromotionList: (opts) => {
            dispatch(fetchAllPromotionListAC(opts))
        },
        FetchGiftList: (opts, isAllGifts) => {
            dispatch(FetchGiftList(opts, isAllGifts))
        },
        getAllShops: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
    };
}
