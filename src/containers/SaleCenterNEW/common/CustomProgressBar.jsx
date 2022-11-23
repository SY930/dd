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
import { Steps, Button, Modal, Table, Tooltip } from 'antd';
import {
    isProfessionalTheme,
} from '../../../helpers/util'
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';

const Step = Steps.Step;

const columns = [{
    title: '券名称',
    dataIndex: 'giftName',
    key: 'giftName',
    className: 'TableTxtLeft',
}, {
    title: '张数',
    dataIndex: 'giftCount',
    key: 'giftCount',
    className: 'TableTxtCenter',
}];

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

    finish(current, flag) {
        const onFinish = this.props.onFinish;
        console.log("🚀 ~ file: CustomProgressBar.jsx ~ line 92 ~ CustomProgressBar ~ finish ~ onFinish", onFinish)
        if (typeof onFinish === 'function') {
            onFinish(() => {
                if (this.props.callback && typeof this.props.callback === 'function') {
                    this.props.callback(3);
                }
            }, current, flag);
        }
    }

    handleOk() {

    }

    renderTitle = () => {
        return (<div><img src="http://res.hualala.com/basicdoc/3810f656-bfaf-47a0-90c0-c7c75a2e4338.png" alt="" /></div>)
    }

    render() {
        const { steps,eventWay,isUpdate, upperLimitVisible, data, type } = this.props;
        const current = this.state.current;
        const flag = type === '53'; // 用来区分是否要请求礼品限制接口
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
                            style={{ display: this.props.isUpdate || !this.props.isUpdate && eventWay == '64' ? 'inline-block' : 'none' }}
                            type="primary"
                            loading={this.props.loading}
                            disabled={this.props.loading}
                            onClick={() => {
                                this.finish(current, flag);
                            }}
                        >
                            {SALE_LABEL.k5nh20wl}
                        </Button>
                    }
                    {
                        upperLimitVisible && <Modal
                            title={this.renderTitle()}
                            visible={true}
                            width="520px"
                            maskClosable={false}
                            closable={false}
                            wrapClassName={styles.upperLimitModal}
                            footer={[<Button type="gohost" onClick={this.props.onUpperLimitCancel}>返回修改</Button>,
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.finish(current, false)
                                    }}
                                >
                                    确认并继续</Button>]}
                        >
                            <div>系统检测到本次您要群发的优惠券数量已超1000W，为保证您的切身利益，请核对以下需要发券的数量/人群范围是否正确。</div>
                            <p>将赠送优惠券详情</p>
                            <p style={{ margin: '10px 0 14px' }}>
                                <b>人员总数：</b> <Tooltip className={styles.upperLimitTip} title={`${data.customerCount}人`}>{data.customerCount}人</Tooltip>
                                <b style={{ marginLeft: '100px' }}>赠送优惠券总计：</b> <Tooltip title={`${data.sendGiftCount}张`}>{data.sendGiftCount}张</Tooltip>
                            </p>
                            <p>
                                <span style={{ float: 'left' }}>礼品内容：</span>
                                <Table columns={columns} dataSource={data.gifts} pagination={false} bordered={true} />
                            </p>
                        </Modal>
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isUpdate: state.sale_myActivities_NEW.get('isUpdate'),
    }
};

const mapDispatchToProps = (dispatch) => {
    return {}
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomProgressBar);
