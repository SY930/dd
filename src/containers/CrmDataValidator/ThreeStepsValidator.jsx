import React from 'react';
import moment from 'moment';
import styles from '../../components/basic/ProgressBar/ProgressBar.less';
import style from '../SaleCenterNEW/ActivityPage.less';
import ownStyle from './Validator.less';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import {
    Steps,
    Button,
    Form,
    Select,
    Upload,
    Icon,
    message,
    Col,
    Row,
    Modal,
    Tooltip,
    Spin,
    Table,
    Popconfirm,
    Checkbox,
} from 'antd';
import { axiosData } from '../../helpers/util';
const Option = Select.Option;

const Step = Steps.Step;
const FormItem = Form.Item;
const confirm = Modal.confirm;

const mapStateToProps = state => {
     return {
        user: state.user.toJS(),
    };
 };

@connect(mapStateToProps)
class ThreeStepsValidator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            dataType: '1',
            displayCurrentImportOnly: false,
            isBusyTime: false, // 忙时不允许发起校验请求
            isLoading: false, // 校验请求loading
            adjustmentMethod: '1',
            fileList: [],
            isHistoryModalVisible: false,
            isHistoryLoading: false,
            historyList: [],
            importID: '',
            validateStatus: 'success'
        };
        this.busyTime = [11, 12, 13, 18, 19, 20]; // 11, 12, 13, 18, 19, 20
        this.busyTimeEndPoint = [14, 21]; //14, 21
        this.intervalId = null;
        this.handleAdjustmentMethodChange = this.handleAdjustmentMethodChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.confirmClearAll = this.confirmClearAll.bind(this);
        this.confirmReset = this.confirmReset.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
        this.emptyValidationHistory = this.emptyValidationHistory.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.queryValidationHistory = this.queryValidationHistory.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.steps = null;
        this.importInfoStr = null;
        this.columns = [{
            title: '序号',
            dataIndex: 'indexNo',
            className: 'TableTxtCenter',
            width: 50,
            // fixed:'left',
            key: 'key',
        }, {
            title: '校验类型',
            dataIndex: 'importType',
            key: 'importType',
            className: 'TableTxtCenter',
            // fixed: 'left',
            width: 200,
            render: (type) => {
                if (type == 1) return '会员数据导入校验';
                if (type == 2) return '卡类别调整校验 (根据等级)';
                if (type == 3) return '卡类别调整校验 (根据入会店铺)';
                if (type == 4) return '卡类别调整校验 (根据卡号)';
                return '--'
            }
        },  {
            title: '校验日期',
            dataIndex: 'createStamp',
            key: 'createStamp',
            className: 'TableTxtCenter',
            // fixed: 'left',
            width: 200,
            render: (createStamp) => {
                if (createStamp) {
                    return <span title={moment(new Date(createStamp)).format('YYYY-MM-DD HH:mm:ss')}>{moment(new Date(createStamp)).format('YYYY-MM-DD HH:mm:ss')}</span>;
                }
                return '--'
            }
        }, {
            title: '校验ID',
            dataIndex: 'importID',
            key: 'importID',
            className: 'TableTxtCenter',
            // fixed: 'left',
            width: 150,
        }, {
            title: '校验发起人',
            dataIndex: 'operator',
            key: 'operator',
            className: 'TableTxtCenter',
            width: 100,
            render: (name) => name || '未知'
        }, {
            title: '校验结果',
            dataIndex: 'result',
            key: 'result',
            className: 'TableTxtCenter',
            width: 150,
            render: (result, entity) => {
                if (!result || result == '0') return '校验进行中';
                if (result == 2) return '校验失败';
                if (result == 1 && entity.errorFilePath) return '校验完成, 有错误';
                if (result == 1 && !entity.errorFilePath) return '校验成功';
            }
        }, {
            title: '原文件',
            dataIndex: 'sourceFilePath',
            key: 'sourceFilePath',
            className: 'TableTxtCenter',
            width: 100,
            render: (path) => <a href={path}>下载</a>
        },
        {
            title: '错误信息',
            dataIndex: 'errorFilePath',
            key: 'errorFilePath',
            className: 'TableTxtCenter',
            width: 150,
            render: (path) => path ? <a download target="_blank" href={path}>查看错误信息</a> : '无'
        },{
            title: '操作',
            dataIndex: 'itemID',
            key: 'itemID',
            className: 'TableTxtCenter',
            width: 150,
            render: (itemID) => (
                <Popconfirm title="确定要删除本条记录?" onConfirm={() => {
                    // 删除
                    this.emptyValidationHistory(itemID)
                }} okText="确定" cancelText="取消">
                    <a href="#" >删除本条记录</a>
                </Popconfirm>
            )
        },
        ]
    }

    componentDidMount() {
        this.intervalId = window.setInterval(() => {
            this.setState({
                isBusyTime: this.isBusyTime()
            })
        }, 500);
        this.queryValidationHistory()

    }

    isBusyTime() {
        if (HUALALA.ENVIRONMENT !== 'production-release') {
            return false;
        }
        const currentHour = moment().hours();
        if (this.busyTime.includes(currentHour)) {
            return true;
        } else if (this.busyTimeEndPoint.includes(currentHour) && moment().minutes() === 0) {
            return true
        }
        return false;
    }

    componentWillUnmount() {
        window.clearInterval(this.intervalId);
    }

    confirmClearAll() {
        confirm({
            title: '确定要清空所有校验记录吗 ?',
            content: '点击确定以继续',
            onOk: this.emptyValidationHistory,
            onCancel() {
            },
        });
    }

    confirmReset() {
        confirm({
            title: '确定要取消等待吗?',
            content: '取消等待不会取消本次的校验请求, 您依然可以从校验历史记录中查看到关于此次校验的详细信息',
            onOk: this.handleReset,
            onCancel() {
            },
        });
    }

    handleTypeChange(value) {
        this.setState({dataType: value});
    }

    handleAdjustmentMethodChange(value) {
        this.setState({adjustmentMethod: value});
    }

    queryValidationHistory() {
        this.setState({isHistoryLoading: true});
        let lastImportInfo;
        try {
            this.importInfoStr = localStorage.getItem('_crm_import_info');
            if (this.importInfoStr) {
                lastImportInfo = JSON.parse(this.importInfoStr);
                if (lastImportInfo.groupID !== this.props.user.accountInfo.groupID) {
                    throw new Error('different group');
                }
                this.setState({current: 1});
            } else {
                this.setState({current: 0});
            }

        } catch (e) {
            this.importInfoStr = null;
            lastImportInfo = null;
            this.setState({current: 0});
        }
        // auth code:  crm.dataverification.dv
        axiosData('crmimport/crmImportService_queryCrmImportList.ajax', {}, {}, {path: 'data.crmImportResultList'}, 'HTTP_SERVICE_URL_CRM')
            .then(res => {
                if (lastImportInfo) {
                    const {fileListLength, importID, dataType, adjustmentMethod} = lastImportInfo;
                    let isSuccess = true;
                    let isPending = false;
                    let validateStatus = 'success';
                    const resultCount = (res || []).reduce((accumulator, current) => {
                        if (String(current.importID) === String(importID)) {
                            accumulator++;
                            isSuccess = isSuccess && (current.result === 1 && !current.errorFilePath);
                            isPending = isPending || (!current.result || current.result == '0');
                        }
                        return accumulator;
                    }, 0);
                    if (resultCount === fileListLength && isSuccess) {
                        validateStatus = 'success';
                    } else if (resultCount === fileListLength && isPending) {
                        validateStatus = 'pending';
                    } else if (resultCount < fileListLength) {
                        validateStatus = 'pending';
                    } else if (resultCount === fileListLength && !isSuccess) {
                        validateStatus = 'error';
                    }
                    // console.log('validateStatus', validateStatus, 'resultCount', resultCount);
                    if (validateStatus !== 'pending') {
                        this.setState({current: 2, dataType, adjustmentMethod, validateStatus, importID});
                    } else {
                        this.setState({current: 1, dataType, adjustmentMethod, validateStatus, importID});
                    }
                }
                this.setState({isHistoryLoading: false, historyList: (res || []).map((item, index) => ({...item, indexNo: index+1})) || []});
            }, err => {
                this.setState({isHistoryLoading: false});
                message.error('出错了, 请稍后或刷新重试');
                // console.log(err);
            });
    }

    handleModalClose() {
        this.setState({isHistoryModalVisible: false})
    }

    handleSubmit() {
        // 文件list为空
        if (this.state.fileList.length === 0) {
            message.warning('请至少上传一个excel文件');
            return;
        }
        if (this.state.fileList.length > 99) {
            message.warning('一次最多可验证99个文件');
            return;
        }
        const fileList = this.state.fileList;
        const isUploadingFinished = fileList.every(file => file.status === 'done');
        if (!isUploadingFinished) {
            message.warning('还有文件正在上传中');
            return;
        }
        let fileLocationStrArray;
        try {
            const fileLocationUrlArr = fileList.map(file => file.response.data.url);
            if (fileLocationUrlArr.every(url => !!url)) {
                fileLocationStrArray = fileLocationUrlArr.map(url => `http://res.hualala.com/${url}`);
            } else {
                message.warning('有部分文件未能上传成功,请重新上传或刷新重试');
                return;
            }
        } catch (e) {
            message.warning('有部分文件未能上传成功,请重新上传或刷新重试');
            return;
        }
        const importID = this.generateImportID();
        const reqParams = {
            groupID: this.props.user.accountInfo.groupID,
            groupName: this.props.user.accountInfo.groupName,
            sourceFilePaths: fileLocationStrArray,
            importID,
            importType: this.state.dataType == '1' ? '1' : String(Number(this.state.adjustmentMethod) + 1),
            operator: this.props.user.accountInfo.userName,
            crmVersion: '21' // 会员系统版本: 10(老系统) 21(多卡类型会员系统)
        };
        let url;
        if (this.state.dataType == '1') {
            url = 'crmimport/crmImportService_doImportValidate.ajax';
        } else {
            url = 'crmimport/cardTypeValidateService_validateCardType.ajax';
        }
        axiosData(url, reqParams, {}, undefined, 'HTTP_SERVICE_URL_CRM')
            .then(res => {
                const crmImportInfo = {
                    importID,
                    groupID: this.props.user.accountInfo.groupID,
                    fileListLength: this.state.fileList.length,
                    dataType: this.state.dataType,
                    adjustmentMethod: this.state.adjustmentMethod
                };
                localStorage.setItem('_crm_import_info', JSON.stringify(crmImportInfo));
                this.setState({current: 1, importID}/*, () => {
                    setTimeout(() => {
                        this.queryValidationHistory();
                    }, 1500)
                }*/);
            }, err => {
                console.log(err);
            });

    }

    emptyValidationHistory(itemID) {
        // 清空历史
        const reqParams = itemID ? {} : {itemID};
        return axiosData('crmimport/crmImportService_delCrmImportHistory.ajax', reqParams, {needThrow: true}, undefined, 'HTTP_SERVICE_URL_CRM')
            .then(res => {
                this.queryValidationHistory();
                message.success(itemID ? `删除成功` : `校验记录已清除`);
            }, err => {
                message.error(itemID ? `删除失败: ${err}` : `清空失败: ${err}`);
            });
    }

    generateImportID() {
        return `${Date.now()}`;
    }

    renderUploadButton() {
        const props = {
            name: 'file',
            accept: '.xls,.xlsx', // 上传的是excel 文件
            action: '/api/shopcenter/upload',
            onChange: (info) => {
                const status = info.file.status;
                let fileList = info.fileList;
                fileList = fileList.filter((file) => {
                    if (file.response) {
                        return file.response.status !== 'error';
                    }
                    if (status) {
                        return status !== 'error'
                    }
                    return true;
                });
                this.setState({ fileList });
            },
        };
        return (
            <Upload {...props} fileList={this.state.fileList}>
                <Button style={{width: '185px', textAlign: 'left', paddingLeft: '7px'}}>
                    上传Excel附件
                </Button>
            </Upload>
        )
    }

    render() {
        return (<Row className="layoutsContainer">
            <Col span={24} className="layoutsHeader">
                <div className="layoutsTool">
                    <div className={`layoutsToolLeft ${ownStyle.flexContainer}`}>
                        <h1>会员数据变动校验</h1>
                        <div className={`${ownStyle.flexContainer} ${ownStyle.customTip}`}>
                            <span style={{color: 'orange', lineHeight: '16px', fontSize: '16px', paddingBottom: '3px'}}>&nbsp;&nbsp;&nbsp;&nbsp;不可校验时段: 11:00 - 14:00, 18:00 - 21: 00</span>
                        </div>
                    </div>
                    <div className="layoutsToolRight">

                        <Button onClick={() => this.setState({isHistoryModalVisible: true})}  type="ghost" style={{width: '120px'}}>
                            校验记录
                        </Button>
                    </div>
                </div>
            </Col>
            <Col span={24} className="layoutsLineBlock"></Col>
            <Col span={24} className="layoutsContent">
                {this.renderValidator()}
            </Col>
        </Row>);
    }

    renderHistoryModal() {
        return (<Modal
            // key={modalKey}
            title={`校验记录`}
            width="1450px"
            bodyStyle={{height: '800px'}}
            visible={this.state.isHistoryModalVisible}
            maskClosable={false}
            onCancel={this.handleModalClose}
            footer={
                <div>
                    <Button type="ghost" onClick={this.handleModalClose}>关闭</Button>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button
                        type="ghost"
                        icon="reload"
                        onClick={this.queryValidationHistory}
                    >刷新
                    </Button>
                </div>
            }
        >
            {this.renderHistoryTable()}
        </Modal>);
    }

    handleCheckBoxChange(e) {
        this.setState({displayCurrentImportOnly: e.target.checked});
    }

    renderHistoryTable() {
        let filteredList = this.state.historyList;
        if (this.state.importID && this.state.displayCurrentImportOnly) {
            filteredList = filteredList.filter(record => this.state.importID === record.importID)
        }
        return (
            <Table
                bordered={true}
                title={() => (
                    <div style={{fontSize: '16px'}}>
                        {`${this.props.user.accountInfo.groupShortName} (ID: ${this.props.user.accountInfo.groupID}) 会员数据变动校验记录  `}
                        <Tooltip title={<div style={{width: '250px'}}>一次校验请求如果包含多个文件, 则会在历史记录中记录多条, 这些条目由校验ID关联; 单条记录只表示单个文件的验证情况</div>}>
                            <Icon
                                style={{fontSize: '14px'}}
                                type="info-circle"
                            />
                        </Tooltip>
                        {<Checkbox
                            style={{marginLeft: '16px'}}
                            checked={this.state.displayCurrentImportOnly}
                            onChange={this.handleCheckBoxChange}
                        >只看本次校验记录</Checkbox>}
                        <Button
                            style={{position: 'absolute', right: '8px'}}
                            type="ghost"
                            icon="delete"
                            onClick={this.emptyValidationHistory}
                        >清空历史
                        </Button>
                    </div>
                )}
                columns={this.columns.map(c => (c.render ? ({
                    ...c,
                    render: c.render.bind(this),
                }) : c))}
                dataSource={filteredList}
                pagination={{
                    showSizeChanger: true,
                    total: filteredList.length,
                    showQuickJumper: true,
                    showTotal: (total, range) => `本页${range[0]}-${range[1]}/ 共 ${total}条`,
                }}
                loading={this.state.isHistoryLoading}
                scroll={{x: 1000, y: 320 }}
            />
        );
    }

    handleReset() {
        localStorage.removeItem('_crm_import_info');
        this.setState({current: 0, fileList: []});
    }

    renderValidator() {
        const steps = [
            {
                title: '变动类型',
                content: (
                    <div>
                        <Form className={style.FormStyle}>
                            <FormItem
                                label="集团名称"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                <p>{`${this.props.user.accountInfo.groupShortName}(ID: ${this.props.user.accountInfo.groupID})`}</p>
                            </FormItem>
                            <FormItem
                                label="变动类型"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                                validateStatus={this.state.dataType > 0 ? 'success' : 'error'}
                                help={this.state.dataType > 0 ? null : '必须选择一个类型'}
                            >
                                <Select
                                    showSearch={false}
                                    placeholder="请选择变动类型"
                                    style={{ width: 185 }}
                                    value={this.state.dataType}
                                    onChange={this.handleTypeChange}
                                >
                                    <Option key="1" value={'1'}>会员数据导入</Option>
                                    <Option key="2" value={'2'}>卡类别调整</Option>
                                </Select>
                                {
                                    this.state.dataType === '2' ?

                                        <Select
                                            showSearch={false}
                                            placeholder="请选择调整方式"
                                            style={{ width: 185 }}
                                            value={this.state.adjustmentMethod}
                                            onChange={this.handleAdjustmentMethodChange}
                                        >
                                            <Option key="1" value={'1'}>根据等级调整</Option>
                                            <Option key="2" value={'2'}>根据入会店铺调整</Option>
                                            <Option key="3" value={'3'}>根据卡号调整</Option>
                                        </Select>
                                        : null
                                }
                            </FormItem>
                            <FormItem
                                label="导入文件"
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                <div className={ownStyle.flexContainer}>
                                    <div className={ownStyle.uploaderContainer}>
                                        {this.renderUploadButton()}
                                    </div>
                                    {this.state.dataType === '1' &&<a target="_blank" href="http://res.tiaofangzi.com/group2/M01/58/FA/wKgVT1mjzfaZPYBaAAAwLLmM7jg77.xlsx"
                                       className={ownStyle.downloadLink}
                                       download="数据导入模板.xlsx">下载数据导入模板</a>}
                                   {this.state.dataType === '2' &&<a target="_blank" href="http://res.hualala.com/group3/M02/14/E0/wKgVwlsWCpHqGJf8AAAvndWAF_o23.xlsx "
                                       className={ownStyle.downloadLink}
                                       download="下载卡类别变更模板.xlsx">下载卡类别变更模板</a>}
                                   &nbsp;&nbsp;
                                    <p>
                                    <Tooltip title={<div style={{width: '250px'}}>请不要随意变动模板结构（例如删除列/sheet，调整列/sheet顺序等），否则会导致验证失败</div>}>
                                        <Icon style={{fontSize: '14px'}} type="info-circle" />
                                    </Tooltip>
                                    </p>
                                </div>


                            </FormItem>
                        </Form>
                    </div>
                ),
            },
            {
                title: '审核进度',
                content: (
                    <div className="layoutsContent">
                        <div style={{width: '500px', fontSize: '16px', margin: '50px auto', textAlign: 'center'}}>
                            {`数据正在审核,请稍后查看`}
                            <br/>
                            { this.state.importID !== '' && (
                                <span>
                                    {`您此次的校验请求ID为:  ${this.state.importID}  `}
                                    <Tooltip title={<div style={{width: '250px'}}>根据此ID可在校验记录中查看详细的校验情况&nbsp;&nbsp;</div>}><Icon type="info-circle" /></Tooltip>
                                </span>)
                            }
                        </div>
                    </div>
                ),
            },
            {
                title: '校验状态',
                content: (
                    <div>
                        <Form className={style.FormStyle}>
                            <FormItem
                                label="集团名称"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                <p>{`${this.props.user.accountInfo.groupShortName}(ID: ${this.props.user.accountInfo.groupID})`}</p>
                            </FormItem>
                            <FormItem
                                label="变动类型"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                {this.state.dataType === '1' && <p>{`会员数据导入`}</p>}
                                {this.state.dataType === '2' && this.state.adjustmentMethod === '1' && <p>{`卡类别调整 (根据等级调整)`}</p>}
                                {this.state.dataType === '2' && this.state.adjustmentMethod === '2' && <p>{`卡类别调整 (根据入会店铺调整)`}</p>}
                                {this.state.dataType === '2' && this.state.adjustmentMethod === '3' && <p>{`卡类别调整 (根据卡号调整)`}</p>}
                            </FormItem>
                            {this.state.importID && <FormItem
                                label="校验ID"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                <p>{this.state.importID}</p>
                            </FormItem>}
                            <FormItem
                                label="校验状态"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                {this.state.validateStatus === 'success' ? <p>{'数据校验无误'} <Icon type="check-circle" style={{color: '#1ab495'}} /></p> : <p>{'数据校验有误'} <Icon style={{color: 'orange'}} type="close-circle" /></p>}
                                &nbsp;&nbsp;<a onClick={e => {e.preventDefault();this.setState({isHistoryModalVisible: true})}}>查看校验记录</a>
                            </FormItem>
                        </Form>
                    </div>
                ),
            },
        ];
        return (

            <div className={`${styles.ProgressBar} ${ownStyle.progressWrapper}`}>
                <Spin size="large" spinning={this.state.isHistoryLoading}>
                <Steps current={this.state.current} className="clearfix">
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                {steps.map((step, index) => {
                    if (index === this.state.current) {
                        return (<div key={index} className="stepsContent">{steps[index].content}</div>);
                    }

                    return (<div key={index} className="stepsContent" style={{ display: 'none' }}>{steps[index].content}</div>);
                })}

                {this.state.current === 0 && (<div className="progressButton">
                        {!this.state.isBusyTime && (<Button
                        loading={this.state.isLoading}
                        type="primary"
                        onClick={this.handleSubmit} //
                        >确定
                        </Button>)}
                        {this.state.isBusyTime && (
                        <Tooltip title="业务高峰期暂不允许发起校验请求, 请您谅解~">
                            <Button
                                disabled
                                type="secondary"
                            >确定
                            </Button>
                        </Tooltip>)}
                </div>)}
                {this.state.current === 1 && (<div className="progressButton">
                    <Button
                        type="ghost"
                        onClick={this.handleReset}
                    >取消等待
                    </Button>
                    <Button
                        style={{marginLeft: '16px'}}
                        type="primary"
                        icon="reload"
                        onClick={this.queryValidationHistory}
                    >刷新
                    </Button>
                </div>)}
                {this.state.current === 2 && (<div className="progressButton">
                    <Button

                        type="primary"
                        onClick={this.handleReset}
                    >我知道了
                    </Button>
                </div>)}
                {this.renderHistoryModal()}
                </Spin>
            </div>

        );
    }
}

export default ThreeStepsValidator;
