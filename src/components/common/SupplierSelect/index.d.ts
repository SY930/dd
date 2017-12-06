/// <reference types="react" />
import React from 'react';

export interface OptionType {
    /** 选项值 */
    value: string;
    /** 选项名称 */
    label: string;
    /** 选项的拼音字段，提供后可支持拼音搜索 */
    py?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 其他 */
    [key: string]: any;
}

export interface FilterType {
    /** 过滤器的字段名称 */
    key: string;
    /** 过滤器的名称 */
    label: string;
    /** 选项的拼音字段，提供后可支持拼音搜索 */
    py?: string;
    /** 所有的可选项 */
    options: Array<OptionType>;
    /** 其他 */
    [key: string]: any;
}

export interface FilterSelectorProps {
    /** 选择项目的名称 */
    title?: string,
    /** 样式类 */
    className?: string,
    /** 所有的可选项 */
    options?: Array<OptionType>,
    /** 所有的过滤器 */
    filters?: Array<FilterType>,
    /** 追加的过滤器 */
    extraFilters?: any,
    /** 默认值 */
    defaultValue?: Array<string>,
    /** 已选项改变时的回调函数 */
    onChange?: (values: Array<string>) => void,
    /** 改变当前过滤器时触发的回调函数 */
    onFilterKeyChange?: (filterKey: string) => void | Promise<any>,
}

export default class FilterSelector extends React.Component<FilterSelectorProps> {}
