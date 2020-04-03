import React, {Component} from 'react';
import styles from './cardStyle.less';
import bg0 from './assets/bg0.png';
import bg1 from './assets/bg1.png';
import bg2 from './assets/bg2.png';
import bg3 from './assets/bg3.png';
import { jumpPage } from '@hualala/platform-base';
import { Modal } from 'antd';

//可作为插件开通的活动有以下：分享裂变、推荐有礼、桌边砍、拼团、秒杀、膨胀大礼包、签到、集点卡、支付后广告  9个活动。
const pulgins = ['65', '68', '67', '71', '72', '66', '76', '75', '77'];
class NewPromotionCard extends Component {
    onClick= () => {
        const {
            promotionEntity,
            onCardClick,
        } = this.props;
        const { key } = promotionEntity;
        const isUse = this.filterItem(key);
        if(pulgins.includes(key) && !isUse) {
            Modal.info({
                title: '',
                content: (
                  <div>
                    <p>联系商务开通</p>
                  </div>
                ),
                onOk() {},
              });
        }else{
            onCardClick(promotionEntity);
        }
        console.log('promotionEntity', promotionEntity);
        // jumpPage({ menuID: 'plugins.info' });
    }
    filterItem(key){
        const {whiteList = []} = this.props;
        const isUse = whiteList.some(x=> x.eventWay == key);
        return isUse;
    }
    renderPulgin(key) {
        const date = '有效期至 2020/3/22';
        const isUse = this.filterItem(key);
        if(pulgins.includes(key) && !isUse) {
            return <em className={styles.validDate}>申请试用</em>
        }
    }
    render() {
        const {
            promotionEntity : {
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
                    {this.renderPulgin(key)}
                    <div className={styles.title}>
                        {title}
                    </div>
                    <div className={styles.cardBackgroundImage}>
                        <img src={backgroundImageString} alt="oops"/>
                    </div>
                    <div className={styles.cardLogo} style={{
                        right: right * 0.62,
                        bottom: bottom * 0.62,
                    }}>
                        <img src={require(`./assets/logo_${key}.png`)} alt="oops"/>
                    </div>
                </div>
            )
        }
        return (
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
                    <img style={{  width: key == 75 ? 70 : key == 77 || key == 76 ? 58 : 'auto' }} src={require(`./assets/logo_${key}.png`)} alt="oops"/>
                </div>
            </div>
        )
    }
}

export default NewPromotionCard
