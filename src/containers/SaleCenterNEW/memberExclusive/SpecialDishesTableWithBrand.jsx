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
    Modal,
    Button,
    Icon,
    message,
    Spin
} from 'antd';
import BaseForm from 'components/common/BaseForm';
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import FoodSelectModal from '../../../components/common/FoodSelector/FoodSelectModal'
import styles from '../ActivityPage.less'
import PriceInputIcon from '../common/PriceInputIcon';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';
import { messageTemplateState } from 'containers/BasicSettings/reducers';
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
@injectIntl()
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
            modifyModalVisible: false,
            priceFilterType: 'price',
            priceLst,
            data: [],
            formKeys: ['setType', 'discount'],
        }
    }
    componentDidMount() {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            this.mapPriceLstToDataThenEmit()
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.allBrands.size && this.props.allCategories.size && this.props.allDishes.size) {
            if (!prevProps.allBrands.size || !prevProps.allCategories.size || !prevProps.allDishes.size) {
                this.mapPriceLstToDataThenEmit()
            }
        }
        if (this.props.selectedBrands !== prevProps.selectedBrands) {
            if (JSON.stringify(this.props.selectedBrands.toJSON()) !== JSON.stringify(prevProps.selectedBrands.toJSON())) {
                this.setState({
                    data: [],
                });
                this.props.onChange([]);
            }
        }
    }
    mapPriceLstToDataThenEmit = () => {
        const {
            allBrands,
            allCategories,
            allDishes
        } = this.props;
        const { dishes } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes);
        const { priceLst } = this.state;
        if (!priceLst.length) return;
        const data = priceLst.reduce((acc, item) => {
            const dish = dishes.find(d => d.value === `${item.brandID || 0}__${item.foodName}${item.foodUnitName}`);
            if (dish) {
                dish.newPrice = item.price
                dish.salePercent = Number(dish.newPrice) <= 0 ? '0' : Number(dish.newPrice) !== Number(dish.price) ? `${Number((Number(dish.newPrice) / dish.price * 10).toFixed(2))}` : '10'
                acc.push(dish)
            }
            return acc;
        }, [])
        this.setState({ data })
        this.props.onChange(data)
    }
    onPriceCellChange = (val, { index }) => {
        const data = [...this.state.data];
        let num = val.number;
        const record = data[index];
        if (val.number > +record.price) {// 特价不超过售价价
            num = record.price;
        } else if (val.number < 0) {// 特价不小于0
            num = '0';
        }
        record.newPrice = num;
        record.salePercent = (num / record.price * 10).toFixed(2)
        this.setState({ data });
        this.props.onChange(data.map(item => ({ ...item })));
    }
    onPercentCellChange = (val, { index }) => {
        let reg = /^([0-9]*)(\.[0-9]{0,1})?$/
        const data = [...this.state.data];
        let num = val.number;
        const record = data[index];
        if (val.number > 10) {// 折扣不大于10
            num = 10;
        } else if (val.number < 0) {// 折扣不小于0
            num = '0';
        }
        // 保留一位小数
        if (!reg.test(val.number)) {
            num = val.number.slice(0, -1)
        }
        record.salePercent = num;
        record.newPrice = (record.price * num / 10).toFixed(2)
        this.setState({ data });
        this.props.onChange(data.map(item => ({ ...item })));
    }
    handleDel = (record) => {
        const data = [...this.state.data];
        data.splice(record.index, 1);
        this.setState({ data, })
        this.props.onChange(data)
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
            if (dishObj) {
                const reservedDish = this.state.data.find(item => item.value === dishObj.value);
                acc.push(reservedDish ? { ...dishObj, newPrice: reservedDish.newPrice, salePercent: reservedDish.salePercent } : { ...dishObj, salePercent: '10' })
            }
            return acc;
        }, [])
        if(dishObjects.length > 1){
            message.warning('只可添加一项菜品');
            return false
        }
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
    handleModifyDishes = () => {
        this.setState({
            modifyModalVisible: true,
        })
    }
    renderFoodSelectorModal() {
        const {
            allBrands,
            allCategories,
            allDishes,
        } = this.props;
        let { dishes, categories, brands } = memoizedExpandCategoriesAndDishes(allBrands, allCategories, allDishes)
        dishes = dishes.filter((item) => item.isSingleSale == '0' );
        const selectedBrands = this.props.selectedBrands.toJS();
        if (selectedBrands.length) {
            brands = brands.filter(({ value }) => value == 0 || selectedBrands.includes(value))
            categories = categories.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
        }
        const initialValue = this.state.data.map((item) => `${item.brandID || 0}__${item.foodName}${item.unit}`);
        return (
            <Spin spinning={true}>
                <FoodSelectModal
                    allBrands={brands}
                    allCategories={categories}
                    allDishes={dishes}
                    mode="dish"
                    initialValue={initialValue}
                    onOk={this.handleModalOk}
                    onCancel={this.handleModalCancel}
                />
            </Spin>
            
        )
    }
    /**
     * form modal
     */
    handleFormChange = (key, value) => {
        if (key == 'setType') {
            let formKeys = []
            if (value == '1') formKeys = ['setType', 'discount']
            if (value == '2') formKeys = ['setType', 'price']
            this.setState({ formKeys })
        }
    }
    handleOk = () => {
        this.baseForm.validateFields((err, values) => {
            let { setType, discount, price } = values
            if (!err) {
                const data = [...this.state.data];
                if (setType == '1') {
                    let val = { number: discount }
                    data.forEach((item, index) => {
                        this.onPercentCellChange(val, { index })
                    })
                } else {
                    let val = { number: price }
                    data.forEach((item, index) => {
                        this.onPriceCellChange(val, { index })
                    })
                }
                this.setState({ modifyModalVisible: false })
            }
        });
    }

    render() {
        const {
            selectorModalVisible,
            data,
        } = this.state;
        const { intl } = this.props;
        const k6hfzdh8 = intl.formatMessage(SALE_STRING.k6hfzdh8);
        const k5ezdc19 = intl.formatMessage(SALE_STRING.k5ezdc19);
        const k6hfzdpl = intl.formatMessage(SALE_STRING.k6hfzdpl);
        const k5gfsuon = intl.formatMessage(SALE_STRING.k5gfsuon);
        const resultTableColumns = [
            {
                title: COMMON_LABEL.actions,
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <div className="editable-row-operations">
                            <Popconfirm title="确定要删除吗?" onConfirm={() => this.handleDel(record)}>
                                <a title={COMMON_LABEL.delete}>{COMMON_LABEL.delete}</a>
                            </Popconfirm>
                        </div>
                    );
                },
            },
            {
                title: SALE_LABEL.k5dlpn4t,
                dataIndex: 'brandName',
                key: 'brandName',
                width: 72,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
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
                width: 120,
                className: 'TableTxtCenter',
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
                title: '原价',
                width: 80,
                dataIndex: 'newPrice',
                key: 'newPrice',
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            }
        ];
        const displayDataSource = data.map((item, index) => ({ ...item, index }))

        return (
            <FormItem className={styles.FormItemStyle}>
                {displayDataSource.length == 0 ? 
                    <Row className={styles.addFoodWrapper}>
                        <Col span={4} offset={0}>
                            <Button
                                className={styles.addFoodBtn}
                                onClick={this.handleSelectDishes}
                            >
                                <Icon type="plus" /> {'添加菜品'}
                            </Button>
                        </Col>
                    </Row> : null
                }
                {
                    displayDataSource.length > 0 ?  <Row className={styles.foodTableList}>
                        <Col>
                            <Table
                                bordered={true}
                                dataSource={displayDataSource}
                                columns={resultTableColumns}
                                pagination={false}
                            />
                        </Col>
                    </Row> : null
                }

                {selectorModalVisible && this.renderFoodSelectorModal()}
            </FormItem>
        )
    }
}

export default connect(mapStateToProps)(SpecialDishesTableWithBrand);
