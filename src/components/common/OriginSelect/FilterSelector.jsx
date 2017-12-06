// props:{
//     options            // 全部组织
//     filters            // 上方的5个类别选项
//     defaultValue       // 默认选中的组织
//     onChange           // select change事件
//     onFilterKeyChange  // 5个选项change事件
// }
import React from 'react';
import PropTypes from 'prop-types';
import { Row } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import CheckboxList from './CheckBoxLists';
import SelectedList from './SelectedList';
import { filterOptions } from './_utils';

import styles from './assets/FilterSelector.less';

class FilterSelector extends React.Component {
    state = {
        filterKey: '', // 类别id
        filters: {},
        selected: [], // 默认选中的组织
        selectedData: this.props.defaultValue,
        filteredOptions: this.props.options, // 所有选项
    }
    componentWillMount() {
        const { defaultValue } = this.props
        const selected = defaultValue.map(val => val.orgID)
        this.setState({ selected })
    }
    componentDidMount() {
        const { filters } = this.props;
        if (filters.length > 0) {
            this.handleFilterKeyChange(filters[0].key);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.options, nextProps.options)) {
            const { defaultValue } = nextProps
            const selected = defaultValue.map(val => val.orgID)

            this.setState({
                selectedData: defaultValue,
                selected,
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
        const { options, extraFilters, filters: oriFilters } = this.props;
        const { filterKey, filters } = this.state;
        const nextFilters = { ...filters, [filterKey]: values };

        if (nextFilters.shopCategoryID && nextFilters.shopCategoryID.length) {
            const arr = []
            nextFilters.shopCategoryID.forEach((v) => {
                oriFilters[2].options.filter((params) => {
                    if (params.ID === v) {
                        arr.push(...params.records)
                    }
                })
            })
            this.setState({
                filters: nextFilters,
                filteredOptions: [...arr],
            });
        } else {
            this.setState({
                filters: nextFilters,
                filteredOptions: filterOptions(options, {
                    ...nextFilters,
                    ...extraFilters,
                }),
            });
        }
    }
    // values是最下面的table选中的shopids ['76026277','76026276']
    handleResultChange = (values) => {
        const { onChange, options } = this.props;
        const arr = options.filter((params) => {
            return values.indexOf(params.orgID) >= 0
        })
        onChange(values, arr);

        this.setState({
            selected: values,
            selectedData: arr,
        });
    }

    render() {
        const { title, className, options, isShop, filters: oriFilters } = this.props;
        const { filterKey, filters, selected, filteredOptions } = this.state;
        const curFilter = oriFilters.find(filter => filter.key === filterKey);

        // 获取选中类别的的optionsconnect上shopids
        const selectedFilters = oriFilters.reduce((ret, filter) => {
            const filterValues = filters[filter.key];
            if (filterValues && filterValues.length > 0) {
                return ret.concat(filter.options.filter(
                    option => filterValues.indexOf(option.ID) !== -1
                ));
            }
            return ret;
        }, []);
        const selectedItems = options.filter(
            option => selected.indexOf(option.orgID) !== -1
        );
        // 判断第一个checkboxxlist是否为门店组，为门店组
        // const firstCheckList

        return (
            <div className={classnames(styles.wrapper, className)}>
                {
                    !isShop &&
                    <div className={styles.filterKeyList}>
                        {oriFilters.map(({ key, label }) => (
                            <span
                                key={key}
                                className={classnames(styles.filterKey, {
                                    [styles.active]: key === filterKey,
                                })}
                                onClick={() => this.handleFilterKeyChange(key)}
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                }
                <p className={styles.selectedFilters}>
                    已选条件：{selectedFilters.length > 0
                        ? selectedFilters.map(filter => filter.Name).join(' / ')
                        : '尚未选择过滤条件'
                    }
                </p>
                <Row type="flex">
                    <div className={styles.filterList}>
                        <CheckboxList
                            width={200}
                            showCheckAll={false}
                            options={curFilter ? curFilter.options : []}
                            value={filters[filterKey] || []}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                    <div className={styles.resultList}>
                        <CheckboxList
                            display="table"
                            showCollapse={false}
                            options={filteredOptions}
                            value={selected}
                            onChange={this.handleResultChange}
                        />
                    </div>
                </Row>
                <SelectedList
                    title={title}
                    className={styles.selectedList}
                    items={selectedItems}
                    onChange={this.handleResultChange}
                />
            </div>
        );
    }
}

FilterSelector.defaultProps = {
    params: {}, // 接口参数
    urlFlag: '0', // 判断使用哪个接口
    title: '',
    className: '',
    options: [],
    filters: [],
    isShop: false, // 是否门店
    extraFilters: {},
    defaultValue: [],
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
    /** 已选项改变时的回调函数 */
    onChange: PropTypes.func,
    /** 改变当前过滤器时触发的回调函数 */
    onFilterKeyChange: PropTypes.func,
};

export default FilterSelector;
