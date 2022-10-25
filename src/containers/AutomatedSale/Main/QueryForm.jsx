import React from 'react';
import { Button } from "antd";
import BaseForm from 'components/common/BaseForm';

const formItems = {
    flowName: {
        type: 'text',
        label: '活动名称',
        placeholder: '请输入活动名称'
    },
};

export default class QueryForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.queryFrom = null;
    }

    onQuery = () => {
        this.props.onQuery(this.queryFrom.getFieldsValue());
    }
    render() {
        const formKeys = Object.keys(formItems);
        return (
            <div style={{ display: 'flex' }}>
                <BaseForm
                    getForm={form => this.queryFrom = form}
                    formItems={formItems}
                    formKeys={formKeys}
                    layout="inline"
                />
                <Button style={{ margin: '0 10px' }} type='primary' onClick={this.onQuery}>查询</Button>
            </div>
        )
    }
}
