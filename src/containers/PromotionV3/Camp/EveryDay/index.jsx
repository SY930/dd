import React, { PureComponent as Component } from 'react';
import { Tag } from 'antd'
import css from './style.less';
import { monthList, weekList, weekMap } from './Common';

const { CheckableTag } = Tag;
class EveryDay extends Component {
    onChange(tag, checked) {
        const { value, onChange } = this.props;
        const invert = value.filter(x => x !== tag);
        const tags = checked ? [...value, tag] : invert;
        onChange(tags);
    }
    render() {
        const { type, value, disabled } = this.props;
        const isWeek = (type === 'w');
        const list = isWeek ? weekList : monthList;
        const style = disabled ? { pointerEvents: 'none' } : {};
        return (
                <div className={css.dayBox} style={style}>
                {list.map(x => {
                    const checked = value.indexOf(x) > -1;
                    const text = x.substr(1,2);
                    const label = isWeek ? weekMap[text] : text;
                    return (<CheckableTag
                        key={x}
                        checked={checked}
                        onChange={y => this.onChange(x, y)}
                    >
                        {label}
                    </CheckableTag>
                    )}
                )}
                </div>

        )
    }
}

export default EveryDay
