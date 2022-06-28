import React from 'react';
import { Modal, Input, Form, Button, TreeSelect } from 'antd';


class ChannelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.formData != this.props.formData) {
      this.setState({
        formData: this.props.formData || {}
      })
    }
  }

  handleSave = () => {
    const formData = this.props.form.getFieldsValue();
    console.log(formData)
  }

  render() {
    const { formData } = this.state
    const { modalType, modalVisible, idEdit, onCancel, form } = this.props;
    const { getFieldDecorator } = form

    return (
      <Modal
        maskClosable={false}
        visible={modalVisible}
        title={`${idEdit ? '编辑' : '添加'}${modalType == 'group' ? '分组' : '渠道'}`}
        onCancel={onCancel}
        onOk={this.handleSave}
        footer={[
          <Button onClick={onCancel} key="cancle">取消</Button>,
          <Button type="primary" onClick={this.handleSave} key="save">确定</Button>,
        ]}
      >
        <Form>
          {modalType == 'group' ? <Form.Item label="分组名称" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('groupName', {
              rules: [
                { required: true, message: '请输入分组名称' },
                { pattern: /^[\u4E00-\u9FA5A-Za-z0-9\-]{1,10}$/, message: '输入限制为10位以内汉字、数字、大小写字母' }
              ],
              initialValue: "",
            })(
              <Input placeholder='请输入分组名称' />
            )}
          </Form.Item> : <div>
            <Form.Item label="选择分组" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('groupID', {
                rules: [
                  { required: true, message: '请选择分组' }
                ],
                initialValue: undefined,
              })(
                <TreeSelect
                  placeholder='请选择分组'
                  showSearch
                  treeNodeFilterProp={'title'}
                  treeData={[]}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                />
              )}
            </Form.Item>
            <Form.Item label="渠道名称" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('channelName', {
                rules: [
                  { required: true, message: '请输入渠道名称' },
                  { pattern: /^[\u4E00-\u9FA5A-Za-z0-9\-]{1,20}$/, message: '输入限制为20位以内汉字、数字、大小写字母' }
                ],
                initialValue: "",
              })(
                <Input placeholder='请输入渠道名称' />
              )}
            </Form.Item>
          </div>}
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ChannelModal);
