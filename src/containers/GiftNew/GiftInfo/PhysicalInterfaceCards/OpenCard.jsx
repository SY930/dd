import React, { PureComponent as Component } from 'react';
import { Modal, Form, Input, Radio, DatePicker, Button } from 'antd';
import moment from 'moment';
import styles from './index.less';
import _ from 'lodash';
import innerCard from '../../../../assets/innerCard.png';
import { addOpenCard } from './AxiosFactory';
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 18 },
};

@Form.create()
export default class OpenCard extends Component {
    state = {
        brands: [],
        disabled: false,
        record: {}
    }

    componentDidMount() {
        this.setState({ disabled: this.props.type === 'preview', record: this.props.record });
    }

    handleOk = _.throttle(() => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { groupID, templateID } = this.props;
                const { record } = this.state;
                const params = {
                    ...values,
                    ...values.expiration,
                    expiration: undefined,
                    groupID,
                    templateID,
                    itemID: record.itemID,
                }
                addOpenCard(params, record.itemID ? 'edit' : 'add').then((res) => {
                    if (res) {
                        this.props.fetchList();
                        this.props.handleCancel()
                        this.props.upDateParentState({ reloadList: true })
                    }
                });
            }
        })
    }, 1500, { trailing: true })

    showFooter = (type) => {
        if (type === 'preview') {
            return [<Button type='ghost' onClick={this.props.handleCancel}>关闭</Button>]
        }
        return [<Button type='ghost' onClick={this.props.handleCancel}>取消</Button>, <Button type='primary' onClick={this.handleOk}>保存并提交审核</Button>]
    }


    render() {

        const { visible, type } = this.props;
        const { getFieldDecorator } = this.props.form;
        const { disabled, record = {} } = this.state;
        const { openNum, description, expirationType = 1, expirationStartDate, expirationEndDate } = record;

        return (
            <Modal
                title={type === 'preview' ? '开卡详情' : '开卡'}
                visible={visible}
                width={650}
                maskClosable={false}
                closable={false}
                footer={this.showFooter(type)}

            >
                <div className={styles.open_card_modal_wrap}>
                    <div>
                        <img src={innerCard} alt="" className='inner_card_img' />
                    </div>
                    <div>
                        <Form>
                            {/* <FormItem
                                {...formItemLayout}
                                label="开卡编号"
                            >
                                {getFieldDecorator('cardNumber', {
                                    initialValue: cardNumber,
                                    rules: [
                                        { required: true, message: '开卡编号必填', },
                                        { len: 6, message: '开卡编号必须为6位' },
                                        { pattern: /^[0-9]*$/, message: '开卡编号必须为数字' },
                                    ],
                                })(
                                    <Input placeholder='请输入开卡编号' disabled={disabled} />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="卡种编号"
                            >
                                {getFieldDecorator('typeNumber', {
                                    initialValue: typeNumber,
                                    rules: [
                                        { required: true, message: '卡种编号必填', },
                                        { len: 3, message: '卡种编号必须为3位' },
                                        { pattern: /^[0-9]*$/, message: '卡种编号必须为数字' },
                                    ],
                                })(
                                    <Input placeholder='请输入卡种编号' disabled={disabled} />
                                )}
                            </FormItem> */}
                            <FormItem
                                {...formItemLayout}
                                label="开卡数量"
                            >
                                {getFieldDecorator('openNum', {
                                    initialValue: openNum,
                                    rules: [
                                        { required: true, message: '开卡数量必填', },
                                        { pattern: /^(?:[1-9][0-9]{0,4})?$/, message: '开卡数量大于0，小于99999' },
                                    ],
                                })(
                                    <Input placeholder='请输入开卡数量' addonAfter="张" disabled={disabled} />
                                )}
                            </FormItem>
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

export class Validity extends Component {

    changeRadio = (e) => {
        this.props.onChange({ expirationType: e.target.value, day: '', expirationStartDate: '', expirationEndDate: '' })
    }

    changeInput = (e) => {
        this.props.onChange({ expirationType: 3, day: e.target.value, expirationStartDate: '', expirationEndDate: '' })
    }

    changeRange = (date, dateString) => {
        const expirationStartDate = dateString[0] ? moment(dateString[0]).format('YYYY-MM-DD') : '';
        const expirationEndDate = dateString[1] ? moment(dateString[1]).format('YYYY-MM-DD') : '';
        this.props.onChange({ expirationType: 2, day: '', expirationStartDate, expirationEndDate })
    }


    render() {
        const { expirationType, day, expirationStartDate, expirationEndDate } = this.props.value;
        const { disabled } = this.props;
        const rangeValue = [];
        if (expirationStartDate && expirationEndDate) {
            rangeValue[0] = moment(expirationStartDate, 'YYYY-MM-DD');
            rangeValue[1] = moment(expirationEndDate, 'YYYY-MM-DD');
        }
        return (
            <div className={styles.validity_wrap}>
                <Radio.Group onChange={this.changeRadio} value={expirationType} disabled={disabled}>
                    <Radio value={1}>永久有效</Radio>
                    {/* <Radio value={3}>相对有效期</Radio> */}
                    <Radio value={2}>固定有效期</Radio>
                </Radio.Group>
                {
                    expirationType === 3 &&
                    <div style={{ display: 'flex' }}>
                        <span>开卡后立即生效,有效天数</span>
                        <span style={{ marginLeft: 10 }}>
                            <Input addonAfter="天" onChange={this.changeInput} disabled={disabled} value={day} />
                        </span>

                    </div>
                }
                {
                    expirationType === 2 &&
                    <RangePicker
                        disabled={disabled}
                        onChange={this.changeRange}
                        value={rangeValue}
                    />
                }
            </div>
        );
    }
}

