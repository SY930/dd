
import _ from 'lodash'
import { getStore } from '@hualala/platform-base'

import { NEW_SALE_BOX, PROMOTION_CALENDAR_NEW, SALE_CENTER_PAGE, SHARE_RULES_GROUP, GIFT_PAGE, SPECIAL_PAGE, PROMOTION_ZHIFUBAO_COUPON_LIST, SET_MSG_TEMPLATE, PROMOTION_WECHAT_COUPON_LIST, NEW_SALE_ACTIVITY_BOX } from '../constants/entryCodes'
// = 'shop.jituan.wechat.mp'


const AssociateConfigFactory = () => {
    const associateConfig = {
        // entry code
        // 营销盒子
        [NEW_SALE_BOX]: {
            toAsk: [
                {
                    title: '推荐有礼活动如何创建',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=404850e1db2941468285bfc63c4af464'
                },
                {
                    title: '集点卡活动如何创建',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=4f72ef468fdb4a3eb3933fe5c6533df5'
                },
            ],
        },
        [NEW_SALE_ACTIVITY_BOX]: {
            toAsk: [
                {
                    title: '推荐有礼活动如何创建',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=404850e1db2941468285bfc63c4af464'
                },
                {
                    title: '集点卡活动如何创建',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=4f72ef468fdb4a3eb3933fe5c6533df5'
                },
            ],
        },
        // 营销日历
        [PROMOTION_CALENDAR_NEW]: {
            toAsk: [
                {
                    title: '营销日历操作指南',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=d91d844fadc047e7b51ea445088499cb'
                },
            ],
        },
        // 基础营销
        [SALE_CENTER_PAGE]: {
            toAsk: [
                {
                    title: '如何设置基础营销活动自动执行',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=5e89318bddb24cb8ab2c78dd19ca1e7c'
                },
            ],
        },
        // 共享规则设置	
        [SHARE_RULES_GROUP]: {
            toAsk: [
                {
                    title: '营销活动共享组如何设置',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=539ba0e079cd4c52ad71760ac2e18aba'
                },
            ],
        },
        // 礼品信息		
        [GIFT_PAGE]: {
            toAsk: [
                {
                    title: '买赠券的创建和核销',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=360c0825c43a4f46a4755cae7dae4fa9'
                },
                {
                    title: '礼品定额卡的创建和使用',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=d039731778cc423a8cab066adbc825b5'
                },
                {
                    title: '券包的创建和使用',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=40fcd4d143a5487aab1209c750922c2a&docKey=1b0fb68a34c24582b6e6a7633a613620'
                },
            ],
        },
        // 特色营销活动页面 
        [SPECIAL_PAGE]: {
            toAsk: [
                {
                    title: '如何新增&修改营销活动？',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=3f6c9b4051e346f9a30c235ff790c02a&docKey=255998210e8c40788941a493abeeca68'
                },
            ],
        },
        // 支付宝代金券 
        [PROMOTION_ZHIFUBAO_COUPON_LIST]: {
            toAsk: [
                {
                    title: '支付宝卡包授权流程说明文档',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=58fd63ad12e046d3bb88cfbcfdc23830&docKey=6bb1ba9a703247559e5b5eff35055d01'
                },
                {
                    title: '【支付宝内券】为什么不能创建',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=7e3c5c3f4b4c4594b326637f0bf97798'
                },
            ],
        },
        // 短信模板 
        [SET_MSG_TEMPLATE]: {
            toAsk: [
                {
                    title: '短信模板',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=84303a887ee64aae8efffbf206a60a6d'
                },
            ],
        },
        // 微信支付代金券 
        [PROMOTION_WECHAT_COUPON_LIST]: {
            toAsk: [
                {
                    title: '顾客批量购买一批优惠券，需要实现可以开发票的效果，该如何实现',
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=eb2a192ecb3d40db8378bfb2319597c0'
                },
            ],
        },
    };

    Object.assign(window.__PlatformConfig__.AssociateConfig.config, associateConfig);
    // console.log('window.__PlatformConfig__.AssociateConfig.config', window.__PlatformConfig__.AssociateConfig.config)
}

window.__PlatformConfig__.AssociateConfig.factories.push(AssociateConfigFactory)
try {
    AssociateConfigFactory()
} catch (err) {
    // handle err
}