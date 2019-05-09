import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Select,
} from 'antd';
import {
    queryFsmGroupEquityAccount,
} from "../../../redux/actions/saleCenterNEW/specialPromotion.action";

class AccountNoSelector extends Component {

    constructor(props) {
        super(props);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    componentDidMount() {
        this.props.autoFetch && this.props.queryFsmGroupEquityAccount();
    }

    handleOptionChange(value) {
        const accountInfoList = this.props.accountInfoList || [];
        const index = accountInfoList.findIndex(account => String(account.accountNo) === String(value));
        index > -1 && (this.props.onChange && this.props.onChange(accountInfoList[index]));
    }

    render() {
        const accountInfoList = this.props.accountInfoList || [];
        const { value: accountNo } = this.props;
        const index = accountInfoList.findIndex(account => String(account.accountNo) === String(accountNo));
        return (
            <div>
                <Select onChange={this.handleOptionChange}
                        value={accountNo ? String(accountNo) : undefined }
                        placeholder="请选择短信权益账户"
                        getPopupContainer={(node) => node.parentNode}
                >
                    {accountInfoList.map((accountInfo) => (<Select.Option value={String(accountInfo.accountNo)} key={accountInfo.accountNo}>{accountInfo.accountName}</Select.Option>))}
                </Select>
                {index > -1 && (
                    <div key={accountInfoList[index].accountNo}  style={{ margin: '8px 8px 0', color: accountInfoList[index].smsCount ? 'inherit' : 'red'}}>{`短信可用条数：${accountInfoList[index].smsCount || 0}条`}</div>
                )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        accountInfoList: state.sale_specialPromotion_NEW.get('$eventInfo').toJS().equityAccountInfoList,
        user: state.user.toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        queryFsmGroupEquityAccount: (opts) => {
            dispatch(queryFsmGroupEquityAccount(opts))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountNoSelector);
