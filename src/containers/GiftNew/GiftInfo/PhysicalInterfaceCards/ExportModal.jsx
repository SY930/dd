import React, { Component } from 'react';
import { Row, Col, Modal, Button, Table, message } from 'antd';
import { COMMON_LABEL } from 'i18n/common';
import _ from 'lodash';
import styles from '../GiftInfo.less';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_GIFT, COMMON_GIFT } from 'i18n/common/gift';
import { cardExport } from './AxiosFactory';

function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label') || '--';
}
const ExportStatus = [
    { value: '0', label: '正在导出' },
    { value: '1', label: '导出完成' },
];
const COLUMNS = [{
    title: COMMON_LABEL.serialNumber,
    dataIndex: 'index',
    width: 20,
    className: styles.tdCenter,
    render: (text, record, index) => {
        return (
            <span>{index + 1}</span>
        );
    },
}, {
    title: COMMON_GIFT.doj9y10hl09,
    dataIndex: 'fileName',
    className: 'TableTxtCenter',
    width: 200,
    render: (text) => {
        return <span style={{ whiteSpace: 'pre-wrap' }}>{text || '--'}</span>
    },
}, {
    title: COMMON_GIFT.doj9y10hl132,
    dataIndex: 'createStamp',
    className: 'TableTxtCenter',
    width: 110,
}, {
    title: COMMON_LABEL.status,
    dataIndex: 'exportFlag',
    className: 'TableTxtCenter',
    width: 40,
    render: (text, record, index) => {
        return <span>{mapValueToLabel(ExportStatus, String(text))}</span>
    },
}, {
    title: COMMON_LABEL.actions,
    dataIndex: 'payType',
    className: 'TableTxtCenter',
    width: 40,
    render(text, record) {
        return (
            <span>
                {
                    record.exportFlag === 1 ?
                        <a href="#" className="linkColor" onClick={this.handleDownLoad.bind(this, record)}>{COMMON_LABEL.download}</a>
                        :
                        null
                }
                <a href="#" className="linkColor" onClick={this.handleDelete.bind(this, record)}>{COMMON_LABEL.delete}</a>
            </span>
        )
    },
},
];
@injectIntl
export default class ExportModal extends Component {
    constructor(props) {
        super(props);
        this.data = {};
        this.state = {
            dataSource: [],
            shopName: '',
            pageSizes: 10,
            loading: false,
            pageNo: 1,
            total: 0,
        };
        this.columns = COLUMNS;
    }

    componentDidMount() {
        this.fetchList();
    }

    fetchList = () => {
        const { templateID, groupID } = this.props;
        const { pageNo, pageSizes } = this.state;
        cardExport({
            templateID,
            groupID,
            pageNo,
            pageSizes,
        }, 'taskExportList').then(res => {
            if (res) {
                const { list = [], page = {} } = res;
                this.setState({ dataSource: list, pageSizes: page.pageSize, pageNo: page.pageNo, total: page.totalSize });
            }
        })
    }

    handleRefresh = () => {
        this.fetchList();
    }

    handleDownLoad = (record) => {
        window.open(record.filePath);
    }

    handleDelete = (record) => {
        const { templateID, groupID } = this.props;
        cardExport({
            templateID,
            groupID,
            itemID: record.itemID,
            deleteType: 1, //删除类型：1单条删除，2清空列表
        }, 'deleteTaskExport').then(res => {
            if (res) {
                message.success('删除成功~');
                const { total, pageNo, pageSizes } = this.state;
                if ((total - 1) <= (pageNo - 1) * pageSizes) {
                    this.setState({ pageNo: pageNo > 1 ? pageNo - 1 : 1 }, this.fetchList);
                }else {
                    this.fetchList()
                }
            }
        })
    }

    handleClearAll = () => {
        const { templateID, groupID } = this.props;
        cardExport({
            templateID,
            groupID,
            deleteType: 2, //删除类型：1单条删除，2清空列表
        }, 'deleteTaskExport').then(res => {
            if (res) {
                message.success('删除成功~');
                this.setState({ dataSource: [], pageNo: 1, total: 0 });
            }
        })
    }

    render() {
        const { visible, handleClose } = this.props;
        return (
            <div>
                <Modal
                    style={{ top: 30 }}
                    title={this.props.intl.formatMessage(STRING_GIFT.d1dv3i58lj530)}
                    width={'850px'}
                    maskClosable={false}
                    visible={visible}
                    wrapClassName={styles.crmShopCreditPayRecordWrap}
                    onCancel={handleClose}
                    footer={
                        [<Button key={'close'} type="ghost" onClick={handleClose}>{COMMON_LABEL.close}</Button>,
                        <Button key={'refresh'} type="ghost" onClick={() => this.handleRefresh()}>{COMMON_LABEL.refresh}</Button>,
                        ]}
                >
                    <Row>
                        <Col span={24}>
                            <Table
                                className={styles.rightAlignedPagination}
                                key={Math.random()}
                                scroll={{ y: this.state.tableHeight }}
                                bordered={true}
                                loading={this.state.loading}
                                columns={this.columns.map(c => (c.render ? ({
                                    ...c,
                                    render: c.render.bind(this),
                                }) : c))}
                                dataSource={this.state.dataSource}
                                pagination={{
                                    pageSize: this.state.pageSizes,
                                    current: this.state.pageNo,
                                    total: this.state.total,
                                    showTotal: (total, range) => `${this.props.intl.formatMessage(STRING_GIFT.d1qcckj09u2)}${range[0]}-${range[1]} / ${this.props.intl.formatMessage(STRING_GIFT.d1qcckj09u1)} ${total} ${this.props.intl.formatMessage(STRING_GIFT.d2c68skgm94)}`,
                                    onChange: (page, pageSize) => {
                                        this.setState({
                                            pageNo: page,
                                        },this.fetchList)
                                    },
                                }}
                            />
                            {(!!this.state.dataSource && !!this.state.dataSource.length) && (
                                <Button
                                    type="ghost"
                                    onClick={this.handleClearAll}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        bottom: 18
                                    }}
                                >{this.props.intl.formatMessage(STRING_GIFT.du2hnhcan645)}</Button>
                            )}
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

