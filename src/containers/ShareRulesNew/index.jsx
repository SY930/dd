import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button, Input, Select, message, Modal, Row, Col, Table, Pagination } from 'antd';
import registerPage from '../../../index';

import styles from './style.less'

import {
    changeSearchName,
    changeSearchType,
    createOrUpdateCertainShareGroup,
    deleteCertainShareGroup,
    removeItemFromCertainShareGroup,
    startCreateShareGroup,
    startEditCertainShareGroup,
    refreshList
} from "../../redux/actions/shareRules/index";
import { BASIC_PROMOTION_MAP, GIFT_MAP } from "../../constants/promotionType";
import ExpireDateNotice from '../../components/common/ExpireDateNotice';
import { getRuleGroupList, getRuleList, deleteRule } from './AxiosFactory';
import emptyPage from '../../assets/empty_page.png'
import { fetchPromotionScopeInfo } from "../../redux/actions/saleCenterNEW/promotionScopeInfo.action";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { injectIntl } from './IntlDecor';

const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);
const ALLEVENTWAY = { ...BASIC_PROMOTION_MAP, ...GIFT_MAP };

import { jumpPage } from '@hualala/platform-base';
import { SHARE_RULES_GROUP_NEW, CREATE_SHARE_RULES_NEW } from '../../constants/entryCodes'
import ShopSelector from "../../components/common/ShopSelector/ShopSelector";

@registerPage([SHARE_RULES_GROUP_NEW], {

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


        packageName: '',
        shopSchema: this.props.shopSchema.getIn(['shopSchema']).toJS(),

        shopIdList: [],

        pageNo: 1,
        pageSize: 25,
        total: 0,

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.shopSchema.getIn(['shopSchema']) !== this.props.shopSchema.getIn(['shopSchema'])) {
            this.setState({
                shopSchema: nextProps.shopSchema.getIn(['shopSchema']).toJS(), // 后台请求来的值
            });
        }
    }

    componentDidMount() {
        this.queryAll();
        this.props.getAllShops();
    }

    componentDidUpdate(nextProps) {
        if (nextProps.$$refreshFlag != this.props.$$refreshFlag) {
            if (this.props.$$refreshFlag) {
                this.queryAll()
            }
        }
    }

    //获取共享组列表
    queryAll = () => {
        let { groupID } = this.props.user.accountInfo;
        getRuleList({
            groupID,
            pageSize: this.state.pageSize,
            pageNo: this.state.pageNo,
            shopIdList: [],
            packageName: '',
        }).then(data => {
            this.setState({
                activityTypeRulePageQueryData: data.activityTypeRulePageQueryData,
                total: data.totalSize,
                pageNo: data.pageNo,
                pageSize: data.pageSize
            })
        })
    }
    querySearchResult = () => {
        let { groupID } = this.props.user.accountInfo;
        getRuleList({
            groupID,
            pageSize: this.state.pageSize,
            pageNo: this.state.pageNo,
            shopIdList: this.state.shopIdList,
            packageName: this.state.packageName,
        }).then((data) => {
            this.setState({
                activityTypeRulePageQueryData: data.activityTypeRulePageQueryData,
                total: data.totalSize,
                pageNo: data.pageNo,
                pageSize: data.pageSize
            })
        });
    }

    handleEdit = (id) => {
        const { refreshList } = this.props;
        refreshList({ flag: false });
        jumpPage({ menuID: CREATE_SHARE_RULES_NEW, from: 'edit', id })
    }

    //删除确认框弹出
    showDeleteModal = (id) => {
        let { groupID } = this.props.user.accountInfo;
        let that = this
        Modal.confirm({
            title: '删除确认',
            content: '删除后无法恢复，请谨慎操作',
            onOk() {
                deleteRule({ groupID, packageId: id }).then(() => {
                    message.success('删除成功');
                    that.queryAll()
                })
            },
            onCancel() {

            },
        });


    }

    renderHeader(isEmpty) {
        return (
            <div className={styles.header}>
                <div className={styles.titleArea} style={{ position: 'relative' }}>
                    <span className={styles.title}>
                        互斥叠加方案
                    </span>
                    <ExpireDateNotice productCode="HLL_CRM_Marketingbox" marginLeft="366px" marginTop="-10" />
                </div>
                <Button
                    onClick={() => {
                        const { refreshList } = this.props;
                        refreshList({ flag: false });
                        jumpPage({ menuID: CREATE_SHARE_RULES_NEW, from: 'create' })
                    }}
                    type="ghost"
                    className={styles.addRuleBtn}
                >
                    <Icon
                        type="plus"
                    />
                    添加互斥叠加方案
                </Button>
            </div>
        )
    }

    renderHeaderActions() {

        const {
            packageName,
        } = this.state;
        const {
            isQuerying,
        } = this.props;

        return (
            <div className={styles.headerActions}>
                <span className={styles.headerLabel}>方案名称</span>
                <Input
                    value={packageName}
                    onChange={(e) => this.setState({ packageName: e.target.value })}
                    style={{ width: 180, marginRight: 20 }}
                    placeholder="请输入方案名称"
                />
                <span className={styles.headerLabel}>适用店铺</span>
                <div style={{ width: 180, marginRight: 10 }}>
                    <ShopSelector
                        value={this.state.shopIdList}
                        onChange={
                            (shopID) => {
                                this.setState({
                                    shopIdList: shopID
                                })
                            }
                        }
                        size="small"
                        schemaData={this.state.shopSchema}
                    />
                </div>
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

    getShopNames(shops = []) {
        let shopArr = []
        shops.map((i) => {
            shopArr.push(i.shopName)
        })
        let shopArrStr = shopArr.join('，')
        if (shopArrStr.length > 110) {
            shopArrStr = shopArrStr.substr(0, 110) + ' ...'
        }
        return shopArrStr
    }

    onPageChange = (pageNo, pageSize) => {
        this.setState({
            pageNo,
            pageSize,
        }, () => {
            this.queryAll()
        })
    }

    onPageSizeChange = (pageNo, pageSize) => {
        this.setState({
            pageNo,
            pageSize,
        }, () => {
            this.queryAll()
        })
    }

    renderContent() {
        const { activityTypeRulePageQueryData } = this.state;
        const { shopID } = this.props.user;

        const {
            pageSize = 25,
            pageNo = 1,
            total,
        } = this.state

        return (
            <Row className={styles.bodyContainer} style={{ height: `calc(100% - 123px)` }}>

                {activityTypeRulePageQueryData && activityTypeRulePageQueryData.length > 0 ?
                    <div className={styles.blessingContent}>
                        {activityTypeRulePageQueryData.map((groupInfo, index) => {
                            return (
                                <Col key={index} className={styles.columnsWrapper}>
                                    <p className={styles.activityTitle}>
                                        <span className={styles.titleText}>{groupInfo.packageName}</span>
                                    </p>
                                    <div className={styles.activityBothCont}>
                                        {

                                            <div className={styles.contBothBox}>
                                                <p className={styles.contMtd}>{groupInfo.ruleGroupName}</p>
                                                <div className={styles.contScrollBox}>
                                                    <div className={styles.contList}>
                                                        <div style={{ color: "black", display: 'flex' }}><div>适用店铺：{this.getShopNames(groupInfo.shopInfoList)}</div></div>
                                                    </div>
                                                </div>
                                            </div>

                                        }
                                    </div>
                                    <div className={styles.activityOperate}>
                                        {/* <span className={styles.operateDetail} onClick={(e) => this.handleShowDetailModal(e, groupInfo.shareRuleID)}>查看详情</span> */}
                                        <span className={styles.operateEdit} onClick={() => this.handleEdit(groupInfo.packageId)}>编辑</span>
                                        <span className={styles.operateDelete} onClick={() => this.showDeleteModal(groupInfo.packageId)}>删除</span>
                                    </div>
                                </Col>
                            )
                        })
                        }
                        < Pagination
                            className={styles.pagenation}
                            total={total}
                            showSizeChanger={true}
                            // showQuickJumper={true}
                            showTotal={(totalSize, range) => `本页${range[0]}-${range[1]}/ 共 ${totalSize}条`}
                            current={pageNo}
                            pageSize={pageSize}
                            pageSizeOptions={['25', '50', '100', '200']}
                            onChange={this.onPageChange}
                            onShowSizeChange={this.onPageSizeChange}
                        />
                    </div>
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
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                {this.renderHeaderActions()}
                <div className={styles.divideLine} />
                {this.renderContent()}
                {/* <Pagination showSizeChanger onShowSizeChange={()=>{
                    
                }} defaultCurrent={3} total={500} /> */}
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
        shopSchema: state.sale_shopSchema_New,

        $$refreshFlag: state.share_rules.get("refreshFlag"),
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

        refreshList: (opts) => dispatch(refreshList(opts)),
    };
}
