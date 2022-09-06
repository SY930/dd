import React from 'react'
import { Icon, Tooltip } from 'antd'
import moment from 'moment'
import { jumpPage } from '@hualala/platform-base'

export const getColumns = _this => ([
    {
        title: '序号',
        dataIndex: 'index',
        className: 'TableTxtCenter',
        width: 50,
        // fixed:'left',
        key: 'index',
        render: (text) => {
            return (_this.state.pageNo - 1) * _this.state.pageSizes + text
        },
    },
    {
        title: '操作',
        key: 'operation',
        className: 'TableTxtCenter',
        width: 180,
        // fixed: 'left',
        render: (text, record) => {
            return (<span>
                <a
                    href="#"
                    onClick={() => {
                        _this.handleView(record, false)
                    }}
                >
                    查看
                </a>
                {
                    [5].includes(record.platformType) && (
                        <a
                            href="#"
                            onClick={() => {
                                _this.handleCouponInfo(record, false)
                            }}
                        >
                            详情
                        </a>
                    )
                }
                {
                    // 券code模式为MERCHANT_API的显示“停用”按钮  batchStatus 0 未启用  1启用  2停用
                    record.platformType === 3 && record.batchStatus === 1 && record.couponCodeDockingType === 1 && ( // 启用中显示停用
                        <a
                            href="#"
                            onClick={() => {
                                // 2 status    -   3平台类型
                                _this.handleStopClickEvent(record, 2, '3')
                            }}
                        >
                            停用
                        </a>
                    )
                }
                {
                    // 券code模式为MERCHANT_API的显示“启用”按钮
                    record.platformType === 3 && record.batchStatus === 0 && record.couponCodeDockingType === 1 && (
                        <a
                            href="#"
                            onClick={() => {
                                _this.handleStopClickEvent(record, 1, '3')
                            }}
                        >
                            启用
                        </a>
                    )
                }
                {
                    // 券code模式为MERCHANT_API的显示“编辑”按钮
                    record.platformType === 3 && record.batchStatus === 0 && record.couponCodeDockingType === 1 && (
                        <a
                            href="#"
                            onClick={() => {
                                // _this.handleCouponInfo(record, false)
                                _this.handleEdit(record)
                            }}
                        >
                            编辑
                        </a>
                    )
                }
                {/* 支付宝 */}
                {
                    record.channelID == 60 && (
                        <span>
                            <a
                                href="#"
                                disabled={record.batchStatus != 1}
                                onClick={record.batchStatus == 1 ? () => {
                                    _this.handleStopClickEvent(record, 2, '1')
                                } : null}
                            >停用</a>
                            <a
                                href="#"
                                onClick={() => {
                                    jumpPage({ menuID: '100008993' })
                                }}
                            >投放</a>
                        </span>
                    )
                }
                {
                    record.channelID == 50 && record.couponCodeDockingType == 3 && <a
                        href="#"
                        disabled={!!record.eventStatus}
                        onClick={record.eventStatus ? null : () => {
                            _this.setState({
                                wxData: record,
                                isEdit: false,
                                title: '投放场景',
                            }, () => {
                                _this.handleShowWxModal()
                            })
                        }}
                    >投放</a>
                }
                {
                    record.channelID == 50 && !!record.eventStatus && record.couponCodeDockingType == 3 &&
                    <a
                        href="#"
                        onClick={() => {
					        _this.setState({
					            wxData: record,
					            isEdit: true,
					            title: '投放详情',
					        }, () => {
					            _this.handleShowWxModal()
					        })
					    }}
                    >投放详情</a>
                }
            </span>
            )
        },
    },
    {
        title: '第三方券名称',
        dataIndex: 'batchName',
        key: 'batchName',
        width: 200,
        render: text => text,
    },
    {
        title: '哗啦啦券批次ID',
        dataIndex: 'itemID',
        key: 'itemID',
        width: 200,
        render: text => text,
    },
    {
        title: '礼品名称',
        dataIndex: 'giftName',
        width: 130,
        render: text => text || '--',
    },
    {
        title: '礼品ID',
        dataIndex: 'giftItemID',
        width: 200,
        render: text => text || '--',
    },
    {
        title: '业态',
        dataIndex: 'promotionType',
        key: 'promotionType',
        width: 200,
        render: promotionType => (promotionType === 2 ? '零售' : promotionType === 1 ? '餐饮' : '--'),
    },
    {
        title: '关联渠道',
        dataIndex: 'platformType',
        key: 'platformType',
        width: 80,
        render: (text) => {
            const channelMap = {
                1: '支付宝',
                2: '抖音',
                5: '抖音',
                3: '微信',
                6: 'E折',
                7: '快手',
            }
            return channelMap[text] || '--'
        },
    },
    {
        title: '券面价值',
        dataIndex: 'giftFaceValue',
        key: 'giftFaceValue',
        width: 80,
        render: text => text || '--',
    },
    {
        title: '投放价格',
        dataIndex: 'deliveryValue',
        key: 'deliveryValue',
        width: 80,
        render: text => text || '--',
    },
    {
        title: '对接业务',
        dataIndex: 'channelID',
        key: 'channelID',
        width: 80,
        render: (text, record) => {
            return record.platformType == 2 ? '抖音电商' : (record.platformType == 5 ? '抖音团购' : '--')
        },
    },
    {
        title: '券code模式',
        dataIndex: 'couponCodeDockingType',
        key: 'couponCodeDockingType',
        width: 160,
        render: (text, record) => {
            if (text == '3' && record.platformType == 3) {
                return <span>WECHATPAY_MODE<Tooltip title="适用于企鹅吉市等场景对接"><Icon type="question-circle-o" style={{ marginLeft: 5 }} /></Tooltip></span>
            }
            if (text == '1' && record.platformType == 3) {
                return 'MERCHANT_API'
            }
            if (text == '2' && record.platformType == 1) {
                return 'MERCHANT_UPLOAD'
            }
            return '--'
        },
    },
    {
        title: '批次号',
        dataIndex: 'trdBatchID',
        key: 'trdBatchID',
        width: 140,
        render: (text, record) => {
            if (record.platformType == 3 || record.platformType == 1) return <Tooltip title={text}>{text}</Tooltip>
            return '--'
        },
    },
    {
        title: '剩余数量',
        dataIndex: 'stock',
        key: 'stock',
        width: 80,
        render: (text, record) => {
            const { receive, platformType } = record
            if (text === -1 && platformType === 5) {
                return '不限制'
            }
            if (text) {
                return Number(text) - Number(receive)
            }
        },
    },
    {
        title: '创建时间',
        className: 'TableTxtCenter',
        dataIndex: 'createStampStr',
        key: 'createStampStr',
        width: 180,
        render: text => text,
    },
    {
        title: '审核状态',
        className: 'TableTxtCenter',
        dataIndex: 'batchStatus',
        key: 'batchStatus',
        width: 180,
        render: (text) => {
            const statusMap = {
                3: '待审核',
                4: '审核通过',
                5: '审核失败',
            }
            return statusMap[text] || '--'
        },
    },
])

export const columnsView = [
    {
        title: '券名称',
        key: 'giftName',
        dataIndex: 'giftName',
        render: (t) => {
            return <Tooltip title={t}>{t}</Tooltip>
        },
    },
    {
        title: '生成数量',
        key: 'stock',
        dataIndex: 'stock',
        render: (t, record) => {
            if (t === -1 && record.platformType === 5) {
                return '不限制'
            }
            return t
        },
    },
    {
        title: '生效方式',
        key: 'effectType',
        dataIndex: 'effectType',
        render: (text) => {
            if (text == 3) {
                return '相对有效期'
            } else if (text == 2) {
                return '固定有效期'
            }
            return '--'
        },
    },
    {
        title: '生效时间',
        key: 'Stimes',
        dataIndex: 'Stimes',
        render: (text, record) => {
            if (record.effectType == 3) { //
                const effectGiftTimeHours = record.effectGiftTimeHours
                const t = effectGiftTimeHours > 0 ? `${effectGiftTimeHours}后天生效` : '立即生效'
                return <Tooltip title={t}>{t}</Tooltip>
            } else if (record.effectType == 2) {
                const time = record.EGiftEffectTime ? `${moment(record.EGiftEffectTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}/${moment(record.validUntilDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}` : '--'
                return <Tooltip title={time}>{time}</Tooltip>
            }
            return '--'
        },
    },
    {
        title: '有效时间',
        key: 'times',
        dataIndex: 'times',
        render: (text, record) => {
            if (record.effectType == 3) { //
                const t = `自领取${record.validUntilDays}天有效`
                return <Tooltip title={t}>{t}</Tooltip>
            } else if (record.effectType == 2) {
                const time = record.EGiftEffectTime ? `${moment(record.EGiftEffectTime, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}/${moment(record.validUntilDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD')}` : '--'
                return <Tooltip title={time}>{time}</Tooltip>
            }
            return '--'
        },
    },
]

export const ThirdCouponConfig = [{
    title: '第三方支付宝券',
    params: { type: 1, channelID: 60, platformTypeCreate: 1, giftTypes: [10, 111] },
    subTitle: '支付宝券',
    url: 'http://res.hualala.com/basicdoc/b12ac629-222c-488e-9bc9-46c87d7defca.png',
}, {
    title: '第三方微信券',
    params: { type: 2, channelID: 50, platformTypeCreate: 3, giftTypes: [10, 111, 21] },
    subTitle: '微信券',
    url: 'http://res.hualala.com/basicdoc/de989c7b-7cb4-4033-8c91-8f589850ca82.png',
}, {
    title: '抖音（小黄车）',
    params: { type: 3, channelID: 70, platformTypeCreate: 2, giftTypes: [10, 111, 21] },
    subTitle: '抖音券',
    url: 'http://res.hualala.com/basicdoc/911767a5-4f0a-44b3-ab4a-da6b2cc8924e.png',
}, {
    title: '抖音（小风车）',
    params: { type: 4, channelID: 80, platformTypeCreate: 5, giftTypes: [10, 111, 21] },
    subTitle: '抖音券',
    url: 'http://res.hualala.com/basicdoc/911767a5-4f0a-44b3-ab4a-da6b2cc8924e.png',
}, {
    title: 'E折券',
    params: { type: 5, channelID: 90, platformTypeCreate: 6, giftTypes: [10, 21] },
    subTitle: 'E折券',
    url: 'http://res.hualala.com/basicdoc/550f5482-f0df-44b5-ac5d-a930b3f5c839.png',
}, {
    title: '快手',
    params: { type: 7, channelID: 100, platformTypeCreate: 7, giftTypes: [10, 111, 21] },
    subTitle: '快手券',
    url: 'http://res.hualala.com/basicdoc/406b0d9a-e6ba-414a-b9ab-c06f0fbe5540.png',
}];


export const eZheAgreement = `
尊敬的商户：<br/>
   您好！在北京多来点信息技术有限公司（以下称“哗啦啦”）提醒您，进行E折-卡券营销商户投放请仔细阅读并知悉以下内容：<br/>
一、定义条款<br/>
1.1 平台（以下统称为“平台”）：特指由E折现在或将来拥有合格权限运营，提供业务推广等技术服务的网络服务平台，包括但不限于E折及E折合作方运营/ 管理的网络服务平台，及未来可能新设或合作的网络平台等。<br/>
1.2 商家券：指商户通过哗啦啦平台进行券面推广包括但不限于哗啦啦平台E折及其他推广渠道，券面类型包含但不限于代金券等，推广券面成本由商户承担。<br/>
二、服务内容<br/>
2.1卡券推广服务：哗啦啦为商户提供卡券营销能力，以实现商户卡券/商品在线展示，为用户提供各类卡券的兑换、验证、汇总管理等经营行为，并实现哗啦啦代商户收取卡券/商品分发销售、在线展示对应款项的服务。<br/>
2.2 具体业务合作内容和结算及账户信息以实际合同为准。<br/>
三、商户的权利义务<br/>
4.1 商户应合法经营，且提供的食品安全/卡券/商品/ 服务应符合国家法律、法规、规章的规定。如因商户行为或商户提供的食品安全/商品/ 服务造成用户损失的，由商户承担相应责任。<br/>
4.2 商户应按照平台核销价格或实际支付金额为用户开具相应金额的发票。<br/>
五、哗啦啦的权利义务<br/>
5.1 哗啦啦E折平台应向商户提供本协议约定的技术服务及其他相关服务。<br/>
5.2 为更好的推荐商户的卡券/ 服务，以提升商户的知名度/ 订单量，哗啦啦E折平台可通过适当的方式和渠道做相关宣传介绍。商户对上述行为予以认可，并授权哗啦啦E折平台就商户及其相关的品牌名称、门店名称、LOGO、图片、门店、等信息进行使用。<br/>
5.3 哗啦啦E折平台有权根据协议的约定内容向商户收取服务费，并且有权先从代收款项中直接扣除该等服务费。<br/>
北京多来点信息技术有限公司`
