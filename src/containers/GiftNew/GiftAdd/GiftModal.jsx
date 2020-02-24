import React, { PureComponent as Component } from 'react';
import { Modal, TreeSelect } from 'antd';
import BaseForm from '../../../components/common/BaseForm';
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';

const formKeys1 = ['giftItemID', 'giftCount', 'effectType', 'countType', 'giftEffectTimeHours', 'giftValidUntilDayCount'];
const formKeys2 = ['giftItemID', 'giftCount', 'effectType', 'rangeDate'];
const formItems = {
    giftItemID: {
        type: 'custom',
        label: '礼品名称',
        rules: ['required'],
        render: null,
    },
    giftCount: {
        type: 'text',
        label: '礼品数量',
        surfix: '个',
        rules: ['required', 'numbers'],
    },
    effectType: {
        type: 'radio',
        label: '生效方式',
        defaultValue: '1',
        options: [
            { label: '相对有效期', value: '1' },
            { label: '固定有效期', value: '2' },
        ],
    },
    countType: {
        type: 'radio',
        label: '相对有效期',
        defaultValue: '0',
        options: [
            { label: '按小时', value: '0' },
            { label: '按天', value: '1' },
        ],
    },
    giftEffectTimeHours: {
        type: 'combo',
        label: '生效时间',
        options: SALE_CENTER_GIFT_EFFICT_TIME,
        defaultValue: '0',
    },
    giftValidUntilDayCount: {
        type: 'text',
        label: '有效天数',
        surfix: '天',
        rules: ['required', 'numbers'],
    },
    rangeDate: {
        type: 'datepickerRange',
        label: '固定有效期',
        rules: ['required'],
    },
};
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13 },
}
export default class GiftModal extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        options: [],    //生效时间下拉框
        formKeys: formKeys1,
    };
    /* 表单提交 */
    onOk = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { onClose, onPost } = this.props;
                onPost(v);
                onClose();
            }
        });
    }
    /** 表单内容变化时的监听 */
    onFormChange = (key, value) => {
        if(key === 'countType') {
            const options = (value === '0') ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY;
            this.setState({ options });
            this.form.setFieldsValue({ 'giftEffectTimeHours': value });
        }
        if(key==='effectType'){
            if(value === '1') {
                this.setState({ formKeys: formKeys1 });
            } else {
                this.setState({ formKeys: formKeys2 });
            }
        }
    }
    /** 得到form */
    getForm = (node) => {
        this.form = node;
    }
    resetFormItems() {
        const { options } = this.state;
        const { treeData } = this.props;
        const { giftItemID, giftEffectTimeHours } = formItems;
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
            giftItemID: { ...giftItemID, render },
            giftEffectTimeHours: { ...giftEffectTimeHours, options },
        }
    }
    render() {
        const { formKeys } = this.state;
        const { onClose } = this.props;
        const newFormItems = this.resetFormItems();
        return (
            <Modal
                title="添加礼品"
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={onClose}
            >
                <BaseForm
                    getForm={this.getForm}
                    formItems={newFormItems}
                    formKeys={formKeys}
                    onChange={this.onFormChange}
                    formItemLayout={formItemLayout}
                />
            </Modal>
        )
    }
}
