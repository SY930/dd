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
import moment from 'moment';
import { Select, Form, Switch, Input, Spin } from 'antd';
import { fetchData } from '../../../../helpers/util';
import GiftCfg from '../../../../constants/Gift';
import {
    fetchAllPromotionListAC,
    queryUnbindCouponPromotion,
} from '../../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import {
    queryWechatMpInfo,
} from '../../_action';

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
            loading: false,
        };
    }
    componentDidMount() {
        let channelID = undefined;
        // 编辑
        if (this.props.data) {
            this.propsChange(this.props.data)
            const { extraInfo, trdChannelID, trdTemplateID } = this.props.data
            const { wechatMpName, trdTemplateIDLabel } = JSON.parse(extraInfo);
            channelID = trdChannelID
            this.setState({
                defaultChecked: true,
                channelID,
                mpID: wechatMpName, // 不用找匹配了，直接渲染成name，因为mplist此时可能未回来
                trdGiftItemID: trdTemplateID,
                trdTemplateIDLabel,
                trdTemplateInfoList: [{ // 不用查询了，直接根据返回的label和id拼装成只有一个选项的列表
                    trdGiftName: trdTemplateIDLabel,
                    trdGiftItemID: trdTemplateID,
                }],
            })
        }
        // 公众号
        const mpList = this.props.mpList.toJS()
        mpList.length === 0 ? this.props.queryWechatMpInfo() : null
        this.setState({ mpList: mpList || [] })
        // 活动券新增时请求channelID: 1的未绑定过的基础营销活动，编辑时请求channelID: 用户已选择的
        this.props.describe === '活动券' && this.props.queryUnbindCouponPromotion({ channelID: channelID ? channelID : 1 })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.mpList !== nextProps.mpList) {
            const mpList = nextProps.mpList.toJS()
            this.setState({ mpList: mpList || [] })
        }
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
        if (channelID == 20 ) { trdGiftItemIDStatus = true; TrdTemplateStatus = true; }
        this.setState({ channelIDStatus, mpIDStatus, trdGiftItemIDStatus })
        return Promise.resolve(TrdTemplateStatus)
    }
    // 第三方券模版
    queryTrdTemplate = (mpID, appID, trdChannelID) => {
        if (trdChannelID == 10 && !appID) return
        // 第三方券模版
        return fetchData('queryTrdTemplate', {
            groupID: this.props.accountInfo.toJS().groupID,
            channelID: trdChannelID || 10,
            forceRefresh: 1,
            mpID: trdChannelID == 10 ? mpID : undefined, // 有值代表微信公众号id,没有代表其他渠道
            appID: trdChannelID == 10 ? appID : undefined, // 有值代表微信公众号id,没有代表其他渠道
        }, null, { path: 'trdTemplateInfoList' }).then((rawList ) => {
            const trdTemplateInfoList = []
            if (Array.isArray(rawList)) {
                rawList.forEach(item => {
                    const entity = {...item};
                    try {
                        // 将后端的JSON解析出来, 根据不同的类型, 修改券名称, 方便区分同名微信券
                        const dataInfo = JSON.parse(JSON.stringify(item.dataInfo));
                        const {
                            type,
                            beginTimestamp,
                            endTimestamp,
                            fixedTerm,
                        } = dataInfo;
                        // 固定有效期类型
                        if (type === 'DATE_TYPE_FIX_TIME_RANGE') {
                            const startTimeString = moment.unix(beginTimestamp).format('YYYY/MM/DD');
                            const endTimeString = moment.unix(endTimestamp).format('YYYY/MM/DD');
                            entity.trdGiftName = `${entity.trdGiftName || ''} (有效期: ${startTimeString}~${endTimeString})`
                        }
                        // 相对有效期类型
                        if (type === 'DATE_TYPE_FIX_TERM') {
                            entity.trdGiftName = `${entity.trdGiftName || ''} (有效期: ${fixedTerm}天)`
                        }
                    } catch (e) {
                    }
                    trdTemplateInfoList.push(entity);
                })
            }
            this.setState({
                trdTemplateInfoList: trdTemplateInfoList,
                loading: false,
            })
            return Promise.resolve(trdTemplateInfoList)
        }).catch(error => {
            this.setState({
                trdTemplateInfoList: [],
                loading: false,
            })
        }) ;
    }
    // Switch Button
    handleDefaultChecked = (value) => {
        this.setState({
            defaultChecked: value,
            channelID: 10,
            mpID: '',
            trdGiftItemID: '',
            trdTemplateInfoList: [], // 清空当下微信号模板
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
        if (value === 20) return this.propsChange();
        if (value === 10) {
            this.queryTrdTemplate(this.state.mpList[0].mpID, this.state.mpList[0].appID, 10) // 带着微信号查模板
        } else {
            this.queryTrdTemplate(undefined, undefined, value)
        }
    }

    // 微信号选择
    handleMpSelect = (value) => {
        const mpList = this.state.mpList;
        this.setState({
            mpID: value,
            trdGiftItemID: '',
            trdTemplateInfoList: [], // 清空当下微信号模板
            loading: true,
        }, () => {
            this.propsChange() // 向父传递
            const mpAccount = mpList.find(item => String(item.mpID) === String(value));
            this.queryTrdTemplate(value, mpAccount? mpAccount.appID: undefined, 10) // 带着微信号查模板
        })
    }
    // 三方模板选择
    handleTrdTemplate = (value) => {
        this.setState({ trdGiftItemID: value }, () => {
            this.propsChange() // 向父传递
        })
    }
    render() {
        const { defaultChecked, channelID = 10, mpList, mpID, trdTemplateInfoList, trdGiftItemID, channelIDStatus, mpIDStatus, trdGiftItemIDStatus, loading } = this.state;
        const edit = this.props.type === 'edit'
        return (
            <div>
                <Spin spinning={loading}>
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
                                    <Select value={channelID}
                                            onChange={this.handleTrdChannelSelect}
                                            disabled={edit}
                                            getPopupContainer={(node) => node.parentNode}
                                    >
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
                                            <Select value={mpID}
                                                    onChange={this.handleMpSelect}
                                                    disabled={edit}
                                                    getPopupContainer={(node) => node.parentNode}
                                            >
                                                {
                                                    mpList.map(mp => {
                                                        return <Option value={mp.mpID}>{mp.mpName}</Option>
                                                    })
                                                }
                                            </Select>
                                        </FormItem>)
                                }
                                {
                                    channelID === 20 ? null : (
                                        <FormItem
                                            label='第三方券模板或活动'
                                            {...itemStyle}
                                            validateStatus={trdGiftItemIDStatus ? 'success' : 'error'}
                                            help={trdGiftItemIDStatus ? null : '不得为空'}
                                        >
                                            <Select onChange={this.handleTrdTemplate}
                                                    value={trdGiftItemID}
                                                    disabled={edit}
                                                    getPopupContainer={(node) => node.parentNode}
                                            >
                                                {
                                                    trdTemplateInfoList.map(template => {
                                                        return <Option value={template.trdGiftItemID}>{template.trdGiftName}</Option>
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                    )
                                }
                                {
                                    channelID === 20 ? null : (
                                        <FormItem
                                            label='券模板或活动ID'
                                            {...itemStyle}
                                        >
                                            <Input disabled={true} value={trdGiftItemID} />
                                        </FormItem>
                                    )
                                }
                            </div>)
                    }
                </Spin>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        accountInfo: state.user.get('accountInfo'),
        mpList: state.sale_giftInfoNew.get('mpList'),
    }
}

function mapDispatchToProps(dispatch) {
    return {
        queryUnbindCouponPromotion: opts => dispatch(queryUnbindCouponPromotion(opts)),
        fetchAllPromotionList: opts => dispatch(fetchAllPromotionListAC(opts)),
        queryWechatMpInfo: () => dispatch(queryWechatMpInfo()),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrdTemplate)
