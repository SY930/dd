import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import phone from '../../../assets/phone.png';
import bg from '../../../assets/bg.png';
import bg1 from '../../../assets/bg1.png';

const showPreviewGifts = [
    '10', '20', '21', '30'
];

// 价值只显示前4位数字
function getValueString(value) {
    if (value === undefined) {
        throw new Error('value cannot be null or undefined!');
    }
    return String(value).substring(0, 4).endsWith('.') ? String(value).substring(0, 5)
        : String(value).substring(0, 4);
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
        if (!this.props.usingTimeType) {
            return `早餐、午餐、下午茶、晚餐、夜宵`;
        } else {
            const { usingTimeType } = this.props;
            const resultArr = [];
            usingTimeType.forEach(item => {
                resultArr.push(usingTimeTypeMap[item])
            });
            return resultArr.join('、');
        }
    }

    shareTypeString() {
        const { giftShareType = '1' } = this.props;
        if (giftShareType == 1) {
            return `本券可与其他优惠券同享；`
        } else if (giftShareType == 0) {
            return `本券不可与其他优惠券同享；`
        } else if (giftShareType == 2) {
            const { shareIDs } = this.props;
            const resultArr = [];
            (shareIDs ? shareIDs.toJS() : []).forEach(item => {
                resultArr.push(item.giftName)
            });
            return `本券可与${resultArr.join('，')}券共用；`
        }
    }

    shopNameString() {
        let {
            shopNames : shopIDs,
            groupName,
            shopSchema,
        } = this.props;
        shopIDs = shopIDs ? shopIDs.toJS() : [];
        if (!shopIDs.length) {
            return `${groupName || ''}所有门店通用`;
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

        } = this.props;
        return (
            <div className={styles.phonePreviewContainer} >
                <div className={styles.arrow}/>
                {showPreviewGifts.includes(giftType) && <div>
                    <img src={phone}  alt="oops"/>
                    <img className={styles.phonePreviewHeader} src={bg1}  alt="oops"/>
                    <div className={styles.phonePreviewContentWrapper}>
                        <img src={bg} alt="oops"/>
                        {
                            !!giftValue &&
                            (<div className={styles.giftValue}>
                                &yen;{getValueString(giftValue)}
                            </div>)
                        }
                        {
                            moneyLimitType > 0 && <div className={styles.giftLimitValue}>
                                {`${moneyLimitType == 1 ? `每满` : `满`}${getValueString(moenyLimitValue)}元可用`}
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
                        <div className={styles.ruleSection}>
                            <p>本券可在 {this.usingTimeTypeString()} 时段使用</p>
                            <p>{`本券适用于${supportOrderTypeMap[supportOrderType]}的订单，${isOfflineCanUsing === 'true' ? '支持' : '不支持'}到店使用`}</p>
                            <p>{this.shareTypeString()}</p>
                        </div>
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
        shopSchema: state.sale_shopSchema_New.get('shopSchema'),
        supportOrderType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'supportOrderType']),
        moneyLimitType: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'moneyLimitType']),
        moenyLimitValue: state.sale_editGiftInfoNew.getIn(['createOrEditFormData', 'moenyLimitValue']) || '100',
        giftType: state.sale_editGiftInfoNew.get('currentGiftType'),
        groupName: state.user.getIn(['accountInfo', 'groupName']),
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PhonePreview)
