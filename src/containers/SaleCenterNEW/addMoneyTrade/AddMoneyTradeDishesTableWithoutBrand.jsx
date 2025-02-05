import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Row,
    Col,
    Table,
    Form,
    Tooltip,
    Popconfirm,
    Icon,
} from 'antd';
import {
    memoizedShopCategoriesAndDishes,
} from '../../../utils';
import { ShopFoodSelectModal } from '../../../components/common/FoodSelector'
import styles from '../ActivityPage.less'
import PriceInputIcon from '../common/PriceInputIcon';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';
import  SortableTable from '../common/SortableTable'

const FormItem = Form.Item;

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        allCategories: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'categories']),
        allDishes: state.sale_promotionDetailInfo_NEW.getIn(['$categoryAndFoodInfo', 'dishes']),
    }
}

@injectIntl()
class AddMoneyTradeDishesTableWithoutBrand extends Component {
    constructor(props) {
        super(props);
        let priceLst;
        const { legacyPayPrice } = props;
        try {
            priceLst = props.promotionDetailInfo.getIn(['$promotionDetail', 'priceLst']).toJS();
        } catch (e) {
            priceLst = []
        }
        // payPrice 不可为0， 为0的都是历史数据，需要把props传入的payPrice赋值给每个对象
        if (priceLst[0] && priceLst[0].payPrice == 0) {
            priceLst.forEach(item => {
                item.payPrice = legacyPayPrice
            })
        }
        this.state = {
            selectorModalVisible: false,
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
            dish && acc.push({ ...dish, payPrice: item.payPrice, weightOffset: item.weightOffset, maxNum: item.maxNum });
            return acc;
        }, [])
        this.setState({ data })
        this.props.onChange(data)
    }
    onCellChange = (val, { index }) => {
        const data = [...this.state.data];
        let num = val.number;
        const record = data[index];
        if (val.number > +record.price) {// 特价不超过售价价
            num = record.price;
        } else if (val.number < 0) {// 特价不小于0
            num = '0';
        }
        record.payPrice = num;
        this.setState({ data });
        this.props.onChange(data.map(item => ({ ...item })));
    }
    handleDel = (record) => {
        const data = [...this.state.data];
        data.splice(record.index, 1);
        this.setState({ data })
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
                acc.push(reservedDish ? { ...dishObj, payPrice: reservedDish.payPrice, maxNum: reservedDish.payPrice, } : dishObj)
            }
            return acc;
        }, [])
        this.setState({
            selectorModalVisible: false,
            data: dishObjects,
        })
        dishObjects.map((i) => {
            if (!i.maxNum) {
                i.maxNum = 1
            }
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
        const { dishes, categories } = memoizedShopCategoriesAndDishes(allCategories, allDishes)
        const initialValue = this.state.data.map((item) => `${item.foodName}${item.unit}`);
        return (
            <ShopFoodSelectModal
                allCategories={categories}
                allDishes={dishes}
                mode="dish"
                initialValue={initialValue}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
            />
        )
    }

    onFloatChange = (val, { index }) => {
        const data = [...this.state.data];
        let num = val.number;
        const record = data[index];
        if (val.number >= 0) {// 特价不超过售价价
            num = val.number;
        } else if (val.number < 0) {// 特价不小于0
            num = '0';
        }
        record.weightOffset = num;
        this.setState({ data });
        this.props.onChange(data.map(item => ({ ...item })));
    }

    onFloatMaxNumChange = (val, { index }) => {
        const data = [...this.state.data];
        let num = val.number;
        const record = data[index];
        record.maxNum = num;
        this.setState({ data });
        this.props.onChange(data.map(item => ({ ...item })));
    }

    handleSort = (arr) => {
        const {
            data = []
        } = this.state
        let temp = arr.map((item) => {
            return data[item]
        })
        this.setState({
            data: temp,
        })
        this.props.onChange(temp)
    }

    render() {
        const {
            selectorModalVisible,
            data,
        } = this.state;
        const {
            calType = 0,
        } = this.props
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
                        <div>
                            <Popconfirm title={SALE_LABEL.k5dnw1q3} onConfirm={() => this.handleDel(record)}>
                                <a title={COMMON_LABEL.delete}>清除</a>
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
                // 本组件接收到的售价已经是处理过的了
                title: '售价(元)',
                dataIndex: 'price',
                key: 'price',
                width: 72,
                className: 'TableTxtRight',
                render: (text, record, index) => {
                    return <Tooltip title={text}>{text}</Tooltip>
                },
            },
            {
                title: calType == 1 ? '减免价(元)' : '活动价(元)',
                width: 80,
                dataIndex: 'payPrice',
                key: 'payPrice',
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <div
                            style={(record.payPrice > 0) && (+record.payPrice <= +record.price) ? { height: '100%' } : { height: '100%', border: '1px solid #f04134' }}
                            className={styles.rightAlign}
                        >
                            <PriceInputIcon
                                type="text"
                                modal="float"
                                placeholder={SALE_STRING.k5hkj1ef}
                                value={{ number: record.payPrice }}
                                index={index}
                                onChange={(val) => { this.onCellChange(val, record) }}
                            />
                        </div>
                    )
                },
            },
            {
                title:
                    <span>最大换购数量
                        <Tooltip title={'称重菜品仅支持POS2.5'}>
                            <Icon
                                style={{
                                    marginLeft: 3,
                                    cursor: 'pointer',
                                }}
                                type="question-circle"
                            />
                        </Tooltip>
                    </span>,
                width: 110,
                dataIndex: 'maxNum',
                key: 'maxNum',
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <div
                            style={(record.maxNum > 0) ? { height: '90%', padding: '0px 5px' } : { height: '100%', border: '1px solid #f04134', padding: '0px 5px' }}
                            className={styles.rightAlign}
                        >
                            <PriceInputIcon
                                type="text"
                                modal={record.IsNeedConfirmFoodNumber ? "float" : "int"}
                                // disabled={!record.IsNeedConfirmFoodNumber}
                                value={{ number: record.maxNum }}
                                index={index}
                                prefix={'±'}
                                onChange={(val) => { this.onFloatMaxNumChange(val, record) }}
                            />
                        </div>
                    )
                },
            },
            {
                title:
                    <span>称重误差值(份)
                        <Tooltip title={'仅支持POS2.5，仅“需要确定数量”的菜品才能编辑称重误差值，其他菜品不能编辑此项'}>
                            <Icon
                                style={{
                                    marginLeft: 3,
                                    cursor: 'pointer',
                                }}
                                type="question-circle"
                            />
                        </Tooltip>
                    </span>,
                width: 110,
                dataIndex: 'weightOffset',
                key: 'weightOffset',
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <div
                            style={{ height: '100%', }}
                            className={styles.rightAlign}
                        >
                            <PriceInputIcon
                                type="text"
                                modal="float"
                                disabled={!record.IsNeedConfirmFoodNumber}
                                value={{ number: record.weightOffset }}
                                index={index}
                                prefix={'±'}
                                onChange={(val) => { this.onFloatChange(val, record) }}
                            />
                        </div>
                    )
                },
            },
        ];
        const displayDataSource = data.map((item, index) => ({ ...item, index }))
        return (
            <FormItem className={styles.FormItemStyle} style={{position: 'relative', left: 13}}>
                <Row>
                    <Col span={4}>
                        <span className={[styles.gTitle, styles.fakeRequired].join(' ')}>活动菜品</span>
                    </Col>
                    {/* <span className={styles.expalinFont}>以下活动菜品用户可任选其一参与换购</span> */}
                    <Col span={4} offset={16}>
                        <a
                            className={styles.gTitleLinkA}
                            onClick={this.handleSelectDishes}
                        >
                            增加活动菜
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <SortableTable
                            columns={resultTableColumns}
                            dataSource={displayDataSource}
                            handleReSort={this.handleSort}
                        ></SortableTable>
                    </Col>
                </Row>
                {selectorModalVisible && this.renderFoodSelectorModal()}
            </FormItem>
        )
    }
}

export default connect(mapStateToProps)(AddMoneyTradeDishesTableWithoutBrand);
