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
    TreeSelect,
    Spin,
} from 'antd';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { throttle } from 'lodash'
import { jumpPage } from '@hualala/platform-base'
import registerPage from '../../../index';
import {Iconlist} from "../../../components/basic/IconsFont/IconsFont";
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

    getPromotionIdx,
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter,
    TRIPLE_STATE,
} from '../../../redux/actions/saleCenterNEW/types';
import styles from '../ActivityPage.less';
import Authority from '../../../components/common/Authority';
import ActivityMain from '../activityMain';
import PromotionNameSelect from '../common/PromotionNameSelect';

import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { promotionScopeInfo_NEW as sale_promotionScopeInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionScopeInfo.reducer';
import { fullCut_NEW as sale_fullCut_NEW } from '../../../redux/reducer/saleCenterNEW/fullCut.reducer';
import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { saleCenter_NEW as sale_saleCenter_NEW } from '../../../redux/reducer/saleCenterNEW/saleCenter.reducer';
import { promotionAutoRunState as sale_promotionAutoRunState } from '../../../redux/reducer/saleCenterNEW/promotionAutoRun.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../../GiftNew/_reducers';
import { mySpecialActivities_NEW as sale_mySpecialActivities_NEW } from '../../../redux/reducer/saleCenterNEW/mySpecialActivities.reducer';
import {axiosData, getAccountInfo} from "../../../helpers/util";
import PromotionAutoRunModal from "./PromotionAutoRunModal";
import ExportModal from "../../GiftNew/GiftInfo/ExportModal";
import {
    openPromotionAutoRunListModal,
    queryPromotionAutoRunList
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
import { selectPromotionForDecoration  } from '../../../redux/actions/decoration';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const Option = Select.Option;
const { RangePicker } = DatePicker;
const Immutable = require('immutable');
const moment = require('moment');
const confirm = Modal.confirm;

const mapStateToProps = (state) => {
    return {
        myActivities: state.sale_myActivities_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
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
        openPromotionAutoRunListModal: (opts) => {
            dispatch(openPromotionAutoRunListModal(opts))
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
        this.lockedChangeSortOrder = throttle(this.changeSortOrder, 500, {trailing: false});
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
            selectedShop: null,
            loading: true,
            // 以下是用于查询的条件
            promotionType: '',
            editPromotionType: '',
            promotionDateRange: '',
            promotionValid: '',
            promotionState: '',
            promotionCategory: '',
            promotionTags: '',
            promotionBrands: '',
            promotionOrder: '',
            promotionShop: '',
            pageSizes: 30, // 默认显示的条数
            pageNo: 1,
            queryDisabled: false,
            currentPromotionID: '',
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
        } = this.props;
        this.handleQuery();
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
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
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
            }
        }
        this.setState(opt)
    }

    handleDisableClickEvent(text, record) {
        this.props.toggleSelectedActivityState({
            record,
            cb: this.toggleStateCallBack,
        });
    }

    handleDecorationStart = (record) => {
        const { promotionType, promotionIDStr, promotionName } = record;
        this.props.selectPromotionForDecoration({
            type: `${promotionType}`,
            id: promotionIDStr,
            title: promotionName,
        });
        jumpPage({menuID: PROMOTION_DECORATION})
    }

    confirmDelete = (record) => {
        confirm({
        title: <span style={{color: '#434343'}}>{SALE_LABEL.k5dnw1q3}</span>,
            content: (
                <div>
                    <span style={{color: '#787878'}}>
                        {`${SALE_LABEL.k5do6vse}【${record.promotionName ? record.promotionName.length > 20 ? record.promotionName.substring(0, 20) + '...' : record.promotionName : ''}】`}
                    </span>
                    <br/>
                    <span style={{color: '#aeaeae'}}>
                       {SALE_LABEL.k5do4z54}
                    </span>
                </div>
            ),
            onOk: () => {
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
                    {path: 'data'},
                    'HTTP_SERVICE_URL_PROMOTION_NEW'
                ).then(() => {
                    message.success(SALE_LABEL.k5do0ps6);
                    this.tryToRefresh();
                    this.tryToUpdateNameList();
                }).catch((error) => {});
            },
            onCancel() {},
        });
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
            promotionShop,
            promotionName,
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
        const params = {promotionID: record.promotionIDStr, rankingType: direction};
        axiosData('/promotion/docPromotionService_updateRanking.ajax', params, {needThrow: true}, {path: undefined}, 'HTTP_SERVICE_URL_PROMOTION_NEW').then(() => {
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
            ...ACTIVITY_CATEGORIES,
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
            index: _promotionIdx,
        });
    };

    failFn = () => {
        message.error(SALE_LABEL.k5dmw1z4);
    };

    handleUpdateOpe() {
        const _record = arguments[1];
        if ( _record && _record.maintenanceLevel !== '1') { // 集团
            this.props.fetchFoodCategoryInfo({
                _groupID: this.props.user.accountInfo.groupID },
                isHuaTian(),
                _record.subGroupID
            );
            this.props.fetchFoodMenuInfo({
                _groupID: this.props.user.accountInfo.groupID },
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
        if (_record ) {
            this.setState({
                updateModalVisible: true,
                editPromotionType: _record.promotionType,
                currentPromotionID: _record.promotionIDStr,
            });
        }
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
                index={_state.index}
                steps={_state.steps}
                callbackthree={(arg) => {
                    if (arg == 3) {
                        this.setState({
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
                { this.state.updateModalVisible && this.renderContentOfThisModal()}
            </Modal>
        );
    }

    renderHeader() {
        const headerClasses = `layoutsToolLeft ${styles.basicPromotionHeader} ${styles.headerWithBgColor}`;
        const {
            queryPromotionAutoRunList,
            openPromotionAutoRunListModal,
            intl,
        } = this.props;
        return (
            <div className="layoutsTool" style={{height: '64px'}}>
                <div className={headerClasses}>
                    <span className={styles.customHeader}>
                        {this.isOnlinePromotionPage() ? SALE_LABEL.k5dbdped : SALE_LABEL.k5dbefat}
                    </span>
                    {
                        !isHuaTian() && !this.isOnlinePromotionPage() && (
                            <Authority rightCode={AUTO_RUN_QUERY}>
                                <Button
                                    onClick={() => {
                                        queryPromotionAutoRunList();
                                        openPromotionAutoRunListModal();
                                    }}
                                    icon="plus"
                                    className={styles.customPrimaryButton}
                                >
                                    {SALE_LABEL.k5dbiuws}
                                </Button>
                            </Authority>
                        )
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
                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
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
                            <h5>{SALE_LABEL.k5dlbwqo}</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 60 }}
                                defaultValue="0"
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
                            <Authority rightCode={BASIC_PROMOTION_QUERY}>
                                <Button type="primary" onClick={this.handleQuery} disabled={this.state.queryDisabled}><Icon type="search" />{ COMMON_LABEL.query }</Button>
                            </Authority>
                        </li>
                        <li>
                            <a onClick={this.toggleExpandState}>{SALE_LABEL.k5dldshc} {this.state.expand ? <Icon type="caret-up" /> : <Icon type="caret-down" />}</a>
                        </li>
                        {
                            !this.isOnlinePromotionPage() && (
                                <li>
                                    <Authority rightCode={BASIC_PROMOTION_QUERY}>
                                        <Button
                                            type="ghost"
                                            onClick={() => this.setState({ exportVisible: true })}
                                        ><Icon type="export" />{ COMMON_LABEL.export }</Button>
                                    </Authority>
                                </li>
                            )
                        }
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
                            <h5>{SALE_LABEL.k5dli0fu}</h5>
                        </li>
                        <li>
                            <Select
                                placeholder=""
                                defaultValue={'0'}
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
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSizes + text;
                },
            },
            {
                title: COMMON_LABEL.actions,
                key: 'operation',
                className: 'TableTxtCenter',
                width: 180,
                render: (text, record, index) => {
                    const buttonText = (record.isActive == '1' ? COMMON_LABEL.disable : COMMON_LABEL.enable);
                    const isGroupPro = record.maintenanceLevel == '0';
                    const isToggleActiveDisabled = (() => {
                        if (!isGroupOfHuaTianGroupList()) {
                            return !isGroupPro
                        }
                        if (isHuaTian()) {
                            return record.userType == 2 || record.userType == 0;
                        }
                        if (isBrandOfHuaTianGroupList()) {
                            return record.userType == 1 || record.userType == 3 || !isGroupPro;
                        }
                    })()
                    return (
                        <span>
                            <Authority rightCode={BASIC_PROMOTION_UPDATE}>
                                <a
                                    href="#"
                                    disabled={isToggleActiveDisabled}
                                    onClick={() => {
                                        this.handleDisableClickEvent(text, record, index);
                                    }}
                                >
                                    {buttonText}
                                </a>
                            </Authority>
                            <Authority rightCode={BASIC_LOOK_PROMOTION_QUERY}>
                                <a
                                    href="#"
                                    onClick={() => {
                                        this.props.toggleIsUpdate(false)
                                        this.handleUpdateOpe(text, record, index);
                                    }}
                                >
                                    { COMMON_LABEL.view }
                                </a>
                            </Authority>
                            {
                                !isHuaTian() && (
                                    <Authority rightCode={BASIC_PROMOTION_UPDATE}>
                                        <a
                                            href="#"
                                            disabled={!isGroupPro}
                                            onClick={() => {
                                                this.props.toggleIsUpdate(true)
                                                this.handleUpdateOpe(text, record, index);
                                            }}
                                        >{ COMMON_LABEL.edit }</a>
                                    </Authority>
                                )
                            }
                            <Authority rightCode={BASIC_PROMOTION_DELETE}>
                                {/* 非禁用状态不能删除 */}
                                <a
                                    href="#"
                                    disabled={!isGroupPro || record.isActive != 0 || !isMine(record)}
                                    onClick={() => {
                                        this.confirmDelete(record)
                                    }}
                                >{ COMMON_LABEL.delete }</a>
                            </Authority>
                    </span>

                    );
                },
            },
            {
                title: COMMON_LABEL.sort,
                dataIndex: 'sortOrder',
                key: 'sortOrder',
                width: 120,
                render: (text, record, index) => {
                    const canNotSortUp = this.state.pageNo == 1 && index == 0;
                    const canNotSortDown = (this.state.pageNo - 1) * this.state.pageSizes + index + 1 == this.state.total;
                    return (
                        <span>
                            <span><Iconlist title={k5eng7pt} iconName={'sortTop'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'TOP')}/></span>
                            <span><Iconlist title={k5engk5b} iconName={'sortUp'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'UP')}/></span>
                            <span className={styles.upsideDown}><Iconlist title={k5engpht} iconName={'sortUp'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'DOWN')}/></span>
                            <span className={styles.upsideDown}><Iconlist title={k5engebq} iconName={'sortTop'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'BOTTOM')}/></span>
                        </span>
                    )
                },
            },
            {
                title: SALE_LABEL.k5dk5uwl,
                dataIndex: 'promotionType',
                key: 'promotionType',
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
                className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 180,
                render: (validDate) => {
                    if (validDate.start === 20000101 || validDate.end === 29991231) {
                        return SALE_LABEL.k5dn26n4;
                    }
                    return `${validDate.start} - ${validDate.end}`;
                },
            },

            {
                title: SALE_LABEL.k5dli0fu,
                dataIndex: 'status',
                key: 'valid',
                width: 72,
                render: (status) => {
                    return status == '1' ? k5dlp2gl : status == '2' ? k5dlp7zc : k5dlpczr;
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
                    return `${moment(new Date(parseInt(record.createTime))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionTime))).format('YYYY-MM-DD HH:mm:ss')}`;
                },
            },
            {
                title: SALE_LABEL.k5dlbwqo,
                dataIndex: 'isActive',
                className: 'TableTxtCenter',
                key: 'isActive',
                width: 100,
                render: (isActive) => {
                    return (isActive == '1' ? COMMON_LABEL.enable : COMMON_LABEL.disable);
                },
            },
        ];
        return (
            <div className={`layoutsContent ${styles.tableClass}`} style={{ height: this.state.contentHeight}}>
                <Table
                    ref={this.setTableRef}
                    scroll={{ x: 1630, y: this.state.contentHeight - 93 }}
                    bordered={true}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    loading={this.state.loading}
                    pagination={{
                        pageSize: this.state.pageSizes,
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
        return (
        <div style={{backgroundColor: '#F3F3F3'}} className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
            <div>
                {this.renderHeader()}
            </div>
            <PromotionCalendarBanner />
            <div>
                <div className={styles.pageContentWrapper}>
                    <div style={{ padding: '0'}} className="layoutsHeader">
                        {this.renderFilterBar()}
                        <div style={{ margin: '0'}} className="layoutsLine"></div>
                    </div>
                    {this.renderTables()}
                </div>
            </div>
            {this.renderModifyRecordInfoModal()}
            <PromotionAutoRunModal/>
            {
                !this.state.exportVisible ? null :
                    <ExportModal
                        basicPromotion
                        handleClose={() => this.setState({ exportVisible: false })}
                    />
            }
        </div>
        );
    }
}
export default MyActivities;

