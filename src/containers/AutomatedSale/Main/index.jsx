import React from 'react';
import { Col, Button, message } from "antd";
import MainTable from "./MainTable";
import QueryForm from "./QueryForm";
import styles from "./style.less";
import { httpApaasActivityQueryByPage, httpEnableOrDisableMaPromotionEvent, httpDeleteMaPromotionEvent } from "./AxiosFactory";
import moment from 'moment';
import { jumpPage } from '@hualala/platform-base';
import { SALE_AUTOMATED_SALE_DETAIL } from '../../../constants/entryCodes';

const DATE_FORMAT = 'YYYYMMDD';
const initialPaging = {
    pageNo: 1,
    pageSize: 10
}

export default class Main extends React.PureComponent {
    constructor(props){
        super(props);
        this.queryFrom = null;
        this.state = {
            loading: false,
            list: [],
            total: 0,
            pageObj: {},
            queryParams: {}
        }
    }
    
    componentDidMount(){
        this.onQueryList(initialPaging);
    }

    onQueryList = (pagingParams = initialPaging) => {
        let { queryParams } = this.state;
        let { timeRanges } = queryParams;
        if(timeRanges && timeRanges.length > 0){
            queryParams.eventStartDate = moment(timeRanges[0]).format(DATE_FORMAT);
            queryParams.eventEndDate =  moment(timeRanges[1]).format(DATE_FORMAT);
            delete queryParams.timeRanges;
        }
        let concatParams = {
            ...pagingParams, 
            ...queryParams
        };

        this.setState({
            loading: true
        }, () => {
            httpApaasActivityQueryByPage(concatParams).then(res => {
                console.log('res', res)
                let { itemList: list } = res;
                let { pageHeader: { totalSize } } = res;
                this.setState({
                    loading: false,
                    list,
                    total: totalSize,
                    pageObj: pagingParams
                })
            }).catch(error => {
                console.error(error);
                this.setState({
                    loading: false,
                })
            })
        })
    }

    changeStatus = (record) => {
        let { status, itemID } = record;
        this.setState({
            loading: true
        }, () => {
            httpEnableOrDisableMaPromotionEvent({
                status,
                itemID,
            })
            .then(res => {
                this.setState({
                    loading: false
                });
                status == 1 ? message.warning('已禁用') : message.success('已启用');
                this.onQueryList();
            })
            .catch(error => {
                this.setState({
                    loading: false
                })
            })
        })
    }

    onDelete = (itemID) => {
        this.setState({
            loading: true
        }, () => {
            httpDeleteMaPromotionEvent({
                itemID,
            })
            .then(() => {
                this.setState({
                    loading: false
                });
                message.success('已删除');
                this.onQueryList();
            })
            .catch(error => {
                this.setState({
                    loading: false
                })
            })
        })
    }

    onChangeQuery = (queryParams) => {
        this.setState({
            queryParams
        }, () => {
            this.onQueryList(initialPaging)
        })
    }

    onOperate = (record, type) => {
        if(type == 'add'){
            jumpPage({pageID: SALE_AUTOMATED_SALE_DETAIL, type });
        }else{
            jumpPage({pageID: SALE_AUTOMATED_SALE_DETAIL, id: record.itemID, type });
        }
    }

    render() {
        let { list, loading, pageObj } = this.state;
        return (
            <Col span={24} className={styles.automatedSale}>
                <Col span={24} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h2>智能营销</h2>
                    <Button type='primary' onClick={() => this.onOperate('', 'add')}>创建活动</Button>
                </Col>
                <Col span={24} className={styles.queryFrom}>
                    <QueryForm 
                        onQuery={this.onChangeQuery}
                    />
                </Col>
                <Col span={24} className={styles.tableBox}>
                    <MainTable
                        list={list}
                        loading={loading}
                        pageObj={pageObj}
                        onQuery={this.onQueryList}
                        onOperate={this.onOperate}
                        changeStatus={this.changeStatus}
                        onDelete={this.onDelete}
                    />
               </Col>
            </Col>
        )
    }
}
