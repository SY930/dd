import React, {Component} from 'react';
import styles from './cardStyle.less';
import bg0 from './assets/bg0.png';
import bg1 from './assets/bg1.png';
import bg2 from './assets/bg2.png';
import bg3 from './assets/bg3.png';

class NewPromotionCard extends Component {

    render() {
        const {
            promotionEntity : {
                tags = [],
                title,
                text,
                example,
                key,
                right = 0,
                bottom = 0
            },
            index,
            onCardClick
        } = this.props;
        let backgroundImageString;
        switch (index % 4) {
            case 0: backgroundImageString = bg0; break;
            case 1: backgroundImageString = bg1; break;
            case 2: backgroundImageString = bg2; break;
            case 3: backgroundImageString = bg3; break;
            default: backgroundImageString = bg0;
        }
        return (
            <div className={styles.container} onClick={() => {
                onCardClick(this.props.promotionEntity)
            }}>
                <div className={styles.cardTitle}>
                    {title}
                </div>
                <div className={styles.tagsContainer}>
                    {tags.map(tag => (<div className={styles.tag} key={tag}>{tag}</div>))}
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
                    bottom
                }}>
                    <img src={require(`./assets/logo_${key}.png`)} alt="oops"/>
                </div>
            </div>
        )
    }
}

export default NewPromotionCard