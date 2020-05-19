import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys, formItems } from './Common';
import { postStock } from './AxiosFactory';
import css from './style.less';

class Step3 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
    };

    /* 表单提交 */
    onOk = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { onClose } = this.props;
                const { } = v;
            }
        });
    }
    onChange = (key, value) => {

    }
    /** 得到form */
    onGetForm = (form) => {
        this.form = form;
    }

    render() {
        const { } = this.state;
        const { formData } = this.props;
        return (
            <div>
                <BaseForm
                    getForm={this.onGetForm}
                    formItems={formItems}
                    formKeys={formKeys}
                    onChange={this.onChange}
                    formData={formData || {}}
                    layout="inline"
                />
            </div>
        )
    }
}
export default Step3
