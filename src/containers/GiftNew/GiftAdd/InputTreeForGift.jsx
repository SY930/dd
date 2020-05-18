import {
    HualalaEditorBox,
    HualalaTreeSelect,
    HualalaGroupSelect,
    HualalaSelected,
    HualalaSearchInput,
} from '../../../components/common';
import React from 'react';
import { connect } from 'react-redux';
import { Tree } from 'antd';
import {
    FetchGiftSort,
} from '../_action';
import GiftCfg from '../../../constants/Gift';
import _ from 'lodash';

const shareableGiftType = [ 10, 20, 21, 110, 111, 22];

const TreeNode = Tree.TreeNode;
class InputTreeForGift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodOptions: [], // 待选项
            foodSelections: new Set(), // 所有已选择的项
            foodCurrentSelections: [], // 待选项中已选项
            foodCategoryCollection: [], // 全部数据
            priceLst: [],
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
        const { giftData } = this.props;
        giftData || this.props.FetchGiftSort({});
        const _priceLst = this.props.value;
        const foodCategoryCollection = giftData.toJS();
        this.setState({
            priceLst: _priceLst,
            foodCategoryCollection: this.proGiftData(foodCategoryCollection),
        }, () => {
            this.initialState(this.state.priceLst, this.state.foodCategoryCollection);
        })
    }

    componentWillReceiveProps(nextProps) {
        // TODO: 为什么foodCategoryCollection 会发生变化,传了三次
        const { giftData, value, thisGiftItem } = nextProps;
        if (giftData === this.props.giftData) return;
        const foodCategoryCollection = giftData.toJS();
        let _foodCategoryCollection = null;
        if (thisGiftItem) {
            _foodCategoryCollection = foodCategoryCollection.map((category) => {
                if (category.giftType == thisGiftItem.giftType) {
                    const crmGifts = category.crmGifts.filter((gift) => {
                        return gift.giftItemID !== thisGiftItem.giftItemID
                    });
                    return {
                        crmGifts,
                        giftType: category.giftType,
                    }
                }
                return category;
            })
        }
        this.setState({
            foodCategoryCollection: _foodCategoryCollection ? this.proGiftData(_foodCategoryCollection) : this.proGiftData(foodCategoryCollection),
            foodSelections: new Set(),
            priceLst: value,
        }, () => {
            this.initialState(nextProps.value, this.state.foodCategoryCollection);
        });
    }

    initialState(foodList, foodCategoryCollection) {
        if (foodList === undefined || foodCategoryCollection === undefined) {
            return
        }

        const _foodSelections = this.state.foodSelections;

        foodList.forEach((food) => {
            foodCategoryCollection.forEach((categoryGroup) => {
                categoryGroup.children.forEach((foodInfo) => {
                    if (foodInfo.itemID === food.giftItemID) {
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
        this.setState({
            foodSelections: _foodSelections,
        });
    }

    proGiftData = (giftTypes = []) => {
        const { type, giftItemID } = this.props;
        const _giftTypes = _.filter(giftTypes, giftItem => shareableGiftType.includes(Number(giftItem.giftType)));
        let treeData = [],
            gifts = [],
            _treeData = [];
        _giftTypes.map((gt, idx) => {
            treeData.push({
                giftType: gt.giftType,
                giftTypeName: _.find(GiftCfg.giftTypeName, { value: String(gt.giftType) }).label,
                children: [],
            })
            gt.crmGifts.map((gift) => {
                treeData[idx].children.push({
                    giftName: gift.giftName,
                    itemID: String(gift.giftItemID),
                    giftItemID: gift.giftItemID,
                });
            });
        });
        if (type === 'edit') {
            _treeData = treeData.map((gift, idx) => {
                return {
                    giftType: gift.giftType,
                    giftTypeName: gift.giftTypeName,
                    children: gift.children.filter(item => item.giftItemID !== giftItemID),
                }
            });
            return _treeData.sort((a, b) => (shareableGiftType.indexOf(Number(a.giftType)) - shareableGiftType.indexOf(Number(b.giftType))));
        }
        return treeData.sort((a, b) => (shareableGiftType.indexOf(Number(a.giftType)) - shareableGiftType.indexOf(Number(b.giftType))));
    }

    render() {
        const treeData = [];
        this.state.foodCategoryCollection.map((item) => {
            if (typeof item === 'object') {
                treeData.push(item);
            }
        });
        const loop = (data) => {
            if (data.length > 0) {
                return data.map((item, index) => {
                    if (typeof item === 'object') {
                        return <TreeNode key={index} title={item.giftTypeName} />;
                    }
                });
            }
            return null;
        };
        return (
            <div>
                <HualalaEditorBox
                    label={'共用券'}
                    itemName="giftName"
                    itemID="itemID"
                    data={this.state.foodSelections}
                    onChange={(value) => {
                        this.handleFoodEditorBoxChange(value)
                    }}
                    onTagClose={(value) => {
                        this.handleFoodSelectedChange(value)
                    }}
                >
                    <HualalaTreeSelect level1Title={'全部共用券'}>
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

                        <HualalaGroupSelect
                            options={this.state.foodOptions}
                            labelKey="giftName"
                            valueKey="itemID"
                            value={this.state.foodCurrentSelections}
                            onChange={(value) => {
                                this.handleFoodGroupSelect(value)
                            }}
                        />
                        <HualalaSelected
                            itemName="giftName"
                            selectdTitle={'已选共用券'}
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
            city.children.forEach((food) => {
                if (food.giftItemID.indexOf(value) != -1 || food.giftName.indexOf(value) != -1) {
                    allMatchItem.push(food);
                }
            })
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
            // if (foodSelections.has(storeEntity)) {
            //     foodCurrentSelections.push(storeEntity.itemID)
            // }
            Array.from(foodSelections).map((selected) => {
                if (selected.giftItemID == storeEntity.giftItemID) {
                    foodCurrentSelections.push(storeEntity.itemID)
                }
            })
        });
        this.setState({
            foodSelections: value,
            foodCurrentSelections,
        }, () => {
            // TODO 传给组件外的表单数据
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
            const { foodSelections, foodOptions, foodCurrentSelections } = this.state;
            foodOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {
                    let hased = false;
                    Array.from(foodSelections).map((selected) => {
                        if (selected.itemID == shopEntity.itemID) {
                            hased = true;
                        }
                    })
                    if (!hased) {
                        foodSelections.add(shopEntity);
                    }
                } else {
                    foodCurrentSelections.map((currentSelected) => {
                        if (!value.includes(currentSelected)) {
                            Array.from(foodSelections).map((foodSelected) => {
                                if (foodSelected.itemID == currentSelected) {
                                    foodSelections.delete(foodSelected)
                                }
                            })
                        }
                    })
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
        this.state.foodCategoryCollection.map((item) => {
            treeData.push(item);
        });

        const storeOptions = treeData[indexArray].children.map((item) => {
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
        }, () => {
            // console.log(this.state)
        });
    }
}
const mapStateToProps = (state) => {
    return {
        giftData: state.sale_giftInfoNew.get('giftSort'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        FetchGiftSort: opts => dispatch(FetchGiftSort(opts)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InputTreeForGift);
