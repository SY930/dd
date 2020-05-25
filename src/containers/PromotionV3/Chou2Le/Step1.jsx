import React, { PureComponent as Component } from 'react';
import { Icon, Checkbox, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys1, formItems1, formItemLayout,
    KEY1, KEY2, KEY3, KEY4, KEY5 } from './Common';
import EveryDay from '../Camp/EveryDay';
import css from './style.less';

class Step1 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        newFormKeys: formKeys1,
    };

    onChange = (key, value) => {
        const { form } = this.props;
        let newFormKeys = [...KEY1, ...KEY2];
        // 日期高级
        if(key === 'advMore') {
            if(value){
                newFormKeys = [...KEY1, ...KEY3, ...KEY5, ...KEY2];
            }
            this.setState({ newFormKeys });
        }
        // 周期
        if(key === 'cycleType') {
            let advMore = '';
            if(form) {
                advMore = form.getFieldValue('advMore');   // 高级时间
            }
            if(advMore){
                newFormKeys = [...KEY1, ...KEY3, ...KEY5, ...KEY2];
            }
            if(value){
                newFormKeys = [...KEY1, ...KEY3, ...KEY4, ...KEY5, ...KEY2];
            }
            console.log('newFormKeys', newFormKeys);
            this.setState({ newFormKeys });
        }
    }

    /** formItems 重新设置 */
    resetFormItems() {
        const { form, formData } = this.props;
        let cycleType = '';
        if(form) {
            const { getFieldValue } = form;
            const { cycleType: t } = formData;
            cycleType = getFieldValue('cycleType') || t;
        }
        console.log('cycleType', cycleType);
        const render3 = d => d()(<EveryDay type={cycleType} />);
        const { validCycle, ...other } = formItems1;
        return {
            ...other,
            validCycle: { ...validCycle, render: render3 },
        };
    }
    render() {
        const { newFormKeys } = this.state;
        const { formData, getForm } = this.props;
        const newFormItems = this.resetFormItems();
        console.log('formData', formData);
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
