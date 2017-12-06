/// <reference types="react" />
import React from 'react';

declare type Item = {
    /** 项目的值 */
    value: string;
    /** 项目的显示名称 */
    label: string;
    /** 其他 */
    [key: string]: any;
};

export interface EditableTagsProps {
    /** 待添加项目的名称 */
    title?: string,
    /** 未添加项目时显示的内容 */
    placeholder: string | React.ReactNode,
    /** 当前显示的项目 */
    items?: Array<Item>,
    /** 添加项目时的回调 */
    onAdd?: () => void,
    /** 移除项目时的回调 */
    onClose?: (value: string) => void,
}

export default class EditableTags extends React.Component<EditableTagsProps> {}
