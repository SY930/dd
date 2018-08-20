import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Row, Col, Modal, Button, Tooltip, Table } from 'antd';
import _ from 'lodash';
import { getByteLength } from '../../../helpers/util';
import GiftDetailModalTabs from './GiftDetailModalTabs';
import styles from './GiftInfo.less';
import {
    UpdateSendorUsedTabKey,
    UpdateSendorUsedPage,
    UpdateSendorUsedParams, resetSendOrTotalCount,
} from '../_action';

class GiftDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: true,
            giftUsageList: [],
        };
    }
    componentWillReceiveProps(nextProps) {
        // const {visible} = nextProps;
        // if (visible) {
        //     const {data:{giftItemID}} = nextProps;
        //     fetchData('getGiftSummary_dkl', {
        //         giftItemID
        //     }, null, {path: "data"}).then(data=> {
        //         let dataSource = [];
        //         if (data) {
        //             let giftStatusCounts = data.summaryByGiftStatusList ? data.summaryByGiftStatusList : [];
        //             let sumCount = data.giftSummary;
        //             giftStatusCounts.map((d, i)=> {
        //                 d.key = d.giftStatus;
        //                 d.giftStatus = _.find(GiftCfg.giftSendStatus, {value: String(d.giftStatus)}).label;
        //                 dataSource.push(d);
        //             });
        //             sumCount = _.mapKeys(sumCount, (v, k)=> {
        //                 if (k == 'countTotal') {
        //                     return 'sum';
        //                 } else {
        //                     return k.replace('count', 'sum');
        //                 }
        //             });
        //             sumCount.giftStatus = '全部';
        //             sumCount.key = sumCount.giftStatus;
        //             dataSource.push(sumCount);
        //             this.setState({dataSource, loading: false});
        //         } else {
        //             this.setState({loading: false});
        //         }
        //     });
        // }
    }
    handleCancel() {
        this.setState({ loading: true });
        this.props.onCancel();
        const {
            UpdateSendorUsedTabKey,
            UpdateSendorUsedPage,
            UpdateSendorUsedParams,
            resetSendOrTotalCount,
        } = this.props;
        UpdateSendorUsedTabKey({ key: 'send' });
        UpdateSendorUsedPage({
            page: {
                pageNo: 1,
                pageSize: 10,
            },
        });
        UpdateSendorUsedParams({
            params: {},
        });
        resetSendOrTotalCount();
    }

    render() {
        const { visible, data } = this.props;
        const { giftType } = data;
        let infoItem = [];
        if (giftType === '80') {
            infoItem = [
                { col: { span: 8 }, maxL: 18, keys: { giftName: '礼品名称', giftTypeName: '礼品类型', shopNames: '适用店铺' } },
                {
                    col: { span: 16 },
                    labelCol: { span: 4 },
                    itemCol: { span: 20 },
                    maxL: 40,
                    keys: { createStamp: '创建时间', giftRemark: '使用说明' },
                },
            ];
        } else {
            infoItem = [
                { col: { span: 8 }, maxL: 18, keys: { giftName: '礼品名称', giftTypeName: '礼品类型', giftValue: '礼品价值' } },
                {
                    col: { span: 16 },
                    labelCol: { span: 4 },
                    itemCol: { span: 20 },
                    maxL: 40,
                    keys: { createStamp: '创建时间', giftRemark: '使用说明', shopNames: '适用店铺' },
                },
            ];
        }
        const columns = [
            {
                title: '状态',
                dataIndex: 'giftStatus',
                key: 'giftStatus',
            }, {
                title: '消费返券',
                dataIndex: 'sum10',
                key: 'sum10',
            }, {
                title: '摇奖活动',
                dataIndex: 'sum20',
                key: 'sum20',
            }, {
                title: '积分摇奖',
                dataIndex: 'sum30',
                key: 'sum30',
            }, {
                title: '积分兑换',
                dataIndex: 'sum40',
                key: 'sum40',
            }, {
                title: '免费领取',
                dataIndex: 'sum60',
                key: 'sum60',
            }, {
                title: '商家赠送',
                dataIndex: 'sum70',
                key: 'sum70',
            }, {
                title: '商家支付',
                dataIndex: 'sum80',
                key: 'sum80',
            }, {
                title: '商家卖出',
                dataIndex: 'sum90',
                key: 'sum90',
            }, {
                title: '总计',
                dataIndex: 'sum',
                key: 'sum',
            },
        ];
        const giftRule = data.giftRule ? data.giftRule : [];
        const giftLogo = (v) => {
            switch (v) {
                case '10':
                case '20':
                case '21':
                case '30':
                case '40':
                    return <span><em>{data.giftValue}</em>元</span>;
                case '80':
                    return (<span><em>{(data.discountRate * 10).toFixed(1)}</em>折<em>{data.pointRate}</em>倍</span>);
                case '42':
                    return <span><em>{data.giftValue}</em>分</span>;
            }
        };
        const totalColumns = [
            {
                title: '发出数',
                dataIndex: 'sendCount',
                key: 'sendCount',
                className: 'TableTxtCenter',
            }, {
                title: '使用数',
                dataIndex: 'usedCount',
                key: 'usedCount',
                className: 'TableTxtCenter',
            },
        ];
        const totalData = [{
            sendCount: this.props.sendTotalSize || 0,
            usedCount: this.props.usedTotalSize || 0,
        }]
        return (
            <Modal
                key="礼品使用详情"
                title="礼品使用详情"
                visible={this.props.visible}
                onCancel={() => this.handleCancel()}
                maskClosable={false}
                width={900}
                footer={[<Button key="0" className="cancelBtnJs" type="ghost" onClick={() => this.handleCancel()}>关闭</Button>]}
            >
                {visible && (
                    <div className={styles.giftDetailModal}>
                        <div>
                            <Row>
                                <h3>基本信息</h3>
                            </Row>
                            <Row style={{ margin: '0 10px' }}>
                                <Col span={4}>
                                    <div
                                        className="gift-image"
                                        style={{ backgroundImage: `url("/asserts/img/${giftType != 21 ? giftType : 20}.jpg")` }}
                                    >
                                        {giftLogo(giftType)}
                                        <p>{data.giftName}</p>
                                    </div>
                                </Col>
                                <Col span={19} push={1}>
                                    <InfoDisplay infoItem={infoItem} infoData={data} />
                                    <Row className="info-rule">
                                        <Col span={3}>使用规则 :</Col>
                                        <Col span={21}>{giftRule.map((item, idx) => (<span
                                            key={idx}
                                        >{`${++idx}、${item}`}<br /></span>))}</Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                        {/* <div>
                         <Row>
                         <h3>礼品统计</h3>
                         </Row>
                         <Row>
                         <Table
                         bordered
                         columns={columns}
                         dataSource={this.state.dataSource}
                         pagination={false}
                         loading={this.state.loading}
                         className="gift-detail-modal-table"
                         />
                         </Row>
                         </div> */}
                        <div>
                            <Row>
                                <h3>查询明细的统计</h3>
                                <Table
                                    bordered={true}
                                    columns={giftType === '91' ? totalColumns.slice(0, 1) : totalColumns}
                                    dataSource={totalData}
                                    pagination={false}
                                />
                            </Row>
                            <Row>
                                <h3>使用统计</h3>
                            </Row>
                            <Row>
                                <GiftDetailModalTabs
                                    data={data}
                                    sendCount={this.props.sendTotalSize || 0}
                                    usedCount={this.props.usedTotalSize || 0}
                                />
                            </Row>
                        </div>
                    </div>
                )}
            </Modal>
        )
    }
}
function mapStateToProps(state) {
    return {
        sendorUsedKey: state.sale_giftInfoNew.get('sendorUsedKey'),
        sendTotalSize: state.sale_giftInfoNew.get('totalSendCount'),
        usedTotalSize: state.sale_giftInfoNew.get('totalUsedCount'),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        resetSendOrTotalCount: opts => dispatch(resetSendOrTotalCount(opts)),
        UpdateSendorUsedTabKey: opts => dispatch(UpdateSendorUsedTabKey(opts)),
        UpdateSendorUsedPage: opts => dispatch(UpdateSendorUsedPage(opts)),
        UpdateSendorUsedParams: opts => dispatch(UpdateSendorUsedParams(opts)),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(GiftDetailModal);

class InfoDisplay extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { infoItem, infoData = {} } = this.props;
        return (
            <Row>
                {
                    infoItem.map((itm, idx) => {
                        const len = 24 / infoItem.length;
                        const col = itm.col ? itm.col : { span: len };
                        const labelCol = itm.labelCol ? itm.labelCol : { span: 8 };
                        const itemCol = itm.itemCol ? itm.itemCol : { span: 16 };
                        const maxL = itm.maxL;
                        return (<Col {...col} key={idx}>
                            {
                                _.keys(itm.keys).map((key, idx) => {
                                    const value = infoData[key] === undefined ? '' : infoData[key];
                                    return (<Row key={idx} className="info-display">
                                        <Col {...labelCol}>{`${itm.keys[key]} :`}</Col>
                                        {
                                            _.isArray(value)
                                                ? <Col {...itemCol}>{value.map((item, idx) => (<span
                                                    key={idx}
                                                >{`${++idx}、${item}`}<br /></span>))}</Col>
                                                : <Col {...itemCol}>{
                                                    getByteLength(value) > maxL
                                                        ? (<Tooltip title={value}>{value}</Tooltip>)
                                                        : value
                                                }</Col>
                                        }
                                    </Row>)
                                })
                            }
                        </Col>)
                    })
                }
            </Row>
        )
    }
}
