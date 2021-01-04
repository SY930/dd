import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Tabs, Col, Table, Button, Icon, Modal, message, Tooltip } from 'antd';
import ReactDOM from 'react-dom';
import { COMMON_LABEL } from 'i18n/common';
import _ from 'lodash';
import {throttle} from 'lodash';
import { axiosData, fetchData, isFilterShopType } from '../../../helpers/util';
import GiftCfg from '../../../constants/Gift';
import SelectBrands from '../components/SelectBrands'
import BaseForm from '../../../components/common/BaseForm';
import Authority from '../../../components/common/Authority';
import styles from './GiftInfo.less';
import styles2 from '../../SaleCenterNEW/ActivityPage.less';
import GiftDetailModal from './GiftDetailModal';
import RedPacketDetailModal from './RedPacketDetailModal';
import QuatoCardDetailModal from './QuatoCardDetailModal';
import GiftAddModal from '../GiftAdd/GiftAddModal';
import GiftAddModalStep from '../GiftAdd/GiftAddModalStep';
import ExportModal from './ExportModal';
import { COLUMNS } from './_tableListConfig';
import {
    FetchGiftList,
    UpdateBatchNO,
    UpdateDetailModalVisible,
    FetchSharedGifts,
    emptyGetSharedGifts,
    queryCouponShopList,
    queryWechatMpInfo, startEditGift,
    FetchGiftSchema,
} from '../_action';
import {
    toggleIsUpdateAC,
} from '../../../redux/actions/saleCenterNEW/myActivities.action';
import { fetchAllPromotionListAC } from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {Iconlist} from "../../../components/basic/IconsFont/IconsFont";
import CreateGiftsPanel from "../components/CreateGiftsPanel";
import {
    GIFT_LIST_CREATE,
    GIFT_LIST_QUERY,
    GIFT_LIST_UPDATE,
    GIFT_DETAIL_QUERY,
} from "../../../constants/authorityCodes";
import PromotionCalendarBanner from "../../../components/common/PromotionCalendarBanner/index";
import GiftLinkGenerateModal from './GiftLinkGenerateModal';
import { isBrandOfHuaTianGroupList, isMine, } from "../../../constants/projectHuatianConf";
import TicketBag from './TicketBag';
import GiftList from './TicketBag/GiftList';

const TabPane = Tabs.TabPane;
const validUrl = require('valid-url');
class GiftDetailTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            linkModalVisible: false,
            selectedRecord: null,
            visibleDetail: false,
            visibleEdit: false,
            createModalVisible: false,
            data: {},
            dataSource: [],
            blockDataSource: [],
            brands: [],
            editGift: { describe: '', value: '' },
            loading: true,
            queryParams: {
                pageNo: 1,
                pageSize: 20,
                action: '0',
            },
            total: 2,
            blockTotal: 2,
            tableHeight: '100%',
            usedTotalSize: 0,
            treeData: [],
        };
        this.tableRef = null;
        this.setTableRef = el => this.tableRef = el;
        this.lockedChangeSortOrder = throttle(this.changeSortOrder, 500, {trailing: false});
        this.queryFrom = null;
        this.columns = COLUMNS.slice();
        this.columns.splice(2, 0, {
            title: '排序',
            dataIndex: 'sortOrder',
            className: 'TableTxtCenter',
            key: 'sortOrder',
            width: 120,
            // fixed:'left',
            render: (text, record, index) => {
                const canNotSortUp = this.state.queryParams.pageNo == 1 && index == 0;
                const canNotSortDown = (this.state.queryParams.pageNo - 1) * this.state.queryParams.pageSize + index + 1 == this.state.total;
                return (
                    <span>
                        <span><Iconlist title={'置顶'} iconName={'sortTop'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'top')}/></span>
                        <span><Iconlist title={'上移'} iconName={'sortUp'} className={canNotSortUp ? 'sortNoAllowed' : 'sort'} onClick={canNotSortUp ? null : () => this.lockedChangeSortOrder(record, 'up')}/></span>
                        <span className={styles2.upsideDown}><Iconlist title={'下移'} iconName={'sortUp'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'down')}/></span>
                        <span className={styles2.upsideDown}><Iconlist title={'置底'} iconName={'sortTop'} className={canNotSortDown ? 'sortNoAllowed' : 'sort'} onClick={canNotSortDown ? null : () => this.lockedChangeSortOrder(record, 'bottom')}/></span>
                    </span>
                )
            },
        });
        this.handleCreateModalCancel = this.handleCreateModalCancel.bind(this);
    }

    componentDidMount() {
        const { FetchGiftList, shopData, FetchGiftSchemaAC } = this.props;
        FetchGiftList({
            pageNo: 1,
            pageSize: 20,
            action: 0,
        }).then((data = []) => {
            this.proGiftData(data);
        });
        fetchData('getShopBrand', { isActive: 1 }, null, { path: 'data.records' })
            .then((data) => {
                if (!data) return;
                const brands = [];
                data.map((d) => {
                    brands.push({ value: d.brandID, label: d.brandName })
                });
                this.setState({ brands });
            });
        const _shopData = shopData.toJS();
        if (_shopData.length === 0) {
            let parm = {}
            if (isFilterShopType()) {
                parm = { productCode: 'HLL_CRM_License' }
            }
            FetchGiftSchemaAC(parm)
        }
        this.props.queryWechatMpInfo();
    }

    componentWillReceiveProps(nextProps) {
        const { dataSource, shopData } = nextProps;
        const data = dataSource.toJS();
        if (this.state.dataSource !== data) {
            this.proGiftData(data);
        }
        const _shopData = shopData.toJS();
        this.proShopData(_shopData);
    }

    getTableColumns = () => {
        const {
            queryParams: {
                action,
            },
        } = this.state;
        let {tabkey} = this.props
        if (tabkey == 3) {
            const columns = this.columns.slice();
            columns.splice(1, 1, {
                title: '操作',
                dataIndex: 'operate',
                className: 'TableTxtCenter',
                key: 'operate',
                width: 100,
                render(value, record) {
                    return (
                        <span>
                            <a
                                href="javaScript:;"
                                onClick={() => {
                                    this.handleEdit(record, 'detail')
                                }}
                            >
                                查看
                            </a>
                            <Authority rightCode={GIFT_DETAIL_QUERY}>
                                {
                                    (isBrandOfHuaTianGroupList() && !isMine(record)) ? (
                                        <a disabled={true}>详情</a>
                                    ) : (
                                        <a href="javaScript:;" onClick={() => this.handleMore(record)}>详情</a>
                                    )
                                }
                            </Authority>
                        </span>
                    )
                },
            })
            return columns;
        }
        return this.columns;
    }

    handleCreateModalCancel() {
        this.setState({
            createModalVisible: false,
        })
    }

    proGiftData = (data) => {
        let {tabkey} = this.props
        // 在此处预处理用来显示 编辑的字段
        const _total = data.totalSize;
        const _pageSize = data.pageSize;
        const _pageNo = data.pageNo;
        const gifts = data.crmGiftList;
        if (gifts === undefined) {
            if(tabkey == 1) this.setState({ dataSource: [], total: _total });
            else this.setState({ blockDataSource: [], blockTotal: _total });
            
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
            g.usingTimeType = (g.usingTimeType || '').split(',');
            g.usingDateType = (g.usingDateType || '').split(',');
            g.usingWeekType = (g.usingWeekType || '').split(',');
            g.supportOrderTypeLst = g.supportOrderTypeLst ? (g.supportOrderTypeLst).split(',') : undefined;
            g.shopNames = g.shopNames === undefined ? '不限' : g.shopNames;
            g.isDiscountRate = g.discountRate < 1;
            g.isPointRate = g.pointRate > 0;
            // 现金红包相关字段合并
            g.sellerCode = g.settleId ? `${g.settleId}:${g.merchantNo}:${g.settleName}` : undefined;
            // 金豆商城字段和vivo快应用字段合并
            g.aggregationChannels = [];
            g.goldGift && g.aggregationChannels.push('goldGift');
            g.vivoChannel && g.aggregationChannels.push('vivoChannel');

            g.transferType = g.transferType > 0 ? 1 : 0; // 该字段以前是0 1 2, 三种值 现在1, 2合并为1
            if (g.transferLimitType !== undefined && g.transferLimitType != -1) {
                g.transferLimitType = String(g.transferLimitType);
                g.transferLimitType === '0' && (g.transferLimitTypeValue = '');
                g.transferLimitType > 0 && (g.transferLimitTypeValue = g.transferLimitType, g.transferLimitType = '-1');
            }
            if (g.giftType == 30 && g.giftImagePath && !validUrl.isWebUri(g.giftImagePath)) {
                if (g.giftImagePath.startsWith('/')) {
                    g.giftImagePath = 'http://res.hualala.com' + g.giftImagePath
                } else {
                    g.giftImagePath = 'http://res.hualala.com/' + g.giftImagePath
                }
            }
            return g;
        });
        if(tabkey == 1) this.setState({ dataSource: [...newDataSource], total: _total });
        else this.setState({ blockDataSource: [...newDataSource], blockTotal: _total });
        
    }

    handleFormChange(key, value) {

    }

    changeSortOrder(record, direction) {
        const params = {giftItemID: record.giftItemID, direction};
        axiosData('/coupon/couponService_updateRanking.ajax', params, {needThrow: true}, {path: undefined}, 'HTTP_SERVICE_URL_PROMOTION_NEW').then(() => {
            if (this.tableRef &&  this.tableRef.props && this.tableRef.props.pagination && this.tableRef.props.pagination.onChange) {
                this.tableRef.props.pagination.onChange(this.tableRef.props.pagination.current, this.tableRef.props.pagination.pageSize);
            }
        }).catch(err => {
            message.warning(err || 'sorry, 排序功能故障, 请稍后再试!');
        })
    }

    handleQuery(pageType) {
        let action = pageType == 1 ? 0 : 2
        const { queryParams } = this.state;
        const { FetchGiftList } = this.props;
        this.queryFrom.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const params = { ...values };
            this.setState({
                queryParams: { pageNo: 1, pageSize: queryParams.pageSize || 1, action, ...params },
            })
            FetchGiftList({
                action,
                pageNo: 1,
                pageSize: queryParams.pageSize || 1,
                ...params,
            }).then((data = []) => {
                this.proGiftData(data);
            });
        });
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

    // 用户点击编辑，处理编辑
    handleEdit(record, operationType) {
        let gift = _.find(GiftCfg.giftType, { name: record.giftTypeName });
        const selectShops = [];
        if(!gift){
            return;
        }
        gift = _.cloneDeep(gift);
        gift.data = { ...record }; // 此处将原引用GiftCfg改变了，导致在新建活动的时候，有data等属性，表单里会有此处留下的值
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
        gift.data.foodNameList = (gift.data.foodNameList || '').split(',');
        gift.data.maxUseLimit = gift.data.maxUseLimit || undefined;
        gift.data.customerUseCountLimit = gift.data.customerUseCountLimit || undefined;
        gift.data.action = `${gift.data.action || 0}`;
        gift.data.valueType = `${gift.data.valueType}`;
        gift.data.monetaryUnit = `${gift.data.monetaryUnit}`;
        
        const { FetchSharedGifts } = this.props;
        FetchSharedGifts({ giftItemID: record.giftItemID });
        if (gift.value == 100) { //
            return message.success('该券即将下线, 请使用折扣券');
        }
        this.props.startEditGift({
            operationType,
            value: gift.data.giftType,
            data: gift.data
        })
    }

    handleDelete(rec) {
        const { giftItemID, giftName } = rec;
        Modal.confirm({
            title: '您确定要停用吗？',
            content: (
                <div>
                    {`您将停用礼品
                        【${giftName}】`}
                    <br />
                    <span>停用是不可恢复操作，被停用的礼品可以在已停用的礼品中查看~</span>
                </div>
            ),
            onOk: () => {
                axiosData(
                    '/coupon/couponService_removeBoard.ajax',
                    { giftItemID },
                    { needThrow: true, needCode: true },
                    { path: '' },
                    'HTTP_SERVICE_URL_PROMOTION_NEW',
                ).then((data) => {
                    if (data.code === '000') {
                        message.success('此礼品停用成功');
                        const { queryParams } = this.state;
                        const { FetchGiftList } = this.props;
                        FetchGiftList(queryParams).then((data = []) => {
                            this.proGiftData(data);
                        });
                    }
                }, ({code, msg, eventReference = [], wechatCardReference = [], quotaCardsReference = [], couponPackageReference = []}) => {
                    if (code === '1211105076') {// 券被占用
                        Modal.warning({
                            title: '礼品被占用，不可停用',
                            content: (
                                <div
                                    style={{
                                        lineHeight: 1.5
                                    }}
                                >
                                    {
                                        !!eventReference.length && (
                                            <div>
                                                <div>
                                                    该礼品被以下活动使用，如需停用，请取消引用
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                        background: '#fef4ed',
                                                        padding: 5
                                                    }}
                                                >   {eventReference.map(name => `【${name}】`).join('')} </div>
                                            </div>
                                        )
                                    }
                                    {
                                        !!wechatCardReference.length && (
                                            <div>
                                                <div style={{ marginTop: 8 }}>
                                                    该礼品被以下微信卡券使用，如需停用，请取消引用
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                        background: '#fef4ed',
                                                        padding: 5
                                                    }}
                                                >   {wechatCardReference.map(name => `【${name}】`).join('')} </div>
                                            </div>
                                        )
                                    }
                                    {
                                        !!quotaCardsReference.length && (
                                            <div>
                                                <div style={{ marginTop: 8 }}>
                                                    该礼品被以下礼品定额卡券使用，如需停用，请取消引用
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                        background: '#fef4ed',
                                                        padding: 5
                                                    }}
                                                >   {quotaCardsReference.map(name => `【${name}】`).join('')} </div>
                                            </div>
                                        )
                                    }
                                     {
                                        !!couponPackageReference.length && (
                                            <div>
                                                <div style={{ marginTop: 8 }}>
                                                    该礼品被以下券包使用，如需停用，请取消引用
                                                </div>
                                                <div
                                                    style={{
                                                        marginTop: 8,
                                                        background: '#fef4ed',
                                                        padding: 5
                                                    }}
                                                >   {couponPackageReference.map(name => `【${name}】`).join('')} </div>
                                            </div>
                                        )
                                    }
                                </div>
                            ),
                        });
                    } else {
                        Modal.error({
                            title: '啊哦！好像有问题呦~~',
                            content: `${msg}`,
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
        // const { FetchSendorUsedList } = this.props;
        // const { giftType, giftItemID } = rec;
        // if (giftType !== '90') {
        //     FetchSendorUsedList({isSend: true, params: { pageNo: 1, pageSize: 10, giftItemID } });
        //     giftType !== '91' && FetchSendorUsedList({isSend: false, params: {giftStatus: '2', pageNo: 1, pageSize: 10, giftItemID } })
        // }
    }
    handleGenerateLink(record) {
        this.setState({
            selectedRecord: record,
            linkModalVisible: true,
        })
    }
    onGenerateLinkModalClose = () => {
        this.setState({
            selectedRecord: null,
            linkModalVisible: false,
        })
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

    proShopData = (shops = []) => {
        const treeData = [];
        shops.map((item, idx) => {
            const index = _.findIndex(treeData, { label: item.cityName })
            if (index !== -1) {
                treeData[index].children.push({
                    label: item.shopName,
                    value: item.shopID,
                    key: item.shopID,
                });
            } else {
                treeData.push({
                    label: item.cityName,
                    key: item.cityID,
                    children: [{
                        label: item.shopName,
                        value: item.shopID,
                        key: item.shopID,
                    }],
                });
            }
        });
        // console.log('treeData', treeData)
        this.setState({ treeData });
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
                case '21':
                case '91':
                case '110':
                case '111':
                case '22':
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
                case '21':
                case '80':
                case '30':
                case '40':
                case '42':
                case '91':
                case '100':
                case '110':
                case '111':
                case '22':
                    return (<GiftDetailModal {...detailProps} />);
                case '113':
                    return (<RedPacketDetailModal {...detailProps} />);
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
            giftItemID: {
                label: '礼品ID',
                type: 'text',
                placeholder: '请输入礼品ID',
            },
            giftPWD: {
                label: '券编码',
                type: 'text',
                placeholder: '请输入券编码',
            },
            giftType: {
                label: '礼品类型',
                type: 'combo',
                defaultValue: '',
                options: GiftCfg.giftTypeName,
                props: {
                    showSearch: true,
                    optionFilterProp: 'children',
                },
            },
            brandID: {
                label: '所属品牌',
                type: 'combo',
                options: this.state.brands,
                props: {
                    placeholder: '全部品牌',
                    showSearch: true,
                    optionFilterProp: 'children',
                    allowClear: true,
                },
            },
            action: {
                label: '状态',
                type: 'combo',
                defaultValue: '0',
                options: [
                    { label: '正常', value: '0' },
                    { label: '已停用', value: '2' },
                ],
            },
        };
        const formKeys = ['giftName', 'giftItemID', 'giftPWD', 'giftType', 'brandID',];
        const headerClasses = `layoutsToolLeft ${styles2.headerWithBgColor} ${styles2.basicPromotionHeader}`;
        const { tabkey } = this.props;
        const { groupID } = this.props.user.accountInfo;
        return (
            <div style={{backgroundColor: '#F3F3F3'}} className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <div className="layoutsTool" style={{height: '64px'}}>
                    <div className={headerClasses}>
                        <span className={styles2.customHeader}>
                            礼品信息
                        </span>
                        <p style={{ marginLeft: 'auto'}}>
                            <Authority rightCode={GIFT_LIST_CREATE}>
                                <Button
                                    type="ghost"
                                    icon="plus"
                                    className={styles2.jumpToCreate}
                                    style={{ margin: 5 }}
                                    onClick={
                                        () => {
                                            this.setState({
                                                createModalVisible: true
                                            })
                                        }
                                    }
                                >新增礼品</Button>
                            </Authority>
                            <Button
                                type="ghost"
                                icon="plus"
                                className={styles.jumpToCreate}
                                style={{ margin: 5,  width: 90 }}
                                onClick={
                                    () => {
                                        this.props.togglePage('ticket')
                                    }
                                }
                            >新增券包</Button>
                            <Authority rightCode={GIFT_LIST_QUERY}>
                                <Button
                                    type="ghost"
                                    style={{ margin: '0 24px' }}
                                    onClick={() => this.setState({ exportVisible: true })}
                                ><Icon type="export" />导出历史</Button>
                            </Authority>
                        </p>
                    </div>
                </div>
                <PromotionCalendarBanner />
                <Tabs activeKey={tabkey} onChange={this.props.toggleTabs} className={styles.tabBox}>
                    <TabPane tab="礼品查询" key="1">
                        <div className={styles2.pageContentWrapper}>
                            <div style={{ padding: '0'}} className="layoutsHeader">
                                <div className="layoutsSearch">
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
                                            <Authority rightCode={GIFT_LIST_UPDATE}>
                                                <Button type="primary" onClick={() => this.handleQuery(1)}>
                                                    <Icon type="search" />
                                                    { COMMON_LABEL.query }
                                                </Button>
                                            </Authority>
                                        </li>
                                    </ul>
                                </div>
                                <div style={{ margin: '0'}} className="layoutsLine"></div>
                            </div>
                            <div className={[styles.giftTable, styles2.tableClass, 'layoutsContent'].join(' ')}>
                                <Table
                                    ref={this.setTableRef}
                                    bordered={true}
                                    columns={this.getTableColumns().map(c => (c.render ? ({
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
                                    scroll={{ x: 1600,  y: 'calc(100vh - 440px)' }}
                                />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="券包查询" key="2">
                        <TicketBag pageType={2} groupID={groupID} onGoEdit={this.props.togglePage} treeData={this.state.treeData} />
                    </TabPane>
                    <TabPane tab="已停用礼品" key="3">
                        <GiftList 
                            pageType={3} 
                            groupID={groupID} 
                            onGoEdit={this.props.togglePage} 
                            treeData={this.state.treeData} 
                            formItems={formItems}
                            formKeys={formKeys}
                            columns={this.getTableColumns().map(c => (c.render ? ({
                                ...c,
                                render: c.render.bind(this),
                            }) : c))}
                            dataSource={this.state.blockDataSource}
                            total={this.state.blockTotal}
                            proGiftData={this.proGiftData}
                        /> 
                    </TabPane>
                    <TabPane tab="已停用券包" key="4">
                        <TicketBag pageType={4} groupID={groupID} onGoEdit={this.props.togglePage} treeData={this.state.treeData} />
                    </TabPane>
                </Tabs>
                <div>
                    { visibleDetail && GiftDetail(data.giftType) }
                </div>
                <div>
                    {GiftEdit(editGift.value)}
                </div>
                {
                    !this.state.exportVisible ? null :
                        <ExportModal
                            handleClose={() => this.setState({ exportVisible: false })}
                        />
                }
                <Modal
                    key="新建券"
                    title="新建券"
                    visible={this.state.createModalVisible}
                    onCancel={this.handleCreateModalCancel}
                    footer={false}
                    style={{
                        top: '10%'
                    }}
                    maskClosable={true}
                    width={960}
                >
                    <CreateGiftsPanel onClose={this.handleCreateModalCancel}/>
                </Modal>
                {
                    this.state.linkModalVisible && (
                        <GiftLinkGenerateModal
                            groupID={this.props.user.accountInfo.groupID}
                            entity={this.state.selectedRecord}
                            onCancel={this.onGenerateLinkModalClose}
                        />
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        dataSource: state.sale_giftInfoNew.get('dataSource'),
        loading: state.sale_giftInfoNew.get('loading'),
        user: state.user.toJS(),
        shopData: state.sale_giftInfoNew.get('shopData'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        FetchGiftList: opts => dispatch(FetchGiftList(opts)),
        startEditGift: opts => dispatch(startEditGift(opts)),
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
        FetchGiftSchemaAC: opts => dispatch(FetchGiftSchema(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GiftDetailTable)
