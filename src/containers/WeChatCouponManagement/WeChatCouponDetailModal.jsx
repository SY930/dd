import React, {Component} from 'react';
import {
    Table,
    Modal,
} from 'antd';
import {axiosData} from "../../helpers/util";
import style from './style.less';
import WeChatCouponDetail from "./WeChatCouponDetail";


class WeChatCouponDetailModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            couponEntity: null,
        }
    }

    componentDidMount() {
        this.queryCouponDetail();
    }

    queryCouponDetail = () => {
        const { couponID } = this.props;
        this.setState({ loading: true })
        axiosData(
            '/payCoupon/getPayCouponBatch',
            {
                itemID: couponID,
            },
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            console.log('res: ', res)
            this.setState({ isSaving: false });
        }).catch(err => this.setState({ isSaving: false }))
    }

    render() {
        const { couponEntity } = this.state;
        return (
            <div>
                {
                    !!couponEntity && (
                        <WeChatCouponDetail entity={couponEntity} />
                    )
                }
                <div className={}>
                    代金券消耗汇总
                </div>
            </div>
        )
    }
}

export default WeChatCouponDetailModal
