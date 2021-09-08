import React, { Component } from 'react'
import { Form, Input, Button, Icon, Switch, Pagination } from 'antd';
import styles from './AlipayCoupon.less'

const FormItem = Form.Item;

class SuccessPage extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    componentDidMount() {

    }
    onShowSizeChange = (current, pageSize) => {

    }

    handleSubmit = () => {}

    render() {
        const { form } = this.props;
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
                        {getFieldDecorator('title', {
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
                        <div className={styles.activeCardItem}>
                            <div className={styles.activeCardHeader}>
                                <h3>双十一支付宝投放活动</h3>
                                <Switch size="small" />
                            </div>
                            <div>
                                <p>投放活动ID：</p>
                                <span>1123</span>
                            </div>
                            <div>
                                <p>投放时间：</p>
                                <span className={styles.activeCardTime}>2020.12.21 - 2022.1.31</span>
                                <span className={[styles.cardIcon, styles.execute].join(' ')}>执行中</span>
                            </div>
                            <div>
                                <p>关联优惠券：</p>
                                <span>西直门饺子馆30元代金券</span>
                            </div>
                            <div>
                                <p>领取/投放：</p>
                                <span>0/1000</span>
                            </div>
                            <div className={styles.cardBtnBox}>
                                {/* <div className={styles.activeCardBottomName}>618支付宝活动计划</div> */}
                                <div className={styles.cardBtn}>
                                    <span>编辑</span>
                                    <span>删除</span>
                                </div>
                            </div>
                        </div>  
                        <div className={styles.activeCardItem}>
                            <div className={styles.activeCardHeader}>
                                <h3>双十一支付宝投放活动</h3>
                                <Switch size="small" />
                            </div>
                            <div>
                                <p>投放活动ID：</p>
                                <span>1123</span>
                            </div>
                            <div>
                                <p>投放时间：</p>
                                <span className={styles.activeCardTime}>2020.12.21 - 2022.1.31</span>
                                <span className={[styles.cardIcon, styles.execute].join(' ')}>执行中</span>
                            </div>
                            <div>
                                <p>关联优惠券：</p>
                                <span>西直门饺子馆30元代金券</span>
                            </div>
                            <div>
                                <p>领取/投放：</p>
                                <span>0/1000</span>
                            </div>
                            <div className={styles.cardBtnBox}>
                                {/* <div className={styles.activeCardBottomName}>618支付宝活动计划</div> */}
                                <div className={styles.cardBtn}>
                                    <span>编辑</span>
                                    <span>删除</span>
                                </div>
                            </div>
                        </div>       
                        <div className={styles.activeCardItem}>
                            <div className={styles.activeCardHeader}>
                                <h3>双十一支付宝投放活动</h3>
                                <Switch size="small" />
                            </div>
                            <div>
                                <p>投放活动ID：</p>
                                <span>1123</span>
                            </div>
                            <div>
                                <p>投放时间：</p>
                                <span className={styles.activeCardTime}>2020.12.21 - 2022.1.31</span>
                                <span className={[styles.cardIcon, styles.execute].join(' ')}>执行中</span>
                            </div>
                            <div>
                                <p>关联优惠券：</p>
                                <span>西直门饺子馆30元代金券</span>
                            </div>
                            <div>
                                <p>领取/投放：</p>
                                <span>0/1000</span>
                            </div>
                            <div className={styles.cardBtnBox}>
                                {/* <div className={styles.activeCardBottomName}>618支付宝活动计划</div> */}
                                <div className={styles.cardBtn}>
                                    <span>编辑</span>
                                    <span>删除</span>
                                </div>
                            </div>
                        </div>   
                        <div className={styles.activeCardItem}>
                            <div className={styles.activeCardHeader}>
                                <h3>双十一支付宝投放活动</h3>
                                <Switch size="small" />
                            </div>
                            <div>
                                <p>投放活动ID：</p>
                                <span>1123</span>
                            </div>
                            <div>
                                <p>投放时间：</p>
                                <span className={styles.activeCardTime}>2020.12.21 - 2022.1.31</span>
                                <span className={[styles.cardIcon, styles.execute].join(' ')}>执行中</span>
                            </div>
                            <div>
                                <p>关联优惠券：</p>
                                <span>西直门饺子馆30元代金券</span>
                            </div>
                            <div>
                                <p>领取/投放：</p>
                                <span>0/1000</span>
                            </div>
                            <div className={styles.cardBtnBox}>
                                {/* <div className={styles.activeCardBottomName}>618支付宝活动计划</div> */}
                                <div className={styles.cardBtn}>
                                    <span>编辑</span>
                                    <span>删除</span>
                                </div>
                            </div>
                        </div>
                    
                        <div className={styles.activeCardItem}>
                            <div className={styles.activeCardHeader}>
                                <h3>双十一支付宝投放活动</h3>
                                <Switch size="small" />
                            </div>
                            <div>
                                <p>投放活动ID：</p>
                                <span>1123</span>
                            </div>
                            <div>
                                <p>投放时间：</p>
                                <span className={styles.activeCardTime}>2020.12.21 - 2022.1.31</span>
                                <span className={[styles.cardIcon, styles.execute].join(' ')}>执行中</span>
                            </div>
                            <div>
                                <p>关联优惠券：</p>
                                <span>西直门饺子馆30元代金券</span>
                            </div>
                            <div>
                                <p>领取/投放：</p>
                                <span>0/1000</span>
                            </div>
                            <div className={styles.cardBtnBox}>
                                {/* <div className={styles.activeCardBottomName}>618支付宝活动计划</div> */}
                                <div className={styles.cardBtn}>
                                    <span>编辑</span>
                                    <span>删除</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.activeCardItem}>
                            <div className={styles.activeCardHeader}>
                                <h3>双十一支付宝投放活动</h3>
                                <Switch size="small" />
                            </div>
                            <div>
                                <p>投放活动ID：</p>
                                <span>1123</span>
                            </div>
                            <div>
                                <p>投放时间：</p>
                                <span className={styles.activeCardTime}>2020.12.21 - 2022.1.31</span>
                                <span className={[styles.cardIcon, styles.execute].join(' ')}>执行中</span>
                            </div>
                            <div>
                                <p>关联优惠券：</p>
                                <span>西直门饺子馆30元代金券</span>
                            </div>
                            <div>
                                <p>领取/投放：</p>
                                <span>0/1000</span>
                            </div>
                            <div className={styles.cardBtnBox}>
                                <div className={styles.cardBtn}>
                                    <span>编辑</span>
                                    <span>删除</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.paginationBox}>
                    <Pagination defaultCurrent={3} total={500} showSizeChanger={true} onShowSizeChange={this.onShowSizeChange} showQuickJumper={true} />
                </div>
            </div>
        )
    }
}

export default Form.create()(SuccessPage);

