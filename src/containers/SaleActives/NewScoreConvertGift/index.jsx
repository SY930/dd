import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Radio, Modal, Spin } from "antd";
import moment from "moment";
import { jumpPage, closePage, axios } from "@hualala/platform-base";
import _ from "lodash";
import BasicInfoForm from "./components/BasicInfoForm";
import UsageRuleForm from "./components/UsageRuleForm";
import ApprovalForm from "./components/ApprovalForm";
import { putEvent, getEvent, postEvent } from "./AxiosFactory";
import styles from "./styles.less";
import { asyncParseForm } from "../../../helpers/util";
import { isZhouheiya, isGeneral, isCheckApproval } from "../../../constants/WhiteList";

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
            approvalInfo: {},
            cardLevelInfo: {}
        };
    }
    componentDidMount() {
        this.getEventDetail(); //获取活动详情
        this.props.getSubmitFn(this.handleSubmit);
    }

    getEventDetail = () => {
        const { itemID } = this.props;
        if (itemID) {
            // getEvent({ itemID }).then((res) => {
            //     const formData = this.transformFormData(res);
            //     this.setState({
            //         formData,
            //     });
            // });
            const { $eventInfo, $giftInfo } = this.props.specialPromotion;
            const formData = this.transformFormData({
                data: $eventInfo,
                gifts: $giftInfo
            });
            this.setState({
                formData,
            });
        }
    };

    //把接口返回的数据转成表单需要的数据
    transformFormData = (res) => {
        const { mode } = this.props;
        const { data = {}, gifts = [] } = res;
        let formData = {
            ...data,
            eventRange:
                data.eventEndDate && data.eventStartDate && mode != 'copy'
                    ? [
                          moment(data.eventStartDate, "YYYYMMDD"),
                          moment(data.eventEndDate, "YYYYMMDD"),
                      ]
                    : [moment(), moment().add(6, "days")],
            partInTimes1:
                data.countCycleDays != "0" ? data.partInTimes : undefined,
            joinType:
                data.countCycleDays != "0"
                    ? "2"
                    : data.partInTimes != "0"
                    ? "1"
                    : "0",
        };

        //回显
        const orgsList = data.orgs || [];

        this.setState({
            //会员范围
            cardLevelInfo: {
                cardLevelRangeType: data.cardLevelRangeType,
                cardLevelIDList: data.cardLevelIDList,
            },
            //门店
            shopAreaData: {
                list: orgsList.map(item => item.shopID),
                type: orgsList[0] && orgsList[0].shopType == '2' ? 'area' : 'shop'
            },
            orgs: orgsList,

        })
        //兑换类型
        if(gifts[0].presentType == 1) {
            formData.exchangeType = '1';
            this.setState({
                couponData: gifts.map(item => ({
                    ...item,
                    effectTime: item.effectTime.slice(0,8),
                    validUntilDate: item.validUntilDate.slice(0,8)
                }))
            })
        } else {
            formData.exchangeType = '0';
            this.setState({
                goodsData: gifts.map(item => ({
                    ...item,
                    goodsName: item.giftName,
                    goodsID: item.giftID,
                    brandID: item.giftBrandID,
                    fullName: item.categoryFullName,
                    unit: item.giftUnitName,
                    brandName: item.giftBrandName
                }))
            })
        }
        return formData;
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
            cardLevelRangeType: values.cardLevelRangeType || '2'
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
            shopAreaData,
            orgs,
            goodsData,
            couponData,
            approvalInfo = {},
            cardLevelInfo = {}
        } = this.state;
        const { mode } = this.props;
        const forms = [basicForm, ruleForm, approvalForm];
        asyncParseForm(forms).then(({ values, error }) => {
            if (error) return;
            let params = {
                ...values,
                orgs,
                ...approvalInfo,
                ...cardLevelInfo
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
            if(isCheckApproval && (!approvalInfo.activityCost || !approvalInfo.activityRate || !approvalInfo.estimatedSales || !approvalInfo.auditRemark)) {
                return;
            }
            
            console.log('校验通过 =>', {
                ...params,
                gifts: giftList
            });
            // return
            const payload = this.checkAndFormatParams({
                ...params,
                gifts: giftList
            });
            this.onSubmit(payload);
        });
    };

    onSubmit = (payload) => {
        const menuID = this.props.user.menuList.find(tab => tab.entryCode === '1000076003').menuID;
        const { itemID, accountInfo, mode } = this.props;
        const { event, gifts } = payload;
        let allData = {
            event: {
                ...event,
                groupID: accountInfo.groupID,
            },
            gifts,
        };
        if (itemID && mode == 'edit') {
            allData.event.itemID = itemID;
            postEvent(allData).then((res) => {
                if (res) {
                    closePage();
                    // jumpPage({ pageID: "1000076003" });
                    jumpPage({ menuID, from: 'create' })
                }
            });
            return;
        }
        putEvent(allData).then((res) => {
            if (res.code === "000") {
                closePage();
                // setTimeout(() => {
                //     jumpPage({ pageID: "1000076003" });
                // });
                jumpPage({ menuID, from: 'create' })
            }
        });
    };

    render() {
        const { basicForm, ruleForm, approvalForm, formData, shopAreaData, goodsData, couponData, cardLevelInfo } =
            this.state;
        const { accountInfo, user, loading, mode } = this.props;
        const itemProps = {
            accountInfo,
            user,
        };
        return (
            <div className={styles.formContainer}>
                {/* {mode == "view" ? (
                    <div className={styles.stepOneDisabled}></div>
                ) : null} */}
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
                        cardLevelInfo={cardLevelInfo}
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
        specialPromotion: state.sale_specialPromotion_NEW.toJS(),
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NewScoreConvertGift);
