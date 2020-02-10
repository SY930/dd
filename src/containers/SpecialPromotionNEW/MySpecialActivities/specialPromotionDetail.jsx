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

import { connect } from 'react-redux';
import {
    Modal,
    Row,
    Col,
    Table,
    Input,
    Select,
    Button,
    Tooltip
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
import { axiosData } from '../../../helpers/util';
const levelArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
import { injectIntl } from 'i18n/common/injectDecorator';
import { STRING_SPE } from 'i18n/common/special';
import { STRING_GIFT } from 'i18n/common/gift';

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
            inviteeModalVisble: false,
            selectedInviter: null,
            recommendStatitics: [],
        };
        this.handleUserTablePageChange = this.handleUserTablePageChange.bind(this);
        this.handleUserTablePageSizeChange = this.handleUserTablePageSizeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.query = this.query.bind(this);
        this.resetQuery = this.query.bind(this, true); // 手动点击查询， 视为刷新， 从第1页开始
    }

    componentDidMount() {
        const eventEntity = this.props.record.eventInfo.data;
        if (eventEntity.eventWay == 68) {
            axiosData(
                '/specialPromotion/queryRecommendEventData.ajax',
                {eventID: eventEntity.itemID},
                {needThrow: true},
                {path: ''},
                'HTTP_SERVICE_URL_PROMOTION_NEW',
            ).then(res => {
                this.setState({
                    recommendStatitics: [res],
                })
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

    render() {
        return (
            <div className={styles.showInfo}>
                {this.renderBaseInfo()}
                {this.renderActivityDetailInfo()}
                {
                    this.state.inviteeModalVisble && (
                        <InviteeModal
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
            <div>
                <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d2c8987eai0135)}</h5>
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
                    record.eventStartDate !== '20000101' && record.eventEndDate !== '29991231' &&
                        record.eventStartDate !== '0' && record.eventEndDate !== '0' ?
                        (
                            <Row>
                                <Col span={4} style={{ textAlign: 'right' }}>{this.props.intl.formatMessage(STRING_SPE.db60c8ac0a379138)}</Col>
                                <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                                <Col span={18} style={{ textAlign: 'left' }}>
                                    {`${moment(record.eventStartDate, 'YYYY/MM/DD').format('YYYY/MM/DD')} - ${moment(record.eventEndDate, 'YYYY/MM/DD').format('YYYY/MM/DD')}`}
                                </Col>
                            </Row>
                        ) : null
                }
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>{this.props.intl.formatMessage(STRING_SPE.d7ekp859lc11113)}</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.eventRemark}</Col>
                </Row>
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
        if (way == 68) {
            return (
                <div>
                    <h5><span></span>{this.props.intl.formatMessage(STRING_SPE.d16hh2cja4h0276)}</h5>
                    <div>{this.props.intl.formatMessage(STRING_SPE.d31f11d5hd51190)}</div>
                    <Col span={24}>
                        {this.renderGiftInfoTable(records.filter(record => record.recommendType !== 0))}
                    </Col>
                    <div>&nbsp;</div>
                    <Col span={24}>
                        {this.renderRecommendStatisticsTable()}
                    </Col>
                    <div>{this.props.intl.formatMessage(STRING_SPE.da9060bn7f2110)}</div>
                    <Col span={24}>
                        {this.renderGiftInfoTable(records.filter(record => record.recommendType === 0))}
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
                    <Col style={{ marginTop: 10 }} span={12}>
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
                    {this.renderGiftInfoTable(records)}
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
    renderGiftInfoTable(records) {
        const way = this.state.eventInfo.data.eventWay;
        const { intl } = this.props;
        const columns = [
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
                title: way != '20' && way != '21' && way != '30' && way != '70' ?
                    `${this.props.intl.formatMessage(STRING_SPE.dojv8nhwu12190)}` : `${this.props.intl.formatMessage(STRING_SPE.d7ekp2h8kc13243)}`,
                dataIndex: 'EGiftSingleCount',
                key: 'EGiftSingleCount',
                className: 'TableTxtRight',
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
        const dataSource = records.map((gift, index) => {
            let days;
            if (!gift.giftValidUntilDayCount > 0) {
                const start = Moment(gift.effectTime, 'YYYYMMDDHHmmss').unix();// gift.effectTime:'20171030120000'
                const end = Moment(gift.validUntilDate, 'YYYYMMDDHHmmss').unix();
                days = Math.floor((end - start) / (3600 * 24)) + 1;
            }
            return {
                key: `${index}`,
                idx: `${index}`,
                EGiftName: gift.giftName,
                EGiftSingleCount: way != '20' && way != '21' && way != '30' && way != '70' ?
                    gift.giftCount : gift.giftTotalCount,
                EGiftSendCount: gift.giftSendCount,
                EGfitValidUntilDayCount: gift.giftValidUntilDayCount > 0 ? gift.giftValidUntilDayCount : days,
                resumeGiftsCount: gift.resumeGiftsCount || 0,
                resumeGiftsCountPercent: gift.giftSendCount == 0 ? '0%' : `${Math.round((gift.resumeGiftsCount || 0) / (gift.giftSendCount) * 10000) / 100}%`,
            }
        });
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

    renderSearch() {
        return (
            <div className={styles.searchBar}>
                <Col span={24}>
                    <Col span={3}>{this.props.intl.formatMessage(STRING_SPE.d5672ba595d82123)}</Col>
                    <Col span={6}><Input onBlur={this.handleInputChange} /></Col>
                    <Col span={4}><Button type="primary" onClick={this.resetQuery}>{this.props.intl.formatMessage(STRING_SPE.da9060bn7g2223)}</Button></Col>
                </Col>
            </div>
        )
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
        this.props.fetchDetailData(
            {
                data: {
                    groupID: user.accountInfo.groupID,
                    itemID: this.state.eventInfo.data.itemID,
                },
            }
        );
    }

    handleUserTablePageChange(pageNo, pageSize) {
        this.setState({pageNo, pageSize}, () => this.query());
    }

    handleUserTablePageSizeChange(current, pageSize) {
        this.setState({pageNo: 1, pageSize}, () => this.query(true));
    }

    handleInviteeModalOpen = (record) => {
        this.setState({
            inviteeModalVisble: true,
            selectedInviter: record,
        })
    }

    // 活动参与表格
    renderActivityInfoTable() {
        const eventWay = this.state.eventInfo.data.eventWay;
        const columns = [
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d31f11d5hd613295)}`,
                dataIndex: 'idx',
                key: 'idx',
                className: 'TableTxtCenter',
                width: 30,
                render:(text, record, index)=> {
                    return (this.state.pageNo - 1) * this.state.pageSize + Number(index + 1);
                }
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.d1kgf6ij82123282)}`,
                dataIndex: 'customerID',
                key: 'customerID',
                width: 180,
                className: 'TableTxtCenter',
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: eventWay == 65 ? `${this.props.intl.formatMessage(STRING_SPE.d454fhnprm24286)}` : `${this.props.intl.formatMessage(STRING_SPE.de8g85ajma25216)}`,
                dataIndex: 'name',
                key: 'name',
                className: 'TableTxtCenter',
                width: 100,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.da9060bn7g26184)}`,
                dataIndex: 'telephoneNo',
                key: 'telephoneNo',
                className: 'TableTxtRight',
                width: 100,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            eventWay == 20 && ({
                title: `${this.props.intl.formatMessage(STRING_SPE.de8g85ajmb27114)}`,
                dataIndex: 'winFlag',
                key: 'winFlag',
                className: 'TableTxtCenter',
                width: 100,
                render:(level)=> {
                    if (!level) return '--'
                    if (level === -1) return `${this.props.intl.formatMessage(STRING_SPE.de8g85ajmb28176)}`
                    return `${levelArray[level - 1]}${this.props.intl.formatMessage(STRING_SPE.dd5aa2689df29246)}`
                }
            }),
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.du3bopq1r4120)}`,
                dataIndex: 'joinTime',
                key: 'joinTime',
                className: 'TableTxtCenter',
                width: 160,
            },
        ];
        if (eventWay == 65) { // 分享裂变活动表格不太一样
            columns.push({
                title: `${this.props.intl.formatMessage(STRING_SPE.d7el6blifo14268)}`,
                dataIndex: 'joinCount',
                key: 'joinCount',
                className: 'TableTxtCenter',
                render:(text, record)=> {
                    if (text > 0) {
                        return (<a onClick={() => this.handleInviteeModalOpen(record)} title={text}>{text}</a>)
                    }
                    return text
                }
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
                    render:(text, record)=> {
                        if (text > 0) {
                            return (<a onClick={() => this.handleInviteeModalOpen(record)} title={text}>{text}</a>)
                        }
                        return text
                    }
                },
                {
                    title: `${this.props.intl.formatMessage(STRING_SPE.de8g85ajmb31180)}`,
                    dataIndex: 'accumulativeMoney',
                    key: 'accumulativeMoney',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `${this.props.intl.formatMessage(STRING_SPE.d7elca8l7h3286)}`,
                    dataIndex: 'unclaimedMoney',
                    key: 'unclaimedMoney',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `${this.props.intl.formatMessage(STRING_SPE.d1kgf6ij82233275)}`,
                    dataIndex: 'receivedMoney',
                    key: 'receivedMoney',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `${this.props.intl.formatMessage(STRING_SPE.db60c96957243426)}`,
                    dataIndex: 'accumulativePoint',
                    key: 'accumulativePoint',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `${this.props.intl.formatMessage(STRING_SPE.dd5aa2689df35188)}`,
                    dataIndex: 'unclaimedPoint',
                    key: 'unclaimedPoint',
                    className: 'TableTxtRight',
                    width: 160,
                },
                {
                    title: `${this.props.intl.formatMessage(STRING_SPE.d5g3ddeg7836148)}`,
                    dataIndex: 'receivedPoint',
                    key: 'receivedPoint',
                    className: 'TableTxtRight',
                    width: 160,
                },
            ]);
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
            }
        });

        return (
            <Table
                dataSource={dataSource}
                columns={columns.filter(Boolean)}
                bordered={true}
                scroll={eventWay == 68 ? {x: 1550} : {}}
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
