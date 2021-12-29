import React, {Component} from 'react';
import registerPage from '../../../index';
import {PROMOTION_CALENDAR_GROUP, PROMOTION_CALENDAR_SHOP} from "../../constants/entryCodes";
import style from './style.less';
import topBanner from './assets/top-banner.png';
import imgContent1 from './assets/img-content1.png';
import imgContent2 from './assets/img-content2.png';
import imgContent3 from './assets/img-content3.png';
@registerPage([PROMOTION_CALENDAR_GROUP, PROMOTION_CALENDAR_SHOP])
class PromotionCalendar extends Component {

    render() {
        return (
            <div className={style.calendar} style={{ height: '100%', overflowY: 'auto' }} >
                <div
                    style={{
                        width: 800,
                        margin: '0 auto',
                    }}
                >
                    <h1>
                        叮咚！你想要的2022年餐饮营销日历来啦！
                    </h1>
                    <p>
                        这届餐饮人的共同难题：今天营销该怎么做？想做一个：<span className={style.fairRed}>有创意、走心、符合节日氛围</span>的活动，真的太太太难了。
                    </p>
                    <br/>
                    <p>
                        餐饮人的福利来啦！！！让你餐饮营销不再愁。小哗给大家整理了一份《2022年餐饮营销日历》供大家参考～
                    </p>
                    <img src={topBanner} alt=""></img>
                    <img src={imgContent1} alt=""></img>
                    <img src={imgContent2} alt=""></img>
                    <img src={imgContent3} alt=""></img>
                </div>
            </div>
        )
    }
}

export default PromotionCalendar;
