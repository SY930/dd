import React, { Component } from 'react'
import { Form, Input, DatePicker, Select, Radio, Row, Col, Steps, Button } from 'antd'
import Step1 from './Step1'
import Step2 from './Step2'
import { SALE_CENTER_GIFT_EFFICT_TIME, SALE_CENTER_GIFT_EFFICT_DAY } from '../../../redux/actions/saleCenterNEW/types';

import styles from '../AlipayCoupon.less';

const { Step } = Steps;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
const { Option } = Select;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class PromotionModalContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            formData1: {}, // 第1步的表单原始数据
            formData2: {}, // 第2步的表单原始数据
            form: null,
        }
    }

    // 上一步
    onGoPrev = () => {
        const { current, form } = this.state;
        // const { formData1 } = this.state
        // 没保存就点上一步
        if (current === 2) {
            this.setState({
                // formData2: {...form.getFieldsValue(), defaultTpl: formData1.defaultTpl || 0},
            })
        }
        this.setState(ps => ({ current: ps.current - 1 }));
        // this.onSetForm(null);
    }

    onGoNext = () => {
        this.setState(ps => ({ current: ps.current + 1 }));
        this.onSetForm(null);
    }

    // 下一步
    onGoStep2 = () => {
        const { form } = this.state;
        // const { formData1: formData1Copy } = this.state;
        // console.log('formData1Copy: ', formData1Copy);
        // form.validateFields((e, v) => {
            // if (!e) {
                // const data = this.transformData1({ ...v });
                // const formData1 = { ...data, defaultTpl: formData1Copy.defaultTpl || 0 }
                // console.log('formData1: ', formData1);
                // this.setState({ formData1 }); //  保存第一步的数据
                this.onGoNext();
            // }
        // });
    }

    // 保存
    onGoDone = () => {
        // const { form, formData1 } = this.state;
        // form.validateFields((e, v) => {


        //     const data = {
        //         ...formData1,
        //         ...v,
        //     }
        //     this.onSubmit(data);

        // })
    }

    onToggle = () => {
        const { onCancel } = this.props;
        onCancel();
        // closePage()
    }

    onSetForm = (form) => {
        this.setState({ form });
    }

    renderFooter(current) {
        const btn0 = (<Button key="0" onClick={this.onToggle} className={styles.cancelBtn}>取消</Button>);
        const btn1 = (<Button key="1" type="primary" onClick={this.onGoPrev} className={styles.prevBtn}>上一步</Button>);
        const btn2 = (<Button key="2" type="primary" onClick={this.onGoStep2}>下一步</Button>);
        const btn3 = (<Button key="3" type="primary" onClick={this.onGoDone}>保存</Button>);
        const step1 = ([btn0, btn2]);
        const step2 = ([btn0, btn1, btn3]);
        return { 1: step1, 2: step2 }[current];
    }


    render() {
        const { current, formData1, formData2, form } = this.state;
        return (
            <Row className={styles.PromotionModalContentBox}>
                <Col span={24}>
                    <Steps current={current - 1} className={styles.ProgressBar}>
                        <Step title="活动内容" />
                        <Step title="活动报名" />
                    </Steps>
                </Col>
                <Col span={24}>
                    {
                        current === 1 &&
                        <Step1
                            getForm={this.onSetForm}
                            // formData={formData1}
                            // onGoStep2={this.onGoStep2}
                            // onToggle={this.onToggle}
                        />
                    }
                    {
                        current === 2 && <Step2
                            getForm={this.onSetForm}
                        // formData={formData1}
                        // onGoStep2={this.onGoStep2}
                        // onToggle={this.onToggle}
                        />
                    }
                </Col>
                <Col className={styles.promotionFooter}>
                    {this.renderFooter(current)}
                </Col>
            </Row>
        )
    }
}

export default Form.create()(PromotionModalContent)
