import React, { PureComponent as Component } from 'react';
import { TimePicker, Icon } from 'antd';
import moment from 'moment';
import css from './style.less';

function range(start, end) {
    return Array(end - start).fill(0).map((value, idx) => {
        return idx + start;
    });
}
const href = 'javascript:;';
const TF = 'HH:mm';
class TimeRange extends Component {
    state= {
    }
    componentDidMount() {
    }
    onStartChange = (startTime, idx) => {
        const { value, onChange } = this.props;
        const list = [...value];
        list[idx] = { ...value[idx], startTime };
        onChange(list);
    }
    onEndChange = (endTime, idx) => {
        const { value, onChange } = this.props;
        const list = [...value];
        list[idx] = { ...value[idx], endTime };
        onChange(list);
    }
    onPlus = () => {
        const { value, onChange } = this.props;
        const list = [...value];
        const id = Date.now().toString(36); // 随机不重复ID号
        list.push({ id });
        onChange(list);
    }
    onMinus = ({ target }) => {
        const { idx } = target.closest('p').dataset;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(+idx, 1);
        onChange(list);
    }

    getDisableHours = (start) => {
        if (start) {
            return range(0, start.hour());
        }
        return [];
    }

    getDisableMinutes = () => {
        if (this.props.type === '85') {
            return []
        }
        return range(1, 30).concat(range(31, 60))
    }

    getDisableMinutesEnd = () => {
        if (this.props.type === '85') {
            return []
        }
        return range(0, 29).concat(range(30, 59))
    }

    render() {
        const { value } = this.props;
        const len = value.length;
        return (
                <ul className={css.mainBox}>
                {value.map((x, i) => {
                    const isPlus = (i < 2) && (len === i + 1);
                    const isMinus = (i > 0) && (len === i + 1) ;
                    return (
                        <li key={x.id}>
                            <TimePicker
                                value={x.startTime}
                                onChange={(v)=>this.onStartChange(v, i)}
                                disabledMinutes={h => { return this.getDisableMinutes()}}
                                hideDisabledOptions={true}
                                format={TF}
                            />
                            <span className={css.sep}>--</span>
                            <TimePicker
                                value={x.endTime}
                                onChange={(v)=>this.onEndChange(v, i)}
                                disabledMinutes={h => { return this.getDisableMinutesEnd()}}
                                disabledHours={() => { return this.getDisableHours(x.startTime); }}
                                hideDisabledOptions={true}
                                format={TF}
                            />
                            <p className={css.op} data-idx={i}>
                                {isPlus &&
                                    <a href={href} className={css.plus} onClick={this.onPlus}><Icon type="plus-circle-o" /></a>}
                                {isMinus &&
                                    <a href={href} onClick={this.onMinus}><Icon type="minus-circle-o" /></a>
                                }
                            </p>
                        </li>
                    )}
                )}
                </ul>

        )
    }
}

export default TimeRange
