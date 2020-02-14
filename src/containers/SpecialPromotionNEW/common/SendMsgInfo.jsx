/**
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
import { jumpPage } from '@hualala/platform-base';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import MsgSelector from "./MsgSelector";
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';




const FormItem = Form.Item;
const Option = Select.Option;

@injectIntl
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
                {accountNo: specialPromotion.accountNo > 0 ? specialPromotion.accountNo : (
                    specialPromotion.equityAccountInfoList.find(account => !!account.hasPermission) || {accountNo: ''}
                ).accountNo},
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
                accountNo: accountNo > 0 ? accountNo : ( // 找到第一个有权限的equityAccount
                    equityAccountInfoList.find(account => !!account.hasPermission) || {accountNo: ''}
                ).accountNo,
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
    jumpAway = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const menuID = this.props.userMenuList.toJS().find(tab => tab.entryCode === 'shop.jituan.equityaccount').menuID
        menuID && jumpPage({ menuID });
        const cancelBtn = document.querySelector('.cancelBtnJs');
        cancelBtn && cancelBtn.click();
    }

    render() {
        const {
            form: { getFieldDecorator },
            minMessageCount = 0,
        } = this.props;
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        const { settleUnitID, accountNo } = this.state;
        // 旧活动, 已设置settleUnitID的情况下, 继续渲染settleUnitID; 其它情况都渲染accountNo, !(accountNo > 0) 是为了防止undefined
        if (this.props.sendFlag) {
            return (
                <div>
                    {
                        specialPromotion.settleUnitID > 0 && !(specialPromotion.accountNo > 0) ? (
                            // 兼容历史数据
                            <FormItem
                                label={this.props.intl.formatMessage(STRING_SPE.d2164480324a406)}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                            >
                                <Select onChange={this.handleSettleUnitIDChange}
                                        value={settleUnitID}
                                        placeholder={this.props.intl.formatMessage(STRING_SPE.d5671dc445081113)}
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
                                                    <div key={accountInfo.settleUnitID}  style={{ margin: '8px 8px 0', color: accountInfo.smsCount ? 'inherit' : 'red'}}>{`${this.props.intl.formatMessage(STRING_SPE.d454642qgm0190)}${accountInfo.smsCount || 0}${this.props.intl.formatMessage(STRING_SPE.dk45jg26g8152)}`}</div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </FormItem>
                        ) : (
                            // 新数据
                            <FormItem
                                label={this.props.intl.formatMessage(STRING_SPE.da8olmb99d0215)}
                                className={styles.FormItemStyle}
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 17 }}
                                required
                                validateStatus={accountNo > 0 ? 'success' : 'error'}
                                help={accountNo > 0 ? '' : `${this.props.intl.formatMessage(STRING_SPE.d34iceo4ec1176)}`}
                            >
                                <Select onChange={this.handleAccountNoChange}
                                        value={accountNo || undefined}
                                        placeholder={this.props.intl.formatMessage(STRING_SPE.db60b40190a02137)}
                                        getPopupContainer={(node) => node.parentNode}
                                >
                                    {(specialPromotion.equityAccountInfoList || []).map((accountInfo) => {
                                        return (
                                            <Option
                                                key={accountInfo.accountNo}
                                                disabled={!accountInfo.hasPermission}
                                            >
                                                {accountInfo.accountName}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <div>
                                    {
                                        (specialPromotion.equityAccountInfoList || []).map((accountInfo) => {
                                            if (accountInfo.accountNo == accountNo) {
                                                return (
                                                    <div key={accountInfo.accountNo}  style={{ margin: '8px 8px 0', color: accountInfo.smsCount ? 'inherit' : 'red'}}>{`${this.props.intl.formatMessage(STRING_SPE.d454642qgm0190)}${accountInfo.smsCount || 0}${this.props.intl.formatMessage(STRING_SPE.dk45jg26g8152)}`}</div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                            </FormItem>
                        )
                    }


                    <FormItem
                        label={this.props.intl.formatMessage(STRING_SPE.d1qe4n63sj3287)}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {getFieldDecorator('message', {
                            initialValue: this.state.message,
                            onChange: this.handleMsgChange,
                            rules: [{
                                required: true,
                                message: `${this.props.intl.formatMessage(STRING_SPE.dojwje9qt4115)}`,
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
            {this.props.intl.formatMessage(STRING_SPE.d1700dd4833c5259)}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        userMenuList: state.user.get('menuList'),
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
