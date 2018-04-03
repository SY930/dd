import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Row, Col, Table, Button, Icon, Modal, message } from 'antd';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { fetchData, axiosData } from '../../../helpers/util';
import GiftCfg from '../../../constants/Gift';
import BaseForm from '../../../components/common/BaseForm';
import Authority from '../../../components/common/Authority';
import styles from './GiftInfo.less';
import GiftDetailModal from './GiftDetailModal';
import QuatoCardDetailModal from './QuatoCardDetailModal';
import GiftAddModal from '../GiftAdd/GiftAddModal';
import GiftAddModalStep from '../GiftAdd/GiftAddModalStep';
import ExportModal from './ExportModal';
import { COLUMNS } from './_tableListConfig';
import {
    FetchGiftList,
    FetchSendorUsedList,
    UpdateBatchNO,
    UpdateDetailModalVisible,
    FetchSharedGifts,
    emptyGetSharedGifts,
    queryCouponShopList,
    queryWechatMpInfo,
} from '../_action';
import {
    toggleIsUpdateAC,
} from '../../../redux/actions/saleCenterNEW/myActivities.action';
import { fetchAllPromotionListAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const format = 'YYYY/MM/DD HH:mm:ss';
class GiftDetailTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleDetail: false,
            visibleEdit: false,
            data: {},
            dataSource: [],
            editGift: { describe: '', value: '' },
            loading: true,
            queryParams: {
                pageNo: 1,
                pageSize: 10,
            },
            // total为数据总数。并不是页数。
            total: 2,
            tableHeight: '100%',
            contentHeight: '100%',
            usedTotalSize: 0,
        },
            this.queryFrom = null;
        this.columns = COLUMNS;
    }

    componentDidMount() {
        const { FetchGiftList } = this.props;
        FetchGiftList({
            pageNo: 1,
            pageSize: 10,
        }).then((data = []) => {
            this.proGiftData(data);
        });
        this.props.queryWechatMpInfo();
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user.activeTabKey !== nextProps.user.activeTabKey && nextProps.user.activeTabKey === "1000076005") {
            const tabArr = nextProps.user.tabList.map((tab) => tab.value);
            if (tabArr.includes("1000076005")) {
                this.handleQuery(this.state.queryParams.pageNo); // tab里已有该tab，从别的tab切换回来，就自动查询，如果是新打开就不执行此刷新函数，而执行加载周期里的
            }
        }
        this.queryFrom && this.queryFrom.resetFields();
        const { dataSource } = nextProps;
        const data = dataSource.toJS();
        if (this.state.dataSource !== data) {
            this.proGiftData(data);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
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
                layoutsContent.style.height = `${parentHeight - headerHeight - 15 - 20}px`; // layoutsContent 的高度，等于父节点的高度-头部-横线-padding值
                this.setState({
                    contentHeight: parentHeight - headerHeight - 15,
                    tableHeight: layoutsContent.offsetHeight - 120,
                })
            }
        }
    }
    proGiftData = (data) => {
        const _total = data.totalSize;
        const _pageSize = data.pageSize;
        const _pageNo = data.pageNo;
        const gifts = data.crmGiftList;
        if (gifts === undefined) {
            this.setState({ dataSource: [], total: _total });
            return;
        }
        const newDataSource = (gifts || []).map((g, i) => {
            g.key = i + 1;
            g.giftType = String(g.giftType);
            g.giftTypeName = _.find(GiftCfg.giftTypeName, { value: String(g.giftType) }) ? _.find(GiftCfg.giftTypeName, { value: String(g.giftType) }).label : '未定义';
            g.createTime = g.createStamp == 0 ? '--' : g.createStamp.split('.')[0];
            g.actionTime = g.actionStamp == 0 ? '--' : g.actionStamp.split('.')[0];
            g.operateTime = <div>{g.createTime}<br />{g.actionTime}</div>;
            g.createBy = g.createBy == undefined ? '--' : g.createBy;
            g.modifyBy = g.modifyBy == undefined ? '--' : g.modifyBy;
            g.operator = `${g.createBy} / ${g.modifyBy}`;
            g.giftRule = g.giftRule.split('</br>');
            g.num = i + 1 + (_pageSize * (_pageNo - 1));
            g.usingTimeType = g.usingTimeType.split(',');
            g.supportOrderTypes = g.supportOrderTypes ? g.supportOrderTypes.split(',') : [];
            g.shopNames = g.shopNames === undefined ? '不限' : g.shopNames;
            return g;
        });
        this.setState({ dataSource: [...newDataSource], total: _total });
    }

    handleFormChange(key, value) {

    }

    handleQuery(thisPageNo) {
        const pageNo = isNaN(thisPageNo) ? 1 : thisPageNo;
        const { queryParams } = this.state;
        const { FetchGiftList } = this.props;
        this.queryFrom.validateFieldsAndScroll((err, Values) => {
            if (err) return;
            const params = this.formatFormData(Values);
            this.setState({
                queryParams: { pageNo, pageSize: queryParams.pageSize || 1, ...params },
            })
            FetchGiftList({
                pageNo,
                pageSize: queryParams.pageSize || 1,
                ...params,
            }).then((data = []) => {
                this.proGiftData(data);
            });
        });
    }

    formatFormData = (params) => {
        return _.mapValues(params, (value, key) => {
            switch (key) {
                default:
                    return value !== undefined ? value : '';
            }
        })
    }

    handleCancel() {
        this.reLoading().then(() => {
            this.setState({ visibleDetail: false, visibleEdit: false });
        });
        const { UpdateBatchNO, UpdateDetailModalVisible } = this.props;
        UpdateBatchNO({
            batchNO_madeCard: '',
        });
        UpdateDetailModalVisible({
            visible: false,
        });
        this.props.emptyGetSharedGifts();
    }

    reLoading() {
        return new Promise((resolve, reject) => {
            resolve();
            return new Promise((resolve, reject) => {
                resolve();
            });
        });
    }

    handleEdit(rec) {
        let gift = _.find(GiftCfg.giftType, { name: rec.giftTypeName });
        const selectShops = [];
        gift = _.cloneDeep(gift);
        gift.data = { ...rec }; // 此处将原引用GiftCfg改变了，导致在新建活动的时候，有data等属性，表单里会有此处留下的值
        gift.data.shopNames = gift.data.shopNames === '不限' ? [] : gift.data.shopNames.split(',');
        gift.data.shopIDs = gift.data.shopIDs === undefined ? [] : gift.data.shopIDs.split(',');
        gift.data.shopNames.map((shop, idx) => {
            selectShops.push({
                content: shop,
                id: String(gift.data.shopIDs[idx]),
            })
        });
        gift.data.shopNames = [...selectShops];
        gift.data.isOfflineCanUsing = gift.data.isOfflineCanUsing === undefined ? '' : String(gift.data.isOfflineCanUsing);
        gift.data.isHolidaysUsing = gift.data.isHolidaysUsing === undefined ? '' : String(gift.data.isHolidaysUsing);
        gift.data.supportOrderType = gift.data.supportOrderType === undefined ? '' : String(gift.data.supportOrderType);
        gift.data.shareType = gift.data.shareType === undefined ? '' : String(gift.data.shareType);
        gift.data.moneyLimitType = gift.data.moneyLimitType === undefined ? '' : String(gift.data.moneyLimitType);
        gift.data.isFoodCatNameList = gift.data.isFoodCatNameList === undefined ? '' : String(gift.data.isFoodCatNameList);
        this.setState({ visibleEdit: true, editGift: gift });
        const { FetchSharedGifts, queryCouponShopList } = this.props;
        FetchSharedGifts({ giftItemID: rec.giftItemID });
        // 请求获取promotionList--券活动
        gift.value == 100 ? this.props.fetchAllPromotionList({
            groupID: this.props.user.accountInfo.groupID,
        }) : null;
    }

    handleDelete(rec) {
        const { giftItemID, giftName } = rec;
        Modal.confirm({
            title: '您确定要删除吗？',
            content: (
                <div>
                    {`您将删除礼品
                        【${giftName}】`}
                    <br />
                    <span>删除是不可恢复操作，请慎重考虑~</span>
                </div>
            ),
            onOk: () => {
                axiosData('/coupon/couponService_removeBoard.ajax', { giftItemID }, null, { path: '' }).then((data) => {
                    if (data.code === '000') {
                        message.success('此礼品删除成功');
                        const { queryParams } = this.state;
                        const { FetchGiftList } = this.props;
                        FetchGiftList(queryParams).then((data = []) => {
                            this.proGiftData(data);
                        });
                    }
                });
            },
            onCancel: () => {
            },
        })
    }

    handleMore(rec) {
        this.setState({ visibleDetail: true, data: { ...rec } });
        const { UpdateDetailModalVisible } = this.props;
        UpdateDetailModalVisible({ visible: true });
        const { FetchSendorUsedList } = this.props;
        const { giftType, giftItemID } = rec;
        if (giftType !== '90') {
            FetchSendorUsedList({ params: { pageNo: 1, pageSize: 10, giftItemID } })
                .then((records) => {
                    this.setState({ sendTotalSize: records.totalSize })
                });
            const opts = { pageNo: 1, pageSize: 10, giftItemID }
            if (giftType === '91') { // 线上礼品卡
                opts.WXgiftCardStatus = '1'
            } else {
                opts.giftStatus = '2'
            }
            axiosData('/coupon/couponService_queryCouponUsageInfo.ajax', opts, null, {
                path: 'data',
            })
                .then((records) => {
                    this.setState({ usedTotalSize: records.totalSize })
                });
        }
    }

    handleOperate(rec) {
        return (
            <span>
                <Authority rightCode="marketing.lipinxin.update">
                    <a
                        href="javaScript:;"
                        onClick={() => {
                            this.handleEdit(rec)
                        }
                        }
                    >编辑</a>
                </Authority>
                {rec.sendTotalCount > 0 ?
                    <a disabled={true}><span>删除</span></a>
                    :
                    <Authority rightCode="marketing.lipinxin.delete">
                        <a onClick={() => this.handleDelete(rec)}><span>删除</span></a>
                    </Authority>
                }
                <Authority rightCode="marketing.chakanlipinxin.query">
                    <a href="javaScript:;" onClick={() => this.handleMore(rec)}>详情</a>
                </Authority>
            </span>
        )
    }

    handlePageChange = (pageNo, pageSize) => {
        const { queryParams } = this.state;
        const { FetchGiftList } = this.props;
        FetchGiftList({
            ...queryParams,
            pageNo,
            pageSize,
        }).then((data = []) => {
            this.proGiftData(data);
        });
        this.setState({
            queryParams: { ...queryParams, pageNo, pageSize },
        });
    }

    render() {
        const { visibleDetail, visibleEdit, editGift, data, queryParams } = this.state;
        const { pageNo, pageSize } = queryParams;
        const editProps = {
            type: 'edit',
            visible: visibleEdit,
            gift: editGift,
            onCancel: () => this.handleCancel(),
        };
        const detailProps = {
            data,
            visible: visibleDetail,
            onCancel: () => this.handleCancel(),
        };
        const GiftEdit = (v) => {
            switch (v) {
                case '10':
                case '20':
                case '80':
                case '100':
                case '91':
                case '110':
                case '111':
                    return visibleEdit ? <GiftAddModalStep {...editProps} /> : null;
                case '30':
                case '40':
                case '42':
                case '90':
                    return visibleEdit ? <GiftAddModal {...editProps} /> : null;
                default:
                    return null;
            }
        };
        const GiftDetail = (v) => {
            switch (v) {
                case '10':
                case '20':
                case '80':
                case '30':
                case '40':
                case '42':
                case '91':
                case '100':
                case '110':
                case '111':
                    return (<GiftDetailModal
                        {...detailProps}
                        usedTotalSize={this.state.usedTotalSize || 0}
                        sendTotalSize={this.state.sendTotalSize || 0}
                    />);
                case '90':
                    return <QuatoCardDetailModal {...detailProps} />;
                default:
                    return null;
            }
        };
        const formItems = {
            giftName: {
                label: '礼品名称',
                type: 'text',
                placeholder: '请输入礼品名称',
            },
            giftType: {
                label: '礼品类型',
                type: 'combo',
                defaultValue: '',
                options: GiftCfg.giftTypeName,
                props: {
                    showSearch: true,
                },
            },
        };
        const formKeys = ['giftName', 'giftType'];
        return (
            <Row className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <Col className="layoutsHeader">
                    <Row className="layoutsTool">
                        <div className="layoutsToolLeft">
                            <h1>礼品信息</h1>
                        </div>
                        <Col span={22} style={{ textAlign: 'right' }}>
                            {/* <Authority rightCode="marketing.lipinxinxixin.query"> */}
                            <Button
                                type="ghost"
                                onClick={() => this.setState({ exportVisible: true })}
                            ><Icon type="export" />导出历史</Button>
                            {/* </Authority> */}
                        </Col>
                    </Row>
                    <Row className="layoutsLine"></Row>
                    <Row className="layoutsSearch">
                        <ul>
                            <li className={styles.formWidth}>
                                <BaseForm
                                    getForm={form => this.queryFrom = form}
                                    formItems={formItems}
                                    formKeys={formKeys}
                                    formData={queryParams}
                                    layout="inline"
                                    onChange={(key, value) => this.handleFormChange(key, value)}
                                />
                            </li>
                            <li>
                                <Authority rightCode="marketing.lipinxinxixin.query">
                                    <Button type="primary" onClick={() => this.handleQuery()}>
                                        <Icon type="search" />
                                        查询
                                    </Button>
                                </Authority>
                            </li>
                        </ul>
                    </Row>
                </Col>
                <Col className="layoutsLineBlock"></Col>
                <Col className={[styles.giftTable, ' layoutsContent tableClass '].join(' ')} style={{ height: this.state.contentHeight }}>
                    <Table
                        bordered={true}
                        columns={this.columns.map(c => (c.render ? ({
                            ...c,
                            render: c.render.bind(this),
                        }) : c))}
                        dataSource={this.state.dataSource}
                        pagination={{
                            showSizeChanger: true,
                            pageSize,
                            current: pageNo,
                            total: this.state.total,
                            showQuickJumper: true,
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.handlePageChange,
                            showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
                        }}
                        loading={this.props.loading}
                        scroll={{ x: 1600, y: this.state.tableHeight }}
                    />
                </Col>
                <Col>
                    {GiftDetail(data.giftType)}
                </Col>
                <Col>
                    {GiftEdit(editGift.value)}
                </Col>
                {
                    !this.state.exportVisible ? null :
                        <ExportModal
                            handleClose={() => this.setState({ exportVisible: false })}
                        />
                }
            </Row>
        )
    }
}

function mapStateToProps(state) {
    return {
        dataSource: state.sale_giftInfoNew.get('dataSource'),
        loading: state.sale_giftInfoNew.get('loading'),
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
        FetchSendorUsedList: opts => dispatch(FetchSendorUsedList(opts)),
        UpdateBatchNO: opts => dispatch(UpdateBatchNO(opts)),
        UpdateDetailModalVisible: opts => dispatch(UpdateDetailModalVisible(opts)),
        FetchSharedGifts: opts => dispatch(FetchSharedGifts(opts)),
        emptyGetSharedGifts: opts => dispatch(emptyGetSharedGifts(opts)),
        toggleIsUpdate: (opts) => {
            dispatch(toggleIsUpdateAC(opts))
        },
        fetchAllPromotionList: (opts) => dispatch(fetchAllPromotionListAC(opts)),
        queryCouponShopList: (opts) => dispatch(queryCouponShopList(opts)),
        queryWechatMpInfo: () => dispatch(queryWechatMpInfo()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GiftDetailTable)
