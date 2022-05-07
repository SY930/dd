import React, { Component } from 'react';
import { Form, Input, Button, Table, Select, Row, Col } from 'antd'

const { Option } = Select

class PureTable extends Component {
    state = {
        dyOrderID: '',
        couponCode: '',
    }


    handleSubmit = () => {
        const { getData } = this.props;
        getData({ dyOrderID: this.state.dyOrderID, couponCode: this.state.couponCode });
    }

    handleExport = () => {

    }

    render() {
        const { tableHeight, columns, loading, dataSource, page, style } = this.props
        // console.log("🚀 ~ file: PureTable.jsx ~ line 34 ~ PureTable ~ render ~ page", page)
        return (
            <Row>
                <Form layout="inline" style={style}>
                    <Form.Item
                        label="第三方订单号"
                        // labelCol={{ span: 7 }}
                        // wrapperCol={{ span: 14 }}
                    >
                        <Input
                            placeholder="请输入第三方订单号"
                            onChange={(e) => {
                                this.setState({ dyOrderID: e.target.value })
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="优惠券码"
                    >
                        <Input
                            placeholder="请输入优惠券码"
                            onChange={(e) => {
                                this.setState({ couponCode: e.target.value })
                            }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={() => { this.handleSubmit() }}>
                            查询
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type="ghost" onClick={() => { this.handleExport() }}>
                            导出
                        </Button>
                    </Form.Item>
                </Form>
                <div className="layoutsLineBlock" style={{ margin: '12px 0 20px' }}></div>
                <div style={{ ...style, overflow: 'auto', height: 'calc(100vh - 200px)' }}>
                    <Table
                        key={Math.random()}
                        scroll={{ y: tableHeight, x: 1500 }}
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={{
                            pageSize: page.pageSize,
                            current: page.pageNo,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            onShowSizeChange: (pageNo, pageSize) => {
                                this.props.getData({ dyOrderID: this.state.dyOrderID, couponCode: this.state.couponCode, pageNo, pageSize })
                            },
                            onChange: (_page, pageSize) => {
                                this.props.getData({ dyOrderID: this.state.dyOrderID, couponCode: this.state.couponCode, pageNo: _page, pageSize })
                            },
                            total: page.total,
                            showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                        }}
                    />
                </div>
            </Row>
        )
    }
}

export default PureTable;
