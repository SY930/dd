/// <reference types="react" />
import React from 'react';

export interface HualalaTreeOption {
    /** 节点的唯一键值 */
    value: string;
    /** 节点的显示名称 */
    label: string;
    /** 节点的父节点，根节点可传 '0' 或 undefined */
    parent: string;
    /** 节点的拼音关键字，传入可支持拼音搜索 */
    py?: string;
}

export interface HualalaTreeProps {
    /** 是否显示勾选框 */
    checkable?: boolean;
    /** 节点是否可以独立勾选（父子节点不再关联） */
    checkStrictly?: boolean;
    /** 节点独立勾选模式下，是否自动勾选子节点 */
    autoCheckChildren: boolean,
    /** 所有节点信息（注意：节点的 value 值不可重复） */
    options?: Array<HualalaTreeOption>;
    /** 当前选中的节点 */
    value?: Array<string>;
    /** 勾选节点时触发的回调 */
    onChange?: (checkedKeys: Array<string>) => void,
}

export default class HualalaTree extends React.Component<HualalaTreeProps> {}
