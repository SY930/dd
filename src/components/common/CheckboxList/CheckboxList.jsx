import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Input, Icon } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import { pyMatch } from '@hualala/platform-base';
import HualalaTree from '../HualalaTree';
import HualalaTable from '../HualalaTable';
import PlainList from './PlainList';
import './styles.less';

const Search = Input.Search;

class CheckboxList extends Component {
    state = {
        collapsed: false,
        keyword: '',
        options: this.props.options,
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.options, nextProps.options)) {
            this.setState({
                keyword: '',
                options: nextProps.options,
            });
        }
    }

    filterOptions(options, keyword) {
        return options.filter(
            option => pyMatch({ name: option.label, py: option.py }, keyword)
        );
    }

    handleCheckAll = (isChecked) => {
        const { options } = this.state;
        const checkedItems = this.props.value.filter(
            value => !options.find(opt => opt.value === value)
        ).concat(
            isChecked ? options.map(opt => opt.value) : []
        );
        this.props.onChange && this.props.onChange(checkedItems);
    }

    handleSearch = (evt) => {
        const keyword = evt.target.value;
        const { display, options } = this.props;
        this.setState({ keyword });
        if (display !== 'tree' && display !== 'treeLeaf') {
            this.setState({
                options: this.filterOptions(options, keyword),
            });
        }
    }

    handleCollapse = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    handleCheck = (isChecked, optValue) => {
        const { value } = this.props;
        const checkedItems = isChecked ? value.concat(optValue)
            : value.filter(val => val !== optValue);
        this.props.onChange(checkedItems);
    }

    handleChange = (checkedKeys) => {
        this.props.onChange(checkedKeys);
    }

    renderList() {
        const { value, display, tableColumns } = this.props;
        const { keyword, options } = this.state;
        switch (display) {
            case 'tree':
            case 'treeLeaf':
                return (
                    <HualalaTree
                        checkable={true}
                        checkStrictly={display !== 'treeLeaf'}
                        autoCheckChildren={true}
                        autoExpandAll={true}
                        keyword={keyword}
                        value={value}
                        options={options}
                        onChange={this.handleChange}
                    />
                );
            case 'table':
                return (
                    <HualalaTable
                        bordered={true}
                        scroll={{ y: 164 }}
                        rowKey="value"
                        columns={tableColumns}
                        dataSource={options}
                        checkable={true}
                        checkedKeys={value}
                        onCheck={this.handleCheck}
                        onCheckAll={this.handleCheckAll}
                    />
                );
            default:
                return (
                    <PlainList
                        value={value}
                        options={options}
                        onCheck={this.handleCheck}
                    />
                );
        }
    }

    render() {
        const {
            value, showSearch, showCheckAll, showCollapse, width, display, tableColumns,
        } = this.props;
        const { keyword, collapsed, options } = this.state;

        const _showSearch = collapsed ? false : showSearch;
        const _showCheckAll = collapsed || (display === 'table' && tableColumns.length)
            ? false : showCheckAll;
        const isAllChecked = options.length > 0 &&
            !options.find(opt => value.indexOf(opt.value) === -1);

        const wrapperClz = classnames('hll-checkbox-list', {
            collapsed,
            stripped: display === 'stripped',
            table: display === 'table',
        });
        const headerClz = classnames('header', {
            showCheckAll: _showCheckAll,
            showCollapse,
        });

        return (
            <div className={wrapperClz} style={collapsed ? {} : { width }}>
                <div className={headerClz}>
                    {_showCheckAll &&
                        <Checkbox
                            checked={isAllChecked}
                            onChange={evt => this.handleCheckAll(evt.target.checked)}
                        >全选</Checkbox>
                    }
                    {_showSearch &&
                        <Search
                            value={keyword}
                            placeholder="请输入关键字查询"
                            onChange={this.handleSearch}
                        />
                    }
                    {showCollapse &&
                        <Icon
                            type={`${collapsed ? 'right' : 'left'}-square-o`}
                            onClick={this.handleCollapse}
                        />
                    }
                </div>
                <div className="content">
                    {collapsed ? Array.from('查看内容请向右展开').map(
                        (ch, idx) => <p key={idx}>{ch}</p>
                    ) : this.renderList()}
                </div>
            </div>
        );
    }
}

CheckboxList.propTypes = {
    /** 当前选中的值 */
    value: PropTypes.arrayOf(PropTypes.string),
    /** 所有的可选项 */
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired, // 选项的值
        label: PropTypes.string.isRequired, // 选项显示的名称
        disabled: PropTypes.bool,           // 是否禁用该选项
        py: PropTypes.string,               // 用于支持拼音检索
        parent: PropTypes.string,           // 显示为树结构时生效
        [PropTypes.any]: PropTypes.any,
    })),
    /** 宽度 */
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    /** 显示的模式，仅对样式有影响 */
    display: PropTypes.oneOf(['normal', 'stripped', 'table', 'tree', 'treeLeaf']),
    /** 是否显示搜索框 */
    showSearch: PropTypes.bool,
    /** 是否显示全选按钮 */
    showCheckAll: PropTypes.bool,
    /** 是否可折叠 */
    showCollapse: PropTypes.bool,
    /** 选项变化时的回调 */
    onChange: PropTypes.func,
};

CheckboxList.defaultProps = {
    value: [],
    options: [],
    width: '100%',
    display: 'normal',
    showSearch: true,
    showCheckAll: true,
    showCollapse: true,
    onChange() {},
};

export default CheckboxList;
