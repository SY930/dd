import { COMMON_SPE } from "i18n/common/special";
export const getDefaultGiftData = (typeValue = 0, typePropertyName = "sendType") => ({
  // 膨胀所需人数
  needCount: {
      value: "",
      validateStatus: "success",
      msg: null,
  },
  // 礼品数量
  giftCount: {
      value: "",
      validateStatus: "success",
      msg: null,
  },
  // 礼品数量
  giftTotalCount: {
      value: "",
      validateStatus: "success",
      msg: null,
  },
  // 免费活动礼品分数
  giftTotalCopies: {
      value: "",
      validateStatus: "success",
      msg: null,
  },
  // 礼品ID和name
  giftInfo: {
      giftName: null,
      giftItemID: null,
      validateStatus: "success",
      msg: null,
  },
  effectType: "1",
  // 礼品生效时间
  giftEffectiveTime: {
      value: "0",
      validateStatus: "success",
      msg: null,
  },
  // 礼品有效期
  giftValidDays: {
      value: "",
      validateStatus: "success",
      msg: null,
  },
  giftOdds: {
      value: "",
      validateStatus: "success",
      msg: null,
  },
  [typePropertyName]: typeValue,
  // 适用区域
  region: {
      value: '',
      validateStatus: 'success',
      msg: null,
  },
  //领取日期及个数
  segments: [
      {
          getDate: {
              value: [],
              validateStatus: "success",
              msg: null,
          }, //领取日期
          giftTotalCount: {
              value: "",
              validateStatus: "success",
              msg: null,
          }, //领取总数
          id: Date.now().toString(36),
      }
  ]
});

export const getDefaultRecommendSetting = (recommendType = 1) => ({
  recommendType,
  rechargeRate: undefined,
  consumeRate: undefined,
  pointRate: undefined,
  rewardRange: 0,
  presentValue: undefined,
  redPackageLimitValue: undefined,
  redPackageRate: undefined,
});


export const MULTIPLE_LEVEL_GIFTS_CONFIG = [
  {
      type: "63",
      propertyName: "lastConsumeIntervalDays",
      levelLabel: COMMON_SPE.d1e0750k82809,
      levelAffix: COMMON_SPE.k6hk1aa1,
  },
  {
      type: "75",
      propertyName: "needCount",
      levelLabel: COMMON_SPE.k6hk1aid,
      levelAffix: COMMON_SPE.k6hk1aqp,
  },
];

export const descImage = {
  0: (<p
      style={{
          position: "relative",
          top: 20,
          left: 70,
      }}
  >
      小程序分享图
      <br />
      图片建议尺寸：1044*842
      <br />
      支持PNG、JPG格式，大小不超过2M
  </p>),
  1: (
      <p
          style={{
              position: "relative",
              top: 5,
              left: 40,
          }}
      >
          图片建议200*200
          <br />
          点击上传图片，图片格式为jpg、png
          <br />
          不上传则显示默认图片
      </p>
  )
}
