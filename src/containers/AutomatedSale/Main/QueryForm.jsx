import React from 'react';
import { Button, Select } from "antd";
import BaseForm from 'components/common/BaseForm';

export const statusList = [
    {
        label: '已启用',
        value: 1
    },
    {
        label: '已禁用',
        value: 2
    },
]

const formItems = {
    timeRanges: {
        label: '活动时间',
        type: 'datepickerRange',
        showTime: true,
        labelCol: { span: 7 },
        wrapperCol: { span: 8 },
        format: 'YYYY-MM-DD'
    },
    status: {
        type: 'custom',
        label: '使用状态',
        labelCol: { span: 7 },
        wrapperCol: { span: 8 },
        render: (decorator) => decorator({})(
            <Select
                style={{width: '100px'}}
                placeholder="请选择"
                allowClear
            >
                {
                    statusList.map(item => (
                        <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                    ))
                }
            </Select>
        )
    },
    flowName: {
        type: 'text',
        label: '活动名称',
        placeholder: '请输入活动名称'
    },
};

export default class QueryForm extends React.PureComponent {
    constructor(props){
        super(props);
        this.queryFrom = null;
    }

    onQuery = () => {
        this.props.onQuery(this.queryFrom.getFieldsValue());
    }
    render() {
        const formKeys = Object.keys(formItems);
        return (
            <div style={{display: 'flex'}}>
                <BaseForm
                    getForm={form => this.queryFrom = form}
                    formItems={formItems}
                    formKeys={formKeys}
                    layout="inline"
                />
                <Button style={{margin: '0 10px'}} type='primary' onClick={this.onQuery}>查询</Button>
            </div>
        )
    }
}
