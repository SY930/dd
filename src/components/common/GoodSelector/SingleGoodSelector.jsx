import React, {Component} from 'react';
import {
    Icon,
} from 'antd';
import style from './style.less';
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

    handleModalOk = (values) => {
        this.props.onChange(values.length ? this.props.allDishes.find(dish => values[0] === dish.value) : null);
        this.handleModalCancel()
    }

    render() {
        const { showModal } = this.state;
        const {
            value,
            allCategories = [],
            allDishes = [],
        } = this.props;
        const selectedItem = allDishes.find(dish => value === dish.value);
        return (
            <div>
                <div
                    className={style.SelectorBox}
                    onClick={this.handleAdd}
                >
                    {
                        selectedItem ? (
                            <img
                                src={`http://res.hualala.com/${selectedItem.masterImagePath}`}
                                alt=""
                                style={{
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        ) : (
                            <Icon
                                style={{
                                    fontSize: 35,
                                    color: '#999',
                                }}
                                type="plus"
                            />
                        )
                    }
                </div>
                {
                    showModal && (
                        <GoodSelectModal
                            allCategories={allCategories}
                            allDishes={allDishes}
                            multiple={false}
                            initialValue={value ? [value] : []}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}
                        />
                    )
                }
            </div>
        )
    }
}
