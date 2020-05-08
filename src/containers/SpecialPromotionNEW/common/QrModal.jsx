import React, { PureComponent as Component } from 'react';
import { Modal, Button } from 'antd';

const srcMap = {
    21: 'http://res.hualala.com/basicdoc/39d60e84-ea60-413c-a986-e680a76c0000.png',
    68: 'http://res.hualala.com/basicdoc/6417e092-1fcd-46eb-becb-8dc8ba55efef.png',
    66: 'http://res.hualala.com/basicdoc/8ff25052-78a4-4be3-a043-347302ca9238.png',
    65: 'http://res.hualala.com/basicdoc/87bfc2c7-c7b4-45b0-b78e-f2b29615d1db.png',
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
                <img width="95%" src={srcMap[type]} />
            </Modal>
        )
    }
}
export default QrModal
