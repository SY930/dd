
/**
 * @description 礼品创建及编辑页面
*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import {
    Button,
    message,
} from 'antd';
import { COMMON_LABEL } from 'i18n/common';
import styles from '../GiftAdd/Crm.less';
import {cancelCreateOrEditGift} from "../_action";
import PhonePreview from "./PhonePreview";
import FormWrapper from "./FormWrapper";
import GiftCfg from "../../../constants/Gift";
class GiftEditPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contentHeight: 782,
            scrollPercent: 0,
            tabKey: 1,
            isCheckedAgreement: false,//是否确认协议
        };
        this.formRef = null;
        this.container = null;
        this.saving = this.saving.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.lockedSaving = throttle(this.saving , 500, {trailing: false});
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize);
        this.setState({tabKey: this.props.tabkey});
    }
    onWindowResize() {
        let contentHeight;
        try {
            contentHeight = document.body.clientHeight - 125;
        } catch (e) {
            contentHeight = 782;
        }
        this.setState({ contentHeight });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
        this.formRef = null;
        this.container = null;
    }

    // TODO: 这块为什么执行了两次保存？
    saving() {
        if(this.props.giftType == '90') {
            if(!this.state.isCheckedAgreement) {
                message.error('当前您未勾选《法律声明》')
                return
            }
        }
        this.formRef && this.formRef.wrappedInstance && this.formRef.wrappedInstance.handleSubmit
        && this.formRef.wrappedInstance.handleSubmit();
    }

    render() {
        const { giftType, operationType, loading } = this.props;
        let {tabkey} = this.state
        const { name: giftName, describe: giftDescribe, example } = GiftCfg.giftType.find(item => item.value === giftType) || {};
        return (
            <div style={{
                backgroundColor: '#F3F3F3',
                height: '100%'
            }}
                 ref={e => this.container = e}
            >
                <div className={styles.pageHeader} >
                    <div className={styles.pageHeaderTitle}>
                        {giftName}
                    </div>
                    <div className={styles.pageHeaderDescription} style={{ fontSize: example ? 12 : 14 }}>
                        {giftDescribe}
                        {
                            !!example && (
                                <div>
                                    {example}
                                </div>
                            )
                        }
                    </div>

                    <div className={styles.placeholder}/>
                    <Button
                        type="ghost"
                        style={{
                            marginRight: '10px'
                        }}
                        onClick={()=>{
                            this.props.cancelCreateOrEdit({
                                saveDone: false
                            });
                            this.props.toggleTabs();
                        }}
                    >
                        {COMMON_LABEL.cancel} 
                    </Button>
                    <Button
                        type="primary"
                        disabled={operationType === 'detail'}
                        loading={loading}
                        onClick={this.lockedSaving}
                    >
                        {COMMON_LABEL.save}
                    </Button>
                </div>
                <div style={{height: 15}}>

                </div>
                <div
                    className={styles.pageContent}
                    style={{
                        height: this.state.contentHeight
                    }}
                >
                    <PhonePreview scrollPercent={this.state.scrollPercent} contentHeight={this.state.contentHeight}/>
                    <FormWrapper
                        onFormScroll={(value) => {
                            this.setState({
                                scrollPercent: value
                            })
                        }}
                        isCheckedAgreement={this.state.isCheckedAgreement}
                        changeProtocol={(e) => this.setState({ isCheckedAgreement: e.target.checked })}
                        contentHeight={this.state.contentHeight}
                        ref={form => this.formRef = form}
                        describe={giftDescribe}
                        name={giftName}
                    />
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

export default connect(matStateToProps, mapDispatchToProps)(GiftEditPage);
