import React, { PureComponent as Component } from 'react';
import { Tag } from 'antd'
import styles from './index.less';
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
        const css = disabled ? { pointerEvents: 'none' } : {};

        // 如果传的是d, 不渲染任何东西
        // if(type === 'd') {
        //     return null;
        // }

        return (
                <div className={styles.dayBox} style={css}>
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
