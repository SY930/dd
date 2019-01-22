﻿/**
* @Author: Xiao Feng Wang  <xf>
* @Date:   2017-03-15T10:50:38+08:00
* @Email:  wangxiaofeng@hualala.com
* @Filename: promotionScopeInfo.jsx
 * @Last modified by:   xf
 * @Last modified time: 2017-04-08T16:46:12+08:00
* @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
*/

import React from 'react';
import { connect } from 'react-redux';
import {
    Form,
    Select,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import MsgSelector from "./MsgSelector";

const FormItem = Form.Item;
const Option = Select.Option;


class SendMsgInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            settleUnitID: '',
            accountNo: '',
        };

        this.handleMsgChange = this.handleMsgChange.bind(this);
        this.addMessageInfo = this.addMessageInfo.bind(this);
        this.handleAccountNoChange = this.handleAccountNoChange.bind(this);
        this.handleSettleUnitIDChange = this.handleSettleUnitIDChange.bind(this);
    }

    componentDidMount() {
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        this.setState({
            message: this.props.value,
        })
        if (specialPromotion.settleUnitID > 0 && !(specialPromotion.accountNo > 0)) {
            this.setState(
                {settleUnitID: specialPromotion.settleUnitID},
                () => {
                    this.props.onChange({ settleUnitID: this.state.settleUnitID });
                }
            )
        } else {
            this.setState(
                {accountNo: specialPromotion.accountNo > 0 ? specialPromotion.accountNo : (specialPromotion.equityAccountInfoList[0] || {accountNo: ''}).accountNo},
                () => {
                    this.props.onChange({ accountNo: this.state.accountNo });
                }
            )
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                message: nextProps.value,
            }, () => {
                this.props.onChange && this.props.onChange(this.state.message);
            })
        }
        if (!(nextProps.settleUnitID > 0) &&
            (this.props.specialPromotion.getIn(['$eventInfo', 'equityAccountInfoList']) !== nextProps.specialPromotion.getIn(['$eventInfo', 'equityAccountInfoList']))
            && (nextProps.specialPromotion.getIn(['$eventInfo', 'equityAccountInfoList']).size > 0)
        ) {
            const equityAccountInfoList = nextProps.specialPromotion.get('$eventInfo').toJS().equityAccountInfoList;
            const accountNo = nextProps.specialPromotion.getIn(['$eventInfo', 'accountNo']);

            this.setState({
                accountNo: accountNo > 0 ? accountNo : (equityAccountInfoList[0] || {accountNo: ''}).accountNo,
            }, () => {
                this.props.onChange && this.props.onChange({ accountNo: this.state.accountNo });
            })

        }
    }
    handleSettleUnitIDChange(value) {
        this.setState({
            settleUnitID: value,
        }, () => {
            this.props.onChange && this.props.onChange({ settleUnitID: this.state.settleUnitID });
        })
    }
    handleAccountNoChange(value) {
        this.setState({
            accountNo: value,
        }, () => {
            this.props.onChange && this.props.onChange({ accountNo: this.state.accountNo });
        })
    }
    handleMsgChange(message) {
        this.props.form.setFieldsValue({
            message: message,
        });
        this.setState({
            message: message,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.message);
        });
    }
    addMessageInfo(e) {
        let { message } = this.state;
        message += `[${e.target.textContent}]`;
        this.props.form.setFieldsValue({
            message,
        });
        this.setState({
            message,
        }, () => {
            this.props.onChange && this.props.onChange(this.state.message);
        })
    }


    render() {
        const { getFieldDecorator } = this.props.form;
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        const { settleUnitID, accountNo } = this.state;
        // 旧活动, 已设置settleUnitID的情况下, 继续渲染settleUnitID; 其它情况都渲染accountNo, !(accountNo > 0) 是为了防止undefined
        if (this.props.sendFlag) {
            return (
                <div>
                    {
                        specialPromotion.settleUnitID > 0 && !(specialPromotion.accountNo > 0) ? (
                            <FormItem
                                label="短信结算账户"
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <Select onChange={this.handleSettleUnitIDChange}
                                        value={settleUnitID}
                                        placeholder="请选择结算账户"
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    {(specialPromotion.accountInfoList || []).map((accountInfo) => {
                                        return (<Option key={accountInfo.settleUnitID}>{accountInfo.settleUnitName}</Option>)
                                    })}
                                </Select>
                                <div>
                                    {
                                        (specialPromotion.accountInfoList || []).map((accountInfo) => {
                                            if (accountInfo.settleUnitID == settleUnitID) {
                                                return (
                                                    <div key={accountInfo.settleUnitID}  style={{ margin: '8px 8px 0', color: accountInfo.smsCount ? 'inherit' : 'red'}}>{`短信可用条数：${accountInfo.smsCount}条`}</div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </FormItem>
                        ) : (
                            <FormItem
                                label="短信权益账户"
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                required
                                validateStatus={accountNo > 0 ? 'success' : 'error'}
                                help={accountNo > 0 ? '' : '短信权益账户不得为空'}
                            >
                                <Select onChange={this.handleAccountNoChange}
                                        value={accountNo || undefined}
                                        placeholder="请选择权益账户"
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    {(specialPromotion.equityAccountInfoList || []).map((accountInfo) => {
                                        return (<Option key={accountInfo.accountNo}>{accountInfo.accountName}</Option>)
                                    })}
                                </Select>
                                <div>
                                    {
                                        (specialPromotion.equityAccountInfoList || []).map((accountInfo) => {
                                            if (accountInfo.accountNo == accountNo) {
                                                return (
                                                    <div key={accountInfo.accountNo}  style={{ margin: '8px 8px 0', color: accountInfo.smsCount ? 'inherit' : 'red'}}>{`短信可用条数：${accountInfo.smsCount}条`}</div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </FormItem>
                        )
                    }


                    <FormItem
                        label="选择短信模板"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {getFieldDecorator('message', {
                            initialValue: this.state.message,
                            onChange: this.handleMsgChange,
                            rules: [{
                                required: true,
                                message: '必须选择一条短信模板',
                            }],
                        })(
                            <MsgSelector selectedMessage={this.state.message}/>
                        )}

                    </FormItem>
                </div>
            );
        }
        return (
            <div className={styles.noMsg}>
                您没有开启发送短信功能，可以直接跳过该步骤
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SendMsgInfo);
