import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Table,
    message,
    Button,
    Icon,
    Input,
    Select,
    Tooltip,
} from 'antd';
import moment from 'moment';
import { jumpPage } from '@hualala/platform-base'
import registerPage from '../../index';
import {PROMOTION_WECHAT_COUPON_CREATE, PROMOTION_WECHAT_COUPON_LIST} from '../../constants/entryCodes';
import style from './style.less'
import {axiosData} from "../../helpers/util";

export const BATCH_STATUS = [
    {
        value: '',
        label: '全部',
    },
    {
        value: '1',
        label: '未激活',
    },
    {
        value: '2',
        label: '审批中',
    },
    {
        value: '4',
        label: '已激活',
    },
    {
        value: '8',
        label: '已作废',
    },
    {
        value: '16',
        label: '终止发放',
    },
]

@registerPage([PROMOTION_WECHAT_COUPON_LIST])
class WeChatCouponList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            queryBatchID: '',
            queryBusinessNo: '',
            queryBatchStatus: '',
            isQuerying: false,
            couponList: [
                {

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },{

                },
            ],
            pageSize: 30,
            pageNo: 1,
            total: 0,
            tableHeight: 800,
        };
        this.tableActionRef = null;
        this.tableWrapperRef = null;
        this.bodyRef = null;
    }

    componentDidMount() {
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }
    query = () => {
        axiosData(
            '/payCoupon/getPayCouponBatch',
            {},
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            console.log('res: ', res)
        })
    }

    onWindowResize = () => {
        try {
            const actionRowHeight = this.tableActionRef.offsetHeight;
            const bodyHeight = this.bodyRef.offsetHeight;
            // padding: 20
            this.setState({ tableHeight: bodyHeight - actionRowHeight - 40 })
        } catch (e) {
            // oops
        }
    }

    handleQueryBatchIDChange = ({ target: { value } }) => {
        if (!value || value.length < 12) {
            this.setState({ queryBatchID: value })
        }
    }

    handleQueryBusinessNoChange = ({ target: { value } }) => {
        if (!value || value.length < 12) {
            this.setState({ queryBusinessNo: value })
        }
    }

    handleQueryBatchStatusChange = (value) => {
        this.setState({ queryBatchStatus: value })
    }

    handleShowSizeChange = (current, pageSize) => {
        this.setState({
            pageSize,
        })
    }

    renderHeader() {
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    微信支付代金券
                </span>
                <div className={style.spacer} />
                <Button
                    type="ghost"
                    onClick={() => {
                        jumpPage({ menuID: PROMOTION_WECHAT_COUPON_CREATE })
                    }}
                >
                    <Icon type="plus" />
                    关联微信支付代金券
                </Button>
            </div>
        )
    }

    renderBody() {
        const {
            queryBatchID,
            queryBatchStatus,
            queryBusinessNo,
            pageSize,
            pageNo,
            total,
            couponList,
            isQuerying,
            tableHeight,
        } = this.state;
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                className: 'TableTxtCenter',
                width: 60,
                key: 'key',
                render: (text, record, index) => {
                    return (pageNo - 1) * pageSize + text;
                },
            },

            {
                title: '操作',
                key: 'operation',
                width: 120,
                className: 'TableTxtCenter',
                render: (text, record) => {
                    return (
                        <a onClick={() => console.log(123)}>
                            代金券详情
                        </a>
                    );
                },
            },
            {
                title: '代金券批次ID',
                dataIndex: 'batchNo',
                key: 'batchNo',
                width: 120,
                render: (text) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                },
            },
            {
                title: '券名称',
                dataIndex: 'couponName',
                key: 'couponName',
                width: 240,
                render: (text) => {
                    return <Tooltip title={text}><span>{text}</span></Tooltip>
                },
            },
            {
                title: '面额(元)',
                dataIndex: 'couponValue',
                key: 'couponValue',
                className: 'TableTxtRight',
                width: 240,
                render: (text) => {
                    const res = (text || '').padStart(3, '0').replace(/(.{2})$/, '.$1')
                    return <Tooltip title={res}><span>{res}</span></Tooltip>
                },
            },
            {
                title: '生效时间',
                className: 'TableTxtCenter',
                dataIndex: 'beginTime',
                key: 'beginTime',
                width: 200,
                render: (time) => {
                    return `${moment(time).format('YYYY/MM/DD HH:mm')}`;
                },
            },
            {
                title: '结束时间',
                className: 'TableTxtCenter',
                dataIndex: 'endTime',
                key: 'endTime',
                width: 200,
                render: (time) => {
                    return `${moment(time).format('YYYY/MM/DD HH:mm')}`;
                },
            },
            {
                title: '代金券批次状态',
                dataIndex: 'couponStockStatus',
                key: 'couponStockStatus',
                width: 100,
                render: (status) => {
                    const text = (BATCH_STATUS.find(({ value }) => `${status}` === value) || { label: '状态未知' }).label;
                    let color;
                    switch (`${status}`) {
                        case '1': color = '#CCCCCC'; break;
                        case '2': color = '#F4AC00'; break;
                        case '4': color = '#3FAA1F'; break;
                        case '8': color = '#CCCCCC'; break;
                        case '16': color = '#F75B5B'; break;
                        default: color = '#CCCCCC'; break;
                    }
                    return (
                            <span>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: 6,
                                        height: 6,
                                        background: color,
                                        borderRadius: 3,
                                        margin: '0 12px',
                                    }} />
                                {text}
                            </span>
                        )
                },
            },
        ];
        return (
            <div style={{ padding: 20, height: 'calc(100% - 75px)' }} ref={e => this.bodyRef = e}>
                <div className={style.tableActionRow} ref={e => this.tableActionRef = e}>
                    <div>
                        商户编号&nbsp;&nbsp;
                        <Input
                            value={queryBusinessNo}
                            onChange={this.handleQueryBusinessNoChange}
                            placeholder="请输入商户编号"
                            style={{ width: 200, marginRight: 20 }}
                        />
                    </div>
                    <div>
                        代金券批次ID&nbsp;&nbsp;
                        <Input
                            value={queryBatchID}
                            onChange={this.handleQueryBatchIDChange}
                            placeholder="请输入代金券批次ID"
                            style={{ width: 200, marginRight: 20 }}
                        />
                    </div>
                    <div>
                        代金券批次状态&nbsp;&nbsp;
                        <Select
                            value={queryBatchStatus}
                            onChange={this.handleQueryBatchStatusChange}
                            style={{ width: 200, marginRight: 20 }}
                        >
                            {
                                BATCH_STATUS.map(({ value, label }) => (
                                    <Select.Option key={value} value={value}>
                                        {label}
                                    </Select.Option>
                                ))
                            }
                        </Select>
                    </div>
                    <Button
                        type="primary"
                        onClick={() => console.log(223)}
                        disabled={isQuerying}
                    >
                        <Icon type="search"/>
                        查询
                    </Button>

                </div>
                <div className={style.tableWrapper} style={{ height: tableHeight }}>
                    <Table
                        scroll={{ x: 1600, y: tableHeight - 93 }}
                        bordered={true}
                        columns={columns}
                        dataSource={couponList}
                        loading={isQuerying}
                        pagination={{
                            pageSize,
                            current: pageNo,
                            showQuickJumper: true,
                            showSizeChanger: true,
                            onShowSizeChange: this.handleShowSizeChange,
                            total,
                            showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                            onChange: (page, pageSize) => {
                                this.query(page, pageSize)
                            },
                        }}
                    />
                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                {this.renderBody()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(WeChatCouponList)
