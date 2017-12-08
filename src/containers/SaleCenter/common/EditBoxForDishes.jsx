import {HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY} from '../../../components/common';
import React from 'react';
import {connect} from 'react-redux';
import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';
if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less');
}

import {
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,
} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

class EditBoxForDishes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: [],
            foodCategoryCollection: [],
            priceLst:[]
        };

        this.handleFoodTreeNodeChange = this.handleFoodTreeNodeChange.bind(this);
        this.handleFoodGroupSelect = this.handleFoodGroupSelect.bind(this);
        this.handleFoodSelectedChange = this.handleFoodSelectedChange.bind(this);
        this.handleFoodEditorBoxChange = this.handleFoodEditorBoxChange.bind(this);
        this.handleFoodSearchInputChange = this.handleFoodSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.initialState = this.initialState.bind(this);
    }

    componentDidMount() {
        const opts = {
            _groupID: this.props.user.accountInfo.groupID
        };
        this.props.promotionDetailInfo.getIn(["$foodCategoryListInfo", "initialized"]) || this.props.fetchFoodCategoryInfo({
            ...opts
        });
        this.props.promotionDetailInfo.getIn(["$foodMenuListInfo", "initialized"]) || this.props.fetchFoodMenuInfo({
            ...opts
        });

        //let _foodSelections = this.state.foodSelections;
        let _priceLst = this.props.value || this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        let foodCategoryCollection = this.props.promotionDetailInfo.get('foodCategoryCollection').toJS();
        this.setState({
            priceLst: _priceLst,
            foodCategoryCollection: foodCategoryCollection
        }, ()=>{
            this.initialState(this.state.priceLst, this.state.foodCategoryCollection);
        })

    }
    initialState(foodList, foodCategoryCollection){
        if (foodList === undefined || foodCategoryCollection === undefined) {
            return
        }

        let _foodSelections = this.state.foodSelections;
        foodList.forEach((food)=> {
            foodCategoryCollection
                .forEach((categoryGroup)=> {
                    categoryGroup.foodCategoryName
                        .forEach((category) => {
                            category.foods
                                .forEach((foodInfo)=>{
                                    if (foodInfo.itemID == food.foodUnitID) {
                                        if (this.props.stageNum === undefined) {
                                            _foodSelections.add(foodInfo);
                                        }
                                        if(this.props.stageNum !== undefined && food.stageNo == this.props.stageNum){
                                            _foodSelections.add(foodInfo);
                                        }
                                    }
                                });
                        });
                });
        });

        this.setState({
            foodSelections :_foodSelections
        })
    }
    componentWillReceiveProps(nextProps) {
        // TODO: 为什么foodCategoryCollection 会发生变化,传了三次
        if (this.props.promotionDetailInfo.get('foodCategoryCollection') !==
            nextProps.promotionDetailInfo.get('foodCategoryCollection')
        ) {
            let foodCategoryCollection = nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS();

            this.setState({
                foodCategoryCollection,
                foodSelections : new Set(),
            }, ()=>{
                this.initialState(this.state.priceLst, this.state.foodCategoryCollection);
            })
        }
        if(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']) !==
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst'])
        ){
            let _priceLst = this.props.value || nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
            this.setState({
                priceLst: _priceLst
            }, ()=>{
                this.initialState(this.state.priceLst, this.state.foodCategoryCollection);
            })
        }
    }

    render() {
        let treeData = [];
        this.state.foodCategoryCollection.map((item)=> {
            if (typeof item == 'object') {
                item.foodCategoryName.map((cate)=> {
                    treeData.push(cate)
                })
            }
        });

        const loop = (data) => {
            if (data.length > 0) {
                return data.map((item, index) => {
                    if (typeof item == 'object') {
                        return <TreeNode key={index} title={item.foodCategoryName}/>;
                    }

                });
            }
            return null;
        };
        return (
            <div>
                <HualalaEditorBox
                    label={'适用菜品'}
                    itemName="foodName+unit"
                    itemID="itemID"
                    data={this.state.foodSelections}
                    onChange={(value)=> {
                        this.handleFoodEditorBoxChange(value)
                    }}
                    onTagClose={(value)=> {
                        this.handleFoodSelectedChange(value)
                    }}
                >
                    <HualalaTreeSelect level1Title={'全部菜品'}>
                        <HualalaSearchInput onChange={(value)=> {
                            this.handleFoodSearchInputChange(value)
                        }}/>
                        <Tree onSelect={(value)=> {
                            this.handleFoodTreeNodeChange(value)
                        }}>
                            {loop(treeData)}
                        </Tree>

                        <HualalaGroupSelect
                            options={ this.state.foodOptions }
                            labelKey="foodName+unit"
                            valueKey="itemID"
                            value={this.state.foodCurrentSelections}
                            onChange={(value)=> {
                                this.handleFoodGroupSelect(value)
                            }}/>
                        <HualalaSelected itemName="foodName+unit" selectdTitle={'已选菜品分类'}
                                         value={this.state.foodSelections}
                                         onChange={(value)=> {
                                             this.handleFoodSelectedChange(value)
                                         }}
                                         onClear={()=>this.clear('food')}
                        />
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    handleFoodSearchInputChange(value) {
        let {foodCategoryCollection, foodSelections} = this.state;
        if (undefined === foodCategoryCollection) {
            return null;
        }

        if (!((foodCategoryCollection instanceof Array) && foodCategoryCollection.length > 0)) {
            return null;
        }
        let allMatchItem = [];

        foodCategoryCollection.forEach((city)=> {
            city.foodCategoryName.forEach((category)=> {
                category.foods.forEach((food)=> {
                    if (food.foodMnemonicCode.indexOf(value) != -1 || food.foodName.indexOf(value) != -1) {
                        allMatchItem.push(food);
                    }
                })
            });

        });

        // update currentSelections according the selections
        let foodCurrentSelections = [];
        allMatchItem.forEach((storeEntity)=> {
            if (foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            foodOptions: allMatchItem,
            foodCurrentSelections
        });
    }

    handleFoodEditorBoxChange(value) {
        let foodSelections = value;
        let foodCurrentSelections = [];
        this.state.foodOptions.forEach((storeEntity)=> {
            if (foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({
            foodSelections: value,
            foodCurrentSelections
        }, ()=> {
            this.props.onChange &&this.props.onChange(Array.from(value));
        });
    }

    handleFoodSelectedChange(value) {

        let {foodSelections, foodCurrentSelections} = this.state;

        if (value !== undefined) {
            foodSelections.delete(value);
            foodCurrentSelections = foodCurrentSelections.filter((item) => {
                return item !== value.itemID;
            })
        }

        this.setState({
            foodCurrentSelections,
            foodSelections
        },()=>{
            this.props.onChange &&this.props.onChange(Array.from(foodSelections));
        });
    }

    handleFoodGroupSelect(value) {
        if (value instanceof Array) {
            // get the selections
            let {foodSelections, foodOptions}= this.state;

            foodOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {
                    foodSelections.add(shopEntity);
                } else {
                    foodSelections.delete(shopEntity)
                }
            });
            this.setState({
                foodCurrentSelections: value,
                foodSelections
            });
        }
    }

    handleFoodTreeNodeChange(value) {
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        let indexArray = parseInt(value[0]);
        let treeData = [];
        this.state.foodCategoryCollection.map((item)=> {
            if (typeof item == 'object') {
                item.foodCategoryName.map((cate)=> {
                    treeData.push(cate)
                })
            }
        });

        let storeOptions = treeData[indexArray].foods.map((item)=> {
            if (typeof item == 'object') {
                return item
            }
            return null;
        });
        let foodCurrentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (this.state.foodSelections.has(storeEntity)) {
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({foodOptions: storeOptions, foodCurrentSelections});

    }

    clear() {
        let selection = this.state.foodSelections;
        selection.clear();
        this.setState({
            foodSelections: selection,
            foodCurrentSelections: []
        });
    }
}
const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_old_promotionDetailInfo,
        user: state.user.toJS()};
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchFoodCategoryInfo: (opts) => {
            dispatch(fetchFoodCategoryInfoAC(opts))
        },

        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForDishes);
