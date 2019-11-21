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
import { ActivityLogo } from '../SaleCenterNEW/ActivityLogo/ActivityLogo'; // 活动logo
import NewBirthdayGift from './birthdayGift/NewBirthdayGift'; // 生日赠送
import NewCardGive from './newCardGive/NewCardGive'; // 开卡赠送
import NewFreeGet from './freeGet/NewFreeGet'; // 免费领取
import NewShackGift from './shackGift/NewShackGift'; // 摇奖
import NewScoreConvert from './scoreConvert/NewScoreConvert'; // 积分兑换
import NewSignUp from './signUp/NewSignUp'; // 报名活动
import NewSendGifts from './sendGifts/NewSendGifts'; // 群发礼品
import NewSendMsgs from './sendMsgs/NewSendMsgs'; // 群发短信
import NewPerfectReturnGift from './perfectReturnGift/NewPerfectReturnGift'; // 完善资料送礼
import NewUpGradeReturnGift from './upGradeReturnGift/NewUpGradeReturnGift'; // 升级送礼
import NewAddUpReturnGift from './addUpReturnGift/NewAddUpReturnGift'; // 累计消费送礼
import NewWakeUpReturnGift from './wakeUpReturnGift/NewWakeUpReturnGift'; // 唤醒送礼
import NewOnLineReturnGift from './onLineReturnGift/NewOnLineReturnGift'; // 线上送礼
import NewColorsEggCat from './colorsEggCat/NewColorsEggCat'; // 彩蛋猫
import ActivitySidebar from '../SaleCenterNEW/ActivitySidebar/ActivitySidebar'; // 左侧展示信息
import GiveGiftsToNewFollowers from './giveGiftsToNewFollowers/wrapper';
import ShareGifts from './shareGifts';
import ExpansionGifts from './expansionGifts';
import InstantDiscount from './instantDiscount';
import RecommendGifts from './recommendGifts';
import AccumulateGift from './accumulateGift';
import styles from '../SaleCenterNEW/ActivityPage.less';

import {
    CHARACTERISTIC_CATEGORIES,
} from '../../redux/actions/saleCenterNEW/types';
// 模态框内容组件， 左边为SideBar, 内容区域为 CustomProgressBar
class ActivityMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0, // 模态框当前步骤
            pages: [],
            promotionType: this.props.saleCenter.get('characteristicCategories').toJS(),
        };

        this.renderActivityTags = this.renderActivityTags.bind(this);
        this.renderSideBar = this.renderSideBar.bind(this);
    }

    renderSideBar() {
        switch (this.state.current) {
            case 1:
                return (
                    <div style={{ margin: '110px 4px 10px 10px' }}>
                        <ActivitySidebar listsTitle={'1 | 基本信息'} key="1" />
                    </div>
                );
            case 2:
                return (
                    <div style={{ margin: '110px 4px 10px 10px' }}>
                        <ActivitySidebar listsTitle={'1 | 基本信息'} key="1" />
                        <ActivitySidebar listsTitle={'2 | 活动范围'} key="2" />
                    </div>
                );
            default:
                return (
                    <div className={styles.promotionTip}>
                        <div style={{ marginBottom: 20 }}>{this.props.eventWay ? CHARACTERISTIC_CATEGORIES.find(type => type.key == this.props.eventWay).text || '' : ''}</div>
                    </div>
                );
        }
    }

    /**
     * 加载所有的营销活动页，并转换对应的React组件存放到 state属性 pages中存储。
     * 用户点击对应的index加载对应的页面内容（营销活动）
     */
    componentDidMount() {
        const activityCategories = this.state.promotionType;
        const _pages = [
            NewBirthdayGift, // 生日赠送
            NewCardGive, // 开卡赠送
            NewFreeGet, // 免费领取
            NewShackGift, // 摇奖
            NewScoreConvert, // 积分兑换
            NewSignUp, // 限时报名
            NewSendGifts, // 群发礼品
            NewSendMsgs, // 群发短信
            NewPerfectReturnGift, // 完善资料送礼
            NewUpGradeReturnGift, // 升级送礼
            NewAddUpReturnGift, // 累计消费送礼
            NewOnLineReturnGift, // 线上送礼
            // NewColorsEggCat, 彩蛋猫活动下线 key 70
            NewWakeUpReturnGift, // 唤醒送礼
            NewColorsEggCat, // 评价送礼，复用彩蛋猫
            GiveGiftsToNewFollowers, // 关注送礼 key 31
            ShareGifts,
            ExpansionGifts,
            InstantDiscount,
            RecommendGifts,
            AccumulateGift,
        ];
        const pages = _pages.map((promotion, index) => {
            return React.createElement(promotion, {
                callbacktwo: (arg) => {
                    this.props.callbackthree(arg);
                },
                key: index,
                isNew: this.props.isNew,
                promotionType: activityCategories[index].key,
                component: promotion,
            });
        });
        this.setState({
            pages,
        });
    }

    // 渲染对应的营销活动页面
    renderActivityTags() {
        return this.state.pages[this.props.index];
    }
    render() {
        const index = this.props.index;
        return (
            <div className={[styles.activityMain, styles.activityModal].join(' ')} style={{ padding: '0' }}>
                <Row>
                    <Col span={6} className={styles.activityMainLeft}>
                        <ActivityLogo index={index} titletext={this.state.promotionType[index].title} activityMain={true} />
                        <br />
                        {
                            this.renderSideBar()
                        }
                        <br />
                    </Col>
                    <Col span={18} className={styles.activityMainRight}>
                        {this.renderActivityTags()}
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        saleCenter: state.sale_saleCenter_NEW,
        eventWay: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'eventWay']),
    };
}

export default connect(mapStateToProps)(ActivityMain);
