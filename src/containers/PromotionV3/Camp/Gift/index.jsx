import React, { PureComponent as Component } from 'react';
import { TreeSelect } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { timeOpts, dayOpts } from './Common';
import { formKeys1, formItems, formKeys2, formItemLayout } from './Common';
import css from './style.less';

export default class Gift extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        options: [],    //生效时间下拉框
        formKeys: formKeys1,
        // 组件是否为编辑状态  默认false  首次进入onFormChange  不重置giftEffectTimeHours
        countTypeEditFlag: false,
        effectTypeEditFlag: false
    };
    /** 表单内容变化时的监听 */
    onFormChange = (key, value) => {
        const { idx, onChange, treeData } = this.props;
        if(key === 'countType') {
            const options = (value === '0') ? timeOpts : dayOpts;
            this.setState({ options });
            if(this.state.countTypeEditFlag){
                this.form.setFieldsValue({ 'giftEffectTimeHours': value });
                onChange(idx, {[key]: value, 'giftEffectTimeHours': value});
            } 
            this.setState({countTypeEditFlag: true})
        }else if(key==='effectType'){
            if(value === '1') {
                this.setState({ formKeys: formKeys1 }, ()=>{
                    const countType = this.form.getFieldValue('countType');
                    if(this.state.effectTypeEditFlag){
                        this.form.setFieldsValue({ 'giftEffectTimeHours': countType });
                        onChange(idx, {[key]: value, 'giftEffectTimeHours': countType});
                    } 
                    this.setState({effectTypeEditFlag: true})
                });
            } else {
                onChange(idx, { [key]: value });
                this.setState({ formKeys: formKeys2 });
            }
        }else{
            onChange(idx, { [key]: value });
        }
    }
    /** 得到form */
    getForm = (node) => {
        this.form = node;
    }
    resetFormItems() {
        const { options } = this.state;
        const { treeData } = this.props;
        const { giftID, giftEffectTimeHours } = formItems;
        const render = d => d()(
            <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择礼品名称"
                showSearch={true}
                treeNodeFilterProp="label"
                allowClear={true}
            />);
        return {
            ...formItems,
            giftID: { ...giftID, render },
            giftEffectTimeHours: { ...giftEffectTimeHours, options },
        }
    }
    render() {
        const { formKeys } = this.state;
        const { formData } = this.props;
        console.log('>>', formData)
        const newFormItems = this.resetFormItems();
        return (
            <div className={css.mainBox}>
                <BaseForm
                    getForm={this.getForm}
                    formItems={newFormItems}
                    formKeys={formKeys}
                    onChange={this.onFormChange}
                    formData={formData || {}}
                    formItemLayout={formItemLayout}
                />
            </div>
        )
    }
}
