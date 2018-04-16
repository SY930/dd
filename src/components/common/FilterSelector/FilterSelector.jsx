import React from 'react';
import PropTypes from 'prop-types';
import { Row, Icon } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import CheckboxList from '../CheckboxList';
import SelectedList from './SelectedList';
import { filterOptions } from './_utils';

import './assets/FilterSelector.less';

class FilterSelector extends React.Component {
    state = {
        filterKey: '',
        filters: {},
        selected: this.props.defaultValue,
        filteredOptions: filterOptions(this.props.options, this.props.extraFilters),
    }

    componentDidMount() {
        const { filters } = this.props;
        if (filters.length > 0) {
            this.handleFilterKeyChange(filters[0].key);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.options, nextProps.options) ||
            !isEqual(this.props.extraFilters, nextProps.extraFilters)
        ) {
            this.setState({
                filteredOptions: filterOptions(nextProps.options, nextProps.extraFilters),
            });
        }
    }

    handleFilterKeyChange = (filterKey) => {
        const { onFilterKeyChange } = this.props;
        Promise.resolve(onFilterKeyChange(filterKey)).then(
            () => this.setState({ filterKey })
        );
    }

    handleFilterChange = (values) => {
        const { options, extraFilters } = this.props;
        const { filterKey, filters } = this.state;
        const nextFilters = { ...filters, [filterKey]: values };
        this.setState({
            filters: nextFilters,
            filteredOptions: filterOptions(options, {
                ...nextFilters,
                ...extraFilters,
            }),
        });
    }

    handleFilterClear = () => {
        const { options, extraFilters } = this.props;
        this.setState({
            filters: {},
            filteredOptions: filterOptions(options, extraFilters),
        });
    }

    handleResultChange = (values) => {
        const { onChange } = this.props;
        onChange(values);
        this.setState({
            selected: values,
        });
    }

    render() {
        const {
            title, className, options, filters: oriFilters, tableColumns,
        } = this.props;
        const { filterKey, filters, selected, filteredOptions } = this.state;

        const resultDisplay = tableColumns.length ? 'table' : 'stripped';
        const curFilter = oriFilters.find(filter => filter.key === filterKey) || {};
        const selectedFilters = oriFilters.reduce((ret, filter) => {
            const filterValues = filters[filter.key];
            if (filterValues && filterValues.length > 0) {
                return ret.concat(filter.options.filter(
                    option => filterValues.indexOf(option.value) !== -1
                ));
            }
            return ret;
        }, []);
        const selectedItems = options.filter(
            option => selected.indexOf(option.value) !== -1
        );

        return (
            <div className={classnames('hll-filter-selector', className)}>
                <div className="filterKeyList">
                    {oriFilters.map(({ key, label }) => (
                        <span
                            key={key}
                            className={classnames('filterKey', {
                                active: key === filterKey,
                            })}
                            role="button"
                            tabIndex="0"
                            onClick={() => this.handleFilterKeyChange(key)}
                        >
                            {label}
                        </span>
                    ))}
                </div>
                <p className="selectedFilters">
                    {selectedFilters.length > 0 ? (
                        <span>
                            已选条件：
                            {selectedFilters.map(filter => filter.label).join(' / ')}
                            <Icon
                                type="close-circle"
                                title="清空所有条件"
                                className="clearBtn"
                                onClick={this.handleFilterClear}
                            />
                        </span>
                    ) : '已选条件：尚未选择过滤条件'}
                </p>
                <Row type="flex">
                    <div className="filterList">
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            display={curFilter.display}
                            options={curFilter.options}
                            value={filters[filterKey] || []}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                    <div className="resultList">
                        <CheckboxList
                            display={resultDisplay}
                            showCollapse={false}
                            options={filteredOptions}
                            value={selected}
                            tableColumns={tableColumns}
                            onChange={this.handleResultChange}
                        />
                    </div>
                </Row>
                <SelectedList
                    title={title}
                    className="selectedList"
                    display={resultDisplay}
                    items={selectedItems}
                    tableColumns={tableColumns}
                    onChange={this.handleResultChange}
                />
            </div>
        );
    }
}

FilterSelector.defaultProps = {
    title: '',
    className: '',
    options: [],
    filters: [],
    extraFilters: {},
    defaultValue: [],
    tableColumns: [],
    onChange() {},
    onFilterKeyChange() {},
};

FilterSelector.propTypes = {
    /** 选择项目的名称 */
    title: PropTypes.string,
    /** 样式类 */
    className: PropTypes.string,
    /** 所有的可选项 */
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string, // 选项值
        label: PropTypes.string, // 选项名称
        [PropTypes.string]: PropTypes.string,
    })),
    /** 所有的过滤器 */
    filters: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string, // 过滤器的字段名称
        label: PropTypes.string, // 过滤器的名称
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string,
            [PropTypes.string]: PropTypes.string,
        })),
    })),
    /** 追加的过滤器 */
    extraFilters: PropTypes.shape({
        [PropTypes.string]: PropTypes.any,
    }),
    /** 默认值 */
    defaultValue: PropTypes.arrayOf(PropTypes.string),
    /** 显示类型为 table 时表格列配置 */
    tableColumns: PropTypes.arrayOf(PropTypes.any),
    /** 已选项改变时的回调函数 */
    onChange: PropTypes.func,
    /** 改变当前过滤器时触发的回调函数 */
    onFilterKeyChange: PropTypes.func,
};

export default FilterSelector;
