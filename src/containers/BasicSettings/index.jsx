import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import registerPage from '../../index';
import {
    Row,
    Button,
    Col,
    Modal
} from 'antd';
import styles from '../SaleCenterNEW/ActivityPage.less';
import { SET_MSG_TEMPLATE } from '../../constants/entryCodes';
import MessageDisplayBox from './MessageDisplayBox';
import MessageTemplateEditPanel from './MessageTemplateEditPanel'
import {messageTemplateState} from "./reducers";
import {getMessageTemplateList} from "./actions";

const mock1 = new Array(11).fill({
    "itemID":852009824290938880,
    "groupID":1155,
    "template":"尊敬的[先生/女士]，您的[卡名称][卡等级]有异动，请发骚抱怨。",
    "auditStatus":1,
    "createBy":"贾志",
    "modifyBy":"贾志"
});
const mock2 = new Array(4).fill({
    "itemID":852009824290938880,
    "groupID":1155,
    "template":"尊敬的[先生/女士]，您的[卡名称][卡等级]有异动，请发骚抱怨。",
    "auditStatus":1,
    "createBy":"贾志",
    "modifyBy":"贾志"
});
const mock = [];

@registerPage([SET_MSG_TEMPLATE], {
    messageTemplateState
})
@connect(mapStateToProps, mapDispatchToProps)
class MessageTemplatesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageTemplateList: Immutable.List.isList(props.messageTemplateList) ? props.messageTemplateList.toJS() : [],
            loading: props.loading,
            contentHeight: 800,
            editModalVisible: false,
            messageTemplateToEdit: null,
        };
        this.onWindowResize = this.onWindowResize.bind(this);
        this.editTemplate = this.editTemplate.bind(this);
        this.closeEditModal = this.closeEditModal.bind(this);
    }

    componentDidMount() {
        this.props.getMessageTemplateList();
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    componentWillReceiveProps(nextProps) {
        let { loading, messageTemplateList } = this.state;
        if (this.props.loading !== nextProps.loading) {
            loading = nextProps.loading;
        }
        if (this.props.messageTemplateList !== nextProps.messageTemplateList) {
            messageTemplateList = Immutable.List.isList(nextProps.messageTemplateList) ? nextProps.messageTemplateList.toJS() : [];
        }
        this.setState({
            loading,
            messageTemplateList
        })
    }

    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 86;
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
            <Modal
                title="编辑短信模板"
                visible={this.state.editModalVisible}
                footer={false}
                closable={false}
                width="750px"
            >
                <MessageTemplateEditPanel
                    cancel={this.closeEditModal}
                    templateEntity={this.state.messageTemplateToEdit}/>
            </Modal>
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
        const headerClasses = `layoutsToolLeft ${styles.headerWithBgColor}`;
        return (
        <div style={{backgroundColor: '#F3F3F3'}} className="layoutsContainer">
            {this.renderEditModal()}
            <div className="layoutsTool" style={{height: '80px'}}>
                <div className={headerClasses} style={{lineHeight: '80px'}}>
                    <span style={{lineHeight: '80px'}} className={styles.customHeader}>短信模板</span>
                    <Button
                        type="ghost"
                        icon="plus"
                        className={styles.jumpToCreate}
                        onClick={
                            () => {
                                this.editTemplate(null);
                            }
                        }>新建</Button>
                </div>
                <div style={{height: this.state.contentHeight}} className={styles.scrollableMessageContainer}>
                    <MessageGroup title="待审核" messages={pendingTemplates} edit={this.editTemplate}  />
                    <MessageGroup title="审核通过" messages={verifiedTemplates} edit={this.editTemplate}/>
                    <MessageGroup title="审核未通过" messages={illegalTemplates} edit={this.editTemplate}/>
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
                <div style={{paddingLeft: '30px', fontSize: '20px', fontWeight:'500'}}>{title}</div>
                <div className={styles.scrollableMessageContainer}>
                    {!!messages.length && messages.map((item, index) => {
                        return <MessageDisplayBox
                            template={item.template}
                            handleClick={() => this.props.edit(item)}
                            key={item.index}
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
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getMessageTemplateList: opts => dispatch(getMessageTemplateList(opts)),
    };
}

export default MessageTemplatesPage;
