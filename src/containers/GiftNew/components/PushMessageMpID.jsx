import React, { Component } from 'react';
import {
    Select,
} from 'antd';
import { connect } from 'react-redux';
import {queryWechatMpInfo} from "../../GiftNew/_action";


const mapDispatchToProps = (dispatch) => {
    return {
        queryWechatMpInfo: () => {
            dispatch(queryWechatMpInfo())
        }
    }
};

const mapStateToProps = (state) => {
    return {
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS().filter(item => String(item.mpTypeStr) === '21'),
    }
};

class PushMessageMpID extends Component {
    componentDidMount() {
        this.props.queryWechatMpInfo();
    }
    getAllAvailableMpInfo = () => {
        return [
            {
                value: '{}',
                label: '全部',
            },
            ...this.props.allWeChatAccountList.map(item => (
                {
                    value: JSON.stringify({mpID: item.mpID, appID: item.appID}),
                    label: item.mpName,
                }
            ))
        ];
    }
    render() {
        return (
            <Select
                placeholder="请选择微信推送的公众号"
                showSearch={true}
                value={this.props.value || undefined}
                onChange={this.props.onChange}
            >
                {
                    this.getAllAvailableMpInfo().map(({value, label}) => <Option key={value} value={value}>{label}</Option>)
                }
            </Select>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PushMessageMpID)
