import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Icon, Modal, TreeSelect, message, Table } from 'antd'
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
            const { batchName, merchantType, trdBatchID } = this.props.wxData;
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
        // const { form } = this.props;
        // const { getFieldDecorator } = form;
        return (
            <Modal
                title="选择投放场景"
                maskClosable={true}
                width={500}
                visible={true}
                onCancel={this.props.onCancel}
                onOk={this.handleSubmit}
                confirmLoading={this.state.confirmLoading}
            >

                <Form.Item
                    label="投放场景"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    required={true}
                >
                    <RadioGroup onChange={this.onChange} value={this.state.value}>
                        <Radio value="0">企鹅吉市</Radio>
                        <Radio value="1">线上餐厅送礼</Radio>
                    </RadioGroup>
                </Form.Item>

            </Modal>
        )
    }
}
export default Form.create()(ScenePutContent);
