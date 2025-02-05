import React, {Component} from 'react';
import styles from './transGift.less';
import {
    Upload,
    Modal,
    message,
    Icon,
    Timeline,
    Tooltip,
    Button,
} from 'antd';
import moment from 'moment';
export default class TransGiftModal extends React.Component {
    render(){
        const { transList, onClose } = this.props;
        return (
            <Modal
                title={'转赠记录'}
                width={750}
                visible={true}
                maskClosable={false}
                footer={[<Button key="0" type="primary" onClick={onClose}>关闭</Button>]}
            >
                <div className = {styles.modalTitle}><span>转赠时间</span><span>券编码</span><span>客户编号</span><span>姓名</span><span>手机号</span></div>
                <div style={{padding: 4}}>
                    <Timeline>
                    {
                        transList.map((item, index) => {
                            let ifLast = index == (transList.length-1);
                            return (
                                <Timeline.Item color='#1BB496' dot={ifLast ? <div className={styles.darkerDot}></div> : <div className={styles.lighterDot}></div>}>
                                    <div className={styles.grayBackground}>
                                        <Tooltip title={moment(item.transferTime).format('YYYY/MM/DD')}>
                                            <span className={ifLast ? styles.spanItem : styles.lighterItem} style={{position: 'relative', left: -19}}>{moment(item.transferTime).format('YYYY/MM/DD')}</span>
                                        </Tooltip>
                                        <Tooltip title={item.giftPwd}>
                                            <span className={ifLast ? styles.spanItem : styles.lighterItem} style={{position: 'relative', left: -12}}>{item.giftPwd}</span>
                                        </Tooltip>
                                        <Tooltip title={item.customerID}>
                                            <span className={ifLast ? styles.spanItem : styles.lighterItem} style={{position: 'relative', left: -4}}>{item.customerID}</span>
                                        </Tooltip>
                                        <Tooltip title={item.customerName}>
                                            <span className={ifLast ? styles.spanItem : styles.lighterItem} style={{position: 'relative', left: -4}}>{item.customerName}</span>
                                        </Tooltip>
                                        <Tooltip title={item.customerMobile}>
                                            <span className={ifLast ? styles.spanItem : styles.lighterItem} style={{position: 'relative', left: -4}}>{item.customerMobile}</span>
                                        </Tooltip>
                                    </div>
                                </Timeline.Item>
                                )
                        })
                    }
                    </Timeline>
                </div>
            </Modal>
        )
    }
}