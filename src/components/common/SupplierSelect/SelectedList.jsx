import React, { Component } from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';

import styles from './assets/SelectedList.less';

const emptyFn = () => {};
const orgType = {
    0: '配送中心仓库',
    1: '门店',
    2: '公司',
    3: '行政部门',
    4: '配送中心',
    7: '厨房部门',
    8: '门店仓库',
    9: '加工间',
    10: '员工餐',
    11: '吧台',
    12: '前厅',
    13: '区域',
}
class SelectedList extends Component {
    state = {
        collapsed: false,
    }

    handleCollapse = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    handleClear = () => {
        const { onChange = emptyFn } = this.props;
        onChange([]);
    }

    handleRemove = (tarItem) => {
        const { items, onChange = emptyFn } = this.props;
        const values = items.filter(
            item => item.supplierID !== tarItem.supplierID
        ).map(
            item => item.supplierID
        );
        onChange(values);
    }

    render() {
        const { title, className, items } = this.props;
        const { collapsed } = this.state;

        const wrapperClz = classnames(styles.wrapper, {
            [styles.collapsed]: collapsed,
        }, className);

        return (
            <div className={wrapperClz}>
                <div className={styles.header}>
                    <Icon
                        type={`${collapsed ? 'up' : 'down'}-square-o`}
                        onClick={this.handleCollapse}
                    />
                    <span>{`已选 ${items.length} 个${title}（单击移除）`}</span>
                    <a href="javascript:void(0);" onClick={this.handleClear}>清空</a>
                </div>
                {collapsed ? (
                    <div className={styles.content}>查看已选请向下展开</div>
                ) : (
                    <ul className={styles.content}>
                        {items.map(item => (
                            <li
                                key={item.supplierID}
                                role="presentation"
                                className={styles.item}
                                onClick={() => this.handleRemove(item)}
                                title={item.supplierName}
                            >
                                <span className={`text-center ${styles.itemTd}`}>{item.supplierName}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
}

SelectedList.defaultProps = {
    title: '',
};

export default SelectedList;
