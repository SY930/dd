import React, { PureComponent as Component } from 'react';
import { Modal, Alert, message } from 'antd';
import BaseForm from 'components/common/BaseForm';
import { stockItems } from './Common';
import { postStock } from './AxiosFactory';
import styles from './index.less';

const keys = ['type', 'remainStock'];
class StockModal extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        formKeys: keys,
    };

    /* 表单提交 */
    onOk = () => {
        this.form.validateFields((e, v) => {
            if (!e) {
                const { onClose, ids } = this.props;
                const { type, remainStock } = v;
                let stock = remainStock;
                if(type==='1'){
                    stock = '-1';
                }
                const params = { remainStock: stock, ...ids };
                postStock(params).then(flag => {
                    if(flag){
                        onClose('reload');
                    }
                });
            }
        });
    }
    onChange = (key, value) => {
        if(key==='type'){
            const formKeys = (value==='1') ? ['type'] : keys;
            this.setState({ formKeys });
        }
    }
    /** 得到form */
    onGetForm = (form) => {
        this.form = form;
    }

    render() {
        const { formKeys } = this.state;
        const { onClose, stock } = this.props;
        let formData = { remainStock: stock };
        if(stock === '-1') {
            formData = { type: '1' };
        }
        return (
            <Modal
                title=""
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={onClose}
            >
                <div className={styles.stockBox}>
                    <BaseForm
                        getForm={this.onGetForm}
                        formItems={stockItems}
                        formKeys={formKeys}
                        onChange={this.onChange}
                        formData={formData}
                        layout="inline"
                    />
                </div>
            </Modal>
        )
    }
}
export default StockModal
