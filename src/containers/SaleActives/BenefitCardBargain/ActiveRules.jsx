/*
 * @Author: Songnana
 * @Date: 2022-12-06 14:11:54
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import React, { Component } from 'react'
import { Select, Table, Input, Row, Col, Form } from 'antd'
import BaseForm from 'components/common/BaseForm';
import moment from 'moment'
import _ from 'lodash';
import { formItems2, formItemLayout, columns } from './config'
import { getBenefitCards, queryCardDetail } from './AxiosFactory'
import styles from './styles.less'

const formKeys = ['cardTypeID', 'gears', 'giftGetRule', 'bargainTip',
  'giftGetRuleValue', 'giftCountTip', 'needCount', 'bargainCountTip', 'ratio', 'ratioTip', 'eventDuration', 'bargainValidityTip', 'buyLimit', 'countLimitTip'];

const Option = Select.Option
const InputGroup = Input.Group;
const FormItem = Form.Item;

class ActiveRules extends Component {

  state = {
    newFormKeys: formKeys,
    benefitCardLst: [],
    dataSource: [],  // 档位
  };

  componentDidMount() {
    const { itemID, formData } = this.props
    this.getResourceData()
  }

  componentWillReceiveProps(np) {
    const { itemID, formData } = this.props
    if ((!_.isEqual(formData, np.formData)) && np.itemID) {
      this.onBenefitCardSelectChange(np.formData.cardTypeID, np.formData, np.itemID)
    }
  }


  onBenefitCardSelectChange = (value, formData, itemID) => {
    // paymentStageList
    if (value) {
      queryCardDetail(value).then((data) => {
        this.setState({
          dataSource: !itemID ? data : this.getDataSource(formData, data),
          selectedRowKeys: this.getSelectedRowKey(formData, data, itemID),
        })
      })
    }
  }

  getResourceData = () => {
    getBenefitCards().then((list) => {
      this.setState({
        benefitCardLst: list,
      })
    })
  }

  getDataSource = (formData, data) => {
    let dataSource = [];
    const index = data.findIndex(item => formData.giftID === item.paymentStageID)
    if (data[index]) {
      data[index].realPrice = formData.presentValue;
    }
    dataSource = data;
    return dataSource
  }

  getSelectedRowKey = (formData, data, itemID) => {
    if (itemID) {
      const index = data.findIndex(item => formData.giftID === item.paymentStageID);
      const { paymentStageID, realPrice, indexName } = data[index] || {};
      this.props.onChangeGears({ giftID: paymentStageID, presentValue: realPrice, giftName: indexName })
      return [index]
    }
    // const { paymentStageID, realPrice, indexName } = data[0] || {};
    // this.props.onChangeGears({ giftID: paymentStageID, presentValue: realPrice, giftName: indexName })
    return []
  }


  isBeginTime = (eventRange) => {
    const nowDay = moment(new Date()).add('1', 'day')
    if (eventRange[0]) {
      const diff = nowDay.diff(eventRange[0], 'days')
      if (diff > 0) {
        return true
      }
    }
    return false
  }

  handleSelected = (selectedRowKeys, selectedRows) => {
    const { paymentStageID, realPrice, indexName } = selectedRows[0] || {};
    this.props.onChangeGears({ giftID: paymentStageID, presentValue: realPrice, giftName: indexName })
    this.setState({
      selectedRowKeys,
    })
  }
  /** formItems 重新设置 */
  resetFormItems() {
    const { cardTypeID: ID, gears, ratio, ...other } = formItems2;
    return {
      cardTypeID: {
        ...ID,
        render: (d, form) => {
          return this.renderBenefitSelect(d, form)
        },
      },
      gears: {
        ...gears,
        render: (d, form) => {
          const { cardTypeID } = form.getFieldsValue()
          if (!cardTypeID) return null
          return this.renderGears(d, form)
        },
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
          onChange: this.onBenefitCardSelectChange,
        })(<Select
          allowClear={true}
          getPopupContainer={node => node.parentNode}
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
    const { dataSource } = this.state;
    const { gearData = [] } = this.props
    return (
      <div>
        {d({
          key: 'giftID',
        })(
          <Table
            bordered={true}
            pagination={false}
            columns={columns}
            dataSource={dataSource}
            rowSelection={{
              onChange: (selectedRowKeys, selectedRows) => this.handleSelected(selectedRowKeys, selectedRows),
              type: 'radio',
              // getCheckboxProps: record => ({ defaultChecked: record.isBind === true }),
              selectedRowKeys: this.state.selectedRowKeys,
              getCheckboxProps: record => ({
                disabled: gearData.some(item => item.giftID === record.paymentStageID),
              }),
            }}
          />
        )}
      </div>
    )
  }

  renderRatio = (d, form) => {
    const { leftIntervalValue } = form.getFieldsValue()
    return (
      <Row>
        <InputGroup size="large">
          <Col span={12}>
            {d({
              key: 'leftIntervalValue',
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
          </Col>
          <Col span={1}>至</Col>
          <Col span={11}>
            <FormItem required={true} style={{ padding: 0 }}>
              {d({
                key: 'rightIntervalValue',
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


  render() {
    const { newFormKeys } = this.state;
    const { formData = { }, isView, getForm, itemID } = this.props;
    const { eventRange = [] } = formData

    const newFormItems = this.resetFormItems();
    return (
      <div className={styles.ActiveRulesBox}>
        <BaseForm
          getForm={getForm}
          formItems={newFormItems}
          formKeys={newFormKeys}
          // onChange={this.onChange}
          formData={formData || {}}
          formItemLayout={formItemLayout}
        />
        {
          itemID && this.isBeginTime(eventRange) &&  <Col className={styles.conditionListBoxPop}></Col>
        }
      </div>

    )
  }
}

export default ActiveRules