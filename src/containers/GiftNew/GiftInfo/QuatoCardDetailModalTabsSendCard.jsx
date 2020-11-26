import React from 'react';
import { connect } from 'react-redux';
import { Modal, Row, Col, Input, Form, Select,Radio,DatePicker, Icon, Tooltip } from 'antd';
import BaseForm from '../../../components/common/BaseForm';
import styles from './GiftInfo.less';
import { fetchData, axiosData } from '../../../helpers/util';
import _ from 'lodash';
import moment from 'moment'
import {
    FetchGiftLevel,
} from '../_action';
import { FORMITEM_CONFIG } from './_QuatoCardFormConfig';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
const giftEffectTimeHours = [
    {
        value: '0',
        label: '立即生效'
    },
    {
        value: '1',
        label: '1天后生效'
    },
    {
        value: '2',
        label: '2天后生效',
    },
    {
        value: '3',
        label: '3天后生效',
    },
    {
        value: '4',
        label: '4天后生效',
    },
    {
        value: '5',
        label: '5天后生效',
    },
    {
        value: '10',
        label: '10天后生效',
    },
    {
        value: '20',
        label: '20天后生效',
    },
    {
        value: '30',
        label: '30天后生效',
    },
]
const {  Group: RadioGroup } = Radio;
const {  RangePicker } = DatePicker;
const FormItem = Form.Item;
const format = 'YYYYMMDD'
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
            validUntilDay: '0',
            effectType: '0'
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
        console.log('type',type)
        if (visible) {
            let formKeys = [],
                operateRemarkLabel = '';
            switch (type) {
                case 'sendCard':
                    formKeys = [{ keys: ['batchNO', 'startEnd', 'distanceNum', 'effectType', 'useCardTypeID', 'useCardLevelID', 'remark'] }];
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

            const giftEffectTimeHours = params.giftEffectTimeHours
            const giftValidUntilDayCount = typeof params.giftValidUntilDayCount === 'object' ? params.giftValidUntilDayCount.number : params.giftValidUntilDayCount
            const effectTime99validUntilDate = params.effectTime99validUntilDate && params.effectTime99validUntilDate.length ?
             [moment(params.effectTime99validUntilDate[0]).format(format),moment(params.effectTime99validUntilDate[1]).format(format)] : []
             delete _params.effectTime99validUntilDate
            let reqParams = {
                ..._params,
                batchNO: (_params.batchNO || '').trim(),
                endNO: (_params.endNO || '').trim(),
                startNO: (_params.startNO || '').trim(),
                effectType: Number(params.effectType) == 0 ? 3 : (Number(params.effectType) || ''),
                giftEffectTimeHours: Number(giftEffectTimeHours) || '',
                giftValidUntilDayCount: Number(giftValidUntilDayCount) || '0',
                effectTime: effectTime99validUntilDate[0],
                validUntilDate: effectTime99validUntilDate[1]
            }
            // console.log('reqParams', reqParams)

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
                <Col span={11}>
                    <FormItem>
                        {
                            decorator({
                                key: 'startEnd_min',
                                rules: [
                                    { required: true, message: '起始号不能为空' },
                                    {
                                        validator: (rule, v, cb) => {
                                            if (v === '') cb();
                                            v > 0 && v <= 899999 ? cb() : cb(rule.message);
                                        },
                                        message: '请输入1-899999之间的整数'
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
                <Col span={11}>
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
                                        message: '请输入大于起始号，且小于999999之间的整数'
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
                {/* <Col span={7} offset={1}>
                    <FormItem style={{ paddingTop: 2 }}>
                        {
                            decorator({
                                key: 'distanceNum',
                                initialValue: distanceNum,
                            })(<Input disabled={true} addonAfter="张" />)
                        }
                    </FormItem>
                </Col> */}
            </Row>
        )
    }
    handleDayChange = (e) => {

        if(e === '0') {

            this.form.resetFields(['giftValidUntilDayCount'])
        }
        this.setState({
            validUntilDay: e
        })
    }
    handleEffectTypeChange = (e) => {
        let { formKeys } = this.state
        const value = e.target.value
        const relativeDateKeys = [ 'giftEffectTimeHours', 'giftValidUntilDayCount', 'effectTime99validUntilDate']

        if(value === '0') {
            formKeys[0].keys = formKeys[0].keys.filter(v => {
                return  !relativeDateKeys.includes(v)
            })
            this.form.resetFields(relativeDateKeys)
            this.setState({
                validUntilDay: '0'
            })
        }else if(value === '2') {
            formKeys[0].keys = formKeys[0].keys.filter(v => {
                return !relativeDateKeys.includes(v)
            })
            formKeys[0].keys.splice(4,0, 'effectTime99validUntilDate')
            this.form.resetFields(relativeDateKeys)
            this.setState({
                validUntilDay: '0'
            })
        } else {
            formKeys[0].keys = formKeys[0].keys.filter(v => {
                return   v !== 'effectTime99validUntilDate'
            })
            formKeys[0].keys.splice(4,0, 'giftValidUntilDayCount')
            this.form.resetFields(['effectTime99validUntilDate'])
        }

        this.setState({
            formKeys,
            effectType:  value
        })
    }
    render() {
        const { title = '', visible, type } = this.props;
        const { formKeys, operateRemarkLabel, cardList, levelList,validUntilDay,effectType } = this.state;
        
        let effectTypeLabel = (
            <span>
                有效期 
                <Tooltip title={
                    <p>
                        <p>指礼品卡售出后的有效期，用户需要在该有效期内进行礼品卡激活，激活指完成礼品卡充值</p>
                        <p>或礼品卡第一次使用，否则礼品卡将不可用</p>
                    </p>
                }>
                    <Icon
                        style={{marginLeft: '5px'}}
                        type={'question-circle'}
                    />
                </Tooltip>
            </span>
        )
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
            distanceNum: {
                label: '制卡数',
                type: 'custom',
                render: (decorator, form) => {
                    let min = Number(form.getFieldValue('startEnd_min')) || '',
                        max = Number(form.getFieldValue('startEnd_max')) || '',
                        distanceNum = min && max && max >= min ? max - min + 1 : 0;
                    return (
                        decorator({
                            key: 'distanceNum',
                            initialValue: distanceNum,
                        })(<Input disabled={true} addonAfter="张" />)
                    )
                }
            },
            effectType: {
                label: effectTypeLabel,
                type: 'custom',
                defaultValue: '0',
                render: decorator => (
                    decorator(
                        {
                            onChange: this.handleEffectTypeChange
                        }
                    )(<RadioGroup>
                        {[
                    {
                        value: '0',
                        label: '永久有效'
                    },
                    {
                        value: '3',
                        label: '相对有效期'
                    },
                    {
                        value: '2',
                        label: '固定有效期'
                    },
                    ].map(({ value, label }) => (
                            <Radio key={value} value={value}  >
                                {label}
                            </Radio>
                        ))}
                     </RadioGroup>)

                )

            },
            giftEffectTimeHours: {
                label: '何时生效',
                type: 'combo',
                defaultValue: '0',
                options: giftEffectTimeHours,
            },
            giftValidUntilDayCount: {
                label: '有效天数',
                type: 'custom',
                defaultValue: '0',
                render: decorator => (
                    <Row>
                        <Col span={12}  >
                            <span>售出后立即生效，有效天数</span>
                        </Col>
                        <Col span={12}  >
                            {
                                decorator({
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                const reg = /^\+?[1-9][0-9]*$/
                                                if (
                                                    v.number === "" ||
                                                    v.number === undefined
                                                ) {
                                                    return cb();
                                                }
                                                if (!v || (v.number < 1)) {
                                                    return cb(
                                                        '有效天数应不小于1'
                                                    );
                                                } else if (v.number > 10000) {
                                                    return cb(
                                                        '有效天数应不大于10000'
                                                    );
                                                } else if(!reg.test(v.number)) {
                                                    return cb(
                                                        '有效天数应为整数'
                                                    );
                                                }
                                                cb();
                                            },
                                        },
                                        { required: true, message: '批次号不能为空' },
                                    ]
                                })(
                                    <PriceInput
                                        addonAfter={"天"}
                                        style={{ marginLeft: "11px" }}
                                        key="2"
                                    />
                                )
                            }
                        </Col>
                    </Row>
                )
            },
            effectTime99validUntilDate: {
                label: '固定有效期',
                type: 'custom',
                // defaultValue: [moment(),moment()],
                render: decorator => (
                    decorator(
                         {
                            rules: [
                                { required: true, message: '固定有效期不能为空' },
                            ],
                         }
                    )(<RangePicker
                        placeholder={['开始日期','结束日期']}
                      />)

                )
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
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 17}
        }
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
                        <Col span={24} pull={0}>

                            <BaseForm
                                getForm={form => this.form = form}
                                formItems={formItems}
                                formKeys={formKeys}
                                onChange={(key, value) => this.handleFormChange(key, value, this.queryForm)}
                                formItemLayout={formItemLayout}
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
