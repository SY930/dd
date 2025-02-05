import React from 'react'
// 活动标题和说明
import PayHaveGift from '../PayHaveGift/index'; // 微信支付有礼
import SwellGiftBag from '../SwellGiftBag/index'; // 膨胀大礼包
import GrabRedPacket from '../GrabRedPacket/index'; // 膨胀大礼包
import CouponsGiveCoupons from '../CouponsGiveCoupons'// 消费券返券
import Housekeeper from '../Housekeeper'// 管家活动-流失唤醒
import IntelligentGiftRule from '../IntelligentGiftRule'// 管家活动-智能发券
import WeighAndGive from '../WeighAndGive'// 称重买赠

export const actInfoList = [
    {
        title: '微信支付有礼',
        key: '80',
        dscList: [
            {
                title: '活动简介',
                dsc: <div>微信支付成功页投放微信支付商家券，引导用户领券，提升复购。（一个集团在同一时间段内只能创建一个活动）</div>,
            },
        ],
        render(props = {}) {
            return <PayHaveGift {...props} />;
        },
    },
    {
        title: '消费券返券',
        key: '81',
        dscList: [
            {
                title: '活动简介',
                dsc: <div>消费券返券活动，指用户消费了A券后可以返给用户B券，消费了B券再返给用户C券，以此实现循环返券，拉动用户复够。循环返券可以是返相同的券，也可以是不同的券。</div>,
            },
            {
                title: '活动规则',
                dsc: <div>
                    <div>同一时间段内，只能有一个启用中的消费券返券活动存在</div>
                </div>,
            },
        ],
        render(props = {}) {
            return <CouponsGiveCoupons {...props} />;
        },
    },
    {
        title: '膨胀大礼包',
        key: '66',
        dscList: [
            {
                title: '活动简介',
                dsc: <div><div>参与活动领礼品，邀请好友助力礼品更丰厚</div><div>膨胀大礼包为免费裂变拉新活动，请合理设计礼品及对应助力人数</div></div>,
            },
            {
                title: '活动规则',
                dsc: <div>
                    <div>1.同一位用户在一个活动中，只能发起一次膨胀大礼包活动，兑换奖品后活动立即终止</div>
                    <div>2.助力规则：</div>
                    <div>· 同一位助力用户只能为同一位发起者膨胀一次，不可多次膨胀 <br />
                        · 同一位助力用户可为不同发起者各膨胀一次<br />
                        · 助力用户的助力次数可以限制</div>
                </div>,
            },
        ],
        render(props = {}) {
            return <SwellGiftBag {...props} />;
        },
    },
    {
        title: '流失唤醒',
        key: 'housekeeper',
        dscList: [],
        render(props = {}) {
            return <Housekeeper {...props} />;
        },
    },
    {
        title: '智能发券',
        key: 'intelligentGiftRule',
        dscList: [],
        warnInfo: '在每一个发券周期判断上次发券后用户是否消费，如有消费则降低券面额，如未消费则提升券面额，连续无响应停止向该用户发券',
        render(props = {}) {
            return <IntelligentGiftRule {...props} />;
        },
    },
    {
        title: '拼手气抢红包',
        key: '82',
        dscList: [
            {
                title: '活动简介',
                dsc: <div>对于满足消费条件的用户，在下单后可以发起分享后领券活动，引导用户分享，提升会员活跃度</div>,
            },
        ],
        render(props = {}) {
            return <GrabRedPacket {...props} />;
        },
    },
    // {
    //     title: '称重买赠',
    //     key: '1021',
    //     dscList: [
    //         {
    //             title: '活动简介',
    //             dsc: <div>下单后抽取礼品，促进下次消费</div>,
    //         },
    //     ],
    //     render(props = {}) {
    //         return <WeighAndGive {...props} />;
    //     },
    // },
];
