import React, { Component } from 'react';
import { connect } from 'react-redux';
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
        this.formRef = null
    }

    render() {
        const { giftType, operationType } = this.props;
        const giftName = (GiftCfg.giftType.find(item => item.value === giftType) || {}).name;
        const giftDescribe = (GiftCfg.giftType.find(item => item.value === giftType) || {}).describe;
        return (
            <div style={{
                backgroundColor: '#F3F3F3',
                height: '100%'
            }}>
                <div className={styles.pageHeader} >
                    <div className={styles.pageHeaderTitle}>
                        {giftName}
                    </div>
                    <div className={styles.pageHeaderDescription}>
                        {giftDescribe}
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
                        onClick={() => {
                            this.formRef && this.formRef.wrappedInstance && this.formRef.wrappedInstance.handleSubmit
                            && this.formRef.wrappedInstance.handleSubmit();
                        }}
                    >
                        保存
                    </Button>
                </div>
                <div className={styles.pageContent}>
                    <PhonePreview/>
                    <FormWrapper
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
        operationType: state.sale_editGiftInfoNew.get('operationType'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        cancelCreateOrEdit: opts => dispatch(cancelCreateOrEditGift(opts)),
    }
}

export default connect(matStateToProps, mapDispatchToProps)(GiftEditPage);
