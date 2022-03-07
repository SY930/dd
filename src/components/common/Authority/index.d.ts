/// <reference types="react" />
import React from 'react';

export interface AuthorityProps {
    /** 权限编码，多个用英文逗号隔开 */
    rightCode: string,
}

export default class Authority extends React.Component<AuthorityProps> {}
