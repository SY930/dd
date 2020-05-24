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

    const presentValuePoint = this._getVal({ruleType,roleType,key: 'presentValuePoint'})
    return (
        <FormItem
            wrapperCol={{ span: 24 }}
            className={styles.FormItemSecondStyle}
            style={{ width: "230px", marginLeft: "16px" }}
        >
            {getFieldDecorator(`presentValuePoint#${roleType}#presentType#2#recommendRule#${ruleType}`,
            {
                onChange:  this.handleRecommendSettingsChange(roleType, 'presentValuePoint',ruleType)
                ,
                initialValue: {
                    number:  presentValuePoint,
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
    const presentValueCash = this._getVal({ruleType,roleType,key: 'presentValueCash'})

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
                            number: presentValueCash,
                        },
                        onChange: this.handleRecommendSettingsChange(
                            roleType,
                            "presentValueCash",
                            ruleType
                        ),
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
            this.getDefaultGiftData(recommendType, "recommendType"),
        ];
    }
    // console.log('filteredGifts',filteredGifts)
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

    const beRecommendList = []
    Object.keys(basicValues).forEach(v => {
        if(v.includes('presentValue')) {
            const valArr = v.split('#')
            if(valArr[1] === '0') {
                beRecommendList.push({
                    presentType: Number(valArr[3]),
                    presentValue: basicValues[v].number,
                    eventType: 2
                })
            }

        }
    })

    return {
        beRecommendList // 被推荐人的积分
    }
}

const validatedRuleDataFn = function (data) {
    const {checkBoxStatus} = this.state
    if(checkBoxStatus) {
       const couponStatus = []
        Object.values(checkBoxStatus).forEach(v => {
            Object.keys(v).forEach(val => {
                if(val.includes('giveCoupon')) {
                    couponStatus.push({
                        recommendType: val.split('giveCoupon')[1],
                        status: v[val]
                    })
                }
            })
        })
        console.log('couponStatus',couponStatus)
        data= data.filter(v => {
            const recommendType = v.recommendType.split('#')[0]
            const currentData = couponStatus.find(val => val.recommendType === recommendType)
            return currentData && currentData.status
        })
    }
    console.log('data---',data)
    return data.map((ruleInfo, index) => {
        const giftValidDaysOrEffect =
            ruleInfo.effectType != "2"
                ? "giftValidDays"
                : "giftEffectiveTime";
        // check gift count
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
            giftOdds: this.checkGiftOdds(ruleInfo.giftOdds),
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
}

const validateFlagFn = function (validatedRuleData) {
   return validatedRuleData.reduce((p, ruleInfo) => {
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
}

const initRecommendGift = function () {
    // initState函数初始化了券的数据，过滤出其他数据recommendOtherGifts

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
    let presentValueList = {}
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
        cleanCount,
        saveMoneySetIds,
        giftGetRule,
        checkBoxStatus,
        cashGiftVal
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

    const validatedRuleData = validatedRuleDataFn.call(this,data)

    const validateFlag = validateFlagFn.call(this,validatedRuleData)


    // 把中奖率累加,判断总和是否满足小于等于100
    const validOdds = data.reduce((res, cur) => {
        return res + parseFloat(cur.giftOdds.value);
    }, 0);
    data = validatedRuleData;
    // this.setState({ data });

    console.log('validateFlag',validateFlag,checkBoxStatus)
     // 判断是否选中了红包模版
    if(checkBoxStatus) {
        let isReturn = false
        Object.values(checkBoxStatus).forEach(v => {
            Object.keys(v).forEach(val => {
                if(val.includes('giveCash')) {
                    if(v[val] && !cashGiftVal) {
                        isReturn = true
                    }
                }
            })
        })
        if(isReturn) {
            message.warn('请选择一个已创建的红包礼品')
            return false
        }
     }
    if (validateFlag) {
        if (validOdds > 100) {
            message.warning(
                `${this.props.intl.formatMessage(STRING_SPE.dojwosi415179)}`
            );
            return false;
        }
        let giftInfo = this.getGiftInfo(data);
        // 整理被推荐人
        let beRecommendCou = []


        // 被推荐人的优惠券数据
        giftInfo.forEach(v => {
            const recommendType = v.recommendType
            if(recommendType.includes && recommendType.includes('999')) {
                v.presentType = 1
                delete v.recommendType
                beRecommendCou.push(v)
            }
        })

        // 被推荐人积分数据
        if(Array.isArray(presentValueList.beRecommendList)) {
            beRecommendCou = [...beRecommendCou,...presentValueList.beRecommendList]
        }

        console.log('beRecommendCou',beRecommendCou)
        console.log('giftInfo--',giftInfo,shareInfo)

        const {
            shareTitle,
            shareSubtitle,
            restaurantShareImagePath,
            shareImagePath,
            cashGiftVal,
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
        // 保存被推荐人gifts
        this.props.setSpecialGiftInfo([
            ...beRecommendCou
        ]);


          /** 整理直接推荐人和间接推荐人数据 */
          let { eventRecommendSettings } = this.state;

          const recommendRange = this.props.specialPromotion.getIn([
              "$eventInfo",
              "recommendRange",
          ]);
          const recommendRule = this.props.specialPromotion.getIn([
              "$eventInfo",
              "recommendRule",
          ]);
          eventRecommendSettings =  eventRecommendSettings.filter(v => {

            return v.rule !== '999'
          }).map(v => {
              v.rule = Number(v.rule)
               if(v.rule == 1) {
                v.gifts =  []
                v.eventRecommendSettings.forEach((presentValue,i) => {
                     Object.keys(presentValue).forEach(presentValueKey => {
                         if(presentValueKey.includes('presentValue')) {
                              const  [str,type] = presentValueKey.split('presentValue')
                              if(type === 'Cash') {
                                v.gifts.push({
                                    recommendRule: 1,
                                    presentType: 3,
                                    presentValue: presentValue[presentValueKey],
                                    giftItemID:  cashGiftVal  ,
                                    recommendType:  i
                                })
                              } else if(type === 'Point') {
                                v.gifts.push({
                                    recommendRule: 1,
                                    presentType: 2,
                                    presentValue: presentValue[presentValueKey],
                                    recommendType:  i
                                })
                              }
                         }
                     })
                })
                const rule1Gifts = giftInfo.filter(v => v.recommendType).map(v => {
                    const [recommendType,recommendRule] = v.recommendType.split('#')
                    v.recommendType = recommendType
                    v.recommendRule = recommendRule
                    return v
                })

                 console.log('rule1Gifts',rule1Gifts)
                v.gifts = v.gifts.concat(rule1Gifts).filter(v => v.presentValue || v.giftName)
                // v.eventRecommendSettings = []
               } else  {
                v.eventRecommendSettings.forEach(val => {

                    if(val.redPackageLimitValue) {
                        val.giftItemID = cashGiftVal
                    }
                    if(val.pointRate) {
                        val.pointRate = val.pointRate / 100
                    }
                    if(val.rechargeRate) {
                        val.rechargeRate = val.rechargeRate / 100
                    }
                    if(val.consumeRate) {
                        val.consumeRate = val.consumeRate / 100
                    }
                    if(val.redPackageRate) {
                        val.redPackageRate = val.redPackageRate / 100
                    }
                    val.recommendRule = v.rule
                })
               }
              return v
          })

          console.log('eventRecommendSettings',eventRecommendSettings)
         return
          this.props.setSpecialRecommendSettings(eventRecommendSettings);
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
    validatedRuleDataFn,
    validateFlagFn
}

export default {
    checkChoose,
    queryRedPackets,
    handleCashChange,
    handleSubmitRecommendGifts,
    renderCashFn,
    renderRecommendGiftsFn,
    renderGivePointFn,
    validatedRuleDataFn,
    validateFlagFn
}
