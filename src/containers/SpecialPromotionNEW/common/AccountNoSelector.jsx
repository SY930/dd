import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Select,
} from 'antd';
import {
    queryFsmGroupEquityAccount,
} from "../../../redux/actions/saleCenterNEW/specialPromotion.action";
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_SPE } from 'i18n/common/special';


@injectIntl
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
                        placeholder={this.props.intl.formatMessage(STRING_SPE.d2c89ie2cc0293)}
                        getPopupContainer={(node) => node.parentNode}
                >
                    {
                        accountInfoList.map((accountInfo) => (
                            <Select.Option
                                key={accountInfo.accountNo}
                                disabled={!accountInfo.hasPermission}
                            >
                                {accountInfo.accountName}
                            </Select.Option>
                        ))
                    }
                </Select>
                {index > -1 && (
                    <div key={accountInfoList[index].accountNo}  style={{ margin: '8px 8px 0', color: accountInfoList[index].smsCount ? 'inherit' : 'red'}}>{`${this.props.intl.formatMessage(STRING_SPE.d454642qgm0190)}${accountInfoList[index].smsCount || 0}${this.props.intl.formatMessage(STRING_SPE.dk45jg26g8152)}`}</div>
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
