import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon,message } from 'antd';
import classnames from 'classnames';
import { isEqual } from 'lodash';

import EditableTags from '../common/EditableTags';
import ShopSelectModal from './ShopSelectModal';
import { FILTERS } from './config';
import { loadShopSchema } from './utils';


import './assets/ShopSelector.less';

class ShopSelectorTwo extends Component {
    state = {
        showModal: false,
        options: null,
        filters: null,
        alloptions: [],
        allfilters: [],
        isShopSelectorShow: '2'
    }

    componentDidMount() {
        this.loadShops().then((shops = []) => {
            const _shops = this.props.options || shops;
            this.props.defaultCheckAll && this.props.onChange(
                _shops.map(shop => shop.value)
            );
            this.loadFilterShops(this.props.brandList,this.props.canUseShops);
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isShopSelectorShow) {
            this.setState({
                isShopSelectorShow: nextProps.isShopSelectorShow
            })
        }
        if (!isEqual(this.props.filterShopIds, nextProps.filterShopIds)) {
            this.loadShops({}, nextProps.schemaData, true, nextProps.filterShopIds);
        }
        if (!isEqual(this.props.schemaData, nextProps.schemaData)) {
            this.loadShops({}, nextProps.schemaData, true);
        }
        if (!isEqual(this.props.brandList, nextProps.brandList) || !isEqual(this.props.canUseShops, nextProps.canUseShops)) {
            this.loadFilterShops(nextProps.brandList,nextProps.canUseShops);
        }
        // if (!isEqual(this.props.canUseShops, nextProps.canUseShops)) {
        //     this.loadShops3(nextProps.canUseShops,nextProps.brandList);
        // }
    }

    loadShops(params = {}, cache = this.props.schemaData, isForce = false, filterShopIds = []) {
        let { filterParm = {}, isCreateCoupon = false } = this.props;//isCreateCoupon是否创建券的时候
        if (!isForce && (this.props.options || this.state.options)) return Promise.resolve();
        params = { ...params, ...filterParm }
        return loadShopSchema(params, cache)
            .then(({ shops, ...filterOptions }) => {
                shops = shops.filter(shop => !filterShopIds.includes(shop.shopID));
                if (isCreateCoupon) {
                    shops = shops.filter(shop => shop.operationMode != '3');
                }
                this.setState({
                    loading: false,
                    options: shops,
                    alloptions: shops,
                    filters: FILTERS.map(filter => ({
                        ...filter,
                        options: filterOptions[filter.name],
                    })),
                    allfilters: FILTERS.map(filter => ({
                        ...filter,
                        options: filterOptions[filter.name],
                    })),
                });
                return shops;
            });
    }
    loadFilterShops(brandList = [],canUseShops = []) {
        const { alloptions,allfilters,options } = this.state;
        if (!allfilters[0]) { return }
        const newFilter = JSON.parse(JSON.stringify(allfilters));
        if (brandList && brandList.length > 0) { //如果有品牌
            const brands = allfilters[0];
            const leftBrands = brands.options.filter(x => brandList.includes(x.brandID));
            newFilter[0].options = leftBrands;
            const filterFirstOptions = alloptions.filter(x => brandList.includes(x.brandID));
            if(canUseShops && canUseShops.length > 0){//如果有卡类
                const filterTwoOptions = filterFirstOptions.filter((x) => {
                    if (canUseShops.includes(x.shopID)) {
                        return { ...x, disabled: false }
                    }
                });
                if(filterTwoOptions.length > 0){
                    this.setState({ options: filterTwoOptions,filters:newFilter });
                }else{
                    this.setState({
                        options:[],
                        filters:newFilter
                    })
                    message.warning('无适用的店铺')
                }
                return
            }else{//没有卡类
                if(filterFirstOptions && filterFirstOptions.length > 0){
                    this.setState({
                        options:filterFirstOptions,filters:newFilter
                    })
                }else{
                    this.setState({
                        options:[],filters:newFilter
                    })
                    message.warning('无适用的店铺')
                }
                return 
            }
        } else {//如果没有品牌
            if(canUseShops && canUseShops.length > 0){//如果有选择卡类
                const filterTwoOptions = alloptions.filter((x) => {
                    if (canUseShops.includes(x.shopID)) {
                        return { ...x, disabled: false }
                    }
                });
                if(filterTwoOptions.length > 0){
                    this.setState({ options: filterTwoOptions,filters:newFilter });
                }else{
                    this.setState({
                        options:[],filters:newFilter
                    })
                    message.warning('无适用的店铺')
                }
                return
            }else{//如果没有选择的卡类
                this.setState({
                    options:alloptions,filters:newFilter
                })
            }
        }
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
        const { eventWay } = this.props;
        this.props.onChange(values);

        this.setState({ showModal: false });

    }

    handleModalCancel = () => {
        this.setState({ showModal: false });
    }

    render() {
        const { value = [], onChange, size, placeholder, extendShopList, eventWay, disabled, ...otherProps, } = this.props;
        const { showModal } = this.state;
        let options = this.props.options || this.state.options || [];
        if (Array.isArray(extendShopList)) {
            options = [...extendShopList, ...options]
        }
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
                        disabled={disabled}
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
                        {...otherProps}
                        visible={true}
                        options={options}
                        filters={filters}
                        defaultValue={value}
                        onOk={this.handleModalOk}
                        onCancel={this.handleModalCancel}
                    />
                }

                <div style={{ color: 'orange', fontSize: '12' }}>
                    {eventWay && eventWay == '82' ? `不选默认全部店铺可用` : null}
                </div>
            </div>
        );
    }
}

ShopSelectorTwo.defaultProps = {
    // FIXME: set default value for a controled component will get antd form warning.
    // value: [],
    // onChange() {},
    size: 'default',
    placeholder: '点击选择店铺',
    defaultCheckAll: false,
};

ShopSelectorTwo.propTypes = {
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

export default ShopSelectorTwo;
