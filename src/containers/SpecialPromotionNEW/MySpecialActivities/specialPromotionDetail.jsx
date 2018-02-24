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
import { Modal, Row, Col, Table, Input, Select, Button } from 'antd';

const Option = Select.Option;

import styles from './specialDetail.less'

const Moment = require('moment');

import { fetchSpecialUserList } from '../../../redux/actions/saleCenterNEW/mySpecialActivities.action';
import { CHARACTERISTIC_CATEGORIES, SEND_MSG } from '../../../redux/actions/saleCenterNEW/types';

class SpecialPromotionDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: '',
            cardLevelID: '',
            eventInfo: {
                data: {},
                gifts: [],
            },
            userInfo: [],
            cardInfo: [],
        };

        this.renderBaseInfo = this.renderBaseInfo.bind(this);
        this.renderActivityRangeInfo = this.renderActivityRangeInfo.bind(this);
        this.renderActivityDetailInfo = this.renderActivityDetailInfo.bind(this);
        this.renderGiftInfoTable = this.renderGiftInfoTable.bind(this);
        this.renderSearch = this.renderSearch.bind(this);
        this.renderOptions = this.renderOptions.bind(this);
        this.renderActivityInfoTable = this.renderActivityInfoTable.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.query = this.query.bind(this);
    }

    componentDidMount() {
        const record = this.props.record;
        if (record.eventInfo) {
            this.setState({
                eventInfo: record.eventInfo,
            })
        }
        if (record.cardInfo && record.cardInfo.data && record.cardInfo.data.groupCardTypeList) {
            this.setState({
                cardInfo: record.cardInfo.data.groupCardTypeList,
            })
        }
        if (record.userInfo && record.userInfo.list) {
            record.userInfo.list.forEach((user) => {
                record.cardInfo.data.groupCardTypeList.forEach((cat) => {
                    cat.cardTypeLevelList.forEach((card) => {
                        if (card.cardLevelID === user.cardLevelID) {
                            user.cardTypeName = cat.cardTypeName;
                        }
                    })
                })
            })
        }
        this.setState({
            userInfo: record.userInfo.list,
        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.record !== nextProps.record) {
            if (nextProps.record.eventInfo) {
                this.setState({
                    eventInfo: nextProps.record.eventInfo,
                })
            }
            if (nextProps.record.cardInfo && nextProps.record.cardInfo.data && nextProps.record.cardInfo.data.groupCardTypeList) {
                this.setState({
                    cardInfo: nextProps.record.cardInfo.data.groupCardTypeList,
                })
            }
            if (nextProps.record.userInfo && nextProps.record.userInfo.list) {
                nextProps.record.userInfo.list.forEach((user) => {
                    nextProps.record.cardInfo.data.groupCardTypeList.forEach((cat) => {
                        cat.cardTypeLevelList.forEach((card) => {
                            if (card.cardLevelID === user.cardLevelID) {
                                user.cardTypeName = cat.cardTypeName;
                            }
                        })
                    })
                })
            }
            if (nextProps.record.userInfo && nextProps.record.userInfo.list) {
                this.setState({
                    userInfo: nextProps.record.userInfo.list,
                })
            } else {
                this.setState({
                    userInfo: [],
                })
            }
        }
    }

    render() {
        return (
            <div className={styles.showInfo}>
                {this.renderBaseInfo()}
                {// 开卡赠送没有活动范围
                    this.state.eventInfo.eventWay == '51' ?
                        this.renderActivityRangeInfo() : null
                }
                {this.renderActivityDetailInfo()}
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

    // 活动范围
    renderActivityRangeInfo() {
        const record = this.state.eventInfo.data
        return (
            <div>
                <h5><span></span>活动范围</h5>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>提前赠送天数</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.giftAdvanceDays}</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>是否发送信息</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{
                        SEND_MSG.find((item) => {
                            return item.value === record.smsGate
                        }).label
                    }</Col>
                </Row>
                <Row>
                    <Col span={4} style={{ textAlign: 'right' }}>发送信息模板</Col>
                    <Col span={1} style={{ textAlign: 'center' }}>:</Col>
                    <Col span={18} style={{ textAlign: 'left' }}>{record.smsTemplate}</Col>
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
        const record = this.state.eventInfo.gifts || [];
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
                    <Col span={3}>会员等级</Col>
                    <Col span={6}>
                        <Select size="default" onChange={this.handleSelectChange}>
                            {this.renderOptions()}
                        </Select>
                    </Col>
                    <Col span={4}><Button type="primary" onClick={this.query}>查询</Button></Col>
                </Col>
            </div>
        )
    }

    handleInputChange(e) {
        this.setState({
            keyword: e.target.value,
        })
    }

    handleSelectChange(val) {
        this.setState({
            cardLevelID: val,
        })
    }

    // 查询 关键字、等级
    query() {
        const user = this.props.user;
        const opts = {
            eventID: this.state.eventInfo.data.itemID,
            groupID: user.accountInfo.groupID,
        };
        if (this.state.keyword !== '') {
            opts.keyword = this.state.keyword;
        }
        if (this.state.cardLevelID !== '') {
            opts.cardLevelID = this.state.cardLevelID;
        }
        this.props.fetchUserList(
            {
                data: opts,
            }
        );
    }

    // 会员等级Option
    renderOptions() {
        const cardInfo = this.state.cardInfo;
        let options = [
            <Option key={'0'} value={''}>不限</Option>,
        ];
        options = options.concat(cardInfo.map((cardType) => {
            return cardType.cardTypeLevelList.map((card, index) => {
                return (
                    <Option key={`${index + 1}`} value={card.cardLevelID}>{`${cardType.cardTypeName} - ${card.cardLevelName}`}</Option>
                )
            })
        }));
        return options;
    }
    // 活动参与表格
    renderActivityInfoTable() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'idx',
                key: 'idx',
                className: 'TableTxtCenter',
                width: 30,
                fixed: 'left',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                width: 100,
                fixed: 'left',
            },
            // 性别暂时拿掉
            // {
            //     title: '性别',
            //     dataIndex: 'gender',
            //     key: 'gender',
            //     width: 30
            // },
            {
                title: '卡号',
                dataIndex: 'cardNo',
                key: 'cardNo',
                className: 'TableTxtRight',
                width: 150,
            },
            {
                title: '手机号',
                dataIndex: 'telephoneNo',
                key: 'telephoneNo',
                className: 'TableTxtRight',
                width: 120,
            },
            {
                title: '等级',
                dataIndex: 'level',
                key: 'level',
                className: 'TableTxtLeft',
                width: 200,
            },
            {
                title: '消费累计',
                dataIndex: 'consumptionTotal',
                key: 'consumptionTotal',
                className: 'TableTxtRight',
                width: 20,
            },
            {
                title: '消费次数',
                dataIndex: 'consumptionCount',
                key: 'consumptionCount',
                className: 'TableTxtRight',
                width: 20,
            },
            {
                title: '参与时间',
                dataIndex: 'joinTime',
                key: 'joinTime',
                className: 'TableTxtCenter',
                width: 160,
            },
        ];
        const sexInfo = [
            {
                key: '0',
                lable: '女',
            },
            {
                key: '1',
                lable: '男',
            },
            {
                key: '2',
                lable: '未知',
            },
        ];
        const userInfo = this.state.userInfo || [];
        const dataSource = userInfo.map((user, index) => {
            return {
                key: `${index}`,
                idx: `${index + 1}`,
                name: user.customerName,
                // gender: sexInfo[user.customerSex].lable, // 0 ,1 ,2  女 男  未知
                cardNo: user.cardNO,
                telephoneNo: user.customerMobile,
                level: `${user.cardTypeName}-${user.cardLevelName}`,
                consumptionTotal: user.consumptionTotal,
                consumptionCount: user.consumptionCount,
                joinTime: moment(new Date(parseInt(user.createTime))).format('YYYY-MM-DD HH:mm:ss'),

            }
        });

        return (
            <Table
                dataSource={dataSource}
                columns={columns}
                bordered={true}
                scroll={{ x: 800 }}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        mySpecialActivities: state.sale_mySpecialActivities_NEW.toJS(),
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchUserList: (opts) => {
            dispatch(fetchSpecialUserList(opts))
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SpecialPromotionDetail);
