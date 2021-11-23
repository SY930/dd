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

    needShowChange = (checked, e) => {
        this.onChange('needShow', checked ? 1 : 0)
    }

    openBoxRender = (d) => {
        let {needShow, formData} = this.props
        let {userCount} = formData
        const disable = (userCount > 0);
        return (
            <div>
                <div className={css.titBox}>
                    <p className={css.titleTip}>明盒</p>
                    <Switch defaultChecked={needShow} disabled={disable} onChange={this.needShowChange} checkedChildren="开" unCheckedChildren="关" />
                </div>
                <p>盲盒活动中，部分可以直接展示给消费者礼品可以设置明盒礼品，全盲盒活动则不需要设置</p>
            </div>
        )
    }

    
    /** formItems 重新设置 */
    resetFormItems() {
        const render = d => d()(<MyFaceRule form={this.props.form} decorator={d} />);
        const { lottery, ...others } = formItems3;
        return {
            ...others,
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
