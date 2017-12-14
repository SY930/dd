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
            filterPrice: 'price',
            filterDropdownVisible: false,
        };

        this.onClear = this.onClear.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    onCellChange = (val, record) => {
        record.newPrice = val.number;
    }

    componentDidMount() {
        this.setState({
            data: this.props.value || [],
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.setState({
                data: nextProps.value,
            })
        }
    }

    selected(e) {
        ReactDOM.findDOMNode(this[`_input${e.target.id}`]).select();
    }

    handleChange(e, record, index) {
        record.newPrice = e.target.value;
        record.salePercent = `${Math.ceil((e.target.value / record.price) * 100)}%`;
        this.forceUpdate();
    }

    onClear() {
        this.props.onClear && this.props.onClear();
    }

    render() {
        const columns = [
            {
                title: '菜品',
                dataIndex: 'foodName',
                key: 'foodName',
                fixed: 'left',
                width: 150,
                className: 'TableTxtLeft',
            },
            {
                title: '编码',
                dataIndex: 'foodCode',
                key: 'foodCode',
                fixed: 'left',
                width: 90,
                className: 'TableTxtCenter',
            },
            {
                title: '分类',
                dataIndex: 'foodCategoryName',
                key: 'foodCategoryName',
                width: 80,
                className: 'TableTxtLeft',
            },
            {
                title: '特价 (元)',
                width: 85,
                dataIndex: this.state.filterPrice,
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
                                value={{ number: record[this.state.filterPrice] }}
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
                            value={this.state.filterPrice}
                            onChange={v => {
                                const newData = Array.from(this.state.data).map(food => {
                                    food.newPrice = food[v]; // 将newPrice变为对应option价
                                })
                                console.log(newData)
                                this.setState({ filterPrice: v }, () => {
                                })
                            }}
                        >
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
                    return `${(record.newPrice / record.price * 100).toFixed(2)}%`
                },
            }];
        const data = Array.from(this.state.data);
        console.log(data)
        // debugger;
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
