/**
 * 设置单个礼品，多个礼品参考下单抽抽乐的
 */
import React, { PureComponent as Component } from 'react';
import { Button, Icon } from 'antd'
import css from './style.less';
import Gift from './Gift';
// import { getCardList } from './AxiosFactory';
const href = 'javascript:;';
class MutliGift extends Component {
    state = {
        treeData: [],

    }
    componentDidMount() {
        this.props.dispatch({
            type: 'createActiveCom/couponService_getSortedCouponBoardList',
            payload: {
            },
        }).then((res) => {
            if (res) {
                this.setState({ treeData: res })
            }
        })
    }


    onChange = (params, form) => {
        if (params.giftID) {
            this.props.dispatch({
                type: 'createActiveCom/couponService_getBoards',
                payload: {
                    giftItemID: params.giftID,
                },
            }).then(((res) => {
                if (res) {
                    this.props.onChange(Object.assign(res, { giftID: params.giftID }))
                }
            }))
        }
        // 保存form,验证的时候使用
        this.props.dispatch({
            type: 'createActiveCom/updateState',
            payload: {
                giftForm: form,
            },
        })
        const { value = {} } = this.props
        this.props.onChange(Object.assign(value, params))
    }
    render() {
        const { treeData } = this.state;
        const { value } = this.props;
        return (
            <div className={css.multiGiftBox}>
                {
                    <div className={css.giftBox}>
                        <em>礼品</em>
                        <Gift
                            treeData={treeData}
                            formData={value}
                            onChange={this.onChange}
                        />
                    </div>
                }

            </div>
        )
    }
}

export default MutliGift
