import React, { Component } from 'react';
import FoodSelectModal from '../../../components/common/FoodSelector/ShopFoodSelectModal'
import { Row, Col, Form, Select, Radio, Input, InputNumber, Tooltip, Icon, Button } from 'antd';
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import styles from '../ActivityPage.less'

export default class BtnFoodSelector extends Component {

    state = {
        showModal: false,
        dishes: [],
        data: [{
            // foods存放购买菜品的foodInfo
            foods: [
                {
                    foodName: '',
                    unit: '份',
                },
            ],
            foodsCountInfo: {}, // 购买菜品对应的count {[item.value]: countNum}
            // free存放赠送菜品的foodInfo
            free: [
                {
                    foodName: '',
                    unit: '份',
                },
            ],
            freeCountInfo: {}, // 赠送菜品对应的count {[item.value]: countNum}
        }],
        currentEditingIndex: 0,
        currentEditingType: 'foods',
    }

    openTheDishModal = () => {
        this.setState({ showModal: true });
    }

    handleModalCancel = () => {
        this.setState({ showModal: false });
    }
    /**
     * 点击一个小tag的叉号时的handler
     * @param tarID
     */
    // handleClose = (tarID) => {
    //     const { value } = this.props;
    //     const nextValue = value.filter(id => id !== tarID);
    //     this.props.onChange(nextValue);
    // }
    handleModalOk = (values) => {
        const {
            currentEditingIndex,
            currentEditingType,
            data,
        } = this.state;
        this.setState({
            dishes: values,
        })
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const dishObjects = values.reduce((acc, curr) => {
            const dishObj = dishes.find(item => item.value === curr);
            dishObj && acc.push(dishObj);
            return acc;
        }, []);
        data[currentEditingIndex][currentEditingType] = dishObjects.length ? [...dishObjects] : [{
            foodName: '',
            unit: '份',
        }];
        this.setState({
            data,
            currentFoodValues: [],
            currentEditingIndex: 0,
            currentEditingType: 'foods',
            showModal: false,
        })
        // debugger
        this.props.onChange({
            dishes: data,
        });
    }

    render() {
        const {
            showModal,
            data = [],
            dishes,
        } = this.state;
        console.log('data', data[0] && data[0].foods && data[0].foods[0] && data[0].foods[0].label)
        const {
            value,
            mode,
            allBrands = [],
            allCategories = [],
            allDishes = [],
        } = this.props;
        return (
            <div>
                <Button
                    type="ghost"
                    style={{ color: '#787878' }}
                    onClick={this.openTheDishModal}
                >
                    {
                        !dishes.length && <Icon
                            type="plus"
                            className={styles.avatarUploaderTrigger}
                        />
                    }
                    {
                        dishes.length ? data[0] && data[0].foods && data[0].foods[0] && data[0].foods[0].label : '点击添加商品'
                    }
                </Button>
                {
                    showModal && (
                        <FoodSelectModal
                            allBrands={allBrands}
                            allCategories={allCategories}
                            multiple={false}
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
