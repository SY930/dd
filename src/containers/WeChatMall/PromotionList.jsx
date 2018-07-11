import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import {
    Table, Icon, Select, DatePicker,
    Button, Modal, Row, Col, message,
    Input,
    TreeSelect,
    Spin,
} from 'antd';
import { jumpPage } from '@hualala/platform-base'
import Authority from '../../components/common/Authority'
import { axiosData } from '../../helpers/util'
import registerPage from '../../../index';
import ActivityMain from './WeChatMaLLActivityMain';
import {Iconlist} from "../../components/basic/IconsFont/IconsFont";
import {WECHAT_MALL_CREATE, WECHAT_MALL_LIST} from '../../constants/entryCodes';
import {
    initializationOfMyActivities,
    toggleSelectedActivityStateAC,
    fetchPromotionList,
    toggleIsUpdateAC,
} from '../../redux/actions/saleCenterNEW/myActivities.action';
import {
    fetchPromotionCategoriesAC,
    fetchPromotionTagsAC,
    saleCenterResetBasicInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import {
    fetchPromotionScopeInfo,
    saleCenterResetScopeInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {
    saleCenterResetDetailInfoAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    fetchPromotionDetail,
    resetPromotionDetail,
    fetchPromotionDetailCancel,
} from '../../redux/actions/saleCenterNEW/promotion.action';
import {
    ACTIVITY_CATEGORIES,
    SALE_CENTER_ACTIVITY_ORDER_TYPE_LIST,
    getPromotionIdx,
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter,
    TRIPLE_STATE,
} from '../../redux/actions/saleCenterNEW/types';
import styles from '../SaleCenterNEW/ActivityPage.less';
import {throttle, isEqual} from 'lodash'
import { myActivities_NEW as sale_myActivities_NEW } from '../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from '../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer';
import Cfg from "../../constants/SpecialPromotionCfg";
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Immutable = require('immutable');
const moment = require('moment');

const mapStateToProps = (state) => {
    return {
        myActivities: state.sale_myActivities_NEW,
        promotionBasicInfo: state.sale_promotionBasicInfo_NEW,
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        // 查询标签
        fetchPromotionTags: (opts) => {
            dispatch(fetchPromotionTagsAC(opts));
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
@registerPage([WECHAT_MALL_LIST], {
    sale_myActivities_NEW,
    sale_promotionBasicInfo_NEW,
})
@connect(mapStateToProps, mapDispatchToProps)
export class WeChatMallPromotionList extends React.Component {
    constructor(props) {
        super(props);
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
            loading: false,
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
        this.handleClose = this.handleClose.bind(this);
        this.renderFilterBar = this.renderFilterBar.bind(this);
        this.handleDisableClickEvent = this.handleDisableClickEvent.bind(this);
        this.renderModifyRecordInfoModal = this.renderModifyRecordInfoModal.bind(this);
        this.onDateQualificationChange = this.onDateQualificationChange.bind(this);
        this.onTreeSelect = this.onTreeSelect.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
        this.showNothing = this.showNothing.bind(this);
        this.renderContentOfThisModal = this.renderContentOfThisModal.bind(this);
    }

    componentDidMount() {
        this.handleQuery();
        this.props.fetchPromotionTags({
            groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
            phraseType: 'TAG_NAME',
        });
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    handleDisableClickEvent(record) { // toggle, 2 关闭 1开启, 2时点击启用status传1, 1时点击禁用status传2
        const status = record.status == 1 ? 2 : 1;
        axiosData('/promotion/extra/extraEventService_toggleExtraEvent.ajax', {itemID: record.itemID, shopID: this.props.user.shopID, status}, null, {path: 'data.extraEventList'})
            .then(() => {
                message.success('使用状态修改成功');
                this.handleQuery(this.state.pageNo)
            }, err => {
                console.log(err);
            })
    }

    toggleStateCallBack() {
        message.success('使用状态修改成功');
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
            selectedRecord: null
        });
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
        if (this.props.user.activeTabKey !== nextProps.user.activeTabKey && nextProps.user.activeTabKey === WECHAT_MALL_LIST) {
            const tabArr = nextProps.user.tabList.map((tab) => tab.value);
            if (tabArr.includes(WECHAT_MALL_LIST)) {
                this.handleQuery(this.state.pageNo); // tab里已有该tab，从别的tab切换回来，就自动查询，如果是新打开就不执行此刷新函数，而执行加载周期里的
            }
        }
    }

    getParams = () => {
        const {

        } = this.state;
        const opt = {

        };

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
        const _opt = {}; // this.getParams();
        const opt = {
            pageSize: this.state.pageSizes,
            pageNo,
            ..._opt,
        };
        opt.cb = this.showNothing;
        this.queryEvents(opt);
    }

    queryEvents(opts) {
        const params = {...opts, shopID: this.props.user.shopID, };
        if (this.state.status > 0) {
            params.status = this.state.status
        }
        axiosData('/promotion/extra/extraEventService_getExtraEvents.ajax', params, null, {path: 'data.extraEventList'})
            .then((list = []) => {
                this.setState({
                    loading: false,
                    dataSource: list.map((item, index) => ({...item, index: index + 1})),
                });
            }, err => {
                this.setState({
                    loading: false,
                });
            })
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

    /**
     * Render promotion update Modal
     * wrapped normally.
     * @param {Bool} isNew A bool value identify the current operation is update or create.
     */

    renderContentOfThisModal() {
        return <div>123</div>;
    }

    renderModifyRecordInfoModal() {
        // TODO: remove the const 0, fixed with corresponding promotionType

        return (
        !!this.state.selectedRecord && <Modal
                wrapClassName="progressBarModal"
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width="924px"
                height="569px"
                maskClosable={false}
                onCancel={() => {
                    this.handleDismissUpdateModal();
                }}
            >
                <ActivityMain
                    index={0} // 暂时写死 以后有新活动再改 因为可能考虑重构
                    eventWay="7010" // 暂时写死 以后有新活动再改
                    isNew={true}
                    data={this.state.selectedRecord}
                    callbackthree={(arg) => {
                        if (arg == 3) {
                            this.handleDismissUpdateModal(false);
                            !!this.state.isUpdate && this.handleQuery(this.state.pageNo);
                        }
                    }}
                />
            </Modal>
        );
    }

    renderHeader() {
        const headerClasses = `layoutsToolLeft ${styles.headerWithBgColor}`;
        return (
            <div className="layoutsTool" style={{height: '80px'}}>
                <div className={headerClasses} style={{lineHeight: '80px'}}>
                    <span style={{lineHeight: '80px'}} className={styles.customHeader}>商城活动信息</span>
                    <Button
                        type="ghost"
                        icon="plus"
                        className={styles.jumpToCreate}
                        onClick={
                            () => {
                                jumpPage({ menuID: WECHAT_MALL_CREATE })
                            }
                        }>新建</Button>
                </div>
            </div>
        );
    }

    renderFilterBar() {
        const opts = [];
        Cfg.weChatMallEvents.forEach((item, index) => {
            opts.push(
                <Option value={`${item.value}`} key={`${index}`}>{item.label}</Option>
            );
        });
        return (
            <div>
                <div className="layoutsSearch">
                    <ul>
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
                                style={{ width: '160px' }}
                                defaultValue="0"
                                placeholder="请选择使用状态"
                                onChange={(value) => {
                                    this.setState({
                                        status: value,
                                    });
                                }}
                            >
                                <Option value={TRIPLE_STATE.ALL}>全部</Option>
                                <Option value={TRIPLE_STATE.OPTION1}>启用</Option>
                                <Option value={TRIPLE_STATE.OPTION2}>未启用</Option>
                            </Select>
                        </li>
                        {/*<li>
                            <h5>活动时间</h5>
                        </li>
                        <li>
                            <RangePicker style={{ width: 200 }} onChange={this.onDateQualificationChange} />
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
                        </li>*/}
                        <li>
                            <Authority rightCode="marketing.jichuyingxiaoxin.query">
                                <Button type="primary" onClick={this.handleQuery} disabled={this.state.queryDisabled}><Icon type="search" />查询</Button>
                            </Authority>
                        </li>
                    </ul>
                </div>
            </div>

        );
    }

    renderAdvancedFilter() {
        let tags = [];

        const $tags = this.props.promotionBasicInfo.getIn(['$tagList', 'data']);
        if (Immutable.List.isList($tags)) {
            tags = $tags.toJS();
        }

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
                className: 'TableTxtCenter',
                width: 140,
                // fixed: 'left',
                render: (text, record, index) => {
                    const buttonText = (record.status == 1 ? '禁用' : '启用');
                    const isGroupPro = record.maintenanceLevel == 'GROUP_LEVEL';
                    return (<span>
                        <a
                            href="#"
                            onClick={() => {
                                this.handleDisableClickEvent(text, record, index);
                            }}
                        >{buttonText}</a>
                            <a
                                href="#"
                                onClick={() => {
                                    this.handleEdit(record, false)
                                }}
                            >
                                查看
                            </a>
                            <a
                                href="#"
                                disabled={isGroupPro}
                                onClick={() => {
                                    this.handleEdit(record, true)
                                }}
                            >编辑</a>
                    </span>

                    );
                },
            },

            {
                title: '活动名称',
                dataIndex: 'name',
                key: 'name',
                className: 'TableTxtCenter',
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
                dataIndex: 'itemID',
                key: 'itemID',
                className: 'TableTxtCenter',
                width: 140,
                render: text => <span title={text}>{text}</span>,
            },

            {
                title: '有效时间',
                className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 180,
                render: (validDate, record) => {
                    return `${moment(record.startTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')} - ${moment(record.endTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')}`;
                },
            },

            /*{
                title: '有效状态',
                dataIndex: 'status',
                key: 'valid',
                className: 'TableTxtCenter',
                width: 72,
                render: (status) => {
                    return status == '1' ? '未开始' : status == '2' ? '执行中' : '已结束';
                },
            },*/

            {
                title: '创建人/修改人',
                dataIndex: '',
                key: 'createBy',
                className: 'TableTxtCenter',
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
                    if (record.createStamp == '0' && record.actionStamp == '0') {
                        return '--';
                    }
                    return `${moment(new Date(parseInt(record.createStamp))).format('YYYY-MM-DD HH:mm:ss')} / ${moment(new Date(parseInt(record.actionStamp || record.createStamp))).format('YYYY-MM-DD HH:mm:ss')}`;
                },
            },

            {
                title: '使用状态',
                dataIndex: 'status',
                className: 'TableTxtCenter',
                key: 'isActive',
                width: 100,
                render: (status) => { // 2 关闭 1开启
                    return (status == 1 ? '已启用' : '未启用');
                },
            },
        ];

        return (
            <div className="layoutsContent  tableClass" style={{ height: this.state.contentHeight }}>
                <Table
                    scroll={{ x: 1600, y: this.state.tableHeight }}
                    bordered={true}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    loading={
                        {
                            spinning: this.state.loading,
                            delay: 500
                        }
                    }
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
                                // ...this.getParams(),
                            };
                            this.queryEvents(opt);
                        },
                    }}
                />
            </div>
        );
    }

    /**
     *
     * @param record    被点击的活动
     * @param isUpdate  true 为编辑, false 为查看
     */
    handleEdit(record, isUpdate) {
        const opts = {
            _groupID: this.props.user.accountInfo.groupID,
            shopID: this.props.user.shopID,
        };
        this.props.fetchFoodCategoryInfo({ ...opts });
        this.props.fetchFoodMenuInfo({ ...opts });
        this.props.toggleIsUpdate(isUpdate);
        this.setState({
            selectedRecord: record,
            updateModalVisible: true,
            isUpdate
        });
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
                {this.renderModifyRecordInfoModal(0)}
            </div>
        );
    }
}
export default WeChatMallPromotionList;

