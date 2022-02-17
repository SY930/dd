/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-02-28T21:30:35+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: MyActivities.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-10T11:29:38+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
    Table, Icon, Select, DatePicker,
    Button, Modal, Row, Col, message,
    TreeSelect, Switch, Input, Radio,
    Spin, Popover, Menu, Tooltip
} from 'antd';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { throttle } from 'lodash'
import { jumpPage, getStore } from '@hualala/platform-base'
import registerPage from '../../../index';
import { Iconlist } from "../../../components/basic/IconsFont/IconsFont";
import {
    SALE_CENTER_PAGE,
    ONLINE_PROMOTION_MANAGEMENT_GROUP,
    PROMOTION_DECORATION,
} from '../../../constants/entryCodes';
import {
    initializationOfMyActivities,
    toggleSelectedActivityStateAC,
    fetchPromotionList,
    toggleIsUpdateAC,
} from '../../../redux/actions/saleCenterNEW/myActivities.action';
import {
    getAuthLicenseData
} from "../../../redux/actions/saleCenterNEW/specialPromotion.action";
import {
    fetchPromotionCategoriesAC,
    fetchPromotionTagsAC,
    saleCenterResetBasicInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import {
    fetchPromotionScopeInfo,
    saleCenterResetScopeInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {
    saleCenterResetDetailInfoAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    fetchPromotionDetail,
    resetPromotionDetail,
    fetchPromotionDetailCancel,
} from '../../../redux/actions/saleCenterNEW/promotion.action';
import {
    ACTIVITY_CATEGORIES,
    SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST,
    SALE_CENTER_ACTIVITY_SUITSENCE_LIST,
    getPromotionIdx,
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter,
    TRIPLE_STATE,
} from '../../../redux/actions/saleCenterNEW/types';
import axios from 'axios';
import styles from '../ActivityPage.less';
import Authority from '../../../components/common/Authority';
import ActivityMain from '../activityMain';
import PromotionNameSelect from '../common/PromotionNameSelect';
import PlanModal from '../../SpecialPromotionNEW/common/PlanModal';

import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { promotionScopeInfo_NEW as sale_promotionScopeInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionScopeInfo.reducer';
import { fullCut_NEW as sale_fullCut_NEW } from '../../../redux/reducer/saleCenterNEW/fullCut.reducer';
import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { saleCenter_NEW as sale_saleCenter_NEW } from '../../../redux/reducer/saleCenterNEW/saleCenter.reducer';
import { promotionAutoRunState as sale_promotionAutoRunState } from '../../../redux/reducer/saleCenterNEW/promotionAutoRun.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../../GiftNew/_reducers';
import { mySpecialActivities_NEW as sale_mySpecialActivities_NEW } from '../../../redux/reducer/saleCenterNEW/mySpecialActivities.reducer';
import { axiosData, getAccountInfo } from "../../../helpers/util";
import PromotionAutoRunModal from "./PromotionAutoRunModal";
import ExportModal from "../../GiftNew/GiftInfo/ExportModal";
import {
    openPromotionAutoRunListModal,
    queryPromotionAutoRunList,
    queryPromotionList,
} from "../../../redux/actions/saleCenterNEW/promotionAutoRun.action";
import {
    AUTO_RUN_QUERY, BASIC_LOOK_PROMOTION_QUERY, BASIC_PROMOTION_DELETE, BASIC_PROMOTION_QUERY,
    BASIC_PROMOTION_UPDATE
} from "../../../constants/authorityCodes";
import {
    isBrandOfHuaTianGroupList, isGroupOfHuaTianGroupList, isHuaTian,
    isMine
} from "../../../constants/projectHuatianConf";
import PromotionCalendarBanner from "../../../components/common/PromotionCalendarBanner/index";
import { ONLINE_PROMOTION_TYPES } from '../../../constants/promotionType';
import { selectPromotionForDecoration } from '../../../redux/actions/decoration';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';
import Card from '../../../assets/card.png';
import CardSaleActive from './CardSaleActive';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const { Group: RadioGroup } = Radio;
const Immutable = require('immutable');
const moment = require('moment');
const confirm = Modal.confirm;
const MenuItemGroup = Menu.ItemGroup;

const mapStateToProps = (state) => {
    return {
        myActivities: state.sale_myActivities_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionList: state.sale_promotionAutoRunState.get('promotionList').toJS(),
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        selectPromotionForDecoration: (opts) => {
            dispatch(selectPromotionForDecoration(opts))
        },
        // 查询
        query: (opts) => {
            dispatch(initializationOfMyActivities(opts));
        },
        // 启用/禁用
        toggleSelectedActivityState: (opts) => {
            dispatch(toggleSelectedActivityStateAC(opts));
        },
        // 查询类别
        fetchPromotionCategories: (opts) => {
            dispatch(fetchPromotionCategoriesAC(opts));
        },
        // 查询标签
        fetchPromotionTags: (opts) => {
            dispatch(fetchPromotionTagsAC(opts));
        },
        // 查询品牌、店铺等信息
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        },
        // 查询活动详情
        fetchPromotionDetail_NEW: (opts) => {
            dispatch(fetchPromotionDetail(opts))
        },
        // 查询活动列表
        fetchPromotionList: (opts) => {
            dispatch(fetchPromotionList(opts))
        },
        // reset
        saleCenterResetBasicInfo: (opts) => {
            dispatch(saleCenterResetBasicInfoAC(opts));
        },
        // reset
        saleCenterResetScopeInfo: (opts) => {
            dispatch(saleCenterResetScopeInfoAC(opts));
        },
        // reset
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts));
        },
        // reset promotionDetail in myActivities.reducer $promotionDetailInfo
        resetPromotionDetail: () => {
            dispatch(resetPromotionDetail());
        },
        // cancel the promotion detail fetch operation
        cancelFetchPromotionDetail: () => {
            dispatch(fetchPromotionDetailCancel())
        },
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        fetchFoodCategoryInfo: (opts, flag, id) => {
            dispatch(fetchFoodCategoryInfoAC(opts, flag, id))
        },
        fetchFoodMenuInfo: (opts, flag, id) => {
            dispatch(fetchFoodMenuInfoAC(opts, flag, id))
        },
        queryPromotionAutoRunList: (opts) => {
            dispatch(queryPromotionAutoRunList(opts))
        },
        queryPromotionList: (opts) => {
            dispatch(queryPromotionList(opts))
        },
        openPromotionAutoRunListModal: (opts) => {
            dispatch(openPromotionAutoRunListModal(opts))
        },
        getAuthLicenseData: (opts) => {
            return dispatch(getAuthLicenseData(opts))
        }
    };
};
@registerPage([SALE_CENTER_PAGE, ONLINE_PROMOTION_MANAGEMENT_GROUP], {
    sale_promotionBasicInfo_NEW,
    sale_promotionDetailInfo_NEW,
    sale_promotionScopeInfo_NEW,
    sale_fullCut_NEW,
    sale_myActivities_NEW,
    sale_saleCenter_NEW,
    sale_giftInfoNew,
    sale_promotionAutoRunState,
    sale_mySpecialActivities_NEW,
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class MyActivities extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = null;
        this.nameSearchRef = null;
        this.setTableRef = el => this.tableRef = el;
        this.setNameSearchRef = el => this.nameSearchRef = el;
        this.lockedChangeSortOrder = throttle(this.changeSortOrder, 500, { trailing: false });
        this.state = {
            dataSource: [],
            advancedQuery: true,
            visible: false,
            selectedRecord: null, // current record
            updateModalVisible: false,
            expand: false, // 高级查询
            index: 0,
            recordToDisplay: null,
            // qualifications:
            valid: '0',
            modalTitle: '更新活动信息',
            isNew: false,
            isCopy: false,
            selectedShop: null,
            loading: true,
            // 以下是用于查询的条件
            promotionType: '',
            editPromotionType: '',
            promotionDateRange: '',
            promotionValid: '2',
            promotionState: '1',
            promotionCategory: '',
            promotionTags: '',
            promotionBrands: '',
            promotionOrder: '',
            channelLst: '',
            promotionShop: '',
            pageSizes: 25, // 默认显示的条数
            pageNo: 1,
            queryDisabled: false,
            currentPromotionID: '',
            runType: '0',
            promotionCode: '',
            filterSchemeList: [],
            planModalVisible: false,
            operateModalVisible: false,
            executeTimeType: 0,
            executeFoodUnitType: 1,
        };
        this.handleDismissUpdateModal = this.handleDismissUpdateModal.bind(this);
        this.checkDetailInfo = this.checkDetailInfo.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderFilterBar = this.renderFilterBar.bind(this);
        this.handleDisableClickEvent = this.handleDisableClickEvent.bind(this);
        this.toggleExpandState = this.toggleExpandState.bind(this);
        this.renderModifyRecordInfoModal = this.renderModifyRecordInfoModal.bind(this);
        this.onDateQualificationChange = this.onDateQualificationChange.bind(this);
        this.renderShopsInTreeSelectMode = this.renderShopsInTreeSelectMode.bind(this);
        this.onTreeSelect = this.onTreeSelect.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.showNothing = this.showNothing.bind(this);
        this.renderContentOfThisModal = this.renderContentOfThisModal.bind(this);
        this.handleUpdateOpe = this.handleUpdateOpe.bind(this);
    }
    componentDidMount() {
        const {
            promotionBasicInfo,
            fetchPromotionCategories,
            fetchPromotionTags,
            promotionScopeInfo,
            fetchPromotionScopeInfo,
            fetchPromotionList,
            queryPromotionList,
            queryPromotionAutoRunList,
        } = this.props;
        // this.handleQuery();
        fetchPromotionCategories({
            groupID: this.props.user.accountInfo.groupID,
            phraseType: '0',
        });

        fetchPromotionTags({
            groupID: this.props.user.accountInfo.groupID,
            phraseType: '1',
        });

        fetchPromotionScopeInfo({
            _groupID: this.props.user.accountInfo.groupID,
        });
        // 授权
        this.props.getAuthLicenseData({ productCode: 'HLL_CRM_Marketingbox' }).then((res) => {
            this.setState({ authLicenseData: res })
        });
        queryPromotionAutoRunList()
        this.onWindowResize();
        this.getSearchListContent() // 查询方案列表
        this.fromOnsaleJump() // 促销活动创建后情况筛选框状态
        window.addEventListener('resize', this.onWindowResize);

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    getQueryVariable() {
        const search = window.decodeURIComponent(window.location.search)
        var query = search.substr(1)
        query = query.split('&')
        var params = {}
        for (let i = 0; i < query.length; i++) {
            let q = query[i].split('=')
            if (q.length === 2) {
                params[q[0]] = q[1]
            }
        }
        return params
    }

    fromOnsaleJump = () => {
        const { from, itemID } = this.getQueryVariable();
        if (from === 'onSale') {
            this.setState({
                promotionState: '0', // 使用状态
                promotionValid: '0',
            }, () => {
                this.handleQuery()
                // this.clearUrl()
            })
        }
        if (!from) {
            this.handleQuery()
        }
    }

    goSearch = ({ key }) => {
        const record = this.state.filterSchemeList.find(item => item.itemID === key)
        const filterRule = record.filterRule || '{}';
        const itm = JSON.parse(filterRule)
        const { isActive } = itm
        this.setState({ promotionState: isActive == '0' ? '2' : '1' }, () => {
            this.handleQuery()
        })
    }

    // 删除方案
    removePlan = (record, itemID) => {
        const _this = this;
        Modal.confirm({
            title: `确认删除方案【${record.schemeName}】`,
            content: '删除是不可恢复操作,请慎重考虑',
            iconType: 'question-circle',
            onOk() {
                // handleNext();
                axiosData(
                    '/filterSchemeService/delete.ajax',
                    {
                        itemID,
                        groupID: getStore().getState().user.getIn(['accountInfo', 'groupID'])
                    },
                    null,
                    { path: null },
                    'HTTP_SERVICE_URL_PROMOTION_NEW'
                ).then((res) => {
                    if (res.code === '000') {
                        message.success('删除成功')
                        _this.getSearchListContent()
                    }
                });
            },
            onCancel() { },
        });
    }

    // 查询方案列表
    getSearchListContent = () => {
        axiosData(
            '/filterSchemeService/queryList.ajax',
            {
                filterType: 11,
                pageNo: 1,
                pageSize: 100,
                groupID: getStore().getState().user.getIn(['accountInfo', 'groupID'])
            },
            null,
            { path: null },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((res) => {
            if (res.code === '000') {
                const { data: { filterSchemeList = [] } } = res;
                this.setState({
                    filterSchemeList
                })
            }
        });
    }

    getSearchTitle = (name) => {
        return (
            <div><span className={styles.customPro}></span>{name}</div>
        )
    }

    getSearchContent = () => {
        const { filterSchemeList } = this.state
        return (
            <div>
                <Menu
                    // onClick={this.handleClick}
                    style={{ width: 240 }}
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    mode="inline"
                    className={styles.saleSearchProgram}
                    onClick={this.goSearch}
                >
                    <MenuItemGroup key="g1" title={this.getSearchTitle('自定义方案')}>
                        {
                            (filterSchemeList || []).map((item) => {
                                const filterRule = item.filterRule || '{}';
                                const itm = JSON.parse(filterRule);
                                return (
                                    <Menu.Item key={item.itemID}>
                                        <span className={styles.menuTitle}>
                                            {itm.schemeName}
                                        </span>
                                        <Icon type="close-circle-o" onClick={() => { this.removePlan(itm, item.itemID) }} />
                                    </Menu.Item>
                                )
                            })
                        }
                    </MenuItemGroup>
                    <MenuItemGroup key="g2" title={this.getSearchTitle('系统预置')}>
                        <Menu.Item key="g21">
                            <span className={styles.menuTitle}>
                                暂无
                            </span>
                        </Menu.Item>
                    </MenuItemGroup>
                </Menu>
                <Button type="ghost" style={{ width: '100%' }} icon="plus" onClick={() => { this.setState({ planModalVisible: true }) }}> 将当前查询条件保存为方案</Button>
            </div>
        )
    }
    /**
     * @description toggle the advanced qualification selection.
     * */
    toggleExpandState() {
        requestAnimationFrame(() => {
            this.onWindowResize();
        });
        const expand = this.state.expand;
        let opt = {
            expand: !expand,
        }
        if (!opt.expand) {
            opt = {
                ...opt,
                selectedShop: undefined,
                promotionCategory: undefined,
                promotionTags: undefined,
                promotionBrands: undefined,
                promotionOrder: undefined,
                promotionShop: undefined,
                channelLst: undefined,
            }
        }
        this.setState(opt)
    }

    handleDisableClickEvent(text, record, index, nextActive, modalTip) {
        this.props.toggleSelectedActivityState({
            record,
            nextActive,
            modalTip,
            cb: () => { },
        });
    }

    handleDecorationStart = (record) => {
        const { promotionType, promotionIDStr, promotionName } = record;
        this.props.selectPromotionForDecoration({
            type: `${promotionType}`,
            id: promotionIDStr,
            title: promotionName,
        });
        jumpPage({ menuID: PROMOTION_DECORATION })
    }

    confirmDelete = (record) => {
        // const delTitle = `【${record.promotionName ? record.promotionName.length > 20 ? record.promotionName.substring(0, 20) + '...' : record.promotionName : ''}】`;
        // confirm({
        //     width: 433,
        //     iconType: 'exclamation-circle',
        //     title: <span style={{ color: '#434343' }}>您确定要删除{delTitle}吗 ？</span>,
        //     content: (
        //         <span style={{ color: '#aeaeae' }}>
        //             {SALE_LABEL.k5do4z54}
        //         </span>
        //     ),
        //     onOk: () => {
        const params = {
            groupID: record.groupID,
            shopID: record.shopID,
            promotionID: record.promotionIDStr,
            isActive: 2,
            modifiedBy: getAccountInfo().userName
        }
        return axiosData(
            '/promotion/docPromotionService_setActive.ajax',
            params,
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then(() => {
            message.success(SALE_LABEL.k5do0ps6);
            this.tryToRefresh();
            this.tryToUpdateNameList();
        }).catch((error) => { });
        //     },
        //     onCancel() { },
        // });
    }

    toggleStateCallBack = () => {
        message.success(SALE_LABEL.k5do0ps6);
        this.tryToRefresh()
    }

    handleClose() {
        this.setState({
            visible: false,
        }, () => {
            this.props.resetPromotionDetail();
            this.props.cancelFetchPromotionDetail();
        });
    }

    handleDismissUpdateModal() {
        this.setState({
            updateModalVisible: false,
            isCopy: false,
        }, () => {
            this.props.saleCenterResetBasicInfo();
            this.props.saleCenterResetScopeInfo();
            this.props.saleCenterResetDetailInfo();
            this.props.cancelFetchPromotionDetail();
        });
    }

    onWindowResize = () => {
        const parentDoms = ReactDOM.findDOMNode(this.layoutsContainer); // 获取父级的doms节点
        if (parentDoms != null) { // 如果父级节点不是空将执行下列代码
            const parentHeight = parentDoms.getBoundingClientRect().height; // 获取到父级的高度存到变量 parentHeight
            const contentrDoms = parentDoms.querySelectorAll('.layoutsContent'); // 从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if (undefined != contentrDoms && contentrDoms.length > 0) { // 如果 contentrDoms 节点存在 并且length>0 时执行下列代码
                const layoutsContent = contentrDoms[0]; // 把获取到的 contentrDoms 节点存到 变量 layoutsContent 中
                const headerDoms = parentDoms.querySelectorAll('.layoutsHeader');
                const headerHeight = headerDoms[0].getBoundingClientRect().height;
                layoutsContent.style.height = `${parentHeight - headerHeight - 200}px`; // layoutsContent 的高度，等于父节点的高度-头部-横线-padding值
                this.setState({
                    contentHeight: parentHeight - headerHeight - 200,
                })
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user.activeTabKey !== nextProps.user.activeTabKey
            && nextProps.user.activeTabKey === this.props.entryCode) {
            const tabArr = nextProps.user.tabList.map((tab) => tab.value);
            if (tabArr.includes(this.props.entryCode)) {
                this.handleQuery(this.state.pageNo); // tab里已有该tab，从别的tab切换回来，就自动查询，如果是新打开就不执行此刷新函数，而执行加载周期里的
                this.tryToUpdateNameList();
            }
        }
        if (this.props.myActivities.get('$promotionList') != nextProps.myActivities.get('$promotionList')) {
            const _promoitonList = nextProps.myActivities.get('$promotionList').toJS();
            switch (_promoitonList.status) {
                case 'timeout':
                    message.error(SALE_LABEL.k5doarw8);
                    this.setState({
                        loading: false,
                    });
                    break;
                case 'fail':
                    message.error(SALE_LABEL.k5doax7i);
                    this.setState({
                        loading: false,
                    });
                    break;
                case 'success':
                    const data = _promoitonList.data;
                    this.setState({
                        loading: false,
                        dataSource: data.map((activity, index) => {
                            activity.index = index + 1;
                            activity.key = `${index}`;
                            activity.validDate = {
                                start: activity.startDate,
                                end: activity.endDate,
                            };
                            return activity;
                        }),
                        total: _promoitonList.total,
                    });
                    break;
            }
        }
    }
    getParams = () => {
        const {
            promotionType,
            promotionDateRange,
            promotionValid,
            promotionState,
            promotionCategory,
            promotionTags,
            promotionBrands,
            promotionOrder,
            channelLst,
            promotionShop,
            promotionName,
            promotionCode,
        } = this.state;
        const opt = {};
        if (promotionType !== '' && promotionType !== undefined && promotionType !== 'undefined') {
            opt.promotionType = promotionType;
        }
        if (promotionDateRange !== '' && promotionDateRange !== undefined && promotionDateRange[0] !== undefined) {
            opt.startDate = promotionDateRange[0].format('YYYYMMDD');
            opt.endDate = promotionDateRange[1].format('YYYYMMDD');
        }
        if (promotionCategory !== '' && promotionCategory !== undefined) {
            opt.categoryName = promotionCategory;
        }
        if (promotionBrands !== '' && promotionBrands !== undefined) {
            opt.brandID = promotionBrands;
        }
        if (promotionOrder !== '' && promotionOrder !== undefined) {
            opt.orderType = promotionOrder;
        }
        if (channelLst !== '' && channelLst !== undefined) {
            opt.channelLst = channelLst;
        }
        if (promotionShop !== '' && promotionShop !== undefined) {
            opt.shopID = promotionShop;
        }
        if (promotionState !== '' && promotionState != '0') {
            opt.isActive = promotionState == '1' ? '1' : '0';
        }
        if (promotionValid !== '' && promotionValid != '0') {
            opt.status = promotionValid;
        }
        if (promotionTags !== '' && promotionTags != '0') {
            opt.tag = promotionTags;
        }
        if (promotionName !== '' && promotionName !== undefined) {
            opt.promotionName = promotionName;
        }
        if (promotionCode !== '' && promotionCode !== undefined) {
            opt.promotionCode = promotionCode;
        }
        opt.groupID = this.props.user.accountInfo.groupID;
        opt.sourceType = +this.isOnlinePromotionPage();
        return opt
    }
    handleQuery(thisPageNo) {
        const pageNo = isNaN(thisPageNo) ? 1 : thisPageNo;
        this.setState({
            loading: true,
            queryDisabled: true,
            pageNo,
        }, () => {
            setTimeout(() => {
                this.setState({ queryDisabled: false })
            }, 500)
        });
        const _opt = this.getParams()
        const opt = {
            pageSize: this.state.pageSizes,
            pageNo,
            usageMode: -1,
            sourceType: +this.isOnlinePromotionPage(),
            ..._opt,
        };
        opt.cb = this.showNothing;
        this.props.query(opt);
    }

    showNothing(data) {
        if (data == undefined) {
            setTimeout(() => {
                this.setState({
                    loading: false,
                    dataSource: [],
                    total: 0,
                });
                message.warning(SALE_LABEL.k5dod8s9);
            });
        }
    }

    // date qualification
    onDateQualificationChange(value) {
        this.setState({
            promotionDateRange: value,
        });
    }

    onTreeSelect(value, treeData) {
        const shopsInfo = [];
        treeData.forEach((td) => {
            if (td.children) {
                td.children.map((tdc) => {
                    shopsInfo.push(tdc);
                })
            }
        });
        if (value != undefined) {
            if (value.match(/[-]/g).length != 2) {
                return null;
            }
            const selectedShopID = shopsInfo.find((si) => {
                return si.value === value;
            }).shopID;

            this.setState({
                selectedShop: value,
                promotionShop: selectedShopID,
            });
        } else {
            this.setState({
                selectedShop: null,
                promotionShop: value,
            });
        }
    }

    changeSortOrder(record, direction) {
        const params = { promotionID: record.promotionIDStr, rankingType: direction };
        axiosData('/promotion/docPromotionService_updateRanking.ajax', params, { needThrow: true }, { path: undefined }, 'HTTP_SERVICE_URL_PROMOTION_NEW').then(() => {
            this.tryToRefresh()
        }).catch(err => {
            message.warning(err || SALE_LABEL.k5doax7i);
        })
    }

    tryToRefresh = () => {
        try {
            this.tableRef.props.pagination.onChange(this.tableRef.props.pagination.current, this.tableRef.props.pagination.pageSize);
        } catch (e) {
            this.handleQuery()
        }
    }

    tryToUpdateNameList = () => {
        try {
            this.nameSearchRef.getNameList()
        } catch (e) {
            console.log('e: ', e)
        }
    }

    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSizes: pageSize,
        }, () => {
            this.handleQuery();
        })
    };
    isOnlinePromotionPage = () => {
        return this.props.entryCode === ONLINE_PROMOTION_MANAGEMENT_GROUP;
    }
    getAllPromotionTypes = () => {
        const { intl } = this.props;
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        const all = {
            key: 'ALL',
            title: k5eng042,
        }
        if (this.isOnlinePromotionPage()) { // 基础营销集团视角
            return [
                all,
                ...ONLINE_PROMOTION_TYPES,
            ]
        }
        return [
            all,
            ...ACTIVITY_CATEGORIES.slice(0, ACTIVITY_CATEGORIES.length - 1),
        ]
    }

    successFn = (responseJSON) => {
        const _promotionIdx = getPromotionIdx(`${this.state.editPromotionType}`);
        const _serverToRedux = false;
        if (responseJSON.promotionInfo === undefined || responseJSON.promotionInfo.master === undefined) {
            message.error(SALE_LABEL.k5dod8s9);
            return null;
        }
        if (responseJSON.promotionInfo.master.maintenanceLevel === '1') { // shop
            const opts = {
                _groupID: this.props.user.accountInfo.groupID,
                shopID: responseJSON.promotionInfo.master.shopIDLst,
            };
            this.props.fetchFoodCategoryInfo({ ...opts }, isHuaTian(), responseJSON.promotionInfo.master.subGroupID);
            this.props.fetchFoodMenuInfo({ ...opts }, isHuaTian(), responseJSON.promotionInfo.master.subGroupID);
        }
        // 把查询到的活动信息存到redux
        this.props.saleCenterResetBasicInfo(promotionBasicDataAdapter(responseJSON.promotionInfo, _serverToRedux));
        this.props.saleCenterResetScopeInfo(promotionScopeInfoAdapter(responseJSON.promotionInfo.master, _serverToRedux));
        this.props.saleCenterResetDetailInfo(promotionDetailInfoAdapter(responseJSON.promotionInfo, _serverToRedux));
        this.setState({
            promotionInfo: responseJSON.promotionInfo,
            selectedRecord: responseJSON.promotionInfo, // arguments[1],
            modalTitle: SALE_LABEL.k5dohc0d,
            isNew: false,
            // isCopy: false,
            index: _promotionIdx,
        });
    };

    failFn = () => {
        message.error(SALE_LABEL.k5dmw1z4);
    };

    handleUpdateOpe() {
        const _record = arguments[1];
        if (_record && _record.maintenanceLevel !== '1') { // 集团
            this.props.fetchFoodCategoryInfo({
                _groupID: this.props.user.accountInfo.groupID
            },
                isHuaTian(),
                _record.subGroupID
            );
            this.props.fetchFoodMenuInfo({
                _groupID: this.props.user.accountInfo.groupID
            },
                isHuaTian(),
                _record.subGroupID
            );
        }
        this.props.fetchPromotionDetail_NEW({
            data: {
                promotionID: _record ? _record.promotionIDStr : this.state.currentPromotionID,
                groupID: this.props.user.accountInfo.groupID,
            },
            success: this.successFn,
            fail: this.failFn,
        });
        if (_record) {
            this.setState({
                updateModalVisible: true,
                editPromotionType: _record.promotionType,
                currentPromotionID: _record.promotionIDStr,
            });
        }
    }

    // 点击按钮前先弹窗
    handleEditActive = (record) => (handleNext) => {
        if (record.maintenanceLevel == '1') { // 门店活动无法编辑
            Modal.info({
                title: `活动无法编辑`,
                content: '活动为门店账号创建，你不能进行编辑。',
                iconType: 'exclamation-circle',
                okText: '确定'
            });
            return;
        }
        if (record.isActive == '1') { // 正在进行中的活动弹窗提示
            Modal.confirm({
                title: `活动编辑`,
                content: '活动正在进行中，确定要进行编辑吗？',
                iconType: 'exclamation-circle',
                onOk() {
                    handleNext();
                },
                onCancel() { },
            });
        } else {
            handleNext()
        }
    }

    // 状态启用禁用前判断是否是门店
    handleSattusActive = (record) => (handleNext) => {
        if (record.maintenanceLevel == '1') {
            Modal.info({
                title: `活动无法操作`,
                content: '活动为门店账号创建，你不能进行编辑。',
                okText: '确定',
                iconType: 'exclamation-circle',
                onOk() {
                },
                onCancel() { },
            });
            return
        }
        if (record.status == '3') {
            Modal.info({
                title: `活动无法启用`,
                content: '活动已结束，请修改可用的活动时间。',
                okText: '确定',
                iconType: 'exclamation-circle',
                onOk() {
                },
                onCancel() { },
            });
            return
        }
        handleNext();
    }

    // 点击删除按钮先弹窗
    handleDelActive = (record) => (handleNext) => {
        if (record.maintenanceLevel == '1') {
            Modal.info({
                title: `活动无法删除`,
                content: '活动为门店账号创建，你不能进行删除。',
                iconType: 'exclamation-circle',
                okText: '确定',
            });
            return;
        }
        if (record.isActive == '1') {
            Modal.confirm({
                title: `确认删除这个活动`,
                content: '活动正在启用中，删除后无法恢复。',
                iconType: 'question-circle',
                onOk() {
                    handleNext();
                },
                onCancel() { },
            });
            return
        }
        Modal.confirm({
            title: `确认删除这个活动`,
            content: '删除后无法恢复',
            iconType: 'question-circle',
            onOk() {
                handleNext();
            },
            onCancel() { },
        });
    }

    // Row Actions: 查看
    checkDetailInfo() {
        const _record = arguments[1];
        this.props.fetchPromotionDetail_NEW({
            data: {
                promotionID: _record ? _record.promotionIDStr : this.state.currentPromotionID, // promotionID 会自动转换int类型,出现数据溢出,新加字符串类型的promotionIDStr替换
                groupID: this.props.user.accountInfo.groupID,
            },
            fail: this.failFn,
        });
        this.setState({
            visible: true,
            currentPromotionID: _record ? _record.promotionIDStr : this.state.currentPromotionID,
        });
    }

    /**
     * Render promotion update Modal
     * wrapped normally.
     * @param {Bool} isNew A bool value identify the current operation is update or create.
     */

    renderContentOfThisModal() {
        const promotionDetailInfo = this.props.myActivities.get('$promotionDetailInfo').toJS();
        const _state = this.state;
        if (promotionDetailInfo.status === 'start' || promotionDetailInfo.status === 'pending') {
            return (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>
            )
        }
        if (promotionDetailInfo.status === 'timeout' || promotionDetailInfo.status === 'fail') {
            return (
                <div className={styles.spinFather}>
                    {SALE_LABEL.k5doax7i} <a onClick={this.handleUpdateOpe}>{COMMON_LABEL.retry}</a>
                </div>
            );
        }

        if (promotionDetailInfo.status === 'success') {
            return (<ActivityMain
                isNew={_state.isNew}
                isCopy={_state.isCopy}
                index={_state.index}
                steps={_state.steps}
                callbackthree={(arg) => {
                    if (arg == 3) {
                        this.setState({
                            isCopy: false,
                            updateModalVisible: false,
                        });
                        this.tryToRefresh();
                        this.tryToUpdateNameList();
                    }
                }}
            />);
        }
    }

    renderModifyRecordInfoModal() {
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width={1000}
                height="569px"
                maskClosable={false}
                onCancel={this.handleDismissUpdateModal}
            >
                {this.state.updateModalVisible && this.renderContentOfThisModal()}
            </Modal>
        );
    }
    handleExecuteTimeType = (e) => {
        this.setState({
            executeTimeType: e.target.value,
        })
    }

    handleRuleType = (e) => {
        this.setState({
            executeFoodUnitType: e.target.value,
        })
    }
    parseResponseJson = (rsp, successCode) => {
        const resultcode = rsp.resultcode === undefined ? rsp.code : rsp.resultcode;
        const resultmsg = rsp.resultmsg === undefined
            ? (rsp.msg === undefined ? rsp.message : rsp.msg)
            : rsp.resultmsg;
        const isSuccess = rsp.success !== undefined ? rsp.success : (resultcode === successCode);
        const doRelogin = resultcode === '0011111100000001'
            || resultcode === 'RELOGIN001'
            || resultcode === 'FP10005';
        // const redirectUrl = doRelogin && (rsp.data && rsp.data.redirectUrl || '').replace(
        //   /^(.+redirectURL=).+$/, `$1${window.location.origin}`);
        return {
            success: isSuccess,
            code: resultcode,
            msg: doRelogin ? '会话失效,请重新登录' : resultmsg || rsp.statusText || '网络错误，请稍后重试',
            redirect: doRelogin
        };
    }
    handleOperateSave = () => {
        const {
            executeTimeType,
            executeFoodUnitType
        } = this.state
        axiosData('/promotion/promotionParamsService_updatePromotionParams.ajax', {
            groupID: this.props.user.accountInfo.groupID,
            params: {
                groupID: this.props.user.accountInfo.groupID,
                executeTimeType,
                executeFoodUnitType
            },
        }, null, { path: '' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then((res) => {
                if (res.code === '000') {
                    message.success('保存成功')
                    this.setState({
                        operateModalVisible: false,
                    })
                }
            })
        // axios.post('/api/v1/universal', {
        //     service: 'HTTP_SERVICE_URL_PROMOTION_NEW', // ? domain :'HTTP_SERVICE_URL_CRM', //'HTTP_SERVICE_URL_PROMOTION_NEW'
        //     method: '/promotion/promotionParamsService_updatePromotionParams.ajax',
        //     type: 'post',
        //     params: {
        //         groupID: this.props.user.accountInfo.groupID,
        //         executeTimeType,
        //     },
        // })
        //     .then((json) => {
        //         let { code, message, result } = json;
        //         if (!code) {
        //             code = (result || {}).code;
        //         }
        //         if (!message) {
        //             message = (result || {}).message;
        //         }
        //         if (code !== '000') {
        //             const { redirect, msg } = this.parseResponseJson(json, '000');
        //             Modal.error({
        //                 title: '啊哦！好像有问题呦~~',
        //                 content: `${msg}`,
        //             });
        //             redirect && window.setTimeout(() => doRedirect(), 1500);
        //             return Promise.reject({ code, message, response: json });
        //         }
        //         if (!path) {
        //             return Promise.resolve(json);
        //         }
        //         const paths = path.split('.');
        //         const data = paths.reduce((ret, path) => {
        //             if (!ret) return ret;
        //             return ret[path];
        //         }, json);
        //     })
        //     .catch((error) => {
        //         return Promise.reject(error);
        //     });
    }
    setRunDataList() {
        const { promotionList, queryPromotionList } = this.props;
        let type = 0;
        if (promotionList && promotionList.length > 0) {
            type = promotionList[0].executeType
            this.setState({
                runType: type
            })
        }
        queryPromotionList({ type })
        this.props.openPromotionAutoRunListModal();
    }
    renderOperateModal = () => {
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={'活动规则'}
                visible={this.state.operateModalVisible}
                footer={
                    <div style={{ textAlign: 'center' }}>
                        <Button type="ghost"
                            onClick={() => {
                                this.setState({
                                    operateModalVisible: false,
                                })
                            }}>
                            取消
                        </Button>
                        <Button
                            style={{ marginLeft: 8 }}
                            type="primary"
                            loading={this.state.loading}
                            onClick={this.handleOperateSave}>
                            确定
                        </Button>
                    </div>
                }
                width={600}
                height="569px"
                maskClosable={false}
                onCancel={() => {
                    this.setState({
                        operateModalVisible: false,
                    })
                }}
            >
                <div>
                    <div style={{ marginTop: 13, marginLeft: 20 }}>
                        <div style={{ marginBottom: 10, marginTop: 10 }}>
                            <span style={{
                                width: '84px',
                                height: '14px',
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#333333',
                                lineHeight: '14px',
                                marginRight: 8
                            }}>执行时间配置</span>
                        当顾客在POS上结账时，促销活动时间计算规则</div>
                        <span style={{ marginRight: 20 }}>计算规则 </span>
                        <RadioGroup onChange={this.handleExecuteTimeType} value={this.state.executeTimeType}>
                            <Radio key={'1'} value={1}>按开台时间计算</Radio>
                            <Radio key={'2'} value={0}>按结账时间计算</Radio>
                        </RadioGroup>
                    </div>

                    <div style={{ marginTop: 30, marginLeft: 20 }}>
                        <span style={{
                            width: '84px',
                            height: '14px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#333333',
                            lineHeight: '14px',
                            marginRight: 8
                        }}>称重类菜品计算规则</span>
                    </div>
                    <div style={{ marginTop: 13, marginLeft: 20 }}>
                        <span style={{ marginRight: 20 }}>计算规则 </span>
                        <RadioGroup onChange={this.handleRuleType} value={this.state.executeFoodUnitType}>
                            <Radio key={'0'} value={0}>按主规格计算</Radio>
                            <Radio key={'1'} value={1}>优先按辅助规格计算</Radio>
                        </RadioGroup>
                        {this.state.executeFoodUnitType == 1 && <div style={{
                            marginTop: 5,
                            width: 400,
                            height: 32,
                            background: '#FFFBE4',
                            borderRadius: 3,
                            border: '1px solid #FFA900',
                            lineHeight: '32px',
                            paddingLeft: 12,
                            color: '#666666',
                            fontSize: '12px',
                            fontWeight: 400
                        }}>
                            未设置辅助规格的称重菜品，则继续按主规格进行计算
                        </div>
                        }
                    </div>
                </div>
            </Modal >
        );
    }
    openOptModal = () => {
        this.setState({
            operateModalVisible: true,
        })
        axiosData('/promotion/promotionParamsService_queryPromotionParams.ajax', {
            groupID: this.props.user.accountInfo.groupID,
        }, null, { path: 'data.params' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
            .then((res) => {
                const { executeTimeType, executeFoodUnitType } = res
                this.setState({
                    executeTimeType,
                    executeFoodUnitType
                })
            })
    }
    renderHeader() {
        // const {
        //     queryPromotionAutoRunList,
        //     queryPromotionList,
        //     openPromotionAutoRunListModal,
        //     intl,
        // } = this.props;
        return (
            <div className="layoutsTool">
                <div style={{ position: 'fixed', top: '79px', right: '20px' }}>
                    {
                        !this.isOnlinePromotionPage() && (
                            <span>
                                <Authority rightCode={BASIC_PROMOTION_QUERY}>
                                    <Button
                                        type="ghost"
                                        onClick={this.openOptModal}
                                        style={{ marginRight: 10 }}
                                    ><Icon type="setting" />活动规则</Button>
                                </Authority>
                            </span>
                        )
                    }
                    {
                        !isHuaTian() && !this.isOnlinePromotionPage() && (
                            <Popover content={this.getSearchContent()} trigger="click" placement="bottom" title={null}>
                                <Button type="ghost" icon='search' style={{ marginRight: 10 }}>查询方案</Button>
                            </Popover>
                        )
                    }
                    {
                        !isHuaTian() && !this.isOnlinePromotionPage() && (
                            <Authority rightCode={AUTO_RUN_QUERY}>
                                <Button
                                    onClick={() => this.setRunDataList()}
                                    icon="plus"
                                    className={styles.customPrimaryButton}
                                >
                                    执行顺序（原自动执行）
                                </Button>
                            </Authority>
                        )
                    }
                    {
                        !this.isOnlinePromotionPage() && (
                            <span>
                                <Authority rightCode={BASIC_PROMOTION_QUERY}>
                                    <Button
                                        type="ghost"
                                        onClick={() => this.setState({ exportVisible: true })}
                                        style={{ marginRight: 10 }}
                                    ><Icon type="upload" />导出历史</Button>
                                </Authority>
                            </span>
                        )
                    }
                    {
                        !this.isOnlinePromotionPage() && <span className={styles.exportBtn}>
                            {
                                this.props.stylesShow === 'list' ? <Button
                                    type="ghost"
                                    onClick={() => this.props.stylesChange('card')}
                                ><span className={styles.cardImg}><img src={Card} />卡片展示</span></Button> :
                                    <Button type="ghost"
                                        onClick={() => this.props.stylesChange('list')}
                                    ><Icon type="bars" />列表展示</Button>
                            }
                        </span>
                    }
                </div>
            </div>
        );
    }

    renderShopsInTreeSelectMode() {
        const treeData = Immutable.List.isList(this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData'])) ?
            this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']).toJS() :
            this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']);
        const { intl } = this.props;
        const k5ddu8nr = intl.formatMessage(SALE_STRING.k5ddu8nr);
        const tProps = this.state.selectedShop != null ?
            {
                treeData,
                value: this.state.selectedShop,
                onChange: value => this.onTreeSelect(value, treeData),
                placeholder: k5ddu8nr,
                allowClear: true,
            } : {
                treeData,
                value: undefined,
                onChange: value => this.onTreeSelect(value, treeData),
                placeholder: k5ddu8nr,
                allowClear: true,
            };
        return (
            <TreeSelect
                showSearch
                {...tProps}
                style={{ width: 150 }}
                dropdownStyle={{ minWidth: 150 }}
                dropdownMatchSelectWidth={false}
                treeNodeFilterProp="label"
            />
        );
    }

    renderFilterBar = () => {
        const opt = this.getParams();
        const { intl } = this.props;
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        const k5dlp2gl = intl.formatMessage(SALE_STRING.k5dlp2gl);
        const k5dlp7zc = intl.formatMessage(SALE_STRING.k5dlp7zc);
        const k5dlpczr = intl.formatMessage(SALE_STRING.k5dlpczr);
        return (
            <div>
                <div className="layoutsSearch">
                    <ul>
                        <li>
                            <h5>{SALE_LABEL.k5dk4m5r}</h5>
                        </li>
                        <li>
                            <RangePicker style={{ width: 200 }} onChange={this.onDateQualificationChange} />
                        </li>

                        <li>
                            <h5>{SALE_LABEL.k5dk5uwl}</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                showSearch
                                filterOption={(value, option) => typeof option.props.children == 'string' ? option.props.children.indexOf(value) > -1 : option.props.children.props.defaultMessage.indexOf(value) > -1}
                                placeholder=""
                                defaultValue="ALL"
                                onChange={(value) => {
                                    this.setState({
                                        promotionType: value === 'ALL' ? '' : value,
                                    });
                                }}
                            >
                                {
                                    this.getAllPromotionTypes().map((activity, index) => {
                                        return (
                                            <Option value={`${activity.key}`} key={`${activity.key}`}>{activity.title}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>

                        <li>
                            {/* 使用状态 */}
                            <h5>{SALE_LABEL.k5dlbwqo}</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 60 }}
                                defaultValue="1"
                                value={this.state.promotionState}
                                placeholder=""
                                onChange={(value) => {
                                    this.setState({
                                        promotionState: value,
                                    });
                                }}
                            >
                                <Option value={TRIPLE_STATE.ALL}>{k5eng042}</Option>
                                <Option value={TRIPLE_STATE.OPTION1}>{COMMON_LABEL.enable}</Option>
                                <Option value={TRIPLE_STATE.OPTION2}>{COMMON_LABEL.disable}</Option>
                            </Select>
                        </li>

                        <li>
                            <h5>{SALE_LABEL.k5dlcm1i}</h5>
                        </li>
                        <li>
                            <PromotionNameSelect
                                ref={this.setNameSearchRef}
                                getParams={{ ...opt, promotionName: undefined }}
                                onChange={(promotionName) => {
                                    this.setState(promotionName)
                                }}
                            />
                        </li>
                        <li>
                            <h5>活动状态</h5>
                        </li>
                        <li>
                            <Select
                                placeholder=""
                                defaultValue={'2'}
                                value={this.state.promotionValid}
                                style={{ width: 100 }}
                                onChange={(value) => {
                                    this.setState({
                                        promotionValid: value,
                                    });
                                }}
                            >
                                <Option key="0" value={'0'}>{k5eng042}</Option>
                                <Option key="1" value={'1'}>{k5dlp2gl}</Option>
                                <Option key="2" value={'2'}>{k5dlp7zc}</Option>
                                <Option key="3" value={'3'}>{k5dlpczr}</Option>
                            </Select>
                        </li>
                        <li>
                            <h5>活动编码</h5>
                        </li>
                        <li>
                            <Input placeholder="活动编码" maxLength={20} value={this.state.promotionCode} onChange={(e) => {
                                this.setState({
                                    promotionCode: e.target.value,
                                })
                            }} />
                        </li>
                        <li>
                            <Authority rightCode={BASIC_PROMOTION_QUERY}>
                                <Button type="primary" onClick={this.handleQuery} disabled={this.state.queryDisabled}><Icon type="search" />{COMMON_LABEL.query}</Button>
                            </Authority>
                        </li>
                        <li>
                            <a onClick={this.toggleExpandState}>{SALE_LABEL.k5dldshc} {this.state.expand ? <Icon type="caret-up" /> : <Icon type="caret-down" />}</a>
                        </li>
                    </ul>
                </div>
                {this.renderAdvancedFilter()}
            </div>

        );
    }

    renderAdvancedFilter() {
        let categories = [],
            tags = [],
            brands = [];
        const $categories = this.props.promotionBasicInfo.getIn(['$categoryList', 'data']);
        if (Immutable.List.isList($categories)) {
            categories = $categories.toJS();
        }

        const $tags = this.props.promotionBasicInfo.getIn(['$tagList', 'data']);
        if (Immutable.List.isList($tags)) {
            tags = $tags.toJS();
        }

        const $brands = this.props.promotionScopeInfo.getIn(['refs', 'data', 'brands']);
        if (Immutable.List.isList($brands)) {
            brands = $brands.toJS();
        }
        const { intl } = this.props;
        const k5eng042 = intl.formatMessage(SALE_STRING.k5eng042);
        const k5dlp2gl = intl.formatMessage(SALE_STRING.k5dlp2gl);
        const k5dlp7zc = intl.formatMessage(SALE_STRING.k5dlp7zc);
        const k5dlpczr = intl.formatMessage(SALE_STRING.k5dlpczr);
        if (this.state.expand) {
            return (
                <div className="layoutsSeniorQuery">
                    <ul>

                        <li>
                            <h5>{SALE_LABEL.k5dlggak}</h5>
                        </li>
                        <li>
                            {this.renderShopsInTreeSelectMode()}
                        </li>
                        <li>
                            <h5>{SALE_LABEL.k5dljb1v}</h5>
                        </li>
                        <li>
                            <Select
                                placeholder=""
                                onChange={(value) => {
                                    this.setState({
                                        promotionCategory: value,
                                    });
                                }}
                                allowClear={true}
                                style={{ width: 120 }}
                            >
                                {
                                    categories.map((category, index) => {
                                        return (
                                            <Option key={`${index}`} value={`${category.name}`}>{category.name}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>

                        <li>
                            <h5>{SALE_LABEL.k5dlpi06}</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                allowClear={true}
                                placeholder=""
                                onChange={(tags) => {
                                    this.setState({
                                        promotionTags: tags || '',
                                    });
                                }}
                            >
                                {
                                    tags.map((tag, index) => {
                                        return (
                                            <Option key={`${index}`} value={`${tag.name}`}>{tag.name}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>

                        <li>
                            <h5>{SALE_LABEL.k5dlpn4t}</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 100 }}
                                allowClear={true}
                                placeholder=""
                                onChange={(brands) => {
                                    this.setState({
                                        promotionBrands: brands,
                                    });
                                }}
                            >
                                {
                                    brands.map((brand, index) => {
                                        return (
                                            <Option key={`${index}`} value={`${brand.brandID}`}>{brand.brandName}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>

                        <li>
                            <h5>{SALE_LABEL.k5dlpt47}</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                onChange={(value) => {
                                    this.setState({
                                        promotionOrder: value,
                                    });
                                }}
                                allowClear={true}
                                placeholder=""
                            >
                                {
                                    SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST.map((order) => {
                                        return (
                                            <Option key={`${order.value}`} value={`${order.value}`}>{order.label}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>
                        <li>
                            <h5>适用场景</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                onChange={(value) => {
                                    this.setState({
                                        channelLst: value,
                                    });
                                }}
                                allowClear={true}
                                placeholder=""
                            >
                                {
                                    SALE_CENTER_ACTIVITY_SUITSENCE_LIST.map((order) => {
                                        return (
                                            <Option key={`${order.value}`} value={`${order.value}`}>{order.label}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </li>
                    </ul>
                </div>
            );
        }
        return null;
    }

    renderTables() {
        const { intl } = this.props;
        const k5eng7pt = intl.formatMessage(SALE_STRING.k5eng7pt);
        const k5engebq = intl.formatMessage(SALE_STRING.k5engebq);
        const k5engk5b = intl.formatMessage(SALE_STRING.k5engk5b);
        const k5engpht = intl.formatMessage(SALE_STRING.k5engpht);
        const k5dlp2gl = intl.formatMessage(SALE_STRING.k5dlp2gl);
        const k5dlp7zc = intl.formatMessage(SALE_STRING.k5dlp7zc);
        const k5dlpczr = intl.formatMessage(SALE_STRING.k5dlpczr);
        const k5ey8jvj = intl.formatMessage(SALE_STRING.k5ey8jvj);
        const k5ey8l0e = intl.formatMessage(SALE_STRING.k5ey8l0e);
        const k5ey8lip = intl.formatMessage(SALE_STRING.k5ey8lip);
        const columns = [
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 50,
                key: 'key',
                fixed: 'left',
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSizes + text;
                },
            },
            {
                title: COMMON_LABEL.actions,
                key: 'operation',
                className: 'TableTxtCenter',
                width: 180,
                fixed: 'left',
                render: (text, record, index) => {
                    const isGroupPro = record.maintenanceLevel == '0';//区分集团和店铺
                    return (
                        <span>
                            <Authority rightCode={BASIC_LOOK_PROMOTION_QUERY} entryId={BASIC_PROMOTION_MANAGE_PAGE}>
                                <a
                                    href="#"
                                    onClick={() => {
                                        this.props.toggleIsUpdate(false)
                                        this.handleUpdateOpe(text, record, index);
                                    }}
                                >
                                    {COMMON_LABEL.view}
                                </a>
                            </Authority>
                            {
                                !isHuaTian() && (
                                    <Authority rightCode={BASIC_PROMOTION_UPDATE}>
                                        <a
                                            href="#"
                                            // disabled={!isGroupPro}
                                            onClick={() => {
                                                this.handleEditActive(record)(() => {
                                                    this.props.toggleIsUpdate(true)
                                                    this.handleUpdateOpe(text, record, index);
                                                })
                                            }}
                                        >{COMMON_LABEL.edit}</a>
                                    </Authority>
                                )
                            }
                            <Authority rightCode={BASIC_PROMOTION_DELETE} entryId={BASIC_PROMOTION_MANAGE_PAGE}>
                                {/* 非禁用状态不能删除 */}
                                <a
                                    href="#"
                                    // disabled={!isGroupPro || record.isActive != 0 || !isMine(record)}
                                    disabled={!isMine(record)}
                                    onClick={() => {
                                        if (!isMine(record)) {
                                            return
                                        }
                                        this.handleDelActive(record)(() => this.confirmDelete(record))
                                    }}
                                >{COMMON_LABEL.delete}</a>
                            </Authority>
                            {/* 华天集团促销活动不可编辑 */}
                            {
                                record.promotionType === '1050' ?
                                    <a
                                        href="#"
                                        disabled={isHuaTian()}
                                        onClick={() => {
                                            this.props.toggleIsUpdate(true)
                                            this.setState({
                                                isCopy: true,
                                                modalTitle: '复制活动信息'
                                            })
                                            this.handleUpdateOpe(text, record, index);
                                        }}
                                    >复制</a>
                                    :
                                    <Authority rightCode={BASIC_PROMOTION_UPDATE}>
                                        <a
                                            href="#"
                                            disabled={!isGroupPro || isHuaTian()}
                                            onClick={() => {
                                                this.props.toggleIsUpdate(true)
                                                this.setState({
                                                    isCopy: true,
                                                    modalTitle: '复制活动信息'
                                                })
                                                this.handleUpdateOpe(text, record, index);
                                            }}
                                        >复制</a>
                                    </Authority>
                            }

                        </span>

                    );
                },
            },
            {
                title: '启用/禁用',
                key: 'status',
                dataIndex: 'status',
                width: 90,
                className: 'TableTxtCenter',
                fixed: 'left',
                render: (text, record, index) => {
                    const defaultChecked = (record.isActive == '1' ? true : false); // 开启 / 禁用
                    const isGroupPro = record.maintenanceLevel == '0';
                    const isToggleActiveDisabled = (() => {
                        if (!isGroupOfHuaTianGroupList()) { // 门店创建
                            return false
                        }
                        if (isHuaTian()) {
                            return record.userType == 2 || record.userType == 0;
                        }
                        if (isBrandOfHuaTianGroupList()) {
                            return record.userType == 1 || record.userType == 3 || !isGroupPro;
                        }
                    })()
                    return (
                        <Authority rightCode={BASIC_PROMOTION_UPDATE}>
                            <Switch
                                // size="small"
                                className={styles.switcherSale}
                                checkedChildren={'启用'}
                                unCheckedChildren={'禁用'}
                                checked={defaultChecked}
                                onChange={() => {
                                    this.handleSattusActive(record)(() => this.handleDisableClickEvent(record.operation, record, index, null, '使用状态修改成功'))

                                }}
                                disabled={isToggleActiveDisabled}
                            />
                        </Authority>
                    )
                }
            },
            // {
            //     title: COMMON_LABEL.sort,
            //     className: 'TableTxtCenter',
            //     dataIndex: 'sortOrder',
            //     key: 'sortOrder',
            //     width: 120,
            //     render: (text, record, index) => {
            //         const canNotSortUp = this.state.pageNo == 1 && index == 0;
            //         const canNotSortDown = (this.state.pageNo - 1) * this.state.pageSizes + index + 1 == this.state.total;
            //         return (
            //             <span>
            //                 <span><Iconlist title={k5eng7pt} iconName={'sortTop'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'TOP')} /></span>
            //                 <span><Iconlist title={k5engk5b} iconName={'sortUp'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'UP')} /></span>
            //                 <span className={styles.upsideDown}><Iconlist title={k5engpht} iconName={'sortUp'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'DOWN')} /></span>
            //                 <span className={styles.upsideDown}><Iconlist title={k5engebq} iconName={'sortTop'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'BOTTOM')} /></span>
            //             </span>
            //         )
            //     },
            // },
            {
                title: SALE_LABEL.k5dk5uwl,
                dataIndex: 'promotionType',
                key: 'promotionType',
                fixed: 'left',
                width: 120,
                render: (promotionType) => {
                    const promotion = this.getAllPromotionTypes().filter((promotion) => {
                        return promotion.key === promotionType;
                    });
                    return promotion.length ? promotion[0].title : '--';
                },
            },

            {
                title: SALE_LABEL.k5dlcm1i,
                dataIndex: 'promotionName',
                key: 'promotionName',
                fixed: 'left',
                width: 200,
                render: (promotionName) => {
                    let text = promotionName;
                    if (promotionName === undefined || promotionName === null || promotionName === '') {
                        text = '--';
                    }
                    return (<span title={text}>{text}</span>);
                },
            },
            {
                title: SALE_LABEL.k5dmmiar,
                dataIndex: 'promotionCode',
                key: 'promotionCode',
                width: 140,
                render: text => <span title={text}>{text}</span>,
            },

            {
                title: SALE_LABEL.k5dml2ik,
                // className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 180,
                render: (validDate) => {
                    if (validDate.start === 20000101 || validDate.end === 29991231) {
                        return SALE_LABEL.k5dn26n4;
                    }
                    const text = `${moment(String(validDate.start)).format('YYYY.MM.DD')} / ${moment(String(validDate.end)).format('YYYY.MM.DD')}`;
                    return text;
                },
            },
            {
                title: '创建来源',
                className: 'TableTxtCenter',
                dataIndex: 'maintenanceLevel',
                key: 'maintenanceLevel',
                // width: 80,
                render: (t) => {
                    return t == '0' ? '集团创建' : '门店创建'
                }
            },
            {
                title: '活动状态',
                className: 'TableTxtCenter',
                dataIndex: 'status',
                key: 'valid',
                width: 72,
                render: (status) => {
                    return status == '1' ? <span className={styles.unBegin}>{k5dlp2gl}</span> : status == '2' ? <span className={styles.begin}>{k5dlp7zc}</span> : <span className={styles.end}>{k5dlpczr}</span>;
                },
            },
            {
                title: SALE_LABEL.k5dmps71,
                dataIndex: '',
                key: 'createBy',
                width: 140,
                render: (text, record, index) => {
                    if (record.createBy === '' && record.modifiedBy === '') {
                        return '--';
                    }
                    return `${record.createBy}/${record.modifiedBy || record.createBy}`;
                },
            },

            {
                title: SALE_LABEL.k5dmrraa,
                dataIndex: '',
                className: 'TableTxtCenter',
                key: 'createTime',
                width: 300,
                render: (text, record, index) => {
                    if (record.createTime == '0' && record.actionTime == '0') {
                        return '--';
                    }
                    const t = `${moment(new Date(parseInt(record.createTime))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionTime))).format('YYYY-MM-DD HH:mm:ss')}`;
                    return <Tooltip title={t}>{t}</Tooltip>;
                },
            },
            // {
            //     title: SALE_LABEL.k5dlbwqo,
            //     dataIndex: 'isActive',
            //     className: 'TableTxtCenter',
            //     key: 'isActive',
            //     width: 100,
            //     render: (isActive) => {
            //         return (isActive == '1' ? COMMON_LABEL.enable : COMMON_LABEL.disable);
            //     },
            // },
        ];
        return (
            <div className={`layoutsContent ${styles.tableClass}`}>
                <Table
                    ref={this.setTableRef}
                    scroll={{ x: 1000, y: 'calc(100vh - 440px)' }}
                    className={styles.sepcialActivesTable}
                    bordered={true}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    loading={this.state.loading}
                    size="default"
                    pagination={{
                        pageSize: this.state.pageSizes,
                        pageSizeOptions: ['25', '50', '100', '200'],
                        current: this.state.pageNo,
                        showQuickJumper: true,
                        showSizeChanger: true,
                        onShowSizeChange: this.onShowSizeChange,
                        total: this.state.total ? this.state.total : 0,
                        showTotal: (total, range) => `${k5ey8jvj}${range[0]}-${range[1]} / ${k5ey8l0e} ${total} ${k5ey8lip}`,
                        onChange: (page, pageSize) => {
                            this.setState({
                                pageNo: page,
                            })
                            const opt = {
                                pageSize,
                                pageNo: page,
                                usageMode: -1,
                                ...this.getParams(),
                                fail: () => message.error(SALE_LABEL.k5dmw1z4),
                            };
                            opt.cb = this.showNothing;
                            this.props.query(opt);
                        },
                    }}
                />
            </div>
        );
    }

    render() {
        console.log('taipingdao')
        const { runType, dataSource } = this.state;
        const { stylesShow, tabKeys } = this.props;
        return (
            <div style={{ backgroundColor: '#F3F3F3' }} className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <div>
                    {this.props.tabKeys !== 'saleSpecialPage' && this.renderHeader()}
                </div>
                {/* <PromotionCalendarBanner /> */}
                <div>
                    <div className={styles.pageContentWrapper} style={{ minHeight: 'calc(100vh - 160px)' }}>
                        <div style={{ padding: '0' }} className="layoutsHeader">
                            {this.renderFilterBar()}
                            <div style={{ margin: '0' }} className="layoutsLine"></div>
                        </div>
                        {
                            stylesShow === 'list' ? this.renderTables() :
                                <CardSaleActive
                                    dataSource={dataSource}
                                    type="sale"
                                    entryCode={this.props.entryCode}
                                    // cfg={this.cfg}
                                    handleSattusActive={this.handleSattusActive}
                                    handleDisableClickEvent={this.handleDisableClickEvent}
                                    handleUpdateOpe={this.handleUpdateOpe}
                                    toggleIsUpdate={this.props.toggleIsUpdate}
                                    handleEditActive={this.handleEditActive}
                                    handleDelActive={this.handleDelActive}
                                    confirmDelete={this.confirmDelete}
                                    pageNo={this.state.pageNo}
                                    pageSizes={this.state.pageSizes}
                                    total={this.state.total}
                                    onChangePage={(page, pageSize) => {
                                        this.setState({
                                            pageNo: page,
                                        })
                                        const opt = {
                                            pageSize,
                                            pageNo: page,
                                            usageMode: -1,
                                            ...this.getParams(),
                                            fail: () => message.error(SALE_LABEL.k5dmw1z4),
                                        };
                                        opt.cb = this.showNothing;
                                        this.props.query(opt);
                                    }}
                                    onShowSizeChange={this.onShowSizeChange}
                                    updateCopy={() => {
                                        this.setState({
                                            isCopy: true,
                                            modalTitle: '复制活动信息'
                                        })
                                    }}
                                />
                        }
                    </div>
                </div>
                {this.renderModifyRecordInfoModal()}
                {this.renderOperateModal()}
                <PromotionAutoRunModal runType={runType} />
                {
                    !this.state.exportVisible ? null :
                        <ExportModal
                            basicPromotion
                            handleClose={() => this.setState({ exportVisible: false })}
                        />
                }
                {
                    this.state.planModalVisible && <PlanModal
                        onCancel={() => { this.setState({ planModalVisible: false }) }}
                        isActive={this.state.promotionState == '1' ? '1' : '0'}
                        onSearch={this.getSearchListContent}
                        filterSchemeList={this.state.filterSchemeList}
                    />
                }
            </div>
        );
    }
}
export default MyActivities;

