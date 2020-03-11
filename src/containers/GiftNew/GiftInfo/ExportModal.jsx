import React, { Component } from 'react';
import { Row, Col, Modal, Button, Table, message } from 'antd';
import { COMMON_LABEL } from 'i18n/common';
import _ from 'lodash';
import { axiosData } from '../../../helpers/util';
import Authority from '../../../components/common/Authority';
import styles from './GiftInfo.less';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_GIFT, COMMON_GIFT } from 'i18n/common/gift';

function mapValueToLabel(cfg, val) {
    return _.result(_.find(cfg, { value: val }), 'label') || '--';
}
const ExportStatus = [
    { value: '1', label: COMMON_GIFT.d1dv0btfl3066 },
    { value: '0', label: COMMON_GIFT.doj9y10hl240 },
    { value: '2', label: COMMON_GIFT.d1dv3i58lj319 },
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
    dataIndex: 'recordName',
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
    dataIndex: 'exportStatus',
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
                    record.exportStatus == '1' ?
                        <a href="#" className="linkColor" onClick={this.handleDownLoad.bind(this, record)}>{ COMMON_LABEL.download }</a>
                        :
                        null
                }
                <a href="#" className="linkColor" onClick={this.handleDelete.bind(this, record)}>{ COMMON_LABEL.delete }</a>
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
            visible: true,
            dataSource: [],
            shopName: '',
            pageSizes: 10,
            loading: false,
            pageNo: 1,
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
                message.success(COMMON_GIFT.doj9y10hl476);
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
                message.success(COMMON_GIFT.doj9y10hl476);
                this.getExportRecords(this.props._key);
            });
    }
    render() {
        return (
            <div>
                <Modal
                    style={{ top: 30 }}
                    title={this.props.intl.formatMessage(STRING_GIFT.d1dv3i58lj530)}
                    width={'850px'}
                    maskClosable={false}
                    visible={this.state.visible}
                    wrapClassName={styles.crmShopCreditPayRecordWrap}
                    onCancel={() => this.handleClose()}
                    footer={
                        [<Button key={'close'} type="ghost" onClick={() => this.handleClose()}>{ COMMON_LABEL.close }</Button>,
                        <Button key={'refresh'} type="ghost" onClick={() => this.handleRefresh()}>{ COMMON_LABEL.refresh }</Button>,
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
                                    total: this.state.dataSource ? this.state.dataSource.length : 0,
                                    showTotal: (total, range) => `${this.props.intl.formatMessage(STRING_GIFT.d1qcckj09u2)}${range[0]}-${range[1]} / ${this.props.intl.formatMessage(STRING_GIFT.d1qcckj09u1)} ${total} ${this.props.intl.formatMessage(STRING_GIFT.d2c68skgm94)}`,
                                    onChange: (page, pageSize) => {
                                        this.setState({
                                            pageNo: page,
                                        })
                                    },
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
                                >{this.props.intl.formatMessage(STRING_GIFT.du2hnhcan645)}</Button>
                            )}
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

