import React, { Component } from 'react'
import { Form, Input, Select, Radio, Row, Col, Icon, Modal, message, Button } from 'antd'
import PureTable from '../Comp/PureTable';
import connectTable from '../Comp/TableFactory';

const columns = []

const mapDataToProps = (data) => {
    return data || []
}

const HistoryTable = connectTable({
    callserver: '/crmimport/crmImportService_queryCrmImportHistories.ajax',
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
                width={800}
                visible={true}
                onCancel={onCancel}
                footer={null}
                // confirmLoading={this.state.confirmLoading}
            >
                <HistoryTable />
            </Modal>
        )
    }
}
export default Form.create()(DYCouponInfoMoldeContent);
