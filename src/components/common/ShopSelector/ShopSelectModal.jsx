import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin } from 'antd';
import { uniq, isEqual } from 'lodash';

import { fetchData } from '../../../helpers/util';
import FilterSelector from '../FilterSelector';
import { FILTERS } from './config';
import { loadShopSchema, mergeFilters } from './utils';

class ShopSelectModal extends Component {
    state = {
        loading: false,
        options: null,
        filters: mergeFilters(this.props.filters || FILTERS, FILTERS),
    }

    selected = this.props.defaultValue

    componentDidMount() {
        this.loadShops();
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.props.filters, nextProps.filters)) {
            this.setState({
                filters: mergeFilters(nextProps.filters, this.state.filters),
            });
        }
    }

    loadShops(params = {}, isForce = false) {
        if (!isForce && (this.props.options || this.state.options)) return Promise.resolve();
        this.setState({ loading: true });
        return loadShopSchema(params).then(({ shops, ...filterOptions }) => {
            this.setState({
                loading: false,
                options: shops,
                filters: this.state.filters.map(filter => ({
                    ...filter,
                    options: filterOptions[filter.name],
                })),
            });
        });
    }

    loadOrgs(params = {}) {
        const shops = this.props.options || this.state.options || [];
        const orgIDs = uniq(shops.reduce((ret, shop) => {
            const { parentOrgID } = shop;
            if (parentOrgID && parentOrgID !== '0') return ret.concat(parentOrgID);
            return ret;
        }, []));
        if (orgIDs.length === 0) return Promise.resolve();
        this.setState({ loading: true });
        return fetchData('getShopOrg', {
            orgIDs: orgIDs.join(','),
            returnParentOrg: '1',
            ...params,
        }).then((records = []) => {
            this.setState({
                loading: false,
                filters: this.state.filters.map((filter) => {
                    if (filter.name !== 'orgs') return filter;
                    return {
                        ...filter,
                        options: records.map(record => ({
                            ...record,
                            value: record.orgID,
                            label: record.orgName,
                            py: record.orgMnemonicCode,
                            parent: record.parentID,
                        })),
                    };
                }),
            });
        }).catch((err) => {
            this.setState({ loading: false });
            throw err;
        });
    }

    async loadShopTags(params = {}) {
        const shops = this.props.options || this.state.options || [];
        const shopTagIDs = uniq(shops.reduce((ret, { tagIDs }) => {
            if (!tagIDs) return ret;
            return ret.concat(tagIDs.split(','));
        }, []));
        if (shopTagIDs.length === 0) return;
        this.setState({ loading: true });
        try {
            const shopTagRecords = await fetchData('shopTagQuery', {
                itemIDs: shopTagIDs.join(','),
                ...params,
            }, null, { path: 'data.tagDetailList' });
            this.setState({
                loading: false,
                filters: this.state.filters.map((filter) => {
                    if (filter.name !== 'shopTags') return filter;
                    return {
                        ...filter,
                        options: shopTagRecords.map(record => ({
                            value: record.itemID,
                            label: record.tagName,
                            parent: record.parentID,
                        })),
                    };
                }),
            });
        } catch (error) {
            this.setState({ loading: false });
            throw error;
        }
    }

    loadOrgTags(params = {}) {
        const shops = this.props.options || this.state.options || [];
        const tagIDs = uniq(shops.reduce((ret, shop) => {
            const orgTagIDs = shop.orgTagIDs ? shop.orgTagIDs.split(',') : [];
            return ret.concat(orgTagIDs);
        }, []));
        if (tagIDs.length === 0) return Promise.resolve();
        this.setState({ loading: true });
        return fetchData('shopTagQuery', {
            itemIDs: tagIDs.join(','),
            ...params,
        }, null, {
            path: 'data.tagDetailList',
        }).then((records = []) => {
            this.setState({
                loading: false,
                filters: this.state.filters.map((filter) => {
                    if (filter.name !== 'orgTags') return filter;
                    return {
                        ...filter,
                        options: records.map(record => ({
                            value: record.itemID,
                            label: record.tagName,
                            parent: record.parentID,
                        })),
                    };
                }),
            });
        }).catch((err) => {
            this.setState({ loading: false });
            throw err;
        });
    }

    handleChange = (values) => {
        this.selected = values;
        this.props.onChange(values);
    }

    handleFilterKeyChange = (filterKey) => {
        const curFilter = this.state.filters.find(filter => filter.key === filterKey);
        if (!curFilter || curFilter.options) return Promise.resolve();
        switch (curFilter.name) {
            case 'orgs':
                return this.loadOrgs();
            case 'orgTags':
                return this.loadOrgTags();
            case 'shopTags':
                return this.loadShopTags();
            default:
                return this.loadShops({}, true);
        }
    }

    handleOk = () => {
        this.props.onOk(this.selected);
    }

    render() {
        const { defaultValue } = this.props;
        const { loading, filters } = this.state;

        const options = this.props.options || this.state.options || [];

        return (
            <Modal
                {...this.props}
                onOk={this.handleOk}
                maskClosable={false}
            >
                <Spin spinning={loading} delay={500}>
                    <FilterSelector
                        title="店铺"
                        options={options}
                        filters={filters}
                        defaultValue={defaultValue}
                        onChange={this.handleChange}
                        onFilterKeyChange={this.handleFilterKeyChange}
                    />
                </Spin>
            </Modal>
        );
    }
}

ShopSelectModal.defaultProps = {
    title: '选择店铺',
    width: 700,
    options: [],
    filters: [],
    defaultValue: [],
    onChange() {},
    onOk() {},
    onCancel() {},
};

ShopSelectModal.propTypes = {
    /** 模态框的标题 */
    title: PropTypes.string,
    /** 模态框宽度 */
    width: PropTypes.number,
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

export default ShopSelectModal;
