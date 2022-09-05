import React from 'react';
import { Row, Col, DatePicker, Button } from "antd";
import BaseForm from 'components/common/BaseForm';
import moment from "moment";
import MainTable from "./MainTable";
import styles from "./style.less";
import _ from "lodash";

const initialPaging = {
    pageNo: 1,
    pageSize: 10
}
const { RangePicker } = DatePicker;
const defaultFormat = 'YYYY-MM-DD HH:mm:ss';
const formItems = {
    customerID: {
        type: 'text',
        label: '分销人',
        placeholder: '请输入手机号',
    },
    subCustomerID: {
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
        this.onQueryList();
    }

    handleSearch = () => {
        this.onQueryList();
    }
    resetFormItems = () => {
        const render = () => (<div><Button type='primary' icon='search' onClick={this.handleSearch}>查询</Button></div>);
        return {
            ...formItems,
            q: {
                type: 'custom',
                label: '',
                render
            }
        }
    }
    onQueryList = (pagingParams = initialPaging) => {
        const queryFormParams = _.cloneDeep(this.queryFrom.getFieldsValue());
        const { orderTime } = queryFormParams;
        if(Array.isArray(orderTime) && orderTime.length > 0){
            queryFormParams.createStampStart = moment(orderTime[0]).format(defaultFormat);
            queryFormParams.createStampEnd = moment(orderTime[1]).format(defaultFormat);
        }
        delete queryFormParams.orderTime;
        let requestParams = {
            ...queryFormParams,
            ...this.state.pageObj,
            ...pagingParams,
        }
        console.log('_TODO-1', requestParams);
        let list = [{
            trdOrderNO: 11,
            customerID: 182,
            subCustomerID: 222333,
            rebateAmount: 4,
            transStatus: 5,
            trdOrderStatus: 6,
            transStamp: '2022-09-02/2022-02-02'
        }]
        this.setState({
            list,
            total: 5,
            pageObj: pagingParams
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
