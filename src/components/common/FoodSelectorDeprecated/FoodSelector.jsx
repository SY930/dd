import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { fetchData } from '../../../helpers/util';
import EditableTags from '../EditableTags';
import FoodSelectModal from './FoodSelectModal';

class FoodSelector extends Component {
    state = {
        showModal: false,
        options: null,
    }

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
        const { value, onChange, placeholder, ...otherProps } = this.props;
        const { showModal } = this.state;

        const options = this.props.options || this.state.options || [];
        const items = value.map((foodID) => {
            const foodInfo = options.find(food => food.foodID === foodID);
            if (!foodInfo) return null;
            return { value: foodInfo.foodID, label: foodInfo.foodName };
        });

        return (
            <div>
                <EditableTags
                    title={placeholder}
                    items={items}
                    onAdd={this.handleAdd}
                    onClose={this.handleClose}
                />
                {showModal &&
                    <FoodSelectModal
                        {...otherProps}
                        visible={true}
                        options={options}
                        defaultValue={value}
                        onOk={this.handleModalOk}
                        onCancel={this.handleModalCancel}
                    />
                }
            </div>
        );
    }
}

FoodSelector.defaultProps = {
    // FIXME: set default value for a controled component will get antd form warning.
    // value: [],
    // onChange() {},
    placeholder: '点击选择菜品',
};

FoodSelector.propTypes = {
    /** 当前选择的项 */
    value: PropTypes.arrayOf(PropTypes.string),
    /** 选项改变时的回调 */
    onChange: PropTypes.func,
    /** 组件默认显示的文字 */
    placeholder: PropTypes.string,
};

export default FoodSelector;
