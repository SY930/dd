import React, { PureComponent as Component } from 'react';
import { Modal, Steps, Button } from 'antd';
import { postStock } from './AxiosFactory';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import css from './style.less';

const Step = Steps.Step;
class Chou2Le extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        visible: true,
        current: 1,
        formData1: {},      // 第1步的表单原始数据
        formData2: {},      // 第2步的表单原始数据
        formData3: {},      // 第3步的表单原始数据
        form: null,
    };
    /** 得到form, 根据step不同，获得对应的form对象 */
    onSetForm = (form) => {
        this.setState({ form });
    }
    /* 1-2表单 */
    onGoStep2 = () => {
        const { form } = this.state;
        form.validateFields((e, v) => {
            if (!e) {
                console.log('v', v);
                this.setState({ formData1: v });
                this.onGoNext();
            }
        });
    }
    /* 2-3表单 */
    onGoStep3 = () => {
        const { form } = this.state;
        form.validateFields((e, v) => {
            if (!e) {
                console.log('v', v);
                this.setState({ formData2: v });
                this.onGoNext();
            }
        });
    }
    /* 3表单提交 */
    onGoDone = () => {
        const { form } = this.state;
        form.validateFields((e, v) => {
            if (!e) {
                console.log('v', v);
                this.setState({ formData3: v });
            }
        });
    }
    onChange = (key, value) => {

    }
    onToggle = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    onGoNext = () => {
        this.setState(ps => ({ current: ps.current + 1 }));
        this.onSetForm(null);
    }
    onGoPrev = () => {
        this.setState(ps => ({ current: ps.current - 1 }));
        this.onSetForm(null);
    }
    onGoDone = () => {

    }
    renderFooter(current) {
        const btn0 = (<Button key="0" onClick={this.onToggle}>取消</Button>);
        const btn1 = (<Button key="1" type="primary" onClick={this.onGoPrev}>上一步</Button>);
        const btn2 = (<Button key="2" type="primary" onClick={this.onGoStep2}>下一步</Button>);
        const btn3 = (<Button key="3" type="primary" onClick={this.onGoStep3}>下一步</Button>);
        const btn4 = (<Button key="4" type="primary" onClick={this.onGoDone}>完成</Button>);
        const step1 = ([ btn0, btn2 ]);
        const step2 = ([ btn0, btn1, btn2 ]);
        const step3 = ([ btn0, btn1, btn4 ]);
        return { 1: step1, 2: step2, 3: step3 }[current];
    }
    render() {
        const { current, visible, formData1, formData2, formData3, form } = this.state;
        const footer = this.renderFooter(current);
        return (
            <Modal
                title="新建下单抽抽乐"
                visible={visible}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={this.onToggle}
                footer={footer}
                width={1000}
            >
                <ul className={css.mainBox}>
                    <li className={css.left}>
                        <h3 className={css.logo}>下单抽抽乐</h3>
                        <p className={css.gray}>下单后抽取礼品，促进下次消费</p>
                        <dl className={css.desc}>
                            <dt>活动说明：</dt>
                            <dd>1. 同一活动时间，同一门店有多个下单抽抽乐活动，活动会执行哪个？</dd>
                            <dd className={css.gray}>优先执行顺序：执行场景为配置【适用业务】的活动>配置【活动时段】的活动>配置【活动周期】的活动>配置【活动日期】的活动。</dd>
                            <dd>2. 活动使用注意事项：如果奖品不希望被抽中，则可以设置中奖概率为0.如果用户一定要抽中任一产品，则可以设置奖品总计中奖概率为100%。</dd>
                        </dl>
                    </li>
                    <li className={css.right}>
                        <div className={css.stepBox}>
                            <Steps current={current-1} className={style.ProgressBar}>
                                <Step title="基本信息" />
                                <Step title="活动范围" />
                                <Step title="活动内容" />
                            </Steps>
                        </div>
                        {current === 1 &&
                            <Step1
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData1}
                            />
                        }
                        {current === 2 &&
                            <Step2
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData2}
                            />
                        }
                        {current === 3 &&
                            <Step3
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData3}
                            />
                        }
                    </li>
                </ul>
            </Modal>
        )
    }
}
export default Chou2Le
