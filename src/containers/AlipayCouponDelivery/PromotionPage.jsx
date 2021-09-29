import React, { Component } from 'react'
import { Form, Input, Button, Icon, Switch, Pagination, Col, Row, Modal, Table } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import { getAlipayCouponList, queryEventList } from './AxiosFactory';
import { axiosData } from '../../helpers/util'
import styles from './AlipayCoupon.less'

const FormItem = Form.Item;
const EVENT_STATUS = {
    0: '待审核',
    1: '执行中',
    2: '已结束',
    13: '审核未通过',
};

class PromotionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewModalVisible: false,
            // loading: false,
            // pageSizes: 20, // 默认显示的条数
            // pageNum: 1,
            // dataSource: [],
        };
    }


    componentDidMount() {
        // this.handleQuery();
        // this.initData()
    }

    // onShowSizeChange = (current, pageSize) => {
    //     this.setState({
    //         loading: true,
    //     }, () => {
    //         this.handleQuery(1, pageSize)
    //     })
    // };

    getParams = () => {
        const { form } = this.props
        let opt = {};
        form.validateFields((err, values) => {
            if (!err) {
                opt = { ...values }
            }
        })
        return opt
    }

    // handleQuery = (pageNum, pageSize) => {
    //     if (!this.state.loading) {
    //         this.setState({
    //             loading: true,
    //         });
    //     }
    //     const _opt = this.getParams();
    //     const opt = {
    //         pageSize: pageSize || this.state.pageSizes,
    //         pageNum: pageNum || this.state.pageNum,
    //         ..._opt,
    //     };
    //     this.queryEvents(opt);
    // }

    // queryEvents = (opts) => {
    //     const params = { ...opts };
    //     queryEventList(params).then((res) => {
    //         console.log("🚀 ~ file: PromotionPage.jsx ~ line 69 ~ PromotionPage ~ ).then ~ res", res)
    //         // if (res) {
    //         const { trdEventInfos = [] } = res;
    //         this.setState({
    //             loading: false,
    //             dataSource: (trdEventInfos || []).map((item, index) => ({ ...item, index: index + 1 })),
    //             pageNo: res.pageNo || 1,
    //             pageSizes: res.pageSize || 30,
    //             total: res.totalSize || 0,
    //         });
    //         // }
    //     })
    // }

    getLinkCoupon = (giftConfInfos) => {

    }
    handleCloseVidwModal = () => {
        this.setState({
            viewModalVisible: false,
        })
    }

    handleView = ({ itemID }) => {
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
                    try {
                        const deliveryInfo = JSON.parse(trdEventInfo.deliveryInfo);
                        trdEventInfo.deliveryInfo = deliveryInfo;
                    } catch (error) {
                        trdEventInfo.deliveryInfo = {
                            activeUrl: [],
                        };
                    }
                    this.setState({
                        viewData: trdEventInfo,
                        viewModalVisible: true,
                    });
                }
            })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { handleQuery } = this.props;
        const opt = this.getParams();
        handleQuery(null, null, opt);
    }

    render() {
        const { form, dataSource, pageSize, pageNo, total, onShowSizeChange, handleQuery } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={styles.PromotionPageBox}>
                <Form onSubmit={this.handleSubmit} layout="inline">
                    <FormItem
                        label="投放名称"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('eventName', {
                        })(
                            <Input
                                placeholder="请输入投放名称"
                            />
                        )}
                    </FormItem>
                    {/* <FormItem
                        label="投放ID"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('planId', {
                        })(
                            <Input
                                placeholder="请输入ID"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label="支付宝会场大促计划名称"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 15 }}
                        style={{ width: '400px' }}
                    >
                        {getFieldDecorator('title', {
                        })(
                            <Input
                                placeholder="请输入活动名"
                            />
                        )}
                    </FormItem> */}
                    <FormItem>
                        <Button type="primary" className={styles.speBtn} htmlType="submit">
                            <Icon type="search" />
                            搜索
                        </Button>
                    </FormItem>
                </Form>
                <div className={styles.bottomLine}></div>
                <div className={styles.launchActiveTableBox} style={{ height: 'calc(100% - 204px)' }}>
                    <div style={{ display: 'flex', height: 'auto', flexWrap: 'wrap' }}>
                        {
                            (dataSource || []).map((item) => {
                                return (
                                    <div
                                        className={styles.activeCardItem}
                                        key={item.itemID}
                                        onClick={() => {
                                            this.handleView(item)
                                        }}
                                    >
                                        <div className={styles.activeCardHeader}>
                                            <h3>{item.eventName}</h3>
                                            {/* <Switch size="small" /> */}
                                        </div>
                                        <div>
                                            <p>投放活动ID：</p>
                                            <span>{item.planId}</span>
                                        </div>
                                        <div>
                                            <p>创建时间：</p>
                                            <span className={styles.activeCardTime}>2020.12.21 - 2022.1.31</span>
                                            <span className={classnames(styles.cardIcon, {
                                                [styles.pendding]: item.eventStatus == 0,
                                                [styles.execute]: item.eventStatus == 1,
                                                [styles.end]: item.eventStatus == 2,
                                                [styles.suspend]: item.eventStatus == 13,
                                            })}
                                            >{EVENT_STATUS[item.eventStatus] || '--'}</span>
                                        </div>
                                        <div>
                                            <p>关联优惠券：</p>
                                            <span>{this.getLinkCoupon(item.giftConfInfos)}</span>
                                        </div>
                                        <div>
                                            <p>剩余数量：</p>
                                            <span>0/1000</span>
                                        </div>
                                        <div className={styles.cardBtnBox}>
                                            {/* <div className={styles.activeCardBottomName}>618支付宝活动计划</div> */}
                                            <div className={styles.cardBtn}>
                                                {/* <span>编辑</span> */}
                                                {/* <span>删除</span> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={styles.paginationBox}>
                    <Pagination
                        current={pageNo}
                        pageSize={pageSize}
                        total={total}
                        showSizeChanger={true}
                        onShowSizeChange={onShowSizeChange}
                        showQuickJumper={true}
                        onChange={(page, pageSizes) => {
                            handleQuery(page, pageSizes)
                        }}
                    />
                </div>
                {
                    this.state.viewModalVisible && <ViewCouponContent
                        viewData={this.state.viewData}
                        handleCloseVidwModal={this.handleCloseVidwModal}
                    />
                }
            </div>
        )
    }
}

export default Form.create()(PromotionPage);

class ViewCouponContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewData: props.viewData,
        }
    }
    render() {
        const { viewData } = this.state;
        const { stock, receive, merchantType, merchantID } = viewData;
        const columns = [
            {
                title: '券ID',
                key: 'giftID',
                dataIndex: 'giftID',
            },
            {
                title: '第三方券名称',
                key: 'giftName',
                dataIndex: 'giftName',
            },
            {
                title: '剩余数量',
                key: 'stock',
                dataIndex: 'stock',
                render: (text, record) => {
                    if (text > 0) {
                        return Number(text) - Number(record.receive)
                    }
                }
            }
        ];
        return (
            <Modal
                title={'会场大促活动投放报名详情'}
                maskClosable={true}
                width={700}
                visible={true}
                onCancel={this.props.handleCloseVidwModal}
                footer={null}
            >
                <Row className={styles.CouponViewInfo}>
                    <Col span={24} offset={1} className={styles.signInfo}>
                        <h4>{viewData.eventName}</h4>
                        <div style={{ marginBottom: 12 }}>
                            <p>投放活动ID： <span></span></p>
                            <p>支付宝大促： <span></span></p>
                        </div>
                        <div>
                            <p>投放时间： <span></span></p>
                        </div>
                    </Col>
                    <Col span={24} className={styles.relationCoupon__table}>
                        <p>关联优惠券</p>
                        <Table
                            pagination={false}
                            bordered={true}
                            columns={columns}
                            dataSource={viewData.giftConfInfos}
                        />
                    </Col>
                    <Col>
                        {
                            _.isObject(viewData.deliveryInfo) && viewData.deliveryInfo.activityUrl ? viewData.deliveryInfo.activityUrl.map((item, index) => {
                                return (
                                    <div style={{ marginBottom: 12 }}>
                                        <p>报名活动图片： <span><img src={item.url} alt="" style={{ width: '96px', height: '96px', borderRadius: 4 }} /></span></p>
                                    </div>
                                )
                            }) : null
                        }
                    </Col>
                    <div className={styles.promotionFooter__footer}>
                        <Button key="0" onClick={this.props.handleCloseVidwModal}>关闭</Button>
                    </div>
                </Row>
            </Modal>
        )
    }
}
