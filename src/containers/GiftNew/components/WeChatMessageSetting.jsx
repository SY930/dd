import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import {
    Button,
    Icon,
    Spin
} from 'antd';
import styles from '../GiftAdd/Crm.less';
import styles1 from '../../SaleCenterNEW/ActivityPage.less';
import {cancelCreateOrEditGift} from "../_action";
import PhonePreview from "./PhonePreview";
import FormWrapper from "./FormWrapper";
import GiftCfg from "../../../constants/Gift";
import PhonePreviewForWeChat from "./PhonePreviewForWeChat";
import {
    queryWeChatMessageTemplates,
    saleCenterStartEditingWeChatMessageTemplates
} from "../../../redux/actions/actions";
import WeChatMessageFormWrapper from "./WeChatMessageFormWrapper";
import imgSrc from '../../../assets/empty_ph.png';
import {isBrandOfHuaTianGroupList} from "../../../constants/projectHuatianConf";

class WeChatMessageSetting extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentHeight: 782,
            scrollPercent: 0,
        };
        this.formRef = null;
        this.onWindowResize = this.onWindowResize.bind(this);
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
    }
    onWindowResize() {
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').getBoundingClientRect().height - 79;
        this.setState({ contentHeight });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        this.formRef = null;
    }

    render() {
        const {
            isEditing,
            loading,
            isQueryFulfilled,
            startEdit,
            queryWeChatMessageTemplates
        } = this.props;
        return (
            <div style={{
                backgroundColor: '#F3F3F3',
                height: '100%'
            }}>
                <div style={{height: '79px', backgroundColor: '#F3F3F3'}}>
                    <div className={styles1.headerWithBgColor}>
                        <span className={styles1.customHeader}>
                            微信模板
                            {
                                !isBrandOfHuaTianGroupList(this.props.user.accountInfo.groupID) && (
                                    <Button
                                        type="ghost"
                                        style={{
                                            display: !isEditing && isQueryFulfilled ? 'block' : 'none',
                                        }}
                                        className={styles1.jumpToCreate}
                                        onClick={startEdit}
                                    >
                                        <Icon type="edit" />
                                        编辑
                                    </Button>
                                )
                            }
                        </span>
                    </div>
                </div>
                <Spin spinning={loading}>
                    {isQueryFulfilled ? (
                        <div
                            className={styles.pageContent}
                            style={{
                                height: this.state.contentHeight,
                                borderRadius: 0,
                                margin: 0,
                                overflowY: 'auto',
                            }}
                        >
                            <PhonePreviewForWeChat/>
                            <WeChatMessageFormWrapper/>
                        </div>
                    ) : (
                        <div
                            className={styles.pageContent}
                            style={{
                                height: this.state.contentHeight,
                                borderRadius: 0,
                                margin: 0,
                                overflowY: 'auto',
                            }}
                        >
                            <div className={styles1.centerFlexContainer} style={{
                                height: '60%',
                                width: '100%',
                            }}>
                                <div>
                                    <img src={imgSrc} width="154px" height="66px" alt="oops"/>
                                    <span style={{
                                        display: 'inline-block',
                                        marginLeft: '27px'
                                    }}>
                                            出错了, 请点击
                                        <a
                                            onClick={(e) => {
                                                e.preventDefault();
                                                queryWeChatMessageTemplates()
                                            }}
                                        >重试</a>
                                        </span>
                                </div>
                            </div>
                        </div>
                    )}
                </Spin>
            </div>
        )
    }
}

function matStateToProps(state) {
    return {
        loading: state.sale_wechat_message_setting.get('loading'),
        isEditing: state.sale_wechat_message_setting.get('isEditing'),
        isQueryFulfilled: state.sale_wechat_message_setting.get('isQueryFulfilled'),
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        startEdit: opts => dispatch(saleCenterStartEditingWeChatMessageTemplates(opts)),
        queryWeChatMessageTemplates: opts => dispatch(queryWeChatMessageTemplates(opts)),
    }
}

export default connect(matStateToProps, mapDispatchToProps)(WeChatMessageSetting);
