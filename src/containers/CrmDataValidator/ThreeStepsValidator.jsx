import React from 'react';
import moment from 'moment';
import styles from '../../components/basic/ProgressBar/ProgressBar.less';
import style from '../SaleCenterNEW/ActivityPage.less';
import ownStyle from './Validator.less';
import { connect } from 'react-redux';
import { Steps, Button, Form, Select, Upload, Icon, message, Col } from 'antd';
import ENV from "../../helpers/env";
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
            adjustmentMethod: '1'
        };
        this.intervalId = null;
        this.handleAdjustmentMethodChange = this.handleAdjustmentMethodChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.steps = null;
    }

    componentDidMount() {
        /*this.intervalId = window.setInterval(() => {
            this.setState({
                isBusy: moment().seconds()%2 === 0
            })
        }, 500)*/
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

    renderUploadButton() {
        const props = {
            name: 'file',
            accept: '.xls,.xlsx', // 上传的是excel 文件
            action: '/api/shopcenter/upload',
            onChange: (info) => {
                console.log('new info', info);
                const status = info.file.status;
                const fileList = info.fileList;
                /*this.setState({
                    giftImagePath,
                })
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }*/

                if (status === 'done') {
                    message.success(`${info.file.name} 上传成功`);
                    this.setState({
                        imageUrl: `${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`,
                    })
                } else if (status === 'error') {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        return (
            <Upload {...props}>
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
                    <div>{`数据正在审核,请稍后查看`}</div>
                ),
            },
            {
                title: '校验状态',
                content: (
                    <div>{this.props.user.shopID}</div>
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

                <div className="progressButton">
                    <Button
                        disabled={this.state.isBusyTime}
                        loading={this.state.isLoading}
                        type="primary"
                        onClick={() => console.log(moment().hours())}
                    >确定
                    </Button>
                </div>
            </div>
        );
    }
}

export default ThreeStepsValidator;
