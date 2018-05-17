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
import _ from 'lodash'
import { jumpPage } from '@hualala/platform-base'
import { axiosData } from '../../../helpers/util'
import registerPage from '../../../index';
import {Iconlist} from "../../../components/basic/IconsFont/IconsFont";
import { SALE_CENTER_PAGE_SHOP } from '../../../constants/entryCodes';
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
import PromotionDetail from './PromotionDetail';
import ActivityMain from '../activityMain';
import PromotionNameSelect from '../common/PromotionNameSelect';

import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { promotionScopeInfo_NEW as sale_promotionScopeInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionScopeInfo.reducer';
import { fullCut_NEW as sale_fullCut_NEW } from '../../../redux/reducer/saleCenterNEW/fullCut.reducer';
import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { saleCenter_NEW as sale_saleCenter_NEW } from '../../../redux/reducer/saleCenterNEW/saleCenter.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../../GiftNew/_reducers';
import { mySpecialActivities_NEW as sale_mySpecialActivities_NEW } from '../../../redux/reducer/saleCenterNEW/mySpecialActivities.reducer';
import { steps as sale_steps } from '../../../redux/modules/steps';
import {throttle} from 'lodash'
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Immutable = require('immutable');
const moment = require('moment');

const mapStateToProps = (state) => {
    return {
        myActivities: state.sale_myActivities_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
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
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },
        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
    };
};
@registerPage([SALE_CENTER_PAGE_SHOP], {
    sale_promotionBasicInfo_NEW,
    sale_promotionDetailInfo_NEW,
    sale_promotionScopeInfo_NEW,
    sale_fullCut_NEW,
    sale_myActivities_NEW,
    sale_saleCenter_NEW,
    sale_giftInfoNew,
    sale_mySpecialActivities_NEW,
    sale_steps,
})
@connect(mapStateToProps, mapDispatchToProps)
class MyActivitiesShop extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = null;
        this.setTableRef = el => this.tableRef = el;
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

        this.checkDetailInfo = this.checkDetailInfo.bind(this);
        this.renderModals = this.renderModals.bind(this);
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
    changeSortOrder(record, direction) {
        const params = {promotionID: record.promotionIDStr, shopID: this.props.user.shopID, rankingType: direction};
        axiosData('/promotionV1/updatePromotionRanking.ajax', params, {needThrow: true}, {path: undefined}, 'HTTP_SERVICE_URL_PROMOTION_NEW').then(() => {
            if (this.tableRef &&  this.tableRef.props && this.tableRef.props.pagination && this.tableRef.props.pagination.onChange) {
                this.tableRef.props.pagination.onChange(this.tableRef.props.pagination.current, this.tableRef.props.pagination.pageSize);
            }
        }).catch(err => {
            message.warning(err || 'sorry, 排序功能故障, 请稍后再试!');
        })
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
            shopID: this.props.user.shopID,
            phraseType: 'CATEGORY_NAME',
        });
        fetchPromotionTags({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
            phraseType: 'TAG_NAME',
        });
        fetchPromotionScopeInfo({
            _groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
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
        const expand = this.state.expand;
        let opt = {
            expand: !expand,
        }
        if (!opt.expand) {
            opt = {
                ...opt,
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
        // this.state.selectedRecord
        this.props.toggleSelectedActivityState({
            record: { ...record, shopID: this.props.user.shopID },
            cb: this.toggleStateCallBack,
        });
    }

    toggleStateCallBack() {
        message.success('使用状态修改成功，5分钟后saas才能获取更新的基础营销活动');
    }

    handleClose() {
        this.props.resetPromotionDetail();
        this.props.cancelFetchPromotionDetail();
        this.setState({
            visible: false,
        });
    }

    handleDismissUpdateModal() {
        this.setState({
            updateModalVisible: false,
        });
        // this.props.saleCenterResetBasicInfo();
        // this.props.saleCenterResetScopeInfo();
        // this.props.saleCenterResetDetailInfo();
    }

    onWindowResize = () => {
        const parentDoms = ReactDOM.findDOMNode(this.layoutsContainer); // 获取父级的doms节点
        if (parentDoms != null) { // 如果父级节点不是空将执行下列代码
            const parentHeight = parentDoms.offsetHeight; // 获取到父级的高度存到变量 parentHeight
            const contentrDoms = parentDoms.querySelectorAll('.layoutsContent'); // 从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if (undefined != contentrDoms && contentrDoms.length > 0) { // 如果 contentrDoms 节点存在 并且length>0 时执行下列代码
                const layoutsContent = contentrDoms[0]; // 把获取到的 contentrDoms 节点存到 变量 layoutsContent 中
                const headerDoms = parentDoms.querySelectorAll('.layoutsHeader');
                const headerHeight = headerDoms[0].offsetHeight;
                layoutsContent.style.height = `${parentHeight - headerHeight - 120}px`; // layoutsContent 的高度，等于父节点的高度-头部-横线-padding值
                this.setState({
                    contentHeight: parentHeight - headerHeight - 120,
                    tableHeight: layoutsContent.offsetHeight - 68,
                })
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user.activeTabKey !== nextProps.user.activeTabKey && nextProps.user.activeTabKey === "shop.dianpu.promotion") {
            const tabArr = nextProps.user.tabList.map((tab) => tab.value);
            if (tabArr.includes("shop.dianpu.promotion")) {
                this.handleQuery(this.state.pageNo); // tab里已有该tab，从别的tab切换回来，就自动查询，如果是新打开就不执行此刷新函数，而执行加载周期里的
            }
        }
        if (this.props.myActivities.get('$promotionList') != nextProps.myActivities.get('$promotionList')) {
            const _promoitonList = nextProps.myActivities.get('$promotionList').toJS();
            switch (_promoitonList.status) {
                case 'timeout':
                    message.error('请求超时');
                    this.setState({
                        loading: false,
                    });
                    break;
                case 'fail':
                    message.error('请求失败');
                    this.setState({
                        loading: false,
                    });
                    break;
                case 'success':
                    const _envIsVip = HUALALA.ENVIRONMENT == 'production-release';
                    // let data = _envIsVip ? _promoitonList.data.filter((activity) => {
                    //     //隐藏基础营销组合减免，买三免一（这两个活动先实现活动共享后再实现）
                    //     return activity.promotionType != 'BILL_COMBINE_FREE' && activity.promotionType != 'FOOD_BUY_THEN_FREE' &&
                    //         activity.promotionType != 'BILL_CUMULATION_FREE' && activity.promotionType != 'FOOD_CUMULATION_GIVE'
                    // }) : _promoitonList.data;
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
            // promotionShop,
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
        if (promotionState !== '' && promotionState != '0') {
            opt.isActive = promotionState == '1' ? 'ACTIVE' : 'NOT_ACTIVE';
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
        opt.shopID = this.props.user.shopID;
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
                message.warning('暂无数据');
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

    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSizes: pageSize,
        })
    };

    handleUpdateOpe() {
        const _record = arguments[1];
        if ( _record && _record.maintenanceLevel !== 'SHOP_LEVEL') { // 集团
            this.props.fetchFoodCategoryInfo({ _groupID: this.props.user.accountInfo.groupID });
            this.props.fetchFoodMenuInfo({ _groupID: this.props.user.accountInfo.groupID });
        }
        if (_record ) {
            this.setState({
                updateModalVisible: true,
                editPromotionType: _record.promotionType,
                currentPromotionID: _record.promotionIDStr,
            });
        }
        // Set promotion information to the PromotionBasic and promotionScope redux
        const successFn = (responseJSON) => {
            const _promotionIdx = getPromotionIdx(_record ? _record.promotionType : this.state.editPromotionType);
            const _serverToRedux = false;
            if (responseJSON.promotionInfo === undefined || responseJSON.promotionInfo.master === undefined) {
                message.error('没有查询到相应数据');
                return null;
            }
            if (responseJSON.promotionInfo.master.maintenanceLevel === 'SHOP_LEVEL') { // shop
                const opts = {
                    _groupID: this.props.user.accountInfo.groupID,
                    shopID: responseJSON.promotionInfo.master.shopIDLst,
                };
                this.props.fetchFoodCategoryInfo({ ...opts });
                this.props.fetchFoodMenuInfo({ ...opts });
            }
            // 把查询到的活动信息存到redux
            this.props.saleCenterResetBasicInfo(promotionBasicDataAdapter(responseJSON.promotionInfo, _serverToRedux));
            this.props.saleCenterResetScopeInfo(promotionScopeInfoAdapter(responseJSON.promotionInfo.master, _serverToRedux));
            this.props.saleCenterResetDetailInfo(promotionDetailInfoAdapter(responseJSON.promotionInfo, _serverToRedux));

            this.setState({
                promotionInfo: responseJSON.promotionInfo,
                selectedRecord: responseJSON.promotionInfo, // arguments[1],
                modalTitle: '更新活动信息',
                isNew: false,
                index: _promotionIdx,
            });
        };

        const failFn = (msg) => {
            message.error(msg);
        };
        this.props.fetchPromotionDetail_NEW({
            data: {
                promotionID: _record ? _record.promotionIDStr : this.state.currentPromotionID,
                groupID: this.props.user.accountInfo.groupID,
                shopID: this.props.user.shopID,
            },
            success: successFn,
            fail: failFn,
        });
    }

    // Row Actions: 查看
    checkDetailInfo() {
        const _record = arguments[1];
        this.setState({
            visible: true,
            currentPromotionID: _record ? _record.promotionIDStr : this.state.currentPromotionID,
        });

        const failFn = (msg) => {
            message.error(msg);
        };

        this.props.fetchPromotionDetail_NEW({
            data: {
                promotionID: _record ? _record.promotionIDStr : this.state.currentPromotionID, // promotionID 会自动转换int类型,出现数据溢出,新加字符串类型的promotionIDStr替换
                groupID: this.props.user.accountInfo.groupID,
                shopID: this.props.user.shopID,
            },
            fail: failFn,
        });
    }
    /**
     * Render promotion update Modal
     * wrapped normally.
     * @param {Bool} isNew A bool value identify the current operation is update or create.
     */

    renderContentOfThisModal() {
        const promotionDetailInfo = this.props.myActivities.get('$promotionDetailInfo').toJS();
        const handleUpdateOpe = this.handleUpdateOpe;
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
                    查询详情出错!点击 <a onClick={handleUpdateOpe}>重试</a>
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
                        this.handleDismissUpdateModal();
                    }
                }}
            />);
        }
    }

    renderModifyRecordInfoModal() {
        // TODO: remove the const 0, fixed with corresponding promotionType

        return (
            <Modal
                wrapClassName="progressBarModal"
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width="924px"
                height="569px"
                maskClosable={false}
                onCancel={() => {
                    this.setState({
                        updateModalVisible: false,
                    });
                    this.props.saleCenterResetBasicInfo();
                    this.props.saleCenterResetScopeInfo();
                    this.props.saleCenterResetDetailInfo();
                    this.props.cancelFetchPromotionDetail();
                }}
            >
                {
                    this.state.updateModalVisible ?
                        this.renderContentOfThisModal()
                        : null
                }
            </Modal>
        );
    }

    renderModals() {
        const promotionDetailInfo = this.props.myActivities.get('$promotionDetailInfo').toJS();
        const checkDetailInfo = this.checkDetailInfo;
        function renderContentOfTheModal(cancelFetchPromotionDetail) {
            if (promotionDetailInfo.status === 'start' || promotionDetailInfo.status === 'pending') {
                return (
                    <div className={styles.spinFather}>
                        <Spin size="large" />
                    </div>)
            }
            if (promotionDetailInfo.status === 'timeout' || promotionDetailInfo.status === 'fail') {
                return (
                    <div className={styles.spinFather}>
                        查询详情出错!点击 <a onClick={checkDetailInfo}>重试</a>
                    </div>
                );
            }
            if (promotionDetailInfo.status === 'success') {
                return (<PromotionDetail record={promotionDetailInfo.data.promotionInfo} />);
            }
        }
        return (
            <Modal
                title="活动详情"
                visible={this.state.visible}
                footer={<Button onClick={this.handleClose}>关闭</Button>}
                closable={false}
            >
                {
                    this.state.visible ?
                        renderContentOfTheModal(this.props.cancelFetchPromotionDetail)
                        : null
                }
            </Modal>
        );
    }

    renderHeader() {
        const headerClasses = `layoutsToolLeft ${styles.headerWithBgColor}`;
        return (
            <div className="layoutsTool" style={{height: '80px'}}>
                <div className={headerClasses} style={{lineHeight: '80px'}}>
                    <span style={{lineHeight: '80px'}} className={styles.customHeader}>基础营销信息</span>
                    <Button
                        type="ghost"
                        icon="plus"
                        className={styles.jumpToCreate}
                        onClick={
                            () => {
                                const menuID = this.props.user.menuList.find(tab => tab.entryCode === 'shop.dianpu.creatpromotion').menuID
                                jumpPage({ menuID })
                            }
                        }>新建</Button>
                </div>
            </div>
        );
    }

    renderShopsInTreeSelectMode() {
        const treeData = Immutable.List.isList(this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData'])) ?
            this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']).toJS() :
            this.props.promotionScopeInfo.getIn(['refs', 'data', 'constructedData']);

        const tProps = this.state.selectedShop != null ?
            {
                treeData,
                value: this.state.selectedShop,
                onChange: value => this.onTreeSelect(value, treeData),
                placeholder: '请选择店铺',
                allowClear: true,
            } : {
                treeData,
                value: undefined,
                onChange: value => this.onTreeSelect(value, treeData),
                placeholder: '请选择店铺',
                allowClear: true,
            };
        return (
            <TreeSelect {...tProps} style={{ width: 150 }} dropdownStyle={{ minWidth: 150 }} dropdownMatchSelectWidth={false} />
        );
    }

    renderFilterBar() {
        const opt = this.getParams()

        return (
            <div>
                <div className="layoutsSearch">
                    <ul>
                        <li>
                            <h5>活动时间</h5>
                        </li>
                        <li>
                            <RangePicker style={{ width: 200 }} onChange={this.onDateQualificationChange} />
                        </li>

                        <li>
                            <h5>活动类型</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: '160px' }}
                                showSearch={true}
                                placeholder="请选择类型"
                                defaultValue="全部"
                                onChange={(value) => {
                                    this.setState({
                                        promotionType: value === 'ALL' ? null : value,
                                    });
                                }}
                            >
                                {
                                    [{
                                        value: 'ALL',
                                        title: '全部',
                                    }, ...ACTIVITY_CATEGORIES].filter(pro => pro.key !== 'RECOMMEND_FOOD')
                                        .map((activity, index) => {
                                            return (
                                                <Option value={`${activity.key}`} key={`${index}`}>{activity.title}</Option>
                                            );
                                        })
                                }
                            </Select>
                        </li>

                        <li>
                            <h5>使用状态</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: '160px' }}
                                defaultValue="0"
                                placeholder="请选择使用状态"
                                onChange={(value) => {
                                    this.setState({
                                        promotionState: value,
                                    });
                                }}
                            >
                                <Option value={TRIPLE_STATE.ALL}>全部</Option>
                                <Option value={TRIPLE_STATE.OPTION1}>启用</Option>
                                <Option value={TRIPLE_STATE.OPTION2}>禁用</Option>
                            </Select>
                        </li>

                        <li>
                            <h5>活动名称</h5>
                        </li>
                        <li>
                            <PromotionNameSelect
                                getParams={{ ...opt, promotionName: undefined }}
                                onChange={(promotionName) => {
                                    this.setState(promotionName)
                                }}
                            />
                        </li>

                        <li>
                            <Authority rightCode="marketing.jichuyingxiaoxin.query">
                                <Button type="primary" onClick={this.handleQuery} disabled={this.state.queryDisabled}><Icon type="search" />查询</Button>
                            </Authority>
                        </li>
                        <li>
                            <a onClick={this.toggleExpandState}>高级查询 {this.state.expand ? <Icon type="caret-up" /> : <Icon type="caret-down" />}</a>
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
        // let categories = this.props.promotionBasicInfo.getIn(['$categoryList', 'data']).toJS(),
        //     tags = this.props.promotionBasicInfo.getIn(['$tagList', 'data']).toJS(),
        //     brands = this.props.promotionScopeInfo.getIn(["refs", "data", "brands"]).toJS();

        if (this.state.expand) {
            return (
                <div className="layoutsSeniorQuery">
                    <ul>
                        <li>
                            <h5>有效状态</h5>
                        </li>
                        <li>
                            <Select
                                placeholder="请选择有效状态"
                                defaultValue={'0'}
                                style={{ width: 100 }}
                                onChange={(value) => {
                                    this.setState({
                                        promotionValid: value,
                                    });
                                }}
                            >

                                <Option key="0" value={'0'}>全部</Option>
                                <Option key="1" value={'1'}>未开始</Option>
                                <Option key="2" value={'2'}>执行中</Option>
                                <Option key="3" value={'3'}>已结束</Option>
                            </Select>
                        </li>

                        <li>
                            <h5>统计类别</h5>
                        </li>
                        <li>
                            <Select
                                placeholder="请选择统计类别"
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
                            <h5>标签</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 120 }}
                                allowClear={true}
                                placeholder="请选择标签"
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

                        {/* <li>
                            <h5>品牌</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 100 }}
                                allowClear={true}
                                placeholder="请选择品牌"
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
                        </li> */}

                        <li>
                            <h5>适用业务</h5>
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
                                placeholder="请选择适用业务"
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
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 50,
                // fixed:'left',
                key: 'key',
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSizes + text;
                },
            },
            {
                title: '操作',
                key: 'operation',
                width: 140,
                // fixed: 'left',
                render: (text, record, index) => {
                    const buttonText = (record.isActive === 'ACTIVE' ? '禁用' : '启用');
                    const isGroupPro = record.maintenanceLevel == 'GROUP_LEVEL';
                    return (<span>
                        <a
                            href="#"
                            disabled={isGroupPro}
                            onClick={() => {
                                this.handleDisableClickEvent(text, record, index);
                            }}
                        >{buttonText}</a>
                        <Authority rightCode="marketing.chakanjichuyingxiaoxin.query">
                            <a
                                href="#"
                                onClick={() => {
                                    { /* this.checkDetailInfo(text, record, index); */ }
                                    this.props.toggleIsUpdate(false)
                                    this.handleUpdateOpe(text, record, index);
                                }}
                            >
                                查看
                            </a>
                        </Authority>
                        <Authority rightCode="marketing.jichuyingxiaoxin.update">
                            <a
                                href="#"
                                disabled={isGroupPro}
                                onClick={() => {
                                    this.props.toggleIsUpdate(true)
                                    this.handleUpdateOpe(text, record, index);
                                }}
                            >编辑</a>
                        </Authority>
                    </span>

                    );
                },
            },
            {
                title: '排序',
                dataIndex: 'sortOrder',
                key: 'sortOrder',
                width: 120,
                // fixed:'left',
                render: (text, record, index) => {
                    const canNotSortUp = this.state.pageNo == 1 && index == 0;
                    const canNotSortDown = (this.state.pageNo - 1) * this.state.pageSizes + index + 1 == this.state.total;
                    return (
                        <span>
                            <span><Iconlist title={'置顶'} iconName={'sortTop'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'TOP')}/></span>
                            <span><Iconlist title={'上移'} iconName={'sortUp'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'UP')}/></span>
                            <span className={styles.upsideDown}><Iconlist title={'下移'} iconName={'sortUp'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'DOWN')}/></span>
                            <span className={styles.upsideDown}><Iconlist title={'置底'} iconName={'sortTop'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'BOTTOM')}/></span>
                        </span>
                    )
                },
            },
            {
                title: '活动类型',
                dataIndex: 'promotionType',
                key: 'promotionType',
                width: 120,
                // fixed:'left',
                render: (promotionType) => {
                    const promotion = ACTIVITY_CATEGORIES.filter((promotion) => {
                        return promotion.key === promotionType;
                    });
                    return promotion.length ? promotion[0].title : '--';
                },
            },

            {
                title: '活动名称',
                dataIndex: 'promotionName',
                key: 'promotionName',
                width: 200,
                // fixed:'left',
                render: (promotionName) => {
                    let text = promotionName;
                    if (promotionName === undefined || promotionName === null || promotionName === '') {
                        text = '--';
                    }
                    return (<span title={text}>{text}</span>);
                },
            },
            {
                title: '活动编码',
                dataIndex: 'promotionCode',
                key: 'promotionCode',
                width: 140,
                render: text => <span title={text}>{text}</span>,
            },

            {
                title: '有效时间',
                className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 180,
                render: (validDate) => {
                    if (validDate.start === 20000101 || validDate.end === 29991231) {
                        return '不限制';
                    }
                    return `${validDate.start} - ${validDate.end}`;
                },
            },

            {
                title: '有效状态',
                dataIndex: 'status',
                key: 'valid',
                width: 72,
                render: (status) => {
                    return status == '1' ? '未开始' : status == '2' ? '执行中' : '已结束';
                },
            },

            {
                title: '创建人/修改人',
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
                title: '创建时间/修改时间',
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
                title: '使用状态',
                dataIndex: 'isActive',
                className: 'TableTxtCenter',
                key: 'isActive',
                width: 100,
                render: (isActive) => {
                    return (isActive === 'ACTIVE' ? '启用' : '禁用');
                },
            },
        ];

        return (
            <div className="layoutsContent  tableClass" style={{ height: this.state.contentHeight }}>
                <Table
                    ref={this.setTableRef}
                    scroll={{ x: 1600, y: this.state.tableHeight }}
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
                        showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                        onChange: (page, pageSize) => {
                            this.setState({
                                pageNo: page,
                            })
                            const opt = {
                                pageSize,
                                pageNo: page,
                                usageMode: -1,
                                ...this.getParams(),
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

                <div>
                    <div style={{backgroundColor: 'white', paddingBottom: '25px', borderRadius: '10px', margin: '0 20px'}}>
                        <div className="layoutsHeader">
                            {this.renderFilterBar()}
                            <div style={{ margin: '0'}} className="layoutsLine"></div>
                        </div>
                        {this.renderTables()}
                    </div>
                </div>
                {this.renderModals()}
                {this.renderModifyRecordInfoModal(0)}
            </div>
        );
    }
}
export default MyActivitiesShop;

