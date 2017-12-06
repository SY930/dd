import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import LazyLoad, { forceCheck } from '@hualala/react-lazyload';
import uuid from 'uuid/v4';
import classnames from 'classnames';

import styles from './assets/HualalaTable.less';

const ROW_SELECTION = uuid();

class HualalaTable extends Component {
    componentDidUpdate() {
        forceCheck();
    }

    handleCheckAll = evt => this.props.onCheckAll(evt.target.checked)

    handleRowCheck = (evt, rowDataKey) => {
        evt.stopPropagation();
        this.props.onCheck(evt.target.checked, rowDataKey);
    }

    handleRowClick = (rowData) => {
        this.props.onRowClick(rowData);
    }

    renderColGroup(columns) {
        return (
            <colgroup>
                {columns.map(({ key, dataIndex, width }) => {
                    const _width = key === ROW_SELECTION ? 34 : width;
                    const style = _width ? { width: _width, minWidth: _width } : {};
                    return (
                        <col key={key || dataIndex} style={style} />
                    );
                })}
            </colgroup>
        );
    }

    renderTableHeader(columns, dataSource) {
        const { rowKey, checkable, checkedKeys, scroll: { x: scollX } = {} } = this.props;
        const isAllChecked = checkable && dataSource.length
            && (dataSource.length <= checkedKeys.length)
            && (!dataSource.find(record => checkedKeys.indexOf(record.key || record[rowKey]) === -1));
        return (
            <table style={{ width: scollX || '100%' }}>
                {this.renderColGroup(columns)}
                <thead className={styles.thead}>
                    <tr>
                        {columns.map((column) => {
                            const { key, dataIndex, title, className } = column;
                            if (key === ROW_SELECTION) {
                                return (
                                    <th key={key}>
                                        <Checkbox
                                            checked={isAllChecked}
                                            onChange={this.handleCheckAll}
                                        />
                                    </th>
                                );
                            }
                            return (
                                <th key={key || dataIndex} className={className}>
                                    {title}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
            </table>
        );
    }

    renderTableBody(columns, dataSource) {
        const { rowKey, checkedKeys, scroll: { x: scollX } = {} } = this.props;
        return (
            <table style={{ width: scollX || '100%' }}>
                {this.renderColGroup(columns)}
                <tbody className={styles.tbody}>
                    {dataSource.map((rowData, index) => {
                        const rowDataKey = rowData[rowKey] || rowData.key;
                        return (
                            <LazyLoad
                                key={rowDataKey}
                                height={28}
                                overflow={true}
                                offset={560}
                            >
                                <tr onClick={() => this.handleRowClick(rowData)}>
                                    {columns.map((column) => {
                                        const { key, dataIndex, className, render } = column;
                                        const colValue = rowData[dataIndex];
                                        if (key === ROW_SELECTION) {
                                            return (
                                                <td key={key} onClick={evt => evt.stopPropagation()}>
                                                    <Checkbox
                                                        checked={checkedKeys.indexOf(rowDataKey) > -1}
                                                        onChange={evt => this.handleRowCheck(evt, rowDataKey, rowData)}
                                                    />
                                                </td>
                                            );
                                        }
                                        return (
                                            <td key={key || dataIndex} className={className}>
                                                {(render ? render(colValue, rowData, index) : colValue)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </LazyLoad>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    render() {
        const {
            columns, dataSource, checkable,
            bordered, scroll: { y: scrollY } = {},
        } = this.props;
        const _columns = checkable ? [{ key: ROW_SELECTION }].concat(columns) : columns;
        return (
            <div
                className={classnames(styles.table, {
                    [styles.bordered]: bordered,
                    [styles.scrollY]: !!scrollY,
                })}
            >
                <div className={styles.tableHeader}>
                    {this.renderTableHeader(_columns, dataSource)}
                </div>
                <div
                    className={styles.tableBody}
                    style={scrollY ? {
                        maxHeight: scrollY,
                    } : {}}
                >
                    {this.renderTableBody(_columns, dataSource)}
                </div>
            </div>
        );
    }
}

HualalaTable.defaultProps = {
    bordered: true,
    scroll: {},
    columns: [],
    dataSource: [],
    rowKey: '',
    checkable: false,
    checkedKeys: [],
    onCheck() {},
    onCheckAll() {},
    onRowClick() {},
};

HualalaTable.propTypes = {
    /** 是否展示外边框和内边框 */
    bordered: PropTypes.bool,
    /** 横向或纵向支持滚动，也可用于指定滚动区域的宽高度：{{ y: 300 }} */
    scroll: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
    }),
    /** 表格列的配置描述 */
    columns: PropTypes.arrayOf(PropTypes.shape({
        /** React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性 */
        key: PropTypes.string,
        /** 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法 */
        dataIndex: PropTypes.string,
        /** 列头显示文字 */
        title: PropTypes.string,
        /** 列的 className */
        className: PropTypes.string,
        /** 列宽度 */
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        /** 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引 */
        render: PropTypes.func,
    })),
    /** 数据数组 */
    dataSource: PropTypes.arrayOf(PropTypes.any),
    /** 表格行 key 的取值 */
    rowKey: PropTypes.string,
    /** 是否支持行勾选 */
    checkable: PropTypes.bool,
    /** 当前勾选的行（受控） */
    checkedKeys: PropTypes.arrayOf(PropTypes.string),
    /** 勾选一行时的回调 */
    onCheck: PropTypes.func,
    /** 全选时的回调 */
    onCheckAll: PropTypes.func,
    /** 单击一行时的回调 */
    onRowClick: PropTypes.func,
};

export default HualalaTable;
