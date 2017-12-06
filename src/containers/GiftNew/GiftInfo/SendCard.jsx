import { connect } from 'react-redux';
import React from 'react';
import { Row, Col, Table, Button, Icon, TreeSelect } from 'antd';
import _ from 'lodash';
import GiftCfg from '../../../constants/Gift';
import BaseForm from '../../../components/common/BaseForm';
import { Iconlist } from '../../../components/basic/IconsFont/IconsFont';
import CardOperate from './QuatoCardDetailModalTabsSendCard';
import styles from './GiftInfo.less';
import { mapValueToLabel } from '../../CrmNew/Common/CommonFn';
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
            loading: true,
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
                    title: '序号',
                    dataIndex: 'rowNum',
                    key: 'rowNum',
                    className: 'TableTxtCenter',
                }, {
                    title: '操作',
                    dataIndex: 'operate',
                    key: 'operate',
                    fixed: 'left',
                    width: 80,
                    className: 'TableTxtCenter',
                    render: (v, rec) => (<span className="operate"><a href="javaScript:;" onClick={() => this.handleMore(rec)}>详情</a></span>),
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
        if (detailVisible === true) {
            this.getData().then(() => {
                this.setState({
                    loading: false,
                });
            });
        }
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
        switch (_key) {
            case 'send':
                this.setState({
                    columns: [
                        ...[{
                            title: '序号',
                            dataIndex: 'rowNum',
                            key: 'rowNum',
                            className: 'TableTxtCenter',
                            fixed: 'left',
                        }, {
                            title: '操作',
                            dataIndex: 'operate',
                            key: 'operate',
                            fixed: 'left',
                            width: 80,
                            className: 'TableTxtCenter',
                            render: (v, rec) => (<span className="operate"><a href="javaScript:;" onClick={() => this.handleMore(rec)}>详情</a></span>),
                        }],
                        ...SENDCARD_COLUMNS,
                    ],
                    formItems: SENDCARD_QUERY_FORMITEMS,
                    formKeys: SENDCARD_FORMKEYS,
                })
                break;
            case 'made':
                this.setState({
                    columns: [
                        ...MADECARD_COLUMNS,
                        ...[{
                            title: '密码',
                            dataIndex: 'giftPWD',
                            key: 'giftPWD',
                            width: 110,
                            render: value => <PWDSafe value={value} />,
                        }, {
                            title: '状态',
                            dataIndex: 'giftStatus',
                            key: 'giftStatus',
                            width: 60,
                            render: (text, record, index) => {
                                return <span>{mapValueToLabel(GiftCfg.giftCardStatus, String(text))}</span>
                            },
                            // render:value=>value ? _.find(GiftCfg.giftCardStatus,{value:String(value)}).label : ''
                        }],
                    ],
                    formItems: MADECARD_QUERY_FORMITEMS,
                    formKeys: MADECARD_FORMKEYS,
                })
                break;
            case 'sum':
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
            callserver = 'getQuotaBatchInfo_dkl';
        } else {
            callserver = 'getQuotaBatchDetail_dkl';
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
        });
        return FetchQuotaListAC({
            params,
            callserver,
            dataConfig,
        });
    }

    handleFormChange(k, v) {
        // console.log(k,v,f);
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
        // this.props.onChange('made', rec.batchNO);
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

    render() {
        const { loading, dataSource, cardProps, sumData, pageNo, pageSize, total, formData } = this.state;
        const { _key } = this.props;
        const spanLeft = _key === 'sum' ? 21 : (_key === 'made' ? 16 : 17);
        const spanRight = _key === 'sum' ? 3 : (_key === 'made' ? 8 : 7);
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
                                    <Col span={8}><Button type="primary" onClick={() => this.handleQuery()}><Icon
                                        type="search"
                                    />查询</Button></Col>
                                    {/* <Col span={6}><Button type="ghost"><Icon type="export" />导出</Button></Col> */}
                                    <Col span={8}><Button type="ghost" onClick={() => this.handleDelete()}><Iconlist
                                        className="send-gray"
                                        iconName={'作废'}
                                    />作废</Button></Col>
                                    <Col span={8}><Button
                                        type="ghost"
                                        onClick={() => this.handleCancelDelete()}
                                    >取消作废</Button></Col>
                                </Row>
                                : (
                                    _key === 'send' ?
                                        <Row>
                                            <Col span={10}><Button type="primary" onClick={() => this.handleQuery()}><Icon
                                                type="search"
                                            />查询</Button></Col>
                                            {/* <Col span={8} ><Button type="ghost"><Icon type="export" />导出</Button></Col> */}
                                            <Col span={8}><Button type="ghost" onClick={() => this.handleSend()}><Iconlist
                                                className="send-gray"
                                                iconName={'发布'}
                                            />发卡</Button></Col>
                                        </Row>
                                        :
                                        <Row>
                                            <Col span={24} style={{ textAlign: 'right' }}>
                                                <Button
                                                    type="primary"
                                                    onClick={() => this.handleQuery()}
                                                ><Icon type="search" />查询</Button></Col>
                                        </Row>
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
                        scroll={_key === 'made' ? {} : (_key === 'sum' ? { x: 1500 } : { x: 980 })}
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
                <CardOperate {...cardProps} />
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        batchNO: state.giftInfoNew.get('batchNO'),
        shopData: state.giftInfoNew.get('shopData'),
        quotaList: state.giftInfoNew.get('quotaList'),
        detailVisible: state.giftInfoNew.get('detailVisible'),
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
