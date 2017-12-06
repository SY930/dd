import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Input, Form } from 'antd';
import BaseForm from '../../../components/common/BaseForm';
import styles from './GiftInfo.less';
import { fetchData } from '../../../helpers/util';
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
    }
    componentWillMount() {
        const { levelList, FetchGiftLevel } = this.props;
        const _levelList = levelList.toJS();
        FetchGiftLevel({}).then((data = []) => {
            this.proGiftLevel(data);
        });
        // if(_levelList.length > 0) {
        //     this.proGiftLevel(_levelList);
        // } else {
        //     FetchGiftLevel({}).then((data = []) => {
        //         this.proGiftLevel(data);
        //     });
        // }
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
            const _params = _.omit(params, ['startEnd_min', 'startEnd_max', 'distanceNum', 'useCardTypeID']);
            fetchData(callserver, _params, null, { path: 'data' }).then((data) => {
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
                return 'addSendCard_dkl';
            default:
                return 'changeQuotaStatus_dkl';
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
                                rules: [{ required: true, message: '起始号不能为空' },
                                    { type: 'integer', message: '起始号必须为整数', transform: value => Number(value) },
                                    { validator: (rule, v, cb) => {
                                        if (v === '')cb();
                                        v > 0 && v < 999999 ? cb() : cb(rule.message);
                                    },
                                    message: '起始号必须是1-999999之间的值' }],
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
                                rules: [{ required: true, message: '终止号不能为空' },
                                    { type: 'integer', message: '终止号必须为整数', transform: value => Number(value) },
                                    { validator: (rule, v, cb) => {
                                        if (v === '')cb();
                                        v >= min && v < 999999 ? cb() : cb(rule.message);
                                    },
                                    message: '终止号必须是起始号到999999之间的值' }],
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
                rules: [{ required: true, message: '批次号不能为空' },
                    { type: 'integer', message: '批次号必须为整数', transform: value => Number(value) },
                    { validator: (rule, v, cb) => {
                        if (v === '')cb();
                        v > 0 && v < 999999 ? cb() : cb(rule.message);
                    },
                    message: '批次号必须是1-999999之间的值' }],
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
                rules: [
                    { required: true, message: '会员卡类型不能为空' },
                ],
            },
            useCardLevelID: {
                label: '等级',
                type: 'combo',
                defaultValue: '',
                options: levelList,
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
                width={500}
            >
                <Row className={styles.quatoCardDetailModalTabsSendCard}>
                    <Col span={24} pull={3}>
                        <BaseForm
                            getForm={form => this.form = form}
                            formItems={formItems}
                            formKeys={formKeys}
                            onChange={(key, value) => this.handleFormChange(key, value, this.queryForm)}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }
}

function mapStateToProps(state) {
    return {
        levelList: state.giftInfoNew.get('levelList'),
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
