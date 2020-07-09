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
import styles from "../../SaleCenterNEW/ActivityPage.less";
import selfStyle from "./addGifts.less";
import {
    saleCenterSetSpecialBasicInfoAC,
    saleCenterSetSpecialGiftInfoAC,
    saleCenterSetSpecialRecommendSettingsInfoAC,
} from "../../../redux/actions/saleCenterNEW/specialPromotion.action";
import { fetchGiftListInfoAC } from "../../../redux/actions/saleCenterNEW/promotionDetailInfo.action";
import CloseableTip from "../../../components/common/CloseableTip/index";
import {
    fetchSpecialCardLevel,
    queryAllSaveMoneySet,
} from "../../../redux/actions/saleCenterNEW/mySpecialActivities.action";
import AddGifts from "../common/AddGifts";
import ENV from "../../../helpers/env";
import styles1 from "../../GiftNew/GiftAdd/GiftAdd.less";
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import { doRedirect } from "../../../../src/helpers/util";
import { COMMON_LABEL } from "i18n/common";
import { injectIntl } from "i18n/common/injectDecorator";
import { STRING_SPE, COMMON_SPE } from "i18n/common/special";
import { SALE_LABEL, SALE_STRING } from "i18n/common/salecenter";
import { axiosData } from "../../../helpers/util";
import PhotoFrame from "./PhotoFrame";
import { activeRulesList } from "../recommendGifts/constant";
import recommentGiftStyle from "../recommendGifts/recommentGift.less";
// import  Three  from '../recommendGifts/stepThree'
import {
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
} from './SpecialPromotionDetailInfoHelp'
import TicketBag from '../../BasicModules/TicketBag';
import { axios } from '@hualala/platform-base';
import { getStore } from '@hualala/platform-base/lib';
import { renderThree,addPointData,initPerfectCheckBox } from '../perfectReturnGift/StepThreeHelp'
import { renderUpGradeThree,upGradeAddPointData,upGradeInitPerfectCheckBox } from '../upGradeReturnGift/StepThreeHelp'
const moment = require("moment");
const FormItem = Form.Item;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { TabPane } = Tabs;

const getDefaultRecommendSetting = (recommendType = 1) => ({
    recommendType,
    rechargeRate: undefined,
    consumeRate: undefined,
    pointRate: undefined,
    rewardRange: 0,
    presentValue: undefined,
    redPackageLimitValue: undefined,
    redPackageRate: undefined
});

const roundToDecimal = (number, bit = 2) => +number.toFixed(bit);

let uuid = 0;
const getIntervalID = () => {
    uuid += 1;
    return uuid;
};

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

const MULTIPLE_LEVEL_GIFTS_CONFIG = [
    {
        type: "63",
        propertyName: "lastConsumeIntervalDays",
        levelLabel: COMMON_SPE.d1e0750k82809,
        levelAffix: COMMON_SPE.k6hk1aa1,
    },
    {
        type: "75",
        propertyName: "needCount",
        levelLabel: COMMON_SPE.k6hk1aid,
        levelAffix: COMMON_SPE.k6hk1aqp,
    },
];
const limitType = ".jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF";
@injectIntl
class SpecialDetailInfo extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.gradeChange = this.gradeChange.bind(this);
        this.getDefaultGiftData = getDefaultGiftData.bind(this)
        const {
            data,
            wakeupSendGiftsDataArray, // 唤醒送礼专用
            pointObj,
        } = this.initState();
        const eventRecommendSettings = this.initEventRecommendSettings();
        const selectedMpId = props.specialPromotion.getIn([
            "$eventInfo",
            "mpIDList",
            "0",
        ]);
        const giftGetRule = props.specialPromotion.getIn(
            ["$eventInfo", "giftGetRule"],
            props.type == "75" ? 2 : 0
        );
        const discountRatio = props.specialPromotion.getIn([
            "$eventInfo",
            "discountRate",
        ]);
        const discountMinRatio = props.specialPromotion.getIn([
            "$eventInfo",
            "discountMinRate",
        ]);
        const discountMaxRatio = props.specialPromotion.getIn([
            "$eventInfo",
            "discountMaxRate",
        ]);
        const discountMaxLimitRatio = props.specialPromotion.getIn([
            "$eventInfo",
            "discountMaxLimitRate",
        ]);
        const defaultCardType = props.specialPromotion.getIn([
            "$eventInfo",
            "defaultCardType",
        ]);
        const $saveMoneySetIds = props.specialPromotion.getIn([
            "$eventInfo",
            "saveMoneySetIds",
        ]);
        const saveMoneySetIds =
            Immutable.List.isList($saveMoneySetIds) && $saveMoneySetIds.size > 0
                ? $saveMoneySetIds.toJS()
                : [];
        const { givePoints, presentValue, giveCoupon } = pointObj;
        this.state = {
            data,
            wakeupSendGiftsDataArray,
            eventRecommendSettings,
            cleanCount: props.specialPromotion.getIn(
                ["$eventInfo", "cleanCount"],
                1
            ),
            /** 膨胀大礼包相关 */
            giftGetRule,
            /** 膨胀大礼包相关结束 */
            /** 小程序分享相关 */
            shareImagePath: props.specialPromotion.getIn([
                "$eventInfo",
                "shareImagePath",
            ]),
            shareTitle: props.specialPromotion.getIn([
                "$eventInfo",
                "shareTitle",
            ]),
            shareSubtitle: props.specialPromotion.getIn([
                "$eventInfo",
                "shareSubtitle",
            ]),
            restaurantShareImagePath: props.specialPromotion.getIn([
                "$eventInfo",
                "restaurantShareImagePath",
            ]),
            /** 小程序分享相关结束 */
            /** 桌边砍相关 */
            moneyLimitType:
                props.specialPromotion.getIn([
                    "$eventInfo",
                    "moneyLimitType",
                ]) || 0,
            moneyLimitValue: props.specialPromotion.getIn([
                "$eventInfo",
                "moneyLimitValue",
            ]),
            eventValidTime:
                props.specialPromotion.getIn([
                    "$eventInfo",
                    "eventValidTime",
                ]) || 10,
            discountType:
                props.specialPromotion.getIn(["$eventInfo", "discountType"]) ||
                0,
            discountWay:
                props.specialPromotion.getIn(["$eventInfo", "discountWay"]) ||
                0,
            discountAmount: props.specialPromotion.getIn([
                "$eventInfo",
                "discountAmount",
            ]),
            discountMinAmount: props.specialPromotion.getIn([
                "$eventInfo",
                "discountMinAmount",
            ]),
            discountMaxAmount: props.specialPromotion.getIn([
                "$eventInfo",
                "discountMaxAmount",
            ]),
            discountRate: discountRatio
                ? roundToDecimal(discountRatio * 100)
                : discountRatio,
            discountMinRate: discountMinRatio
                ? roundToDecimal(discountMinRatio * 100)
                : discountMinRatio,
            discountMaxRate: discountMaxRatio
                ? roundToDecimal(discountMaxRatio * 100)
                : discountMaxRatio,
            discountMaxLimitRate: discountMaxLimitRatio
                ? roundToDecimal(discountMaxLimitRatio * 100)
                : discountMaxLimitRatio,
            inviteType: 1, // 需求变更，固定为1
            defaultCardType: defaultCardType > 0 ? defaultCardType : undefined,
            mpIDList: selectedMpId ? [selectedMpId] : [],
            disabledGifts: props.isNew
                ? false
                : this.props.specialPromotion.get("$giftInfo").size === 0,
            /** 桌边砍相关结束 */
            helpMessageArray: ["", ""],
            saveMoneySetIds,
            saveMoneySetType: saveMoneySetIds.length > 0 ? "1" : "0", // 前端内部状态，saveMoneySetIds数组为空表示全部套餐
            givePoints,
            presentValue,
            giveCoupon,
            shareTitlePL: "",
            shareSubtitlePL: "",
            sendTypeValue: '0',
            bag: '',
            activeRuleTabValue: "",
            checkBoxStatus: {
                 /**
                  * 推荐奖励的默认展示项
                  * giveCoupon 为赠送优惠券，giveIntegral为赠送积分，giveCard为赠送卡值,giveCash为赠送红包
                  * 以选中的tab值和角色值生成每个奖项的key值
                  * 角色：直接对推荐人为1，间接推荐人为2, 被推荐人为0，与recommendType对应
                  * 被推荐人三种规则都有，视为第四中规则，规则id设置为999
                  */
                ruleType1: {
                    giveCoupon1: true,
                    giveCoupon2: false,
                },
                ruleType2: {
                    giveIntegral1: true,
                    giveIntegral2: true,
                },
                ruleType3: {
                    giveIntegral1: true,
                    giveIntegral2: true,
                },
                ruleType999: {
                    giveCoupon0: true,
                }
            },
            redPackets: [] , // 现金红包下拉列表
            perfectReturnGiftCheckBoxStatus: {
                perfectReturnGiftPoint: false,
                perfectReturnGiftCoupon: true
            }, // 完善资料送礼checkbox状态
            upGradeReturnGiftCheckBoxStatus: {
                upGradeReturnGiftPoint: false,
                upGradeReturnGiftCoupon: true,
            },
            cardTypeArr: [], // 充值到会员卡列表
        };
    }
    componentDidMount() {
        const { type, isLast = true, user } = this.props;
        this.props.getSubmitFn({
            finish: isLast ? this.handleSubmit : undefined,
            next: !isLast ? this.handleSubmit : undefined,
        });
        this.props.fetchGiftListInfo();
        if (type == 67) {
            const opts = {
                _groupID: user.accountInfo.groupID,
                _role: user.accountInfo.roleType,
                _loginName: user.accountInfo.loginName,
                _groupLoginName: user.accountInfo.groupLoginName,
            };
            this.props.fetchSpecialCardLevel({
                data: opts,
            });
        }
        if (type == 68) {
            this.props.queryAllSaveMoneySet();
        }
        if (type == 21) {
            const shareTitle = "送您一份心意，共享美食优惠！";
            const shareTitlePL = shareTitle;
            const shareSubtitlePL = "选填，请输入副标题";
            if (this.props.isNew) {
                this.setState({ shareTitle });
            }
            this.setState({ shareTitlePL, shareSubtitlePL });
        }
        if (type == 68) {
            const shareTitle = "推荐拿好礼，优惠吃大餐，快来看看吧~ ";
            const shareSubtitle = "嘿！这家店有券拿诶，推荐给你，快点来领~";
            const shareTitlePL = shareTitle;
            const shareSubtitlePL = shareSubtitle;
            if (this.props.isNew) {
                this.setState({ shareTitle, shareSubtitle });
            }
            this.setState({ shareTitlePL, shareSubtitlePL });
            // 获取红包列表
            queryRedPackets.call(this)
            // 初始化选中的红包模版
            const {eventRecommendSettings} = this.state
            eventRecommendSettings.forEach(v => {
                v.eventRecommendSettings.forEach(item => {
                    if(item.giftItemID && item.giftItemID != '0' && !this.state.cashGiftVal) {
                        this.setState({
                            cashGiftVal: item.giftItemID
                        })
                    }
                })
            })
            setTimeout(() => {
                // 初始化显示的选项,循环较多，延时执行
                initShowCheckBox.call(this)
            },600)

        }
        if (type == 66) {
            const shareTitle = "亲爱的朋友，帮我助力赢大礼。";
            const shareSubtitle = "海吃海喝就靠你啦！";
            const shareTitlePL = shareTitle;
            const shareSubtitlePL = shareSubtitle;
            if (this.props.isNew) {
                this.setState({ shareTitle, shareSubtitle });
            }
            this.setState({ shareTitlePL, shareSubtitlePL });
        }
        if (type == 65) {
            const shareTitle = "呼朋唤友，一起赢壕礼。";
            const shareTitlePL = shareTitle;
            const shareSubtitlePL = "选填，请输入副标题";
            if (this.props.isNew) {
                this.setState({ shareTitle });
            }
            this.setState({ shareTitlePL, shareSubtitlePL });
        }
        if (type == 30) {
            this.getBag();
        }
        if(type == 60) {
            initPerfectCheckBox.call(this)
        }
        if(type == 61) {
            upGradeInitPerfectCheckBox.call(this)
        }
    }
    getMultipleLevelConfig = () => {
        const { type } = this.props;
        return MULTIPLE_LEVEL_GIFTS_CONFIG.find(
            (item) => item.type === `${type}`
        );
    };

    componentDidUpdate(prevProps) {
        let recommendRule = this.props.specialPromotion.getIn([
            "$eventInfo",
            "recommendRule",
        ])
        if (
            prevProps.specialPromotion.getIn([
                "$eventInfo",
                "recommendRule",
            ]) !==
            recommendRule
        ) {

            if(recommendRule) {
                if(typeof recommendRule === 'number') {
                    recommendRule =  String(recommendRule).split('')
                } else {
                    recommendRule = recommendRule.toJS()
                }
                const recommendRange = this.props.specialPromotion.getIn([
                    "$eventInfo",
                    "recommendRange",
                ]);
                const {checkBoxStatus} = this.state

                if(recommendRange > 0) {
                    checkBoxStatus.ruleType1.giveCoupon2 = true
                } else {
                    checkBoxStatus.ruleType1.giveCoupon2 = false
                }
                this.setState({
                    helpMessageArray: ["", ""],
                    // eventRecommendSettings: initEventRecommendSettings,
                    saveMoneySetIds: [],
                    saveMoneySetType: "0",
                    directActiveRuleTabValue: '',
                    indirectActiveRuleTabValue: '',
                    checkBoxStatus
                });
                this.props.form.resetFields();
            }

        }
        if (
            prevProps.specialPromotion.getIn(["$eventInfo", "needCount"]) !==
            this.props.specialPromotion.getIn(["$eventInfo", "needCount"])
        ) {
            this.setState({
                wakeupSendGiftsDataArray: [
                    {
                        key: getIntervalID(),
                        intervalDays: undefined,
                        gifts: this.initiateDefaultGifts(),
                    },
                ],
            });
            this.props.form.resetFields();
        }
    }

    initiateDefaultGifts = () => {
        const type = `${this.props.type}`;
        switch (type) {
            /** 唤醒送礼活动，天数有档位设置 */
            case "63":
                return [getDefaultGiftData(0, "wakeupIntervalStageIndex")];
            /** 分享裂变有邀请人和被邀请人两种类型的礼品 */
            case "65":
                return [getDefaultGiftData(), getDefaultGiftData(1)];
            /** 膨胀大礼包固定3个礼品，不加减数量 */
            case "66":
                return [
                    getDefaultGiftData(),
                    getDefaultGiftData(),
                    getDefaultGiftData(),
                ];
            /** 推荐有礼活动，是靠recommendType 字段划分礼品类型的 */
            case "68":
                return [];
            default:
                return [getDefaultGiftData()];
        }
    }
    componentWillReceiveProps(np){
        if(!this.props.isNew){
            const b = np.specialPromotion.get('$giftInfo').toJS();
            const { presentType = '', giftID } = b[0] || [{}];
            if(this.props.type == '30' && presentType===4){
                const {couponPackageInfos } = this.state;
                const bag = couponPackageInfos.filter(x=>x.couponPackageID === giftID);
                this.setState({
                    sendTypeValue: '1',
                    bag,
                })
            }
        }
    }
    async getBag(){
        const { user } = this.props;
        const {groupID} = user.accountInfo;
        const data = {groupID, couponPackageType: "2"};
        const [service, type, api, url] = ['HTTP_SERVICE_URL_PROMOTION_NEW', 'post', 'couponPackage/', '/api/v1/universal?'];
        const method = `${api}getCouponPackages.ajax`;
        const params = { service, type, data, method };
        const response = await axios.post(url + method, params);
        const { code, couponPackageInfos = []} = response;
        if (code === '000') {
            this.setState({ couponPackageInfos })
        }
    }
    initState = () => {
        let giftInfo = this.props.specialPromotion.get("$giftInfo").toJS();
        const data = this.initiateDefaultGifts();
        const type = this.props.type
        let pointObj = {
            presentValue: "",
            givePoints: false,
            giveCoupon: false,
        };
        if(type == 68) {
            // 将券和其他礼品分开
            const otherGifts = []
            giftInfo = giftInfo.filter(v => {
                if(v.presentType !== 1) {
                    otherGifts.push(v)
                }
                return v.presentType === 1
            })
            this.recommendOtherGifts = otherGifts

        }
        if(type == 60 || type == 61) {
            giftInfo = giftInfo.filter(v => v.presentType === 1)
        }
        giftInfo.forEach((gift, index) => {
            if (this.props.type == "52" && gift.presentType === 2) {
                pointObj = {
                    ...pointObj,
                    presentValue: gift.presentValue,
                    givePoints: true,
                };
                return;
            }
            if (this.props.type == "52" && gift.presentType === 1) {
                pointObj = { ...pointObj, giveCoupon: true };
            }
            if (data[index] !== undefined) {
                data[index].sendType = gift.sendType || 0;
                data[index].recommendType = gift.recommendType || 0;
            } else {
                const typePropertyName =
                    this.props.type == "68" ? "recommendType" : "sendType";
                const typeValue =
                    this.props.type == "68"
                        ? gift.recommendType
                        : gift.sendType;
                data[index] = getDefaultGiftData(typeValue, typePropertyName);
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
            if(this.props.type == '30' && gift.presentType === 4){
                data[index].giftInfo.giftName = '';
            }
            data[index].needCount.value = gift.needCount || 0;
            data[index].giftInfo.giftItemID = gift.giftID;
            data[index].giftValidDays.value = gift.giftValidUntilDayCount;
            if (
                this.props.type != "20" &&
                this.props.type != "21" &&
                this.props.type != "30" &&
                this.props.type != "70"
            ) {
                data[index].giftCount.value = gift.giftCount;
            } else {
                data[index].giftTotalCount.value = gift.giftTotalCount;
            }
            data[index].giftOdds.value = parseFloat(gift.giftOdds).toFixed(2);
            data[index].lastConsumeIntervalDays = gift.lastConsumeIntervalDays
                ? `${gift.lastConsumeIntervalDays}`
                : undefined;
        });
        if (this.props.type == "68") {
            // 小数组，为了代码方便重复遍历的
            if (data.every((gift) => gift.recommendType != 1)) {
                data.push(getDefaultGiftData('1#1', "recommendType"));
            }
            if (data.every((gift) => gift.recommendType != 2)) {
                data.push(getDefaultGiftData('2#1', "recommendType"));
            }
            if (data.every((gift) => gift.recommendType != 0)) {
                data.push(getDefaultGiftData('0#999', "recommendType"));
            }
            data.forEach(v => {
                if(typeof v.recommendType === 'number') {
                    if(v.recommendType === 0) {
                        v.recommendType = '0#999'
                    } else if(v.recommendType === 1) {
                        v.recommendType =  '1#1'
                    } else if(v.recommendType === 2) {
                        v.recommendType =  '2#1'
                    }
                }
            })
            // console.log('data---',data)
        }
        let wakeupSendGiftsDataArray = [];
        const multiConfig = this.getMultipleLevelConfig();
        if (multiConfig) {
            const intervalDaysArray = data.reduce((acc, curr) => {
                // 不同活动里的needCount 输入框层级不一样，数据类型也不一样
                if (typeof curr[multiConfig.propertyName] === "object") {
                    curr[multiConfig.propertyName] =
                        curr[multiConfig.propertyName].value;
                }
                const propertyValue = curr[multiConfig.propertyName];
                if (propertyValue >= 0) {
                    // undefined >= 0 is false
                    if (acc.indexOf(propertyValue) === -1) {
                        acc.push(propertyValue);
                    }
                }
                return acc;
            }, []);
            if (!intervalDaysArray.length) {
                wakeupSendGiftsDataArray = [
                    {
                        key: getIntervalID(),
                        intervalDays: undefined,
                        gifts: [...data],
                    },
                ];
            } else {
                wakeupSendGiftsDataArray = intervalDaysArray
                    .sort((a, b) => a - b)
                    .map((days) => ({
                        key: getIntervalID(),
                        intervalDays: days,
                        gifts: data.filter(
                            (gift) => gift[multiConfig.propertyName] === days
                        ),
                    }));
            }
        }
        if (this.props.isNew) {
            pointObj = {
                presentValue: "",
                givePoints: false,
                giveCoupon: true,
            };
        }
        return {
            data,
            wakeupSendGiftsDataArray,
            pointObj,
        };
    };

    initEventRecommendSettings = () => {
        let eventRecommendSettings = this.props.specialPromotion
            .get("$eventRuleInfos")
            .toJS();
        let recommendRule = this.props.specialPromotion.getIn([
            "$eventInfo",
            "recommendRule",
        ]);
        // 后端是按比率存的（0.11），前端是按百分比显示（11%）的
       eventRecommendSettings.forEach((setting) => {
            if(Array.isArray(setting.eventRecommendSettings)) {
                setting.eventRecommendSettings.forEach((v,i,arr) => {

                    arr[i] = {
                        ...v,
                        pointRate: v.pointRate
                            ? roundToDecimal(v.pointRate * 100)
                            : undefined,
                        consumeRate: v.consumeRate
                            ? roundToDecimal(v.consumeRate * 100)
                            : undefined,
                        rechargeRate: v.rechargeRate
                            ? roundToDecimal(v.rechargeRate * 100)
                            : undefined,
                        redPackageRate: v.redPackageRate
                        ? roundToDecimal(v.redPackageRate * 100)
                        : undefined,
                        pointLimitValue: v.pointLimitValue || undefined, // 0 表示不限制
                        moneyLimitValue: v.moneyLimitValue || undefined, // 0 表示不限制,
                    }
                })
            } else {
                setting.eventRecommendSettings = []
            }


        });

        const initEventRecommendSettings = eventRecommendSettings

        activeRulesList.forEach(v => {
            if(!initEventRecommendSettings.find(val => val.rule == v.value)) {
                initEventRecommendSettings.push(
                    {
                        rule: v.value ,
                        gifts: [],
                        eventRecommendSettings: [getDefaultRecommendSetting(0),getDefaultRecommendSetting(1), getDefaultRecommendSetting(2) ]
                    }
                )
            }

        })

        initEventRecommendSettings.push(
            {
                rule: '999',
                gifts: [],
                eventRecommendSettings: [getDefaultRecommendSetting(0),getDefaultRecommendSetting(1), getDefaultRecommendSetting(2) ]
            }
        )


        if(Array.isArray(this.recommendOtherGifts)) {
            // 回显被推荐人积分数据
            this.recommendOtherGifts.forEach(v => {
                if(v.presentType === 2) {
                    v.presentValuePoint = v.presentValue
                } else if(v.presentType === 3) {
                    v.presentValueCash = v.presentValue
                }

                if(v.recommendRule === 0) {
                    initEventRecommendSettings[3].eventRecommendSettings[0] = v
                }


            })
        }

        // 回显直接推荐人和间接推荐人数据
        initEventRecommendSettings.forEach(v => {
            if(v.rule == 1) {
                const data =  [
                    {},{},{}
                ]

                v.eventRecommendSettings.forEach(setting => {
                    const { pointLimitValue, redPackageLimitValue,giftItemID } = setting

                    if(setting.recommendType == 1) {
                        data[1] = {
                            pointLimitValue: data[1].pointLimitValue ? data[1].pointLimitValue : pointLimitValue,
                            redPackageLimitValue: data[1].redPackageLimitValue ? data[1].redPackageLimitValue : redPackageLimitValue,
                            recommendType: 1,
                            recommendRule: 1,
                            giftItemID
                        }
                    }
                    if(setting.recommendType == 2) {
                        data[2] = {
                            pointLimitValue: data[2].pointLimitValue ? data[2].pointLimitValue : pointLimitValue,
                            redPackageLimitValue: data[2].redPackageLimitValue ? data[2].redPackageLimitValue : redPackageLimitValue,
                            recommendType: 2,
                            recommendRule: 1,
                            giftItemID
                        }
                    }
                })
                v.eventRecommendSettings = data
            }
            if(v.rule == '999') {
                // 被推荐人积分回显
                const beRecommend = v.eventRecommendSettings[0]
                if(beRecommend) {
                    v.eventRecommendSettings[0].pointLimitValue = v.eventRecommendSettings[0].presentValue
                }
            }

        })
        // console.log('initEventRecommendSettings',initEventRecommendSettings)


        return initEventRecommendSettings

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
        // 只有膨胀大礼包校验此字段
        if (
            this.props.type != "66" ||
            index === 0 ||
            (_value > 0 && _value < 1000)
        ) {
            return needCount;
        }
        return {
            msg: `${this.props.intl.formatMessage(STRING_SPE.dojv8nhwv2416)}`,
            validateStatus: "error",
            value: "",
        };
    };
    handlePrev = () => {
        return this.handleSubmit(true);
    };

    handleSubmit =   (isPrev) => {
        const {type} = this.props
        if(type === '68') {
        return    handleSubmitRecommendGifts.call(this,isPrev)
        } else {
          return  this.handleSubmitOld(isPrev)
        }
    }

    handleSubmitOld = (isPrev) => {
        if (isPrev) return true;
        let flag = true;
        const priceReg = /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/;
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
            discountMinRate,
            discountMaxRate,
            discountRate,
            discountMaxLimitRate,
            disabledGifts,
            saveMoneySetIds,
            giftGetRule,
            perfectReturnGiftCheckBoxStatus,
            upGradeReturnGiftCheckBoxStatus,
            ...instantDiscountState,
        } = this.state;
        const { type } = this.props;

        // 桌边砍可以不启用礼品 直接短路返回
        if (flag && type == 67 && disabledGifts) {
            this.props.setSpecialBasicInfo({
                shareImagePath,
                shareTitle,
                discountMinRate: discountMinRate
                    ? discountMinRate / 100
                    : discountMinRate,
                discountMaxRate: discountMaxRate
                    ? discountMaxRate / 100
                    : discountMaxRate,
                discountRate: discountRate ? discountRate / 100 : discountRate,
                discountMaxLimitRate: discountMaxLimitRate
                    ? discountMaxLimitRate / 100
                    : discountMaxLimitRate,
                ...instantDiscountState,
            });
            this.props.setSpecialGiftInfo([]);
            return true;
        }
        if (type === "52") {
            const { presentValue, givePoints, giveCoupon } = this.state;
            if (!givePoints && !giveCoupon) {
                message.warning("赠送积分和优惠券必选一项");
                return;
            }
            if (givePoints) {
                if (!priceReg.test(presentValue)) {
                    message.warning("请输入1~1000000数字，支持两位小数");
                    return;
                }
            }
            if (givePoints && !giveCoupon) {
                if (!priceReg.test(presentValue)) {
                    message.warning("请输入1~1000000数字，支持两位小数");
                    return;
                }
                const giftName = presentValue + "积分";
                const params = {
                    presentValue,
                    presentType: 2,
                    giftName,
                    giftCount: 1,
                };
                this.props.setSpecialGiftInfo([params]);
                return true;
            }
        }
        const { sendTypeValue } = this.state;
        if(type === '30' && sendTypeValue === '1') {
            const { bag } = this.state;
            if(bag[0]){
                const { couponPackageID } = bag[0];
                const params = {sortIndex: 1, giftID: couponPackageID, presentType: 4, giftOdds: "3"};
                this.props.setSpecialGiftInfo([params]);
                return true;
            }
            message.error('请选择一项券包');
        }

        if (this.getMultipleLevelConfig()) {
            data = this.state.wakeupSendGiftsDataArray.reduce((acc, curr) => {
                curr.gifts.forEach((gift) => {
                    gift[this.getMultipleLevelConfig().propertyName] =
                        curr.intervalDays || 0;
                });
                acc.push(...curr.gifts);
                return acc;
            }, []);
        }
        const validatedRuleData = data.map((ruleInfo, index) => {
            const giftValidDaysOrEffect =
                ruleInfo.effectType != "2"
                    ? "giftValidDays"
                    : "giftEffectiveTime";
            if (
                this.props.type != "20" &&
                this.props.type != "21" &&
                this.props.type != "30" &&
                this.props.type != "70"
            ) {
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
            }
            // check total count
            return Object.assign(ruleInfo, {
                giftTotalCount: this.checkgiftTotalCount(
                    ruleInfo.giftTotalCount
                ),
                giftInfo: this.checkGiftInfo(ruleInfo.giftInfo),
                giftOdds: this.checkGiftOdds(ruleInfo.giftOdds),
                needCount: this.checkNeedCount(ruleInfo.needCount, index),
                [giftValidDaysOrEffect]:
                    ruleInfo.effectType != "2"
                        ? this.checkGiftValidDays(ruleInfo.giftValidDays, index)
                        : this.checkGiftValidDays(
                              ruleInfo.giftEffectiveTime,
                              index
                          ),
            });
        });
        let validateFlag = validatedRuleData.reduce((p, ruleInfo) => {
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

        if((type === '60'
             && !perfectReturnGiftCheckBoxStatus.perfectReturnGiftCoupon
             ) ||
             (type === '61'
             && !upGradeReturnGiftCheckBoxStatus.upGradeReturnGiftCoupon
             )
        ) {
            if(perfectReturnGiftCheckBoxStatus.perfectReturnGiftPoint || upGradeReturnGiftCheckBoxStatus.upGradeReturnGiftPoint) {
                //  券隐藏的时候不校验
                validateFlag = true
            } else {
                message.warn('至少选择一项')
                validateFlag = false
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
            // 完善资料送礼添加积分数据
            if(type === '60') {
                giftInfo =  addPointData.call(this,giftInfo)
            }
            // 升级有礼添加积分数据
            if(type === '61') {
                giftInfo =  upGradeAddPointData.call(this,giftInfo)
            }
            if (type === "52") {
                const { presentValue, givePoints } = this.state;
                if (givePoints) {
                    const giftName = presentValue + "积分";
                    const params = {
                        presentValue,
                        presentType: 2,
                        giftName,
                        giftCount: 1,
                    };
                    giftInfo = [...giftInfo, params];
                }
            }
            if (["21" , "66", "65"].includes(type)) {
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
            }
            this.props.setSpecialBasicInfo(giftInfo);
            this.props.setSpecialBasicInfo(
                this.props.type == "67"
                    ? {
                          shareImagePath,
                          shareTitle,
                          discountMinRate: discountMinRate
                              ? discountMinRate / 100
                              : discountMinRate,
                          discountMaxRate: discountMaxRate
                              ? discountMaxRate / 100
                              : discountMaxRate,
                          discountRate: discountRate
                              ? discountRate / 100
                              : discountRate,
                          discountMaxLimitRate: discountMaxLimitRate
                              ? discountMaxLimitRate / 100
                              : discountMaxLimitRate,
                          ...instantDiscountState,
                      }
                    : {
                          giftGetRule,
                          saveMoneySetIds,
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
    // 校验礼品数量
    checkgiftTotalCount = (giftTotalCount) => {
        const _value = parseFloat(giftTotalCount.value);
        if (_value > 0) {
            return giftTotalCount;
        }
        return {
            msg: `${this.props.intl.formatMessage(STRING_SPE.d7ekp2h8kd3282)}`,
            validateStatus: "error",
            value: "",
        };
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
        if (this.props.type == 66) {
            // 膨胀大礼包，每个档位礼品不能重复
            let hasDuplica;
            for (let i = 0; i < index; i++) {
                if (giftInfoArray[i]) {
                    hasDuplica =
                        hasDuplica ||
                        (giftInfoArray[i].giftInfo.giftItemID ===
                            giftInfoArray[index].giftInfo.giftItemID &&
                            giftInfoArray[i].giftCount.value ===
                                giftInfoArray[index].giftCount.value);
                }
            }
            if (hasDuplica) {
                return {
                    ...giftCount,
                    validateStatus: "error",
                    msg: `${this.props.intl.formatMessage(
                        STRING_SPE.d454apk46l2239
                    )}`,
                };
            }
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

    // 校验中奖比率
    checkGiftOdds = (giftOdds) => {
        if (this.props.type == "20") {
            const _value = parseFloat(giftOdds.value);
            if (_value >= 0 && _value <= 100) {
                return giftOdds;
            }
            return {
                msg: `${this.props.intl.formatMessage(
                    STRING_SPE.d1e0750k7u4276
                )}`,
                validateStatus: "error",
                value: "",
            };
        }
        return giftOdds;
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
        if (this.props.type == 66) {
            // 膨胀大礼包，每个档位礼品不能重复
            let hasDuplica;
            for (let i = 0; i < index; i++) {
                if (giftInfoArray[i]) {
                    hasDuplica =
                        hasDuplica ||
                        (giftInfoArray[i].giftInfo.giftItemID ===
                            giftInfoArray[index].giftInfo.giftItemID &&
                            giftInfoArray[i].giftCount.value ===
                                giftInfoArray[index].giftCount.value);
                }
            }
            if (hasDuplica) {
                return {
                    ...giftInfo,
                    validateStatus: "error",
                    msg: `${this.props.intl.formatMessage(
                        STRING_SPE.d454apk46l2239
                    )}`,
                };
            }
        }
        return {
            ...giftInfo,
            validateStatus: "success",
            msg: "",
        };
    };
    gradeChange = (gifts, typeValue) => {
        // 赠送优惠券
        const typePropertyName =
            this.props.type == "68" ? "recommendType" : "sendType";
        if (!Array.isArray(gifts)) return;
        const { data } = this.state;
        this.setState({
            data: [
                ...data.filter((item) => item[typePropertyName] !== typeValue),
                ...gifts,
            ],
        });
    };
    handleShareTitleChange = ({ target: { value } }) => {
        this.setState({
            shareTitle: value,
        });
    };
    handleShareSubTitleChange = ({ target: { value } }) => {
        this.setState({
            shareSubtitle: value,
        });
    };
    handleMoneyLimitTypeChange = (value) => {
        this.setState({
            moneyLimitType: +value,
            moneyLimitValue: undefined,
        });
    };
    handleDiscountTypeChange = (value) => {
        this.setState({
            discountType: +value,
            discountAmount: undefined,
            discountMaxAmount: undefined,
            discountMinAmount: undefined,
            discountRate: undefined,
            discountMinRate: undefined,
            discountMaxRate: undefined,
        });
    };
    handleMpIdChange = (value) => {
        this.setState({
            mpIDList: [value],
        });
    };
    handleDefaultCardTypeChange = (value) => {
        this.setState({
            defaultCardType: value,
        });
    };
    handleDiscountRateChange = ({ number }) => {
        this.setState({
            discountRate: number,
        });
    };
    handleDiscountMinRateChange = ({ number }) => {
        this.setState(
            {
                discountMinRate: number,
            },
            () =>
                this.props.form.setFieldsValue({
                    discountMaxRate: { number: this.state.discountMaxRate },
                })
        );
    };
    handleDiscountMaxRateChange = ({ number }) => {
        this.setState(
            {
                discountMaxRate: number,
            },
            () =>
                this.props.form.setFieldsValue({
                    discountMinRate: { number: this.state.discountMinRate },
                })
        );
    };
    handleDiscountAmountChange = ({ number }) => {
        this.setState({
            discountAmount: number,
        });
    };
    handleDiscountMinAmountChange = ({ number }) => {
        this.setState(
            {
                discountMinAmount: number,
            },
            () =>
                this.props.form.setFieldsValue({
                    discountMaxAmount: { number: this.state.discountMaxAmount },
                })
        );
    };
    handleDiscountMaxAmountChange = ({ number }) => {
        this.setState(
            {
                discountMaxAmount: number,
            },
            () =>
                this.props.form.setFieldsValue({
                    discountMinAmount: { number: this.state.discountMinAmount },
                })
        );
    };
    handleDiscountMaxLimitRateChange = ({ number }) => {
        this.setState({
            discountMaxLimitRate: number,
        });
    };
    handleMoneyLimitValueChange = ({ number }) => {
        this.setState({
            moneyLimitValue: number,
        });
    };
    handleEventValidTimeChange = ({ number }) => {
        this.setState({
            eventValidTime: number,
        });
    };
    handleGiftGetRuleChange = ({ target: { value } }) => {
        if (value === 2 && this.props.type == "75") {
            let { wakeupSendGiftsDataArray } = this.state;
            wakeupSendGiftsDataArray = wakeupSendGiftsDataArray.slice(0, 1);
            wakeupSendGiftsDataArray[0].intervalDays = undefined;
            this.setState({
                wakeupSendGiftsDataArray,
            });
        }
        this.setState({
            giftGetRule: value,
        });
    };
    handleCleanCountChange = ({ target: { value } }) => {
        this.setState({
            cleanCount: value,
        });
    };
    handleRecommendSettingsChange = (index, propertyName,ruleType) => (val) => {
        // index  值为角色值，对应roleType,ruleType 对应rule，存数据先查找对应的rule，然后往对应的角色对象赋值
        const {eventRecommendSettings} = this.state
        const eventRecommendSettingsCurrent =  eventRecommendSettings.find(item => item.rule == ruleType);
        // console.log('this.state.eventRecommendSettings',this.state.eventRecommendSettings)
        // console.log('handleRecommendSettingsChange',index ,propertyName, ruleType, eventRecommendSettingsCurrent)
        if(eventRecommendSettingsCurrent) {
            const { helpMessageArray } = this.state;
            let value;
            if (typeof val === "object") {
                value = val.number;
                helpMessageArray[index] = "";
            } else {
                value = val;
            }
            const currentData = eventRecommendSettingsCurrent.eventRecommendSettings
            const i  = currentData.findIndex(data =>  data.recommendType == index)

            if(i < 0) {
                currentData.push({
                    recommendRule: ruleType,
                    recommendType: index,
                    [propertyName]: value
                })
            } else {
                currentData[i][propertyName] = value;

            }

            this.setState({
                eventRecommendSettings,
                helpMessageArray,
            });
        }

    };
    handleDiscountWayChange = ({ target: { value } }) => {
        this.setState({
            discountWay: +value,
            discountAmount: undefined,
            discountMaxAmount: undefined,
            discountMinAmount: undefined,
            discountRate: undefined,
            discountMinRate: undefined,
            discountMaxRate: undefined,
        });
    };
    handleSaveMoneySetTypeChange = ({ target: { value } }) => {
        this.setState({
            saveMoneySetType: value,
            saveMoneySetIds: [],
        });
    };
    handleSaveMoneySetIdsChange = (val) => {
        this.setState({
            saveMoneySetIds: val,
        });
    };
    handleIntervalDaysChange = (val, index) => {
        const { wakeupSendGiftsDataArray } = this.state;
        wakeupSendGiftsDataArray[index].intervalDays = val;
        this.setState({
            wakeupSendGiftsDataArray: wakeupSendGiftsDataArray.slice(),
        });
    };
    handleWakeupIntervalGiftsChange = (val, index) => {
        let { wakeupSendGiftsDataArray } = this.state;
        wakeupSendGiftsDataArray[index].gifts = val;
        /*
        * 选择支付宝代金券的时候，需单独处理
        * http://jira.hualala.com/browse/WTCRM-1157
        */
     Array.isArray(val) && val.forEach((item,i) => {
        const { parentId, giftItemID } =   item.giftInfo
        if(parentId === '114') {
            const groupID = getStore().getState().user.getIn(['accountInfo', 'groupID']);
            axiosData(
                '/promotion/insidevoucher/queryInsideVoucherPeriod.ajax',
                { groupID, giftItemID },
                null,
                { path: 'data' },
                'HTTP_SERVICE_URL_PROMOTION_NEW'
            ).then( res => {
                const {effectTime,validUntilDate} = res
                const v =  wakeupSendGiftsDataArray[index].gifts[i]
                v.giftCount.value = 1
                v.giftCount.disabled = true
                v.effectType = '2'
                v.effectTypeIsDisabled = true
                v.giftEffectiveTime.value =  [moment(effectTime,'YYYYMMDDHHmmss'),moment(validUntilDate,'YYYYMMDDHHmmss')]
                v.giftEffectiveTime.disabled = true
                v.giftValidDays.value = ''
                this.setState({
                    wakeupSendGiftsDataArray,
                })
            }).catch(err => {

            })
        }
       })
       if(typeof currentIndex !== undefined) {
            const v =  wakeupSendGiftsDataArray[index].gifts[currentIndex]
            v.giftCount.value = ''
            v.giftCount.disabled = false
            v.effectType = '1'
            v.effectTypeIsDisabled = false
            v.giftEffectiveTime.value =  '0'
            v.giftEffectiveTime.disabled = false
       }


        this.setState({
            wakeupSendGiftsDataArray,
        });
    };
    removeInterval = (index) => {
        const { wakeupSendGiftsDataArray } = this.state;
        wakeupSendGiftsDataArray.splice(index, 1);
        this.setState({
            wakeupSendGiftsDataArray,
        });
    };
    addInterval = () => {
        const { wakeupSendGiftsDataArray } = this.state;
        wakeupSendGiftsDataArray.push({
            key: getIntervalID(),
            intervalDays: undefined,
            gifts: [getDefaultGiftData()],
        });
        this.setState({
            wakeupSendGiftsDataArray,
        });
    };
    renderImgUrl = () => {
        const props = {
            name: "myFile",
            showUploadList: false,
            action: "/api/common/imageUpload",
            className: styles1.avatarUploader,
            accept: "image/*",
            beforeUpload: (file) => {
                const isAllowed =
                    file.type === "image/jpeg" || file.type === "image/png";
                if (!isAllowed) {
                    message.error(
                        `${this.props.intl.formatMessage(
                            STRING_SPE.d31ejg5ddi66278
                        )}`
                    );
                }
                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    message.error(
                        `${this.props.intl.formatMessage(
                            STRING_SPE.d1qe50ueom7150
                        )}`
                    );
                }
                return isAllowed && isLt1M;
            },
            onChange: (info) => {
                const status = info.file.status;
                if (
                    status === "done" &&
                    info.file.response &&
                    info.file.response.url
                ) {
                    message.success(
                        `${info.file.name} ${this.props.intl.formatMessage(
                            STRING_SPE.de8fm0fh7m8261
                        )}`
                    );
                    this.setState({
                        shareImagePath: `${ENV.FILE_RESOURCE_DOMAIN}/${info.file.response.url}`,
                    });
                } else if (
                    status === "error" ||
                    (info.file.response && !info.file.response.url)
                ) {
                    if (info.file.response.code === "0011111100000001") {
                        message.warning(
                            `${this.props.intl.formatMessage(
                                STRING_SPE.d7el5efn1g9194
                            )}`
                        );
                        setTimeout(() => {
                            doRedirect();
                        }, 2000);
                    } else {
                        message.error(
                            `${info.file.name} ${this.props.intl.formatMessage(
                                STRING_SPE.d5g37mj8lj10275
                            )}`
                        );
                    }
                }
            },
        };
        return (
            <Row>
                <Col>
                    <FormItem>
                        <Upload {...props}>
                            {this.state.shareImagePath ? (
                                <img
                                    src={this.state.shareImagePath}
                                    alt=""
                                    className={styles1.avatar}
                                />
                            ) : (
                                <Icon
                                    type="plus"
                                    className={styles1.avatarUploaderTrigger}
                                />
                            )}
                        </Upload>
                        <p className="ant-upload-hint">
                            {this.props.intl.formatMessage(
                                STRING_SPE.de8fm0fh7m11217
                            )}
                            <br />
                            {this.props.intl.formatMessage(
                                STRING_SPE.d1kge806b911258
                            )}
                        </p>
                    </FormItem>
                </Col>
            </Row>
        );
    };
    renderShareInfo = () => {
        return (
            <div>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d1430qdd6s1381
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {this.props.form.getFieldDecorator("shareTitle", {
                        rules: [
                            {
                                max: 50,
                                message: `${this.props.intl.formatMessage(
                                    STRING_SPE.d2c8d07mpg149
                                )}`,
                            },
                        ],
                        initialValue: this.state.shareTitle,
                        onChange: this.handleShareTitleChange,
                    })(
                        <Input
                            placeholder={this.props.intl.formatMessage(
                                STRING_SPE.d454apk46m15158
                            )}
                        />
                    )}
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d7el5efn1g1619
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ position: "relative" }}
                >
                    {this.renderImgUrl()}
                </FormItem>
            </div>
        );
    };
    onRestImg = ({ key, value }) => {
        this.setState({ [key]: value });
    };
    renderShareInfo2 = () => {
        const { type } = this.props;
        const {
            shareTitle,
            shareSubtitle,
            restaurantShareImagePath,
            shareImagePath,
            shareTitlePL,
            shareSubtitlePL,
        } = this.state;
        return (
            <div>
                <p className={selfStyle.shareTip}>分享设置</p>
                <FormItem
                    label="分享标题"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {this.props.form.getFieldDecorator("shareTitle", {
                        rules: [{ max: 35, message: "最多35个字符" }],
                        initialValue: shareTitle,
                        onChange: this.handleShareTitleChange,
                    })(<Input placeholder={shareTitlePL} />)}
                </FormItem>
                <FormItem
                    label="分享副标题"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {this.props.form.getFieldDecorator("shareSubtitle", {
                        rules: [{ max: 35, message: "最多35个字符" }],
                        initialValue: shareSubtitle,
                        onChange: this.handleShareSubTitleChange,
                    })(<Input placeholder={shareSubtitlePL} />)}
                </FormItem>
                <FormItem
                    label="分享图片"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ position: "relative" }}
                >
                    <PhotoFrame
                        restaurantShareImagePath={restaurantShareImagePath}
                        shareImagePath={shareImagePath}
                        onChange={this.onRestImg}
                        type={type}
                    />
                </FormItem>
            </div>
        );
    };
    renderFlexFormControl = () => {
        const {
            discountWay,
            discountType,
            discountAmount,
            discountMaxAmount,
            discountMinAmount,
            discountRate,
            discountMinRate,
            discountMaxRate,
        } = this.state;
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <div style={{ display: "flex" }}>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.dd5a6d3176e17223
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 12 }}
                    style={{ width: "40%" }}
                >
                    <RadioGroup
                        onChange={this.handleDiscountWayChange}
                        value={`${discountWay}`}
                    >
                        <RadioButton value="0">
                            {this.props.intl.formatMessage(
                                STRING_SPE.d5g37mj8lj1899
                            )}
                        </RadioButton>
                        <RadioButton value="1">
                            {this.props.intl.formatMessage(
                                STRING_SPE.d7h8110eaea19152
                            )}
                        </RadioButton>
                    </RadioGroup>
                </FormItem>
                {discountType === 0 && discountWay === 0 && (
                    <FormItem
                        className={styles.FormItemStyle}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 19 }}
                        style={{ width: "60%" }}
                    >
                        {getFieldDecorator("discountAmount", {
                            onChange: this.handleDiscountAmountChange,
                            initialValue: { number: discountAmount },
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || !(v.number > 0)) {
                                            return cb(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.d21644a8a593a20108
                                                )}`
                                            );
                                        }
                                        cb();
                                    },
                                },
                            ],
                        })(
                            <PriceInput
                                addonAfter={this.props.intl.formatMessage(
                                    STRING_SPE.da8omhe07g2195
                                )}
                                maxNum={3}
                                modal="float"
                            />
                        )}
                    </FormItem>
                )}
                {discountType === 0 && discountWay === 1 && (
                    <FormItem
                        className={styles.FormItemStyle}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 19 }}
                        style={{ width: "60%" }}
                    >
                        {getFieldDecorator("discountRate", {
                            onChange: this.handleDiscountRateChange,
                            initialValue: { number: discountRate },
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || !(v.number > 0)) {
                                            return cb(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.d31ejg5ddi722273
                                                )}`
                                            );
                                        } else if (v.number > 100) {
                                            return cb(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.dd5a6d3176f236
                                                )}`
                                            );
                                        }
                                        cb();
                                    },
                                },
                            ],
                        })(
                            <PriceInput
                                addonAfter="%"
                                maxNum={4}
                                modal="float"
                            />
                        )}
                    </FormItem>
                )}
                {discountType === 1 && discountWay === 1 && (
                    <div
                        style={{ width: "48%" }}
                        className={styles.flexFormControl}
                    >
                        <FormItem
                            className={styles.FormItemStyle}
                            wrapperCol={{ span: 24 }}
                            style={{ width: "45%" }}
                        >
                            {getFieldDecorator("discountMinRate", {
                                onChange: this.handleDiscountMinRateChange,
                                initialValue: { number: discountMinRate },
                                rules: [
                                    {
                                        validator: (rule, v, cb) => {
                                            if (!v || !(v.number > 0)) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.d31ejg5ddi722273
                                                    )}`
                                                );
                                            } else if (v.number > 100) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.dd5a6d3176f236
                                                    )}`
                                                );
                                            } else if (
                                                v.number > +discountMaxRate
                                            ) {
                                                // 字符串和字符串做比较，有坑
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.d454apk46n2467
                                                    )}`
                                                );
                                            }
                                            cb();
                                        },
                                    },
                                ],
                            })(
                                <PriceInput
                                    addonAfter="%"
                                    maxNum={4}
                                    modal="float"
                                />
                            )}
                        </FormItem>
                        至
                        <FormItem
                            className={styles.FormItemStyle}
                            wrapperCol={{ span: 24 }}
                            style={{ width: "45%" }}
                        >
                            {getFieldDecorator("discountMaxRate", {
                                onChange: this.handleDiscountMaxRateChange,
                                initialValue: { number: discountMaxRate },
                                rules: [
                                    {
                                        validator: (rule, v, cb) => {
                                            if (!v || !(v.number > 0)) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.d31ejg5ddi722273
                                                    )}`
                                                );
                                            } else if (v.number > 100) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.dd5a6d3176f236
                                                    )}`
                                                );
                                            } else if (
                                                v.number < +discountMinRate
                                            ) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.d7h8110eaeb25105
                                                    )}`
                                                );
                                            }
                                            cb();
                                        },
                                    },
                                ],
                            })(
                                <PriceInput
                                    addonAfter="%"
                                    maxNum={4}
                                    modal="float"
                                />
                            )}
                        </FormItem>
                    </div>
                )}
                {discountType === 1 && discountWay === 0 && (
                    <div
                        style={{ width: "48%" }}
                        className={styles.flexFormControl}
                    >
                        <FormItem
                            className={styles.FormItemStyle}
                            wrapperCol={{ span: 24 }}
                            style={{ width: "45%" }}
                        >
                            {getFieldDecorator("discountMinAmount", {
                                onChange: this.handleDiscountMinAmountChange,
                                initialValue: { number: discountMinAmount },
                                rules: [
                                    {
                                        validator: (rule, v, cb) => {
                                            if (!v || !(v.number > 0)) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.d21644a8a593a20108
                                                    )}`
                                                );
                                            } else if (
                                                v.number > +discountMaxAmount
                                            ) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.d1e0750k7v26111
                                                    )}`
                                                );
                                            }
                                            cb();
                                        },
                                    },
                                ],
                            })(
                                <PriceInput
                                    addonAfter={this.props.intl.formatMessage(
                                        STRING_SPE.da8omhe07g2195
                                    )}
                                    maxNum={3}
                                    modal="float"
                                />
                            )}
                        </FormItem>
                        至
                        <FormItem
                            className={styles.FormItemStyle}
                            wrapperCol={{ span: 24 }}
                            style={{ width: "45%" }}
                        >
                            {getFieldDecorator("discountMaxAmount", {
                                onChange: this.handleDiscountMaxAmountChange,
                                initialValue: { number: discountMaxAmount },
                                rules: [
                                    {
                                        validator: (rule, v, cb) => {
                                            if (!v || !(v.number > 0)) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.d21644a8a593a20108
                                                    )}`
                                                );
                                            } else if (
                                                v.number < +discountMinAmount
                                            ) {
                                                return cb(
                                                    `${this.props.intl.formatMessage(
                                                        STRING_SPE.d31ejgjgeda0286
                                                    )}`
                                                );
                                            }
                                            cb();
                                        },
                                    },
                                ],
                            })(
                                <PriceInput
                                    addonAfter={this.props.intl.formatMessage(
                                        STRING_SPE.da8omhe07g2195
                                    )}
                                    maxNum={3}
                                    modal="float"
                                />
                            )}
                        </FormItem>
                    </div>
                )}
            </div>
        );
    };
    renderInstantDiscountForm = () => {
        const {
            moneyLimitType,
            moneyLimitValue,
            eventValidTime,
            discountType,
            discountMaxLimitRate,
            inviteType,
            mpIDList,
            defaultCardType,
        } = this.state;
        const {
            form: { getFieldDecorator },
            groupCardTypeList,
            allWeChatAccountList,
        } = this.props;
        const mpInfoList = Immutable.List.isList(allWeChatAccountList)
            ? allWeChatAccountList.toJS()
            : [];
        const cardTypeList = Immutable.List.isList(groupCardTypeList)
            ? groupCardTypeList.toJS()
            : [];
        const userCount = this.props.specialPromotion.getIn([
            "$eventInfo",
            "userCount",
        ]); // 当有人领取礼物后，礼物不可编辑
        return (
            <div
                style={{
                    marginBottom: 20,
                }}
            >
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d1kge806b9227266
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <p>
                        {this.props.intl.formatMessage(
                            STRING_SPE.d4h18iegahe28194
                        )}
                    </p>
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d56720d572d929270
                    )}
                    className={styles.FormItemStyle}
                    required={moneyLimitType === 1}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {moneyLimitType === 0 ? (
                        <Select
                            value={`${moneyLimitType}`}
                            getPopupContainer={(node) => node.parentNode}
                            onChange={this.handleMoneyLimitTypeChange}
                        >
                            <Select.Option value="0">
                                {this.props.intl.formatMessage(
                                    STRING_SPE.d31ei98dbgi21253
                                )}
                            </Select.Option>
                            <Select.Option value="1">
                                {this.props.intl.formatMessage(
                                    STRING_SPE.d5g37mj8lk30103
                                )}
                            </Select.Option>
                        </Select>
                    ) : (
                        getFieldDecorator("moneyLimitValue", {
                            onChange: this.handleMoneyLimitValueChange,
                            initialValue: { number: moneyLimitValue },
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (!v || !v.number) {
                                            return cb(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.d1e0750k7v31191
                                                )}`
                                            );
                                        }
                                        cb();
                                    },
                                },
                            ],
                        })(
                            <PriceInput
                                addonBefore={
                                    <Select
                                        value={`${moneyLimitType}`}
                                        getPopupContainer={(node) =>
                                            node.parentNode
                                        }
                                        onChange={
                                            this.handleMoneyLimitTypeChange
                                        }
                                    >
                                        <Select.Option value="0">
                                            {this.props.intl.formatMessage(
                                                STRING_SPE.d31ei98dbgi21253
                                            )}
                                        </Select.Option>
                                        <Select.Option value="1">
                                            {this.props.intl.formatMessage(
                                                STRING_SPE.d5g37mj8lk30103
                                            )}
                                        </Select.Option>
                                    </Select>
                                }
                                addonAfter={`${this.props.intl.formatMessage(
                                    STRING_SPE.da8omhe07g2195
                                )}`}
                                maxNum={8}
                                modal="float"
                            />
                        )
                    )}
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d4h177f79da1218
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        value={`${discountType}`}
                        getPopupContainer={(node) => node.parentNode}
                        onChange={this.handleDiscountTypeChange}
                    >
                        <Select.Option value="0">
                            {this.props.intl.formatMessage(
                                STRING_SPE.d7h8110eaeb3297
                            )}
                        </Select.Option>
                        <Select.Option value="1">
                            {this.props.intl.formatMessage(
                                STRING_SPE.d1430qdd6t3378
                            )}
                        </Select.Option>
                    </Select>
                </FormItem>
                {this.renderFlexFormControl()}
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d31ejg5ddi734293
                    )}
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator("discountMaxLimitRate", {
                        onChange: this.handleDiscountMaxLimitRateChange,
                        initialValue: { number: discountMaxLimitRate },
                        rules: [
                            {
                                validator: (rule, v, cb) => {
                                    if (!v || !(v.number > 0)) {
                                        return cb(
                                            `${this.props.intl.formatMessage(
                                                STRING_SPE.dd5a6d3176f35162
                                            )}`
                                        );
                                    } else if (v.number > 100) {
                                        return cb(
                                            `${this.props.intl.formatMessage(
                                                STRING_SPE.de8fm0fh8036225
                                            )}`
                                        );
                                    }
                                    cb();
                                },
                            },
                        ],
                    })(
                        <PriceInput
                            addonBefore={this.props.intl.formatMessage(
                                STRING_SPE.dojwosi433749
                            )}
                            addonAfter="%"
                            maxNum={4}
                            modal="float"
                        />
                    )}
                    <CloseableTip
                        style={{
                            position: "absolute",
                            right: "-23px",
                            top: "5px",
                        }}
                        width="100%"
                        content={
                            <div>
                                <p>
                                    {this.props.intl.formatMessage(
                                        STRING_SPE.d31ejg5ddi734293
                                    )}
                                </p>
                                <br />
                                <p>
                                    {this.props.intl.formatMessage(
                                        STRING_SPE.d1e0750k8038217
                                    )}
                                </p>
                            </div>
                        }
                    />
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d16hg8i3la839116
                    )}
                    required
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator("eventValidTime", {
                        onChange: this.handleEventValidTimeChange,
                        initialValue: { number: eventValidTime },
                        rules: [
                            {
                                validator: (rule, v, cb) => {
                                    if (!v || !(v.number > 0)) {
                                        return cb(
                                            `${this.props.intl.formatMessage(
                                                STRING_SPE.d1kge806b9340259
                                            )}`
                                        );
                                    } else if (v.number > 10) {
                                        return cb(
                                            `${this.props.intl.formatMessage(
                                                STRING_SPE.d1700e50510041167
                                            )}`
                                        );
                                    }
                                    cb();
                                },
                            },
                        ],
                    })(
                        <PriceInput
                            addonAfter={this.props.intl.formatMessage(
                                STRING_SPE.d1e0750k804214
                            )}
                            maxNum={3}
                            modal="int"
                        />
                    )}
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d16hg8i3la843288
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Select
                        value={`${inviteType}`}
                        getPopupContainer={(node) => node.parentNode}
                        disabled
                    >
                        {/* <Select.Option value="0">被邀请人关注公众号即完成邀请</Select.Option> */}
                        <Select.Option value="1">
                            {this.props.intl.formatMessage(
                                STRING_SPE.d34igk92gk44272
                            )}
                        </Select.Option>
                    </Select>
                    <CloseableTip
                        style={{
                            position: "absolute",
                            right: "-23px",
                            top: "5px",
                        }}
                        width="100%"
                        content={
                            <div>
                                <p>
                                    {this.props.intl.formatMessage(
                                        STRING_SPE.d454apk46o45133
                                    )}
                                </p>
                                <br />
                                <p>
                                    {this.props.intl.formatMessage(
                                        STRING_SPE.de8fm0fh8046149
                                    )}
                                </p>
                            </div>
                        }
                    />
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d2b1beb4216347268
                    )}
                    className={styles.FormItemStyle}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator("mpId", {
                        rules: [
                            {
                                required: true,
                                message: `${this.props.intl.formatMessage(
                                    STRING_SPE.d454b2jmak0207
                                )}`,
                            },
                        ],
                        initialValue: mpIDList.length ? mpIDList[0] : undefined,
                        onChange: this.handleMpIdChange,
                    })(
                        <Select
                            placeholder={this.props.intl.formatMessage(
                                STRING_SPE.dojwosi43484
                            )}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {mpInfoList.map(({ mpID, mpName }) => (
                                <Select.Option key={mpID} value={mpID}>
                                    {mpName}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d1qe50ueoo49243
                    )}
                    className={styles.FormItemStyle}
                    required
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    {getFieldDecorator("defaultCardType", {
                        rules: [
                            {
                                required: true,
                                message: `${this.props.intl.formatMessage(
                                    STRING_SPE.da8omhe07i508
                                )}`,
                            },
                        ],
                        initialValue: defaultCardType,
                        onChange: this.handleDefaultCardTypeChange,
                    })(
                        <Select
                            showSearch={true}
                            placeholder={this.props.intl.formatMessage(
                                STRING_SPE.d7h8110eaec5124
                            )}
                            getPopupContainer={(node) => node.parentNode}
                        >
                            {cardTypeList.map((cate) => (
                                <Select.Option
                                    key={cate.cardTypeID}
                                    value={cate.cardTypeID}
                                >
                                    {cate.cardTypeName}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.dojwosi4352250
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <Switch
                        checked={!this.state.disabledGifts}
                        checkedChildren={COMMON_LABEL.open}
                        disabled={userCount > 0}
                        unCheckedChildren={COMMON_LABEL.close}
                        onChange={(bool) =>
                            this.setState({ disabledGifts: !bool })
                        }
                    ></Switch>
                </FormItem>
            </div>
        );
    };

    renderRecommendGifts = (roleType,ruleType) => {
      return  renderRecommendGiftsFn.call(this,roleType,ruleType)
    };
    _getVal = ({ruleType,roleType,key}) => {
        const { eventRecommendSettings } = this.state;
        const currentData = eventRecommendSettings.filter(v => v.rule == ruleType)
        if(currentData && currentData[0] && currentData[0].eventRecommendSettings) {
            const itemData = currentData[0].eventRecommendSettings.find(v => v.recommendType == roleType)
            // console.log('-----',itemData,key,ruleType,roleType)
            if(itemData) {
                return    itemData[key]
            } else {
                return ''
            }

        }
        return ''
    }
    renderPointControl = (ruleType, roleType) => {
        const {
            form: { getFieldDecorator },
        } = this.props;
        const {checkBoxStatus} = this.state
        const pointRate = this._getVal({ruleType,roleType,key: 'pointRate'})
        const pointLimitValue = this._getVal({ruleType,roleType,key: 'pointLimitValue'})

        return (
            <Row gutter={6}>
                <Col span={11} >
                    <FormItem
                        label={this.props.intl.formatMessage(
                            STRING_SPE.d31ejg5ddi853253
                        )}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator(`pointRate${ruleType}${roleType}`, {
                            onChange: this.handleRecommendSettingsChange(
                                roleType,
                                "pointRate",
                                ruleType
                            ),
                            initialValue: {
                                number: pointRate,
                            },
                            rules: [
                                {
                                    validator: (rule, v, cb) => {
                                        if (
                                            v.number === "" ||
                                            v.number === undefined
                                        ) {
                                            return cb(checkBoxStatus[`ruleType${ruleType}`][`giveIntegral${roleType}`] ?
                                            '请输入数值' : undefined);
                                        }
                                        if (!v || !(v.number > 0)) {
                                            return cb(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.d16hg8i3la85466
                                                )}`
                                            );
                                        } else if (v.number > 100) {
                                            return cb(
                                                `${this.props.intl.formatMessage(
                                                    STRING_SPE.d1e0750k8155219
                                                )}`
                                            );
                                        }
                                        cb();
                                    },
                                },
                            ],
                        })(
                            <PriceInput
                                addonAfter="%"
                                maxNum={3}
                                modal="float"
                                placeholder="请输入数值"
                            />
                        )}
                    </FormItem>
                </Col>
                <Col span={11}>
                    <FormItem
                        label={"单笔上限"}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        {getFieldDecorator(`pointLimitValue${ruleType}${roleType}`, {
                            onChange: this.handleRecommendSettingsChange(
                                roleType,
                                "pointLimitValue",
                                ruleType
                            ),
                            initialValue: {
                                number: pointLimitValue,
                            },
                            rules: [],
                        })(
                            <PriceInput
                                addonAfter={this.props.intl.formatMessage(
                                    STRING_SPE.db60b58ca13657133
                                )}
                                placeholder={this.props.intl.formatMessage(
                                    STRING_SPE.d5g37mj8lm5884
                                )}
                                maxNum={6}
                                modal="float"
                            />
                        )}
                    </FormItem>
                </Col>
            </Row>
        );
    };
    renderRechargeReward = (ruleType,roleType,type) => {
        const {checkBoxStatus} = this.state
        const {
            form: { getFieldDecorator },
        } = this.props;
        let label = '储值比例'
        let key = 'rechargeRate'
        if(type === 'consumeRate') {
            label= '消费比例'
            key = 'consumeRate'
        }
        const rechargeRate = this._getVal({ruleType,roleType,key })
        const moneyLimitValue = this._getVal({ruleType,roleType,key: 'moneyLimitValue'})

        return (
            <div>
                {this.renderCheckbox({
                    key: `giveIntegral`,
                    label: "赠送积分",
                    children: this.renderPointControl(ruleType, roleType),
                    ruleType,
                    roleType
                })}
                {this.renderCheckbox({
                    key: `giveCard`,
                    label: "赠送卡值",
                    ruleType,
                    roleType,
                    children: (
                        <Row gutter={6}>
                            <Col span={11}  >
                                <FormItem
                                    label={label}
                                    className={styles.FormItemStyle}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {getFieldDecorator(
                                        `recharge${ruleType}${roleType}`,
                                        {
                                            onChange: this.handleRecommendSettingsChange(
                                                roleType,
                                                key,
                                                ruleType
                                            ),
                                            initialValue: {
                                                number: rechargeRate

                                            },
                                            rules: [
                                                {
                                                    validator: (
                                                        rule,
                                                        v,
                                                        cb
                                                    ) => {
                                                        if (
                                                            v.number === "" ||
                                                            v.number ===
                                                                undefined
                                                        ) {
                                                            return cb(checkBoxStatus[`ruleType${ruleType}`][`giveCard${roleType}`] ?
                                                            '请输入数值' : undefined);
                                                        }
                                                        if (
                                                            !v ||
                                                            !(v.number > 0)
                                                        ) {
                                                            return cb(
                                                                `${this.props.intl.formatMessage(
                                                                    STRING_SPE.d1700e5051016014
                                                                )}`
                                                            );
                                                        } else if (
                                                            v.number > 100
                                                        ) {
                                                            return cb(
                                                                `${this.props.intl.formatMessage(
                                                                    STRING_SPE.de8fm0fh816121
                                                                )}`
                                                            );
                                                        }
                                                        cb();
                                                    },
                                                },
                                            ],
                                        }
                                    )(
                                        <PriceInput
                                            addonAfter="%"
                                            maxNum={3}
                                            modal="float"
                                            placeholder="请输入数值"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={11}>
                                <FormItem
                                    label={"单笔上限"}
                                    className={styles.FormItemStyle}
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                >
                                    {getFieldDecorator(
                                        `moneyLimitValue${ruleType}${roleType}`,
                                        {
                                            onChange: this.handleRecommendSettingsChange(
                                                roleType,
                                                "moneyLimitValue",
                                                ruleType
                                            ),
                                            initialValue: {
                                                number: moneyLimitValue

                                            },
                                            rules: [],
                                        }
                                    )(
                                        <PriceInput
                                            addonAfter={this.props.intl.formatMessage(
                                                STRING_SPE.da8omhe07g2195
                                            )}
                                            placeholder={this.props.intl.formatMessage(
                                                STRING_SPE.d5g37mj8lm5884
                                            )}
                                            maxNum={6}
                                            modal="float"
                                        />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                    ),
                })}
            </div>
        );
    };
    renderConsumptionReward = (ruleType,roleType) => {
        const { eventRecommendSettings } = this.state;
        const {
            form: { getFieldDecorator },
        } = this.props;
        const rewardRange = this._getVal({ruleType,roleType,key: 'rewardRange'})
        return (
            <div>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d1kge806b946655
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 12}}
                >
                    <Select
                        value={String(rewardRange)}
                        getPopupContainer={(node) => node.parentNode}
                        onChange={this.handleRecommendSettingsChange(
                            roleType,
                            "rewardRange",
                            ruleType
                        )}
                        style={{
                            marginLeft: '14px',
                            width: '216px'
                        }}
                    >
                        <Select.Option value="0">
                            {this.props.intl.formatMessage(
                                STRING_SPE.db60b58ca13667255
                            )}
                        </Select.Option>
                        <Select.Option value="1">
                            {this.props.intl.formatMessage(
                                STRING_SPE.d34igk92gl6822
                            )}
                        </Select.Option>
                        <Select.Option value="2">
                            {this.props.intl.formatMessage(
                                STRING_SPE.d454apk46p69270
                            )}
                        </Select.Option>
                        <Select.Option value="3">
                            {this.props.intl.formatMessage(
                                STRING_SPE.d7h8110eaed70124
                            )}
                        </Select.Option>
                    </Select>
                </FormItem>
               {this.renderRechargeReward(ruleType,roleType,'consumeRate')}

            </div>
        );
    };
    renderSaveMoneySetSelector = () => {
        const { saveMoneySetType } = this.state;
        const saveMoneySetList = this.props.saveMoneySetList.toJS();
        return (
            <div>
                <FormItem
                    label={this.props.intl.formatMessage(
                        STRING_SPE.d1kge806b947149
                    )}
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                    style={{ textAlign: "left" }}
                >
                    <RadioGroup
                        onChange={this.handleSaveMoneySetTypeChange}
                        value={saveMoneySetType}
                    >
                        <Radio key={"0"} value={"0"}>
                            {this.props.intl.formatMessage(
                                STRING_SPE.d1430qdd6v7262
                            )}
                        </Radio>
                        <Radio key={"1"} value={"1"}>
                            {this.props.intl.formatMessage(
                                STRING_SPE.d34igk92gm73182
                            )}
                        </Radio>
                    </RadioGroup>
                </FormItem>

                {saveMoneySetType == 1 && (
                    <FormItem
                        label={this.props.intl.formatMessage(
                            STRING_SPE.d2b1beb4216574112
                        )}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        {this.props.form.getFieldDecorator("saveMoneySetIds", {
                            rules: [
                                {
                                    required: true,
                                    message: '请选择活动适用的储值套餐',
                                },
                            ],
                            initialValue: this.state.saveMoneySetIds,
                            onChange: this.handleSaveMoneySetIdsChange,
                        })(
                            <Select
                                showSearch={true}
                                notFoundContent={`${this.props.intl.formatMessage(
                                    STRING_SPE.d2c8a4hdjl248
                                )}`}
                                multiple
                                placeholder={this.props.intl.formatMessage(
                                    STRING_SPE.d1qe50ueoq76275
                                )}
                                getPopupContainer={(node) => node.parentNode}
                            >
                                {saveMoneySetList.map((set) => (
                                    <Select.Option
                                        key={set.saveMoneySetID}
                                        value={set.saveMoneySetID}
                                    >
                                        {set.setName}
                                    </Select.Option>
                                ))}
                            </Select>
                        )}
                    </FormItem>
                )}
            </div>
        );
    };
    handleActiveRuleTabChange = (type) => (e) => {
        // tab 切换的时候校验
        this.props.form.validateFieldsAndScroll(
            { force: true },
            (error, basicValues) => {
                // console.log('err',error)
                if (!error) {
                    const {data} = this.state
                    const validatedRuleData = validatedRuleDataFn.call(this,data)
                    const validateFlag = validateFlagFn.call(this,validatedRuleData)
                    if(validateFlag) {
                        this.setState({
                            // [`${type}ActiveRuleTabValue`]: e,   两个tab分别切换
                            directActiveRuleTabValue: e,
                            indirectActiveRuleTabValue: e,

                        });
                    } else {
                        message.warn('你有未填项，请填写')
                    }

                } else {
                    message.warn('你有未填项，请填写')
                }
            }
        );




    };
    handleChangeBox = ({key,ruleType,roleType}) => (e) => {


        const {checkBoxStatus} = this.state
        checkBoxStatus[`ruleType${ruleType}`][`${key}${roleType}`] = e.target.checked
        if(!checkChoose.call(this,key,ruleType,roleType)) {
            checkBoxStatus[`ruleType${ruleType}`][`${key}${roleType}`] = !e.target.checked
            message.warn('至少选择一个礼品')
            return
        }
        // console.log('checked',e.target.checked,key )
        if(e.target.checked === false) {
            clearCheckBoxData.call(this,key,ruleType,roleType)

        }
        this.setState({
            checkBoxStatus: {
                ...checkBoxStatus,
            },
        })

    };
    /**
     *  奖励多选项，每个角色至少选择一种奖励
     *
     * @param {*} { children = null, key, label, ruleType(活动规则), roleType(奖励的角色) }
     * @returns
     */
    renderCheckbox = ({ children = null, key, label, ruleType, roleType }) => {
            if(!key || !ruleType ) return null
            const {checkBoxStatus} = this.state
            const checked = checkBoxStatus[`ruleType${ruleType}`][`${key}${roleType}`]

            return (
                <div className={recommentGiftStyle.formItemStyle}>
                    <div style={{ paddingTop: "12px" }}>
                        <Checkbox
                            checked={checked}
                            onChange={this.handleChangeBox({key,ruleType,roleType})}
                        />
                        <span className={recommentGiftStyle.checkboxText}>
                            {label}
                        </span>
                    </div>
                    {checked && children}
                </div>
            );
    };

    renderGivePoint = (roleType,ruleType) => {

      return renderGivePointFn.call(this,roleType,ruleType)
    };

    renderCash = (ruleType,roleType) => {
      return  renderCashFn.call(this,ruleType,roleType)
    };

    renderCashSaveMoney = (ruleType,roleType) => {
        // 储值后获得和消费后获得的现金红包基本一致
        const {
            form: { getFieldDecorator },
        } = this.props;
        const {redPackets,cashGiftVal,checkBoxStatus} = this.state
        // 现金红包的储值比例和消费比例
        let cashRadioTitle = '储值比例'
        if(ruleType == 3) {
            cashRadioTitle = '消费比例'
        }
        const cashGiftKey = `cashGift${ruleType}${roleType}`
        const redPackageRate =  this._getVal({ruleType,roleType,key: 'redPackageRate'})
        const redPackageLimitValue = this._getVal({ruleType,roleType,key: 'redPackageLimitValue'})
        return (
            <div>
                <FormItem
                    className={styles.FormItemSecondStyle}
                    style={{ marginLeft: "16px", width: "196px" }}
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

                <Row gutter={6}>
                    <Col span={11}  >
                        <FormItem

                            label={cashRadioTitle}
                            className={styles.FormItemStyle}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            {getFieldDecorator(
                                `redPackageRate${ruleType}${roleType}`,
                                {
                                    onChange: this.handleRecommendSettingsChange(
                                        roleType,
                                        "redPackageRate",
                                        ruleType
                                    ),
                                    initialValue: { number: redPackageRate },
                                    rules: [
                                        {
                                            validator: (rule, v, cb) => {
                                                if (
                                                    v.number === "" ||
                                                    v.number === undefined
                                                ) {
                                                    return cb(checkBoxStatus[`ruleType${ruleType}`][`giveCash${roleType}`] ?
                                                    '请输入数值' : undefined);
                                                }
                                                if (!v || !(v.number > 0)) {
                                                    return cb(
                                                        `${this.props.intl.formatMessage(
                                                            STRING_SPE.d1700e5051016014
                                                        )}`
                                                    );
                                                } else if (v.number > 100) {
                                                    return cb(
                                                        `${this.props.intl.formatMessage(
                                                            STRING_SPE.de8fm0fh816121
                                                        )}`
                                                    );
                                                }
                                                cb();
                                            },
                                        },
                                    ],
                                }
                            )(
                                <PriceInput
                                    addonAfter="%"
                                    maxNum={3}
                                    modal="float"
                                    placeholder="请输入数值"
                                />
                            )}
                        </FormItem>
                    </Col>

                    <Col span={11}>
                        <FormItem
                            label="单笔上限"
                            className={styles.FormItemStyle}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            {getFieldDecorator(
                                `redPackageLimitValue${ruleType}${roleType}`,
                                {
                                    onChange: this.handleRecommendSettingsChange(
                                        roleType,
                                        "redPackageLimitValue",
                                        ruleType
                                    ),
                                    initialValue: { number: redPackageLimitValue },
                                    rules: [],
                                }
                            )(
                                <PriceInput
                                    addonAfter={"元"}
                                    placeholder={"不填表示不限制"}
                                    maxNum={6}
                                    modal="float"
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </div>
        );
    };

    renderRecommendGiftsDetail = () => {
        const recommendRange = this.props.specialPromotion.getIn([
            "$eventInfo",
            "recommendRange",
        ]);
        let recommendRule = this.props.specialPromotion.getIn([
            "$eventInfo",
            "recommendRule",
        ]);
        let {
            helpMessageArray,
            directActiveRuleTabValue,
            indirectActiveRuleTabValue,
            checkBoxStatus
        } = this.state;
        let activeRulesListArr = null;
        if (recommendRule) {
            if(typeof recommendRule === 'number') {
                recommendRule = String(recommendRule).split('')
            } else {
                recommendRule = recommendRule.toJS()
            }

            activeRulesListArr = activeRulesList.filter((v) =>
                recommendRule.includes(v.value)
            );
        }

        this.currentRecommendRule = recommendRule

        directActiveRuleTabValue =
        directActiveRuleTabValue ||
            (activeRulesListArr && activeRulesListArr[0].value);

        indirectActiveRuleTabValue =
        indirectActiveRuleTabValue ||
            (activeRulesListArr && activeRulesListArr[0].value);

        let renderRecommentReward;


        return (
            <div className={recommentGiftStyle.recommentGiftStep3Wrap}>
                <p className={styles.coloredBorderedLabel}>
                    {this.props.intl.formatMessage(STRING_SPE.d1kge806b957782)}
                    <span style={{ color: "#f04134" }}>
                        {helpMessageArray[0]}
                    </span>
                </p>
                <Tabs
                    hideAdd={true}
                    onChange={this.handleActiveRuleTabChange('direct')}
                    activeKey={directActiveRuleTabValue}
                    type="editable-card"
                    className={recommentGiftStyle.tabs}
                >
                    {activeRulesListArr &&
                        activeRulesListArr.map((v) => {
                            switch (+directActiveRuleTabValue) {
                                case 1:
                                    renderRecommentReward = this
                                        .renderRecommendGifts;
                                    break;
                                case 2:
                                    renderRecommentReward = this
                                        .renderRechargeReward;
                                    break;
                                case 3:
                                    renderRecommentReward = this
                                        .renderConsumptionReward;
                                    break;
                                default:
                                    renderRecommentReward = this
                                        .renderRecommendGifts;
                            }
                            return (
                                <TabPane
                                    closable={false}
                                    tab={v.label}
                                    key={v.value}
                                >
                                    {directActiveRuleTabValue == 2 &&
                                        this.renderSaveMoneySetSelector()}
                                    {directActiveRuleTabValue == 1 ? (
                                        <div>
                                            {this.renderCheckbox({
                                                children: this.renderGivePoint('1',directActiveRuleTabValue),
                                                key: "giveIntegral", // 赠送积分
                                                label: "赠送积分",
                                                ruleType: directActiveRuleTabValue,
                                                roleType: '1'
                                            })}
                                            {this.renderCheckbox({
                                                key: "giveCoupon",
                                                label: "赠送优惠券",
                                                ruleType: directActiveRuleTabValue,
                                                roleType: '1',
                                            })}
                                        </div>
                                    ) : null}
                                    {checkBoxStatus[`ruleType${directActiveRuleTabValue}`][`giveCoupon1`]
                                    && this.renderRecommendGifts(1, directActiveRuleTabValue)}
                                    {directActiveRuleTabValue > 1 && renderRecommentReward(directActiveRuleTabValue, '1',{
                                        marginLeft: "22px",
                                    })}
                                    {this.renderCheckbox({
                                        key: "giveCash",
                                        label: "现金红包",
                                        children:
                                        directActiveRuleTabValue == 1
                                                ? this.renderCash(directActiveRuleTabValue, '1')
                                                : this.renderCashSaveMoney(
                                                    directActiveRuleTabValue, '1'
                                                  ),
                                        ruleType: directActiveRuleTabValue,
                                        roleType: '1',
                                    })}
                                </TabPane>
                            );
                        })}
                </Tabs>

                {recommendRange > 0 && (
                    <div>
                        <p className={styles.coloredBorderedLabel}>
                            {this.props.intl.formatMessage(
                                STRING_SPE.d2c8d07mpk78251
                            )}
                            <span style={{ color: "#f04134" }}>
                                {helpMessageArray[1]}
                            </span>
                        </p>
                        <Tabs
                            hideAdd={true}
                            onChange={this.handleActiveRuleTabChange('indirect')}
                            activeKey={indirectActiveRuleTabValue}
                            type="editable-card"
                            onEdit={this.handleActiveRuleTabEdit}
                            className={recommentGiftStyle.tabs}
                        >
                            {activeRulesListArr &&
                                activeRulesListArr.map((v) => {
                                    switch (+indirectActiveRuleTabValue) {
                                        case 1:
                                            renderRecommentReward = this
                                                .renderRecommendGifts;
                                            break;
                                        case 2:
                                            renderRecommentReward = this
                                                .renderRechargeReward;
                                            break;
                                        case 3:
                                            renderRecommentReward = this
                                                .renderConsumptionReward;
                                            break;
                                        default:
                                            renderRecommentReward = this
                                                .renderRecommendGifts;
                                    }
                                    return (
                                        <TabPane
                                            closable={false}
                                            tab={v.label}
                                            key={v.value}
                                        >
                                            {indirectActiveRuleTabValue == 2 &&
                                                this.renderSaveMoneySetSelector()}
                                            {indirectActiveRuleTabValue == 1 ? (
                                                <div>
                                                    {this.renderCheckbox({
                                                        children: this.renderGivePoint('2',indirectActiveRuleTabValue),
                                                        key: "giveIntegral", // 赠送积分
                                                        label: "赠送积分",
                                                        ruleType: indirectActiveRuleTabValue,
                                                        roleType: '2'
                                                    })}
                                                    {this.renderCheckbox({
                                                        key: "giveCoupon",
                                                        label: "赠送优惠券",
                                                        ruleType: indirectActiveRuleTabValue,
                                                        roleType: '2',
                                                    })}
                                                </div>
                                            ) : null}
                                            {checkBoxStatus[`ruleType${indirectActiveRuleTabValue}`][`giveCoupon2`] && this.renderRecommendGifts(2, indirectActiveRuleTabValue)}
                                             { indirectActiveRuleTabValue > 1 && renderRecommentReward(indirectActiveRuleTabValue,'2', {
                                                marginLeft: "22px",
                                            })}
                                            {this.renderCheckbox({
                                                key: "giveCash",
                                                label: "现金红包",
                                                children:  indirectActiveRuleTabValue == 1
                                                ? this.renderCash(indirectActiveRuleTabValue,'2')
                                                : this.renderCashSaveMoney(
                                                    indirectActiveRuleTabValue,
                                                    '2'
                                                  ),
                                                  ruleType: indirectActiveRuleTabValue,
                                                  roleType: '2',
                                            })}
                                        </TabPane>
                                    );
                                })}
                        </Tabs>
                    </div>
                )}

                <p className={styles.coloredBorderedLabel}>
                    {this.props.intl.formatMessage(STRING_SPE.d1kge806b957926)}
                    <Tooltip
                        title={this.props.intl.formatMessage(
                            STRING_SPE.d56721718236081
                        )}
                    >
                        <Icon
                            style={{ fontWeight: "normal" }}
                            type="question-circle"
                        />
                    </Tooltip>
                </p>
                <div style={{ marginLeft: "44px" }}>
                    {this.renderCheckbox({
                        children: this.renderGivePoint('0','999'),
                        key: "giveIntegral", // 赠送积分
                        label: "赠送积分",
                        roleType: '0',
                        ruleType:  '999',
                    })}
                    {this.renderCheckbox({
                        key: "giveCoupon",
                        label: "赠送优惠券",
                        ruleType: '999',
                        roleType: '0',
                    })}
                    { checkBoxStatus[`ruleType999`] && checkBoxStatus[`ruleType999`][`giveCoupon0`]
                    && this.renderRecommendGifts(0,'999')}
                </div>
                {this.renderShareInfo2()}
            </div>
        );
    };
    renderAccumulateGiftsDetail() {
        const {
            giftGetRule,
            cleanCount,
            wakeupSendGiftsDataArray,
        } = this.state;
        const { isNew } = this.props;
        // console.log('wakeupSendGiftsDataArray---',wakeupSendGiftsDataArray)
        return (
            <div>
                <FormItem
                    label="礼品领取方式"
                    className={styles.FormItemStyle}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 17 }}
                >
                    <RadioGroup
                        onChange={this.handleGiftGetRuleChange}
                        value={giftGetRule}
                        disabled={!isNew}
                    >
                        <Radio key={"2"} value={2}>
                            集满全部点数领取
                        </Radio>
                        <Radio key={"3"} value={3}>
                            阶梯点数领取
                        </Radio>
                    </RadioGroup>
                </FormItem>
                {giftGetRule === 3 && (
                    <FormItem
                        label="阶梯礼品兑换后"
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <RadioGroup
                            onChange={this.handleCleanCountChange}
                            value={cleanCount}
                            disabled={!isNew}
                        >
                            <Radio value={1}>扣减所用点数</Radio>
                            <Radio value={0}>不扣减所用点数</Radio>
                        </RadioGroup>
                    </FormItem>
                )}
                {giftGetRule === 2 ? (
                    <Row>
                        <Col span={17} offset={4}>
                            <AddGifts
                                disabledGifts={!isNew}
                                key={wakeupSendGiftsDataArray[0].key}
                                maxCount={10}
                                type={this.props.type}
                                isNew={this.props.isNew}
                                value={wakeupSendGiftsDataArray[0].gifts}
                                onChange={(giftArr) =>
                                    this.handleWakeupIntervalGiftsChange(
                                        giftArr,
                                        0
                                    )
                                }
                                zhifubaoCoupons={true}
                            />
                        </Col>
                    </Row>
                ) : (
                    this.renderMultipleLevelGiftsDetail()
                )}
            </div>
        );
    }
    getMultipleLevelValueLimit = () => {
        const { type, specialPromotion } = this.props;
        if (type == "75") {
            return specialPromotion.getIn(["$eventInfo", "needCount"]);
        }
    };
    renderMultipleLevelGiftsDetail() {
        const { wakeupSendGiftsDataArray } = this.state;
        const {
            form: { getFieldDecorator },
            isNew,
            type,
        } = this.props;
        const disabledGifts = type == 75 && !isNew;
        const multiConfig = this.getMultipleLevelConfig();
        const userCount = this.props.specialPromotion.getIn([
            "$eventInfo",
            "userCount",
        ]);
        return (
            <div>
                {wakeupSendGiftsDataArray.map(
                    ({ intervalDays, gifts, key }, index, arr) => (
                        <div key={`${key}`}>
                            <Row key={`${key}`}>
                                <Col span={4}>
                                    <div className={selfStyle.fakeLabel}>
                                        {SALE_LABEL.k6d8n0y8}
                                        {`${index + 1}`}
                                    </div>
                                </Col>
                                <Col style={{ position: "relative" }} span={17}>
                                    <div className={selfStyle.grayHeader}>
                                        {multiConfig.levelLabel}&nbsp;
                                        <FormItem>
                                            {getFieldDecorator(
                                                `intervalDays${key}`,
                                                {
                                                    onChange: ({
                                                        number: val,
                                                    }) =>
                                                        this.handleIntervalDaysChange(
                                                            val,
                                                            index
                                                        ),
                                                    initialValue: {
                                                        number: intervalDays,
                                                    },
                                                    rules: [
                                                        {
                                                            validator: (
                                                                rule,
                                                                v,
                                                                cb
                                                            ) => {
                                                                if (
                                                                    !v ||
                                                                    !(
                                                                        v.number >
                                                                        0
                                                                    )
                                                                ) {
                                                                    return cb(
                                                                        "必须大于0"
                                                                    );
                                                                }
                                                                const limit = this.getMultipleLevelValueLimit();
                                                                if (
                                                                    limit &&
                                                                    !(
                                                                        v.number <=
                                                                        limit
                                                                    )
                                                                ) {
                                                                    return cb(
                                                                        `不能大于${limit}`
                                                                    );
                                                                }
                                                                if (
                                                                    limit &&
                                                                    index ===
                                                                        arr.length -
                                                                            1 &&
                                                                    v.number !=
                                                                        limit
                                                                ) {
                                                                    // 最后一档必须填满限制
                                                                    return cb(
                                                                        `最后一档必须等于${limit}`
                                                                    );
                                                                }
                                                                for (
                                                                    let i = 0;
                                                                    i < index;
                                                                    i++
                                                                ) {
                                                                    const days =
                                                                        arr[i]
                                                                            .intervalDays;
                                                                    if (
                                                                        days > 0
                                                                    ) {
                                                                        // 档位设置不可以重叠
                                                                        if (
                                                                            v.number <=
                                                                            +days
                                                                        ) {
                                                                            return cb(
                                                                                "档位数值需大于上一档位"
                                                                            );
                                                                        }
                                                                    }
                                                                }
                                                                cb();
                                                            },
                                                        },
                                                    ],
                                                }
                                            )(
                                                <PriceInput
                                                    disabled={
                                                        userCount > 0 ||
                                                        disabledGifts
                                                    }
                                                    maxNum={5}
                                                    modal="int"
                                                />
                                            )}
                                        </FormItem>
                                        {multiConfig.levelAffix}
                                    </div>
                                    {userCount > 0 || disabledGifts ? null : (
                                        <div
                                            style={{
                                                position: "absolute",
                                                width: 65,
                                                top: 10,
                                                right: -70,
                                            }}
                                        >
                                            {index === arr.length - 1 &&
                                                arr.length < 10 && (
                                                    <Icon
                                                        onClick={
                                                            this.addInterval
                                                        }
                                                        style={{
                                                            marginRight: 5,
                                                        }}
                                                        className={
                                                            styles.plusIcon
                                                        }
                                                        type="plus-circle-o"
                                                    />
                                                )}
                                            {arr.length > 1 && (
                                                <Popconfirm
                                                    title={this.props.intl.formatMessage(
                                                        STRING_SPE.dd5a6d317718137
                                                    )}
                                                    onConfirm={() =>
                                                        this.removeInterval(
                                                            index
                                                        )
                                                    }
                                                >
                                                    <Icon
                                                        style={{
                                                            marginRight: 5,
                                                        }}
                                                        className={
                                                            styles.deleteIcon
                                                        }
                                                        type="minus-circle-o"
                                                    />
                                                </Popconfirm>
                                            )}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={17} offset={4}>
                                    <AddGifts
                                        disabledGifts={disabledGifts}
                                        key={`${key}`}
                                        isAttached={true}
                                        maxCount={10}
                                        type={this.props.type}
                                        isNew={this.props.isNew}
                                        value={gifts}
                                        onChange={(giftArr) =>
                                            this.handleWakeupIntervalGiftsChange(
                                                giftArr,
                                                index
                                            )
                                        }
                                        zhifubaoCoupons={
                                            type == 75 ? true : false
                                        }
                                    />
                                </Col>
                            </Row>
                        </div>
                    )
                )}
            </div>
        );
    }
    onCheckPoint = ({ target }) => {
        const { checked } = target;
        this.setState({ givePoints: checked });
    };
    onCheckCoupon = ({ target }) => {
        const { checked } = target;
        this.setState({ giveCoupon: checked });
    };
    onGivePointsValueChange = ({ target }) => {
        const { value } = target;
        this.setState({ presentValue: value });
    };
    renderNewCardGive() {
        const priceReg = /^(([1-9]\d{0,5})(\.\d{0,2})?|0.\d?[1-9]{1})$/;
        const { givePoints, presentValue, giveCoupon } = this.state;
        const preErr = !priceReg.test(presentValue) ? "error" : "success";
        const preErrText = !priceReg.test(presentValue)
            ? "请输入1~1000000数字，支持两位小数"
            : "";
        const userCount = this.props.specialPromotion.getIn([
            "$eventInfo",
            "userCount",
        ]);
        return (
            <div>
                <FormItem
                    style={{ padding: "0px 40px" }}
                    wrapperCol={{ span: 24 }}
                    className={""}
                    validateStatus={""}
                    help={""}
                >
                    <Checkbox checked={givePoints} onChange={this.onCheckPoint}>
                        赠送积分
                    </Checkbox>
                </FormItem>
                {givePoints && (
                    <div className={selfStyle.pointBox}>
                        <p
                            className={userCount > 0 ? styles.opacitySet : ""}
                        ></p>
                        <div className={selfStyle.title}>
                            <span>赠送积分</span>
                        </div>
                        <FormItem
                            wrapperCol={{ span: 24 }}
                            className={""}
                            validateStatus={preErr}
                            help={preErrText}
                        >
                            <Input
                                addonAfter={"积分"}
                                value={presentValue}
                                onChange={this.onGivePointsValueChange}
                            />
                        </FormItem>
                    </div>
                )}
                <FormItem
                    style={{ padding: "0px 40px" }}
                    wrapperCol={{ span: 24 }}
                    className={""}
                    validateStatus={""}
                    help={""}
                >
                    <Checkbox
                        checked={giveCoupon}
                        onChange={this.onCheckCoupon}
                    >
                        赠送优惠券
                    </Checkbox>
                </FormItem>
            </div>
        );
    }
    onTypeChange = ({ target }) => {
        this.setState({ sendTypeValue: target.value });
    }
    onBagChange = (item) => {
        if(item) {
            this.setState({ bag: [item]});
            return;
        }
        this.setState({ bag: null});
    }
    // type 30
    renderPointDuihuan(){
        const { bag, sendTypeValue } = this.state;
        const { user, type, disabled } = this.props;
        const {groupID} = user.accountInfo;
        const css = disabled?styles.disabledModal:'';
        return(
            <div style={{position: 'relative'}}>
                <Row>
                    <Col span={20} offset={2} style={{margin: '10px'}}>
                        <span style={{margin: '0px 8px'}}>赠送优惠券</span>
                        <RadioGroup onChange={this.onTypeChange} value={sendTypeValue} >
                            <Radio value={'0'}>独立优惠券</Radio>
                            <Radio value={'1'}>券包</Radio>
                        </RadioGroup>
                    </Col>
                </Row>
                {sendTypeValue === '1' ?
                <Row>
                    <Col span={20} offset={3}>
                        <TicketBag groupID={groupID} bag={bag} onChange={this.onBagChange} />
                    </Col>
                </Row>:
                <Row>
                    <Col span={17} offset={4}>
                        <AddGifts
                            maxCount={type == '21' || type == '30' ? 1 : 10}
                            disabledGifts={type == '67' && this.state.disabledGifts}
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
                </Row>}
                <div className={css}></div>
            </div>
        )
    }
    render() {
        const { giveCoupon } = this.state;
        const { type } = this.props;
        if (type == "68") {
            // 推荐有礼的render与其它活动相差较大
            // return <Three _this={this}/>;
            return this.renderRecommendGiftsDetail()
        }
        if (type == "63") {
            // 唤醒送礼，多个天数档位设置需要去重
            return this.renderMultipleLevelGiftsDetail();
        }
        if (type == "75") {
            // 集点卡 礼品逻辑
            return this.renderAccumulateGiftsDetail();
        }
        const userCount = this.props.specialPromotion.getIn([
            "$eventInfo",
            "userCount",
        ]);

        return (
            <div>
                {type == "67" && this.renderInstantDiscountForm()}
                {type == "65" && (
                    <p className={styles.coloredBorderedLabel}>
                        {this.props.intl.formatMessage(
                            STRING_SPE.dk469ad5m988265
                        )}
                        ：
                    </p>
                )}
                {type == "66" && (
                    <FormItem
                        label={this.props.intl.formatMessage(
                            STRING_SPE.d1700e50510284270
                        )}
                        className={styles.FormItemStyle}
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 17 }}
                    >
                        <RadioGroup
                            onChange={this.handleGiftGetRuleChange}
                            value={this.state.giftGetRule}
                            disabled={userCount > 0}
                        >
                            <Radio key={"0"} value={0}>
                                {this.props.intl.formatMessage(
                                    STRING_SPE.d1qe50ueoq85139
                                )}
                            </Radio>
                            <Radio key={"1"} value={1}>
                                {this.props.intl.formatMessage(
                                    STRING_SPE.dd5a6d3177186273
                                )}
                            </Radio>
                        </RadioGroup>
                    </FormItem>
                )}
                {type === "52" && this.renderNewCardGive()}
                {type === "52" && giveCoupon && (
                    <Row>
                        <Col span={17} offset={4}>
                            <AddGifts
                                maxCount={type == "21" || type == "30" ? 1 : 10}
                                disabledGifts={
                                    type == "67" && this.state.disabledGifts
                                }
                                type={this.props.type}
                                isNew={this.props.isNew}
                                value={this.state.data
                                    .filter((gift) => gift.sendType === 0)
                                    .sort((a, b) => a.needCount - b.needCount)}
                                onChange={(gifts) => this.gradeChange(gifts, 0)}
                            />
                        </Col>
                    </Row>
                )}
                {type==='30' &&
                    this.renderPointDuihuan()
                }
                {
                    type === '60' && renderThree.call(this)
                }
                {
                    type === '61' && renderUpGradeThree.call(this)
                }
                { !['52', '30', '60','61'].includes(type) &&
                <Row>
                    <Col span={17} offset={4}>
                        <AddGifts
                            maxCount={type == '21' || type == '30' ? 1 : 10}
                            disabledGifts={type == '67' && this.state.disabledGifts}
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
                </Row>}
                {type == "65" && (
                    <p className={styles.coloredBorderedLabel}>
                        {this.props.intl.formatMessage(
                            STRING_SPE.dk469ad5m987288
                        )}
                    </p>
                )}
                {type == "65" && (
                    <Row>
                        <Col span={17} offset={4}>
                            <AddGifts
                                maxCount={10}
                                typeValue={1}
                                type={type}
                                isNew={this.props.isNew}
                                value={this.state.data.filter(
                                    (gift) => gift.sendType === 1
                                )}
                                onChange={(gifts) => this.gradeChange(gifts, 1)}
                            />
                        </Col>
                    </Row>
                )}
                {["21", "66", "65"].includes(type) && this.renderShareInfo2()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        promotionDetailInfo: state.sale_promotionDetailInfo_NEW,
        promotionScopeInfo: state.sale_promotionScopeInfo_NEW,
        specialPromotion: state.sale_specialPromotion_NEW,
        user: state.user.toJS(),
        allWeChatAccountList: state.sale_giftInfoNew.get('mpList'),
        groupCardTypeList: state.sale_mySpecialActivities_NEW
            .getIn(['$specialDetailInfo', 'data', 'cardInfo', 'data', 'groupCardTypeList']),
        saveMoneySetList: state.sale_mySpecialActivities_NEW.get('$saveMoneySetList'),
        disabled: state.sale_specialPromotion_NEW.getIn(['$eventInfo', 'userCount']) > 0,
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
        setSpecialRecommendSettings: (opts) => {
            dispatch(saleCenterSetSpecialRecommendSettingsInfoAC(opts));
        },
        fetchGiftListInfo: (opts) => {
            dispatch(fetchGiftListInfoAC(opts));
        },
        fetchSpecialCardLevel: (opts) => {
            dispatch(fetchSpecialCardLevel(opts));
        },
        queryAllSaveMoneySet: () => {
            dispatch(queryAllSaveMoneySet());
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form.create()(SpecialDetailInfo));
