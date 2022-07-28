import React from 'react';
import { Row, Col, DatePicker, Button } from "antd";
import BaseForm from 'components/common/BaseForm';
import moment from "moment";
import MainTable from "./MainTable";
import styles from "./style.less";

const initialPaging = {
    pageNo: 1,
    pageSize: 10
}

const { RangePicker } = DatePicker;

const formItems = {
    user: {
        type: 'text',
        label: '分销人',
        placeholder: '请输入手机号',
    },
    invitee: {
        type: 'text',
        label: '被邀请人',
        placeholder: '请输入手机号',
    },
    orderTime: {
        type: 'custom',
        label: '下单时间',
        render: decorator => (
            <Row>
                <Col>
                    {decorator({})(<RangePicker
                        format="YYYY-MM-DD"
                        placeholder={['开始日期', '结束日期']}
                    />)}
                </Col>
            </Row>
        ),
    },
};

export default class DistributionDetail extends React.PureComponent {
    constructor(props){
        super(props);
        this.queryFrom = null;
        this.state = {
            loading: false,
            list: [],
            total: 0,
            pageObj: {},
        }
    }
    
    componentDidMount(){
        this.onQueryList(initialPaging);
    }

    clickQuery = () => {
        let { orderTime = [], user, invitee } = this.queryFrom.getFieldsValue();
        let startDate = orderTime[0] && moment(orderTime[0]).format('YYYY/MM/DD');
        let endDate = orderTime[1] && moment(orderTime[1]).format('YYYY/MM/DD');
        this.onQueryList({
            user, 
            invitee,
            startDate,
            endDate,
            ...initialPaging
        });
    }
    resetFormItems = () => {
        const render = () => (<div><Button type='primary' icon='search' onClick={this.clickQuery}>查询</Button></div>);
        return {
            ...formItems,
            q: {
                type: 'custom',
                label: '',
                render
            }
        }
    }
    onQueryList = (pagingParams = {}) => {
        let { orderTime = [], user, invitee } = this.queryFrom.getFieldsValue();
        let startDate = orderTime[0] && moment(orderTime[0]).format('YYYY/MM/DD');
        let endDate = orderTime[1] && moment(orderTime[1]).format('YYYY/MM/DD');
        let requestParams = {
            ...pagingParams,
            user, 
            invitee,
            startDate,
            endDate,
        }
        console.log(99999, requestParams);
        let list = [{
            no: 1,
            orderId: 11,
            distributor: 2,
            invitee: 3,
            rakeBackMoney: 4,
            rakeBackStatus: 5,
            orderStatus: 6,
            orderTime: 7
        }]
        this.setState({
            list,
            total: 5,
            pageObj: initialPaging
        })
    }
    render() {
        const formItems = this.resetFormItems();
        const formKeys = Object.keys(formItems);
        let { list, loading, pageObj } = this.state;
        return (
            <Col span={24} className={styles.distributionDetail}>
                <Col span={24} className={styles.queryFrom}>
                    <BaseForm
                        getForm={form => this.queryFrom = form}
                        formItems={formItems}
                        formKeys={formKeys}
                        layout="inline"
                    />
                </Col>
                <Col span={24} className={styles.tableBox}>
                    <MainTable
                        list={list}
                        loading={loading}
                        pageObj={pageObj}
                        onQuery={this.onQueryList}
                    />
               </Col>
            </Col>
        )
    }
}
