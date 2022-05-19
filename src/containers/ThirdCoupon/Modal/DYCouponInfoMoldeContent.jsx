import React, { Component } from 'react'
import { Form, Modal } from 'antd'
import PureTable from '../Comp/PureTable';
import connectTable from '../Comp/TableFactory';

const columns = [
    {
        title: '券码',
        key: 'code',
        dataIndex: 'code',
    },
    {
        title: '发放时间',
        key: 'createStamp',
        dataIndex: 'createStamp',
    },
    {
        title: '第三方订单号',
        key: 'dyOrderID',
        dataIndex: 'dyOrderID',
    },
    {
        title: '第三方使用状态',
        key: 'syncStatusName',
        dataIndex: 'syncStatusName',
    },
    {
        title: '哗啦啦使用状态',
        key: 'statusName',
        dataIndex: 'statusName',
    },
    {
        title: '核销门店',
        key: 'shopName',
        dataIndex: 'shopName',
    },
    {
        title: '核销时间',
        key: 'actionStamp',
        dataIndex: 'actionStamp',
    },
    {
        title: '备注',
        key: 'responseMsg',
        dataIndex: 'responseMsg',
    },
]

const mapDataToProps = (data) => {
    return data.list || []
}

const HistoryTable = connectTable({
    callserver: '/dyCoupon/xfc/findCouponList',
    mapDataToProps,
    columns,
})(PureTable);

class DYCouponInfoMoldeContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
    }

    render() {
        const { onCancel } = this.props;
        return (
            <Modal
                title="已发放优惠券列表"
                maskClosable={true}
                width={850}
                visible={true}
                onCancel={onCancel}
                footer={null}
                // confirmLoading={this.state.confirmLoading}
            >
                <HistoryTable params={{ batchItemID: this.props.batchItemID }} />
            </Modal>
        )
    }
}
export default Form.create()(DYCouponInfoMoldeContent);
