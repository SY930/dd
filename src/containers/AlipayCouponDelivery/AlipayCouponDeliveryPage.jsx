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
import PromotionModalContent from './Modal/PromotionModalContent';
import style from './AlipayCoupon.less'
import { getAlipayCouponList, getAlipayPromotionList, queryEventList } from './AxiosFactory';
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
            couponList: [], //  第三方支付宝券
            promotionList: [], // 支付宝大促
            loading: false,
            pageSizes: 20, // 默认显示的条数
            pageNo: 1,
            dataSource: [],
            // totalSize: 0,
        };
    }

    componentDidMount() {
        this.handleQuery(null, null, { eventWay: 20001 }); // 默认传成功页
        this.initData()
    }

    componentWillUnmount() {
    }


    onShowSizeChange = (current, pageSize) => {
    console.log("🚀 ~ file: AlipayCouponDeliveryPage.jsx ~ line 50 ~ AlipayCouponDeliveryPage ~ pageSize", pageSize, current)
        this.setState({
            loading: true,
        }, () => {
            this.handleQuery(1, pageSize)
        })
    };

    handleQuery = (pageNo, pageSize, _opt = {}) => {
        if (!this.state.loading) {
            this.setState({
                loading: true,
            });
        }
        // const _opt = this.getParams();
        const opt = {
            pageSize: pageSize || this.state.pageSizes,
            pageNo: pageNo || this.state.pageNo,
            ..._opt,
        };
        this.queryEvents(opt);
    }

    queryEvents = (opts) => {
        const params = { ...opts };
        queryEventList(params).then((res) => {
            console.log("🚀 ~ file: PromotionPage.jsx ~ line 69 ~ PromotionPage ~ ).then ~ res", res)
            // if (res) {
            const { trdEventInfos = [] } = res;
            this.setState({
                loading: false,
                dataSource: (trdEventInfos || []).map((item, index) => ({ ...item, index: index + 1 })),
                pageNo: res.pageNo || 1,
                pageSizes: res.pageSize || 30,
                total: res.totalSize || 0,
            });
            // }
        })
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


    initData = () => {
        getAlipayCouponList().then((res) => {
            this.setState({
                couponList: res,
            })
        })
        getAlipayPromotionList().then((res) => {
            this.setState({
                promotionList: res,
            })
        })
    }

    handleChangeTabs = (key) => {
        this.setState({
            ...this.state, // 清空数据
            tabKeys: key,
        }, () => {
            // TODO: 传不同的数据
            if (key === 'successPage') { // 成功页
                this.handleQuery(null, null, { eventWay: 20001 }); // 默认传成功页
                // this.clearData()
            } else {
                this.handleQuery(null, null, { eventWay: 20002 }); // 会场大促
                // this.clearData()
            }
        })
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
        const { tabKeys, successModalVisible, promotionModalVisible, dataSource, pageSizes, pageNo, total } = this.state;
        console.log("🚀 ~ file: AlipayCouponDeliveryPage.jsx ~ line 166 ~ AlipayCouponDeliveryPage ~ render ~ dataSource", dataSource)
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
                            <PromotionPage
                                dataSource={dataSource}
                                pageSize={pageSizes}
                                pageNo={pageNo}
                                total={total}
                                handleQuery={this.handleQuery}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        </TabPane>
                    </Tabs>
                </div>
                {
                    successModalVisible && <Modal
                        title="新建支付成功页投放"
                        maskClosable={true}
                        width={700}
                        visible={true}
                        onCancel={this.handleClose}
                    >
                        <SuccessModalContent onCancel={this.handleClose} handleSubmit={this.handleSuccesModalSubmit} />
                    </Modal>
                }
                {
                    promotionModalVisible && <PromotionModalContent
                        onCancel={this.handleClose}
                        couponList={this.state.couponList}
                        promotionList={this.state.promotionList}
                        // dataSource={this.state.dataSource}
                    />
                }
            </div>
        )
    }
}

