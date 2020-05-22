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
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import styles from "../../SaleCenterNEW/ActivityPage.less";
import { axiosData } from '../../../helpers/util';
import AddGifts from "../common/AddGifts";

const FormItem = Form.Item;
/**
 *  校验至少选择一个礼品
 *
 * @param {string} key
 * @param {number} ruleType
 * @param {number} roleType
 * @returns
 */
const checkChoose =  function (key,ruleType,roleType) {
    // 每个角色至少选择一个礼物
    const ruleTypeNum = Number(ruleType);
    const roleTypeNum = Number(roleType)
    const { checkBoxStatus } = this.state
    // console.log('this',this.state.checkBoxStatus,key,ruleType,roleType)
    const giftList1Key = ['giveCash','giveCoupon','giveIntegral']
    const giftList2Key = ['giveCoupon','giveIntegral']
    const giftList3Key = ['giveCard','giveIntegral','giveCash']
    console.log('checkChoosethis---',this)
    let giftList = giftList1Key
    if(
        (ruleTypeNum === 1 && roleTypeNum === 1) ||
        (ruleTypeNum === 1 && roleTypeNum === 2)
        ) {

        const chooseList =   giftList.filter(v => {
            return checkBoxStatus[`ruleType${ruleType}`][`${v}${roleType}`]
        })
        return chooseList.length
    } else if(
        (ruleTypeNum === 999)
    ) {
        giftList = giftList2Key
        const chooseList =   giftList.filter(v => {
            return checkBoxStatus[`ruleType${ruleType}`][`${v}${roleType}`]
        })
        return chooseList.length
    } else  {
        giftList = giftList3Key
        const chooseList =   giftList.filter(v => {
            return checkBoxStatus[`ruleType${ruleType}`][`${v}${roleType}`]
        })
        return chooseList.length
    }

    return true
}

/**
 * 获取现金红包列表
 *
 */
const queryRedPackets = function () {
    axiosData(
        '/coupon/couponService_getBoards.ajax',
        { giftType: '113', pageNo: 1, pageSize: 10000 },
        null,
        {path: 'data.crmGiftList',},
        'HTTP_SERVICE_URL_PROMOTION_NEW',
    ).then((records) => {
        this.setState({
            redPackets: records || []
        })
    });
}

const handleCashChange = function (key) {
    return function (e) {
        this.setState({
            cashGiftVal: e
        })
    }
}

/**
 *  赠送积分
 *
 * @param {*} roleType
 * @param {*} ruleType
 * @returns
 */
const renderGivePointFn = function(roleType,ruleType) {
    const { eventRecommendSettings,checkBoxStatus } = this.state;
    const {
        form: { getFieldDecorator },
    } = this.props;

    // console.log('renderGivePoint',roleType,ruleType)
    return (
        <FormItem
            wrapperCol={{ span: 24 }}
            className={styles.FormItemSecondStyle}
            style={{ width: "230px", marginLeft: "16px" }}
        >
            {getFieldDecorator(`presentValuePoint#${roleType}#presentType#2#recommendRule#${ruleType}`,
            {
                onChange:  this.handleRecommendSettingsChange(roleType, 'presentValue',ruleType)
                ,
                initialValue: {
                    number: eventRecommendSettings[roleType] ?
                    eventRecommendSettings[roleType]['presentValue'] : '',
                },
                rules: [
                    {
                        validator: (rule, v, cb) => {
                            if (
                                v.number === "" ||
                                v.number === undefined
                            ) {
                                return cb(
                                    checkBoxStatus[`ruleType${ruleType}`][`giveIntegral${roleType}`] ?
                                    '请输入数值' : undefined
                                    );
                            }
                            if (!v || (v.number < 0.01)) {
                                return cb(
                                     '积分应不小于0.01'
                                );
                            } else if (v.number > 1000000) {
                                return cb(
                                     '积分应不大于1000000'
                                );
                            }
                            cb();
                        },
                    },

                ],
            })(
                <PriceInput
                    addonAfter={"分"}
                    modal="float"
                    maxNum={7}
                    placeholder="请输入数值"
                />
            )
            }
        </FormItem>
    );
}

/**
 * 注册开卡后现金红包
 *
 * @param {*} ruleType
 * @param {*} roleType
 * @returns
 */
const renderCashFn = function (ruleType,roleType) {
    const { redPackets , cashGiftVal,eventRecommendSettings  } = this.state
    const {
        form: { getFieldDecorator },
    } = this.props;
    const { checkBoxStatus } = this.state
    const cashGiftKey = `cashGift${ruleType}${roleType}`
    console.log('renderCash',cashGiftVal)
    return (
        <div style={{ display: "flex" }}>
            <FormItem
                className={styles.FormItemSecondStyle}
                style={{ marginLeft: "16px", width: "230px" }}
            >
                <div style={{display: "flex", alignItems: 'center'}}>
                    <Select
                    showSearch={true}
                    notFoundContent={"没有搜索到结果"}
                    optionFilterProp="children"
                    placeholder="请选择一个已创建的红包礼品"
                    value={cashGiftVal}
                    onChange={
                        handleCashChange(cashGiftKey).bind(this)
                    }
                >
                    {redPackets.map(v => {
                        return (
                            <Select.Option key={v.giftItemID} value={v.giftItemID}>
                                {v.giftName}
                            </Select.Option>
                        )
                    })}
                    </Select>
                    <div style={{marginLeft: '5px'}}>
                        <Tooltip  title="一个活动使用现金红包只能设置一个红包账户">
                            <Icon
                                type={'question-circle'}
                                style={{ color: '#787878' }}
                                className={styles.cardLevelTreeIcon}
                            />
                        </Tooltip>
                    </div>
                </div>
            </FormItem>
            <FormItem
                className={styles.FormItemSecondStyle}
                style={{
                    marginLeft: "16px",
                    width: "211px",
                    display: "flex",
                }}
                label="红包金额"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                {getFieldDecorator(`presentValueCash#${roleType}#presentType#3#recommendRule#${ruleType}`,
                    {
                        initialValue: {
                            number: eventRecommendSettings[roleType] ?
                            eventRecommendSettings[roleType]['presentValue'] : '',
                        },
                        rules: [
                            {
                                validator: (rule, v, cb) => {
                                    if (
                                        v.number === "" ||
                                        v.number === undefined
                                    ) {
                                        return cb(
                                            checkBoxStatus[`ruleType${ruleType}`][`giveCash${roleType}`] ?
                                            '请输入数值' : undefined
                                            );
                                    }
                                    if (!v || (v.number < 0.01)) {
                                        return cb(
                                             '红包金额应不小于0.01'
                                        );
                                    } else if (v.number > 1000000) {
                                        return cb(
                                             '红包金额应不大于1000'
                                        );
                                    }
                                    cb();
                                },
                            },

                        ],
                    }
                )(
                    <PriceInput
                        addonAfter={"元"}
                        modal="float"
                        maxNum={6}
                        placeholder="请输入数值"
                        style={{ marginLeft: "11px" }}
                    />
                )}

            </FormItem>
        </div>
    );
}

/**
 * 赠送优惠券
 *
 * @param {*} roleType
 * @param {*} ruleType
 * @returns
 */
const renderRecommendGiftsFn = function (roleType,ruleType) {
    //recommendType 对应的值为 直接推荐人1，被推荐人2，间接推荐人0
    const recommendType = `${roleType}#${ruleType}`
    // 推荐有礼独有
    let filteredGifts = this.state.data.filter(
        (gift) => gift.recommendType === recommendType
    );

    if (!filteredGifts.length) {
        filteredGifts = [
            getDefaultGiftData(recommendType, "recommendType"),
        ];
    }
    console.log('filteredGifts',filteredGifts)
    return (
        <Row>
            <Col span={17} offset={4}>
                <AddGifts
                    maxCount={10}
                    typeValue={recommendType}
                    typePropertyName={"recommendType"}
                    type={this.props.type}
                    isNew={this.props.isNew}
                    value={filteredGifts}
                    onChange={(gifts) =>
                        this.gradeChange(gifts, recommendType)
                    }
                />
            </Col>
        </Row>
    );
}

const _getPresentValue = function (basicValues) {
    const gifts = []
    const beRecommendList = []
    const { cashGiftVal } = this.state
    Object.keys(basicValues).forEach(v => {
        if(v.includes('presentValue')) {
            const valArr = v.split('#')
            if(valArr[1] === '0') {
                beRecommendList.push({
                    presentType: valArr[3],
                    presentValue: basicValues[v].number
                })
            } else {
                gifts.push({
                    recommendRule: valArr[5],
                    presentType: valArr[3],
                    presentValue: basicValues[v].number,
                    giftItemID: valArr[3] === '3' ? cashGiftVal : ''
                })
            }

        }
    })

    return {
        gifts, // 直接推荐人和间接推荐人的积分和红包
        beRecommendList // 被推荐人的积分
    }
}

/**
 * 保存推荐有礼
 *
 * @param {*} isPrev
 * @returns
 */
const handleSubmitRecommendGifts = function (isPrev) {
    console.log('----',isPrev,this)
    if (isPrev) return true;
    let flag = true;
    const priceReg = /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/;
    // 积分和红包的list数据
    let presentValueList = []
    this.props.form.validateFieldsAndScroll(
        { force: true },
        (error, basicValues) => {
            console.log('err',error)
            if (error) {
                flag = false;
            }
            // 推荐有礼特有校验逻辑：两个输入框至少要有1个
           presentValueList = _getPresentValue.call(this,basicValues)
           console.log('basicValues---',presentValueList,basicValues)

        }
    );
    if (!flag) {
        return false;
    }
    /**
     *    saveMoneySetType, // 储值后获得=》储值场景限制 ，这个不用传给后端
     *    saveMoneySetIds为储值套餐，从form中取，放到events
     */

    let {
        data,
        shareImagePath,
        shareTitle,
        cleanCount,
        discountMinRate,
        discountMaxRate,
        discountRate,
        discountMaxLimitRate,
        disabledGifts,
        saveMoneySetIds,
        giftGetRule,
        // ...instantDiscountState
    } = this.state;
    console.log('data---',data)

    const recommendRange = this.props.specialPromotion.getIn([
        "$eventInfo",
        "recommendRange",
    ]);
    const recommendRule = this.props.specialPromotion.getIn([
        "$eventInfo",
        "recommendRule",
    ]);

    console.log('recommendRange',recommendRange)
    console.log('recommendRule',recommendRule)

    // if (recommendRule != 1) {
    //     data = data.filter((item) => item.recommendType == 0);
    // }
    // if (recommendRule == 1 && recommendRange == 0) {
    //     data = data.filter(
    //         (item) => item.recommendType == 0 || item.recommendType == 1
    //     );
    // }

    // const validatedRuleData = data.map((ruleInfo, index) => {
    //     const giftValidDaysOrEffect =
    //         ruleInfo.effectType != "2"
    //             ? "giftValidDays"
    //             : "giftEffectiveTime";
    //     // check gift count
    //     return Object.assign(ruleInfo, {
    //         giftCount: this.checkgiftCount(
    //             ruleInfo.giftCount,
    //             index,
    //             data
    //         ),
    //         giftInfo: this.checkGiftInfo(
    //             ruleInfo.giftInfo,
    //             index,
    //             data
    //         ),
    //         giftOdds: this.checkGiftOdds(ruleInfo.giftOdds),
    //         needCount: this.checkNeedCount(ruleInfo.needCount, index),
    //         [giftValidDaysOrEffect]:
    //             ruleInfo.effectType != "2"
    //                 ? this.checkGiftValidDays(
    //                       ruleInfo.giftValidDays,
    //                       index
    //                   )
    //                 : this.checkGiftValidDays(
    //                       ruleInfo.giftEffectiveTime,
    //                       index
    //                   ),
    //     });

    // });


    // const validateFlag = validatedRuleData.reduce((p, ruleInfo) => {
    //     const _validStatusOfCurrentIndex = Object.keys(ruleInfo).reduce(
    //         (flag, key) => {
    //             if (
    //                 ruleInfo[key] instanceof Object &&
    //                 ruleInfo[key].hasOwnProperty("validateStatus")
    //             ) {
    //                 const _valid =
    //                     ruleInfo[key].validateStatus === "success";
    //                 return flag && _valid;
    //             }
    //             return flag;
    //         },
    //         true
    //     );
    //     return p && _validStatusOfCurrentIndex;
    // }, true);
    // 把中奖率累加,判断总和是否满足小于等于100
    // const validOdds = data.reduce((res, cur) => {
    //     return res + parseFloat(cur.giftOdds.value);
    // }, 0);
    // data = validatedRuleData;
    this.setState({ data });




    // console.log('validateFlag',validateFlag)
    if (true) {
        // if (validOdds > 100) {
        //     message.warning(
        //         `${this.props.intl.formatMessage(STRING_SPE.dojwosi415179)}`
        //     );
        //     return false;
        // }
        let giftInfo = this.getGiftInfo(data);
        // 整理推荐人，间接推荐人和被推荐人的优惠券数据
        const beRecommendCou = []
        const recommendCou = []

        // 被推荐人
        giftInfo.forEach(v => {
            const recommendType = v.recommendType
            if(recommendType.includes && recommendType.includes('999')) {
                v.presentType = 1
                delete  v.recommendType
                beRecommendCou.push(v)
            } else {
                const typeArr = recommendType.split('#')
                v.recommendRule = typeArr[1]
                v.presentType = 1
                delete  v.recommendType
                recommendCou.push(v)
            }
        })


        console.log('beRecommendCou',beRecommendCou,recommendCou)
        console.log('giftInfo--',giftInfo,shareInfo)

        const {
            shareTitle,
            shareSubtitle,
            restaurantShareImagePath,
            shareImagePath,
        } = this.state;
        const shareInfo = {
            shareTitle,
            shareSubtitle,
            restaurantShareImagePath,
            shareImagePath,
        };

        this.props.setSpecialBasicInfo(shareInfo);
        this.props.setSpecialBasicInfo(
            {
                giftGetRule,
                saveMoneySetIds,
                shareImagePath,
                shareTitle,
                cleanCount,
            }
        );

        this.props.setSpecialGiftInfo([
            ...beRecommendCou
        ]);


          /** 整理直接推荐人和间接推荐人数据 */
        //   let { eventRecommendSettings } = this.state;
        //   const recommendRange = this.props.specialPromotion.getIn([
        //       "$eventInfo",
        //       "recommendRange",
        //   ]);
        //   const recommendRule = this.props.specialPromotion.getIn([
        //       "$eventInfo",
        //       "recommendRule",
        //   ]);
        //   if (recommendRule == 1) {
        //       eventRecommendSettings = [];
        //   }
        //   if (recommendRule == 2) {
        //       eventRecommendSettings = eventRecommendSettings.map(
        //           (setting) => ({
        //               ...setting,
        //               rechargeRate: setting.rechargeRate / 100,
        //               pointRate: setting.pointRate / 100,
        //               consumeRate: 0,
        //               rewardRange: 0,
        //           })
        //       );
        //   }
        //   if (recommendRule == 3) {
        //       eventRecommendSettings = eventRecommendSettings.map(
        //           (setting) => ({
        //               ...setting,
        //               pointRate: setting.pointRate / 100,
        //               consumeRate: setting.consumeRate / 100,
        //               rechargeRate: 0,
        //           })
        //       );
        //   }
        //   if (recommendRange == 0) {
        //       eventRecommendSettings = eventRecommendSettings.filter(
        //           (setting) => setting.recommendType == 1
        //       );
        //   }
        //   console.log('eventRecommendSettings',eventRecommendSettings)
          this.props.setSpecialRecommendSettings([
             {
                rule: 1,
                gifts: recommendCou,
                eventRecommendSettings: []
             }
          ]);
          /** 整理直接推荐人和间接推荐人数据 */
        return true;
    }
    return false;
}


export {
    checkChoose,
    queryRedPackets,
    handleCashChange,
    handleSubmitRecommendGifts,
    renderCashFn,
    renderRecommendGiftsFn,
    renderGivePointFn,
}

export default {
    checkChoose,
    queryRedPackets,
    handleCashChange,
    handleSubmitRecommendGifts,
    renderCashFn,
    renderRecommendGiftsFn,
    renderGivePointFn
}
