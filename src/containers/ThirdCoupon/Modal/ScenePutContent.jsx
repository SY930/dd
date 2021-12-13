import React, { Component } from 'react'
import { Form, Input, Select, Radio, Row, Col, Icon, Modal, message, Button } from 'antd'
import { axios, jumpPage, getStore } from '@hualala/platform-base';
import _ from 'lodash';
import { getMpAppList, getPayChannel, getLinks } from '../AxiosFactory';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class ScenePutContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmLoading: false,
            value: '0',
        };
    }
    componentDidMount() {
    }


    onChange = (e) => {
        this.setState({
            value: e.target.value,
        });
    }

    handleSubmit = () => {
        if (this.state.value === '0') {
            const { batchName, merchantType, trdBatchID, itemID, masterMerchantID } = this.props.wxData;
            // TODO: 请求接口，关闭弹窗
            this.setState({ confirmLoading: true })
            const url = '/api/v1/universal?';
            const method = 'trdEventService/addEvent.ajax';
            const { user } = getStore().getState();
            const { groupID } = user.get('accountInfo').toJS()
            const params = {
                service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
                type: 'post',
                // couponCodeBatchInfo: res,
                data: {
                    trdEventInfo: {
                        eventName: batchName,
                        eventWay: '20003',
                        platformType: '3',
                        merchantID: '1800009380',
                        merchantType,
                        trdEventID: trdBatchID,
                        marketingType: 'BUSIFAVOR_STOCK',
                        giftConfInfos: [{ giftID: itemID }],
                        masterMerchantID,

                    },
                    groupID,
                },
                method,
            };
            axios.post(url + method, params).then((res) => {
                const { code, message: msg } = res;
                if (code === '000') {
                    message.success('投放成功');
                    this.setState({ confirmLoading: false })
                    this.props.handleQuery();
                    return
                }
                this.setState({ confirmLoading: false })
                message.error(msg);
            }).catch((error) => {
                this.setState({ confirmLoading: false })
                console.log(error)
            })
        } else {
            // 跳转线上餐厅送礼
            // jumpPage({})
            jumpPage({ pageID: '10000730001', type: 23, from: 'scenePut' });
        }
        this.props.onCancel();
    }


    render() {
        const { title, isEdit, onCancel } = this.props;
        // const { getFieldDecorator } = form;
        let footer = [
            <Button key="2" onClick={onCancel}>取消</Button>,
            <Button key="3" type={'primary'} onClick={this.handleSubmit} loading={this.state.confirmLoading}>确定</Button>,
        ];
        if (isEdit) {
            footer = [<Button key="back" onClick={onCancel}>关闭</Button>]
        }
        return (
            <Modal
                title={title}
                maskClosable={true}
                width={500}
                visible={true}
                onCancel={onCancel}
                // onOk={this.handleSubmit}
                footer={footer}
                // confirmLoading={this.state.confirmLoading}
            >

                <Form.Item
                    label="投放场景"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    required={true}
                >
                    <Select
                        onChange={this.onChange}
                        value={this.state.value}
                        // placeholder="请选择页面路径"
                    >
                        {
                            [{ value: '0', label: '企鹅吉市' }].map(({ value, label }) => {
                                return <Option value={value}>{label}</Option>
                            })
                        }
                    </Select>
                    {/* <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value="0">企鹅吉市</Radio>
                    </RadioGroup> */}
                </Form.Item>

            </Modal>
        )
    }
}
export default Form.create()(ScenePutContent);
