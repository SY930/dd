import React, {PureComponent} from 'react';
import { Icon,Button, Radio } from 'antd';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import phone from '../../../assets/phoneX.png';
import bg from '../../../assets/bg.png';
import discountOff from '../../../assets/discountOff.png';
import discountOn from '../../../assets/discountOn.png';
import pointOff from '../../../assets/pointOff.png';
import pointOn from '../../../assets/pointOn.png';
import privilegeOfWaitOn from '../../../assets/privilegeOfWaitOn.png';
import privilegeOfWaitOff from '../../../assets/privilegeOfWaitOff.png';
import vipPriceOff from '../../../assets/vipPriceOff.png';
import vipPriceOn from '../../../assets/vipPriceOn.png';
import GiftCfg from "../../../constants/Gift";
import style from 'containers/PromotionDecoration/style.less'
import { iphone } from 'containers/PromotionDecoration/assets';
import daijinquan1 from '../../../assets/daijinquan-1.png';
import daijinquan2 from '../../../assets/daijinquan-2.png';
import daijinquan3 from '../../../assets/daijinquan-3.png';
import caipinyouhuiquan1 from '../../../assets/caipinyouhuiquan-1.png';
import caipinyouhuiquan2 from '../../../assets/caipinyouhuiquan-2.png';
import caipinyouhuiquan3 from '../../../assets/caipinyouhuiquan-3.png';
import caipinduihuanquan1 from '../../../assets/caipinduihuanquan-1.png';
import caipinduihuanquan2 from '../../../assets/caipinduihuanquan-2.png';
import caipinduihuanquan3 from '../../../assets/caipinduihuanquan-3.png';
import daijinquanBg from '../../../assets/daijinquan-bg.png';

const RED_PACKET_MAIN = 'http://res.hualala.com/basicdoc/58873207-f2d1-4489-82de-79ea54ac0f7a.png'

// 所有的礼品类型中预览分3类 常用券类(代金券 菜品券), 充值积分券, 权益券
const PRIMARY_GIFTS = [
    '21', '30', '111', '110', '22','115'
];

const CRM_GIFTS = [
    '40', '42'
];
const COUPON_COMBINE_TYPES =  ['10','20'];
const PREVIEW_ENABLED_GIFTS = [
    ...PRIMARY_GIFTS,
    ...CRM_GIFTS,
    ...COUPON_COMBINE_TYPES,
    '80',
]



// 价值只显示前4位数字
function getValueString(value) {
    const valueString = String(Number(value));
    return valueString.includes('.') ? valueString.substring(0, 8)
        : valueString.substring(0, 5);
}

class PhonePreview extends PureComponent {
    constructor(props){
        super(props);
        this.state={
            
        }
    }
    componentWillReceiveProps(nextProps){
        
    }
    usingTimeTypeString() {
        if (!this.props.couponPeriodSettings) {
            return ' ';
        } else {
            let res;
            try {
                const { couponPeriodSettings } = this.props;
                const arr = couponPeriodSettings.toJS();
                if (Array.isArray(arr)) {
                    res = arr
                        .filter(({periodStart, periodEnd}) => !!periodStart && !!periodEnd)
                        .map(({periodStart, periodEnd}) => (periodStart || '').substring(0, 4).match(/\d{2}/g).join(':') + '-' + (periodEnd || '').substring(0, 4).match(/\d{2}/g).join(':'))
                        .join(', ')
                }
            } catch (e) {
                res = ' '
            }
            return res;
        }
    }

    supportOrderTypeString() {
        if (!this.props.supportOrderTypeLst) {
            return GiftCfg.supportOrderTypeLst.map(item => item.label).join('、');
        } else {
            const { supportOrderTypeLst } = this.props;
            const supportOrderTypeArray = supportOrderTypeLst.toJS();
            return GiftCfg.supportOrderTypeLst.filter(item => supportOrderTypeArray.includes(item.value)).map(item => item.label).join('、')
        }
    }

    shareTypeString() {
        const { giftShareType = '1' } = this.props;
        if (giftShareType == 1) {
            return `本券可与其他优惠券同享`
        } else if (giftShareType == 0) {
            return `本券不可与其他优惠券同享`
        } else if (giftShareType == 2) {
            const { shareIDs } = this.props;
            const resultArr = [];
            (shareIDs ? shareIDs.toJS() : []).forEach(item => {
                resultArr.push(item.giftName)
            });
            const resultString = resultArr.join('，') || '';

            return `本券可与${resultString}${resultString.endsWith('券') ? '' : '券'}共用`
        }
    }

    foodScopesString() {
        const { foodScopes } = this.props;
        const {
            dishes = [],
            excludeDishes = [],
            foodCategory = [],
            categoryOrDish = 0,
        } = foodScopes ? foodScopes.toJS() : {};
        if (categoryOrDish == 0) {
            const categoryStr = `本券适用于${foodCategory.map(cat => cat.foodCategoryName).join('、')} 菜品`;
            if (excludeDishes.length) {
                return categoryStr + `，对${excludeDishes.map(dish => `${dish.foodName}（${dish.unit}）`).join('、')} 菜品不可用`;
            } else {
                return categoryStr;
            }
        } else if (categoryOrDish == 1) {
            return `本券适用于${dishes.map(dish => `${dish.foodName}（${dish.unit}）`).join('、')} 菜品`;
        }
    }

    foodsboxString() {
        const { foodsbox, discountType, giftType } = this.props;
        if (giftType == '111' && discountType == 0) {
            return '本券对店铺所有菜品适用'
        }
        const {
            dishes = [],
            excludeDishes = [],
            foodCategory = [],
            categoryOrDish = 0,
        } = foodsbox ? foodsbox.toJS() : {};
        if ((categoryOrDish == 0 && !foodCategory.length) || (categoryOrDish == 1 && !dishes.length)) {
            return '本券对店铺所有菜品适用'
        } else if (categoryOrDish == 0) {
            const categoryStr = `本券适用于${foodCategory.map(cat => cat.foodCategoryName).join('、')} 菜品`;
            if (excludeDishes.length) {
                return categoryStr + `，对${excludeDishes.map(dish => `${dish.foodName}（${dish.unit}）`).join('、')} 菜品不可用`;
            } else {
                return categoryStr;
            }
        } else if (categoryOrDish == 1) {
            return `本券适用于${dishes.map(dish => `${dish.foodName}（${dish.unit}）`).join('、')} 菜品`;
        }
    }

    /**
     * 商城券适用场景描述
    */
    couponSpecificationOfMall(){
        const { createOrEditFormData: {
            foodSelectType,
            couponFoodScopeList,
            mallExcludedGood,   
            mallCategory,                   // 分类
            mallIncludeGood,                // 包含商品
            mallScope = '0',                // 0, 按分类， 1， 按商品
        }, 
            goodCategories,                 // 商城分类
            goods,                          // 商城商品数据
            giftType
        } = this.props;
        
        // 代金券和菜品优惠券、兑换券不同，前者不选是适用所有，后者必选。所以文案有甄别
        let desc = giftType == '10' ? '商城所有' : ' ';
        // foodSelectType 1为分类
        // 编辑或新建
        if(this.props.createOrEditFormData.hasOwnProperty('mallScope')) {
            if( mallScope == '0' && mallCategory instanceof Array && mallCategory.length > 0) {
                let categorySet = new Set(mallCategory);
                desc = goodCategories.filter((item, index)=>{
                    return categorySet.has(item.value);
                })
                .map((item)=>{
                    return item.categoryName;
                })
                .join('、');
            } else if(mallScope == '1' && mallIncludeGood instanceof Array && mallIncludeGood.length > 0) {
                let goodsSet = new Set(mallIncludeGood);
                desc = goods.filter((item, index)=>{
                    return goodsSet.has(item.goodID);
                })
                .map(item=>{
                    return item.goodName;
                })
                .join('、 ');
            }
        } 
        // 回显
        else if(this.props.createOrEditFormData.hasOwnProperty('foodSelectType')){
            if(foodSelectType == '1' || foodSelectType == '0') {
                if(couponFoodScopeList instanceof Array && couponFoodScopeList.length > 0) {
                    desc = couponFoodScopeList.map((item)=>{
                        return item.targetName;
                    })
                    .join("、 ");
                }
            }
        } else {        // mallScope 及 foodSelectType 属性都不存在（属于新建状态）
            if(mallCategory instanceof Array && mallCategory.length > 0) {
                let categorySet = new Set(mallCategory);
                desc = goodCategories.filter((item, index)=>{
                    return categorySet.has(item.value);
                })
                .map((item)=>{
                    return item.categoryName;
                })
                .join('、');
            }
        }
        return `本券适用于${desc}商品`;
    }

    shopNameString() {
        let {
            shopNames : shopIDs,
            shopSchema,
        } = this.props;
        shopIDs = shopIDs ? shopIDs.toJS() : [];
        if (!shopIDs.length) {
            return '所有门店通用';
        } else {
            const shops = shopSchema ? shopSchema.toJS().shops : [];
            const selectedShopNames = shops.filter(item => shopIDs.includes(item.shopID)).map(shop => shop.shopName);
            return selectedShopNames.join('，')
        }
    }

    renderPrimaryPreviewContent() {
        const { // 默认值与Gift.jsx 中配置一致
            giftName,
            giftValue,
            giftType,
            moneyLimitType,
            moenyLimitValue,
            giftRemark = '',
            isOfflineCanUsing = '1',
            supportOrderType = '2',
            contentHeight,
            showGiftRule,
            giftDiscountRate,
            giftValueCurrencyType ='¥',
            applyScene,                 // 区分店铺券和商家券
        } = this.props;
        return (
            <div className={styles.phonePreviewContentWrapper}>
                <img src={bg} alt="oops"/>
                <div className={styles.valueContainer}>
                    {
                        (!isNaN(giftValue) && giftType != '111' && giftType != '110') &&
                        (<div className={(getValueString(giftValue).length <= 4 ||
                        getValueString(giftValue).includes('.') && getValueString(giftValue).length === 5)
                            ? styles.giftValue : styles.longerGiftValue}>
                            {giftValueCurrencyType}{getValueString(giftValue)}
                        </div>)
                    }
                    {
                        (!!giftDiscountRate && giftType == '111') &&
                        (<div className={styles.giftValue}>
                            {giftDiscountRate}折
                        </div>)
                    }
                    {
                        (giftType == '110') &&
                        (<div
                            className={styles.giftValue}
                            style={{
                                fontSize: '30px',
                                fontWeight: '400'
                            }}
                        >
                            赠
                        </div>)
                    }
                </div>
                {
                    moneyLimitType > 0 && <div className={styles.giftLimitValue}>
                        {`${moneyLimitType == 1 ? `每满` : `满`}${moenyLimitValue}元可用`}
                    </div>
                }

                {
                    !!giftName &&
                    (<div className={styles.giftName}>
                        {giftName}
                    </div>)
                }
                <div className={styles.greenButton}>
                    查看全部券密码
                </div>
                {
                    showGiftRule !== 1 && (
                        <div>
                            <div className={styles.sectionHeader}>
                                使用规则
                            </div>
                            {giftType === '30' && (
                                <div className={styles.ruleSection}>
                                    <p>顾客在获取实物礼品券后，礼品具体领取方式请联系商家，商家会在核对信息无误后进行赠送。</p>
                                </div>
                            )}
                            {giftType !== '30' && (
                                <div className={styles.ruleSection}>
                                    <p>本券可在 {this.usingTimeTypeString()} 时段使用</p>
                                    {giftType !== '22' && applyScene == '0' &&
                                        <p>{`本券适用于${this.supportOrderTypeString()}的订单${isOfflineCanUsing === '0' ? '，仅支持线上使用' : isOfflineCanUsing === '2' ? '，仅支持线下使用' : ''}`}</p>
                                     }
                                     <p>{this.shareTypeString()}</p>
                                    {(giftType == '20' || giftType == '21') &&  applyScene != '1' && <p>{this.foodScopesString()}</p>}
                                    {(giftType == '10' || giftType == '111')  && applyScene != '1' && <p>{this.foodsboxString()}</p>}
                                    { applyScene == '1' && <p>{this.couponSpecificationOfMall()}</p>}
                                </div>
                            )}
                        </div>
                    )
                }
                <div className={styles.sectionHeader}>
                    活动详情
                </div>
                <div className={styles.descriptionSection} style={{overflowWrap: 'break-word'}}>
                    {giftRemark}
                </div>
                <div className={styles.sectionHeader}>
                    {applyScene != '1' ? '适用店铺' : '适用商城'}
                </div>
                <div className={styles.descriptionSection}>
                    {this.renderMallOrShopName()}
                </div>
            </div>
        )
    }

    /**
     * TODO: 这里老代码逻辑处理有问题，后端返回有shopNames字段，直接拿该字段进行渲染是没有问题的。
     * 暂时这么处理
     * @description selectMall 前端的选中商城字段。 shopIDs后端返回的。
     * 回显时，去shopIDs字段，编辑后去selectMall字段。
    */
    renderMallName = () => {
        const { createOrEditFormData: {
            shopIDs,
            selectMall
        } } = this.props;
        let shopSchema = this.props.shopSchema.toJS(); // Imutable data to primitive
        let shopID;
        if(typeof(selectMall) == 'string' && selectMall.length > 0) {
            shopID = selectMall;
        } else if(shopIDs instanceof Array && shopIDs.length == 1) {
            shopID = shopIDs[0];
        }

        if(shopID != undefined) {
            if(shopSchema.hasOwnProperty('shops') && shopSchema.shops instanceof Array) {
                let malls = shopSchema.shops.filter((shop, idx)=>{
                    return shop.shopID == shopID; // 0 为商城， 1 为餐饮店铺
                });
                if(malls.length == 1) {
                    return malls[0].shopName;
                }
            }
        }
        return null;
    }

    renderMallOrShopName = ()=>{
        const { applyScene, selectBrands } = this.props;
        if(applyScene != '1') {
            return this.shopNameString();
        } else {
            return this.renderMallName();
        }
    }

    renderCRMGiftsPreviewContent() {
        const { // 默认值与Gift.jsx 中配置一致
            giftName,
            giftValue,
            giftType,
            showGiftRule,
            giftRemark = '',
        } = this.props;
        return (
            <div className={styles.phonePreviewContentWrapper}>
                <img src={bg} alt="oops"/>
                <div className={styles.valueContainer}>
                    {
                        !isNaN(giftValue) &&
                        (<div className={(getValueString(giftValue).length <= 4 ||
                        getValueString(giftValue).includes('.') && getValueString(giftValue).length === 5)
                            ? styles.giftValue : styles.longerGiftValue}>
                            {
                                giftType === '40' ? `¥${getValueString(giftValue)}` :  `${getValueString(giftValue)}分`
                            }
                        </div>)
                    }
                </div>
                {
                    !!giftName &&
                    (<div className={styles.giftName}>
                        {giftName}
                    </div>)
                }
                <div
                    style={{
                        background: '#fff',
                        marginTop: 10,
                        padding: 10,
                        height: 416,
                    }}
                >
                    {
                        showGiftRule !== 1 && (
                            <div>
                                <div
                                    style={{
                                        paddingLeft: 10,
                                        width: 200,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    使用规则
                                </div>
                                <div className={styles.ruleSection} style={{ lineHeight: 1.5 }}>
                                    {
                                        giftType === '40' ? (
                                            <p>顾客在获取会员充值券后，可以充入其会员卡中当卡值使用</p>
                                        ) : (
                                            <p>顾客在获取会员积分券后，可以充入其会员卡中进行使用</p>
                                        )
                                    }
                                </div>
                            </div>
                        )
                    }
                    <div
                        style={{
                            paddingLeft: 10,
                            width: 200,
                            fontWeight: 'bold',
                        }}
                    >
                        活动详情
                    </div>
                    <div className={styles.descriptionSection} style={{overflowWrap: 'break-word', lineHeight: 1.5}}>
                        {giftRemark}
                    </div>
                </div>

            </div>
        )
    }
    renderRedPacketPreviewContent() {
        const {
            wishing,
            sendName,
        } = this.props;
        return (
            // <div style={{ padding: 20 }}>
            //     <div style={{ fontSize: 18, marginLeft: 20, marginBottom: 20, fontWeight: 'bold'}}>操作指导</div>
            //     <div style={{ lineHeight: 2, background: 'rgb(251,251,251)', padding: 12 }}>

            //     </div>
            // </div>
            <div className={style.previewArea}>
                <img src={iphone} alt=""/>
                <div className={style.simpleDisplayBlock}>
                    <div style={{ height: '150%' }} className={style.imgWrapper}>
                        <div style={{ width: '100%', position: 'relative', height: '100%', overflow: 'hidden' }}>
                            <img src={RED_PACKET_MAIN} style={{ width: '100%' }} alt=""/>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 80,
                                    fontSize: 14,
                                    width: '100%',
                                    padding: '0 50px',
                                    textAlign: 'center',
                                    color: '#FFEFCF',
                                }}
                            >
                                {sendName}
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 120,
                                    fontSize: 18,
                                    width: '100%',
                                    fontWeight: 500,
                                    padding: '0 50px',
                                    textAlign: 'center',
                                    color: '#FFEFCF',
                                }}
                            >
                                {wishing}
                            </div>
                        </div>
                    </div>
                    <Icon className={style.closeBtn}  type="close-circle-o" />
                </div>
            </div>
        )
    }

    renderCRMInterestGiftPreviewContent() {
        const { // 默认值与Gift.jsx 中配置一致
            giftName,
            giftValue,
            giftType,
            showGiftRule,
            hasPrivilegeOfWait,
            isCustomerPrice,
            isDiscountRate,
            isPointRate,
            discountRate,
            pointRate,
            giftRemark = '',
        } = this.props;
        const isDiscountEnabled = isDiscountRate && discountRate < 1;
        const isPointRateEnabled = isPointRate && pointRate > 0;
        return (
            <div
                className={styles.phonePreviewContentWrapper}
                style={{
                    background: '#80C269',
                    padding: '15px 12px',
                }}
            >
                <div className={styles.interestGiftHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.interestGiftName}>
                            {giftName}
                        </div>
                        <div className={styles.iconArea}>
                            <div>
                                <img src={isCustomerPrice ? vipPriceOn : vipPriceOff} alt=""/>
                                <div style={{ color: isCustomerPrice ? '#965B27' : '#999' }}>
                                    会员价
                                </div>
                            </div>
                            <div>
                                <img src={ isDiscountEnabled ? discountOn : discountOff} alt=""/>
                                <div style={{ color: isDiscountEnabled ? '#965B27' : '#999' }}>
                                    会员折扣
                                </div>
                            </div>
                            <div>
                                <img src={isPointRateEnabled ? pointOn : pointOff} alt=""/>
                                <div style={{ color: isPointRateEnabled ? '#965B27' : '#999' }}>
                                    享受积分
                                </div>
                            </div>
                            <div>
                                <img src={hasPrivilegeOfWait ? privilegeOfWaitOn : privilegeOfWaitOff} alt=""/>
                                <div style={{ color: hasPrivilegeOfWait ? '#965B27' : '#999' }}>
                                    享受插队
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.interestGiftBody}>
                    {
                        showGiftRule !== 1 && (
                            <div>
                                <div
                                    style={{
                                        paddingLeft: 10,
                                        width: 200,
                                        fontWeight: 'bold',
                                    }}
                                >
                                    使用规则
                                </div>
                                <div className={styles.ruleSection} style={{ lineHeight: 1.5 }}>
                                    {isCustomerPrice && <p>享受会员价</p>}
                                    {hasPrivilegeOfWait && <p>享受插队</p>}
                                    {isDiscountEnabled && <p>享受折扣</p>}
                                    {isPointRateEnabled && <p>享受积分（{pointRate > 1 ? `消费1元等于${+(+pointRate).toFixed(2)}积分`
                                        : `消费${+(1 / pointRate).toFixed(2)}元等于1积分`}）</p>}

                                </div>
                            </div>
                        )
                    }
                    <div
                        style={{
                            paddingLeft: 10,
                            width: 200,
                            fontWeight: 'bold',
                        }}
                    >
                        活动详情
                    </div>
                    <div
                        className={styles.descriptionSection}
                        style={{
                            overflowWrap: 'break-word',
                            lineHeight: 1.5,
                            padding: '0 10px',
                            marginTop: 5,
                            width: '100%',
                        }}>
                        {giftRemark}
                    </div>
                    <div className={styles.fakeButton}>
                        立即使用
                    </div>
                    <div className={styles.giftTip}>
                        使用后会替换用户当前的权益哦
                    </div>
                </div>

            </div>
        )
    }
    // handleSizeChange(e){
    //     const {value} = e.target;
    //     this.setState({
    //         imgIndex : value
    //     })
    // }
    renderCouponContent(){
        const {
            giftType,
            applyScene,
        } = this.props;
        const imgUrl = {
            '10':{
                '0':daijinquan1,
                '1':daijinquan2,
                '2':daijinquan3,
            },
            '20':{
                '0':caipinyouhuiquan1,
                '1':caipinyouhuiquan2,
                '2':caipinyouhuiquan3,
            },
            '21':{
                '0':caipinduihuanquan1,
                '1':caipinduihuanquan2,
                '2':caipinduihuanquan3,
            }
        }
        let imgSrc = '';
        if(applyScene == '2'){
            imgSrc = imgUrl[giftType]['2']
        }else{
            imgSrc = imgUrl[giftType][applyScene]
        }
        return (
            <div className={styles.couponImgBgWrapper}>
                {/* <div className={styles.imgSelectChange}>
                    <Radio.Group  defaultValue={'0'} onChange={(e) => this.handleSizeChange(e)}>
                        <Radio.Button value="0" disabled={applyScene == '1' ? true : false}>店铺券展示</Radio.Button>
                        <Radio.Button value="1" disabled={applyScene == '0' ? true : false}>商城券展示</Radio.Button>
                    </Radio.Group>
                </div> */}
                <img src={imgSrc}/>
            </div>
        )
    }

    render() {
        const { // 默认值与Gift.jsx 中配置一致
            giftType,
            contentHeight,
            scrollPercent,
        } = this.props;
        const width = (giftType === '90') ? { width:0 }: {};
        return (
            <div
                style={{
                    height: contentHeight,
                    ...width,
                }}
                className={styles.phonePreviewContainer}
            >
                <div className={styles.arrow}/>
                {
                    PREVIEW_ENABLED_GIFTS.includes(giftType) && (
                        <div style={{
                            position: 'relative',
                            transform: contentHeight < 740 ? `translateY(${-(740 - contentHeight) * scrollPercent}px)` : null,
                            left: -18,
                        }}>
                            <img
                                src={COUPON_COMBINE_TYPES.includes(giftType) ? daijinquanBg : phone}
                                alt="oops"
                                style={{
                                    width:COUPON_COMBINE_TYPES.includes(giftType) ? 320 : 394,
                                    position: 'relative',
                                    top: COUPON_COMBINE_TYPES.includes(giftType) ? 30 : 0,
                                    left: COUPON_COMBINE_TYPES.includes(giftType) ?  80 : 39,
                                }}
                            />
                            {PRIMARY_GIFTS.includes(giftType) && this.renderPrimaryPreviewContent() }
                            {CRM_GIFTS.includes(giftType) && this.renderCRMGiftsPreviewContent() }
                            { giftType === '80' && this.renderCRMInterestGiftPreviewContent() }
                            { COUPON_COMBINE_TYPES.includes(giftType) && this.renderCouponContent()}

                        </div>
                    )
                }
                { giftType === '113' && this.renderRedPacketPreviewContent() }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        createOrEditFormData: state.sale_editGiftInfoNew.getIn(['createOrEditFormData']).toJS(),
        selectMall: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'selectMall']),   // 使用商城
        applyScene: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'applyScene']),   // 商城， 1， 店铺 0
        giftName: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftName']),
        giftValue: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftValue']),
        giftValueCurrencyType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftValueCurrencyType']),
        giftShareType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftShareType']), // 共享类型
        shareIDs: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'shareIDs']), // 可共享券
        giftRemark: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftRemark']),
        isOfflineCanUsing: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'isOfflineCanUsing']), // 是否可线下使用, 值为String: 'true' 'false'
        shopNames: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'shopNames']),
        foodNameList: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'foodNameList']),
        shopSchema: state.sale_shopSchema_New.get('shopSchema'),
        supportOrderType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'supportOrderType']),
        supportOrderTypeLst: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'supportOrderTypeLst']),
        moneyLimitType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'moneyLimitTypeAndValue', 'moneyLimitType']),
        moenyLimitValue: state.sale_editGiftInfoNew.getIn(['createOrEditFormData','moneyLimitTypeAndValue', 'moenyLimitValue']),
        giftType: state.sale_editGiftInfoNew.get('currentGiftType'),
        discountType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'discountType']),
        foodsbox: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'foodsboxs']),
        foodScopes: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'foodScopes']),
        pointRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'pointRate']),
        hasPrivilegeOfWait: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'hasPrivilegeOfWait']),
        isCustomerPrice: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'isCustomerPrice']),
        isDiscountRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'isDiscountRate']),
        isPointRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'isPointRate']),
        wishing: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'wishing']),
        sendName: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'sendName']),
        showGiftRule: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'showGiftRule']),
        couponPeriodSettings: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'couponPeriodSettings']),
        giftDiscountRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'discountRate', 'number']), // PriceInput 给出的是{number: xxx}
        discountRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'discountRate']), // antd input 给出的是str
        groupName: state.user.getIn(['accountInfo', 'groupName']),

        // 商城商品及分类信息
        goodCategories: state.sale_promotionDetailInfo_NEW.get('goodCategories').toJS(),
        goods: state.sale_promotionDetailInfo_NEW.get('goods').toJS(),
    }
}

export default connect(mapStateToProps)(PhonePreview)
