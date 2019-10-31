import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Input, Form } from 'antd';
import BaseForm from '../../../components/common/BaseForm';
import styles from './GiftInfo.less';
import { fetchData, axiosData } from '../../../helpers/util';
import _ from 'lodash';
import {
    FetchGiftLevel,
} from '../_action';
import { FORMITEM_CONFIG } from './_QuatoCardFormConfig';

const FormItem = Form.Item;
class CardOperate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formKeys: [],
            operateRemarkLabel: '',
            cardList: [],
            cardTypeList: [],
            levelList: [],
            selectedRow: [],
        }
        this.form = null;
        this.proGiftLevel = this.proGiftLevel.bind(this);
    }
    componentDidMount() {
        const { levelList, FetchGiftLevel } = this.props;
        const _levelList = levelList.toJS();
        FetchGiftLevel({}).then((data = []) => {
            this.proGiftLevel(data);
        });
    }

    componentWillReceiveProps(nextProps) {
        const { visible, type } = nextProps;
        this.form && this.form.resetFields();
        if (visible) {
            let formKeys = [],
                operateRemarkLabel = '';
            switch (type) {
                case 'sendCard':
                    formKeys = [{ keys: ['batchNO', 'startEnd', 'useCardTypeID', 'useCardLevelID', 'remark'] }];
                    operateRemarkLabel = '备注';
                    break;
                case 'batchCancel':
                    formKeys = [{ keys: ['batchNO', 'startEnd', 'remark'] }];
                    operateRemarkLabel = '作废原因';
                    break;
                case 'batchNoCancel':
                    formKeys = [{ keys: ['batchNO', 'startEnd', 'remark'] }];
                    operateRemarkLabel = '取消作废原因';
                    break;
                case 'cancel':
                    formKeys = [{ keys: ['remark'] }];
                    operateRemarkLabel = '作废原因';
                    break;
                case 'noCancel':
                    formKeys = [{ keys: ['remark'] }];
                    operateRemarkLabel = '取消作废原因';
                    break;
                default:
                    break;
            }
            this.setState({
                formKeys,
                operateRemarkLabel,
                selectedRow: nextProps.selectedRow,
            });
        }
    }
    proGiftLevel = (data = []) => {
        const cardList = [];
        data.forEach((cardItem, index) => {
            cardList.push({
                value: cardItem.cardTypeID,
                label: cardItem.cardTypeName,
            });
        });
        this.setState({
            cardList,
            cardTypeList: data,
            selectedRow: this.props.selectedRow,
        });
    }
    handleFormChange = (key, value) => {
        switch (key) {
            case 'useCardTypeID':
                this.form.resetFields(['useCardLevelID']);
                this.getLevelsByCardTypeID(value);
                break;
        }
    }
    onOk() {
        this.form.validateFieldsAndScroll((err, values) => {
            if (err) return;
            const params = values;
            // params.useCardLevelID = 828136705;
            const { giftItemID } = this.props;
            const { selectedRow } = this.state;
            params.giftItemID = giftItemID;

            params.giftStatus = this.getStatusByType();
            const callserver = this.getCallserverByType();
            if (selectedRow && selectedRow.length > 0) {
                const itemArr = [];
                selectedRow.forEach((item, idx) => {
                    itemArr.push(item.itemID);
                });
                params.itemIDs = itemArr.join(',');
            } else {
                params.startNO = params.startEnd_min;
                params.endNO = params.startEnd_max;
            }
            const _params = _.omit(params, ['startEnd_min', 'startEnd_max', 'distanceNum']);
            _params.cardTypeID = _params.useCardTypeID;
            delete _params.useCardTypeID;
            let reqParams = {
                ..._params,
                batchNO: (_params.batchNO || '').trim(),
                endNO: (_params.endNO || '').trim(),
                startNO: (_params.startNO || '').trim(),
            }
            axiosData(callserver, reqParams, null, { path: 'data' }).then((data) => {
                this.props.onCancel(true);
            });
        });
    }
    getStatusByType = () => {
        const { type } = this.props;
        switch (type) {
            case 'sendCard':
                return '';
            case 'cancel':
            case 'batchCancel':
                return 13;
            case 'noCancel':
            case 'batchNoCancel':
                return 11;
            default:
                return null;
        }
    }
    getCallserverByType = () => {
        const { type } = this.props;
        switch (type) {
            case 'sendCard':
                return '/coupon/couponQuotaService_addQuotaBatch.ajax';
            default:
                return '/coupon/couponQuotaService_updateGiftCardStatus.ajax';
        }
    }
    getLevelsByCardTypeID = (cardTypeID) => {
        const { cardTypeList } = this.state;
        const levelList = [];
        cardTypeList.forEach((cardItem, idx) => {
            if (cardItem.cardTypeID == cardTypeID) {
                const levels = cardItem.cardTypeLevelList || [];
                levels.forEach((levelItem, _idx) => {
                    levelList.push({
                        value: levelItem.cardLevelID,
                        label: levelItem.cardLevelName,
                    })
                })
            }
        });
        this.setState({ levelList });
    }
    renderStartEnd(decorator, form) {
        let min = Number(form.getFieldValue('startEnd_min')) || '',
            max = Number(form.getFieldValue('startEnd_max')) || '',
            distanceNum = min && max && max >= min ? max - min + 1 : 0;
        return (
            <Row style={{ paddingBottom: 10 }}>
                <Col span={7}>
                    <FormItem>
                        {
                            decorator({
                                key: 'startEnd_min',
                                rules: [
                                    { required: true, message: '起始号不能为空' },
                                    {
                                        validator: (rule, v, cb) => {
                                            if (v === '') cb();
                                            v > 0 && v <= 999999 ? cb() : cb(rule.message);
                                        },
                                        message: '起始号必须是1-999999之间的数字'
                                    },
                                    { validator: (rule, v, cb) => {
                                        String(v || '').trim().length <= 6 ? cb() : cb(rule.message);
                                    },
                                        message: '不能超过6位'},
                                ],
                            })(<Input placeholder="起始号" />)
                        }
                    </FormItem>
                </Col>
                <Col span={1} style={{ marginRight: 5, marginLeft: 5 }}>至</Col>
                <Col span={7}>
                    <FormItem>
                        {
                            decorator({
                                key: 'startEnd_max',
                                rules: [
                                    { required: true, message: '终止号不能为空' },
                                    {
                                        validator: (rule, v, cb) => {
                                            if (v === '') cb();
                                            v >= min && v <= 999999 ? cb() : cb(rule.message);
                                        },
                                        message: '终止号必须是起始号到999999之间的数字'
                                    },
                                    { validator: (rule, v, cb) => {
                                        String(v || '').trim().length <= 6 ? cb() : cb(rule.message);
                                    },
                                        message: '不能超过6位'},
                                ],
                            })(<Input placeholder="终止号" />)
                        }
                    </FormItem>
                </Col>
                <Col span={7} offset={1}>
                    <FormItem style={{ paddingTop: 2 }}>
                        {
                            decorator({
                                key: 'distanceNum',
                                initialValue: distanceNum,
                            })(<Input disabled={true} addonAfter="张" />)
                        }
                    </FormItem>
                </Col>
            </Row>
        )
    }
    render() {
        const { title = '', visible, type } = this.props;
        const { formKeys, operateRemarkLabel, cardList, levelList } = this.state;
        const formItems = {
            batchNO: {
                label: '批次号',
                type: 'text',
                placeholder: '请输入批次号',
                rules: [
                    { required: true, message: '批次号不能为空' },
                    {
                        validator: (rule, v, cb) => {
                            if (v === '') cb();
                            v > 0 && v <= 999999 ? cb() : cb(rule.message);
                        },
                        message: '批次号必须是1-999999之间的整数'
                    },
                    { validator: (rule, v, cb) => {
                        String(v || '').trim().length <= 6 ? cb() : cb(rule.message);
                    },
                        message: '不能超过6位'},
                ],
            },
            startEnd: {
                label: '起止号',
                type: 'custom',
                render: (decorator, form) => this.renderStartEnd(decorator, form),
            },
            useCardTypeID: {
                label: '会员卡类型',
                type: 'combo',
                defaultValue: '',
                options: cardList,
                props: {
                    showSearch: true,
                },
                rules: [
                    { required: true, message: '会员卡类型不能为空' },
                ],
            },
            useCardLevelID: {
                label: '等级',
                type: 'combo',
                defaultValue: '',
                options: levelList,
                props: {
                    showSearch: true,
                },
                rules: [
                    { required: true, message: '会员卡等级不能为空' },
                ],
            },
            remark: {
                label: operateRemarkLabel,
                type: 'textarea',
                placeholder: `请输入${operateRemarkLabel}`,
                rules: [{ required: true, message: `${operateRemarkLabel}不能为空` },
                { max: 250, message: '字符不能超过250个' }],
            },
        };
        return (
            <Modal
                title={title}
                onOk={() => this.onOk()}
                onCancel={() => this.props.onCancel(false)}
                key={type}
                visible={visible}
                maskClosable={false}
                width={540}
            >
                <Row className={styles.quatoCardDetailModalTabsSendCard}>
                    <Row>
                        <div style={{ border: '3px dashed #e9e9e9', margin: '0 auto', width: 420, padding: 10 }}>
                            {[{ tip1: '666', tip2: '3位标识符', tip3: '（系统固定）' }, { tip1: 'XXXXXX', tip2: '6位批次号', tip3: '（手动输入）' },
                            { tip1: 'YYYYYY', tip2: '6位顺序号', tip3: '（手动输入）' }, { tip1: 'ZZZ', tip2: '3位随机号', tip3: '（系统随机）' }].map((node, index) => {
                                return (
                                    <div key={node.tip1} style={{ textAlign: 'center', width: 98, display: 'inline-block' }}>
                                        <div style={{ textAlign: 'center', width: index != 3 ? 88 : 93, display: 'inline-block' }}>
                                            <div style={{ textAlign: 'center', border: '5px solid #e9e9e9', color: '#999', borderRadius: 20, height: 40, width: 95, lineHeight: '30px', fontSize: 14 }}>{node.tip1}</div>
                                            <div style={{ margin: '2px 0', color: '#787878', fontSize: 16 }}>{node.tip2}</div>
                                            <div style={{ margin: '2px 0', color: '#999' }}>{node.tip3}</div>
                                        </div>
                                        {index != 3 ?
                                            <div style={{ height: 10, width: 9, display: 'inline-block', background: '#e9e9e9', marginBottom: 55, paddingLeft: 10, position: 'relative', left: 3 }}></div>
                                            : null}
                                    </div>
                                )
                            })}
                            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 16, color: '#999', letterSpacing: 5 }}>卡号组成图示</div>
                        </div>
                    </Row>
                    <Row>
                        <Col span={24} pull={3}>
                            
                            <BaseForm
                                getForm={form => this.form = form}
                                formItems={formItems}
                                formKeys={formKeys}
                                onChange={(key, value) => this.handleFormChange(key, value, this.queryForm)}
                            />
                        </Col>
                    </Row>                
                </Row>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        levelList: state.sale_giftInfoNew.get('levelList'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        FetchGiftLevel: opts => dispatch(FetchGiftLevel(opts)),
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CardOperate);
