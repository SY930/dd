/**
 * 升级送礼第三步操作
 */

import React from "react";
import { Row, Col, Form, Checkbox } from "antd";
import AddGifts from "../common/AddGifts";
import PriceInput from "../../SaleCenterNEW/common/PriceInput";
import styles from "../../SaleCenterNEW/ActivityPage.less";

const FormItem = Form.Item;

const handleChangeBox = function ({ key }) {
    return (e) => {
        const { upGradeReturnGiftCheckBoxStatus } = this.state;
        upGradeReturnGiftCheckBoxStatus[key] = e.target.checked;
        this.setState({
            upGradeReturnGiftCheckBoxStatus,
        });
    };
};

/**
 * 封装checkbox
 *
 * @param {*} { key, children, label }
 * @returns
 */
const renderCheckbox = function ({ key, children, label }) {
    if (!key) return null;
    const { upGradeReturnGiftCheckBoxStatus } = this.state;
    const checked = upGradeReturnGiftCheckBoxStatus[key];
    const giftSendCount =
        this.upGradePointItem && this.upGradePointItem.giftSendCount;
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
 * 赠送积分
 *
 * @returns
 */
const renderGivePointFn = function () {
    const {
        upGradeReturnGiftCheckBoxStatus,
        upGradeReturnGiftPoint,
    } = this.state;
    const {
        form: { getFieldDecorator },
    } = this.props;

    return (
        <FormItem
            wrapperCol={{ span: 16 }}
            labelCol={{ span: 8 }}
            className={styles.FormItemSecondStyle}
            style={{ width: "330px" }}
            label="赠送积分"
            required
        >
            {getFieldDecorator(`upGradeReturnGiftPoint`, {
                initialValue: {
                    number: upGradeReturnGiftPoint,
                },
                rules: [
                    {
                        validator: (rule, v, cb) => {
                            if (v.number === "" || v.number === undefined) {
                                return cb(
                                    upGradeReturnGiftCheckBoxStatus.upGradeReturnGiftPoint
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
                    addonAfter={"积分"}
                    modal="float"
                    maxNum={7}
                    placeholder="请输入数值"
                />
            )}
        </FormItem>
    );
};

/**
 * 第三步渲染render函数
 *
 * @returns
 */
export const renderUpGradeThree = function () {
    const { upGradeReturnGiftCheckBoxStatus, data } = this.state;
    const {
        upGradeReturnGiftPoint,
        upGradeReturnGiftCoupon,
    } = upGradeReturnGiftCheckBoxStatus;

    return (
        <div style={{ marginLeft: "40px" }}>
            {renderCheckbox.call(this, {
                label: "赠送积分",
                key: "upGradeReturnGiftPoint",
            })}
            {upGradeReturnGiftPoint && renderGivePointFn.call(this)}
            {renderCheckbox.call(this, {
                label: "赠送优惠券",
                key: "upGradeReturnGiftCoupon",
            })}
            {upGradeReturnGiftCoupon && (
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
export const upGradeAddPointData = function (giftInfo) {
    const {
        upGradeReturnGiftCheckBoxStatus,
        upGradeCardTypeValue,
    } = this.state;
    const {
        upGradeReturnGiftPoint,
        upGradeReturnGiftCoupon,
    } = upGradeReturnGiftCheckBoxStatus;
    let presentValue = "";
    this.props.form.validateFieldsAndScroll(
        { force: true },
        (error, basicValues) => {
            const { upGradeReturnGiftPoint } = basicValues;
            presentValue =
                upGradeReturnGiftPoint && upGradeReturnGiftPoint.number;
        }
    );

    if (upGradeReturnGiftPoint) {
        giftInfo.push({
            presentValue,
            presentType: 2,
            giftCount: 1,
            giftName: `${presentValue}积分`,
            itemID: !this.props.isNew ? this.upGradePointItem.itemID : "",
        });
    } else {
        giftInfo = giftInfo.filter((v) => v.presentType !== 2);
    }

    if (!upGradeReturnGiftCoupon) {
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
export const upGradeInitPerfectCheckBox = function () {
    const giftInfo = this.props.specialPromotion.get("$giftInfo").toJS();
    const { upGradeReturnGiftCheckBoxStatus } = this.state;
    const pointItem = giftInfo.find((v) => v.presentType === 2);
    const couponItem = giftInfo.find((v) => v.presentType === 1);
    upGradeReturnGiftCheckBoxStatus.upGradeReturnGiftPoint = pointItem;
    upGradeReturnGiftCheckBoxStatus.upGradeReturnGiftCoupon = couponItem;
    if (!pointItem && !couponItem) {
        upGradeReturnGiftCheckBoxStatus.upGradeReturnGiftCoupon = true;
    }
    this.upGradePointItem = pointItem || {};
    this.setState({
        upGradeReturnGiftCheckBoxStatus,
        upGradeReturnGiftPoint: pointItem && pointItem.presentValue,
    });
};

export default {
    renderUpGradeThree,
    upGradeAddPointData,
    upGradeInitPerfectCheckBox,
};
