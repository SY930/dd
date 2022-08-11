import React from 'react';
import { Col, Button } from "antd";
import MainTable from "./MainTable";
import QueryForm from "./QueryForm";
import styles from "./style.less";
import ProcessModal from "./ProcessModal";
import { httpApaasActivityQueryByPage } from "./AxiosFactory";

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
        let concatParams = {...pagingParams, ...queryParams}
        this.setState({
            loading: true
        }, () => {
            httpApaasActivityQueryByPage(concatParams).then(res => {
                console.log('res', res)
                let { total, list } = res;
                this.setState({
                    loading: false,
                    list,
                    total,
                    pageObj: pagingParams
                })
            }).catch(error => {
                this.setState({
                    loading: false,
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
