/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-02-06T16:21:55+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: EditableInput.jsx
* @Last modified by:   xf
* @Last modified time: 2017-02-07T15:53:08+08:00
* @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
*/


/*
 *组件名称：AddOrDelInput (可增删输入框)
 * 功能：增加或删除输入框
 * 陈双   2016/12/5
 */
import React from 'react';
import { Row, Col, Form, TimePicker, Input } from 'antd';
import { UnitInput } from '../UnitInput/UnitInput';
import styles from './EditableInput.less';
import { Iconlist } from '../../basic/IconsFont/IconsFont';
// if (process.env.__CLIENT__ === true) {
//   require('../../../../client/components.less')
// }

const FormItem = Form.Item;

class EditableInputs extends React.Component {
    constructor(props) {
        super(props);
        this.uuid = 0;
        this.state = {
            tip: {},
            tip2: {},
            showAdd: true,
        }
        this.tips = [];
    }

  remove = (k) => {
      this.uuid--;
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      if (keys.length === 1) {
          return;
      }
      form.setFieldsValue({
          keys: keys.filter(key => key !== k),
      });
  };

  add = () => {
      this.uuid++;
      // console.log(this.uuid)
      if (this.uuid >= 3) {
          this.setState({ showAdd: false });
          return;
      }
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(this.uuid);
      form.setFieldsValue({
          keys: nextKeys,
      });
  };

  componentDidMount() {
      this.props.form.setFieldsValue({
          keys: [0],
      });
  }
  componentDidUpdate() {
      if (this.props.labelIn == '消费每满') {
          const keys = this.props.form.getFieldValue('keys');
          if (keys.length == 1) {

          } else {
              this.uuid = 0;
              // console.log(this.uuid);
              this.props.form.setFieldsValue({
                  keys: [0],
              });
          }
      }
  }
  getTip = (k) => {
      this.tips.push([this.state.tip[k], this.state.tipTwo[k]]);
      // console.log(this.tips)
      this.props.callback && this.props.callback(this.tips);
  };

  render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const formItemLayout = {
          labelCol: { span: 0 },
          wrapperCol: { span: 24 },
      };
      const formItemLayoutWithOutLabel = {
          wrapperCol: { span: 24, offset: 0 },
      };
      getFieldDecorator('keys', { initialValue: [] });

      const keys = getFieldValue('keys');
      const inputNum = this.props.inputNum;
      const formItemInside = keys.map((k, index) => {
          return (
              <FormItem
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  required={false}
                  key={k}
              >
                  {
                      inputNum === 1 ? (
                          getFieldDecorator(`names-${k}`, {
                              validateTrigger: ['onChange', 'onBlur'],
                              rules: [{
                                  required: true,
                                  whitespace: true,
                                  message: "Please input passenger's name or delete this field.",
                              }],
                          })(
                              <UnitInput addonBefore={`选择第${k + 1}件打折`} addonAfter={'%'} width="100%" />
                          )
                      ) : (

                          <Form inline={true} className={styles.EditableInputMain}>
                              <FormItem>
                                  {getFieldDecorator(`a-${k}`, {
                                      validateTrigger: ['onChange', 'onBlur'],
                                      rules: [{
                                          required: true,
                                          whitespace: true,
                                          message: '请输入消费金额',
                                      }],
                                      initialValue: this.props.dValue[k] ? this.props.dValue[k][0] : null,
                                      onBlur: (e) => {
                                          this.setState({ tip: { [k]: e.target.value } });
                                      },

                                  })(
                                      <Input addonBefore={this.props.labelIn} addonAfter={this.props.oneText} />
                                  )}
                              </FormItem>
                              <FormItem className={styles.rightInput}>
                                  {getFieldDecorator(`b-${k}`, {
                                      validateTrigger: ['onChange', 'onBlur'],
                                      rules: [{
                                          required: true,
                                          whitespace: true,
                                          message: '请输入减免金额',
                                      }],
                                      initialValue: this.props.dValue[k] ? this.props.dValue[k][1] : null,
                                      onBlur: (e) => {
                                          this.setState({ tipTwo: { [k]: e.target.value } }, function () {
                                              this.getTip(k)
                                          });
                                      },
                                  })(
                                      <Input addonBefore={this.props.secondLabel} addonAfter={this.props.twoText} />
                                  )}

                              </FormItem>
                          </Form>

                      )
                  }
                  {

                      this.props.labelIn == '消费满' && k === this.uuid ?
                          (
                              <div className="editableInput-ico">
                                  {
                                      k === 0 ? (
                                          <Iconlist iconName={'plus'} className="plusBig" onClick={this.add} />
                                      ) : (
                                          <span>
                                              <Iconlist iconName={'plus'} className="plusBig" onClick={this.add} />
                                              <Iconlist iconName={'del'} className="plusBigRed" disabled={`${k}` === 0} onClick={() => this.remove(k)} />

                                          </span>
                                      )
                                  }
                              </div>
                          ) : null
                  }
              </FormItem>);
      });

      return (
          <Form>
              {formItemInside}
          </Form>
      );
  }
}
export const EditableInput = Form.create()(EditableInputs);
