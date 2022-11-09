import React, { Component } from 'react'
import { Modal, Table, Select } from 'antd';
import { getCouponList, saveActiveOrder } from './AxiosFactory'
import styles from './style.less'


class CustomExecutModal extends Component {
  state = {
      dataSource: [],
  }

  componentDidMount() {
      const { dataSource } = this.state;
      if (dataSource.length === 0) {
          getCouponList().then((data) => {
              this.setState({
                  dataSource: data,
              })
          })
      }
  }

  onSubmit = () => {
      const { dataSource } = this.state;
      saveActiveOrder(dataSource).then((res) => {
          if (res) {
              this.props.onCancel()
          }
      })
  }

    handleOptionChange = (value, index) => {
        const { dataSource } = this.state;
        const promotion = dataSource.splice(index, 1);
        dataSource.splice(Number(value - 1), 0, promotion[0]);
        this.setState({
            dataSource,
        })
    }

  renderTable = () => {
      const { dataSource } = this.state
      const columns = [
          {
              title: '活动类型',
              dataIndex: 'activityTypeName',
              width: 480,
              render: (promotionName, row) => {
                  let text = promotionName;
                  let clazz = '';
                  if (promotionName === undefined || promotionName === null || promotionName === '') {
                      text = '--';
                  }
                  if (row.type === '5') {
                      // text = '会员价';
                      clazz = styles.vip1;
                  }
                  if (row.promotionID === '-20') {
                      text = '会员折扣';
                      clazz = styles.vip2;
                  }
                  return (<span className={clazz} title={text}>{text}</span>);
              },
          },
          {
              title: '执行顺序',
              dataIndex: 'executeOrder',
              className: styles.noPadding,
              width: 80,
              render: (order, record, index) => {
                  return (
                      <Select
                          onChange={value => this.handleOptionChange(value, index)}
                          value={`${index+1}`}
                          showSearch={true}
                          style={{
                              width: '100%',
                          }}
                          placeholder=""
                      >
                          {dataSource.map((item, innerIndex) =>
                          (<Select.Option key={innerIndex} value={`${innerIndex + 1}`}>
                              {innerIndex + 1}
                          </Select.Option>)
                          )}
                      </Select>
                  )
              },
          },
      ];
      return (<Table
          bordered={true}
          columns={columns}
          dataSource={dataSource}
          rowKey="type"
          pagination={false}
          scroll={{ y: 400 }}
      />)
  }

  render() {
      const { visible, onCancel } = this.props;
      return (
          <Modal
              visible={visible}
              onCancel={onCancel}
              title="活动执行设置"
              width={650}
              onOk={this.onSubmit}
              wrapClassName={styles.CustomExecutModal}
          >
              {this.renderTable()}
          </Modal>
      )
  }
}

export default CustomExecutModal
