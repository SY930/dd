import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import phone from '../../../assets/phone.png';
import bg from '../../../assets/bg.png';
import bg1 from '../../../assets/bg1.png';

const msgType = {
    '2': '礼品领取成功通知',
    '1': '会员到期提醒',
};

class PhonePreviewForWeChat extends PureComponent {

    render() {
        const {
            title,
            remark,
            currentType
        } = this.props;
        return (
            <div
                style={{
                    height: '100%',
                    minHeight: 782
                }}
                className={styles.phonePreviewContainer}
            >
                <div className={styles.arrow}/>
                <div style={{
                    position: 'relative',
                    height: '100%',
                    overflow: 'hidden'
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
                            <div>
                                {msgType[currentType]}
                            </div>
                            <div style={{
                                color: '#8C8C8C',
                                marginBottom: 20,
                                marginTop: 8,
                            }}>
                                8月22日
                            </div>
                            <div>
                                {title}
                            </div>
                            <div>
                                礼品名称 : 15元代金券
                            </div>
                            <div>
                                礼品数量 : 2个
                            </div>
                            <div style={{
                                marginBottom: 28
                            }}>
                                领取时间 : 2018.08.22
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                borderBottom: '1px solid',
                                borderBottomColor: '#E5E5E5'
                            }}>
                                {remark}
                            </div>
                            <div className={styles.weChatContentBottomDiv}>
                                <div>详情</div>
                                <div>{`>`}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    const templateToUpdate = state.sale_wechat_message_setting.get('wechatMessageTemplateList').find(listing => {
        return listing.get('msgType') === state.sale_wechat_message_setting.get('currentType');
    });
    return {
        remark : templateToUpdate.get('remark'),
        title : templateToUpdate.get('title'),
        currentType: state.sale_wechat_message_setting.get('currentType')
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PhonePreviewForWeChat)
