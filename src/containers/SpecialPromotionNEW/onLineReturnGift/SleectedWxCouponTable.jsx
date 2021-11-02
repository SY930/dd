import React, { Component } from 'react'
import { Modal, Table, Tooltip, Popconfirm } from 'antd';

const columns = that => ([
    {
        title: '券ID',
        dataIndex: 'itemID',
        key: 'itemID',
        width: 160,
        render: text => text,
    },
    {
        title: '券名称',
        dataIndex: 'batchName',
        key: 'batchName',
        width: 200,
        render: text => <Tooltip title={text}>{text}</Tooltip>,
    }, {
        title: '剩余数量',
        dataIndex: 'stock',
        key: 'stock',
        width: 80,
        render: (text, record) => {
            const { receive } = record
            if (text) {
                return Number(text) - Number(receive)
            }
        },
    }, {
        title: '操作',
        key: 'operation',
        // className: 'TableTxtCenter',
        width: 80,
        // fixed: 'left',
        render: (text, record, index) => {
            return (
                <Popconfirm title="确定要删除吗？" onConfirm={() => that.handleRemove(record.itemID)}>
                    <a href="#"> 删除</a>
                </Popconfirm>
            );
        },
    },
])

class SleectedWxCouponTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 1,
            pageSize: 30,
            // sleectedWxCouponList: props.sleectedWxCouponList,
        }
    }

    handleRemove = (itemID) => {
        const sleectedWxCouponList = this.props.sleectedWxCouponList.filter(item => item.itemID !== itemID)
        this.setState({ sleectedWxCouponList })
        this.props.onWxCouponChange(sleectedWxCouponList);
    }


    render() {
        return (
            <Table
                scroll={{ x: 500 }}
                bordered={true}
                columns={columns(this)}
                dataSource={this.props.sleectedWxCouponList}
                rowKey={'itemID'}
                pagination={false}
            />
        )
    }
}

export default SleectedWxCouponTable
