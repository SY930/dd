import React, { Component } from 'react'
import {
    Table,
} from 'antd';
import { axiosData } from '../../../helpers/util'
import { getColumns } from '../config';

class StopTables extends Component {
    constructor() {
        super();
        this.state = {
            pageSizes: 25, // 默认显示的条数
            pageNo: 1,
        }
    }
    componentDidMount() {
        this.queryEvents();
    }

  // 切换每页显示条数
  onShowSizeChange = (current, pageSize) => {
      this.setState({
          loading: true,
      }, () => {
          this.handleQuery(1, pageSize)
      })
  };

  queryEvents = () => {
      const params = {
          pageSize: this.state.pageSizes,
          pageNo: this.state.pageNo,
          platformType: '3',
          batchStatus: '2',
      };
      axiosData(
          'couponCodeBatchService/queryBatchList.ajax',
          params,
          null,
          { path: '' },
          'HTTP_SERVICE_URL_PROMOTION_NEW'
      )
          .then((res) => {
              const { data = {} } = res;
              this.setState({
                  loading: false,
                  dataSource: (data.couponCodeBatchInfos || []).map((item, index) => ({ ...item, index: index + 1 })),
                  pageNo: data.pageNo || 1,
                  pageSizes: data.pageSize || 30,
                  total: data.totalSize || 0,
              });
          }, (err) => {
              this.setState({
                  loading: false,
              });
          })
  }

  renderTables = () => {
      return (
      // <div className={['layoutsContent', styles.tableClass].join(' ')}>
          <Table
              scroll={{ x: 800, y: 'calc(100vh - 300px)' }}
              bordered={true}
              columns={getColumns(this)}
              dataSource={this.state.dataSource}
              loading={
                  {
                      delay: 200,
                      spinning: this.state.loading,
                  }
              }
              // className={styles.CouponTableList}
              pagination={{
                  pageSize: this.state.pageSizes,
                  pageSizeOptions: ['25', '50', '100', '200'],
                  current: this.state.pageNo,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  onShowSizeChange: this.onShowSizeChange,
                  total: this.state.total || 0,
                  showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                  onChange: (page, pageSize) => {
                      this.setState({
                          /* pageNo: page, */
                          loading: true,
                      }, () => {
                          this.handleQuery(page, this.state.pageSizes);
                      });
                  },
              }}
          />
      // </div>
      );
  }
  render() {
      return (
          <div style={{ padding: '20px', minHeight: 'calc(100vh - 160px)' }}>
              {this.renderTables()}
          </div>
      )
  }
}

export default StopTables
