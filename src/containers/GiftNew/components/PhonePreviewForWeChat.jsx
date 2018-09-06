import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import phone from '../../../assets/phone.png';
import bg from '../../../assets/bg.png';
import bg1 from '../../../assets/bg1.png';


class PhonePreviewForWeChat extends PureComponent {

    render() {
        const {
            contentHeight,
            scrollPercent,
        } = this.props;
        return (
            <div
                style={{
                    height: contentHeight
                }}
                className={styles.phonePreviewContainer}
            >
                <div className={styles.arrow}/>
                <div style={{
                    position: 'relative',
                    transform: contentHeight < 740 ? `translateY(${-(740 - contentHeight) * scrollPercent}px)` : null
                }}>
                    <img
                        src={phone}
                        alt="oops"
                        style={{
                            position: 'relative',
                            top: '20px'
                        }}
                    />
                    <img className={styles.phonePreviewHeader} src={bg1}  alt="oops"/>
                    <div className={styles.phonePreviewModifier}>
                        微信公众号
                    </div>
                    <div className={styles.phonePreviewContentWrapper}>
                        <div className={styles.weChatContent}>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PhonePreviewForWeChat)
