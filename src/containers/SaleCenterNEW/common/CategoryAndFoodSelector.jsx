import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Radio,
    Tree,
} from 'antd';
import styles from '../ActivityPage.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionDetailInfo: state.sale_promotionScopeInfo_NEW,
    }
}
const PROMOTION_OPTIONS = [
    {
        key: '0',
        value: 0,
        name: '按分类',
    }, {
        key: '1',
        value: 1,
        name: '按菜品',
    },
];

@connect(mapStateToProps)
export default class CategoryAndFoodSelector extends Component {

    renderPromotionRange() {
        return (
            <FormItem
                label="活动范围"
                className={styles.FormItemStyle}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 17,
                }}
            >
                <RadioGroup
                    value={this.state.categoryOrDish}
                    onChange={this.handleCategoryOrDishChange}
                >
                    {PROMOTION_OPTIONS.map((type) => {
                        return (<Radio key={type.key} value={type.value}>{type.name}</Radio >);
                    })}
                </RadioGroup >
            </FormItem>

        );
    }
    renderDishsSelectionBox() {
        return (
            <div>
                <FormItem label="适用菜品" className={styles.FormItemStyle} labelCol={{ span: 4 }} wrapperCol={{ span: 17 }}>
                    
                </FormItem>
            </div>
        )
    }
    render() {
        return (
            <div>
                {this.renderPromotionRange()}
                {
                    this.state.categoryOrDish == 1 ? this.renderDishsSelectionBox() : this.renderCategorySelectionBox()
                }
            </div>
        );
    }
}
