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
import { closePage, jumpPage } from '@hualala/platform-base'
import PromotionBasicInfo from './promotionBasicInfo';
import PromotionScopeInfo from './promotionScopeInfo';
import CustomProgressBar from './CustomProgressBar';
import {
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter,
} from '../../../redux/actions/saleCenterNEW/types';
import {
    SALE_CENTER_PAGE_SHOP,
    // SALE_CENTER_PAGE,
    SPECIAL_PAGE,
    ONLINE_PROMOTION_MANAGEMENT_GROUP,
    ONLINE_PROMOTION_MANAGEMENT_SHOP,
} from '../../../constants/entryCodes';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';

class NewPromotion extends React.Component {
    constructor(props) {
        super(props);

        this.handles = []; // store the callback
        this.state = {
        };
        this.onFinish = this.onFinish.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
    }

    onFinish(cb) {
        const { promotionBasicInfo, promotionScopeInfo, promotionDetailInfo, isOnline, isCopy } = this.props;
        const menuIDs = promotionBasicInfo.get('menuID');
        const basicInfo = promotionBasicDataAdapter(promotionBasicInfo.get('$basicInfo').toJS(), true);
        const scopeInfo = promotionScopeInfoAdapter(promotionScopeInfo.get('$scopeInfo').toJS(), true);
        const _detailInfo = promotionDetailInfoAdapter(promotionDetailInfo.get('$promotionDetail').toJS(), true);
        const detailInfo = promotionDetailInfo.get('$promotionDetail').toJS();
        const isActive = detailInfo.isActive;
        let userType = detailInfo.userSetting;
        const subjectType = detailInfo.subjectType == '0' ? '0' : '1';
        const sharedPromotionIDLst = detailInfo.mutexPromotions || [];
        const excludedSubjectLst = typeof detailInfo.mutexSubjects === 'object' ? detailInfo.mutexSubjects.join(',') : detailInfo.mutexSubjects;
        const roleIDLst = typeof detailInfo.role === 'object' ? detailInfo.role.join(',') : detailInfo.role;
        const _roleIDLst = scopeInfo.channelLst == 'WECHAT' ? '' : roleIDLst;
        const shareLst = typeof detailInfo.mutexPromotions === 'object' ? detailInfo.mutexPromotions.map((promotion) => {
            return {
                sharedID: promotion.promotionIDStr || promotion.sharedIDStr,
                sharedType: promotion.sharedType ? promotion.sharedType : '10',
            }
        }) : []
        const giftList = detailInfo.giftList || [];
        const opts = {
            groupID: this.props.user.getIn(['accountInfo', 'groupID']),
            maintenanceLevel: this.props.user.get('shopID') ? '1' : '0',
            ...detailInfo,
            ...scopeInfo,
            ...basicInfo,
            ..._detailInfo, // include rule and priceLst
            userType,
            excludedSubjectLst,
            subjectType,
            roleIDLst: _roleIDLst,
            isActive,
            shareLst,
            giftList,
            usageMode: scopeInfo.usageMode,
        };
        if (!opts.shopIDLst && promotionBasicInfo.getIn(['$basicInfo', 'shopIDLst']) > 0) {
            opts.shopIDLst = promotionBasicInfo.getIn(['$basicInfo', 'shopIDLst'])
        }
        //处理新商品组件数据
        if(detailInfo._newGoodsCompData) {
            opts.goodScopeRequest = detailInfo._newGoodsCompData;
            delete opts._newGoodsCompData;
        }
        // 和志超更改接口后的数据结构
        const { groupID, promotionName, promotionShowName, categoryName, promotionCode,
            tagLst, description, promotionType, startDate, endDate, excludedDate,
            validCycle, cityLst, brandIDLst, orgIDLst, shopIDLst, excludedShopIDLst,
            orderTypeLst, channelLst, crmLevelLst, foodScopeType, ruleJson, defaultRun,
            maintenanceLevel, usageMode, shopID, foodRuleList, birthdayLimit, cardBalanceLimitType = 0,
            mutexActivityId, mutexActivityType, sharedAndNotOverlieActivityId, sharedAndNotOverlieType,
            sharedAndOverlieActivityId, sharedAndOverlieType,
            approval,
            goodsScopeList,
            ruleUseType,
            shopScopeList,
            requiredLst,
            stageGoodsList,
            executionRoleType,
            shareType,
        } = opts;
        
        const promotionInfo = {
            master: {
                groupID,
                shopID,
                sourceType: +isOnline,
                promotionName,
                promotionShowName,
                categoryName,
                promotionCode,
                tagLst,
                description,
                promotionType,
                startDate,
                endDate,
                excludedDate,
                validCycle,
                cityLst,
                brandIDLst,
                orgIDLst,
                shopIDLst,
                excludedShopIDLst,
                orderTypeLst,
                userType,
                channelLst,
                crmLevelLst,
                foodScopeType,
                sharedPromotionIDLst: sharedPromotionIDLst.map(v => v.promotionIDStr || v.sharedIDStr).join(','),
                ruleJson: ruleJson ? JSON.stringify(ruleJson) : '',
                defaultRun,
                roleIDLst,
                subjectType,
                excludedSubjectLst,
                maintenanceLevel,
                usageMode,
                needSyncToAliPay: detailInfo.needSyncToAliPay,
                giftList,
                birthdayLimit,
                cardBalanceLimitType,
		        //周黑鸭新需求
                activityCost:approval?approval.activityCost:'',
                estimatedSales: approval ? approval.estimatedSales : '',
                activityRate: approval ? approval.activityRate : '',
                auditRemark: approval ? approval.auditRemark : '',
                headquartersCost: approval ? approval.headquartersCost : null,
                storeAttribute: approval ? approval.storeAttribute : null,
                // 魏家凉皮字段
                executionRoleType: executionRoleType || 1,
                shareType,
            },
            timeLst: opts.timeLst,
            priceLst: opts.priceLst,
            scopeLst: opts.scopeLst,
            foodRuleList,
            shareLst: opts.shareLst,
            cardScopeList: detailInfo.cardScopeList,
            //周黑鸭新需求
            mutexActivityId,
            mutexActivityType,
            sharedAndNotOverlieActivityId,
            sharedAndNotOverlieType,
            sharedAndOverlieActivityId,
            sharedAndOverlieType,
            goodsScopeList,
            ruleUseType,
            shopScopeList,
            requiredLst,
            stageGoodsList,
        }
        if (this.props.isNew === false && !isCopy) {
            const promotionVersion = promotionBasicInfo.getIn(['$basicInfo', 'promotionVersion']);
            promotionInfo.master.sale_promotionVersion = promotionVersion ? '2.0' : '1.0'
            promotionInfo.master.promotionID = basicInfo.promotionID;
            this.props.updateNewPromotion({
                data: { promotionInfo },
                success: () => {
                    message.success(SALE_LABEL.k5do0ps6, 5);
                    this.setState({
                        loading: false,
                    });
                    cb();
                    this.props.clear();
                },
                fail: () => {
                    message.error(SALE_LABEL.k5doax7i);
                    this.setState({
                        loading: false,
                    });
                },
                sameCode: () => {
                    message.error(SALE_LABEL.k5m5ax20);
                    this.setState({
                        loading: false,
                    });
                },
            });
        } else {
            const path = window.location.pathname.split('/') || [];
            const pathMenuID = path[path.length - 1];
            if(isCopy){
                const promotionVersion = promotionBasicInfo.getIn(['$basicInfo', 'promotionVersion']);
                promotionInfo.master.sale_promotionVersion = promotionVersion ? '2.0' : '1.0'
            }else{
                promotionInfo.master.sale_promotionVersion = menuIDs.includes(pathMenuID) ? '2.0' : '1.0';
            }
            this.props.addNewPromotion({
                data: { promotionInfo },
                success: () => {
                    cb();
                    message.success(SALE_LABEL.k5do0ps6, 5);
                    this.setState({
                        loading: false,
                    });
                    this.props.clear();
                    let target;
                    if (this.props.user.get('shopID')) {
                        target = isOnline ? ONLINE_PROMOTION_MANAGEMENT_SHOP :
                        SALE_CENTER_PAGE_SHOP;
                    } else {
                        target = isOnline ? ONLINE_PROMOTION_MANAGEMENT_GROUP :
                        SPECIAL_PAGE;
                    }
                    const menuList = this.props.user.get('menuList').toJS();
                    const menuID = menuList.find(tab => tab.entryCode === target).menuID
                    menuID && closePage(menuID)
                    jumpPage({ menuID, from: 'onSale' })
                },
                fail: () => {
                    message.error(SALE_LABEL.k5doax7i);
                    this.setState({
                        loading: false,
                    });
                },
                sameCode: () => {
                    message.error(SALE_LABEL.k5m5ax20);
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
        this.props.clear();
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

    render() {
        if (this.props.component === undefined) {
            throw new Error('component is required');
        }
        const {
            isNew,
            isOnline,
            isCopy,
            onlyModifyShop,
        } = this.props;
        const steps = [
            {
                title: SALE_LABEL.k5g5bcqo,
                content: (
                    <PromotionBasicInfo
                        isNew={isNew}
                        isCopy={isCopy}
                        onlyModifyShop={onlyModifyShop}
                        getSubmitFn={(handles) => {
                            this.handles[0] = handles;
                        }}
                    />
                ),
            },
            {
                title: SALE_LABEL.k5gfsuwz,
                content: (
                    <PromotionScopeInfo
                        getSubmitFn={(handles) => {
                            this.handles[1] = handles;
                        }}
                        isOnline={isOnline}
                        isNew={isNew}
                        isCopy={isCopy}
                        onlyModifyShop={onlyModifyShop}
                    />
                ),
            },
            {
                title: SALE_LABEL.k5g5bcz0,
                content: React.createElement(
                    this.props.component,
                    {
                        getSubmitFn: (handles) => {
                            this.handles[2] = handles;
                        },
                        onChange: (rule) => {
                            this.setState({ rule });
                        },
                        isNew,
                        isCopy,
                        isOnline,
                    }
                ),
            },
        ];
        return (
            <CustomProgressBar
                steps={steps}
                loading={this.state.loading}
                callback={(arg) => {
                    this.props.callbacktwo(arg);
                }}
                onNext={this.handleNext}
                onFinish={this.handleFinish}
                onPrev={this.handlePrev}
                onCancel={this.handleCancel}
            />
        );
    }
}

export default NewPromotion;
