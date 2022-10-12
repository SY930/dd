import { Row, Col, Form, Icon, Input, Radio, Select, Tooltip, DatePicker } from 'antd';
import SelectBrands from '../../../GiftNew/components/SelectBrands';
import DateRange from '../../../PromotionV3/Camp/DateRange';
import styles from './style.less';
import ShopSelector from '../../../../components/ShopSelector/ShopSelector';
import CategoryAndFoodSelector from 'containers/SaleCenterNEW/common/CategoryAndFoodSelector';
import moment from 'moment';

const DATE_FORMAT = 'YYYYMMDD000000';
const END_DATE_FORMAT = 'YYYYMMDD235959';
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option

export const SALE_CENTER_ACTIVITY_SUITSENCE_LIST = [
    {
        value: 0,
        label: '全部',
    },
    {
        value: 1,
        label: '仅线下使用',
    },
    {
        value: 2,
        label: '仅线上使用',
    }
];

const bizOpts = [
    { label: '预订', value: '10' },
    { label: '闪吃', value: '11' },
    { label: '外送', value: '20' },
    { label: '堂食', value: '31' },
    { label: '自提', value: '21' },
];

export const stageTypeOptions = [
    {
        label: '任意商品消费满', value: 1,
    },
    {
        label: '任意商品消费每满', value: 2,
    },
    {
        label: '指定商品消费满', value: 3,
    },
    {
        label: '指定商品消费每满', value: 4,
    },
]

export const stageAmountTypeOptions = [
    {
        label: '元', value: 1,
    },
    // {
    //     label: '份', value: 2,
    // },
]


export const timeOpts = (() => {
    const list = [{ label: '立即生效', value: 0 }];
    for (let i = 1; i < 25; i++) {
        list.push({ label: `${i}小时生效`, value: i });
    }
    return list;
})();

export const dayOpts = (() => {
    const list = [];
    for (let i = 1; i < 31; i++) {
        list.push({ label: `${i}天后生效`, value: i });
    }
    let extraList = [{ label: '40天后生效', value: 40 }, { label: '50天后生效', value: 50 }, { label: '60天后生效', value: 60 }]
    return [...list, ...extraList];
})();

const FormItem = Form.Item;

export const ALL_FORM_ITEMS = {
    eventType: {
        type: 'custom',
        label: '活动类型',
        render: () => (<p>盲盒</p>),
    },
    eventName: {
        type: 'text',
        label: '活动名称',
        rules: ['required', 'stringLength'],
    },
    eventRange: {
        type: 'custom',
        label: '活动时间',
        rules: ['required'],
        wrapperCol: { span: 12 },
        defaultValue: [moment(), moment().add(6, 'days')],
        render: d => d()(<DateRange type='87' />),
    },
    eventRemark: {
        type: 'textarea',
        label: '活动说明',
        rules: ['description1'],
    },
    joinCount: {
        type: 'custom',
        label: '参与次数',
        render: (decorator, form) => {
            const { getFieldsValue } = form;
            const { joinCount } = getFieldsValue();
            return decorator({
                defaultValue: 1
            })(
                <Radio.Group className={styles.joinCountGroup}>
                    <Radio value={1}>
                        <div style={{ display: 'inline-block' }}>
                            <span>不限次数</span>
                        </div>
                    </Radio>
                    <Radio value={2}>
                        <span>限制次数</span>
                        <FormItem style={{ marginBottom: '0', marginLeft: '10px' }}>
                            {
                                decorator({
                                    key: 'partInTimes2',
                                    rules: [
                                        { required: joinCount == 2, message: '请输入数字' },
                                        { pattern: /^\d+$/, message: '请输入数字' },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (+value < 1 && joinCount == 2) cb(rule.message);
                                                cb();
                                            },
                                            message: '请输入大于0的数字',
                                        },
                                    ]
                                })(
                                    <Input addonBefore="同一用户可参与" addonAfter="次" style={{ width: '100px' }} disabled={joinCount != 2} />
                                )
                            }
                        </FormItem>
                    </Radio>
                    <Radio value={3}>
                        <span>限制参数次数的周期</span>
                        <FormItem style={{ marginBottom: '0', marginLeft: '10px' }}>
                            {
                                decorator({
                                    key: 'countCycleDays',
                                    rules: [
                                        { required: joinCount == 3, message: '请输入数字' },
                                        { pattern: /^\d+$/, message: '请输入数字' },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (+value < 1 && joinCount == 3) cb(rule.message);
                                                cb();
                                            },
                                            message: '请输入大于0的数字',
                                        },
                                    ]
                                })(
                                    <Input addonBefore="同一用户" addonAfter="天，" style={{ width: '100px' }} disabled={joinCount != 3} />
                                )
                            }
                        </FormItem>
                        <FormItem style={{ marginBottom: '0', marginLeft: '-12px' }} className={styles.time2}>
                            {
                                decorator({
                                    key: 'partInTimes3',
                                    rules: [
                                        { required: joinCount == 3, message: '请输入数字' },
                                        { pattern: /^\d+$/, message: '请输入数字' },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (+value < 1 && joinCount == 3) cb(rule.message);
                                                cb();
                                            },
                                            message: '请输入大于0的数字',
                                        },
                                    ]
                                })(
                                    <Input addonBefore="可参与" addonAfter="次" style={{ width: '100px' }} disabled={joinCount != 3} />
                                )
                            }
                        </FormItem>
                    </Radio>
                </Radio.Group>
            );
        },
    },
    cardScopeType: {
        label: '',
        type: 'custom',
        render: () => (<p></p>),
    },
    brandList: {
        label: '品牌',
        type: 'custom',
        render: decorator => decorator({
        })(<SelectBrands />),
    },
    sourceWayLimit: {
        label: '适用场景',
        type: 'custom',
        render: (decorator) => {
            return (
                <Col className={styles.channel}>
                    {
                        decorator({
                            defaultValue: 0
                        })(
                            <Select
                                allowClear={true}
                            >
                                {
                                    SALE_CENTER_ACTIVITY_SUITSENCE_LIST.map((order) => {
                                        return (
                                            <Option key={order.value} value={order.value}>{order.label}</Option>
                                        );
                                    })
                                }
                            </Select>
                        )
                    }
                    <Tooltip title={
                        <p>
                            <p>仅线下使用：指云店pos、点菜宝、云店pad、大屏等由门店下单场景</p>
                            <p>仅线上使用：指线上餐厅、小程序等由用户自助下单场景</p>
                        </p>
                    }
                    >
                        <Icon
                            type={'question-circle'}
                            style={{
                                color: '#787878',
                                position: 'absolute',
                                left: '505px',
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                        />
                    </Tooltip>
                </Col>
            )
        },
    },
    orderTypeList: {
        type: 'checkbox',
        label: '适用业务',
        options: bizOpts,
        defaultValue: ['31'],
    },
    shopIDList: {
        type: 'custom',
        label: '适用店铺',
        render: decorator => decorator({
            rules: [
                { required: true, message: '请选择适用店铺' }
            ]
        })(<ShopSelector />),
        defaultValue: [],
    },
    giftID: {
        type: 'custom',
        label: '礼品名称',
        rules: ['required'],
        render: () => (<p></p>),
    },
    giftIDNumber: {
        type: 'text',
        label: '礼品ID',
        disabled: true,
        defaultValue: ' ',
    },
    giftCount: {
        type: 'custom',
        label: '礼品数量',
        surfix: '个',
        render: decorator => decorator({})(),
    },
    effectType: {
        type: 'custom',
        label: '',
        render: (decorator, form) => {
            const { getFieldsValue } = form;
            const { effectType: effectTypeValue, giftRangeTime: giftRangeTimeValue } = getFieldsValue();
            return (
                <Row>
                    <Col span={24}>
                        <FormItem
                            label='生效方式'
                            style={{ marginBottom: '-6px', marginTop: '-5px', marginLeft: '9px', display: 'flex' }}>
                            {decorator({
                                key: 'effectType',
                                defaultValue: 1,
                            })(
                                <Radio.Group>
                                    <Radio value={1}>相对有效期</Radio>
                                    <Radio value={2}>固定有效期</Radio>
                                </Radio.Group>
                            )}
                        </FormItem>
                    </Col>
                    <Col>
                        <FormItem style={{ marginLeft: '80px' }}>
                            {
                                effectTypeValue == 2 && decorator({
                                    key: 'giftRangeTime',
                                    defaultValue: giftRangeTimeValue || [],
                                    rules: [
                                        { required: true, message: '请输入有效时间' }
                                    ]
                                })(
                                    <RangePicker format="YYYY-MM-DD" placeholder={['开始日期', '结束日期']} />
                                )
                            }
                        </FormItem>
                    </Col>
                </Row>
            )
        }
    },
    countType: { // 接口定义有坑，选择相对有效期按小时的时候，对应的是effectType值为3
        type: 'custom',
        label: '',
        defaultValue: 0,
        render: (decorator, form) => {
            const { getFieldsValue } = form;
            const { countType, effectType } = getFieldsValue();
            const options = countType == 0 ? timeOpts : dayOpts;
            let defaultValue = countType == 0 ? 0 : 1;
            return (
                <Row>
                    <Col span={24}>
                        {
                            effectType == 1 && <FormItem style={{ marginBottom: '0', marginTop: '-16px', marginLeft: '-2px', display: 'flex' }} label='相对有效期'>
                                {decorator({
                                    key: 'countType',
                                    defaultValue: 0
                                })(
                                    <Radio.Group>
                                        <Radio value={0}>按小时</Radio>
                                        <Radio value={1}>按天</Radio>
                                    </Radio.Group>
                                )}
                            </FormItem>
                        }
                    </Col>
                    <Col span={24}>
                        {
                            effectType == 1 && <FormItem style={{ marginBottom: '0', marginLeft: '7px', display: 'flex', marginRight: '-118px', marginTop: '-7px' }} label='生效时间'>
                                {decorator({
                                    key: 'giftEffectTimeHours',
                                    defaultValue: defaultValue
                                })(
                                    <Select style={{ width: '330px' }}>
                                        {
                                            options.map(item => (
                                                <Option key={item.value} value={item.value}>{item.label}</Option>
                                            ))
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        }
                    </Col>
                </Row>
            )
        }
    },
    giftValidUntilDayCount: {
        type: 'custom',
        label: '',
        render: (decorator, form) => {
            const { getFieldsValue } = form;
            const { effectType } = getFieldsValue();
            return (
                <Col>
                    {
                        effectType == 1 && <FormItem label='有效天数' style={{ display: 'flex', alignItems: 'center', marginBottom: '-5px', marginTop: '-5px', marginRight: '6px' }}>
                            {
                                decorator({
                                    key: 'giftValidUntilDayCount',
                                    rules: [
                                        { pattern: /^\d+$/, message: '请输入数字' },
                                        {
                                            validator: (rule, value, cb) => {
                                                if (+value < 1) cb(rule.message);
                                                cb();
                                            },
                                            message: '请输入大于0的数字',
                                        },
                                    ]
                                })(
                                    <Input addonAfter='天' />
                                )

                            }
                        </FormItem>
                    }
                </Col>
            )
        }
    },
    rangeDate: {
        type: 'datepickerRange',
        label: '固定有效期',
        rules: ['required'],
    },
    activityConditions: {
        type: 'custom',
        label: '活动条件',
        render: () => (<p></p>),
    },
    stageType: {
        type: 'custom',
        label: '',
        render: (decorator, form) => {
            return (
                <Col>
                    {
                        decorator({
                            key: 'stageAmount',
                            rules: [
                                { required: true, message: '请输入数字' },
                                { pattern: /^\d+$/, message: '请输入数字' },
                            ]
                        })(
                            <Input
                                addonBefore={
                                    decorator({
                                        key: 'stageType',
                                        defaultValue: 1
                                    })(
                                        <Select style={{ width: '140px' }}>
                                            {
                                                stageTypeOptions.map(item => (
                                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                                addonAfter={
                                    decorator({
                                        key: 'stageAmountType',
                                        defaultValue: 1
                                    })(
                                        <Select style={{ width: '60px' }}>
                                            {
                                                stageAmountTypeOptions.map(item => (
                                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                                ))
                                            }
                                        </Select>
                                    )
                                }
                            />
                        )
                    }
                </Col>
            )
        },
    },
    presentType: {
        type: 'checkbox',
        label: '赠送',
        labelCol: { span: 4 },
        options: [
            { label: '优惠券', value: 1 },
            { label: '积分', value: 2 },
            // { label: '卡值', value: 5 },
        ],
        rules: ['required'],
    },
    hasMutexDepend: {
        type: 'switcher',
        label: '与优惠券不共享',
        defaultValue: false,
        onLabel: '开',
        offLabel: '关',
    },
    amountType: {
        type: 'radio',
        label: '金额核算',
        labelCol: { span: 3 },
        defaultValue: 1,
        options: [
            { label: '账单金额', value: 1 },
            { label: '实收金额', value: 2 },
        ],
        rules: ['required'],
    },
    mutexDependType: {
        type: 'radio',
        label: '',
        render: () => { }
    },
    activityRange: {
        label: '',
        type: 'custom',
        defaultValue: '',
        render: decorator => decorator({})(<CategoryAndFoodSelector showRequiredMark />),
    },
    giftPresentType: {
        label: '礼品属性',
        type: 'custom',
        defaultValue: 1,
        labelCol: { span: 4 },
        options: [
            { label: '优惠券', value: 1 },
            { label: '券包', value: 4 },
        ],
        render: () => {}
    },
    couponName: {
        label: '券包名称',
        type: 'custom',
        labelCol: { span: 4 },
        rules: ['required'],
        render: () => {},
    },
    totalValue: {
        label: '券包个数',
        type: 'custom',
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
        render: (d, form) => {
            const { giftPresentType = 1 } = form.getFieldsValue();
            if (giftPresentType == 1) { return null }
            return (<FormItem style={{ marginTop: '-6px' }}>
                {d({
                    rules: [{
                        required: true,
                        message: '券包个数不能为空',
                        validator: (rule, value, callback) => {
                            if (!/^\d+$/.test(value)) {
                                return callback('请输入数字');
                            }
                            if (+value < 1 || +value > 999999) {
                                return callback('大于0，限制999999个');
                            }
                            return callback();
                        },
                    }],
                })(<Input placeholder="请输入券包个数" />)}
            </FormItem>)
        },
    },
};

export const BASE_FORM_KEYS = {
    '消费送礼': [
        {
            col: {
                span: 24,
            },
            keys: ['eventType', 'eventName', 'eventRange', 'eventRemark'],
        },
    ],
    'todo_demo': [
        {
            col: {
                span: 24,
            },
            keys: ['eventType', 'eventName'],
        },
    ],
};

export const ACTIVITY_RULE_FORM_KEYS = {
    '消费送礼': [
        {
            col: {
                span: 24,
            },
            // keys: ['joinCount', 'cardScopeType', 'defaultCardType', 'brandList', 'shopIDList', 'sourceWayLimit', 'orderTypeList'],
            keys: ['joinCount', 'cardScopeType', 'brandList', 'shopIDList', 'sourceWayLimit', 'orderTypeList'],
        },
    ],
};

export const ACTIVITY_THIRD_RULE_FORM_KEYS = {
    '消费送礼': [
        {
            col: {
                span: 24,
            },
            keys: ['amountType', 'hasMutexDepend'],
        },
    ],
};
