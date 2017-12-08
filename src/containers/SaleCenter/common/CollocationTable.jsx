/**
 * @Author: chenshuang
 * @Date:   2017-03-29T18:06:22+08:00
 * @Last modified by:   xf
 * @Last modified time: 2017-05-03T19:21:01+08:00
 */


import React, { Component } from 'react';
import { render } from 'react-dom';
import {connect} from 'react-redux';

import { Row, Col, Tree, Table, Modal, Form, Icon} from 'antd';

if (process.env.__CLIENT__ === true) {
    //require('../../../../client/componentsPage.less')
};
import styles from '../ActivityPage.less';
import PriceInputIcon from "./PriceInputIcon";  //编辑

import {
    saleCenterSetPromotionDetailAC,
    fetchFoodCategoryInfoAC,
    fetchFoodMenuInfoAC,

} from '../../../redux/actions/saleCenter/promotionDetailInfo.action';
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
import {HualalaTreeSelect, HualalaGroupSelect, HualalaSearchInput, HualalaSelected} from '../../../components/common';

class CollocationTable extends React.Component {

    constructor(props){
        super(props);
        this.uuid = 0;
        this.state={
            visible:false,
            selectedDishes: [],
            foodCategoryCollection: [],     // 存储所有相关数据
            dataSource :[],
            recordInfo: null,
            data:[
                {
                    //foods存放购买菜品的foodInfo
                    foods: [
                        {
                            foodName: "",
                            unit: '份'
                        }
                    ],

                    foodsCountInfo: {},//购买菜品对应的count {itemID: countNum}
                    //free存放赠送菜品的foodInfo
                    free: [
                        {
                            foodName: "",
                            unit: '份'
                        }
                    ],
                    freeCountInfo: {}//赠送菜品对应的count {itemID: countNum}

                }
            ],
            foodOptions: [],
            foodSelections: new Set(), //treeSelect已选数据
            foodCurrentSelections: [],

            priceLst: [],
            scopeLst: [],
        };

        this.handleFoodTreeNodeChange = this.handleFoodTreeNodeChange.bind(this);
        this.handleFoodGroupSelect = this.handleFoodGroupSelect.bind(this);
        this.handleFoodSelectedChange = this.handleFoodSelectedChange.bind(this);
        this.handleFoodSearchInputChange = this.handleFoodSearchInputChange.bind(this);
        this.clear = this.clear.bind(this);
        this.selectDishes = this.selectDishes.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.handleCountChange = this.handleCountChange.bind(this);
        this.addGroup = this.addGroup.bind(this);
        this.removeGroup = this.removeGroup.bind(this);
        this.sortData = this.sortData.bind(this);
    }

    componentDidMount(){
        var opts = {
            _groupID: this.props.user.accountInfo.groupID,
        };
        this.props.promotionDetailInfo.getIn(["$foodCategoryListInfo", "initialized"]) ||
        this.props.fetchFoodCategoryInfo({
            ...opts
        });
        this.props.promotionDetailInfo.getIn(["$foodMenuListInfo", "initialized"]) ||
        this.props.fetchFoodMenuInfo({
            ...opts
        });

        let foodCategoryCollection = this.props.promotionDetailInfo.get('foodCategoryCollection').toJS();

        this.setState({
            foodCategoryCollection,
            priceLst: this.props.priceLst,
            scopeLst: this.props.scopeLst
        },()=>{
            this.sortData(this.state.priceLst, this.state.scopeLst);
        });
    }

    componentWillReceiveProps(nextProps){
        if(
            nextProps.promotionDetailInfo.get('foodCategoryCollection') !==
            this.props.promotionDetailInfo.get('foodCategoryCollection')
        ){
            let foodCategoryCollection = nextProps.promotionDetailInfo.get('foodCategoryCollection').toJS();
            this.setState({
                foodCategoryCollection,
            },()=>{
                this.sortData(this.state.priceLst, this.state.scopeLst);
            });
        }
        if(nextProps.priceLst !== this.props.priceLst){
            this.setState({
                priceLst: nextProps.priceLst
            },()=>{
                this.sortData(this.state.priceLst, this.state.scopeLst);
            });
        }
         if(nextProps.scopeLst !== this.props.scopeLst){
            this.setState({
                scopeLst: nextProps.scopeLst
            },()=>{
                this.sortData(this.state.priceLst, this.state.scopeLst);
            });
        }

    }

    sortData(priceLst, scopeLst){
        let {foodCategoryCollection } = this.state;
        let data = [];
        if (priceLst.length == 0 || scopeLst.length == 0|| foodCategoryCollection.length == 0) {
            return
        }
        priceLst.forEach((price)=>{
            if(!data[price.stageNo]){
                data[price.stageNo] = {
                    //foods存放购买菜品的foodInfo
                    foods: [],
                    foodsCountInfo: {},//购买菜品对应的count {itemID: countNum}
                    //free存放赠送菜品的foodInfo
                    free: [],
                    freeCountInfo: {}//赠送菜品对应的count {itemID: countNum}

                };
            }
            foodCategoryCollection
                .forEach((categoryGroup)=>{
                    categoryGroup.foodCategoryName
                        .forEach((category)=>{
                            category.foods
                                .find((item)=>{
                                    if(item.itemID == price.foodUnitID){
                                        data[price.stageNo].free.push(item);
                                        data[price.stageNo].freeCountInfo[item.itemID] = price.num;
                                    };
                                });
                        })
                });
        });
        scopeLst.forEach((scope)=>{
            if(!data[scope.stageNo]){
                data[scope.stageNo] = {
                    //foods存放购买菜品的foodInfo
                    foods: [],

                    foodsCountInfo: {},//购买菜品对应的count {itemID: countNum}
                    //free存放赠送菜品的foodInfo
                    free: [],
                    freeCountInfo: {}//赠送菜品对应的count {itemID: countNum}

                };
            }
            foodCategoryCollection
                .forEach((categoryGroup)=>{
                    categoryGroup.foodCategoryName
                        .forEach((category)=>{
                            category.foods
                                .find((item)=>{
                                    if(item.itemID == scope.targetID){
                                        data[scope.stageNo].foods.push(item);
                                        data[scope.stageNo].foodsCountInfo[item.itemID] = scope.num;
                                    };
                                });
                        })
                });
        });
        this.setState({
            data
        },()=>{
            this.props.onChange && this.props.onChange(this.state.data);
        });

    }
    //点击添加菜品操作
    selectDishes(indexInfo){

        let selections = new Set();
        //把已选的数据放到foodSelectiions里
        if (indexInfo[3] == '0') { // foods
            if(Object.keys(this.state.data[indexInfo[0]].foods[0]).length !== 2){
                selections = new Set(this.state.data[indexInfo[0]].foods);
            }
        } else if (indexInfo[1] == indexInfo[3]) { // free
            if(Object.keys(this.state.data[indexInfo[0]].free[0]).length !== 2){
                selections = new Set(this.state.data[indexInfo[0]].free);
            }
        }
        this.setState({
            visible: true,
            recordInfo: indexInfo,
            foodSelections: selections
        });
    }
    // 模态框确认事件
    handleOk(){

        // 已选中的菜品, set转成array
        let {foodSelections, recordInfo, data} = this.state;
        // foods
        if (recordInfo[3] == 0) {
            if(foodSelections.size !== 0){
                data[recordInfo[0]].foods = Array.from(foodSelections);
                //选中的菜品把count 的默认值设置成1,删除的菜品count删掉
                foodSelections.forEach((food)=>{
                    //已经有count的,不变,没有的设置成1
                    if(data[recordInfo[0]].foodsCountInfo[food.itemID] === undefined){
                        data[recordInfo[0]].foodsCountInfo[food.itemID] = 1;
                    }
                });

                //如果菜品已经删除,把count中对应信息也删除
                for(let i in data[recordInfo[0]].foodsCountInfo){

                    let flag = Array.from(foodSelections).find((food)=>{
                        return food.itemID === i
                    });
                    if(flag === undefined){
                        delete data[recordInfo[0]].foodsCountInfo[i]
                    }
                }

            }else{ //如果选择的菜品为空(清空),回到初始状态
                data[recordInfo[0]].foods =[
                    {
                        foodName: "",
                        unit: '份'
                    }
                ];

                data[recordInfo[0]].foodsCountInfo = {};
            }
        } else if (recordInfo[1] == recordInfo[3]) {
            // free 赠品
            if(foodSelections.size !== 0){
                data[recordInfo[0]].free = Array.from(foodSelections);
                //选中的赠送把count 的默认值设置成1

                foodSelections.forEach((food)=>{
                    if(data[recordInfo[0]].freeCountInfo[food.itemID] === undefined){
                        data[recordInfo[0]].freeCountInfo[food.itemID] = 1;
                    }
                });

                for(let i in data[recordInfo[0]].freeCountInfo){
                    let flag = Array.from(foodSelections).find((food)=>{
                        return food.itemID === i
                    });
                    if(flag === undefined){
                        delete data[recordInfo[0]].freeCountInfo[i]
                    }
                }
            }else{
                data[recordInfo[0]].free =[
                    {
                        foodName: "",
                        unit: '份'
                    }
                ];

                data[recordInfo[0]].freeCountInfo = {};
            }
        }

        this.setState({
            data: data,
            visible: false,
            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: []
        },()=>{
            this.props.onChange && this.props.onChange(this.state.data);
        });
    }
    //取消
    handleCancel(){
        this.setState({
            visible: false,
            foodOptions: [],
            foodSelections: new Set(),
            foodCurrentSelections: []
        });
    }
    //数量变化
    handleCountChange(indexInfo, record, count) {
        let data = this.state.data;

        // food
        if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) {
            let itemID = record.itemID;
            data[indexInfo[0]].foodsCountInfo[itemID] = count.number;
        }
        // free
        if (parseInt(indexInfo[3]) >= parseInt(indexInfo[1])) {
            let itemID = record.itemID;
            data[indexInfo[0]].freeCountInfo[itemID] = count.number;
        }
        this.setState({
            data: data
        },()=>{
            this.props.onChange && this.props.onChange(this.state.data);
        });
    }
    //菜品选择框
    renderDishesSelectionBox(idx) {

        let treeData = [];
        this.state.foodCategoryCollection.map((item)=>{
            if(typeof item == 'object') {
                item.foodCategoryName.map((cate)=>{
                    treeData.push(cate)
                })
            }
        });

        const loop = (data) => {
            if(data.length>0){
                return data.map((item, index) => {
                    if(typeof item == 'object'){
                        return <TreeNode key={index} title={item.foodCategoryName}/>;
                    }

                });
            }
            return null;
        };
        return (
            <div className={styles.treeSelectMain}>
                <div className={styles.proAll}>
                    <div className={styles.proRight}>
                        <div className={styles.projectIco}>
                            <HualalaTreeSelect level1Title={'全部菜品'}>
                                <HualalaSearchInput onChange = {(value)=>{
                                    this.handleFoodSearchInputChange(value, idx)
                                }}/>
                                <Tree onSelect={(value)=>{
                                    this.handleFoodTreeNodeChange(value, idx)
                                }}>
                                    {loop(treeData)}
                                </Tree>

                                <HualalaGroupSelect
                                    options={ this.state.foodOptions }
                                    labelKey = "foodName+unit"
                                    valueKey = "itemID"
                                    value={this.state.foodCurrentSelections}
                                    onChange={(value)=>{
                                        this.handleFoodGroupSelect(value, idx)
                                    }}/>
                                <HualalaSelected
                                    itemName="foodName+unit"
                                    selectdTitle={'已选菜品分类'}
                                    value={this.state.foodSelections}
                                    onChange={(value)=>{this.handleFoodSelectedChange(value, idx)}}
                                    onClear = {()=>this.clear(idx)}
                                />
                            </HualalaTreeSelect>
                        </div>
                    </div>
                </div>
            </div>
        );

    }
    //输入框
    handleFoodSearchInputChange(value){
        let {foodCategoryCollection} = this.state;
        if (undefined === foodCategoryCollection ){
            return null;
        }

        if (!((foodCategoryCollection instanceof Array) && foodCategoryCollection.length > 0)) {
            return null;
        }
        let allMatchItem = [];

        foodCategoryCollection.forEach((city)=>{
            city.foodCategoryName.forEach((category)=>{
                category.foods.forEach((food)=>{
                    if (food.foodMnemonicCode.indexOf(value) != -1||food.foodName.indexOf(value) != -1) {
                        allMatchItem.push(food);
                    }
                })
            });
        });

        // update currentSelections according the selections
        let foodCurrentSelections = [];
        allMatchItem.forEach((storeEntity)=>{
            if(this.state.foodSelections.has(storeEntity)){
                foodCurrentSelections.push(storeEntity.itemID)
            }
        });

        this.setState({
            foodOptions: allMatchItem,
            foodCurrentSelections: foodCurrentSelections
        });
    }
    //单击移除等
    handleFoodSelectedChange(value){
        let foodSelections = this.state.foodSelections;
        let foodCurrentSelections = this.state.foodCurrentSelections;

        if (value !== undefined) {
            foodSelections.delete(value);
            foodCurrentSelections = foodCurrentSelections.filter((item) => {
                return item !== value.itemID;
            })
        }

        this.setState({
            foodCurrentSelections: foodCurrentSelections,
            foodSelections: foodSelections
        });
    }
    // GroupSelect 处理函数
    handleFoodGroupSelect(value){
        if (value instanceof Array) {
            // get the selections
            let foodSelections = this.state.foodSelections;
            let foodOptions = this.state.foodOptions;

            // 进行过滤， 并添加新属性
            foodOptions.forEach((shopEntity) => {
                if (value.includes(shopEntity.itemID)) {
                    // TODO: 添加
                    shopEntity.newPrice = shopEntity.newPrice || shopEntity.price;
                    foodSelections.add(shopEntity);
                } else {
                    shopEntity.newPrice = null;
                    // 重置
                    foodSelections.delete(shopEntity)
                }
            });

            this.setState({
                foodCurrentSelections: value,
                foodSelections: foodSelections,
            });
        }
    }
    // 左侧树点击处理函数
    handleFoodTreeNodeChange(value) {
        if (value === undefined || value[0] === undefined) {
            return null;
        }

        let indexArray = parseInt(value[0]);
        let treeData = [];
        this.state.foodCategoryCollection.map((item)=>{
            if(typeof item == 'object') {
                item.foodCategoryName.map((cate)=>{
                    treeData.push(cate)
                })
            }
        });

        let storeOptions=treeData[indexArray].foods.map((item)=>{
            if(typeof item == 'object') {
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

        this.setState({
            foodOptions: storeOptions,
            foodCurrentSelections: foodCurrentSelections
        });

    }
    //清空选择器
    clear(){
        let foodSelections = this.state.foodSelections;

        foodSelections.clear();
        this.setState({
            foodSelections:foodSelections,
            foodCurrentSelections:[],
        });
    }
    //新增一个组合
    addGroup(){
        let {data} = this.state;
        data.push(
            {
                foods: [
                    {
                        foodName: "",
                        unit: '份'
                    }
                ],

                foodsCountInfo: {},

                free: [
                    {
                        foodName: "",
                        unit: '份'
                    }
                ],
                freeCountInfo: {}

            }
        );
        this.setState({data});

    }
    //移除一个组合
    removeGroup(indexInfo){
        let {data} = this.state;
        data.splice(indexInfo[0], 1);
        this.setState({data});
    }

    render() {
        const data = this.state.data;
        let dataSource = [];

        //拼接成DataSource
        data.forEach((groupItem, index)=>{

            let count = groupItem.foods.length;

            let freeCount = groupItem.free.length;
            //key [组合, 购买菜品数, 赠送菜品数, index]
            groupItem.foods.forEach((food, foodIndex)=>{
               let temp = {...food, groupName: `组合${index+1}`, key: `${index}_${count}_${freeCount}_${foodIndex}`};
               dataSource.push(JSON.parse(JSON.stringify(temp)));
            });


            groupItem.free.forEach((freeFood, freeFoodIndex)=>{
                let temp = {...freeFood, groupName: `组合${index+1}`, key: `${index}_${count}_${freeCount}_${count + freeFoodIndex}`};
                dataSource.push(JSON.parse(JSON.stringify(temp)));
            })
        });

        let columns = [
            {
                title: '组合',
                dataIndex: 'collocation',
                key: 'collocation',
                width:120,
                rowSpan: 2,
                className:'TableTxtCenter',
                render: (text, record, index) => {
                    const obj = {
                        children: null,
                        props: {},
                    };

                    let indexInfo = record.key.split("_");
                    //当只有一个组合的时候,只渲染一个"+"号
                    //有多个组合时,最后一个组合 渲染 "-"和"+"
                    //其余的组合 只渲染一个"-"号
                    if(indexInfo[0] == 0 && data.length == 1){
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className = {styles.plus}  type ="plus-circle-o" onClick={this.addGroup}/>
                                </div>
                            </span>
                        );
                    }else if(indexInfo[0] != data.length-1  && data.length > 1){
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className = {styles.delete} type ="minus-circle-o" onClick={() => this.removeGroup(indexInfo)}/>
                                </div>
                            </span>
                        );
                    }else{
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className = {styles.delete} type ="minus-circle-o" onClick={() => this.removeGroup(indexInfo)}/>
                                    <Icon className = {styles.plus}  type ="plus-circle-o" onClick={this.addGroup}/>
                                </div>
                            </span>
                        );
                    }

                    if(indexInfo[3] == 0){
                        obj.props.rowSpan = parseInt(indexInfo[1]) + parseInt(indexInfo[2]);
                    } else {
                        obj.props.rowSpan = 0;
                    }


                    return obj;
                },
            },
            {
                title: '序号',
                dataIndex: 'num',
                key: 'num',
                width:120,
                className:'TableTxtLeft',
                render: (text, record, index) => {
                    let indexInfo = record.key.split("_");
                    //根据index显示序号
                    if(parseInt(indexInfo[3]) < parseInt(indexInfo[1])){
                        return <span>菜品{parseInt(indexInfo[3]) + 1}</span>
                    }else{
                        return <span>赠菜{parseInt(indexInfo[3])- parseInt(indexInfo[1]) + 1}</span>
                    }
                },
            },
            {
                title: '菜品名称',
                dataIndex: 'foodName',
                key: 'foodName',
                width:270,
                className:'TableTxtLeft',
                render: (text, record, index) => {
                    return record.foodName
                }
            },
            {
                title: '数量',
                width:120,
                dataIndex: 'count',
                key: 'count',
                className:'noPadding',
                colSpan:2,
                render: (text, record, index) => {

                    let indexInfo = record.key.split('_'),
                        data = this.state.data,
                        count = null;
                    // count 如果存在就显示设置的count,不存在显示1
                    if(parseInt(indexInfo[3]) < parseInt(indexInfo[1])) { //foods
                        let accountInfo = data[indexInfo[0]].foodsCountInfo;
                        if (record.itemID !== undefined) {
                            count = accountInfo[record.itemID] ? accountInfo[record.itemID] : 1;
                        }
                    }else{ //free
                        let accountInfo = data[indexInfo[0]].freeCountInfo;
                        if (record.itemID !== undefined) {
                            count = accountInfo[record.itemID] ? accountInfo[record.itemID] : 1;
                        }
                    }
                    return (
                        <span className={styles.rightAlign}>

                            <PriceInputIcon
                                key = {'table'+index}
                                type="text"
                                placeholder="请输入数量"
                                modal="int"
                                value = {{number: count}}
                                index={index}
                                onChange = {(val) => {
                                    this.handleCountChange(indexInfo, record, val);
                                }}
                            />
                        </span>
                    )
                }
            },
            {
                title: '份',
                width:20,
                dataIndex: 'unit',
                key: 'unit',
                className:'TableTxtCenter',
                colSpan:0,
                render: (text, record, index) => {
                    return record.unit;
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                width:120,
                className:'TableTxtCenter',
                render: (text, record, index) => {

                    //indexInfo [组合, 购买菜品数, 赠送菜品数, index]
                    let indexInfo = record.key.split("_");

                    const obj = {
                        children: (
                            <div className="editable-row-operations">
                            <span>
                                <a title="添加菜品" alt="添加菜品" onClick={() => this.selectDishes(indexInfo)}>添加菜品</a>
                            </span>
                            </div>
                        ),
                        props: {},
                    };

                    if (indexInfo[3] == 0) { //购买菜品 的rowSpan
                        obj.props.rowSpan = indexInfo[1];
                    } else if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) {
                        obj.props.rowSpan = 0; //购买菜品其他行的rowSpan = 0
                    } else if (indexInfo[3] == indexInfo[1]) {//赠送菜品 的rowSpan
                        obj.props.rowSpan = indexInfo[2]
                    } else if (parseInt(indexInfo[3]) > parseInt(indexInfo[1])) {
                        obj.props.rowSpan = 0;//赠送菜品其他行的rowSpan = 0
                    }

                    return obj;
                },
            }
        ];

        return (
            <FormItem className={[styles.FormItemStyle, styles.noBackground].join(' ')}>
                <Row>
                    <Col>
                        <Table bordered dataSource={dataSource} columns={columns} pagination={false}/>
                    </Col>
                </Row>

                <Modal
                    visible={this.state.visible}
                    onOk={()=>{this.handleOk()}}
                    onCancel={()=>{this.handleCancel()}}
                    width="600px"
                    title="选择特价菜品"
                >
                    <div>
                        {this.renderDishesSelectionBox()}
                    </div>
                </Modal>

            </FormItem>
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        promotionDetailInfo: state.promotionDetailInfo,
        user: state.user.toJS()
    }
};

const mapDispatchToProps = (dispatch)=>{
    return {
        setPromotionDetail: (opts)=>{
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },

        fetchFoodCategoryInfo: (opts)=>{
            dispatch(fetchFoodCategoryInfoAC(opts))
        },

        fetchFoodMenuInfo: (opts) => {
            dispatch(fetchFoodMenuInfoAC(opts))
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CollocationTable);
