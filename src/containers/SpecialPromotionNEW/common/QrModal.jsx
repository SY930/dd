import React, { PureComponent as Component } from 'react';
import { Modal, Button } from 'antd';

const srcMap = {
    21: 'http://res.hualala.com/basicdoc/3ca4fbc0-144a-4f2a-98d4-3278d986cd63.jpg',
    68: 'http://res.hualala.com/basicdoc/c33018a4-b10d-49b0-9152-720d713edbde.jpg',
    66: 'http://res.hualala.com/basicdoc/ede5bda3-7fe4-43f0-8570-4411665c79fe.jpg',
    65: 'http://res.hualala.com/basicdoc/03bab0f1-91d8-4988-aeb3-469791512712.jpg',
}
// 65分享壕礼  66 膨胀大礼包  68推荐有礼 21 免费领取
class QrModal extends Component {
    // 下载二维码图片
    downLoadImage = () => {

    }
    render() {
        const { onClose, type } = this.props;
        console.log('type', type);
        return (
            <Modal
                title="示例"
                visible={true}
                maskClosable={false}
                onCancel={onClose}
                footer={[<Button key="d" onClick={onClose}>我知道了</Button>]}
            >
                <img src={srcMap[type]} />
            </Modal>
        )
    }
}
export default QrModal
