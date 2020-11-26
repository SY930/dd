/**
 * 推荐有礼第三步的逻辑由SpecialPromotionDetailInfo.jsx转移到这里，
 * 那文件几千行代码，太难维护了
 * TODO：逐步迁移
 */
import React from 'react'
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
// import selfStyle from "./addGifts.less";
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
// import PhotoFrame from "./PhotoFrame";
import { activeRulesList } from "./constant";
import recommentGiftStyle from "./recommentGift.less";
import { getDefaultGiftData } from '../common/SpecialPromotionDetailInfo'

const moment = require("moment");
const FormItem = Form.Item;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const { TabPane } = Tabs;


export default class StepThree extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            activeRuleTabValue: "",
        }
    }
    handleActiveRuleTabChange = (e) => {
        this.setState({
            activeRuleTabValue: e,
        });
    };
    // renderPointControl = (recommendType, index) => {
    //     const {
    //         form: { getFieldDecorator },
    //     } = _this.props;
    //     // 多个公用，使用父级的公用值
    //     const { eventRecommendSettings } = _this.state;
    //     return (
    //         <Row gutter={6}>
    //             <Col span={11} >
    //                 <FormItem
    //                     label={_this.props.intl.formatMessage(
    //                         STRING_SPE.d31ejg5ddi853253
    //                     )}
    //                     className={styles.FormItemStyle}
    //                     labelCol={{ span: 8 }}
    //                     wrapperCol={{ span: 16 }}
    //                 >
    //                     {getFieldDecorator(`point${recommendType}`, {
    //                         onChange: _this.handleRecommendSettingsChange(
    //                             index,
    //                             "pointRate"
    //                         ),
    //                         initialValue: {
    //                             number: eventRecommendSettings[index].pointRate,
    //                         },
    //                         rules: [
    //                             {
    //                                 validator: (rule, v, cb) => {
    //                                     if (
    //                                         v.number === "" ||
    //                                         v.number === undefined
    //                                     ) {
    //                                         return cb();
    //                                     }
    //                                     if (!v || !(v.number > 0)) {
    //                                         return cb(
    //                                             `${this.props.intl.formatMessage(
    //                                                 STRING_SPE.d16hg8i3la85466
    //                                             )}`
    //                                         );
    //                                     } else if (v.number > 100) {
    //                                         return cb(
    //                                             `${this.props.intl.formatMessage(
    //                                                 STRING_SPE.d1e0750k8155219
    //                                             )}`
    //                                         );
    //                                     }
    //                                     cb();
    //                                 },
    //                             },
    //                         ],
    //                     })(
    //                         <PriceInput
    //                             addonAfter="%"
    //                             maxNum={3}
    //                             modal="float"
    //                             placeholder="请输入数值"
    //                         />
    //                     )}
    //                 </FormItem>
    //             </Col>
    //             <Col span={11}>
    //                 <FormItem
    //                     label={"单笔上限"}
    //                     className={styles.FormItemStyle}
    //                     labelCol={{ span: 8 }}
    //                     wrapperCol={{ span: 16 }}
    //                 >
    //                     {getFieldDecorator(`pointLimitValue${recommendType}`, {
    //                         onChange: this.handleRecommendSettingsChange(
    //                             index,
    //                             "pointLimitValue"
    //                         ),
    //                         initialValue: {
    //                             number:
    //                                 eventRecommendSettings[index]
    //                                     .pointLimitValue,
    //                         },
    //                         rules: [],
    //                     })(
    //                         <PriceInput
    //                             addonAfter={this.props.intl.formatMessage(
    //                                 STRING_SPE.db60b58ca13657133
    //                             )}
    //                             placeholder={this.props.intl.formatMessage(
    //                                 STRING_SPE.d5g37mj8lm5884
    //                             )}
    //                             maxNum={6}
    //                             modal="float"
    //                         />
    //                     )}
    //                 </FormItem>
    //             </Col>
    //         </Row>
    //     );
    // };
    renderRecommendGifts = (recommendType) => {
        // 推荐有礼独有
        let filteredGifts = _this.state.data.filter(
            (gift) => gift.recommendType === recommendType
        );
        if (!filteredGifts.length) {
            filteredGifts = [
                getDefaultGiftData(recommendType, "recommendType"),
            ];
        }
        return (
            <Row>
                <Col span={17} offset={4}>
                    <AddGifts
                        maxCount={10}
                        typeValue={recommendType}
                        typePropertyName={"recommendType"}
                        type={_this.props.type}
                        isNew={_this.props.isNew}
                        value={filteredGifts}
                        onChange={(gifts) =>
                            _this.gradeChange(gifts, recommendType)
                        }
                    />
                </Col>
            </Row>
        );
    };
    render () {
        console.log('this',this.props._this)

        const recommendRange = _this.props.specialPromotion.getIn([
            "$eventInfo",
            "recommendRange",
        ]);
        let recommendRule = _this.props.specialPromotion.getIn([
            "$eventInfo",
            "recommendRule",
        ]);
        let { helpMessageArray } = _this.state;
        let { activeRuleTabValue } = this.state
        let activeRulesListArr = null;
        console.log("recommendRule", recommendRule);
        if (recommendRule) {
            recommendRule = recommendRule.toJS();
            activeRulesListArr = activeRulesList.filter((v) =>
                recommendRule.includes(v.value)
            );
        }
        activeRuleTabValue =
            activeRuleTabValue ||
            (activeRulesListArr && activeRulesListArr[0].value);
        let renderRecommentReward;
        console.log("activeRuleTabValue---", activeRuleTabValue);

        console.log("activeRulesListArr", activeRulesListArr);
        return (
            <div className={recommentGiftStyle.recommentGiftStep3Wrap}>
                <p className={styles.coloredBorderedLabel}>
                    {_this.props.intl.formatMessage(STRING_SPE.d1kge806b957782)}
                    <span style={{ color: "#f04134" }}>
                        {helpMessageArray[0]}
                    </span>
                </p>

                <Tabs
                    hideAdd={true}
                    onChange={this.handleActiveRuleTabChange}
                    activeKey={activeRuleTabValue}
                    type="editable-card"
                    className={recommentGiftStyle.tabs}
                >
                    {activeRulesListArr &&
                        activeRulesListArr.map((v) => {
                            switch (+activeRuleTabValue) {
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
                                    {activeRuleTabValue == 2 &&
                                        this.renderSaveMoneySetSelector()}
                                    {activeRuleTabValue == 1 ? (
                                        <div>
                                            {this.renderCheckbox({
                                                children: this.renderGivePoint(),
                                                key: "point", // 赠送积分
                                                label: "赠送积分",
                                            })}
                                            {this.renderCheckbox({
                                                key: "",
                                                label: "赠送优惠券",
                                            })}
                                        </div>
                                    ) : null}
                                    {renderRecommentReward(1, {
                                        marginLeft: "22px",
                                    })}
                                    {this.renderCheckbox({
                                        key: "",
                                        label: "现金红包",
                                        children:
                                            activeRuleTabValue == 1
                                                ? this.renderCash()
                                                : this.renderCashSaveMoney(
                                                      activeRuleTabValue
                                                  ),
                                    })}
                                </TabPane>
                            );
                        })}
                </Tabs>
{/*
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
                            onChange={this.handleActiveRuleTabChange}
                            activeKey={activeRuleTabValue}
                            type="editable-card"
                            onEdit={this.handleActiveRuleTabEdit}
                            className={recommentGiftStyle.tabs}
                        >
                            {activeRulesListArr &&
                                activeRulesListArr.map((v) => {
                                    switch (+activeRuleTabValue) {
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
                                            {activeRuleTabValue == 2 &&
                                                this.renderSaveMoneySetSelector()}
                                            {activeRuleTabValue == 1 ? (
                                                <div>
                                                    {this.renderCheckbox({
                                                        children: this.renderGivePoint(),
                                                        key: "point", // 赠送积分
                                                        label: "赠送积分",
                                                    })}
                                                    {this.renderCheckbox({
                                                        key: "",
                                                        label: "赠送优惠券",
                                                    })}
                                                </div>
                                            ) : null}
                                            {renderRecommentReward(2, {
                                                marginLeft: "22px",
                                            })}
                                            {this.renderCheckbox({
                                                key: "",
                                                label: "现金红包",
                                                children:  activeRuleTabValue == 1
                                                ? this.renderCash()
                                                : this.renderCashSaveMoney(
                                                      activeRuleTabValue
                                                  ),
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
                        children: this.renderGivePoint(),
                        key: "point", // 赠送积分
                        label: "赠送积分",
                    })}
                    {this.renderCheckbox({
                        key: "",
                        label: "赠送优惠券",
                    })}
                    {this.renderRecommendGifts(0, {
                        marginLeft: "22px",
                    })}
                </div>
                {this.renderShareInfo2()} */}
            </div>
        );
    }
}
