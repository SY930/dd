import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Button,
} from 'antd';
import styles from '../GiftAdd/Crm.less';
import {cancelCreateOrEditGift} from "../_action";
import PhonePreview from "./PhonePreview";

class GiftEditPage extends Component {

    render() {
        return (
            <div style={{
                backgroundColor: '#F3F3F3',
                height: '100%'
            }}>
                <div className={styles.pageHeader} >
                    <div className={styles.pageHeaderTitle}>
                        菜品兑换券
                    </div>
                    <div className={styles.pageHeaderDescription}>
                        用户支付一定的金额可以兑换到相同的菜品
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
                        onClick={this.props.cancelCreateOrEdit}
                    >
                        保存
                    </Button>
                </div>
                <div className={styles.pageContent}>
                    <PhonePreview/>
                    {/*<FormWrapper/>*/}
                </div>
            </div>
        )
    }
}

function matStateToProps(state) {
    return {
        giftType: state.sale_giftInfoNew.get('currentGiftType'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        cancelCreateOrEdit: opts => dispatch(cancelCreateOrEditGift(opts)),
    }
}

export default connect(matStateToProps, mapDispatchToProps)(GiftEditPage);
