import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys3, formItems3, formItemLayout } from './Common';
import Lottery from '../Camp/Lottery';
import css from './style.less';

class Step3 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
    };

    onChange = (key, value) => {
    }
    /** formItems 重新设置 */
    resetFormItems() {
        const { formData } = this.props;
        const render = d => d()(<Lottery />);
        const { lottery, ...other } = formItems3;
        return {
            ...other,
            lottery: { ...lottery, render },
        };
    }

    render() {
        const { } = this.state;
        const { formData, getForm } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div>
                <BaseForm
                    getForm={getForm}
                    formItems={newFormItems}
                    formKeys={formKeys3}
                    onChange={this.onChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}
export default Step3
