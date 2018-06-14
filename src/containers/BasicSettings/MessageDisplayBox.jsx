import React from 'react';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { Modal, Button } from 'antd';
const confirm = Modal.confirm;

class MessageDisplayBox extends React.Component {

    constructor(props) {
        super(props);
        this.showConfirm = this.showConfirm.bind(this);
    }

    showConfirm() {
        confirm({
            title: '确定要删除该短信模板吗?',
            content: '点击 `确定` 来删除',
            onOk() {
                return new Promise((resolve, reject) => {
                    setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                }).catch(() => console.log('Oops errors!'));
            },
            onCancel() {},
        });
    }

    render() {
        return (
            <div className={styles.messageDisplayBox} onClick={this.props.handleClick}>
                <div className={styles.rightTopAction}>
                    <div    className={styles.deleteButton}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.showConfirm();
                            }}
                    >
                        &nbsp;删除&nbsp;
                    </div>
                </div>
                <div className={styles.messageContentWrapper}>
                    {this.props.template}
                </div>
            </div>
        )
    }
}

export default MessageDisplayBox;
