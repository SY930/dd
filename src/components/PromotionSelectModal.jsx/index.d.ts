/// <reference types="react" />
import React from 'react';
import { OptionType, FilterType } from '../FilterSelector';

export interface ItemType {
    /** 选项值 */
    value: string;
    /** 选项名称 */
    label: string;
    /** 选项拼音 */
    py?: string;
    /** 其他 */
    [key: string]: any;
}

export interface ShopSelectModalProps {
    /** 模态框的标题 */
    title?: string,
    /** 模态框宽度 */
    width?: number,
    /** 可选择的所有项 */
    options?: Array<OptionType>,
    /** 过滤器 */
    filters?: Array<FilterType>,
    /** 已选择的选项 */
    defaultValue?: Array<string>,
    /** 已选择的项发生改变时的回调函数 */
    onChange?: (values: Array<string>) => void,
    /** 点击模态框确定按钮时的回调函数 */
    onOk?: (values: Array<string>) => void | Promise<any>,
    /** 点击模态框取消按钮时的回调函数 */
    onCancel?: () => void,
}

export interface ShopSelectorProps extends ShopSelectModalProps {
    /** 当前选择的项 */
    value?: Array<string>,
    /** 选项改变时的回调 */
    onChange?: (value: Array<string>) => void,
    /** 是否默认全选 */
    defaultCheckAll?: boolean,
    /** 组件显示大小 */
    size?: 'default' | 'small',
    /** 组件默认显示的内容 */
    placeholder?: string | React.ReactNode,
    /** schema 数据，不传则自动调用接口获取 */
    schemaData?: any,
}

export class ShopSelectModal extends React.Component<ShopSelectModalProps> {}

export default class ShopSelector extends React.Component<ShopSelectorProps> {}
