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
    }
    
    /** formItems 重新设置 */
    resetFormItems() {
        const render = d => d()(<MyFaceRule
            form={this.props.form}
            decorator={d}
            useApp={this.props.useApp}
            allActivityList={this.props.allActivity}
            allMallActivity={this.props.allMallActivity}
        />);
        const { faceRule, ...others } = formItems3;
        return {
            ...others,
            faceRule: { ...faceRule, render },
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
