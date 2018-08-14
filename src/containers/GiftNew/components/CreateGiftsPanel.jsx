import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import GiftCfg from '../../../constants/Gift';

class CreateGiftsPanel extends Component {

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
                            secondaryGifts.map(gift => (
                                <ClickableGiftLogo
                                    key={gift.value}
                                    isPrimary={false}
                                    data={gift}
                                />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

function ClickableGiftLogo(props) {
    return (
        <div className={props.isPrimary ? styles[`logoContainer_${props.index}`] : styles.logoContainer}>
            <div className={styles.headerWithDash}>
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

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(null, mapDispatchToProps)(CreateGiftsPanel);
