
/*
 * @Author: xinli xinli@hualala.com
 * @Date: 2022-10-10 14:36:10
 * @LastEditors: xinli xinli@hualala.com
 * @LastEditTime: 2022-12-14 15:40:35
 * @FilePath: /platform-sale/src/containers/SaleActives/SeckillInLimitedTime/index.jsx
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Radio, Modal, Spin } from "antd";
import moment from "moment";
import { jumpPage, closePage, axios } from "@hualala/platform-base";
import _ from "lodash";
import BasicInfoForm from "./components/BasicInfoForm";
import UsageRuleForm from "./components/UsageRuleForm";
import { queryActiveList, putEvent, getEvent, postEvent, getSettleList, getCardTypeList } from "./AxiosFactory";
import styles from "./styles.less";
import { asyncParseForm } from "../../../helpers/util";

class SeckillInLimitedTime extends Component {
    constructor() {
        super();
        this.state = {
            basicForm: null, //基本信息表单
            formData: {}, //表单数据
            ruleForm: null, //使用规则表单
            giftsForm: [], //礼品信息表单
            occupyShopList: [],
            giftList: [],
            paramsValue: "",
            viewRuleVisible: false,
            settlesOpts: [],
            groupCardTypeList: [],
        };
    }
    componentDidMount() {
        this.getEventDetail(); //获取活动详情
        const { accountInfo: {groupID}, itemID } = this.props;
        getSettleList({ groupID }).then(list => {
            const settlesOpts = list.map(x => ({ value: `${x.settleUnitID}`, label: x.settleUnitName }));
            this.setState({ settlesOpts });
        })
        getCardTypeList().then(list => {
            this.setState({ groupCardTypeList: list });
        })
        this.props.getSubmitFn(this.handleSubmit)
    }

    getEventDetail = () => {
        const { itemID } = this.props;
        if (itemID) {
            getEvent({ itemID }).then(res => {
                const formData = this.transformFormData(res);
                this.setState({
                    formData
                });
            });
        }
    };

    //把接口返回的数据转成表单需要的数据
    transformFormData = res => {
        const { data = {}, timeList = [], gifts = [] } = res;
        let startTime = null;
        let endTime = null;
        if(data.eventEndDate && data.eventStartDate){
            if(timeList && timeList.length > 0){
                startTime = data.eventStartDate + timeList[0].startTime;
                endTime = data.eventEndDate + timeList[0].endTime;
            }else{
                startTime = data.eventStartDate + '0000';
                endTime = data.eventEndDate + '0000';
            }
        }
        if(data.tagLst){
            data.tagLst = data.tagLst.split(',');
        }
        let formData = {
            ...data,
            eventRange:
                data.eventEndDate && data.eventStartDate
                    ? [moment(startTime, "YYYY-MM-DD HH:mm"), moment(endTime, "YYYY-MM-DD HH:mm")]
                    : '',
            gifts: gifts.map(item => {
                return {
                    ...item,
                    giftName: item.giftName,
                    giftID: item.giftID,
                    giftTotalCount: item.giftTotalCount,
                    buyLimit: item.buyLimit,
                    presentValue: item.presentValue,
                    giftGetRuleValue: item.giftGetRuleValue,
                };
            })
        };
        //强制给礼品表单塞数据，否则回显不了
        if (this.state.ruleForm) {
            this.state.ruleForm.setFieldsValue({ gifts: formData.gifts });
        }
        return formData;
    };

    //时间段格式化
    formatTimeList = list => {
        if (!list) {
            return [];
        }
        const times = [];
        const st = moment(list[0]).format("HHmm");
        const et = moment(list[1]).format("HHmm");
        times.push({ startTime: st.substr(0,2) + '00', endTime: et.substr(0,2) + '00' });
        return times;
    };

    //表单数据处理成接口需要的数据
    checkAndFormatParams = values => {
        const { eventRange = [] } = values;
        const { giftList } = this.state;
        //直接拿到的values有好多不需要的字段，所以单个处理
        const event = {
            eventWay: "95",
            eventName: values.eventName,
            eventRemark: values.eventRemark,
            shopIDList: values.shopIDList || [],
            shopRange: values.shopIDList && values.shopIDList.length > 0 ? 1 : 2,//部分店铺为1，全部为2
            settleUnitID: values.settleUnitID,
            cardTypeID: values.cardTypeID,
            eventCode: values.eventCode,
            participateRule: 2,
            tagLst: Array.isArray(values.tagLst) ? values.tagLst.join(',') : '',
        };
        let params = {
            event,
            gifts: giftList,
            timeList: this.formatTimeList(eventRange)
        };
        params.event.eventStartDate = eventRange.length ? eventRange[0].format("YYYYMMDD") : "";
        params.event.eventEndDate = eventRange.length ? eventRange[1].format("YYYYMMDD") : "";
        params.startTimeStr = eventRange.length ? eventRange[0].format("YYYY/MM/DD HH:mm") : "";
        params.endTimeStr = eventRange.length ? eventRange[1].format("YYYY/MM/DD HH:mm") : "";
        delete params.event.eventRange;
        return params;
    };

    handleSubmit = () => {
        const { basicForm, ruleForm, giftsForm = [] } = this.state;
        const forms = [basicForm, ruleForm].concat(giftsForm);
        asyncParseForm(forms).then(({ values, error }) => {
            if (error) return;
            // const { timeList } = values;
            // const newTimeList = this.formatTimeList(timeList);
            // if (newTimeList.length > 0) {
            //     const { hasError, errorMessage } = getItervalsErrorStatus(newTimeList); //时间段交叉校验
            //     if (hasError) {
            //         message.warning(errorMessage);
            //         return null;
            //     }
            // }
            
            const payload = this.checkAndFormatParams(values);
            this.preSubmit(payload);
        });
    };

    preSubmit = payload => {
        const { accountInfo, itemID } = this.props;
        const { event, timeList } = payload;
        const params = {
            eventInfo: {
                eventWay: 95,
                // enterPositionList: event.enterPositionList,
                eventEndDate: event.eventEndDate,
                eventStartDate: event.eventStartDate,
                shopIDList: event.shopIDList,
                timeIntervalList: timeList,
                groupID: accountInfo.groupID,
                eventCode: event.eventCode,
                itemID
            },
            itemID,
            groupID: accountInfo.groupID
        };
        //判断活动交叉
        queryActiveList(params).then(dataSource => {
            if (dataSource) {
                if (dataSource.length > 0) {
                    this.setState(
                        {
                            occupyShopList: _.union(
                                dataSource.reduce((cur, next) => {
                                    return cur.concat(next.shopIDList);
                                }, [])
                            )
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

    onSubmit = payload => {
        const { itemID, isActive } = this.props;
        const { event: {eventStartDate, eventEndDate}, timeList, gifts, startTimeStr, endTimeStr} = payload;
        let startTime = null;
        let endTime = null;
        if( eventEndDate && eventStartDate ){
            if(timeList && timeList.length > 0){
                startTime = eventStartDate + timeList[0].startTime;
                endTime = eventEndDate + timeList[0].endTime;
            }else{
                startTime = eventStartDate + '0000';
                endTime = eventEndDate + '0000';
            }
        }
        if((new Date(endTimeStr).getTime() - new Date(startTimeStr).getTime()) > 604800000){ //大于七天
            message.warning('活动时长最长支持7天，请重新设置');
            return 
        }
        delete payload.startTimeStr;
        delete payload.endTimeStr;
        if (itemID) {
            const allData = {
                timeList: timeList,
                event: {
                    ...event,
                    itemID,
                    isActive: isActive == "0" ? 0 : 1
                },
                gifts
            };
            postEvent(allData).then(res => {
                if (res) {
                    closePage();
                    jumpPage({ pageID: "1000076003" });
                }
            });
            return;
        }
        putEvent({ ...payload }).then(res => {
            if (res.code === "000") {
                closePage();
                setTimeout(() => {
                    jumpPage({ pageID: "1000076003" });
                });
            }
        });
    };

    handleShowModalTip = data => handleNext => {
        Modal.confirm({
            title: "温馨提示",
            content: this.tipContent(data),
            iconType: "exclamation-circle",
            cancelText: "我再想想",
            okText: "继续创建",
            onOk() {
                handleNext();
            },
            onCancel() {}
        });
    };

    tipContent = data => {
        return (
            <div className={styles.activeTipBox}>
                【
                {data.map((item, index) => (
                    <span className={styles.eventNameTip}>
                        {item.eventName}
                        {index + 1 === data.length ? null : "、"}
                    </span>
                ))}
                】活动中存在当前已选适用店铺，是否继续创建？
                {/* {`活动中存在当前已选适用店铺，如继续创建，这些店铺将按照${
                    this.state.paramsValue == 1
                        ? "当前活动规则"
                        : "之前创建最早的活动规则"
                }进行执行`}
                <span
                    onClick={() => this.setState({ viewRuleVisible: true })}
                    className={styles.viewRuleTip}
                >
                    查看设置活动规则
                </span> */}
            </div>
        );
    }

    onCloseViewRuleModal = () => {
        this.setState({ viewRuleVisible: false });
    }
    onGiftChange = (giftList) => {
        this.setState({giftList})
    }
    render() {
        const { basicForm, ruleForm, formData, settlesOpts, groupCardTypeList } = this.state;
        const { accountInfo, user, cardTypeLst, loading, isView } = this.props;
        const itemProps = {
            accountInfo,
            user,
            cardTypeLst,
            settlesOpts,
            groupCardTypeList,
            isView
        };
        return (
            <div className={`${styles.formContainer} ${ isView ? styles.isViewContainer : ''}`} >
                {/* {isView == "true" ? <div className={styles.stepOneDisabled}></div> : null} */}
                <Spin spinning={loading}>
                    <div className={styles.logoGroupHeader}>基本信息</div>
                    <BasicInfoForm 
                        basicForm={basicForm} 
                        getForm={form => this.setState({ basicForm: form })} 
                        formData={formData} 
                        isView={isView}
                        {...itemProps}
                    />
                    <div className={styles.logoGroupHeader}>使用规则</div>
                    <UsageRuleForm
                        ruleForm={ruleForm}
                        basicForm={basicForm}
                        getGiftForm={form => this.setState({ giftsForm: form })}
                        getForm={form => this.setState({ ruleForm: form })}
                        formData={formData}
                        onGiftChange={this.onGiftChange}
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
                                <span className={styles.name}>限时秒杀</span>
                                当同一时间、同一门店、同一发放位置下存在多个活动时，将按照以下规则执行
                            </div>
                            <div>
                                <span className={styles.computeRule}>执行规则</span>
                                <Radio.Group
                                    name="radiogroup"
                                    value={this.state.paramsValue}
                                    onChange={({ target }) => {
                                        this.setState({
                                            paramsValue: target.value
                                        });
                                    }}
                                >
                                    <Radio value={1}>按创建时间最近的执行</Radio>
                                    <Radio value={2}>按创建时间最早的执行</Radio>
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
        // FetchCrmCardTypeLst: (opts) => {
        //     dispatch(FetchCrmCardTypeLst(opts));
        // },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SeckillInLimitedTime);
