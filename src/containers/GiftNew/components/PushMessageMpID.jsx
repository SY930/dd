import React, { Component } from 'react';
import {
    Select,
    Checkbox,
} from 'antd';
import { connect } from 'react-redux';
import { fetchData, axiosData } from 'helpers/util';
import styles from '../GiftAdd/Crm.less';
import PriceInput from "../../SaleCenterNEW/common/PriceInput";

const CheckboxGroup = Checkbox.Group;
const Option = Select.Option;

const daysOptions = [{
    label: '1',
    value: 1
},{
    label: '2',
    value: 2
},{
    label: '3',
    value: 3
},{
    label: '4',
    value: 4
},{
    label: '5',
    value: 5
},{
    label: '6',
    value: 6
},{
    label: '7',
    value: 7
}]

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
            null, { path: 'data'}, 'HTTP_SERVICE_URL_CRM')
            .then((data) => {
                const { mpInfoResDataList = [] } = data;
                this.setState({ allWeChatAccountList: mpInfoResDataList });
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
    onTotalChange = (data) => {
        const { value, onChange } = this.props;
        const paramsData = {
            ...value,
            ...data,
        };
        onChange(paramsData);
    }
    handleDaysChange = (v) => {
        this.onTotalChange({
            reminderTime: v,
        })
    }
    handleTypeChange = (v) => {
        this.onTotalChange({
            sendType: v,
        })
    }
    handleWechatAccountChange = (v) => {
        this.onTotalChange({
            pushMessageMpID: v,
        })
    }
    render() {
        const { formData = {} } = this.props
        const { sendType, pushMessageMpID, reminderTime } = formData.pushMessage
        return (
            <div>
                <div className={styles.leftPart}>
                    <CheckboxGroup
                        width={200}
                        showCheckAll={false}
                        options={[{
                            label: '微信推送',
                            value: 'wechat',
                        }, {
                            label: '短信推送',
                            value: 'msg',
                        }]}
                        value={sendType}
                        onChange={this.handleTypeChange}
                    />
                </div>
                <div className={styles.rightPart}>
                    <Select
                        notFoundContent={'未搜索到结果'}
                        placeholder="请选择微信推送的公众号"
                        showSearch={true}
                        value={pushMessageMpID || undefined}
                        onChange={this.handleWechatAccountChange}
                        style={{
                            position: 'relative',
                            top: '-4px',
                        }}
                    >
                        {
                            this.getAllAvailableMpInfo().map(({ value, label }) => <Option key={value} value={value}>{label}</Option>)
                        }
                    </Select>
                    <span>
                        到期前
                        <Select
                            notFoundContent={'未搜索到结果'}
                            value={reminderTime}
                            onChange={this.handleDaysChange}
                            style={{
                                width: 55,
                                display: 'inline-block',
                                margin: '0 7px',
                            }}
                        >
                            {
                                daysOptions.map(({ value, label }) => <Option key={value} value={value}>{label}</Option>)
                            }
                        </Select>
                        天提醒
                    </span>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PushMessageMpID)
