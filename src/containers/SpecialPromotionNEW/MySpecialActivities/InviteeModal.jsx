import React, { Component } from 'react';
import {
    Modal,
    Table,
    Button,
    Tooltip,
} from 'antd';
import { COMMON_LABEL } from 'i18n/common';
import { axiosData } from '../../../../src/helpers/util';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
export default class InviteeModal extends Component {
    state = {
        inviteeList: [],
        pageSize: 10,
        pageNo: 1,
        total: 0,
        loading: false,
        columns: [
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'idx',
                key: 'idx',
                className: 'TableTxtCenter',
                width: 30,
                render:(text, record, index)=> {
                    return (this.state.pageNo - 1) * this.state.pageSize + Number(index + 1);
                }
            },
            {
                title: this.props.eventWay == '66' ? '发起人姓名' : `${this.props.intl.formatMessage(STRING_SPE.dd5aa1522390285)}`,
                dataIndex: 'name1',
                key: 'name1',
                className: 'TableTxtCenter',
                width: 100,
                render:()=> {
                    return (<Tooltip title={this.props.inviterName}>{this.props.inviterName}</Tooltip>)
                }
            },
            {
                title: this.props.eventWay == '66' ? '助力人客户编号' :`${this.props.intl.formatMessage(STRING_SPE.d7h8373fa521206)}`,
                dataIndex: 'customerID',
                key: 'customerID',
                width: 180,
                className: 'TableTxtCenter',
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: this.props.eventWay == '66' ? '助力人姓名' : `${this.props.intl.formatMessage(STRING_SPE.d2c8g8isr22297)}`,
                dataIndex: 'customerName',
                key: 'customerName',
                className: 'TableTxtCenter',
                width: 100,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: this.props.eventWay == '66' ? '助力人手机号' : `${this.props.intl.formatMessage(STRING_SPE.d1e09h0b4c3220)}`,
                dataIndex: 'customerMobile',
                key: 'customerMobile',
                className: 'TableTxtCenter',
                width: 140,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: `${this.props.intl.formatMessage(STRING_SPE.du3bopq1r4120)}`,
                dataIndex: 'createTime',
                key: 'createTime',
                className: 'TableTxtCenter',
            },
        ]
    }

    componentDidMount() {
        this.handleQuery(1);
    }

    handleQuery = (pageNum = 1) => {
        const { pageSize } = this.state;
        const {
            eventID,
            inviterID: customerID,
        } = this.props;
        this.setState({
            loading: true,
        })
        axiosData(
            '/specialPromotion/queryEventShareCustomer.ajax',
            {
                pageSize,
                pageNo: pageNum,
                eventID,
                customerID,
            },
            {},
            {path: ''},
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        ).then(({eventCustomers = [], totalSize = 0, pageNo = 1}) => {
            this.setState({
                inviteeList: Array.isArray(eventCustomers) ? eventCustomers : [],
                total: totalSize,
                pageNo,
                loading: false,
            })
        }).catch(() => {
            this.setState({
                loading: false,
            })
        })
    }

    handlePageChange = (pageNo) => {
        this.handleQuery(pageNo)
    } 

    render() {
        const handleModalClose = this.props.onClose;
        return (
            <Modal
                title={this.props.eventWay == '66' ? '助力人详情' : this.props.intl.formatMessage(STRING_SPE.dk46lj779a5228)}
                visible={true}
                onCancel={handleModalClose}
                maskClosable={false}
                width={900}
                footer={[<Button key="0" type="ghost" onClick={handleModalClose}>{COMMON_LABEL.close}</Button>]}
            >
                <Table
                    dataSource={this.state.inviteeList}
                    columns={this.state.columns}
                    loading={this.state.loading}
                    bordered={true}
                    pagination={{
                        current: this.state.pageNo,
                        total: this.state.total,
                        showQuickJumper: true,
                        showSizeChanger: false, // 暂时不改变pageSize
                        pageSize: this.state.pageSize,
                        showTotal: (total, range) => `${this.props.intl.formatMessage(STRING_SPE.d2b1c6b31a93638)} ${range[0]} - ${range[1]} / ${this.props.intl.formatMessage(STRING_SPE.dk46lj779a7119)} ${total} ${this.props.intl.formatMessage(STRING_SPE.d34ikgs6o6845)}`,
                        onChange: this.handlePageChange
                    }}
                />
            </Modal>
        )
    }
}
