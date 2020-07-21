import React, { PureComponent as Component } from 'react';
import { Icon, Checkbox, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys1, formItems1, formItemLayout } from './Common';
import EveryDay from '../Camp/EveryDay';
import css from './style.less';

class Step1 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        newFormKeys: formKeys1,
    };

    onChange = (key, value) => {
        const { form, formData } = this.props;
        
    }
    

    /** formItems 重新设置 */
    resetFormItems() {
        const { form, formData } = this.props;
        const { ...other } = formItems1;
        return {
            ...other,
        };
    }
    render() {
        const { newFormKeys } = this.state;
        const { formData, getForm } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <div className={css.step1}>
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
export default Step1
