import React from 'react'
// 活动标题和说明
import PayHaveGift from '../PayHaveGift/index'; // 微信支付有礼
import SwellGiftBag from '../SwellGiftBag/index'; // 膨胀大礼包

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
];
