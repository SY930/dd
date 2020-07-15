import React, { PureComponent as Component } from 'react';
import { Modal, Steps, Button, message } from 'antd';
import { jumpPage, closePage } from '@hualala/platform-base';
import moment from 'moment';
import { getBrandList, putEvent, getEvent, postEvent } from './AxiosFactory';
// import Step1 from './Step1';
// import Step2 from './Step2';
// import Step3 from './Step3';
// import style from 'components/basic/ProgressBar/ProgressBar.less';
import css from './style.less';
// import { TF, DF, imgURI } from './Common';
// import { getTicketList } from '../Camp/TicketBag/AxiosFactory';

const Step = Steps.Step;
class BlindBox extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        current: 1,
        formData1: {},      // 第1步的表单原始数据，也是用来回显baseform的数据
        formData2: {},      // 第2步的表单原始数据
        formData3: {},      // 第3步的表单原始数据
        form: null,
        brandList: [],
        bagList: [],
    };
    componentDidMount() {
        
    }
    
    /** 得到form, 根据step不同，获得对应的form对象 */
    onSetForm = (form) => {
        this.setState({ form });
    }
    
    onToggle = () => {
        this.props.onToggle();
    }

    renderFooter(current) {
        const { view } = this.props;
        const btn0 = (<Button key="0" onClick={this.onToggle}>取消</Button>);
        const btn1 = (<Button key="1" type="primary" onClick={this.onGoPrev}>上一步</Button>);
        const btn2 = (<Button key="2" type="primary" onClick={this.onGoStep2}>下一步</Button>);
        const btn3 = (<Button key="3" type="primary" onClick={this.onGoStep3}>下一步</Button>);
        const btn4 = (<Button key="4" type="primary" onClick={this.onGoDone}>完成</Button>);
        const step1 = ([ btn0, btn2 ]);
        const step2 = ([ btn0, btn1, btn3 ]);
        let step3 = ([ btn0, btn1, btn4 ]);
        if(view) {
            step3 = ([ btn0, btn1 ]);   // 查看模式无完成功能
        }
        return { 1: step1, 2: step2, 3: step3 }[current];
    }
    render() {
        const { current, formData1, formData2, formData3, form } = this.state;
        const { brandList } = this.state;
        const footer = this.renderFooter(current);
        return (
            <Modal
                title="盲盒"
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={this.onToggle}
                footer={footer}
                width={1000}
            >
                <ul className={css.mainBox}>
                    <li className={css.left}>
                        <h3 className={css.logo}>盲盒</h3>
                        <p className={css.gray}>拆未知礼盒，增加猎奇趣味</p>
                    </li>
                    {/* <li className={css.right}>
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
                                brandList={brandList}
                            />
                        }
                        {current === 3 &&
                            <Step3
                                form={form}
                                getForm={this.onSetForm}
                                formData={formData3}
                            />
                        }
                    </li> */}
                </ul>
            </Modal>
        )
    }
}
export default BlindBox
