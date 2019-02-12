import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Form,
    Button,
    Icon,
    Select,
    Input,
    message,
    Spin,
} from 'antd';
import registerPage from '../../index';
import style from './style.less'
import { PROMOTION_WECHAT_COUPON_CREATE } from '../../constants/entryCodes';
import emptyBoxImg from '../../assets/empty_box.png';
import {axiosData, fetchData} from "../../helpers/util";
import PayAccountModal from "./PayAccountModal";
import WeChatCouponDetail from "./WeChatCouponDetail";

const FormItem = Form.Item;

const defaultState = {
    /* 表单状态 */
    // couponEntity: null,
    couponEntity: {
        itemID: 123123123,
        batchNo: 123123123,
        couponName: '微信10元代金券',
        couponValue: 10010,
        couponMinimum: 2000,
        couponStockStatus: 16,
        couponTotal: 1000,
        maxQuota: 2,
        isSendNum: 12,
        beginTime: 0,
        endTime: 0,
        createTime: 0,

    },
    isQuerying: false,
    batchNo: null,
    shopAppID: undefined,
    payAccount: undefined,
    isSaving: false,
    allWeChatAccounts: [],
    allPayAccounts: [],
    payAccountModalVisible: false,
}

@registerPage([PROMOTION_WECHAT_COUPON_CREATE])
@Form.create()
@connect(mapStateToProps)
export default class WeChatCouponCreate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...defaultState
        }
    }

    componentDidMount() {
        this.queryAllWeChatAccounts();
        this.queryAllPayAccounts();
    }

    queryAllWeChatAccounts = () => {
        fetchData('queryWechatMpInfo', {}, null, { path: 'mpList', throttle: false })
            .then((mpList) => {
                Array.isArray(mpList) && (
                    this.setState({
                        allWeChatAccounts: mpList.map(item => ({ value: item.appID, label: item.mpName }))
                    })
                )
            }, err => {
                // oops
            })

    }

    queryAllPayAccounts = () => {
        const groupID = this.props.user.accountInfo.groupID
        axiosData(
            `/payCoupon/accountList?groupID=${groupID}`,
            {},
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            this.setState({
                allPayAccounts: []
            })
        }).catch(err => {
                // oops
            }
        )
    }

    handleReset = () => {
        this.props.form.resetFields();
        this.setState({
            ...defaultState,
        })
    }

    handlePayAccountChange = (v) => {
        this.setState({ payAccount: v })
    }

    handleShopAppIDChange = (v) => {
        this.setState({ shopAppID: v })
    }

    handleBatchNoChange = ({ target: { value } }) => {
        this.setState({ batchNo: value })
    }
    handleQuery = () => {
        let flag = true;
        this.props.form.validateFieldsAndScroll({scroll: {offsetBottom: 20}}, err => {
            if (err) flag = false;
        });
        if (!flag) {
            return;
        }
        const { batchNo, shopAppID, payAccount } = this.state;
        this.setState({ isQuerying: true });

        axiosData(
            '/payCoupon/getPayCouponBatch',
            {
                itemID: batchNo,
                shopAppID,
                payAccount,
            },
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            console.log('res: ', res)
            this.setState({ isQuerying: false });
        }).catch(err => this.setState({ isQuerying: false }))
    }

    handleSubmit = () => {
        const { batchNo, shopAppID, payAccount } = this.state;
        this.setState({ isSaving: true });
        axiosData(
            '/payCoupon/addPayCouponInfo',
            {
                batchNo,
                shopAppID,
                payAccount,
            },
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            console.log('res: ', res)
            this.setState({ isSaving: false });
        }).catch(err => this.setState({ isSaving: false }))
    }

    renderHeader() {
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    关联微信支付代金券
                </span>
                <div className={style.spacer} />
            </div>
        )
    }

    renderContent() {
        const { couponEntity, isQuerying, isSaving } = this.state;
        return (
            <Spin spinning={isQuerying}>
                <div className={style.centeredFlex} >
                    {
                        couponEntity ? (
                            <div style={{ width: 600 }}>
                                <div style={{ color: '#787878', margin: '15px 0' }}>
                                    根据条件查询到如下代金券:
                                </div>
                                <WeChatCouponDetail entity={couponEntity}/>
                                <div style={{ margin: 20, textAlign: 'center'}}>
                                    <Button
                                        type="primary"
                                        loading={isSaving}
                                        onClick={this.handleSubmit}
                                    >
                                        确认关联
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                        type="ghost"
                                        onClick={() => this.setState({ couponEntity: null })}
                                    >
                                        暂不关联
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className={style.placeholderBox}>
                                <img src={emptyBoxImg} alt=""/>
                                您还未查询代金券哦~
                            </div>
                        )
                    }
                </div>
            </Spin>
        )
    }

    renderBody() {
        const {
            isQuerying,
            allWeChatAccounts,
            allPayAccounts,
            couponEntity,
        } = this.state;
        const { form: { getFieldDecorator } } = this.props;
        return (
            <div style={{ padding: 20, height: 'calc(100% - 75px)', overflowY: 'auto' }}>
                <div className={style.secondaryTitle}>
                    查询第三方代金券
                </div>
                <div className={style.tableActionRowWithoutMargin}>
                    <FormItem
                        label="制券方商户号"
                        wrapperCol={{span: 16}}
                        labelCol={{span: 8}}
                        required={true}
                        style={{ height: 62 }}
                    >
                        {
                            getFieldDecorator('payAccount', {
                                rules: [{
                                required: true,
                                message: '制券方商户号不得为空',
                            }],
                                onChange: this.handlePayAccountChange,
                            })(<Select
                                placeholder="请选择制券方商户号"
                                disabled={!!couponEntity}
                                style={{ width: 200, marginRight: 20 }}
                            >
                                {
                                    allPayAccounts.map(({ value, label }) => (
                                        <Select.Option key={value} value={value}>{label}</Select.Option>
                                    ))
                                }
                            </Select>)
                        }
                    </FormItem>
                    <a
                        style={{ padding: 6, lineHeight: '30px' }}
                        onClick={() => this.setState({payAccountModalVisible: true})}>
                        + 新增制券方
                    </a>
                    <FormItem
                        label="微信公众号"
                        wrapperCol={{span: 16}}
                        labelCol={{span: 8}}
                        required={true}
                        style={{ height: 62 }}
                    >
                        {
                            getFieldDecorator('shopAppID', {
                                rules: [{
                                    required: true,
                                    message: '微信公众号不得为空',
                                }],
                                onChange: this.handleShopAppIDChange,
                            })(<Select
                                disabled={!!couponEntity}
                                placeholder="请选择微信公众号"
                                style={{ width: 200, marginRight: 20 }}
                            >
                                {
                                    allWeChatAccounts.map(({ value, label }) => (
                                        <Select.Option key={value} value={value}>{label}</Select.Option>
                                    ))
                                }
                            </Select>)
                        }
                    </FormItem>
                    <FormItem
                        label="代金券批次ID"
                        wrapperCol={{span: 16}}
                        labelCol={{span: 8}}
                        required={true}
                        style={{ height: 62 }}
                    >
                        {getFieldDecorator('batchNo', {
                            onChange: this.handleBatchNoChange,
                            rules: [
                                { required: true, message: '代金券批次ID不得为空' },
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v) {
                                            return cb();
                                        }
                                        if ((!/^\d{1,20}$/g.test(v))) {
                                            return cb(rule.message);
                                        }
                                        cb();
                                    },
                                    message: '必须输入数字, 且长度不超过20位',
                                }
                            ]
                        })(<Input
                            placeholder="请输入代金券批次ID"
                            disabled={!!couponEntity}
                            style={{ width: 200, marginRight: 20 }}
                        />)}
                    </FormItem>
                    <div style={{ padding: 6, lineHeight: '30px' }}>
                        <Button
                            type="primary"
                            onClick={this.handleQuery}
                            disabled={isQuerying}
                        >
                            <Icon type="search"/>
                            查询
                        </Button>
                        &nbsp;&nbsp;
                        <Button
                            type="default"
                            onClick={this.handleReset}
                            disabled={isQuerying}
                        >
                            重置
                        </Button>
                    </div>

                </div>
                {this.renderContent()}
            </div>
        )
    }

    render() {
        const { payAccountModalVisible } = this.state;
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                {this.renderBody()}
                {
                    payAccountModalVisible && (
                        <PayAccountModal
                            onCancel={() => this.setState({payAccountModalVisible: false})}
                            onOk={() => {
                                this.setState({payAccountModalVisible: false});
                                this.queryAllPayAccounts();
                            }}
                        />
                    )
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user.toJS(),
    }
}
