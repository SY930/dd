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
            title: <span style={{color: '#434343'}}>您确定要删除吗 ?</span>,
            content:
                    <div>
                        <span style={{color: '#787878'}}>
                            {`您将删除【${this.props.template ? this.props.template.substring(0, 6) + '...' : ''}】短信模板`}
                        </span>
                        <br/>
                        <span style={{color: '#aeaeae'}}>
                            删除数据是不可恢复操作, 请慎重考虑
                        </span>
                    </div>
                     ,
            onOk: () => {
                return this.props.deleteMessageTemplate({
                                    modifyBy: this.props.user.accountInfo.userName,
                                    itemID: this.props.id,
                                })
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
                            <div    className={styles.deleteButton}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                            >
                                <Authority rightCode="crm.sale.smsTemplate.delete">
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.showConfirm();
                                    }}
                                    >删除</span>
                                </Authority>
                            </div>

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
