/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-09T15:23:26+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: PromotionDetail.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-09T16:55:43+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import moment from 'moment';
import React, { PropTypes } from 'react';
import SpecialPromotionExportModal from 'containers/SpecialPromotionNEW/common/SpecialPromotionExportModal'
import SpecialPromotionDetailExportModal from 'containers/SpecialPromotionNEW/common/SpecialPromotionDetailExportModal'
import { connect } from 'react-redux';
import {
    Modal,
    Row,
    Col,
    Table,
    Input,
    Select,
    Button,
    Tooltip,
    Popover,
    Icon,
} from 'antd';

const Option = Select.Option;

import styles from './specialDetail.less'

const Moment = require('moment');

import {
    fetchSpecialPromotionDetailData,
    fetchSpecialUserList
} from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import { CHARACTERISTIC_CATEGORIES } from '../../../redux/actions/saleCenterNEW/types';
import InviteeModal from './InviteeModal';
import GiftDetailModal from './GiftDetailModal';
import CollectPointAdjustModal from './CollectPointAdjustModal'
import { axiosData } from '../../../helpers/util';
import { injectIntl } from 'i18n/common/injectDecorator';
import { STRING_SPE } from 'i18n/common/special';
import { STRING_GIFT } from 'i18n/common/gift';
const exportablePromotionTypes = [
    // '22', // 报名活动
    '51',
    '52',
    '21',
    '20',
    '30',
    '22',
    '53',
    '50',
    '60',
    '61',
    '62',
    '23',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '31',
    '75',
    '77',
    '76',
    '80',
    '81',
    '69',
    '79',
    '83',
    '95',
    '91'
];
const levelArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
import {
    dataOverviewColumns,
    beRecommendTitleList,
    tempColumns
} from './constant'
import {
    renderOverViewData
} from './specialPromotionDetailHelp'
import { isZhouheiya } from "../../../constants/WhiteList";
import _ from 'lodash'
const showNoLimitType = ['60', '52']

const pointChangeMap = {
    1: '消费',
    2: '退款',
    3: '兑换',
    4: '调整增加',
    5: '调整减少',
}

@injectIntl
class SpecialPromotionDetail extends React.Component {
    constructor(props) {
        super(props);
        const record = this.props.record;
        this.state = {
            keyword: '',
            eventInfo: record.eventInfo || {
                data: {},
                gifts: [],
            },
            pageSize: 10,
            userInfo: record.userInfo.list,
            pageNo: record.userInfo.pageNo || 1,
            total: record.userInfo.totalSize || 0,
            detailPageNo: 1,
            detailPageSize: 10,
            detailTotal: 0,
            inviteeModalVisble: false,
            giftDetailModalVisble: false,
            selectedInviter: null,
            recommendStatitics: [],
            popoverVisible: false,
            tooltipVisble: false,
            sameItemID: '',
            dataOverviewDataSource: [],
            recommendRewardSummaryData: [],
            recommendedRewardSummaryData: [],
            detailModalVisible: false,
            detailDataSource: [],
            detailPopoverVisible: false,
            detailTooltipVisble: false,
            detailPopA: '',
            detailPopContent: '',
            detailSameItemID: '',
            exportDetailVisible: false,
            currentOperateId: '',
            detailLoading: false,
        };
        this.handleUserTablePageChange = this.handleUserTablePageChange.bind(this);
        this.handleUserTablePageSizeChange = this.handleUserTablePageSizeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.query = this.query.bind(this);
        this.resetQuery = this.query.bind(this, true); // 手动点击查询， 视为刷新， 从第1页开始
        this.detailColumns = [
            {
                title: `序号`,
                dataIndex: 'index',
                key: 'index',
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return ((this.state.detailPageNo - 1) * this.state.detailPageSize + index) + 1;
                },
                width: 10,
            },
            {
                title: `客户编码`,
                dataIndex: 'customerID',
                key: 'customerID',
                className: 'TableTxtCenter',
                width: 100,
            },
            {
                title: `姓名`,
                dataIndex: 'customerName',
                key: 'customerName',
                className: 'TableTxtCenter',
                width: 100,
            },
            {
                title: `手机号`,
                dataIndex: 'customerMobile',
                key: 'customerMobile',
                className: 'TableTxtCenter',
                width: 100,
            },
            {
                title: <span>
                    <span>参与时间</span>
                    <Tooltip title={
                        <div>
                            <p>
                                1.若本行数据记录了已集点数，则参与时间为本次消费时间or本次消费撤销时间
                            </p>
                            <p>
                                2.若本行数据记录了兑换点数，则参与时间为顾客手动兑换礼品的时间。
                            </p>
                        </div>
                    }>
                        <Icon style={{ marginLeft: 0, marginRight: 5 }} type="question-circle-o" />
                    </Tooltip>
                </span>,
                dataIndex: 'createStampShow',
                key: 'createStampShow',
                className: 'TableTxtCenter',
                width: 100,
            },
            {
                title: `集点状态`,
                dataIndex: 'pointChangeType',
                key: 'pointChangeType',
                className: 'TableTxtCenter',
                render: (text) => {
                    return pointChangeMap[text]
                },
                width: 50,
            },
            {
                title:
                    <span>
                        <span>已集点数</span>
                        <Tooltip title='数值>0时，本次消费的集点数，即本行账单号中的已集点数；数值<0时，本次反结账撤销的集点数，即本行反结账账单中撤销的集点数。'>
                            <Icon style={{ marginLeft: 0, marginRight: 5 }} type="question-circle-o" />
                        </Tooltip>
                    </span>,
                dataIndex: 'changeCount',
                key: 'changeCount',
                className: 'TableTxtCenter',
                width: 50,
                render: (text, record) => {
                    if (record.pointChangeType == '3') {
                        return '0'
                    } else {
                        return text
                    }
                }
            },
            {
                title:
                    <span>
                        <span>兑换点数</span>
                        <Tooltip title='本次兑换点数，即本次顾客兑换礼品已经消耗的点数'>
                            <Icon style={{ marginLeft: 0, marginRight: 5 }} type="question-circle-o" />
                        </Tooltip>
                    </span>,
                dataIndex: 'finalUsedCount',
                key: 'finalUsedCount',
                className: 'TableTxtCenter',
                width: 100,
                render: (text, record) => {
                    if (record.pointChangeType == '3') {
                        return parseInt(record.changeCount) * -1
                    } else {
                        return '0'
                    }
                }
            },
            {
                title:
                    <span>
                        <span>未兑换点数</span>
                        <Tooltip title='截止到本行参与时间，未兑换点数的总合计'>
                            <Icon style={{ marginLeft: 0, marginRight: 5 }} type="question-circle-o" />
                        </Tooltip>
                    </span>,
                dataIndex: 'finalAvailableCount',
                key: 'finalAvailableCount',
                className: 'TableTxtCenter',
                width: 50,
            },
            {
                title: `关联账单号`,
                dataIndex: 'posOrderNo',
                key: 'posOrderNo',
                className: 'TableTxtCenter',
                width: 160,
            },
            {
                title: `操作人`,
                dataIndex: 'operator',
                key: 'operator',
                className: 'TableTxtCenter',
                render: (text) => {
                    return text || '--'
                },
                width: 50,
            }
        ];
    }

    componentDidMount() {
        const eventEntity = this.props.record.eventInfo.data;
        if (eventEntity.eventWay == 68) {
            axiosData(
                '/specialPromotion/queryRecommendEventData.ajax',
                { eventID: eventEntity.itemID },
                { needThrow: true },
                { path: '' },
                'HTTP_SERVICE_URL_PROMOTION_NEW',
            ).then(res => {
                this.setState({
                    recommendStatitics: [res],
                })
            })
            // 获取数据总揽和奖励统计
            axiosData(
                '/specialPromotion/queryRecommendEventSummary.ajax',
                { eventID: eventEntity.itemID },
                { needThrow: true },
                { path: '' },
                'HTTP_SERVICE_URL_PROMOTION_NEW',
            ).then(res => {
                if (res.code === '000') {
                    const dataOverviewDataSource = [{}]
                    dataOverviewColumns.forEach(v => {
                        dataOverviewDataSource[0][v.key] = res[v.key]
                    })

                    this.setState({
                        dataOverviewDataSource,
                        recommendRewardSummaryData: res.recommendRewardSummaryData || [], // 推荐人统计
                        recommendedRewardSummaryData: res.recommendedRewardSummaryData || [] // 被推荐人统计

                    })
                } else {
                    message.error(res.message)
                }

            })
        }

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.record !== nextProps.record) {
            if (nextProps.record.eventInfo) {
                this.setState({
                    eventInfo: nextProps.record.eventInfo,
                })
            }
            if (nextProps.record.userInfo && nextProps.record.userInfo.list) {
                this.setState({
                    userInfo: nextProps.record.userInfo.list,
                    pageNo: nextProps.record.userInfo.pageNo || 1,
                    total: nextProps.record.userInfo.totalSize || 0,
                })
            } else {
                this.setState({
                    userInfo: [],
                    pageNo: 1,
                    total: 0,
                })
            }
        }
    }
    onHandleExport = () => {
        const { currentOperateId } = this.state;
        const { user } = this.props
        axiosData(
            '/crm/export/exportEventCustomerCollectPointDetail.ajax',
            {
                eventCustomerID: currentOperateId,
                groupID: user.accountInfo.groupID,
                exportType: 19,
            },
            null,
            { path: 'data' },
        ).then(records => {
            if (records.sameRequest) {
                this.setState({
                    detailPopContent: '已有导出任务 请勿重复操作，',
                    detailPopA: '查看导出结果',
                    detailSameItemID: records.sameItemID,
                })
            } else {
                this.setState({
                    detailPopContent: '数据导出中 请',
                    detailPopA: '查看导出进度',
                })
            }
            if (records.highMoment == 1) {
                this.setState({
                    detailPopContent: <div><p style={{ whiteSpace: 'nowrap' }}>营业高峰期(11:00-14:00,17:00</p><p style={{ whiteSpace: 'nowrap' }}>-20:30)暂停使用数据导出功能</p></div>,
                    detailPopA: '',
                    detailTooltipVisble: true,
                })
            } else {
                this.setState({
                    detailTooltipVisble: false,
                })
            }
            this.setState({
                detailPopoverVisible: true,
            });
        })
    }

    render() {
        const eventEntity = this.props.record.eventInfo.data;
        const { sameItemID, keyword, collectPointAdjustVisible = false, collectPointAdjustLst = {} } = this.state;
        return (
            <div className={styles.showInfo}>
                {
                    this.state.exportVisible && (
                        <SpecialPromotionExportModal
                            eventID={eventEntity.itemID}
                            eventName={eventEntity.eventName}
                            handleClose={() => this.setState({ exportVisible: false, sameItemID: '' })}
                            sameItemID={sameItemID}
                            keyword={keyword}
                        />
                    )
                }
                {
                    this.state.exportDetailVisible && (
                        <SpecialPromotionDetailExportModal
                            eventID={eventEntity.itemID}
                            eventName={eventEntity.eventName}
                            handleClose={() => this.setState({ exportDetailVisible: false, sameItemID: '' })}
                            sameItemID={this.state.detailSameItemID}
                            keyword={keyword}
                        />
                    )
                }
                {this.renderBaseInfo()}
                {this.renderActivityDetailInfo()}
                {
                    this.state.inviteeModalVisble && (
                        <InviteeModal
                            eventWay={this.state.eventInfo.data.eventWay}
                            eventID={this.state.eventInfo.data.itemID}
                            inviterID={this.state.selectedInviter.customerID}
                            inviterName={this.state.selectedInviter.name}
                            onClose={() => this.setState({
                                inviteeModalVisble: false,
                                selectedInviter: null,
                            })}
                        />
                    )
                }
                {
                    this.state.giftDetailModalVisble && (
                        <GiftDetailModal
                            eventID={this.state.eventInfo.data.itemID}
                            customerID={this.state.selectedInviter.customerID}
                            onClose={() => this.setState({
                                giftDetailModalVisble: false,
                                selectedInviter: null,
                            })}
                        />
                    )
                }
                { 
                    collectPointAdjustVisible && (<CollectPointAdjustModal
                        data={collectPointAdjustLst}
                        onCancel={() => {
                            this.setState({
                                collectPointAdjustLst: {},
                                collectPointAdjustVisible: false
                            }, () => {
                                this.resetQuery()
                            })
                        }}
                        />)
                }
                <Modal
                    title="客户参与详情"
                    maskClosable={true}
                    width={800}
                    visible={this.state.detailModalVisible}
                    // onOk={this.handleAuthSubmit}
                    footer={[
                        <Button type="ghost" onClick={() => {
                            this.setState({
                                detailModalVisible: false,
                            }, () => {
                                const { setVisible } = this.props
                                setVisible && setVisible(true)
                            })
                        }}>关闭</Button>,
                        <Button type="primary" onClick={this.handleDetailModalOpen.bind(this, this.state.currentOperateId, true)}>刷新</Button>,
                    ]}
                    onCancel={() => {
                        this.setState({
                            detailModalVisible: false,
                        }, () => {
                            const { setVisible } = this.props
                            setVisible && setVisible(true)
                        })
                    }}
                >
                    <div>
                        <Popover
                            content={this.renderDetailPopOver()}
                            placement="topRight"
                            title={false}
                            trigger="click"
                            visible={this.state.detailPopoverVisible}
                            onVisibleChange={this.handleDetailVisibleChange}
                        >
                            <Button
                                className={styles.ExportRightBtn}
                                onClick={this.onHandleExport}
                                type='primary'
                            >导出</Button>
                        </Popover>

                        <Table
                            dataSource={this.state.detailDataSource || []}
                            columns={this.detailColumns}
                            bordered={true}
                            loading={this.state.detailLoading}
                            pagination={{
                                current: this.state.detailPageNo,
                                total: this.state.detailTotal,
                                showQuickJumper: true,
                                showSizeChanger: false, // 暂时不改变pageSize
                                onShowSizeChange: this.handleDetailTablePageSizeChange,
                                pageSize: this.state.detailPageSize,
                                showTotal: (total, range) => `${this.props.intl.formatMessage(STRING_SPE.d2b1c6b31a93638)} ${range[0]} - ${range[1]} / ${this.props.intl.formatMessage(STRING_SPE.dk46lj779a7119)} ${total} ${this.props.intl.formatMessage(STRING_SPE.d34ikgs6o6845)}`,
                                pageSizeOptions: ['5', '10', '20', '40'],
                                onChange: this.handleDetailTablePageChange
                            }}
                            scroll={{ x: 1500 }}
                        />
                    </div>
                </Modal>
            </div>
        );
    }

    // 基本信息
    renderBaseInfo() {
        const record = this.state.eventInfo.data;
        function getTitle(eventWay) {
            if (eventWay === undefined) {
                return
            }
            return CHARACTERISTIC_CATEGORIES.find((event) => {
                return event.key == eventWay;
            }).title
        }
        return (
            <div style={{ marginBottom: 20 }}>
                <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d2c8987eai0135)}</h5>
                <div className={styles.baseInfoBox}>
                    <div>
                        <Row>
                            <Col span={4} style={{ textAlign: 'right' }}>{this.props.intl.formatMessage(STRING_SPE.d4h177f79da1218)}</Col>
                            <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                            <Col span={18} style={{ textAlign: 'left' }}>{getTitle(record.eventWay)}</Col>
                        </Row>
                        {
                            record.eventName !== '' ?
                                (
                                    <Row>
                                        <Col span={4} style={{ textAlign: 'right' }}>{this.props.intl.formatMessage(STRING_SPE.d4546grade4128)}</Col>
                                        <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                                        <Col span={18} style={{ textAlign: 'left' }}>{record.eventName}</Col>
                                    </Row>
                                ) : null
                        }
                        {
                            (record.eventStartDate !== '20000101' && record.eventEndDate !== '29991231' &&
                                record.eventStartDate !== '0' && record.eventEndDate !== '0') || record.eventWay == '51' ?
                                (
                                    <Row>
                                        <Col span={4} style={{ textAlign: 'right' }}>{this.props.intl.formatMessage(STRING_SPE.db60c8ac0a379138)}</Col>
                                        <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                                        <Col span={18} style={{ textAlign: 'left' }}>
                                            {
                                                (record.eventStartDate !== '20000101' && record.eventEndDate !== '29991231' &&
                                                    record.eventStartDate !== '0' && record.eventEndDate !== '0') ?
                                                    `${moment(record.eventStartDate, 'YYYY/MM/DD').format('YYYY/MM/DD')} - ${moment(record.eventEndDate, 'YYYY/MM/DD').format('YYYY/MM/DD')}` : '不限制'
                                            }
                                        </Col>
                                    </Row>
                                ) : null
                        }
                        {
                            showNoLimitType.includes(String(record.eventWay)) && record.eventStartDate == '20000101' && record.eventEndDate == '29991231' ?
                                (
                                    <Row>
                                        <Col span={4} style={{ textAlign: 'right' }}>{this.props.intl.formatMessage(STRING_SPE.db60c8ac0a379138)}</Col>
                                        <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                                        <Col span={18} style={{ textAlign: 'left' }}>
                                            不限制

                                        </Col>
                                    </Row>
                                )
                                : null
                        }
                        {
	                    record.eventWay != '69' && 
	                    <Row>
	                        <Col span={4} style={{ textAlign: 'right' }}>{this.props.intl.formatMessage(STRING_SPE.d7ekp859lc11113)}</Col>
	                        <Col span={1} style={{ textAlign: 'center' }}>:</Col>
	                        <Col span={18} style={{ textAlign: 'left' }}>{record.eventRemark}</Col>
	                    </Row>
                        }
                        {
                            record.createScenesName ?
                                (
                                    <div>
                                        <Row>
                                            <Col span={4} style={{ textAlign: 'right' }}>活动关联</Col>
                                            <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                                            <Col span={18} style={{ textAlign: 'left' }}>{record.createScenesName}</Col>
                                        </Row>
                                    </div>
                                ) : null
                        }
                    </div>
                </div>
            </div>
        );
    }

    // 统计信息
    renderActivityDetailInfo() {
        let records = []
        try {
            records = this.props.mySpecialActivities.data.eventInfo.gifts || [];
        } catch (e) {
            records = []
        }
        const way = this.state.eventInfo.data.eventWay;
        if (way == 66) {

            const list1 = records.filter(v => v.sendType == 0)
            const list2 = records.filter(v => v.sendType == 1)
            return (<div>
                <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                <div style={{ marginTop: '10px', marginBottom: '5px' }}>发起人奖励统计</div>
                <Col style={{ marginBottom: '10px' }} span={24}>
                    {this.renderGiftInfoTable(list1, way)}
                </Col>
                <div style={{ marginBottom: '5px' }}>助力人奖励统计</div>
                <Col span={24}>
                    {this.renderGiftInfoTable(list2, way)}
                </Col>
                {this.renderSearch()}
                <Col span={24}>
                    {this.renderActivityInfoTable()}
                </Col>
            </div>)
        }
        if (way == 68) { // 推荐有礼
            let couponList = []
            const couponCurrent = this.props.mySpecialActivities.data.eventInfo.eventRuleInfos

            if (couponCurrent.length) {
                couponCurrent.forEach(v => {
                    if (Array.isArray(v.gifts)) {
                        couponList = couponList.concat(v.gifts)
                    }
                })
            }

            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <div>数据总览</div>
                    <Col span={24}>
                        {renderOverViewData.call(this)}
                    </Col>
                    <div>&nbsp;</div>
                    <div>{this.props.intl.formatMessage(STRING_SPE.d31f11d5hd51190)}</div>
                    <Col span={24}>
                        {this.renderGiftInfoTable(couponList)}
                    </Col>
                    <div>&nbsp;</div>
                    {/* <div>&nbsp;</div>
                    <Col span={24}>
                        {this.renderRecommendStatisticsTable()}
                    </Col> */}
                    <div>{this.props.intl.formatMessage(STRING_SPE.da9060bn7f2110)}</div>
                    <Col span={24}>
                        {this.renderGiftInfoTable(records.filter(record => record.recommendType === 0 && record.presentType === 1), 'beRecommend')}
                    </Col>

                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 20) {
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(records.filter(record => record.presentType === 1))}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsTable()}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderCardValueTable()}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={24}>
                        {this.renderRedPacketsTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 76) {
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(records.filter(record => { return record.presentType === 1 || record.presentType === 8 }))}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 75) {
            return (
                <div>
                    <h5><span></span>统计信息</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(records)}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderCollectPointsTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 78) {
            const rec = records.filter(record => [1, 4].includes(record.presentType));
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(rec, way)}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsTable()}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderCardValueTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 60) {
            const list = records.filter(v => { return v.presentType === 1 || v.presentType === 8 })
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(list, way)}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsAndGrowthValueTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 61) {

            const list = records.filter(v => v.presentType === 1)
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(list, way)}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 64) {//评价送礼

            const list = records.filter(v => { return v.presentType === 1 || v.presentType === 8 })
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(list, way)}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 79) {//盲盒

            const list = records.filter(v => { return v.presentType === 1 || v.presentType === 8 })
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(list, way)}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 83) {//口令领券

            const list = records.filter(v => { return v.presentType === 1 || v.presentType === 8 })
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(list, way)}
                    </Col>
                    {/* <Col style={{ marginTop: 10 }} span={18}>
                            {this.renderPointsTable()}
                        </Col> */}
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 52) {//

            const list = records.filter(v => { return v.presentType === 1 || v.presentType === 8 })
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(list, way)}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        if (way == 53) {//群发礼品

            const list = records.filter(v => { return v.presentType === 1 || v.presentType === 8 })
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <Col span={24}>
                        {this.renderGiftInfoTable(list, way)}
                    </Col>
                    <Col style={{ marginTop: 10 }} span={18}>
                        {this.renderPointsTable()}
                    </Col>
                    {this.renderSearch()}
                    <Col span={24}>
                        {this.renderActivityInfoTable()}
                    </Col>
                </div>
            )
        }
        return (
            <div>
                <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                <Col span={24}>
                    {this.renderGiftInfoTable(records, way)}

                </Col>
                {this.renderSearch()}
                <Col span={24}>
                    {this.renderActivityInfoTable()}
                </Col>
            </div>
        )
    }
    /**
     * 推荐有礼活动专有统计表格
     */
    renderRecommendStatisticsTable() {
        const dataSource = this.state.recommendStatitics;
        const columns = [
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.dd5aa2689dd3191)}`,
                dataIndex: 'directRecommends',
                key: 'directRecommends',
                className: 'TableTxtCenter',
                render: num => `${num || 0}`,
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d1432std364275)}`,
                dataIndex: 'directRecommendTotalMoney',
                key: 'directRecommendTotalMoney',
                className: 'TableTxtCenter',
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.db60c9695722569)}`,
                dataIndex: 'directRecommendTotalPoint',
                key: 'directRecommendTotalPoint',
                className: 'TableTxtCenter',
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d1e09if66p6186)}`,
                dataIndex: 'indirectRecommends',
                key: 'indirectRecommends',
                className: 'TableTxtCenter',
                render: num => `${num || 0}`,
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d1kgf6ij820732)}`,
                dataIndex: 'indirectRecommendTotalMoney',
                key: 'indirectRecommendTotalMoney',
                className: 'TableTxtCenter',
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.da9060bn7f8251)}`,
                dataIndex: 'indirectRecommendTotalPoint',
                key: 'indirectRecommendTotalPoint',
                className: 'TableTxtCenter',
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d1e09if66p9204)}`,
                dataIndex: 'receivedTotalMoney',
                key: 'receivedTotalMoney',
                className: 'TableTxtCenter',
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d216471b3278a10164)}`,
                dataIndex: 'unclaimedTotalMoney',
                key: 'unclaimedTotalMoney',
                className: 'TableTxtCenter',
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d34ikj453211103)}`,
                dataIndex: 'receivedTotalPoint',
                key: 'receivedTotalPoint',
                className: 'TableTxtCenter',
                width: 160,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d454fhnprm12229)}`,
                dataIndex: 'unclaimedTotalPoint',
                key: 'unclaimedTotalPoint',
                className: 'TableTxtCenter',
                width: 160,
            },
        ];
        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered={true}
                pagination={false}
                scroll={{ x: 1800 }}
            />
        );
    }
    // 礼品信息表格
    renderGiftInfoTable(records, type) {
        console.log("🚀 ~ file: specialPromotionDetail.jsx:993 ~ SpecialPromotionDetail ~ renderGiftInfoTable ~ records", records)
        const way = this.state.eventInfo.data.eventWay;
        const { intl } = this.props;
        let giftCountText = '';
        if(['20','21','30','70'].includes(String(way))){
            giftCountText = `${this.props.intl.formatMessage(STRING_SPE.d7ekp2h8kc13243)}`;
        }else{
            if(way == '95'){
                giftCountText = '礼品库存';
            }else{
                giftCountText = `${this.props.intl.formatMessage(STRING_SPE.dojv8nhwu12190)}`;
            }
        }
        const columns = way == 91 ? [
            {
                title: '序号',
                dataIndex: 'idx',
                key: 'idx',
                className: 'TableTxtCenter',
                render: (text) => {
                    return Number(text) + 1
                },
            },
            {
                title: '权益卡名称',
                dataIndex: 'benefitCardName',
                key: 'benefitCardName',
                render: (text, record) => {
                    return <span title={record.benefitCardName}>{record.benefitCardName}</span>
                }
            },
            {
                title: '档位名称',
                dataIndex: 'EGiftName',
                key: 'EGiftName',
                render: (text, record) => {
                    return <span title={record.EGiftName}>{record.EGiftName}</span>
                }
            },
            {
                title: '发起数量',
                dataIndex: 'launchEventCount',
                key: 'launchEventCount',
                render: (text, record) => {
                    return <span title={text}>{text}</span>
                }
            },
            {
                title: '砍价人数',
                dataIndex: 'helpEventCount',
                key: 'helpEventCount',
                render: (text, record) => {
                    return <span title={text}>{text}</span>
                }
            },
        ] : [
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d31f11d5hd613295)}`,
                dataIndex: 'idx',
                key: 'idx',
                className: 'TableTxtCenter',
                render: (text) => {
                    return Number(text) + 1
                },
            },
            {
                title: `${intl.formatMessage(STRING_GIFT.giftName)}`,
                dataIndex: 'EGiftName',
                key: 'EGiftName',
                render: (text, record) => {
                    return <span title={record.EGiftName}>{record.EGiftName}</span>
                }
            },
            {
                title: giftCountText,
                dataIndex: 'EGiftSingleCount',
                key: 'EGiftSingleCount',
                className: 'TableTxtRight',
                render(text) {
                    if (way == '30') {
                        return text == 0 ? '' : text
                    }
                    if (way == '21' && text == 2147483647) {
                        text = '不限制'
                    }
                    return text
                }
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.da9060bn7g14187)}`,
                dataIndex: 'EGiftSendCount',
                key: 'EGiftSendCount',
                className: 'TableTxtRight',
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d16hh2cja4i15124)}`,
                dataIndex: 'resumeGiftsCount',
                key: 'resumeGiftsCount',
                className: 'TableTxtRight',
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d5g3ddeg771632)}`,
                dataIndex: 'resumeGiftsCountPercent',
                key: 'resumeGiftsCountPercent',
                className: 'TableTxtRight',
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.dojy8ws411711)}`,
                dataIndex: 'EGfitValidUntilDayCount',
                key: 'EGfitValidUntilDayCount',
                className: 'TableTxtRight',
            },
        ];
        if(way == 95){//如果是限时秒杀
            columns.pop();
            columns.push({
                title: '秒杀收益',
                dataIndex: 'giftIncome',
                key: 'giftIncome',
                className: 'TableTxtRight',
                render: (text) => {
                    return (<Tooltip title={text || ''}>{text}</Tooltip>)
                }
            });
        }
        const dataSource = records.map((gift, index) => {
            let days;
            if (!gift.giftValidUntilDayCount > 0) {
                const start = Moment(gift.effectTime, 'YYYYMMDDHHmmss').unix();// gift.effectTime:'20171030120000'
                const end = Moment(gift.validUntilDate, 'YYYYMMDDHHmmss').unix();
                days = Math.floor((end - start) / (3600 * 24)) + 1;
            }
            //【签到】签到活动的活动跟踪页面展示问题,对于签到活动中赠送积分表项的特殊处理
            // if(way == 76){
            //     if(gift.presentType == 2){
            //         days = '';
            //     }
            // }
            // 积分兑换 如果是 -1 改为不限制
            let giftNumberText = null;
            let giftTotalCount = gift.giftTotalCount;
            if (way == 30 && gift.giftTotalCount === -1) {
                giftTotalCount = '不限制'
            }
            if (['20', '21', '30', '70'].includes(String(way))) {
                giftNumberText = giftTotalCount;
            }else{
                if(way == 95){
                    giftNumberText = gift.remainStock;//限时秒杀取库存
                }else{
                    giftNumberText = gift.giftCount;
                }
            }
            return {
                key: `${index}`,
                idx: `${index}`,
                EGiftName: gift.giftName,
                EGiftSingleCount: giftNumberText,
                EGiftSendCount: gift.giftSendCount,
                EGfitValidUntilDayCount: gift.giftValidUntilDayCount > 0 ? gift.giftValidUntilDayCount : days,
                resumeGiftsCount: gift.resumeGiftsCount || 0,
                resumeGiftsCountPercent: gift.giftSendCount == 0 ? '0%' : `${Math.round((gift.resumeGiftsCount || 0) / (gift.giftSendCount) * 10000) / 100}%`,
                giftIncome: gift.giftIncome ? gift.giftIncome : 0,
                benefitCardName: gift.cardTypeName,  
                helpEventCount: gift.helpEventCount,
                launchEventCount: gift.launchEventCount,
            }
        });
        if (this.props.record.eventInfo.data.eventWay == 68) {
            // rewardType 1 为卡值 2 为积分 3 红包
            let filterKeys = [
                { name: '赠送积分', id: '2' },
                { name: '赠送卡值', id: '1' },
                { name: '现金红包', id: '4' },
            ]

            let { recommendRewardSummaryData, recommendedRewardSummaryData } = this.state
            const recommendRewardSummaryDataList = []
            if (type === 'beRecommend') {
                filterKeys = [{ name: '赠送积分', id: '2' }]
                filterKeys.forEach(v => {
                    recommendedRewardSummaryData.forEach(item => {
                        if (item.rewardType == v.id) {
                            item.rewardTypeName = v.name
                            recommendRewardSummaryDataList.push(item)
                        }
                    })
                })
            } else {
                filterKeys.forEach(v => {
                    recommendRewardSummaryData.forEach(item => {
                        if (item.rewardType == v.id) {
                            item.rewardTypeName = v.name
                            recommendRewardSummaryDataList.push(item)
                        }
                    })
                })
            }




            const columnsNew = _.cloneDeep(columns)
            columnsNew.splice(1, 0, {
                title: '赠送类型',
                dataIndex: 'mySendType',
                key: 'mySendType',
                className: "TableTxtCenter",
            })
            columnsNew.pop()
            return (
                <div>
                    {recommendRewardSummaryDataList.map((val, index) => {

                        return <div>
                            <div>&nbsp;</div>
                            <Table
                                style={{ width: '80%' }}
                                dataSource={[
                                    val
                                ]}
                                columns={beRecommendTitleList[index].map((v, i) => {
                                    const column = _.cloneDeep(tempColumns)[i]
                                    column.title = v
                                    return column
                                })}
                                bordered={true}
                                pagination={false}
                            />

                        </div>
                    })}
                    <div>&nbsp;</div>
                    <Table dataSource={dataSource.map(v => {
                        v.mySendType = '优惠券'
                        return v
                    })} columns={columnsNew} bordered={true} pagination={false} />
                </div>
            );
        }
        return (
            <Table dataSource={dataSource} columns={columns} bordered={true} pagination={false} />
        );
    }
    renderCardValueTable() {
        const columns = [
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.dk46m1ib4k18146)}`,
                dataIndex: 'title',
                key: 'title',
                className: 'TableTxtCenter',
            },
            {
                title: '累计赠送卡值',
                dataIndex: 'sendAmount',
                key: 'sendAmount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d2b1c6d3681120204)}`,
                dataIndex: 'sendCount',
                key: 'sendCount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
        ];
        let dataSource;

        try {
            dataSource = [{
                title: '赠送卡值',
                ...this.props.mySpecialActivities.data.eventInfo.giveBalanceData,
            }];
        } catch (e) {
            dataSource = [];
        }
        return (
            <Table dataSource={dataSource} columns={columns} bordered={true} pagination={false} />
        );
    }
    renderPointsTable() {
        const columns = [
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.dk46m1ib4k18146)}`,
                dataIndex: 'title',
                key: 'title',
                className: 'TableTxtCenter',
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.da9060bn7g19221)}`,
                dataIndex: 'sendPointAmount',
                key: 'sendPointAmount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d2b1c6d3681120204)}`,
                dataIndex: 'sendCount',
                key: 'sendCount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
        ];
        let dataSource;

        try {
            dataSource = [{
                title: `${this.props.intl.formatMessage(STRING_SPE.dk46b2bc3b1333)}`,
                ...this.props.mySpecialActivities.data.eventInfo.eventPointData,
            }];
        } catch (e) {
            dataSource = [];
        }
        return (
            <Table dataSource={dataSource} columns={columns} bordered={true} pagination={false} />
        );
    }
    renderPointsAndGrowthValueTable() {
        const columns = [
            {
                title: '赠送类型',
                dataIndex: 'title',
                key: 'title',
                className: 'TableTxtCenter',
            },
            {
                title: '累计赠送数',
                dataIndex: 'sendAmount',
                key: 'sendAmount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
            {
                title: '累计赠送总次数',
                dataIndex: 'sendCount',
                key: 'sendCount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
        ];
        let dataSource;

        try {
            dataSource = [{
                title: `${this.props.intl.formatMessage(STRING_SPE.dk46b2bc3b1333)}`,
                sendAmount: this.props.mySpecialActivities.data.eventInfo.eventPointData ? this.props.mySpecialActivities.data.eventInfo.eventPointData.sendPointAmount : null,
                sendCount: this.props.mySpecialActivities.data.eventInfo.eventPointData ? this.props.mySpecialActivities.data.eventInfo.eventPointData.sendCount : null,
            }, {
                title: '赠送成长值',
                ...this.props.mySpecialActivities.data.eventInfo.growthValueData,
            }];
        } catch (e) {
            dataSource = [];
        }
        return (
            <Table dataSource={dataSource} columns={columns} bordered={true} pagination={false} />
        );
    }
    renderRedPacketsTable() {
        const columns = [
            {
                title: '赠送类型',
                dataIndex: 'title',
                key: 'title',
                className: 'TableTxtCenter',
            },
            {
                title: '累计赠送红包总数',
                dataIndex: 'sendCount',
                key: 'sendCount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
            {
                title: '累计赠送红包金额',
                dataIndex: 'redPackAmount',
                key: 'redPackAmount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
            {
                title: '累计参与人数',
                dataIndex: 'joinCount',
                key: 'joinCount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
        ];
        let dataSource;
        try {
            dataSource = [{
                title: '现金红包',
                ...this.props.mySpecialActivities.data.eventInfo.redPackData,
            }];
        } catch (e) {
            dataSource = [];
        }
        return (
            <Table dataSource={dataSource} columns={columns} bordered={true} pagination={false} />
        );
    }

    renderSearch() {
        const way = this.state.eventInfo.data.eventWay;
        const records = this.state.userInfo || [];
        return (
            <div className={styles.searchBar}>
                <Col span={24} style={{
                    padding: '0px',
                    marginTop: 20,
                }}
                >
                    <h5><span></span>参与记录</h5>
                </Col>
                <Col span={24}>
                    <Col span={2} style={{ marginTop: 4 }}>{this.props.intl.formatMessage(STRING_SPE.d5672ba595d82123)}</Col>
                    <Col span={6}><Input onBlur={this.handleInputChange} /></Col>
                    <Col span={3}><Button type="primary" onClick={this.resetQuery}>{this.props.intl.formatMessage(STRING_SPE.da9060bn7g2223)}</Button></Col>
                    {
                        exportablePromotionTypes.includes(`${way}`) && (
                            <Col span={3}>
                                <Popover
                                    content={this.renderPopOver()}
                                    placement="topRight"
                                    title={false}
                                    trigger="click"
                                    visible={this.state.popoverVisible}
                                    onVisibleChange={this.handleVisibleChange}
                                >
                                    <Button disabled={!records[0]} type="ghost" onClick={this.handleExport}>{this.props.intl.formatMessage(STRING_GIFT.doja0cxma25)}</Button>
                                </Popover>
                            </Col>
                        )
                    }
                </Col>
            </div>
        )
    }
    handleExport = () => {
        const { keyword } = this.state;
        const eventEntity = this.props.record.eventInfo.data;
        const { itemID: eventID, eventName } = eventEntity;
        axiosData(
            '/crm/export/exportEventCustomer.ajax',
            { eventID, eventName, keyword },
            null,
            { path: 'data' },
        ).then(records => {
            if (records.sameRequest) {
                this.setState({
                    popContent: '已有导出任务 请勿重复操作，',
                    popA: '查看导出结果',
                    sameItemID: records.sameItemID,
                })
            } else {
                this.setState({
                    popContent: '数据导出中 请',
                    popA: '查看导出进度',
                })
            }
            if (records.highMoment == 1) {
                this.setState({
                    popContent: <div><p style={{ whiteSpace: 'nowrap' }}>营业高峰期(11:00-14:00,17:00</p><p style={{ whiteSpace: 'nowrap' }}>-20:30)暂停使用数据导出功能</p></div>,
                    popA: '',
                    tooltipVisble: true,
                })
            } else {
                this.setState({
                    tooltipVisble: false,
                })
            }
            this.setState({
                popoverVisible: true,
            });
        })
    }
    renderPopOver = () => {
        const { popContent = '', popA = '' } = this.state;
        return (
            <div className={styles.popDiv} style={{ width: this.state.tooltipVisble ? 160 : 'auto' }}>
                <span>{popContent}</span>
                <a className={styles.greenLink} onClick={this.openOther}>{popA}</a>
            </div>
        );
    }
    renderDetailPopOver = () => {
        const { detailPopContent = '', detailPopA = '' } = this.state;
        return (
            <div className={styles.popDiv} style={{ width: this.state.detailPopoverVisible ? 160 : 'auto' }}>
                <span>{detailPopContent}</span>
                <a className={styles.greenLink} onClick={this.openDetailOther}>{detailPopA}</a>
            </div>
        );
    }
    openDetailOther = () => {
        this.setState({
            detailPopoverVisible: false,
        });
        this.setState({
            exportDetailVisible: true,
        });
    }
    openOther = () => {
        this.setState({
            popoverVisible: false,
        });
        this.setState({
            exportVisible: true,
        });
    };
    handleVisibleChange = visible => {
        this.setState({ popoverVisible: visible });
    };
    handleDetailVisibleChange = visible => {
        this.setState({ detailPopoverVisible: visible });
    }
    renderCollectPointsTable() {
        const columns = [
            {
                title: '累计获得点数',
                dataIndex: 'totalCount',
                key: 'totalCount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
            {
                title: '可兑换点数总计',
                dataIndex: 'notUsedCount',
                key: 'notUsedCount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
            {
                title: '已兑换点数总计',
                dataIndex: 'usedCount',
                key: 'usedCount',
                className: 'TableTxtRight',
                render: data => data || 0,
            },
        ];
        let dataSource;
        try {
            const data = this.props.mySpecialActivities.data.eventInfo.collectPointCardData || {};
            dataSource = [{
                ...data,
                total: (data.usedCount || 0) + (data.notUsedCount || 0),
            }];
        } catch (e) {
            dataSource = [];
        }
        return (
            <Table dataSource={dataSource} columns={columns} bordered={true} pagination={false} />
        );
    }

    handleInputChange(e) {
        this.setState({
            keyword: e.target.value,
        })
    }


    // 查询 关键字、等级
    query(needReset = false) {
        const user = this.props.user;
        const opts = {
            eventID: this.state.eventInfo.data.itemID,
            groupID: user.accountInfo.groupID,
            pageNo: needReset ? 1 : this.state.pageNo,
            pageSize: this.state.pageSize
        };
        if (this.state.keyword !== '') {
            opts.keyword = this.state.keyword;
        }
        this.props.fetchUserList(
            {
                data: opts,
            }
        );
        const { eventWay } = this.state.eventInfo.data;
        this.props.fetchDetailData(
            {
                data: {
                    groupID: user.accountInfo.groupID,
                    itemID: this.state.eventInfo.data.itemID,
                    actionFrom: '1'
                },
                eventWay,
            }
        );
    }

    handleUserTablePageChange(pageNo, pageSize) {
        this.setState({ pageNo, pageSize }, () => this.query());
    }
    handleDetailTablePageChange = (pageNo, pageSize) => {
        this.setState({ detailPageNo: pageNo, detailPageSize: pageSize }, () => {
            this.handleDetailModalOpen(this.state.currentOperateId)
        });
    }
    handleUserTablePageSizeChange(current, pageSize) {
        this.setState({ pageNo: 1, pageSize }, () => this.query(true));
    }
    handleDetailTablePageSizeChange = (current, detailPageSize) => {
        this.setState({ detailPageNo: 1, detailPageSize }, () => {
            this.handleDetailModalOpen(this.state.currentOperateId)
        });
    }

    handleInviteeModalOpen = (record) => {
        this.setState({
            inviteeModalVisble: true,
            selectedInviter: record,
        })
    }

    handleGiftDetailModalOpen = (record) => {
        this.setState({
            giftDetailModalVisble: true,
            selectedInviter: record,
        })
    }
    handleDetailModalOpen = (itemID, ifSuccess) => {
        const {
            detailPageNo,
            detailPageSize,
        } = this.state
        const { setVisible } = this.props
        setVisible && setVisible(false)
        this.setState({ detailModalVisible: true, currentOperateId: itemID, detailLoading: true })
        axiosData(
            '/specialPromotion/queryEventCollectPointDetail.ajax',
            {
                pageSize: detailPageSize,
                pageNo: detailPageNo,
                eventCustomerID: itemID,
                // eventCustomerID: '7083795896185392021',
            },
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then(({ totalSize = 0, pageNo = 1, pageSize, ...res }) => {
            this.setState({
                detailDataSource: res.collectPointDetailList ? res.collectPointDetailList : [],
                detailTotal: totalSize,
                detailPageNo: pageNo,
                detailPageSize: pageSize,
                detailLoading: false,
            })
            if (ifSuccess) {
                message.success('刷新成功')
            }
        }).catch((err) => {
            this.setState({
                detailLoading: false,
            })
        })
    }

    handleAdjustModalOpen = (record) => {
        this.setState({
            collectPointAdjustLst: record,
            collectPointAdjustVisible: true,
        })
    }

    checkChannel = (record) => {
        axiosData(
            '/specialPromotion/queryEventCustomerJoinChannel.ajax',
            { eventCustomerItemID: record.itemID },
            {},
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then((res) => {
            if (res.code == '000') {
                Modal.success({
                    title: '投放渠道',
                    content: res.data.launchChannelName || '',
                    okText: '确定',
                    iconType: 'info-circle-o',
                })
            }
        }).catch((err) => {
        })
    }

    // 活动参与表格
    renderActivityInfoTable() {
        const hasChannelActivity = [20, 21, 22, 30, 65, 68, 66, 83, 79]
        const eventWay = this.state.eventInfo.data.eventWay;
        const columns = [
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d31f11d5hd613295)}`,
                dataIndex: 'idx',
                key: 'idx',
                className: 'TableTxtCenter',
                width: 30,
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSize + Number(index + 1);
                }
            },
            eventWay == 83 && ({
                title: '口令',
                dataIndex: 'participateMark',
                key: 'participateMark',
                className: 'TableTxtCenter',
                width: 100,
                render: (text) => {
                    return (<Tooltip title={text || ''}>{text}</Tooltip>)
                }
            }),
            {
                title: `${isZhouheiya() ? '会员号' : this.props.intl.formatMessage(STRING_SPE.d1kgf6ij82123282)}`,
                dataIndex: `${isZhouheiya() ? 'cardNO' : 'customerID'}`,
                key: `${isZhouheiya() ? 'cardNO' : 'customerID'}`,
                width: 150,
                className: 'TableTxtCenter',
                render: (text) => {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: eventWay == 65 ? `${this.props.intl.formatMessage(STRING_SPE.d454fhnprm24286)}` : `${this.props.intl.formatMessage(STRING_SPE.de8g85ajma25216)}`,
                dataIndex: 'name',
                key: 'name',
                className: 'TableTxtCenter',
                width: 100,
                render: (text) => {
                    return (<Tooltip title={text || ''}>{text}</Tooltip>)
                }
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.da9060bn7g26184)}`,
                dataIndex: 'telephoneNo',
                key: 'telephoneNo',
                className: 'TableTxtRight',
                width: 100,
                render: (text) => {
                    return (<Tooltip title={text || ''}>{text}</Tooltip>)
                }
            },
            eventWay == 20 && ({
                title: `${this.props.intl.formatMessage(STRING_SPE.de8g85ajmb27114)}`,
                dataIndex: 'winFlag',
                key: 'winFlag',
                className: 'TableTxtCenter',
                width: 100,
                render: (level) => {
                    if (!level) return '--'
                    if (level === -1) return `${this.props.intl.formatMessage(STRING_SPE.de8g85ajmb28176)}`
                    return `${levelArray[level - 1]}${this.props.intl.formatMessage(STRING_SPE.dd5aa2689df29246)}`
                }
            }),
            eventWay == 78 && ({
                title: `${this.props.intl.formatMessage(STRING_SPE.de8g85ajmb27114)}`,
                dataIndex: 'winFlag',
                key: 'winFlag',
                className: 'TableTxtCenter',
                width: 100,
                render: (level) => {
                    if (!level) return '--'
                    if (level === -1) return `${this.props.intl.formatMessage(STRING_SPE.de8g85ajmb28176)}`
                    return `奖项${levelArray[level - 1]}`
                }
            }),
            eventWay !== 75 && ({
                title: `${this.props.intl.formatMessage(STRING_SPE.du3bopq1r4120)}`,
                dataIndex: 'joinTime',
                key: 'joinTime',
                className: 'TableTxtCenter',
                width: 180,
            }),
            eventWay == 23 && ({
                title: '参与位置',
                dataIndex: 'enterPosition',
                key: 'enterPosition',
                className: 'TableTxtCenter',
                width: 120,
            }),
            // 群发礼品
            eventWay == 53 && ({
                title: '礼品详情',
                dataIndex: 'look',
                key: 'look',
                className: 'TableTxtCenter',
                width: 40,
                render: (text, record) => {
                    return (<a onClick={() => this.handleGiftDetailModalOpen(record)}>查看</a>)
                }
            }),
            eventWay == 75 && ({
                title: '已集点数',
                dataIndex: 'pointCount',
                key: 'pointCount',
                className: 'TableTxtCenter',
                width: 100,
                render: (text, record) => {
                    return (record.joinCount + record.remainIngNum)
                }
            }),
            eventWay == 75 && ({
                title: '兑换点数',
                dataIndex: 'joinCount',
                key: 'joinCount',
                className: 'TableTxtCenter',
                width: 100,
                render: joinCount => joinCount || 0,
            }),
            eventWay == 75 && ({
                title: '操作',
                dataIndex: 'operate',
                key: 'operate',
                className: 'TableTxtCenter',
                width: 100,
                render: (text, record) => {
                    return <div>
                        <a onClick={this.handleDetailModalOpen.bind(this, record.itemID)}>
                        详情
                    </a>
                    <a onClick={() => {this.handleAdjustModalOpen(record)}}>
                        调整
                    </a>
                    </div>
                }
            })
        ];
        if (eventWay == 65) { // 分享裂变活动表格不太一样
            columns.push({
                title: `${this.props.intl.formatMessage(STRING_SPE.d7el6blifo14268)}`,
                dataIndex: 'joinCount',
                key: 'joinCount',
                className: 'TableTxtCenter',
                render: (text, record) => {
                    if (text > 0) {
                        return (<a onClick={() => this.handleInviteeModalOpen(record)} title={text}>{text}</a>)
                    }
                    return text
                }
            })
        }
        if (eventWay == 66 || eventWay == 91) { // 膨胀大礼包
            columns.push({
                title: `助力人数`,
                dataIndex: 'joinCount',
                key: 'joinCount',
                className: 'TableTxtCenter',
                render: (text, record) => {
                    if (text > 0 && eventWay == 66) {
                        return (<a onClick={() => this.handleInviteeModalOpen(record)} title={text}>{text}</a>)
                    }
                    return text
                }
            })
        }
        if (eventWay == 95) { // 限时秒杀
            columns.push({
                title: `秒杀礼品`,
                dataIndex: 'giftName',
                key: 'giftName',
                className: 'TableTxtCenter',
            },
            {
                title: `订单号`,
                dataIndex: 'orderNo',
                key: 'orderNo',
                className: 'TableTxtCenter',
            })
        }
        if (eventWay == 68) { // 推荐有礼活动表格不一样
            columns.pop();
            columns.push(...[
                {
                    title: `${this.props.intl.formatMessage(STRING_SPE.d170132798db30202)}`,
                    dataIndex: 'joinCount',
                    key: 'joinCount',
                    className: 'TableTxtCenter',
                    render: (text, record) => {
                        if (text > 0) {
                            return (<a onClick={() => this.handleInviteeModalOpen(record)} title={text}>{text}</a>)
                        }
                        return text
                    }
                },
                {
                    title: `获得积分`,
                    dataIndex: 'accumulativePoint',
                    key: 'accumulativePoint',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `已充值积分`,
                    dataIndex: 'receivedPoint',
                    key: 'receivedPoint',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `获得卡值`,
                    dataIndex: 'accumulativeMoney',
                    key: 'accumulativeMoney',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `已充值卡值`,
                    dataIndex: 'receivedMoney',
                    key: 'receivedMoney',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `获得现金`,
                    dataIndex: 'redPackageMoney',
                    key: 'redPackageMoney',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `已提现金额`,
                    dataIndex: 'rechargedRedPackageMoney',
                    key: 'rechargedRedPackageMoney',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `获得礼品数量`,
                    dataIndex: 'giftCount',
                    key: 'giftCount',
                    className: 'TableTxtRight',
                    width: 200,
                },
                {
                    title: `已核销礼品数量`,
                    dataIndex: 'validGiftCount',
                    key: 'validGiftCount',
                    className: 'TableTxtRight',
                    width: 200,
                },
            ]);
        }
        if (hasChannelActivity.includes(eventWay)) {
            columns.push({
                title: '投放渠道',
                dataIndex: 'lanchChannel',
                key: 'lanchChannel',
                className: 'TableTxtCenter',
                render: (text, record) => {
                    return <a onClick={() => this.checkChannel(record)}>查看</a>
                }
            })
        }
        const userInfo = this.state.userInfo || [];
        const dataSource = userInfo.map((user, index) => {
            return {
                ...user,
                key: `${index}`,
                name: user.customerName,
                telephoneNo: user.customerMobile,
                joinTime: moment(new Date(parseInt(user.createTime))).format('YYYY-MM-DD HH:mm:ss'),
                joinCount: user.joinCount || 0,
                giftName: user.giftName || '',
                orderNo: user.orderNo || '',
            }
        });
        let len = null;
        if (eventWay == 68) {
            len = 2000
        }
        if (eventWay == 66) {
            len = 700
        }
        if (eventWay == 75) {
            len = 900
        }
        return (
            <Table
                dataSource={dataSource}
                columns={columns.filter(Boolean)}
                bordered={true}
                scroll={[66, 68, 75].includes(eventWay) ? { x: len } : {}}
                pagination={{
                    current: this.state.pageNo,
                    total: this.state.total,
                    showQuickJumper: true,
                    showSizeChanger: false, // 暂时不改变pageSize
                    onShowSizeChange: this.handleUserTablePageSizeChange,
                    pageSize: this.state.pageSize,
                    showTotal: (total, range) => `${this.props.intl.formatMessage(STRING_SPE.d2b1c6b31a93638)} ${range[0]} - ${range[1]} / ${this.props.intl.formatMessage(STRING_SPE.dk46lj779a7119)} ${total} ${this.props.intl.formatMessage(STRING_SPE.d34ikgs6o6845)}`,
                    pageSizeOptions: ['5', '10', '20', '40'],
                    onChange: this.handleUserTablePageChange
                }}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mySpecialActivities: state.sale_mySpecialActivities_NEW.get('$specialDetailInfo').toJS(),
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserList: (opts) => {
            dispatch(fetchSpecialUserList(opts))
        },
        fetchDetailData: (opts) => {
            dispatch(fetchSpecialPromotionDetailData(opts))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialPromotionDetail);
