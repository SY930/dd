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
import { injectIntl } from 'i18n/common/injectDecorator'
import { COMMON_SPE } from 'i18n/common/special';
import { createMemberGroupNew } from '../sendGifts/stepThreeHelp'

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
   async onFinish(cb) {
        const { specialPromotion, user } = this.props;
        const smsGate = specialPromotion.$eventInfo.smsGate;
        if (specialPromotion.$eventInfo.eventWay == '50'
            || (smsGate == '1' || smsGate == '3' || smsGate == '4')) {
            if (specialPromotion.$eventInfo.accountNo > 0) { // 权益账户的情况
                const equityAccountInfoList = specialPromotion.$eventInfo.equityAccountInfoList;
                const selectedAccount = equityAccountInfoList.find(entity => entity.accountNo === specialPromotion.$eventInfo.accountNo) || {};
                if (!selectedAccount.smsCount) {
                    message.warning(COMMON_SPE.dk460fga2j279);
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
                        message.warning(COMMON_SPE.d4h17ei7f3g366);
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
                return message.warning(COMMON_SPE.dd5a476c91d4150);
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
            jumpUrlInfos: specialPromotion.$eventInfo.jumpUrlInfos,
            gifts: specialPromotion.$giftInfo,
            recommendEventRuleInfos: specialPromotion.$eventRecommendSettings,
        };
        
        // 生日赠送 且 非会员群体时
        if(this.props.promotionType === '51' && specialPromotion.$eventInfo.cardLevelRangeType != 5){
            delete opts.event.cardGroupID
        }

        if(this.props.promotionType === '68') {
            // 新增活动规则字段
            const recommendRule = opts.event.recommendRule
            opts.event.recommendRulelst = typeof recommendRule === 'number' ? recommendRule  : recommendRule.join(',')
            opts.event.recommendRule  =  ''
        }
          // 从RFM群发礼品、消费返礼品、唤醒送礼的时候，需要先创建会员群体
          const {$eventInfo,RFMParams} = specialPromotion
          console.log("🚀 ~ file: NewPromotion.jsx ~ line 98 ~ NewPromotion ~ onFinish ~ this.props.promotionType", this.props.promotionType, RFMParams)
          if((['53', '62', '63'].includes(this.props.promotionType)) && RFMParams) {
          await  createMemberGroupNew.call(this,{
                RFMParams
            }).then(res => {
                const {
                    groupMembersID,
                    groupMembersName,
                    groupMembersCount,
                    // groupMembersRemark,
                } = res;
                opts.event = {
                   ...opts.event,
                   cardGroupID: groupMembersID,
                   cardGroupName: groupMembersName,
                   cardCount: groupMembersCount,
                //    cardGroupRemark: groupMembersRemark,
                }


            })

          }
        if (this.props.isNew === false && !this.props.isCopy) {
            this.props.updateSpecialPromotion && this.props.updateSpecialPromotion({
                data: opts,
                success: () => {
                    message.success(COMMON_SPE.d4h17ei7f3g518);
                    this.setState({
                        loading: false,
                    });
                    cb();
                },
                fail: (info) => {
                message.error(<span>{COMMON_SPE.d2c8akfh2o6216} {info}</span>);
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
                    message.success(COMMON_SPE.d34idrcqen7223);
                    this.setState({
                        loading: false,
                    });
                    cb();
                    const menuID = this.props.user.menuList.find(tab => tab.entryCode === '1000076003').menuID
                    jumpPage({ menuID })
                },
                fail: (info) => {
                    message.error(<span>{COMMON_SPE.de8fem99k0868} {info}</span>);
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
