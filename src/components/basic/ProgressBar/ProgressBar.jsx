/**
* @Author: Xiao Feng Wang  <Terrence>
* @Date:   2017-03-13T11:28:42+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: ProgressBar.jsx
* @Last modified by:   Terrence
* @Last modified time: 2017-03-14T15:16:00+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/


/*
 Created by Zbl on 2016/12/05.  新建活动时的步骤条组建
 参数：current 指定当前步骤，从 0 开始记数。在子 Step 元素中，可以通过 status 属性覆盖状态
 参数：status 指定当前步骤的状态，可选 wait process finish error
 参数：size 指定大小，目前支持普通（default）和迷你（small）
 参数：status  指定状态。当不配置该属性时，会使用 Steps 的 current 来自动指定状态。可选：wait process finish error
 参数：title  标题
 参数：description  步骤的详情描述，可选
 参数：icon  步骤图标的类型，可选
 */
import React, { Component } from 'react'
import { render } from 'react-dom'
// import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/components.less')
}
import styles from './ProgressBar.less';
import { Steps, Button, message } from 'antd';
import {
    saleCenterResetBasicInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionBasicInfo.action';
import {
    saleCenterResetScopeInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionScopeInfo.action';
import {
    saleCenterResetDetailInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const Step = Steps.Step;


class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    operations =(arg, current) => {
        const moveNext = () => {
            this.props.callback && this.props.callback(arg);
            this.setState({ current });
        }
        const onNextResult = this.props.onNext(arg);
        if (typeof onNextResult === 'function') {
            onNextResult(() => moveNext());
        } else if (onNextResult !== false) {
            moveNext();
        }
    }
    next(state) {
        const current = this.state.current + 1;
        // this.setState({ current });
        // const arg = [true,this.state.current+1,state];
        // 如果传进来是一个函数，则执行onNextResult，并且把函数传入里面
        // 如果传的值不是函数，就执行下一步操作
        const arg = [true, current, state];
        this.operations(arg, current);
        /* this.props.onCommit&&this.props.onCommit(); */
    }
    prev(state) {
        const current = this.state.current - 1;
        this.setState({ current });


        const arg = [true, current, state];
        this.operations(arg, current);
    }
    cancel(state) {
        if (state == 'cancel') {
            const arg = [false, this.state.current + 1, state];
            this.props.callback && this.props.callback(arg);
        } else {
            const arg = [false, this.state.current + 1, state];
            this.props.callback && this.props.callback(arg);
            this.props.onFinish && this.props.onFinish();
        }
        this.props.saleCenterResetBasicInfo();
        this.props.saleCenterResetScopeInfo();
        this.props.saleCenterResetDetailInfo();
    }

    finish() {

    }
    render() {
        let { steps } = this.props;
        if (!steps) {
            steps = [{
                title: '基本信息',
                content: '内容一区域',
            }, {
                title: '活动范围',
                content: '内容二区域',
            }, {
                title: '活动内容',
                content: '内容三区域',
            }];
        }
        const { current } = this.state;
        return (
            <div className={styles.ProgressBar}>
                <Steps current={current} className="clearfix">
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className="stepsContent">{steps[this.state.current].content}</div>
                <div className="progressButton">
                    <Button
                        type="ghost"
                        onClick={() => this.cancel('cancel')}
                    >取消
                    </Button>
                    {
                        this.state.current > 0 && <Button style={{ marginLeft: 8 }} type="primary" onClick={() => this.prev('prev')}> 上一步 </Button>
                    }
                    {
                        this.state.current < steps.length - 1 &&
                        <Button
                            style={{ marginLeft: 8 }}
                            type="primary"
                            // onClick={() => this.next('next')}
                            onClick={() => {
                                if (this.props.asyncNext) {
                                    this.props.asyncNext()
                                } else {
                                    this.next('next')
                                }
                            }}
                            htmlType="submit"
                        >下一步
                        </Button>
                    }
                    {
                        this.state.current === steps.length - 1 &&
                        <Button
                            style={{ marginLeft: 8 }}
                            type="primary"
                            onClick={() => {
                                this.cancel('finish');
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
        stepInfo: state.sale_steps.toJS(),
        fullCut: state.sale_fullCut_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        saleCenterResetBasicInfo: (opts) => {
            dispatch(saleCenterResetBasicInfoAC(opts))
        },
        saleCenterResetScopeInfo: (opts) => {
            dispatch(saleCenterResetScopeInfoAC(opts))
        },
        saleCenterResetDetailInfo: (opts) => {
            dispatch(saleCenterResetDetailInfoAC(opts))
        },
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps, null, {
        withRef: true,
    }
)(ProgressBar);
