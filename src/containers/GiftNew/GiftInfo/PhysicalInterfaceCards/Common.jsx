import React from 'react';
import { Tooltip } from 'antd';
import moment from 'moment';
import styles from './index.less';
import { CARD_QUERY, CARD_UPDATE, CARD_DELETE } from "../../../../constants/authorityCodes";
import Authority from '../../../../components/common/Authority';
const href = 'javascript:;';
const { tc, tr, tooltip_fix } = styles;


const templateTypeOpts = [
    // { label: '团购卡', value: 'D' },
    // { label: '免品卡', value: 'C' },
    // { label: '电子礼品卡', value: 'A' },
]
const cardTemplateStatusOpts = [
    { label: '已启用', value: '1' },
    { label: '已停用', value: '2' },
]
const cardCheckOpts = [
    { label: '开卡待审核', value: '1' },
    { label: '发卡待审核', value: '2' },
    { label: '开卡待审核/发卡待审核', value: '3' },
    { label: '暂无审核', value: '4' },
]
const cardStatusOpts = [
    { label: '已启用', value: '1' },
    { label: '已停用', value: '2' },
]
const cardCheckStatusOpts = [
    { label: '待审核', value: '1' },
    { label: '已审核', value: '2' },
    { label: '已驳回', value: '3' },
]
const pushStatusOpts = [
    { label: '已推送', value: '1' },
    { label: '未推送', value: '2' },
]

export const FORM_ITEMS = {
    templateName: {
        type: 'text',
        label: '卡名称',
    },
    kindsNo: {
        type: 'text',
        label: '卡种编号',
    },
    itemID: {
        type: 'text',
        label: '卡模板ID',
    },
    createBy: {
        type: 'text',
        label: '创建人',
    },
    templateType: {
        type: 'combo',
        label: '卡类型',
        options: [{ value: '', label: '全部' }, ...templateTypeOpts],
        defaultValue: '',
    },
    status: {
        type: 'combo',
        label: '卡模板状态',
        options: [{ value: '', label: '全部' }, ...cardTemplateStatusOpts],
        defaultValue: '1',
    },
    templateStatus: {
        type: 'combo',
        label: '开/发卡审核',
        options: [{ value: '', label: '全部' }, ...cardCheckOpts],
        defaultValue: '',
    },
    brandID: {
        label: '所属品牌',
        type: 'combo',
        options: [],
        props: {
            placeholder: '全部品牌',
            showSearch: true,
            optionFilterProp: 'children',
            allowClear: true,
        },
    },
    createTime: {
        type: 'datepickerRange',
        label: '创建时间',
        props: {},
    },
    cardKind: {
        type: 'text',
        label: '卡种类',
    },
    operation: {
        label: '制定运营中心',
        type: 'combo',
        options: [],
        props: {
            placeholder: '全部',
            showSearch: true,
            optionFilterProp: 'children',
            allowClear: true,
        },
    },
    cardStatus: {
        type: 'combo',
        label: '卡状态',
        options: [{ value: '', label: '全部' }, ...cardStatusOpts],
        defaultValue: '',
    },
    cardCheckStatus: {
        type: 'combo',
        label: '审核状态',
        options: [{ value: '', label: '全部' }, ...cardCheckStatusOpts],
        defaultValue: '',
    },
    pushStatus: {
        type: 'combo',
        label: '推送状态',
        options: [{ value: '', label: '全部' }, ...pushStatusOpts],
        defaultValue: '',
    },
    q: {
        type: 'custom',
        label: '',
        render: null,
    },
};

const CARD_TYPE = {
    'D': '团购卡',
    'C': '免品卡',
    'A': '电子礼品卡',
};
const CARD_STATUS = ['', '已启用', '已停用']
const CARD_CHECK = ['', '开卡待审核', '发卡待审核', '开卡待审核，发卡待审核', '暂无审核',]
const CHECK_STATUS = ['', '待审核', '已审核', '已驳回']

const OPERATION_LIST = [
    { key: 'edit', label: '编辑', status: '1', right: CARD_UPDATE },
    { key: 'preview', label: '查看', status: '1,2', right: CARD_QUERY },
    { key: 'stop', label: '停用', status: '1', right: CARD_DELETE },
    { key: 'detail', label: '详情', status: '1,2', right: CARD_QUERY },
];

const E_OPERATION_LIST = [
    { key: 'edit', label: '编辑', right: CARD_UPDATE },
    { key: 'preview', label: '查看', right: CARD_QUERY },
    { key: 'stop', label: '停用', right: CARD_DELETE },
]

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
const renderIdx = (index, pageObj = {}) => {
    return (<span>{index + 1}</span>);
};

const renderOpeartion = (record, handleOperate, pageType) => {
    const { status } = record;
    let list = []
    if (pageType === 'pCard') {
        //操作：需根据卡状态及当前卡是否有正在等待审批任务的情况进行详细展示
        //【已启用】状态下的卡模板可以进行（编辑、查看、停用、详情）
        //【已停用】状态下的卡模板可以进行（查看、详情）
        //当该卡已启用且暂无任何开卡/发卡记录时可以进行所有信息的编辑修改，但如果有记录了之后，只可编辑卡说明
        list = OPERATION_LIST.filter(item => {
            return item.status.includes(`${status}`);
        })
    } else {
        list = E_OPERATION_LIST;
    }
    return (
        <p>
            {
                list.map(item => {
                    return (
                        <Authority rightCode={item.right}>
                            <a href={href} onClick={() => { handleOperate(item.key, record) }}>{item.label}</a>
                        </Authority>)
                })
            }
        </p>
    )
}

const renderItem = (key, { pageObj, handleOperate, pageType }) => {
    const colums_obj = {
        idx: {
            width: 50, title: '序号', dataIndex: 'idx', className: tc, fixed: 'left', render: (text, record, index) => renderIdx(index, pageObj)
        },
        operation: {
            width: 150, title: '操作', dataIndex: 'opearation', fixed: 'left', render: (text, reocrd) => renderOpeartion(reocrd, handleOperate, pageType)
        },
        templateType: {
            width: 120, title: '卡类型', dataIndex: 'templateType', render: (text) => CARD_TYPE[text] || '--'
        },
        itemID: {
            width: 100, title: '卡模板ID', dataIndex: 'itemID'
        },
        templateName: {
            width: 200, title: '卡名称', dataIndex: 'templateName', render: renderLongText
        },
        description: {
            width: 300, title: '卡说明', dataIndex: 'description', render: renderLongDes
        },
        createBy: {
            width: 220, title: '创建人/修改人', dataIndex: 'createBy', className: tc, render: (text, record) => renderLongText(`${record.createBy || ''} / ${record.actionBy || ''}`)
        },
        createStampStr: {
            width: 260, title: '创建时间/修改时间', dataIndex: 'createStampStr', className: tc,
            render: (text, { createStamp, actionStamp }) => {
                const createStampStr = createStamp ? moment(createStamp).format('YYYY-MM-DD HH:mm:ss') : '';
                const actionStampStr = actionStamp ? moment(actionStamp).format('YYYY-MM-DD HH:mm:ss') : '';
                return `${createStampStr || '--'} / ${actionStampStr || '--'}`;
            }
        },
        templateStatusName: {
            width: 150, title: '开/发卡审核', fixed: 'left', dataIndex: 'templateStatusName', render: (text) => <span style={{ color: text !== '暂无审核' ? '#faad14' : 'auto' }}>{text}</span>
        },
        statusName: {
            width: 100, title: '卡模板状态', dataIndex: 'statusName', className: tc
        },
        templateTypeName: {
            width: 100, title: '卡种类', dataIndex: 'templateTypeName', render: renderLongText
        },
        cardValue: {
            width: 100, title: '卡面值', dataIndex: 'cardValue', render: renderLongText
        },
        cardPrice: {
            width: 100, title: '卡售价', dataIndex: 'cardPrice', render: renderLongText
        },
        pushStatus: {
            width: 100, title: '推送状态', dataIndex: 'pushStatus', render: (text) => text === 1 ? '已推送' : '未推送'
        },
        operate: {
            width: 120, title: '制定运营中心', dataIndex: 'opearate', render: renderLongText
        },
        eOperation: {
            width: 140, title: '操作', dataIndex: 'opearation', render: (text, reocrd) => renderOpeartion(reocrd, handleOperate, pageType)
        },
        outSideNo: {
            width: 120, title: '外卡码固定编号', dataIndex: 'outSideNo', render: renderLongText, className: tr
        },
        kindsNo: {
            width: 80, title: '卡种编号', fixed: 'left', dataIndex: 'kindsNo', render: renderLongText, className: tr
        }
    }
    return colums_obj[key]
}


export const EDIT_PAGE_FORM_ITEMS = {
    templateType: {
        type: 'radioButton',
        label: '卡类型',
        options: [
            // { label: '团购卡', value: 'D' },
            // { label: '免品卡', value: 'C' },
            // { label: '电子礼品卡', value: 'A' },
        ],
        rules: [{ required: true, message: '请选择卡类型' }],
        defaultValue: '1',
    },
    templateName: {
        type: 'text',
        label: '卡名称',
        rules: [
            'required',
            'stringLength',
            {
                message: '不多于20个字符',
                pattern: /^.{0,20}$/,
            }
        ],
    },
    kindsNo: {
        type: 'text',
        label: '卡种编号',
        rules: [
            { required: true, message: '卡种编号必填' },
            { len: 3, message: '卡种编号必须为3位' },
            { pattern: /^[0-9]*$/, message: '必须为数字' },
        ],
    },
    outSideNo: {
        type: 'text',
        label: '卡外码固定编号',
        rules: [
            { required: true, message: '卡外码固定编号必填' },
            { len: 2, message: '卡外码固定编号必须为2位' },
            { pattern: /^[0-9]*$/, message: '必须为数字' },
        ],
    },
    brandIDs: {
        label: '所属品牌',
        type: 'combo',
        multiple: true,
        options: [],
        props: {
            placeholder: '全部品牌',
            showSearch: true,
            optionFilterProp: 'children',
            allowClear: true,
        },
    },
    description: {
        label: '卡说明',
        type: 'textarea',
        placeholder: '最大输入限制500字符',
        rules: [
            { required: true, message: '卡说明内容不能为空' },
            { max: 500, message: '最多500个字符' },
        ],
    },
}


export const CARDS = {
    'pCard': {
        title: '实体卡',
        formKeys: ['templateName', 'kindsNo', 'templateType', 'status', 'templateStatus', 'createBy', 'createTime', 'q'],
        columnsKey: ['idx', 'operation', 'templateStatusName', 'kindsNo', 'templateType', 'templateName', 'description', 'outSideNo', 'statusName', 'createBy', 'createStampStr',],
        columns: (params) => {
            return CARDS['pCard'].columnsKey.map(key => renderItem(key, params));
        },
        style: { maxWidth: 1780 },
        editPageFormKeys: ['templateType', 'templateName', 'kindsNo', 'outSideNo', 'description'],
        pageTitle: '非会员实体卡'
    },
    'eCard': {
        title: '电子礼品卡',
        formKeys: ['templateName', 'itemID', 'templateTypeName', 'createBy', 'operation', 'cardStatus', 'cardCheckStatus', 'pushStatus', 'createTime', 'q', 'checkCard', 'push'],
        columnsKey: ['idx', 'eOperation', 'templateStatusName', 'statusName', 'templateTypeName', 'itemID', 'templateName', 'cardValue', 'cardPrice', 'description', 'pushStatus', 'operate', 'createBy', 'createStampStr'],
        columns: (params) => {
            return CARDS['eCard'].columnsKey.map(key => renderItem(key, params));
        },
        style: { maxWidth: 1850 },
        editPageFormKeys: ['templateType', 'templateName', 'kindsNo', 'description'],
        pageTitle: '电子礼品卡'
    }
}

export const formItemLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 17 },
};

export const PAGE_TYPE = {
    'add': {
        title: '新增',
        getDisabledKeys: () => []
    },
    'edit': {
        title: '编辑',
        getDisabledKeys: (item) => {
            //当该卡已启用且暂无任何开卡/发卡记录时可以进行所有信息的编辑修改，但如果有记录了之后，只可编辑卡说明
            if (item.templateStatus === 5) {
                return []
            } else {
                return ['templateType', 'templateName', 'kindsNo', 'outSideNo',]
            }

        }
    },
    'preview': {
        title: '查看',
        getDisabledKeys: () => ['templateType', 'templateName', 'kindsNo', 'outSideNo', 'description']
    },
}



