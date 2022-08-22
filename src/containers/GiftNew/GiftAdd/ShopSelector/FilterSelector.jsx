
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Icon, Input, Button, message } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import CheckboxList from '../../../../components/common/CheckboxList';
import SelectedList from './SelectedList';
// import { filterOptions } from './_utils';

import style from './assets/FilterSelector.less';
import { isProfessionalTheme, filterByGroupID } from './utils'

class FilterSelector extends React.Component {
    state = {
        leftOptions: this.props.filters || [],
        filtersKey: [],
        options: this.props.options || [],
        selected: this.props.defaultValue || [],
    }

    componentDidMount() {
    }

    handleFilterChange = (value) => {
        const { options: propsOptions } = this.props;
        this.setState({
            filtersKey: value,
            options: filterByGroupID(propsOptions, value),
        })
    }


    handleResultChange = (values) => {
        const { onChange } = this.props;
        onChange(values);
        this.setState({
            selected: values,
        });
    }

    handleFilterClear = () => {
        // filtersKey: []
        const { options: propsOptions } = this.props;
        this.setState({
            filtersKey: [],
            options: propsOptions,
        })
    }

    render() {
        const {
            title, className, tableColumns, options: propsOptions,
        } = this.props;
        const { selected = [], leftOptions = [], filtersKey, options = [] } = this.state;

        const resultDisplay = tableColumns.length ? 'table' : 'stripped';
        // const curFilter = oriFilters || {};
        const selectedItems = propsOptions.filter(
            option => selected.indexOf(option.value) !== -1
        );

        const selectedFilters = leftOptions.filter(item => filtersKey.includes(item.value))

        return (
            <div className={classnames(isProfessionalTheme() ? style.hllFilterSelectorPro : style.hllFilterSelector, className)}>
                <p className={style.selectedFilters}>
                    {selectedFilters.length > 0 ? (
                        <span>
                            已选条件：
                            {selectedFilters.map(filter => filter.label).join(' / ')}
                            <Icon
                                type="close-circle"
                                title="清空所有条件"
                                className={style.clearBtn}
                                onClick={this.handleFilterClear}
                            />
                        </span>
                    ) : '已选条件：尚未选择过滤条件'}
                </p>
                <Row type="flex">
                    <div className={style.filterList}>
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            options={leftOptions}
                            value={filtersKey || []}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                    <div className={style.resultList}>
                        <CheckboxList
                            display={resultDisplay}
                            showCollapse={false}
                            options={options}
                            value={selected}
                            tableColumns={tableColumns}
                            onChange={this.handleResultChange}
                        />
                    </div>
                </Row>
                <SelectedList
                    title={title}
                    className={style.selectedList}
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

