import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Row, Col, Modal, Button, Tooltip, Table } from 'antd';
import _ from 'lodash';
import { getByteLength } from '../../../helpers/util';
import RedPacketDetailModalTabs from './RedPacketDetailModalTabs';
import styles from './GiftInfo.less';
import {
    UpdateSendorUsedTabKey,
    UpdateSendorUsedPage,
    UpdateSendorUsedParams,
    resetSendOrTotalCount,
    FetchSendorUsedList,
} from '../_action';

class RedPacketDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            totalColumns: [
                {
                    title: '发送中',
                    dataIndex: '1',
                    key: '1',
                    className: 'TableTxtCenter',
                    render: num => num || 0,
                },
                {
                    title: '已发放待领取',
                    dataIndex: '2',
                    key: '2',
                    className: 'TableTxtCenter',
                    render: num => num || 0,
                },
                {
                    title: '发放失败数',
                    dataIndex: '3',
                    key: '3',
                    className: 'TableTxtCenter',
                    render: num => num || 0,
                },
                {
                    title: '已领取数',
                    dataIndex: '4',
                    key: '4',
                    className: 'TableTxtCenter',
                    render: num => num || 0,
                },
                {
                    title: '退款中',
                    dataIndex: '5',
                    key: '5',
                    className: 'TableTxtCenter',
                    render: num => num || 0,
                },
                {
                    title: '已退款',
                    dataIndex: '6',
                    key: '6',
                    className: 'TableTxtCenter',
                    render: num => num || 0,
                },
            ],
            loading: true,
            giftUsageList: [],
        };
    }
    componentDidMount() {
        const { data: { giftType, giftItemID }, FetchSendorUsedList } = this.props;
        FetchSendorUsedList({isSend: true, params: { pageNo: 1, pageSize: 10, giftItemID } });
        FetchSendorUsedList({isSend: false, params: {presentStatus: '4', pageNo: 1, pageSize: 10, giftItemID } });
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
    getRedPacketTotalInfo() {
        const { redPacketInfoList } = this.props;
        const redPacketStatusList = redPacketInfoList.toJS();
        const result = {};
        redPacketStatusList.forEach(item => {
            result[`${item.presentStatus}`] = item.sum;
        })
        return result;
    }
    render() {
        const { visible, data } = this.props;
        const infoItem = [
                { col: { span: 8 }, maxL: 18, keys: { giftName: '礼品名称', giftTypeName: '礼品类型' } },
                {
                    col: { span: 16 },
                    labelCol: { span: 4 },
                    itemCol: { span: 20 },
                    maxL: 40,
                    keys: { createStamp: '创建时间', giftRemark: '使用说明' },
                },
            ];
        const giftRule = data.giftRule ? data.giftRule : [];
        
        const totalData = [this.getRedPacketTotalInfo()]
        return (
            <Modal
                key="礼品使用详情"
                title="礼品使用详情"
                visible={this.props.visible}
                onCancel={() => this.handleCancel()}
                maskClosable={false}
                width={950}
                footer={[<Button key="0" className="cancelBtnJs" type="ghost" onClick={() => this.handleCancel()}>关闭</Button>]}
            >
                {visible && (
                    <div className={styles.giftDetailModal}>
                        <div>
                            <Row>
                                <h3>基本信息</h3>
                            </Row>
                            <Row style={{ margin: '0 10px' }}>
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
                        <div>
                            <Row>
                                <h3>查询明细的统计</h3>
                                <Table
                                    bordered={true}
                                    columns={this.state.totalColumns}
                                    dataSource={totalData}
                                    pagination={false}
                                />
                            </Row>
                            <Row>
                                <h3>使用统计</h3>
                            </Row>
                            <Row>
                                <RedPacketDetailModalTabs
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
        redPacketInfoList: state.sale_giftInfoNew.get('redPacketInfoList'),
        sendTotalSize: state.sale_giftInfoNew.get('totalSendCount'),
        usedTotalSize: state.sale_giftInfoNew.get('totalUsedCount'),
    }
}
function mapDispatchToProps(dispatch) {
    return {
        FetchSendorUsedList: opts => dispatch(FetchSendorUsedList(opts)),
        resetSendOrTotalCount: opts => dispatch(resetSendOrTotalCount(opts)),
        UpdateSendorUsedTabKey: opts => dispatch(UpdateSendorUsedTabKey(opts)),
        UpdateSendorUsedPage: opts => dispatch(UpdateSendorUsedPage(opts)),
        UpdateSendorUsedParams: opts => dispatch(UpdateSendorUsedParams(opts)),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RedPacketDetailModal);

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
                                                ? <Col {...itemCol} className={styles.breakWordsWrap}>{value.map((item, idx) => (<span
                                                    key={idx}
                                                >{`${++idx}、${item}`}<br /></span>))}</Col>
                                                : <Col {...itemCol} className={styles.breakWordsWrap}>{
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
