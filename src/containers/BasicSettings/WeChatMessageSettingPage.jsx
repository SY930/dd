import React from 'react';
import registerPage from '../../index';
import { SET_WECHAT_MESSAGE_TEMPLATE } from '../../constants/entryCodes';
import WeChatMessageSetting from "../GiftNew/components/WeChatMessageSetting";
import { sale_wechat_message_setting } from "../../redux/reducer/reducers";

@registerPage([SET_WECHAT_MESSAGE_TEMPLATE], {
    sale_wechat_message_setting
})
class MessageTemplatesPage extends React.Component {
    render() {
        return (<WeChatMessageSetting/>)
    }
}

export default MessageTemplatesPage;
