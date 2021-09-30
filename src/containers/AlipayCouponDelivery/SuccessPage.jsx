import React, { Component } from 'react'
import { Form, Input, Button, Icon, Switch, Pagination,  Modal, Table } from 'antd';
import classnames from 'classnames';
import moment from 'moment';
import { axiosData } from '../../helpers/util'
import styles from './AlipayCoupon.less'

const FormItem = Form.Item;
const EVENT_STATUS = {
    0: '待审核',
    1: '执行中',
    2: '已结束',
    13: '审核未通过',
    11: '审核中',
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
        return opt
    }

    getLinkCoupon = () => {

    }

    handleCloseVidwModal = () => {
        this.setState({
            viewModalVisible: false,
        })
    }

    handleView = ({ itemID }) => {
    // console.log("🚀 ~ file: SuccessPage.jsx ~ line 52 ~ SuccessPage ~ itemID", itemID)
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

    handleEdit = (item) => {
    console.log("🚀 ~ file: SuccessPage.jsx ~ line 81 ~ SuccessPage ~ item", item)
        this.props.handleEdit(item)
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
                    {/* <FormItem
                        label="投放ID"
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 18 }}
                    >
                        {getFieldDecorator('title', {
                        })(
                            <Input
                                placeholder="请输入ID"
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
                                            this.handleView(item, false)
                                        }}
                                    >
                                        <div className={styles.activeCardHeader}>
                                            <h3>{item.eventName}</h3>
                                            <Switch size="small" />
                                        </div>
                                        <div>
                                            <p>投放活动ID：</p>
                                            <span>{item.planId}</span>
                                        </div>
                                        <div>
                                            <p>创建时间：</p>
                                            <span className={styles.activeCardTime}>2020.12.21 - 2022.1.31</span>
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
                                            <p>关联优惠券：</p>
                                            <span>{this.getLinkCoupon(item.giftConfInfos)}</span>
                                        </div>
                                        <div>
                                            <p>剩余数量：</p>
                                            <span>0/1000</span>
                                        </div>
                                        <div className={styles.cardBtnBox}>
                                            <div className={styles.cardBtn}
                                                onClick={() => {
                                                    this.handleEdit(item, true)
                                                }}>
                                                <span>编辑</span>
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
            </div>
        )
    }
}

export default Form.create()(SuccessPage);

