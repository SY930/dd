import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message, Switch, Form } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys32, formItems3, formItemLayout } from './Common';
import Lottery from '../Camp/PasswordBoxLottery';
import Share from '../Camp/Share';
import css from './style.less';

const FormItem = Form.Item;

class Step3 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        newFormKeys: formKeys32,
    };

    componentDidMount(){
        this.setState({newFormKeys: [...formKeys32]})
    }

    onChange = (key, value) => {

    }

    /** formItems 重新设置 */
    resetFormItems() {
        const render = d => d()(<Lottery form={this.props.form} decorator={d} />);
        const { lottery } = formItems3;
        return {
            lottery: { ...lottery, render },
        };
    }

    render() {
        const { newFormKeys } = this.state;
        const { formData, getForm } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div>
                <BaseForm
                    getForm={getForm}
                    formItems={newFormItems}
                    formKeys={newFormKeys}
                    onChange={this.onChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}
export default Step3
