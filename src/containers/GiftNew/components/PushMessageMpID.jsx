import React, { Component } from 'react';
import {
    Select,
} from 'antd';
import { connect } from 'react-redux';
import { fetchData, axiosData } from 'helpers/util';

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

const mapStateToProps = (state) => {
    return {
        shopList: state.user.getIn(['accountInfo', 'dataPermissions', 'shopList'])
    }
};

class PushMessageMpID extends Component {
    state = {
        allWeChatAccountList: [],
    }
    componentDidMount() {
        this.queryWechatMpInfo();
    }
    queryWechatMpInfo = () => {
        const { shopList} = this.props;
        const shopIDs = shopList.toJS().map(x=>x.shopID);
        const params = { shopIDs, pageNo:1, pageSize: 100, mpType: 'SERVICE_AUTH' };
        axiosData('/wechat/mpInfoRpcService_queryMpInfoByBindShop.ajax', {...params},
            null, { path: 'data.mpInfoResDataList'}, 'HTTP_SERVICE_URL_CRM')
            .then((data) => {
                this.setState({ allWeChatAccountList: data });
            })
    }
    getAllAvailableMpInfo = () => {
        const { allWeChatAccountList } = this.state;
        return [
            {
                value: '{}',
                label: '全部',
            },
            ...allWeChatAccountList.map(item => (
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
