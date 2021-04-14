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
        dishes: this.props.value,
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
    componentWillReceiveProps(nextProps) {
        const {
            value,
        } = nextProps

        if (!nextProps.value !== this.props.value) {
            this.setState({
                dishes: value,
            })
            // this.props.onChange(value)
        }
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
        // const {
        //     allBrands,
        //     allCategories,
        //     allDishes,
        // } = this.props;
        // const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        // const dishObjects = values.reduce((acc, curr) => {
        //     const dishObj = dishes.find(item => item.value === curr);
        //     dishObj && acc.push(dishObj);
        //     return acc;
        // }, []);
        // data[currentEditingIndex][currentEditingType] = dishObjects.length ? [...dishObjects] : [{
        //     foodName: '',
        //     unit: '份',
        // }];
        this.setState({
            // data,
            currentFoodValues: [],
            currentEditingIndex: 0,
            currentEditingType: 'foods',
            showModal: false,
        })
        this.props.onChange(values)
    }

    render() {
        const {
            showModal,
            data = [],
            dishes = [],
        } = this.state;
        const {
            value,
            mode,
            allBrands = [],
            allCategories = [],
            allDishes = [],
        } = this.props;

        const priceLst = dishes.reduce((acc, curr) => {
            const dish = allDishes.find(item => item.value === curr);
            dish && acc.push(dish)
            return acc;
        }, [])
        return (
            <div>
                <Button
                    type="ghost"
                    style={{ color: '#787878', width: '100%' }}
                    onClick={this.openTheDishModal}
                    className={styles.btnChooser}
                >
                    {
                        !dishes.length && <Icon
                            type="plus"
                            className={styles.avatarUploaderTrigger}
                        />
                    }
                    {
                        <Tooltip title={dishes.length ? priceLst[0] && priceLst[0].label : '点击添加商品'}>
                            {dishes.length ? priceLst[0] && priceLst[0].label : '点击添加商品'}
                        </Tooltip>
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
                            initialValue={value || []}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}
                        />
                    )
                }
            </div>
        )
    }
}
