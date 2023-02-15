
import React, { PureComponent as Component } from 'react';
import { TreeSelect, Radio } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { timeOpts, dayOpts, formKeys1, formItems, formKeys2, formItemLayout } from './Common';

import css from './style.less';

const { Button: RadioButton, Group: RadioGroup } = Radio;

export default class Gift extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        options: [], // 生效时间下拉框
        formKeys: formKeys1,
        countType: '0',
        giftIDNumber:''
    };

    onChangeCountType = ({ target }) => {
        const { idx, onChange } = this.props;
        const { value } = target
        if (value == '1') {
            onChange({ 'giftEffectTimeHours': '1' }, this.form);
            this.form.setFieldsValue({ 'giftEffectTimeHours': '1' });
        }
        const options = (value === '0') ? timeOpts : dayOpts;
        this.setState({
            options,
            countType: value
        });
        onChange({ countType: value }, this.form);
    }

    /** 表单内容变化时的监听 */
    onFormChange = (key, value) => {
        const { idx, onChange } = this.props;
        if (key === 'countType') {
            const options = (value === '0') ? timeOpts : dayOpts;
            this.setState({
                options,
                countType: value
            });
            // this.form.setFieldsValue({ 'giftEffectTimeHours': value });
        }
        if (key === 'effectType') {
            if (value === 1) {
                this.setState({ formKeys: formKeys1 }, () => {
                    // const countType = this.form.getFieldValue('countType');
                    // this.form.setFieldsValue({ 'giftEffectTimeHours': countType });
                });
            } else {
                this.setState({ formKeys: formKeys2 });
            }
        }
        if (key === 'giftID'){
            this.setState(
                {
                    giftIDNumber:value
                }
            )
        }

        onChange({ [key]: value }, this.form);
    }
    /** 得到form */
    getForm = (node) => {
        this.form = node;
    }
    resetFormItems() {
        const { options, countType } = this.state;
        const { treeData } = this.props;
        const { giftID, giftEffectTimeHours, countType: countTypeform } = formItems;
        const render = d => d()(
            <TreeSelect
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={treeData}
                placeholder="请选择礼品名称"
                showSearch={true}
                treeNodeFilterProp="label"
                allowClear={false}
            />);
        return {
            ...formItems,
            giftID: { ...giftID, render },
            giftEffectTimeHours: {
                ...giftEffectTimeHours,
                options,
                defaultValue: countType == 0 ? '0' : '1',
            },
            countType: {
                ...countTypeform,
                render: (d, form) => {
                    return d({
                        onChange:this.onChangeCountType
                    })(
                        <RadioGroup>
                            {countTypeform.options.map((item, key) => (<Radio key={key} value={item.value}>{item.label}</Radio>))}
                        </RadioGroup>
                    )
                }
            }
        }
    }
    render() {
        const { formKeys,giftIDNumber } = this.state;
        let { formData } = this.props;
        const newFormItems = this.resetFormItems();
        if(formData){
            formData.giftIDNumber = giftIDNumber ? giftIDNumber : formData.giftID;
        }
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
