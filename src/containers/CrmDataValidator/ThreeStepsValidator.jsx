import React from 'react';
import moment from 'moment';
import styles from '../../components/basic/ProgressBar/ProgressBar.less';
import style from '../SaleCenterNEW/ActivityPage.less';
import ownStyle from './Validator.less';
import { connect } from 'react-redux';
import { Steps, Button, Form, Select, Upload, Icon, message, Col, Row, Modal, Tooltip, Spin } from 'antd';
import { axiosData } from '../../helpers/util';
const Option = Select.Option;
const OptGroup = Select.OptGroup;

const Step = Steps.Step;
const FormItem = Form.Item;

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
            isBusyTime: false, // 忙时不允许发起校验请求
            isLoading: false, // 校验请求loading
            adjustmentMethod: '1',
            fileList: [],
            isHistoryModalVisible: false,
            isHistoryLoading: false,
            historyList: [],
            validateStatus: 'success'
        };
        this.busyTime = [11, 12, 13, 18, 19, 20];
        this.busyTimeEndPoint = [14, 21];
        this.intervalId = null;
        this.handleAdjustmentMethodChange = this.handleAdjustmentMethodChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.steps = null;
        this.importInfoStr = null;
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
        const currentHour = moment().hours();
        if (this.busyTime.includes(currentHour)) {
            return true;
        } else if (this.busyTimeEndPoint.includes(currentHour)) {
            const minutes = moment().minutes();
            if (minutes === 0) {
                return true
            }
        }
        return false;
    }

    componentWillUnmount() {
        window.clearInterval(this.intervalId);
    }

    handleTypeChange(value) {
        this.setState({dataType: value});
    }

    handleAdjustmentMethodChange(value) {
        this.setState({adjustmentMethod: value});
    }

    queryValidationHistory() {
        let lastImportInfo;
        try {
            this.importInfoStr = localStorage.getItem('_crm_import_info');
            if (this.importInfoStr) {
                lastImportInfo = JSON.parse(this.importInfoStr);
                this.setState({current: 1});
            }
        } catch (e) {
            this.importInfoStr = null;
            lastImportInfo = null;
            this.setState({current: 0})
        }
        this.setState({isHistoryLoading: true});
        axiosData('crmimport/crmImportService_queryCrmImportList.ajax', {}, {}, {path: 'data.crmImportResultList'}, 'HTTP_SERVICE_URL_CRM')
            .then(res => {
                if (lastImportInfo) {
                    const {fileListLength, importID, dataType, adjustmentMethod} = lastImportInfo;
                    let isSuccess = true;
                    let validateStatus = 'success';
                    const resultCount = (res || []).reduce((accumulator, current) => {
                        if (current.importID === importID) {
                            accumulator++;
                            isSuccess = isSuccess && (current.result === 1 && !current.errorFilePath);
                        }
                        return accumulator;
                    }, 0);
                    if (resultCount === fileListLength && isSuccess) {
                        validateStatus = 'success';
                    } else if (resultCount === fileListLength && !isSuccess) {
                        validateStatus = 'error';
                    } else if (resultCount < fileListLength) {
                        validateStatus = null;
                    }

                    if (validateStatus) {
                        this.setState({current: 2, dataType, adjustmentMethod, validateStatus});
                    } else {
                        this.setState({current: 1});
                    }
                }
                this.setState({isHistoryLoading: false, historyList: res || []});
            }, err => {
                this.setState({isHistoryLoading: false});
                message.error('出错了, 请稍后或刷新重试');
                console.log(err);
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
        let fileLocationStr;
        try {
            const fileLocationUrlArr = fileList.map(file => file.response.data.url);
            if (fileLocationUrlArr.every(url => !!url)) {
                fileLocationStr = fileLocationUrlArr.join(',');
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
            sourceFilePath: fileLocationStr,
            importID,
            operator: this.props.user.accountInfo.userName,
            crmVersion: '21' // 会员系统版本: 10(老系统) 21(多卡类型会员系统)
        };
        axiosData('crmimport/crmImportService_doImportValidate.ajax', reqParams, {}, undefined, 'HTTP_SERVICE_URL_CRM')
            .then(res => {
                const crmImportInfo = {
                    importID,
                    groupID: this.props.user.accountInfo.groupID,
                    fileListLength: this.state.fileList.length,
                    dataType: this.state.dataType,
                    adjustmentMethod: this.state.adjustmentMethod
                };
                localStorage.setItem('_crm_import_info', JSON.stringify(crmImportInfo));
                this.setState({current: 1});
            }, err => {
                message.error(`未能成功发起校验请求, 错误原因: ${err}`);
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
                /*if (status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }*/
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
                    <div className="layoutsToolLeft">
                        <h1>会员数据变动校验</h1>
                    </div>
                    <div className="layoutsToolRight">

                        <Button onClick={() => this.setState({isHistoryModalVisible: true})}  type="ghost" style={{width: '120px'}} loading={this.state.isHistoryLoading}>
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
            visible={this.state.isHistoryModalVisible}
            maskClosable={false}
            onCancel={this.handleModalClose}
            footer={<Button onClick={this.handleModalClose}>关闭</Button>}
        >
            123123123123123123
        </Modal>);
    }

    handleReset() {
        localStorage.removeItem('_crm_import_info');
        this.setState({current: 0});
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
                                    <a href="http://res.tiaofangzi.com/group2/M01/58/FA/wKgVT1mjzfaZPYBaAAAwLLmM7jg77.xlsx"
                                       className={ownStyle.downloadLink}
                                       download="数据导入模板.xlsx">下载数据导入模板</a>
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
                        <div style={{width: '200px', margin: '0 auto', textAlign: 'center'}}>{`数据正在审核,请稍后查看`}</div>
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
                                label="集团名称"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                <p>{`${this.props.user.accountInfo.groupShortName}(ID: ${this.props.user.accountInfo.groupID})`}</p>
                            </FormItem>
                            <FormItem
                                label="校验状态"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                {this.state.validateStatus === 'success' ? <p>{'数据校验无误'} <Icon type="check-circle" style={{color: '#1ab495'}} /></p> : <p>{'数据校验有误'} <Icon style={{color: 'orange'}} type="check-circle" /></p>}
                            </FormItem>
                        </Form>
                    </div>
                ),
            },
        ];
        return (
        <Spin size="large" spinning={this.state.isHistoryLoading}>
            <div className={`${styles.ProgressBar} ${ownStyle.progressWrapper}`}>
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
                        onClick={this.handleSubmit}
                        >确定
                        </Button>)}
                        {this.state.isBusyTime && (
                        <Tooltip title="业务高峰期暂不允许发起校验请求, 请您谅解~">
                            <Button
                                disabled
                                type="primary"
                            >确定
                            </Button>
                        </Tooltip>)}
                </div>)}
                {this.state.current === 2 && (<div className="progressButton">
                    <Button

                        type="primary"
                        onClick={this.handleReset}
                    >我知道了
                    </Button>
                </div>)}
                {this.renderHistoryModal()}
            </div>
        </Spin>
        );
    }
}

export default ThreeStepsValidator;
