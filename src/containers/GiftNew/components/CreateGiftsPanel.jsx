import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import GiftCfg from '../../../constants/Gift';
import xcx from 'assets/xcx.png';
import wx from 'assets/wx.png';
import pos from 'assets/pos.png';
import {
    message,
} from 'antd';
import {startCreateGift} from "../_action";
import {
    getHuaTianDisabledGifts,
    GIFT_CREATE_DISABLED_TIP,
    isBrandOfHuaTianGroupList,
    isHuaTian
} from "../../../constants/projectHuatianConf";

const temporaryDisabledGifts = [
]; // 不上线, 只在dohko显示的礼品类型

class CreateGiftsPanel extends Component {

    handleLogoClick = (gift = {}) => {
        if (isBrandOfHuaTianGroupList() && gift.value === '90') {
            message.warning(GIFT_CREATE_DISABLED_TIP);
            return;
        }
        if (isHuaTian() && getHuaTianDisabledGifts().includes(String(gift.value))) {
            message.warning(GIFT_CREATE_DISABLED_TIP);
            return;
        }
        /*if (HUALALA.ENVIRONMENT === 'production-release' && temporaryDisabledGifts.includes(gift.value)) {
            message.success('敬请期待~');
            return;
        }*/
        this.props.onClose && this.props.onClose();
        this.props.startCreate({
            value: gift.value,
            data: {
                groupID: this.props.user.accountInfo.groupID
            }
        });
    }

    render() {
        const primaryGifts = GiftCfg.giftType.filter(gift => gift.category === 'primary');
        const secondaryGifts = GiftCfg.giftType.filter(gift => gift.category === 'secondary');
        return (
            <div>
                <div>
                    <div className={styles.logoGroupHeader}>
                        常用券类
                    </div>
                    <div className={styles.groupContainer}>
                        {
                            primaryGifts.map((gift, index) => (
                                <ClickableGiftLogo
                                    key={gift.value}
                                    isPrimary={true}
                                    onClick={() => {
                                        this.handleLogoClick(gift)
                                    }}
                                    index={index}
                                    data={gift}
                                />
                            ))
                        }
                    </div>
                    <div className={styles.logoGroupHeader}>
                        其它
                    </div>
                    <div className={styles.groupContainer}>
                        {
                            secondaryGifts.map(gift => {
                                switch (gift.view) {
                                    case 'card': return (
                                        <ClickableGiftCard
                                            key={gift.value}
                                            onClick={() => {
                                                this.handleLogoClick(gift)
                                            }}
                                            data={gift}
                                        />
                                    );
                                    case 'redpacket': return (
                                        <ClickableRedPacket
                                            key={gift.value}
                                            onClick={() => {
                                                this.handleLogoClick(gift)
                                            }}
                                            data={gift}
                                        />
                                    );
                                    default: return (
                                        <ClickableGiftLogo
                                            key={gift.value}
                                            onClick={() => {
                                                this.handleLogoClick(gift)
                                            }}
                                            isPrimary={false}
                                            data={gift}
                                        />
                                    )
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function ClickableGiftLogo(props) {
    let wechatFlag = 1;
    return (
        <div onClick={props.onClick} className={props.isPrimary ? styles[`logoContainer_${props.index}`] : styles.logoContainer}>
            <div className={styles.headerWithDash}>
                {props.data.name}
            </div>
            <div className={styles.tagContainer}>
                {
                    // (props.data.tags || []).map((tag, i) => {
                    //     if(!wechatFlag && tag.props && tag.props.defaultMessage.includes('微信') || !wechatFlag && !tag.props && tag.includes('微信')) {
                    //         return null;
                    //     }
                    //     if(tag.props && tag.props.defaultMessage.includes('微信') || !tag.props && tag.includes('微信')) {
                    //         wechatFlag --;
                    //     }
                    //     return (<div className={styles.speTagSpan} key={i}>{
                    //         tag.props ? 
                    //             tag.props.defaultMessage.includes('小程序') ?
                    //             <img className={styles.speTagImg} src={xcx} /> : 
                    //             tag.props.defaultMessage.includes('微信') ?
                    //             <img className={styles.speTagImg} src={wx} /> : 
                    //             tag.props.defaultMessage.includes('pos') ? <img className={styles.speTagImg} src={pos} /> : 
                    //             <span><img className={styles.speTagImg} src={xcx} /><img className={styles.speTagImg} src={pos} /><img className={styles.speTagImg} src={wx} /></span>
                    //         : tag.includes('pos') ?
                    //             <img className={styles.speTagImg} src={pos} /> : 
                    //             tag.includes('微信') ? 
                    //                 <img className={styles.speTagImg} src={wx} /> :
                    //                 tag.includes('小程序') ? <img className={styles.speTagImg} src={xcx} /> : null
                    // }</div>)})
                    (props.data.tags || []).map(tag => (
                        <div key={tag}>{tag}</div>
                    ))
                }
            </div>
            {
                props.data.icon && <img style={{ position: 'absolute', top: 20, right: 30 }} src={props.data.icon} alt="" />
            }
        </div>
    );
}
function ClickableGiftCard(props) {
    return (
        <div onClick={props.onClick} className={styles.cardLogoContainer}>
            <div className={styles.header}>
                {props.data.name}
            </div>
            <div className={styles.tagContainer}>
                {
                    (props.data.tags || []).map(tag => (
                        <div key={tag}>{tag}</div>
                    ))
                }
            </div>
        </div>
    );
}
function ClickableRedPacket(props) {
    return (
        <div onClick={props.onClick} className={styles.redPacketLogoContainer}>
            <div className={styles.header}>
                {props.data.name}
            </div>
            <div className={styles.tagContainer}>
                {
                    (props.data.tags || []).map(tag => (
                        <div key={tag}>{tag}</div>
                    ))
                }
            </div>
            {
                props.data.icon && <img style={{ position: 'absolute', top: 20, right: 22 }} src={props.data.icon} alt="" />
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.user.toJS(),
    };
};

function mapDispatchToProps(dispatch) {
    return {
        startCreate: opts => {
            dispatch(startCreateGift(opts))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateGiftsPanel);
