import { defineMessages, FormattedMessage } from 'react-intl';

const COMMON_STRING = {
    save: {
        id: 'Common.Label.save',
        defaultMessage: '保存12',
    },
    confirm: {
        id: 'Common.Label.confirm',
        defaultMessage: '确定',
    },
    cancel: {
        id: 'Common.Label.cancel',
        defaultMessage: '取消',
    },
    close: {
        id: 'Common.Label.close',
        defaultMessage: '关闭',
    },
    query: {
        id: 'Common.Label.query',
        defaultMessage: '查询',
    },
    create: {
        id: 'Common.Label.create',
        defaultMessage: '新建',
    },
    complete: {
        id: 'Common.Label.complete',
        defaultMessage: '完成',
    },
    edit: {
        id: 'Common.Label.edit',
        defaultMessage: '编辑',
    },
    copy: {
        id: 'Common.Label.copy',
        defaultMessage: '复制',
    },
    enable: {
        id: 'Common.Label.enable',
        defaultMessage: '启用',
    },
    disable: {
        id: 'Common.Label.disable',
        defaultMessage: '禁用',
    },
    delete: {
        id: 'Common.Label.delete',
        defaultMessage: '删除',
    },
    sort: {
        id: 'Common.Label.sort',
        defaultMessage: '排序',
    },
    detail: {
        id: 'Common.Label.detail',
        defaultMessage: '详情',
    },
    view: {
        id: 'Common.Label.view',
        defaultMessage: '查看',
    },
    goback: {
        id: 'Common.Label.goback',
        defaultMessage: '返回',
    },
    export: {
        id: 'Common.Label.export',
        defaultMessage: '导出',
    },
    serialNumber: {
        id: 'Common.Label.serialNumber',
        defaultMessage: '序号',
    },
    actions: {
        id: 'Common.Label.actions',
        defaultMessage: '操作',
    },
    status: {
        id: 'Common.Label.status',
        defaultMessage: '状态',
    },
    download: {
        id: 'Common.Label.download',
        defaultMessage: '下载',
    },
    retry: {
        id: 'Common.Label.retry',
        defaultMessage: '重试',
    },
    remark: {
        id: 'Common.Label.remark',
        defaultMessage: '备注',
    },
    refresh: {
        id: 'Common.Label.refresh',
        defaultMessage: '刷新',
    },
};

let COMMON_LABEL = defineMessages({
    save: {
        id: 'Common.Label.save',
        defaultMessage: '保存',
    },
    confirm: {
        id: 'Common.Label.confirm',
        defaultMessage: '确定',
    },
    cancel: {
        id: 'Common.Label.cancel',
        defaultMessage: '取消',
    },
    close: {
        id: 'Common.Label.close',
        defaultMessage: '关闭',
    },
    query: {
        id: 'Common.Label.query',
        defaultMessage: '查询',
    },
    create: {
        id: 'Common.Label.create',
        defaultMessage: '新建',
    },
    complete: {
        id: 'Common.Label.complete',
        defaultMessage: '完成',
    },
    edit: {
        id: 'Common.Label.edit',
        defaultMessage: '编辑',
    },
    copy: {
        id: 'Common.Label.copy',
        defaultMessage: '复制',
    },
    enable: {
        id: 'Common.Label.enable',
        defaultMessage: '启用',
    },
    disable: {
        id: 'Common.Label.disable',
        defaultMessage: '禁用',
    },
    delete: {
        id: 'Common.Label.delete',
        defaultMessage: '删除',
    },
    sort: {
        id: 'Common.Label.sort',
        defaultMessage: '排序',
    },
    detail: {
        id: 'Common.Label.detail',
        defaultMessage: '详情',
    },
    view: {
        id: 'Common.Label.view',
        defaultMessage: '查看',
    },
    goback: {
        id: 'Common.Label.goback',
        defaultMessage: '返回',
    },
    export: {
        id: 'Common.Label.export',
        defaultMessage: '导出',
    },
    serialNumber: {
        id: 'Common.Label.serialNumber',
        defaultMessage: '序号',
    },
    actions: {
        id: 'Common.Label.actions',
        defaultMessage: '操作',
    },
    status: {
        id: 'Common.Label.status',
        defaultMessage: '状态',
    },
    download: {
        id: 'Common.Label.download',
        defaultMessage: '下载',
    },
    retry: {
        id: 'Common.Label.retry',
        defaultMessage: '重试',
    },
    remark: {
        id: 'Common.Label.remark',
        defaultMessage: '备注',
    },
    refresh: {
        id: 'Common.Label.refresh',
        defaultMessage: '刷新',
    },
});

for (const key in COMMON_LABEL) {
    const val = COMMON_LABEL[key];
    COMMON_LABEL[key] = <FormattedMessage {...val} />;
}

export {
    COMMON_LABEL, COMMON_STRING,
};
