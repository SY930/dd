<!--
 * @Author: wangxiaofeng@hualala.com
 * @Date: 2020-06-29 11:26:45
 * @LastEditTime: 2020-06-29 13:55:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /platform-sale/src/containers/GiftNew/README.md
--> 

## 目录
[toc]

## 项目目录结构

```
src/containers/GiftNew                                                          // 礼品管理
├── GiftAdd
│   ├── AxiosFactory.jsx
│   ├── Crm.less
│   ├── GiftAdd.less
│   ├── GiftAddModal.jsx
│   ├── GiftAddModalStep.jsx
│   ├── GiftInfo.jsx
│   ├── GiftModal.jsx
│   ├── GiftPromotion.jsx
│   ├── GiftTimeIntervals.jsx
│   ├── GiftType.jsx
│   ├── InputTreeForGift.jsx
│   ├── _formItemConfig.jsx
│   └── common
├── GiftInfo
│   ├── CrmCardInfoAddCardDetail.less
│   ├── ExportModal.jsx
│   ├── GiftDetailModal.jsx
│   ├── GiftDetailModalTabs.jsx
│   ├── GiftDetailSendorUsedTable.jsx
│   ├── GiftDetailTable.jsx                                                     // 礼品管理页面（礼品列表页）
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
├── _action.jsx                                                                 // 单向数据流 actions 文件
├── _reducers.jsx                                                               // 单向数据流 reducer 文件
├── assets
│   ├── pos.png
│   ├── wx.png
│   └── xcx.png
└── components
    ├── CreateGiftsPanel.jsx                                                    // 创建礼品页面入口，常用分类，其他两个大类
    ├── FakeBorderedLabel.jsx
    ├── FormWrapper.jsx
    ├── GenerateBatchGifts.jsx
    ├── GenerateBatchQRCodes.jsx
    ├── GiftEditPage.jsx
    ├── GiftPrice.jsx
    ├── MoneyLimitTypeAndValue.jsx
    ├── PhonePreview.jsx
    ├── PhonePreviewForWeChat.jsx
    ├── PushMessageMpID.jsx
    ├── SelectBrands.jsx
    ├── SelectCardTypes.jsx
    ├── SellerCode.jsx
    ├── SendGiftPanel.jsx
    ├── WeChatMessageFormWrapper.jsx
    ├── WeChatMessageSetting.jsx
    └── fakeBorderedLabel.less
```

### 补充
src/constants/Gift.jsx          礼品相关的常量设置页面，包含礼品类型