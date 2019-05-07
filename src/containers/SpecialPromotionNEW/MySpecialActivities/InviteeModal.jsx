import React, { Component } from 'react';
import {
    Modal,
    Table,
    Button,
    Tooltip,
} from 'antd';
import { axiosData } from '../../../../src/helpers/util';

export default class InviteeModal extends Component {

    state = {
        inviteeList: [],
        pageSize: 20,
        pageNo: 1,
        total: 0,
        loading: false,
        columns: [
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
                title: '邀请人姓名',
                dataIndex: 'name1',
                key: 'name1',
                className: 'TableTxtCenter',
                width: 100,
                render:()=> {
                    return (<Tooltip title={this.props.inviterName}>{this.props.inviterName}</Tooltip>)
                }
            },
            {
                title: '受邀请人客户编号',
                dataIndex: 'customerID',
                key: 'customerID',
                width: 180,
                className: 'TableTxtCenter',
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: '受邀请人姓名',
                dataIndex: 'customerName',
                key: 'customerName',
                className: 'TableTxtCenter',
                width: 100,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: '受邀请人手机号',
                dataIndex: 'customerMobile',
                key: 'customerMobile',
                className: 'TableTxtRight',
                width: 140,
                render:(text)=> {
                    return (<Tooltip title={text}>{text}</Tooltip>)
                }
            },
            {
                title: '参与时间',
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
                title="受邀请人详情"
                visible={true}
                onCancel={handleModalClose}
                maskClosable={false}
                width={900}
                footer={[<Button key="0" type="ghost" onClick={handleModalClose}>关闭</Button>]}
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
                        showTotal: (total, range) => `本页 ${range[0]} - ${range[1]} / 共 ${total} 条`,
                        onChange: this.handlePageChange
                    }}
                />
            </Modal>
        )
    }
}
