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
} from 'antd';
import styles from '../ActivityPage.less'

const FormItem = Form.Item;

const mapStateToProps = (state) => {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        user: state.user.toJS(),
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
            resultTableColumns: [
                {
                    title: '序号',
                    dataIndex: 'num',
                    key: 'num',
                    fixed: 'left',
                    width: 50,
                    className: 'TableTxtCenter',
                    // 参数分别为当前行的值，当前行数据，行索引，return可以决定表格里最终存放的值
                    render: (text, record, index) => {
                        return <span>{record.key + 1}</span>
                    },
                },
                {
                    title: '操作',
                    dataIndex: 'operation',
                    key: 'operation',
                    fixed: 'left',
                    width: 50,
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return (
                            <div className="editable-row-operations">
                                <span>
                                    <a title="删除" alt="删除" onClick={() => this.handleDel(text, record, index)}>删除</a>
                                </span>
                            </div>
                        );
                    },
                },
                {
                    title: '菜品',
                    dataIndex: 'foodName',
                    key: 'foodName',
                    fixed: 'left',
                    width: 100,
                    className: 'TableTxtLeft',
                    render: (text, record, index) => {
                        return <span title={text}>{text}</span>
                    },
                },
                {
                    title: '单位',
                    dataIndex: 'unit',
                    key: 'unit',
                    fixed: 'left',
                    width: 100,
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return <span title={text}>{text}</span>
                    },
                },
                {
                    title: '编码',
                    dataIndex: 'foodCode',
                    key: 'foodCode',
                    width: 100,
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
                    title: '原价格(元)',
                    dataIndex: 'price',
                    key: 'price',
                    width: 80,
                    className: 'TableTxtRight',
                },
                {
                    title: '折扣',
                    dataIndex: 'salePercent',
                    key: 'salePercent',
                    width: 90,
                    className: 'TableTxtCenter',
                    render: (text, record, index) => {
                        return Number(record.newPrice) <= 0 ? '0折' : Number(record.newPrice) !== Number(record.price) ? `${Number((Number(record.newPrice) / record.price * 10).toFixed(3))}折` : '不打折'
                    },
                },
                {
                    title: '特价(元)',
                    width: 80,
                    dataIndex: 'newPrice',
                    key: 'newPrice',
                    className: 'TableTxtRight',
                    render: (text, record, index) => {
                        return Number(record.newPrice) <= 0 ? 0 : Number(record.newPrice)
                    },
                },
            ],
        }
    }
    dishFilter = (dishArray) => {
        return dishArray.filter(fish => fish.isSetFood != '1' && fish.isTempFood != '1' && fish.isTempSetFood != '1')
    }
    handleDel = (text, record, index) => {
        confirm({
            title: '移除特价菜',
            content: (
                <div>
                    您将移除
                    【<span>{record.foodName}</span>】
                    <br />
                    <span>保存后操作生效，请慎重考虑~</span>
                </div>
            ),
            footer: null,
            onOk: () => {
            },
            onCancel: () => { },
        });
    };
    render() {
        const {
            resultTableColumns,
            data,
        } = this.state;
        return (
            <FormItem className={styles.FormItemStyle}>
                <Row>
                    <Col span={2}>
                        <span className={styles.gTitle}>选择菜品</span>
                    </Col>
                    <Col span={4} offset={18}>
                        <a
                            className={styles.gTitleLink}
                            onClick={this.selectDishes}
                        >
                            批量添加菜品
                        </a>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Table
                            bordered={true}
                            dataSource={data}
                            columns={resultTableColumns}
                            scroll={{ x: 750 }}
                            pagination={{ size: 'small', pageSize: 10 }}
                        />
                    </Col>
                </Row>
            </FormItem>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SpecialDishesTableWithBrand);
