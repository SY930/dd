/// <reference types="react" />
import React from 'react';

export interface OptionType {
    /** 选项的值 */
    value: string;
    /** 选项的显示名称 */
    label: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 选项的拼音字段，提供后可支持拼音搜索 */
    py?: string;
    /** 选项的父节点 value，当设置 display 为 'tree' 时生效 */
    parent?: string;
    [key: string]: any;
}

export interface CheckboxListProps {
    /** 当前选中的值 */
    value?: Array<string>;
    /** 所有的可选项 */
    options?: Array<OptionType>;
    /** 宽度 */
    width?: number | string;
    /** 显示的模式，仅对样式有影响。'tree' 为节点单独勾选模式，'treeLeaf' 为只勾选叶子节点模式 */
    display?: 'normal' | 'table' | 'tree' | 'treeLeaf' | 'stripped';
    /** 是否显示搜索框 */
    showSearch?: boolean;
    /** 是否显示全选按钮 */
    showCheckAll?: boolean,
    /** 是否可折叠 */
    showCollapse?: boolean,
    /** 选项变化时的回调 */
    onChange?: (value: Array<string>) => void,
}

export default class CheckboxList extends React.Component<CheckboxListProps> {}
