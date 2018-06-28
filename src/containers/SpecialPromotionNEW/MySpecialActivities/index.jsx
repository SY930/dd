import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import {
    Table, Input, Select, DatePicker,
    Button, Modal, Row, Col, message,
    Spin, Icon,
} from 'antd';
import {throttle, isEqual} from 'lodash';
import { jumpPage } from '@hualala/platform-base'
import moment from 'moment';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import Cfg from '../../../constants/SpecialPromotionCfg';
import Authority from '../../../components/common/Authority';
import { saleCenterSetSpecialBasicInfoAC, saleCenterResetDetailInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'

import {
    toggleSelectedActivityStateAC,
    fetchSpecialPromotionList,
    // fetchPromotionListCancel,
    deleteSelectedRecordAC,
    fetchSpecialPromotionDetailAC,
    fetchSpecialPromotionDetailCancel,
    fetchSpecialDetailAC,
    updateExpiredActiveState,
} from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import {
    toggleIsUpdateAC,
} from '../../../redux/actions/saleCenterNEW/myActivities.action';
import SpecialPromotionDetail from './specialPromotionDetail';

import {
    getSpecialPromotionIdx,
    specialPromotionBasicDataAdapter,
} from '../../../redux/actions/saleCenterNEW/types';

import ActivityMain from '../activityMain';

import registerPage from '../../../index';
import { SPECIAL_PAGE } from '../../../constants/entryCodes';
import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer';
import { promotionDetailInfo_NEW as sale_promotionDetailInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionDetailInfo.reducer';
import { promotionScopeInfo_NEW as sale_promotionScopeInfo_NEW } from '../../../redux/reducer/saleCenterNEW/promotionScopeInfo.reducer';
import { fullCut_NEW as sale_fullCut_NEW } from '../../../redux/reducer/saleCenterNEW/fullCut.reducer';
import { myActivities_NEW as sale_myActivities_NEW } from '../../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { saleCenter_NEW as sale_saleCenter_NEW } from '../../../redux/reducer/saleCenterNEW/saleCenter.reducer';
import { giftInfoNew as sale_giftInfoNew } from '../../GiftNew/_reducers';
import { mySpecialActivities_NEW as sale_mySpecialActivities_NEW } from '../../../redux/reducer/saleCenterNEW/mySpecialActivities.reducer';
import { specialPromotion_NEW as sale_specialPromotion_NEW } from '../../../redux/reducer/saleCenterNEW/specialPromotion.reducer';
import { crmCardTypeNew as sale_crmCardTypeNew } from '../../../redux/reducer/saleCenterNEW/crmCardType.reducer';
import { steps as sale_steps } from '../../../redux/modules/steps';
import {Iconlist} from "../../../components/basic/IconsFont/IconsFont";
import {axiosData} from "../../../helpers/util";
import {queryWeixinAccounts} from "../../../redux/reducer/saleCenterNEW/queryWeixinAccounts.reducer";

const confirm = Modal.confirm;
const Option = Select.Option;
const { RangePicker } = DatePicker;
const mapStateToProps = (state) => {
    return {
        mySpecialActivities: state.sale_mySpecialActivities_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        query: (opts) => {
            dispatch(fetchSpecialPromotionList(opts));
        },

        toggleSelectedActivityState: (opts) => {
            dispatch(toggleSelectedActivityStateAC(opts));
        },
        updateExpiredActiveState: (opts) => {
            dispatch(updateExpiredActiveState(opts))
        },
        deleteSelectedRecord: (opts) => {
            dispatch(deleteSelectedRecordAC(opts));
        },

        fetchSpecialPromotionList: (opts) => {
            dispatch(fetchSpecialPromotionList(opts))
        },

        fetchSpecialPromotionDetail: (opts) => {
            dispatch(fetchSpecialPromotionDetailAC(opts))
        },

        cancelFetchSpecialPromotionDetail: (opts) => {
            dispatch(fetchSpecialPromotionDetailCancel(opts))
        },
        saleCenterSetSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts))
        },
        fetchSpecialDetail: (opts) => {
            dispatch(fetchSpecialDetailAC(opts))
        },
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts))
        },
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
    };
};

@registerPage([SPECIAL_PAGE], {
    sale_promotionBasicInfo_NEW,
    sale_promotionDetailInfo_NEW,
    sale_promotionScopeInfo_NEW,
    sale_fullCut_NEW,
    queryWeixinAccounts,
    sale_myActivities_NEW,
    sale_saleCenter_NEW,
    sale_giftInfoNew,
    sale_mySpecialActivities_NEW,
    sale_specialPromotion_NEW,
    sale_crmCardTypeNew,
    sale_steps,
})
@connect(mapStateToProps, mapDispatchToProps)
class MySpecialActivities extends React.Component {
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
            eventWay: '',
            promotionDateRange: '',
            isActive: '',
            eventName: '',
            editEventWay: '',
            pageSizes: 30,
            pageNo: 1,
            record: {
                eventInfo: {},
                cardInfo: [],
                userInfo: [],
            },
            queryDisabled: false,
            currentItemID: '',
        };

        this.renderFilterBar = this.renderFilterBar.bind(this);
        this.showNothing = this.showNothing.bind(this);
        this.handleDismissUpdateModal = this.handleDismissUpdateModal.bind(this);
        // disable selected activity


        this.handleDisableClickEvent = this.handleDisableClickEvent.bind(this);
        this.handelStopEvent = this.handelStopEvent.bind(this);
        this.onDateQualificationChange = this.onDateQualificationChange.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.renderContentOfThisModal = this.renderContentOfThisModal.bind(this);
        this.checkDeleteInfo = this.checkDeleteInfo.bind(this);
        this.checkDetailInfo = this.checkDetailInfo.bind(this);
        this.renderModals = this.renderModals.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.renderUpdateModals = this.renderUpdateModals.bind(this);
        this.handleUpdateOpe = this.handleUpdateOpe.bind(this);
    }

    /**
     * @description toggle the advanced qualification selection.
     * */
    handleDisableClickEvent(text, record, index, nextActive, modalTip) {
        // this.state.selectedRecord
        this.props.toggleSelectedActivityState({
            record,
            nextActive,
            modalTip,
            success: this.toggleStateCallBack,
            fail: this.toggleStateFailCallBack,
            warning: this.toggleStateWarningCallBack,
        });
    }

    toggleStateFailCallBack(val) {
        message.error(val);
    }

    toggleStateWarningCallBack(val) {
        message.warning(val);
    }

    toggleStateCallBack(val) {
        message.success(val);
    }
    // 终止活动
    handelStopEvent(text, record, index, nextActive, modalTip) {
        confirm({
            title: '终止特色营销活动',
            content: (
                <div>
                    您将终止
                    【<span>{record.eventName}</span>】
                    <br />
                    <span>终止是不可恢复操作，请慎重考虑~</span>
                </div>
            ),
            footer: '终止是不可恢复操作,请慎重考虑',
            onOk: () => {
                this.handleDisableClickEvent(text, record, index, nextActive, modalTip)
            },
            onCancel: () => { },
        });
    }
    // 关闭更新
    handleDismissUpdateModal() {
        this.setState({
            updateModalVisible: false,
        }, () => {
            this.props.saleCenterResetDetailInfo();
            this.showNothing = this.showNothing.bind(this);
        });

    }

    componentDidMount() {
        const {
            fetchSpecialPromotionList,
        } = this.props;
        fetchSpecialPromotionList({
            data: {
                groupID: this.props.user.accountInfo.groupID,
                // _role:this.props.user.accountInfo.roleType,
                // _loginName:this.props.user.accountInfo.loginName,
                // _groupLoginName:this.props.user.accountInfo.groupLoginName,
                pageSize: this.state.pageSizes,
                pageNo: 1,
            },
            fail: (msg) => { message.success(msg) },
        });
        // 把groupID传给后台，后台执行自动终止
        this.props.updateExpiredActiveState({
            groupID: this.props.user.accountInfo.groupID,
        })
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        const parentDoms = ReactDOM.findDOMNode(this.layoutsContainer); // 获取父级的doms节点
        if (parentDoms !== null) { // 如果父级节点不是空将执行下列代码
            const parentHeight = parentDoms.offsetHeight; // 获取到父级的高度存到变量 parentHeight
            const contentrDoms = parentDoms.querySelectorAll('.layoutsContent'); // 从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if (undefined !== contentrDoms && contentrDoms.length > 0) { // 如果 contentrDoms 节点存在 并且length>0 时执行下列代码
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

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    // TODO: the following code may be not the best implementation of filter
    // The filter condition should not be save to redux, just save it to state temporarily.
    // Modify it in the future
    componentWillReceiveProps(nextProps) {
        if (this.props.user.activeTabKey !== nextProps.user.activeTabKey && nextProps.user.activeTabKey === "1000076003") {
            const tabArr = nextProps.user.tabList.map((tab) => tab.value);
            if (tabArr.includes("1000076003")) {
                this.handleQuery(this.state.pageNo); // tab里已有该tab，从别的tab切换回来，就自动查询，如果是新打开就不执行此刷新函数，而执行加载周期里的
            }
        }
        if (this.props.mySpecialActivities.get('$specialPromotionList') !== nextProps.mySpecialActivities.get('$specialPromotionList')) {
            const _promoitonList = nextProps.mySpecialActivities.get('$specialPromotionList').toJS();
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
                    if (_promoitonList.data) {
                        const _envIsVip = HUALALA.ENVIRONMENT === 'production-release';
                        // const data = _envIsVip ? _promoitonList.data.filter((activity) => {
                        //     // 隐藏1个卡片
                        //     return activity.eventWay != '63'
                        // }) : _promoitonList.data;
                        const data = _promoitonList.data;
                        this.setState({
                            loading: false,
                            dataSource: data.map((activity, index) => {
                                activity.index = index + 1;
                                activity.key = `${index}`;
                                activity.validDate = {
                                    start: activity.eventStartDate,
                                    end: activity.eventEndDate,
                                };
                                return activity;
                            }),
                            total: _promoitonList.total,
                        });
                    } else {
                        message.warning('暂无数据');
                        this.setState({
                            loading: false,
                            dataSource: [],
                            total: _promoitonList.total,
                        });
                    }
                    break;
            }
        }
        if (this.props.mySpecialActivities.get('$specialDetailInfo') !== nextProps.mySpecialActivities.get('$specialDetailInfo')) {
            this.setState({
                record: nextProps.mySpecialActivities.get('$specialDetailInfo').toJS(),
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(this.state, nextState)
}

    render() {
        return (
            <div style={{backgroundColor: '#F3F3F3'}} className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                {this.renderHeader()}
                <div style={{backgroundColor: 'white', paddingBottom: '25px', borderRadius: '10px', margin: '0 20px'}}>
                    <div className="layoutsHeader">
                        {this.renderFilterBar()}
                        <div style={{ margin: '0'}} className="layoutsLine"></div>
                    </div>
                    {this.renderTables()}
                </div>
                {this.renderModals()}
                {this.renderUpdateModals()}
            </div>
        );
    }
    // 查询
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

        const {
            eventWay,
            promotionDateRange,
            isActive,
            eventName,
        } = this.state;

        const opt = {};
        if (eventWay !== '' && eventWay !== undefined) {
            opt.eventWay = eventWay;
        }

        if (promotionDateRange !== '' && promotionDateRange.length !== 0) {
            opt.eventStartDate = promotionDateRange[0].format('YYYYMMDD');
            opt.eventEndDate = promotionDateRange[1].format('YYYYMMDD');
        }

        if (eventName !== '' && eventName !== undefined) {
            opt.eventName = eventName;
        }

        if (isActive !== '') {
            opt.isActive = isActive == '-1' ? '-1' : (isActive == '1' ? '1' : '0');
        }

        this.props.query({
            data: {
                groupID: this.props.user.accountInfo.groupID,
                pageSize: this.state.pageSizes,
                pageNo,
                ...opt,
            },
            fail: (msg) => { message.error(msg) },
        });
    }

    showNothing(data) {
        if (data === undefined) {
            setTimeout(() => {
                this.setState({
                    loading: false,
                });
                message.error('没有查到相应数据');
            });
        }
    }

    renderHeader() {
        const headerClasses = `layoutsToolLeft ${styles.headerWithBgColor}`;
        return (
            <div className="layoutsTool" style={{height: '80px'}}>
                <div className={headerClasses} style={{lineHeight: '80px'}}>
                    <span style={{lineHeight: '80px'}} className={styles.customHeader}>特色营销信息</span>
                    <Button
                        type="ghost"
                        icon="plus"
                        className={styles.jumpToCreate}
                        onClick={
                            () => {
                                const menuID = this.props.user.menuList.find(tab => tab.entryCode === '1000076004').menuID
                                jumpPage({ menuID })
                            }
                        }
                    >新建</Button>
                </div>
            </div>
        );
    }
    // date qualification
    onDateQualificationChange(value) {
        this.setState({
            promotionDateRange: value,
        });
    }

    renderFilterBar() {
        const opts = [];
        Cfg.eventWay.forEach((item, index) => {
            opts.push(
                <Option value={`${item.value}`} key={`${index}`}>{item.label}</Option>
            );
        });
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
                                style={{ width: 160 }}
                                showSearch={true}
                                placeholder="请选择活动类型"
                                defaultValue="全部"
                                onChange={(value) => {
                                    this.setState({
                                        eventWay: value === 'ALL' ? null : value,
                                    });
                                }}
                            >
                                {opts}
                            </Select>
                        </li>

                        <li>
                            <h5>使用状态</h5>
                        </li>
                        <li>
                            <Select
                                style={{ width: 160 }}
                                defaultValue=""
                                placeholder="请选择使用状态"
                                onChange={(value) => {
                                    this.setState({
                                        isActive: value,
                                    });
                                }}
                            >
                                <Option value={''}>不限</Option>
                                <Option value={'1'}>已启用</Option>
                                <Option value={'0'}>已禁用</Option>
                                <Option value={'-1'}>已终止</Option>
                            </Select>
                        </li>

                        <li>
                            <h5>活动名称</h5>
                        </li>
                        <li>
                            <Input
                                placeholder="请输入活动名称"
                                onChange={(e) => {
                                    this.setState({
                                        eventName: e.target.value,
                                    });
                                }}
                            />
                        </li>

                        <li>
                            <Authority rightCode="marketing.teseyingxiaoxin.query">
                                <Button type="primary" onClick={this.handleQuery} disabled={this.state.queryDisabled}><Icon type="search" />查询</Button>
                            </Authority>
                        </li>

                    </ul>
                </div>
            </div>

        );
    }
    // 切换每页显示条数
    onShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSizes: pageSize,
        })
    };
    changeSortOrder(record, direction) {
        const params = {itemID: record.itemID, rankingType: direction};
        axiosData('/specialPromotion/updateEventRanking.ajax', params, {needThrow: true}, {path: undefined}, 'HTTP_SERVICE_URL_PROMOTION_NEW').then(() => {
            if (this.tableRef &&  this.tableRef.props && this.tableRef.props.pagination && this.tableRef.props.pagination.onChange) {
                this.tableRef.props.pagination.onChange(this.tableRef.props.pagination.current, this.tableRef.props.pagination.pageSize);
            }
        }).catch(err => {
            message.warning(err || 'sorry, 排序功能故障, 请稍后再试!');
        })
    }

    renderTables() {
        const SmsSendStatus = [
            { value: '0', label: '定义中' },
            { value: '1', label: '待开始' },
            { value: '2', label: '数据准备' },
            { value: '3', label: '发送完毕' },
            { value: '4', label: '发送失败' },
            { value: '5', label: '待审核' },
            { value: '8', label: '发送中' },
            { value: '9', label: '数据准备' },
            { value: '20', label: '数据准备' },
            { value: '21', label: '审核未通过' },
            { value: '30', label: '发送中' },
            { value: '6', label: '审核通过' },
        ];
        const SmsSettleStatus = [
            { value: '0', label: '不需要结算' },
            { value: '1', label: '待结算' },
            { value: '2', label: '结算完成' },
            { value: '3', label: '结算失败' },
        ];
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 60,
                // fixed:'left',
                key: 'key',
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSizes + text;
                },
            },

            {
                title: '操作',
                key: 'operation',
                width: 250,
                // fixed:'left',
                render: (text, record, index) => {
                    const statusState = !!((record.eventWay == '50' || record.eventWay == '53') && (record.status != '0' && record.status != '1' && record.status != '5' && record.status != '21'));
                    // let statusState = (record.eventWay =='50' || record.eventWay =='53') && (record.status !='1'&&record.status !='5') ? true : false;
                    // console.log(index,`${statusState}`);
                    const buttonText = (record.isActive == '1' ? '禁用' : '启用');
                    return (<span>
                        <a
                            href="#"
                            className={record.isActive == '-1' || statusState ? styles.textDisabled : null}
                            onClick={() => {
                                if (Number(record.eventWay) === 70) {
                                    message.warning('该活动已下线');
                                    return;
                                }
                                if (Number(record.eventWay) === 31) {
                                    message.warning('活动将于近期上线, 敬请期待~');
                                    return;
                                }
                                record.isActive == '-1' || statusState ? null :
                                    this.handleDisableClickEvent(text, record, index, null, '使用状态修改成功');
                            }}
                        >
                            {buttonText}</a>
                        <Authority rightCode="marketing.teseyingxiaoxin.update">
                            <a
                                href="#"
                                className={record.isActive != '0' || statusState ? styles.textDisabled : null}
                                onClick={(e) => {
                                    if (record.isActive != '0' || statusState) {
                                        e.preventDefault()
                                    } else {
                                        if (Number(record.eventWay) === 70) {
                                            message.warning('该活动已下线');
                                            return;
                                        }
                                        if (Number(record.eventWay) === 31) {
                                            message.warning('活动将于近期上线, 敬请期待~');
                                            return;
                                        }
                                        this.props.toggleIsUpdate(true)
                                        this.handleUpdateOpe(text, record, index);
                                    }
                                }}
                            >
                                编辑</a>
                        </Authority>
                        <a
                            href="#"
                            onClick={() => {
                                if (Number(record.eventWay) === 70) {
                                    message.warning('该活动已下线');
                                    return;
                                }
                                this.props.toggleIsUpdate(false)
                                this.handleUpdateOpe(text, record, index);
                            }}
                        >
                            查看</a>
                        <Authority rightCode="marketing.teseyingxiaoxin.delete">
                            <a
                                href="#"
                                className={record.isActive != '0' || record.userCount != 0 || statusState ? styles.textDisabled : null}
                                onClick={() => {
                                    if (Number(record.eventWay) === 70) {
                                        message.warning('该活动已下线');
                                        return;
                                    }
                                    record.isActive != '0' || record.userCount != 0 || statusState ? null :
                                        this.checkDeleteInfo(text, record, index);
                                }}
                            >
                                删除</a>
                        </Authority>
                        <a
                            href="#"
                            className={record.isActive == '-1' || statusState ? styles.textDisabled : null}
                            onClick={() => {
                                if (Number(record.eventWay) === 70) {
                                    message.warning('该活动已下线');
                                    return;
                                }
                                record.isActive == '-1' || statusState ? null :
                                    this.handelStopEvent(text, record, index, '-1', '活动终止成功');
                            }}
                        >
                            终止</a>
                        <Authority rightCode="marketing.chakanteseyingxiaoxin.query">
                            <a
                                href="#"
                                onClick={() => {
                                    if (Number(record.eventWay) === 70) {
                                        message.warning('该活动已下线');
                                        return;
                                    }
                                    this.checkDetailInfo(text, record, index);
                                }}
                            >
                                活动跟踪</a>
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
                dataIndex: 'eventWay',
                key: 'eventWay',
                width: 100,
                // fixed:'left',
                render: (text, record) => {
                    return <span>{record.eventWay == 70 ? '彩蛋猫送礼' : mapValueToLabel(Cfg.eventWay, String(record.eventWay))}</span>
                },
            },

            {
                title: '活动名称',
                dataIndex: 'eventName',
                key: 'eventName',
                // fixed:'left',
                width: 200,
                render: text => <span title={text}>{text}</span>,
            },
            // {
            //     title: '参与人数',
            //     className: 'TableTxtRight',
            //     dataIndex: 'userCount',
            //     key: 'userCount',
            //     width: 100,
            // },
            {
                title: '短信发送/结算状态',
                className: 'TableTxtCenter',
                dataIndex: 'status',
                key: 'msgStatus',
                width: 150,
                render: (text, record) => {
                    if (record.eventWay === 50 || record.eventWay === 51 || record.eventWay === 52 || record.eventWay === 53
                        || record.eventWay === 61 || record.eventWay === 62 || record.eventWay === 63|| record.eventWay === 70) {
                        let _SmsSendStatus = '';
                        SmsSendStatus.map((status) => {
                            if (status.value == record.status) {
                                _SmsSendStatus = status.label;
                            }
                        });
                        let _SmsSettleStatus = '';
                        SmsSettleStatus.map((status) => {
                            if (status.value == record.settleStatus) {
                                _SmsSettleStatus = status.label;
                            }
                        });
                        return `${_SmsSendStatus}/${_SmsSettleStatus}`;
                    }
                },
            },
            {
                title: '有效时间',
                className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 200,
                render: (validDate) => {
                    if (validDate.start === '0' || validDate.end === '0' ||
                        validDate.start === '20000101' || validDate.end === '29991231') {
                        return '不限制';
                    }
                    return `${moment(validDate.start, 'YYYY/MM/DD').format('YYYY/MM/DD')} - ${moment(validDate.end, 'YYYY/MM/DD').format('YYYY/MM/DD')}`;
                },
            },
            {
                title: '创建时间/修改时间',
                className: 'TableTxtCenter',
                dataIndex: 'operateTime',
                key: 'operateTime',
                width: 300,
                render: (text, record, index) => {
                    if (record.actionStamp === '' && record.createStamp === '') {
                        return '--';
                    }
                    return `${moment(new Date(parseInt(record.createStamp))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionStamp))).format('YYYY-MM-DD HH:mm:ss')}`;
                },
            },
            {
                title: '创建人/修改人',
                dataIndex: 'operator',
                width: 120,
                key: 'operator',
                render: (text, record, index) => {
                    if (record.operator === '') {
                        return '--';
                    }
                    return `${JSON.parse(record.operator).userName} / ${JSON.parse(record.operator).u_userName || JSON.parse(record.operator).userName}`;
                },
            },
            {
                title: '使用状态',
                dataIndex: 'isActive',
                key: 'isActive',
                width: 100,
                render: (isActive) => {
                    return isActive == '-1' ? '已终止' : isActive == '1' ? '已启用' : '已禁用';
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
                        total: this.state.total || 0,
                        showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                        onChange: (page, pageSize) => {
                            this.setState({
                                pageNo: page,
                            });
                            const opt = {
                                pageSize,
                                pageNo: page,
                            };
                            const {
                                eventWay,
                                promotionDateRange,
                                isActive,
                                eventName,
                            } = this.state;

                            if (eventWay !== '' && eventWay !== undefined) {
                                opt.eventWay = eventWay;
                            }

                            if (promotionDateRange !== '' && promotionDateRange.length !== 0) {
                                opt.eventStartDate = promotionDateRange[0].format('YYYYMMDD');
                                opt.eventEndDate = promotionDateRange[1].format('YYYYMMDD');
                            }

                            if (eventName !== '' && eventName !== undefined) {
                                opt.eventName = eventName;
                            }

                            if (isActive !== '') {
                                opt.isActive = isActive == '-1' ? '-1' : isActive == '1' ? '1' : '0';
                            }
                            this.props.query({
                                data: {
                                    groupID: this.props.user.accountInfo.groupID,
                                    ...opt,
                                },
                                // start: () => this.setState({loading: true}),
                                // end: () => this.setState({loading: false}),
                                fail: (msg) => message.error(msg),
                            });
                        },
                    }}
                />
            </div>
        );
    }
    // 删除
    checkDeleteInfo(text, record) {
        confirm({
            title: '删除特色营销活动',
            content: (
                <div>
                    您将删除
                    【<span>{record.eventName}</span>】
                    <br />
                    <span>删除是不可恢复操作，请慎重考虑~</span>
                </div>
            ),
            footer: '删除数据时不可恢复操作,请慎重考虑',
            onOk: () => {
                this.props.deleteSelectedRecord({
                    ...record,
                    success: () => {
                        message.success('删除成功');
                    },
                    fail: (msg) => {
                        message.error(msg);
                    },
                });
            },
            onCancel: () => { },
        });
    }
    successFn = (response) => {
        const _serverToRedux = false;
        const _promotionIdx = getSpecialPromotionIdx(`${this.state.editEventWay}`);
        if (_promotionIdx === undefined) {
            message.warning('出错了, 请刷新重试');
            return;
        }
        if (response === undefined || response.data === undefined) {
            message.error('没有查询到相应数据');
            return null;
        }
        this.props.saleCenterSetSpecialBasicInfo(specialPromotionBasicDataAdapter(response, _serverToRedux));
        this.setState({
            modalTitle: '更新活动信息',
            isNew: false,
            index: _promotionIdx,
        });
    };

    failFn = () => {
        message.error('啊哦,好像出了点问题~');
    };


    // 编辑
    handleUpdateOpe() {
        let _record = arguments[1];
        const user = this.props.user;
        this.props.fetchSpecialDetail({
            data: {
                itemID: _record ? _record.itemID : this.state.currentItemID, // 点击重试时record为undefiend
                groupID: user.accountInfo.groupID,
            },
            success: this.successFn,
            fail: this.failFn,
        });
        if (_record) {
            this.setState({
                updateModalVisible: true,
                editEventWay: _record.eventWay,
                currentItemID: _record.itemID ? _record.itemID : this.state.currentItemID,
            });
        }
    }
    /**
     * Render promotion update Modal
     * wrapped normally.
     * @param {Bool} isNew A bool value identify the current operation is update or create.
     */

    renderUpdateModals() {
        return (
            <Modal
                wrapClassName={'progressBarModal'}
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width="924px"
                height="569px"
                maskClosable={false}
                onCancel={this.handleDismissUpdateModal}
            >
                {this.renderContentOfThisModal()}
            </Modal>
        );
    }

    renderContentOfThisModal() {
        const mySpecialActivities = this.props.mySpecialActivities.get('$specialDetailInfo').toJS();
        const _state = this.state;
        if (mySpecialActivities.status === 'start' || mySpecialActivities.status === 'pending') {
            return (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>
            )
        }
        if (mySpecialActivities.status === 'timeout' || mySpecialActivities.status === 'fail') {
            return (
                <div className={styles.spinFather}>
                    查询详情出错!点击 <a onClick={this.handleUpdateOpe}>重试</a>
                </div>
            );
        }

        if (mySpecialActivities.status === 'success') {
            return (<ActivityMain
                isNew={_state.isNew}
                index={_state.index}
                callbackthree={(arg) => {
                    if (arg == 3) {
                        this.handleDismissUpdateModal();
                    }
                }}
            />);
        }
    }

    // Row Actions: 查看
    checkDetailInfo() {
        const _record = arguments[1];
        const user = this.props.user;
        this.props.fetchSpecialPromotionDetail({
            data: {
                itemID: _record && _record.itemID ? _record.itemID : this.state.currentItemID,
                groupID: user.accountInfo.groupID,
            },
            fail: this.failFn,
        });
        this.setState({
            visible: true,
            currentItemID: _record && _record.itemID ? _record.itemID : this.state.currentItemID,
        });
    }
    // 关闭详情页
    handleClose() {
        this.setState({
            visible: false,
        })
    }
    // 活动详情页
    renderModals() {
        const mySpecialActivities = this.props.mySpecialActivities.get('$specialDetailInfo').toJS();
        const checkDetailInfo = this.checkDetailInfo;
        let renderContentOfTheModal;
        if (mySpecialActivities.status === 'start' || mySpecialActivities.status === 'pending') {
            renderContentOfTheModal = (
                <div className={styles.spinFather}>
                    <Spin size="large" />
                </div>)
        }
        if (mySpecialActivities.status === 'timeout' || mySpecialActivities.status === 'fail') {
            renderContentOfTheModal = (
                <div className={styles.spinFather}>
                    查询详情出错!点击 <a onClick={checkDetailInfo}>重试</a>
                </div>
            );
        }
        if (mySpecialActivities.status === 'success') {
            renderContentOfTheModal = (<SpecialPromotionDetail record={mySpecialActivities.data} />);
        }

        return (
            <Modal
                title="活动详情"
                visible={this.state.visible}
                footer={<Button onClick={this.handleClose}>关闭</Button>}
                closable={false}
                width="750px"
            >
                {renderContentOfTheModal}
            </Modal>
        );
    }
}


function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label');
}
export default MySpecialActivities;
