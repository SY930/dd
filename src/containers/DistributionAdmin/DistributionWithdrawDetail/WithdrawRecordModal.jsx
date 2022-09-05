import React, { PureComponent as Component } from 'react';
import { Modal, Table, Button } from 'antd';
import styles from "./style.less";

class WithdrawRecordModal extends Component {
    state = {
        pageNo: 1,
        pageSize: 10,
        list: [],
        total: 0,
        loading: false,
    }

    componentDidMount(){
        this.getList();
    }

    /* 生成表格头数据 */
    generateColumns() {
        let { tc } = styles;
        return [
            { 
                title: '序号',
                dataIndex: 'no',
                className: tc,
                width: 50,
                render: (text,record,index) => `${index+1}`,
            },
            { 
                title: '流水号',
                dataIndex: 'serialNo',
                className: tc,
                width: 180,
            },
            { 
                title: '已提现金额 (元)',
                dataIndex: 'withdrawAmount',
                className: tc,
                width: 180,
            },
            { 
                title: '提现时间',
                dataIndex: 'withdrawStamp',
                className: tc,
            },
        ];
    }

    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.state;
        return list.map((x, i) => ({
            key: x.couponPackageID,
            type: '',
            ...x,
        }));
    }

    handlePageChange = (pageNo, pageSize) => {
        this.setState({
            pageNo, 
            pageSize
        }, () => {
            this.getList();
        });
    }

    getList = () => {
        let { pageNo, pageSize } = this.state;
        this.setState({
            list: [
                {
                    serialNo: 1,
                    withdrawAmount: 2,
                    withdrawStamp: 3
                }
            ],
            total: 10
        })
    }

    render() {
        const { loading, pageNo, pageSize, total } = this.state;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();

        return (
                <Modal
                    title={'提现记录'}
                    maskClosable={true}
                    visible={true}
                    footer={[
                        <Button key="0" type="ghost" size="large" onClick={this.props.closeModal}>
                            关闭
                        </Button>
                    ]}
                    onCancel={this.props.closeModal}
                    width="700px"
                >
                    <Table
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        style={{ maxWidth: 1300 }}
                        scroll={{ y: 'calc(100vh - 440px)' }}
                        pagination={{
                            showSizeChanger: true,
                            pageSize,
                            current: pageNo,
                            total,
                            showQuickJumper: true,
                            onChange: this.handlePageChange,
                            onShowSizeChange: this.handlePageChange,
                            showTotal: (totalSize, range) => `本页${range[0]}-${range[1]}/ 共 ${totalSize}条`,
                        }}
                    />
                </Modal>
        )
    }
}
export default WithdrawRecordModal;
