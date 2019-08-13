import React, { Component } from 'react';
import { Button, message, Spin, Input } from 'antd';
import { connect } from 'react-redux';
import { axios } from '@hualala/platform-base'
import styles from './trdCrm.less';

class MicroneMemberSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            weimobClientInfos: [
                {
                    clientID: '',
                    itemID: '',
                    clientType: 4,
                    clientSecret: '',
                    status: 1,
                    errClientID: false,
                    errClientSecret: false,
                },
            ],
        }
    }

    componentDidMount() {
        this.initData();
    }

    // 授权
    getAuthorize = async (clientType) => {
        const { weimobClientInfos } = this.state;
        const { $$accountInfo } = this.props;
        const accountInfo = $$accountInfo && $$accountInfo.toJS();
        const { groupID } = accountInfo;
        let data = {};
        weimobClientInfos.forEach((item) => {
            if (item.clientType === clientType) {
                item.errClientID = !item.clientID; // clientID为空，显示提示信息，不可以授权
                item.errClientSecret = !item.clientSecret; // clientSecret为空，显示提示信息，不可以授权
                data = {
                    groupID,
                    clientID: item.clientID,
                    clientSecret: item.clientSecret,
                    clientType,
                    itemID: item.itemID,
                }
            }
        })
        this.setState({
            weimobClientInfos,
        }, () => {
            if (data.clientID && data.clientSecret) { // 都有值，可以授权
                this.commonService(data)
            }
        })
    }

    commonService = async (data) => {
        const res = await axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_CRM',
            method: '/crm/weimobTokenService_authorize.ajax',
            type: 'post',
            data,
        });
        if (res.code !== '000') {
            message.error(res.message)
            throw new Error(res.message);
        }
        window.open(res.data.getCodeUrl)
        this.initData();
    }

    // 查询
    initData = async () => {
        this.setState({
            loading: true,
        })
        const { weimobClientInfos } = this.state;
        const { $$accountInfo } = this.props;
        const accountInfo = $$accountInfo && $$accountInfo.toJS();
        const { groupID } = accountInfo;
        const data = { groupID };
        const res = await axios.post('/api/v1/universal', {
            service: 'HTTP_SERVICE_URL_CRM',
            method: '/crm/weimobTokenService_queryWeimobClientInfos.ajax',
            type: 'post',
            data,
        });
        if (res.code !== '000') {
            this.setState({
                loading: false,
            })
            throw new Error(res.message);
        } else {
            this.setState({
                loading: false,
            })
            if (res.data.weimobClientInfos.length !== 0) {
                const newArr = res.data.weimobClientInfos.map((item) => {
                    return {
                        ...item,
                        errClientID: false,
                        errClientSecret: false,
                    }
                })
                weimobClientInfos.forEach((item, i) => {
                    newArr.forEach((every) => {
                        if (item.clientType === every.clientType) {
                            weimobClientInfos[i] = every
                        }
                    })
                })
                this.setState({
                    weimobClientInfos,
                })
            }
        }
    }

    // clientType=1 客户信息clientID修改 clientType=2 门店收银clientID修改
    changeClientID = (value, clientType) => {
        const { weimobClientInfos } = this.state;
        weimobClientInfos.forEach((item) => {
            if (item.clientType === clientType) {
                item.clientID = value;
                item.errClientID = !value;
            }
        })
        this.setState({
            weimobClientInfos,
        })
    }

    // clientType=1 客户信息clientSecret修改 clientType=2 门店收银clientSecret修改
    changeClientSecret = (value, clientType) => {
        const { weimobClientInfos } = this.state;
        weimobClientInfos.forEach((item) => {
            if (item.clientType === clientType) {
                item.clientSecret = value;
                item.errClientSecret = !value;
            }
        })
        this.setState({
            weimobClientInfos,
        })
    }

    render() {
        const { weimobClientInfos } = this.state;
        return (
            <div className={styles.contentBox} ref="contentBoxHeight">
                <Spin spinning={this.state.loading}>
                    {
                        weimobClientInfos.map((item) => {
                            return (
                                <div key={`${item.clientType}`} className={item.clientType === 1 ? styles.boxTop : styles.boxBottom}>
                                    <div className={styles.badge}><h5>{'营销插件授权信息认证'}</h5></div>
                                    <div className={styles.selectBox}>
                                        <ul>
                                            <li><h5>CLIENT_ID:</h5></li>
                                            <li>
                                                <div className={item.errClientID ? styles.errBorder : null}>
                                                    <Input placeholder="请输入微盟会员开发者证书ID" value={item.clientID} onChange={(e) => { this.changeClientID(e.target.value, item.clientType) }} />
                                                </div>
                                            </li>
                                            <li>
                                                {
                                                    item.errClientID && '请输入开发者证书ID'
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={styles.selectBox}>
                                        <ul>
                                            <li><h5>CLIENT_SECRET:</h5></li>
                                            <li>
                                                <div className={item.errClientSecret ? styles.errBorder : null}>
                                                    <Input placeholder="请输入微盟会员开发者证书密码" value={item.clientSecret} onChange={(e) => { this.changeClientSecret(e.target.value, item.clientType) }} />
                                                </div>
                                            </li>
                                            <li>
                                                {
                                                    item.errClientSecret && '请输入开发者证书密码'
                                                }
                                            </li>
                                        </ul>
                                    </div>
                                    <div className={styles.selectBox}>
                                        <div className={styles.btnLeft}>授权状态：</div>
                                        <div className={styles.btnRight}>
                                            {
                                                item.status === 1 ?
                                                    <div>
                                                        <div className={styles.unAccredit}>未授权</div>
                                                        <div className={styles.accreditBtn}><Button type="primary" onClick={() => { this.getAuthorize(item.clientType) }}>去授权</Button></div>
                                                    </div>
                                                    :
                                                    <div>
                                                        {
                                                            item.status === 2 ?
                                                                <div>
                                                                    <div className={styles.accreditSuccess}>授权成功</div>
                                                                    <div className={styles.accreditBtn}><Button type="primary" onClick={() => { this.getAuthorize(item.clientType) }}>重新授权</Button></div>
                                                                </div>
                                                                :
                                                                <div>
                                                                    <div className={styles.accreditExpire}>授权异常</div>
                                                                    <div className={styles.accreditBtn}><Button type="primary" onClick={() => { this.getAuthorize(item.clientType) }}>重新授权</Button></div>
                                                                </div>
                                                        }
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </Spin>
            </div>
        )
    }
}

function mapStateToProps({ user }) {
    return {
        $$accountInfo: user.get('accountInfo'),
    }
}

export default connect(
    mapStateToProps,
)(MicroneMemberSet);

