import React, { Component } from 'react';
import {
    Select,
    Checkbox,
} from 'antd';
import { connect } from 'react-redux';
import { fetchData, axiosData } from 'helpers/util';
import styles from '../GiftAdd/Crm.less';
import PriceInput from '../../SaleCenterNEW/common/PriceInput';
import { isZhouheiya } from '../../../constants/WhiteList.jsx';

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
        appsList:[]
    }
    componentDidMount() {
        this.queryWechatMpInfo();

        const { formData: { groupID } } = this.props;
        if (!isZhouheiya(groupID)) {
            this.getMiniProgramsAppIdList();
        }
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
    getMiniProgramsAppIdList = () => {
        const { formData:{groupID} } = this.props;
        axiosData('/miniProgramCodeManage/getApps', {
            'groupID':groupID,
            'page': {
                "current": 1,
                "pageSize": 10000000,
            }
        }, null, {
            path: '',
        }, 'HTTP_SERVICE_URL_WECHAT')
            .then((res) => {
                const { result, apps } = res
                const code = (result || {}).code
                if (code === '000') {
                    this.setState({
                        appsList: apps || []
                    })
                }
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
    getAllAvailableMiniInfo = () => {
        const { appsList } = this.state;
        return [
            ...appsList.map(item => (
                {
                    value: JSON.stringify({mpID: item.appID, appID: item.appID}),
                    label: item.nickName,
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
    handleMiniAccountChange = (v) => {
        this.onTotalChange({
            pushMimiAppMsg: v,
        })
    }
    render() {
        const { formData = {} } = this.props
        const { appsList } = this.state;
        const { sendType, pushMessageMpID, pushMimiAppMsg,reminderTime } = formData.pushMessage
        return (
            <div>
                <div className={styles.leftPart}>
                    <CheckboxGroup
                        width={200}
                        showCheckAll={false}
                        options={[{
                            label: '公众号推送',
                            value: 'wechat',
                        }, {
                            label: '服务通知',
                            value: 'mini',
                        },{
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
                            top: '-10px',
                        }}
                    >
                        {
                            this.getAllAvailableMpInfo().map(({ value, label }) => <Option key={value} value={value}>{label}</Option>)
                        }
                    </Select>
                    <Select
                        notFoundContent={'未搜索到结果'}
                        placeholder="请选择推送的小程序"
                        showSearch={true}
                        value={pushMimiAppMsg || undefined}
                        onChange={this.handleMiniAccountChange}
                        style={{
                            position: 'relative',
                            top: '-4px',
                        }}
                        className={styles.selectMiniProgram}
                    >
                        {
                            this.getAllAvailableMiniInfo().map(({ value, label }) => {
                                return <Option key={value} value={value}>{label}</Option>
                            })
                        }
                    </Select>
                    <span style={{ display: 'inline-block', width: '450px' }}>
                        券到账提醒；券剩余数量提醒；券到期提醒可设置最多5个即将到期时间点推送提醒
                    </span>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PushMessageMpID)
