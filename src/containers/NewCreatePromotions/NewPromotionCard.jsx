import React, { Component } from 'react';
import styles from './cardStyle.less';
import bg0 from './assets/bg0.png';
import bg1 from './assets/bg1.png';
import bg2 from './assets/bg2.png';
import bg3 from './assets/bg3.png';
import xcx from './assets/xcx.png';
import wx from './assets/wx.png';
import pos from './assets/pos.png';
import xin from './assets/xin.png';
import { jumpPage } from '@hualala/platform-base';
import { Modal, Tooltip } from 'antd';
import moment from 'moment';

//可作为插件开通的活动有以下：分享裂变、推荐有礼、桌边砍、拼团、秒杀、膨胀大礼包、签到、集点卡、支付后广告、下单抽抽乐、盲盒  9个活动。
const pulgins = ['65', '68', '67', '71', '72', '66', '76', '75', '77', '78', '79'];
//可作为营销盒子大礼包插件授权活动有以下：分享裂变、推荐有礼、膨胀大礼包、签到、集点卡、支付后广告、下单抽抽乐、盲盒  8个活动。
const authPulgins = ['65', '68', '66', '76', '75', '77', '78', '79'];
const imgURI = 'http://res.hualala.com/';
const V3KEYS = ['78', '79'];     // 最新版抽抽乐78
// 最新版 logo图片
const V3LOGO = {
    78: imgURI + 'basicdoc/e464e187-f0eb-4b03-b438-9329cd26c3ff.png',
    79: require(`./assets/logo_${79}_new.png`),
};
class NewPromotionCard extends Component {
    onClick = () => {
        const {
            promotionEntity,
            onCardClick,
            onClickOpen,
            onV3Click,
            authPluginStatus
        } = this.props;
        const { key, title } = promotionEntity;
        const isUse = this.filterItem(key);
        // 插件授权
        if (authPulgins.includes(key) && !authPluginStatus) {
            Modal.warning({
                title: <p></p>,
                content: (
                    <div>
                        <p>营销盒子大礼包活动：包括分享裂变；膨胀大礼包；推荐有礼；签到；支付后广告；下单抽抽乐；盲盒；集点卡等，请联系商务开通</p>
                    </div>
                ),
                okText: "知道了",
                onOk() { },
            });
            return;
        }
        if (pulgins.includes(key) && !isUse) {
            Modal.confirm({
                title: <p>「{title}」限时开放中，您可免费试用6个月</p>,
                content: (
                    <div>
                        <p>自开通日起有效期6个月，试用结束后，可联系商务开通</p>
                    </div>
                ),
                okText: "免费试用",
                cancelText: "稍后开通",
                onOk() {
                    onClickOpen(key)
                },
            });
        } else {
            if (V3KEYS.includes(key)) {
                onV3Click();
                return;
            }
            onCardClick(promotionEntity);
        }
        // console.log('promotionEntity', promotionEntity);
        // jumpPage({ menuID: 'plugins.info' });
    }
    filterItem(key) {
        const { whiteList = [] } = this.props;
        const isUse = whiteList.some(x => x.eventWay == key);
        return isUse;
    }
    showExpire = (date) => {
        let com = new Date(date).getTime()
        let now = new Date().getTime()
        return {
            ifShow: com - now < (1000 * 3600 * 24 * 31),
            howMany: Math.ceil((com - now) / (1000 * 3600 * 24)),
        }
    }
    renderPulgin(key, ath) {
        const { whiteList = [], authPluginStatus } = this.props;
        const isUse = this.filterItem(key);
        if (pulgins.includes(key)) {
            const item = whiteList.find(x => x.eventWay == key);
            const { expireDate } = item || {};
            const date = moment(expireDate, 'YYYYMMDD').format('YYYY/MM/DD')
            let obj = this.showExpire(date)
            // 秒杀71  拼团72  默认永久开通  无text redValidDate
            if (obj.ifShow) {
                let text = authPulgins.includes(key) && !authPluginStatus ? '联系商务开通' : (isUse ? `还有${obj.howMany}天到期` : '申请试用');
                console.log(text, ath, key)
                let content = ['71', '72'].includes(key) ? '' : <em className={ath ? styles.validDateAth : (authPulgins.includes(key) && !authPluginStatus) ? styles.validDate : (isUse ? styles.redValidDate : styles.validDate)}> { text }</em >
                return content
        }
        return null
    }
}

render() {
    let {
        promotionEntity: {
            tags = [],
            title,
            text,
            example,
            key,
            right = 0,
            bottom = 0,
            isNew,
        },
        index,
        onCardClick,
        size,
        authPluginStatus
    } = this.props;
    let backgroundImageString;
    switch (index % 4) {
        case 1: backgroundImageString = bg1; break;
        case 2: backgroundImageString = bg2; break;
        case 3: backgroundImageString = bg3; break;
        default: backgroundImageString = bg0;
    }

    if (size === 'small') {
        return (
            <div className={styles.smallContainer} onClick={this.onClick}>
                {this.renderPulgin(key, 'ath')}
                <div className={styles.title}>
                    {title}
                </div>
                <div className={styles.cardBackgroundImage}>
                    <img src={backgroundImageString} alt="oops" />
                </div>
                <div className={styles.cardLogo} style={{
                    right: right * 0.62,
                    bottom: bottom * 0.62,
                }}>
                    {V3KEYS.includes(key) ?
                        <img style={{ maxWidth: '90px', maxHeight: '90px' }} src={V3LOGO[key]} alt="oops" /> :
                        <img style={{ maxWidth: '90px', maxHeight: '90px' }} src={require(`./assets/logo_${key}.png`)} alt="oops" />
                    }
                </div>
            </div>
        )
    }

    // if(size === 'special') {
    let wechatFlag = 1;
    return (
        <div className={styles.speContainer} onClick={this.onClick} style={{ border: '1px solid #C4C4C480', }}>
            <p className={styles.expandableP}>
                {isNew ? <span><img className={styles.xinImg} src={xin} /></span> : null}
                {this.renderPulgin(key)}
            </p>
            <div className={styles.title}>
                {title}
                <div className={styles.speTag}>
                    {tags.map((tag, i) => {
                        if (!wechatFlag && tag.props && tag.props.defaultMessage.includes('微信') || !wechatFlag && !tag.props && tag.includes('微信')) {
                            return null;
                        }
                        if (tag.props && tag.props.defaultMessage.includes('微信') || !tag.props && tag.includes('微信')) {
                            wechatFlag--;
                        }
                        return (<div className={styles.speTagSpan} key={i}>{
                            tag.props ?
                                tag.props.defaultMessage.includes('小程序') ?
                                    <img className={styles.speTagImg} src={xcx} /> :
                                    tag.props.defaultMessage.includes('微信') ?
                                        <img className={styles.speTagImg} src={wx} /> :
                                        tag.props.defaultMessage.includes('pos') ? <img className={styles.speTagImg} src={pos} /> :
                                            <span><img className={styles.speTagImg} src={xcx} /><img className={styles.speTagImg} src={pos} /><img className={styles.speTagImg} src={wx} /></span>
                                : tag.includes('pos') ?
                                    <img className={styles.speTagImg} src={pos} /> :
                                    tag.includes('微信') ?
                                        <img className={styles.speTagImg} src={wx} /> :
                                        tag.includes('小程序') ? <img className={styles.speTagImg} src={xcx} /> : null
                        }</div>)
                    })}
                </div>
            </div>
            <Tooltip title={text}>
                <div className={styles.desDiv}>
                    {text}
                </div>
                {/*<div className={styles.desDiv}>
                        {example}
                    </div>*/}
            </Tooltip>

            <div className={styles.speCardLogo} style={{
                right: right * 0.62,
                bottom: bottom * 0.62,
            }}>
                {V3KEYS.includes(key) ?
                    <img className={styles.speCardImg} src={V3LOGO[key]} alt="oops" /> :
                    //商城活动 
                    ['71', '72', '73'].includes(key) ?
                        <img className={styles.speCardImg} src={require(`./assets/logo_${key}.png`)} alt="oops" /> :
                        <img className={styles.speCardImg} src={require(`./assets/logo_${key}_new.png`)} alt="oops" />
                }
            </div>
        </div>
    )
    // }

    /* 新建营销活动老样式 */
    /*return (
        <div className={styles.container} onClick={this.onClick}>
            {this.renderPulgin(key)}
            <div className={styles.cardTitle}>
                {title}
            </div>
            {
                isNew && (
                    <div className={styles.cardNewTag}>
                        NEW
                    </div>
                )
            }
            <div className={styles.tagsContainer}>
                {tags.map((tag, i) => (<div className={styles.tag} key={i}>{tag}</div>))}
            </div>
            <div
                className={styles.promotionDescription}
                style={{
                    marginTop: 12
                }}
            >
                {text}
            </div>
            <div className={styles.promotionDescription}>
                {example}
            </div>
            <div className={styles.cardBackgroundImage}>
                <img src={backgroundImageString} alt="oops"/>
            </div>
            <div className={styles.cardLogo} style={{
                right,
                bottom,
            }}>
                {V3KEYS.includes(key) ?
                    <img style={{maxWidth: '90px', maxHeight: '90px'}} src={V3LOGO[key]} alt="oops"/>:
                    <img style={{  width: key == 75 ? 70 : key == 77 || key == 76 ? 58 : 'auto' }} src={require(`./assets/logo_${key}.png`)} alt="oops"/>
                }
            </div>
        </div>
    )*/
}
}

export default NewPromotionCard
