
/**
 * 提醒到期组件
 */
import React from 'react';
import { Icon, Col } from 'antd';
import { getStore } from '@hualala/platform-base';
import axios from 'axios';
import styles from './notice.less';
class ExpireDateNotice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showDate: null,
            isExpire:'noExpire',
            visible: true
        };
    }
    componentDidMount() {
        const {productCode} = this.props;
        this.getAuthLicenseData(productCode);
    }
    getAuthLicenseData = (productCode = 'HLL_CRM_Marketingbox') => {
        const { groupID } = getStore().getState().user.get('accountInfo').toJS();
        axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_CRM',
            type: 'post',
            data: {
                groupID, productCode,
            },
            method: '/crm/crmAuthLicenseService.queryCrmPluginLicenses.ajax',
        }).then((ret) => {
            if (ret.code === '000') {
                let basicAuthEndDate = null;
                if(productCode = 'HLL_CRM_Marketingbox'){
                    let {plugins} = ret.data;
                    basicAuthEndDate = plugins && plugins.length > 0 ? plugins[0].authEndDate : null;
                }else{
                    basicAuthEndDate = ret.data.basicAuthEndDate ? ret.data.basicAuthEndDate : null;
                }
                let endDate = '';
                let showDate = '';
                let curTime = new Date().getTime();
                let interval = 30 * 24 * 60 * 60 * 1000;//30天倒计时
                if (basicAuthEndDate) {
                    endDate = String(basicAuthEndDate).match(/(\d{4})(\d{2})(\d{2})/).filter((item, index) => index > 0).join('/');
                    showDate = String(basicAuthEndDate).match(/(\d{4})(\d{2})(\d{2})/).filter((item, index) => index > 0).join('-');
                };
                let endDateToString = Date.parse(endDate);
                if (!endDateToString) return;
                let disTime = endDateToString - curTime;
                if ( disTime > 0 && disTime <= interval ) {
                    this.setState({
                        showDate,
                        isExpire:'near'
                    })
                }
                if (disTime < 0) {
                    this.setState({
                        isExpire:'expired'
                    })
                }
            } else {
                this.setState({
                    isExpire:'noExpired'
                })
                message.warn(ret.message)
            }
        })
    }
    handleCloseNotice = (e) => {
        this.setState({
            visible:false
        })
    }
    render() {
        const { productCode,marginLeft = "",marginTop = "" } = this.props;
        const { isExpire, showDate, visible} = this.state;
        let insertText = '';
        switch (isExpire) {
            case 'near'://30天倒计时
                if(productCode == 'HLL_CRM_Marketingbox'){
                    insertText = <span className={styles.noticeText}>营销大礼包将于<span style={{ color: '#dd576b' }}> {showDate} </span>到期，请联系哗啦啦工作人员续费，以免影响使用，谢谢</span>;
                }
                break;
            case 'expired'://已过期
                if(productCode == 'HLL_CRM_Marketingbox'){
                    insertText = <span className={styles.noticeText}>授权模块（营销大礼包）已到期，请尽快联系哗啦啦工作人员处理，以免影响使用，谢谢</span>;
                }
                break;
            default:
                insertText = '';
                break;
        }
        return (
                isExpire === 'noExpire' || !visible
                ? 
                null 
                :
                <Col className={styles.expireDateNotice} onClick={() => this.handleCloseNotice()} style={{marginLeft:marginLeft,marginTop:marginTop}}>
                    <Icon type="info-circle" className={styles.noticeInfoCircle}/>
                    {insertText}
                    <Icon type="close" className={styles.noticeInfoClose}/>
                </Col>
            );
    }
}

export default ExpireDateNotice;

