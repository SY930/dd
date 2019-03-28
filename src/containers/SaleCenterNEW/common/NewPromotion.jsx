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
import PromotionBasicInfo from './promotionBasicInfo';
import PromotionScopeInfo from './promotionScopeInfo';
import CustomProgressBar from './CustomProgressBar';
import {
    promotionBasicDataAdapter,
    promotionScopeInfoAdapter,
    promotionDetailInfoAdapter,
} from '../../../redux/actions/saleCenterNEW/types';


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
        const { promotionBasicInfo, promotionScopeInfo, promotionDetailInfo, user } = this.props;

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
        const opts = {
            groupID: this.props.user.getIn(['accountInfo', 'groupID']),
            maintenanceLevel: this.props.user.get('shopID') ? '1' : '0',
            ...basicInfo,
            ...scopeInfo,
            ..._detailInfo, // include rule and priceLst
            userType,
            excludedSubjectLst,
            subjectType,
            roleIDLst: _roleIDLst,
            isActive,
            shareLst,
            usageMode: scopeInfo.usageMode,
        };
        // 和志超更改接口后的数据结构
        const { groupID, promotionName, promotionShowName, categoryName, promotionCode,
            tagLst, description, promotionType, startDate, endDate, excludedDate,
            validCycle, cityLst, brandIDLst, orgIDLst, shopIDLst, excludedShopIDLst,
            orderTypeLst, channelLst, crmLevelLst, foodScopeType, ruleJson, defaultRun,
            maintenanceLevel, usageMode, shopID } = opts;
        const promotionInfo = {
            master: {
                groupID,
                shopID,
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
                ruleJson: JSON.stringify(ruleJson),
                defaultRun,
                roleIDLst,
                subjectType,
                excludedSubjectLst,
                maintenanceLevel,
                usageMode,
                needSyncToAliPay: detailInfo.needSyncToAliPay,
            },
            timeLst: opts.timeLst,
            priceLst: opts.priceLst,
            scopeLst: opts.scopeLst,
            shareLst: opts.shareLst,
            cardScopeList: detailInfo.cardScopeList,
        }
        if (this.props.isNew === false) {
            promotionInfo.master.promotionID = basicInfo.promotionID;
            this.props.updateNewPromotion({
                // data: {...opts,modifiedBy:this.props.user.toJS().accountInfo.userName},
                data: { promotionInfo },
                success: () => {
                    message.success('活动更新成功', 5);
                    this.setState({
                        loading: false,
                    });
                    cb();
                    this.props.clear();
                },
                fail: () => {
                    message.error('活动更新失败');
                    this.setState({
                        loading: false,
                    });
                },
                sameCode: () => {
                    message.error('活动编码重复');
                    this.setState({
                        loading: false,
                    });
                },
            });
        } else {
            this.props.addNewPromotion({
                data: { promotionInfo },
                success: () => {
                    cb();
                    message.success('活动创建完毕', 5);
                    this.setState({
                        loading: false,
                    });
                    this.props.clear();
                    const menuID = this.props.user.get('shopID') ?
                        this.props.user.get('menuList').toJS().find(tab => tab.entryCode === 'shop.dianpu.promotion').menuID
                        :
                        this.props.user.get('menuList').toJS().find(tab => tab.entryCode === '1000076001').menuID
                    jumpPage({ menuID })
                },
                fail: () => {
                    message.error('活动创建失败');
                    this.setState({
                        loading: false,
                    });
                },
                sameCode: () => {
                    message.error('活动编码重复');
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

        const steps = [


            {
                title: '基本信息',
                content: (<PromotionBasicInfo
                    isNew={this.props.isNew}
                    getSubmitFn={(handles) => {
                        this.handles[0] = handles;
                    }}
                />),
            },
            {
                title: '活动范围',
                content: (<PromotionScopeInfo getSubmitFn={(handles) => {
                    this.handles[1] = handles;
                }}
                />),
            },
            {
                title: '活动内容',
                content: React.createElement(
                    this.props.component,
                    {
                        getSubmitFn: (handles) => {
                            this.handles[2] = handles;
                        },
                        onChange: (rule) => {
                            this.setState({ rule });
                        },
                        isNew: this.props.isNew,
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
