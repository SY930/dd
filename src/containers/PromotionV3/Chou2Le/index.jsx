import React, { PureComponent as Component } from 'react';
import { Modal, Steps, Button } from 'antd';
import { stockItems } from './Common';
import { postStock } from './AxiosFactory';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import style from 'components/basic/ProgressBar/ProgressBar.less';
import css from './style.less';
const Step = Steps.Step;
class StockModal extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        visible: false,
        current: 1,
    };

    /* 表单提交 */
    onOk = () => {

    }
    onChange = (key, value) => {

    }
    onToggle = () => {
        this.setState(ps => ({ visible: !ps.visible }));
    }
    onGoNext = () => {
        this.setState(ps => ({ current: ps.current + 1 }));
    }
    onGoPrev = () => {
        this.setState(ps => ({ current: ps.current - 1 }));
    }
    onGoDone = () => {

    }
    renderFooter(current) {
        const btn0 = (<Button key="0" onClick={this.onToggle}>取消</Button>);
        const btn1 = (<Button key="1" onClick={this.onGoPrev}>上一步</Button>);
        const btn2 = (<Button key="2" onClick={this.onGoNext}>下一步</Button>);
        const btn3 = (<Button key="3" onClick={this.onGoDone}>完成</Button>);
        const step1 = ([ btn0, btn2 ]);
        const step2 = ([ btn0, btn1, btn2 ]);
        const step3 = ([ btn0, btn1, btn3 ]);
        return { 1: step1, 2: step2, 3: step3 }[current];
    }
    render() {
        const { current } = this.state;
        const footer = this.renderFooter(current);
        return (
            <Modal
                title="新建下单抽抽乐"
                visible={true}
                maskClosable={false}
                onOk={this.onOk}
                onCancel={this.onToggle}
                footer={footer}
            >
                <div>
                    <Steps current={current-1} className={style.ProgressBar}>
                        <Step title="基本信息" />
                        <Step title="活动范围" />
                        <Step title="活动内容" />
                    </Steps>
                    {current === 1 &&
                        <Step1

                        />
                    }
                    {current === 2 &&
                        <Step2

                        />
                    }
                    {current === 3 &&
                        <Step3

                        />
                    }
                </div>
            </Modal>
        )
    }
}
export default StockModal
