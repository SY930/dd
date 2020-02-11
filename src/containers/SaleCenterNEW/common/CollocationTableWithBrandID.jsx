import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Table,
    Form,
    Icon,
    Tooltip,
} from 'antd';
import styles from '../ActivityPage.less';
import PriceInputIcon from './PriceInputIcon'; // 编辑
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import FoodSelectModal from '../../../components/common/FoodSelector/FoodSelectModal';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';

const FormItem = Form.Item;

const mapStateToProps = (state) => {
    return {
        type: state.sale_promotionBasicInfo_NEW.getIn(['$basicInfo', 'promotionType']),
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        priceLst: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'priceLst']),
        scopeLst: state.sale_promotionDetailInfo_NEW.getIn(['$promotionDetail', 'scopeLst']),
        /** 基础营销活动范围中设置的品牌 */
        selectedBrands: state.sale_promotionScopeInfo_NEW.getIn(['$scopeInfo', 'brands']),
        /** 基本档获取的所有品牌（由店铺schema接口获取，所以似乎品牌下没有店铺的话不会在这里？） */
        allBrands: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'brands']),
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
};



@injectIntl()
class CollocationTableWithBrandID extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            dataSource: [],
            /** 点开菜品对话框时，记录信息，便于 确定 时处理 */
            currentFoodValues: [],
            currentEditingIndex: 0,
            currentEditingType: 'foods',
            data: JSON.parse(JSON.stringify(this.DEFAULT_DATA)),
        }
    }
    getDefaultStageData = () => {
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        return {
            // foods存放购买菜品的foodInfo
            foods: [
                {
                    foodName: '',
                    unit: k5ez4qy4,
                },
            ],
            foodsCountInfo: {}, // 购买菜品对应的count {[item.value]: countNum}
            // free存放赠送菜品的foodInfo
            free: [
                {
                    foodName: '',
                    unit: k5ez4qy4,
                },
            ],
            freeCountInfo: {}, // 赠送菜品对应的count {[item.value]: countNum}
        };
    }
    DEFAULT_DATA = [
        this.getDefaultStageData(),
    ];
    componentDidMount() {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            this.mapPriceScopeLstToDataThenEmit()
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            if (!prevProps.allBrands.size || !prevProps.allCategories.size || !prevProps.allDishes.size) {
                this.mapPriceScopeLstToDataThenEmit()
            }
        }
        if (this.props.selectedBrands !== prevProps.selectedBrands) {
            if (JSON.stringify(this.props.selectedBrands.toJSON()) !== JSON.stringify(prevProps.selectedBrands.toJSON())) {
                const data = JSON.parse(JSON.stringify(this.DEFAULT_DATA));
                this.setState({data});
                this.props.onChange(data);
            }
        }
    }
    mapPriceScopeLstToDataThenEmit = () => { // 只触发一次
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);

        let {
            allBrands,
            allCategories,
            allDishes,
            priceLst,
            scopeLst,
            prices,
            scopes,
            type,
        } = this.props;
        if (type === '5010') { // 菜品推荐活动，改为不直接从store取值，从父组件处理过后传递给本组件
            priceLst = prices;
            scopeLst = scopes;
            if (!scopeLst.length) return;
        } else {
            if (!scopeLst.size) return;
            priceLst = priceLst.toJS();
            scopeLst = scopeLst.toJS();
        }
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        let data = [];
        priceLst.forEach((price) => {
            if (!data[price.stageNo]) {
                data[price.stageNo] = {
                    foods: [],
                    foodsCountInfo: {}, // 购买菜品对应的count {itemID: countNum}
                    free: [],
                    freeCountInfo: {}, // 赠送菜品对应的count {itemID: countNum}
                };
            }
            const matchedDish = dishes
                .find(dish => dish.value === `${price.brandID || 0}__${price.foodName}${price.foodUnitName}`);
            if (matchedDish) {
                data[price.stageNo].free.push(matchedDish);
                data[price.stageNo].freeCountInfo[matchedDish.value] = price.num;
            } else {
                data[price.stageNo].free.push({
                    foodName: '',
                    unit: k5ez4qy4,
                },);
            }
        });
        scopeLst.forEach((scope) => {
            if (!data[scope.stageNo]) {
                data[scope.stageNo] = {
                    foods: [],
                    foodsCountInfo: {}, // 购买菜品对应的count {itemID: countNum}
                    free: [],
                    freeCountInfo: {}, // 赠送菜品对应的count {itemID: countNum}
                };
            }
            const matchedDish = dishes
                .find(dish => dish.value === `${scope.brandID || 0}__${scope.targetName}${scope.targetUnitName}`);
            if (matchedDish) {
                data[scope.stageNo].foods.push(matchedDish);
                data[scope.stageNo].foodsCountInfo[matchedDish.value] = scope.num;
            } else {
                data[scope.stageNo].foods.push({
                    foodName: '',
                    unit: k5ez4qy4,
                },);
            }
        })
        data = data.filter(item => !!item)
        this.setState({ data });
        this.props.onChange(data);
    }
    addGroup = () => {
        const { data } = this.state;
        this.props.type == '5010' && data.length >= 50 ? null : data.push(getDefaultStageData());
        this.setState({ data });
        this.props.onChange(data);
    }
    // 点击添加菜品操作
    selectDishes = (indexInfo) => {
        const { data } = this.state;
        // 把已选的数据放到foodSelectiions里
        if (indexInfo[3] === '0') { // foods
            this.setState({
                modalVisible: true,
                currentEditingType: 'foods',
                currentEditingIndex: +indexInfo[0],
                currentFoodValues: data[indexInfo[0]].foods
                    .filter(item => !!item.value)
                    .map(food => food.value),
            });
        } else if (indexInfo[1] === indexInfo[3]) { // free
            this.setState({
                modalVisible: true,
                currentEditingType: 'free',
                currentEditingIndex: +indexInfo[0],
                currentFoodValues: data[indexInfo[0]].free
                    .filter(item => !!item.value)
                    .map(free => free.value),
            });
        }
    }
    // 移除一个组合
    removeGroup = (indexInfo) => {
        const { data } = this.state;
        data.splice(indexInfo[0], 1);
        this.setState({ data });
        this.props.onChange(data);
    }
    dishFilter = (dishArray) => {
        return dishArray.filter(fish => fish.isSetFood != '1' && fish.isTempFood != '1' && fish.isTempSetFood != '1')
    }
    // 数量变化
    handleCountChange = (indexInfo, record, count) => {
        const data = this.state.data;
        // food
        if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) {
            data[indexInfo[0]].foodsCountInfo[record.value] = count.number>=1 ? count.number : 1;
        }
        // free
        if (parseInt(indexInfo[3]) >= parseInt(indexInfo[1])) {
            data[indexInfo[0]].freeCountInfo[record.value] = count.number>=1 ? count.number : 1;
        }
        this.setState({ data });
        this.props.onChange(data);
    }
    handleModalCancel = () => {
        this.setState({
            currentFoodValues: [],
            currentEditingIndex: 0,
            currentEditingType: 'foods',
            modalVisible: false,
        })
    }
    handleModalOk = (v) => {
        const { intl } = this.props;
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);
        const {
            currentEditingIndex,
            currentEditingType,
            data,
        } = this.state;
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const dishObjects = v.reduce((acc, curr) => {
            const dishObj = dishes.find(item => item.value === curr);
            dishObj && acc.push(dishObj);
            return acc;
        }, []);
        data[currentEditingIndex][currentEditingType] = dishObjects.length ? [...dishObjects] : [{
            foodName: '',
            unit: k5ez4qy4,
        }];
        this.setState({
            data,
            currentFoodValues: [],
            currentEditingIndex: 0,
            currentEditingType: 'foods',
            modalVisible: false,
        })
        this.props.onChange(data);
    }
    renderFoodSelectorModal() {
        const {
            allBrands,
            allCategories,
            allDishes,
            type,
        } = this.props;
        let { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const selectedBrands = this.props.selectedBrands.toJS();
        if (selectedBrands.length) {
            brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
            categories = categories.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
        }
        if (type == '1040' && this.state.currentEditingType === 'free') {
            dishes = this.dishFilter(dishes)
        }
        const initialValue = this.state.currentFoodValues;
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                multiple={type!='5010' || this.state.currentEditingType === 'free'}
                mode="dish"
                initialValue={initialValue}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
            />
        )
    }
    render() {
        const { intl } = this.props;
        const k5m6e5c3 = intl.formatMessage(SALE_STRING.k5m6e5c3);
        const k5m6e5kf = intl.formatMessage(SALE_STRING.k5m6e5kf);
        const k5gfsugb = intl.formatMessage(SALE_STRING.k5gfsugb);

        const k5ezdbiy = intl.formatMessage(SALE_STRING.k5ezdbiy);
        const k5ez4qy4 = intl.formatMessage(SALE_STRING.k5ez4qy4);

        const k5gfsuon = intl.formatMessage(SALE_STRING.k5gfsuon);
        const k5m6e69f = intl.formatMessage(SALE_STRING.k5m6e69f);
        const k5m6e6hr = intl.formatMessage(SALE_STRING.k5m6e6hr);
        const k5m6e6q3 = intl.formatMessage(SALE_STRING.k5m6e6q3);
        const dataSource = [];
        // 拼接成DataSource
        const data = this.state.data;
        data.forEach((groupItem, index) => {
            const count = groupItem.foods.length;
            const freeCount = groupItem.free.length;
            // key [组合, 购买菜品数, 赠送菜品数, index]
            groupItem.foods.forEach((food, foodIndex) => {
                const temp = { ...food, groupName: `${k5m6e5kf}${index + 1}`, key: `${index}_${count}_${freeCount}_${foodIndex}` };
                dataSource.push(JSON.parse(JSON.stringify(temp)));
            })
            // 兼容套餐菜品被过滤不渲染表格
            freeCount > 0 ? groupItem.free.forEach((freeFood, freeFoodIndex) => {
                const temp = { ...freeFood, groupName: `${k5m6e5kf}${index + 1}`, key: `${index}_${count}_${freeCount}_${count + freeFoodIndex}` };
                dataSource.push(JSON.parse(JSON.stringify(temp)));
            }) : dataSource.push({ groupName: `${k5m6e5kf}${index + 1}`, key: `${index}_${count}_1_${count + 0}` })
        });
        const numInput = {
            title: k5m6e5c3,
            width: 160,
            dataIndex: 'count',
            key: 'count',
            className: 'noPadding',
            colSpan: 1,
            render: (text, record, index) => {
                let indexInfo = record.key.split('_'),
                    data = this.state.data,
                    count = null;
                // count 如果存在就显示设置的count,不存在显示1
                if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) { // foods
                    const accountInfo = data[indexInfo[0]].foodsCountInfo;
                    if (record.value !== undefined) {
                        count = accountInfo[record.value] ? accountInfo[record.value] : 1;
                    }
                } else { // free
                    const accountInfo = data[indexInfo[0]].freeCountInfo;
                    if (record.value !== undefined) {
                        count = accountInfo[record.value] ? accountInfo[record.value] : 1;
                    }
                }
                return (
                    <span className={styles.rightAlign}>
                        <PriceInputIcon
                            key={`table${index}`}
                            type="text"
                            placeholder=""
                            modal="int"
                            value={{ number: count }}
                            index={index}
                            onChange={(val) => {
                                this.handleCountChange(indexInfo, record, val);
                            }}
                        />
                    </span>
                )
            },
        }
        const columns = [
            {
                title: k5m6e5kf,
                dataIndex: 'collocation',
                key: 'collocation',
                width: 120,
                rowSpan: 2,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    const obj = {
                        children: null,
                        props: {},
                    };
                    const indexInfo = record.key.split('_');
                    if (indexInfo[0] == 0 && data.length == 1) {
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className={styles.plus} type="plus-circle-o" onClick={this.addGroup} />
                                </div>
                            </span>
                        );
                    } else if (indexInfo[0] != data.length - 1 && data.length > 1) {
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className={styles.delete} type="minus-circle-o" onClick={() => this.removeGroup(indexInfo)} />
                                </div>
                            </span>
                        );
                    } else {
                        obj.children = (
                            <span>
                                {record.groupName}
                                <div className={styles.iconsStyle}>
                                    <Icon className={styles.delete} type="minus-circle-o" onClick={() => this.removeGroup(indexInfo)} />
                                    <Icon className={styles.plus} type="plus-circle-o" onClick={this.addGroup} />
                                </div>
                            </span>
                        );
                    }
                    if (indexInfo[3] == 0) {
                        obj.props.rowSpan = parseInt(indexInfo[1]) + parseInt(indexInfo[2]);
                    } else {
                        obj.props.rowSpan = 0;
                    }
                    return obj;
                },
            },
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'num',
                key: 'num',
                width: 120,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    const indexInfo = record.key.split('_');
                    // 根据index显示序号
                    if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) {
                        return <span>{this.props.type == '5010' ? k5m6e69f : k5gfsuon}{parseInt(indexInfo[3]) + 1}</span>
                    }
                    return <span>{this.props.type == '5010' ? k5m6e6hr : k5m6e6q3}{parseInt(indexInfo[3]) - parseInt(indexInfo[1]) + 1}</span>
                },
            },
            {
                title: SALE_LABEL.k5dlpn4t,
                dataIndex: 'brandName',
                key: 'brandName',
                width: 100,
                className: 'TableTxtLeft',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: k5gfsugb,
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 60,
                className: 'TableTxtLeft',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: SALE_LABEL.k5m6e5sr,
                dataIndex: 'foodName',
                key: 'foodName',
                width: 120,
                className: 'TableTxtLeft',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: SALE_LABEL.k5m4pzd2,
                width: 120,
                dataIndex: 'unit',
                key: 'unit',
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    const span = `${record.prePrice==-1?record.price:record.prePrice || ''}${k5ezdbiy}/${record.unit || k5ez4qy4}`
                    return <Tooltip title={span}>{span}</Tooltip>;
                },
            },
            {
                title: COMMON_LABEL.actions,
                dataIndex: 'operation',
                key: 'operation',
                width: 100,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    // indexInfo [组合, 购买菜品数, 赠送菜品数, index]
                    const indexInfo = record.key.split('_');
                    const obj = {
                        children: (
                            <div className="editable-row-operations">
                                <span>
                        <a title="" alt="" onClick={() => this.selectDishes(indexInfo)}>{SALE_LABEL.k5m6e613}</a>
                                </span>
                            </div>
                        ),
                        props: {},
                    };
                    if (indexInfo[3] == 0) { // 购买菜品 的rowSpan
                        obj.props.rowSpan = indexInfo[1];
                    } else if (parseInt(indexInfo[3]) < parseInt(indexInfo[1])) {
                        obj.props.rowSpan = 0; // 购买菜品其他行的rowSpan = 0
                    } else if (indexInfo[3] == indexInfo[1]) { // 赠送菜品 的rowSpan
                        obj.props.rowSpan = indexInfo[2]
                    } else if (parseInt(indexInfo[3]) > parseInt(indexInfo[1])) {
                        obj.props.rowSpan = 0;// 赠送菜品其他行的rowSpan = 0
                    }
                    return obj;
                },
            },
        ];
        this.props.type == '5010' ? null : columns.splice(5, 0, numInput);
        const { modalVisible } = this.state;
        return (
            <FormItem className={[styles.FormItemStyle, styles.noBackground].join(' ')}>
                <Row>
                    <Col>
                        <Table bordered={true} dataSource={dataSource} columns={columns} pagination={false} />
                    </Col>
                </Row>
                {modalVisible && this.renderFoodSelectorModal()}
            </FormItem>
        )
    }
}
export default connect(mapStateToProps)(CollocationTableWithBrandID);
