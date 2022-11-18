/*
 * @Author: Songnana
 * @Date: 2022-11-14 16:23:39
 * @Modified By: modifier Songnana
 * @Descripttion: 
 */
const giftTypeName= [
  { label: '全部', value: '' },
  { label: '代金券', value: '10' },
  { label: '菜品优惠券', value: '20' },
  { label: '菜品兑换券', value: '21' },
  { label: '实物礼品券', value: '30' },
  { label: '会员充值券', value: '40' },
  { label: '会员积分券', value: '42' },
  { label: '会员权益券', value: '80' },
  { label: '礼品定额卡', value: '90' },
  { label: '线上礼品卡', value: '91' },
  { label: '买赠券', value: '110' },
  { label: '折扣券', value: '111' },
  { label: '现金红包', value: '113' },
  { label: '配送券', value: '22' },
  { label: '不定额代金券', value: '115' },
];

const GiftCfg = {
giftTypeName: [
  { label: '全部', value: '' },
  { label: '代金券', value: '10' },
  { label: '菜品优惠券', value: '20' },
  { label: '菜品兑换券', value: '21' },
  { label: '实物礼品券', value: '30' },
  { label: '会员充值券', value: '40' },
  { label: '会员积分券', value: '42' },
  { label: '会员权益券', value: '80' },
  { label: '礼品定额卡', value: '90' },
  { label: '线上礼品卡', value: '91' },
  { label: '买赠券', value: '110' },
  { label: '折扣券', value: '111' },
  { label: '现金红包', value: '113' },
  { label: '配送券', value: '22' },
  { label: '特殊权益券', value: '81' },
],
shareType: [
  { label: '全部共享', value: '1' },
  { label: '全部不共享', value: '0'},
  { label: '部分共享', value: '2'},
],
}

export {
  giftTypeName, 
  GiftCfg
}

export const FILTERS = [{
name: 'basicPromotion',
key: 'basicType',
label: '基础营销活动',
options: [
  { value: '2020', label: '折扣' },
  { value: '1010', label: '特价菜' },
  { value: '4010', label: '团购活动' },
  { value: '1050', label: '第二份打折' },
  { value: '1070', label: '加价换购' },
  // {value: '5010',label: '菜品推荐'},
  // {value: '5020',label: '会员专属菜'},
  { value: '1090', label: '加价升级换新' },
  { value: '2010', label: '满减/每满减' },
  { value: '2030', label: '随机立减' },
  { value: '1030', label: '满赠/每满赠' },
  { value: '1020', label: '买赠' },
  { value: '1060', label: '买三免一' },
  { value: '2040', label: '买减/买折' },
  { value: '2050', label: '组合减免/折扣' },
  { value: '1040', label: '搭赠' },
  { value: '2080', label: '低价促销' },
  { value: '1080', label: '累计次数赠送' },
  { value: '2070', label: '累计次数减免' },
  { value: '1021', label: '称重买赠' },
  { value: '10071', label: '拼团活动' },
],
}];
