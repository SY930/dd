/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-04-05T17:09:14+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: index.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-05-03T19:12:31+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */
import React from 'react';
import ReactDOM from 'react-dom';

import styles from './treeSelect.less';
import { Input, Icon, Table, Select } from 'antd';
import PriceInputIcon from '../../../containers/SaleCenterNEW/common/PriceInputIcon'; // 编辑

const Option = Select.Option;

export default class HualalaSelectedTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            filterPrice: 'newPrice',
            priceOrPoint: props.priceOrPoint, // 商城秒杀filter
            filterDropdownVisible: false,
        };

        this.onClear = this.onClear.bind(this);
    }


    onCellChange = (val, record) => {
        // record.newPrice = val.number;
        const food = this.state.data.find(item => item.itemID === record.itemID);
        if (!food) {
            return;
        }
        if (val.number > food.price) {// 特价不超过原价
            val.number = food.price;
        }else if (val.number < 0) {// 特价不小于0
            val.number = 0;
        }
        food.newPrice = val.number;
        this.setState({data: this.state.data })
    }

    componentDidMount() {
        this.mapValueToData();
    }

    mapValueToData() {
        const data = [...(this.props.value || [])].map(item => {
            item.displayName = item[this.props.itemName] || `${item.foodName}  (${item.unit})`;// 菜品名拼接后的displayName字段
            return item;
        });
        this.setState({
            data
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            const selectedFood = this.state.data.map(food => food.foodID);
            const value = nextProps.value;
            value.forEach(food => {
                if (!selectedFood.includes(food.foodID)) {
                    food.newPrice = food[nextProps.filterPrice]
                    // food.newPrice = food[this.state.filterPrice]
                }
            });
            this.mapValueToData();
        }
    }

    selected(e) {
        ReactDOM.findDOMNode(this[`_input${e.target.id}`]).select();
    }

    onClear() {
        this.props.onClear && this.props.onClear();
    }

    handleMValueChange(val, entity) {
        if (this.state.priceOrPoint === 'price') {
            entity.mPrice = val.number;
            entity.mPoint = undefined;
        } else {
            entity.mPoint = val.number;
            entity.mPrice = undefined;
        }
    }

    handleTotalAmountChange(val, entity) {
        entity.totalAmount = val.number;
    }

    handleLimitAmountChange(val, entity) {
        entity.limitAmount = val.number;
    }

    render() {
        const columns = [
            {
                title: this.props.isWeChatMall ? '商品' : '菜品',
                dataIndex: 'displayName',
                key: 'displayName',
                fixed: 'left',
                width: 150,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '编码',
                dataIndex: 'foodCode',
                key: 'foodCode',
                fixed: 'left',
                width: 90,
                className: 'TableTxtCenter',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            {
                title: '分类',
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 80,
                className: 'TableTxtLeft',
                render: (text, record, index) => {
                    return <span title={text}>{text}</span>
                },
            },
            ];
        const specificColumns = this.props.isWeChatMall ? [
            {
                title: `秒杀价${this.state.priceOrPoint === 'price' ? '(元)' : '(分)'}`,
                width: 85,
                dataIndex: 'newPrice',
                key: 'filterPrice',
                className: 'noPadding',
                render: (text, record, index) => {
                    // TODO: fix the dispaly bug later
                    return (
                        <span className={styles.rightAlign}>
                            <PriceInputIcon
                                key={`table${index}`}
                                type="text"
                                modal="float"
                                value={{ number: this.state.priceOrPoint === 'price' ? record.mPrice : record.mPoint}}
                                index={index}
                                onChange={(val) => { this.handleMValueChange(val, record) }}
                            />
                        </span>
                    );
                },
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Select
                            style={{ width: 86, left: -63 }}
                            value={this.state.priceOrPoint}
                            onChange={v => {
                                const newData = this.state.data.map(food => {
                                    food.newPrice = food[v];
                                    return food
                                });
                                this.setState({ priceOrPoint: v, data: newData }, () => {
                                    this.props.onPriceOrPointChange && this.props.onPriceOrPointChange(v)
                                })
                            }}
                        >
                            <Option key='price' value="price">按价格</Option>
                            <Option key='point' value="point">按积分</Option>
                        </Select>
                    </div>
                ),
                filterDropdownVisible: this.state.filterDropdownVisible,
                onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }),
            },
            {
                title: '售价 (元)',
                dataIndex: 'prePrice1',
                key: 'prePrice1',
                width: 80,
                className: 'TableTxtRight',
                render: (text, record, index) => {
                    return record.prePrice == -1 ? record.price : record.prePrice
                },
            },
            {
                title: '库存量',
                dataIndex: 'prePrice2',
                key: 'prePrice2',
                width: 80,
                className: 'TableTxtRight',
                render: (text, record, index) => (
                    <span className={styles.rightAlign}>
                            <PriceInputIcon
                                key={`table${index}`}
                                type="text"
                                modal="int"
                                value={{ number: record.totalAmount}}
                                index={index}
                                onChange={(val) => { this.handleTotalAmountChange(val, record) }}
                            />
                        </span>
                ),
            },
            {
                title: '每人限购数量',
                dataIndex: 'prePrice3',
                key: 'prePrice3',
                className: 'TableTxtRight',
                render: (text, record, index) => (
                    <span className={styles.rightAlign}>
                            <PriceInputIcon
                                key={`table${index}`}
                                type="text"
                                modal="int"
                                value={{ number: record.limitAmount}}
                                index={index}
                                onChange={(val) => { this.handleLimitAmountChange(val, record) }}
                            />
                        </span>
                ),
            },
        ] : [
            {
                title: '特价 (元)',
                width: 85,
                dataIndex: 'newPrice',
                key: 'filterPrice',
                className: 'noPadding',
                render: (text, record, index) => {
                    // TODO: fix the dispaly bug later
                    return (
                        <span className={styles.rightAlign}>
                            <PriceInputIcon
                                key={`table${index}`}
                                type="text"
                                modal="float"
                                value={{ number: record['newPrice'] == -1 ? record.price : record['newPrice'] }}
                                index={index}
                                onChange={(val) => { this.onCellChange(val, record) }}
                            />
                        </span>
                    );
                },
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Select
                            style={{ width: 86, left: -63 }}
                            value={this.props.filterPrice}
                            //value={this.state.filterPrice}
                            onChange={v => {
                                const newData = this.state.data.map(food => {
                                    food.newPrice = food[v]; // 将newPrice变为对应option价
                                    return food
                                })
                                // console.log(newData)
                                this.setState({ filterPrice: v, data: newData }, () => {
                                    this.props.filterPriceChange(v);
                                })
                            }}
                        >
                            <Option key='newPrice'>当前价格</Option>
                            <Option key='price'>原价</Option>
                            <Option key='vipPrice'>会员价</Option>
                        </Select>
                    </div>
                ),
                filterDropdownVisible: this.state.filterDropdownVisible,
                onFilterDropdownVisibleChange: visible => this.setState({ filterDropdownVisible: visible }),
            },
            {
                title: '原价 (元)',
                dataIndex: 'price',
                key: 'price',
                width: 80,
                className: 'TableTxtRight',
            },
            {
                title: '折扣',
                dataIndex: 'salePercent',
                key: 'salePercent',
                className: 'TableTxtRight',
                render: (text, record, index) => {
                    return record.newPrice == -1 || record.price == 0 ? '不打折' : Number(record.newPrice) !== Number(record.price) ? `${Number((Number(record.newPrice) / record.price * 10).toFixed(3))}折` : '不打折'
                },
            }
        ];
        columns.push(...specificColumns);
        const data = this.state.data;
        return (
            <div className={styles.treeSelectFooter}>
                <div className={styles.SelectedLi}>
                    <div className={styles.SelectedLiT}>
                        <span>{this.props.selectdTitle}</span>
                    </div>

                    <Table bordered={true} dataSource={data} columns={columns} pagination={false} scroll={{ x: 570, y: 170 }} />
                </div>
                <div onClick={this.onClear} className={styles.Tclear}>清空</div>
            </div>
        );
    }
}
