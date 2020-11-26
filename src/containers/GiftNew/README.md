<!--
 * @Author: wangxiaofeng@hualala.com
 * @Date: 2020-06-29 11:26:45
 * @LastEditTime: 2020-06-30 18:03:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /platform-sale/src/containers/GiftNew/README.md
--> 

## 目录
[toc]

## 项目目录结构

```
src/containers/GiftNew                          // 礼品管理
├── GiftAdd                                     // 新增礼品相关
│   ├── AxiosFactory.jsx
│   ├── Crm.less
│   ├── GiftAdd.less
│   ├── GiftAddModal.jsx                        // 新增礼品页面 （礼品类型参考 FromWrapper.jsx）
│   ├── GiftAddModalStep.jsx                    // 新增礼品页面 （礼品类型参考FromWrapper.jsx）
│   ├── GiftInfo.jsx                            // 礼品首页（注册页面，reducer数据进行挂载，该页面根据reducer不同状态进行渲染不同页面，如礼品列表，创建礼品页等）
│   ├── GiftModal.jsx
│   ├── GiftPromotion.jsx
│   ├── GiftTimeIntervals.jsx
│   ├── GiftType.jsx
│   ├── InputTreeForGift.jsx
│   ├── _formItemConfig.jsx                     // 新建礼品页面，表单配置项
│   └── common
├── GiftInfo
│   ├── CrmCardInfoAddCardDetail.less
│   ├── ExportModal.jsx
│   ├── GiftDetailModal.jsx
│   ├── GiftDetailModalTabs.jsx
│   ├── GiftDetailSendorUsedTable.jsx
│   ├── GiftDetailTable.jsx                      // 礼品管理页面（礼品列表页）
│   ├── GiftInfo.less
│   ├── GiftLinkGenerateModal.jsx
│   ├── QuatoCardBatchSold.jsx
│   ├── QuatoCardDetailModal.jsx
│   ├── QuatoCardDetailModalTabs.jsx
│   ├── QuatoCardDetailModalTabsSendCard.jsx
│   ├── RedPacketDetailModal.jsx
│   ├── RedPacketDetailModalTabs.jsx
│   ├── RedPacketSendOrUsedTable.jsx
│   ├── SendCard.jsx
│   ├── TicketBag
│   ├── TransGiftModal.jsx
│   ├── _QuatoCardFormConfig.jsx
│   ├── _tableCardSumConfig.jsx
│   ├── _tableListConfig.jsx
│   ├── _tableMadeCardConfig.jsx
│   ├── _tableSendCardListConfig.jsx
│   ├── _tableSendConfig.jsx
│   ├── _tableSum.jsx
│   ├── img
│   ├── index.jsx
│   └── transGift.less
├── README.md
├── _action.jsx                                     // 单向数据流 actions 文件
├── _reducers.jsx                                   // 单向数据流 reducer 文件
├── assets
│   ├── pos.png
│   ├── wx.png
│   └── xcx.png
└── components                                      // 页面的组件库
    ├── CreateGiftsPanel.jsx                        // 创建礼品页面入口，常用分类，其他两个大类
    ├── FakeBorderedLabel.jsx
    ├── FormWrapper.jsx                             // 创建及编辑礼品页面右侧所有的编辑项
    ├── GenerateBatchGifts.jsx
    ├── GenerateBatchQRCodes.jsx
    ├── GiftEditPage.jsx
    ├── GiftPrice.jsx
    ├── MoneyLimitTypeAndValue.jsx
    ├── PhonePreview.jsx                            // 创建及编辑礼品页面最左侧手机预览组件
    ├── PhonePreviewForWeChat.jsx
    ├── PushMessageMpID.jsx
    ├── SelectBrands.jsx                            // 适用品牌下拉选择框
    ├── SelectCardTypes.jsx                         // 适用卡类下拉选择框
    ├── SellerCode.jsx
    ├── SendGiftPanel.jsx
    ├── WeChatMessageFormWrapper.jsx
    ├── WeChatMessageSetting.jsx
    └── fakeBorderedLabel.less
```

### 补充
src/constants/Gift.jsx          礼品相关的常量设置页面，包含礼品类型