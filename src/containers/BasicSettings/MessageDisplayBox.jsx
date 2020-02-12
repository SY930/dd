import React from 'react';
import { connect } from 'react-redux';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { Modal, Button, message } from 'antd';
import {
    deleteMessageTemplate,
    getMessageTemplateList,
} from "./actions";
import Authority from "../../components/common/Authority/index";
import {SMS_TEMPLATE_DELETE, SMS_TEMPLATE_UPDATE} from "../../constants/authorityCodes";
import {isBrandOfHuaTianGroupList} from "../../constants/projectHuatianConf";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

const confirm = Modal.confirm;
@injectIntl()
class MessageDisplayBox extends React.Component {

    constructor(props) {
        super(props);
        this.showConfirm = this.showConfirm.bind(this);
    }

    showConfirm() {
        confirm({
            title: <span style={{color: '#434343'}}>{SALE_LABEL.k5dnw1q3} ?</span>,
            content:
                    <div>
                        <span style={{color: '#787878'}}>
        {SALE_LABEL.k5do6vse}{`【${this.props.template ? this.props.template.substring(0, 6) + '...' : ''}】`}{SALE_LABEL.k6d9ll1r}
                        </span>
                        <br/>
                        <span style={{color: '#aeaeae'}}>
                            {SALE_LABEL.k5do4z54}
                        </span>
                    </div>
                     ,
            onOk: () => {
                return this.props.deleteMessageTemplate({
                                    modifyBy: this.props.user.accountInfo.userName,
                                    itemID: this.props.id,
                                })
                                .then(() => {
                                    message.success(SALE_LABEL.k5do0ps6);
                                    this.props.getMessageTemplateList();
                                })
                            .catch(err => message.error(<span>{SALE_LABEL.k5doax7i}: {err}</span>));
            },
            onCancel() {},
        });
    }

    render() {
        return (
            <Authority rightCode={SMS_TEMPLATE_UPDATE}>
                <div className={styles.messageDisplayBox} onClick={this.props.handleClick}>
                    <div className={styles.rightTopAction}>
                            <div    className={styles.deleteButton}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                            >
                                {!isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && (
                                    <Authority rightCode={SMS_TEMPLATE_DELETE}>
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.showConfirm();
                                    }}
                                    >{ COMMON_LABEL.delete }</span>
                                    </Authority>
                                ) }
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
