import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Form,
    Button,
    Icon,
} from 'antd';
import registerPage from '../../index';
import style from './style.less'
import { PROMOTION_WECHAT_COUPON_CREATE } from '../../constants/entryCodes';
import emptyBoxImg from '../../assets/empty_box.png';
import {axiosData} from "../../helpers/util";

const FormItem = Form.Item;

const defaultState = {
    /* 表单状态 */
    couponEntity: null,
    isQuerying: false,
    batchNo: null,
    batchNoStatus: 'success',
    shopAppID: null,
    shopAppIDStatus: 'success',
    payAccount: '',
    payAccountStatus: 'success',
    isSaving: false,
    allWeChatAccounts: [],
    allPayAccounts: [],
}

@registerPage([PROMOTION_WECHAT_COUPON_CREATE])
class WeChatCouponCreate extends Component {

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
        axiosData()
    }

    queryAllPayAccounts = () => {

    }

    handleReset = () => {
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

    renderHeader() {
        return (
            <div className={style.flexHeader} >
                <span className={style.title} >
                    关联微信支付代金券
                </span>
            </div>
        )
    }

    renderContent() {
        const { couponEntity } = this.state;
        return (
            <div className={style.centeredFlex} >
                {
                    couponEntity ? (
                        <div>
                            coupon
                        </div>
                    ) : (
                        <div>

                        </div>
                    )
                }
            </div>
        )
    }

    renderBody() {
        const {
            batchNoStatus,
            batchNo,
            shopAppIDStatus,
            shopAppID,
            payAccount,
            payAccountStatus,
            isQuerying,
            allWeChatAccounts,
            allPayAccounts,
        } = this.state;
        return (
            <div style={{ padding: 20, height: 'calc(100% - 75px)' }}>
                <div className={style.secondaryTitle}>
                    查询第三方代金券
                </div>
                <div className={style.tableActionRow} ref={e => this.tableActionRef = e}>
                    <FormItem
                        label="制券方商户号"
                        wrapperCol={{span: 17}}
                        labelCol={{span: 4}}
                        validateStatus={payAccountStatus}
                        help={payAccountStatus === 'success' ? '' : '制券方商户号不得为空'}
                        required={true}
                    >
                        <Select
                            value={payAccount}
                            onChange={this.handlePayAccountChange}
                            placeholder="请选择制券方商户号"
                            style={{ width: 200, marginRight: 20 }}
                        >
                            {
                                allPayAccounts.map(({ value, label }) => (
                                    <Select.Option key={value} value={value}>{label}</Select.Option>
                                ))
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label="微信公众号"
                        wrapperCol={{span: 17}}
                        labelCol={{span: 4}}
                        validateStatus={shopAppIDStatus}
                        help={shopAppIDStatus === 'success' ? '' : '微信公众号不得为空'}
                        required={true}
                    >
                        <Select
                            value={shopAppID}
                            onChange={this.handleShopAppIDChange}
                            placeholder="请选择制微信公众号"
                            style={{ width: 200, marginRight: 20 }}
                        >
                            {
                                allWeChatAccounts.map(({ value, label }) => (
                                    <Select.Option key={value} value={value}>{label}</Select.Option>
                                ))
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label="代金券批次ID"
                        wrapperCol={{span: 17}}
                        labelCol={{span: 4}}
                        validateStatus={batchNoStatus}
                        help={batchNoStatus === 'success' ? '' : '代金券批次ID不得为空'}
                        required={true}
                    >
                        <Input
                            value={batchNo}
                            onChange={this.handleBatchNoChange}
                            placeholder="请输入代金券批次ID"
                            style={{ width: 200, marginRight: 20 }}
                        />
                    </FormItem>
                    <div>
                        <Button
                            type="primary"
                            onClick={() => console.log(223)}
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
        return (
            <div style={{ height: '100%' }}>
                {this.renderHeader()}
                <div className={style.blockLine} />
                {this.renderBody()}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(WeChatCouponCreate)
