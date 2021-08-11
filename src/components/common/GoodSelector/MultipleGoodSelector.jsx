import React, {Component} from 'react';
import EditableTags from "../EditableTags";
import GoodSelectModal from "./GoodSelectModal";

export default class GoodSelector extends Component {

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
        let {
            value,
            allCategories = [],
            allDishes = [],
            placeholder,
        } = this.props;

        if(value == undefined) {
            value = [];
        }
        const selectedItems = allDishes.filter(dish => value.includes(dish.value));
        return (
            <div>
                <EditableTags
                    title={placeholder}
                    placeholder={placeholder}
                    items={selectedItems}
                    onAdd={this.handleAdd}
                    onClose={this.handleClose}
                />
                {
                    showModal && (
                        <GoodSelectModal
                            allCategories={allCategories}
                            allDishes={allDishes}
                            multiple={true}
                            initialValue={value ? Array.isArray(value) ? [...value] : [value] : []}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}
                        />
                    )
                }
            </div>
        )
    }
}
