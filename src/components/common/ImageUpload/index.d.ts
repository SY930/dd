/// <reference types="react" />
import React from 'react';

export type ImageUploadValueType = {
    /** 图片的相对地址 */
    url: string;
    /** 图片的宽高比 */
    [hwpName: string]: string;
};

export interface ImageUploadProps {
    /** 上传图片时的文件参数名 */
    name: string;
    /** 上传图片的接口地址 */
    action: string;
    /** 上传按钮显示的提示信息 */
    tips: string | React.ReactNode;
    /** 限制上传的文件格式，使用文件后缀名进行限制，多种格式用逗号分隔，默认为空即不限制 */
    limitType: string;
    /** 限制上传的文件大小，单位为字节（Byte），可传入数字数组与限制格式相对应，默认为0即不限制。 */
    limitSize: number | Array<number>;
    /** 图片宽高比属性名 */
    hwpName: string;
    /** 显示的资源值 */
    value: string | ImageUploadValueType;
    /** 资源改变时的回调 */
    onChange: (value: string | ImageUploadValueType) => void;
}

export default class ImageUpload extends React.Component<> {}
