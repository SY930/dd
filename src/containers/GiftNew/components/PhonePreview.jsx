import React, {Component} from 'react';
import {connect} from 'react-redux';
import styles from '../GiftAdd/Crm.less';
import phone from '../../../assets/phone.png';
import bg from '../../../assets/bg.png';
import bg1 from '../../../assets/bg1.png';

class PhonePreview extends Component {

    render() {
        return (
            <div className={styles.phonePreviewContainer} >
                <img src={phone}  alt="oops"/>
                <img className={styles.phonePreviewHeader} src={bg1}  alt="oops"/>
                <div className={styles.phonePreviewContentWrapper}>
                    <img src={bg} alt="oops"/>
                    <div className={styles.greenButton}>
                        查看全部券密码
                    </div>
                    <div className={styles.sectionHeader}>
                        使用规则
                    </div>
                    <div className={styles.ruleSection}>
                        <p>本券可在早餐、午餐、下午茶、晚餐、夜宵时段使用</p>
                        <p>本券仅可用于线上支付"订座点菜"及"外卖自提"的订单也可在线下店使用</p>
                        <p>本券可与其他优惠券同享</p>
                        <p>在法律允许的范围内blah在法律允许的范围内blah在法律允许的范围内blah在法律允许的范围内blah</p>
                    </div>
                    <div className={styles.sectionHeader}>
                        活动详情
                    </div>
                    <div className={styles.descriptionSection} style={{overflowWrap: 'break-word'}}>
                        blah blah blah
                    </div>
                    <div className={styles.sectionHeader}>
                        适用店铺
                    </div>
                    <div className={styles.descriptionSection}>
                        哗啦啦测试店, 测试店, 哗啦啦测试店, 测试店
                    </div>

                </div>
                <div className={styles.arrow}/>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(PhonePreview)
