import React, {PureComponent} from 'react';
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

// 所有的礼品类型中预览分3类 常用券类(代金券 菜品券), 充值积分券, 权益券
const PRIMARY_GIFTS = [
    '10', '20', '21', '30', '111', '110'
];

const CRM_GIFTS = [
    '40', '42'
];

const PREVIEW_ENABLED_GIFTS = [
    ...PRIMARY_GIFTS,
    ...CRM_GIFTS,
    '80'
]

// 价值只显示前4位数字
function getValueString(value) {
    const valueString = String(Number(value));
    return valueString.includes('.') ? valueString.substring(0, 8)
        : valueString.substring(0, 5);
}

class PhonePreview extends PureComponent {

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

    foodNameListString() {
        const { foodNameList } = this.props;
        let foodNameString = ' ';
        if (typeof foodNameList === 'string') {
            return foodNameString = foodNameList;
        } else {
            const foodNames = foodNameList ? foodNameList.toJS() : [];
            if (foodNames instanceof Array) {
                return `本券仅用于“${foodNames.join('，')}”等菜品`;
            } else if (foodNames.categoryOrDish === '0') {
                return `本券仅用于“${foodNames.dishes.map(food => `${food.foodName}（${food.unit}）`).join('，')}”等菜品`;
            } else if (foodNames.categoryOrDish === '1') {
                return `本券仅用于“${foodNames.foodCategory.map(food => food.foodCategoryName).join('，')}”等分类菜品`;
            }
        }
        return `本券仅用于“${foodNameString}”等菜品`;
    }

    foodScopeString() {
        const { foodsbox, discountType, giftType } = this.props;
        if (giftType == '111' && discountType == 0) {
            return '本券对店铺所有菜品适用'
        }
        const {
            dishes = [],
            excludeDishes = [],
            foodCategory = [],
            foodSelectType = 2
        } = foodsbox ? foodsbox.toJS() : {};
        if (foodSelectType == 2 || (foodSelectType == 1 && !foodCategory.length) || (foodSelectType == 0 && !dishes.length)) {
            return '本券对店铺所有菜品适用'
        } else if (foodSelectType == 1) {
            const categoryStr = `本券适用于${foodCategory.map(cat => cat.foodCategoryName).join('，')} 类菜品`;
            if (excludeDishes.length) {
                return categoryStr + `，对${excludeDishes.map(dish => `${dish.foodName}（${dish.unit}）`).join('，')} 菜品不可用`;
            } else {
                return categoryStr;
            }
        } else if (foodSelectType == 0) {
            return `本券适用于${dishes.map(dish => `${dish.foodName}（${dish.unit}）`).join('，')} 菜品`;
        }
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
            isOfflineCanUsing = 'true',
            supportOrderType = '2',
            contentHeight,
            scrollPercent,
            giftDiscountRate
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
                            &yen;{getValueString(giftValue)}
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
                        <p>{`本券适用于${this.supportOrderTypeString()}的订单，${isOfflineCanUsing === 'true' ? '支持' : '不支持'}到店使用`}</p>
                        <p>{this.shareTypeString()}</p>
                        {(giftType == '20' || giftType == '21') && <p>{this.foodNameListString()}</p>}
                        {(giftType == '10' || giftType == '111') && <p>{this.foodScopeString()}</p>}
                    </div>
                )}

                <div className={styles.sectionHeader}>
                    活动详情
                </div>
                <div className={styles.descriptionSection} style={{overflowWrap: 'break-word'}}>
                    {giftRemark}
                </div>
                <div className={styles.sectionHeader}>
                    适用店铺
                </div>
                <div className={styles.descriptionSection}>
                    {this.shopNameString()}
                </div>
            </div>
        )
    }

    renderCRMGiftsPreviewContent() {
        const { // 默认值与Gift.jsx 中配置一致
            giftName,
            giftValue,
            giftType,
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

    renderCRMInterestGiftPreviewContent() {
        const { // 默认值与Gift.jsx 中配置一致
            giftName,
            giftValue,
            giftType,
            giftDiscountRate,
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



    render() {
        const { // 默认值与Gift.jsx 中配置一致
            giftType,
            contentHeight,
            scrollPercent,
        } = this.props;
        return (
            <div
                style={{
                    height: contentHeight
                }}
                className={styles.phonePreviewContainer}
            >
                <div className={styles.arrow}/>
                {
                    PREVIEW_ENABLED_GIFTS.includes(giftType) && (
                        <div style={{
                            position: 'relative',
                            transform: contentHeight < 740 ? `translateY(${-(740 - contentHeight) * scrollPercent}px)` : null
                        }}>
                            <img
                                src={phone}
                                alt="oops"
                                style={{
                                    position: 'relative',
                                    top: 0,
                                    left: 39,
                                }}
                            />
                            {PRIMARY_GIFTS.includes(giftType) && this.renderPrimaryPreviewContent() }
                            {CRM_GIFTS.includes(giftType) && this.renderCRMGiftsPreviewContent() }
                            { giftType === '80' && this.renderCRMInterestGiftPreviewContent() }
                        </div>
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        giftName: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftName']),
        giftValue: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftValue']),
        usingTimeType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'usingTimeType']), // 使用时段
        giftShareType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftShareType']), // 共享类型
        shareIDs: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'shareIDs']), // 可共享券
        giftRemark: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'giftRemark']),
        isOfflineCanUsing: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'isOfflineCanUsing']), // 是否可线下使用, 值为String: 'true' 'false'
        shopNames: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'shopNames']),
        foodNameList: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'foodNameList']),
        shopSchema: state.sale_shopSchema_New.get('shopSchema'),
        supportOrderType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'supportOrderType']),
        supportOrderTypeLst: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'supportOrderTypeLst']),
        moneyLimitType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'moneyLimitType']),
        moenyLimitValue: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'moenyLimitValue']) || '100',
        giftType: state.sale_editGiftInfoNew.get('currentGiftType'),
        discountType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'discountType']),
        foodsbox: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'foodsboxs']),
        pointRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'pointRate']),
        hasPrivilegeOfWait: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'hasPrivilegeOfWait']),
        isCustomerPrice: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'isCustomerPrice']),
        isDiscountRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'isDiscountRate']),
        isPointRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'isPointRate']),
        couponPeriodSettings: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'couponPeriodSettings']),
        giftDiscountRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'discountRate', 'number']), // PriceInput 给出的是{number: xxx}
        discountRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'discountRate']), // antd input 给出的是str
        groupName: state.user.getIn(['accountInfo', 'groupName']),
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PhonePreview)
