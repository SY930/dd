import React from 'react';
import styles from '../../components/basic/ProgressBar/ProgressBar.less';
import style from '../SaleCenterNEW/ActivityPage.less';
import ownStyle from './Validator.less';
import { connect } from 'react-redux';
import { Steps, Button, Form, Select } from 'antd';
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
            dataType: 1,
            adjustmentMethod: undefined
        };
        this.handleAdjustmentMethodChange = this.handleAdjustmentMethodChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.steps = null;
    }

    componentWillMount() {
    }

    handleTypeChange(value) {
        this.setState({dataType: value});
    }

    handleAdjustmentMethodChange(value) {
        this.setState({adjustmentMethod: value});
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
                                required={true}
                                wrapperCol={{ span: 13 }}
                                validateStatus={this.state.dataType > 0 ? 'success' : 'error'}
                                help={this.state.dataType > 0 ? null : '必须选择一个类型'}
                            >
                                <Select
                                    showSearch={false}
                                    placeholder="请选择变动类型"
                                    style={{ width: 200 }}
                                    value={this.state.dataType}
                                    onChange={this.handleTypeChange}
                                >
                                    <Option key="1" value={1}>会员数据导入</Option>
                                    <Option key="2" value={2}>卡类别调整</Option>
                                </Select>
                                {
                                    this.state.dataType === 2 ?

                                        (<FormItem
                                            className={style.FormItemStyle}
                                            validateStatus={this.state.adjustmentMethod > 0 ? 'success' : 'error'}
                                            help={this.state.adjustmentMethod > 0 ? null : '必须选择一个调整方式'}
                                            >
                                                <Select
                                                    showSearch={false}
                                                    placeholder="请选择调整方式"
                                                    style={{ width: 200 }}
                                                    value={this.state.adjustmentMethod}
                                                    onChange={this.handleAdjustmentMethodChange}

                                                >
                                                    <Option key="1" value={1}>根据等级调整</Option>
                                                    <Option key="2" value={2}>根据入会店铺调整</Option>
                                                    <Option key="3" value={3}>根据卡号调整</Option>
                                                </Select>
                                        </FormItem>
                                            )
                                        : null
                                }
                            </FormItem>
                            <FormItem
                                label="导入文件"
                                className={style.FormItemStyle}
                                labelCol={{ span: 11 }}
                                wrapperCol={{ span: 13 }}
                            >
                                <p>{`${this.props.user.accountInfo.groupShortName}(ID: ${this.props.user.accountInfo.groupID})`}</p>
                            </FormItem>
                        </Form>
                    </div>
                ),
            },
            {
                title: '审核进度',
                content: (
                    <div>{this.props.user.shopID}</div>
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
                        type="ghost"
                        onClick={() => console.log(this.props.user)}
                    >取消
                    </Button>
                </div>
            </div>
        );
    }
}

export default ThreeStepsValidator;
