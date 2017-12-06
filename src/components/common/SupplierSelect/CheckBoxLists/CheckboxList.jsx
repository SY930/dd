import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Input, Icon } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';
import LazyLoad, { forceCheck } from 'react-lazyload';

import { pyMatch } from '../../../../helpers/util';
import styles from './styles.less'

const Search = Input.Search;
class CheckboxList extends Component {
    state = {
        collapsed: false,
        keyword: '',
        filteredOptions: this.props.options,
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.options, nextProps.options)) {
            this.setState({
                keyword: '',
                filteredOptions: nextProps.options,
            }, forceCheck);
        }
    }
    // 上方检索，检索中文与拼音即py
    filterOptions(options, keyword) {
        return options.filter(
            option => pyMatch({ name: option.supplierName + option.supplierCode, py: option.orgMnemonicCode }, keyword)
        );
    }

    handleCheckAll = (evt) => {
        const { filteredOptions } = this.state;
        // 所有选中的ID
        const checkedItems = this.props.value.filter(
            value => !filteredOptions.find(opt => opt.supplierID === value)
        ).concat(
            evt.target.checked ? filteredOptions.map(opt => opt.supplierID) : []
        );
        this.props.onChange && this.props.onChange(checkedItems);
    }

    handleSearch = (evt) => {
        const keyword = evt.target.value;
        const { options } = this.props;
        this.setState({
            keyword,
            filteredOptions: this.filterOptions(options, keyword),
        });
    }

    handleCollapse = () => {
        this.setState({ collapsed: !this.state.collapsed });
    }

    handleCheck = (isChecked, optValue) => {
        let checkedItems = this.props.value;
        if (isChecked) checkedItems = checkedItems.concat(optValue);
        else checkedItems = checkedItems.filter(item => item !== optValue);
        this.props.onChange && this.props.onChange(checkedItems);
    }

    render() {
        const {
            value, showSearch, showCheckAll, showCollapse, width, display,
        } = this.props;
        const { keyword, collapsed, filteredOptions } = this.state;

        const _showSearch = collapsed ? false : showSearch;
        const _showCheckAll = collapsed ? false : showCheckAll;
        const isAllChecked = filteredOptions.length > 0 &&
            !filteredOptions.find(opt => value.indexOf(opt.supplierID) === -1);

        const wrapperClz = classnames(styles.wrapper, {
            [styles.collapsed]: collapsed,
            [styles.table]: display === 'table',
        });
        const headerClz = classnames(styles.header, {
            [styles.showCheckAll]: _showCheckAll,
            [styles.showCollapse]: showCollapse,
        });
        return (
            <div className={wrapperClz} style={collapsed ? {} : { width }}>
                <div className={'headerClz'}>
                    {_showCheckAll &&
                        <Checkbox
                            style={{ marginLeft: '8px' }}
                            checked={isAllChecked}
                            onChange={this.handleCheckAll}
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
                {collapsed ? (
                    <div className={styles.content}>
                        {Array.from('查看内容请向右展开').map(
                            (ch, idx) => <p key={idx}>{ch}</p>
                        )}
                    </div>
                ) : (
                    <ul className={styles.content}>
                        {filteredOptions.map(opt => (
                            <LazyLoad
                                key={opt.supplierID || opt.suppliercID}
                                height={28}
                                overflow={true}
                                offset={[1560, 1560]}
                            >
                                <li className={styles.item}>
                                    <Checkbox
                                        checked={value.indexOf((opt.supplierID || opt.suppliercID)) > -1}
                                        disabled={opt.disabled}
                                        onChange={evt => this.handleCheck(evt.target.checked, opt.supplierID || opt.suppliercID)}
                                    >{opt.supplierName || opt.categoryName}</Checkbox>
                                </li>
                            </LazyLoad>
                        ))}
                    </ul>
                )}
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
        disabled: PropTypes.bool, // 是否禁用该选项
        py: PropTypes.string, // 用于支持拼音检索
        [PropTypes.any]: PropTypes.any,
    })),
    /** 宽度 */
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    /** 显示的模式，仅对样式有影响 */
    display: PropTypes.oneOf(['normal', 'table']),
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
