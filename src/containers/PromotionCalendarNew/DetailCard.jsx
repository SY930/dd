import React, { Component } from 'react';
import style from './style.less';
import moment from 'moment';
import { Progress } from 'antd';
import { axiosData } from '../../helpers/util';
import editIcon from './assets/editIcon.png';
import previewIcon from './assets/previewIcon.png';

export default class DetailCard extends Component {
    constructor() {
        super();
        this.state = {
            sendCount: 0,
            useCount: 0,
        }
    }
    componentDidMount() {
        const {
            eventID,
            eventCategory,
        } = this.props.data;

        axiosData(
            '/calendar/eventCalendarService_queryCouponInfo.ajax',
            {
                eventID,
                eventCategory,
            },
            { needThrow: true },
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((data) => {
            const {
                sendCount = 0,
                useCount = 0,
            } = data || {};
            this.setState({
                sendCount,
                useCount,
            })
        })
    }
    displayEditButton() {
        const {
            title,
            eventName,
            eventType,
            eventCategory,
            process,
            status,
            maintenanceLevel,
            isActive,
        } = this.props.data;
        if (eventCategory === 10) {
            if (maintenanceLevel == 1 || process === '100%') {
                return false
            }
        } else {
            const statusState = (
                (eventType == '50' || eventType == '53')
                &&
                (status != '0' && status != '1' && status != '5' && status != '21')
            );
            if (process === '100%' || statusState || isActive != '0') {
                return false
            }
        }
        return true;
    }
    render() {
        const {
            title,
            eventName,
            eventStartDate,
            eventEndDate,
            process,
        } = this.props.data;
        const { onEditOrPreviewBtnClick } = this.props;
        const {
            sendCount,
            useCount,
        } = this.state;
        const percent = useCount === sendCount ? 100 : (100 * useCount / sendCount).toFixed(1);
        return (
            <div className={style.detaileCardWrapper}>
                {
                    sendCount > 0 && (
                        <div className={style.couponUsageCard}>
                            <Progress
                                type="circle"
                                strokeWidth={9}
                                status="active"
                                percent={+percent}
                                format={() => ''}  
                            />
                            <div className={style.usageInfo}>
                                <div>发券数：{sendCount}</div>
                                <div>用券数：{useCount}</div>
                                <div>用券率：{percent}%</div>
                            </div>
                        </div>
                    )
                }
                <div className={style.actionArea}>
                    {
                        this.displayEditButton() && (
                            <img onClick={() => onEditOrPreviewBtnClick(this.props.data, 'edit')} src={editIcon} alt=""/>
                        )
                    }
                    <img onClick={() => onEditOrPreviewBtnClick(this.props.data, 'preview')} src={previewIcon} alt=""/>
                </div>
                
                <div className={style.detailLine}>
                    活动类型：{title}
                </div>
                <div className={style.detailLine}>
                    活动名称：{eventName}
                </div>
                <div className={style.detailLine}>
                    活动周期：{moment(`${eventStartDate}`, 'YYYYMMDD').format('YYYY/MM/DD')} - {moment(`${eventEndDate}`, 'YYYYMMDD').format('YYYY/MM/DD')}
                </div>
                <div className={style.detailLine}>
                    活动进度：{process}
                </div>
            </div>
        )
    }
}