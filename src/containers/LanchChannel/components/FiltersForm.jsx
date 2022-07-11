import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, DatePicker } from 'antd';
import BaseForm from 'components/common/BaseForm';

const { RangePicker } = DatePicker;

class FiltersForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
    this.queryFrom = null;
  }

  handleQuery = () => {
    const { onSearch } = this.props;
    const formData = this.queryFrom.getFieldsValue();
    let params = {
      channelName: formData.channelName,
      createBy: formData.createBy,
      createStampStart: formData.createStamp && formData.createStamp.length ? formData.createStamp[0].format('YYYY-MM-DD HH:mm:ss') : '',
      createStampEnd: formData.createStamp && formData.createStamp.length ? formData.createStamp[1].format('YYYY-MM-DD HH:mm:ss') : '',
    }
    onSearch(params)
  }

  render() {
    const { formData } = this.state;
    const formItems = {
      channelName: {
        type: 'text',
        label: '渠道名称',
        placeholder: '请输入渠道名称',
      },
      createStamp: {
        type: 'custom',
        label: '创建时间',
        render: (decorator) => (
          decorator({
            key: 'createStamp',
          })(
            <RangePicker
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          )
        )
      },
      createBy: {
        type: 'text',
        label: '创建人',
        placeholder: '请输入创建人',
      },
    }
    const formKeys = ['createStamp', 'createBy', 'channelName'];
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
        <BaseForm
          getForm={(form) => { this.queryFrom = form }}
          formItems={formItems}
          formKeys={formKeys}
          formData={formData}
          layout="inline"
        />
        <Button type="primary" onClick={() => this.handleQuery()} style={{ marginTop: -4, marginLeft: 20 }}>
          <Icon type="search" />
          搜索
        </Button>
      </div>
    );
  }
}

export default FiltersForm;
