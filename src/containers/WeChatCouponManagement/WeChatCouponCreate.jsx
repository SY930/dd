import React, {Component} from 'react';
import {connect} from 'react-redux';
import { jumpPage } from '@hualala/platform-base'
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
import {PROMOTION_WECHAT_COUPON_CREATE, PROMOTION_WECHAT_COUPON_LIST} from '../../constants/entryCodes';
import emptyBoxImg from '../../assets/empty_box.png';
import {axiosData, fetchData} from "../../helpers/util";
import PayAccountModal from "./PayAccountModal";
import WeChatCouponDetail from "./WeChatCouponDetail";

const FormItem = Form.Item;

const defaultState = {
    /* 表单状态 */
    couponEntity: null,
    isQuerying: false,
    batchNo: null,
    shopAppID: undefined,
    payAccount: undefined,
    isSaving: false,
    payAccountModalVisible: false,
}

@registerPage([PROMOTION_WECHAT_COUPON_CREATE])
@Form.create()
@connect(mapStateToProps)
export default class WeChatCouponCreate extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ...defaultState,
            allWeChatAccounts: [],
            allPayAccounts: [],
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
            { path: 'wechatPayAccounts' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            this.setState({
                allPayAccounts: Array.isArray(res) ? res.map(({ id, subMchName }) => ({ value: `${id}`, label: subMchName})) : [],
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
           // `/payCoupon/getPayCouponBatchFromWechat?batchNum=${9341958}&shopAppID=${'wx9eb8cc99c9acdbee'}&payAccount=${2}`,
           `/payCoupon/getPayCouponBatchFromWechat?batchNum=${batchNo}&shopAppID=${shopAppID}&payAccount=${payAccount}`,
            {},
            {},
            { path: 'payCouponInfo' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            this.setState({
                isQuerying: false,
                couponEntity: res,
            });
        }).catch(err => this.setState({ isQuerying: false }))
    }

    handleSubmit = () => {
        const { batchNo, shopAppID, payAccount } = this.state;
        const groupID = this.props.user.accountInfo.groupID
        this.setState({ isSaving: true });
        axiosData(
            // `/payCoupon/addPayCouponInfo?groupID=${groupID}&batchNum=${9341958}&shopAppID=${'wx9eb8cc99c9acdbee'}&payAccount=${2}`,
            `/payCoupon/addPayCouponInfo?groupID=${groupID}&batchNum=${batchNo}&shopAppID=${shopAppID}&payAccount=${payAccount}`,
            {},
            {},
            { path: 'data' },
            'HTTP_SERVICE_URL_WECHAT'
        ).then(res => {
            message.success('关联成功')
            this.setState({
                isSaving: false,
                couponEntity: null,
            });
            this.props.form.resetFields(['batchNo'])
        }).catch(err => {
            this.setState({
                isSaving: false,
            });
        })
    }

    renderHeader() {
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    关联微信支付代金券
                </span>
                <div className={style.spacer} />
                <Button
                    type="ghost"
                    icon="rollback"
                    onClick={
                        () => {
                            try {
                                const menuID = this.props.user.menuList.find(tab => tab.entryCode === PROMOTION_WECHAT_COUPON_LIST).menuID;
                                menuID && jumpPage({ menuID })
                            } catch (e) {
                                // empty catch
                            }
                        }
                    }>返回列表</Button>
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
                                <div style={{ margin: '20px 20px 20px 106px', textAlign: 'center'}}>
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
                            type="ghost"
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
