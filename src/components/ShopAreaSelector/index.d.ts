/// <reference types="react" />
import React from "react";

type typeListVal = "shop" | "area";

type validateStatus = "success" | "warning" | "error" | "validating";

type componentVal = {
    radioValue?: typeListVal;
    list: Array<string>;
};

export interface ShopAreaSelectorProps {
    /** 单独选择店铺或区域传一个值，增加radio切换传2个 */
    typeList?: Array<typeListVal>;
    radioLabel?: string;
    labelCol?: Record<string, number>;
    wrapperCol?: Record<string, number>;
    radioRequire?: boolean;
    /** 组件的值 */
    value: componentVal;
    onChange: (value: componentVal) => void;
    firstLabel?: string;
    secondLabel?: string;
    firstValidateStatus?: validateStatus;
    secondValidateStatus?: validateStatus;
    firstHelp?: string | null;
    secondHelp?: string | null;
    firstTips?: null | React.ReactNode;
    secondTips?: null | React.ReactNode;
    /** 店铺列表 */
    brandList?: Array<any>;
    groupID: number | string;
    filterShopIds?: Array<string>;
    filterParm?: Record<string, number | string>;
}

export default class ShopAreaSelector extends React.Component<ShopAreaSelectorProps> {}
