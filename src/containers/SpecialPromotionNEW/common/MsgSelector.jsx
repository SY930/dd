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

class MessageSelector extends React.Component {

    constructor(props) {
        super(props);
        let messageTemplateList = Immutable.List.isList(props.messageTemplateList) ? props.messageTemplateList.toJS() : [];
        messageTemplateList = messageTemplateList.filter(templateEntity => templateEntity.auditStatus == 2).map(templateEntity => templateEntity.template);
        if (props.selectedMessage) {
            messageTemplateList.unshift(props.selectedMessage);
        }
        messageTemplateList = uniq(messageTemplateList);
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
        // 新建活动时  有可选短信模板的情况下默认选中第一个
        if (!this.props.selectedMessage && this.state.messageTemplateList.length) {
            this.props.onChange && this.props.onChange(this.state.messageTemplateList[0]);
        }
    }

    componentWillReceiveProps(nextProps) {
        let { loading, messageTemplateList } = this.state;
        if (this.props.loading !== nextProps.loading) {
            loading = nextProps.loading;
        }
        if (this.props.messageTemplateList !== nextProps.messageTemplateList) {
            messageTemplateList = Immutable.List.isList(nextProps.messageTemplateList) ? nextProps.messageTemplateList.toJS() : [];
            messageTemplateList = messageTemplateList.filter(templateEntity => templateEntity.auditStatus == 2).map(templateEntity => templateEntity.template);
            if (nextProps.selectedMessage) {
                messageTemplateList.unshift(nextProps.selectedMessage)
            }
            messageTemplateList = uniq(messageTemplateList);
        }
        this.setState({
            loading,
            messageTemplateList
        })
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
        const messageTemplateList = this.state.messageTemplateList;
        return (

            <div style={{maxHeight: '280px', overflowY: 'auto'}}>
                {!!messageTemplateList.length &&  messageTemplateList.map((message, index) => {
                    return (
                        <MessageDisplayBox  selected={this.props.selectedMessage ? message === this.props.selectedMessage : index === 0}
                                            message={message}
                                            key={index}
                                            onClick={() => this.handleMsgSelect(message)}
                        />
                    );
                })}
                {
                    !messageTemplateList.length &&
                    <div className={styles.leanBox} style={{border: '1px solid rgba(128, 128, 128, 0.5)'}} >
                        <div style={{textAlign: 'center', margin: '41px 0'}}>
                            当前没有审核通过的的短信模板，<a onClick={this.jumpAway}>去设置</a>
                        </div>
                    </div>
                }
                {
                    !!messageTemplateList.length &&
                    <div className={styles.leanBox} style={{border: '1px solid rgba(128, 128, 128, 0.5)'}}>
                        <div style={{textAlign: 'center', margin: '41px 0'}}>
                            没有更多审核通过的的短信模板了，<a onClick={this.jumpAway}>去设置</a>
                        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageSelector);
