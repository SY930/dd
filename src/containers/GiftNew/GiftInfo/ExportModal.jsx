import React, { Component } from 'react';
import { Row, Col, Modal, Button, Table, message } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
import { axiosData } from '../../../helpers/util';
import Authority from '../../../components/common/Authority';
import styles from './GiftInfo.less';

function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label') || '--';
}
const ExportStatus = [
    { value: '1', label: '成功' },
    { value: '0', label: '失败' },
    { value: '2', label: '导出中' },
];
const COLUMNS = [{
    title: '序号',
    dataIndex: 'index',
    width: 20,
    className: styles.tdCenter,
    render: (text, record, index) => {
        return (
            <span>{index + 1}</span>
        );
    },
}, {
    title: '名称',
    dataIndex: 'recordName',
    className: 'TableTxtCenter',
    width: 230,
    render: (text) => {
        return <span style={{ whiteSpace: 'pre-wrap' }}>{text || '--'}</span>
    },
}, {
    title: '时间',
    dataIndex: 'createStamp',
    className: 'TableTxtCenter',
    width: 80,
}, {
    title: '状态',
    dataIndex: 'exportStatus',
    className: 'TableTxtCenter',
    width: 40,
    render: (text, record, index) => {
        return <span>{mapValueToLabel(ExportStatus, String(text))}</span>
    },
}, {
    title: '操作',
    dataIndex: 'payType',
    className: 'TableTxtCenter',
    width: 40,
    render(text, record) {
        return (
            <span>
                {
                    record.exportStatus == '1' ?
                        // <Authority rightCode="crm.huiyuandengjixin.query">
                        <a href="#" className="linkColor" onClick={this.handleDownLoad.bind(this, record)}>下载文件</a>
                        // </Authority>
                        :
                        null
                }
                {/* <Authority rightCode="crm.huiyuanquntidaochujilu.delete"> */}
                <a href="#" className="linkColor" onClick={this.handleDelete.bind(this, record)}>删除</a>
                {/* </Authority> */}
            </span>
        )
    },
},
];

export default class ExportModal extends Component {
    constructor(props) {
        super(props);
        this.data = {};
        this.state = {
            visible: true,
            dataSource: [],
            shopName: '',
            pageSizes: 10,
            loading: false,
        };
        this.columns = COLUMNS;
    }

    componentDidMount() {
        if (this.props.basicPromotion) {
            return axiosData('/crmimport/crmExportService_doExportPromotionInfo.ajax', {}, null, { path: 'data' })
            .then(_records => {
                setTimeout(() => {
                    this.getExportRecords();
                }, 500)
            })
        }
        if (this.props.specialPromotion) {
            return axiosData('/crmimport/crmExportService_doExportEventInfo.ajax', {}, null, { path: 'data' })
            .then(_records => {
                setTimeout(() => {
                    this.getExportRecords();
                }, 500)
            })
        }
        if (this.props._key) {
            this.exportRecords(this.props.giftItemID, this.props._key)
        } else if (this.props.newExport) {
            const {giftItemID, giftName } = this.props;
            const params = {giftItemID, giftName};
            if (this.props.activeKey === 'used') {
                params.giftStatus = '2'
            }
            axiosData('/crmimport/crmExportService_doExportGiftUsedInfo.ajax', params, null, { path: 'data' })
                .then(_records => {
                    this.getExportRecords(this.props._key);
                })
        } else {
            this.getExportRecords()
        }
    }
    exportRecords = (giftItemID, key) => {
        const data = {
            giftItemID,
            exportQuotaType: key === 'made' ? '3' : key === 'send' ? '2' : '4',
            ...this.props.params,
        }
        if (data.usingShopID) {
            data.usingShopName = this.props.shopData.toJS().find(shop => {
                return shop.shopID === data.usingShopID
            }).shopName
        } else {
            data.usingShopName = ''
        }
        axiosData('/crm/quotaCardExport/export.ajax', data, null, { path: 'data' })
            .then(_records => {
                this.getExportRecords(key)
            })
    }
    getExportRecords = (key) => {
        this.setState({ loading: true });
        let data = {}
        if (key) {
            data.exportQuotaType = key === 'made' ? '3' : key === 'send' ? '2' : '4';
        }
        if (this.props.newExport) {
            data.exportQuotaType = this.props.activeKey === 'used' ? '5' : '7';
        }
        if (this.props.basicPromotion) {
            data.exportQuotaType = '9';
        }
        if (this.props.specialPromotion) {
            data.exportQuotaType = '8';
        }
        axiosData('/crm/quotaCardExport/getRecords.ajax', data, null, { path: 'data' })
            .then(data => {
                const _Records = data.records ? data.records.map(item => ({ ...item, key: item.itemID })) : [];
                this.setState({
                    dataSource: _Records,
                    loading: false,
                })
            }).catch(e => {
            this.setState({
                loading: false
            })
        })
    }

    handleRefresh = () => {
        this.getExportRecords(this.props._key);
    }
    handleClose = () => {
        this.setState({
            visible: false,
        }, () => {
            this.props.handleClose()
        })
    }
    handleDownLoad = (record) => {
        window.open(record.filePath);
    }
    handleDelete = (record) => {
        axiosData('/crm/quotaCardExport/delete.ajax', { itemID: record.itemID }, null, { path: 'data' })
            .then(() => {
                message.success('删除成功');
                this.getExportRecords(this.props._key);
            });
    }
    handleClearAll = () => {
        const key = this.props._key;
        let data = {}
        if (key) {
            data.exportQuotaType = key === 'made' ? '3' : key === 'send' ? '2' : '4';
        }
        if (this.props.newExport) {
            data.exportQuotaType = this.props.activeKey === 'used' ? '5' : '7';
        }
        if (this.props.basicPromotion) {
            data.exportQuotaType = '9';
        }
        if (this.props.specialPromotion) {
            data.exportQuotaType = '8';
        }
        axiosData('/crm/quotaCardExport/delete.ajax', data, null, { path: 'data' })
            .then(() => {
                message.success('删除成功');
                this.getExportRecords(this.props._key);
            });
    }
    render() {
        return (
            <div>
                <Modal
                    style={{ top: 30 }}
                    title={'数据导出列表'}
                    width={'850px'}
                    maskClosable={false}
                    visible={this.state.visible}
                    wrapClassName={styles.crmShopCreditPayRecordWrap}
                    onCancel={() => this.handleClose()}
                    footer={
                        [<Button key={'close'} type="ghost" onClick={() => this.handleClose()}>关闭</Button>,
                        <Button key={'refresh'} type="ghost" onClick={() => this.handleRefresh()}>刷新</Button>,
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
                                    total: this.state.dataSource ? this.state.dataSource.length : 0,
                                    showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                                }}
                            />
                            { (!!this.state.dataSource && !!this.state.dataSource.length) && (
                                <Button
                                    type="ghost"
                                    onClick={this.handleClearAll}
                                    style={{
                                        position: 'absolute',
                                        left: 0,
                                        bottom: 18
                                    }}
                                >清空列表</Button>
                            )}
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

