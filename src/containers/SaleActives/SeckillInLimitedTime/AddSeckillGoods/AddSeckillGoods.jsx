import React, { Component } from "react";
import { Icon, Form, Select, message, Input, Button, Tooltip,Radio } from "antd";
import BaseForm from "components/common/BaseForm";
import {ruleFormItem, giftRemainSettings} from "../common";
import _ from "lodash";
import { axios } from "@hualala/platform-base";
import Gift from "./Gift";
import { proCouponData, initVal } from "./common";
import styles from "./styles.less";
import drag from '../../asssets/drag.png';
const RadioGroup = Radio.Group;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
class AddSeckillGoods extends Component {
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
    onChangeRemainForm = (key, value, i) => {
        console.log(i,key,value,'value----------pppppppppp')
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
        console.log(idx,params,'params--------------->')
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
        console.log(list,'list----------->>>>')
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
        console.log(form, 'form>>>>>>>>>>>>>>>>>>>>')
        const { formList } = this.state;
        const { getGiftForm } = this.props;
        formList.push(form);
        this.setState({ formList });
        if (typeof getGiftForm === "function") {
            getGiftForm(formList);
        }
    };
    onChangeGift = (key, value, i) => {
        console.log(key,value,i,'onchangeGift00-------------')
    }
    render() {
        const { value = [], formData, getForm } = this.props;
        if (!value[0]) {
            value.push({ ...initVal });
        }
        return (
            <div>
                {value.map((v, i) => (
                    <div key={v.id || i} className={styles.addGiftsBox}>
                        <div className={styles.addGiftsConntet}>
                            <span>礼品{i + 1}</span>
                            <div  className={styles.changeGiftType}>
                                <img src={drag} className={styles.moveIcon}></img>
                                <div className={styles.giftTypeBox}>
                                    <span style={{marginRight: 15}}>礼品类型</span>
                                    <RadioGroup  value={v.giftType || "1"} onChage={() => {}}>
                                        <Radio value={"1"}>餐饮券</Radio>
                                        <Radio value={"2"}>券包</Radio>
                                    </RadioGroup>
                                </div>
                            </div>
                            <div className={styles.giftWrapperBox}>
                                <Gift
                                    idx={i}
                                    key={i}
                                    treeData={this.state.couponData}
                                    formData={v}
                                    onChange={this.onChange}
                                    getForm={this.getForm}
                                />
                            </div>
                            <div className={styles.divideLine}></div>
                            <div style={{ marginBottom: 16 }}>
                                <BaseForm
                                    getForm={getForm}
                                    formItems={ruleFormItem}
                                    formKeys={giftRemainSettings}
                                    onChange={(key, value) => this.onChangeRemainForm(key, value, i)}
                                    formData={formData || {}}
                                    formItemLayout={formItemLayout}
                                />
                            </div>
                        </div>
                        {/* 添加删除操作 */}
                        <div>
                            {value.length < 10 && (
                                <a data-idx={i} onClick={this.add}>
                                    <Icon
                                        type="plus-circle-o"
                                        style={{
                                            fontSize: 24,
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
                                            fontSize: 24,
                                            color: "#Ed7773",
                                            marginLeft: 4
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

export default AddSeckillGoods;
