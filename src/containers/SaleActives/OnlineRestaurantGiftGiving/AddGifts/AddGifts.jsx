import React, { Component } from "react";
import { Icon, Form, Select, message, Input, Button, Tooltip } from "antd";
import _ from "lodash";
import { axios } from "@hualala/platform-base";
import Gift from "./Gift";
import { proCouponData, initVal } from "./common";
import styles from "./styles.less";

class AddGifts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formList: [],
            couponData: [],
        };
    }

    componentDidMount() {
        // 请求零售券
        this.getCouponsData({});
    }

    getCouponsData = async (data) => {
        const method = "/coupon/couponService_getSortedCouponBoardList.ajax";
        const params = {
            service: "HTTP_SERVICE_URL_CRM",
            type: "post",
            data,
            method,
        };
        const response = await axios.post(
            "/api/v1/universal?" + method,
            params
        );
        const { code, message: msg, data: obj } = response;
        if (code === "000") {
            const { crmGiftTypes = [] } = obj;
            this.setState({ couponData: proCouponData(crmGiftTypes) });
        }
    };

    onChange = (idx, params) => {
        const { value = [], onChange } = this.props;
        if (!value[0]) {
            value.push({ ...initVal });
        }
        const { couponData } = this.state;
        const list = [...value];
        const giftObj = value[idx];
        list[idx] = { ...giftObj, ...params };
        if (couponData.length > 0) {
            const flatTree = couponData.map((x) => x.children).flat(Infinity);
            list.forEach((item) => {
                const ids = flatTree.findIndex((x) => x.value == item.giftID);
                if (ids >= 0) {
                    const { label = "", giftType } = flatTree[ids];
                    item.giftName = label;
                    item.giftType = giftType;
                }
            });
        }
        onChange(list);
    };

    add = () => {
        let { value = [], onChange } = this.props;
        if (!value[0]) {
            value.push({ ...initVal });
        }
        if (value[9]) return null;
        const list = [...value];
        const id = Date.now().toString(36); // 随机不重复ID号
        list.push({ ...initVal, id });
        onChange(list);
        return null;
    };

    del = ({ target }, data) => {
        const { idx } = target.closest("a").dataset;
        const { value, onChange } = this.props;
        const list = [...value];
        list.splice(+idx, 1);
        onChange(list);
    };

    getForm = (idx, form) => {
        const { formList } = this.state;
        const { getGiftForm } = this.props;
        formList.push(form);
        this.setState({ formList });
        if (typeof getGiftForm === "function") {
            getGiftForm(formList);
        }
    };

    render() {
        const { value = [] } = this.props;
        if (!value[0]) {
            value.push({ ...initVal });
        }
        return (
            <div>
                {value.map((v, i) => (
                    <div key={v.id || i} className={styles.addGiftsBox}>
                        <div className={styles.addGiftsConntet}>
                            <span>礼品{i + 1}</span>
                            <p style={{ height: 24 }}></p>
                            <Gift
                                idx={i}
                                key={i}
                                treeData={this.state.couponData}
                                formData={v}
                                onChange={this.onChange}
                                getForm={this.getForm}
                            />
                        </div>
                        {/* 添加删除操作 */}
                        <div>
                            {value.length < 10 && (
                                <a data-idx={i} onClick={this.add}>
                                    <Icon
                                        type="plus-circle-o"
                                        style={{
                                            fontSize: 26,
                                            color: "#12B493",
                                        }}
                                    />
                                </a>
                            )}
                            {value.length > 1 && (
                                <a onClick={(e) => this.del(e, v)} data-idx={i}>
                                    <Icon
                                        type="minus-circle-o"
                                        style={{
                                            fontSize: 26,
                                            color: "#Ed7773",
                                        }}
                                    />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default AddGifts;
