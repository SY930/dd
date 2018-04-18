import React, { Component } from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';

import HualalaTable from '../HualalaTable';
import './assets/SelectedList.less';

const emptyFn = () => {};

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
            item => item.value !== tarItem.value
        ).map(
            item => item.value
        );
        onChange(values);
    }

    renderList() {
        const { display, items, tableColumns } = this.props;
        switch (display) {
            case 'table':
                return (
                    <div className="content table">
                        <HualalaTable
                            bordered={true}
                            scroll={{ y: 126 }}
                            rowKey="value"
                            columns={tableColumns}
                            dataSource={items}
                            onRowClick={item => this.handleRemove(item)}
                        />
                    </div>
                );
            default:
                return (
                    <ul className="content">
                        {items.map(item => (
                            <li
                                key={item.value}
                                role="presentation"
                                className="item"
                                onClick={() => this.handleRemove(item)}
                            >{item.label}</li>
                        ))}
                    </ul>
                );
        }
    }

    render() {
        const { title, className, items } = this.props;
        const { collapsed } = this.state;

        const wrapperClz = classnames('hll-selected-list', {
            collapsed,
        }, className);

        return (
            <div className={wrapperClz}>
                <div className="header">
                    <Icon
                        type={`${collapsed ? 'up' : 'down'}-square-o`}
                        onClick={this.handleCollapse}
                    />
                    <span>{`已选 ${items.length} 个${title}（单击移除）`}</span>
                    <a href="javascript:void(0);" onClick={this.handleClear}>清空</a>
                </div>
                {collapsed ? (
                    <div className="content">查看已选请向下展开</div>
                ) : this.renderList()}
            </div>
        );
    }
}

SelectedList.defaultProps = {
    title: '',
};

export default SelectedList;
