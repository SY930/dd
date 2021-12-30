import React, {Component} from 'react';
import { jumpPage } from '@hualala/platform-base';
import promotionCalendarBg from '../../../assets/promotion_calendar_bg.png'
import promotion_calendar_banner2022 from '../../../assets/promotion_calendar_banner2022.png'
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
                    backgroundColor: `rgba(83, 115, 255, 1)`,
                }}
                onClick={() => {
                    jumpPage({ menuID: jumpTarget || PROMOTION_CALENDAR_GROUP })
                }}
            >
                <img style={{height:'100%'}} src={promotion_calendar_banner2022} alt="2022年营销日历" />
            </div>
        )
    }
}

export default PromotionCalendarBanner
