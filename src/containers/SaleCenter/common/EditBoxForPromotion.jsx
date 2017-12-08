import {HualalaEditorBox, HualalaTreeSelect, HualalaGroupSelect, HualalaSelected, HualalaSearchInput, CC2PY} from '../../../components/common';
import React from 'react';
import {connect} from 'react-redux';import { Tree } from 'antd';
const TreeNode = Tree.TreeNode;

import styles from '../ActivityPage.less';
if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less');
}

import {fetchPromotionListAC} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';

class EditBoxForPromotion extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            promotionCollection: [], //拼好的promotionList,
            mutexPromotions:[], //后台detail拿过来的数据
            promotionOptions: [], //当前的已选分类下的option
            promotionSelections: new Set(), //已选子项
            promotionCurrentSelections: [] //已选子项ID
        };

        this.handleTreeNodeChange = this.handleTreeNodeChange.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.handleEditorBoxChange = this.handleEditorBoxChange.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.initialState = this.initialState.bind(this);

    }

    initialState(mutexPromotions, promotionCollection){
        if (mutexPromotions === undefined || promotionCollection === undefined) {
            return
        }
        let _promotionSelections = this.state.promotionSelections;
        promotionCollection.forEach((promotionList) => {
            promotionList.promotionName.forEach((promotion) => {
                mutexPromotions.forEach((promotionID) => {
                    if(promotion.promotionIDStr == promotionID) {
                        _promotionSelections.add(promotion);
                    }
                })
            })
        });
        this.setState({
            promotionSelections: _promotionSelections
        });
    }

    componentDidMount(){

        //获取promotionList
        if (!this.props.promotionDetailInfo.getIn(["$promotionListInfo", 'initialized'])) {
            this.props.fetchPromotionList({
                _groupID: this.props.user.accountInfo.groupID
            });
        }

        //活动列表
        let _promotions = this.props.promotionDetailInfo.getIn(["$promotionListInfo", "data", "promotionTree"]).toJS();
        //用户选择过的互斥活动
        let _mutexPromotions = this.props.promotionDetailInfo.getIn(["$promotionDetail", "mutexPromotions"]).toJS();
        this.setState({
            promotionCollection: _promotions,
            mutexPromotions: _mutexPromotions
        }, ()=>{
            this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
        });
    }
    componentWillReceiveProps(nextProps){

        if (this.props.promotionDetailInfo.getIn(["$promotionListInfo", "data", "promotionTree"]) !=
            nextProps.promotionDetailInfo.getIn(["$promotionListInfo", "data", "promotionTree"])
        ) {

            let promotionCollection = nextProps.promotionDetailInfo.getIn(["$promotionListInfo", "data", "promotionTree"]).toJS();
            this.setState({
                promotionCollection,
                promotionSelections : new Set(),
            }, ()=>{
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }
        if(this.props.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']) !==
            nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions'])
        ){
            let _mutexPromotions = nextProps.promotionDetailInfo.getIn(['$promotionDetail', 'mutexPromotions']).toJS();
            this.setState({
                mutexPromotions: _mutexPromotions
            }, ()=>{
                this.initialState(this.state.mutexPromotions, this.state.promotionCollection);
            })
        }

    }

    render(){
        let _promotionCollection = this.state.promotionCollection;
        let promotionSelections = this.state.promotionSelections;

        //拼左侧树状结构
        const loop = (data) => {
            if (undefined === data) {
                return null
            }

            return data.map((item, index) => {
                return <TreeNode key={index} title={item.promotionType.content}/>;
            });
        };
        return (
            <div className={styles.treeSelectMain}>
                <HualalaEditorBox
                    label={'营销活动共享'}
                    itemName="finalShowName"
                    itemID="promotionIDStr"
                    data={this.state.promotionSelections}
                    onChange={this.handleEditorBoxChange}
                    onTagClose = {this.handleSelectedChange}
                >
                    <HualalaTreeSelect level1Title={'全部营销活动'}>
                        <HualalaSearchInput onChange = {this.handleSearchInputChange}/>
                        <Tree onSelect={this.handleTreeNodeChange}>
                            {loop(_promotionCollection)}
                        </Tree>
                        <HualalaGroupSelect
                            options={ this.state.promotionOptions }
                            labelKey = "finalShowName"
                            valueKey = "promotionIDStr"
                            value={this.state.promotionCurrentSelections}
                            onChange={this.handleGroupSelect} />
                        <HualalaSelected itemName="finalShowName" selectdTitle={'已选营销活动'} value={this.state.promotionSelections} onChange={this.handleSelectedChange} onClear = {()=>this.clear()}/>
                    </HualalaTreeSelect>
                </HualalaEditorBox>
            </div>
        );
    }

    //清空
    clear(){
        let {promotionSelections} = this.state;
        promotionSelections.clear();
        this.setState({
            promotionCurrentSelections:[],
            promotionSelections
        })
    }

    //搜索
    handleSearchInputChange(value){

        let promotionList = this.state.promotionCollection;
        if (undefined === promotionList ){
            return null;
        }

        if (!((promotionList instanceof Array) && promotionList.length > 0)) {
            return null;
        }

        let allMatchItem = [];
        promotionList.forEach((promotions)=>{
            promotions.promotionName.forEach((promotion)=>{
                if (CC2PY(promotion.promotionName).indexOf(value) !== -1 ||promotion.promotionName.indexOf(value) !== -1) {
                    allMatchItem.push(promotion);
                }
            });
        });

        let promotionCurrentSelections = [];
        allMatchItem.forEach((storeEntity)=>{
            if(this.state.promotionSelections.has(storeEntity)){
                promotionCurrentSelections.push(storeEntity.promotionIDStr)
            }
        });

        this.setState({
            promotionOptions: allMatchItem,
            promotionCurrentSelections: promotionCurrentSelections
        });
    }

    // 确定或取消
    handleEditorBoxChange(value){

        let promotionSelections = value;
        // update currentSelections according the selections
        let promotionCurrentSelections = [];
        this.state.promotionOptions.forEach((storeEntity)=>{
            if(promotionSelections.has(storeEntity)){
                promotionCurrentSelections.push(storeEntity.promotionIDStr)
            }
        });

        this.setState({
            promotionSelections: value,
            promotionCurrentSelections: promotionCurrentSelections
        },()=>{
            this.props.onChange &&this.props.onChange(Array.from(value));
        });
    }

    //点击移除
    handleSelectedChange(value){

        let promotionSelections = this.state.promotionSelections;
        let promotionCurrentSelections = this.state.promotionCurrentSelections;

        if (value !== undefined) {
            promotionSelections.delete(value);
            promotionCurrentSelections = promotionCurrentSelections.filter((item) => {
                return item !== value.promotionIDStr
            })
        }


        this.setState({
            promotionSelections:promotionSelections,
            promotionCurrentSelections: promotionCurrentSelections
        },()=>{
            this.props.onChange &&this.props.onChange(Array.from(promotionSelections));
        });
    }

    //CheckBox选择
    handleGroupSelect(value){
        if (value instanceof Array) {
            // get the selections
            let selectionsSet = this.state.promotionSelections;
            this.state.promotionOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.promotionIDStr)) {
                    selectionsSet.add(shopEntity);
                } else {
                    selectionsSet.delete(shopEntity)
                }
            });

            this.setState({promotionCurrentSelections: value, promotionSelections: selectionsSet});
        }
    }

    //左侧选择
    handleTreeNodeChange(value) {

        let {promotionSelections} = this.state;
        if (value === undefined || value[0] === undefined) {
            return null;
        }
        let indexArray = value[0].split("-").map((val) => {
            return parseInt(val)
        });
        let storeOptions = [];
        if (indexArray.length === 1) {
            storeOptions = storeOptions.concat(this.state.promotionCollection[indexArray[0]].promotionName);
        } else if (indexArray.length === 2) {
            storeOptions = storeOptions.concat(this.state.promotionCollection[indexArray[0]].children[indexArray[1]].children);
        }

        let promotionCurrentSelections = [];
        storeOptions.forEach((storeEntity) => {
            if (promotionSelections.has(storeEntity)) {
                promotionCurrentSelections.push(storeEntity.promotionIDStr)
            }
        });
        this.setState({promotionOptions: storeOptions, promotionCurrentSelections: promotionCurrentSelections});

    }
}

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.promotionDetailInfo,
        user: state.user.toJS()};
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPromotionList: (opts) => {
            dispatch(fetchPromotionListAC(opts))
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditBoxForPromotion);
