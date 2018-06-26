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
    Row,
    Col,
    Form,
    Button,
    Input,
    Select,
} from 'antd';
import { saleCenterSetSpecialBasicInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import MsgSelector from "./MsgSelector";

const FormItem = Form.Item;
const Option = Select.Option;

if (process.env.__CLIENT__ === true) {
    // require('../../../../client/componentsPage.less');
}

const Immutable = require('immutable');

class SendMsgInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            settleUnitID: '',
        };

        this.handleMsgChange = this.handleMsgChange.bind(this);
        this.addMessageInfo = this.addMessageInfo.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    componentDidMount() {
        const specialPromotion = this.props.specialPromotion.get('$eventInfo').toJS();
        specialPromotion.accountInfoList && specialPromotion.accountInfoList instanceof Array && specialPromotion.accountInfoList[0] || (specialPromotion.accountInfoList = []);
        this.setState({
            message: this.props.value,
            settleUnitID: specialPromotion.settleUnitID == '0' ? (specialPromotion.accountInfoList[0] && specialPromotion.accountInfoList[0].settleUnitID || '') :
                (specialPromotion.settleUnitID || (specialPromotion.accountInfoList[0] && specialPromotion.accountInfoList[0].settleUnitID) || ''),
        }, () => {
            this.props.onChange && this.props.onChange({ settleUnitID: this.state.settleUnitID });
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value !== nextProps.value) {
            this.setState({
                message: nextProps.value,
            }, () => {
                this.props.onChange && this.props.onChange(this.state.message);
            })
        }
        if (this.props.settleUnitID === '') {
            const specialPromotion = nextProps.specialPromotion.get('$eventInfo').toJS();
            specialPromotion.accountInfoList && specialPromotion.accountInfoList instanceof Array && specialPromotion.accountInfoList[0] || (specialPromotion.accountInfoList = []);
            this.setState({
                settleUnitID: specialPromotion.settleUnitID == '0' ? (specialPromotion.accountInfoList[0] && specialPromotion.accountInfoList[0].settleUnitID || '') :
                    (specialPromotion.settleUnitID || (specialPromotion.accountInfoList[0] && specialPromotion.accountInfoList[0].settleUnitID) || ''),
            }, () => {
                this.props.onChange && this.props.onChange({ settleUnitID: this.state.settleUnitID });
            })
        }
    }
    handleOptionChange(value) {
        this.setState({
            settleUnitID: value,
        }, () => {
            this.props.onChange && this.props.onChange({ settleUnitID: this.state.settleUnitID });
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
        message += ` [${e.target.textContent}] `;
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
        const settleUnitID = this.state.settleUnitID || (specialPromotion.accountInfoList[0] && specialPromotion.accountInfoList[0].settleUnitID) || '';
        if (this.props.sendFlag) {
            return (
                <div>
                    <FormItem
                        label="短信结算账户"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <Select onChange={this.handleOptionChange} value={settleUnitID}>
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

                    <FormItem
                        label="选择短信模板"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {getFieldDecorator('message', {
                            initialValue: this.state.message,
                            onChange: this.handleMsgChange,
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
