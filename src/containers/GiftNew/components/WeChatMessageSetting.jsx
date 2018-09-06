import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import {
    Button,
    Icon
} from 'antd';
import styles from '../GiftAdd/Crm.less';
import {cancelCreateOrEditGift} from "../_action";
import PhonePreview from "./PhonePreview";
import FormWrapper from "./FormWrapper";
import GiftCfg from "../../../constants/Gift";
import PhonePreviewForWeChat from "./PhonePreviewForWeChat";

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
        const contentHeight = document.querySelector('.ant-tabs-tabpane-active').offsetHeight - 95;
        this.setState({ contentHeight });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        this.formRef = null;
    }

    render() {
        return (
            <div style={{
                backgroundColor: '#F3F3F3',
                height: '100%'
            }}>
                <div className={styles.pageHeader} >
                    <div className={styles.pageHeaderTitle}>
                        微信模板
                    </div>
                    <Button
                        type="ghost"
                        style={{
                            marginLeft: '30px'
                        }}
                        className={styles.secondaryButton}
                    >
                        <Icon type="edit" />
                        编辑
                    </Button>
                </div>
                <div
                    className={styles.pageContent}
                    style={{
                        height: this.state.contentHeight
                    }}
                >
                    <PhonePreviewForWeChat scrollPercent={this.state.scrollPercent} contentHeight={this.state.contentHeight}/>
                    {/*<FormWrapper
                        onFormScroll={(value) => {
                            this.setState({
                                scrollPercent: value
                            })
                        }}
                        contentHeight={this.state.contentHeight}
                        ref={form => this.formRef = form}
                        describe={giftDescribe}
                        name={giftName}
                    />*/}
                </div>
            </div>
        )
    }
}

function matStateToProps(state) {
    return {
        giftType: state.sale_editGiftInfoNew.get('currentGiftType'),
        loading: state.sale_editGiftInfoNew.get('loading'),
        operationType: state.sale_editGiftInfoNew.get('operationType'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        cancelCreateOrEdit: opts => dispatch(cancelCreateOrEditGift(opts)),
    }
}

export default connect(matStateToProps, mapDispatchToProps)(WeChatMessageSetting);
