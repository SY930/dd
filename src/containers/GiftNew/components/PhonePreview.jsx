import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import phone from '../../../assets/phone.png';
import bg from '../../../assets/bg.png';
import bg1 from '../../../assets/bg1.png';

const showPreviewGifts = [
    '10', '20', '21', '30', '111', '110'
];

// 价值只显示前4位数字
function getValueString(value) {
    const valueString = String(Number(value));
    return valueString.includes('.') ? valueString.substring(0, 8)
        : valueString.substring(0, 5);
}

const usingTimeTypeMap = {
    '1' : '早餐',
    '2' : '午餐',
    '3' : '下午茶',
    '4' : '晚餐',
    '5' : '夜宵',
}

const supportOrderTypeMap = {
    '1' : '外送',
    '2' : '堂食及外送',
    '0': '堂食'
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



    render() {
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
            <div
                style={{
                    height: contentHeight
                }}
                className={styles.phonePreviewContainer}
            >
                <div className={styles.arrow}/>
                {showPreviewGifts.includes(giftType) && <div style={{
                    position: 'relative',
                    transform: contentHeight < 740 ? `translateY(${-(740 - contentHeight) * scrollPercent}px)` : null
                }}>
                    <img
                        src={phone}
                        alt="oops"
                        style={{
                            position: 'relative',
                            top: '20px'
                        }}
                    />
                    <img className={styles.phonePreviewHeader} src={bg1}  alt="oops"/>
                    <div className={styles.phonePreviewModifier}>
                        我的优惠券
                    </div>
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
                                <p>{`本券适用于${supportOrderTypeMap[supportOrderType]}的订单，${isOfflineCanUsing === 'true' ? '支持' : '不支持'}到店使用`}</p>
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
                </div>}
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
        moneyLimitType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'moneyLimitType']),
        moenyLimitValue: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'moenyLimitValue']) || '100',
        giftType: state.sale_editGiftInfoNew.get('currentGiftType'),
        discountType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'discountType']),
        foodsbox: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'foodsboxs']),
        couponPeriodSettings: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'couponPeriodSettings']),
        giftDiscountRate: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'discountRate', 'number']),
        groupName: state.user.getIn(['accountInfo', 'groupName']),
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PhonePreview)
