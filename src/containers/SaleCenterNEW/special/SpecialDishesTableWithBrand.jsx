import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Table,
    Input,
    message,
    Modal,
    Form,
    Popconfirm,
} from 'antd';
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import FoodSelectModal from '../../../components/common/FoodSelector/FoodSelectModal'
import styles from '../ActivityPage.less'
import PriceInputIcon from '../common/PriceInputIcon';

const FormItem = Form.Item;

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        /** 基础营销活动范围中设置的品牌 */
        selectedBrands: state.sale_promotionScopeInfo_NEW.getIn(['$scopeInfo', 'brands']),
        /** 基本档获取的所有品牌（由店铺schema接口获取，所以似乎品牌下没有店铺的话不会在这里？） */
        allBrands: state.sale_promotionScopeInfo_NEW.getIn(['refs', 'data', 'brands']),
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setPromotionDetail: (opts) => {
            dispatch(saleCenterSetPromotionDetailAC(opts))
        },
    }
}

class SpecialDishesTableWithBrand extends Component {

    constructor(props) {
        super(props);
        let priceLst;
        try {
            priceLst = props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        } catch (e) {
            priceLst = []
        }
        this.state = {
            selectorModalVisible: false,
            priceLst,
            data: [],
            resultTableColumns: [
                {
                    title: '序号',
                    dataIndex: 'index',
                    key: 'index',
                    // fixed: 'left',
                    width: 50,
                    className: 'TableTxtCenter',
                    render: (text) => `${text + 1}`,
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    // fixed: 'left',
                    width: 50,
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return (
                            <div className="editable-row-operations">
                                <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(record)}>
                                    <a title="删除" alt="删除">删除</a>
                                </Popconfirm>
                            </div>
                        );
                    },
                },
                {
                    title: '品牌',
                    dataIndex: 'brandName',
                    key: 'brandName',
                    width: 72,
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return <span title={text}>{text}</span>
                    },
                },
                {
                    title: '分类',
                    dataIndex: 'foodCategoryName',
                    key: 'foodCategoryName',
                    width: 100,
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return <span title={text}>{text}</span>
                    },
                },
                {
                    title: '菜品',
                    dataIndex: 'foodName',
                    key: 'foodName',
                    // fixed: 'left',
                    width: 80,
                    className: 'TableTxtLeft',
                    render: (text, record, index) => {
                        return <span title={text}>{text}</span>
                    },
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                    key: 'unit',
                    // fixed: 'left',
                    width: 50,
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return <span title={text}>{text}</span>
                    },
                },
                {
                    title: '特价(元)',
                    width: 80,
                    dataIndex: 'newPrice',
                    key: 'newPrice',
                    className: 'noPadding',
                    render: (text, record, index) => {
                        // return Number(record.newPrice) <= 0 ? 0 : Number(record.newPrice)
                        return (
                            <span className={styles.rightAlign}>
                                <PriceInputIcon
                                    type="text"
                                    modal="float"
                                    value={{ number: record.newPrice == -1 ? record.price : record.newPrice }}
                                    index={index}
                                    onChange={(val) => { this.onCellChange(val, record) }}
                                />
                            </span>
                        )
                    },
                },
                {
                    // 本组件接收到的售价已经是处理过的了
                    title: '售价(元)',
                    dataIndex: 'price',
                    key: 'price',
                    width: 72,
                    className: 'TableTxtRight',
                },
                {
                    title: '折扣',
                    dataIndex: 'salePercent',
                    key: 'salePercent',
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return Number(record.newPrice) <= 0 ? '0折' : Number(record.newPrice) !== Number(record.price) ? `${Number((Number(record.newPrice) / record.price * 10).toFixed(1))}折` : '不打折'
                    },
                },
            ],
        }
    }
    dishFilter = (dishArray) => {
        return dishArray.filter(fish => fish.isSetFood != '1' && fish.isTempFood != '1' && fish.isTempSetFood != '1')
    }
    onCellChange = (val, {index}) => {
        const record = this.state.data[index];
        if (val.number > record.price) {// 特价不超过原价
            val.number = record.price;
        }else if (val.number < 0) {// 特价不小于0
            val.number = 0;
        }
        record.newPrice = val.number;
        this.setState({data: this.state.data })
    }
    handleDel = (record) => {
        const data = [...this.state.data];
        data.splice(record.index, 1);
        this.setState({data})
    };
    handleModalOk = (v) => {
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
        }, [])
        this.setState({
            selectorModalVisible: false,
            data: dishObjects,
        })
    }
    handleModalCancel = () => {
        this.setState({
            selectorModalVisible: false,
        })
    }
    handleSelectDishes = () => {
        this.setState({
            selectorModalVisible: true,
        })
    }
    renderFoodSelectorModal() {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        let { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        const selectedBrands = this.props.selectedBrands.toJS();
        if (selectedBrands.length) {
            brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
            categories = categories.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({brandID: value}) => value == 0 || selectedBrands.includes(value))
        }
        dishes = this.dishFilter(dishes)
        const initialValue = this.state.priceLst.map((item) => `${item.brandID || 0}__${item.foodName}${item.foodUnitName}`);
        return (
            <FoodSelectModal
                allBrands={brands}
                allCategories={categories}
                allDishes={dishes}
                mode="dish"
                initialValue={initialValue}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
            />
        )
    }
    render() {
        const {
            resultTableColumns,
            selectorModalVisible,
            data,
        } = this.state;
        const displayDataSource = data.map((item, index) => ({...item, index}))
        return (
            <FormItem className={styles.FormItemStyle}>
                <Row>
                    <Col span={2}>
                        <span className={styles.gTitle}>选择菜品</span>
                    </Col>
                    <Col span={4} offset={18}>
                        <a
                            className={styles.gTitleLink}
                            onClick={this.handleSelectDishes}
                        >
                            批量添加菜品
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            bordered={true}
                            dataSource={displayDataSource}
                            columns={resultTableColumns}
                            // scroll={{ x: 650 }}
                            pagination={{ size: 'small', pageSize: 10 }}
                        />
                    </Col>
                </Row>
                {selectorModalVisible && this.renderFoodSelectorModal()}
            </FormItem>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpecialDishesTableWithBrand);
