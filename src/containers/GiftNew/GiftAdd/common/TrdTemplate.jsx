/**
 * @Author: Xiao Feng Wang  <xf>
 * @Date:   2017-01-23T13:49:32+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: SeniorDateSetting.jsx
* @Last modified by:   Terrence
* @Last modified time: 2017-03-14T13:42:04+08:00
 * @Copyright: Copyright(c) 2017-2020 Hualala Co.,Ltd.
 */

import React from 'react';
import { connect } from 'react-redux';
import { Checkbox, Select, Icon, Form, Row, Col, Switch, Input } from 'antd';
import { fetchData, axiosData } from '../../../../helpers/util';
import GiftCfg from '../../../../constants/Gift';
import {
    fetchAllPromotionListAC,
    queryUnbindCouponPromotion,
} from '../../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';

const FormItem = Form.Item
const Option = Select.Option;
const itemStyle = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    style: { marginBottom: 0 },
    required: true,
}
class TrdTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultChecked: false,
            mpList: [], // 公众号
            trdTemplateInfoList: [], // 第三方券模版
            channelIDStatus: true,
            mpIDStatus: true,
            trdGiftItemIDStatus: true,
        };
    }
    componentDidMount() {
        let channelID = undefined;
        let mpID = undefined;
        let wechatMpName = undefined;
        let trdTemplateID = undefined;
        let trdTemplateIDLabel = undefined;
        // 编辑
        if (this.props.data) {
            this.propsChange(this.props.data)
            const { extraInfo, trdChannelID, trdTemplateID: _trdTemplateID } = this.props.data
            const { wechatMpName: _wechatMpName, trdTemplateIDLabel: _trdTemplateIDLabel } = JSON.parse(extraInfo);
            channelID = trdChannelID; // 渠道id
            wechatMpName = _wechatMpName // 微信名
            trdTemplateID = _trdTemplateID // 模板id
            trdTemplateIDLabel = _trdTemplateIDLabel // 模板名trdTemplateIDLabel
        }
        // 公众号
        fetchData('queryWechatMpInfo', {}, null, { path: 'mpList' }).then((mpList) => {
            this.setState({ mpList: mpList || [], mpID: mpList[0].mpID })
            // 编辑时根据已选的wechatMpName找到mpid,若wechatMpName为undefined,说明是新建或用户已选的不是微信渠道
            mpID = wechatMpName ? mpList.find(mp => mp.mpName === wechatMpName).mpID : undefined
            // 第三方券模版
            this.queryTrdTemplate(mpID ? mpID : mpList[0].mpID, channelID ? channelID : 10).then(trdTemplateInfoList => {
                // 编辑时，已选模板不会再查询到，需要拼接出来
                if (this.props.data) {
                    this.setState({
                        defaultChecked: true,
                        channelID,
                        mpID,
                        trdGiftItemID: trdTemplateID,
                        trdTemplateIDLabel,
                        trdTemplateInfoList: trdTemplateInfoList.concat([{
                            label: trdTemplateIDLabel,
                            value: trdTemplateID,
                        }])
                    })
                }
            })

        })
        // 活动券新增时请求channelID: 1的未绑定过的基础营销活动，编辑时请求channelID: 用户已选择的
        this.props.describe === '活动券' && this.props.queryUnbindCouponPromotion({ channelID: channelID ? channelID : 1 })
    }
    // 向父传递
    propsChange = (data) => {
        if (data) {
            // 点编辑时，向父组件传递用户已设置的初始值
            data.TrdTemplateStatus = true;
            this.props.onChange(data);
            return
        }
        // 新建时
        this.validatorTemp().then((TrdTemplateStatus) => {
            const { defaultChecked, channelID: trdChannelID, trdTemplateInfoList, trdGiftItemID: trdTemplateID, mpList, mpID } = this.state
            const wechatMpName = mpID ? mpList.find(mp => mp.mpID === mpID).mpName : undefined
            const trdTemplateIDLabel = trdTemplateID ? trdTemplateInfoList.find(template => template.trdGiftItemID === trdTemplateID).trdGiftName : undefined

            const values = {
                TrdTemplateStatus,
                extraInfo: JSON.stringify({ wechatMpName, trdTemplateIDLabel }),
                trdChannelID,
                trdTemplateID,
            }
            this.props.onChange(defaultChecked ? values : undefined)
        })
    }
    // 校验表单
    validatorTemp = () => {
        const { defaultChecked, channelID, mpID, trdGiftItemID } = this.state
        if (!defaultChecked) return Promise.resolve(true)
        let TrdTemplateStatus = true;
        let channelIDStatus = true;
        let mpIDStatus = true;
        let trdGiftItemIDStatus = true;
        if (!channelID) { channelIDStatus = false; TrdTemplateStatus = false; }
        if (channelID == 10 && !mpID) { mpIDStatus = false; TrdTemplateStatus = false; }
        if (!trdGiftItemID) { trdGiftItemIDStatus = false; TrdTemplateStatus = false; }
        this.setState({ channelIDStatus, mpIDStatus, trdGiftItemIDStatus })
        return Promise.resolve(TrdTemplateStatus)
    }
    // 第三方券模版
    queryTrdTemplate = (mpID, trdChannelID) => {
        if (trdChannelID == 10 && !mpID) return
        // 第三方券模版
        return fetchData('queryTrdTemplate', {
            groupID: this.props.accountInfo.toJS().groupID,
            channelID: trdChannelID || 10,
            forceRefresh: 1,
            mpID: trdChannelID == 10 ? mpID : undefined, // 有值代表微信公众号id,没有代表其他渠道
        }, null, { path: 'trdTemplateInfoList' }).then((trdTemplateInfoList) => {
            // console.log(trdTemplateInfoList)
            this.setState({
                trdTemplateInfoList: trdTemplateInfoList || [],
            })
            return Promise.resolve(trdTemplateInfoList || [])
        });
    }
    // Switch Button
    handleDefaultChecked = (value) => {
        this.setState({
            defaultChecked: value,
            channelID: 10,
            mpID: '',
            trdGiftItemID: '',
        }, () => {
            this.propsChange() // 向父传递
        })
        if (this.props.describe === '活动券') {
            const channelID = value ? 10 : 1 // 10微信，1普通哗啦营销活动
            this.props.queryUnbindCouponPromotion({ channelID }) // 查询未绑定过的活动
            this.props.clearPromotion() // 清空已选活动
        }
    }
    // 渠道选择
    handleTrdChannelSelect = (value) => {
        this.setState({
            channelID: value,
            mpID: '',
            trdGiftItemID: '',
        }, () => {
            this.propsChange() // 向父传递
        })
        if (this.props.describe === '活动券') {
            this.props.queryUnbindCouponPromotion({ channelID: value }) // 查询未绑定过的活动
            this.props.clearPromotion() // 清空已选活动
        }
        if (value === 10) {
            this.queryTrdTemplate(this.state.mpList[0].mpID, 10) // 带着微信号查模板
        } else {
            this.queryTrdTemplate(undefined, value)
        }
    }

    // 微信号选择
    handleMpSelect = (value) => {
        this.setState({
            mpID: value,
            trdGiftItemID: '',
        }, () => {
            this.propsChange() // 向父传递
        })
        this.queryTrdTemplate(value, 10) // 带着微信号查模板        
    }
    // 三方模板选择
    handleTrdTemplate = (value) => {
        console.log(value)
        this.setState({ trdGiftItemID: value }, () => {
            this.propsChange() // 向父传递
        })
    }
    render() {
        const { defaultChecked, channelID = 10, mpList, mpID, trdTemplateInfoList, trdGiftItemID, channelIDStatus, mpIDStatus, trdGiftItemIDStatus } = this.state;
        const edit = this.props.type === 'edit'
        return (
            <div>
                <FormItem
                    label='是否关联第三方券'
                    {...itemStyle}
                    required={false}
                >
                    <Switch
                        checkedChildren="是"
                        unCheckedChildren="否"
                        checked={defaultChecked}
                        onChange={this.handleDefaultChecked}
                        disabled={edit}
                    />
                </FormItem>
                {
                    !defaultChecked ? null :
                        (<div>
                            <FormItem
                                label='第三方渠道'
                                {...itemStyle}
                                validateStatus={channelIDStatus ? 'success' : 'error'}
                                help={channelIDStatus ? null : '不得为空'}
                            >
                                <Select value={channelID} onChange={this.handleTrdChannelSelect} disabled={edit}>
                                    {
                                        GiftCfg.trdChannelIDs.map(trdChannel => {
                                            return <Option value={trdChannel.value}>{trdChannel.label}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                            {
                                channelID !== 10 ? null :
                                    (<FormItem
                                        label='微信公众号选择'
                                        {...itemStyle}
                                        validateStatus={mpIDStatus ? 'success' : 'error'}
                                        help={mpIDStatus ? null : '不得为空'}
                                    >
                                        <Select value={mpID} onChange={this.handleMpSelect} disabled={edit}>
                                            {
                                                mpList.map(mp => {
                                                    return <Option value={mp.mpID}>{mp.mpName}</Option>
                                                })
                                            }
                                        </Select>
                                    </FormItem>)
                            }
                            <FormItem
                                label='第三方券模板或活动'
                                {...itemStyle}
                                validateStatus={trdGiftItemIDStatus ? 'success' : 'error'}
                                help={trdGiftItemIDStatus ? null : '不得为空'}
                            >
                                <Select onChange={this.handleTrdTemplate} value={trdGiftItemID} disabled={edit}>
                                    {
                                        trdTemplateInfoList.map(template => {
                                            return <Option value={template.trdGiftItemID}>{template.trdGiftName}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                            <FormItem
                                label='券模板或活动ID'
                                {...itemStyle}
                            >
                                <Input disabled={true} value={trdGiftItemID} />
                            </FormItem>
                        </div>)
                }
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        accountInfo: state.user.get('accountInfo'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryUnbindCouponPromotion: opts => dispatch(queryUnbindCouponPromotion(opts)),
        fetchAllPromotionList: opts => dispatch(fetchAllPromotionListAC(opts)),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrdTemplate)
