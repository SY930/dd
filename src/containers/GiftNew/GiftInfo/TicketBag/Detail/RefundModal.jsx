import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { refundItems, formItemLayout } from '../Common';
import { postRefund } from '../AxiosFactory';

const formItemKeys = ['refundReason'];
class RefundModal extends Component {
    /* 页面需要的各类状态属性 */
    state = {};

    /* 表单提交 */
    onOk = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { list, onClose, ids } = this.props;
                if(list[10]){
                    message.warning('单次提交不能超过10个');
                    return;
                }
                const params = { ...v, ...ids, sourceType: 60,
                    sourceWay: false, customerCouponPackageIDs: list };
                postRefund(params).then(list => {
                    if(list){
                        if(list[0]){
                            const content = list.map(x=>{
                                return <p>
                                    <b>券包id</b>：{x.customerCouponPackageID}<br/>
                                    <b>错误码</b>：{x.errorCode}<br/>
                                    <b>失败原因</b>：{x.msg}<br/>
                                </p>
                            })
                            Modal.error({ title: '退款出错',content });
                        }
                        onClose();
                    }
                });
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
