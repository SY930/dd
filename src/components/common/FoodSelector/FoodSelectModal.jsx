import React, {Component} from 'react';
import {
    Modal,
} from 'antd';
import FilterSelector from '../FilterSelector';

export default class FoodSelectModal extends Component {

    handleChange = (values) => {
        this.selected = values;
    }
    handleOk = () => {
        this.props.onOk(this.selected);
    }
    render() {
        const {
            tableColumns,
            options,
            onCancel,
        } = this.props;
        return (
            <Modal
                onOk={this.handleOk}
                onCancel={onCancel}
                visible={true}
                maskClosable={false}
            >
                <FilterSelector
                    title="菜品"
                    tableColumns={tableColumns}
                    options={options}
                    // filters={filters}
                    // extraFilters={extraFilters}
                    // defaultValue={defaultValue}
                    onChange={this.handleChange}
                    // onFilterKeyChange={this.handleFilterKeyChange}
                />
            </Modal>
        )
    }
}
