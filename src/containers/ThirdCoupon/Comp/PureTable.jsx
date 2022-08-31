import React, { Component } from 'react';
import { Form, Input, Button, Table, Select, Row, Popover, message } from 'antd';
import { axios, getStore } from '@hualala/platform-base';
import moment from 'moment'

class PureTable extends Component {
    state = {
        dyOrderID: '',
        couponCode: '',
        popContent: <div><p style={{ whiteSpace: 'nowrap' }}>营业高峰期(11:00-14:00,17:00</p><p style={{ whiteSpace: 'nowrap' }}>-20:30)暂停使用数据导出功能</p></div>,
        tooltipVisble: false,
    }


    getAccountInfo = () => {
        const state = getStore().getState();
        return state.user.get('accountInfo').toJS();
    }

    handleSubmit = () => {
        const { getData } = this.props;
        getData({ dyOrderID: this.state.dyOrderID, couponCode: this.state.couponCode });
    }

    handleChekTime = async () => {
        const method = 'dyCoupon/xfc/verifyHighMoment';
        const response = await axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_PROMOTION_DOUYIN',
            method,
            type: 'post',
            data: { 
            },
        });
        const { code, data, msg } = response;
        if (code === '000') {
            if (data) {
                this.setState({
                    popoverVisible: true,
                });
            } else { // 非高峰
                this.setState({
                    popoverVisible: false,
                });
                this.handleExport();
            }
        } else {
            message.error(`请求出错${msg}， 请重试`)
            this.setState({
                popoverVisible: false,
            });
        }
    }

    handleExport = async () => {
        const { groupID } = this.getAccountInfo()
        const method = '/dyCoupon/xfc/exportCouponOrderList'
        const {batchItemID} = this.props.params;
        const response = await axios.get(`/api/v1/export?groupID=${groupID}&batchItemID=${batchItemID}&dyOrderID=${this.state.dyOrderID}&couponCode=${this.state.couponCode}`, {
            responseType: 'blob',
            params: {
                service: 'HTTP_SERVICE_URL_PROMOTION_DOUYIN',
                method,
                batchItemID
            },
        });
        if (response) {
            const reader = new FileReader();
            reader.readAsDataURL(response); // 转换为base64
            reader.onload = (e) => {
                const a = document.createElement('a');
                const fileName = moment().format('YYYYMMDD HH:mm:ss');
                a.download = `${fileName}.xlsx`;// 下载文件名
                a.href = e.target.result;
                $("body").append(a);
                a.click();
                $(a).remove();
            }
        }
    }

    handleVisibleChange = (visible) => {
        this.setState({ popoverVisible: visible });
    };

    renderPopOver = () => {
        const { popContent = '' } = this.state;
        return (
            <div style={{ width: this.state.tooltipVisble ? 160 : 'auto' }}>
                <span>{popContent}</span>
            </div>
        );
    }

    render() {
        const { tableHeight, columns, loading, dataSource, page, style } = this.props
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
                        <Popover
                            content={this.renderPopOver()}
                            placement="topRight"
                            title={false}
                            trigger="click"
                            visible={this.state.popoverVisible}
                            // onVisibleChange={this.handleVisibleChange}
                        >
                            <Button type="ghost" onClick={this.handleChekTime} disabled={dataSource.length <= 0}>
                                导出
                            </Button>
                        </Popover>
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
