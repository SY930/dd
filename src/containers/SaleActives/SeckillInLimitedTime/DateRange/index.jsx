/*
 * @Author: xinli xinli@hualala.com
 * @Date: 2022-10-24 15:11:43
 * @LastEditors: xinli xinli@hualala.com
 * @LastEditTime: 2022-11-29 15:55:54
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
    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
    }
    disabledTime = () => {
        return {
            disabledMinutes: () => this.range(1, 60),
        }
    }
    disabledDate = (current) => {
        const {value} = this.props;
        console.log(value,'value----------------disabledata')
        return current && current.valueOf() < moment().subtract(1,'d') ||  current && current.valueOf() > moment().add(14,'d')
    }
    render() {
        const { value } = this.props;
        
        return (
            <div className={css.mainBox}>
                <RangePicker
                    value={value}
                    onChange={this.props.onChange}
                    showTime={{ 
                        format: 'HH:mm',
                        hideDisabledOptions: true,
                     }}
                    format={"YYYY-MM-DD HH:00"}
                    disabledTime={this.disabledTime}
                    disabledDate={this.disabledDate}
                />
            </div>
        )
    }
}

export default DateRange
