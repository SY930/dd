/*
 * @Author: Songnana
 * @Date: 2022-08-23 14:39:15
 * @Modified By: modifier Songnana
 * @Descripttion:
 */

import React, { Component } from "react";
import { Icon } from "antd";
import style from "./styles.less";
import OnlineRestaurantGiftGivingPng from "../../asssets/OnlineRestaurantGiftGiving.png";

export class PhonePreview extends Component {
    static propTypes = {};

    render() {
        const { type = "1", typeKey } = this.props;
        return (
            <div>
                <div className={style.previewAreaNew}>
                    <div>
                        {typeKey == "85" ? (
                            <div className={style.platformArea}>
                                <div className={style.platformBox}>
                                    {[
                                        { name: "弹窗海报", value: "1" },
                                        { name: "banner广告", value: "2" },
                                    ].map((item, index) => {
                                        const v = item.value == '4' || item.value == '2' ? '2' : item.value
                                       return (
                                            <div
                                                className={`${style.platformItem} ${v === type
                                                        ? style.selectedItem
                                                        : ""
                                                    }`}
                                            >
                                                <span>{item.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ) : null}
                        <div className={style.bannerImg}>
                            <img
                                src="http://res.hualala.com/basicdoc/3e3d526c-00a7-410f-b9b3-d8017051841d.png"
                                alt=""
                            />
                            {typeKey == "85" ? (
                                <div className={style.simpleDisplayBlock}>
                                    <div
                                        className={style.imgWrapper}
                                        style={{ height: "100%" }}
                                    >
                                        <div
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                overflow: "hidden",
                                                textAlign: "right",
                                            }}
                                        >
                                            {(type == "2" || type == '4') && (
                                                <img
                                                    src="http://res.hualala.com/basicdoc/f85aeeb1-6b26-439f-9a5e-00c5f935d857.png"
                                                    alt=""
                                                    style={{
                                                        width: "217px",
                                                        position: "relative",
                                                        top: 56,
                                                    }}
                                                />
                                            )}
                                            {type == "1" && (
                                                <img
                                                    src="http://res.hualala.com/basicdoc/884351d8-1788-4c2d-b0fd-949936d92369.png"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                    }}
                                                    alt=""
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {type == "1" && (
                                        <Icon
                                            className={style.closeBtn}
                                            type="close-circle-o"
                                        />
                                    )}
                                </div>
                            ) : typeKey == "23" ? (
                                <div
                                    className={style.simpleDisplayBlock}
                                    style={{ top: 16, left: 16 }}
                                >
                                    <img
                                        src={OnlineRestaurantGiftGivingPng}
                                        alt=""
                                        style={{ width: 290 }}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PhonePreview;
