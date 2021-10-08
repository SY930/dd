import React, { Component } from 'react'
import { Form, Input, Button, Icon, Switch, Pagination, message, Modal, Table, Row, Col } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import emptyPage from '../../assets/empty_page.png'
import { axiosData } from '../../helpers/util'
import styles from './AlipayCoupon.less'

const FormItem = Form.Item;
const EVENT_STATUS = {
    0: '待审核',
    1: '执行中',
    2: '已结束',
    // 13: '审核未通过',
    // 11: '审核中',
};
class SuccessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewModalVisible: false,
        };
    }

    componentDidMount() {
        // this.handleQuery();
        // this.initData()
    }


    getParams = () => {
        const { form } = this.props
        let opt = {};
        form.validateFields((err, values) => {
            if (!err) {
                opt = { ...values }
            }
        })
        opt.eventWays = ['20001'];
        return opt
    }

    getLinkCoupon = () => {

    }

    handleCloseVidwModal = () => {
        this.setState({
            viewModalVisible: false,
        })
    }

    handleView = (e, { itemID }) => {
        e.stopPropagation();
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

    handleEdit = (e, item) => {
        e.stopPropagation();
        this.props.handleSuccessEdit(item)
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const { handleQuery } = this.props;
        const opt = this.getParams();
        handleQuery(1, null, opt);
    }

    handleChangeStatus = (value, { itemID }) => {
        // e.stopPropagation();
        // console.log("🚀 ~ file: SuccessPage.jsx ~ line 96 ~ SuccessPage ~ value", value);
        const eventStatus = value ? 1 : 0;
        const params = { eventStatus, itemID };
        axiosData(
            'trdEventService/switchStatus.ajax',
            params,
            null,
            { path: '' },
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((res) => {
            const { code, message: msg } = res;
            if (code === '000') {
                message.success('执行成功')
                this.props.handleQuery(null, null, { eventWays: ['20001'] })
            } else {
                message.error(msg)
            }
        })

    }

    render() {
        const { form, dataSource, pageSize, pageNo, total, onShowSizeChange, handleQuery } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className={styles.SuccessPageBox}>
                <Form onSubmit={this.handleSubmit} layout="inline">
                    <FormItem
                        label="投放名称"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('title', {
                        })(
                            <Input
                                placeholder="请输入投放名称"
                            />
                        )}
                    </FormItem>
                    <FormItem
                        label="投放ID"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('itemID', {
                        })(
                            <Input
                                placeholder="请输入ID"
                            />
                        )}
                    </FormItem>
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
                            dataSource.length ? dataSource.map((item) => {
                                return (
                                    <div
                                        className={styles.activeCardItem}
                                        key={item.itemID}
                                        onClick={(e) => {
                                            this.handleView(e, item, false)
                                        }}
                                    >
                                        <div className={styles.activeCardHeader}>
                                            <h3>{item.eventName}</h3>
                                            <div 
                                                style={{ flex: 'none' }}
                                                onClick={e=>e.stopPropagation()}
                                            >
                                                <Switch style={{ position: 'relative', zIndex: '10' }} size="small" value={item.eventStatus != 0} onChange={(value) => { this.handleChangeStatus(value, item) }} />
                                            </div>
                                        </div>
                                        <div>
                                            <p>投放活动ID：</p>
                                            <span>{item.itemID}</span>
                                        </div>
                                        <div>
                                            <p>创建时间：</p>
                                            <span className={styles.activeCardTime}>{
                                                moment(new Date(Number(item.createStamp)), 'YYYYMMDDHHmmss').format('YYYY-MM-DD')
                                            }
                                            </span>
                                            <span className={classnames(styles.cardIcon, {
                                                [styles.pendding]: item.eventStatus == 0 || item.eventStatus == 11,
                                                [styles.execute]: item.eventStatus == 1,
                                                [styles.end]: item.eventStatus == 2,
                                                // [styles.suspend]: item.eventStatus == 13,
                                                // [styles.pendding]: item.eventStatus == 11,
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
                                            <div className={styles.cardBtn}
                                                onClick={(e) => {
                                                    this.handleEdit(e, item, true)
                                                }}>
                                                <span>编辑</span>
                                                {/* <span>删除</span> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <div style={{ textAlign: 'center', width: '100%' }}>
                                <img src={emptyPage} alt="" style={{ width: '50px' }} />
                                <p className={styles.emptyDataText} style={{ marginTop: '12px' }}>暂无数据</p>
                            </div>
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
                        deliveryChannelInfoList={this.props.deliveryChannelInfoList}
                    />
                }
            </div>
        )
    }
}

export default Form.create()(SuccessPage);

class ViewCouponContent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewData: props.viewData || {},
            deliveryChannelInfoList: props.deliveryChannelInfoList || [],
        }
    }
    render() {
        
        const { viewData, deliveryChannelInfoList } = this.state;
        const { stock, receive, merchantType, deliveryInfo } = viewData;
        const findDeliveryInfo = deliveryChannelInfoList.find(item => item.channel == deliveryInfo) || {};
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
                title={'支付成功页活动详情'}
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
                            <p>投放活动ID： <span>{viewData.itemID}</span></p>
                            <p style={{ flex: 'none'}}>支付宝支付成功页： <span>{findDeliveryInfo.channelName}</span></p>
                        </div>
                        <div>
                            <p>创建时间： <span>{moment(new Date(Number(viewData.createStamp)), 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}</span></p>
                        </div>
                    </Col>
                    <Col span={24} className={styles.relationCoupon__table}>
                        <p>关联优惠券：</p>
                        <Table
                            pagination={false}
                            bordered={true}
                            columns={columns}
                            dataSource={viewData.giftConfInfos}
                        />
                    </Col>
                    <div className={styles.promotionFooter__footer}>
                        <Button key="0" onClick={this.props.handleCloseVidwModal}>关闭</Button>
                    </div>
                </Row>
            </Modal>
        )
    }
}
