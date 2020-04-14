import React, { PureComponent as Component } from 'react';
import { Modal, Button } from 'antd';

class QrModal extends Component {
    // 下载二维码图片
    downLoadImage = () => {

    }
    render() {
        const { onClose, url } = this.props;
        return (
            <Modal
                title="示例"
                visible={true}
                maskClosable={false}
                onCancel={onClose}
                footer={[<Button key="d" onClick={onClose}>我知道了</Button>]}
            >
                <img src="http://res.hualala.com/basicdoc/27c58c1c-ad37-4303-8d2a-dbce0600804a.jpg" />
            </Modal>
        )
    }
}
export default QrModal
