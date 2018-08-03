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
} from 'antd';
import styles from '../../SaleCenterNEW/ActivityPage.less';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
const { RangePicker } = DatePicker;
const { RadioGroup } = Radio;
const { Item: FormItem } = Form;
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
            confirmLoading: false
        };
        this.handleQuery = this.handleQuery.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleAutoGeneratingChange = this.handleAutoGeneratingChange.bind(this);
        this.handleModalOk = this.handleModalOk.bind(this);
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

    handleModalOk() {
        this.setState({
            confirmLoading: true,
        });
        setTimeout(() => {
            this.setState({
                confirmLoading: false,
                modalVisible: false
            });
        }, 2000)
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

    renderModalContent() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem
                    label="有效期"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <div>
                        <RangePicker style={{ width: 200 }} />
                    </div>
                </FormItem>
                <FormItem
                    label="生成方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup onChange={this.handleAutoGeneratingChange} value={this.state.autoGenerating}>
                        <Radio key={'1'} value={'1'}>系统自动生成</Radio>
                        <Radio key={'2'} value={'2'}>按规则生成</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    label="选择短信模板"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {
                        getFieldDecorator('va', {
                            initialValue: this.state.message,
                            onChange: this.handleMessageChange,
                            rules: [
                                { required: true, message: '必须选择一条短信模板' },
                            ]
                        })(

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
                    width={624}
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
