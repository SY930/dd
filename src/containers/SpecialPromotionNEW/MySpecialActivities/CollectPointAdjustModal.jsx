/*
 * @Author: Songnana
 * @Date: 2022-11-25 18:13:50
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import React, { Component } from 'react'
import { Modal, Input, Row, Col } from 'antd'
import styles from './specialDetail.less'
import BaseForm from 'components/common/BaseForm'
import { axiosData, getAccountInfo } from "../../../helpers/util";



class CollectPointAdjustModal extends Component {

  onOk = () => {
    this.form.validateFieldsAndScroll((err, values) => {
      const params = {
        ...values,
        eventCustomerID: this.props.data.customerID
      }
      if (!err) {
        axiosData('/specialPromotion/adjustCollectionPointByHand.ajax', 
        { ...params, operator: getAccountInfo().userName }, 
        {}, 
        { path: '' },
         'HTTP_SERVICE_URL_PROMOTION_NEW')
         .then((res) => {
         console.log("🚀 ~ file: CollectPointAdjustModal.jsx ~ line 30 ~ CollectPointAdjustModal ~ .then ~ res", res)
          
         })
      }
    })
  }

  renderBaseInfo = () => {
    const { data } = this.props
    return (
      <div style={{ marginBottom: 20 }}>
        <h5><span></span>基本信息</h5>
        <Row style={{ marginBottom: 10 }}>
          <Col span={10} offset={2}>
            <span>姓名:</span><span>{data.customerName || '--'}</span>
          </Col>
          <Col span={12}>
            <span>手机号:</span><span>{data.customerMobile}</span>
          </Col>
        </Row>
        <Row>
          <Col span={10} offset={2}>
            <span>未兑换数: </span><span>{data.joinCount + data.remainIngNum}</span>
          </Col>
        </Row>
      </div>
    )
  }

  resetFormItems = () => {
    const { data: { joinCount = 0, remainIngNum = 0}} = this.props
    const sum = joinCount + remainIngNum
    return ({
        pointChangeType: {
          label: '调整类型',
          type: 'radio',
          defaultValue: '4',
          labelCol: { span: 5 },
          wrapperCol: { span: 16 },
          options: [{ label: '手动增加', value: '4' },
          {label: '手动减少', value: '5', }],
        },
        changeCount: {
          label: '点数',
          type: 'custom',
          labelCol: { span: 5 },
          wrapperCol: { span: 16 },
          render: (decorator, form) => {
            const  pointChangeType = form.getFieldValue('pointChangeType')
            if (pointChangeType == '5') {
              return <div>
                {decorator({
                  rules: [
                    {
                      required: true,
                      message: '请输入正整数',
                    },
                    {
                      validator: (rule, v, cb) => {
                        const reg = /\d+/
                        if (!v) {
                          return cb('请输入点数')
                        }
                        if (!reg.test(v)) {
                          return cb('请输入正整数')
                        }
                        if (v > sum) {
                          return cb('手动减少的点数需要≤未兑换点数，即不允许扣减为负值')
                        }
                        cb()
                      },
                  },
                  ],
                })(<Input placeholder="请输入点数" />)}
              </div>
            }
            return (
              <div>
                {decorator({
                      rules: [
                        {
                          required: true,
                          message: '请输入1-99999之间的点数',
                        },
                        {
                          pattern: /^([1-9]\d{0,4})$$/,
                          message: '请输入1-99999之间的点数',
                        }],
                    })(<Input placeholder="请输入1-99999之间的点数"/>)}
              </div>
            )
          }
        },
      }
    )
  }

  render() {
    const { onCancel, data } = this.props;

    return (
      <Modal
        title={'集点调整'}
        visible={true}
        onCancel={onCancel}
        maskClosable={false}
        width={500}
        onOk={this.onOk}
        // footer={[<Button key="0" type="ghost" onClick={onCancel}>关闭</Button>]}
      >
        <div className={styles.showInfo}>
          {this.renderBaseInfo(data)}
          <div style={{ marginBottom: 20 }}>
            <h5><span></span>集点操作</h5>
            <BaseForm 
              getForm={(form) => { this.form = form }}
              formItems={this.resetFormItems()}
              formKeys={['pointChangeType', 'changeCount']}
            />
          </div>
        </div>
      </Modal>
    )
  }
}

export default CollectPointAdjustModal