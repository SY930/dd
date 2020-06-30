/**
 * 完善资料送礼第三步操作
 */

import React from "react";
import { Row, Col, Form, Checkbox } from "antd";
import AddGifts from "../common/AddGifts";
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import styles from "../../SaleCenterNEW/ActivityPage.less";

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

const renderCheckbox = function ({ key, children, label }) {
    if (!key) return null;
    const { perfectReturnGiftCheckBoxStatus } = this.state;
    const checked = perfectReturnGiftCheckBoxStatus[key];

    return (
        <div style={{ display: "flex" }}>
            <div style={{ paddingTop: "12px" }}>
                <Checkbox
                    checked={checked}
                    onChange={handleChangeBox.call(this, { key })}
                />
                <span style={{ padding: 0 }}>{label}</span>
            </div>
            {checked && children}
        </div>
    );
};

const renderGivePointFn = function () {
    const {
        perfectReturnGiftCheckBoxStatus,
        perfectReturnGiftPoint,
    } = this.state;
    const {
        form: { getFieldDecorator },
    } = this.props;
    return (
        <FormItem
            wrapperCol={{ span: 24 }}
            className={styles.FormItemSecondStyle}
            style={{ width: "230px", marginLeft: "16px" }}
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
                            if (!v || v.number < 0.01) {
                                return cb("积分应不小于0.01");
                            } else if (v.number > 1000000) {
                                return cb("积分应不大于1000000");
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
    );
};

export const renderThree = function () {
    const { perfectReturnGiftCheckBoxStatus, data } = this.state;
    console.log("data", data);
    return (
        <div style={{ marginLeft: "40px" }}>
            {renderCheckbox.call(this, {
                label: "赠送积分",
                key: "perfectReturnGiftPoint",
                children: renderGivePointFn.call(this),
            })}
            {renderCheckbox.call(this, {
                label: "赠送优惠券",
                key: "perfectReturnGiftCoupon",
            })}
            {perfectReturnGiftCheckBoxStatus.perfectReturnGiftCoupon && (
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

export const addPointData = function (giftInfo) {
    const { perfectReturnGiftCheckBoxStatus } = this.state;
    const {
        perfectReturnGiftPoint,
        perfectReturnGiftCoupon,
    } = perfectReturnGiftCheckBoxStatus;
    let presentValue = "";
    this.props.form.validateFieldsAndScroll(
        { force: true },
        (error, basicValues) => {
            const { perfectReturnGiftPoint } = basicValues;
            presentValue = perfectReturnGiftPoint.number;
        }
    );
    if (perfectReturnGiftPoint) {
        giftInfo.push({
            presentValue,
            presentType: 2,
            giftCount: 1,
            giftName: `${presentValue}积分`,
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
    this.setState({
        perfectReturnGiftCheckBoxStatus,
        perfectReturnGiftPoint: pointItem && pointItem.presentValue,
    });
};

export default {
    renderThree,
    addPointData,
    initPerfectCheckBox,
};
