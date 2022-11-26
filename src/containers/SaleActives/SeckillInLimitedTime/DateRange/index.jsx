/*
 * @Author: xinli xinli@hualala.com
 * @Date: 2022-10-24 15:11:43
 * @LastEditors: xinli xinli@hualala.com
 * @LastEditTime: 2022-11-25 18:40:41
 * @FilePath: /platform-sale/src/containers/PromotionV3/Camp/DateRange/index.jsx
 */
import React, { PureComponent as Component } from 'react';
import { DatePicker } from 'antd';
import { getAuthLicenseData } from '../AxiosFactory';
import { checkAuthLicense } from '../../../../helpers/util';
import css from './style.less';
import moment from 'moment'

const { RangePicker } = DatePicker;
class DateRange extends Component {
    state= {
        authLicenseData: {}
    }
    componentDidMount(){
        getAuthLicenseData().then(list => {
            this.setState({ authLicenseData: list });
        })
    }
    countDays(val) {
        let days = 0;
        if (val[0]) {
            const [sd, ed] = val;
            days = ed.diff(sd, 'days');
            return days + 1;
        }
        return days;
    }

    render() {
        const { value, type } = this.props;
        const days = this.countDays(value);
        const disabledTimeTypeArr = ['95'];
        return (
            <div className={css.mainBox}>
                <RangePicker
                    value={value}
                    onChange={this.props.onChange}
                    showTime={{ format: 'HH:mm' }}
                    format={"YYYY-MM-DD HH:mm"}
                    disabledDate={(current) => {
                        console.log(current,'cureet=================')
                        let {pluginInfo = {}, authPluginStatus} = checkAuthLicense(this.state.authLicenseData, 'HLL_CRM_Marketingbox')
                        console.log(pluginInfo,'pluginfo0000000000000')
                        let {authStartDate = '', authEndDate = ''} = pluginInfo
                        authStartDate = moment(authStartDate, 'YYYYMMDD').format('YYYY-MM-DD')
                        let authEndDates = moment(authEndDate, 'YYYYMMDD').format('YYYY-MM-DD')
                        let disabledDates = !current.isBetween(authStartDate, authEndDates, null, '()')
                        if(disabledTimeTypeArr.includes(type)){
                            return current < moment(value[0]).subtract(1, 'year') ||
                            current > moment(value[0]).add(1, 'year').subtract(1, 'days')
                        }
                        // 永久授权
                        if(authEndDate == '99999999'){
                            return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                        }
                        if(authPluginStatus){
                            return disabledDates || current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                        }else{
                            // Can not select days before today
                            return current && current.format('YYYYMMDD') < moment().format('YYYYMMDD');
                        }
                    }}
                />
            </div>
        )
    }
}

export default DateRange
