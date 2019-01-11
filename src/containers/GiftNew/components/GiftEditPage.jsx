import React, { Component } from 'react';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import {
    Button,
} from 'antd';
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
        };
        this.formRef = null;
        this.saving = this.saving.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        this.lockedSaving = throttle(this.saving , 500, {trailing: false});
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

    saving() {
        this.formRef && this.formRef.wrappedInstance && this.formRef.wrappedInstance.handleSubmit
        && this.formRef.wrappedInstance.handleSubmit();
    }

    render() {
        const { giftType, operationType, loading } = this.props;
        const { name: giftName, describe: giftDescribe, example } = GiftCfg.giftType.find(item => item.value === giftType) || {};
        return (
            <div style={{
                backgroundColor: '#F3F3F3',
                height: '100%'
            }}>
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
                        onClick={this.props.cancelCreateOrEdit}
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        disabled={operationType === 'detail'}
                        loading={loading}
                        onClick={this.lockedSaving}
                    >
                        保存
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