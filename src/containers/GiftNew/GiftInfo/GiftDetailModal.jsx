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
import { COMMON_LABEL } from 'i18n/common';

class GiftDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: true,
            giftUsageList: [],
        };
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
                width={950}
                footer={[<Button key="0" className="cancelBtnJs" type="ghost" onClick={() => this.handleCancel()}>{ COMMON_LABEL.close }</Button>]}
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
                                        <p className={styles.ellipsisBlock}>{data.giftName}</p>
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
