import React, { Component } from 'react'
import { Form, Input, Button, Icon, Pagination, Col, Row, Modal, Table } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import emptyPage from '../../../assets/empty_page.png'
import { axiosData } from '../../../helpers/util'
import styles from '../AlipayCoupon.less'

const FormItem = Form.Item;
const EVENT_STATUS = {
    0: '待审核',
    1: '执行中',
    2: '已结束',
    13: '审核未通过',
    11: '审核中',
};
const ENROLLSCENETYPE = {
    MINI_APP: '小程序报名场景',
    VOUCHER: '券报名场景',
}

class PromotionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            viewModalVisible: false,
        };
    }


    componentDidMount() {
    }


    getParams = () => {
        const { form } = this.props
        let opt = {};
        form.validateFields((err, values) => {
            if (!err) {
                opt = { ...values }
            }
        })
        opt.eventWays = ['20002'];
        return opt
    }


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
        handleQuery(1, null, opt);
    }

    render() {
        const { form, dataSource, pageSize, pageNo, total, onShowSizeChange, handleQuery } = this.props;
        const { getFieldDecorator } = form;
        const opt = this.getParams();
        return (
            <div className={styles.PromotionPageBox}>
                <Form onSubmit={this.handleSubmit} layout="inline">
                    <FormItem
                        label="投放名称"
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {getFieldDecorator('eventName', {
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
                    {/* <FormItem
                        label="支付宝会场大促计划名称"
                        labelCol={{ span: 9 }}
                        wrapperCol={{ span: 15 }}
                        style={{ width: '400px' }}
                    >
                        {getFieldDecorator('marketingName', {
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
                            dataSource.length ? dataSource.map((item) => {
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
                                            <span>{item.itemID}</span>
                                        </div>
                                        <div>
                                            <p>创建时间：</p>
                                            <span className={styles.activeCardTime}>{
                                                moment(new Date(Number(item.createStamp)), 'YYYYMMDDHHmmss').format('YYYY-MM-DD')
                                            }</span>
                                            <span className={classnames(styles.cardIcon, {
                                                [styles.pendding]: item.eventStatus == 0 || item.eventStatus == 11,
                                                [styles.execute]: item.eventStatus == 1,
                                                [styles.end]: item.eventStatus == 2,
                                                [styles.suspend]: item.eventStatus == 13,
                                                // [styles.pendding]: item.eventStatus == 11,
                                            })}
                                            >{EVENT_STATUS[item.eventStatus] || '--'}</span>
                                        </div>
                                        <div>
                                            {/* <p>投放场景：</p>
                                            <span>{ENROLLSCENETYPE[item.enrollSceneType] || '--'}</span> */}
                                        </div>
                                        {/*
                                        <div>
                                            <p>剩余数量：</p>
                                            <span>0/1000</span>
                                        </div> */}
                                        <div className={styles.cardBtnBox}>
                                            {
                                                item.marketingName && <div className={styles.activeCardBottomName}>{item.marketingName}</div>
                                            }
                                            <div className={styles.cardBtn}>
                                                {/* <span>编辑</span> */}
                                                {/* <span>删除</span> */}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : <div style={{textAlign: 'center', width: '100%' }}>
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
                        pageSizeOptions={['25','50','100','200']}
                        total={total}
                        showSizeChanger={true}
                        onShowSizeChange={(page, pageSizes) => {
                            handleQuery(page, pageSizes, opt)
                        }}
                        showQuickJumper={true}
                        onChange={(page, pageSizes) => {
                            handleQuery(page, pageSizes, opt)
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
                            <p>投放活动ID： <span>{viewData.itemID}</span></p>
                            <p>支付宝大促： <span>{viewData.marketingName}</span></p>
                        </div>
                        <div>
                            <p>投放时间： <span>{moment(new Date(Number(viewData.createStamp)), 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}</span></p>
                            <p>投放场景： <span>{ENROLLSCENETYPE[viewData.enrollSceneType] || '--'}</span></p>
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
