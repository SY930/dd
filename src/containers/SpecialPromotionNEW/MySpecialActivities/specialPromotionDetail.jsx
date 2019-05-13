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
        };
        this.handleUserTablePageChange = this.handleUserTablePageChange.bind(this);
        this.handleUserTablePageSizeChange = this.handleUserTablePageSizeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.query = this.query.bind(this);
        this.resetQuery = this.query.bind(this, true); // 手动点击查询， 视为刷新， 从第1页开始
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
                <h5><span></span>基本信息</h5>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动类型</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{getTitle(record.eventWay)}</Col>
                </Row>
                {
                    record.eventName !== '' ?
                        (
                            <Row>
                                <Col span={4} style={{ textAlign: 'right' }}>活动名称</Col>
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
                                <Col span={4} style={{ textAlign: 'right' }}>活动时间</Col>
                                <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                                <Col span={18} style={{ textAlign: 'left' }}>
                                    {`${moment(record.eventStartDate, 'YYYY/MM/DD').format('YYYY/MM/DD')} - ${moment(record.eventEndDate, 'YYYY/MM/DD').format('YYYY/MM/DD')}`}
                                </Col>
                            </Row>
                        ) : null
                }
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>活动说明</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.eventRemark}</Col>
                </Row>
            </div>
        );
    }

    // 统计信息
    renderActivityDetailInfo() {
        return (
            <div>
                <h5><span></span>统计信息</h5>
                <Col span={24}>
                    {this.renderGiftInfoTable()}
                </Col>

                {this.renderSearch()}
                <Col span={24}>
                    {this.renderActivityInfoTable()}
                </Col>
            </div>
        )
    }
    // 礼品信息表格
    renderGiftInfoTable() {
        const way = this.state.eventInfo.data.eventWay;
        const columns = [
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
                title: '礼品名称',
                dataIndex: 'EGiftName',
                key: 'EGiftName',
                render: (text, record) => {
                    return <span title={record.EGiftName}>{record.EGiftName}</span>
                }
            },
            {
                title: way != '20' && way != '21' && way != '30' && way != '70' ?
                    '礼品个数' : '礼品总数',
                dataIndex: 'EGiftSingleCount',
                key: 'EGiftSingleCount',
                className: 'TableTxtRight',
            },
            {
                title: '发出数量',
                dataIndex: 'EGiftSendCount',
                key: 'EGiftSendCount',
                className: 'TableTxtRight',
            },
            {
                title: '回收数量',
                dataIndex: 'resumeGiftsCount',
                key: 'resumeGiftsCount',
                className: 'TableTxtRight',
            },
            {
                title: '回收比例',
                dataIndex: 'resumeGiftsCountPercent',
                key: 'resumeGiftsCountPercent',
                className: 'TableTxtRight',
            },
            {
                title: '有效天数',
                dataIndex: 'EGfitValidUntilDayCount',
                key: 'EGfitValidUntilDayCount',
                className: 'TableTxtRight',
            },
        ];
        let record = []
        try {
            record = this.props.mySpecialActivities.data.eventInfo.gifts || [];
        } catch (e) {
            record = []
        }
        const dataSource = record.map((gift, index) => {
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

    renderSearch() {
        return (
            <div className={styles.searchBar}>
                <Col span={24}>
                    <Col span={3}>关键字</Col>
                    <Col span={6}><Input onBlur={this.handleInputChange} /></Col>
                    <Col span={4}><Button type="primary" onClick={this.resetQuery}>查询</Button></Col>
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
                title: '序号',
                dataIndex: 'idx',
                key: 'idx',
                className: 'TableTxtCenter',
                width: 30,
                render:(text, record, index)=> {
                    return (this.state.pageNo - 1) * this.state.pageSize + Number(index + 1);
                }
            },
            {
                title: '客户编号',
                dataIndex: 'customerID',
                key: 'customerID',
                width: 180,
                className: 'TableTxtCenter',
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: eventWay == 65 ? '邀请人姓名' : '姓名',
                dataIndex: 'name',
                key: 'name',
                className: 'TableTxtCenter',
                width: 100,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: '手机号',
                dataIndex: 'telephoneNo',
                key: 'telephoneNo',
                className: 'TableTxtRight',
                width: 100,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: '参与时间',
                dataIndex: 'joinTime',
                key: 'joinTime',
                className: 'TableTxtCenter',
                width: 160,
            },
        ];
        eventWay == 65 && columns.push({
            title: '参与次数',
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
        const userInfo = this.state.userInfo || [];
        const dataSource = userInfo.map((user, index) => {
            return {
                key: `${index}`,
                name: user.customerName,
                cardNo: user.cardNO,
                telephoneNo: user.customerMobile,
                customerID: user.customerID,
                joinTime: moment(new Date(parseInt(user.createTime))).format('YYYY-MM-DD HH:mm:ss'),
                joinCount: user.joinCount || 0,

            }
        });

        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered={true}
                pagination={{
                    current: this.state.pageNo,
                    total: this.state.total,
                    showQuickJumper: true,
                    showSizeChanger: false, // 暂时不改变pageSize
                    onShowSizeChange: this.handleUserTablePageSizeChange,
                    pageSize: this.state.pageSize,
                    showTotal: (total, range) => `本页 ${range[0]} - ${range[1]} / 共 ${total} 条`,
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
