import React from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import {
    Row,
    Col,
    Form,
    Button,
    Input,
    Select,
} from 'antd';
import {getMessageTemplateList} from "../../BasicSettings/actions";

class MessageSelector extends React.Component {

    constructor(props) {
        super(props);
        let messageTemplateList = Immutable.List.isList(props.messageTemplateList) ? props.messageTemplateList.toJS() : [];
        messageTemplateList = messageTemplateList.filter(templateEntity => templateEntity.auditStatus == 2).map(templateEntity => templateEntity.template);
        if (props.selectedTemplate) {
            messageTemplateList.unshift(props.selectedTemplate)
        }
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
        }
        if (this.props.messageTemplateList !== nextProps.messageTemplateList) {
            messageTemplateList = Immutable.List.isList(nextProps.messageTemplateList) ? nextProps.messageTemplateList.toJS() : [];
            messageTemplateList = messageTemplateList.filter(templateEntity => templateEntity.auditStatus == 2).map(templateEntity => templateEntity.template);
            if (nextProps.selectedTemplate) {
                messageTemplateList.unshift(nextProps.selectedTemplate)
            }
        }
        this.setState({
            loading,
            messageTemplateList
        })
    }

    handleMsgSelect(index) {
        this.setState()
    }

    render() {
        const messageTemplateList = this.state.messageTemplateList;
        return (
            <div>
                {messageTemplateList.map((message, index) => {
                    return (
                        <div key={index} onClick={() => this.handleMsgSelect(message, index)}>
                            {message}
                        </div>
                    );
                })}
            </div>
        )
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

export default connect(mapStateToProps, mapDispatchToProps)(MessageSelector);
