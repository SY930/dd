import React from 'react';
import ReactDOM from 'react-dom';
import { jumpPage } from '@hualala/platform-base';
import { connect } from 'react-redux';
import {
    Table, Icon, Select, DatePicker,
    Button, Modal, Row, Col, message,
    Input,
} from 'antd';
import Authority from '../../components/common/Authority'
import { axiosData } from '../../helpers/util'
import registerPage from '../../../index';
import ActivityMain from './WeChatMaLLActivityMain';
import {WECHAT_MALL_CREATE, WECHAT_MALL_LIST} from '../../constants/entryCodes';
import {
    toggleIsUpdateAC,
} from '../../redux/actions/saleCenterNEW/myActivities.action';
import {
    WECHAT_MALL_ACTIVITIES,
} from '../../constants/promotionType';
import {
    getGoodsCategoryList,
    getGoodsList,
} from '../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import styles from '../SaleCenterNEW/ActivityPage.less';
import {throttle, isEqual, debounce} from 'lodash'
import { myActivities_NEW as sale_myActivities_NEW } from '../../redux/reducer/saleCenterNEW/myActivities.reducer';
import { promotionBasicInfo_NEW as sale_promotionBasicInfo_NEW } from '../../redux/reducer/saleCenterNEW/promotionBasicInfo.reducer';
import {BASIC_PROMOTION_QUERY} from "../../constants/authorityCodes";
const Option = Select.Option;
const { RangePicker } = DatePicker;
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
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        getGoodsCategoryList: (opts) => {
            dispatch(getGoodsCategoryList(opts))
        },
        getGoodsList: (opts) => {
            dispatch(getGoodsList(opts))
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
        this.handleQuery = debounce(this.handleQuery.bind(this), 500);
        this.showNothing = this.showNothing.bind(this);
    }

    componentDidMount() {
        this.handleQuery();
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    handleDisableClickEvent(record) { // toggle, 2 关闭 1开启 3终止, 2时点击启用status传1, 1时点击禁用status传2, 3时只能查看
        const isOngoing = Date.now() < moment(record.endTime, 'YYYYMMDDHHmm') && Date.now() > moment(record.startTime, 'YYYYMMDDHHmm');
        const status = record.status == 1 ? isOngoing ? 3 : 2 : 1;
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
            const parentHeight = parentDoms.getBoundingClientRect().height; // 获取到父级的高度存到变量 parentHeight
            const contentrDoms = parentDoms.querySelectorAll('.layoutsContent'); // 从父节点中获取 类名是 layoutsContent 的doms节点 存到变量 contentrDoms 中
            if (undefined != contentrDoms && contentrDoms.length > 0) { // 如果 contentrDoms 节点存在 并且length>0 时执行下列代码
                const layoutsContent = contentrDoms[0]; // 把获取到的 contentrDoms 节点存到 变量 layoutsContent 中
                const headerDoms = parentDoms.querySelectorAll('.layoutsHeader');
                const headerHeight = headerDoms[0].getBoundingClientRect().height;
                layoutsContent.style.height = `${parentHeight - headerHeight - 120}px`; // layoutsContent 的高度，等于父节点的高度-头部-横线-padding值
                this.setState({
                    contentHeight: parentHeight - headerHeight - 120,
                })
            }
        }
    }

    getParams = () => {
        const {
            promotionDateRange,
            promotionTags,
            promotionName,
            status,
        } = this.state;
        const opt = {
        };
        if (promotionDateRange !== '' && promotionDateRange !== undefined && promotionDateRange[0] !== undefined) {
            opt.appointedStartTime = promotionDateRange[0].format('YYYYMMDDHHmm');
            opt.appointedEndTime = promotionDateRange[1].format('YYYYMMDDHHmm');
        }
        if (promotionTags !== '' && promotionTags != '0') {
            opt.tag = promotionTags;
        }
        if (promotionName !== '' && promotionName !== undefined) {
            opt.name = promotionName;
        }
        if (status > 0) {
            opt.status = status
        }
        return opt
    }

    handleQuery(pageNo, pageSize) {
        if (!this.state.loading) {
            this.setState({
                loading: true,
            });
        }
        const _opt = this.getParams();
        const opt = {
            pageSize: pageSize || this.state.pageSizes,
            pageNo: pageNo || this.state.pageNo,
            ..._opt,
        };
        opt.cb = this.showNothing;
        this.queryEvents(opt);
    }

    queryEvents(opts) {
        const shopID = this.props.user.shopID;
        if (shopID == undefined || shopID === 'undefined' || !(shopID > 0)) {
            return;
        }
        const params = {...opts, shopID };

        axiosData('/promotion/extra/extraEventService_getExtraEvents.ajax', params, null, {path: 'data'})
            .then((data) => {
                this.setState({
                    loading: false,
                    dataSource: (data.extraEventList || []).map((item, index) => ({...item, index: index + 1})),
                    pageNo: data.page.pageNo || 1,
                    pageSizes: data.page.pageSize || 30,
                    total: data.page.totalSize || 0,
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
        console.log(value);
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
            loading: true
        }, () => {
            this.handleQuery(1, pageSize)
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
        const { selectedRecord } = this.state;
        const index = WECHAT_MALL_ACTIVITIES.findIndex(item => item.key === `${selectedRecord.extraEventType}`)
        if (index === -1) return null;
        return (
            <Modal
                wrapClassName="progressBarModal"
                title={this.state.modalTitle}
                visible={this.state.updateModalVisible}
                footer={false}
                width={1000}
                height="569px"
                maskClosable={false}
                onCancel={() => {
                    this.handleDismissUpdateModal();
                }}
            >
                <ActivityMain
                    index={index}
                    eventWay={`${selectedRecord.extraEventType}`}
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
            <div className="layoutsTool" style={{height: '79px'}}>
                <div className={headerClasses}>
                    <span className={styles.customHeader}>
                        商城活动信息
                        <Button
                            type="ghost"
                            icon="plus"
                            className={styles.jumpToCreate}
                            onClick={
                                () => {
                                    jumpPage({ menuID: WECHAT_MALL_CREATE })
                                }
                            }>新建</Button>
                    </span>
                </div>
            </div>
        );
    }

    renderFilterBar() {
        const opts = [];
        return (
            <div>
                <div className="layoutsSearch">
                    <ul>
                        <li>
                            <h5>活动时间</h5>
                        </li>
                        <li>
                            <RangePicker
                                style={{ width: 260 }}
                                showTime={{ format: 'HH:mm' }}
                                className={styles.ActivityDateDayleft}
                                format="YYYY-MM-DD HH:mm"
                                placeholder={['开始时间', '结束时间']}
                                onChange={this.onDateQualificationChange}
                            />
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
                                <Option value={'0'}>全部</Option>
                                <Option value={'1'}>启用</Option>
                                <Option value={'2'}>未启用</Option>
                                <Option value={'3'}>已终止</Option>
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
                                        promotionName: e.target.value,
                                    });
                                }}
                            />
                        </li>
                        <li>
                            <Authority rightCode={BASIC_PROMOTION_QUERY}>
                                <Button type="primary" onClick={this.handleQuery} disabled={this.state.loading}><Icon type="search" />查询</Button>
                            </Authority>
                        </li>
                    </ul>
                </div>
            </div>
        );
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
                    const isExpired = Date.now() > moment(record.endTime, 'YYYYMMDDHHmm');
                    const isOngoing = Date.now() < moment(record.endTime, 'YYYYMMDDHHmm') && Date.now() > moment(record.startTime, 'YYYYMMDDHHmm');
                    const buttonText = (record.status == 1 ? isOngoing ? '终止' : '禁用' : '启用');
                    const isGroupPro = record.maintenanceLevel == '0';
                    return (<span>
                        <a
                            href="#"
                            disabled={isExpired || record.status == 3}
                            onClick={isExpired || record.status == 3 ? null : () => {
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
                                disabled={isGroupPro || record.status == 1 || isExpired || record.status == 3}
                                onClick={isGroupPro || record.status == 1 || isExpired || record.status == 3 ? null : () => {
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
                title: '活动时间',
                className: 'TableTxtCenter',
                dataIndex: 'validDate',
                key: '',
                width: 200,
                render: (validDate, record) => {
                    return `${moment(record.startTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')} - ${moment(record.endTime, 'YYYYMMDDHHmm').format('YYYY-MM-DD HH:mm')}`;
                },
            },

            {
                title: '有效状态',
                dataIndex: 'status',
                key: 'valid',
                className: 'TableTxtCenter',
                width: 100,
                render: (status, record) => {
                    if (moment(record.endTime, 'YYYYMMDDHHmm') < Date.now()) {
                        return '已结束';
                    } else if (moment(record.startTime, 'YYYYMMDDHHmm') > Date.now()) {
                        return '未开始';
                    }
                    return '执行中'
                },
            },

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
                    return (status == 1 ? '已启用' : status == 3 ? '已终止' : '未启用');
                },
            },
        ];

        return (
            <div className={['layoutsContent', styles.tableClass].join(' ')} style={{ height: this.state.contentHeight }}>
                <Table
                    scroll={{ x: 1600, y: this.state.contentHeight - 108 }}
                    bordered={true}
                    columns={columns}
                    dataSource={this.state.dataSource}
                    loading={
                        {
                            delay: 500,
                            spinning: this.state.loading,
                        }
                    }
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
                                /*pageNo: page,*/
                                loading: true
                            }, () => {
                                this.handleQuery(page, this.state.pageSizes);
                            });
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
        const shopID = this.props.user.shopID;
        this.props.getGoodsList(shopID);
        this.props.getGoodsCategoryList(shopID);
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
                    <div className={styles.pageContentWrapper}>
                        <div style={{padding: 0}} className="layoutsHeader">
                            {this.renderFilterBar()}
                            <div style={{ margin: '0'}} className="layoutsLine"></div>
                        </div>
                        {this.renderTables()}
                    </div>
                </div>
                {this.state.selectedRecord && this.renderModifyRecordInfoModal(0)}
            </div>
        );
    }
}
export default WeChatMallPromotionList;

