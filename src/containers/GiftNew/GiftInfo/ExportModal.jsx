import React, { Component } from 'react';
import { Row, Col, Modal, Button, Table, message } from 'antd';
import { connect } from 'react-redux';
import _ from 'lodash';
// import { COLUMNS } from './CrmGroupExportRecordConfig';
// import {
//     ExportRecordModalVisible,
//     FetchExportRecordList,
// } from './_action.js';
import { fetchData } from '../../../helpers/util';
// import Authority from '../../components/Authority';
// import styles from '../CrmCardInfo/CrmCustomerContainer/export.less';
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
    width: 40,
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
    width: 120,
    render: (text) => {
        return <span>{text || '--'}</span>
    },
}, {
    title: '时间',
    dataIndex: 'createStamp',
    className: 'TableTxtRight',
    width: 60,
}, {
    title: '状态',
    dataIndex: 'exportStatus',
    className: 'TableTxtLeft',
    width: 60,
    render: (text, record, index) => {
        return <span>{mapValueToLabel(ExportStatus, String(text))}</span>
    },
}, {
    title: '操作',
    dataIndex: 'payType',
    className: 'TableTxtLeft',
    width: 60,
    render(text, record) {
        return (
            <span>
                {
                    record.exportStatus  == '1' ? 
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
            // visible: true,
            visible: false,
            dataSource: [],
            shopName: '',
            pageSizes: 10,
            loading: false,
        };
        this.columns = COLUMNS;
    }

    componentWillMount() {
        // this.setState({
        //     visible: this.props.$$exportVisible||false,
        // });
    }

    componentWillReceiveProps(nextProps) {
        const { exportVisible, } = nextProps;
        // const records = $$exportRecords || [];
        // const _records = records.map(item => ({ ...item, key: item.itemID }));
        this.setState({
            visible: exportVisible,
            pageSizes: 10,
            // dataSource: _records,
        });
        // if ($$exportVisible === true) {
        //     this.getExportRecords();
        // }
    }
    componentWillUnmount() {

    }
    getExportRecords = () => {
        // const { FetchExportRecordListAC } = this.props;

        // FetchExportRecordListAC({ pageNo: 1, pageSize: 10 }).then((_records) => {
        //     this.setState({
        //         loading: true,
        //     }, () => {
        //         setTimeout(() => {
        //             const _Records = _records.map(item => ({ ...item, key: item.itemID }));
        //             this.setState({
        //                 dataSource: _Records || [],
        //                 loading: false,
        //             })
        //         }, 500)
        //     });
        // }).catch(() => {
        //     this.setState({
        //         loading: false,
        //     })
        // })
    }
    handleRefresh = () => {
        // this.getExportRecords();
    }
    handleClose = () => {
        // const { ExportRecordModalVisibleAC } = this.props;
        this.setState({
            visible: false,
        })
        // ExportRecordModalVisibleAC({ visible: false });
    }
    handleDownLoad = (record) => {
        window.open(record.filePath);
    }
    handleDelete = (record) => {
        // fetchData('groupMembersExportDelete', { itemID: record.itemID }, null, { path: 'data' })
        //     .then(() => {
        //         message.success('删除成功');
        //         const { FetchExportRecordListAC } = this.props;
        //         FetchExportRecordListAC({});
        //     });
    }
    handleClearAll = () => {
        // fetchData('groupMembersExportDelete', {}, null, { path: 'data' })
        //     .then(() => {
        //         message.success('清空列表成功');
        //         const { FetchExportRecordListAC } = this.props;
        //         FetchExportRecordListAC({});
        //     });
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
                        <Col span={24} className={styles.shopWrap} style={{ textAlign: 'right' }}>
                            {/* <Authority rightCode="crm.huiyuanquntidaochujilu.delete"> */}
                                <Button type="ghost" onClick={this.handleClearAll}>清空列表</Button>
                            {/* </Authority> */}
                        </Col>
                        <Col span={24}>
                            <Table
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
                                    // showQuickJumper:true,
                                    // showSizeChanger:true,
                                    // onShowSizeChange:this.onShowSizeChange,
                                    total: this.state.records ? this.state.records.length : 0,
                                    showTotal: (total, range) => `本页${range[0]}-${range[1]} / 共 ${total} 条`,
                                }}
                            />
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

// function mapStateToProps({ crm_group: group }) {
//     return {
//         $$exportVisible: group.get('exportVisible'),
//         $$exportRecords: group.get('exportRecords'),
//     };
// }

// function mapDispatchToProps(dispatch) {
//     return {
//         ExportRecordModalVisibleAC: opts => dispatch(ExportRecordModalVisible(opts)),
//         FetchExportRecordListAC: opts => dispatch(FetchExportRecordList(opts)),
//     };
// }


// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(CrmGroupExportRecordModal);
