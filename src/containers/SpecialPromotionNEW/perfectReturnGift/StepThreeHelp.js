/**
 * 完善资料送礼第三步操作
 */

import React from "react";
import { Row, Col, Form, Checkbox, Select, Tooltip, Icon } from "antd";
import AddGifts from "../common/AddGifts";
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import styles from "../../SaleCenterNEW/ActivityPage.less";
import { axiosData } from "../../../helpers/util";

const Option = Select.Option;
const FormItem = Form.Item;

const handleChangeBox = function ({ key }) {
    return (e) => {
        const { perfectReturnGiftCheckBoxStatus } = this.state;
        perfectReturnGiftCheckBoxStatus[key] = e.target.checked;
        this.setState({
            perfectReturnGiftCheckBoxStatus,
        });
    };
};

const handleCardChange = function (e) {
    this.setState({
        perfectReturnGiftCardTypeValue: e,
    });
};
/**
 * 封装checkbox
 *
 * @param {*} { key, children, label }
 * @returns
 */
const renderCheckbox = function ({ key, children, label }) {
    if (!key) return null;
    const { perfectReturnGiftCheckBoxStatus } = this.state;
    const checked = perfectReturnGiftCheckBoxStatus[key];
    const giftSendCount =
        this.perfectPointItem && this.perfectPointItem.giftSendCount;

    return (
        <div style={{ display: "flex" }}>
            <div style={{ paddingTop: "12px" }}>
                <Checkbox
                    checked={checked}
                    onChange={handleChangeBox.call(this, { key })}
                    disabled={giftSendCount > 0}
                />
                <span style={{ padding: 0 }}>{label}</span>
            </div>
            {checked && children}
        </div>
    );
};
/**
 * 获取充值会员卡列表
 *
 * @param {*} opts
 */
const fetchCardType = function (opts) {
    axiosData(
        "/crm/cardTypeLevelService_queryCardTypeBaseInfoList.ajax",
        { ...opts, isNeedWechatCardTypeInfo: true },
        null,
        { path: "data.cardTypeBaseInfoList" }
    ).then((records) => {
        const { perfectReturnGiftCardTypeValue } = this.state;
        if (
            Array.isArray(records) &&
            records[0] &&
            !perfectReturnGiftCardTypeValue
        ) {
            this.setState({
                perfectReturnGiftCardTypeValue: records[0].cardTypeID,
            });
        }
        this.setState({
            cardTypeArr: records || [],
        });
    });
};

/**
 * 赠送积分
 *
 * @returns
 */
const renderGivePointFn = function () {
    const {
        perfectReturnGiftCheckBoxStatus,
        perfectReturnGiftPoint,
        perfectReturnGiftCardTypeValue,
        cardTypeArr,
    } = this.state;
    const {
        form: { getFieldDecorator },
    } = this.props;
    const giftSendCount =
        this.perfectPointItem && this.perfectPointItem.giftSendCount;
    return (
        <div>
            <FormItem
                wrapperCol={{ span: 12 }}
                labelCol={{ span: 6 }}
                className={styles.FormItemSecondStyle}
                // style={{ width: "330px" }}
                label="赠送积分"
                required
            >
                {getFieldDecorator(`perfectReturnGiftPoint`, {
                    initialValue: {
                        number: perfectReturnGiftPoint,
                    },
                    rules: [
                        {
                            validator: (rule, v, cb) => {
                                if (v.number === "" || v.number === undefined) {
                                    return cb(
                                        perfectReturnGiftCheckBoxStatus.perfectReturnGiftPoint
                                            ? "请输入数值"
                                            : undefined
                                    );
                                }
                                if (!v || v.number < 1) {
                                    return cb("积分应不小于1");
                                } else if (v.number > 100000) {
                                    return cb("积分应不大于100000");
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
                )}
            </FormItem>
            <div >
            <FormItem
                wrapperCol={{ span: 12 }}
                labelCol={{ span: 6 }}
                className={styles.FormItemSecondStyle}
                label={(
                    <span>
                      充值到会员卡&nbsp;
                      <Tooltip title="如果用户没有该卡类型的卡，则不送积分">
                        <Icon style={{ marginLeft: 5, marginRight: -5}} type="question-circle" />
                      </Tooltip>
                    </span>
                  )}
            >
                
                    <Select
                        showSearch={true}
                        value={perfectReturnGiftCardTypeValue}
                        onChange={handleCardChange.bind(this)}
                        disabled={giftSendCount > 0}
                    >
                        {cardTypeArr.map((item) => {
                            return (
                                <Option
                                    key={item.cardTypeID}
                                    value={item.cardTypeID}
                                >
                                    {item.cardTypeName}
                                </Option>
                            );
                        })}
                    </Select>
                    
                
            </FormItem>
            <Tooltip title={
                        <p>
                            如果所点菜品在优惠菜品范围内，且所点菜品价格小于等于设置的特价金额，则该菜品不占用优惠菜品份数
                        </p>
                    }>
                <Icon style={{ marginLeft: 5, marginRight: -5,float:'left'}} type="question-circle" />
            </Tooltip>
            </div>
        </div>
    );
};

/**
 * 第三步渲染render函数
 *
 * @returns
 */
export const renderThree = function () {
    const { perfectReturnGiftCheckBoxStatus, data } = this.state;
    const {
        perfectReturnGiftPoint,
        perfectReturnGiftCoupon,
    } = perfectReturnGiftCheckBoxStatus;
    return (
        <div style={{ marginLeft: "40px" }}>
            {renderCheckbox.call(this, {
                label: "赠送积分",
                key: "perfectReturnGiftPoint",
            })}
            {perfectReturnGiftPoint && renderGivePointFn.call(this)}
            {renderCheckbox.call(this, {
                label: "赠送优惠券",
                key: "perfectReturnGiftCoupon",
            })}
            {perfectReturnGiftCoupon && (
                <Row>
                    <Col span={17} offset={1}>
                        <AddGifts
                            maxCount={10}
                            type={this.props.type}
                            isNew={this.props.isNew}
                            value={data
                                .filter((gift) => gift.sendType === 0)
                                .sort((a, b) => a.needCount - b.needCount)}
                            onChange={(gifts) => this.gradeChange(gifts, 0)}
                        />
                    </Col>
                </Row>
            )}
        </div>
    );
};

/**
 * 保存的时候添加积分数据
 *
 * @param {*} giftInfo
 * @returns
 */
export const addPointData = function (giftInfo) {
    const {
        perfectReturnGiftCheckBoxStatus,
        perfectReturnGiftCardTypeValue,
    } = this.state;
    const {
        perfectReturnGiftPoint,
        perfectReturnGiftCoupon,
    } = perfectReturnGiftCheckBoxStatus;
    let presentValue = "";
    this.props.form.validateFieldsAndScroll(
        { force: true },
        (error, basicValues) => {
            const { perfectReturnGiftPoint } = basicValues;
            presentValue =
                perfectReturnGiftPoint && perfectReturnGiftPoint.number;
        }
    );
    if (perfectReturnGiftPoint) {
        giftInfo.push({
            presentValue,
            presentType: 2,
            giftCount: 1,
            giftName: `${presentValue}积分`,
            cardTypeID: perfectReturnGiftCardTypeValue,
            itemID: !this.props.isNew ? this.perfectPointItem.itemID : "",
        });
    } else {
        giftInfo = giftInfo.filter((v) => v.presentType !== 2);
    }

    if (!perfectReturnGiftCoupon) {
        giftInfo = giftInfo.filter((v) => v.presentType && v.presentType !== 1);
    } else {
        giftInfo.forEach((v) => {
            if (!v.presentType) {
                v.presentType = 1;
            }
        });
    }
    return giftInfo;
};

/**
 * 初始化选中数据
 *
 */
export const initPerfectCheckBox = function () {
    const giftInfo = this.props.specialPromotion.get("$giftInfo").toJS();
    const { perfectReturnGiftCheckBoxStatus } = this.state;
    const pointItem = giftInfo.find((v) => v.presentType === 2);
    const couponItem = giftInfo.find((v) => v.presentType === 1);
    perfectReturnGiftCheckBoxStatus.perfectReturnGiftPoint = pointItem;
    perfectReturnGiftCheckBoxStatus.perfectReturnGiftCoupon = couponItem;
    if (!pointItem && !couponItem) {
        perfectReturnGiftCheckBoxStatus.perfectReturnGiftCoupon = true;
    }
    this.perfectPointItem = pointItem || {};
    this.setState({
        perfectReturnGiftCheckBoxStatus,
        perfectReturnGiftPoint: pointItem && pointItem.presentValue,
        perfectReturnGiftCardTypeValue: pointItem && pointItem.cardTypeID,
    });
    fetchCardType.call(this, {});
};

export default {
    renderThree,
    addPointData,
    initPerfectCheckBox,
};
