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
import { SET_WECHAT_MESSAGE_TEMPLATE } from '../../constants/entryCodes';
import MessageDisplayBox from './MessageDisplayBox';
import MessageTemplateEditPanel from './MessageTemplateEditPanel'
import {messageTemplateState} from "./reducers";
import {getMessageTemplateList} from "./actions";
import Authority from "../../components/common/Authority/index";
import WeChatMessageSetting from "../GiftNew/components/WeChatMessageSetting";

@registerPage([SET_WECHAT_MESSAGE_TEMPLATE], {
    messageTemplateState
})
class MessageTemplatesPage extends React.Component {
    render() {
        return (<WeChatMessageSetting/>)
    }
}

export default MessageTemplatesPage;
