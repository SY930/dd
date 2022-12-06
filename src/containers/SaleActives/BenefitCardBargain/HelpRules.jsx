/*
 * @Author: Songnana
 * @Date: 2022-12-06 14:11:54
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import React, { Component } from 'react'
import { Select } from 'antd'
import BaseForm from 'components/common/BaseForm';
import { formItems3, formItemLayout } from './config'
import { getGroupCardTypeList } from './AxiosFactory'

const Option = Select.Option

const formKeys = ['defaultCardType']

class HelpRules extends Component {

  state = {
    newFormKeys: formKeys,
    cardOptions: []
  };

  componentDidMount() {
    this.getResourceData()
  }
  getResourceData = () => {
    getGroupCardTypeList().then((list) => {
      console.log("🚀 ~ file: HelpRules.jsx ~ line 29 ~ HelpRules ~ getGroupCardTypeList ~ list", list)
      this.setState({
        cardOptions: list,
      })
    })
  }


  cardRender = (d, form) => {
    const { cardOptions } = this.state
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
          {cardOptions.map(({ benefitCardName, cardTypeID }) => (<Option key={`${cardTypeID}`} value={`${cardTypeID}`}>{benefitCardName}</Option>))}
        </Select>)}
      </div>)
  }

  /** formItems 重新设置 */
  resetFormItems() {
    const { defaultCardType } = formItems3;
    return {
      defaultCardType: {
        ...defaultCardType,
        render: this.cardRender
      },
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
        formData={formData || {}}
        formItemLayout={formItemLayout}
      />
    )
  }
}

export default HelpRules