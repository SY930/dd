import React, { PureComponent as Component } from 'react';
import { Table } from 'antd';
import PagingFactory from 'components/PagingFactory';
import styles from "./style.less";
import WithdrawRecordModal from "./WithdrawRecordModal";

/** 列表页表格数据 */
class MainTable extends Component {
    /* 页面需要的各类状态属性 */
    state = {
        withdrawRecordModalVisible: false,
        withdrawRecordModalId: null,
    };
    /* 根据父组件传来的数据判断是否需要更新分页组件 */
    componentWillReceiveProps(np) {
        if (this.props.pageObj !== np.pageObj) {
            this.props.onSavePaging(np.pageObj);
        }
    }

    /* 分页改变执行 */
    onPageChange = (pageNo, pageSize) => {
        const { onSavePaging, onQuery } = this.props;
        const params = { pageSize, pageNo };
        onSavePaging(params);
        onQuery(params);
    }

    onWithdraw = (record) => {
        this.setState({
            withdrawRecordModalVisible: true,
            withdrawRecordModalId: record.no
        })
    }

    closeModal = () => {
        this.setState({
            withdrawRecordModalVisible: false,
        })
    }

    /* 生成表格头数据 */
    generateColumns() {
        let { tc } = styles;

        return [
            { 
                title: '序号',
                dataIndex: 'no',
                className: tc,
                width: 50
            },
            { 
                title: '操作',
                dataIndex: 'op',
                className: tc,
                width: 100,
                render: (text, record) => {
                    return (
                        <a href="#" onClick={this.onWithdraw.bind(this, record)}>提现记录</a>
                    );
                }
            },
            { 
                title: '分销人',
                dataIndex: 'distributor',
                className: tc,
                width: 180,
            },
            { 
                title: '分销总金额 (元)',
                dataIndex: 'distributionTotalMoney',
                className: tc,
                width: 100,
            },
            { 
                title: '待入账金额 (元)',
                dataIndex: 'rakeBackTotalMoney',
                className: tc,
                width: 100,
            },
            { 
                title: '待入账金额 (元)',
                dataIndex: 'withdrawnMoney',
                className: tc,
                width: 100,
            },
            { 
                title: '待入账金额 (元)',
                dataIndex: 'withdrawableMoney',
                className: tc,
                 width: 100,
            },
            { 
                title: '待入账金额 (元)',
                dataIndex: 'waitToBeRecordedMoney',
                className: tc,
                width: 100,
            },
        ];
    }
    /* 生成表格数据 */
    generateDataSource() {
        const { list } = this.props;
        return list.map((x, i) => ({
            key: x.couponPackageID,
            type: '',
            ...x,
        }));
    }
    render() {
        const { loading, page } = this.props;
        const { withdrawRecordModalVisible, withdrawRecordModalId } = this.state;
        const columns = this.generateColumns();
        const dataSource = this.generateDataSource();
        const pagination = { 
            ...page, 
            onChange: this.onPageChange,
            onShowSizeChange: this.onPageChange,  
        };
        return (
                <div>
                    <Table
                        bordered={true}
                        loading={loading}
                        columns={columns}
                        dataSource={dataSource}
                        style={{ maxWidth: 1300 }}
                        scroll={{ y: 'calc(100vh - 440px)' }}
                        pagination={pagination}
                    />
                    {
                        withdrawRecordModalVisible ? 
                        <WithdrawRecordModal 
                            withdrawRecordModalId={withdrawRecordModalId}
                            closeModal={this.closeModal}
                        />
                        : null
                    }
                </div>
        )
    }
}
export default PagingFactory(MainTable)
