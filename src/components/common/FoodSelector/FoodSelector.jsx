import React, {Component} from 'react';
import EditableTags from "../EditableTags";
import FoodSelectModal from "./FoodSelectModal";

export default class FoodSelector extends Component {

    state = {
        showModal: false,
        options: null,
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

    render() {
        const { showModal } = this.state;
        const {
            value,
            comparator,
            options,
            onChange,
            dataLevels = [
                'brandID',
                'categoryID',
            ],
            placeholder,
        } = this.props;
        return (
            <div>
                <EditableTags
                    title={placeholder}
                    items={items}
                    onAdd={this.handleAdd}
                    onClose={this.handleClose}
                />
                {
                    showModal &&
                    <FoodSelectModal
                        options={options}
                        defaultValue={value}
                        onOk={this.handleModalOk}
                        onCancel={this.handleModalCancel}
                    />
                }
            </div>
        )
    }
}
