import React, { PureComponent as Component } from 'react';
import { DatePicker } from 'antd';
import css from './style.less';

const { RangePicker } = DatePicker;
class DateRange extends Component {
    state= {
    }
    countDays(val) {
        let days = 0;
        if(val[0]){
            const [ sd, ed ] = val;
            days = ed.diff(sd, 'days');
        }
        return days;
    }

    render() {
        const { value } = this.props;
        const days = this.countDays(value);
        return (<div className={css.mainBox}>
                    <RangePicker
                        value={value}
                        onChange={this.props.onChange}
                    />
                    <p className={css.count}>{days} 天</p>
                </div>
        )
    }
}

export default DateRange
