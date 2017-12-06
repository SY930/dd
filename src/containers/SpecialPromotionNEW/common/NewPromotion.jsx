/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-06T10:27:57+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: NewPromotion.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-08T12:39:07+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import { message } from 'antd';

export default class NewPromotion extends React.Component {
    constructor(props) {
        super(props);

        this.handles = []; // store the callback
        this.state = {
            loading: false,
        };

        this.onFinish = this.onFinish.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
    }

    // CustomProgressBar onFinish 事件回调，当表单校验无误会调用该事件
    onFinish(cb) {
        const { specialPromotion, user } = this.props;
        const opts = {
            event: {
                ...specialPromotion.$eventInfo,
                groupID: user.accountInfo.groupID,
                userID: user.accountInfo.accountID,
                loginName: user.accountInfo.loginName,
                userName: user.accountInfo.userName,
            },
            gifts: specialPromotion.$giftInfo,
        };
        if (this.props.isNew === false) {
            this.props.updateSpecialPromotion && this.props.updateSpecialPromotion({
                data: opts,
                success: () => {
                    message.success('活动更新成功');
                    this.setState({
                        loading: false,
                    });
                    cb();
                },
                fail: (info) => {
                    message.error(`活动更新失败, ${info}`);
                    this.setState({
                        loading: false,
                    });
                },
            });
        } else {
            // 创建特色营销活动
            this.props.addSpecialPromotion && this.props.addSpecialPromotion({
                data: opts,
                success: () => {
                    message.success('活动添加成功');
                    this.setState({
                        loading: false,
                    });
                    cb();
                },
                fail: (info) => {
                    message.error(`活动添加失败, ${info}`);
                    this.setState({
                        loading: false,
                    });
                },
            });
        }
    }


    handleNext(cb, index) {
        let flag = true;
        if (undefined !== this.handles[index].next && typeof this.handles[index].next === 'function') {
            flag = this.handles[index].next();
        }
        if (flag) {
            cb();
        }
    }

    handlePrev(cb, index) {
        // cb is CustomProgressBar's onPrev which is just modify the state of it.
        // do extra
        let flag = true;
        if (undefined !== this.handles[index].prev && typeof this.handles[index].prev === 'function') {
            flag = this.handles[index].prev();
        }
        if (flag) {
            cb();
        }
    }

    handleCancel(cb, index) {
        this.props.callbacktwo(3);
        // this.props.clear();
    }

    handleFinish(cb, index) {
        let flag = true;
        if (undefined !== this.handles[index].finish && typeof this.handles[index].finish === 'function') {
            flag = this.handles[index].finish();
        }
        if (flag) {
            this.setState({
                loading: true,
            });
            setTimeout(() => {
                this.onFinish(() => {
                    cb();
                    this.props.callbacktwo(3);
                });
            }, 0);
        }
    }
}
