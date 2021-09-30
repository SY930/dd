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
import { getAlipayCouponList, getAlipayPromotionList, queryEventList, getDeliveryChannel } from './AxiosFactory';
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
            successEditData: {}, // 成功页投放编辑数据
            deliveryChannelInfoList: [], // 选择成功页
            // totalSize: 0,
        };
    }

    componentDidMount() {
        this.handleQuery(null, null, { eventWays: ['20001'] }); // 默认传成功页
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
        getDeliveryChannel().then((res) => {
            if (res) {
                this.setState({
                    deliveryChannelInfoList: res,
                })
            }
        });
    }

    handleChangeTabs = (key) => {
        this.setState({
            ...this.state, // 清空数据
            tabKeys: key,
        }, () => {
            // TODO: 传不同的数据
            console.log(key, 'key')
            if (key === 'successPage') { // 成功页
                this.handleQuery(null, null, { eventWays: ['20001'] }); // 默认传成功页
                // this.clearData()
            } else {
                this.handleQuery(null, null, { eventWays: ['20002'] }); // 会场大促
                // this.clearData()
            }
        })
    }

    handleModle = (key) => {
        if (key === 'successPage') {
            this.setState({
                successEditData: {},
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

    handleSuccessEdit = ({ itemID }) => {
    console.log("🚀 ~ file: AlipayCouponDeliveryPage.jsx ~ line 147 ~ AlipayCouponDeliveryPage ~ itemID", itemID)
        const params = { itemID };
        axiosData(
            'trdEventService/getEventDetail.ajax',
            params,
            null,
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        )
            .then((res) => {
                const { data = {}, code } = res;
                if (code === '000') {
                    const { trdEventInfo } = data;
                    this.setState({
                        successEditData: trdEventInfo,
                        successModalVisible: true,
                    });
                }
            })
    }


    render() {
        const { tabKeys, successModalVisible, promotionModalVisible, dataSource, pageSizes, pageNo, total, successEditData } = this.state;
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
                            <SuccessPage
                                dataSource={dataSource}
                                pageSize={pageSizes}
                                pageNo={pageNo}
                                total={total}
                                handleQuery={this.handleQuery}
                                onShowSizeChange={this.onShowSizeChange}
                                handleSuccessEdit={this.handleSuccessEdit}
                                deliveryChannelInfoList={this.state.deliveryChannelInfoList}
                            />
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
                    successModalVisible &&
                    <SuccessModalContent
                        onCancel={this.handleClose}
                        couponList={this.state.couponList}
                        handleQuery={this.handleQuery}
                        editData={successEditData}
                        deliveryChannelInfoList={this.state.deliveryChannelInfoList}
                        // handleModle={}
                    />
                }
                {
                    promotionModalVisible && <PromotionModalContent
                        onCancel={this.handleClose}
                        couponList={this.state.couponList}
                        promotionList={this.state.promotionList}
                        handleQuery={this.handleQuery}
                    />
                }
            </div>
        )
    }
}

