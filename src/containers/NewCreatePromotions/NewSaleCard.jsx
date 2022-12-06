// import { jumpPage } from '@hualala/platform-base';
import { Modal, Tooltip } from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import xinsale from './assets/xinsale.png';
import styles from './cardStyle.less';

// 可作为插件开通的活动有以下：分享裂变、推荐有礼、桌边砍、拼团、秒杀、膨胀大礼包、签到、集点卡、支付后广告、下单抽抽乐、盲盒  9个活动。
const pulgins = ['65', '68', '71', '72', '66', '76', '75', '77', '78', '79'];
// 可作为营销盒子大礼包插件授权活动有以下：分享裂变、推荐有礼、膨胀大礼包、签到、集点卡、支付后广告、下单抽抽乐、盲盒  8个活动。
const authPulgins = ['65', '68', '66', '76', '75', '77', '78', '79'];
const imgURI = 'http://res.hualala.com/';
const V3KEYS = ['78', '79', '83', '10072', '85', '23', '87', '89','95', '7777777']; // 最新版抽抽乐78  秒杀10072  千人千面85 线上餐厅弹窗送礼23 【消费送礼87】【限时秒杀95】
// 最新版 logo图片
const V3LOGO = {
    78: `${imgURI}basicdoc/e464e187-f0eb-4b03-b438-9329cd26c3ff.png`,
    79: require(`./assets/logo_${79}_new.png`),
    83: require(`./assets/logo_${83}_new.png`),
    10072: require(`./assets/logo_${10072}_new.png`),
    85: require(`./assets/logo_${85}_new.png`),
    23: require(`./assets/logo_${23}_new.png`),
    87: require(`./assets/logo_${87}_new.png`),
    89: require(`./assets/logo_${89}_new.png`),
    95: require(`./assets/logo_${95}_new.png`),
    7777777: require(`./assets/logo_${7777777}_new.png`)
};
class NewPromotionCard extends Component {
    onClick = () => {
        const {
            promotionEntity,
            onCardClick,
            onClickOpen,
            onV3Click,
            authPluginStatus,
        } = this.props;
        const { key, title } = promotionEntity;
        const isUse = this.filterItem(key);
        // 插件授权
        if (authPulgins.includes(key) && !authPluginStatus) {
            Modal.warning({
                title: <p></p>,
                content: (
                    <div>
                        <p>营销活动大礼包活动：包括分享裂变；膨胀大礼包；推荐有礼；签到；支付后广告；下单抽抽乐；盲盒；集点卡等，请联系商务开通</p>
                    </div>
                ),
                okText: '知道了',
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
                okText: '免费试用',
                cancelText: '稍后开通',
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
        // jumpPage({ menuID: 'plugins.info' });
    }
    filterItem(key) {
        const { whiteList = [] } = this.props;
        const isUse = whiteList.some(x => x.eventWay == key);
        return isUse;
    }
    showExpire = (date) => {
        const com = new Date(date).getTime()
        const now = new Date().getTime()
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
            const obj = this.showExpire(date)
            // 秒杀71  拼团72  默认永久开通  无text redValidDate
            if (obj.ifShow) {
                const text = authPulgins.includes(key) && !authPluginStatus ? '联系商务开通' : (isUse ? `还有${obj.howMany}天到期` : '申请试用');
                const content = ['71', '72'].includes(key) ? '' : <em className={ath ? styles.validDateAth : (authPulgins.includes(key) && !authPluginStatus) ? styles.validDate : (isUse ? styles.redValidDate : styles.validDate)}> {text}</em >
                return content
            }
            return null
        }
        return null
    }

    render() {
        const {
            promotionEntity: {
                tags = [],
                title,
                text,
                key,
                right = 0,
                bottom = 0,
                isNew,
            },
            index,
            size,
        } = this.props;
        // if(size === 'special') {
        let wechatFlag = 1;
        const showNew = new Date().getTime() - isNew < (1000 * 3600 * 24 * 31)
        return (
            <div className={styles.speNewContainer} onClick={this.onClick}>
                <p className={styles.expandableP}>
                    {showNew && <span><img className={styles.xinImg} src={xinsale} /></span>}
                    {this.renderPulgin(key)}
                </p>
                <div>
                    <div style={{ marginRight: '12px' }}>
                        {/* logo */}
                        <div
                            className={styles.speCardLogo_new}
                            style={{
                                right: right * 0.62,
                                bottom: bottom * 0.62,
                            }}
                        >
                            {V3KEYS.includes(key) ?
                                <img className={styles.speCardImg} src={V3LOGO[key]} alt="oops" /> :
                                // 商城活动
                                ['71', '72', '73'].includes(key) ?
                                    <img className={styles.speCardImg} src={require(`./assets/logo_${key}.png`)} alt="oops" /> :
                                    <img className={styles.speCardImg} src={require(`./assets/logo_${key}_new.png`)} alt="oops" />
                            }
                        </div>
                    </div>
                    <div style={{ marginTop: `${key == '53' || key == '50' || key == '90' ? '-15px' : ''}`}}>
                        <div className={styles.title} title={title}>
                            <Tooltip title={title}>{title}</Tooltip>
                        </div>
                        {/* 标题后面的图标 */}
                        {
                            key == '53' || key == '50' || key == '90' ? null : <div className={styles.speTagNew}>
                                {tags.map((tag, i) => {
                                    if (!wechatFlag && tag.props && tag.props.defaultMessage.includes('微信') || !wechatFlag && !tag.props && tag.includes('微信')) {
                                        return null;
                                    }
                                    if (tag.props && tag.props.defaultMessage.includes('微信') || !tag.props && tag.includes('微信')) {
                                        wechatFlag--;
                                    }
                                    return (<div key={i}>{
                                        tag.props ?
                                            tag.props.defaultMessage.includes('小程序') ?
                                                <span className={styles.speTagSpanNew}>小程序</span> :
                                                tag.props.defaultMessage.includes('微信') ?
                                                    <span className={styles.speTagSpanNew}>H5餐厅</span> :
                                                    tag.props.defaultMessage.includes('pos') ? <span>POS</span> :
                                                        <p className={styles.speTagSpanNew_span}><span>小程序</span><span>POS</span><span>H5餐厅</span></p>
                                            : tag.includes('pos') ?
                                                <span className={styles.speTagSpanNew}>POS</span> :
                                                tag.includes('微信') ?
                                                    <span className={styles.speTagSpanNew}>H5餐厅</span> :
                                                    tag.includes('小程序') ? <span className={styles.speTagSpanNew}>小程序</span> : null
                                    }</div>)
                                })}
                            </div>
                        }

                        <Tooltip title={text}>
                            <div className={styles.desDiv}>
                                {text}
                            </div>
                        </Tooltip>
                    </div>

                </div>
            </div>
        )
    }
}

export default NewPromotionCard
