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
    // Pagination,
} from 'antd';
import {
    memoizedExpandCategoriesAndDishes,
} from '../../../utils';
import FoodSelectModal from '../../../components/common/FoodSelector/FoodSelectModal'
import styles from '../ActivityPage.less'
import PriceInputIcon from '../common/PriceInputIcon';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import { injectIntl } from '../IntlDecor';
import SortableTable from '../common/SortableTable'

const FormItem = Form.Item;

import GoodsRef from '@hualala/sc-goodsRef';
const { GoodsSelector } = GoodsRef
import { businessTypesList } from '../../../constants/WhiteList';

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
class AddMoneyTradeDishesTableWithBrand extends Component {
    constructor(props) {
        super(props);
        let priceLst;
        const { legacyPayPrice } = props;
        try {
            let stageGoodsList = props.promotionDetailInfo.getIn(['$promotionDetail', 'stageGoodsList']).toJS();
            priceLst = stageGoodsList.length > 0 ? stageGoodsList[0].goodsList : []
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
            data: priceLst,
            total: 0,
            pageNo: 1,
        }

    }

    onCellChange = (val, index) => {
        const data = this.state.data;
        let num = val.number;
        const record = data[index];
        if (val.number < 0) {// 特价不小于0
            num = '0';
        }
        record.payPrice = num;
        this.setState({ data });
        this.props.onChange(data.map(item => ({ ...item })));
    }

    onFloatChange = (val, index) => {
        const data = this.state.data;
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


    onFloatMaxNumChange = (val, index) => {
        const data = this.state.data;
        let num = val.number;
        const record = data[index];
        record.maxNum = num;
        this.setState({ data });
        this.props.onChange(data.map(item => ({ ...item })));
    }

    handleDel = (record, index) => {
        const data = this.state.data;
        data.splice(index, 1);
        this.setState({ data })
        this.props.onChange(data)
    };
    handleModalOk = (v) => {
        const {
            value
        } = this.props;
        const dishObjects = v.reduce((acc, curr) => {
            const dishObj = value.find(item => item.key === curr.key);
            if (dishObj) {
                const reservedDish = value.find(item => item.goodsID === dishObj.goodsID);
                acc.push(reservedDish ? { ...dishObj, payPrice: reservedDish.payPrice, maxNum: reservedDish.maxNum } : dishObj)
            } else {
                acc.push(curr)
            }
            return acc;
        }, [])
        this.setState({
            selectorModalVisible: false,
            data: dishObjects,
        }, () => {
            this.state.data.map((i) => {
                if (!i.maxNum) {
                    i.maxNum = 1
                }
            })
            this.props.onChange(this.state.data)
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
            categories = categories.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
            dishes = dishes.filter(({ brandID: value }) => value == 0 || selectedBrands.includes(value))
        }

        return (
            <GoodsSelector
                defaultValue={this.props.value}
                businessTypesList={businessTypesList}
                visible={this.state.selectorModalVisible}
                onCancel={() => {
                    this.setState({
                        selectorModalVisible: false
                    })
                }}
                onOk={(data) => {
                    this.handleModalOk(data)
                }}
            ></GoodsSelector>
        )
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
            total,
            pageNo,
        } = this.state;
        const {
            calType = 0,
        } = this.props
        const resultTableColumns = [
            {
                title: COMMON_LABEL.actions,
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return (
                        <div>
                            <Popconfirm
                                title={SALE_LABEL.k5dnw1q3}
                                onConfirm={() => this.handleDel(record, index)}
                                getPopupContainer={_ => document.getElementById('_addMoneyTradeDetail')}
                            >
                                <a title={COMMON_LABEL.delete}>清除</a>
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
                dataIndex: 'categoryName',
                key: 'categoryName',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <div style={{ position: 'relative', zIndex: this.props.isLook ? '200' : 'auto' }} ><Tooltip title={text}>{text}</Tooltip></div>
                },
            },
            {
                title: '商品名称',
                dataIndex: 'goodsName',
                key: 'goodsName',
                width: 100,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <div style={{ position: 'relative', zIndex: this.props.isLook ? '200' : 'auto' }} ><Tooltip title={text}>{text.length > 12 ? text.substr(0, 12) + '...' : text}</Tooltip></div>
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
            // {
            //     // 本组件接收到的售价已经是处理过的了
            //     title: '售价(元)',
            //     dataIndex: 'price',
            //     key: 'price',
            //     width: 72,
            //     className: 'TableTxtRight',
            //     render: (text, record, index) => {
            //         return <Tooltip title={text}>{text}</Tooltip>
            //     },
            // },
            {
                title: calType == 1 ? '减免价(元)' : '活动价(元)',
                width: 100,
                dataIndex: 'payPrice',
                key: 'payPrice',
                className: 'noPadding',
                render: (text, record, index) => {
                    return (
                        <div
                            style={{ height: '100%', padding: '0px 5px' }}
                            className={styles.rightAlign}
                        >
                            <PriceInputIcon
                                type="text"
                                modal="float"
                                placeholder={SALE_STRING.k5hkj1ef}
                                value={{ number: record.payPrice }}
                                index={index}
                                onChange={(val) => { this.onCellChange(val, index) }}
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
                width: 100,
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
                                onChange={(val) => { this.onFloatMaxNumChange(val, index) }}
                            />
                        </div>
                    )
                },
            },
            // {
            //     title:
            //         <span>称重误差值(份)
            //             <Tooltip title={'仅支持POS2.5，仅“需要确定数量”的菜品才能编辑称重误差值，其他菜品不能编辑此项'}>
            //                 <Icon
            //                     style={{
            //                         marginLeft: 3,
            //                         cursor: 'pointer',
            //                     }}
            //                     type="question-circle"
            //                 />
            //             </Tooltip>
            //         </span>,
            //     width: 120,
            //     dataIndex: 'weightOffset',
            //     key: 'weightOffset',
            //     className: 'noPadding',
            //     render: (text, record, index) => {
            //         return (
            //             <div
            //                 style={{ height: '90%', padding: '0px 5px' }}
            //                 className={styles.rightAlign}
            //             >
            //                 <PriceInputIcon
            //                     type="text"
            //                     modal="float"
            //                     disabled={!record.IsNeedConfirmFoodNumber}
            //                     value={{ number: record.weightOffset }}
            //                     index={index}
            //                     prefix={'±'}
            //                     onChange={(val) => { this.onFloatChange(val, index) }}
            //                 />
            //             </div>
            //         )
            //     },
            // },
        ];

        if (this.props.isLook) {
            resultTableColumns.splice(0, 1, {
                title: '序号',
                dataIndex: 'operation',
                key: 'operation',
                width: 50,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return index + 1
                },
            })
        }

        const displayDataSource = this.props.value

        return (
            <FormItem className={styles.FormItemStyle} style={{ position: 'relative', left: 13 }}>
                <Row>
                    <Col span={4}>
                        <span className={[styles.gTitle, styles.fakeRequired].join(' ')}>{SALE_LABEL.k6hhubf3}</span>
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
                {this.props.isLook && <Table
                    bordered
                    columns={resultTableColumns}
                    dataSource={displayDataSource}
                    pagination={false}
                ></Table>}
                {!this.props.isLook && <Row className={styles.overflowRow}>
                    <Col className={styles.dragTableWraper} style={{ overflow: 'auto', display: 'flex' }}>
                        {/* 因为我们兼容的antd版本是2X版本所以并不支持拖拽排序，重写table逻辑 */}
                        <SortableTable
                            columns={resultTableColumns}
                            dataSource={displayDataSource}
                            handleReSort={this.handleSort}
                        ></SortableTable>
                    </Col>
                </Row>}
                {selectorModalVisible && this.renderFoodSelectorModal()}
            </FormItem>
        )
    }
}

export default connect(mapStateToProps)(AddMoneyTradeDishesTableWithBrand);
