import React, { PureComponent as Component } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';
import styles from './index.less';
import _ from 'lodash';
import { Validity } from './OpenCard';
import { addSendCard } from './AxiosFactory'
const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

@Form.create()
export default class SendCard extends Component {
    state = {
        brands: [],
        disabled: false,
        data: {}
    }

    componentDidMount() {
        this.setState({ disabled: this.props.type === 'preview', data: this.props.record })
    }

    handleOk = _.throttle(() => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { data } = this.state;
                const { groupID, templateID } = this.props;
                const { label: companyName, key: companyCode } = values.company;
                const { facePrice, minConsume } = values;
                if (Number(facePrice) < Number(minConsume)) {
                    message.error('单张最低消费不能大于卡面值');
                    return;
                }
                const params = {
                    ...values,
                    ...values.expiration,
                    expiration: undefined,
                    companyName,
                    companyCode,
                    company: undefined,
                    groupID,
                    templateID,
                    itemID: data.itemID,
                }
                addSendCard(params, data.itemID ? 'editCardSendTask' : 'addCardSendTask').then((res) => {
                    if (res) {
                        this.props.fetchList();
                        this.props.handleCancel()
                        this.props.upDateParentState({ reloadList: true })
                    }
                });
            }
        })
    }, 1500, { trailing: true })


    render() {

        const { visible, handleCancel, type, item, companyList } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { disabled, data = {} } = this.state;
        const { facePrice, discountRate, cardStartNo, cardEndNo, minConsume,
            companyCode, companyName, description, cardNum, expirationType = 1, expirationStartDate, expirationEndDate } = data;

        return (
            <Modal
                title='发卡'
                visible={visible}
                onOk={this.handleOk}
                onCancel={handleCancel}
                width={650}
                maskClosable={false}
                closable={false}
                okText="确定提交审核"
            >
                <div className={styles.open_card_modal_wrap}>
                    <div>
                        <Form>
                            {
                                type === 'eCard' &&
                                <FormItem
                                    {...formItemLayout}
                                    label="卡类型"
                                >
                                    <div>{item.templateTypeName}</div>
                                </FormItem>
                            }
                            <FormItem
                                {...formItemLayout}
                                label="卡面值"
                            >
                                {getFieldDecorator('facePrice', {
                                    initialValue: facePrice,
                                    rules: [
                                        { required: true, message: '卡面值必填', },
                                        { pattern: /^[0-9]{1,6}([.]{1}[0-9]{0,2})?$/, message: '卡面值支持6位整数，支持两位小数' },
                                        {
                                            validator: (rule, v, cb) => {
                                                if (v == 0) {
                                                    cb('卡面值不能为0')
                                                }
                                                cb()
                                            },
                                        }
                                    ],
                                })(
                                    <Input placeholder='请输入卡面值' disabled={disabled} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label={type === 'eCard' ? "折扣比例" : "折扣率"}
                            >
                                {getFieldDecorator('discountRate', {
                                    initialValue: discountRate,
                                    rules: [
                                        { required: true, message: '折扣必填', },
                                        { pattern: /^([0-9]{1,2}$)|(^[0-9]{1,2}\.[0-9]{1,2}$)|100$|100.00$/, message: '支持0-100的数字' },
                                    ],
                                })(
                                    <Input placeholder='请输入折扣' disabled={disabled} addonAfter="%" />
                                )}
                            </FormItem>
                            {
                                type === 'eCard' &&
                                <FormItem
                                    {...formItemLayout}
                                    label="卡数量"
                                >
                                    {getFieldDecorator('cardNum', {
                                        initialValue: cardNum,
                                        rules: [
                                            { required: true, message: '卡数量必填', },
                                            { pattern: /^(?:[1-9][0-9]{0,4})?$/, message: '发卡数量大于0，小于99999' },
                                        ],
                                    })(
                                        <Input placeholder='请输入卡数量' addonAfter="张" disabled={disabled} />
                                    )}
                                </FormItem>
                            }
                            {
                                type === 'pCard' &&
                                <div>
                                    <FormItem
                                        {...formItemLayout}
                                        label="开始卡号"
                                    >
                                        {getFieldDecorator('cardStartNo', {
                                            initialValue: cardStartNo,
                                            rules: [
                                                { required: true, message: '开始卡号必填', },
                                                { max: 9, message: '开始卡号最多支持9位' },
                                            ],
                                        })(
                                            <Input placeholder='请输入开始卡号' disabled={disabled} />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="结束卡号"
                                    >
                                        {getFieldDecorator('cardEndNo', {
                                            initialValue: cardEndNo,
                                            rules: [
                                                { required: true, message: '结束卡号必填', },
                                                { max: 9, message: '结束卡号最多支持9位' },
                                            ],
                                        })(
                                            <Input placeholder='请输入结束卡号' disabled={disabled} />
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="单张最低消费"
                                    >
                                        {getFieldDecorator('minConsume', {
                                            initialValue: minConsume,
                                            rules: [
                                                { required: true, message: '单张最低消费必填', },
                                                { pattern: /^[0-9]{1,100}([.]{1}[0-9]{0,2})?$/, message: '单张最低消费为数字，支持两位小数' },
                                                {
                                                    validator: (rule, v, cb) => {
                                                        const facePrice = this.props.form.getFieldValue('facePrice');
                                                        if (Number(v) > Number(facePrice)) {
                                                            cb('单张最低消费不能大于卡面值')
                                                        }
                                                        cb()
                                                    },
                                                }
                                            ],
                                        })(
                                            <Input placeholder='请输入单张最低消费' disabled={disabled} />
                                        )}
                                    </FormItem>
                                </div>
                            }
                            {
                                type === 'eCard' &&
                                <FormItem
                                    {...formItemLayout}
                                    label="有效期"
                                >
                                    {getFieldDecorator('expiration', {
                                        initialValue: { expirationType, expirationStartDate, expirationEndDate },
                                        rules: [
                                            {
                                                validator: (rule, value, callback) => {
                                                    if (value.expirationType === 3) {
                                                        if (!/^[0-9]{1,8}?$/.test(value.day) || value.day == 0) {
                                                            callback('有效期天数为大于0的整数,最多支持8位');
                                                        }
                                                    } else if (value.expirationType === 2) {
                                                        if (!value.expirationStartDate || !value.expirationEndDate) {
                                                            callback('请选择固定有效期');
                                                        }
                                                    }
                                                    return callback();
                                                }
                                            }
                                        ],
                                    })(
                                        <Validity disabled={disabled} />
                                    )}
                                </FormItem>
                            }
                            <FormItem
                                {...formItemLayout}
                                label="制定运营中心"
                            >
                                {getFieldDecorator('company', {
                                    initialValue: companyCode ? { key: companyCode, label: companyName } : undefined,
                                    rules: [
                                        { required: true, message: '请选择制定运营中心', },
                                    ],
                                })(
                                    <Select
                                        showSearch
                                        placeholder="请选择制定运营中心"
                                        optionFilterProp="children"
                                        labelInValue
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    >
                                        {
                                            companyList.map((item, index) => {
                                                return <Option key={item.value} value={item.value}>{item.label}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="描述"
                            >
                                {getFieldDecorator('description', {
                                    initialValue: description,
                                    rules: [
                                        { required: true, message: '描述必填', },
                                        { max: 500, message: '描述长度不能超过500字符' },
                                    ],
                                })(
                                    <Input placeholder='最大限制500字符' type='textarea' disabled={disabled} />
                                )}
                            </FormItem>
                        </Form>
                    </div>
                </div>
            </Modal>
        );
    }
}
