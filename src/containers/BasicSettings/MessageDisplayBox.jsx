import React from 'react';
import { connect } from 'react-redux';
import styles from './BasicSettings.less';
import { Modal, Button, message, Icon } from 'antd';
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
        const {rejectReason,template} = this.props
        return (
            <Authority rightCode={SMS_TEMPLATE_UPDATE}>
                <div  className={styles.messageDisplayBox} >
                    <div className={styles.rightTopAction}>
                            {/* <div    className={styles.deleteButton}
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
                            </div> */}
                            <div className={styles.actBtnWrap}>
                                <div onClick={this.props.handleClick} className={styles.btnItem}>
                                    <Icon style={{fontSize: '20px', marginBottom: '4px'}} type="edit" />
                                    <div>编辑</div>
                                </div>
                                <div  onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        this.showConfirm();
                                    }} style={{marginLeft: '50px'}} className={styles.btnItem}>
                                    <Icon style={{fontSize: '20px', marginBottom: '4px'}} type="delete" />
                                    <div>删除</div>
                                </div>
                            </div>
                    </div>
                    <div style={!rejectReason ? {height: 'calc(100% - 18px)',paddingBottom: '18px'} : {}} className={styles.messageContentWrapper}>
                        {template}
                    </div>
                    {rejectReason &&  <div className={styles.messageRejectReason}>
                        驳回原因：{rejectReason}
                    </div>}

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
