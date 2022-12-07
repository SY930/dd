import React, { PureComponent as Component } from 'react';
import { DatePicker } from 'antd';
import { getAuthLicenseData } from '../../BlindBox/AxiosFactory';
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
        const { value, type, disabled = false } = this.props;
        const days = this.countDays(value);
        return (
            <div className={css.mainBox}>
                <RangePicker
                    disabled={disabled}
                    value={value}
                    onChange={this.props.onChange}
                    disabledDate={(current) => {
                        let {pluginInfo = {}, authPluginStatus} = checkAuthLicense(this.state.authLicenseData, 'HLL_CRM_Marketingbox')
                        let {authStartDate = '', authEndDate = ''} = pluginInfo
                        authStartDate = moment(authStartDate, 'YYYYMMDD').format('YYYY-MM-DD')
                        let authEndDates = moment(authEndDate, 'YYYYMMDD').format('YYYY-MM-DD')
                        let disabledDates = !current.isBetween(authStartDate, authEndDates, null, '()')
                        if (type === '85') {
                            return current < moment(value[0]).subtract(1, 'year') ||
                            current > moment(value[0]).add(1, 'year').subtract(1, 'days')
                        }
                        if (type == '87') {
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
                <p className={css.count}>{days} 天</p>
            </div>
        )
    }
}

export default DateRange
