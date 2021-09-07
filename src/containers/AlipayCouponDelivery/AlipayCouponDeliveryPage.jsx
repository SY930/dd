import React, { Component } from 'react';
import {
    Table,
    message,
    Button,
    Icon,
    Input,
    Select,
    Tooltip,
    Spin,
    Tabs
} from 'antd';
import moment from 'moment';
import SuccessPage from './SuccessPage';
import PromotionPage from './PromotionPage'
import style from './AlipayCoupon.less'
import { axiosData } from "../../helpers/util";


const TabPane = Tabs.TabPane;

export default class AlipayCouponDeliveryPage extends Component {
    constructor(props) {
        super(props);
        // console.log("🚀 ~ file: AlipayCouponDeliveryPage.jsx ~ line 23 ~ AlipayCouponDeliveryPage ~ constructor ~ props", props)

        this.state = {
            tabKeys: 'successPage',
        };
        // this.tableActionRef = null;
        // this.bodyRef = null;
    }

    componentDidMount() {
        // this.onWindowResize();
        // window.addEventListener('resize', this.onWindowResize)
        // this.query();
    }

    componentWillUnmount() {
        // window.removeEventListener('resize', this.onWindowResize)
    }
    // query = () => {
    //     const groupID = this.props.user.accountInfo.groupID
    //     this.setState({ isQuerying: true })
    //     axiosData(
    //         `/payCoupon/getPayCouponBatchList?groupID=${groupID}`,
    //         {},
    //         {},
    //         { path: 'payCouponInfos' },
    //         'HTTP_SERVICE_URL_WECHAT'
    //     ).then(res => {
    //         this.setState({
    //             isQuerying: false,
    //             couponList: Array.isArray(res) ? res : []
    //         })
    //     }).catch(e => {
    //         this.setState({ isQuerying: false })
    //     })
    // }

    onWindowResize = () => {
        // try {
        //     const actionRowHeight = this.tableActionRef.offsetHeight;
        //     const bodyHeight = this.bodyRef.offsetHeight;
        //     // padding: 20
        //     this.setState({ tableHeight: bodyHeight - actionRowHeight - 40 })
        // } catch (e) {
        //     // oops
        // }
    }

    handleChangeTabs = (key) => {
        this.setState({
            tabKeys: key,
        })
    // console.log("🚀 ~ file: AlipayCouponDeliveryPage.jsx ~ line 71 ~ AlipayCouponDeliveryPage ~ v", key)
    }


    render() {
        const { tabKeys } = this.state;
        return (
            <div style={{ height: '100%' }}>
                <div className={style.AlipayCouponHeader}>
                    <p>支付宝优惠券投放管理</p>
                    <Button
                        type="ghost"
                        onClick={() => {
                            // jumpPage({ menuID: PROMOTION_WECHAT_COUPON_CREATE })
                        }}
                    >
                        <Icon type="plus" />
                        新建投放
                    </Button>
                </div>
                <div className={style.AlipayCouponTabs}>
                    <Tabs defaultActiveKey={tabKeys} onChange={this.handleChangeTabs}>
                        <TabPane tab="支付成功页投放" key="successPage">
                            <SuccessPage />
                        </TabPane>
                        <TabPane tab="会场大促活动投放" key="promotionPage">
                            <PromotionPage />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        )
    }
}

