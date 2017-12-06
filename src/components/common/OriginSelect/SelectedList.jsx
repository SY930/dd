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
            item => item.orgID !== tarItem.orgID
        ).map(
            item => item.orgID
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
                        <li className={styles.item}>
                            <span className={`${styles.wp10} text-center ${styles.itemTd}`}>编码</span>
                            <span className={`${styles.wp35} text-center ${styles.itemTd}`}>组织名称</span>
                            <span className={`${styles.wp20} text-center ${styles.itemTd}`}>组织别名</span>
                            <span className={`${styles.wp10} text-center ${styles.itemTd}`}>组织类别</span>
                            <span className={`${styles.wp25} text-center ${styles.itemTd}`}>所属配送中心</span>
                        </li>
                        {items.map(item => (
                            <li
                                key={item.orgID}
                                role="presentation"
                                className={styles.item}
                                onClick={() => this.handleRemove(item)}
                            >
                                <span className={`${styles.wp10} text-center ${styles.itemTd}`}>{item.orgCode}</span>
                                <span className={`${styles.wp35} text-center ${styles.itemTd}`}>{item.orgName}</span>
                                <span className={`${styles.wp20} text-center ${styles.itemTd}`}>{item.alias}</span>
                                <span className={`${styles.wp10} text-center ${styles.itemTd}`}>{item.orgTypeID ? orgType[item.orgTypeID] : '门店'}</span>
                                <span className={`${styles.wp25} text-center ${styles.itemTd}`}>{item.demandOrgName}</span>
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
