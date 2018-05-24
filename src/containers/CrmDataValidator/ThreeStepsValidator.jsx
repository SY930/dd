import React from 'react';
import moment from 'moment';
import styles from '../../components/basic/ProgressBar/ProgressBar.less';
import style from '../SaleCenterNEW/ActivityPage.less';
import ownStyle from './Validator.less';
import { connect } from 'react-redux';
import { Steps, Button, Form, Select, Upload, Icon, message, Col } from 'antd';
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
            fileList: []
        };
        this.intervalId = null;
        this.handleAdjustmentMethodChange = this.handleAdjustmentMethodChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.steps = null;
        this.importID = null;
    }

    componentDidMount() {
        this.intervalId = window.setInterval(() => {
            this.setState({
                isBusy: false
            })
        }, 500);
        this.importID = localStorage.getItem('_crm_import_id');
        if (this.importID) {
            this.setState({current: 1});
        }
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

    handleSubmit() {
        // 文件list为空
        if (this.state.fileList.length === 0) {
            message.warning('请至少上传一个excel文件');
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
            crmVersion: '21' // 会员系统版本: 10(老系统) 21(多卡类型会员系统)
        };
        /*axiosData('crmImport/crmImportService_doImport.ajax', reqParams, {}, undefined, 'HTTP_SERVICE_URL_SHOPCENTER')
            .then(res => {
                console.log(res);
            }, err => {
                console.log(err);
            });*/
        localStorage.setItem('_crm_import_id', importID);
        this.setState({current: 1});
    }

    generateImportID() {
        return `${this.props.user.accountInfo.groupID}_${this.state.fileList.length}_${Date.now()}`;
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
                                <p>{'数据校验无误'}</p>
                            </FormItem>
                        </Form>
                    </div>
                ),
            },
        ];
        return (
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
                    <Button
                        disabled={this.state.isBusyTime}
                        loading={this.state.isLoading}
                        type="primary"
                        onClick={this.handleSubmit}
                    >确定
                    </Button>
                </div>)}
            </div>
        );
    }
}

export default ThreeStepsValidator;
