import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys2, formItems2, formItemLayout } from './Common';
import TimeLimit from '../Camp/TimeLimit';
import css from './style.less';

class Step2 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        brands: [],     // 选中的品牌，用来过滤店铺
    };

    onChange = (key, value) => {
        if(key === 'brandList') {
            this.setState({ brands: value });
        }
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const render = d => d()(<TimeLimit decorator={d} />);
        const { timeLimit, ...other } = formItems2;

        return {
            ...other,
            timeLimit: {...timeLimit, render},
        };
    }
    render() {
        console.log('fk2', formKeys2)
        const { } = this.state;
        const { formData, getForm, form } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div>
                <BaseForm
                    getForm={getForm}
                    formItems={newFormItems}
                    formKeys={formKeys2}
                    onChange={this.onChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}
export default Step2
