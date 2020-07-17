/**
 * 将推荐有礼的部分方法放在这里，原文件太大了，难以维护，
 * 后面有新增的逻辑，建议单独抽离出来，不要再往里面填了，
 */
import React, { Component } from "react";
import {
    Row,
    Col,
    Form,
    message,
    Icon,
    Select,
    Tooltip,
} from "antd";
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import styles from "../../SaleCenterNEW/ActivityPage.less";
import { axiosData } from '../../../helpers/util';
import AddGifts from "../common/AddGifts";
import _ from 'lodash'
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

    const pointLimitValue = this._getVal({ruleType,roleType,key: 'pointLimitValue'})

    // console.log('----000',checkBoxStatus[`ruleType${ruleType}`][`giveIntegral${roleType}`])
    return (
        <FormItem
            wrapperCol={{ span: 24 }}
            className={styles.FormItemSecondStyle}
            style={{ width: "230px", marginLeft: "16px" }}
        >
            {getFieldDecorator(`pointLimitValue#${roleType}#presentType#2#recommendRule#${ruleType}`,
            {
                onChange:  this.handleRecommendSettingsChange(roleType, 'pointLimitValue',ruleType)
                ,
                initialValue: {
                    number:  pointLimitValue,
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
    const redPackageLimitValue = this._getVal({ruleType,roleType,key: 'redPackageLimitValue'})

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
                {getFieldDecorator(`redPackageLimitValue#${roleType}#presentType#3#recommendRule#${ruleType}`,
                    {
                        initialValue: {
                            number: redPackageLimitValue,
                        },
                        onChange: this.handleRecommendSettingsChange(
                            roleType,
                            "redPackageLimitValue",
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
                                    } else if (v.number > 1000) {
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
            <Col span={17} offset={1}>
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
        if(v.includes('pointLimitValue')) {
            const valArr = v.split('#')
            if(valArr[1] == '0') {
                beRecommendList.push({
                    presentType: Number(valArr[3]),
                    presentValue: basicValues[v].number,
                    eventType: 2,
                    recommendType: 0
                })
            }

        }
    })

    return {
        beRecommendList // 被推荐人的积分
    }
}

const clearCheckBoxData = function(key,ruleType,roleType) {
    const {data} = this.state
  let keyWord = ''
  if(key === 'giveIntegral' && ruleType == 1 && roleType == 1) {
    keyWord = 'pointLimitValue'
  } else if(key === 'giveCoupon' && ruleType == 1 && roleType == 1) {
      // 清除优惠券的数据
     const cancelData =  data.filter(v => v.recommendType !== `${roleType}#${ruleType}`)
    if(!cancelData.find(v => v.recommendType === `${roleType}#${ruleType}`)) {
        cancelData.push(this.getDefaultGiftData(`${roleType}#${ruleType}`, "recommendType"))
    }
    this.setState({
        data: cancelData
    })
    return
  } else if(key === 'giveCash' && ruleType == 1 && roleType == 1) {
    keyWord = 'redPackageLimitValue'

  } else if(key === 'giveIntegral' && (ruleType == 2 || ruleType == 3) && (roleType == 1 || roleType == 2)) {
    this.handleRecommendSettingsChange(roleType,'pointRate',ruleType)(undefined)
    this.handleRecommendSettingsChange(roleType,'pointLimitValue',ruleType)(undefined)
    return
  } else if(key === 'giveCard' && (ruleType == 2 || ruleType == 3) && (roleType == 1 || roleType == 2)) {

    this.handleRecommendSettingsChange(roleType, ruleType == 2 ? 'rechargeRate' : 'consumeRate',ruleType)(undefined)
    this.handleRecommendSettingsChange(roleType,'moneyLimitValue',ruleType)(undefined)
    return
  } else if(key === 'giveCash' && (ruleType == 2 || ruleType == 3) && (roleType == 1 || roleType == 2)) {
    this.handleRecommendSettingsChange(roleType,'redPackageRate',ruleType)(undefined)
    this.handleRecommendSettingsChange(roleType,'redPackageLimitValue',ruleType)(undefined)

    return
  }

  this.handleRecommendSettingsChange(roleType, keyWord,ruleType)(undefined)

}

/**
 * 显示初始化的checkbox
 *
 */
const initShowCheckBox = function() {

    let  checkBoxStatusData = {
       ruleType1: {

       },
       ruleType2: {

       },
       ruleType3: {

       },
       ruleType999: {

       }
   }

    let { checkBoxStatus, eventRecommendSettings , data} = this.state

    if(this.props.isNew) {
        checkBoxStatusData = checkBoxStatus
    }

    eventRecommendSettings.forEach(v => {
        Object.keys(checkBoxStatusData).forEach(statusKey => {
            if(statusKey.includes(v.rule)) {
                v.eventRecommendSettings.forEach(data => {
                    if(data.pointLimitValue || data.pointRate) {
                        checkBoxStatusData[statusKey][`giveIntegral${data.recommendType}`] = true
                    }
                    if(data.redPackageRate || data.redPackageLimitValue ) {
                        checkBoxStatusData[statusKey][`giveCash${data.recommendType}`] = true
                    }
                    if(data.rechargeRate || data.consumeRate) {
                        checkBoxStatusData[statusKey][`giveCard${data.recommendType}`] = true
                    }

                })
            }
        })
    })

    const dataList = data.filter(v => {
        return v.giftInfo.giftName
    })
    dataList.forEach(v => {
        const [ recommendType, recommendRule ] = v.recommendType.split('#')
        checkBoxStatusData[`ruleType${recommendRule}`][`giveCoupon${recommendType}`] = true
    })

    this.setState({
        checkBoxStatus: checkBoxStatusData
    })
}
/**
 * 校验优惠券必填
 *
 * @param {*} data
 * @returns
 */
const validatedRuleDataFn = function (data) {

    let recommendRule = this.props.specialPromotion.getIn([
        "$eventInfo",
        "recommendRule",
    ]);
    if(typeof recommendRule === 'number') {
        recommendRule = String(recommendRule).split('')
    } else {
        recommendRule = recommendRule.toJS()
    }
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

        data= data.filter(v => {
            const recommendType = v.recommendType.split('#')[0]
            const currentData = couponStatus.find(val => val.recommendType === recommendType)
            return currentData && currentData.status
        })
    }

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

    }).filter(v => {
        const [roleType,ruleType] = v.recommendType.split('#')
        if(!recommendRule.includes('1') && roleType != '0') {
            return false
        }
        return checkBoxStatus[`ruleType${ruleType}`][`giveCoupon${roleType}`]
    })
}

/**
 * 校验优惠券必填项
 *
 * @param {*} validatedRuleData
 * @returns
 */
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



/**
 * 保存推荐有礼
 *
 * @param {*} isPrev
 * @returns
 */
const handleSubmitRecommendGifts = function (isPrev) {
    if (isPrev) return true;
    let {
        data,
        cleanCount,
        saveMoneySetIds,
        giftGetRule,
        checkBoxStatus,
        cashGiftVal
    } = this.state;
    let recommendRule = this.props.specialPromotion.getIn([
        "$eventInfo",
        "recommendRule",
    ]);
    if(typeof recommendRule === 'number') {
        recommendRule = String(recommendRule).split('')
    } else {
        recommendRule = recommendRule.toJS()
    }
    let flag = true;

    // 积分和红包的list数据
    let presentValueList = {}
    this.props.form.validateFieldsAndScroll(
        { force: true },
        (error, basicValues) => {
            if (error) {
                flag = false;
            }
            // console.log('err',error)
            // 编辑的时候有概率被推荐人会出现积分被校验

            const {ruleType999} = checkBoxStatus
            if(!ruleType999.giveIntegral0 && error && error['pointLimitValue#0#presentType#2#recommendRule#999']) {
                flag = true;
            }

            // 推荐有礼特有校验逻辑：两个输入框至少要有1个
           presentValueList = _getPresentValue.call(this,basicValues)
        //    console.log('basicValues---',presentValueList,basicValues)

        }
    );

    if (!flag) {
        return false;
    }
    /**
     *    saveMoneySetType, // 储值后获得=》储值场景限制 ，这个不用传给后端
     *    saveMoneySetIds为储值套餐，从form中取，放到events
     */



    let validateFlag = true


    console.log('recommendRule',recommendRule)
    // 校验券必填项
    let validatedRuleData = validatedRuleDataFn.call(this,data)

    console.log('validatedRuleData',validatedRuleData)
    validateFlag = validateFlagFn.call(this,validatedRuleData)

    // 把中奖率累加,判断总和是否满足小于等于100
    const validOdds = data.reduce((res, cur) => {
        return res + parseFloat(cur.giftOdds.value);
    }, 0);


    // console.log('validateFlag',validateFlag,checkBoxStatus)
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
        giftInfo = giftInfo.filter(v => v.giftName)
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

        // console.log('beRecommendCou',beRecommendCou)
        // console.log('giftInfo--',giftInfo,shareInfo)

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
          eventRecommendSettings = _.cloneDeep(eventRecommendSettings)


          eventRecommendSettings =  eventRecommendSettings.filter(v => {

            return   recommendRule.includes(String(v.rule))
          }).map(v => {
              v.rule = Number(v.rule)
               if(v.rule == 1) {
                v.gifts =  []
                v.eventRecommendSettings.forEach((presentValue,i) => {
                    const { redPackageLimitValue } = presentValue

                     if(redPackageLimitValue) {
                        presentValue.giftItemID = cashGiftVal
                    } else {
                        delete presentValue.giftItemID
                    }
                })
                const rule1Gifts = giftInfo.filter(v => v.recommendType).map(v => {
                    const [recommendType,recommendRule] = v.recommendType.split('#')
                    v.recommendType = recommendType
                    v.recommendRule = recommendRule
                    return v
                })


                v.gifts = v.gifts.concat(rule1Gifts)
                // v.eventRecommendSettings = eventRecommendSettings1Data
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

        //   console.log('eventRecommendSettings',eventRecommendSettings)

        //  return
          this.props.setSpecialRecommendSettings(eventRecommendSettings);
          /** 整理直接推荐人和间接推荐人数据 */
        return true;
    } else {
        message.warn('你有未填项，请填写')
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
    validateFlagFn,
    initShowCheckBox,
    clearCheckBoxData
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
    validateFlagFn,
    initShowCheckBox,
    clearCheckBoxData
}
