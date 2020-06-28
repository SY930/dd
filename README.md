<!--
 * @Author: wangxiaofeng@hualala.com
 * @Date: 2020-06-11 16:33:54
 * @LastEditTime: 2020-06-28 15:33:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /platform-sale/README.md
--> 
## 商户中心营销中心业务包

[react](https://reactjs.org/docs/getting-started.html)

[redux](https://redux.js.org/)

[immutable](https://github.com/immutable-js/immutable-js/)

### 国际化相关

``src/i18n/locales``

存放各个语言文本资源

``src/i18n/common``

收集各种公用文本，导出国际化呈现必备的对象



## 项目目录


```
|-- fe
    |-- .babelrc                                // BABEL 转义 ES6 配置文件
    |-- .editorconfig
    |-- .eslintrc.js
    |-- .gitattributes
    |-- .gitignore
    |-- .npmignore
    |-- .npmrc
    |-- CHANGELOG.md
    |-- README.md
    |-- gitignore-analyze.html
    |-- index.js
    |-- jsconfig.json
    |-- package-lock.json
    |-- package.json
    |-- i18n-messages
    |   |-- src
    |       |-- i18n
    |           |-- common
    |               |-- gift.json
    |               |-- index.json
    |               |-- salecenter.json
    |               |-- special.json
    |-- src
        |-- index.jsx
        |-- components
        |   |-- PagingFactory
        |   |   |-- PageStyles.less
        |   |   |-- PagingFactory.jsx
        |   |   |-- index.jsx
        |   |-- ShopSelector
        |   |   |-- ShopSelectModal.jsx
        |   |   |-- ShopSelector.jsx
        |   |   |-- config.js
        |   |   |-- index.d.ts
        |   |   |-- index.jsx
        |   |   |-- utils.js
        |   |   |-- assets
        |   |   |   |-- ShopSelector.less
        |   |   |-- demo
        |   |   |   |-- demo.png
        |   |   |-- deprecated
        |   |       |-- ShopsSelector
        |   |           |-- ShopSelectorTabs.jsx
        |   |           |-- index.jsx
        |   |           |-- style.less
        |   |-- basic
        |   |   |-- IconsFont
        |   |   |   |-- IconsFont.jsx
        |   |   |   |-- SvgStyle.less
        |   |   |-- ProgressBar
        |   |       |-- ProgressBar.less
        |   |-- common
        |       |-- index.js
        |       |-- Authority
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |-- BaseForm
        |       |   |-- BaseForm.jsx
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- readme.md
        |       |   |-- rules.jsx
        |       |   |-- styles.less
        |       |-- CC2PY
        |       |   |-- index.jsx
        |       |-- CheckboxList
        |       |   |-- CheckboxList.jsx
        |       |   |-- PlainList.jsx
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- styles.less
        |       |   |-- demo
        |       |       |-- demo.png
        |       |-- CloseableTip
        |       |   |-- index.jsx
        |       |   |-- demo
        |       |       |-- closeableTip.png
        |       |-- CropperUploader
        |       |   |-- CropperModal.jsx
        |       |   |-- CropperUploader.jsx
        |       |   |-- cropper.less
        |       |   |-- index.jsx
        |       |-- EditableTags
        |       |   |-- EditableTags.jsx
        |       |   |-- EditableTags.less
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- demo
        |       |       |-- demo.png
        |       |-- FilterSelector
        |       |   |-- FilterSelector.jsx
        |       |   |-- SelectedList.jsx
        |       |   |-- _utils.js
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- assets
        |       |   |   |-- FilterSelector.less
        |       |   |   |-- SelectedList.less
        |       |   |-- demo
        |       |       |-- demo.png
        |       |-- FoodSelector
        |       |   |-- FoodSelectModal.jsx
        |       |   |-- FoodSelector.jsx
        |       |   |-- ShopFoodSelectModal.jsx
        |       |   |-- ShopFoodSelector.jsx
        |       |   |-- index.jsx
        |       |-- FoodSelectorDeprecated
        |       |   |-- FoodSelectModal.jsx
        |       |   |-- FoodSelector.jsx
        |       |   |-- config.js
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- assets
        |       |       |-- FoodSelectModal.less
        |       |-- GoodSelector
        |       |   |-- GoodSelectModal.jsx
        |       |   |-- MultipleGoodSelector.jsx
        |       |   |-- SingleGoodSelector.jsx
        |       |   |-- index.jsx
        |       |   |-- style.less
        |       |-- HualalaEditorBox
        |       |   |-- hualalaEditorBox.less
        |       |   |-- index.jsx
        |       |-- HualalaGroupSelect
        |       |   |-- index.jsx
        |       |   |-- treeSelect.less
        |       |-- HualalaSearchInput
        |       |   |-- index.jsx
        |       |-- HualalaSelected
        |       |   |-- index.jsx
        |       |   |-- treeSelect.less
        |       |-- HualalaSelectedTable
        |       |   |-- index.jsx
        |       |   |-- treeSelect.less
        |       |-- HualalaTable
        |       |   |-- HualalaTable.jsx
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- readme.md
        |       |   |-- assets
        |       |       |-- HualalaTable.less
        |       |-- HualalaTree
        |       |   |-- HualalaTree.jsx
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- readme.md
        |       |-- HualalaTreeSelect
        |       |   |-- index.jsx
        |       |   |-- treeSelect.less
        |       |-- ImageUpload
        |       |   |-- ImageUpload.jsx
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- readme.md
        |       |   |-- style.less
        |       |   |-- utils.js
        |       |-- PromotionCalendarBanner
        |       |   |-- index.jsx
        |       |   |-- style.less
        |       |-- ShopSelector
        |       |   |-- ShopSelectModal.jsx
        |       |   |-- ShopSelector.jsx
        |       |   |-- config.js
        |       |   |-- index.d.ts
        |       |   |-- index.jsx
        |       |   |-- utils.js
        |       |   |-- assets
        |       |   |   |-- ShopSelector.less
        |       |   |-- demo
        |       |   |   |-- demo.png
        |       |   |-- deprecated  
        |       |       |-- ShopsSelector
        |       |           |-- ShopSelectorTabs.jsx
        |       |           |-- index.jsx
        |       |           |-- style.less
        |       |-- WrappedColorPicker
        |           |-- WrappedColorPicker.jsx
        |           |-- colorPickerTheme.less
        |           |-- index.jsx
        |-- constants
        |   |-- Gift.jsx
        |   |-- SpecialPromotionCfg.jsx
        |   |-- authorityCodes.jsx
        |   |-- entryCodes.jsx
        |   |-- projectHuatianConf.jsx
        |   |-- promotionType.jsx
        |   |-- weChatTemplateConstants.jsx
        |-- containers
        |   |-- index.jsx
        |   |-- BasicSettings
        |   |   |-- IntlDecor.jsx
        |   |   |-- MessageDisplayBox.jsx
        |   |   |-- MessageTemplateEditPanel.jsx
        |   |   |-- SmsSettingPage.jsx
        |   |   |-- WeChatMessageSettingPage.jsx
        |   |   |-- actions.js
        |   |   |-- reducers.js
        |   |-- GiftNew
        |   |   |-- _action.jsx
        |   |   |-- _reducers.jsx
        |   |   |-- GiftAdd
        |   |   |   |-- AxiosFactory.jsx
        |   |   |   |-- Crm.less
        |   |   |   |-- GiftAdd.less
        |   |   |   |-- GiftAddModal.jsx
        |   |   |   |-- GiftAddModalStep.jsx
        |   |   |   |-- GiftInfo.jsx
        |   |   |   |-- GiftModal.jsx
        |   |   |   |-- GiftPromotion.jsx
        |   |   |   |-- GiftTimeIntervals.jsx
        |   |   |   |-- GiftType.jsx
        |   |   |   |-- InputTreeForGift.jsx
        |   |   |   |-- _formItemConfig.jsx
        |   |   |   |-- common
        |   |   |       |-- AmountType.jsx
        |   |   |       |-- CouponTrdChannelStockNums.jsx
        |   |   |       |-- GiftImagePath.jsx
        |   |   |       |-- IsSync.jsx
        |   |   |       |-- TrdTemplate.jsx
        |   |   |       |-- selfStyle.less
        |   |   |-- GiftInfo
        |   |   |   |-- CrmCardInfoAddCardDetail.less
        |   |   |   |-- ExportModal.jsx
        |   |   |   |-- GiftDetailModal.jsx
        |   |   |   |-- GiftDetailModalTabs.jsx
        |   |   |   |-- GiftDetailSendorUsedTable.jsx
        |   |   |   |-- GiftDetailTable.jsx
        |   |   |   |-- GiftInfo.less
        |   |   |   |-- GiftLinkGenerateModal.jsx
        |   |   |   |-- QuatoCardBatchSold.jsx
        |   |   |   |-- QuatoCardDetailModal.jsx
        |   |   |   |-- QuatoCardDetailModalTabs.jsx
        |   |   |   |-- QuatoCardDetailModalTabsSendCard.jsx
        |   |   |   |-- RedPacketDetailModal.jsx
        |   |   |   |-- RedPacketDetailModalTabs.jsx
        |   |   |   |-- RedPacketSendOrUsedTable.jsx
        |   |   |   |-- SendCard.jsx
        |   |   |   |-- TransGiftModal.jsx
        |   |   |   |-- _QuatoCardFormConfig.jsx
        |   |   |   |-- _tableCardSumConfig.jsx
        |   |   |   |-- _tableListConfig.jsx
        |   |   |   |-- _tableMadeCardConfig.jsx
        |   |   |   |-- _tableSendCardListConfig.jsx
        |   |   |   |-- _tableSendConfig.jsx
        |   |   |   |-- _tableSum.jsx
        |   |   |   |-- index.jsx
        |   |   |   |-- transGift.less
        |   |   |   |-- TicketBag
        |   |   |   |   |-- AxiosFactory.jsx
        |   |   |   |   |-- Common.jsx
        |   |   |   |   |-- Editor.jsx
        |   |   |   |   |-- EveryDay.jsx
        |   |   |   |   |-- ImageUpload.jsx
        |   |   |   |   |-- MainTable.jsx
        |   |   |   |   |-- QueryForm.jsx
        |   |   |   |   |-- StockModal.jsx
        |   |   |   |   |-- Tip.jsx
        |   |   |   |   |-- index.jsx
        |   |   |   |   |-- index.less
        |   |   |   |   |-- upload.less
        |   |   |   |   |-- Detail
        |   |   |   |   |   |-- InfoTable.jsx
        |   |   |   |   |   |-- MainTable.jsx
        |   |   |   |   |   |-- PresentForm.jsx
        |   |   |   |   |   |-- QueryForm.jsx
        |   |   |   |   |   |-- RefundModal.jsx
        |   |   |   |   |   |-- TotalTable.jsx
        |   |   |   |   |   |-- index.jsx
        |   |   |   |   |   |-- index.less
        |   |   |   |   |-- Release
        |   |   |   |       |-- Step1.jsx
        |   |   |   |       |-- Step2.jsx
        |   |   |   |       |-- index.jsx
        |   |   |   |       |-- index.less
        |   |   |-- components
        |   |       |-- CreateGiftsPanel.jsx
        |   |       |-- FakeBorderedLabel.jsx
        |   |       |-- FormWrapper.jsx
        |   |       |-- GenerateBatchGifts.jsx
        |   |       |-- GenerateBatchQRCodes.jsx
        |   |       |-- GiftEditPage.jsx
        |   |       |-- GiftPrice.jsx
        |   |       |-- MoneyLimitTypeAndValue.jsx
        |   |       |-- PhonePreview.jsx
        |   |       |-- PhonePreviewForWeChat.jsx
        |   |       |-- PushMessageMpID.jsx
        |   |       |-- SelectBrands.jsx
        |   |       |-- SelectCardTypes.jsx
        |   |       |-- SellerCode.jsx
        |   |       |-- SendGiftPanel.jsx
        |   |       |-- WeChatMessageFormWrapper.jsx
        |   |       |-- WeChatMessageSetting.jsx
        |   |       |-- fakeBorderedLabel.less
        |   |-- NewCreatePromotions
        |   |   |-- BasePage.jsx
        |   |   |-- FansInteractivityPage.jsx
        |   |   |-- IntlDecor.jsx
        |   |   |-- LoyaltyPromotionPage.jsx
        |   |   |-- NewCustomerPage.jsx
        |   |   |-- NewCustomerPage.less
        |   |   |-- NewPromotionCard.jsx
        |   |   |-- OnlinePromotionPage.jsx
        |   |   |-- PromotionCreateModal.jsx
        |   |   |-- RepeatPromotionPage.jsx
        |   |   |-- SalePromotionPage.jsx
        |   |   |-- cardStyle.less
        |   |   |-- readme.md
        |   |   |-- style.less
        |   |-- PromotionCalendar
        |   |   |-- PromotionCalendar.jsx
        |   |   |-- index.jsx
        |   |   |-- style.less
        |   |-- PromotionCalendarNew
        |   |   |-- CalendarList.jsx
        |   |   |-- CalendarModal.jsx
        |   |   |-- DetailCard.jsx
        |   |   |-- EntryPage.jsx
        |   |   |-- IntlDecor.jsx
        |   |   |-- index.jsx
        |   |   |-- style.less
        |   |   |-- assets
        |   |       |-- editIcon.png
        |   |       |-- previewIcon.png
        |   |-- PromotionDecoration
        |   |   |-- ButtonSettingBlock.jsx
        |   |   |-- ButtonSettingBlockMultiple.jsx
        |   |   |-- ColorSettingBlock.jsx
        |   |   |-- ColoredButton.jsx
        |   |   |-- CommentSendGiftDecorationBoard.jsx
        |   |   |-- DecorationUploader.jsx
        |   |   |-- DoubleCropperModal.jsx
        |   |   |-- ExpasionGiftDecorationBoard.jsx
        |   |   |-- ExpasionGiftImgCropUploader.jsx
        |   |   |-- FreeGiftDecorationBoard.jsx
        |   |   |-- IntlDecor.jsx
        |   |   |-- LotteryDecorationBoard.jsx
        |   |   |-- ShareGiftDecorationBoard.jsx
        |   |   |-- SignInDecorationBoard.jsx
        |   |   |-- SimpleDecorationBoard.jsx
        |   |   |-- buttonSettingBlock.less
        |   |   |-- buttonSettingBlockMultiple.less
        |   |   |-- coloredButton.less
        |   |   |-- doubleCropperModal.less
        |   |   |-- expansionGiftImgCropUploader.less
        |   |   |-- index.jsx
        |   |   |-- style.less
        |   |-- PromotionV3
        |   |   |-- Camp
        |   |   |   |-- Advance
        |   |   |   |   |-- index.jsx
        |   |   |   |   |-- style.less
        |   |   |   |-- DateRange
        |   |   |   |   |-- index.jsx
        |   |   |   |   |-- style.less
        |   |   |   |-- DateTag
        |   |   |   |   |-- index.jsx
        |   |   |   |   |-- style.less
        |   |   |   |-- EveryDay
        |   |   |   |   |-- Common.jsx
        |   |   |   |   |-- index.jsx
        |   |   |   |   |-- style.less
        |   |   |   |-- Gift
        |   |   |   |   |-- Common.jsx
        |   |   |   |   |-- index.jsx
        |   |   |   |   |-- style.less
        |   |   |   |-- Lottery
        |   |   |   |   |-- AxiosFactory.jsx
        |   |   |   |   |-- Common.jsx
        |   |   |   |   |-- MutliGift.jsx
        |   |   |   |   |-- Point.jsx
        |   |   |   |   |-- Ticket.jsx
        |   |   |   |   |-- index.jsx
        |   |   |   |   |-- style.less
        |   |   |   |-- TicketBag
        |   |   |   |   |-- AddModal.jsx
        |   |   |   |   |-- AxiosFactory.jsx
        |   |   |   |   |-- Common.jsx
        |   |   |   |   |-- MainTable.jsx
        |   |   |   |   |-- QueryForm.jsx
        |   |   |   |   |-- bag.less
        |   |   |   |   |-- index.jsx
        |   |   |   |-- TimeRange
        |   |   |       |-- index.jsx
        |   |   |       |-- style.less
        |   |   |-- Chou2Le
        |   |       |-- AxiosFactory.jsx
        |   |       |-- Common.jsx
        |   |       |-- Step1.jsx
        |   |       |-- Step2.jsx
        |   |       |-- Step3.jsx
        |   |       |-- index.jsx
        |   |       |-- style.less
        |   |-- SaleCenterNEW
        |   |   |-- ActivityPage.less
        |   |   |-- AthActivitiesPage.less
        |   |   |-- IntlDecor.jsx
        |   |   |-- NewActivity.jsx
        |   |   |-- activityMain.jsx
        |   |   |-- indexShop.jsx
        |   |   |-- ActivityLogo
        |   |   |   |-- ActivityLogo.jsx
        |   |   |   |-- styles.less
        |   |   |-- ActivitySidebar
        |   |   |   |-- ActivitySidebar.jsx
        |   |   |   |-- ActivitySidebar.less
        |   |   |-- MyActivities
        |   |   |   |-- MyActivities.jsx
        |   |   |   |-- MyActivities.less
        |   |   |   |-- MyActivitiesShop.jsx
        |   |   |   |-- PromotionAutoRunModal.jsx
        |   |   |-- addMoneyTrade
        |   |   |   |-- AddMoneyTradeDishesTableWithBrand.jsx
        |   |   |   |-- AddMoneyTradeDishesTableWithoutBrand.jsx
        |   |   |   |-- NewAddMoneyTradeActivity.jsx
        |   |   |   |-- addMoneyTradeDetailInfo.jsx
        |   |   |-- addMoneyUpgrade
        |   |   |   |-- AddMoneyUpgradeDetailInfo.jsx
        |   |   |   |-- NewAddMoneyUpgradeActivity.jsx
        |   |   |-- addUpFree
        |   |   |   |-- NewAddUpFreeActivity.jsx
        |   |   |-- addUpGive
        |   |   |   |-- NewAddUpGiveActivity.jsx
        |   |   |   |-- addUpGiveDetailInfo.jsx
        |   |   |-- buyAFree
        |   |   |   |-- NewBuyAFreeActivity.jsx
        |   |   |   |-- buyAFreeDetailInfo.jsx
        |   |   |-- buyCut
        |   |   |   |-- NewBuyCutActivity.jsx
        |   |   |   |-- buyCutDetailInfo.jsx
        |   |   |-- buyGive
        |   |   |   |-- NewBuyGiveActivity.jsx
        |   |   |   |-- buyGiveDetailInfo.jsx
        |   |   |-- collocation
        |   |   |   |-- NewCollocationActivity.jsx
        |   |   |   |-- collocationDetailInfo.jsx
        |   |   |-- common
        |   |   |   |-- AddGrade.jsx
        |   |   |   |-- AdvancedPromotionDetailSetting.jsx
        |   |   |   |-- BaseHualalaModal.jsx
        |   |   |   |-- CategoryAndFoodSelector.jsx
        |   |   |   |-- CategoryAndFoodSelectorForShop.jsx
        |   |   |   |-- CollocationTableWithBrandID.jsx
        |   |   |   |-- CollocationTableWithoutBrandID.jsx
        |   |   |   |-- ConnectedPriceListSelector.jsx
        |   |   |   |-- ConnectedScopeListSelector.jsx
        |   |   |   |-- CustomProgressBar.jsx
        |   |   |   |-- CustomRangeInput.jsx
        |   |   |   |-- CustomTimeRangeInput.jsx
        |   |   |   |-- EditBoxForPromotion.jsx
        |   |   |   |-- EditBoxForRole.jsx
        |   |   |   |-- NewAddGrade.jsx
        |   |   |   |-- NewPromotion.jsx
        |   |   |   |-- PriceInput.jsx
        |   |   |   |-- PriceInputIcon.jsx
        |   |   |   |-- ProgressBar.less
        |   |   |   |-- PromotionNameSelect.jsx
        |   |   |   |-- RangeInput.less
        |   |   |   |-- promotionBasicInfo.jsx
        |   |   |   |-- promotionScopeInfo.jsx
        |   |   |   |-- HualalaGroupSelect
        |   |   |       |-- index.jsx
        |   |   |       |-- treeSelect.less
        |   |   |-- composite
        |   |   |   |-- NewCompositeActivity.jsx
        |   |   |   |-- checkStyle.less
        |   |   |   |-- compositeDetailInfo.jsx
        |   |   |-- discount
        |   |   |   |-- NewDiscountActivity.jsx
        |   |   |   |-- NoThresholdDiscountFoodSelector.jsx
        |   |   |   |-- NoThresholdDiscountFoodSelectorForShop.jsx
        |   |   |   |-- discountDetailInfo.jsx
        |   |   |-- fullCut
        |   |   |   |-- NewFullCutActivity.jsx
        |   |   |   |-- fullCutDetailInfo.jsx
        |   |   |   |-- styles.less
        |   |   |-- fullGive
        |   |   |   |-- NewFullGiveActivity.jsx
        |   |   |   |-- fullGiveDetailInfo.jsx
        |   |   |-- groupTicket
        |   |   |   |-- NewGroupTicketActivity.jsx
        |   |   |   |-- groupTicketDetailInfo.jsx
        |   |   |-- lowPriceSale
        |   |   |   |-- LowPriceDetailInfo.jsx
        |   |   |   |-- LowPriceSaleActivity.jsx
        |   |   |-- nDiscount
        |   |   |   |-- NDiscount.jsx
        |   |   |   |-- NDiscount.less
        |   |   |   |-- NewNDiscountActivity.jsx
        |   |   |   |-- nDiscountDetailInfo.jsx
        |   |   |-- randomCut
        |   |   |   |-- NewRandomCutActivity.jsx
        |   |   |   |-- randomCutDetailInfo.jsx
        |   |   |-- recommendFood
        |   |   |   |-- NewRecommendFood.jsx
        |   |   |   |-- RecommendTimeInterval.jsx
        |   |   |   |-- recommendFoodDetailInfo.jsx
        |   |   |   |-- selfStyle.less
        |   |   |-- returnGift
        |   |   |   |-- newReturnGiftActivity.jsx
        |   |   |   |-- returnGift.jsx
        |   |   |   |-- returnGiftDetailInfo.jsx
        |   |   |   |-- style.less
        |   |   |-- returnPoint
        |   |   |   |-- NewReturnPointActivity.jsx
        |   |   |   |-- returnPointDetailInfo.jsx
        |   |   |-- special
        |   |       |-- NewSpecialActivity.jsx
        |   |       |-- SpecialDishesTableWithBrand.jsx
        |   |       |-- SpecialDishesTableWithoutBrand.jsx
        |   |       |-- specialDetailInfo.jsx
        |   |-- ShareRules
        |   |   |-- IntlDecor.jsx
        |   |   |-- PromotionSelectModal.jsx
        |   |   |-- index.jsx
        |   |   |-- style.less
        |   |-- SpecialPromotionNEW
        |   |   |-- activityMain.jsx
        |   |   |-- MySpecialActivities
        |   |   |   |-- InviteeModal.jsx
        |   |   |   |-- constant.js
        |   |   |   |-- index.jsx
        |   |   |   |-- specialDetail.less
        |   |   |   |-- specialPromotionDetail.jsx
        |   |   |   |-- specialPromotionDetailHelp.js
        |   |   |-- PayAfter
        |   |   |   |-- PayAfter.jsx
        |   |   |   |-- Three.jsx
        |   |   |   |-- payAfter.less
        |   |   |   |-- stepTwo.jsx
        |   |   |   |-- assets
        |   |   |       |-- jingdong.png
        |   |   |       |-- phone.png
        |   |   |-- accumulateGift
        |   |   |   |-- StepFour.jsx
        |   |   |   |-- index.jsx
        |   |   |   |-- stepTwo.jsx
        |   |   |-- addUpReturnGift
        |   |   |   |-- NewAddUpReturnGift.jsx
        |   |   |-- birthdayGift
        |   |   |   |-- BirthdayCardLevelSelector.jsx
        |   |   |   |-- NewBirthdayGift.jsx
        |   |   |   |-- stepTwo.jsx
        |   |   |-- checkInActivities
        |   |   |   |-- CheckInSecondStep.jsx
        |   |   |   |-- LotteryThirdStep.less
        |   |   |   |-- NewCheckGift.jsx
        |   |   |   |-- PrizeContent.jsx
        |   |   |   |-- StepFour.jsx
        |   |   |   |-- defaultCommonData.jsx
        |   |   |-- colorsEggCat
        |   |   |   |-- NewColorsEggCat.jsx
        |   |   |-- common
        |   |   |   |-- AccountNoSelector.jsx
        |   |   |   |-- AddGifts.jsx
        |   |   |   |-- BirthBasicInfo.jsx
        |   |   |   |-- CardLevel.jsx
        |   |   |   |-- CardLevelForWX.jsx
        |   |   |   |-- EditBoxForShops.jsx
        |   |   |   |-- ExcludeCardTable.jsx
        |   |   |   |-- ExcludeGroupTable.jsx
        |   |   |   |-- ExpandTree.jsx
        |   |   |   |-- MsgSelector.jsx
        |   |   |   |-- NewPromotion.jsx
        |   |   |   |-- PhotoFrame.jsx
        |   |   |   |-- QrModal.jsx
        |   |   |   |-- SendMsgInfo.jsx
        |   |   |   |-- SpecialPromotionDetailInfo.jsx
        |   |   |   |-- SpecialPromotionDetailInfoHelp.jsx
        |   |   |   |-- SpecialPromotionExportModal.jsx
        |   |   |   |-- SpecialRangeInfo.jsx
        |   |   |   |-- StepOneWithDateRange.jsx
        |   |   |   |-- addGifts.less
        |   |   |-- expansionGifts
        |   |   |   |-- index.jsx
        |   |   |-- freeGet
        |   |   |   |-- NewFreeGet.jsx
        |   |   |-- giveGiftsToNewFollowers
        |   |   |   |-- stepTwo.jsx
        |   |   |   |-- wrapper.jsx
        |   |   |-- instantDiscount
        |   |   |   |-- index.jsx
        |   |   |   |-- stepTwo.jsx
        |   |   |-- newCardGive
        |   |   |   |-- NewCardGive.jsx
        |   |   |-- onLineReturnGift
        |   |   |   |-- NewOnLineReturnGift.jsx
        |   |   |-- perfectReturnGift
        |   |   |   |-- NewPerfectReturnGift.jsx
        |   |   |   |-- StepTwo.jsx
        |   |   |-- recommendGifts
        |   |   |   |-- constant.js
        |   |   |   |-- index.jsx
        |   |   |   |-- readme.md
        |   |   |   |-- recommentGift.less
        |   |   |   |-- Three.jsx
        |   |   |   |-- stepTwo.jsx
        |   |   |-- scoreConvert
        |   |   |   |-- NewScoreConvert.jsx
        |   |   |-- sendGifts
        |   |   |   |-- NewSendGifts.jsx
        |   |   |   |-- stepTwo.jsx
        |   |   |-- sendMsgs
        |   |   |   |-- NewSendMsgs.jsx
        |   |   |   |-- stepTwo.jsx
        |   |   |-- shackGift
        |   |   |   |-- LotteryThirdStep.jsx
        |   |   |   |-- LotteryThirdStep.less
        |   |   |   |-- NewShackGift.jsx
        |   |   |   |-- PrizeContent.jsx
        |   |   |   |-- defaultCommonData.jsx
        |   |   |   |-- TicketBag
        |   |   |       |-- AddModal.jsx
        |   |   |       |-- AxiosFactory.jsx
        |   |   |       |-- Common.jsx
        |   |   |       |-- MainTable.jsx
        |   |   |       |-- QueryForm.jsx
        |   |   |       |-- bag.less
        |   |   |       |-- index.jsx
        |   |   |-- shareGifts
        |   |   |   |-- index.jsx
        |   |   |   |-- stepTwo.jsx
        |   |   |-- signUp
        |   |   |   |-- NewSignUp.jsx
        |   |   |-- upGradeReturnGift
        |   |   |   |-- NewUpGradeReturnGift.jsx
        |   |   |   |-- stepTwo.jsx
        |   |   |-- wakeUpReturnGift
        |   |       |-- NewWakeUpReturnGift.jsx
        |   |-- TrdPromotionInterface
        |   |   |-- MicroneMemberSet.jsx
        |   |   |-- Tab.jsx
        |   |   |-- TrdMember.jsx
        |   |   |-- index.jsx
        |   |   |-- trdCrm.less
        |   |-- WeChatCouponManagement
        |   |   |-- PayAccountModal.jsx
        |   |   |-- WeChatCouponCard.jsx
        |   |   |-- WeChatCouponCreate.jsx
        |   |   |-- WeChatCouponDetail.jsx
        |   |   |-- WeChatCouponDetailModal.jsx
        |   |   |-- WeChatCouponList.jsx
        |   |   |-- index.jsx
        |   |   |-- style.less
        |   |-- WeChatMall
        |   |   |-- AddNew.jsx
        |   |   |-- PromotionList.jsx
        |   |   |-- WeChatMaLLActivityMain.jsx
        |   |   |-- style.less
        |   |   |-- groupSale
        |   |   |   |-- BasicInfo.jsx
        |   |   |   |-- SettingInfo.jsx
        |   |   |   |-- Wrapper.jsx
        |   |   |-- miaosha
        |   |   |   |-- BasicInfo.jsx
        |   |   |   |-- SettingInfo.jsx
        |   |   |   |-- Wrapper.jsx
        |   |   |-- returnPoints
        |   |       |-- BasicInfo.jsx
        |   |       |-- ScopeInfo.jsx
        |   |       |-- SettingInfo.jsx
        |   |       |-- Wrapper.jsx
        |   |-- ZhiFuBaoCouponManagement
        |       |-- ZhiFuBaoCouponList.jsx
        |       |-- index.jsx
        |       |-- style.less
        |-- helpers
        |   |-- apiConfig.js
        |   |-- callserver.jsx
        |   |-- env.jsx
        |   |-- util.jsx
        |-- i18n
        |   |-- common
        |   |   |-- gift.jsx
        |   |   |-- index.jsx
        |   |   |-- injectDecorator.jsx
        |   |   |-- salecenter.jsx
        |   |   |-- special.jsx
        |   |-- locales
        |       |-- en.js
        |       |-- en.messages.json
        |       |-- fr.js
        |       |-- fr.messages.js
        |       |-- ja.js
        |       |-- ja.messages.json
        |       |-- ko.js
        |       |-- ko.messages.json
        |       |-- zh-cn.js
        |       |-- zh-cn.messages.json
        |       |-- zh-tw.js
        |       |-- zh-tw.messages.json
        |-- redux
        |   |-- actions
        |   |   |-- actions.jsx                             // actions文件
        |   |   |-- decoration
        |   |   |   |-- index.jsx
        |   |   |-- saleCenterNEW
        |   |   |   |-- crmCardType.action.js
        |   |   |   |-- crmOperation.action.jsx
        |   |   |   |-- fullCutActivity.action.js
        |   |   |   |-- index.js
        |   |   |   |-- myActivities.action.js
        |   |   |   |-- mySpecialActivities.action.js
        |   |   |   |-- promotion.action.js
        |   |   |   |-- promotionAutoRun.action.jsx
        |   |   |   |-- promotionBasicInfo.action.js
        |   |   |   |-- promotionDetailInfo.action.js
        |   |   |   |-- promotionScopeInfo.action.js
        |   |   |   |-- queryWeixinAccounts.action.js
        |   |   |   |-- saleCenter.js
        |   |   |   |-- specialPromotion.action.js
        |   |   |   |-- types.js
        |   |   |-- shareRules
        |   |       |-- index.jsx
        |   |-- modules
        |   |   |-- index.js
        |   |-- reducer
        |       |-- reducers.jsx
        |       |-- decoration
        |       |   |-- index.jsx
        |       |-- saleCenterNEW
        |       |   |-- crmCardType.reducer.js
        |       |   |-- fullCut.reducer.js
        |       |   |-- myActivities.reducer.js
        |       |   |-- mySpecialActivities.reducer.js
        |       |   |-- promotionAutoRun.reducer.jsx
        |       |   |-- promotionBasicInfo.reducer.js
        |       |   |-- promotionDetailInfo.reducer.js
        |       |   |-- promotionScopeInfo.reducer.js
        |       |   |-- queryWeixinAccounts.reducer.js
        |       |   |-- saleCenter.reducer.js
        |       |   |-- specialPromotion.reducer.js
        |       |-- shareRules
        |           |-- index.jsx
        |-- style
        |   |-- var.less
        |-- utils
            |-- index.jsx
```
