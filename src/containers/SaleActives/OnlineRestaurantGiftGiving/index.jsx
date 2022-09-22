import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Radio, Modal, Spin } from "antd";
import moment from "moment";
import { jumpPage, closePage, axios } from "@hualala/platform-base";
import _ from "lodash";
import BasicInfoForm from "./components/BasicInfoForm";
import UsageRuleForm from "./components/UsageRuleForm";
import { queryActiveList, putEvent, getEvent, postEvent } from "./AxiosFactory";
import styles from "./styles.less";
import { asyncParseForm } from "../../../helpers/util";
import { FetchCrmCardTypeLst } from "../../../redux/actions/saleCenterNEW/crmCardType.action";
import { getItervalsErrorStatus } from "../ManyFace/Common";

class OnlineRestaurantGiftGiving extends Component {
    constructor() {
        super();
        this.state = {
            basicForm: null, //基本信息表单
            formData: {}, //表单数据
            ruleForm: null, //使用规则表单
            giftsForm: [], //礼品信息表单
            occupyShopList: [],
            paramsValue: [],
            viewRuleVisible: false,
            slectedWxCouponList: [], //三方微信券,
        };
    }
    componentDidMount() {
        this.queryGroupEventParamList({});
        this.props.FetchCrmCardTypeLst({});
        this.getEventDetail();
        this.props.getSubmitFn(this.handleSubmit);
    }

    getEventDetail = () => {
        const { itemID } = this.props;
        if (itemID) {
            getEvent({ itemID }).then((res) => {
                const formData = this.transformFormData(res);
                this.setState({
                    formData,
                });
            });
        }
    };

    setSlectedWxCouponList = (slectedWxCouponList) => {
        this.setState({
            slectedWxCouponList,
        });
    };

    transformFormData = (res) => {
        const { data = {}, timeList = [], gifts = [] } = res;
        let formData = {
            ...data,
            eventRange:
                data.eventEndDate && data.eventStartDate
                    ? [
                          moment(data.eventStartDate, "YYYYMMDD"),
                          moment(data.eventEndDate, "YYYYMMDD"),
                      ]
                    : [moment(), moment().add(6, "days")],
            gifts: gifts.map((item) => {
                return {
                    ...item,
                    giftIDNumber: item.giftID,
                    countType: item.effectType == 3 ? "1" : "0",
                    rangeDate:
                        item.effectType == 2 &&
                        item.effectTime &&
                        item.validUntilDate
                            ? [
                                  moment(item.effectTime, "YYYYMMDDHHmmss"),
                                  moment(item.validUntilDate, "YYYYMMDDHHmmss"),
                              ]
                            : [],
                };
            }),
            timeList: timeList.length
                ? timeList.map((x) => {
                      const { startTime, endTime } = x;
                      if (startTime && endTime) {
                          const st = moment(startTime, "HH:mm");
                          const et = moment(endTime, "HH:mm");
                          return { startTime: st, endTime: et };
                      }
                      return { id: "0" };
                  })
                : [{ id: "0" }],
            partInTimes1:
                data.countCycleDays != "0" ? data.partInTimes : undefined,
            joinType:
                data.countCycleDays != "0"
                    ? "2"
                    : data.partInTimes != "0"
                    ? "1"
                    : "0",
        };
        if (data.cardLevelRangeType && data.cardLevelRangeType == 2) {
            formData.cardTypeIDList = data.cardLevelIDList || [];
        } else if (data.cardLevelRangeType && data.cardLevelRangeType == 5) {
            formData.cardLevelIDList = data.cardLevelIDList || [];
        } else {
            formData.cardLevelIDList = [];
        }
        let cycleType = "";
        if (data.validCycle) {
            // 根据["w1", "w3", "w5"]获取第一个字符
            [cycleType] = data.validCycle[0];
        }
        formData.validCycle = data.validCycle;
        formData.cycleType = cycleType;
        let advMore = false;
        if (
            timeList.length ||
            cycleType ||
            (data.excludedDate && data.excludedDate.length)
        ) {
            advMore = true;
        }
        formData.advMore = advMore;
        let couponType = '0'
        if (gifts && gifts.length) {
            let { presentType } = gifts[0];
            presentType == 7 ? (couponType = "1") : (couponType = '0');
        }
        formData.couponType = couponType;
        formData.giftCount = couponType == "1" && gifts.length ? gifts[0].giftCount : '';
        this.setState({
            slectedWxCouponList: gifts,
        });
        if (this.state.ruleForm) {
            this.state.ruleForm.setFieldsValue({ gifts: formData.gifts });
        }
        return formData;
    };

    formatTimeList = (list) => {
        if (!list) {
            return [];
        }
        const times = [];
        list.forEach((x) => {
            const { startTime, endTime } = x;
            if (startTime && endTime) {
                const st = moment(startTime).format("HHmm");
                const et = moment(endTime).format("HHmm");
                times.push({ startTime: st, endTime: et });
            }
        });
        return times;
    };

    checkAndFormatParams = (values) => {
        const {
            validCycle = [],
            cycleType,
            eventRange = [],
            gifts = [],
            timeList = [],
        } = values;
        const event = {
            eventWay: "23",
            eventName: values.eventName,
            cycleType,
            excludedDate: values.excludedDate,
            enterPosition: values.enterPosition,
            eventRemark: values.eventRemark,
            smsGate: values.smsGate,
            partInUser: values.partInUser,
            giftSendType: values.giftSendType,
            cardLevelRangeType: values.cardLevelRangeType,
            cardLevelIDList: values.cardLevelRangeType
                ? values.cardLevelRangeType == 2
                    ? values.cardTypeIDList
                    : values.cardLevelIDList
                : [],
            shopIDList: values.shopIDList,
            partInTimes:
                values.countCycleDays && values.countCycleDays != 0
                    ? values.partInTimes1
                    : values.partInTimes,
            countCycleDays: values.countCycleDays,
            autoRegister: values.autoRegister,
        };
        let params = {
            event,
            gifts: [],
            timeList: this.formatTimeList(timeList),
        };
        if (cycleType) {
            const cycle = validCycle.filter((x) => x[0] === cycleType);
            params.event.validCycle = cycle;
        } else {
            params.event.validCycle = [];
        }
        params.event.eventStartDate = eventRange.length
            ? eventRange[0].format("YYYYMMDD")
            : "";
        params.event.eventEndDate = eventRange.length
            ? eventRange[1].format("YYYYMMDD")
            : "";
        delete params.event.eventRange;
        if (values.couponType == 1) {
            params.gifts = this.state.slectedWxCouponList.map((item) => {
                return {
                    ...item,
                    giftName: item.batchName || item.giftName,
                    giftID: item.giftID || item.itemID,
                    giftEffectTimeHours:
                        item.effectGiftTimeHours || item.giftEffectTimeHours,
                    sendType: "0",
                    giftCount: values.giftCount,
                    presentType: 7,
                    giftValidUntilDayCount:
                        item.validUntilDays || item.giftValidUntilDayCount,
                    effectTime: item.EGiftEffectTime || item.effectTime,
                };
            });
        } else {
            params.gifts = gifts.map((item) => {
                delete item.giftIDNumber;
                let v = {
                    ...item,
                    effectType:
                        item.effectType == 2 ? 2 : item.countType == "0" ? 1 : 3,
                    effectTime:
                        item.effectType == 2 &&
                        item.rangeDate &&
                        item.rangeDate.length
                            ? item.rangeDate[0].format("YYYYMMDD")
                            : "",
                    validUntilDate:
                        item.effectType == 2 &&
                        item.rangeDate &&
                        item.rangeDate.length
                            ? item.rangeDate[1].format("YYYYMMDD")
                            : "",
                };
                delete v.countType;
                return v;
            });
        }
        return params;
    };

    handleSubmit = () => {
        const {
            basicForm,
            ruleForm,
            giftsForm = [],
            slectedWxCouponList = [],
        } = this.state;
        const forms = [basicForm, ruleForm].concat(giftsForm);
        asyncParseForm(forms).then(({ values, error }) => {
            if (error) return;
            const { validCycle = [], cycleType, timeList } = values;
            if (!slectedWxCouponList.length) {
                message.warn("请添加一个第三方微信优惠券");
                return false;
            }
            const newTimeList = this.formatTimeList(timeList);
            if (newTimeList.length > 0) {
                const { hasError, errorMessage } =
                    getItervalsErrorStatus(newTimeList);
                if (hasError) {
                    message.warning(errorMessage);
                    return null;
                }
            }
            if (cycleType) {
                const cycle = validCycle.filter((x) => x[0] === cycleType);
                if (cycle.length <= 0)
                    return message.warning("周期【每逢】必须选则一项~");
            }
            const payload = this.checkAndFormatParams(values);
            this.preSubmit(payload);
        });
    };

    preSubmit = (payload) => {
        const { accountInfo, itemID } = this.props;
        const { event, timeList } = payload;
        const params = {
            eventInfo: {
                eventWay: 23,
                enterPosition: event.enterPosition,
                eventEndDate: event.eventEndDate,
                eventStartDate: event.eventStartDate,
                shopIDList: event.shopIDList,
                timeIntervalList: this.formatTimeList(timeList),
                validCycleList: event.validCycle,
                excludedDateList: event.excludedDate,
                groupID: accountInfo.groupID,
                itemID,
            },
            itemID,
            groupID: accountInfo.groupID,
        };
        queryActiveList(params).then((dataSource) => {
            if (dataSource) {
                if (dataSource.length > 0) {
                    this.setState(
                        {
                            occupyShopList: _.union(
                                dataSource.reduce((cur, next) => {
                                    return cur.concat(next.shopIDList);
                                }, [])
                            ),
                        },
                        () => {
                            this.handleShowModalTip(dataSource)(() => {
                                this.onSubmit(payload);
                            });
                        }
                    );
                } else {
                    this.onSubmit(payload);
                }
            }
        });
    };

    onSubmit = (payload) => {
        const { itemID, isActive } = this.props;
        const { event, timeList, gifts } = payload;
        if (itemID) {
            const allData = {
                timeList: timeList,
                event: {
                    ...event,
                    itemID,
                    isActive: isActive == "0" ? 0 : 1,
                },
                gifts,
            };
            postEvent(allData).then((res) => {
                if (res) {
                    closePage();
                    jumpPage({ pageID: "1000076003" });
                }
            });
            return;
        }
        putEvent({ ...payload }).then((res) => {
            if (res.code === "000") {
                closePage();
                setTimeout(() => {
                    jumpPage({ pageID: "1000076003" });
                });
            }
        });
    };

    handleShowModalTip = (data) => (handleNext) => {
        Modal.confirm({
            title: "温馨提示",
            content: this.tipContent(data),
            iconType: "exclamation-circle",
            cancelText: "我再想想",
            okText: "继续创建",
            onOk() {
                handleNext();
            },
            onCancel() {},
        });
    };

    tipContent = (data) => {
        return (
            <div className={styles.activeTipBox}>
                【
                {data.map((item, index) => (
                    <span className={styles.eventNameTip}>
                        {item.eventName}
                        {index + 1 === data.length ? null : "、"}
                    </span>
                ))}
                】
                {`活动中存在当前已选适用店铺，如继续创建，这些店铺将按照${
                    this.state.paramsValue == 1
                        ? "当前活动规则"
                        : "之前创建最早的活动规则"
                }进行执行`}
                <span
                    onClick={() => this.setState({ viewRuleVisible: true })}
                    className={styles.viewRuleTip}
                >
                    查看设置活动规则
                </span>
            </div>
        );
    };

    queryGroupEventParamList = () => {
        const { accountInfo } = this.props;
        axios
            .post("/api/v1/universal", {
                service: "HTTP_SERVICE_URL_PROMOTION_NEW",
                method: "/specialPromotion/queryGroupEventParamList.ajax",
                type: "post",
                data: { groupID: accountInfo.groupID },
            })
            .then((res) => {
                if (res.code === "000") {
                    const {
                        data: { eventParamInfoList = [] },
                    } = res;
                    this.setState({
                        paramsValue: eventParamInfoList.find(
                            (item) => item.eventWay == 23
                        ).paramsValue,
                    });
                } else {
                    message.error(res.message);
                }
            });
    };

    onCloseViewRuleModal = () => {
        this.setState({ viewRuleVisible: false });
    };

    render() {
        const { basicForm, ruleForm, formData, slectedWxCouponList } = this.state;
        const { accountInfo, user, cardTypeLst, loading } = this.props;
        const itemProps = {
            accountInfo,
            user,
            cardTypeLst,
        };
        return (
            <div className={styles.formContainer}>
                <Spin spinning={false}>
                    <div className={styles.logoGroupHeader}>基本信息</div>
                    <BasicInfoForm
                        basicForm={basicForm}
                        getForm={(form) => this.setState({ basicForm: form })}
                        formData={formData}
                        {...itemProps}
                    />
                    <div className={styles.logoGroupHeader}>使用规则</div>
                    <UsageRuleForm
                        ruleForm={ruleForm}
                        getGiftForm={(form) =>
                            this.setState({ giftsForm: form })
                        }
                        setSlectedWxCouponList={this.setSlectedWxCouponList}
                        slectedWxCouponList={slectedWxCouponList}
                        getForm={(form) => this.setState({ ruleForm: form })}
                        formData={formData}
                        {...itemProps}
                    />
                </Spin>
                {this.state.viewRuleVisible && (
                    <Modal
                        maskClosable={false}
                        visible={true}
                        width={700}
                        title="活动规则"
                        onCancel={this.onCloseViewRuleModal}
                        onOk={this.onCloseViewRuleModal}
                        wrapClassName={styles.viewRuleVisibleModal}
                    >
                        <div style={{ marginBottom: 10 }}>
                            <div className={styles.ruleModalTitle}>
                                <span className={styles.name}>
                                    线上餐厅弹窗送礼
                                </span>
                                当同一时间、同一门店、同一发放位置下存在多个活动时，将按照以下规则执行
                            </div>
                            <div>
                                <span className={styles.computeRule}>
                                    计算规则
                                </span>
                                <Radio.Group
                                    name="radiogroup"
                                    defaultValue={this.state.paramsValue}
                                    onChange={({ target }) => {
                                        this.setState({
                                            paramsValue: target.value,
                                        });
                                    }}
                                >
                                    <Radio value={1}>
                                        按创建时间最近的执行
                                    </Radio>
                                    <Radio value={2}>
                                        按创建时间最早的执行
                                    </Radio>
                                </Radio.Group>
                            </div>
                        </div>
                    </Modal>
                )}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountInfo: state.user.get("accountInfo").toJS(),
        user: state.user.toJS(),
        cardTypeLst: state.sale_crmCardTypeNew.get("cardTypeLst").toJS(),
        loading: state.sale_crmCardTypeNew.get("loading"),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        FetchCrmCardTypeLst: (opts) => {
            dispatch(FetchCrmCardTypeLst(opts));
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OnlineRestaurantGiftGiving);
