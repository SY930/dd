import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { Row, Col, Modal, Form, Select, Input, message, TreeSelect } from 'antd';
import styles from './GiftAdd.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

class FoodCatTree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodCategoryList: [],
            foodList: [],
            isFoodCatNameList: '0',
            treeData: [],
            catOrFoodCollection: [],
        };
    }

    componentDidMount() {
        const opts = {
            _groupID: this.props.user.accountInfo.groupID,
        };
        this.props.promotionDetailInfo.getIn(['$foodCategoryListInfo', 'initialized']) || this.props.fetchFoodCategoryInfo({
            ...opts,
        });
        this.props.promotionDetailInfo.getIn(['$foodMenuListInfo', 'initialized']) || this.props.fetchFoodMenuInfo({
            ...opts,
        });
        const foodCategoryList = this.props.promotionDetailInfo.get('$foodCategoryListInfo').toJS().data.records || [];
        const foodList = this.props.promotionDetailInfo.get('$foodMenuListInfo').toJS().data.records || [];
        this.proFoodMenuListToCat(foodCategoryList, foodList);
        const _foodNameList = this.props.value ? (this.props.value[this.props.value.length - 1] == ',' || this.props.value[this.props.value.length - 1] == '，' ? this.props.value.slice(0, this.props.value.length - 1) : this.props.value) : this.props.value;
        this.setState({
            foodCategoryList,
            foodList,
            isFoodCatNameList: this.props.isFoodCatNameList,
            catOrFoodCollection: this.props.value ? _foodNameList.replace(/，/g, ',').split(',') : [],
        });
    }

    componentWillReceiveProps(nextProps) {
        const foodCategoryList = nextProps.promotionDetailInfo.get('$foodCategoryListInfo').toJS().data.records || [];
        const foodList = nextProps.promotionDetailInfo.get('$foodMenuListInfo').toJS().data.records || [];
        this.proFoodMenuListToCat(foodCategoryList, foodList)
        this.setState({
            foodCategoryList,
            foodList,
            // catOrFoodCollection: nextProps.foodNameList
        });

        if (this.props.isFoodCatNameList !== nextProps.isFoodCatNameList) {
            this.setState({ isFoodCatNameList: nextProps.isFoodCatNameList, catOrFoodCollection: [] }, () => {
                this.proFoodMenuListToCat(this.state.foodCategoryList, this.state.foodList)
            });
        }
    }
    proFoodMenuListToCat = (foodCategoryList, foodList) => {
        const FoodMenuListToCatArr = [];
        foodCategoryList.map((category, index) => {
            const obj = {};
            obj.foodCategoryName = category.foodCategoryName;
            obj.foods = [];
            foodList.map((food) => {
                if (food.foodCategoryName == category.foodCategoryName) {
                    obj.foods.push(food);
                }
            })
            FoodMenuListToCatArr.push(obj);
        });
        const { isFoodCatNameList } = this.state;
        const treeData = FoodMenuListToCatArr.map((menuWithFoods, index) => {
            const children = menuWithFoods.foods.map((food, idx) => {
                return {
                    label: food.foodName,
                    value: food.foodName,
                    key: `food-${index}-${idx}`,
                }
            });
            return {
                label: isFoodCatNameList == '0' ? `类别-${menuWithFoods.foodCategoryName}` : menuWithFoods.foodCategoryName,
                value: isFoodCatNameList == '0' ? `isCategory${menuWithFoods.foodCategoryName}` : menuWithFoods.foodCategoryName,
                key: `category-${index}`,
                children: isFoodCatNameList == '0' ? children : [],
            }
        });
        this.setState({ treeData })
    }
    handleTreeSelectChange = (value) => {
        const { isFoodCatNameList } = this.state;
        const _value = value.filter((v, i) => {
            return (v.indexOf('isCategory') < 0);// 按菜品选择时去掉类别的TreeNode，只传菜品
        })
        this.setState({ catOrFoodCollection: _value })
        this.props.onChange && this.props.onChange(_value);
    }
    render() {
        const title = this.state.isFoodCatNameList == '0' ? '菜品' : '分类'
        return (
            <TreeSelect
                placeholder={`请选择${title}`}
                allowClear={true}
                multiple={true}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                value={this.state.catOrFoodCollection}
                treeData={this.state.treeData}
                onChange={this.handleTreeSelectChange}
            >
            </TreeSelect>
        )
    }
}

function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        user: state.user.toJS(),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },
        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FoodCatTree)
