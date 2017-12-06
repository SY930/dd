// props:{
//     options            // 全部组织
//     filters            // 上方的5个类别选项
//     defaultValue       // 默认选中的组织
//     onChange           // select change事件
//     onFilterKeyChange  // 5个选项change事件
// }
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Icon, Input } from 'antd';
import classnames from 'classnames';
import _ from 'lodash';

import CheckboxList from './CheckBoxLists';
import SelectedList from './SelectedList';
import { pyMatch } from '../../../helpers/util';
import { filterOptions } from './_utils';

import styles from './assets/FilterSelector.less';

class FilterSelector extends React.Component {
    state = {
        filterKey: '', // 类别id
        filters: {},
        selected: [], // 默认选中的组织
        selectedData: this.props.defaultValue,
        filteredOptions: this.props.options, // 所有选项
        leftSelected: [],
        keyword: '',
    }
    componentWillMount() {
        const { defaultValue } = this.props
        const selected = defaultValue.map(val => val.supplierID)
        this.setState({ selected })
    }
    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (!_.isEqual(this.props.options, nextProps.options)) {
            const { defaultValue } = nextProps
            const selected = defaultValue.map(val => val.supplierID)

            this.setState({
                selectedData: defaultValue,
                selected,
                filteredOptions: filterOptions(nextProps.options, nextProps.extraFilters),
            });
        }
    }

    handleFilterChange = (values) => {
        const { options, extraFilters, filters: oriFilters } = this.props;
        const { filterKey, filters } = this.state;
        const nextFilters = { ...filters, [filterKey]: values };
        // if (nextFilters.shopCategoryID && nextFilters.shopCategoryID.length) {
        //     const arr = []
        //     nextFilters.shopCategoryID.forEach((v) => {
        //         oriFilters[2].options.filter((params) => {
        //             if (params.ID === v) {
        //                 arr.push(...params.records)
        //             }
        //         })
        //     })
        //     this.setState({
        //         filters: nextFilters,
        //         filteredOptions: [...arr],
        //     });
        // } else {
        //     this.setState({
        //         filters: nextFilters,
        //         filteredOptions: filterOptions(options, {
        //             ...nextFilters,
        //             ...extraFilters,
        //         }),
        //     });
        // }
        if (values.indexOf('all') >= 0 || !values.length) {
            this.setState({ filteredOptions: options, leftSelected: values })
        } else {
            const filterArr = []
            values.forEach((v) => {
                const arr = options.filter((optval) => {
                    return (optval.supplierType === v) || (optval.suppliercID === v)
                })
                filterArr.push(...arr)
            })
            this.setState({ filteredOptions: filterArr, leftSelected: values })
        }
    }
    // values是最下面的table选中的shopids ['76026277','76026276']
    handleResultChange = (values) => {
        const { onChange, options } = this.props;
        const arr = options.filter((params) => {
            return values.indexOf(params.supplierID) >= 0
        })
        onChange(values, arr);

        this.setState({
            selected: values,
            selectedData: arr,
        });
    }
    // 上方检索，检索中文与拼音即py
    filterOptions(options, keyword) {
        return options.filter(
            option => pyMatch({ name: option.supplierName + option.supplierCode, py: option.supplierMnemonicCode }, keyword)
        );
    }
    handleSearch = (evt) => {
        const keyword = evt.target.value;
        const { options } = this.props;
        this.setState({
            keyword,
            filteredOptions: this.filterOptions(options, keyword),
        });
    }
    render() {
        const { title, className, options, filters: oriFilters, leftOptions } = this.props;
        const { filterKey, filters, selected, filteredOptions, leftSelected } = this.state;
        // const curFilter = oriFilters.find(filter => filter.key === filterKey);
        // // 获取选中类别的的optionsconnect上shopids
        // const selectedFilters = oriFilters.reduce((ret, filter) => {
        //     const filterValues = filters[filter.key];
        //     if (filterValues && filterValues.length > 0) {
        //         return ret.concat(filter.options.filter(
        //             option => filterValues.indexOf(option.ID) !== -1
        //         ));
        //     }
        //     return ret;
        // }, []);
        const selectedItems = options.filter(
            option => selected.indexOf(option.supplierID) !== -1
        );
        // 判断第一个checkboxxlist是否为门店组，为门店组
        // const firstCheckList

        return (
            <div className={classnames(styles.wrapper, className)}>
                <Row gutter={16} style={{ marginBottom: '15px' }}>
                    <Col span={24}>
                        <Input
                            placeholder="按名称编码搜索供应商"
                            prefix={<Icon type="search" />}
                            onChange={this.handleSearch}
                        />
                    </Col>
                </Row>

                <Row type="flex">
                    <div className={styles.filterList}>
                        <CheckboxList
                            width={200}
                            showCollapse={false}
                            showCheckAll={false}
                            showSearch={false}
                            options={leftOptions}
                            value={leftSelected}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                    <div className={styles.resultList}>
                        <CheckboxList
                            display="table"
                            showCollapse={false}
                            showSearch={false}
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
    onChange() { },
    onFilterKeyChange() { },
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
