/// <reference types="react" />
import React from 'react';

type TabelScroll = {
    x?: number;
    y?: number;
};

export interface ColumnProps {
    /** React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性 */
    key?: string;
    /** 列数据在数据项中对应的 key，支持 a.b.c 的嵌套写法 */
    dataIndex?: string;
    /** 列头显示文字 */
    title?: string;
    /** 列的 className */
    className?: string;
    /** 列宽度 */
    width?: string | number;
    /** 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引 */
    render?: (value, record, index) => React.ReactNode;
}

export interface HualalaTableProps {
    /** 是否展示外边框和内边框 */
    bordered?: boolean;
    /** 横向或纵向支持滚动，也可用于指定滚动区域的宽高度：{{ y: 300 }} */
    scroll?: TabelScroll;
    /** 表格列的配置描述 */
    columns?: Array<ColumnProps>;
    /** 数据数组 */
    dataSource?: Array<any>;
    /** 表格行 key 的取值 */
    rowKey?: string;
    /** 是否支持行勾选 */
    checkable?: boolean;
    /** 当前勾选的行（受控） */
    checkedKeys?: Array<string>;
    /** 勾选一行时的回调 */
    onCheck?: (isChecked: boolean, rowKey: string) => void,
    /** 全选时的回调 */
    onCheckAll?: (isChecked: boolean) => void,
    /** 单击一行时的回调 */
    onRowClick?: (record: any) => void,
}

export default class HualalaTable extends React.Component<HualalaTableProps> {}
