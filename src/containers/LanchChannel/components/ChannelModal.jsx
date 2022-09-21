import React from 'react';
import { Modal, Input, Form, Button, Select } from 'antd';
import { getStore } from '@hualala/platform-base';
import BaseForm from 'components/common/BaseForm';


class ChannelModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
    this.modalFrom = null
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
    this.modalFrom.validateFields((errs, values) => {
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
      } else {
        console.log(errs)
      }
    })
  }

  handleCancel = () => {
    const { onCancel } = this.props
    onCancel()
    this.modalFrom.resetFields()
  }

  render() {
    const { formData } = this.state
    const { modalType, modalVisible, isEdit, groupData = [] } = this.props;
    const formItems = {
      channelGroupName: {
        type: 'text',
        label: '分组名称',
        placeholder: '请输入分组名称',
        rules: [
          { required: true, message: '请输入分组名称' },
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9\-]{1,10}$/, message: '输入限制为10位以内汉字、数字、大小写字母' }
        ],
      },
      channelGroupItemID: {
        type: 'custom',
        label: '选择分组',
        render: (decorator) => (
          decorator({
            key: 'channelGroupItemID',
          })(
            <Select placeholder='请选择分组' showSearch allowClear filterOption={(value, option) => option.props.children.indexOf(value) > -1}>
              {
                groupData.map(item => {
                  return <Select.Option value={item.itemID} key={item.itemID}>{item.channelGroupName}</Select.Option>
                })
              }
            </Select>
          )
        )
      },
      channelName: {
        type: 'text',
        label: '渠道名称',
        placeholder: '请输入渠道名称',
        rules: [
          { required: true, message: '请输入渠道名称' },
          { pattern: /^[\u4E00-\u9FA5A-Za-z0-9\-]{1,20}$/, message: '输入限制为20位以内汉字、数字、大小写字母' }
        ],
      },
    }

    const formKeys = modalType == 'group' ? ['channelGroupName'] : ['channelGroupItemID', 'channelName']

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
        <BaseForm
          getForm={(form) => { this.modalFrom = form }}
          formItems={formItems}
          formItemLayout={{
            labelCol: {span: 4},
            wrapperCol: {span: 16}
          }}
          formKeys={formKeys}
          formData={formData}
        />
      </Modal>
    );
  }
}

export default Form.create()(ChannelModal);
