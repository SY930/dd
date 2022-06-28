import React from 'react';
import { connect } from 'react-redux';
import { Button, Icon, DatePicker } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { getGroupId } from '../_action';

const { RangePicker } = DatePicker;

class FiltersForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
    };
    this.queryFrom = null;
  }

  componentWillMount() {
    const { getGroupIdAC } = this.props;
    getGroupIdAC();
  }

  componentWillReceiveProps(nextProps) {
    this.queryFrom && this.queryFrom.resetFields();
  }

  handleQuery = () => {
    const { groupID } = this.props;
    const formData = this.queryFrom.getFieldsValue();
    console.log(formData)
  }

  render() {
    const { formData } = this.state;
    const formItems = {
      channelName: {
        type: 'text',
        label: '渠道名称',
        placeholder: '可输入渠道名称查询',
      },
      effectTime: {
        type: 'custom',
        label: '创建时间',
        render: (decorator) => (
          decorator({
            key: 'effectTime',
          })(
            <RangePicker
              format="YYYY-MM-DD"
              placeholder={['开始日期', '结束日期']}
            />
          )
        )
      },
      createUser: {
        type: 'text',
        label: '创建人',
        placeholder: '可输入创建人查询',
      },
    }
    const formKeys = ['channelName', 'effectTime', 'createUser'];
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
          查询
        </Button>
      </div>
    );
  }
}

function mapStateToProps({ sale_lanch_channel: saleLanchChannel }) {
  return {
    groupID: saleLanchChannel.get('groupId'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGroupIdAC: opts => dispatch(getGroupId(opts)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FiltersForm);
