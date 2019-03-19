import React, {Component} from 'react';
import EditableTags from "../EditableTags";
import FoodSelectModal from "./FoodSelectModal";

export default class FoodSelector extends Component {

    state = {
        showModal: false,
    }

    handleAdd = () => {
        this.setState({ showModal: true });
    }

    handleModalCancel = () => {
        this.setState({ showModal: false });
    }
    /**
     * 点击一个小tag的叉号时的handler
     * @param tarID
     */
    handleClose = (tarID) => {
        const { value } = this.props;
        const nextValue = value.filter(id => id !== tarID);
        this.props.onChange(nextValue);
    }
    handleModalOk = (values) => {
        this.props.onChange(values);
        this.handleModalCancel()
    }

    render() {
        const { showModal } = this.state;
        const {
            value,
            mode,
            allBrands = [],
            allCategories = [],
            allDishes = [],
            placeholder,
        } = this.props;
        const selectedItems = mode === 'category' ? allCategories.filter(category => value.includes(category.value))
            : allDishes.filter(dish => value.includes(dish.value))
        return (
            <div>
                <EditableTags
                    title={placeholder}
                    items={selectedItems}
                    onAdd={this.handleAdd}
                    onClose={this.handleClose}
                />
                {
                    showModal && (
                        <FoodSelectModal
                            allBrands={allBrands}
                            allCategories={allCategories}
                            allDishes={allDishes}
                            mode={mode}
                            initialValue={value}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}
                        />
                    )
                }
            </div>
        )
    }
}
