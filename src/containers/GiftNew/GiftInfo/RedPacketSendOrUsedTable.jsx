import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Table, Button, Icon, Tooltip } from 'antd';
import _ from 'lodash';
import Moment from 'moment';
import BaseForm from '../../../components/common/BaseForm';
import GiftCfg from 'constants/Gift'
import styles from './GiftInfo.less';
import {
    FetchSendorUsedList,
    UpdateSendorUsedPage,
    UpdateSendorUsedParams,
    FetchGiftSchema,
} from '../_action';

function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label');
}

const format = 'YYYY/MM/DD HH:mm:ss';
class RedPacketSendOrUsedTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: '序号',
                    dataIndex: 'num',
                    width:50,
                    className:'TableTxtCenter',
                    key: 'num',
                },
                {
                    title: '客户编号',
                    className:'TableTxtCenter',
                    dataIndex: 'customerID',
                    key: 'customerID',
                    width: 200,
                    render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
                },
                {
                    title: '发出方式',
                    className:'TableTxtCenter',
                    dataIndex: 'getWay',
                    width:120,
                    key: 'getWay',
                    render: (value) => {
                        const label = mapValueToLabel(GiftCfg.getWay, String(value));
                        return <Tooltip title={label}><span>{label}</span></Tooltip>
                    },
                },
                {
                    title: '发出时间',
                    dataIndex: 'createTime',
                    className:'TableTxtCenter',
                    width:140,
                    key: 'createTime',
                    render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
                },
                {
                    title: '金额',
                    dataIndex: 'giftValue',
                    key: 'giftValue',
                    width: 80,
                    render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
                },
                {
                    title: '状态',
                    dataIndex: 'giftStatus',
                    key: 'giftStatus',
                    render: (value) => {
                        return <span>{mapValueToLabel(GiftCfg.redPacketStatus, String(value))}</span>
                    },
                },
                {
                    title: '姓名',
                    className:'TableTxtCenter',
                    dataIndex: 'customerName',
                    key: 'customerName',
                    render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
                },
                {
                    title: '性别',
                    dataIndex: 'customerSex',
                    className:'TableTxtCenter',
                    key: 'customerSex',
                    render: (value) => {
                        return <span>{mapValueToLabel(GiftCfg.sex, String(value))}</span>
                    },
                },
                {
                    title: '手机号',
                    className:'TableTxtCenter',
                    dataIndex: 'customerMobile',
                    width:180,
                    key: 'customerMobile',
                    render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
                },
            ],
            formItems: {
                timeRangeSend: {
                    label: '发出时间',
                    type: 'datepickerRange',
                    showTime: true,
                    format,
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                },
                giftStatus: {
                    label: '状态',
                    type: 'combo',
                    defaultValue: '',
                    options: GiftCfg.redPacketStatus,
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                },
                getWay: {
                    label: '发出方式',
                    type: 'combo',
                    props: {
                        showSearch: true,
                    },
                    defaultValue: '',
                    options: GiftCfg.getWay,
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                },
                mobileNum: {
                    label: '手机号',
                    type: 'text',
                    labelCol: { span: 4 },
                    wrapperCol: { span: 20 },
                },
            },
            giftItemID: '',
            key: 'send',
            total: 2,
            pageNo: 1,
            pageSize: 10,
            queryParams: {

            },
        };
        this.queryForm = null;
    }

    proRecords = (quotaList = this.props.sendList) => {
        if (quotaList) {
            const _quotaList = quotaList.toJS();
            const { couponUsageList = [] } = _quotaList;
            couponUsageList.map((d, i) => {
                d.key = i;
                d.num = (_quotaList.pageNo - 1) * _quotaList.pageSize + i + 1;
                d.customerName = d.customerName ? d.customerName : '';
                d.customerMobile = d.customerMobile ? d.customerMobile : '';
                d.sendShopName = d.sendShopName ? d.sendShopName : '';
                d.validUntilDate = d.validUntilDate ? Moment(d.validUntilDate, 'YYYYMMDDHHmmss').format(format) : '';
                d.EGiftEffectTime = d.EGiftEffectTime ? Moment(d.EGiftEffectTime, 'YYYYMMDDHHmmss').format(format) : '';
                d.createTime = d.createTime ? Moment(d.createTime, 'YYYYMMDDHHmmss').format(format) : '';
                d.usingTime = d.usingTime && d.usingTime != 0 ? Moment(d.usingTime, 'YYYYMMDDHHmmss').format(format) : '';
                return d;
            });
            return {
                dataSource: couponUsageList,
                pageNo: _quotaList.pageNo,
                pageSize: _quotaList.pageSize,
                total: _quotaList.totalSize,
            }; 
        }
        return {
            dataSource: [],
            pageNo: 1,
            pageSize: 10,
            total: 0,
        }
    }
    getData(params = {}) {
        const { FetchSendorUsedListAC, _key, data: { giftItemID } } = this.props;
        FetchSendorUsedListAC({
            params: {
                pageNo: 1,
                pageSize: 10,
                ...params,
                giftItemID,
            },
            isSend: _key === 'send'
        });
    }
    reloading(fn) {
        fn();
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    handleFormChange(k, v, f) {
    }
    handleQuery(used) {
        this.queryForm.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const params = {};
            _.mapKeys(values, (v, k) => {
                if (v) {
                    switch (k) {
                        case 'timeRangeSend':
                            if (v.length > 0) {
                                params.startDate = v[0].format('YYYY-MM-DD HH:mm:ss');
                                params.endDate = v[1].format('YYYY-MM-DD HH:mm:ss');
                            }
                            break;
                        case 'timeRangeUsed':
                            if (v.length > 0) {
                                params.useStartTime = v[0].format('YYYY-MM-DD HH:mm:ss');
                                params.useEndTime = v[1].format('YYYY-MM-DD HH:mm:ss');
                            }
                            break;
                        default:
                            params[k] = v;
                            break;
                    }
                }
            });
            if (used) {
                params.giftStatus = '2';
            }
            this.reloading(() => {
                this.setState({ loading: true });
            }).then(() => {
                this.getData(params);
                const _params = Object.assign(params, values);
                this.setState({ queryParams: _params });
                const { UpdateSendorUsedParamsAC } = this.props;
                UpdateSendorUsedParamsAC({ params: _params });
            });
        });
    }

    handlePageChange = (pageNo, pageSize) => {
        const { queryParams } = this.state;
        this.setState({
            pageNo,
            pageSize,
        });
        const { UpdateSendorUsedPageAC } = this.props;
        UpdateSendorUsedPageAC({
            page: {
                pageNo,
                pageSize,
                total: 10,
            },
        });
        this.getData({ ...queryParams, pageNo, pageSize });
    }
    render() {
        const {
            dataSource,
            pageNo,
            pageSize,
            total,
        } = this.proRecords();
        const { _key } = this.props;
        const formKeys = _key === 'send' ?
            [
                { col: { span: 12 }, keys: [ 'getWay', 'timeRangeSend', ] },
                { col: { span: 12 }, keys: [ 'giftStatus', 'mobileNum', ] },
            ]
            :
            [
                { col: { span: 12 }, keys: [ 'getWay', 'timeRangeSend', ] },
                { col: { span: 12 }, keys: [ 'mobileNum' ] },
            ];
        return (
            <div className={styles.giftSendCount}>
                <Row type="flex" align="bottom">
                    <Col span={24}>
                        <BaseForm
                            getForm={form => this.queryForm = form}
                            formItems={this.state.formItems}
                            formData={this.state.queryParams}
                            formKeys={formKeys}
                            onChange={(key, value) => this.handleFormChange(key, value, this.queryForm)}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col
                        span={3}
                        push={21}
                    >
                        <Button type="primary" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table
                            bordered={true}
                            columns={this.state.columns}
                            dataSource={dataSource}
                            scroll={{ x: 1100 }}
                            key={this.props.key}
                            pagination={{
                                key: this.props.key,
                                showSizeChanger: true,
                                pageSize,
                                current: pageNo,
                                total,
                                showQuickJumper: true,
                                onChange: this.handlePageChange,
                                onShowSizeChange: this.handlePageChange,
                                showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
                            }}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // sendorUsedList: state.sale_giftInfoNew.get('sendorUsedList'),
        sendList: state.sale_giftInfoNew.get('sendList'),
        usedList: state.sale_giftInfoNew.get('usedList'),
        sendorUsedPage: state.sale_giftInfoNew.get('sendorUsedPage'),
        sendorUsedParams: state.sale_giftInfoNew.get('sendorUsedParams'),
        shopData: state.sale_giftInfoNew.get('shopData'),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        FetchSendorUsedListAC: opts => dispatch(FetchSendorUsedList(opts)),
        UpdateSendorUsedPageAC: opts => dispatch(UpdateSendorUsedPage(opts)),
        UpdateSendorUsedParamsAC: opts => dispatch(UpdateSendorUsedParams(opts)),
        FetchGiftSchemaAC: opts => dispatch(FetchGiftSchema(opts)),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RedPacketSendOrUsedTable);
