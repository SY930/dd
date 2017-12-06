/// <reference types="react" />
import React from 'react';
import { ColProps } from 'antd/lib/grid/col';
import { WrappedFormUtils } from 'antd/lib/form/form';

export declare type OptionType = {
    /** 选项的值 */
    value: string,
    /** 选型的名字 */
    label: string,
    /** 选项是否禁用 */
    disabled?: boolean,
};

export interface FormItemConfig {
    // ============================== 通用配置 ============================================================================
    /** 表单域类型 */
    type: 'text' | 'textarea' | 'password' | 'number' | 'combo' | 'radioButton' | 'switcher' | 'image'
        | 'checkbox' | 'radio' | 'timepicker' | 'datepicker' | 'datepickerMonth' | 'datepickerRange' | 'custom',
    /** 表单域标题 */
    label?: string | React.ReactNode,
    /** 表单域下方额外显示的提示等内容 */
    extra?: string | React.ReactNode,
    /** 鼠标移动到表单域时额外显示的提示 */
    tooltip?: string | React.ReactNode,
    /** 是否显示验证的标志图案 */
    hasFeedback?: boolean,
    /** 表单域是否禁用 */
    disabled?: boolean,
    /** 表单域为空时显示的文字 */
    placeholder?: string,
    /** 表单域的验证规则 */
    rules?: Array<string> | Array<any>,
    /** 表单域对应组件支持的所有 props */
    props?: any,
    // ============================== 'text', 'textarea', 'password' ==================================================
    /** 表单域前部填充 */
    prefix?: string | React.ReactNode,
    /** 表单域后部填充 */
    surfix?: string | React.ReactNode,
    // ============================== 'number' ========================================================================
    /** 最小值 */
    min?: number,
    /** 最大值 */
    max?: number,
    /** 调整时的跳步大小 */
    step?: number,
    // ============================== 'combo' =========================================================================
    /** 是否固定弹出层(https://codepen.io/anon/pen/xVBOVQ?editors=001) */
    fixPopup?: boolean,
    /** 是否支持多选 */
    multiple?: boolean,
    // ============================== 'combo', 'checkbox', 'radio', 'radioButton' =====================================
    /** 可选项 */
    options?: () => Promise<OptionType> | Array<OptionType>,
    // ============================== 'switcher' ======================================================================
    /** 开启时显示的内容 */
    onLabel?: string,
    /** 关闭时显示的内容 */
    offLabel?: string,
    // ============================== 'datepicker', 'datepickerMonth', 'datepickerRange' ==============================
    /** 是否显示时间选项 */
    showTime?: boolean,
    // ============================== 'timepicker', 'datepicker', 'datepickerMonth', 'datepickerRange' ================
    /** 日期或时间的格式 */
    format?: string,
    // ============================== 'image' =========================================================================
    /** 提示文字 */
    tips?: string | React.ReactNode,
    /** 限制上传的文件后缀名，多个用逗号隔开 */
    limitType?: string,
    /** 限制上传的文件大小 */
    limitSize?: number | Array<number>,
    // ============================== 'custom' ========================================================================
    /** 表单域的渲染方法 */
    render?: (
        decorator: (option: {
            key?: string,
            /** 子节点的值的属性，如 Checkbox 的是 'checked' */
            valuePropName?: string;
            /** 子节点的初始值，类型、可选值均由子节点决定 */
            initialValue?: any;
            /** 收集子节点的值的时机 */
            trigger?: string;
            /** 可以把 onChange 的参数转化为控件的值，例如 DatePicker 可设为：(date, dateString) => dateString */
            getValueFromEvent?: (...args: any[]) => any;
            /** 校验子节点值的时机 */
            validateTrigger?: string | string[];
            /** 校验规则，参见 [async-validator](https://github.com/yiminghe/async-validator) */
            rules?: Array<any>;
            /** 是否和其他控件互斥，特别用于 Radio 单选控件 */
            exclusive?: boolean;
        }) => (node: React.ReactNode) => React.ReactNode,
        form: WrappedFormUtils
    ) => React.ReactNode,
}

export interface FormKeysConfig {
    /** 单列布局配置 */
    col: ColProps,
    /** 单列表单域的所有键值 */
    keys: Array<string>,
}

export interface FormItemLayout {
    /** 表单域标题部分的布局配置 */
    labelCol: ColProps,
    /** 表单域输入部分的布局配置 */
    wrapperCol: ColProps,
}

export interface FormItems {
    /** 表单域的名字与配置 */
    [key: string]: FormItemConfig,
}

export interface BaseFormProps {
    /** 表单域配置 */
    formItems: FormItems,
    /** 当前展示的表单域 */
    formKeys: Array<string> | Array<FormKeysConfig>,
    /** 表单的初始值 */
    formData?: any,
    /** 禁用的表单域 */
    disabledKeys?: Array<string>,
    /** 表单展示方式，竖排(horizontal)或者横排(inline) */
    layout?: 'horizontal' | 'inline',
    /** 每个表单域的排列布局 */
    formItemLayout?: FormItemLayout,
    /** 多列表单列与列之间的间隔 */
    gutter?: number,
    /** 获取表单实例的回调 */
    getForm?: (form: WrappedFormUtils) => void,
    /** 获取所有表单域实例的回调 */
    getRefs?: (ref: React.Element) => void,
    /** 表单域改变时的回调 */
    onChange?: (key: string, value: string) => void,
}

export default class BaseForm extends React.Component<BaseFormProps> {}
