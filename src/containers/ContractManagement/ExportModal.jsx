import React, { Component } from 'react';
import { Row, Col, Modal, Button, Table, message } from 'antd';
import { COMMON_LABEL } from 'i18n/common';
import _ from 'lodash';
import styles from './GontractInfo.less';
import { downloadFile} from '../../helpers/util';
import { injectIntl } from 'i18n/common/injectDecorator'
import { STRING_GIFT, COMMON_GIFT } from 'i18n/common/gift';
import { contractExportGetRecords,contractExportDelete } from './Controller/index'

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
        this.getExportRecords()
    }
    getExportRecords = async (key) => {
        this.setState({ loading: true });

    const res = await contractExportGetRecords()

    if(res.code === '000'){
           const _Records = res.data.records ? res.data.records.map(item => ({ ...item, key: item.itemID })) : [];
                this.setState({
                    dataSource: _Records,
                    loading: false,
                })
    } else {
             this.setState({
                loading: false
            })  
    }
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
        downloadFile(record.filePath)
        // window.open(record.filePath);
    }
    handleDelete = async (record) => {


        const res = await contractExportDelete({ itemID: record.itemID })
        if(res.code === '000'){
            message.success(COMMON_GIFT.doj9y10hl476);
            this.getExportRecords(this.props._key);
        }
    }
    handleClearAll = async () => {

        const res = await contractExportDelete()
        if(res.code === '000'){
            message.success(COMMON_GIFT.doj9y10hl476);
            this.getExportRecords(this.props._key);
        }
    }
    render() {
        // const { sameItemID } = this.props;
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
                                // rowClassName={(record, index)=>{
                                //     const { itemID } = record;
                                //     let clz = '';
                                //     if(`${sameItemID}` === itemID){
                                //         clz = styles.trclz;
                                //     }
                                //     return clz;
                                // }}

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

