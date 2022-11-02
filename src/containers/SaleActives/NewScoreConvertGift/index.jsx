import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Radio, Modal, Spin } from "antd";
import moment from "moment";
import { jumpPage, closePage, axios } from "@hualala/platform-base";
import _ from "lodash";
import BasicInfoForm from "./components/BasicInfoForm";
import UsageRuleForm from "./components/UsageRuleForm";
import ApprovalForm from "./components/ApprovalForm";
import { queryActiveList, putEvent, getEvent, postEvent } from "./AxiosFactory";
import styles from "./styles.less";
import { asyncParseForm } from "../../../helpers/util";
import { getItervalsErrorStatus } from "../ManyFace/Common";
import { isZhouheiya, isGeneral } from "../../../constants/WhiteList";

class NewScoreConvertGift extends Component {
    constructor() {
        super();
        this.state = {
            basicForm: null, //基本信息表单
            formData: {}, //表单数据
            ruleForm: null, //使用规则表单
            approvalForm: {}, //审批设置
            shopAreaData: {
                list: [],
                type: 'shop', //shop | area
            },
            orgs: [],
            goodsData: [],
            couponData: [],
            approvalInfo: {}
        };
    }
    componentDidMount() {
        this.getEventDetail(); //获取活动详情
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

    //把接口返回的数据转成表单需要的数据
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
                : [{ id: "0" }], //时间段增加默认值
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
            //会员范围为卡类别
            formData.cardTypeIDList = data.cardLevelIDList || [];
        } else if (data.cardLevelRangeType && data.cardLevelRangeType == 5) {
            //会员范围为卡等级
            formData.cardLevelIDList = data.cardLevelIDList || [];
        } else {
            formData.cardLevelIDList = [];
        }
        //选择周期
        let cycleType = "";
        if (data.validCycle) {
            // 根据["w1", "w3", "w5"]获取第一个字符
            [cycleType] = data.validCycle[0];
        }
        //高级日期设置 true/false
        let advMore = false;
        if (
            timeList.length ||
            cycleType ||
            (data.excludedDate && data.excludedDate.length)
        ) {
            advMore = true;
        }
        //这有BaseForm的坑，必须先设置advMore， 后设置cycleType
        formData.advMore = advMore;
        formData.validCycle = data.validCycle;
        formData.cycleType = cycleType;
        let couponType = "0";
        if (gifts && gifts.length) {
            let { presentType } = gifts[0];
            presentType == 7 ? (couponType = "1") : (couponType = "0"); //presentType == 7代表三方微信券
        }
        formData.couponType = couponType;
        formData.giftCount =
            couponType == "1" && gifts.length ? gifts[0].giftCount : "";
        if (couponType == 1) {
            this.setState({
                slectedWxCouponList: gifts,
            });
        }
        //强制给礼品表单塞数据，否则回显不了
        if (this.state.ruleForm) {
            this.state.ruleForm.setFieldsValue({ gifts: formData.gifts });
        }
        return formData;
    };

    //时间段格式化
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

    //表单数据处理成接口需要的数据
    checkAndFormatParams = (values) => {
        const {
            eventRange = [],
            gifts = [],
        } = values;

        let event = {
            eventWay: "89",
            ...values,
            partInTimes:
                values.countCycleDays && values.countCycleDays != 0
                    ? values.partInTimes1
                    : values.partInTimes,
        };
        event.eventStartDate = eventRange.length
            ? eventRange[0].format("YYYYMMDD")
            : "";
        event.eventEndDate = eventRange.length
            ? eventRange[1].format("YYYYMMDD")
            : "";

        delete event.gifts;
        delete event.eventRange;

        const params = {
            event,
            gifts
        };
        return params;
    };

    handleSubmit = () => {
        const {
            basicForm,
            ruleForm,
            approvalForm,
            slectedWxCouponList = [],
            shopAreaData,
            orgs,
            goodsData,
            couponData,
            approvalInfo = {},
            formData
        } = this.state;
        const { mode } = this.props;
        const forms = [basicForm, ruleForm, approvalForm];
        asyncParseForm(forms).then(({ values, error }) => {
            if (error) return;
            console.log(values, shopAreaData, orgs, goodsData, couponData, approvalInfo, mode);
            let params = {
                ...values,
                orgs,
                ...approvalInfo
            }
            const { exchangeType } = values;
            //适用店铺校验
            if(orgs && orgs.length == 0 && !isGeneral() && ['add', 'edit', 'copy'].includes(mode)) {
                return;
            }
            let validatePass = true;
            //兑换礼包校验
            if(exchangeType == 1) {
                //优惠券校验必填
                if(couponData.length == 0) {
                    message.warning("最少选择一条优惠券");
                    return;
                }
                couponData.forEach(item => {
                    if(!(item.giftCount > 0) || !(item.conditionValue > 0) || (item.giftMaxCount === null || item.giftMaxCount === undefined)) {
                        validatePass = false;
                    }
                })
            } else {
                //商品校验必填
                if(goodsData.length == 0) {
                    message.warning("最少选择一条商品");
                    return;
                }
                goodsData.forEach(item => {
                    if(!(item.giftCount > 0) || !(item.conditionValue > 0) || (item.giftMaxCount === null || item.giftMaxCount === undefined)) {
                        validatePass = false;
                    }
                })
            }
            if(!validatePass) {
                message.warning("表格必填项输入不完整");
                return;
            }
            let giftList = exchangeType == 1 ? couponData : goodsData.map(item => ({
                ...item,
                giftName: item.goodsName,
                giftID: item.goodsID,
                giftBrandID: item.brandID,
                giftUnitName: item.unit
        
            }));
            if(this.props.mode == 'copy') {
                giftList.forEach(item => {
                    item.giftSendCount = 0;
                    item.sendValue = 0;
                })
            }
            //审批校验
            if(!approvalInfo.activityCost || !approvalInfo.activityRate || !approvalInfo.estimatedSales || !approvalInfo.auditRemark) {
                return;
            }
            
            console.log('校验通过 =>', {
                ...params,
                ...params.memberRange,
                gifts: giftList
            });

            const payload = this.checkAndFormatParams({
                ...params,
                ...params.memberRange,
                gifts: giftList
            });
            this.onSubmit(payload);
        });
    };

    onSubmit = (payload) => {
        const { itemID, accountInfo } = this.props;
        const { event, gifts } = payload;
        let allData = {
            event: {
                ...event,
                groupID: accountInfo.groupID,
            },
            gifts,
        };
        if (itemID) {
            allData.event.itemID = itemID;
            postEvent(allData).then((res) => {
                if (res) {
                    closePage();
                    jumpPage({ pageID: "1000076003" });
                }
            });
            return;
        }
        putEvent(allData).then((res) => {
            if (res.code === "000") {
                // closePage();
                // setTimeout(() => {
                //     jumpPage({ pageID: "1000076003" });
                // });
                const menuID = this.props.user.menuList.find(tab => tab.entryCode === '1000076003').menuID;
                closePage()
                console.log(menuID, 'menuID');
                jumpPage({ menuID, from: 'create' })
            }
        });
    };

    render() {
        const { basicForm, ruleForm, approvalForm, formData, slectedWxCouponList, shopAreaData, goodsData, couponData } =
            this.state;
        const { accountInfo, user, loading, mode } = this.props;
        const itemProps = {
            accountInfo,
            user,
        };
        return (
            <div className={styles.formContainer}>
                {mode == "view" ? (
                    <div className={styles.stepOneDisabled}></div>
                ) : null}
                <Spin spinning={loading}>
                    <div className={styles.logoGroupHeader}>基本信息</div>
                    <BasicInfoForm
                        basicForm={basicForm}
                        mode={mode}
                        getForm={(form) => this.setState({ basicForm: form })}
                        formData={formData}
                        {...itemProps}
                    />
                    <div className={styles.logoGroupHeader}>活动规则</div>
                    <UsageRuleForm
                        ruleForm={ruleForm}
                        basicForm={basicForm}
                        mode={mode}
                        shopAreaData={shopAreaData}
                        goodsData={goodsData}
                        couponData={couponData}
                        setRuleForm={(data) => {
                            console.log(data, '设置ruleForm');
                            this.setState(data)
                        }}
                        getForm={(form) => {
                            this.setState({ ruleForm: form })
                        }}
                        formData={formData}
                        groupID={accountInfo.groupID}
                        {...itemProps}
                    />
                    <div className={styles.logoGroupHeader}>审批设置</div>
                    <ApprovalForm
                        approvalForm={approvalForm}
                        ruleForm={ruleForm}
                        basicForm={basicForm}
                        mode={mode}
                        getForm={(form) => this.setState({ approvalForm: form })}
                        formData={formData}
                        setRuleForm={(data) => {
                            console.log(data, '设置ruleForm');
                            this.setState(data)
                        }}
                        {...itemProps}
                    />
                </Spin>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        accountInfo: state.user.get("accountInfo").toJS(),
        user: state.user.toJS(),
        loading: state.sale_crmCardTypeNew.get("loading"),
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewScoreConvertGift);
