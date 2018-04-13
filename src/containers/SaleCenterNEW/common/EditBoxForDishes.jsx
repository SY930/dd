import React from 'react';
import { connect } from 'react-redux';
import { Tree } from 'antd';
import { HualalaEditorBox, HualalaTreeSelect, HualalaSelected, HualalaSearchInput, CC2PY } from '../../../components/common';
import HualalaGroupSelectS from './HualalaGroupSelect/index';
import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const Immutable = require('immutable');
// window.Immutable=Immutable;
const TreeNode = Tree.TreeNode;
if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}
class EditBoxForDishes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: [],
            foodCategoryCollection: [],
            priceLst: [],
        };

        this.handleFoodTreeNodeChange = this.handleFoodTreeNodeChange.bind(this);
        this.handleFoodGroupSelect = this.handleFoodGroupSelect.bind(this);
        this.handleFoodSelectedChange = this.handleFoodSelectedChange.bind(this);
        this.handleFoodEditorBoxChange = this.handleFoodEditorBoxChange.bind(this);
        this.handleFoodSearchInputChange = this.handleFoodSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.initialState = this.initialState.bind(this);
        this.filterGroup = this.filterGroup.bind(this);
    }

    componentDidMount() {
        let _priceLst,
            foodCategoryCollection;
        try {
            _priceLst = this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        } catch (error) {
            _priceLst = [];
        }
        try {
            foodCategoryCollection = this.filterGroup(this.props.promotionDetailInfo.get('foodCategoryCollection').toJS());
        } catch (error) {
            foodCategoryCollection = [];
        }
        this.setState({
            priceLst: this.props.type === 'RECOMMEND_FOOD' || this.props.type === 'FOOD_PAY_MORE_THEN_UPGRADE' ? this.props.value : _priceLst,
            foodCategoryCollection,
        }, () => {
            this.initialState(this.state.priceLst, this.state.foodCategoryCollection);
        })
    }
    initialState(foodList, foodCategoryCollection) {
        if (foodList === undefined || foodCategoryCollection === undefined) {
            return
        }

        const _foodSelections = this.state.foodSelections;
        foodList.forEach((food) => {
            foodCategoryCollection
                .forEach((categoryGroup) => {
                    categoryGroup.foodCategoryName
                        .forEach((category) => {
                            category.foods
                                .forEach((foodInfo) => {
                                    if (foodInfo.itemID == food.foodUnitID) {
                                        if (this.props.stageNum === undefined) {
                                            _foodSelections.add(foodInfo);
                                        }
                                        if (this.props.stageNum !== undefined && food.stageNo == this.props.stageNum) {
                                            _foodSelections.add(foodInfo);
                                        }
                                    }
                                });
                        });
                });
        });

        this.setState({
            foodSelections: _foodSelections,
        })
    }
    // 过滤套餐,临时菜，临时套餐
    filterGroup(foodCategoryCollection) {
        if (foodCategoryCollection) {
            return foodCategoryCollection.map((city) => {
                return {
                    ...city,
                    foodCategoryName: city.foodCategoryName.map((category) => {
                        return {
                            ...category,
                            foods: category.foods.filter((food) => {
                                // if (food.isTempFood == '1' || food.isTempSetFood == '1') {
                                //     console.log('临时菜or临时套餐', food)
                                // }
                                // return food.isSetFood !== '1'
                                return food.isSetFood != '1' && food.isTempFood != '1' && food.isTempSetFood != '1'
                            }),
                        }
                    }),
                }
            });
        }
        return []
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.promotionDetailInfo.get('foodCategoryCollection') !==
            nextProps.promotionDetailInfo.get('foodCategoryCollection')
        ) {
            const foodCategoryCollection = this.filterGroup(nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS());

            this.setState({
                foodCategoryCollection,
                foodSelections: new Set(),
            }, () => {
                this.initialState(this.state.priceLst, this.state.foodCategoryCollection);
            })
        }
        if (
            this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) !==
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) &&
            nextProps.type !== 'FOOD_PAY_MORE_THEN_UPGRADE' && nextProps.type !== 'RECOMMEND_FOOD'
        ) {
            let _priceLst = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']);
            _priceLst = _priceLst ? _priceLst.toJS() : [];
            this.setState({
                priceLst:  _priceLst,
            }, () => {
                this.initialState(this.state.priceLst, this.state.foodCategoryCollection);
            })
        }
        if (
            (nextProps.type === 'RECOMMEND_FOOD' || nextProps.type === 'FOOD_PAY_MORE_THEN_UPGRADE') &&
            !Immutable.is(Immutable.fromJS(this.props.value), Immutable.fromJS(nextProps.value))
        ) {
            this.setState({
                priceLst: nextProps.value
            }, () => {
                this.initialState(this.state.priceLst, this.state.foodCategoryCollection);
            })
        }
    }

    render() {
        const treeData = [];
        this.state.foodCategoryCollection.map((item) => {
            if (typeof item === 'object') {
                item.foodCategoryName.map((cate) => {
                    treeData.push(cate)
                })
            }
        });

        const loop = (data) => {
            if (data.length > 0) {
                return data.map((item, index) => {
                    if (typeof item === 'object') {
                        return <TreeNode key={index} title={item.foodCategoryName} />;
                    }
                });
            }
            return null;
        };
        return (
            <div>
                <HualalaEditorBox
                    label={'适用菜品'}
                    itemName={'foodName+unit'}
                    itemID={'itemID'}
                    data={this.state.foodSelections}
                    onChange={(value) => {
                        this.handleFoodEditorBoxChange(value)
                    }}
                    onTagClose={(value) => {
                        this.handleFoodSelectedChange(value)
                    }}
                >
                    <HualalaTreeSelect level1Title={'全部菜品'}>
                        <HualalaSearchInput onChange={(value) => {
                            this.handleFoodSearchInputChange(value)
                        }}
                        />
                        <Tree onSelect={(value) => {
                            this.handleFoodTreeNodeChange(value)
                        }}
                        >
                            {loop(treeData)}
                        </Tree>

                        <HualalaGroupSelectS
                            options={this.state.foodOptions}
                            labelKey={'foodName+unit'}
                            valueKey={'itemID'}
                            value={this.state.foodCurrentSelections}
                            onChange={(value) => {
                                this.handleFoodGroupSelect(value)
                            }}
                            // autoMax={this.props.autoMax} // 杨雪要求取消买赠活动的数量限制
                            foodSelections={Array.from(this.state.foodSelections || [])}
                        />
                        <HualalaSelected
                            itemName={'foodName+unit'}
                            selectdTitle={'已选菜品'}
                            value={this.state.foodSelections}
                            onChange={(value) => {
                                this.handleFoodSelectedChange(value)
                            }}
                            onClear={() => this.clear('food')}
                        />
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    handleFoodSearchInputChange(value) {
        const { foodCategoryCollection, foodSelections } = this.state;
        if (undefined === foodCategoryCollection) {
            return null;
        }

        if (!((foodCategoryCollection instanceof Array) && foodCategoryCollection.length > 0)) {
            return null;
        }
        const allMatchItem = [];

        foodCategoryCollection.forEach((city) => {
            city.foodCategoryName.forEach((category) => {
                category.foods.forEach((food) => {
                    const allName = food.foodMnemonicCode.split(';').join('');
                    if (food.foodMnemonicCode.indexOf(value) !== -1 || food.foodName.indexOf(value) !== -1 || allName.indexOf(value) !== -1) {
                        allMatchItem.push(food);
                    }
                })
            });
        });

        // update currentSelections according the selections
        const foodCurrentSelections = [];
        allMatchItem.forEach((storeEntity) => {
            if (foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            foodOptions: allMatchItem,
            foodCurrentSelections,
        });
    }

    handleFoodEditorBoxChange(value) {
        const foodSelections = value;
        const foodCurrentSelections = [];
        this.state.foodOptions.forEach((storeEntity) => {
            if (foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({
            foodSelections: value,
            foodCurrentSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(value));
        });
    }

    handleFoodSelectedChange(value) {
        let { foodSelections, foodCurrentSelections } = this.state;
        if (value !== undefined) {
            foodSelections.delete(value);
            foodCurrentSelections = foodCurrentSelections.filter((item) => {
                return item !== value.itemID;
            })
        }
        this.setState({
            foodCurrentSelections,
            foodSelections,
        }, () => {
            this.props.onChange && this.props.onChange(Array.from(foodSelections));
        });
    }

    handleFoodGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            const { foodSelections, foodOptions } = this.state;

            foodOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {
                    foodSelections.add(shopEntity);
                } else {
                    foodSelections.delete(shopEntity)
                }
            });
            this.setState({
                foodCurrentSelections: value,
                foodSelections,
            });
        }
    }

    handleFoodTreeNodeChange(value) {
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        const indexArray = parseInt(value[0]);
        const treeData = [];
        this.state.foodCategoryCollection.forEach((item) => {
            if (typeof item === 'object') {
                item.foodCategoryName.forEach((cate) => {
                    treeData.push(cate)
                })
            }
        });
        // /////////////////////////////////////////
        const storeOptions = treeData[indexArray].foods.map((item) => {
            if (typeof item === 'object') {
                return item
            }
            return null;
        });
        const foodCurrentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (this.state.foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({ foodOptions: storeOptions, foodCurrentSelections });
    }

    clear() {
        const selection = this.state.foodSelections;
        selection.clear();
        this.setState({
            foodSelections: selection,
            foodCurrentSelections: [],
        });
    }
}
const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        user: state.user.toJS(),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },

        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForDishes);
