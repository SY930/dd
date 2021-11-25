import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message, Switch, Form } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { formKeys31, formKeys32, formItems3, formItemLayout } from './Common';
import MyFaceRule from '../Camp/MyFaceRule/MyFaceRule';
import css from './style.less';

const FormItem = Form.Item;

class Step3 extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        newFormKeys: formKeys32,
    };

    componentDidMount(){
        // if(!this.props.needShow){
        //     this.setState({newFormKeys: [...formKeys32]})
        // }else{
        //     this.setState({newFormKeys: [...formKeys31]})
        // }
    }

    onChange = (key, value) => {
        console.log('file: Step3.jsx ~ line 25 ~ Step3 ~ key, value', key, value)
    }
    
    /** formItems 重新设置 */
    resetFormItems() {
        const render = d => d()(<MyFaceRule form={this.props.form} decorator={d} />);
        const { faceRule, ...others } = formItems3;
        return {
            ...others,
            faceRule: { ...faceRule, render },
        };
    }

    render() {
        const { newFormKeys } = this.state;
        const { formData, getForm } = this.props;
        console.log("🚀 ~ file: Step3.jsx ~ line 41 ~ Step3 ~ render ~ formData", formData)
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
