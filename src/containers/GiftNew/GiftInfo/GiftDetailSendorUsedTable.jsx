import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Table, Button, Icon, TreeSelect, Input } from 'antd';
import _ from 'lodash';
import Moment from 'moment';
import BaseForm from '../../../components/common/BaseForm';
import styles from './GiftInfo.less';
import {
    FetchSendorUsedList,
    UpdateSendorUsedPage,
    UpdateSendorUsedParams,
    FetchGiftSchema,
} from '../_action';
import { FORMITEMS, SEND_FORMKEYS, SEND_COLUMNS, USED_FORMKEYS, USED_COLUMNS } from './_tableSendConfig';

const format = 'YYYY/MM/DD HH:mm';
class GiftSendOrUsedCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            dataSource: [],
            columns: SEND_COLUMNS,
            formItems: FORMITEMS,
            formKeys: SEND_FORMKEYS,
            giftItemID: '',
            key: 'send',
            total: 2,
            pageNo: 1,
            pageSize: 10,
            queryParams: {

            },
            giftType: '80',
        };
        this.queryForm = null;
    }
    componentWillMount() {
        const { sendorUsedList, _key, data: { giftItemID, giftType }, FetchGiftSchemaAC, shopData } = this.props;
        const { pageNo, pageSize } = this.state;
        this.setState({ giftItemID, key: _key, pageNo, pageSize });
        this.proRecords(sendorUsedList);
        if (_key === 'send') {
            this.setState({
                columns: SEND_COLUMNS,
                formKeys: SEND_FORMKEYS,
                formItems: {
                    ...FORMITEMS,
                    sendShopID: {
                        label: '发出店铺',
                        labelCol: { span: 4 },
                        wrapperCol: { span: 20 },
                        type: 'custom',
                        render: decorator => this.handleShop(decorator),
                    },
                },
                giftType,
            });
        } else if (_key === 'used') {
            this.setState({
                columns: USED_COLUMNS,
                formKeys: USED_FORMKEYS,
                formItems: {
                    ...FORMITEMS,
                    usingShopID: {
                        label: '使用店铺',
                        labelCol: { span: 5 },
                        wrapperCol: { span: 19 },
                        type: 'custom',
                        render: decorator => this.handleShop(decorator),
                    },
                },
                giftType,
            });
        }
        const _shopData = shopData.toJS();
        if (_shopData.length === 0) {
            FetchGiftSchemaAC({})
        }
    }
    componentWillReceiveProps(nextProps) {
        this.queryForm && this.queryForm.resetFields();
        const { sendorUsedList, _key, data: { giftItemID, giftType }, sendorUsedPage, sendorUsedParams, shopData } = nextProps;
        if (sendorUsedPage) {
            // const { pageNo, pageSize } = sendorUsedPage.toJS();
            this.setState({ giftItemID, key: _key, pageNo: 1, pageSize: 10 });
        } else {
            // const { pageNo, pageSize } = this.state;
            this.setState({ giftItemID, key: _key, pageNo: 1, pageSize: 10 });
        }
        if (sendorUsedParams) {
            const _sendorUsedParams = sendorUsedParams.toJS();
            this.setState({ queryParams: _sendorUsedParams });
        }
        if (_key === 'send') {
            this.setState({
                columns: SEND_COLUMNS,
                formKeys: SEND_FORMKEYS,
                giftType,
            });
        } else if (_key === 'used') {
            this.setState({
                columns: USED_COLUMNS,
                formKeys: USED_FORMKEYS,
                giftType,
            });
        }
        this.proRecords(sendorUsedList);
        const _shopData = shopData.toJS();
        this.proShopData(_shopData);
    }
    proShopData = (shops = []) => {
        const treeData = [];
        shops.map((item, idx) => {
            const index = _.findIndex(treeData, { label: item.cityName })
            if (index !== -1) {
                treeData[index].children.push({
                    label: item.shopName,
                    value: item.shopID,
                    key: item.shopID,
                });
            } else {
                treeData.push({
                    label: item.cityName,
                    key: item.cityID,
                    children: [{
                        label: item.shopName,
                        value: item.shopID,
                        key: item.shopID,
                    }],
                });
            }
        });
        this.setState({ treeData });
    }
    proRecords = (quotaList) => {
        const { giftType } = this.state;
        if (quotaList) {
            const _quotaList = quotaList.toJS();
            if (giftType === '80') {
                const { couponUsageList = [] } = _quotaList;
                couponUsageList.map((d, i) => {
                    d.key = i;
                    d.num = i + 1;
                    d.customerName = d.customerName ? d.customerName : '';
                    d.customerMobile = d.customerMobile ? d.customerMobile : '';
                    d.sendShopName = d.sendShopName ? d.sendShopName : '';
                    d.validUntilDate = d.validUntilDate ? Moment(d.validUntilDate, 'YYYYMMDDHHmmss').format('YYYY/MM/DD') : '--';
                    d.createTime = d.createTime ? Moment(d.createTime, 'YYYYMMDDHHmmss').format(format) : '--';
                    return d;
                });
                this.setState({
                    dataSource: couponUsageList,
                    loading: false,
                    pageNo: _quotaList.pageNo,
                    pageSize: _quotaList.pageSize,
                    total: _quotaList.totalSize,
                });
            } else {
                const { couponUsageList = [] } = _quotaList;
                couponUsageList.map((d, i) => {
                    d.key = i;
                    d.num = (_quotaList.pageNo - 1) * _quotaList.pageSize + i + 1;
                    d.customerName = d.customerName ? d.customerName : '';
                    d.customerMobile = d.customerMobile ? d.customerMobile : '';
                    d.sendShopName = d.sendShopName ? d.sendShopName : '';
                    d.validUntilDate = d.validUntilDate ? Moment(d.validUntilDate, 'YYYYMMDDHHmmss').format('YYYY/MM/DD') : '--';
                    d.createTime = d.createTime ? Moment(d.createTime, 'YYYYMMDDHHmmss').format(format) : '--';
                    d.usingTime = d.usingTime && d.usingTime != 0 ? Moment(d.usingTime, 'YYYYMMDDHHmmss').format(format) : '--';
                    return d;
                });
                this.setState({
                    dataSource: couponUsageList,
                    loading: false,
                    pageNo: _quotaList.pageNo,
                    pageSize: _quotaList.pageSize,
                    total: _quotaList.totalSize,
                });
            }
        }
    }
    getData(params = {}) {
        const { FetchSendorUsedListAC } = this.props;
        const { giftItemID } = this.state;
        FetchSendorUsedListAC({
            params: {
                pageNo: 1,
                pageSize: 10,
                ...params,
                giftItemID,
            },
        });
    }
    handleShop(decorator) {
        return (
            <Row>
                <Col className={`${this.state.key}_giftDetailUsedCount`}>
                    {decorator({})(
                        <TreeSelect
                            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                            treeData={this.state.treeData}
                            placeholder="请选择店铺"
                            showSearch={true}
                            getPopupContainer={() => document.querySelector(`.${this.state.key}_giftDetailUsedCount`)}
                            treeNodeFilterProp="label"
                            allowClear={true}
                        />
                    )}
                </Col>
            </Row>
        )
    }
    reloading(fn) {
        fn();
        return new Promise((resolve, reject) => {
            resolve();
        });
    }
    handleFormChange(k, v, f) {
        console.log(k, v, f);
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
        const { loading, dataSource, key } = this.state;
        return (
            <div className={styles.giftSendCount}>
                <Row type="flex" align="bottom">
                    <Col span={`${key === 'send' ? 24 : 21}`}>
                        <BaseForm
                            getForm={form => this.queryForm = form}
                            formItems={this.state.formItems}
                            formData={this.state.queryParams}
                            formKeys={this.state.formKeys}
                            onChange={(key, value) => this.handleFormChange(key, value, this.queryForm)}
                        />
                    </Col>
                    <Col
                        span={`${key === 'send' ? 1 : 3}`}
                        pull={`${key === 'send' ? 3 : 0}`}
                        style={key === 'send' ? { position: 'absolute', top: 143, left: 749 } : {}}
                    >
                        {
                            key === 'send' ?
                                <Row>
                                    <Col span={24} push={5}><Button type="primary" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button></Col>
                                    <Col span={0} push={0}><Button type="ghost"><Icon type="export" />导出</Button></Col>
                                </Row>
                                :
                                <Row>
                                    <Col span={10} offset={1} push={3}><Button type="primary" onClick={() => this.handleQuery({ giftStatus: '2' })}><Icon type="search" />查询</Button></Col>
                                    <Col span={0}><Button type="ghost"><Icon type="export" />导出</Button></Col>
                                </Row>
                        }
                    </Col>
                    <Col span={24}>
                        <Table
                            bordered={true}
                            columns={this.state.columns}
                            dataSource={dataSource}
                            loading={loading}
                            pagination={{
                                showSizeChanger: true,
                                pageSize: this.state.pageSize,
                                current: this.state.pageNo,
                                total: this.state.total,
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
        sendorUsedList: state.sale_giftInfoNew.get('sendorUsedList'),
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
)(GiftSendOrUsedCount);
