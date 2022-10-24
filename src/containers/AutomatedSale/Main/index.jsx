import React from 'react';
import { Col, Button, message } from "antd";
import MainTable from "./MainTable";
import QueryForm from "./QueryForm";
import styles from "./style.less";
import { httpApaasActivityQueryByPage, httpEnableOrDisableMaPromotionEvent, httpDeleteMaPromotionEvent } from "./AxiosFactory";
import { jumpPage, closePage, getStore } from '@hualala/platform-base';
import { SALE_AUTOMATED_SALE_DETAIL } from '../../../constants/entryCodes';
import _ from 'lodash';

const initialPaging = {
    pageNo: 1,
    pageSize: 10
}

export default class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.queryFrom = null;
        this.state = {
            loading: false,
            list: [],
            total: 0,
            pageObj: {},
            queryParams: {},
            statusPanels: [
                {
                    label: '全部',
                    value: 0
                },
                {
                    label: '运行中',
                    value: 0
                },
                {
                    label: '已暂停',
                    value: 0
                },
                {
                    label: '已结束',
                    value: 0
                }
            ]
        }
    }

    componentDidMount() {
        this.onQueryList(initialPaging);
    }

    onQueryList = (pagingParams = initialPaging) => {
        let { queryParams } = this.state;
        let concatParams = {
            ...pagingParams,
            ...queryParams
        };

        this.setState({
            loading: true
        }, () => {
            httpApaasActivityQueryByPage(concatParams).then(res => {
                let { itemList: list, processingCount = 0, stopedCount = 0, endedCount = 0 } = res;
                console.log('res====', res);
                let { pageHeader: {
                    totalSize = 0,
                    pageCount,
                } } = res;
                let statusPanels = this.state.statusPanels;
                statusPanels[0].value = totalSize;
                statusPanels[1].value = processingCount;
                statusPanels[2].value = stopedCount;
                statusPanels[3].value = endedCount;
                this.setState({
                    loading: false,
                    list,
                    statusPanels,
                    pageObj: {
                        ...pagingParams,
                        total: totalSize,
                    }
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
        const { groupID } = getStore().getState().user.get('accountInfo').toJS();
        const tabList = getStore().getState().user.get('tabList').toJS();
        const tab = tabList.find(item => item.key === 'sale_automated_sale_detail');
        if (tab && tab.key === 'sale_automated_sale_detail') {
            closePage(SALE_AUTOMATED_SALE_DETAIL);
        }
        if (type == 'add') {
            jumpPage({ menuID: SALE_AUTOMATED_SALE_DETAIL, type, groupID });
        } else {
            jumpPage({ menuID: SALE_AUTOMATED_SALE_DETAIL, id: record.itemID, type, groupID });
        }
    }

    render() {
        let { list, loading, pageObj, statusPanels } = this.state;
        return (
            <Col span={24} className={styles.automatedSale}>
                <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2>智能营销</h2>
                    <Button type='primary' icon="plus" onClick={() => this.onOperate('', 'add')}>创建活动</Button>
                </Col>
                <Col span={24} className={styles.queryFrom}>
                    <QueryForm
                        onQuery={this.onChangeQuery}
                    />
                </Col>
                <Col span={24} className={styles.statusPanels}>
                    <ul>
                        {
                            statusPanels.map(item => {
                                return (
                                    <li key={item.label}>
                                        <span className={styles.label}>{item.label}</span>
                                        <span className={styles.value}>{item.value}</span>
                                    </li>
                                )
                            })
                        }
                    </ul>
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
