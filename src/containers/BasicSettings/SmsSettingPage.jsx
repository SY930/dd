import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import registerPage from '../../index';
import imgSrc from '../../assets/empty_ph.png';
import {
    Row,
    Button,
    Col,
    Modal,
    Spin,
} from 'antd';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { SET_MSG_TEMPLATE } from '../../constants/entryCodes';
import MessageDisplayBox from './MessageDisplayBox';
import MessageTemplateEditPanel from './MessageTemplateEditPanel'
import {messageTemplateState} from "./reducers";
import {getMessageTemplateList} from "./actions";
import Authority from "../../components/common/Authority/index";
import {SMS_TEMPLATE_CREATE} from "../../constants/authorityCodes";
import {isBrandOfHuaTianGroupList} from "../../constants/projectHuatianConf";
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

@registerPage([SET_MSG_TEMPLATE], {
    messageTemplateState
})
@connect(mapStateToProps, mapDispatchToProps)
@injectIntl()
class MessageTemplatesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageTemplateList: Immutable.List.isList(props.messageTemplateList) ? props.messageTemplateList.toJS() : [],
            editModalVisible: false,
            messageTemplateToEdit: null,
        };
        this.editTemplate = this.editTemplate.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
    }

    componentDidMount() {
        this.props.getMessageTemplateList({
            pageNo : 1,
            pageSize : 10
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user.activeTabKey !== nextProps.user.activeTabKey && nextProps.user.activeTabKey === SET_MSG_TEMPLATE) {
            const tabArr = nextProps.user.tabList.map((tab) => tab.value);
            if (tabArr.includes(SET_MSG_TEMPLATE)) {
                this.props.getMessageTemplateList({}); // tab里已有该tab，从别的tab切换回来，就自动查询，如果是新打开就不执行此刷新函数，而执行加载周期里的
            }
        }
        let { messageTemplateList } = this.state;
        if (this.props.messageTemplateList !== nextProps.messageTemplateList) {
            messageTemplateList = Immutable.List.isList(nextProps.messageTemplateList) ? nextProps.messageTemplateList.toJS() : [];
            this.setState({
                messageTemplateList
            })
        }
    }

    closeEditModal() {
        this.setState({
            editModalVisible: false,
            messageTemplateToEdit: null
        })
    }

    renderEditModal() {
        return (
                <MessageTemplateEditPanel
                    cancel={this.closeEditModal}
                    visible={this.state.editModalVisible}
                    templateEntity={this.state.messageTemplateToEdit}/>
        );
    }

    editTemplate(messageTemplate) {
        this.setState({
            editModalVisible: true,
            messageTemplateToEdit: messageTemplate
        })
    }

    render() {
        const messageTemplateList = this.state.messageTemplateList;
        const pendingTemplates = messageTemplateList.filter(item => item.auditStatus == 1);
        const verifiedTemplates = messageTemplateList.filter(item => item.auditStatus == 2);
        const illegalTemplates = messageTemplateList.filter(item => item.auditStatus == 3);
        return (
        <div className="layoutsContainer">
            {this.renderEditModal()}
            <div
                className="layoutsTool"
                style={{
                    height: '100%',
                }}
            >
                <div style={{height: '79px', backgroundColor: '#F3F3F3'}}>
                    <div className={styles.headerWithBgColor}>
                        <span className={styles.customHeader}>
                            {SALE_LABEL.k6d9ll1r}
                            <Authority rightCode={SMS_TEMPLATE_CREATE}>
                                <Button
                                    type="ghost"
                                    icon="plus"
                                    className={styles.jumpToCreate}
                                    onClick={
                                        () => {
                                            this.editTemplate(null);
                                        }
                                    }>{ COMMON_LABEL.create }</Button>
                            </Authority>
                        </span>
                    </div>
                </div>
                <div style={{
                    height: 'calc(100% - 79px)',
                    overflowY: 'auto'
                }}>
                    <Spin spinning={this.props.loading}>
                        {
                            !messageTemplateList.length ?
                                <div style={{
                                    paddingTop: '185px',
                                }}>
                                    <div className={styles.centerFlexContainer}>
                                        <div>
                                            <img src={imgSrc} width="154px" height="66px" alt=" "/>
                                            <span style={{
                                                display: 'inline-block',
                                                marginLeft: '27px'
                                            }}>
                                                {SALE_LABEL.k6d9lla3}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div style={{ padding: 30}}>
                                    {!!pendingTemplates.length && <MessageGroup title={SALE_LABEL.k6d9llif} key="待审核" messages={pendingTemplates} edit={this.editTemplate}/>}
                                    {!!verifiedTemplates.length && <MessageGroup title={SALE_LABEL.k6d9llqr} key="审核通过" messages={verifiedTemplates} edit={this.editTemplate}/>}
                                    {!!illegalTemplates.length && <MessageGroup title={SALE_LABEL.k6d9llz3} key="审核未通过" messages={illegalTemplates} edit={this.editTemplate}/>}
                                </div>
                        }
                    </Spin>
                </div>

            </div>
        </div>
        );
    }
}
class MessageGroup extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {messages, title} = this.props;
        return (
            <div className={styles.messageGroupWrapper}>
                <div style={{fontSize: '20px', color: '#333',}}>{title}</div>
                <div className={styles.scrollableMessageContainer}>
                    {!!messages.length && messages.map((item, index) => {
                        return <MessageDisplayBox
                            template={item.template}
                            id={item.itemID}
                            handleClick={() => this.props.edit(item)}
                            key={item.itemID}
                        />;
                    })}
                    {!messages.length &&
                        <div className={styles.emptyMessageGroup} style={{}}>
                            {SALE_LABEL.k6d9lm7f} {title} {SALE_LABEL.k6d9lmfr}
                        </div>
                    }
                </div>
            </div>
        );
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

export default MessageTemplatesPage;
