## 新版营销活动模块

改版后的营销活动，支持预览功能，将设置和装修合二为一

## 目录结构

├── CreateActive.jsx                    入口文件
├── CreateActive.less                   入口样式文件
├── PayHaveGift                         微信支付有礼活动
│   ├── components                      活动内部组件
│   │   ├── AddGift
│   │   │   ├── Gift
│   │   │   │   ├── Common.jsx
│   │   │   │   ├── index.jsx
│   │   │   │   └── style.less
│   │   │   ├── index.jsx
│   │   │   └── style.less
│   │   ├── Step1.jsx
│   │   └── Step2.jsx
│   ├── constant.js                     活动内部静态数据定义
│   ├── index.jsx
│   └── payHaveGift.less
├── api.js                              公用接口定义，如活动内部私有的接口，请单独定义到活动文件夹中
├── components                          公用组件，当有两个以及以上的活动需要使用此组件的时候，在此定义
│   ├── ActSteps
│   │   ├── ActSteps.jsx
│   │   └── index.less
│   ├── ColorSetting
│   │   ├── index.jsx
│   │   └── index.less
│   └── index.js
├── constant.js                        公用的静态数据定义
├── helper                             公用工具函数
│   └── index.js
├── models                             公用的model
│   └── common.js
└── readme.md

## 开发建议

1. 按照现有的目录结构进行扩展，每个活动单独新建文件夹，每个活动所需要的资源都在各自的文件夹中（公用资源除外），将资源按照入口文件，样式资源，组件资源，API资源，数据管理，公用方法进行分开管理。
2. 组件升级，当一个组件在两个地方都要使用的时候，应该升级为公用组件，提取到外层公用文件夹中。
3. 新增活动后，在文档中添加注释，便于后期维护
4. helper文件夹中，common为表单公用render，有相同render直接在里面引用，活动中有新的能公用的，在common中添加上


## 活动索引

PayHaveGift => 微信支付有礼
SwellGiftBag => 膨胀大礼包
