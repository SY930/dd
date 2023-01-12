import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Input, Select, message, Modal, Row, Col, Table, Card } from 'antd';
import registerPage from '../../../index';
import { SHARE_RULES_GROUP, SHARE_RULES_SHOP } from "../../constants/entryCodes";
import styles from './style.less'
import { share_rules } from '../../redux/reducer/shareRules'
import {
    changeSearchName,
    changeSearchType,
    createOrUpdateCertainShareGroup,
    deleteCertainShareGroup,
    removeItemFromCertainShareGroup,
    startCreateShareGroup,
    startEditCertainShareGroup,
} from "../../redux/actions/shareRules/index";
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import CreateShareRulesModal from "./CreateShareRulesModal";
import ExpireDateNotice from '../../components/common/ExpireDateNotice';
import { getRuleGroupList, queryShareRuleDetail, addShareRuleGroup, updateShareRuleGroup, deleteShareRuleGroup, initShareRuleGroup, setStorageValue, getStorageValue, FetchGiftList, fetchAllPromotionList } from './AxiosFactory';
import emptyPage from '../../assets/empty_page.png'
import { fetchPromotionScopeInfo } from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import shopImg from './assets/createOriginShop.png';
import { setSensorsData } from "../../helpers/util";
const { Option, OptGroup } = Select;
const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
const ALLEVENTWAY = { ...BASIC_PROMOTION_MAP, ...GIFT_MAP };

@registerPage([SHARE_RULES_GROUP, SHARE_RULES_SHOP], {
    share_rules
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
export default class ShareRules extends Component {
    state = {
        isCreate: false,
        isEdit: false,
        shareTypeInput: '2',
        createOriginInput: '2',
        searchTypeInput: '',
        searchNameInput: '',
        selected: [],
        selectedGroupID: undefined,
        batchModalVisible: false,
        unionBatchActivity: [], //维护的所选批量共享组的活动合集
        shareGroupInfosList: [],//共享组列表
        shareRuleInfo: {}, //获取的共享组详情
        isShowDetail: false,//显示详情
        isEditModal: false,//显示编辑确认框
        isCancelModal: false,//显示删除确认框
        isInitModal: false,//显示初始化弹窗
        linkFlag: false,//共享组是否被引用
        isShopEnv: this.props.user.shopID > 0 ? true : false,//是否店铺环境
        giftAndCouponList: [],
        shareRuleName: '',

    }
    componentDidMount() {
        let { groupID } = this.props.user.accountInfo;
        let initializedObj = getStorageValue('isInitialized');
        if (initializedObj && initializedObj.groupID == groupID) {
            this.queryAll();
        } else {
            this.setState({
                isInitModal: true
            })
            initShareRuleGroup({
                groupID,
                shopID: this.props.user.shopID > 0 ? this.props.user.shopID : '',
            }).then(boolen => {
                if (boolen) {
                    setStorageValue('isInitialized', true, 86400000 * 365, groupID)
                    this.queryAll();
                }
            })

        }
        // 请求获取所有哗啦啦券列表--共享用
        Promise.all([
            FetchGiftList({
                groupID,
                pageSize: 10000,
                pageNo: 1,
            }),
            fetchAllPromotionList({
                groupID,
                shopID: this.props.user.shopID > 0 ? this.props.user.shopID : undefined,
                isActive: -1,
                status: 4,//正在执行的活动和未开始执行的活动
                pageNo: 1, pageSize: 10000,
            })
        ]).then((data) => {
            if (data && data.length > 0) {
                this.setState({
                    giftAndCouponList: data
                })
            }
        })
        this.props.getAllShops();
        setSensorsData("共享规则设置");
    }
    //获取共享组列表
    queryAll = () => {
        getRuleGroupList({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : '',
        }).then((list) => {
            if (list.length > 0) {
                this.setState({
                    isInitModal: false,
                    shareGroupInfosList: list,
                })
            } else {
                this.setState({
                    isInitModal: false,
                    shareGroupInfosList: [],
                })
            }
        });
    }
    querySearchResult = () => {
        const { shareTypeInput, createOriginInput, searchTypeInput, searchNameInput, shareRuleName } = this.state;
        let queryCondition = {};
        queryCondition.shareRuleType = shareTypeInput;
        queryCondition.createType = createOriginInput;
        queryCondition.eventWay = searchTypeInput;
        getRuleGroupList({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : '',
            queryCondition
        }).then((list) => {
            if (list && list.length > 0) {
                let filterList = [];
                if (searchNameInput) {
                    list.forEach((item) => {
                        if (item.rulePromotionInfos && item.rulePromotionInfos.length > 0) {
                            item.rulePromotionInfos.forEach((item1) => {
                                if (item1.promotionName && item1.promotionName.indexOf(searchNameInput) > -1) {
                                    filterList.push(item)
                                }
                            })
                        }
                    })
                    if (shareRuleName) {
                        let temp = []
                        filterList.forEach((item) => {
                            if (item.shareRuleName && item.shareRuleName.indexOf(shareRuleName) > -1) {
                                temp.push(item)
                            }
                        })
                        filterList = temp
                    }
                } else {
                    if (shareRuleName) {
                        let temp = []
                        list.forEach((item) => {
                            if (item.shareRuleName && item.shareRuleName.indexOf(shareRuleName) > -1) {
                                temp.push(item)
                            }
                        })
                        filterList = temp
                    } else {
                        filterList = list
                    }
                }
                
                this.setState({
                    shareGroupInfosList: filterList
                })
            } else {
                this.setState({
                    shareGroupInfosList: []
                })
            }
        });
    }
    handleCancel = () => {
        this.setState({
            isCreate: false,
            isEdit: false,
            isCancelModal: false,
            selected: [],
            selectedGroupID: undefined,
            linkFlag: false,
            isEditModal: false
        })
    }
    handleOk = (data, create) => {
        data.shopID = this.props.user.shopID || '';
        if (create) {
            addShareRuleGroup(data).then((boolen) => {
                if (boolen) {
                    message.success('创建成功');
                    this.queryAll()
                    this.handleCancel()
                } else {
                    message.success('创建失败');
                }
            })
        } else {
            updateShareRuleGroup(data).then((boolen) => {
                if (boolen) {
                    message.success('更新成功');
                    this.queryAll()
                    this.handleCancel()
                } else {
                    message.success('更新失败');
                }
            })
        }
    }
    handleCloseDetailModal = () => {
        this.setState({
            isShowDetail: false
        })
        this.handleCancel()
    }
    handleEdit = (id) => {
        queryShareRuleDetail({ shareRuleID: id }).then(data => {
            this.setState({
                isEdit: true,
                isCreate: false,
                shareRuleInfo: data
            })
        })
    }
    //删除共享组
    handleDelete = () => {
        const { selectedGroupID } = this.state;
        deleteShareRuleGroup({ shareRuleID: selectedGroupID }).then((boolen) => {
            if (boolen) {
                message.success('删除成功');
                this.queryAll()
                this.handleCancel()
            } else {
                message.success('删除失败');
            }
        })
    }
    //展示共享组详情
    handleShowDetailModal = (e, id) => {
        queryShareRuleDetail({ shareRuleID: id }).then(data => {
            this.setState({
                isShowDetail: true,
                shareRuleInfo: data
            })
        })
    }
    //删除确认框弹出
    showDeleteModal = (id, isLinked) => {
        this.setState({
            isCancelModal: true,
            selectedGroupID: id,
            linkFlag: isLinked
        })
    }
    //被引用时编辑确认框弹出
    showEditModal = (id, isLinked) => {
        this.setState({
            isEditModal: true,
            selectedGroupID: id,
            linkFlag: isLinked
        })
    }
    //获取店铺名称
    getCreateBy = (shopID) => {
        const { shops } = this.props;
        const res = shops.find(item => item.get('shopID') == shopID);
        if (res) {
            return res.get('shopName');
        }
        return <p>{SALE_LABEL.k639vfmm + SALE_LABEL.k639vfuy + shopID + COMMON_LABEL.create}</p>;
    }
    renderHeader(isEmpty) {
        return (
            <div className={styles.header}>
                <div className={styles.titleArea} style={{position:'relative'}}>
                    <span className={styles.title}>
                        共享规则设置
                    </span>
                    <ExpireDateNotice productCode="HLL_CRM_Marketingbox" marginLeft="366px" marginTop="-10"/>
                    <span className={styles.subTitle}>
                        基础营销、哗啦啦优惠券活动间默认互斥，与会员权益默认共享，需要多个活动共享时需创建共享规则实现。
                    </span>
                </div>
                <Button
                    onClick={() => this.setState({ isCreate: true, isEdit: false, shareRuleInfo: {} })}
                    type="ghost"
                    className={styles.addRuleBtn}
                >
                    <Icon
                        type="plus"
                    />
                    新建共享规则
                </Button>
            </div>
        )
    }
    renderHeaderActions() {
        const shareType = [
            { value: '2', label: '全部' },
            { value: '0', label: '组内共享' },
            { value: '1', label: '组间共享' },
        ];
        const createOrigin = [
            { value: '2', label: '全部' },
            { value: '0', label: '集团创建' },
            { value: '1', label: '店铺创建' },
        ];
        const hualalaCoupon = [
            { value: '10', label: '代金券' },
            { value: '20', label: '菜品优惠券' },
            { value: '21', label: '菜品兑换券' },
            { value: '111', label: '折扣券' },
            { value: '110', label: '买赠券' },
        ]
        const {
            searchTypeInput,
            shareTypeInput,
            createOriginInput,
            searchNameInput,
            shareRuleName,
        } = this.state;
        const {
            isQuerying,
        } = this.props;

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
                {
                    this.props.user.shopID > 0 ? null : <span className={styles.headerLabel}>创建来源</span>
                }
                {
                    this.props.user.shopID > 0 ? null :
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
                }

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
                    style={{ width: 180, marginRight: 20 }}
                    placeholder="请输入营销活动名称"
                />
                <span className={styles.headerLabel}>共享规则名称</span>
                <Input
                    value={shareRuleName}
                    onChange={(e) => this.setState({ shareRuleName: e.target.value })}
                    style={{ width: 180, marginRight: 20 }}
                    placeholder="请输入共享规则名称"
                />
                <Button
                    type="primary"
                    disabled={isQuerying}
                    onClick={this.querySearchResult}
                >
                    <Icon type="search" />
                    {COMMON_LABEL.query}
                </Button>
            </div>
        )
    }
    renderRuleDetailModal() {
        const { shareRuleInfo } = this.state;
        let ruleDetails = shareRuleInfo.ruleDetails || [];
        let len = ruleDetails.length;
        const columns = [
            {
                title: '活动类型',
                dataIndex: 'eventWay',
                key: 'eventWay',
                className: 'textCenter',
                width: 100,
            },
            {
                title: '活动名称',
                dataIndex: 'promotionName',
                key: 'promotionName',
                width: 469,
            },
        ];

        let dataSource = [], dataSourceA = [], dataSourceB = [], shareGroupArr = [], notShareGroupArr = [], shareGroupArrA = {}, shareGroupArrB = {};
        switch (len) {
            case 1:
                let shareRulePromotionInfos = ruleDetails[0] && ruleDetails[0].shareRulePromotionInfos && ruleDetails[0].shareRulePromotionInfos.length > 0 ? ruleDetails[0].shareRulePromotionInfos : [];
                if (shareRulePromotionInfos.length > 0) {
                    shareRulePromotionInfos.forEach((item, index) => {
                        dataSource.push({
                            key: index,
                            ruleGroupName: '',
                            eventWay: ALLEVENTWAY[item.eventWay],
                            promotionName: item.promotionName
                        })
                    })
                } else {
                    dataSource = []
                }
                break
            case 2:
                let shareRulePromotionInfosA = [];
                let shareRulePromotionInfosB = [];

                shareGroupArr = ruleDetails.filter((item) => item.isLinked == true);//活动组A
                notShareGroupArr = ruleDetails.filter((item) => !item.isLinked);//活动组B
                if (shareGroupArr && shareGroupArr.length > 0) {//如果有共享的规则
                    shareGroupArrA = shareGroupArr[0];
                    shareGroupArrB = notShareGroupArr[0];
                    shareRulePromotionInfosA = shareGroupArrA.shareRulePromotionInfos || [];
                    shareRulePromotionInfosB = shareGroupArrB.shareRulePromotionInfos || [];
                }
                if (notShareGroupArr && notShareGroupArr.length == 2) {//如果都是互斥的规则
                    shareGroupArrA = notShareGroupArr[0];
                    shareGroupArrB = notShareGroupArr[1];
                    shareRulePromotionInfosA = shareGroupArrA.shareRulePromotionInfos || [];
                    shareRulePromotionInfosB = shareGroupArrB.shareRulePromotionInfos || [];
                }
                if (shareRulePromotionInfosA.length > 0) {
                    shareRulePromotionInfosA.forEach((item, index) => {
                        dataSourceA.push({
                            key: index,
                            eventWay: ALLEVENTWAY[item.eventWay],
                            promotionName: item.promotionName
                        })
                    })
                } else {
                    dataSourceA = []
                }
                if (shareRulePromotionInfosB.length > 0) {
                    shareRulePromotionInfosB.forEach((item, index) => {
                        dataSourceB.push({
                            key: index,
                            eventWay: ALLEVENTWAY[item.eventWay],
                            promotionName: item.promotionName
                        })
                    })
                } else {
                    dataSourceB = []
                }
                break;
            default:
                dataSource = []
        }

        return (
            <Modal
                maskClosable={true}
                title={'查看共享规则详情'}
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="large" onClick={this.handleCloseDetailModal}>
                        关闭
                    </Button>
                ]}
                onCancel={this.handleCloseDetailModal}
                width="700px"
                className={styles.createModal}
            >
                <div className={styles.detailsListLeft}>
                    <b>规则名称</b>
                    <span>{shareRuleInfo.shareRuleName}</span>
                </div>
                <div className={styles.detailsListLeft}>
                    <b>共享类型</b>
                    <span>{shareRuleInfo.shareRuleType == '1' ? '组间共享' : '组内共享'}</span>
                </div>
                {
                    len == 2 ?
                        <div>
                            <div className={styles.detailsListLeft}>
                                <div className={styles.tableWrapperLeft}>
                                    活动组A
                                    <br />
                                    <span style={{ color: '#999', fontWeight: 'normal' }}>{shareGroupArr && shareGroupArr.length > 0 ? '共享' : '互斥'}</span>
                                </div>
                                <div className={styles.tableWrapperRight}>
                                    {
                                        shareGroupArr && shareGroupArr.length > 0 ?
                                            <span className={styles.detailIsLinkedTag}>引用</span>
                                            :
                                            null
                                    }
                                    <div className={styles.detailActivityName}>{shareGroupArrA.ruleGroupName}</div>
                                    <Table
                                        columns={columns}
                                        dataSource={dataSourceA}
                                        pagination={false}
                                        bordered
                                        size="middle"
                                        scroll={{ y: 120 }}
                                    />
                                </div>
                            </div>
                            <div className={styles.detailsListLeft}>
                                <div className={styles.tableWrapperLeft}>
                                    活动组B
                                    <br />
                                    <span style={{ color: '#999', fontWeight: 'normal' }}>(互斥)</span>
                                </div>
                                <div className={styles.tableWrapperRight}>
                                    <div className={styles.detailActivityName}>{shareGroupArrB.ruleGroupName}</div>
                                    <Table
                                        columns={columns}
                                        dataSource={dataSourceB}
                                        pagination={false}
                                        bordered
                                        size="middle"
                                        scroll={{ y: 120 }}
                                    />
                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles.detailsListLeft}>
                            <div className={styles.tableWrapperLeft}>
                                共享内容
                            </div>
                            <div className={styles.tableWrapperRight}>
                                <Table
                                    columns={columns}
                                    dataSource={dataSource}
                                    pagination={false}
                                    bordered
                                    size="middle"
                                    scroll={{ y: 120 }}
                                />
                            </div>
                        </div>
                }
            </Modal>
        )
    }
    //共享规则删除确认框 
    renderCancelConfirmModal() {
        const alertCancelText = ' 组间共享规则引用了这个规则，请解除引用后再进行删除操作。';
        const { linkFlag, selectedGroupID, shareGroupInfosList } = this.state;
        let linkedGroupName = '';
        if (linkFlag) {
            shareGroupInfosList.forEach((item) => {
                if (item.referenceID && item.referenceID == selectedGroupID) {
                    linkedGroupName = item.shareRuleName
                }
            }
            )
        }
        return (
            <Modal
                maskClosable={true}
                title={
                    linkFlag ?
                        <p >
                            <Icon type="exclamation-circle-o" style={{ color: '#FAAD14' }} />
                            <b style={{ marginLeft: '15px' }}>该共享规则已被引用</b>
                        </p>
                        : null
                }
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="small" onClick={this.handleCancel}>
                        取消
                    </Button>,
                    linkFlag ? null :
                        <Button key="1" type="primary" size="small" onClick={this.handleDelete}>
                            确定
                        </Button>,
                ]}
                onCancel={this.handleCancel}
                width="443px"
            >
                <p className={styles.alertModalTitle} >
                    {
                        linkFlag ? <span><b>{linkedGroupName}</b> {alertCancelText}</span> : <b style={{ textAlign: 'center', marginLeft: '88px', fontSize: '16px' }}>确定要删除吗？</b>
                    }
                </p>
            </Modal>
        )
    }
    //显示初始化弹窗
    renderInitModal() {
        const alertCancelText = ' 共享规则加载中，请稍等。。。';
        return (
            <Modal
                maskClosable={true}
                visible={true}
                width="360px"
                wrapClassName={styles.initModalBox}
            >
                <p className={styles.alertModalTitle} >
                    {alertCancelText}
                </p>
            </Modal>
        )
    }
    //共享规则删除确认框
    renderEditConfirmModal() {
        const alertEditText = '组间共享规则引用了这个规则，编辑会影响引用的规则设置，是否确认修改？';
        const { linkFlag, selectedGroupID, shareGroupInfosList } = this.state;
        let linkedGroupName = '';
        if (linkFlag) {
            shareGroupInfosList.forEach((item) => {
                if (item.referenceID && item.referenceID == selectedGroupID) {
                    linkedGroupName = item.shareRuleName
                }
            }
            )
        }
        return (
            <Modal
                maskClosable={true}
                title={
                    linkFlag ?
                        <p >
                            <Icon type="exclamation-circle-o" style={{ color: '#1AB495' }} />
                            <b style={{ marginLeft: '15px' }}>该共享规则已被引用</b>
                        </p>
                        : null
                }
                visible={true}
                footer={[
                    <Button key="0" type="ghost" size="small" onClick={this.handleCancel}>
                        取消
                    </Button>,
                    <Button key="1" type="primary" size="small" onClick={() => this.handleEdit(selectedGroupID)}>
                        确定
                    </Button>,
                ]}
                onCancel={this.handleCancel}
                width="443px"
            >
                <p className={styles.alertModalTitle} >
                    <b>{linkedGroupName}</b> {alertEditText}
                </p>
            </Modal>
        )
    }
    renderContent() {
        const { shareGroupInfosList } = this.state;
        const { shopID } = this.props.user;
        return (
            <Row className={styles.bodyContainer} style={{ height: `calc(100% - 123px)` }}>
                {shareGroupInfosList && shareGroupInfosList.length > 0 ?
                    shareGroupInfosList.map((groupInfo, index) => {
                        return (
                            groupInfo.shareRuleSummaries && groupInfo.shareRuleSummaries.length > 1 ?
                                <Col key={index} className={styles.columnsWrapper}>
                                    <p className={styles.activityTitle}>
                                        <span className={styles.titleText}>{groupInfo.shareRuleName}</span>
                                        <span className={`${styles.titleTag} ${styles.teamShare}`}>组间共享</span>
                                    </p>
                                    <div className={styles.activityBothCont}>
                                        {
                                            groupInfo.shareRuleSummaries.map((ruleSummary, index1) => {
                                                return (
                                                    <div className={styles.contBothBox}>
                                                        {
                                                            ruleSummary.linked ?
                                                                <span className={styles.bothQuoteTag}>引用</span>
                                                                :
                                                                null
                                                        }
                                                        <p className={styles.contMtd}>{ruleSummary.ruleGroupName}</p>
                                                        <div className={styles.contScrollBox}>
                                                            <div className={styles.contList}>
                                                                <p><span>促销活动</span> <b>{ruleSummary.promotionCount}</b></p>
                                                                <p><span>哗啦啦券</span> <b>{ruleSummary.couponCount}</b></p>
                                                                <p><span>会员权益</span> <b>{ruleSummary.memberInterestsCount}</b></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    {
                                        groupInfo.shopID > 0 ?
                                            <div className={styles.activityOrigin}>
                                                <img className={styles.tagImg} src={shopImg} />
                                                <span>{this.getCreateBy(groupInfo.shopID)}</span>
                                            </div> : null
                                    }
                                    <div className={styles.activityOperate}>
                                        <span className={styles.operateDetail} onClick={(e) => this.handleShowDetailModal(e, groupInfo.shareRuleID)}>查看详情</span>
                                        {groupInfo.shopID > 0 && shopID <= 0 ? null : <span className={styles.operateEdit} onClick={groupInfo.linkFlag ? () => this.showEditModal(groupInfo.shareRuleID, groupInfo.linkFlag) : () => this.handleEdit(groupInfo.shareRuleID, groupInfo.linkFlag)}>编辑</span>}
                                        {groupInfo.shopID > 0 && shopID <= 0 ? null : <span className={styles.operateDelete} onClick={() => this.showDeleteModal(groupInfo.shareRuleID, groupInfo.linkFlag)}>删除</span>}
                                    </div>
                                </Col>
                                :
                                <Col key={index} className={styles.columnsWrapper}>
                                    {
                                        groupInfo.linkFlag == '1' ?
                                            <span className={styles.quoteTag}>被引用</span>
                                            : null
                                    }
                                    <p className={styles.activityTitle}>
                                        <span className={styles.titleText}>{groupInfo.shareRuleName}</span>
                                        <span className={styles.titleTag}>组内共享</span>
                                    </p>
                                    {
                                        groupInfo.shareRuleSummaries && groupInfo.shareRuleSummaries.length > 0 ?
                                            <div className={styles.activityCont}>
                                                <p className={styles.contMtd}>{groupInfo.shareRuleSummaries[0].ruleGroupName}</p>
                                                <div className={styles.contScrollBox}>
                                                    <div className={styles.contList}>
                                                        <p>促销活动 <b>{groupInfo.shareRuleSummaries[0].promotionCount}</b></p>
                                                        <p>哗啦啦券 <b>{groupInfo.shareRuleSummaries[0].couponCount}</b></p>
                                                        <p>会员权益 <b>{groupInfo.shareRuleSummaries[0].memberInterestsCount}</b></p>
                                                    </div>
                                                </div>
                                            </div> : null
                                    }
                                    {
                                        groupInfo.shopID > 0 ?
                                            <div className={styles.activityOrigin}>
                                                <img className={styles.tagImg} src={shopImg} />
                                                <span>{this.getCreateBy(groupInfo.shopID)}</span>
                                            </div> : null
                                    }
                                    <div className={styles.activityOperate}>
                                        <span className={styles.operateDetail} onClick={(e) => this.handleShowDetailModal(e, groupInfo.shareRuleID)} value={JSON.stringify(groupInfo)}>查看详情</span>
                                        {groupInfo.shopID > 0 && shopID <= 0 ? null : <span className={styles.operateEdit} onClick={groupInfo.linkFlag ? () => this.showEditModal(groupInfo.shareRuleID, groupInfo.linkFlag) : () => this.handleEdit(groupInfo.shareRuleID, groupInfo.linkFlag)}>编辑</span>}
                                        {groupInfo.shopID > 0 && shopID <= 0 ? null : <span className={styles.operateDelete} onClick={() => this.showDeleteModal(groupInfo.shareRuleID, groupInfo.linkFlag)}>删除</span>}
                                    </div>
                                </Col>
                        )
                    }
                    )
                    :
                    <div className={styles.emptyData}>
                        <img src={emptyPage} alt="" style={{ width: '50px' }} />
                        <p className={styles.emptyDataText} style={{ marginTop: '12px' }}>暂无数据</p>
                    </div>
                }
            </Row>
        )
    }
    render() {
        const { isCreate, isEdit, selected, isShowDetail, shareRuleInfo, shareGroupInfosList, isCancelModal, isEditModal, isInitModal } = this.state;
        const { isSaving } = this.props;
        let shareGroupList = shareGroupInfosList.filter((item) => item.linkFlag == '0' && item.shareRuleType == '0')
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                {this.renderHeaderActions()}
                <div className={styles.divideLine} />
                {this.renderContent()}
                {
                    (isCreate || isEdit) && (//创建或者编辑共享组
                        <CreateShareRulesModal
                            isCreate={isCreate}
                            handleCancel={this.handleCancel}
                            handleOk={this.handleOk}
                            loading={isSaving}
                            formData={shareRuleInfo}
                            shareGroupList={isCreate ? shareGroupList : shareGroupInfosList}
                            selectedPromotions={selected}
                            groupID={this.props.user.accountInfo.groupID}
                            userName={this.props.user.accountInfo.userName}
                            giftAndCouponList={this.state.giftAndCouponList}
                        />
                    )
                }
                {isShowDetail && this.renderRuleDetailModal()}
                {isCancelModal && this.renderCancelConfirmModal()}
                {isInitModal && this.renderInitModal()}
                {isEditModal && this.renderEditConfirmModal()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        isQuerying: state.share_rules.get('isQuerying'),
        isSaving: state.share_rules.get('isSaving'),
        isCreate: state.share_rules.get('isCreate'),
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
        // queryShareGroups: opts => dispatch(queryShareGroups(opts)),
        createOrUpdateCertainShareGroup: (opts) => dispatch(createOrUpdateCertainShareGroup(opts)),
        deleteCertainShareGroup: opts => dispatch(deleteCertainShareGroup(opts)),
        removeItemFromCertainShareGroup: opts => dispatch(removeItemFromCertainShareGroup(opts)),
        getAllShops: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
    };
}
