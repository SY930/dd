import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import GiftCfg from '../../../constants/Gift';
import {
    message,
} from 'antd';
import {startCreateGift} from "../_action";
import {
    FOOD_INVOLVED_GIFT_CREATE_DISABLED_TIP, GIFT_CREATE_DISABLED_TIP, HUATIAN_GROUP_ID,
    isBrandOfHuaTianGroupList, isHuaTian
} from "../../../constants/projectHuatianConf";

const temporaryDisabledGifts = [
]; // 不上线, 只在dohko显示的礼品类型

class CreateGiftsPanel extends Component {

    handleLogoClick = (gift = {}) => {
        if (isBrandOfHuaTianGroupList() && gift.value === '90') {
            message.warning(GIFT_CREATE_DISABLED_TIP);
            return;
        }
        if (isHuaTian() && gift.category === 'primary') {
            message.warning(GIFT_CREATE_DISABLED_TIP);
            return;
        }
        if (HUALALA.ENVIRONMENT === 'production-release' && temporaryDisabledGifts.includes(gift.value)) {
            message.success('敬请期待~');
            return;
        }
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
                            secondaryGifts.map(gift => (
                                <ClickableGiftLogo
                                    key={gift.value}
                                    onClick={() => {
                                        this.handleLogoClick(gift)
                                    }}
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
        <div onClick={props.onClick} className={props.isPrimary ? styles[`logoContainer_${props.index}`] : styles.logoContainer}>
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
