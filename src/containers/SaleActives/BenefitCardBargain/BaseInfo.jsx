/*
 * @Author: Songnana
 * @Date: 2022-12-06 14:11:54
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
import React, { Component } from 'react'
import moment from 'moment';
import BaseForm from 'components/common/BaseForm';

import { formItems1, formItemLayout } from './config'

const formKeys = ['eventType', 'eventName', 'eventCode', 'eventRange', 'eventRemark']

class BaseInfo extends Component {

  state = {
    newFormKeys: formKeys,
  };


  /** formItems 重新设置 */
  resetFormItems() {
    const { form, formData } = this.props;
    const { ...other } = formItems1;
    return {
      ...other,
    };
  }

  render() {
    const { newFormKeys } = this.state;
    let { formData = {}, isView, getForm } = this.props;
    formData = {
      ...formData,
      eventCode: isView ? formData.eventCode : formData.eventCode ? formData.eventCode : `YX${moment(new Date()).format('YYYYMMDDHHmmss')}`
    }
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