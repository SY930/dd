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
import { jumpPage } from '@hualala/platform-base'

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
        const smsGate = specialPromotion.$eventInfo.smsGate;
        if (specialPromotion.$eventInfo.eventWay == '50'
            || (smsGate == '1' || smsGate == '3' || smsGate == '4')) {
            if (specialPromotion.$eventInfo.accountNo > 0) { // 权益账户的情况
                const equityAccountInfoList = specialPromotion.$eventInfo.equityAccountInfoList;
                const selectedAccount = equityAccountInfoList.find(entity => entity.accountNo === specialPromotion.$eventInfo.accountNo) || {};
                if (!selectedAccount.smsCount) {
                    message.warning('所选权益账户可用短信条数为0，无法创建活动');
                    this.setState({
                        loading: false,
                    });
                    return;
                }
            } else { // 结算账户的情况
                const settleUnitID = specialPromotion.$eventInfo.settleUnitID;
                if (settleUnitID > 0) {
                    const selectedEntity =  (specialPromotion.$eventInfo.accountInfoList || []).find(entity => entity.settleUnitID === settleUnitID) || {};
                    if (!selectedEntity.smsCount) {
                        message.warning('所选结算账户可用短信条数为0，无法创建活动');
                        this.setState({
                            loading: false,
                        });
                        return;
                    }
                }
            }
            if (!(specialPromotion.$eventInfo.accountNo > 0) && !(specialPromotion.$eventInfo.settleUnitID > 0)) {
                this.setState({
                    loading: false,
                });
                return message.warning('权益账户不得为空');
            }
        }
        const opts = {
            event: {
                ...specialPromotion.$eventInfo,
                groupID: user.accountInfo.groupID,
                userID: user.accountInfo.accountID,
                loginName: user.accountInfo.loginName,
                userName: user.accountInfo.userName,
            },
            gifts: specialPromotion.$giftInfo,
            eventRecommendSettings: specialPromotion.$eventRecommendSettings,
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
                    const menuID = this.props.user.menuList.find(tab => tab.entryCode === '1000076003').menuID
                    jumpPage({ menuID })
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
        // console.log('going to 1 finish');
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
