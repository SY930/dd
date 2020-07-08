import React, { Component } from "react";
import {
    Row,
    Col,
    Form,
    message,
    Radio,
    Upload,
    Icon,
    Input,
    Select,
    Switch,
    Popconfirm,
    Tooltip,
    Checkbox,
    Tabs,
} from "antd";
import { connect } from "react-redux";
import Immutable from "immutable";

import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterSetSpecialGiftInfoAC,
} from "../../../redux/actions/saleCenterNEW/specialPromotion.action";
import { fetchGiftListInfoAC } from "../../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import AddGifts from "../common/AddGifts";
import { injectIntl } from "i18n/common/injectDecorator";
import { STRING_SPE, COMMON_SPE } from "i18n/common/special";
import TicketBag from '../../BasicModules/TicketBag';
const moment = require("moment");
const RadioGroup = Radio.Group;

const getDefaultGiftData = (typeValue = 0, typePropertyName = "sendType") => ({
    // 膨胀所需人数
    needCount: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    // 礼品数量
    giftCount: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    // 礼品数量
    giftTotalCount: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    // 礼品ID和name
    giftInfo: {
        giftName: null,
        giftItemID: null,
        validateStatus: "success",
        msg: null,
    },
    effectType: "1",
    // 礼品生效时间
    giftEffectiveTime: {
        value: "0",
        validateStatus: "success",
        msg: null,
    },
    // 礼品有效期
    giftValidDays: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    giftOdds: {
        value: "",
        validateStatus: "success",
        msg: null,
    },
    [typePropertyName]: typeValue,
});

@injectIntl
class SpecialDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gradeChange = this.gradeChange.bind(this);
        this.getDefaultGiftData = getDefaultGiftData.bind(this)
        const {
            data,
        } = this.initState();

        this.state = {
            data,
            cleanCount: props.specialPromotion.getIn(
                ["$eventInfo", "cleanCount"],
                1
            ),
            helpMessageArray: ["", ""],
            sendTypeValue: '0',                 // 赠送的营销活动类型
            bag: '',                            // 赠送券包
            activeRuleTabValue: "",
        };
    }
    componentDidMount() {
        const { type, isLast = true, user } = this.props;
        this.props.getSubmitFn({
            finish: isLast ? this.handleSubmit : undefined,
            next: !isLast ? this.handleSubmit : undefined,
        });
        this.props.fetchGiftListInfo();
    }

    componentDidUpdate(prevProps) {
    }

    initiateDefaultGifts = () => {
        return [getDefaultGiftData()];
    }

    initState = () => {
        let giftInfo = this.props.specialPromotion.get("$giftInfo").toJS();
        const data = this.initiateDefaultGifts();
        giftInfo.forEach((gift, index) => {
            if (data[index] !== undefined) {
                data[index].sendType = gift.sendType || 0;
                data[index].recommendType = gift.recommendType || 0;
            } else {
                data[index] = getDefaultGiftData("sendType", gift.sendType);
            }
            data[index].giftEffectiveTime.value =
                gift.effectType != "2"
                    ? gift.giftEffectTimeHours
                    : [
                          moment(gift.effectTime, "YYYYMMDD"),
                          moment(gift.validUntilDate, "YYYYMMDD"),
                      ];
            data[index].effectType = `${gift.effectType}`;
            data[index].giftInfo.giftName = gift.giftName;
            data[index].needCount.value = gift.needCount || 0;
            data[index].giftInfo.giftItemID = gift.giftID;
            data[index].giftValidDays.value = gift.giftValidUntilDayCount;
            data[index].giftTotalCount.value = gift.giftTotalCount;
            data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            data[index].lastConsumeIntervalDays = gift.lastConsumeIntervalDays
                ? `${gift.lastConsumeIntervalDays}`
                : undefined;
        });
        return {
            data,
        };
    };


    // 拼出礼品信息
    getGiftInfo = (data) => {
        const giftArr = data.map((giftInfo, index) => {
            let gifts;
            if (giftInfo.effectType != "2") {
                // 相对期限
                gifts = {
                    effectType: giftInfo.effectType,
                    giftEffectTimeHours: giftInfo.giftEffectiveTime.value,
                    giftValidUntilDayCount: giftInfo.giftValidDays.value,
                    giftID: giftInfo.giftInfo.giftItemID,
                    giftName: giftInfo.giftInfo.giftName,
                };
            } else {
                // 固定期限
                gifts = {
                    effectType: "2",
                    effectTime:
                        giftInfo.giftEffectiveTime.value[0] &&
                        giftInfo.giftEffectiveTime.value[0] != "0"
                            ? parseInt(
                                  giftInfo.giftEffectiveTime.value[0].format(
                                      "YYYYMMDD"
                                  )
                              )
                            : "",
                    validUntilDate:
                        giftInfo.giftEffectiveTime.value[1] &&
                        giftInfo.giftEffectiveTime.value[1] != "0"
                            ? parseInt(
                                  giftInfo.giftEffectiveTime.value[1].format(
                                      "YYYYMMDD"
                                  )
                              )
                            : "",
                    giftID: giftInfo.giftInfo.giftItemID,
                    giftName: giftInfo.giftInfo.giftName,
                };
            }
            if (
                this.props.type != "20" &&
                this.props.type != "21" &&
                this.props.type != "30" &&
                this.props.type != "70"
            ) {
                gifts.giftCount = giftInfo.giftCount.value;
            } else {
                gifts.giftTotalCount = giftInfo.giftTotalCount.value;
            }
            if (this.props.type == "20") {
                gifts.giftOdds = giftInfo.giftOdds.value;
            }
            gifts.sendType = giftInfo.sendType || 0;
            gifts.recommendType = giftInfo.recommendType || 0;
            gifts.lastConsumeIntervalDays = giftInfo.lastConsumeIntervalDays;
            gifts.needCount =
                typeof giftInfo.needCount === "object"
                    ? giftInfo.needCount.value
                    : giftInfo.needCount;
            return gifts;
        });
        return giftArr;
    };
    checkNeedCount = (needCount, index) => {
        const _value = parseFloat(needCount.value);
        return {
            msg: `${this.props.intl.formatMessage(STRING_SPE.dojv8nhwv2416)}`,
            validateStatus: "error",
            value: "",
        };
    };
    handlePrev = () => {
        return this.handleSubmit(true);
    };

    handleSubmit = (isPrev) => {
        return  this.handleSubmitOld(isPrev)
    }

    handleSubmitOld = (isPrev) => {
        if (isPrev) return true;
        let flag = true;
        this.props.form.validateFieldsAndScroll(
            { force: true },
            (error, basicValues) => {
                if (error) {
                    flag = false;
                }

            }
        );
        if (!flag) {
            return false;
        }
        let {
            data,
            shareImagePath,
            shareTitle,
            cleanCount,
            giftGetRule,
        } = this.state;

        const validatedRuleData = data.map((ruleInfo, index) => {
            const giftValidDaysOrEffect =
                ruleInfo.effectType != "2"
                    ? "giftValidDays"
                    : "giftEffectiveTime";

            return Object.assign(ruleInfo, {
                giftCount: this.checkgiftCount(
                    ruleInfo.giftCount,
                    index,
                    data
                ),
                giftInfo: this.checkGiftInfo(
                    ruleInfo.giftInfo,
                    index,
                    data
                ),
                needCount: this.checkNeedCount(ruleInfo.needCount, index),
                [giftValidDaysOrEffect]:
                    ruleInfo.effectType != "2"
                        ? this.checkGiftValidDays(
                                ruleInfo.giftValidDays,
                                index
                            )
                        : this.checkGiftValidDays(
                                ruleInfo.giftEffectiveTime,
                                index
                            ),
            });
        });
        const validateFlag = validatedRuleData.reduce((p, ruleInfo) => {
            const _validStatusOfCurrentIndex = Object.keys(ruleInfo).reduce(
                (flag, key) => {
                    if (
                        ruleInfo[key] instanceof Object &&
                        ruleInfo[key].hasOwnProperty("validateStatus")
                    ) {
                        const _valid =
                            ruleInfo[key].validateStatus === "success";
                        return flag && _valid;
                    }
                    return flag;
                },
                true
            );
            return p && _validStatusOfCurrentIndex;
        }, true);
        // 把中奖率累加,判断总和是否满足小于等于100
        const validOdds = data.reduce((res, cur) => {
            return res + parseFloat(cur.giftOdds.value);
        }, 0);
        data = validatedRuleData;
        this.setState({ data });
        if (validateFlag) {
            if (validOdds > 100) {
                message.warning(
                    `${this.props.intl.formatMessage(STRING_SPE.dojwosi415179)}`
                );
                return false;
            }
            let giftInfo = this.getGiftInfo(data);

            this.props.setSpecialBasicInfo(giftInfo);
            this.props.setSpecialBasicInfo(
                this.props.type == {
                          giftGetRule,
                          shareImagePath,
                          shareTitle,
                          cleanCount,
                      }
            );
            this.props.setSpecialGiftInfo(giftInfo);

            return true;
        }
        return false;
    };

    checkgiftCount = (giftCount, index, giftInfoArray) => {
        const _value = parseFloat(giftCount.value);
        if (!(_value > 0 && _value < 51)) {
            return {
                msg: `${this.props.intl.formatMessage(
                    STRING_SPE.d4h176ei7g133276
                )}`,
                validateStatus: "error",
                value: "",
            };
        }
        return {
            ...giftCount,
            validateStatus: "success",
            msg: "",
        };
    };

    // 有效天数
    checkGiftValidDays = (giftValidDays, index) => {
        const _value =
            giftValidDays.value instanceof Array
                ? giftValidDays.value
                : parseFloat(giftValidDays.value);
        if (_value > 0 || (_value[0] && _value[1])) {
            return giftValidDays;
        }
        return {
            msg: `${this.props.intl.formatMessage(
                STRING_SPE.d21644a8a593a3277
            )}`,
            validateStatus: "error",
            value: "",
        };
    };

    // 校验礼品信息
    checkGiftInfo = (giftInfo, index, giftInfoArray) => {
        if (giftInfo.giftItemID === null || giftInfo.giftName === null) {
            return {
                giftItemID: null,
                giftName: null,
                validateStatus: "error",
                msg: `${this.props.intl.formatMessage(
                    STRING_SPE.d16hffkc88d3164
                )}`,
            };
        }
        return {
            ...giftInfo,
            validateStatus: "success",
            msg: "",
        };
    };
    gradeChange = (gifts, typeValue) => {
        // 赠送优惠券
        const typePropertyName = "sendType";
        if (!Array.isArray(gifts)) return;
        const { data } = this.state;
        this.setState({
            data: [
                ...data.filter((item) => item[typePropertyName] !== typeValue),
                ...gifts,
            ],
        });
    };


    // 修改State
    modifyState = (key, val) => {
        this.setState({
            [key]: val
        })
    }

    // 券包数据变更
    onBagChange = (item) => {
        if(item) {
            this.setState({ bag: [item]});
            return;
        }
        this.setState({ bag: null});
    }

    // 渲染对应的赠送礼品编辑界面
    renderCorrespondingPanel = ()=>{
        const { bag, sendTypeValue } = this.state;
        const {accountInfo: {
            groupID
        }} = this.props.user;
        switch(sendTypeValue) {
            case '0': return (
                <Row>
                    <Col span={17} offset={2}>
                        <AddGifts
                            maxCount={10}
                            type={this.props.type}
                            isNew={this.props.isNew}
                            value={
                                this.state.data
                                    .filter(gift => gift.sendType === 0)
                                    .sort((a, b) => a.needCount - b.needCount)
                            }
                            onChange={(gifts) => this.gradeChange(gifts, 0)}
                        />
                    </Col>
                </Row>
            );
            break;
            case '1': return (
                <Row>
                    <Col span={20} offset={2}>
                        <TicketBag groupID={groupID} bag={bag} onChange={this.onBagChange} />
                    </Col>
                </Row>
            )
            break;

            case '2': return (
                <div>
                    积分
                </div>
            )
        }
    }

    render() {

        const { sendTypeValue } = this.state;
        return (
            <div style={{position: 'relative'}}>
                <Row>
                    <Col span={20} offset={2}>
                        <RadioGroup onChange={({target: {value}}) => this.modifyState('sendTypeValue', value)} value={sendTypeValue}>
                            <Radio value={'0'}>独立优惠券</Radio>
                            <Radio value={'1'}>券包</Radio>
                            <Radio value={'2'}>积分</Radio>
                        </RadioGroup>
                    </Col>
                </Row>

                {this.renderCorrespondingPanel()}
            </div>

        );
    }
}

function mapStateToProps(state) {
    return {
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
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
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(SpecialDetailInfo));
