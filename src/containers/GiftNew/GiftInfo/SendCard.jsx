import { connect } from 'react-redux';
import React from 'react';
import { Row, Col, Table, Button, Icon, TreeSelect } from 'antd';
import _ from 'lodash';
import { COMMON_LABEL } from 'i18n/common';
import GiftCfg from '../../../constants/Gift';
import BaseForm from '../../../components/common/BaseForm';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont';
import CardOperate from './QuatoCardDetailModalTabsSendCard';
import ExportModal from './ExportModal';
import Authority from '../../../components/common/Authority';

import styles from './GiftInfo.less';
import { mapValueToLabel } from 'helpers/util';
import { SENDCARD_COLUMNS, SENDCARD_QUERY_FORMITEMS, SENDCARD_FORMKEYS } from './_tableSendCardListConfig';
import { MADECARD_COLUMNS, MADECARD_FORMKEYS, MADECARD_QUERY_FORMITEMS } from './_tableMadeCardConfig';
import { PWDSafe } from './QuatoCardDetailModalTabs';
import { CARD_SUM_COLUMNS, CARD_SUM_FORMITEMS, CARD_SUM_FROMKEYS } from './_tableCardSumConfig';
import {
    FetchQuotaCardSum,
    UpdateTabKey,
    UpdateBatchNO,
    FetchGiftSchema,
    FetchQuotaList,
} from '../_action';

class SendCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataSource: [],
            cardProps: {},
            total: 2,
            pageNo: 1,
            pageSize: 10,
            params: {},
            formData: this.props.formData,
            batchNO: '',
            selectedRowKeys: [],
            selectedRows: [],
            treeData: [],
            sumData: {},
            columns: [
                ...[{
                    title: COMMON_LABEL.serialNumber,
                    dataIndex: 'rowNum',
                    key: 'rowNum',
                    className: 'TableTxtCenter',
                }, {
                    title: COMMON_LABEL.actions,
                    dataIndex: 'operate',
                    key: 'operate',
                    fixed: 'left',
                    width: 80,
                    className: 'TableTxtCenter',
                    render: (v, rec) => (<span className="operate"><a href="javaScript:;" onClick={() => this.handleMore(rec)}>{COMMON_LABEL.detail}</a></span>),
                }],
                ...SENDCARD_COLUMNS,
            ],
            formItems: SENDCARD_QUERY_FORMITEMS,
            formKeys: SENDCARD_FORMKEYS,
        };
        this.queryForm = null;
    }

    componentDidMount() {
        const { _key, batchNO, quotaList, detailVisible } = this.props;
        this.getData().then(() => {
            this.setState({
                loading: false,
            });
        });
        this.getTableConfigByKey();
        if (_key === 'made') {
            this.setState({
                formData: { batchNO_madeCard: batchNO },
            });
        }
        if (_key === 'sum') {
            const { shopData, FetchGiftSchemaAC } = this.props;
            const _shopData = shopData.toJS();
            if (_shopData.length > 0) {
                this.proShemaData(_shopData);
            } else {
                FetchGiftSchemaAC({});
            }
        }
        this.proRecords(quotaList, _key);
    }

    componentWillReceiveProps(nextProps) {
        this.queryForm && this.queryForm.resetFields();
        const { batchNO, quotaList, _key, shopData } = nextProps;
        const _shopData = shopData.toJS();
        this.proShemaData(_shopData);
        if (_key === 'made') {
            this.setState({
                formData: { batchNO_madeCard: batchNO, ...this.state.formData },
            });
        }
        this.proRecords(quotaList, _key);
    }

    proRecords = (quotaList, _key) => {
        if (quotaList) {
            const _quotaList = quotaList.toJS();
            const { page = {}, total } = _quotaList;
            let records = [];
            if (_key === 'send') {
                records = _quotaList.quotaCardList || [];
            } else {
                records = _quotaList.quotaBatchDetails || [];
            }
            records.map((d, i) => {
                d.key = i;
                d.rowNum = i + 1;
                return d;
            });
            this.setState({
                dataSource: records,
                total: page.totalSize,
                sumData: { ...total },
            });
        }
    }

    proShemaData = (data = []) => {
        const treeData = [];
        data.map((item, idx) => {
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
    getTableConfigByKey = () => {
        const { _key } = this.props;
        let giftType = this.props.data.giftType;

        switch (_key) {
            case 'send':
                const _SENDCARD_COLUMNS = _.cloneDeep(SENDCARD_COLUMNS)
                // _SENDCARD_COLUMNS.splice(9,0,{
                //     title: '已过期',
                //     dataIndex: 'expiredNum',
                //     key: 'expiredNum',
                //     className: 'x-tr',
                // })
                // _SENDCARD_COLUMNS.push({
                //     title: '有效期',
                //     dataIndex: 'termStr',
                //     key: 'termStr',
                //     className: 'TableTxtCenter',
                //     width: 180
                // })
                this.setState({
                    columns: [
                        ...[{
                            title: COMMON_LABEL.serialNumber,
                            dataIndex: 'rowNum',
                            key: 'rowNum',
                            className: 'TableTxtCenter',
                            fixed: 'left',
                        }, {
                            title: COMMON_LABEL.actions,
                            dataIndex: 'operate',
                            key: 'operate',
                            fixed: 'left',
                            width: 80,
                            className: 'TableTxtCenter',
                            render: (v, rec) => (<span className="operate"><a href="javaScript:;" onClick={() => this.handleMore(rec)}>{COMMON_LABEL.detail}</a></span>),
                        }],
                        ..._SENDCARD_COLUMNS,
                    ],
                    formItems: SENDCARD_QUERY_FORMITEMS,
                    formKeys: SENDCARD_FORMKEYS,
                })
                break;
            case 'made':
                if (giftType == '90') { // 礼品定额卡
                    MADECARD_QUERY_FORMITEMS.queryGiftStatus.options = GiftCfg.giftQuotaCardStatus;
                }
                this.setState({
                    columns: [
                        ...MADECARD_COLUMNS,
                        ...[{
                            title: '密码',
                            dataIndex: 'giftPWD',
                            key: 'giftPWD',
                            width: 110,
                            render: (value, record) => <PWDSafe key={record.cardNO} value={value} />,
                        }, {
                            title: COMMON_LABEL.status,
                            dataIndex: 'giftStatus',
                            key: 'giftStatus',
                            width: 60,
                            render: (text, record, index) => {
                                return <span>{mapValueToLabel(giftType == '90' ? GiftCfg.giftQuotaCardStatus : GiftCfg.giftCardStatus, String(text))}</span>
                            },
                        },
                        {
                            title: '有效期',
                            dataIndex: 'termStr',
                            key: 'termStr',
                            className: 'TableTxtCenter',
                            width: 200
                        }
                        ],
                    ],
                    formItems: MADECARD_QUERY_FORMITEMS,
                    formKeys: MADECARD_FORMKEYS,
                })
                break;
            case 'sum':
                if (giftType == '90') { // 礼品定额卡
                    CARD_SUM_FORMITEMS.giftStatus.options = GiftCfg.giftQuotaCardStatus;
                }
                this.setState({
                    columns: CARD_SUM_COLUMNS,
                    formItems: {
                        ...CARD_SUM_FORMITEMS,
                        usingShopID: {
                            label: '售出店铺',
                            type: 'custom',
                            render: decorator => this.handleShop(decorator),
                            labelCol: { span: 6 },
                            wrapperCol: { span: 18 },
                        },
                    },
                    formKeys: CARD_SUM_FROMKEYS,
                });
                break;
            default:
                break;
        }
    }

    getData(_params = {}) {
        const { data: { giftItemID }, _key, FetchQuotaListAC } = this.props;
        let params = { ...{ pageNo: 1, pageSize: 10, giftItemID }, ..._params }
        let callserver = '';
        if (_key === 'send') {
            callserver = '/coupon/couponQuotaService_getQuotaBatch.ajax';
        } else {
            callserver = '/coupon/couponQuotaService_getQuotaBatchDetails.ajax';
        }
        if (_key === 'made') {
            const { batchNO } = this.props;
            params = { ...{ batchNO: batchNO || '' }, ...params }
        }
        let dataConfig = '';
        if (_key === 'send') {
            dataConfig = 'data.quotaCardList';
        } else {
            dataConfig = 'data.quotaBatchDetails';
        }
        this.setState({
            loading: true,
        }, () => {
            setTimeout(() => {
                this.setState({ loading: false, })
            }, 0)
        });
        return FetchQuotaListAC({
            params,
            callserver,
            dataConfig,
        });
    }

    handleFormChange(k, v) {
    }

    handleQuery() {
        this.queryForm.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const params = this.formatFormData(values);
            const _params = this.proParamsByType(params);
            this.reloading((loading) => {
                this.setState({
                    loading,
                    params: _params,
                    pageNo: 1,
                    pageSize: 10,
                });
            }).then(() => {
                this.getData(_params).then(() => {
                    this.setState({
                        formData: values,
                        loading: false,
                    });
                });
            });
        });
    }

    formatFormData = (params) => {
        return _.mapValues(params, (value, key) => {
            switch (key) {
                default:
                    return value !== undefined ? value : '';
            }
        })
    }
    proParamsByType = (_params) => {
        const { _key } = this.props;
        let params = _params;
        switch (_key) {
            case 'send':
                {
                    params.batchNO = params.batchNO_sendCard;
                    const sendTime = params.timeRangeSend_sendCard;
                    if (sendTime && sendTime.length > 0) {
                        params.beginCreateStamp = sendTime[0].format('YYYYMMDDHHmmss');
                        params.endCreateStamp = sendTime[1].format('YYYYMMDDHHmmss');
                    }
                    params = _.omit(params, 'batchNO_sendCard', 'timeRangeSend_sendCard');
                    return params;
                }
            case 'made':
                {
                    params.cardNO = params.cardNO_madeCard;
                    params.batchNO = params.batchNO_madeCard;
                    params = _.omit(params, 'cardNO_madeCard', 'batchNO_madeCard');
                    return params;
                }
            case 'sum':
                {
                    params.cardNO = params.cardNO_sum;
                    params.batchNO = params.batchNO_sum;
                    const sumTime = params.timeRangeSend_sum;
                    if (sumTime && sumTime.length > 0) {
                        params.beginSellTime = sumTime[0].format('YYYYMMDDHHmmss');
                        params.endSellTime = sumTime[1].format('YYYYMMDDHHmmss');
                    }
                    params = _.omit(params, 'batchNO_sum', 'cardNO_sum', 'timeRangeSend_sum');
                    return params;
                }
            default:
                return null;
        }
    }

    handleShop(decorator) {
        return (
            <Row>
                <Col className="giftDetailUsedCount">
                    {decorator({})(
                        <TreeSelect
                            dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
                            treeData={this.state.treeData}
                            placeholder="请选择入会店铺"
                            showSearch={true}
                            notFoundContent={'未搜索到结果'}
                            getPopupContainer={() => document.querySelector('.giftDetailUsedCount')}
                            treeNodeFilterProp="label"
                            allowClear={true}
                        />
                    )}
                </Col>
            </Row>
        )
    }

    handleMore(rec) {
        const { UpdateTabKeyAC, UpdateBatchNOAC } = this.props;
        UpdateTabKeyAC({
            key: 'made',
        });
        UpdateBatchNOAC({
            batchNO_madeCard: rec.batchNO,
        });
        this.setState({
            formData: { batchNO_madeCard: rec.batchNO },
        });
    }

    handleSend() {
        const cardProps = {
            title: '添加发卡',
            visible: true,
            onCancel: reload => this.handleCancel(reload),
            giftItemID: this.props.data.giftItemID,
            type: 'sendCard',
        };
        this.setState({ cardProps });
    }

    // 作废
    handleDelete() {
        const { selectedRows } = this.state;
        const cardProps = {
            title: selectedRows.length > 0 ? '作废' : '批量作废',
            visible: true,
            onCancel: reload => this.handleCancel(reload),
            type: selectedRows.length > 0 ? 'cancel' : 'batchCancel',
            giftItemID: this.props.data.giftItemID,
            selectedRow: selectedRows,
        };
        this.setState({
            cardProps,
            selectedRows: [],
        });
    }

    // 取消作废
    handleCancelDelete() {
        const { selectedRows } = this.state;
        const cardProps = {
            title: selectedRows.length > 0 ? '取消作废' : '批量取消作废',
            visible: true,
            onCancel: reload => this.handleCancel(reload),
            type: selectedRows.length > 0 ? 'noCancel' : 'batchNoCancel',
            giftItemID: this.props.data.giftItemID,
            selectedRow: selectedRows,
        };
        this.setState({
            cardProps,
            selectedRows: [],
        });
    }

    handleCancel(reload) {
        this.reloading((loading) => {
            this.setState({
                loading,
                cardProps: { visible: false },
                selectedRowKeys: [],
            });
        }, reload).then(() => {
            this.getData({ pageNo: 1, pageSize: 10 }).then(() => {
                this.setState({
                    loading: false,
                })
            });
            this.setState({
                pageNo: 1,
                pageSize: 10,
            });
            const { FetchQuotaCardSumAC, data } = this.props;
            const giftItemID = data.giftItemID;
            FetchQuotaCardSumAC({
                giftItemID,
            });
        });
    }

    reloading(fn, reload = true) {
        fn(reload);
        return new Promise((resolve) => {
            reload && resolve();
        });
    }

    handlePageChange = (pageNo, pageSize) => {
        const { params } = this.state;
        this.setState({
            loading: true,
            selectedRowKeys: [],
            selectedRows: []
        });
        this.getData({ ...params, pageNo, pageSize }).then(() => {
            this.setState({
                ...params,
                pageNo,
                pageSize,
            });
        }).then(() => {
            this.setState({
                loading: false,
            })
        })
    }

    handleSelected(selectedRowKeys, selectedRows) {
        this.setState({ selectedRowKeys, selectedRows });
    }
    handleExport() {
        const { _key } = this.props;
        this.queryForm.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const params = this.formatFormData(values);
            const _params = this.proParamsByType(params);
            this.setState({
                params: _params,
                exportVisible: true
            });
        });
    }

    render() {
        const { loading, dataSource, cardProps, sumData, pageNo, pageSize, total, formData } = this.state;
        const { _key, data } = this.props;
        const spanLeft = _key === 'sum' ? 21 : (_key === 'made' ? 16 : 17);
        const spanRight = _key === 'sum' ? 3 : (_key === 'made' ? 8 : 7);
        const isDeleted = data.action == 2;
        return (
            <div className={styles.cardSummarize}>
                <Row>
                    <Col span={spanLeft}>
                        <BaseForm
                            getForm={form => this.queryForm = form}
                            formItems={this.state.formItems}
                            formKeys={this.state.formKeys}
                            formData={formData}
                            onChange={(key, value) => this.handleFormChange(key, value, this.queryForm)}
                        />
                    </Col>
                    <Col span={spanRight}>
                        {
                            _key === 'made' ?
                                <Row>
                                    <Col span={6}><Button type="primary" onClick={() => this.handleQuery()}><Icon
                                        type="search"
                                    />{COMMON_LABEL.query}</Button></Col>
                                    <Col span={6}>
                                        <Button type="ghost"
                                            disabled={total == 0}
                                            onClick={() => this.handleExport()}
                                            style={{ borderRadius: '0' }}
                                        >
                                            <Icon type="export" />{COMMON_LABEL.export}
                                        </Button>
                                    </Col>
                                    {
                                        !isDeleted && (
                                            <Col span={6}>
                                                <Button style={{ borderRadius: '0' }} type="ghost" onClick={() => this.handleDelete()}><Iconlist
                                                    className="send-gray"
                                                    iconName={'作废'}
                                                />
                                                    作废
                                                </Button>
                                            </Col>
                                        )
                                    }
                                    {
                                        !isDeleted && (
                                            <Col span={6}>
                                                <Button
                                                    type="ghost"
                                                    style={{ padding: '4px 10px', borderRadius: '0 3px 3px 0' }}
                                                    onClick={() => this.handleCancelDelete()}
                                                >
                                                    取消作废
                                                </Button>
                                            </Col>
                                        )
                                    }
                                </Row>
                                : (
                                    _key === 'send' ?
                                        <Row>
                                            <Col span={8}><Button type="primary" onClick={() => this.handleQuery()}><Icon
                                                type="search"
                                            />{COMMON_LABEL.query}</Button></Col>
                                            <Col span={8} >
                                                <Button type="ghost" disabled={total == 0} onClick={() => this.handleExport()}>
                                                    <Icon
                                                        type="export"
                                                    /> {COMMON_LABEL.export} </Button>
                                            </Col>
                                            {
                                                !isDeleted && (
                                                    <Col span={8}><Button type="ghost" onClick={() => this.handleSend()}><Iconlist
                                                        className="send-gray"
                                                        iconName={'发布'}
                                                    />发卡</Button></Col>
                                                )
                                            }
                                        </Row>
                                        :
                                        <div>
                                            <Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => this.handleQuery()}
                                                    ><Icon type="search" />{COMMON_LABEL.query}</Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type="ghost"
                                                        disabled={total == 0}
                                                        onClick={() => this.handleExport()}
                                                    ><Icon type="export" />{COMMON_LABEL.export}</Button>
                                                </Col>
                                            </Row>
                                        </div>
                                )
                        }
                    </Col>
                </Row>
                <Row>
                    <Table
                        className="tableStyles"
                        bordered={true}
                        columns={this.state.columns.map(c => (c.render ? ({
                            ...c,
                            render: c.render.bind(this),
                        }) : c))}
                        dataSource={dataSource}
                        scroll={_key === 'made' ? {} : (_key === 'sum' ? { x: 1700 } : _key === 'send' ? { x: 1330 } : { x: 930 })}
                        rowSelection={this.props._key === 'made' ? {
                            onChange: (selectedRowKeys, selectedRows) => this.handleSelected(selectedRowKeys, selectedRows),
                            selectedRowKeys: this.state.selectedRowKeys,
                        } : null}
                        loading={loading}
                        pagination={{
                            showSizeChanger: true,
                            pageSize,
                            current: pageNo,
                            total,
                            showQuickJumper: true,
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.handlePageChange,
                            showTotal: (totalSize, range) => `本页${range[0]}-${range[1]}/ 共 ${totalSize}条`,
                        }}
                    />
                    {
                        _key === 'sum' ?
                            !_.isEmpty(sumData)
                            && (<div className="sumData">
                                <div>{`共计：${sumData.total}条记录`}</div>
                                <div>{`实收合计：${sumData.moneyTotal}`}</div>
                            </div>)
                            :
                            null
                    }
                </Row>
                {
                    cardProps.visible ? <CardOperate {...cardProps} /> : null
                }
                {
                    !this.state.exportVisible ? null :
                        <ExportModal
                            params={this.state.params}
                            _key={_key}
                            giftItemID={this.props.data.giftItemID}
                            handleClose={() => this.setState({ exportVisible: false })}
                            shopData={this.props.shopData}
                        />
                }
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        batchNO: state.sale_giftInfoNew.get('batchNO'),
        shopData: state.sale_giftInfoNew.get('shopData'),
        quotaList: state.sale_giftInfoNew.get('quotaList'),
        detailVisible: state.sale_giftInfoNew.get('detailVisible'),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        FetchQuotaCardSumAC: opts => dispatch(FetchQuotaCardSum(opts)),
        UpdateTabKeyAC: opts => dispatch(UpdateTabKey(opts)),
        UpdateBatchNOAC: opts => dispatch(UpdateBatchNO(opts)),
        FetchGiftSchemaAC: opts => dispatch(FetchGiftSchema(opts)),
        FetchQuotaListAC: opts => dispatch(FetchQuotaList(opts)),
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SendCard);
