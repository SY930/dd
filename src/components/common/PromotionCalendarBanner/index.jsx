import React, {Component} from 'react';
import { jumpPage } from '@hualala/platform-base';
import promotionCalendarBg from '../../../assets/promotion_calendar_bg.png'
import promotionCalendarBanner from '../../../assets/promotion_calendar_banner.jpg'
import style from './style.less'
import {PROMOTION_CALENDAR_GROUP} from "../../../constants/entryCodes";

class PromotionCalendarBanner extends Component {

    render() {
        const { jumpTarget } = this.props;
        return (
            <div
                className={style.bannerWrapper}
                style={{
                    // background: `url(${promotionCalendarBg})`,
                    backgroundColor: `#1c6efc`,
                }}
                onClick={() => {
                    jumpPage({ menuID: jumpTarget || PROMOTION_CALENDAR_GROUP })
                }}
            >
                <img src={promotionCalendarBanner} alt="2021年营销日历" />
            </div>
        )
    }
}

export default PromotionCalendarBanner
