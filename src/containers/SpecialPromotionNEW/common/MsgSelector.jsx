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
        this.props.selectedMessage && messageTemplateList.unshift(this.props.selectedMessage);
        messageTemplateList = uniq(messageTemplateList);
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
                        当前没有审核通过的的短信模板，<a onClick={this.jumpAway}>去设置</a>
                    </div>
                }
                {
                    !!messageTemplateList.length &&
                    <div className={`${styles.leanBox} ${styles.emptyMessageBox}`}>
                        没有更多审核通过的的短信模板了，<a onClick={this.jumpAway}>去设置</a>
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

function MessageDisplayBox(props) {
    const classNames = classnames(
        {[styles.messageDisplayBox]: !props.selected},
        {[styles.leanBox]: !props.selected},
        {[styles.isSelectedMessage]: props.selected}
    );
    return (
        <div title={props.selected ? '已选模板' : '点击选择'}
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
