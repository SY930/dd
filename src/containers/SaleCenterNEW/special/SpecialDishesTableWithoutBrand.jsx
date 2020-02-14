import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Table,
    Form,
    Tooltip,
    Popconfirm,
    Select,
} from 'antd';
import {
    memoizedShopCategoriesAndDishes,
} from '../../../utils';
import FoodSelectModal from '../../../components/common//FoodSelector/ShopFoodSelectModal'
import styles from '../ActivityPage.less'
import PriceInputIcon from '../common/PriceInputIcon';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from '../IntlDecor';
const FormItem = Form.Item;

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
}
@injectIntl()
class SpecialDishesTableWithoutBrand extends Component {
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
            priceFilterType: 'price',
            priceLst,
            data: [],
        }
    }
    componentDidMount() {
        if (this.props.allCategories.size && this.props.allDishes.size) {
            this.mapPriceLstToDataThenEmit()
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.allCategories.size && this.props.allDishes.size) {
            if (!prevProps.allCategories.size || !prevProps.allDishes.size) {
                this.mapPriceLstToDataThenEmit()
            }
        }
    }
    mapPriceLstToDataThenEmit = () => {
        const {
            allCategories,
            allDishes
        } = this.props;
        const { dishes } = memoizedShopCategoriesAndDishes(allCategories, allDishes);
        const { priceLst } = this.state;
        if (!priceLst.length) return;
        const data = priceLst.reduce((acc, item) => {
            const dish = dishes.find(d => d.value === `${item.foodName}${item.foodUnitName}`);
            dish && (dish.newPrice = item.price, acc.push(dish));
            return acc;
        }, [])
        this.setState({ data })
        this.props.onChange(data)
    }
    onCellChange = (val, {index}) => {
        const data = [...this.state.data];
        let num = val.number;
        const record = data[index];
        if (val.number > +record.price) {// 特价不超过售价价
            num = record.price;
        }else if (val.number < 0) {// 特价不小于0
            num = '0';
        }
        record.newPrice = num;
        this.setState({data});
        this.props.onChange(data.map(item => ({...item})));
    }
    handleDel = (record) => {
        const data = [...this.state.data];
        data.splice(record.index, 1);
        this.setState({data})
        this.props.onChange(data)
    };
    handleModalOk = (v) => {
        const {
            allCategories,
            allDishes,
        } = this.props;
        const { dishes } = memoizedShopCategoriesAndDishes(allCategories, allDishes);
        const dishObjects = v.reduce((acc, curr) => {
            const dishObj = dishes.find(item => item.value === curr);
            if (dishObj) {
                const reservedDish = this.state.data.find(item => item.value === dishObj.value);
                acc.push(reservedDish ? {...dishObj, newPrice: reservedDish.newPrice} : dishObj)
            }
            return acc;
        }, [])
        this.setState({
            selectorModalVisible: false,
            data: dishObjects,
        })
        this.props.onChange(dishObjects)
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
            allCategories,
            allDishes,
        } = this.props;
        let { dishes, categories} = memoizedShopCategoriesAndDishes(allCategories, allDishes)
        const initialValue = this.state.data.map((item) => `${item.foodName}${item.unit}`);
        return (
            <FoodSelectModal
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
        const { intl } = this.props;
        const k6hfzdh8 = intl.formatMessage(SALE_STRING.k6hfzdh8);
        const k5ezdc19 = intl.formatMessage(SALE_STRING.k5ezdc19);
        const k6hfzdpl = intl.formatMessage(SALE_STRING.k6hfzdpl);
        const k6delete = intl.formatMessage(COMMON_STRING.delete);
        const k5gfsuon = intl.formatMessage(SALE_STRING.k5gfsuon);
        const {
            selectorModalVisible,
            data,
        } = this.state;
        const resultTableColumns = [
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'index',
                key: 'index',
                width: 50,
                className: 'TableTxtCenter',
                render: (text) => `${text + 1}`,
            },
            {
                title: COMMON_LABEL.actions,
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <Popconfirm title={SALE_LABEL.k5dnw1q3} onConfirm={() => this.handleDel(record)}>
                                <a title={k6delete} alt="">{k6delete}</a>
                            </Popconfirm>
                        </div>
                    );
                },
            },
            {
                title: SALE_LABEL.k5gfsugb,
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: SALE_LABEL.k5gfsuon,
                dataIndex: 'foodName',
                key: 'foodName',
                width: 90,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: SALE_LABEL.k5kqz279,
                dataIndex: 'unit',
                key: 'unit',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: SALE_LABEL.k6hdpwkx,
                width: 80,
                dataIndex: 'newPrice',
                key: 'newPrice',
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <span className={styles.rightAlign}>
                            <PriceInputIcon
                                type="text"
                                modal="float"
                                placeholder={k6hfzdh8}
                                value={{ number: record.newPrice }}
                                index={index}
                                onChange={(val) => { this.onCellChange(val, record) }}
                            />
                        </span>
                    )
                },
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Select
                            style={{ width: 86, left: -63 }}
                            value={this.state.priceFilterType}
                            getPopupContainer={(node) => node.parentNode}
                            onChange={v => {
                                const newData = this.state.data.map(food => {
                                    food.newPrice = food[v] >= 0 ? food[v] : food.price; // 将newPrice变为对应option价
                                    return food
                                })
                                this.setState({ priceFilterType: v, data: newData })
                            }}
                        >
                            <Select.Option key='price' value="price">{SALE_LABEL.k5kqz2fl}</Select.Option>
                            <Select.Option key='vipPrice' value="vipPrice">{SALE_LABEL.k5m4q0r2}</Select.Option>
                        </Select>
                    </div>
                ),
                filterDropdownVisible: this.state.filterDropdownVisible,
                onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }),
            },
            {
                // 本组件接收到的售价已经是处理过的了
                title: SALE_LABEL.k6hdpwt9,
                dataIndex: 'price',
                key: 'price',
                width: 72,
                className: 'TableTxtRight',
            },
            {
                title: SALE_LABEL.k5ezcu1b,
                dataIndex: 'salePercent',
                key: 'salePercent',
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return Number(record.newPrice) <= 0 ? '0'+k5ezdc19 : Number(record.newPrice) !== Number(record.price) ? `${Number((Number(record.newPrice) / record.price * 10).toFixed(1))}${k5ezdc19}` : k6hfzdpl
                },
            },
        ];
        const displayDataSource = data.map((item, index) => ({...item, index}));
        return (
            <FormItem className={styles.FormItemStyle}>
                <Row>
                    <Col span={5}>
                        <span className={styles.gTitle}>{SALE_LABEL.k6hdpwcl}</span>
                    </Col>
                    <Col span={9} offset={10}>
                        <a
                            className={styles.gTitleLink}
                            onClick={this.handleSelectDishes}
                        >
                            {SALE_LABEL.k5gfsv5b}{k5gfsuon}
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            bordered={true}
                            dataSource={displayDataSource}
                            columns={resultTableColumns}
                            pagination={{ size: 'small', pageSize: 10 }}
                        />
                    </Col>
                </Row>
                {selectorModalVisible && this.renderFoodSelectorModal()}
            </FormItem>
        )
    }
}

export default connect(mapStateToProps)(SpecialDishesTableWithoutBrand);
