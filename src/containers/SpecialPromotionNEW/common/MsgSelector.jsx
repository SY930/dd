import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import classnames from 'classnames';
import { uniq } from 'lodash';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import { jumpPage } from '@hualala/platform-base';
import {
    Icon
} from 'antd';
import {getMessageTemplateList} from "../../BasicSettings/actions";
import {SET_MSG_TEMPLATE} from "../../../constants/entryCodes";
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE, COMMON_SPE } from 'i18n/common/special';


@injectIntl
class MsgSelector extends React.Component {

    constructor(props) {
        super(props);
        let messageTemplateList = Immutable.List.isList(props.messageTemplateList) ? props.messageTemplateList.toJS() : [];
        messageTemplateList = messageTemplateList.filter(templateEntity => templateEntity.auditStatus == 2).map(templateEntity => templateEntity.template);
        this.state = {
            messageTemplateList: messageTemplateList,
            loading: props.loading,
        };
        this.handleMsgSelect = this.handleMsgSelect.bind(this);
    }

    componentDidMount() {
        if (!this.state.loading && !this.state.messageTemplateList.length) {
            this.props.getMessageTemplateList();
        }
    }

    componentWillReceiveProps(nextProps) {
        let { loading, messageTemplateList } = this.state;
        if (this.props.loading !== nextProps.loading) {
            loading = nextProps.loading;
            this.setState({
                loading,
            })
        }
        if (this.props.messageTemplateList !== nextProps.messageTemplateList) {
            messageTemplateList = Immutable.List.isList(nextProps.messageTemplateList) ? nextProps.messageTemplateList.toJS() : [];
            messageTemplateList = messageTemplateList.filter(templateEntity => templateEntity.auditStatus == 2).map(templateEntity => templateEntity.template);
            this.setState({
                messageTemplateList
            })
        }
    }

    handleMsgSelect(message) {
        this.props.onChange && this.props.onChange(message);
    }

    jumpAway = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const menuID = this.props.user.menuList.find(tab => tab.entryCode === SET_MSG_TEMPLATE).menuID
        menuID && jumpPage({menuID});
        const cancelBtn = document.querySelector('.cancelBtnJs');
        cancelBtn && cancelBtn.click();
    }

    render() {
        let messageTemplateList = this.state.messageTemplateList.slice();
        messageTemplateList = uniq(messageTemplateList);
        (this.props.selectedMessage && !messageTemplateList.includes(this.props.selectedMessage)) && messageTemplateList.unshift(this.props.selectedMessage);
        return (

            <div style={{maxHeight: '272px', overflowY: 'auto'}}>
                {!!messageTemplateList.length &&  messageTemplateList.map((message, index) => {
                    return (
                        <MessageDisplayBox  selected={message === this.props.selectedMessage}
                                            message={message}
                                            key={index}
                                            onClick={() => this.handleMsgSelect(message)}
                        />
                    );
                })}
                {
                    !messageTemplateList.length &&
                    <div className={`${styles.leanBox} ${styles.emptyMessageBox}`}>
                     {this.props.intl.formatMessage(STRING_SPE.dojvjdafo0208)}<a onClick={this.jumpAway}>{this.props.intl.formatMessage(STRING_SPE.d56716c805b3134)}</a>
                    </div>
                }
                {
                    !!messageTemplateList.length &&
                    <div className={`${styles.leanBox} ${styles.emptyMessageBox}`}>
                    {this.props.intl.formatMessage(STRING_SPE.d1e05b4srh236)}<a onClick={this.jumpAway}>{this.props.intl.formatMessage(STRING_SPE.d56716c805b3134)}</a>
                    </div>
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        loading: state.messageTemplateState.get('messageTemplateListLoading'),
        messageTemplateList: state.messageTemplateState.get('messageTemplateList'),
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getMessageTemplateList: opts => dispatch(getMessageTemplateList(opts)),
    };
}

function MessageDisplayBox(props){
    const classNames = classnames(
        {[styles.messageDisplayBox]: !props.selected},
        {[styles.leanBox]: !props.selected},
        {[styles.isSelectedMessage]: props.selected}
    );
    return (
        <div title={props.selected ? `${COMMON_SPE.d7h7h72c98c018}` : `${COMMON_SPE.du38ot6hu1140}`}
            className={classNames}
            onClick={props.onClick}
        >
            {
                props.selected &&
                <div className={styles.rightTopAction}>
                    <Icon type="check" />
                </div>
            }
            <div className={styles.messageContentWrapper}>
                {props.message}
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(MsgSelector);
