import {HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY} from '../../../components/common';
import React from 'react';
import {connect} from 'react-redux';import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';
if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less');
}

import {fetchPromotionScopeInfo} from '../../../redux/actions/saleCenter/promotionScopeInfo.action';

class EditBoxForShops extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            cityAreasShops: [],
            options: [],
            selections: new Set(),
            currentSelections: []
        };

        this.handleTreeNodeChange = this.handleTreeNodeChange.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);

    }
    componentDidMount(){

        let _data = this.props.value || this.props.promotionScopeInfo.getIn(['$scopeInfo']).toJS();
        let _cityAreasShops = this.props.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']);
        let _selections = this.state.selections;

        if(_cityAreasShops){
            _cityAreasShops.forEach((city) => {
                city.children.forEach((area) => {
                    area.children.forEach((shop) => {
                        _data.shopsInfo.forEach((id) => {
                            if(shop.itemID === id) {
                                _selections.add(shop)
                            }
                        })
                    })
                })
            })

            this.setState({
                cityAreasShops: this.props.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']),
                selections: _selections
            })
        }
    }
    componentWillReceiveProps(nextProps){
        if (this.props.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']) !==
        nextProps.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']) ||
            nextProps.value !== this.props.value
        ) {
            let _data =nextProps.value || nextProps.promotionScopeInfo.getIn(['$scopeInfo']).toJS();
            let _cityAreasShops = nextProps.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']);
            let _selections = this.state.selections;

            if(_cityAreasShops){

                if (_data.shopsInfo !== undefined) {
                    _cityAreasShops.forEach((city) => {
                        city.children.forEach((area) => {
                            area.children.forEach((shop) => {

                                _data.shopsInfo.forEach((id) => {
                                    if(shop.itemID === id) {
                                        _selections.add(shop);
                                    }
                                })
                            })
                        })
                    })
                }

               this.setState({
                   cityAreasShops: nextProps.promotionScopeInfo.getIn(['refs', 'data', 'cityAreasShops']),
                   selections: _selections
               })
           }
        }
    }

    render(){
        let _cityAreasShops = this.state.cityAreasShops;

        const loop = (data) => {
            if (undefined === data) {
                return null
            }

            return data.map((item, index) => {
                if (item.children) {
                    return (
                        <TreeNode key={`${index}`} title={item.itemName}>
                            {
                                item.children.map((subItem, index2) => {
                                    return (<TreeNode key={`${index}-${index2}`} title={subItem.itemName}/>);
                                })
                            }
                        </TreeNode>
                    );
                }
                return <TreeNode key={index} title={item.itemName}/>;
            });
        };
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={'适用店铺'}
                    itemName="itemName"
                    itemID="itemID"
                    data={this.state.selections}
                    onChange={this.handleEditorBoxChange}
                    onTagClose = {this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={'全部城市'}>
                        <HualalaSearchInput onChange = {this.handleSearchInputChange}/>
                        <Tree onSelect={this.handleTreeNodeChange}>
                            {loop(_cityAreasShops)}
                        </Tree>
                        <HualalaGroupSelect
                            options={ this.state.options }
                            labelKey = "itemName"
                            valueKey = "itemID"
                            value={this.state.currentSelections}
                            onChange={this.handleGroupSelect} />
                        <HualalaSelected itemName="itemName" selectdTitle={'已选城市'} value={this.state.selections} onChange={this.handleSelectedChange} onClear = {()=>this.clear()}/>
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    clear(){
        this.setState({
            currentSelections:[],
            selections:new Set()
        })
    }

    handleSearchInputChange(value){

        let data = this.state.cityAreasShops;
        if (undefined === data ){
            return null;
        }

        if (!((data instanceof Array) && data.length > 0)) {
            return null;
        }

        let allMatchItem = [];
        data.forEach((city)=>{
            city.children.forEach((area) => {
                area.children.forEach((shop)=>{
                    if (CC2PY(shop.shopName).indexOf(value) !== -1) {
                        allMatchItem.push(shop);
                    }
                })
            })
        });

        // update currentSelections according the selections
        let currentSelections = [];
        allMatchItem.forEach((storeEntity)=>{
            if(this.state.selections.has(storeEntity)){
                currentSelections.push(storeEntity.itemID)
            }
        })

        this.setState({
            options: allMatchItem,
            currentSelections: currentSelections
        });
    }

    // it's depends on
    handleEditorBoxChange(value){

        let selections = value;
        // update currentSelections according the selections
        let currentSelections = [];
        this.state.options.forEach((storeEntity)=>{
            if(selections.has(storeEntity)){
                currentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            selections: value,
            currentSelections: currentSelections
        },()=>{
            this.props.onChange &&this.props.onChange(Array.from(value));
        });
    }

    handleSelectedChange(value){

        let selections = this.state.selections;
        let currentSelections = this.state.currentSelections;

        if (value !== undefined) {
            selections.delete(value);
            currentSelections = currentSelections.filter((item) => {
                return item !== value.itemID
            })
        }


        this.setState({
            selections:selections,
            currentSelections: currentSelections
        },()=>{
            this.props.onChange &&this.props.onChange(Array.from(selections));
        });
    }

    handleGroupSelect(value){
        if (value instanceof Array) {
            // get the selections
            let selectionsSet = this.state.selections;
            this.state.options.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {

                    selectionsSet.add(shopEntity);
                } else {
                    selectionsSet.delete(shopEntity)
                }
            });

            this.setState({currentSelections: value, selections: selectionsSet});
        }
    }

    handleTreeNodeChange(value) {
        let {selections} = this.state;
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        let indexArray = value[0].split("-").map((val) => {
            return parseInt(val)
        });
        let storeOptions = [];
        if (indexArray.length === 1) {
            this.state.cityAreasShops[indexArray[0]].children.map((area) => {
                storeOptions = storeOptions.concat(area.children);
            })
        } else if (indexArray.length === 2) {
            storeOptions = storeOptions.concat(this.state.cityAreasShops[indexArray[0]].children[indexArray[1]].children);
        }
        // update currentSelections according the selections
        let currentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (selections.has(storeEntity)) {
                currentSelections.push(storeEntity.itemID)
            }
        });
        this.setState({options: storeOptions, currentSelections: currentSelections});

    }
}

const mapStateToProps = (state) => {
    return {
        promotionScopeInfo: state.sale_old_promotionScopeInfo,
        user: state.user.toJS()};
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPromotionScopeInfo: (opts) => {
            dispatch(fetchPromotionScopeInfo(opts));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForShops);

//add by zhangyanan
// const mapStateToPropsForCrm = (state) => {
//     return {
//         promotionScopeInfo: state.CrmCardInfoAll.equalShopsData.queryInfo,
//         user: state.user.toJS()};
// };

// const mapDispatchToPropsForCrm = (dispatch) => {
//     return {
//         fetchPromotionScopeInfo: (opts) => {
//             dispatch(fetchPromotionScopeInfo(opts));
//         }
//     };
// };


// export const EditBoxForShopsForCrm=connect(mapStateToPropsForCrm, mapDispatchToPropsForCrm)(EditBoxForShops);

