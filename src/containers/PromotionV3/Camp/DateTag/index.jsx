import React, { PureComponent as Component } from 'react';
import { DatePicker, Tag } from 'antd';
import moment from 'moment';
import css from './style.less';

const DF = 'YYYY-MM-DD';
const DF2 = 'YYYYMMDD';
class DateTag extends Component {
    state= {
        open: false,
    }

    onCheck = (val) => {
        const { value, onChange } = this.props;
        const date = val.format(DF2);
        const isExist = value.some(x=>x===date);
        if(isExist){ return }
        const list = [...value, date];
        onChange(list);
    }
    onClose = (tag) => {
        const { value, onChange } = this.props;
        const list = value.filter(x => x !== tag);
        onChange(list);
    }
    onToggle = () => {
        this.setState(ps=>({ open: !ps.open }));
    }
    render() {
        const { open } = this.state;
        const { value } = this.props;

        return (
            <div className={css.mainBox} onClick={this.onToggle}>
                <DatePicker
                    value={null}
                    open={open}
                    onChange={this.onCheck}
                    onOpenChange={this.onToggle}
                />
                <p className={css.tagBox}>
                    {value.map(x=>{
                        const label = moment(x).format(DF);
                        return (<Tag key={x} afterClose={() => this.onClose(x)} closable={1}>{label}</Tag>)
                    })}
                </p>
            </div>
        )
    }
}

export default DateTag
