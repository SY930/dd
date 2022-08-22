import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import classnames from 'classnames';

import EditableTags from '../../../../components/common/EditableTags';
import ShopSelectModal from './ShopSelectModal';
import { loadShopSchema } from './utils';


import './assets/ShopSelector.less';

class ShopSelector extends Component {
    state = {
        showModal: false,
        originLeftGroup: null,
        allSubRightGroup: [],
    }

    componentDidMount() {
        this.loadShops();
    }


    loadShops = () => {
        loadShopSchema().then(({ originLeftGroup = [], allSubRightGroup = [] }) => {
            this.setState({
                originLeftGroup,
                allSubRightGroup,
            })
        })
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
        this.props.onChange(values);
        this.setState({ showModal: false });
    }

    handleModalCancel = () => {
        this.setState({ showModal: false });
    }

    render() {
        const { value = [], onChange, size, placeholder, ...otherProps } = this.props;
        console.log("🚀 ~ file: ShopSelector.jsx ~ line 58 ~ ShopSelector ~ render ~ value", value)
        const { showModal, allSubRightGroup, originLeftGroup } = this.state;
        const items = value.reduce((ret, shopID) => {
            const shopInfo = allSubRightGroup.find(shop => shop.value === shopID);
            if (!shopInfo) return ret;
            return ret.concat({ value: shopInfo.value, label: shopInfo.shopName });
        }, []);
        return (
            <div className="hll-shop-selector">
                {size === 'default' &&
                    <EditableTags
                        title="店铺--"
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
                        {...otherProps}
                        visible={true}
                        options={allSubRightGroup}
                        filters={originLeftGroup}
                        defaultValue={value}
                        onOk={this.handleModalOk}
                        onCancel={this.handleModalCancel}
                    />
                }

                <div style={{ color: 'orange', fontSize: '12' }}>
                    不选默认全部店铺可用
                </div>
            </div>
        );
    }
}

ShopSelector.defaultProps = {
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
