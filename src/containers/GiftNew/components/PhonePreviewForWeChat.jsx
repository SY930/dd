import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import phone from '../../../assets/phone.png';
import moment from 'moment';
import bg1 from '../../../assets/bg1.png';
import {DEFAULT_WECHAT_TEMPLATE_CONFIG} from "../../../constants/weChatTemplateConstants";

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
                            top: 20,
                        }}
                    />
                    <img className={styles.phonePreviewHeader} src={bg1}  alt="oops"/>
                    <div className={styles.phonePreviewModifier}>
                        微信公众号
                    </div>
                    <div className={styles.phonePreviewContentWrapper}>
                        <div className={styles.weChatContent}>
                            <div>
                                {DEFAULT_WECHAT_TEMPLATE_CONFIG[currentType].type}
                            </div>
                            <div style={{
                                color: '#8C8C8C',
                                marginBottom: 20,
                                marginTop: 8,
                            }}>
                                8月22日
                            </div>
                            <div>
                                {title || DEFAULT_WECHAT_TEMPLATE_CONFIG[currentType].title}
                            </div>
                            <div>
                                {currentType == 3 ? '核销项目 : 免费吃小菜一份2019' : '礼品名称 : 15元代金券'}
                            </div>
                            <div>
                                {currentType == 3 ? `核销时间 : ${moment().format('YYYY年MM月DD日 mm:ss')}` : '礼品数量 : 2个'}
                            </div>
                            <div style={{
                                marginBottom: 28
                            }}>
                                {currentType == 3 ? '核销门店 : 哗啦啦北京西直门凯德店' : '领取时间 : 2018.08.22' }
                            </div>
                            <div style={{
                                paddingBottom: 10,
                                borderBottom: '1px solid',
                                borderBottomColor: '#E5E5E5'
                            }}>
                                {remark || DEFAULT_WECHAT_TEMPLATE_CONFIG[currentType].remark}
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
