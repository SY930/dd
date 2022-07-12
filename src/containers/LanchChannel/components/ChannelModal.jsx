import React from 'react';
import { Modal, Input, Form, Button, Select } from 'antd';
import { getStore } from '@hualala/platform-base';


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
    const { modalType, isEdit, handleSubmit } = this.props;
    const { groupID } = getStore().getState().user.get('accountInfo').toJS();
    const reqParams = {
      ...(groupID ? { groupID, _groupID: groupID } : {}),
    };
    this.props.form.validateFields((errs, values) => {
      if (!errs) {
        let url = ''
        let params = { ...values, ...reqParams }
        if (modalType == 'group') {
          url = isEdit ? '/launchchannel/launchChannelService_updateLaunchChannelGroup.ajax' : '/launchchannel/launchChannelService_addLaunchChannelGroup.ajax'
          params.channelGroupItemID = isEdit ? this.state.formData.itemID : undefined
        } else if (modalType == 'channel') {
          url = isEdit ? '/launchchannel/launchChannelService_updateChannel.ajax' : '/launchchannel/launchChannelService_addChannel.ajax'
          params.channelItemID = isEdit ? this.state.formData.itemID : undefined
        }
        handleSubmit(url, params)
      }
    })
  }

  handleCancel = () => {
    const { onCancel, form } = this.props
    onCancel()
    form.resetFields()
  }

  render() {
    const { formData } = this.state
    const { modalType, modalVisible, isEdit, form, groupData } = this.props;
    const { getFieldDecorator } = form

    return (
      <Modal
        maskClosable={false}
        visible={modalVisible}
        title={`${isEdit ? '编辑' : '添加'}${modalType == 'group' ? '分组' : '渠道'}`}
        onCancel={this.handleCancel}
        onOk={this.handleSave}
        footer={[
          <Button onClick={this.handleCancel} key="cancle">取消</Button>,
          <Button type="primary" onClick={this.handleSave} key="save">确定</Button>,
        ]}
      >
        <Form>
          {modalType == 'group' ? <Form.Item label="分组名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('channelGroupName', {
              rules: [
                { required: true, message: '请输入分组名称' },
                { pattern: /^[\u4E00-\u9FA5A-Za-z0-9\-]{1,10}$/, message: '输入限制为10位以内汉字、数字、大小写字母' }
              ],
              initialValue: formData.channelGroupName,
            })(
              <Input placeholder='请输入分组名称' />
            )}
          </Form.Item> : <div>
            <Form.Item label="选择分组" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('channelGroupItemID', {
                rules: [
                  { required: true, message: '请选择分组' }
                ],
                initialValue: formData.channelGroupItemID,
              })(
                <Select placeholder='请选择分组'>
                  {
                    groupData.map(item => {
                      return <Select.Option value={item.itemID} key={item.itemID}>{item.channelGroupName}</Select.Option>
                    })
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item label="渠道名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('channelName', {
                rules: [
                  { required: true, message: '请输入渠道名称' },
                  { pattern: /^[\u4E00-\u9FA5A-Za-z0-9\-]{1,20}$/, message: '输入限制为20位以内汉字、数字、大小写字母' }
                ],
                initialValue: formData.channelName,
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
