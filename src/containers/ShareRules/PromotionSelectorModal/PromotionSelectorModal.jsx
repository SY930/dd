import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin, message } from 'antd';
import { uniq, isEqual, result } from 'lodash';
import { FILTERS,MEMBERSHIP_RIGHT,HLL_COUPON,BASIC_PROMOTION_MAP } from "./config";
import { axios, genQueryString, HTTP_CONTENT_TYPE_WWWFORM } from '@hualala/platform-base';
import FilterSelector from '../../../components/common/FilterSelector';
import { loadShopSchema, mergeFilters } from './utils';

const AVAILABLE_PROMOTIONS = Object.keys(BASIC_PROMOTION_MAP);

class PromotionSelectorModal extends Component {
    state = {
        loading: false,
        options: null,
        filters: FILTERS,
    }

    selected = this.props.defaultValue
    groupName = null;
    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {
        
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
        
    }

    handleOk = () => {
        this.props.onOk(this.selected);
    }

    render() {
        const { defaultValue, extendShopList } = this.props;
        const { loading, filters } = this.state;
        console.log(filters,'filters00000000000')

        const options = this.props.options || this.state.options || [];
        console.log(options,'options------------')
        return (
            <Modal
                {...this.props}
                onOk={this.handleOk}
                maskClosable={false}
            >
                <Spin spinning={loading} delay={500}>
                    <FilterSelector
                        title="活动"
                        doGroup={true}
                        options={options}
                        filters={filters}
                        isPromotion={true}
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
PromotionSelectorModal.defaultProps = {
    title: '选择活动',
    width: 700,
    options: [],
    filters: [],
    defaultValue: [],
    onChange() { },
    onOk() { },
    onCancel() { },
};

PromotionSelectorModal.propTypes = {
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

export default PromotionSelectorModal;
