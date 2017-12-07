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
// if (process.env.__CLIENT__ === true) {
//     require('../../../components/common/components.less')
// }
import { connect } from 'react-redux';
import styles from '../../../components/basic/ProgressBar/ProgressBar.less';
import { Steps, Button } from 'antd';

const Step = Steps.Step;

class CustomProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            isUpdate: true,
        };
    }
    componentDidMount() {
        this.setState({
            loading: this.props.loading,
            isUpdate: this.props.myActivities.get('isUpdate'),
        })
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.loading !== nextProps.loading) {
            this.setState({
                loading: nextProps.loading,
            })
        }
        if (this.props.myActivities.get('isUpdate') != nextProps.myActivities.get('isUpdate')) {
            this.setState({ isUpdate: nextProps.myActivities.get('isUpdate') })
        }
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

    // this.state.current <div className={styles.stepsContent}>{steps[this.state.current].content}</div>
    render() {
        const { steps } = this.props;
        const current = this.state.current;

        if (!(steps instanceof Array && steps.length > 0)) {
            throw new Error('Steps should be an array with elments');
        }

        return (
            <div className={styles.ProgressBar}>
                <Steps current={current} className="clearfix">
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                {steps.map((step, index) => {
                    if (index === current) {
                        return (<div key={index} className="stepsContent">{steps[index].content}</div>);
                    }

                    return (<div key={index} className="stepsContent" style={{ display: 'none' }}>{steps[index].content}</div>);
                })}

                <div className="progressButton">
                    <Button
                        type="ghost"
                        onClick={() => this.cancel(current)}
                    >取消
                    </Button>
                    {
                        this.state.current > 0 && <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.prev(current)}> 上一步 </Button>
                    }
                    {
                        this.state.current < steps.length - 1 &&
                        <Button
                            style={{ marginLeft: 8 }}
                            type="primary"
                            onClick={() => this.next(current)}
                            htmlType="submit"
                        >下一步
                        </Button>
                    }
                    {
                        this.state.current === steps.length - 1 &&
                        <Button
                            style={{ marginLeft: 8, display: this.state.isUpdate ? 'inline-block' : 'none' }}
                            type="primary"
                            loading={this.state.loading}
                            disabled={this.state.loading}
                            onClick={() => {
                                this.finish(current);
                            }}
                        >
                            完成
                        </Button>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        myActivities: state.sale_myActivities_NEW,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomProgressBar);
