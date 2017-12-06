/// <reference types="react" />
import React from 'react';
import { ModalProps } from 'antd/lib/modal/Modal';
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

export interface FoodSelectModalProps extends ModalProps {
    /** 可选择的所有项 */
    options: Array<OptionType>,
    /** 过滤器 */
    filters: Array<FilterType>,
    /** 已选择的选项 */
    defaultValue?: Array<string>,
    /** 是否显示已导入菜品过滤器 */
    showImportedFilter: boolean,
    /** 已选择的项发生改变时的回调函数 */
    onChange?: (values: Array<string>) => void,
    /** 点击模态框确定按钮时的回调函数 */
    onOk?: (values: Array<string>) => void | Promise<any>,
    /** 点击模态框取消按钮时的回调函数 */
    onCancel?: () => void,
}

export interface FoodSelectorProps extends FoodSelectModalProps {
    /** 当前选择的项 */
    value?: Array<string>,
    /** 选项改变时的回调 */
    onChange?: (value: Array<string>) => void,
    /** 组件默认显示的文字 */
    placeholder?: string,
}

export class FoodSelectModal extends React.Component<FoodSelectModalProps> {}

export default class FoodSelector extends React.Component<FoodSelectorProps> {}
