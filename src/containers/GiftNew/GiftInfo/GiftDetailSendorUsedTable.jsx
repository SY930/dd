import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Table, Button, Icon, TreeSelect, Input, Tooltip, message } from 'antd';
import _ from 'lodash';
import { COMMON_LABEL } from 'i18n/common';
import Moment from 'moment';
import BaseForm from '../../../components/common/BaseForm';
import styles from './GiftInfo.less';
import GiftCfg from '../../../constants/Gift';
import {
    FetchSendorUsedList,
    UpdateSendorUsedPage,
    UpdateSendorUsedParams,
    FetchGiftSchema,
} from '../_action';
import { FORMITEMS, SEND_FORMKEYS, WX_SEND_COLUMNS, USED_FORMKEYS, USED_COLUMNS, WX_SEND_FORMKEYS, SEND_GIFTPWD_FORMKEYS, USED_SPE_COLUMNS, USED_SPE_FORMKEYS, BASE_COLUMNS } from './_tableSendConfig';
import { mapValueToLabel, axiosData } from 'helpers/util';
import { messageTemplateState } from 'containers/BasicSettings/reducers';
import TransGiftModal from './TransGiftModal';

const format = 'YYYY/MM/DD HH:mm:ss';
class GiftSendOrUsedCount extends React.Component {
    constructor(props) {
        super(props);
        this.queryForm = null;
        this.SEND_COLUMNS = [...BASE_COLUMNS.slice(0, 1),
            {
                title: '券编码',
                className:'TableTxtCenter',
                dataIndex: 'giftPWD',
                key: 'giftPWD',
                width: 200,
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            ...BASE_COLUMNS.slice(1, 4),
            {
                title: '生效时间',
                className:'TableTxtCenter',
                dataIndex: 'EGiftEffectTime',
                width: 160,
                key: 'EGiftEffectTime',
                render: value => <Tooltip title={value}><span>{value == '0' ? '' : value}</span></Tooltip>,
            },
            {
                title: '失效时间',
                className:'TableTxtCenter',
                dataIndex: 'validUntilDate',
                width: 160,
                key: 'validUntilDate',
                render: value => <Tooltip title={value}><span>{value == '0' ? '' : value}</span></Tooltip>,
            },
            {
                title: COMMON_LABEL.status,
                dataIndex: 'giftStatus',
                className:'TableTxtCenter',
                key: 'giftStatus',
                render: (value, record) => {
                    if(value == 102) {
                        if(value){
                            return <span><a onClick={this.handleTransCoupons.bind(this, record)}>{mapValueToLabel(GiftCfg.giftSendStatus, String(value))}</a></span>
                        }
                    }else {
                        return <span>{mapValueToLabel(GiftCfg.giftSendStatus, String(value))}</span>
                    } 
                },
            },
            {
                title: '客户编号',
                className:'TableTxtCenter',
                dataIndex: 'customerID',
                key: 'customerID',
                width: 200,
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
            },
            ...BASE_COLUMNS.slice(5),
            {
                title: '会员卡号',
                width: 120,
                className:'TableTxtCenter',
                dataIndex: 'transCardNo',
                render: value => <Tooltip title={value}><span>{value}</span></Tooltip>,
                key: 'transCardNo',
            },
            {
                title: '使用时间',
                className:'TableTxtCenter',
                dataIndex: 'usingTime',
                width: 160,
                key: 'usingTime',
                render: value => <Tooltip title={value}><span>{value == '0' ? '' : value}</span></Tooltip>,
            },
        ]
        this.state = {
            loading: true,
            dataSource: [],
            columns: this.SEND_COLUMNS,
            formItems: FORMITEMS,
            formKeys: SEND_FORMKEYS,
            giftItemID: '',
            key: 'send',
            total: 2,
            pageNo: 1,
            pageSize: 10,
            speGift: ['10', '20', '21', '30', '40', '42', '110', '111'],
            queryParams: {

            },
            giftType: '80',
            transGift: [],
            visible: false,
        };
    }
    componentWillMount() {
        // 后端不支持此字段getWay查询　故disable掉线上礼品卡的发送方式
        const { _key, data: { giftItemID, giftType }, FetchGiftSchemaAC, shopData, sendList, usedList } = this.props;
        const formItems = Object.assign({}, FORMITEMS);
        if (giftType === '91') {
            formItems.getWay.disabled = true;
        } else {
            formItems.getWay.disabled = null;
        }
        const sendorUsedList = _key === 'send' ? sendList : usedList;
        const { pageNo, pageSize } = this.state;
        this.setState({ giftItemID, key: _key, pageNo, pageSize });
        this.proRecords(sendorUsedList);
        if (_key === 'send') {
            const { speGift } = this.state;
            this.setState({
                columns: giftType === '91' ? WX_SEND_COLUMNS : this.SEND_COLUMNS,
                formKeys: giftType === '91' ? WX_SEND_FORMKEYS : speGift.indexOf(giftType) >= 0 ? SEND_GIFTPWD_FORMKEYS : SEND_FORMKEYS,
                formItems: {
                    ...formItems,
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
            const { speGift } = this.state;
            this.setState({
                columns: speGift.indexOf(giftType) >= 0 ? USED_SPE_COLUMNS : USED_COLUMNS,
                formKeys: speGift.indexOf(giftType) >= 0 ? USED_SPE_FORMKEYS : USED_FORMKEYS,
                formItems: {
                    ...formItems,
                    usingShopID: {
                        label: '使用店铺',
                        disabled: giftType === '80',
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
        // 后端不支持此字段getWay查询　故disable掉线上礼品卡的发送方式
        const {data} = nextProps;
        const formItems = this.state.formItems;
        formItems.getWay.disabled = data.giftType === '91';
        formItems.usingShopID && (formItems.usingShopID.disabled = data.giftType === '80');
        this.setState({formItems});

        this.queryForm && this.queryForm.resetFields();
        const { sendList, usedList, _key, data: { giftItemID, giftType }, sendorUsedPage, sendorUsedParams, shopData } = nextProps;
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
            const { speGift } = this.state;
            this.setState({
                columns: giftType === '91' ? WX_SEND_COLUMNS : this.SEND_COLUMNS,
                formKeys: giftType === '91' ? WX_SEND_FORMKEYS : speGift.indexOf(giftType) >= 0 ? SEND_GIFTPWD_FORMKEYS : SEND_FORMKEYS,
                giftType,
            });
        } else if (_key === 'used') {
            const { speGift } = this.state;
            this.setState({
                columns: speGift.indexOf(giftType) >= 0 ? USED_SPE_COLUMNS : USED_COLUMNS,
                formKeys: speGift.indexOf(giftType) >= 0 ? USED_SPE_FORMKEYS : USED_FORMKEYS,
                giftType,
            });
        }
        const sendorUsedList = _key === 'send' ? sendList : usedList;
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
    handleModalClose = () => {
        this.setState({
            visible: false,
        })
    }
    handleTransCoupons = (records) => {
        let params = {
            voucherID: records.itemID
        }
        axiosData(
            '/coupon/couponService_queryCouponTransferRecord.ajax',
            { ...params },
            null,
            {path: 'data.transferDetailList',},
            'HTTP_SERVICE_URL_PROMOTION_NEW',
        )
            .then((records) => {
                this.setState({
                    transGift: records,
                    visible: true,
                })
            }, (err) => { 
                message.error(err)
            }).catch((err) => {
                console.log(err);
            });
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
                    d.validUntilDate = d.validUntilDate ? Moment(d.validUntilDate, 'YYYYMMDDHHmmss').format(format) : '';
                    d.EGiftEffectTime = d.EGiftEffectTime ? Moment(d.EGiftEffectTime, 'YYYYMMDDHHmmss').format(format) : '';
                    d.createTime = d.createTime ? Moment(d.createTime, 'YYYYMMDDHHmmss').format(format) : '';
                    d.usingTime = d.usingTime && d.usingTime != 0 ? Moment(d.usingTime, 'YYYYMMDDHHmmss').format(format) : '';
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
                    d.validUntilDate = d.validUntilDate ? Moment(d.validUntilDate, 'YYYYMMDDHHmmss').format(format) : '';
                    d.EGiftEffectTime = d.EGiftEffectTime ? Moment(d.EGiftEffectTime, 'YYYYMMDDHHmmss').format(format) : '';
                    d.createTime = d.createTime ? Moment(d.createTime, 'YYYYMMDDHHmmss').format(format) : '';
                    d.usingTime = d.usingTime && d.usingTime != 0 ? Moment(d.usingTime, 'YYYYMMDDHHmmss').format(format) : '';
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
        const { FetchSendorUsedListAC, _key } = this.props;
        const { giftItemID } = this.state;
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
                    <Col span={`${key === 'send' ? 24 : this.props._key == 'used' ? this.state.speGift.indexOf(this.props.data.giftType) >= 0 ? 24 : 21 : 21}`}>
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
                        pull={`${key === 'send' ? 3 : this.props._key == 'used' ? 3 : 0}`}
                        style={key === 'send' ? this.state.speGift.indexOf(this.props.data.giftType) >= 0 ? { position: 'relative', top: 0, left: 742 } :{ position: 'absolute', top: 143, left: 749 } :
                               key === 'used' ? this.state.speGift.indexOf(this.props.data.giftType) >= 0 ? { position: 'absolute', top: 101, left: 744 } :{}:{}}
                    >
                        {
                            key === 'send' ?
                                <Row>
                                    <Col span={24} push={5}><Button type="primary" onClick={() => this.handleQuery()}><Icon type="search" />{ COMMON_LABEL.query }</Button></Col>
                                    <Col span={0} push={0}><Button type="ghost"><Icon type="export" />{ COMMON_LABEL.export }</Button></Col>
                                </Row>
                                :
                                <Row>
                                    <Col span={10} offset={1} push={3}><Button type="primary" onClick={() => this.handleQuery({ giftStatus: '2' })}><Icon type="search" />{ COMMON_LABEL.query }</Button></Col>
                                    <Col span={0}><Button type="ghost"><Icon type="export" />{ COMMON_LABEL.export }</Button></Col>
                                </Row>
                        }
                    </Col>
                    <Col span={24}>
                        <Table
                            bordered={true}
                            columns={this.state.columns.map(c => (c.render ? ({
                                ...c,
                                render: c.render.bind(this),
                            }) : c))}
                            dataSource={dataSource}
                            loading={loading}
                            scroll={{ x: 1800 }}
                            key={this.props.key}
                            pagination={{
                                key: this.props.key,
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
                    {
                        this.state.visible ?
                        <TransGiftModal
                            transList={this.state.transGift}
                            onClose={this.handleModalClose}
                        /> : false
                    }
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
)(GiftSendOrUsedCount);
