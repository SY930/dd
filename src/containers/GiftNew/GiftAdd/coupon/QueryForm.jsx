import React, { PureComponent as Component } from 'react';
import  BaseForm  from 'components/common/BaseForm';
import { Button } from 'antd';
import { qFormKeys, qFormItems, } from './Common';
import styles from './bag.less';

export default class QueryForm extends Component {
    state = {};
    /* 点击查询把参数传给父组件 */
    onQuery = () => {
        const { name } = this.form.getFieldsValue();
        const params = { name, pageSize: 30, pageNo: 1 };
        // 如果是点查询按钮要恢复分页初始值
        this.props.onQuery(params);
    }
    /* 获取form对象 */
    onGetForm = (form) => {
        this.form = form;
    }
    /* 整理formItems对象 */
    resetFormItems = () => {
        const btnProp = { type: 'primary', icon: 'search', onClick: this.onQuery };
        const { q, ...other } = qFormItems;
        const render = () => (<div><Button {...btnProp}>查询</Button></div>);
        return {
            ...other,
            q: { ...q, render },
        };
    }
    render() {
        const formItems = this.resetFormItems();
        return (
            <div  style={{marginBottom: '10px'}}>
                <BaseForm
                    getForm={this.onGetForm}
                    formItems={formItems}
                    formKeys={qFormKeys}
                    layout="inline"
                />
            </div>
        );
    }
}
