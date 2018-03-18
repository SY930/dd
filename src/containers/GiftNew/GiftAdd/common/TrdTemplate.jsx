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
        };
    }
    componentDidMount() {
        // 公众号
        fetchData('queryWechatMpInfo', {}, null, { path: 'mpList' }).then((mpList) => {
            this.setState({ mpList: mpList || [], mpID: mpList[0].mpID })
            // 第三方券模版
            this.queryTrdTemplate(mpList[0].mpID, 10)
        })
        // 活动券新增时请求channelID: 1的未绑定过的基础营销活动，编辑时请求channelID: 用户已选择的
        this.props.describe === '活动券' && this.props.queryUnbindCouponPromotion({ channelID: 1 })
    }
    // 向父传递
    propsChange = () => {
        const { channelID: trdChannelID, trdTemplateInfoList, trdGiftItemID: trdTemplateID, mpList, mpID } = this.state
        const wechatMpName = mpList.find(mp => mp.mpID === mpID).mpName
        const trdTemplateIDLabel = trdTemplateInfoList.find(template => template.trdGiftItemID === trdTemplateID).trdGiftName
        debugger
        const values = {
            extraInfo: JSON.stringify({ wechatMpName, trdTemplateIDLabel }),
            trdChannelID,
            trdTemplateID,
            trdTemplateIDLabel,
            wechatMpName,
        }
        this.props.onChange(values)
    }
    // 第三方券模版
    queryTrdTemplate = (mpID, trdChannelID) => {
        if (trdChannelID == 10 && !mpID) return
        // 第三方券模版
        fetchData('queryTrdTemplate', {
            groupID: this.props.accountInfo.toJS().groupID,
            channelID: trdChannelID || 10,
            forceRefresh: 1,
            mpID: trdChannelID == 10 ? mpID : undefined, // 有值代表微信公众号id,没有代表其他渠道
        }, null, { path: 'trdTemplateInfoList' }).then((trdTemplateInfoList) => {
            // console.log(trdTemplateInfoList)
            this.setState({
                trdTemplateInfoList: trdTemplateInfoList || [],
            })
        });
    }
    // Switch Button
    handleDefaultChecked = (value) => {
        this.setState({
            defaultChecked: value,
            channelID: 10,
            mpID: '',
            trdGiftItemID: '',
        })
        if (this.props.describe === '活动券') {
            const channelID = value ? 10 : 1 // 10微信，1普通哗啦营销活动
            this.props.queryUnbindCouponPromotion({ channelID }) // 查询未绑定过的活动
            this.props.clearPromotion() // 清空已选活动
        }
    }
    // 渠道选择
    handleTrdChannelSelect = (value) => {
        console.log(value)
        this.setState({
            channelID: value,
            mpID: '',
            trdGiftItemID: '',
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
        console.log(value)
        this.setState({
            mpID: value,
            trdGiftItemID: '',
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
        const { defaultChecked, channelID = 10, mpList, mpID, trdTemplateInfoList, trdGiftItemID, } = this.state;
        const { type } = this.props
        return (
            <div>
                <FormItem
                    label='是否关联第三方券'
                    {...itemStyle}
                    required={false}
                >
                    <Switch checkedChildren="是" unCheckedChildren="否" defaultChecked={defaultChecked} onChange={this.handleDefaultChecked} />
                </FormItem>
                {
                    !defaultChecked ? null :
                        <div>
                            <FormItem
                                label='第三方渠道'
                                {...itemStyle}
                            >
                                <Select value={channelID} onChange={this.handleTrdChannelSelect}>
                                    {
                                        GiftCfg.trdChannelIDs.map(trdChannel => {
                                            return <Option value={trdChannel.value}>{trdChannel.label}</Option>
                                        })
                                    }
                                </Select>
                            </FormItem>
                            {
                                channelID !== 10 ? null :
                                    <FormItem
                                        label='微信公众号选择'
                                        {...itemStyle}
                                    >
                                        <Select value={mpID} onChange={this.handleMpSelect}>
                                            {
                                                mpList.map(mp => {
                                                    return <Option value={mp.mpID}>{mp.mpName}</Option>
                                                })
                                            }
                                        </Select>
                                    </FormItem>}
                            <FormItem
                                label='第三方券模板或活动'
                                {...itemStyle}
                            >
                                {
                                    /*type === 'add' ? trdTemplateInfoList.map((template) => {
                                        return {
                                            label: template.trdGiftName,
                                            value: template.trdGiftItemID,
                                        }
                                    }) : [{
                                        label: this.props.gift.data.extraInfo ? JSON.parse(this.props.gift.data.extraInfo).trdTemplateIDLabel : '',
                                        value: this.props.gift.data.trdTemplateID,
                                    }]*/
                                    <Select onChange={this.handleTrdTemplate} value={trdGiftItemID}>
                                        {
                                            trdTemplateInfoList.map(template => {
                                                return <Option value={template.trdGiftItemID}>{template.trdGiftName}</Option>
                                            })
                                        }
                                    </Select>
                                }
                            </FormItem>
                            <FormItem
                                label='券模板或活动ID'
                                {...itemStyle}
                            >
                                <Input disabled={true} value={trdGiftItemID} />
                            </FormItem>
                        </div>
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
