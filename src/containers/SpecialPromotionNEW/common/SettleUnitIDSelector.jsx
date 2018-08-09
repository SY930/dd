import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Select,
} from 'antd';
const Option = Select.Option;
import {saleCenterQueryFsmGroupSettleUnit} from "../../../redux/actions/saleCenterNEW/specialPromotion.action";

class SettleUnitIDSelector extends Component {

    constructor(props) {
        super(props);
        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    componentDidMount() {
        this.props.autoFetch && this.props.saleCenterQueryFsmGroupSettleUnit({groupID: this.props.user.accountInfo.groupID});
    }

    handleOptionChange(value) {
        const accountInfoList = this.props.accountInfoList || [];
        const index = accountInfoList.findIndex(account => String(account.settleUnitID) === String(value));
        index > -1 && (this.props.onChange && this.props.onChange(accountInfoList[index]));
    }

    render() {
        const accountInfoList = this.props.accountInfoList || [];
        const { value: settleUnitID } = this.props;
        const index = accountInfoList.findIndex(account => String(account.settleUnitID) === String(settleUnitID));
        return (
            <div>
                <Select onChange={this.handleOptionChange}
                        value={settleUnitID ? String(settleUnitID) : undefined }
                        placeholder="请选择短信结算账户"
                        getPopupContainer={(node) => node.parentNode}
                >
                    {accountInfoList.map((accountInfo) => (<Select.Option value={String(accountInfo.settleUnitID)} key={accountInfo.settleUnitID}>{accountInfo.settleUnitName}</Select.Option>))}
                </Select>
                {index > -1 && (
                    <div key={accountInfoList[index].settleUnitID}  style={{ margin: '8px 8px 0', color: accountInfoList[index].smsCount ? 'inherit' : 'red'}}>{`短信可用条数：${accountInfoList[index].smsCount}条`}</div>
                )}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        accountInfoList: state.sale_specialPromotion_NEW.get('$eventInfo').toJS().accountInfoList,
        user: state.user.toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saleCenterQueryFsmGroupSettleUnit: (opts) => {
            dispatch(saleCenterQueryFsmGroupSettleUnit(opts))
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SettleUnitIDSelector);
