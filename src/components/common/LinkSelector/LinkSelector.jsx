/*
 *组件名称：LinkSelector (可增加item 的Select)
 * 功能：可增加item 的Select
 * 陈双   2016/12/8
 * yqz添加标题为空时，不显示
 */
import React from 'react';
import { Select, Modal, Input, Form } from 'antd';

const Option = Select.Option;
import styles from './LinkSelector.less';

const FormItem = Form.Item;
import BaseForm from '../BaseForm';

// class AddInput extends React.Component{
//  handleSubmit(e) {
//    e.preventDefault();
//    this.props.form.validateFields((err, values) => {
//      if (!err) {
//        this.props.callback(true);
//      }else{
//        this.props.callback(false);
//      }
//    });
//  }
//  componentDidMount() {
//    this.props.getSubmitFn(this.handleSubmit);
//  }
//  render() {
//    const { getFieldDecorator } = this.props.form;
//    return (
//      <Form >
//        <FormItem>
//          {getFieldDecorator('categoryName', {
//            rules: [{
//              required: true,
//              message: '汉字、字母、数字组成，不多余50个字符',
//              pattern:/^[\u4E00-\u9FA5A-Za-z0-9]{1,50}$/,
//            }],
//            onChange:(e)=>{
//              this.setState({data:e.target.value})
//            }
//          })(
//            <Input onPressEnter={(e)=>this.handleSubmit(e)}/>
//          )}
//        </FormItem>
//      </Form>
//    );
//  }
// }
// const AddInputs = Form.create()(AddInput);


export default class LinkSelector extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            options: [],
        };
        this.handleAdd = this.handleAdd.bind(this);
    }
    componentWillMount() {
        this.setState({
            options: this.props.options,
        }, function () {
            if (this.props.defaultValue) {
                this.props.handSelect && this.props.handSelect(this.props.defaultValue);
            }
        });
    }
    handleAdd() {
        this.setState({
            visible: true,
        });
    }


  handleOk =() => {
      const options = this.state.options;
      options.push({
          value: this.state.value,
          name: this.state.value,
      });
      this.props.addCategory({
          _groupID: 5,
          phraseType: 'CATEGORY_NAME',
          name: this.state.value,
      });
      this.setState({
          visible: false,
          options,
      });
  }

  handleCancel=() => {
      this.setState({
          visible: false,
      });
  }
  handleSubmit = () => {
      this.basicForm1.validateFieldsAndScroll((err1, basicValues) => {
          if (err1) return;
          this.handleOk();
          this.data = { ...basicValues };
      });
  }
  linkableSelect='';
  render() {
      const options = this.state.options;

      const option = options.length > 0 ? options.map((item, i) => {
          return <Option key={i} value={item.value}>{item.name}</Option>
      }) : <Option key={0} value={0} disabled={true}>数据加载中...</Option>;
      const linkable = this.props.linkable;
      // 标签
      if (this.props.tags) {
          this.linkableSelect = (<div className={styles.linkSelectorMain}>

              <span className={styles.linkSelectorLeft}>{this.props.tit}</span>
              <Select
                  multiple={true}
                  tags={true}
                  {...this.props}
                  className={styles.linkSelectorRight}
                  onSelect={(value) => {
                      this.props.addTag({
                          _groupID: 5,
                          phraseType: 'TAG_NAME',
                          name: value,
                      });
                  }}
              >
                  {option}
              </Select>
          </div>)
      } else if (this.props.multiple) {
          this.linkableSelect = (<div className={styles.linkSelectorMain}>

              <span className={styles.linkSelectorLeft}>{this.props.tit}</span>
              <Select
                  notFoundContent="无结果"
                  multiple={true}
                  {...this.props}
                  className={styles.linkSelectorRight}
              >
                  {option}
              </Select>
          </div>)
      } else {
      // 有新建按钮
          const typeOne = (<div className={styles.linkSelectorMain}>

              <span className={styles.linkSelectorLeft}>{this.props.tit}</span>

              <Select
                  size="large"
                  notFoundContent="无结果"
                  defaultValue={this.props.defaultValue}
                  className={styles.linkSelectorRight}
                  showSearch={true}
                  {...this.props}
                  ref={'linkSelects'}
                  onSelect={
                      (value) => {
                          this.props.handSelect && this.props.handSelect(value);
                      }
                  }
              >{option}</Select>
              <a className={styles.linkSelectorBtn} title={'新建类别'} onClick={this.handleAdd}>新建类别</a>
          </div>);
          // 没有新建按钮
          const title = this.props.tit ? <span className={styles.linkSelectorLeft}>{this.props.tit}</span> : null;
          const titTwo = this.props.titTwo ? <span className={styles.linkSelectorLeft1}>{this.props.titTwo}</span> : null;

          const typeTwo = (<div className={styles.linkSelectorMain}>
              {title || titTwo}

              <Select
                  className={styles.linkSelectorRight}
                  defaultValue={this.props.defaultValue}
                  {...this.props}
                  showSearch={true}
                  onSelect={(value) => {
                      this.props.handSelect && this.props.handSelect(value);
                  }}
              >{option}</Select>
          </div>);

          this.linkableSelect = linkable ? typeOne : typeTwo;
      }

      return (
          <div>
              {this.linkableSelect}
              <Modal
                  title="新建类别"
                  visible={this.state.visible}
                  onOk={this.handleSubmit}
                  onCancel={this.handleCancel}
                  okText="添加"
                  cancelText="取消"
                  wrapClassName={styles.linkSelectorModal}
              >
                  {
                      this.state.visible ? (
                          <BaseForm
                              getForm={form => this.basicForm1 = form}
                              formItems={{
                                  categoryName: {
                                      type: 'custom',
                                      label: '类别名称',
                                      labelCol: { span: 4 },
                                      wrapperCol: { span: 18 },
                                      hasFeedback: true,
                                      placeholder: '请输入类别名称',
                                      render: decorator => (
                                          <Form.Item className={styles.FormItemStyle}>
                                              {decorator({
                                                  key: 'categoryName',
                                                  rules: [{
                                                      required: true,
                                                      message: '汉字、字母、数字组成，不多余20个字符',
                                                      pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/,
                                                  }],
                                                  onChange: (e) => {
                                                      this.setState({
                                                          value: e.target.value,
                                                      })
                                                  },
                                              })(
                                                  <Input onPressEnter={this.handleSubmit} />
                                              )}
                                          </Form.Item>
                                      ),
                                  },
                              }}
                              formData={this.props.data}
                              formKeys={['categoryName']}
                              onChange={this.handleFormChange}
                          />
                      ) : null

                      // {
                      //   <AddInputs  getSubmitFn={fn => this.handleSubmitFn = fn}
                      // callback={(arg)=>{
                      //  this.setState({
                      //    flag:arg
                      //  })
                      // }}/>
                      // }

                  }
              </Modal>
          </div>
      );
  }
}
