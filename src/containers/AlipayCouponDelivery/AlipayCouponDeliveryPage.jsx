import React, { Component } from 'react';
import {
    message,
    Button,
    Icon,
    Tabs,
    Modal,
} from 'antd';
// import moment from 'moment';
import SuccessPage from './SuccessPage';
import PromotionPage from './PromotionPage'
import SuccessModalContent from './Modal/SuccessModalContent';
import style from './AlipayCoupon.less'
import { axiosData } from "../../helpers/util";


const TabPane = Tabs.TabPane;

export default class AlipayCouponDeliveryPage extends Component {
    constructor(props) {
        super(props);
        // console.log("🚀 ~ file: AlipayCouponDeliveryPage.jsx ~ line 23 ~ AlipayCouponDeliveryPage ~ constructor ~ props", props)

        this.state = {
            tabKeys: 'successPage',
            successModalVisible: false, // 新建支付成功页头投放弹窗
            promotionModalVisible: false, // 新建会场大促投放弹窗
        };
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

    handleModle = (key) => {
        if (key === 'successPage') {
            this.setState({
                successModalVisible: true,
            })
            return null;
        }
        this.setState({
            promotionModalVisible: true,
        })
        return null;
    }

    handleClose = () => {
        const { tabKeys } = this.state;
        if (tabKeys === 'successPage') {
            this.setState({
                successModalVisible: false,
            })
            return null;
        }
        this.setState({
            promotionModalVisible: false,
        })
        return null;
    }


    render() {
        const { tabKeys, successModalVisible } = this.state;
        return (
            <div style={{ height: '100%' }}>
                <div className={style.AlipayCouponHeader}>
                    <p>支付宝优惠券投放管理</p>
                    <Button
                        type="ghost"
                        onClick={() => {
                            this.handleModle(tabKeys);
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
                <Modal
                    title="新建支付成功页投放"
                    maskClosable={true}
                    width={700}
                    visible={successModalVisible}
                    onCancel={this.handleClose}
                >
                    <SuccessModalContent />
                </Modal>
            </div>
        )
    }
}

