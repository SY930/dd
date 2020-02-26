
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Row, Col, Table, Modal, Button } from 'antd';
import _ from 'lodash';
import { COLUMNS } from './_tableSum';
import QuatoCardDetailModalTabs from './QuatoCardDetailModalTabs';
import {
    FetchQuotaCardSum,
    UpdateTabKey,
} from '../_action';
import styles from './GiftInfo.less';
import { COMMON_LABEL } from 'i18n/common';
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';
import GiftCfg from '../../../constants/Gift';

class QuatoCardDetailModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: true,
        };
        this.columns = COLUMNS;
    }
    componentDidMount() {
        const { data: { giftItemID }, FetchQuotaCardSum } = this.props;
        FetchQuotaCardSum({
            giftItemID,
        }).then((data = []) => {
            this.proSumData(data);
        });
    }
    componentWillReceiveProps(nextProps) {
        const { visible, data: { giftItemID }, FetchQuotaCardSum, quotaCardSumSource } = nextProps
        if (visible === true && this.props.visible !== visible) {
            FetchQuotaCardSum({
                giftItemID,
            }).then((data = []) => {
                this.proSumData(data);
            });
            const _quotaCardSumSource = quotaCardSumSource.toJS();
            if (this.state.quotaCardSumSource !== _quotaCardSumSource) {
                this.proSumData(_quotaCardSumSource || []);
            }
        }
    }
    proSumData = (data = []) => {
        let dataArr = [];
        if (data) {
            dataArr = [{ key: 'summary', ...data, giftStatus: '数量' }]
            this.setState({ dataSource: dataArr, loading: false });
        } else {
            this.setState({ loading: false });
        }
    }
    handleCancel() {
        const { UpdateTabKey } = this.props;
        UpdateTabKey({
            key: 'send',
        });
        this.setState({ loading: true });
        this.props.onCancel();
    }
    render() {
        const { visible, data } = this.props;
        const infoItem = [
            { col: { span: 8 }, keys: { giftName: '礼品名称', giftTypeName: '礼品类型', giftValue: '卡面值', price: '记录实收金额' } },
            { col: { span: 16 }, labelCol: { span: 4 }, itemCol: { span: 20 }, keys: { giftCost: '工本费用', giftRule: '礼品规则', giftRemark: '使用说明' } },
        ];
        const value = data.giftType;
        return (
            <Modal
                key="礼品使用详情"
                title="礼品使用详情"
                visible={this.props.visible}
                maskClosable={false}
                onCancel={() => this.props.onCancel()}
                width={950}
                footer={[<Button key="0" type="primary" onClick={() => this.handleCancel()}>{ COMMON_LABEL.close }</Button>]}
            >
                <div className={styles.giftDetailModal}>
                    <div>
                        <Row>
                            <h3>基本信息</h3>
                        </Row>
                        <Row style={{ margin: '0 10px' }}>
                            <Col span={4}>
                                <div className="gift-image" style={{ backgroundImage: `url("/asserts/img/${value}.jpg")` }}>
                                    <span><em>{data.giftValue}</em>元</span>
                                    <p className={styles.ellipsisBlock}>{data.giftName}</p>
                                </div>
                            </Col>
                            <Col span={19} push={1}>
                                <InfoDisplay infoItem={infoItem} infoData={data} />
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <Row>
                            <h3>礼品统计</h3>
                        </Row>
                        <Row>
                            <Table
                                bordered={true}
                                columns={this.columns}
                                dataSource={this.state.dataSource}
                                pagination={false}
                                loading={this.state.loading}
                                className="gift-detail-modal-table"
                            />
                        </Row>
                    </div>
                    <div>
                        <Row>
                            <h3>使用统计</h3>
                        </Row>
                        <Row>
                            <QuatoCardDetailModalTabs data={data} />
                        </Row>
                    </div>
                </div>
            </Modal>
        )
    }
}

class InfoDisplay extends Component {
    constructor(props) {
        super(props);
    }
    /* 生成表格头数据 */
    /* 生成表格头数据 */
    generateColumns() {
        const { tc } = styles;
        const render = (v) => {
            return (
                <a href={href} name={v} onClick={this.onDelete}>删除</a>
            );
        };
        const render1 = (v,o) => {
            const { effectType, giftEffectTimeHours,
                giftValidUntilDayCount, effectTime, validUntilDate } = o;
            let text = '';
            if([1,3].includes(+effectType)) {
                const options = (+effectType === 1) ? SALE_CENTER_GIFT_EFFICT_TIME : SALE_CENTER_GIFT_EFFICT_DAY;
                const { label } = options.find(x=>+x.value===+giftEffectTimeHours);
                text = <span>发放后{label}，有效期{giftValidUntilDayCount}天</span>;
            } else {
                text = effectTime +' - '+ validUntilDate;
            }
            return (<span>{text}</span>);
        };
        const render3 = (v) => {
            const { giftTypeName } = GiftCfg;
            const { label } = giftTypeName.find(x=>+x.value === +v);
            return (<span>{label}</span>);
        };
        // 表格头部的固定数据
        return [
            { width: 40, title: '序号', dataIndex: 'idx', className: tc },
            { width: 100, title: '礼品类型', dataIndex: 'giftType', className: tc, render: render3 },
            { width: 100, title: '礼品名称', dataIndex: 'giftName', className: tc },
            { width: 100, title: '礼品金额(元)', dataIndex: 'giftValue', className: tc },
            { width: 60, title: '礼品个数', dataIndex: 'giftCount', className: tc },
            { width: 180, title: '礼品有效期', dataIndex: 'effectTime', render: render1, className: tc },
        ];
    }
    /* 生成表格数据 */
    generateDataSource(list) {
        return list.map((x, i) => ({
            key: x.giftItemID,
            idx: i + 1,
            index: i,
            ...x,
        }));
    }
    render() {
        const { infoItem, infoData = {} } = this.props;
        const { quotaCardGiftConfList = [] } = infoData;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource(quotaCardGiftConfList);
        return (
            <Row>
                {
                    infoItem.map((itm, idx) => {
                        const len = 24 / infoItem.length;
                        const col = itm.col ? itm.col : { span: len };
                        const labelCol = itm.labelCol ? itm.labelCol : { span: 8 };
                        const itemCol = itm.itemCol ? itm.itemCol : { span: 16 };
                        return (<Col {...col} key={idx}>
                            {
                                _.keys(itm.keys).map((key, idx) => {
                                    let value = infoData[key] === undefined ? '' : infoData[key];
                                    if (key === 'giftCost') { // 工本费兼容旧数据
                                        value = infoData[key] || 0;
                                    }
                                    return (<Row key={idx} className="info-display">
                                        <Col {...labelCol}>{`${itm.keys[key]} :`}</Col>
                                        <Col {...itemCol} className={styles.breakWordsWrap}>{value}</Col>
                                    </Row>)
                                })
                            }
                        </Col>)
                    })
                }
                <di>
                    <p>礼品详情</p>
                    <Table
                        bordered={true}
                        columns={columns}
                        dataSource={dataSource}
                        pagination={false}
                    />
                </di>
            </Row>
        )
    }
}
function mapStateToProps(state) {
    return {
        quotaCardSumSource: state.sale_giftInfoNew.get('quotaCardSumSource'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        FetchQuotaCardSum: opts => dispatch(FetchQuotaCardSum(opts)),
        UpdateTabKey: opts => dispatch(UpdateTabKey(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QuatoCardDetailModal);
