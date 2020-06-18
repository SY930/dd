/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-03-22T10:39:36+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: CustomProgressBar.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T10:12:38+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */


import React from 'react';
import { connect } from 'react-redux';
import styles from '../../../components/basic/ProgressBar/ProgressBar.less';
import { Steps, Button } from 'antd';
import {
    isProfessionalTheme,
} from '../../../helpers/util'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';

const Step = Steps.Step;

class CustomProgressBar extends React.Component {
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
                        this.props.callback(3);
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
                    this.props.callback(3);
                }
            }, current);
        }
    }

    render() {
        console.log('CustomProgreeBar........................')
        const { steps } = this.props;
        const current = this.state.current;
        if (!(steps instanceof Array && steps.length > 0)) {
            throw new Error('Steps should be an array with elments');
        }

        // return null;
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
                    <Button
                        className="cancelBtnJs"
                        type="ghost"
                        onClick={() => this.cancel(current)}
                    >
                        { COMMON_LABEL.cancel }
                    </Button>
                    {
                        this.state.current > 0 && (
                            <Button
                                type="primary"
                                onClick={() => this.prev(current)}
                            >
                                {SALE_LABEL.k5m6e6yf}
                            </Button>
                        )
                    }
                    {
                        this.state.current < steps.length - 1 &&
                        <Button
                            type="primary"
                            onClick={() => this.next(current)}
                            htmlType="submit"
                        >{SALE_LABEL.k5m6e76r}
                        </Button>
                    }
                    {
                        this.state.current === steps.length - 1 &&
                        <Button
                            type="primary"
                            loading={this.props.loading}
                            disabled={this.props.loading}
                            onClick={() => {
                                this.finish(current);
                            }}
                        >
                            {SALE_LABEL.k5nh20wl}
                        </Button>
                    }
                </div>
            </div>
        );
    }
}

export default CustomProgressBar;
