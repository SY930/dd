import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import phone from '../../../assets/phoneX.png';
import moment from 'moment';
import bg1 from '../../../assets/bg1.png';
import {DEFAULT_WECHAT_TEMPLATE_CONFIG} from "../../../constants/weChatTemplateConstants";

class PhonePreviewForWeChat extends PureComponent {

    getPreviewLine = (currentType, lineNo) => {
        switch (+currentType) {
            case 1: {
                switch (lineNo) {
                    case 1: return '来源 : 系统发送'
                    case 2: return '过期时间 : 2019-10-20'
                    case 3: return '使用说明 : 请点击查看使用详情'
                    default: return '';
                };
            };
            case 2: {
                switch (lineNo) {
                    case 1: return '礼品名称 : 15元代金券'
                    case 2: return '礼品数量 : 2个'
                    case 3: return '领取时间 : 2018.08.22'
                    default: return '';
                };
            };
            case 3: {
                switch (lineNo) {
                    case 1: return '核销项目 : 免费吃小菜一份2019'
                    case 2: return `核销时间 : ${moment().format('YYYY年MM月DD日 mm:ss')}`
                    case 3: return '核销门店 : 哗啦啦北京西直门凯德店'
                    default: return '';
                };
            }
        }
    }



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
                    <div className={styles.phonePreviewModifier}>
                        微信公众号
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            top: 145,
                            left: 58,
                        }}
                        className={styles.weChatContent}
                    >
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
                                {this.getPreviewLine(currentType, 1)}
                            </div>
                            <div>
                                {this.getPreviewLine(currentType, 2)}
                            </div>
                            <div style={{
                                marginBottom: 28
                            }}>
                                {this.getPreviewLine(currentType, 3)}
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
