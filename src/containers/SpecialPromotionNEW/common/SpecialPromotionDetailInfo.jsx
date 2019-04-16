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
import { Row, Col, Form, message, Radio, Input, InputNumber } from 'antd';
import { connect } from 'react-redux'
import { saleCenterSetSpecialBasicInfoAC, saleCenterSetSpecialGiftInfoAC } from '../../../redux/actions/saleCenterNEW/specialPromotion.action'

import AddGifts from '../common/AddGifts';

const moment = require('moment');


class SpecialDetailInfo extends React.Component {
    constructor(props) {
        super(props);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gradeChange = this.gradeChange.bind(this);
        this.state = {
            data: [
                {
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
                },
            ],
        }
    }

    componentDidMount() {
        this.props.getSubmitFn({
            prev: this.handlePrev,
            // prev: undefined,
            next: undefined,
            finish: this.handleSubmit,
            cancel: undefined,
        });
        const giftInfo = this.props.specialPromotion.get('$giftInfo').toJS();
        const { data } = this.state;
        giftInfo.forEach((gift, index) => {
            if (data[index] !== undefined) {
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
            } else {
                data[index] = {
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
                    // 礼品生效时间
                    giftEffectiveTime: {
                        value: '',
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
                };
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
        this.setState({
            data,
        })
    }


    componentWillReceiveProps(nextProps) {
        // 是否更新礼品信息
        if ((this.props.specialPromotion.get('$eventInfo') != nextProps.specialPromotion.get('$eventInfo')) &&
            nextProps.specialPromotion.get('$giftInfo').size > 0
        ) {
            // let giftInfo = this.props.specialPromotion.get('$giftInfo').toJS();
            const giftInfo = nextProps.specialPromotion.get('$giftInfo').toJS();
            const { data } = this.state;
            giftInfo.forEach((gift, index) => {
                if (data[index] !== undefined) {
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
                } else {
                    data[index] = {
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
                        // 礼品生效时间
                        giftEffectiveTime: {
                            value: '',
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
                    };
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
            this.setState({
                data,
            })
        }
    }


    // 拼出礼品信息
    getGiftInfo(data) {
        const giftObj = data.map((giftInfo, index) => {
            let gifts;
            if (giftInfo.effectType != '2') {
                // 相对期限
                gifts = {
                    effectType: giftInfo.effectType,
                    giftEffectTimeHours: giftInfo.giftEffectiveTime.value,
                    giftValidUntilDayCount: giftInfo.giftValidDays.value,
                    giftID: giftInfo.giftInfo.giftItemID,
                    giftName: giftInfo.giftInfo.giftName,
                }
            } else {
                // 固定期限
                console.log('giftInfo.giftEffectiveTime: ', giftInfo.giftEffectiveTime)
                gifts = {
                    effectType: '2',
                    effectTime: giftInfo.giftEffectiveTime.value[0] && giftInfo.giftEffectiveTime.value[0] != '0' ? parseInt(giftInfo.giftEffectiveTime.value[0].format('YYYYMMDD')) : '',
                    validUntilDate: giftInfo.giftEffectiveTime.value[1] && giftInfo.giftEffectiveTime.value[1] != '0' ? parseInt(giftInfo.giftEffectiveTime.value[1].format('YYYYMMDD')) : '',
                    giftID: giftInfo.giftInfo.giftItemID,
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
            return gifts
        });
        return giftObj;
    }

    handlePrev() {
        return this.handleSubmit(true)
    }
    handleSubmit(isPrev) {
        if (isPrev) return true;
        let { data } = this.state;
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
                // validateStatus: data[index].effectType == '1' ? 'error' : 'success',
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
                    // giftValidDays: checkGiftValidDays(ruleInfo.giftValidDays, index)
                    [giftValidDaysOrEffect]: ruleInfo.effectType != '2' ? checkGiftValidDays(ruleInfo.giftValidDays, index) : checkGiftValidDays(ruleInfo.giftEffectiveTime, index),
                });
            }
            return Object.assign(ruleInfo, {
                giftTotalCount: checkgiftTotalCount(ruleInfo.giftTotalCount),
                giftInfo: checkGiftInfo(ruleInfo.giftInfo),
                giftOdds: checkGiftOdds(ruleInfo.giftOdds),
                // giftValidDays: checkGiftValidDays(ruleInfo.giftValidDays, index)
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
            this.props.setSpecialGiftInfo(giftInfo);
            return true;
        }
        return false;
    }

    gradeChange(val) {
        let { data } = this.state;
        if (val !== undefined) {
            data = val;
            this.setState({ data });
        }
    }
    render() {
        return (
            <div >
                <Row>
                    <Col span={17} offset={4}>
                        <AddGifts
                            maxCount={this.props.type == '21' || this.props.type == '30' ? 1 : 10}
                            type={this.props.type}
                            isNew={this.props.isNew}
                            value={this.state.data}
                            onChange={this.gradeChange}
                        />
                    </Col>
                </Row>

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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(SpecialDetailInfo));
