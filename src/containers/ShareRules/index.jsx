import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Input, Select, Alert, Spin, Tooltip, Popconfirm, message, Modal, Checkbox, Row, Col, Table } from 'antd';
import registerPage from '../../../index';
import { SHARE_RULES_GROUP, SHARE_RULES_SHOP } from "../../constants/entryCodes";
import styles from './style.less'
import { share_rules } from '../../redux/reducer/shareRules'
import {
    changeSearchName,
    changeSearchType,
    createOrUpdateCertainShareGroup,
    deleteCertainShareGroup,
    // queryShareGroups,
    removeItemFromCertainShareGroup,
    startCreateShareGroup,
    startEditCertainShareGroup,
} from "../../redux/actions/shareRules/index";
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import CreateShareRulesModal from "./CreateShareRulesModal";
import BatchGroupEditModal from './BatchGroupEditModal';
import { FetchGiftList } from "../GiftNew/_action";
import { getRuleGroupList, queryShareRuleDetail, queryShareRuleDetailList } from './AxiosFactory';
import { fetchAllPromotionListAC } from "../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import emptyPage from '../../assets/empty_page.png'
import { fetchPromotionScopeInfo } from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from './IntlDecor';
import PriceInput from '../SaleCenterNEW/common/PriceInput';
import groupImg from './assets/createOriginGroup.png';
import shopImg from './assets/createOriginShop.png';
import CouponTrdChannelStockNums from 'containers/GiftNew/GiftAdd/common/CouponTrdChannelStockNums';

const { Option, OptGroup } = Select;
const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
const ALLEVENTWAY = { ...BASIC_PROMOTION_MAP, ...GIFT_MAP };
const shareGroupInfosList1 = [
    {
        "linkFlag": 'true',
        "groupID": 0,
        "shareRuleSummaries": [
            {
                "ruleDetailID": 0,
                "promotionCount": "3",
                "groupID": 0,
                "couponCount": "4",
                "summaryID": 0,
                "shareRuleID": 0,
                "memberInterestsCount": "5",
                "activityName": "明天会更好"
            }
        ],
        "shareRuleID": 0,
        "shareRuleType": "0",
        "shareRuleName": "五一促销活动共享组2021",
        "shopID": "string",
        "referenceID": 0
    },
    {
        "linkFlag": 'false',
        "groupID": 0,
        "shareRuleSummaries": [
            {
                "ruleDetailID": 0,
                "promotionCount": "10",
                "groupID": 0,
                "couponCount": "20",
                "summaryID": 0,
                "shareRuleID": 0,
                "memberInterestsCount": "30",
                "activityName": "日常互动"
            },
            {
                "ruleDetailID": 0,
                "promotionCount": "11",
                "groupID": 0,
                "couponCount": "21",
                "summaryID": 0,
                "shareRuleID": 0,
                "memberInterestsCount": "31",
                "activityName": "2021新年活动",
                "isLinked": true
            }
        ],
        "shareRuleID": 0,
        "shareRuleType": "1",
        "shareRuleName": "五一促销活动共享组2022",
        "shopID": "string",
        "referenceID": 0
    }
]

@registerPage([SHARE_RULES_GROUP, SHARE_RULES_SHOP], {
    share_rules
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
export default class ShareRules extends Component {
    state = {
        isCreate: false,
        isEdit: false,
        shareTypeInput: '',
        createOriginInput: '',
        searchTypeInput: '',
        searchNameInput: '',
        selected: [],
        selectedGroupID: undefined,
        batchModalVisible: false,
        unionBatchActivity: [], //维护的所选批量共享组的活动合集
        shareGroupInfosList:[],//共享组列表
        shareRuleInfo: {}, //获取的共享组详情
        ifCanEditName: false,
        editNameValue: '',
        isShowDetail: false,
        isShopEnv: this.props.user.shopID > 0 ? true : false,//是否店铺环境
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
        getRuleGroupList({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID > 0 ? this.props.user.shopID : '',
        }).then((list) => {
            this.setState({
                shareGroupInfosList: list
            })
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
    handleCloseDetailModal = () => {
        this.setState({
            isShowDetail: false
        })
    }
    handleEdit = (id) => {
        console.log(id,'id----------------')
        queryShareRuleDetail({ shareRuleID: id }).then(data => {
            this.setState({
                isEdit: true,
                isCreate: false,
                shareRuleInfo: data
            })
        })
    }
    handleShowDetailModal = (e, id) => {
        queryShareRuleDetail({ shareRuleID: id }).then(data => {
            this.setState({
                isShowDetail: true,
                shareRuleInfo: data
            })
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
            </div>
        )
    }
    renderHeaderActions() {
        const shareType = [
            { value: '', label: '全部' },
            { value: '1', label: '组内共享' },
            { value: '2', label: '组间共享' },
        ];
        const createOrigin = [
            { value: '', label: '全部' },
            { value: '1', label: '组内共享' },
            { value: '2', label: '组间共享' },
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
        } = this.state;
        const {
            isQuerying,
            changeSearchType,
            changeSearchName,
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
                    // render(value, record) {
                    //     return (
                    //         <span>
                    //             <a
                    //                 href="javaScript:;"
                    //                 onClick={() => {
                    //                     this.handleEdit(record, 'detail')
                    //                 }}
                    //             >
                    //                 查看
                    //             </a>
                    //             <Authority rightCode={GIFT_DETAIL_QUERY}>
                    //                 {
                    //                     (isBrandOfHuaTianGroupList() && !isMine(record)) ? (
                    //                         <a disabled={true}>详情</a>
                    //                     ) : (
                    //                         <a href="javaScript:;" onClick={() => this.handleMore(record)}>详情</a>
                    //                     )
                    //                 }
                    //             </Authority>
                    //         </span>
                    //     )
                    // },
                },
                {
                    title: '活动名称',
                    dataIndex: 'promotionName',
                    key: 'promotionName',
                    width: 469,
                },
        ];

        let dataSource = [], dataSourceA = [], dataSourceB = [],shareGroupArr = [],notShareGroupArr = [],shareGroupArrA = {},shareGroupArrB = {};
        switch (len) {
            case 1:
                let shareRulePromotionInfos = ruleDetails[0] || [];
                shareRulePromotionInfos.forEach((item, index) => {
                    dataSource.push({
                        key: index,
                        ruleGroupName: '',
                        eventWay: ALLEVENTWAY[item.eventWay],
                        promotionName: item.promotionName
                    })
                })
                break
            case 2:
                let shareRulePromotionInfosA = [];
                let shareRulePromotionInfosB = [];
                
                shareGroupArr = ruleDetails.filter((item) => item.isLinked == true);//活动组A
                notShareGroupArr = ruleDetails.filter((item) => !item.isLinked);//活动组B
                if(shareGroupArr && shareGroupArr.length > 0){//如果有共享的规则
                    shareGroupArrA = shareGroupArr[0];
                    shareGroupArrB = notShareGroupArr[0];
                    shareRulePromotionInfosA = shareGroupArrA.shareRulePromotionInfos || [];
                    shareRulePromotionInfosB = shareGroupArrB.shareRulePromotionInfos || [];
                }
                if(notShareGroupArr && notShareGroupArr.length == 2){//如果都是互斥的规则
                    shareGroupArrA = notShareGroupArr[0];
                    shareGroupArrB = notShareGroupArr[1];
                    shareRulePromotionInfosA = shareGroupArrA.shareRulePromotionInfos || [];
                    shareRulePromotionInfosB = shareGroupArrB.shareRulePromotionInfos || [];
                }

                shareRulePromotionInfosA.forEach((item, index) => {
                    dataSourceA.push({
                        key: index,
                        eventWay: ALLEVENTWAY[item.eventWay],
                        promotionName: item.promotionName
                    })
                })
                shareRulePromotionInfosB.forEach((item, index) => {
                    dataSourceB.push({
                        key: index,
                        eventWay: ALLEVENTWAY[item.eventWay],
                        promotionName: item.promotionName
                    })
                })
                break;
            default:
                dataSource = []
        }

        console.log(
            dataSource,dataSourceA,dataSourceB,'hanleyouhan  dangwo bucunzai '
        )

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
                                    <span style={{ color: '#999', fontWeight: 'normal' }}>{shareGroupArr && shareGroupArr.length > 0  ? '共享' : '互斥'}</span>
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
    renderContent() {
        const { shareGroupInfosList } = this.state;
        return (
            <Row className={styles.bodyContainer}>
                {shareGroupInfosList.map((groupInfo, index) => {
                    return (
                        groupInfo.shareRuleSummaries.length > 1 ?
                            <Col key={index} className={styles.columnsWrapper}>
                                <p className={styles.activityTitle}>
                                    <span className={styles.titleText}>{groupInfo.shareRuleName}</span>
                                    <span className={`${styles.titleTag} ${styles.teamShare}`}>组内共享</span>
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
                                <div className={styles.activityOrigin}>
                                    <img className={styles.tagImg} src={groupImg} />
                                    <span>集团创建</span>
                                </div>
                                <div className={styles.activityOperate}>
                                    <span className={styles.operateDetail} onClick={(e) => this.handleShowDetailModal(e, groupInfo.shareRuleID)}>查看详情</span>
                                    <span className={styles.operateEdit} onClick={() => this.handleEdit(groupInfo.shareRuleID)}>编辑</span>
                                    <span className={styles.operateDelete}>删除</span>
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
                                <div className={styles.activityCont}>
                                    <p className={styles.contMtd}>{groupInfo.shareRuleSummaries[0].ruleGroupName}</p>
                                    <div className={styles.contScrollBox}>
                                        <div className={styles.contList}>
                                            <p>促销活动 <b>{groupInfo.shareRuleSummaries[0].promotionCount}</b></p>
                                            <p>哗啦啦券 <b>{groupInfo.shareRuleSummaries[0].couponCount}</b></p>
                                            <p>会员权益 <b>{groupInfo.shareRuleSummaries[0].memberInterestsCount}</b></p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.activityOrigin}>
                                    <img className={styles.tagImg} src={groupImg} />
                                    <span>集团创建</span>
                                </div>
                                <div className={styles.activityOperate}>
                                    <span className={styles.operateDetail} onClick={(e) => this.handleShowDetailModal(e, groupInfo.shareRuleID)} value={JSON.stringify(groupInfo)}>查看详情</span>
                                    <span className={styles.operateEdit} onClick={() => this.handleEdit(groupInfo.shareRuleID)}>编辑</span>
                                    <span className={styles.operateDelete}>删除</span>
                                </div>
                            </Col>
                    )
                }
                )
                }

            </Row>
        )
    }
    render() {
        const { isCreate, isEdit, selected, isShowDetail,shareRuleInfo,shareGroupInfosList } = this.state;
        const { shareGroups, isSaving } = this.props;
        const vanillaShareGroups = shareGroups.toJS();
        const displayHeaderActions = !!vanillaShareGroups.length;
        return (
            <div>
                {this.renderHeader()}
                {displayHeaderActions && this.renderHeaderActions()}
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
                            shareGroupList={shareGroupInfosList}
                            selectedPromotions={selected}
                        />
                    )
                }
                {
                    isShowDetail && this.renderRuleDetailModal()//共享组查看详情
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
        // queryShareGroups: opts => dispatch(queryShareGroups(opts)),
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
