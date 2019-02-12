import React, {Component} from 'react';
import {
    Table,
    Modal,
    Spin,
} from 'antd';
import {axiosData} from "../../helpers/util";
import style from './style.less';
import WeChatCouponDetail from "./WeChatCouponDetail";


class WeChatCouponDetailModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            fulfilledWithError: false,
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
        const {
            couponEntity,
            loading,
        } = this.state;
        return (
            <Spin spinning={loading}>
                <div style={{ minHeight: 400 }}>
                    {
                        !!couponEntity && (
                            <WeChatCouponDetail entity={couponEntity} />
                        )
                    }
                    <div className={style.colorBorderedHeader}>
                        代金券消耗汇总
                    </div>
                </div>
            </Spin>
        )
    }
}

export default WeChatCouponDetailModal
