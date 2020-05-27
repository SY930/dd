/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-28T09:25:16+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: activityMain.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-05T17:21:16+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';
import styles from './ActivityPage.less'
import { ActivityLogo } from './ActivityLogo/ActivityLogo'; // 活动logo
import NewReturnGiftActivity from './returnGift/newReturnGiftActivity'; // 消费返礼品

import NewFullCutActivity from './fullCut/NewFullCutActivity'; // 满减
import FullCutDetailInfo from './fullCut/fullCutDetailInfo';

import NewFullGiveActivity from './fullGive/NewFullGiveActivity'; // 满赠
import FullGiveDetailInfo from './fullGive/fullGiveDetailInfo';

import NewDiscountActivity from './discount/NewDiscountActivity'; // 折扣
import DiscountDetailInfo from './discount/discountDetailInfo';

import NewSpecialActivity from './special/NewSpecialActivity'; // 特价菜
import SpecialDetailInfo from './special/specialDetailInfo';

import NewBuyGiveActivity from './buyGive/NewBuyGiveActivity'; // 买赠
import BuyGiveDetailInfo from './buyGive/buyGiveDetailInfo';

import NewNDiscountActivity from './nDiscount/NewNDiscountActivity'; // 第二份半价
import NDiscountDetailInfo from './nDiscount/nDiscountDetailInfo';

import NewReturnPointActivity from './returnPoint/NewReturnPointActivity'; // 返积分
import ReturnPointDetailInfo from './returnPoint/returnPointDetailInfo';

import NewGroupTicketActivity from './groupTicket/NewGroupTicketActivity'; // 团购券
import GroupTicketDetailInfo from './groupTicket/groupTicketDetailInfo';

import NewRandomCutActivity from './randomCut/NewRandomCutActivity'; // 随机立减
import RandomCutDetailInfo from './randomCut/randomCutDetailInfo';

import NewBuyCutActivity from './buyCut/NewBuyCutActivity'; // 买减
import BuyCutDetailInfo from './buyCut/buyCutDetailInfo';

import NewCollocationActivity from './collocation/NewCollocationActivity'; // 搭赠
import CollocationDetailInfo from './collocation/collocationDetailInfo';

import NewCompositeActivity from './composite/NewCompositeActivity'; // 组合减免
import CompositeDetailInfo from './composite/compositeDetailInfo';

import NewAddMoneyTradeActivity from './addMoneyTrade/NewAddMoneyTradeActivity'; // 加价换购
import AddMoneyTradeDetailInfo from './addMoneyTrade/addMoneyTradeDetailInfo';

import NewBuyAFreeActivity from './buyAFree/NewBuyAFreeActivity'; // 买三免一
import BuyAFreeDetailInfo from './buyAFree/buyAFreeDetailInfo';

import NewAddUpFreeActivity from './addUpFree/NewAddUpFreeActivity'; // 累计减免

import NewAddUpGiveActivity from './addUpGive/NewAddUpGiveActivity'; // 累计赠送
import AddUpGiveDetailInfo from './addUpGive/addUpGiveDetailInfo';

import NewRecommendFood from './recommendFood/NewRecommendFood'; // 推荐菜
import RecommendFoodDetailInfo from './recommendFood/recommendFoodDetailInfo';

import ActivitySidebar from './ActivitySidebar/ActivitySidebar'; // 左侧展示信息
import ReturnGiftDetailInfo from './returnGift/returnGiftDetailInfo';

import NewAddMoneyUpgradeActivity from './addMoneyUpgrade/NewAddMoneyUpgradeActivity'; // 加价升级换新
import AddMoneyUpgradeDetailInfo from './addMoneyUpgrade/AddMoneyUpgradeDetailInfo';
import LowPriceSaleActivity from "./lowPriceSale/LowPriceSaleActivity";
import LowPriceDetailInfo from "./lowPriceSale/LowPriceDetailInfo";
import { ONLINE_PROMOTION_TYPES } from '../../constants/promotionType';
import { COMMON_LABEL, COMMON_STRING } from 'i18n/common';
import { SALE_LABEL, SALE_STRING } from 'i18n/common/salecenter';
import {injectIntl} from './IntlDecor';

// 这里是内部内容的框架组件，分为 左边 和右边。
@injectIntl()
class ActivityMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0, // 模态框当前步骤
            pages: [],
        };
    }

    renderSideBar() {
        const { intl } = this.props;
        const k5g5bcqo = intl.formatMessage(SALE_STRING.k5g5bcqo);
        const k5gfsuwz = intl.formatMessage(SALE_STRING.k5gfsuwz);

        const activityCategories = this.props.saleCenter.get('activityCategories').toJS();
        if (this.isOnline()) {
            return (
                <div className={styles.promotionTip}>
                    <div style={{fontSize: 18 }}>
                        {SALE_LABEL.k5krn6a9}
                    </div>
                    <div style={{ marginBottom: 20, whiteSpace: 'pre-line' }}>
                        {this.props.promotionType ?
                            activityCategories.find(type => type.key === this.props.promotionType).desc || '': ''}
                    </div>
                </div>
            );
        }
        switch (this.state.current) {
            // case 1:
            //     return (
            //         <div style={{ margin: '110px 4px 10px 10px' }}>
            //             <ActivitySidebar listsTitle={'1 | '+k5g5bcqo} key="1" />
            //         </div>
            //     );
            // case 2:
            //     return (
            //         <div style={{ margin: '110px 4px 10px 10px' }}>
            //             <ActivitySidebar listsTitle={'1 | '+k5g5bcqo} key="1" />
            //             <ActivitySidebar listsTitle={'2 | '+k5gfsuwz} key="2" />
            //         </div>
            //     );
            default:
                return (
                    <div className={styles.promotionTip}>
                        <div style={{ marginBottom: 20 }}>{this.props.promotionType ? activityCategories.find(type => type.key === this.props.promotionType).text || '': ''}</div>
                        <div>{this.props.promotionType ? activityCategories.find(type => type.key === this.props.promotionType).example || '' : ''}</div>
                    </div>
                );
        }
    }

    componentDidMount() {
        const pagesArr = [
            {
                wrapper: NewFullCutActivity,
                child: FullCutDetailInfo,
            }, {
                wrapper: NewFullGiveActivity,
                child: FullGiveDetailInfo,
            }, {
                wrapper: NewDiscountActivity,
                child: DiscountDetailInfo,
            }, {
                wrapper: NewSpecialActivity,
                child: SpecialDetailInfo,
            }, {
                wrapper: NewBuyGiveActivity,
                child: BuyGiveDetailInfo,
            }, {
                wrapper: NewNDiscountActivity,
                child: NDiscountDetailInfo,
            }, {
                wrapper: NewReturnGiftActivity,
                child: ReturnGiftDetailInfo,
            }, {
                wrapper: NewReturnPointActivity,
                child: ReturnPointDetailInfo,
            }, {
                wrapper: NewGroupTicketActivity,
                child: GroupTicketDetailInfo,
            }, {
                wrapper: NewRandomCutActivity,
                child: RandomCutDetailInfo,
            }, {
                wrapper: NewBuyCutActivity,
                child: BuyCutDetailInfo,
            }, {
                wrapper: NewCollocationActivity,
                child: CollocationDetailInfo,
            }, {
                wrapper: NewAddMoneyTradeActivity,
                child: AddMoneyTradeDetailInfo,
            },
            {
                wrapper: NewCompositeActivity,
                child: CompositeDetailInfo,
            }, {
                wrapper: NewBuyAFreeActivity,
                child: BuyAFreeDetailInfo,
            },
            {
                wrapper: NewAddUpFreeActivity,
                child: AddUpGiveDetailInfo,
            }, {
                wrapper: NewAddUpGiveActivity,
                child: AddUpGiveDetailInfo,
            }, {
                wrapper: NewRecommendFood,
                child: RecommendFoodDetailInfo,
            },
            {
                wrapper: NewAddMoneyUpgradeActivity,
                child: AddMoneyUpgradeDetailInfo,
            }, {
                wrapper: LowPriceSaleActivity,
                child: LowPriceDetailInfo,
            },
            {
                wrapper: NewFullCutActivity,
                child: FullCutDetailInfo,
            },
            {
                wrapper: NewSpecialActivity,
                child: SpecialDetailInfo,
            },
        ]
        const pages = pagesArr.map((promotion, index) => {
            return React.createElement(promotion.wrapper, {
                callbacktwo: (arg) => {
                    this.props.callbackthree(arg);
                    this.setState({
                        current: arg,
                    })
                },
                key: index,
                isNew: this.props.isNew,
                component: promotion.child,
                isOnline: this.isOnline(),
            });
        });
        this.setState({
            pages: pages,
        });
    }
    renderActivityTags() {
        return this.state.pages[this.props.index];
    }
    isOnline = () => {
        return ONLINE_PROMOTION_TYPES.map(item => `${item.key}`).includes(`${this.props.promotionType}`)
    }
    render() {
        const activityCategories = this.props.saleCenter.get('activityCategories').toJS();
        const index = this.props.index;
        return (
            <div className={[styles.activityMain, styles.activityModal].join(' ')} style={{ padding: 0 }}>
                <Row>
                    <Col span={6} className={styles.activityMainLeft}>
                        <ActivityLogo
                            index={index}
                            titletext={activityCategories[index].title}
                            activityMain={true} />
                        <br />
                        {
                            this.renderSideBar()
                        }
                        <br />
                    </Col>
                    <Col span={18} className={styles.activityMainRight}> {this.renderActivityTags()}
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        promotionType: state.sale_promotionBasicInfo_NEW.getIn(['$basicInfo', 'promotionType']),
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivityMain);
