import React, { Component } from 'react';
import { Table, Form, DatePicker, Row, Col, Button, Tooltip } from 'antd'
import { axiosData } from '../../../../helpers/util'

const { RangePicker } = DatePicker

class SendRecords extends Component {

  state = {
    pageSize: 10,
    pageNo: 1,
    total: 0,
    filters: {},
  }

  componentDidMount() {
    this.getSendRecordList({
      pageNo: 1,
      pageSize: 10,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { activeKey } = nextProps
    if(activeKey == 'send_gift') {
      this.getSendRecordList({
        pageNo: 1,
        pageSize: 10,
      })
    }
  }
  getSendRecordList = (params) => {
    params.giftItemID = this.props.giftItemID
    axiosData('/coupon/sendCouponService_queryBusinessSendRecord.ajax', { ...params }, {}, { path: '' }, 'HTTP_SERVICE_URL_PROMOTION_NEW')
      .then((records) => {
        this.setState({
          list: records.data.sendRecordDetailList || [],
          total: records.data.totalSize || 0,
        })
      }).catch(err => {
        // empty catch
      });
  }

  handlePageChange = (pageNo, pageSize) => {
    this.setState({
      pageNo,
      pageSize,
    });
    this.getSendRecordList({
      pageNo,
      pageSize,
      ...this.state.filters,
    })
  }

  queryData = () => {
    const { time } = this.props.form.getFieldsValue()
    const params = {
      createStampStart: time && time.length ? time[0].format('YYYY-MM-DD HH:mm:ss') : '',
      createStampEnd: time && time.length ? time[1].format('YYYY-MM-DD HH:mm:ss') : '',
    }
    this.setState({ filters: params })
    this.getSendRecordList(params)
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { pageSize, pageNo, total, list } = this.state
    const columns = [
      {
        title: '序号',
        key: 'index',
        width: 60,
        render: (text, record, index) => {
          return (pageNo - 1) * pageSize + index + 1
        }
      },
      {
        title: '券编码',
        key: 'giftItemID',
        width: 150,
        render: (text) => {
          return this.props.giftItemID
        }
      },
      {
        title: '赠送时间',
        key: 'createStamp',
        dataIndex: 'createStamp',
        width: 180,
      },
      {
        title: '赠送手机号',
        key: 'customerMobile',
        dataIndex: 'customerMobile',
        width: 120,
      },
      {
        title: '赠送数量',
        key: 'giftNum',
        dataIndex: 'giftNum',
        width: 100,
      },
      {
        title: '生效时间',
        key: 'effectTime',
        dataIndex: 'effectTime',
        width: 180,
      },
      {
        title: '失效时间',
        key: 'validUntilDate',
        dataIndex: 'validUntilDate',
        width: 180,
      },
      {
        title: '操作人',
        key: 'operator',
        dataIndex: 'operator',
        width: 120,
      },
      {
        title: '备注',
        key: 'operateRemark',
        dataIndex: 'operateRemark',
        width: 180,
        render: (text) => {
          return text ? <Tooltip title={text}>{text}</Tooltip> : '--'
        }
      },
    ]
    return (
      <Row type="flex">
        <Col span={21}>
          <Form layout='inline'>
            <Form.Item label='赠送时间' wrapperCol={{ span: 18 }} labelCol={{ span: 6 }}>
              {getFieldDecorator("time", {
              })(<RangePicker showTime format='YYYY-MM-DD HH:mm:ss' />)}
            </Form.Item>
          </Form>
        </Col>
        <Col span={3}><Button type='primary' icon="search" onClick={this.queryData}>查询</Button></Col>
        <Col span={24}>
          <Table
            bordered={true}
            columns={columns}
            dataSource={list}
            scroll={{ x: 1400 }}
            rowKey='index'
            pagination={{
              showSizeChanger: true,
              pageSize: pageSize,
              current: pageNo,
              total: total,
              showQuickJumper: true,
              onChange: this.handlePageChange,
              onShowSizeChange: this.handlePageChange,
              showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
            }}
          />
        </Col>
      </Row>
    )
  }
}

export default Form.create()(SendRecords)