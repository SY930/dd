import React from 'react';
import { Col, Button, message } from "antd";
import MainTable from "./MainTable";
import QueryForm from "./QueryForm";
import styles from "./style.less";
import ProcessModal from "./ProcessModal";
import { httpApaasActivityQueryByPage, httpApaasActivityOperate } from "./AxiosFactory";
import moment from 'moment'

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
            modalVisible: false,
            modalType: '',
            modalContent: '',
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
        this.setState({
            loading: true
        }, () => {
            httpApaasActivityOperate()
            .then(() => {
                message.success('已禁用');
                this.onQueryList();
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    loading: false
                })
            })
        })
        console.log(111, record);
    }

    onChangeQuery = (queryParams) => {
        this.setState({
            queryParams
        }, () => {
            this.onQueryList(initialPaging)
        })
    }

    onEdit = (record) => {
        console.log(5666, record)
        this.setState({
            modalType: 'edit',
            modalVisible: true,
            modalContent: record
        })
    }

    onClose = () => {
        this.setState({
            modalVisible: false,
            modalContent: '',
        })
    }

    render() {
        let { list, loading, pageObj, modalType, modalVisible, modalContent } = this.state;
        return (
            <Col span={24} className={styles.automatedSale}>
                <Col span={24} style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h2>智能营销</h2>
                    <Button type='primary' onClick={() => this.setState({modalType: 'add', modalVisible: true})}>创建活动</Button>
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
                        onEdit={this.onEdit}
                        changeStatus={this.changeStatus}
                    />
               </Col>
               {
                    modalVisible && 
                    <ProcessModal 
                        modalType={modalType}
                        modalContent={modalContent}
                        onClose={this.onClose}
                        onSubmit={this.onSubmit}
                        onQuery={this.onQueryList}
                    />
               }
            </Col>
        )
    }
}
