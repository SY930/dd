import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin, message } from 'antd';
import { uniq, isEqual, result } from 'lodash';

import { axios, genQueryString, HTTP_CONTENT_TYPE_WWWFORM } from '@hualala/platform-base';
import FilterSelector from '../common/FilterSelector';
import { FILTERS } from './config';
import { loadShopSchema, mergeFilters } from './utils';

class ShopSelectModal extends Component {
    state = {
        loading: false,
        options: null,
        filters: mergeFilters(this.props.filters || FILTERS, FILTERS),
    }

    selected = this.props.defaultValue
    groupName = null;
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
                filters: FILTERS.map(filter => ({
                    ...filter,
                    options: filterOptions[filter.name],
                })),
            });
        });
    }

    async loadOrgs(params = {}) {
        const shops = this.props.options || this.state.options || [];
        const orgIDs = uniq(shops.reduce((ret, shop) => {
            const { parentOrgID } = shop;
            if (parentOrgID && parentOrgID !== '0') return ret.concat(parentOrgID);
            return ret;
        }, []));
        if (orgIDs.length === 0) return Promise.resolve();
        this.setState({ loading: true });
        try {
            const res = await axios.post('/api/shopcenter/org/selectOrgs', genQueryString({
                orgIDs: orgIDs.join(','),
                returnParentOrg: '1',
                ...params,
            }), {
                headers: { 'Content-Type': HTTP_CONTENT_TYPE_WWWFORM },
            });
            if (res.code !== '000') throw new Error(res.message);
            const records = result(res, 'data.records', []);
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
            return records;
        } catch (error) {
            this.setState({ loading: false });
            throw error;
        }
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
            const res = await axios.post('/api/shop/shopTagQuery', genQueryString({
                itemIDs: shopTagIDs.join(','),
                ...params,
            }), {
                headers: { 'Content-Type': HTTP_CONTENT_TYPE_WWWFORM },
            });
            if (res.code !== '000') throw new Error(res.message);
            const shopTagRecords = result(res, 'data.tagDetailList', []);
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

    async loadOrgTags(params = {}) {
        const shops = this.props.options || this.state.options || [];
        const tagIDs = uniq(shops.reduce((ret, shop) => {
            const orgTagIDs = shop.orgTagIDs ? shop.orgTagIDs.split(',') : [];
            return ret.concat(orgTagIDs);
        }, []));
        if (tagIDs.length === 0) return Promise.resolve();
        this.setState({ loading: true });
        try {
            const res = await axios.post('/api/shop/shopTagQuery', genQueryString({
                itemIDs: tagIDs.join(','),
                ...params,
            }), {
                headers: { 'Content-Type': HTTP_CONTENT_TYPE_WWWFORM },
            });
            if (res.code !== '000') throw new Error(res.message);
            const records = result(res, 'data.tagDetailList', []);
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
            return records;
        } catch (error) {
            this.setState({ loading: false });
            throw error;
        }
    }
    async addShopCategory(params = {}) {
        this.setState({ loading: true });
        try {
            const res = await axios.post('/api/shopapi/addShopCategory', genQueryString(params), {
                headers: { 'Content-Type': HTTP_CONTENT_TYPE_WWWFORM },
            });
            if (res.code !== '000') throw new Error(res.message);
            this.setState({
                loading: false,
            });
            return res
        } catch (error) {
            message.error(error.message)
            this.setState({ loading: false });
            throw error;
        }
    }
    onOKHandleAddGroup = () => {
        if (this.groupName && this.selected && this.selected.length) {
            const addCategoryParams = {
                rule: {},
                imagePath: '',
                description: '',
                shopCategoryName: this.groupName,
                shopIDs: this.selected.join(','),
            }
            this.addShopCategory(addCategoryParams).then(() => {
                message.success('创建店铺分组成功！')
            });
        }
    }
    handleGroupNameChange = (value = {}) => {
        if (value) {
            this.groupName = value
        }
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
        this.onOKHandleAddGroup();
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
                        doGroup={true}
                        options={options}
                        filters={filters}
                        defaultValue={defaultValue}
                        onChange={this.handleChange}
                        onFilterKeyChange={this.handleFilterKeyChange}
                        onGroupNameChange={this.handleGroupNameChange}

                    />
                </Spin>
            </Modal>
        );
    }
}

// ShopSelectModal.defaultProps = {
//     options: [],
//     filters: [],
//     defaultValue: [],
//     onChange() {},
//     onOk() {},
// };
ShopSelectModal.defaultProps = {
    title: '选择店铺',
    width: 700,
    options: [],
    filters: [],
    defaultValue: [],
    onChange() { },
    onOk() { },
    onCancel() { },
};

ShopSelectModal.propTypes = {
    // /** 模态框的标题 */
    title: PropTypes.string,
    // /** 模态框宽度 */
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
    // /** 点击模态框取消按钮时的回调函数 */
    onCancel: PropTypes.func,
};

export default ShopSelectModal;
