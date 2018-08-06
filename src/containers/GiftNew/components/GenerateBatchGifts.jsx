import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Table,
    Button,
    Icon,
    DatePicker,
    Radio,
    Checkbox,
    Input,
    Modal,
    Form,
    Row,
    Col,
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const FormItem = Form.Item;
class GenerateBatchGifts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            historyList: new Array(10).fill({}),
            loading: false,
            pageSizes: 10,
            pageNo: 1,
            total: 0,
            autoGenerating: '1', // 是否系统自动生成券码 1 自动, 2 手动填写起止号, string
            modalVisible: false,
            confirmLoading: false,
            validDateRange: [],
            giftCount: undefined, // 张数
            startNo: undefined,
            endNo: undefined,
            description: undefined,
            includeRandomCode: false, // 券码是否包含随机码 true: 包含, false: 不包含
        };
        this.handleQuery = this.handleQuery.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleAutoGeneratingChange = this.handleAutoGeneratingChange.bind(this);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleValidDateRangeChange = this.handleValidDateRangeChange.bind(this);
        this.handleGiftCountChange = this.handleGiftCountChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleStartNoChange = this.handleStartNoChange.bind(this);
        this.handleEndNoChange = this.handleEndNoChange.bind(this);
        this.handleIncludeRandomCode = this.handleIncludeRandomCode.bind(this);
    }

    handleQuery() {
        this.setState({
           loading: true,
        });
        setTimeout(() => {
            this.setState({
                loading: false,
            });
        }, 2000)
    }

    handleAutoGeneratingChange(event) {
        this.setState({
            autoGenerating: event.target.value,
        });
    }

    handleDescriptionChange(val) {
        this.setState({
            description: val,
        });
    }

    handleIncludeRandomCode(event) {
        this.setState({
            includeRandomCode: event.target.checked,
        });
    }

    handleValidDateRangeChange(val) {
        this.setState({
            validDateRange: val,
        });
    }

    handleGiftCountChange(val) {
        this.setState({
            giftCount: val.number,
        });
    }

    handleStartNoChange(val) {
        this.setState({
            startNo: val.number,
        }, () => {
            const endNoValue = this.props.form.getFieldValue('endNo');
            if (endNoValue.number && (Number(val.number || 0) > Number(endNoValue.number))) {
                this.props.form.setFields({
                    endNo: {
                        value: endNoValue,
                        errors: ['终止号必须大于等于起始号'],
                    }
                })
            } else if (endNoValue.number && (Number(endNoValue.number) - (Number(val.number || 0) ) > 9999)) {
                this.props.form.setFields({
                    endNo: {
                        value: endNoValue,
                        errors: ['张数不能超过10000'],
                    }
                })
            }
        });
    }

    handleEndNoChange(val) {
        this.setState({
            endNo: val.number,
        });
    }

    getDateCount() {
        const { validDateRange } = this.state;
        if (!validDateRange[0] || !validDateRange[1]) {
            return '永久';
        } else {
            return `${validDateRange[1].diff(validDateRange[0], 'days') + 1} 天`;
        }
    }

    handleModalOk() {
        let flag = true;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (err) {
                flag = false;
            }
        })
        console.log('flag', flag);
    }

    showModal() {
        this.setState({
            modalVisible: true,
        });
    }

    hideModal() {
        this.setState({
            modalVisible: false,
        });
    }

    renderHeader() {
        return (
            <div className={styles.generateBatchGiftsHeader}>
                <div>
                    制券时间：<RangePicker style={{ width: 200 }} />
                </div>
                <div>
                    <Button
                        type="primary"
                        disabled={this.state.loading}
                        onClick={this.handleQuery}
                    >
                        <Icon type="search" />
                        查询
                    </Button>

                    <Button
                        style={{ marginLeft: 15 }}
                        type="primary"
                        onClick={this.showModal}
                    >
                        生成券码
                    </Button>
                </div>
            </div>
        )
    }

    renderTable() {
        const columns = [
            {
                title: '序号',
                className: 'TableTxtCenter',
                width: 50,
                key: 'index',
                render: (text, record, index) => {
                    return (this.state.pageNo - 1) * this.state.pageSizes + index +1;
                },
            },
            {
                title: '张数',
                className: 'TableTxtCenter',
                width: 50,
                key: 'num',
                render: (text, record, index) => {
                    return '123000';
                },
            },
            {
                title: '有效期起',
                className: 'TableTxtCenter',
                width: 80,
                key: 'key1',
                render: (text, record, index) => {
                    return '2018/06/04';
                },
            },
            {
                title: '有效期止',
                className: 'TableTxtCenter',
                width: 80,
                key: 'key2',
                render: (text, record, index) => {
                    return '2018/06/04';
                },
            },
            {
                title: '备注',
                className: 'TableTxtCenter',
                width: 120,
                key: 'key3',
                render: (text, record, index) => {
                    text = '1231231231231231123123123123123123123123123123123123123123';
                    return <span title={text}>{text}</span> ;
                },
            },
            {
                title: '操作员',
                className: 'TableTxtCenter',
                width: 60,
                key: 'key4',
                render: (text, record, index) => {
                    return 'wuhao123123123';
                },
            },
            {
                title: '制券时间',
                className: 'TableTxtCenter',
                width: 120,
                key: 'key5',
                render: (text, record, index) => {
                    return '2018-06-04 14:54:20';
                },
            },
            {
                title: '状态',
                className: 'TableTxtCenter',
                width: 50,
                key: 'key6',
                render: (text, record, index) => {
                    return '已完成';
                },
            },
            {
                title: '操作',
                className: 'TableTxtCenter',
                width: 50,
                key: 'key7',
                render: (text, record, index) => {
                    return '导出';
                },
            },
        ];
        return (
            <Table
                // scroll={{ x: 1600 }}
                bordered={true}
                columns={columns}
                dataSource={this.state.historyList}
                loading={this.state.loading}
                pagination={{
                    pageSize: this.state.pageSizes,
                    current: this.state.pageNo,
                    showQuickJumper: true,
                    total: this.state.total ? this.state.total : 0,
                    showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                    onChange: (page, pageSize) => {
                        this.setState({
                            pageNo: page,
                        })
                        const opt = {
                            pageSize,
                            pageNo: page,
                            // ...this.getParams(),
                        };
                        this.queryEvents(opt);
                    },
                }}
            />
        )
    }

    renderAutoGeneratingRules() {
        const { getFieldDecorator } = this.props.form;
        return (
            <FormItem
                label="张数"
                className={styles.FormItemStyle}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 8 }}
                required
            >{
                getFieldDecorator('giftCount', {
                    initialValue: {number: this.state.giftCount},
                    onChange: this.handleGiftCountChange,
                    rules: [
                        {
                            validator: (rule, v, cb) => {
                                if (!v || !v.number) {
                                    return cb('张数为必填项');
                                }
                                v.number > 0 && v.number <= 10000 ? cb() : cb('不能超过1万张');
                            },
                        },
                    ]
                })(
                    <PriceInput
                        modal="int"
                        addonAfter="张"
                    />
                )
            }
            </FormItem>
        )
    }

    renderManualGeneratingRules() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <FormItem
                    label="起止号"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    required
                >
                    <div className={styles.flexFormItem}>
                        <FormItem
                            className={`${styles.FormItemStyle} ${styles.childFormItem}`}
                            wrapperCol={{ span: 24 }}
                        >
                            {
                                getFieldDecorator('startNo', {
                                    initialValue: {number: this.state.startNo},
                                    onChange: this.handleStartNoChange,
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !v.number) {
                                                    return cb('起始号为必填项');
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        modal="int"
                                        placeholder="券码起始号"
                                        maxNum={15}
                                    />
                                )
                            }
                        </FormItem>
                        至
                        <FormItem
                            className={`${styles.FormItemStyle} ${styles.childFormItem}`}
                            wrapperCol={{ span: 24 }}
                        >
                            {
                                getFieldDecorator('endNo', {
                                    initialValue: {number: this.state.endNo},
                                    onChange: this.handleEndNoChange,
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (!v || !v.number) {
                                                    return cb('终止号为必填项');
                                                }
                                                if (Number(v.number || 0) < Number(this.props.form.getFieldValue('startNo').number || 0)) {
                                                    return cb('终止号必须大于等于起始号')
                                                }
                                                if (Number(v.number || 0) - Number(this.props.form.getFieldValue('startNo').number || 0) > 9999) {
                                                    return cb('张数不能超过10000')
                                                }
                                                cb()
                                            },
                                        },
                                    ],
                                })(
                                    <PriceInput
                                        modal="int"
                                        maxNum={15}
                                        placeholder="券码终止号"
                                    />
                                )
                            }
                        </FormItem>
                    </div>
                </FormItem>
                <FormItem
                    label="张数"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 8 }}
                >
                    <PriceInput
                        modal="int"
                        addonAfter="张"
                        disabled
                        value={{number: (this.state.endNo >= this.state.startNo) ? Number(this.state.endNo || 0) - Number(this.state.startNo || 0) + 1 : ''}}
                    />
                </FormItem>
                <FormItem
                    label="随机码"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 8 }}
                >
                    <div className={styles.flexFormItem}>
                        <Checkbox
                            checked={this.state.includeRandomCode}
                            onChange={this.handleIncludeRandomCode}
                        >
                            券码包含随机码
                        </Checkbox>
                    </div>
                </FormItem>
                <FormItem
                    label="券码组成"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 8 }}
                >
                    <Input
                        type="text"
                        value={this.state.includeRandomCode ? '起止码 + 3位随机码' : '起止码'}
                        disabled
                    />
                </FormItem>
            </div>

        )
    }

    renderModalContent() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem
                    label="有效期"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                >
                    <Row>
                        <Col span={20}>
                            <RangePicker value={this.state.validDateRange} onChange={this.handleValidDateRangeChange} />
                        </Col>
                        <Col offset={1} span={3}>
                            <div className={styles.ActivityDateDay}>
                                <span>{this.getDateCount()}</span>
                            </div>

                        </Col>
                    </Row>
                </FormItem>
                <FormItem
                    label="生成方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                >
                    <RadioGroup onChange={this.handleAutoGeneratingChange} value={this.state.autoGenerating}>
                        <Radio key={'1'} value={'1'}>系统自动生成</Radio>
                        <Radio key={'2'} value={'2'}>按规则生成</Radio>
                    </RadioGroup>
                </FormItem>
                {
                    this.state.autoGenerating ==='1' && this.renderAutoGeneratingRules()
                }
                {
                    this.state.autoGenerating ==='2' && this.renderManualGeneratingRules()
                }
                <FormItem
                    label="备注"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 8 }}
                    required
                >{
                    getFieldDecorator('description', {
                        initialValue: this.state.description,
                        onChange: this.handleDescriptionChange,
                        rules: [
                            { required: true, message: '不能为空' },
                            {
                                message: '汉字、字母、数字组成，不多于50个字符',
                                pattern: /^[\u4E00-\u9FA5A-Za-z0-9.（）()\-]{1,50}$/,
                            },
                        ],
                    })(
                        <Input
                            type="textarea"
                            placeholder="请输入备注信息"
                        />
                    )
                }
                </FormItem>
            </Form>
        )
    }



    render() {
        return (
            <div>
                {this.renderHeader()}
                {this.renderTable()}
                <Modal
                    key="批量生成券码"
                    title="批量生成券码"
                    maskClosable={false}
                    visible={this.state.modalVisible}
                    confirmLoading={this.state.confirmLoading}
                    width={900}
                    onCancel={this.hideModal}
                    onOk={this.handleModalOk}
                >
                    {this.state.modalVisible && this.renderModalContent()}
                </Modal>
            </div>
        )
    }
}

export default Form.create()(GenerateBatchGifts);
