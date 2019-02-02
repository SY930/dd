import React, {Component} from 'react';
import {connect} from 'react-redux';
import registerPage from '../../index';
import style from './style.less'
import { PROMOTION_WECHAT_COUPON_CREATE } from '../../constants/entryCodes';
import emptyBoxImg from '../../assets/empty_box.png';

const defaultState = {
    /* 表单状态 */
    couponEntity: null,
    isQuerying: false,
    batchNo: null,
    batchNoStatus: 'success',
    shopAppID: null,
    shopAppIDStatus: 'success',
    payAccount: '',
    payAccountStatus: 'success',
    isSaving: false,
}

@registerPage([PROMOTION_WECHAT_COUPON_CREATE])
class WeChatCouponCreate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...defaultState
        }
    }

    handleReset = () => {
        this.setState({
            ...defaultState,
        })
    }

    renderHeader() {
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    关联微信支付代金券
                </span>
            </div>
        )
    }

    renderBody() {
        return (
            <div style={{ padding: 20, height: 'calc(100% - 75px)' }}>
                <div className={style.secondaryTitle}>
                    查询第三方代金券
                </div>
                <div>

                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                {this.renderBody()}
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

export default connect(mapStateToProps, mapDispatchToProps)(WeChatCouponCreate)
