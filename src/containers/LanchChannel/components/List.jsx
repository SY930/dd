import React, { Component } from 'react';
import { Table } from 'antd';
import styles from '../style.less'

class List extends Component {

  state = {
    pageSize: 10,
    pageNo: 1,
  }

  onShowSizeChange = (current, pageSize) => {
    this.setState({
      pageSize: pageSize,
    })
  }

  onChangePage = (page) => {
    this.setState({
      pageNo: page,
    })
  }

  delChannel = () => { }

  render() {
    const { editChannel, loading, list, selectedRowKeys, changeRowKeys, total } = this.props
    const { pageSize, pageNo } = this.state
    const columns = [
      {
        title: '序号',
        key: 'idx',
        width: 60,
        className: styles.tdCenter,
        render: (text, record, index) => {
          return index + 1
        }
      },
      {
        title: '渠道名称',
        key: 'channelName',
        dataIndex: 'channelName',
        className: styles.tdCenter,
        width: 150,
      },
      {
        title: '创建人',
        key: 'creator',
        dataIndex: 'creator',
        className: styles.tdCenter,
        width: 120,
      },
      {
        title: '创建时间',
        key: 'createTime',
        dataIndex: 'createTime',
        className: styles.tdCenter,
        width: 180,
      },
      {
        title: '操作',
        key: 'operation',
        className: styles.tdCenter,
        width: 120,
        render: (text, record) => {
          return (
            <span>
              <a onClick={editChannel}>编辑</a>
              <a onClick={this.delChannel}>删除</a>
            </span>
          )
        }
      },
    ]
    return (
      <Table
        dataSource={list}
        bordered={true}
        loading={loading}
        columns={columns}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: changeRowKeys
        }}
        pagination={{
          pageSize: pageSize,
          pageSizeOptions: ['10', '20', '30', '40'],
          current: pageNo,
          showQuickJumper: true,
          showSizeChanger: true,
          onShowSizeChange: this.onShowSizeChange,
          total: total || 0,
          showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 页`,
          onChange: (page, pageSize) => {
            this.onChangePage(page, pageSize)
          },
        }}
      />
    )
  }
}

export default List