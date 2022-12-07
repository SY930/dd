/*
 * @Author: Songnana
 * @Date: 2022-12-06 14:11:54
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import React, { Component } from 'react'
import { Select, Table, Input, Row, Col, Form } from 'antd'
import BaseForm from 'components/common/BaseForm';
import { formItems2, formItemLayout, columns } from './config'
import { getBenefitCards, queryCardDetail } from './AxiosFactory'

const formKeys = ['benefitCard', 'gears', 'bargainType','bargainTip', 'giftCount', 'giftCountTip', 'bargainCount', 'bargainCountTip', 'ratio', 'ratioTip', 'bargainValidity', 'bargainValidityTip', 'countLimit', 'countLimitTip'];

const Option = Select.Option
const InputGroup = Input.Group;
const FormItem = Form.Item;

class BaseInfo extends Component {

  state = {
    newFormKeys: formKeys,
    benefitCardLst: [],
    dataSource: [],  // 档位
  };

  componentDidMount() {
    this.getResourceData()
  }

  getResourceData = () => {
    getBenefitCards().then((list) => {
      this.setState({
        benefitCardLst: list,
      })
    })
  }

  handleSelected = (selectedRowKeys, selectedRows) => {
    console.log("🚀 ~ file: ActiveRules.jsx ~ line 83 ~ BaseInfo ~ selectedRowKeys, selectedRows", selectedRowKeys, selectedRows)

  }

  onBenefitCardSelectChange = (value) => {
    // paymentStageList
    if (value) {
      queryCardDetail(value).then((data) => {
        this.setState({
          dataSource: data.map((item, index) => {
            if (index === 0) {
              return { ...item, isBind: true }
            }
            return { ...item }
          }),
        })
      })
    }
  }

  renderBenefitSelect = (d, form) => {
    const { benefitCardLst } = this.state
    return (
      <div>
        {d({
          rules: [
            {
              required: true,
              message: '请选择权益卡',
            },
          ],
          onChange: this.onBenefitCardSelectChange
        })(<Select
          allowClear={true}
          getPopupContainer={(node) => node.parentNode}
          showSearch={true}
          notFoundContent={'未搜索到结果'}
          filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {benefitCardLst.map(({ benefitCardName, cardTypeID }) => (<Option key={`${cardTypeID}`} value={`${cardTypeID}`}>{benefitCardName}</Option>))}
        </Select>)}
      </div>
    )
  }

  renderGears = (d, form) => {
    const { dataSource } = this.state
    return (
      <div>
        {d({})(
          <Table
            bordered={true}
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            rowSelection={{
              onChange: (selectedRowKeys, selectedRows) => this.handleSelected(selectedRowKeys, selectedRows),
              type: 'radio',
              getCheckboxProps: (record) => ({
                defaultChecked: record.isBind == true,
              }),
            }}
          />
        )}
      </div>
    )
  }

  renderRatio = (d, form) => {
  return (
    <Row>
      <InputGroup size="large">
        <Col span={12}>
          {d({
            key: 'a',
            rules: [{
              required: true, message: '请设置首刀砍价比例',
              validator: (rule, value, callback) => {
                if (!/^\d+$/.test(value)) {
                  return callback('请输入数字');
                }
                if (+value < 1 || +value > 99) {
                  return callback('请输入1～99正整数之间');
                }
                return callback();
              },
            }],
          })(<Input addonAfter={'%'} />)}
        </Col>
        <Col span={1}>至</Col>
        <Col span={11}>
          <FormItem required style={{ padding: 0 }}>
            {d({
              key: 'bbb',
              rules: [{
                required: true,
                validator: (rule, value, callback) => {
                  if (!value) {
                    return callback('请设置首刀砍价比例')
                  }
                  if (!/^\d+$/.test(value)) {
                    return callback('请输入数字');
                  }
                  if (+value < 1 || +value > 99) {
                    return callback('请输入1～99正整数之间');
                  }
                  return callback();
                },
              }],
            })(<Input addonAfter={'%'} />)}
          </FormItem>
        </Col>
      </InputGroup>
  </Row>
  )
  }

  /** formItems 重新设置 */
  resetFormItems() {
    const { benefitCard, gears, ratio, ...other } = formItems2;
    return {
      benefitCard: {
        ...benefitCard,
        render: (d, form) => {
          return this.renderBenefitSelect(d, form)
        }
      },
      gears: {
        ...gears,
        render: (d, form) => {
          const { benefitCard } = form.getFieldsValue()
          if (!benefitCard) return null
          return this.renderGears(d, form)
        }
      },
      ratio: {
        ...ratio,
        render: (d, form) => {
          return this.renderRatio(d, form)
        }
      },
      ...other,
    };
  }

  render() {
    const { newFormKeys } = this.state;
    let { formData = {}, isView, getForm } = this.props;

    const newFormItems = this.resetFormItems();
    return (
      <BaseForm
        getForm={getForm}
        formItems={newFormItems}
        formKeys={newFormKeys}
        // onChange={this.onChange}
        formData={formData || {}}
        formItemLayout={formItemLayout}
      />
    )
  }
}

export default BaseInfo