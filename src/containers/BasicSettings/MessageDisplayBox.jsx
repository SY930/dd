import React from 'react';
import { connect } from 'react-redux';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { Modal, Button, message } from 'antd';
import {
    deleteMessageTemplate,
    getMessageTemplateList,
} from "./actions";
import Authority from "../../components/common/Authority/index";
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
            onOk: () => {
                return this.props.deleteMessageTemplate({modifyBy: this.props.user.accountInfo.userName})
                                .then(() => {
                                    message.success(`删除成功`);
                                    this.props.getMessageTemplateList();
                                })
                                .catch(err => message.error(`删除失败: ${err}`));
            },
            onCancel() {},
        });
    }

    render() {
        return (
            <Authority rightCode="crm.sale.smsTemplate.update">
                <div className={styles.messageDisplayBox} onClick={this.props.handleClick}>
                    <div className={styles.rightTopAction}>
                        <Authority rightCode="crm.sale.smsTemplate.delete">
                            <div    className={styles.deleteButton}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.showConfirm();
                                    }}
                            >
                                &nbsp;删除&nbsp;
                            </div>
                        </Authority>
                    </div>
                    <div className={styles.messageContentWrapper}>
                        {this.props.template}
                    </div>
                </div>
            </Authority>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return {
        deleteMessageTemplate: opts => dispatch(deleteMessageTemplate(opts)),
        getMessageTemplateList: opts => dispatch(getMessageTemplateList(opts)),
    };
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageDisplayBox);
