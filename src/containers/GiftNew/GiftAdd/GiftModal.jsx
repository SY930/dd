import React, { PureComponent as Component } from 'react';
import { Modal, TreeSelect } from 'antd';
import BaseForm from '../../../components/common/BaseForm';
import { SALE_CENTER_GIFT_EFFICT_TIME } from '../../../redux/actions/saleCenterNEW/types';

const formKeys = ['giftName', 'giftCount', 'effectType', 'validUntilDate', 'effectTime', 'giftValidUntilDayCount'];
const formItems = {
    giftName: {
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
    validUntilDate: {
        type: 'radio',
        label: '相对有效期',
        defaultValue: '0',
        options: [
            { label: '按小时', value: '0' },
            { label: '按天', value: '1' },
        ],
    },
    effectTime: {
        type: 'combo',
        label: '生效时间',
        options: SALE_CENTER_GIFT_EFFICT_TIME,
        defaultValue: '',
    },
    giftValidUntilDayCount: {
        type: 'text',
        label: '有效天数',
        surfix: '天',
        rules: ['required', 'numbers'],
    },
};
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 13 },
}
export default class GiftModal extends Component {
    /* 页面需要的各类状态属性 */
    state = {
    };
    /* 表单提交 */
    onOk = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { onClose } = this.props;
                onPut().then((flag) => {
                    flag && onClose();
                });
            }
        });
    }
    /** 表单内容变化时的监听 */
    onFormChange = (key, value) => {
    }
    /** 得到form */
    getForm = (node) => {
        this.form = node;
    }
    resetFormItems() {
        const { treeData } = this.props;
        const { giftName } = formItems;
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
            giftName: { ...giftName, render },
        }
    }
    render() {
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
