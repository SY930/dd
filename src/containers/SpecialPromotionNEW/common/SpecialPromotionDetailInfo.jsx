/**
 * @Author: ZBL
 * @Date:   2017-03-02T11:12:25+08:00
 * @Email:  wangxiaofeng@hualala.com
 * @Filename: FullCutContent.jsx
 * @Last modified by:   chenshuang
 * @Last modified time: 2017-04-07T13:52:34+08:00
 * @Copyright: Copyright(c) 2017-present Hualala Co.,Ltd.
 */

import React, { Component } from 'react'
import {
    Row,
    Col,
    Form,
    message,
    Radio,
    Upload,
    Icon,
    Input,
} from 'antd';
import { connect } from 'react-redux'
import styles from '../../SaleCenterNEW/ActivityPage.less';
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterSetSpecialGiftInfoAC,
} from '../../../redux/actions/saleCenterNEW/specialPromotion.action'
import {
    fetchGiftListInfoAC,
} from '../../../redux/actions/saleCenterNEW/promotionDetailInfo.action';
import AddGifts from '../common/AddGifts';
import ENV from "../../../helpers/env";
import styles1 from '../../GiftNew/GiftAdd/GiftAdd.less';
const moment = require('moment');
const FormItem = Form.Item;

const getDefaultGiftData = (sendType = 0) => ({
    // 膨胀所需人数
    needCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品数量
    giftTotalCount: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品ID和name
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: 'success',
        msg: null,
    },
    effectType: '1',
    // 礼品生效时间
    giftEffectiveTime: {
        value: '0',
        validateStatus: 'success',
        msg: null,
    },
    // 礼品有效期
    giftValidDays: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    giftOdds: {
        value: '',
        validateStatus: 'success',
        msg: null,
    },
    sendType,
})

const shareInfoEnabledTypes = [
    '65',
    '66',
]

class SpecialDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gradeChange = this.gradeChange.bind(this);
        const { data } = this.initState();
        this.state = {
            data,
            shareImagePath: this.props.specialPromotion.getIn(['$eventInfo', 'shareImagePath']),
            shareTitle: this.props.specialPromotion.getIn(['$eventInfo', 'shareTitle']),
        }
    }
    componentDidMount() {
        this.props.getSubmitFn({
            prev: this.handlePrev,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined,
        });
        this.props.fetchGiftListInfo();
    }

    initiateDefaultGifts = () => {
        const type = `${this.props.type}`;
        switch (type) {
            case '65': return [getDefaultGiftData(), getDefaultGiftData(1)];
            case '66': return [getDefaultGiftData(), getDefaultGiftData(), getDefaultGiftData()];
            default: return [getDefaultGiftData()]
        }

    }

    initState = () => {
        const giftInfo = this.props.specialPromotion.get('$giftInfo').toJS();
        const data = this.initiateDefaultGifts();
        giftInfo.forEach((gift, index) => {
            if (data[index] !== undefined) {
                data[index].effectType = `${gift.effectType}`,
                data[index].giftEffectiveTime.value = gift.effectType != '2' ? gift.giftEffectTimeHours : [moment(gift.effectTime, 'YYYYMMDD'), moment(gift.validUntilDate, 'YYYYMMDD')],
                data[index].giftInfo.giftName = gift.giftName;
                data[index].giftInfo.giftItemID = gift.giftID;
                data[index].giftValidDays.value = gift.giftValidUntilDayCount;
                data[index].needCount.value = gift.needCount;
                if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                    data[index].giftCount.value = gift.giftCount;
                } else {
                    data[index].giftTotalCount.value = gift.giftTotalCount;
                }
                data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            } else {
                data[index] = getDefaultGiftData(gift.sendType);
                data[index].effectType = `${gift.effectType}`,
                data[index].giftEffectiveTime.value = gift.effectType != '2' ? gift.giftEffectTimeHours : [moment(gift.effectTime, 'YYYYMMDD'), moment(gift.validUntilDate, 'YYYYMMDD')],
                data[index].giftInfo.giftName = gift.giftName;
                data[index].giftInfo.giftItemID = gift.giftID;
                data[index].giftValidDays.value = gift.giftValidUntilDayCount;
                if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                    data[index].giftCount.value = gift.giftCount;
                } else {
                    data[index].giftTotalCount.value = gift.giftTotalCount;
                }
                data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            }
        })
        return {
            data,
        };
    }

    // 拼出礼品信息
    getGiftInfo(data) {
        const giftArr = data.map((giftInfo, index) => {
            let gifts;
            if (giftInfo.effectType != '2') {
                // 相对期限
                gifts = {
                    effectType: giftInfo.effectType,
                    giftEffectTimeHours: giftInfo.giftEffectiveTime.value,
                    giftValidUntilDayCount: giftInfo.giftValidDays.value,
                    giftID: giftInfo.giftInfo.giftItemID,
                    needCount: giftInfo.needCount.value,
                    giftName: giftInfo.giftInfo.giftName,
                }
            } else {
                // 固定期限
                gifts = {
                    effectType: '2',
                    effectTime: giftInfo.giftEffectiveTime.value[0] && giftInfo.giftEffectiveTime.value[0] != '0' ? parseInt(giftInfo.giftEffectiveTime.value[0].format('YYYYMMDD')) : '',
                    validUntilDate: giftInfo.giftEffectiveTime.value[1] && giftInfo.giftEffectiveTime.value[1] != '0' ? parseInt(giftInfo.giftEffectiveTime.value[1].format('YYYYMMDD')) : '',
                    giftID: giftInfo.giftInfo.giftItemID,
                    needCount: giftInfo.needCount.value,
                    giftName: giftInfo.giftInfo.giftName,
                }
            }
            if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                gifts.giftCount = giftInfo.giftCount.value;
            } else {
                gifts.giftTotalCount = giftInfo.giftTotalCount.value
            }
            if (this.props.type == '20') {
                gifts.giftOdds = giftInfo.giftOdds.value;
            }
            gifts.sendType = giftInfo.sendType || 0;
            return gifts
        });
        return giftArr;
    }
    checkNeedCount = (needCount, index) => {
        const _value = parseFloat(needCount.value);
        // 只有膨胀大礼包校验此字段
        if (this.props.type != '66' || index === 0 || _value > 0 && _value < 1000) {
            return needCount;
        }
        return {
            msg: '膨胀需要人数必须大于0, 小于1000',
            validateStatus: 'error',
            value: '',
        }
    }
    handlePrev() {
        return this.handleSubmit(true)
    }
    handleSubmit(isPrev) {
        if (isPrev) return true;
        let flag = true;
        this.props.form.validateFieldsAndScroll((error, basicValues) => {
            if (error) {
                flag = false;
            }
        });
        if (!flag) {
            return false;
        }
        let { data, shareImagePath, shareTitle } = this.state;
        const { type } = this.props;
        // 校验礼品数量
        function checkgiftTotalCount(giftTotalCount) {
            const _value = parseFloat(giftTotalCount.value);
            if (_value > 0 && _value <= 1000000000) {
                return giftTotalCount;
            }
            return {
                msg: '礼品总数必须大于0, 小于等于10亿',
                validateStatus: 'error',
                value: '',
            }
        }
        function checkgiftCount(giftCount) {
            const _value = parseFloat(giftCount.value);
            if (_value > 0 && _value < 51) {
                return giftCount;
            }
            return {
                msg: '礼品个数必须在1到50之间',
                validateStatus: 'error',
                value: '',
            }
        }

        // 有效天数
        function checkGiftValidDays(giftValidDays, index) {
            const _value = giftValidDays.value instanceof Array ? giftValidDays.value : parseFloat(giftValidDays.value);
            if (_value > 0 || (_value[0] && _value[1])) {
                return giftValidDays;
            }
            return {
                msg: '请输入正确有效期',
                validateStatus: 'error',
                value: '',
            }
        }

        // 校验中奖比率
        function checkGiftOdds(giftOdds) {
            if (type == '20') {
                const _value = parseFloat(giftOdds.value);
                if (_value >= 0 && _value <= 100) {
                    return giftOdds;
                }
                return {
                    msg: '中奖比率必填, 大于等于0, 小于等于100',
                    validateStatus: 'error',
                    value: '',
                }
            }
            return giftOdds;
        }

        // 校验礼品信息
        function checkGiftInfo(giftInfo) {
            if (giftInfo.giftItemID === null || giftInfo.giftName === null) {
                return {
                    giftItemID: null,
                    giftName: null,
                    validateStatus: 'error',
                    msg: '必须选择礼券',
                }
            }
            return giftInfo;
        }

        const validatedRuleData = data.map((ruleInfo, index) => {
            const giftValidDaysOrEffect = ruleInfo.effectType != '2' ? 'giftValidDays' : 'giftEffectiveTime';
            if (this.props.type != '20' && this.props.type != '21' && this.props.type != '30' && this.props.type != '70') {
                return Object.assign(ruleInfo, {
                    giftCount: checkgiftCount(ruleInfo.giftCount),
                    giftInfo: checkGiftInfo(ruleInfo.giftInfo),
                    giftOdds: checkGiftOdds(ruleInfo.giftOdds),
                    needCount: this.checkNeedCount(ruleInfo.needCount, index),
                    [giftValidDaysOrEffect]: ruleInfo.effectType != '2' ? checkGiftValidDays(ruleInfo.giftValidDays, index) : checkGiftValidDays(ruleInfo.giftEffectiveTime, index),
                });
            }
            return Object.assign(ruleInfo, {
                giftTotalCount: checkgiftTotalCount(ruleInfo.giftTotalCount),
                giftInfo: checkGiftInfo(ruleInfo.giftInfo),
                giftOdds: checkGiftOdds(ruleInfo.giftOdds),
                needCount: this.checkNeedCount(ruleInfo.needCount, index),
                [giftValidDaysOrEffect]: ruleInfo.effectType != '2' ? checkGiftValidDays(ruleInfo.giftValidDays, index) : checkGiftValidDays(ruleInfo.giftEffectiveTime, index),
            });
        });
        const validateFlag = validatedRuleData.reduce((p, ruleInfo) => {
            const _validStatusOfCurrentIndex = Object.keys(ruleInfo)
                .reduce((flag, key) => {
                    if (ruleInfo[key] instanceof Object && ruleInfo[key].hasOwnProperty('validateStatus')) {
                        const _valid = ruleInfo[key].validateStatus === 'success';
                        return flag && _valid;
                    }
                    return flag
                }, true);
            return p && _validStatusOfCurrentIndex;
        }, true);
        // 把中奖率累加,判断总和是否满足小于等于100
        const validOdds = data.reduce((res, cur) => {
            return res + parseFloat(cur.giftOdds.value)
        }, 0);
        data = validatedRuleData;
        this.setState({ data });
        if (validateFlag) {
            if (validOdds > 100) {
                message.warning('中奖比率之和不能大于100!');
                return false;
            }
            const giftInfo = this.getGiftInfo(data);
            this.props.setSpecialBasicInfo(giftInfo);
            this.props.setSpecialBasicInfo({
                shareImagePath,
                shareTitle,
            });
            this.props.setSpecialGiftInfo(giftInfo);
            return true;
        }
        return false;
    }

    gradeChange(gifts, sendType) {
        if (!Array.isArray(gifts)) return;
        const { data } = this.state;
        this.setState({
            data: [...data.filter(item => item.sendType !== sendType), ...gifts]
        })
    }
    handleShareTitleChange = ({ target: { value }}) => {
        this.setState({
            shareTitle: value,
        })
    }
    renderImgUrl = () => {
        const props = {
            name: 'myFile',
            showUploadList: false,
            action: '/api/common/imageUpload',
            className: styles1.avatarUploader,
            accept: 'image/*',
            beforeUpload: file => {
                const isAllowed = file.type === 'image/jpeg' || file.type === 'image/png';
                if (!isAllowed) {
                    message.error('仅支持png和jpeg/jpg格式的图片');
                }
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    message.error('图片不要大于1MB');
                }
                return isAllowed && isLt1M;
            },
            onChange: (info) => {
                const status = info.file.status;
                if (status === 'done' && info.file.response && info.file.response.url) {
                    message.success(`${info.file.name} 上传成功`);
                    this.setState({
                        shareImagePath: `${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`,
                    })
                } else if (status === 'error' || (info.file.response && !info.file.response.url)) {
                    message.error(`${info.file.name} 上传失败`);
                }
            },
        };
        return (
            <Row>
                <Col>
                    <FormItem>
                        <Upload
                            {...props}
                        >
                            {
                                this.state.shareImagePath ?
                                    <img src={this.state.shareImagePath} alt="" className={styles1.avatar} /> :
                                    <Icon
                                        type="plus"
                                        className={styles1.avatarUploaderTrigger}
                                    />
                            }
                        </Upload>
                        <p className="ant-upload-hint">
                            点击上传图片，图片格式为jpg、png, 小于1MB
                            <br/>
                            建议尺寸: 520*416像素
                        </p>
                    </FormItem>
                </Col>
            </Row>
        )
    }
    renderShareInfo() {
        return (
            <div>
                <FormItem
                    label="小程序分享标题"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {this.props.form.getFieldDecorator('shareTitle', {
                        rules: [
                            { max: 50, message: '最多50个字符' },
                        ],
                        initialValue: this.state.shareTitle,
                        onChange: this.handleShareTitleChange,
                    })(
                        <Input placeholder="不填写则显示默认标题" />
                    )}
                </FormItem>
                <FormItem
                        label="小程序分享图片"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                        style={{ position: 'relative' }}
                    >
                        {this.renderImgUrl()}
                    </FormItem>
            </div>
            
        )
    }
    render() {
        return (
            <div >
                {
                    this.props.type == '65' && <p style={{padding: '10px 18px'}}>邀请人礼品获得礼品列表：</p>
                }
                <Row>
                    <Col span={17} offset={4}>
                        <AddGifts
                            maxCount={this.props.type == '21' || this.props.type == '30' ? 1 : 10}
                            type={this.props.type}
                            isNew={this.props.isNew}
                            value={this.state.data.filter(gift => gift.sendType === 0)}
                            onChange={(gifts) => this.gradeChange(gifts, 0)}
                        />
                    </Col>
                </Row>
                {
                   this.props.type == '65' && <p style={{padding: '10px 18px'}}>被邀请人礼品获得礼品列表：</p>
                }
                {
                    this.props.type == '65' && (
                        <Row>
                            <Col span={17} offset={4}>
                                <AddGifts
                                    maxCount={10}
                                    sendType={1}
                                    type={this.props.type}
                                    isNew={this.props.isNew}
                                    value={this.state.data.filter(gift => gift.sendType === 1)}
                                    onChange={(gifts) => this.gradeChange(gifts, 1)}
                                />
                            </Col>
                        </Row>
                    )
                }
                {
                    shareInfoEnabledTypes.includes(`${this.props.type}`) && this.renderShareInfo()
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        stepInfo: state.sale_steps.toJS(),
        fullCut: state.sale_fullCut_NEW,
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        user: state.user.toJS(),
        specialPromotion: state.sale_specialPromotion_NEW,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSpecialBasicInfo: (opts) => {
            dispatch(saleCenterSetSpecialBasicInfoAC(opts));
        },
        setSpecialGiftInfo: (opts) => {
            dispatch(saleCenterSetSpecialGiftInfoAC(opts));
        },
        fetchGiftListInfo: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(SpecialDetailInfo));
