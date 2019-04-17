import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin, Checkbox } from 'antd';
import classnames from 'classnames';

import { fetchData } from '../../../helpers/util';
import FilterSelector from '../FilterSelector';
import { FILTERS } from './config';

import styles from './assets/FoodSelectModal.less';

class FoodSelectModal extends Component {
    state = {
        loading: false,
        options: null,
        filters: FILTERS,
        showImported: false,
    }

    selected = this.props.defaultValue

    componentDidMount() {
        this.loadFoods();
    }

    loadFoods(params = {}) {
        if (this.props.options || this.state.options) return Promise.resolve();
        this.setState({ loading: true });
        return fetchData('getGroupFoodQuery', {
            bookID: 0,
            ...params,
        }).then((records = []) => {
            this.setState({
                loading: false,
                options: records.map(food => ({
                    // 把所有的键值转成字符串类型
                    ...Object.keys(food).reduce((ret, key) => ({
                        ...ret,
                        [key]: `${food[key]}`,
                    }), {}),
                    value: `${food.foodID}`,
                    label: `${food.foodName}`,
                    py: `${food.foodMnemonicCode}`,
                })),
            });
        });
    }

    loadFilterOptions(filterKey) {
        const {
            options, valueKey, labelKey, pyKey, callserver, callparams, path,
        } = (this.props.filters || this.state.filters).find(
            filter => filter.key === filterKey
        );
        if (options) return Promise.resolve();
        this.setState({ loading: true });
        return fetchData(callserver, callparams, null, {
            path,
        }).then((records = []) => {
            this.setState({
                loading: false,
                filters: this.state.filters.map((filter) => {
                    if (filter.key !== filterKey) return filter;
                    return {
                        ...filter,
                        options: records.map(record => ({
                            ...record,
                            value: `${record[valueKey]}`,
                            label: `${record[labelKey]}`,
                            py: `${record[pyKey] || ''}`,
                        })),
                    };
                }),
            });
        });
    }

    handleFilterKeyChange = (filterKey) => {
        return this.loadFilterOptions(filterKey);
    }

    handleShowImportedChange = (evt) => {
        this.setState({
            showImported: !evt.target.checked,
        });
    }

    handleChange = (values) => {
        this.selected = values;
        this.props.onChange(values);
    }

    handleOk = () => {
        this.props.onOk(this.selected);
    }

    render() {
        const { defaultValue, showImportedFilter } = this.props;
        const { loading, showImported } = this.state;

        const options = this.props.options || this.state.options || [];
        const filters = this.props.filters
            ? this.props.filters.map(filter => ({
                ...this.state.filters.find(item => item.name === filter.name),
                ...filter,
            }))
            : this.state.filters;
        const extraFilters = showImportedFilter && !showImported ? { isImported: '0' } : {};

        return (
            <Modal
                {...this.props}
                onOk={this.handleOk}
                maskClosable={false}
            >
                <Spin spinning={loading} delay={500}>
                    <FilterSelector
                        title="菜品"
                        className={classnames({
                            [styles.filterSelector]: showImportedFilter,
                        })}
                        options={options}
                        filters={filters}
                        extraFilters={extraFilters}
                        defaultValue={defaultValue}
                        onChange={this.handleChange}
                        onFilterKeyChange={this.handleFilterKeyChange}
                    />
                    <div className={styles.showImported}>
                        <Checkbox
                            checked={!showImported}
                            onChange={this.handleShowImportedChange}
                        >
                            不显示导入过的菜品
                        </Checkbox>
                    </div>
                </Spin>
            </Modal>
        );
    }
}

FoodSelectModal.defaultProps = {
    title: '选择菜品',
    width: 700,
    showImportedFilter: true,
    options: null,
    filters: null,
    defaultValue: [],
    onChange() {},
    onOk() {},
    onCancel() {},
};

FoodSelectModal.propTypes = {
    /** 模态框的标题 */
    title: PropTypes.string,
    /** 模态框宽度 */
    width: PropTypes.number,
    /** 是否显示已导入菜品过滤器 */
    showImportedFilter: PropTypes.bool,
    /** 可选择的所有项 */
    options: PropTypes.arrayOf(PropTypes.any),
    /** 过滤器 */
    filters: PropTypes.arrayOf(PropTypes.any),
    /** 已选择的选项 */
    defaultValue: PropTypes.arrayOf(PropTypes.string),
    /** 已选择的项发生改变时的回调函数 */
    onChange: PropTypes.func,
    /** 点击模态框确定按钮时的回调函数 */
    onOk: PropTypes.func,
    /** 点击模态框取消按钮时的回调函数 */
    onCancel: PropTypes.func,
};

export default FoodSelectModal;
