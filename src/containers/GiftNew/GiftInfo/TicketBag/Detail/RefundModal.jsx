import React, { PureComponent as Component } from 'react';
import { Modal, Alert } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { refundItems, formItemLayout } from '../Common';

const formItemKeys = ['refundRemark'];
class RefundModal extends Component {
    /* 页面需要的各类状态属性 */
    state = {};

    /* 表单提交 */
    onOk = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { list, onClose, onPost } = this.props;
                const params = { ...v, orderKey: list };
                onPost(params);
                onClose();
            }
        });
    }

    /** 得到form */
    onGetForm = (form) => {
        this.form = form;
    }

    render() {
        const { onClose } = this.props;
        return (
            <Modal
                title="商家退款"
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={onClose}
            >
                <Alert
                    message="提示：如果券包已使用或者已过期，请谨慎操作退款"
                    type="warning"
                    style={{ color: '#8a6d3b' }}
                    showIcon={true}
                />
                <BaseForm
                    getForm={this.onGetForm}
                    formItems={refundItems}
                    formKeys={formItemKeys}
                    formItemLayout={formItemLayout}
                />
            </Modal>
        )
    }
}
export default RefundModal
