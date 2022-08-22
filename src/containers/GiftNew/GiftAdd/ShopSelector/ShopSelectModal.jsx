import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Spin } from 'antd';

import FilterSelector from './FilterSelector';

class ShopSelectModal extends Component {
    state = {
        loading: false,
        options: null,
    }

    selected = this.props.defaultValue
    groupName = null;

    handleChange = (values) => {
        this.selected = values;
        this.props.onChange(values);
    }


    handleOk = () => {
        this.props.onOk(this.selected);
    }

    render() {
        const { defaultValue, filters } = this.props;
        // const { loading } = this.state;
        const options = this.props.options || this.state.options || [];
        return (
            <Modal
                {...this.props}
                onOk={this.handleOk}
                maskClosable={false}
            >
                {/* <Spin spinning={loading} delay={500}> */}
                <FilterSelector
                    title="店铺"
                    doGroup={true}
                    options={options}
                    filters={filters}
                    defaultValue={defaultValue}
                    onChange={this.handleChange}
                />
                {/* </Spin> */}
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
