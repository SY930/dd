import React from 'react';
import { Steps, Button } from 'antd';
import styles from './index.less'
import {
    isProfessionalTheme,
} from '../../../../helpers/util'
import {connect} from 'react-redux';
const Step = Steps.Step;


class ActSteps extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    next(current) {
        const onNext = this.props.onNext;
        if (typeof onNext === 'function') {
            // use the lambda
            onNext(() => {
                this.setState({
                    current: (this.state.current + 1),
                }, () => {
                    if (this.props.callback && typeof this.props.callback === 'function') {
                        this.props.callback(this.state.current);
                    }
                });
            }, current);
        }
    }

    prev(current) {
        const onPrev = this.props.onPrev;
        if (typeof onPrev === 'function') {
            onPrev(() => {
                this.setState({
                    current: this.state.current - 1,
                }, () => {
                    if (this.props.callback && typeof this.props.callback === 'function') {
                        this.props.callback(this.state.current);
                    }
                });
            }, current);
        }
    }

    cancel(current) {
        const onCancel = this.props.onCancel;
        if (onCancel) {
            onCancel(() => {
                this.setState({
                    current: 0,
                }, () => {
                    if (this.props.callback && typeof this.props.callback === 'function') {
                        this.props.callback(0);
                    }
                });
            }, current);
        }
    }

    finish(current) {
        const onFinish = this.props.onFinish;
        if (typeof onFinish === 'function') {
            onFinish(() => {
                if (this.props.callback && typeof this.props.callback === 'function') {
                    this.props.callback(0);
                }
            }, current);
        }
    }

    render() {
        const steps = this.props.steps
        const current = this.state.current;
        if (!(steps instanceof Array && steps.length > 0)) {
            throw new Error('Steps should be an array with elments');
        }

        return (
            <div className={isProfessionalTheme() ? styles.ProgressBarPro : styles.ProgressBar}>
                <Steps current={current} className="clearfix">
                    {steps.map((item, i) => <Step key={i} title={item.title} />)}
                </Steps>
                {steps.map((step, index) => {
                        if (index === current) {
                            return (<div key={index} className="stepsContent">{steps[index].content}</div>);
                        }

                        return (<div key={index} className="stepsContent" style={{ display: 'none' }}>{steps[index].content}</div>);
                    })}


                <div className="progressButton">
                    {
                        this.state.current === steps.length - 1 &&
                        <Button
                            style={{ display: this.props.isUpdate ? 'inline-block' : 'none' }}
                            type="primary"
                            loading={this.props.loading}
                            disabled={this.props.loading}
                            onClick={() => {
                                this.finish(current);
                            }}
                        >
                            确定
                        </Button>
                    }

                    {
                        this.state.current > 0 && (
                            <Button
                                onClick={() => this.prev(current)}
                            >
                                 上一步
                            </Button>
                        )
                    }
                    {
                        this.state.current < steps.length - 1 &&
                        <Button
                            type="primary"
                            onClick={() => this.next(current)}
                            htmlType="submit"
                        > 下一步
                        </Button>
                    }
                    <Button
                        className="cancelBtnJs"
                        type="ghost"
                        onClick={() => this.cancel(current)}
                    >
                        取消
                    </Button>
                </div>
            </div>
        );
    }
}

export default ActSteps
