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
import { jumpPage, closePage, axios } from '@hualala/platform-base'
import { injectIntl } from 'i18n/common/injectDecorator'
import { COMMON_SPE } from 'i18n/common/special';
import { createMemberGroupNew } from '../sendGifts/stepThreeHelp'

import { createMemberGroup } from '../sendGifts/stepThreeHelp'
import { connect } from 'react-redux';
export default class NewPromotion extends React.Component {
    constructor(props) {
        super(props);

        this.handles = []; // store the callback
        this.state = {
            loading: false,
            upperLimitVisible: false,
            data: [],
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.onUpperLimitCancel = this.onUpperLimitCancel.bind(this)
    }


    // CustomProgressBar onFinish 事件回调，当表单校验无误会调用该事件
    async onFinish(cb, flag) {
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
                    const selectedEntity = (specialPromotion.$eventInfo.accountInfoList || []).find(entity => entity.settleUnitID === settleUnitID) || {};
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
        let giftData
        if(specialPromotion.isBenefitJumpOpenCard || specialPromotion.isBenefitJumpSendGift) {
            giftData = specialPromotion.$giftInfo.map((item) => {
                delete item.cardTypeID
                return item
            })
        } else {
            giftData =  specialPromotion.$giftInfo
        }
        if (this.props.promotionType === '60' || this.props.promotionType === '61' || this.props.promotionType === '53') {
            giftData.map((item,index) => {
                if(item.presentType == '1' && !item.giftID){
                    giftData.splice(index,1)
                }
            })
        }
        const opts = {
            event: {
                ...specialPromotion.$eventInfo,
                groupID: user.accountInfo.groupID,
                userID: user.accountInfo.accountID,
                loginName: user.accountInfo.loginName,
                userName: user.accountInfo.userName,
                createScenes: (specialPromotion.isBenefitJumpOpenCard || specialPromotion.isBenefitJumpSendGift) ? '1' : '0',
            },
            jumpUrlInfos: specialPromotion.$eventInfo.jumpUrlInfos,
            gifts: giftData,
            eventMutexDependRuleInfos: specialPromotion.$eventInfo.eventMutexDependRuleInfos,
            recommendEventRuleInfos: specialPromotion.$eventRecommendSettings,
        };
        // 生日赠送 且 非会员群体时
        if (this.props.promotionType === '51' && specialPromotion.$eventInfo.cardLevelRangeType != 5) {
            delete opts.event.cardGroupID
        }

        if (this.props.promotionType === '68') {
            // 新增活动规则字段
            const recommendRule = opts.event.recommendRule
            opts.event.recommendRulelst = typeof recommendRule === 'number' ? recommendRule : recommendRule.join(',')
            opts.event.recommendRule = ''
        }
        // 从RFM群发礼品、消费返礼品、唤醒送礼的时候，不需要先创建会员群体，因为跳转营销时已经创建过了
        const { RFMParams } = specialPromotion
        if ((['53', '62', '63'].includes(this.props.promotionType)) && RFMParams) {
            opts.event = {
                ...opts.event,
                cardGroupID: RFMParams.groupMembersID,
                cardGroupName: RFMParams.groupMembersName,
                cardCount: RFMParams.totalMembers,
                //    cardGroupRemark: groupMembersRemark,
            }
        }
        const jumpToCrmFlag = specialPromotion.isBenefitJumpOpenCard || specialPromotion.isBenefitJumpSendGift;
        if (this.props.isNew === false && !this.props.isCopy) {
            if (this.props.promotionType === '53' && flag) { // 群发礼品完成前需要先判断发券是否超过限制
                this.isShowUpperLimitModal(opts, cb, jumpToCrmFlag, 'update');
            } else {
                this.updateSpecialPromotion(opts, cb, jumpToCrmFlag)
            }
        } else {
            // 创建特色营销活动
            if ((this.props.promotionType === '20' || this.props.promotionType === '53') && opts.event) {
                // 复制的礼品不传userCount
                opts.event.userCount && delete opts.event.userCount;
            }
            if (this.props.promotionType === '53' && flag) { // 群发礼品
                this.isShowUpperLimitModal(opts, cb, jumpToCrmFlag, 'add');
            } else {
                this.addSpecialPromition(opts, cb, jumpToCrmFlag)
            }
        }
    }

    onUpperLimitCancel() {
        this.setState({
            upperLimitVisible: false,
            loading: false,
        })
    }


    addSpecialPromition = (opts, cb, jumpToCrmFlag) => {
        this.props.addSpecialPromotion && this.props.addSpecialPromotion({
            data: opts,
            success: (res) => {
                message.success(COMMON_SPE.d34idrcqen7223);
                this.setState({
                    loading: false,
                });
                cb();
                if (jumpToCrmFlag) {
                    // closePage();
                    jumpPage({ menuID: 'editBenefitCard', from: 'saleCenterBenefit', jumpSepid: res.itemID });
                } else {
                    const menuID = this.props.user.menuList.find(tab => tab.entryCode === '1000076003').menuID
                    menuID && closePage(menuID)
                    jumpPage({ menuID, from: 'create' })
                }
            },
            fail: (info) => {
                message.error(<span>{COMMON_SPE.de8fem99k0868} {info}</span>);
                this.setState({
                    loading: false,
                });
            },
        });
    }

    updateSpecialPromotion = (opts, cb, jumpToCrmFlag) => {
        this.props.updateSpecialPromotion && this.props.updateSpecialPromotion({
            data: opts,
            success: (res) => {
                message.success(COMMON_SPE.d4h17ei7f3g518);
                this.setState({
                    loading: false,
                });
                cb();
                if (jumpToCrmFlag) {
                    // closePage();
                    jumpPage({ menuID: 'editBenefitCard', from: 'saleCenterBenefit', jumpSepid: res.itemID });
                }
            },
            fail: (info) => {
                message.error(<span>{COMMON_SPE.d2c8akfh2o6216} {info}</span>);
                this.setState({
                    loading: false,
                });
            },
        });
    }

    isShowUpperLimitModal = async (opts, cb, jumpToCrmFlag, name) => {
        const { gifts, event } = opts;
        const { user } = this.props
        const coupon = gifts.some(item => item.presentType == '1'); // 选择优惠券发送请求
        const { localType, cardGroupID, customerRangeConditionIDs } = event;
        let cardLevelRangeType;
        if (localType === '5' && cardGroupID == '0') {
            cardLevelRangeType = '0'; // 全部会员传0
        } else if (localType === '5') {
            cardLevelRangeType = '2' // 群体
        } else {
            cardLevelRangeType = '7'
        }
        const data = {
            groupID: user.accountInfo.groupID,
            subGroupID: '',
            cardLevelRangeType,
            cardGroupID,
            customerRangeConditionIDs,
            giftCountBeanList: gifts.filter(item => (item.presentType == '1')).map(item => ({
                giftID: item.giftID,
                giftCount: item.giftCount,
            })),
        }
        const params = { service: 'HTTP_SERVICE_URL_PROMOTION_NEW',
            type: 'post',
            data,
            method: '/specialPromotion/calculateSendGiftCount.ajax',
        }
        if (coupon && !jumpToCrmFlag) { // 权益卡活动创建不请求该接口
            const res = await axios.post('/api/v1/universal', params)
            const { code, popFlag = false, sendGiftCount, customerCount, message: msg } = res
            if (code === '000' && popFlag) {
                this.setState({
                    upperLimitVisible: true, // 弹窗提醒
                    data: { gifts: [...gifts.filter(item => (item.presentType == '1'))], sendGiftCount, customerCount },
                })
            } else if (code === '000' && !popFlag) { // 无需弹窗提醒
                if (name === 'add') { // 调用原逻辑
                    this.addSpecialPromition(opts, cb, jumpToCrmFlag)
                } else {
                    this.updateSpecialPromotion(opts, cb, jumpToCrmFlag)
                }
            } else { // 接口出错
                message.error(msg);
                this.setState({
                    loading: false,
                    upperLimitVisible: false,
                })
            }
        } else if (name === 'add') { // 没有券直接调用原逻辑
            this.addSpecialPromition(opts, cb, jumpToCrmFlag)
        } else {
            this.updateSpecialPromotion(opts, cb, jumpToCrmFlag)
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

    handleFinish(cb, index, _flag) {
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
                }, _flag);
            }, 0);
        }
    }
}
