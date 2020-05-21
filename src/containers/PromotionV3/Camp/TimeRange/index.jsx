import React, { PureComponent as Component } from 'react';
import { TimePicker, Icon } from 'antd';
import css from './style.less';

function range(start, end) {
    return Array(end - start).fill(0).map((value, idx) => {
        return idx + start;
    });
}
const href = 'javascript:;';
class TimeRange extends Component {
    state= {
    }
    componentDidMount() {
        this.onPlus();
    }
    onStartChange = (val, idx) => {
        console.log(val, idx);
        const { value, onChange } = this.props;
        const list = [...value];
        list[idx] = { ...value[idx], start: val };
        onChange(list);
    }
    onEndChange = (val, idx) => {
        const { value, onChange } = this.props;
        const list = [...value];
        list[idx] = { ...value[idx], end: val };
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
                                value={x.start}
                                onChange={(v)=>this.onStartChange(v, i)}
                                disabledMinutes={h => range(1, 30).concat(range(31, 60))}
                                hideDisabledOptions={true}
                                format="HH:mm"
                            />
                            <span className={css.sep}>--</span>
                            <TimePicker
                                value={x.end}
                                onChange={(v)=>this.onEndChange(v, i)}
                                disabledMinutes={h => range(0, 29).concat(range(30, 59))}
                                hideDisabledOptions={true}
                                format="HH:mm"
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
