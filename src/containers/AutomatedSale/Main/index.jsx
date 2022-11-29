import React from 'react';
import { Col, Button, message } from "antd";
import MainTable from "./MainTable";
import QueryForm from "./QueryForm";
import styles from "./style.less";
import { httpApaasActivityQueryByPage, httpEnableOrDisableMaPromotionEvent, httpDeleteMaPromotionEvent } from "./AxiosFactory";
import { jumpPage, closePage, getStore } from '@hualala/platform-base';
import { SALE_AUTOMATED_SALE_DETAIL, SALE_AUTOMATED_STAT_DETAIL } from '../../../constants/entryCodes';
import _ from 'lodash';
import all_icon from "../assets/all_icon.png";
import no_start_icon from "../assets/no_start_icon.png";
import running_icon from "../assets/running_icon.png";
import stoped_icon from "../assets/stoped_icon.png";
import ended_icon from "../assets/ended_icon.png";

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
            currentPanelType: 1,
            statusPanels: [
                {
                    label: '全部',
                    value: 0,
                    icon: all_icon,
                    type: 1
                },
                {
                    label: '未启用',
                    value: 0,
                    icon: no_start_icon,
                    type: 2
                },
                {
                    label: '运行中',
                    value: 0,
                    icon: running_icon,
                    type: 3
                },
                {
                    label: '已暂停',
                    value: 0,
                    icon: stoped_icon,
                    type: 4
                },
                {
                    label: '已结束',
                    value: 0,
                    icon: ended_icon,
                    type: 5
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
                let { itemList: list, allCount = 0, waitEnableCount = 0, processingCount = 0, disableCount = 0, endedCount = 0 } = res;
                let { pageHeader: {
                    totalSize = 0,
                } } = res;
                let statusPanels = this.state.statusPanels;
                statusPanels[0].value = allCount;
                statusPanels[1].value = waitEnableCount;
                statusPanels[2].value = processingCount;
                statusPanels[3].value = disableCount;
                statusPanels[4].value = endedCount;
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
            queryParams,
            currentPanelType: 1,
        }, () => {
            this.onQueryList(initialPaging)
        })
    }

    onOperate = (record, type) => {
        const { groupID } = getStore().getState().user.get('accountInfo').toJS();
        const tabList = getStore().getState().user.get('tabList').toJS();
        const tab = tabList.find(item => item.key === 'sale_automated_sale_detail');
        const tab1 = tabList.find(item => item.key === 'sale_automated_stat_detail');
        if (tab && tab.key === 'sale_automated_sale_detail') {
            closePage(SALE_AUTOMATED_SALE_DETAIL);
        }
        if(tab1 && tab1.key === 'sale_automated_stat_detail'){
            closePage(SALE_AUTOMATED_STAT_DETAIL);
        }
        // 统计
        let pageParams = {
            menuID: SALE_AUTOMATED_SALE_DETAIL,
            type,
            groupID,
        }
        if(type == 'stat'){
            pageParams.menuID = SALE_AUTOMATED_STAT_DETAIL;
            pageParams.flowId = record.flowId;
        }else if(type != 'add'){
            pageParams.id = record.itemID;
        }
        jumpPage(pageParams);
    }

    changePanel = (currentPanelType) => {
        this.setState({
            currentPanelType
        });
        this.onQueryList({
            ...initialPaging,
            executeStatus: currentPanelType
        })
    }

    render() {
        let { list, loading, pageObj, statusPanels, currentPanelType } = this.state;
        return (
            <Col span={24} className={styles.automatedSale}>
                <Col span={24} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2>自动化营销</h2>
                    <Button type='primary' icon="plus" onClick={() => this.onOperate('', 'add')}>创建活动</Button>
                </Col>
                <Col span={24} className={styles.queryFrom}>
                    <QueryForm
                        onQuery={this.onChangeQuery}
                    />
                </Col>
                <Col className={styles.statusPanelsTable} span={24} style={{ height: 'calc(100vh - 186px)' }}>
                    <Col span={24} className={styles.statusPanelsTableMain}>
                        <Col span={24} className={styles.statusPanels}>
                            <ul>
                                {
                                    statusPanels.map(item => {
                                        return (
                                            <li
                                                key={item.label} onClick={() => this.changePanel(item.type)}
                                                className={currentPanelType == item.type ? styles.active : ''}
                                            >
                                                <span className={styles.label}>
                                                    <img src={item.icon} alt="" />
                                                    <span>{item.label}</span>
                                                </span>
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

                </Col>

            </Col>
        )
    }
}
