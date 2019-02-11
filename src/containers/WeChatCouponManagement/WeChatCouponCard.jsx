import React from 'react';
import style from './style.less'
import moment from 'moment'
import weChatPayImg from '../../assets/wechat_pay.png'

const WeChatCouponCard = ({entity: { couponName, couponValue, couponMinimum, beginTime, endTime }}) => {
    const couponValueInRMB = couponValue / 100;
    const couponMinimumInRMB = couponMinimum / 100;
    const beginDate = moment(beginTime).format('YYYY-MM-DD')
    const endDate = moment(endTime).format('YYYY-MM-DD')
    return (
        <div className={style.weChatCardWrapper}>
            <div className={style.titleRow}>
                <img src={weChatPayImg} alt=""/>
                &nbsp;&nbsp;
                <span>{couponName}</span>
            </div>
            <div className={style.valueRow}>
                <span title={couponValueInRMB}>{couponValueInRMB}</span>元
            </div>
            <div className={style.descRow}>
                订单满<span title={couponMinimumInRMB}>{couponMinimumInRMB}</span>元可用
            </div>
            <div className={style.timeRow}>
                有效期: {beginDate} 至 {endDate}
            </div>
        </div>
    )
}

export default WeChatCouponCard
