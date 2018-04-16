import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import EditableTags from '../EditableTags';
import ShopSelectModal from './ShopSelectModal';
import { FILTERS } from './config';
import { loadShopSchema } from './utils';

import './assets/ShopSelector.less';

class ShopSelector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            options: props.schemaData && props.schemaData.options,
            filters: props.schemaData && props.schemaData.filters,
        }
    }

    componentDidMount() {
        this.loadShops().then((shops = []) => {
            const _shops = this.props.options || shops;
            this.props.defaultCheckAll && this.props.onChange(
                _shops.map(shop => shop.value)
            );
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.schemaData, nextProps.schemaData)) {
            this.loadShops({}, nextProps.schemaData, true);
        }
    }

    loadShops(params = {}, cache = this.props.schemaData, isForce = false) {
        if (!cache) {
            console.log('woshi zhende fu!');
            return Promise.resolve();
        }
        // if (!isForce && (this.props.options || this.state.options)) return Promise.resolve();
        return loadShopSchema(params, cache)
            .then(({ shops, ...filterOptions }) => {
                this.setState({
                    loading: false,
                    options: shops,
                    filters: FILTERS.map(filter => ({
                        ...filter,
                        options: filterOptions[filter.name],
                    })),
                });
                return shops;
            });
    }

    handleAdd = () => {
        this.setState({ showModal: true });
    }

    handleClose = (tarID) => {
        const { value } = this.props;
        const nextValue = value.filter(id => id !== tarID);
        this.props.onChange(nextValue);
    }

    handleModalOk = (values) => {
        this.setState({ showModal: false });
        this.props.onChange(values);
    }

    handleModalCancel = () => {
        this.setState({ showModal: false });
    }

    render() {
        const { value = [], onChange, size, placeholder, ...otherProps } = this.props;
        const { showModal } = this.state;
        const options = this.props.options || this.state.options || [];
        const filters = this.props.filters || this.state.filters;
        const items = value.reduce((ret, shopID) => {
            const shopInfo = options.find(shop => shop.value === shopID);
            if (!shopInfo) return ret;
            return ret.concat({ value: shopInfo.value, label: shopInfo.shopName });
        }, []);

        return (
            <div className="hll-shop-selector">
                {size === 'default' &&
                    <EditableTags
                        title="店铺"
                        placeholder={placeholder}
                        items={items}
                        onAdd={this.handleAdd}
                        onClose={this.handleClose}
                    />
                }
                {size === 'small' &&
                    <div
                        className={classnames('smallBox', {
                            empty: items.length === 0,
                        })}
                        role="presentation"
                        onClick={this.handleAdd}
                    >
                        {items.length === 0 && placeholder}
                        {items.length === 1 && items[0].label}
                        {items.length > 1 && `已选择 ${items.length} 项`}
                        <Icon type="plus-circle-o" />
                    </div>
                }
                {showModal &&
                    <ShopSelectModal
                        // {...otherProps}
                        visible={true}
                        options={options}
                        filters={filters}
                        defaultValue={value}
                        onOk={this.handleModalOk}
                        onCancel={this.handleModalCancel}
                    />
                }
            </div>
        );
    }
}

ShopSelector.defaultProps = {
    // FIXME: set default value for a controled component will get antd form warning.
    // value: [],
    // onChange() {},
    size: 'default',
    placeholder: '点击选择店铺',
    defaultCheckAll: false,
};

ShopSelector.propTypes = {
    /** 当前选择的项 */
    value: PropTypes.arrayOf(PropTypes.string),
    /** 选项改变时的回调 */
    onChange: PropTypes.func,
    /** 是否默认全选 */
    defaultCheckAll: PropTypes.bool,
    /** 组件显示大小 */
    size: PropTypes.string,
    /** 组件默认显示的文字 */
    placeholder: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element,
    ]),
};

export default ShopSelector;
