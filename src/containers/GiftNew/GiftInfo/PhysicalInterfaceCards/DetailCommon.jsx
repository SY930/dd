import styles from './index.less';
import { Tooltip } from 'antd';
import moment from 'moment';
import { CARD_QUERY, CARD_UPDATE } from "../../../../constants/authorityCodes";
import Authority from '../../../../components/common/Authority';
const { tc, tr, tooltip_fix } = styles;

export const STATISTICS_COLUMS = [
    {
        title: '已开卡',
        dataIndex: 'giftStatus',
        className: 'x-tc',
    }, {
        title: '已发卡',
        dataIndex: 'createdNum',
        className: 'x-tr',
    }, {
        title: '已同步',
        dataIndex: 'soldNum',
        className: 'x-tr',
    }, {
        title: '已作废',
        dataIndex: 'rechargedNum',
        className: 'x-tr',
    }, {
        title: '已使用',
        dataIndex: 'cancelledNum',
        className: 'x-tr',
    }, {
        title: '已过期',
        dataIndex: 'totalSum',
        className: 'x-tr',
    }, {
        title: '总计',
        dataIndex: 'totalSum2',
        className: 'x-tr',
    },
]

export const BASE_INFO = [
    {
        title: '卡名称',
        key: 'templateName',
    },
    {
        title: '卡类型',
        key: 'templateTypeName',
    },
    {
        title: '卡种编号',
        key: 'kindsNo',
    },
    {
        title: '卡说明',
        key: 'description',
    },
]

const CARD_CHECK = ['待审核', '已审核', '已驳回'];
const activateCardOpts = [
    { label: '待审核', value: '1' },
    { label: '已审核', value: '2' },
    { label: '已驳回', value: '3' },
    { label: '已作废', value: '4' },
]
const SEND_CHECK = ['可审核', '待审核', '已驳回'];
const sendCardOpts = [
    { label: '可审核', value: '1' },
    { label: '待审核', value: '2' },
    { label: '已驳回', value: '3' },
]

const sendStatusOpts = [
    { label: '已推送', value: '1' },
    { label: '未推送', value: '2' },
]
const CARD_STATUS = ['已开卡', '已发卡', '已同步', '已作废', '已使用', '已过期'];
const cardStatusOpts = [
    { label: '已开卡', value: '1' },
    { label: '已发卡', value: '2' },
    { label: '已使用', value: '3' },
    { label: '已过期', value: '4' },
]

export const FORM_ITEMS = {
    taskNo: {
        type: 'text',
        label: '开卡任务编号',
    },
    description: {
        type: 'text',
        label: '描述',
    },
    auditStatus: {
        type: 'combo',
        label: '审核状态',
        options: [{ value: '', label: '全部' }, ...activateCardOpts],
        defaultValue: '',
    },
    activateCardCheck: {
        type: 'combo',
        label: '开卡审核',
        options: [{ value: '', label: '全部' }, ...activateCardOpts],
        defaultValue: '',
    },
    sendCardCheck: {
        type: 'combo',
        label: '发卡审核',
        options: [{ value: '', label: '全部' }, ...sendCardOpts],
        defaultValue: '',
    },
    applyForCreateTime: {
        type: 'datepickerRange',
        label: '申请开卡时间',
        props: {},
    },
    createTime: {
        type: 'datepickerRange',
        label: '创建时间',
        props: {},
    },
    openCardTime: {
        type: 'datepickerRange',
        label: '开卡时间',
        props: {},
    },
    sendCardTime: {
        type: 'datepickerRange',
        label: '发卡时间',
        props: {},
    },
    pushTime: {
        type: 'datepickerRange',
        label: '推送时间',
        props: {},
    },
    cardOutSideNo: {
        type: 'text',
        label: '卡外码',
    },
    sendStatus: {
        type: 'combo',
        label: '推送状态',
        options: [{ value: '', label: '全部' }, ...sendStatusOpts],
        defaultValue: '',
    },
    cardInnerNo: {
        type: 'text',
        label: '卡内码',
    },
    status: {
        type: 'combo',
        label: '卡状态',
        options: [{ value: '', label: '全部' }, ...cardStatusOpts],
        defaultValue: '',
    },
    isPush: {
        type: 'combo',
        label: '是否推送sap',
        options: [{ value: '', label: '全部' }, { value: '1', label: '是' }, { value: '0', label: '否' },],
        defaultValue: '',
    },
    companyCode: {
        label: '制定运营中心',
        type: 'combo',
        options: [],
        props: {
            placeholder: '请选择',
            showSearch: true,
            optionFilterProp: 'children',
            allowClear: true,
        },
    },
    q: {
        type: 'custom',
        label: '',
        render: null,
    },
    activeCard: {
        type: 'custom',
        label: '',
        render: null,
    },
    checkCard: {
        type: 'custom',
        label: '',
        render: null,
    },
    sendCard: {
        type: 'custom',
        label: '',
        render: null,
    },
    push: {
        type: 'custom',
        label: '',
        render: null,
    },
    exportEXCEL: {
        type: 'custom',
        label: '',
        render: null,
    },
    cancel: {
        type: 'custom',
        label: '',
        render: null,
    },
    cancelCancel: {
        type: 'custom',
        label: '',
        render: null,
    }
}

export const CARD_DETAIL_TABS = {
    'pCard': [
        { tab: '开卡', key: 'openCard' },
        { tab: '发卡', key: 'cardSend' },
        // { tab: '卡推送sap', key: 'cardSync' },
        { tab: '卡汇总', key: 'cardTotal' },
    ],
    'eCard': [{ tab: '发卡', key: 'cardSend' },]
}

const renderOpeartion = (record, handleOperate) => {
    if ([1, 2].includes(record.auditStatus)) {
        //开卡审核状态为待审核显示空【详情】
        //开卡审核状态为已审核显示【详情】
        return [
            <Authority rightCode={CARD_QUERY}>
                <a key="preview" onClick={() => handleOperate('preview', record)}>详情</a>
            </Authority>
        ]
    } else if ([3, 4].includes(record.auditStatus)) {
        //开卡审核状态为已驳回显示【编辑】
        return [
            <Authority rightCode={CARD_UPDATE}>
                <a key="edit" onClick={() => handleOperate('edit', record)}>编辑</a>
            </Authority>]
    }
}

const renderLongText = (text) => {
    return (
        <Tooltip title={text} >
            {text || '--'}
        </Tooltip>);
}

const renderLongDes = (v) => {
    return (
        <Tooltip title={v} overlayStyle={{ overflowWrap: 'break-word', wordBreak: 'normal' }}>
            <span className={tooltip_fix}>
                {v || '--'}
            </span>
        </Tooltip>);
};

const renderTime = (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--';
const renderTimeNew = (text) => {
    if (text === '0') {
        return '--'
    }
    return moment(text, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
}

const renderColor = (text) => {
    switch (text) {
        case '待审核':
            return <span style={{ color: '#faad14' }}>{text}</span>
        case '已审核':
            return <span style={{ color: '#52c41a' }}>{text}</span>
        case '已驳回':
            return <span style={{ color: '#f5222d' }}>{text}</span>
        default:
            return text;
    }
}

const renderItem = (key, { handleOperate }) => {
    const colums_obj = {
        idx: {
            width: 50, title: '序号', dataIndex: 'idx', className: tc, render: (text, record, index) => index + 1
        },
        operation: {
            width: 50, title: '操作', dataIndex: 'opearation', render: (text, reocrd) => renderOpeartion(reocrd, handleOperate)
        },
        taskNo: {
            width: 120, title: '开卡任务编号', dataIndex: 'taskNo', render: renderLongText
        },
        ftaskNo: {
            width: 120, title: '发卡任务编号', dataIndex: 'taskNo', render: renderLongText
        },
        cardStartNo: {
            width: 100, title: '开始卡号', dataIndex: 'cardStartNo', render: renderLongText
        },
        cardEndNo: {
            width: 100, title: '结束卡号', dataIndex: 'cardEndNo', render: renderLongText
        },
        openNum: {
            width: 80, title: '数量', dataIndex: 'openNum', render: renderLongText
        },
        auditStatusName: {
            width: 100, title: '审核状态', dataIndex: 'auditStatusName', className: tc, render: renderColor
        },
        postBy: {
            width: 120, title: '申请人', dataIndex: 'postBy', render: (text) => text ? text : '--'
        },
        createStamp: {
            width: 140, title: '创建时间', dataIndex: 'createStamp', render: renderTime
        },
        auditTime: {
            width: 140, title: '审核时间', dataIndex: 'auditTime', render: renderTimeNew,
        },
        auditBy: {
            width: 120, title: '审核人', dataIndex: 'auditBy', render: renderLongText
        },
        createBy: {
            width: 120, title: '创建人', dataIndex: 'createBy', render: renderLongText
        },
        description: {
            width: 120, title: '描述', dataIndex: 'description', render: renderLongDes
        },
        expirationType: {
            width: 200, title: '有效期', dataIndex: 'expirationType',
            render: (text, { expirationStartDate, expirationEndDate }) => {
                if (text === 1) return '立即生效，永久有效';
                if (text === 2) {
                    const startTime = expirationStartDate ? moment(expirationStartDate).format('YYYY-MM-DD') : '--';
                    const endTime = expirationEndDate ? moment(expirationEndDate).format('YYYY-MM-DD') : '--';
                    return `${startTime} 至 ${endTime}有效`;
                };
            }
        },
        cardInnerNo: {
            width: 160, title: '卡内码', dataIndex: 'cardInnerNo', render: renderLongText
        },
        cardOutSideNo: {
            width: 100, title: '卡外码', dataIndex: 'cardOutSideNo', render: renderLongText
        },
        sendCheck: {
            width: 100, title: '发卡审核', dataIndex: 'sendCheck', render: (text) => SEND_CHECK[text] || '--'
        },
        openCardTime: {
            width: 140, title: '开卡时间', dataIndex: 'openCardTime', render: renderTimeNew
        },
        applyfortime: {
            width: 140, title: '申请发卡时间', dataIndex: 'applyfortime', render: renderTime
        },
        pushStatus: {
            width: 100, title: '推送状态', dataIndex: 'pushStatus', render: (text) => text === 1 ? '已推送' : '未推送'
        },
        sendCardTime: {
            width: 140, title: '发卡时间', dataIndex: 'sendCardTime', render: renderTimeNew
        },
        syncTime: {
            width: 140, title: '推送时间', dataIndex: 'syncTime', render: renderTimeNew
        },
        statusName: {
            width: 100, title: '卡状态', dataIndex: 'statusName', className: tc
        },
        sumPrice: {
            width: 100, title: '卡内金额合计', dataIndex: 'sumPrice', className: tr,
        },
        payAblePrice: {
            width: 140, title: '应付款金额合计', dataIndex: 'payAblePrice', className: tr,
        },
        paidPrice: {
            width: 140, title: '已付款金额', dataIndex: 'paidPrice', className: tr,
        },
        companyName: {
            width: 140, title: '定制运营中心', dataIndex: 'companyName', render: renderLongText
        },
        isPushName: {
            width: 140, title: '是否推送sap', dataIndex: 'isPushName',
        },
        cardExplain: {
            width: 140, title: '卡说明', dataIndex: 'cardExplain', render: renderLongText
        },
        facePrice: {
            width: 80, title: '卡面值', dataIndex: 'facePrice', className: tr, render: renderLongText
        },
        cardNum: {
            width: 80, title: '卡数量', dataIndex: 'cardNum', className: tr, render: renderLongText
        },
        discountRate: {
            width: 80, title: '折扣比率', dataIndex: 'discountRate', className: tr, render: renderLongText
        },
        discountPrice: {
            width: 100, title: '总折扣金额', dataIndex: 'discountPrice', className: tr, render: renderLongText
        },
        payAblePrice: {
            width: 80, title: '付款金额', dataIndex: 'payAblePrice', className: tr, render: renderLongText
        },
        minConsume: {
            width: 120, title: '单张卡最低消费', dataIndex: 'minConsume', className: tr, render: renderLongText
        }
    }
    return colums_obj[key]
}

export const DETAIL_CONFIG = {
    'openCard': {
        formKeys: ['taskNo', 'description', 'auditStatus', 'createTime', 'q', ],
        columnsKey: ['idx', 'operation', 'taskNo', 'cardStartNo', 'cardEndNo', 'openNum', 'auditStatusName', 'createStamp', 'createBy', 'auditTime', 'auditBy', 'description', 'expirationType',],
        columns: (params) => {
            return DETAIL_CONFIG['openCard'].columnsKey.map(key => renderItem(key, params));
        },
        btnList: ['activeCard', 'checkCard', 'cancel', 'cancelCancel', 'exportEXCEL',],
        scroll: { x: 1320 },
        listMethod: 'cardOpenTask/queryCardOpenTaskList.ajax',
        operationMethod: ['cardOpenTask', 'CardOpenTask.ajax'],
        createTime: {
            'startTime': 'startTime',
            'endTime': 'endTime',
        }
    },
    'cardSend': {
        formKeys: ['taskNo', 'description', 'auditStatus', 'companyCode', 'isPush', 'createTime', 'q', ],
        columnsKey: ['idx', 'operation', 'ftaskNo', 'description', 'sumPrice', 'payAblePrice', 'paidPrice', 'auditStatusName', 'createStamp', 'createBy', 'companyName', 'auditTime', 'auditBy', 'isPushName'],
        columns: (params) => {
            return DETAIL_CONFIG['cardSend'].columnsKey.map(key => renderItem(key, params));
        },
        btnList: ['sendCard', 'cancel', 'cancelCancel', 'push', 'checkCard'],
        scroll: { x: 1590 },
        listMethod: 'cardSendTask/queryCardSendTaskList.ajax',
        operationMethod: ['cardSendTask', 'CardSendTask.ajax'],
        createTime: {
            'startTime': 'startTimeStr',
            'endTime': 'endTimeStr',
        }
    },
    'cardSync': {
        formKeys: ['taskNo', 'sendStatus', 'createTime', 'cardOutSideNo', 'q', ],
        columnsKey: ['idx', 'cardInnerNo', 'cardOutSideNo', 'paidPrice', 'pushStatus', 'openCardTime', 'sendCardTime', 'pushTime', 'description', 'expirationType',],
        columns: (params) => {
            return DETAIL_CONFIG['cardSync'].columnsKey.map(key => renderItem(key, params));
        },
        btnList: ['push',],
        scroll: { x: 1450 }
    },
    'cardTotal': {
        formKeys: ['cardInnerNo', 'cardOutSideNo', 'status', 'openCardTime', 'sendCardTime', 'q'],
        columnsKey: ['idx', 'cardInnerNo', 'cardOutSideNo', 'facePrice', 'statusName', 'openCardTime', 'sendCardTime', 'syncTime', 'description', 'expirationType',],
        columns: (params) => {
            return DETAIL_CONFIG['cardTotal'].columnsKey.map(key => renderItem(key, params));
        },
        btnList: [],
        scroll: { x: 1230 },
        listMethod: 'cardInfo/queryCardInfoList.ajax',
        operationMethod: ['cardTotal', 'CardTotal.ajax'],
    }
}

export const ECARD_FORM_KEYS = ['taskNo', 'description', 'auditStatus', 'companyCode', 'createTime', 'q', 'sendCard', 'cancel', 'cancelCancel', 'push', 'checkCard']

export const OPERATION = {
    'PASS': 1,
    'REJECT': 2,
    'CANCEL': 3,
    'CANCEL_CANCEL': 4,
}

export const MODAL_CONFIG = {
    'pass': {
        checkTips: '只可对待审批的数据进行审核',
        unselectedTips: '请先选择要通过的数据~',
        operateType: OPERATION.PASS
    },
    'reject': {
        title: '确定将所选数据驳回吗？',
        checkTips: '只可对待审批的数据进行审核',
        unselectedTips: '请先选择要驳回的数据~',
        type: 'warning',
        operateType: OPERATION.REJECT
    },
    'push': {
        title: '确定要将所选卡片推送sap吗？',
        checkTips: '只可对已审核的数据进行推送sap',
        unselectedTips: '请先选择要推送的数据~',
        type: 'warning'
    },
    'cancel': {
        title: '确定将所选数据作废么？',
        unselectedTips: '请先选择要作废的数据~',
        checkTips: '只可对待审核的数据进行作废~',
        type: 'warning',
        operateType: OPERATION.CANCEL
    },
    'cancelCancel': {
        title: '确定将所选数据取消作废么？',
        unselectedTips: '请先选择要取消作废的数据~',
        checkTips: '只有已作废状态下的卡可取消作废~',
        type: 'warning',
        operateType: OPERATION.CANCEL_CANCEL
    },
    'sendCard': {
        title: '发卡',
        okBtn: '确定提交审核',
        type: 'info'
    }
}

export const DETAIL_COLUMS_KEYS = ['cardStartNo', 'cardEndNo', 'cardNum', 'facePrice', 'discountRate', 'sumPrice', 'discountPrice', 'payAblePrice', 'minConsume']
export const E_DETAIL_COLUMS_KEYS = ['cardNum', 'facePrice', 'discountRate', 'sumPrice', 'discountPrice', 'payAblePrice', 'minConsume']

export const getDetailColums = (templateType) => {
    if (templateType === 'A') {
        return E_DETAIL_COLUMS_KEYS.map(key => renderItem(key, { handleOperate: () => { } }));
    }
    return DETAIL_COLUMS_KEYS.map(key => renderItem(key, { handleOperate: () => { } }));
}

