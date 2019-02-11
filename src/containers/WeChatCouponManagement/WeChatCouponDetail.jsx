import React from 'react';
import {
    Row,
    Col,
} from 'antd';
import moment from 'moment';
import style from './style.less';
import { BATCH_STATUS } from './WeChatCouponList'
import WeChatCouponCard from "./WeChatCouponCard";

const WeChatCouponDetail = ({ entity }) => {
    const statusText = (BATCH_STATUS.find(item => item.value === String(entity.couponStockStatus)) || {label: '未知'}).label;
    const couponValueInRMB = entity.couponValue / 100;
    const couponMinimumInRMB = entity.couponMinimum / 100;
    const beginDate = moment(entity.beginTime).format('YYYY-MM-DD')
    const endDate = moment(entity.endTime).format('YYYY-MM-DD')
    return (
        <div className={style.couponDetailWrapper}>
            <WeChatCouponCard entity={entity} />
            <div className={style.details} >
                <div className={style.nameRow}>
                    <span className={style.name}>
                        {entity.couponName}
                    </span>
                    <span className={style.status}>
                        {statusText}
                    </span>
                </div>
                <div style={{ color: '#8D8D8D' }}>
                    创建时间: {moment(entity.createTime).format('YYYY.MM.DD')}
                    &nbsp;&nbsp;&nbsp;
                    批次ID: {entity.batchNo}
                </div>
                <div style={{ color: '#787878', fontSize: 14, lineHeight: 2 }}>
                    <Row>
                        <Col span={7}>代金券面额:</Col>
                        <Col className={style.detailContent} span={14}>{couponValueInRMB}元</Col>
                    </Row>
                    <Row>
                        <Col span={7}>代金券库存:</Col>
                        <Col className={style.detailContent} span={14}>{entity.couponTotal}张</Col>
                    </Row>
                    <Row>
                        <Col span={7}>生效开始时间:</Col>
                        <Col className={style.detailContent} span={14}>{beginDate}</Col>
                    </Row>
                    <Row>
                        <Col span={7}>生效结束时间:</Col>
                        <Col className={style.detailContent} span={14}>{endDate}</Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default WeChatCouponDetail
