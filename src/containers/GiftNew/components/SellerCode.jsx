import React, {Component} from 'react';
import {
    Select,
} from 'antd';
import {axiosData} from "../../../helpers/util";
const Option = Select.Option;

/**
 * 现金红包选账户小组件
 */
class SellerCode extends Component {

    state = {
        sellerInfoList: []
    };

    componentDidMount() {
        axiosData(
            '/coupon/getRedGiftChannelCompat.ajax',
            {},
            null,
            {path: 'data.channelSettleDataList'},
            'HTTP_SERVICE_URL_PROMOTION_NEW'
        ).then((list) => {
            const sellerInfoList = Array.isArray(list) ? list.map(item => ({ value: `${item.settleId}:${item.merchantNo}:${item.channelCode}`, label: item.settleName })) : [];
            this.setState({ sellerInfoList });
        });
    }

    render() {
        const {
            value,
            onChange,
        } = this.props;
        return (
            <Select
                placeholder="请选择红包发放账户"
                notFoundContent={'未搜索到结果'}
                value={value}
                onChange={onChange}
            >
                {
                    this.state.sellerInfoList.map(item => <Option key={item.value} value={item.value}>{item.label}</Option>)
                }
            </Select>
        )
    }
}

export default SellerCode;
