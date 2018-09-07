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

@registerPage([SET_MSG_TEMPLATE], {
    messageTemplateState
})
@connect(mapStateToProps, mapDispatchToProps)
class MessageTemplatesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageTemplateList: Immutable.List.isList(props.messageTemplateList) ? props.messageTemplateList.toJS() : [],
            contentHeight: 800,
            editModalVisible: false,
            messageTemplateToEdit: null,
        };
        this.onWindowResize = this.onWindowResize.bind(this);
        this.editTemplate = this.editTemplate.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
    }

    componentDidMount() {
        this.props.getMessageTemplateList({
            pageNo : 1,
            pageSize : 10
        });
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
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

    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 106;
        this.setState({ contentHeight });
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
            <div className="layoutsTool">
                <div className="layoutsToolLeft" style={{height: '90px', lineHeight: '90px'}}>
                    <span style={{
                        lineHeight: '90px',
                        marginLeft: '50px',
                        display: 'inline-block',
                        fontSize: '36px',
                    }}>短信模板</span>
                    <Authority rightCode="crm.sale.smsTemplate.create">
                        <Button
                            type="ghost"
                            icon="plus"
                            className={styles.jumpToCreate}
                            style={{
                                height: '30px',
                                width: '90px',
                                left: '224px',
                                position: 'absolute',
                                top: '30px'

                            }}
                            onClick={
                                () => {
                                    this.editTemplate(null);
                                }
                            }>新建</Button>
                    </Authority>
                </div>
                <div className="layoutsLineBlock" style={{height: '16px'}}/>
                <Spin spinning={this.props.loading}>
                    {
                        !messageTemplateList.length ?
                            <div style={{
                                height: this.state.contentHeight,
                                paddingTop: '185px',
                            }}>
                                <div className={styles.centerFlexContainer}>
                                    <div>
                                        <img src={imgSrc} width="154px" height="66px" alt=" "/>
                                        <span style={{
                                            display: 'inline-block',
                                            marginLeft: '27px'
                                        }}>
                                            您还没有短信模板 , 快去新建吧 ~
                                        </span>
                                    </div>
                                </div>
                            </div>
                            :
                            <div style={{height: this.state.contentHeight, paddingTop: '20px', overflowY: 'auto'}}>
                                {!!pendingTemplates.length && <MessageGroup title="待审核" key="待审核" messages={pendingTemplates} edit={this.editTemplate}/>}
                                {!!verifiedTemplates.length && <MessageGroup title="审核通过" key="审核通过" messages={verifiedTemplates} edit={this.editTemplate}/>}
                                {!!illegalTemplates.length && <MessageGroup title="审核未通过" key="审核未通过" messages={illegalTemplates} edit={this.editTemplate}/>}
                            </div>
                    }
                </Spin>
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
                            {`您目前没有处于 ${title} 状态的短信模板`}
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
