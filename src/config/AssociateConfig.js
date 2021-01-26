
import _ from 'lodash'
import { getStore } from '@hualala/platform-base'
 
import { NEW_SALE_BOX, PROMOTION_CALENDAR_NEW, SALE_CENTER_PAGE, SHARE_RULES_GROUP, GIFT_PAGE } from '../constants/entryCodes'
// = 'shop.jituan.wechat.mp'
 
 
const AssociateConfigFactory = ()=>{
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
                    url: 'http://service.hualala.com/categoryList/detail?categoryKey=cfc08aa9626f461e8dc8d86757425195&docKey=e43652a6ac394841b0580c6612e7ef5f'
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