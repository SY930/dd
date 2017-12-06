---
category: Components
subtitle: 图片上传组件（受控）
type: Data Entry
title: ImageUpload
---

图片上传组件（受控），支持设置上传图片的类型、大小限制以及上传提示，**仅支持上传单一图片文件**。

### 参数说明 props

- **value: string**  
  图片地址（相对地址）。

- **name: string**  
  上传图片时的文件参数名，默认为 `"myFile"`。

- **action: string**  
  上传图片的接口地址，默认为 `"/api/common/imageUpload"`。

- **limitType: string**  
  限制上传的文件格式，使用文件后缀名进行限制，多种格式用逗号分隔，默认为空即不限制。  
  示例：`".jpg"`, `".jpg,.png,.gif"`。

- **limitSize: number | Array<number>**  
  限制上传的文件大小，单位为字节（Byte），可传入数字数组与限制格式相对应，默认为0即不限制。  
  示例：`50 * 1024`, `[50 * 1024, 100 * 1024, 200 * 1024]`。

- **tips: string | React Component**  
  上传按钮显示的提示信息，默认为 `"点击上传图片"`。

- **onChange: (url: string) => any**  
  文件上传成功或者文件移除时的回调，`url` 为图片的相对地址。

### 配合 BaseForm 组件使用  

在 `BaseForm` 的配置单中预置了 `type` 为 `image` 的表单域配置项，可选配置如下：

```
logoImage: {
  type: 'image',
  label: '品牌LOGO',
  limitType: '.jpg,.png',
  limitSize: 50 * 1024,
  tips: (<span>支持jpg、png格式<br/>大小50KB以内</span>)
}
```
