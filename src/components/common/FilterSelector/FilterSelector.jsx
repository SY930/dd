
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Icon, Input, Button, message } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import CheckboxList from '../CheckboxList';
import SelectedList from './SelectedList';
import { filterOptions } from './_utils';

import style from './assets/FilterSelector.less';
import { isProfessionalTheme } from '../../../helpers/util'

class FilterSelector extends React.Component {
    state = {
        filterKey: '',
        filters: {},
        selected: this.props.defaultValue,
        filteredOptions: filterOptions(this.props.options, this.props.extraFilters),
        fastAddVisible: false,
        inputText:''
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
        const { options, extraFilters,isPromotion} = this.props;
        const { filterKey, filters } = this.state;
        let nextFilters = {};
        if(isPromotion){
            nextFilters = { [filterKey]: values };
        }else{
            nextFilters = { ...filters,[filterKey]: values };
        }
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

    checkDisabled = () =>{
        
        let flag = false
        let inputText = this.state.inputText
        let inputTextArr = inputText.split(',')
        inputTextArr = inputTextArr.filter(i=>i!='')
        if(!this.state.inputText || inputTextArr.length == 0){
            flag = true
        }
       return flag
    }

    checkAll = () => {

        let inputText = this.state.inputText
        let options = this.props.options
        let inputTextArr = inputText.split(',')
        inputTextArr = inputTextArr.filter(i=>i!='')

        let selected = []

        inputTextArr.map((i) => {
            let flag = false
            options.map((j) => {
                if (i.trim() == j.shopID) {
                    flag = true
                }
            })

            if (!flag) {
                selected.push(i.trim())
            }
        })

        return selected
    }

    add = () => {
        let inputText = this.state.inputText
        let options = this.props.options

        let selected = this.state.selected

        let inputTextArr = inputText.split(',')

        let checkArr = this.checkAll()

        if (checkArr.length > 0) {
            message.warning(`未找到正确的店铺{ ${checkArr} }`)
            return
        }

        options.map((i) => {
            inputTextArr.map((j) => {
                if (i.shopID == j) {
                    if (selected.indexOf(j) == -1) {
                        selected.push(j)
                    }
                }
            })
        })

        this.setState({ selected, fastAddVisible: !this.state.fastAddVisible })

    }

    render() {
        const {
            title, className, options, filters: oriFilters, tableColumns, isShowBatchImport,
        } = this.props;
        let { filterKey, filters, selected, filteredOptions } = this.state;
        // filteredOptions = filteredOptions.filter(item => item.status == 1)

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
            <div className={classnames(isProfessionalTheme() ? style.hllFilterSelectorPro : style.hllFilterSelector, className)}>
                <div className={style.filterKeyList}>
                    {oriFilters.map(({ key, label }) => (
                        <span
                            key={key}
                            className={classnames(style.filterKey, {
                                [style.active]: key === filterKey,
                            })}
                            role="button"
                            tabIndex="0"
                            onClick={() => this.handleFilterKeyChange(key)}
                        >
                            {label}
                        </span>
                    ))}
                </div>
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
                            display={curFilter.display}
                            options={curFilter.options}
                            value={filters[filterKey] || []}
                            onChange={this.handleFilterChange}
                        />
                    </div>
                    <div className={style.resultList}>
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
                <Row>
                    {
                        isShowBatchImport && <div style={{ float: 'right', marginTop: 10 }}>
                        <a onClick={() => {
                            this.setState({ fastAddVisible: !this.state.fastAddVisible })
                        }}>批量录入</a>
                    </div>
                    }
                </Row>
                {this.state.fastAddVisible && <Row>
                    <Input
                        type="textarea"
                        placeholder="在此录入门店ID，多个门店ID以“,”分隔"
                        onChange={(e) => {
                            this.setState({ inputText: e.target.value })
                        }}
                    />
                </Row>}
                {this.state.fastAddVisible && <Row>
                    <Button type="primary" style={{ float: 'right', marginTop: 10 }} disabled={this.checkDisabled()} onClick={this.add}>添加</Button>
                </Row>}
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
    isShowBatchImport: true,
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
    isShowBatchImport: PropTypes.bool,
};

export default FilterSelector;

