import React, { Component } from 'react';
import {
    Select,
} from 'antd';
import { connect } from 'react-redux';
import {queryWechatMpInfo} from "../../GiftNew/_action";


const mapDispatchToProps = (dispatch) => {
    return {
        queryWechatMpInfo: (params) => {
            dispatch(queryWechatMpInfo(params))
        }
    }
};

const mapStateToProps = (state) => {
    return {
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList').toJS(),
        shopList: state.user.getIn(['accountInfo', 'dataPermissions', 'shopList'])
    }
};

class PushMessageMpID extends Component {
    componentDidMount() {
        const { shopList, queryWechatMpInfo } = this.props;
        const shopIDs = shopList.toJS().map(x=>x.shopID);;
        const params = { shopIDs, pageNo:1, pageSize: 100, mpType: 'SERVICE_AUTH' };
        queryWechatMpInfo(params);
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
        console.log('this.props',this.props );
        return (
            <Select
                notFoundContent={'未搜索到结果'}
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
