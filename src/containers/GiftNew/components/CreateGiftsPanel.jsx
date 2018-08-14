import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import GiftCfg from '../../../constants/Gift';

class CreateGiftsPanel extends Component {

    render() {
        const primaryGifts = GiftCfg.giftType.map(gift => gift.category === 'primary');
        const secondaryGifts = GiftCfg.giftType.map(gift => gift.category === 'secondary');
        return (
            <div>
                <div>
                    <h3>常用券类</h3>
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
                    <h3>其它</h3>
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
        )
    }
}

function ClickableGiftLogo(props) {
    return (
        <div className={props.isPrimary ? `${styles.logoContainer}_${props.index}` : styles.logoContainer}>

        </div>
    );
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

export default connect(null, mapDispatchToProps)(CreateGiftsPanel);
