import { Modal, Button,Icon } from 'antd';
import React from 'react';
import styles from './ShareSetting.less'
class MsgTpl extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        }
        this.handleMsgSelect = this.handleMsgSelect.bind(this);
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    handleMsgSelect(message) {
        this.props.onChange && this.props.onChange(message);
    }
    render() {
        const { msgTplList,selectedMessage } = this.props;
        return (
            <div>
                <Button onClick={this.showModal}>
                    <Icon type="plus" /> 选择短信模板
                </Button>
                <Modal
                    title="选择短信模板"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    className={styles.ModelWraper}
                >
                    { msgTplList.map((message,index) => {
                        return (
                            <div
                                key={index}
                                className={styles.messageContentWrapper}
                                message={message}
                                onClick={() => this.handleMsgSelect(message)}
                            >
                                {
                                    message == selectedMessage
                                    ?
                                    <div className={styles.rightTopAction}>
                                        <Icon type="check" />
                                    </div>
                                    :
                                    null
                                }
                                {
                                    message == selectedMessage
                                    ?
                                    <div className={`${styles.messageContent} ${styles.messageContent_Selected}`} >
                                        {message.template}
                                    </div>
                                    :
                                    <div className={styles.messageContent} >
                                        {message.template}
                                    </div>
                                }
                                
                            </div>
                        )
                    })}
                </Modal>
            </div>
        );
    }
}

export default MsgTpl