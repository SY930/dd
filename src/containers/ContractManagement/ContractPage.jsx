import React, { Component } from 'react';
import { Form, Row, Col, Button, Table, Icon, Modal, Input, DatePicker, message } from 'antd';
import { COMMON_LABEL } from 'i18n/common';
import BaseForm from '../../components/common/BaseForm';
import styles from './GontractInfo.less';
import styles2 from '../SaleCenterNEW/ActivityPage.less';
import moment from 'moment';
import { queryList, addContract, removeContracts, contractExport } from './Controller/index'
import { timeFormat } from '../../helpers/util';
import ExportModal from './ExportModal';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;


class ContractPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            visible: false,
            queryParams: {
                pageNo: 1,
                pageSize: 25,
            },
            dataSource: [],
            total: 0,

            createContractVisible: false,
            exportVisible: false,
        };
        this.columns = []
        this.check = false
    }

    componentDidMount() {
        this.queryTableData()
    }


    componentWillReceiveProps(nextProps) {
    }


    startLoad = () => this.setState({ loading: true })

    endLoad = () => this.setState({ loading: false })

    queryTableData = () => {
        const { queryParams } = this.state;
        this.startLoad()
        this.queryFroms.validateFieldsAndScroll(async (err, values) => {
            if (err) return;
            const params = {
                ...queryParams,
                ...values,
            };

            const tableData = await queryList(params)

            this.endLoad()
            this.setState({
                dataSource: tableData.contractList,
                queryParams: { pageNo: 1, pageSize: queryParams.pageSize || 1, ...params },
                total: tableData.totalSize,
            })
        });
    }
h

    createContractOk = () => {
        const { form } = this.props;

        const { validateFieldsAndScroll } = form;
        if (!this.check) {
            validateFieldsAndScroll(async (err, values) => {
                if (err) return
                this.check = true
                const { code } = await addContract(values)

                if (code === '000') {
                    message.success('创建成功')
                    this.queryTableData()
                    this.closeModal()
                } else {
                    this.check = false
                }
            })
        }
    }


    closeModal = () => {
        this.setState({
            createContractVisible: false,
        }, () => {
            setTimeout(() => {
                this.check = false
            }, 1000)
        })
    }

    handlePageChange = async (pageNo, pageSize) => {
        const { queryParams } = this.state;

        const tableData = await queryList({
            ...queryParams,
            pageNo,
            pageSize,
        })

        this.setState({
            dataSource: tableData.contractList,
            queryParams: { ...queryParams, pageNo, pageSize },
            total: tableData.totalSize,
        })
    }


    handleDelete = (r) => {
        Modal.confirm({
            title: '是否确认删除合同？',
            // content: (
            //     <div>
            //         {`您将停用礼品
            //         【${r.giftName}】`}
            //         <br />
            //         <span>停用是不可恢复操作，被停用的券批次中已发放、为发放的券码全部作废～</span>
            //     </div>
            // ),
            onOk: async () => {
                if (!this.check) {
                    this.check = true
                    const res = await removeContracts({ contractID: r.contractID })
                    if (res.code === '000') {
                        message.success('删除成功')
                        this.queryTableData()
                        setTimeout(() => {
                            this.check = false
                        }, 1000)
                    }
                }
            },
            onCancel: () => {
            },
        })
    }

    render() {
        const { loading, queryParams, dataSource = [], total, createContractVisible, exportVisible } = this.state;
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const { pageNo, pageSize } = queryParams;
        const formItems = {

            contractName: {
                label: '合同名称',
                type: 'text',
                placeholder: '请输入合同名称',
            },
            contractCode: {
                label: '合同编号',
                type: 'text',
                placeholder: '请输入合同编号',
            },
        };

        const formKeys = ['contractName', 'contractCode'];
        const columns = handleDelete => [
            {
                title: COMMON_LABEL.serialNumber,
                dataIndex: 'num',
                key: 'num',
                className: 'x-tc',
                // fixed: 'left',
                width: 50,
                render: (text, record, index) => {
                    return (pageNo - 1) * pageSize + index + 1;
                },
            }, {
                title: COMMON_LABEL.actions,
                dataIndex: 'operate',
                className: 'TableTxtCenter',
                key: 'operate',
                // fixed: 'left',
                width: 50,
                render(value, record) {
                    return (
                        <span>
                            <a
                                href="javaScript:;"
                                onClick={() => {
                                    handleDelete(record)
                                }}
                            >删除
                            </a>
                        </span>
                    )
                },
            }, {
                title: '合同名称',
                dataIndex: 'contractName',
                key: 'contractName',
                // fixed: 'left',
                width: 100,
                render: (value) => {
                    return <span title={value}>{value}</span>
                },
            }, {
                title: '合同编号',
                dataIndex: 'contractCode',
                key: 'contractCode',
                render: (value) => {
                    return <span title={value}>{value}</span>
                },
                // fixed: 'left',
                width: 100,
            }, {
                title: '合作渠道',
                dataIndex: 'channelName',
                key: 'channelName',
                // fixed: 'left',
                render: (value) => {
                    return <span title={value}>{value}</span>
                },
                width: 100,
            }, {
                title: '合同有效期',
                dataIndex: 'startDateTime',
                key: 'startDateTime',
                width: 150,
                render: (value, { startDateTime, endDateTime }) => {
                    if (startDateTime) {
                        return (<span title={moment(startDateTime).format('YYYY/MM/DD') - moment(endDateTime).format('YYYY/MM/DD')}>
                            {moment(startDateTime).format('YYYY/MM/DD')}-{moment(endDateTime).format('YYYY/MM/DD')}
                        </span>)
                    }
                    return '-'
                },
            }, {
                title: '创建人',
                dataIndex: 'createBy',
                key: 'createBy',
                width: 100,
                render: (value) => {
                    return <span title={value}>{value}</span>
                },
            }, {
                title: '创建时间',
                dataIndex: 'createStamp',
                key: 'createStamp',
                width: 100,
                render: (value) => {
                    return <span title={value}>{value}</span>
                },
            },
        ];

        const headerClasses = `layoutsToolLeft ${styles2.headerWithBgColor} ${styles2.basicPromotionHeader}`;

        return (
            <div className="layoutsContainer" ref={layoutsContainer => this.layoutsContainer = layoutsContainer}>
                <div className="layoutsTool" style={{ height: '64px' }}>
                    <div className={headerClasses}>
                        <span className={styles2.customHeader}>
                            合同管理
                        </span>
                        <p style={{ marginLeft: 'auto' }}>
                            {/* <Authority rightCode={GIFT_LIST_CREATE}> */}
                            <Button
                                type="ghost"
                                icon="plus"
                                className={styles2.jumpToCreateInfo}
                                style={{ margin: 5 }}
                                onClick={
                                    async () => {
                                        const res = await contractExport(queryParams)
                                        if (res.code === '000') {
                                            message.success('导出成功，请到导出历史进行下载')
                                        }
                                    }
                                }
                            >导出</Button>
                            <Button
                                type="ghost"
                                icon="plus"
                                className={styles2.jumpToCreateInfo}
                                style={{ margin: 5 }}
                                onClick={
                                    () => {
                                        this.setState({
                                            exportVisible: true,
                                        })
                                    }
                                }
                            >导出历史</Button>
                            <Button
                                type="primary"
                                icon="plus"
                                className={styles2.jumpToCreateInfo}
                                style={{ margin: 5 }}
                                onClick={
                                    () => {
                                        this.setState({
                                            createContractVisible: true,
                                        })
                                    }
                                }
                            >创建合同编号</Button>
                            {/* </Authority> */}
                        </p>
                    </div>
                </div>
                <div className={styles2.pageContentWrapper}>
                    <div>
                        <div style={{ padding: '0' }} className="layoutsHeader">
                            <div className="layoutsSearch">
                                <ul>
                                    <li className={styles.formWidth}>
                                        <BaseForm
                                            getForm={form => this.queryFroms = form}
                                            formItems={formItems}
                                            formKeys={formKeys}
                                            formData={queryParams}
                                            layout="inline"
                                        // onChange={(key, value) => this.handleFormChange(key, value)}
                                        />
                                    </li>
                                    <li>
                                        {/* <Authority rightCode={GIFT_LIST_QUERY}> */}
                                        <Button
                                            type="primary"
                                            onClick={() => this.queryTableData()}
                                        >
                                            <Icon type="search" />
                                            查询
                                        </Button>
                                        {/* </Authority> */}
                                    </li>
                                </ul>
                            </div>
                            <div style={{ margin: '0' }} className="layoutsLine"></div>
                        </div>
                        <div className={[styles.giftTable, styles2.tableClass, 'layoutsContent'].join(' ')}>
                            <Table
                                bordered={true}
                                columns={columns(this.handleDelete)}
                                dataSource={dataSource}
                                pagination={{
                                    showSizeChanger: true,
                                    pageSize,
                                    pageSizeOptions: ['25', '50', '100', '200'],
                                    current: pageNo,
                                    total,
                                    showQuickJumper: true,
                                    onChange: this.handlePageChange,
                                    onShowSizeChange: this.handlePageChange,
                                    showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
                                }}
                                loading={loading}
                                scroll={{ x: 1000, y: 'calc(100vh - 440px)' }}
                            />
                        </div>
                    </div>
                </div>
                {createContractVisible && <Modal title="创建合同编号" width={600} visible={createContractVisible} onOk={this.createContractOk} onCancel={this.closeModal}>

                    <Row>
                        <Col span={24} offset={1}>
                            <Form className={styles.crmSuccessModalContentBox}>
                                <FormItem
                                    label="合同名称"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                    required={true}
                                >

                                    {getFieldDecorator('contractName', {
                                        rules: [
                                            {
                                                required: true,
                                                // message: '请输入合同名称',
                                                validator: (rule, value, callback) => {
                                                    // 正则汉字
                                                    if (value && value.length > 20) {
                                                        return callback('最多输入20位')
                                                    }

                                                    if (!value) {
                                                        return callback('请输入合同名称');
                                                    }
                                                    return callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            placeholder="请输入合同名称"
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    label="合同编号"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                    required={true}
                                >

                                    {getFieldDecorator('contractCode', {
                                        rules: [
                                            { required: true,
                                                validator: (rule, value, callback) => {
                                                    // 正则汉字
                                                    // if (/[^\u00-\uFF]/.test(value)) {
                                                    //     return callback('请输入合同编号')
                                                    // }
                                                    if (value.length > 40) {
                                                        return callback('最多输入40位')
                                                    }

                                                    if (!value) {
                                                        return callback('请输入合同编号');
                                                    }
                                                    return callback();
                                                },

                                            },
                                        ],
                                    })(
                                        <Input
                                            placeholder="请输入合同编号"
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    label="合作渠道"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                    required={true}
                                >

                                    {getFieldDecorator('channelName', {
                                        rules: [
                                            {
                                                required: true,
                                                // message: '请输入合作渠道',
                                                validator: (rule, value, callback) => {
                                                    // 正则汉字
                                                    // if (/[^\u00-\uFF]/.test(value)) {
                                                    //     return callback('请输入合同编号')
                                                    // }
                                                    if (value && value.length > 20) {
                                                        return callback('最多输入20位')
                                                    }

                                                    if (!value) {
                                                        return callback('请输入合同编号');
                                                    }
                                                    return callback();
                                                },
                                            },
                                        ],
                                    })(
                                        <Input
                                            placeholder="请输入合作渠道"
                                        />
                                    )}
                                </FormItem>
                                <FormItem
                                    label="合同有效期"
                                    labelCol={{ span: 4 }}
                                    wrapperCol={{ span: 16 }}
                                    required={false}
                                >

                                    {getFieldDecorator('giftValidRange', {
                                        rules: [
                                            { required: false, message: '请输入合同有效期' },
                                        ],
                                    })(
                                        <RangePicker
                                            disabled={!!this.state.douyinGift}
                                            format="YYYY-MM-DD"
                                            showTime="HH:mm:ss"
                                        />
                                    )}
                                </FormItem>


                            </Form>
                        </Col>
                    </Row>
                </Modal>}


                {
                    exportVisible &&
                    <ExportModal
                        handleClose={() => this.setState({ exportVisible: false })}
                    />
                }
            </div>


        )
    }
}


export default Form.create({})(ContractPage)
