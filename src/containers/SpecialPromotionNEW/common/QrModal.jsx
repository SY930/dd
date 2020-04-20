import React, { PureComponent as Component } from 'react';
import { Modal, Button } from 'antd';

const srcMap = {
    21: 'http://res.hualala.com/basicdoc/27c58c1c-ad37-4303-8d2a-dbce0600804a.jpg',
    68: 'http://res.hualala.com/basicdoc/13c0bda6-ca70-4137-9f4c-1651eb25fb22.jpg',
    66: 'http://res.hualala.com/basicdoc/49e6b232-c70d-45a8-af4a-6cb5eba3a1a9.jpg',
    65: 'http://res.hualala.com/basicdoc/1f139f69-745b-422d-a68f-eca5be17d4c8.jpg',
}
class QrModal extends Component {
    // 下载二维码图片
    downLoadImage = () => {

    }
    render() {
        const { onClose, type } = this.props;
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
