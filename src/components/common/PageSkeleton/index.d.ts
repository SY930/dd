/// <reference types="react" />
import React from 'react';

export interface PageHeaderProps {
    /** 页面标题 */
    title?: string;
}

export interface PagePlaceholderProps {
    /** 页面标题 */
    title: string;
    /** 页面描述 */
    description?: string;
}

export class PageHeader extends React.Component<PageHeaderProps> {}
export class PagePlaceholder extends React.Component<PagePlaceholderProps> {}
